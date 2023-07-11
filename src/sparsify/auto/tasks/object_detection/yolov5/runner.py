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
import yaml

import pandas
from pydantic import BaseModel
from sparseml.yolov5.scripts import export as export_hook
from sparseml.yolov5.scripts import train as train_hook
from sparsify.auto.tasks.object_detection.yolov5 import Yolov5ExportArgs
from sparsify.auto.tasks.runner import DDP_ENABLED, TaskRunner
from sparsify.auto.utils import HardwareSpecs
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
        dataset = cls.parse_data_args(config.dataset)
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

        #return train_args, export_args

    @classmethod
    def parse_data_args(cls, dataset: str) -> str:
        """
        Check if the dataset provided is a data directory. If it is, buid a yolov5 yaml
        file based on the provided data directory path. An example of the directory
        structure for the provided directory path is shown below. There must
        subdirectories in the provided directory named `images`, `labels` and a text
        file called `classes.txt` which includes the list of the classes for the
        particular dataset, ordered by class id. For details on what images and labels
        should look like, please see the yolov5 repository:
        https://github.com/ultralytics/yolov5/tree/master.

        Example directory structure:
        - data_for_training/
            - labels/
                - train/
                - val/
                - test/
            - images/
                - train/
                - validation/
                - test/
            - classes.txt

        :params dataset: inputted data string arg. Assumed to either be a dataset which
        can be downloaded publicly or a locally available directory containing
        data files.

        :returns: path to yaml to download or the newly built yaml. If the data string
        arg is a yaml for a publicly available dataset, this function will return the
        same string. Otherwise, the path to the newly generated yaml will be returned.
        """
        data_file_args = {}
        IMAGE_DIR = "images"
        CLASS_LIST_PATH = "classes.txt"
        YAML_PATH = "data_local.yaml"

        def _check_and_update_file(file_type: str, path: str):
            if data_file_args.get(file_type, None):
                data_file_args[file_type].append(path)
            else:
                data_file_args[file_type] = [path]

        if os.path.isdir(dataset):
            image_path = os.path.join(dataset, IMAGE_DIR)
            class_list_path = os.path.join(dataset, CLASS_LIST_PATH)

            if not os.path.exists(image_path):
                raise ValueError(
                    f"The the provided directory path {dataset} "
                    "does not contain a folder called `images`. A subdirectory must "
                    "exist which contains the data folders."
                )

            if not os.path.exists(class_list_path):
                raise ValueError(
                    f"The the provided directory path {dataset} "
                    "does not contain a classes.txt file. A file must be "
                    "present which includes a list of the classes for the dataset."
                )

            data_file_args["path"] = dataset

            for d in os.listdir(image_path):
                current_path = os.path.join(IMAGE_DIR, d)
                if re.search(r"train", d):
                    _check_and_update_file("train", current_path)
                elif re.search(r"val", d):
                    _check_and_update_file("val", current_path)
                elif re.search(r"test", d):
                    _check_and_update_file("test", current_path)

            if not (
                data_file_args.get("train", None) and data_file_args.get("val", None)
            ):
                raise Exception(
                    "No training or validation folders found. Be sure the "
                    "directory provided to the data arg contains folders "
                    "with the train and val substrings in the filenames."
                )

        if data_file_args:
            # Store the newly generated yaml in the same directory as the data
            dataset = os.path.join(dataset, YAML_PATH)

            with open(class_list_path, "r") as f:
                class_list = f.readlines()

            classes = {}
            for class_id in range(len(class_list)):
                classes[class_id] = class_list[class_id].strip()

            with open(dataset, "w") as f:
                yaml.safe_dump(
                    {**data_file_args, **{"names": classes}},
                    f,
                    sort_keys=False
                )

        return dataset

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
