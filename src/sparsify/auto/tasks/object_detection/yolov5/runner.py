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
from typing import Tuple

import onnx
import torch

import pandas
from pydantic import BaseModel
from sparseml.yolov5.scripts import export as export_hook
from sparseml.yolov5.scripts import train as train_hook
from sparsify.auto.tasks.object_detection.yolov5 import Yolov5ExportArgs
from sparsify.auto.tasks.runner import DDP_ENABLED, TaskRunner
from sparsify.auto.utils import HardwareSpecs, create_yolo_data_yaml
from sparsify.schemas import Metrics, SparsificationTrainingConfig
from sparsify.utils import TASK_REGISTRY
from yolov5.models.experimental import attempt_load
from yolov5.utils.neuralmagic import sparsezoo_download


if DDP_ENABLED:
    from sparsify.auto.tasks.object_detection.yolov5 import (
        Yolov5TrainArgsCLI as Yolov5TrainArgs,
    )
else:
    from sparsify.auto.tasks.object_detection.yolov5 import (
        Yolov5TrainArgsAPI as Yolov5TrainArgs,
    )


__all__ = [
    "Yolov5Runner",
]


_ACCURACY_KEYS = ["metrics/mAP_0.5", "metrics/mAP_0.5:0.95"]


@TaskRunner.register_task(task=TASK_REGISTRY["object_detection"])
class Yolov5Runner(TaskRunner):
    """
    Class for managing a single run of YOLOv5. A run may involve
    training, one-shot, or zero-shot sparsification. Final models are exported to onnx
    at end of run for inference and deployment.
    """

    train_hook = staticmethod(train_hook)
    export_hook = staticmethod(export_hook)
    sparseml_train_entrypoint = "sparseml.yolov5.train"
    export_model_kwarg = "weights"

    def __init__(self, config: SparsificationTrainingConfig):
        super().__init__(config)
        self.dashed_cli_kwargs = True
        self._model_save_name = os.path.join("exp", "weights", "last.pt")

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
        dataset = create_yolo_data_yaml(config.dataset)
        train_args = Yolov5TrainArgs(
            weights=config.base_model,
            recipe=config.recipe,
            recipe_args=config.recipe_args,
            data=dataset,
            **config.kwargs,
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
        relative_experiment_dir = (
            f"exp{experiment_number}" if experiment_number > 1 else "exp"
        )
        absolute_experiment_dir = os.path.join(
            train_args.project, relative_experiment_dir
        )

        # Default export args
        export_args = Yolov5ExportArgs(
            weights=os.path.join(
                absolute_experiment_dir,
                "weights",
                "last.pt",
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
        self.train_args.project = self.run_directory
        self.train_args.log_dir = self.log_directory
        self.export_args.weights = os.path.join(
            self.run_directory, self.export_args.weights
        )

    def memory_stepdown(self):
        """
        Update run args in the event of an out of memory error, to reduce memory usage
        """
        # Yolov5 nominal batch size is 64. For smaller batch sizes gradient accumulation
        # is automatically adjusted. For larger ones LR is automatically adjusted.
        self.train_args.batch_size //= 2

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
            ckpt = torch.load(
                (
                    attempt_load(model_file)
                    if not str(model_file).startswith("zoo:")
                    else sparsezoo_download(model_file)
                ),
                map_location="cpu",
            )  # load

        except Exception:
            return False

        # Test training ran to completion
        if not ckpt.epochs == -1:
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
        elif os.path.exists(self.train_args.project) and os.path.isdir(
            self.train_args.project
        ):
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
            os.path.join(self.log_directory, "results.csv"),
            skipinitialspace=True,
        )
        return Metrics(
            metrics={
                key.split("/")[1]: float(results[key].iloc[-1])
                for key in _ACCURACY_KEYS
            },
            objective_key=_ACCURACY_KEYS[0].split("/")[1],
            recovery=None,
        )

    def _get_default_deployment_directory(self, train_directory: str) -> str:
        """
        Return the path to where the deployment directory is created by export

        :param train_directory: train directory from which the export directory was
            created. Used for relative pathing
        """
        return os.path.join(train_directory, "exp", "DeepSparse_Deployment")
