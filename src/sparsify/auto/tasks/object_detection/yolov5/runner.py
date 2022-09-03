# Copyright (c) 2021 - present / Neuralmagic, Inc. All Rights Reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#    http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing,
# software distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

import glob
import os
import re
import shutil
from pathlib import Path
from typing import List, Tuple

import onnx
import torch

import pandas
from pydantic import BaseModel
from sparseml.yolov5.scripts import export as export_hook
from sparseml.yolov5.scripts import train as train_hook
from sparsify.auto.api import Metrics
from sparsify.auto.configs import SparsificationTrainingConfig
from sparsify.auto.tasks.object_detection.yolov5 import (
    Yolov5ExportArgs,
    Yolov5TrainArgs,
)
from sparsify.auto.tasks.runner import MAX_RETRY_ATTEMPTS, TaskRunner, retry_stage
from sparsify.auto.utils import HardwareSpecs
from yolov5.export import load_checkpoint


__all__ = [
    "Yolov5Runner",
]


_ACCURACY_KEYS = ["metrics/mAP_0.5", "metrics/mAP_0.5:0.95"]


@TaskRunner.register_task(task="object_detection")
class Yolov5Runner(TaskRunner):
    """
    Class for managing a single run of YOLOv5. A run may involve
    training, one-shot, or zero-shot sparsification. Final models are exported to onnx
    at end of run for inference and deployment.
    """

    def __init__(self, config: SparsificationTrainingConfig):
        super().__init__(config)
        self._model_save_name = (
            "checkpoint-one-shot" if self.train_args.one_shot else "last"
        )

    @classmethod
    def config_to_args(
        cls, config: SparsificationTrainingConfig
    ) -> Tuple[BaseModel, BaseModel]:
        """
        Create sparseml integration args from SparsificationTrainingConfig. Returns
        a tuple of run args in the order (train_args, export_arts)

        :param config: training config to generate run for
        :return: tuple of training and export arguments
        """
        train_args = Yolov5TrainArgs(
            weights=config.base_model, data=config.dataset, **config.kwargs
        )

        # Determine the imminent train output directory
        # Look for previous runs
        existing_experiment_dirs = glob.glob(os.path.join(train_args.project, "exp*"))

        # If none found, this is the first run
        if not existing_experiment_dirs:
            experiment_number = 1

        # If found, determine number of current experiment
        else:
            last_experiment = re.search(r"\d+$", existing_experiment_dirs[-1])
            experiment_number = int(last_experiment.group()) if last_experiment else 2

        # construct path to imminent run directory and weights path
        experiment_dir = (
            os.path.join(train_args.project, f"exp{experiment_number}")
            if experiment_number > 1
            else os.path.join(train_args.project, "exp")
        )

        # Default export args
        export_args = Yolov5ExportArgs(
            weights=os.path.join(
                experiment_dir,
                "weights",
                "checkpoint-one-shot.pt" if train_args.one_shot else "last.pt",
            ),
            dynamic=True,
        )

        return train_args, export_args

    def tune_args_for_hardware(self, hardware_specs: HardwareSpecs):
        """
        Update run args based on detected hardware specifications
        """
        # CUDA detection and fp16 setting is done automatically in yolov5
        pass

    def update_run_directory_args(self):
        """
        Update run directories to save to the temporary run directory
        """
        self.train_args.project = os.path.join(
            self._run_directory.name, self.train_args.project
        )
        self.export_args.weights = os.path.join(
            self._run_directory.name, self.export_args.weights
        )

    @retry_stage(max_attempts=MAX_RETRY_ATTEMPTS, stage="train")
    def train(self):
        """
        Run YOLOv5 training
        """
        train_hook(**self.train_args.dict())

    @retry_stage(max_attempts=MAX_RETRY_ATTEMPTS, stage="export")
    def export(self):
        """
        Run YOLOv5 export
        """
        export_hook(**self.export_args.dict())

    def memory_stepdown(self):
        """
        Update run args in the event of an out of memory error, to reduce memory usage
        """
        self.train_args.batch_size //= 2
        self.train_args.gradient_accum_steps *= 2

    def _train_completion_check(self) -> bool:
        """
        Checks if train run completed successfully
        """
        model_file = self.export_args.weights

        # Check mode file exists
        if not os.path.isfile(model_file):
            return False

        # Check model file is loadable
        try:
            _, extras = load_checkpoint(
                type_="val", weights=model_file, device=torch.device("cpu")
            )
        except Exception:
            return False

        # Test training ran to completion
        if not extras["ckpt"]["epoch"] == -1:
            return False

        return True

    def _export_completion_check(self) -> bool:
        """
        Checks if export run completed successfully
        """
        onnx_file = self.export_args.weights.replace(".pt", ".onnx")

        # Check mode file exists
        if not os.path.isfile(onnx_file):
            return False

        # Check onnx graph
        model = onnx.load(onnx_file)
        try:
            onnx.checker.check_model(model)
        except Exception:
            return False

        return True

    def _update_train_args_post_failure(self, error_type: Exception):
        """
        After a run throws an error or fails the the completion check, update args to
        reflect a resumed run. If specific error type is caught, update args to avoid
        error. e.g. for an Out of Memory error, the batch size may be reduced.
        """
        model_file = self.export_args.weights

        # Check if at least one epoch was trained
        if os.path.isfile(model_file):
            self.train_args.resume = True
        # If not, clear directory
        else:
            shutil.rmtree(self.train_args.project)

    def _update_export_args_post_failure(self, error_type: Exception):
        """
        After a run throws an error or fails the the completion check, update args to
        reflect a resumed run. If specific error type is caught, update args to avoid
        error.
        """
        pass

    def _get_metrics(self) -> Metrics:
        """
        Retrieve metrics from training output.
        """
        results = pandas.read_csv(
            os.path.join(Path(self.export_args.weights).parents[1], "results.csv"),
            skipinitialspace=True,
        )
        return Metrics(
            accuracy={
                key.split("/")[1]: results[key].iloc[-1] for key in _ACCURACY_KEYS
            },
            recovery=None,
        )

    def _get_output_files(self) -> List[str]:
        """
        Return list of files to copy into user output directory
        """
        return [
            os.path.relpath(
                f"{self.export_args.weights[:-3]}.{extension}", self._run_directory.name
            )
            for extension in ["onnx", "pt"]
        ]
