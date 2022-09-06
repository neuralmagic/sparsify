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


import json
import os
from pathlib import Path
from typing import List, Tuple

import onnx
import torch

from pydantic import BaseModel
from sparseml.pytorch.image_classification.export import main as export_hook
from sparseml.pytorch.image_classification.train import main as train_hook
from sparsify.auto.api import Metrics
from sparsify.auto.configs import SparsificationTrainingConfig
from sparsify.auto.tasks.image_classification.args import (
    ImageClassificationExportArgs,
    ImageClassificationTrainArgs,
)
from sparsify.auto.tasks.runner import MAX_RETRY_ATTEMPTS, TaskRunner, retry_stage
from sparsify.auto.utils import HardwareSpecs
from sparsify.utils import TASK_REGISTRY


__all__ = ["ImageClassificationRunner"]


@TaskRunner.register_task(task=TASK_REGISTRY["image_classification"])
class ImageClassificationRunner(TaskRunner):
    """
    Class for managing a single run of YOLOv5. A run may involve
    training, one-shot, or zero-shot sparsification. Final models are exported to onnx
    at end of run for inference and deployment.
    """

    def __init__(self, config: SparsificationTrainingConfig):
        super().__init__(config)
        self._model_save_name = (
            "model-one-shot" if self.train_args.one_shot else "model"
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
        # create train args
        if "dataset" not in config.kwargs:
            # custom datasets are set to imagefolder
            config.kwargs["dataset"] = "imagefolder"
        if "model_tag" not in config.kwargs:
            config.kwargs["model_tag"] = "sparsify_auto_image_classification"
        train_args = ImageClassificationTrainArgs(
            dataset_path=config.dataset,
            checkpoint_path=config.base_model,
            recipe_path=config.recipe,
            recipe_args=json.dumps(config.recipe_args),
            logs_dir=os.path.join(
                config.save_directory, config.kwargs["model_tag"], "tensorboard_logs"
            ),
            **config.kwargs,
        )

        model_save_path = os.path.join(
            train_args.save_dir,
            train_args.model_tag,
            "training",
            "model-one-shot.pth" if train_args.one_shot else "model.pth",
        )

        # create export args
        export_args = ImageClassificationExportArgs(
            checkpoint_path=model_save_path,
            dataset_path=config.dataset,
            dataset=config.kwargs["dataset"],
            arch_key=config.kwargs.get("arch_key", None),
            save_dir=train_args.save_dir,
            model_tag=config.kwargs["model_tag"],
        )

        return train_args, export_args

    def tune_args_for_hardware(self, hardware_specs: HardwareSpecs):
        """
        Update run args based on detected hardware specifications
        """
        # set device to all available (DP when needed for now) and FP16 if cuda enabled
        self.train_args.device = (
            f"cuda:{','.join([device.split(':')[1] for device in hardware_specs.device_names])}"  # noqa E501
            if hardware_specs.cuda_available
            else "cpu"
        )
        self.train_args.use_mixed_precision = hardware_specs.fp16_available

    def update_run_directory_args(self):
        """
        Update run directories to save to the temporary run directory
        """
        self.train_args.save_dir = os.path.join(
            self._run_directory.name, self.train_args.save_dir
        )
        self.export_args.checkpoint_path = os.path.join(
            self._run_directory.name, self.export_args.checkpoint_path
        )
        self.export_args.save_dir = self.train_args.save_dir

    @retry_stage(max_attempts=MAX_RETRY_ATTEMPTS, stage="train")
    def train(self):
        """
        Run YOLOv5 training
        """
        train_hook.callback(**self.train_args.dict())

    @retry_stage(max_attempts=MAX_RETRY_ATTEMPTS, stage="export")
    def export(self):
        """
        Run YOLOv5 export
        """
        export_hook.callback(**self.export_args.dict())

    def memory_stepdown(self):
        """
        Update run args in the event of an out of memory error, to reduce memory usage
        """
        self.train_args.train_batch_size //= 2
        self.train_args.init_lr //= 2
        if self.train_args.test_batch_size > self.train_args.train_batch_size:
            self.train_args.test_batch_size //= 2

    def _train_completion_check(self) -> bool:
        """
        Checks if train run completed successfully
        """
        model_file = self.export_args.checkpoint_path

        # Check mode file exists
        if not os.path.isfile(model_file):
            return False

        # Check model file is loadable
        try:
            state_dict = torch.load(model_file)
            assert "state_dict" in state_dict
            assert "recipe" in state_dict
            del state_dict
        except Exception:
            return False

        return True

    def _export_completion_check(self) -> bool:
        """
        Checks if export run completed successfully
        """
        onnx_file = os.path.join(
            self.export_args.save_dir, self.export_args.model_tag, "model.onnx"
        )

        # Check mode file exists
        if not os.path.isfile(onnx_file):
            print(f"ONNX FILE PATH: {onnx_file}")
            return False

        # Check onnx graph
        try:
            model = onnx.load(onnx_file)
            onnx.checker.check_model(model)
            print("FAILED ONNX CHECKER")
        except Exception:
            return False

        return True

    def _update_train_args_post_failure(self, error_type: Exception):
        """
        After a run throws an error or fails the the completion check, update args to
        reflect a resumed run. If specific error type is caught, update args to avoid
        error. e.g. for an Out of Memory error, the batch size may be reduced.
        """
        pass

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
        results_path = os.path.join(
            self.train_args.save_dir, self.train_args.model_tag, "model.txt"
        )
        with open(results_path) as f:
            results = f.read().split("\n")
        results = [tuple(result.strip().split(": ")[:2]) for result in results]
        results = {key: val for key, val in results if "acc" in key.lower()}

        return Metrics(
            accuracy=results,
            recovery=None,
        )

    def _get_output_files(self) -> List[str]:
        """
        Return list of files to copy into user output directory
        """
        return [
            os.path.relpath(file_path, self._run_directory.name)
            for file_path in [
                self.export_args.checkpoint_path,
                os.path.join(
                    Path(self.export_args.checkpoint_path).parents[1],
                    f"{self._model_save_name}.onnx",
                ),
            ]
        ]
