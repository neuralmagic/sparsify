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


import gc
import os
import shutil
import socket
import tempfile
import warnings
from abc import abstractmethod
from functools import wraps
from typing import Dict, List, Optional, Tuple

import torch
from torch.distributed.run import main as launch_ddp

from pydantic import BaseModel
from sparsify.auto.api import Metrics, SparsificationTrainingConfig
from sparsify.auto.utils import SAVE_DIR, ErrorHandler, HardwareSpecs, analyze_hardware
from sparsify.utils import TASK_REGISTRY, TaskName


__all__ = [
    "DDP_ENABLED",
    "MAX_RETRY_ATTEMPTS",
    "MAX_MEMORY_STEPDOWNS",
    "SUPPORTED_TASKS",
    "retry_stage",
    "TaskRunner",
]

DDP_ENABLED = not (os.environ.get("NM_AUTO_DISABLE_DDP", False))
MAX_RETRY_ATTEMPTS = os.environ.get("NM_MAX_SCRIPT_RETRY_ATTEMPTS", 3)  # default: 3
MAX_MEMORY_STEPDOWNS = os.environ.get("NM_MAX_SCRIPT_MEMORY_STEPDOWNS", 10)
SUPPORTED_TASKS = [
    TASK_REGISTRY[task]
    for task in [
        "image_classification",
        "object_detection",
        "question_answering",
        "text_classification",
        "token_classification",
    ]
]
_TASK_RUNNER_IMPLS = {}


def retry_stage(stage: str):
    """
    Decorator function for catching and trying to continue failed sparseml runs

    :param stage: name of stage to evaluate and potentially retry ('train', 'export')
    """

    def _decorator(func):
        wraps(func)

        def _wrapper(self, *args, **kwargs):

            if not isinstance(self, TaskRunner):
                raise RuntimeError(
                    f"retry_stage only supported for TaskRunner, found {type(self)}"
                )

            # initialize error handling
            error_handler = ErrorHandler(distributed_training=DDP_ENABLED)

            # attempt run and catch errors until success or maximum number of attempts
            # exceeded
            while not error_handler.max_attempts_exceeded():
                try:
                    out = func(self, *args, **kwargs)
                    exception = None
                except Exception as e:
                    exception = e

                error_handler.save_error(exception)

                # clear hanging memory
                torch.cuda.empty_cache()
                gc.collect()

                # if run is verified as completed and no error was thrown, run is
                # considered successful
                if not exception:
                    if not self.completion_check(stage):
                        warnings.warn(
                            "Could not verify proper run completion. Attempting to "
                            "return best model"
                        )
                    return out

                # in the case of out of memory error, reduce run memory usage prior
                # to new attempt
                if error_handler.is_memory_error():
                    warnings.warn(
                        "Failed to fit model and data into memory. Cutting "
                        "batch size by half to reduce memory usage"
                    )
                    self.memory_stepdown()

                # run did not succeed. Update args to attempt to resume run.
                self.update_args_post_failure(stage, exception)

            # run failed - raise exception summary for user
            error_handler.raise_exception_summary()

        return _wrapper

    return _decorator


class TaskRunner:
    """
    Class for managing a single run of an integration. A run may involve
    training, one-shot, or zero-shot sparsification. Final models are exported to onnx
    at end of run for inference and deployment

    :param config: training config to base run on
    """

    # name of the field for the export model path. e.g. "model_path" for transformers
    export_model_kwarg: Optional[str] = None

    def __init__(self, config: SparsificationTrainingConfig):
        self._config = config

        if self.export_model_kwarg is None:
            raise ValueError(
                "export_model_kwarg must be set for integration runner class for task "
                f"{self.task}"
            )

        # distributed training supported for torch>=1.9, as ddp error propagation was
        # introduced in 1.9
        self.use_distributed_training = DDP_ENABLED

        self.dashed_cli_kwargs = False  # True if CLI args require "-" as word separator

        self.train_args, self.export_args = self.config_to_args(self.config)

        self.save_directory = os.path.join(
            self.config.save_directory, SAVE_DIR.format(task=str(self.task))
        )

        self.hardware_specs = analyze_hardware()
        self.tune_args_for_hardware(self.hardware_specs)

    @staticmethod
    def create(config: SparsificationTrainingConfig) -> "TaskRunner":
        """
        Return an initialized instance of the integration runner

        :param config: training config defining the run
        """

        _dynamically_register_integration_runner(config.task)

        task_runner_constructor = _TASK_RUNNER_IMPLS[config.task]

        return task_runner_constructor(config)

    @classmethod
    def register_task(cls, task: TaskName):
        """
        Decorator class that registers a runner under a task name. Task names are unique
        and their aliases may not be duplicated either.
        """

        def _register_task_decorator(task_class: TaskRunner):
            if not issubclass(task_class, cls):
                raise RuntimeError(
                    f"Attempting to register task {task_class}. "
                    f"Registered tasks must inherit from {cls}"
                )
            if task in _TASK_RUNNER_IMPLS and (
                task_class is not _TASK_RUNNER_IMPLS[task]
            ):
                raise RuntimeError(
                    f"task {task} already registered by TaskRunner.register. "
                    f"attempting to register task: {task_class}, but"
                    f"task: {_TASK_RUNNER_IMPLS[task]}, already registered"
                )
            _TASK_RUNNER_IMPLS[task] = task_class

            # set task and task_aliases as class level property
            task_class.task = task

            return task_class

        return _register_task_decorator

    @classmethod
    @abstractmethod
    def config_to_args(
        cls, config: SparsificationTrainingConfig
    ) -> Tuple[BaseModel, BaseModel]:
        """
        Create sparseml integration args from SparsificationTrainingConfig. Returns
        a tuple of run args in the order (train_args, export_arts)

        :param config: training config to generate run for
        :return: tuple of training and export arguments
        """
        raise NotImplementedError(
            f"config_to_args() missing implementation for task {cls.task}"
        )

    @property
    def config(self):
        return self._config

    @retry_stage(stage="train")
    def _train_distributed(self):
        """
        Invoke sparseml training script via pytorch ddp API
        """
        ddp_args = [
            "--no_python",
            "--nproc_per_node",
            "auto",
            f"--master_port={_get_open_port_()}",
            self.sparseml_train_entrypoint,
        ]
        ddp_args += self.train_args.serialize_to_cli_string(self.dashed_cli_kwargs)

        launch_ddp(ddp_args)

    @retry_stage(stage="train")
    def _train_api(self):
        """
        Run training through sparseml hook
        """
        self.train_hook(**self.train_args.dict())

    def train(self) -> Metrics:
        """
        Training entrypoint
        """
        self._run_directory = tempfile.TemporaryDirectory()
        self.update_run_directory_args()

        if self.use_distributed_training:
            self._train_distributed()
        else:
            self._train_api()

        return self._get_metrics()

    @retry_stage(stage="export")
    def export(self, trial_idx: int):
        """
        Run export
        """
        updated_export_args = self.export_args.copy()
        setattr(
            updated_export_args,
            self.export_model_kwarg,
            os.path.join(
                self.save_directory,
                "run_artifacts",
                f"trial_{trial_idx}",
                self._model_save_name,
            ),
        )

        self.export_hook(**updated_export_args.dict())

    @staticmethod
    def supported_tasks() -> List[TaskName]:
        """
        Return a list of registered tasks
        """
        return SUPPORTED_TASKS

    @staticmethod
    def supported_task_aliases() -> Dict[str, List[str]]:
        """
        Return a dictionary mapping the default task name (str) to a list of task
        aliases (str)
        """
        return {str(task): task.aliases for task in SUPPORTED_TASKS}

    def update_run_directory_args(self):
        """
        Update run directories to save to the temporary run directory
        """
        raise NotImplementedError(
            f"update_run_directory_args() missing implementation for task {self.task}"
        )

    def completion_check(self, stage: str) -> bool:
        """
        Checks if stage run completed successfully

        :param stage: name of stage to check
        """
        if stage == "train":
            return self._train_completion_check()

        if stage == "export":
            return self._export_completion_check()

        raise ValueError(
            f"Unrecognized stage value: {stage}. Supported values are train and export"
        )

    def update_args_post_failure(
        self, stage: str, error_type: Optional[Exception] = None
    ):
        """
        After a run throws an error or fails the the completion check, update args to
        reflect a resumed run. If specific error type is caught, update args to avoid
        error. e.g. for an Out of Memory error, the batch size may be reduced

        :param stage: current stage name
        :param error_type: error class that was raised
        """
        if stage == "train":
            return self._update_train_args_post_failure(error_type)

        if stage == "export":
            return self._update_export_args_post_failure(error_type)

        raise ValueError(
            f"Unrecognized stage value: {stage}. Supported values are train and export"
        )

    def tune_args_for_hardware(self, hardware_specs: HardwareSpecs):
        """
        Update run args based on detected hardware specifications
        """
        raise NotImplementedError(
            f"tune_args_for_hardware() missing implementation for task {self.task}"
        )

    def memory_stepdown(self):
        """
        Update run args in the event of an out of memory error, to reduce memory usage
        """
        raise NotImplementedError(
            f"memory_stepdown() missing implementation for task {self.task}"
        )

    def move_output(self, trial_idx: int):
        """
        Move output into target directory
        """
        if not (self.completion_check("train") and self.completion_check("export")):
            warnings.warn(
                "Run did not complete successfully. Output generated may not reflect "
                "a valid run"
            )

        # Determine save subdirectory and create it
        target_directory = os.path.join(
            self.save_directory,
            "run_artifacts",
        )

        # move model files to save directory
        origin_directory = self._get_copy_origin_directory()  # directory to move
        moved_directory = os.path.join(
            target_directory, os.path.basename(os.path.normpath(origin_directory))
        )  # anticipated path to the moved directory, after moving

        # this should only arise as a result of dev error and not user error
        if os.path.exists(moved_directory):
            raise OSError(f"Directory {moved_directory} already exists")

        shutil.move(origin_directory, target_directory)

        # rename directory to one indicating the trial number
        new_directory_name = os.path.join(target_directory, f"trial_{trial_idx}")

        # this should only arise as a result of dev error and not user error
        if os.path.exists(new_directory_name):
            raise OSError(f"Directory {new_directory_name} already exists")

        os.rename(
            moved_directory,
            new_directory_name,
        )  # rename directory to one indicating the trial number

        # Clean up run directory
        self._run_directory.cleanup()

    def create_deployment_directory(self, trial_idx: int):
        """
        Creates and/or moves deployment directory to the deployment directory for the
        mode corresponding to the trial_idx

        :param trial_idx: index of the trial to create a deployment directory from
        """
        origin_directory = os.path.join(
            self.save_directory,
            "run_artifacts",
            f"trial_{trial_idx}",
            "deployment",
        )
        target_directory = self.save_directory

        shutil.move(origin_directory, target_directory)

        with open(os.path.join(target_directory, "deployment", "readme.txt"), "x") as f:
            f.write("deployment instructions will go here")

    @abstractmethod
    def _train_completion_check(self) -> bool:
        """
        Checks if train run completed successfully
        """
        raise NotImplementedError(
            f"_train_completion_check() missing implementation for task {self.task}"
        )

    @abstractmethod
    def _export_completion_check(self) -> bool:
        """
        Checks if export run completed successfully
        """
        raise NotImplementedError(
            f"_export_completion_check() missing implementation for task {self.task}"
        )

    @abstractmethod
    def _update_train_args_post_failure(self, error_type: Exception):
        """
        After a run throws an error or fails the the completion check, update args to
        reflect a resumed run. If specific error type is caught, update args to avoid
        error. e.g. for an Out of Memory error, the batch size may be reduced.
        """
        raise NotImplementedError(
            "_update_train_args_post_failure() missing implementation for task "
            f"{self.task}"
        )

    @abstractmethod
    def _update_export_args_post_failure(self, error_type: Exception):
        """
        After a run throws an error or fails the the completion check, update args to
        reflect a resumed run. If specific error type is caught, update args to avoid
        error.
        """
        raise NotImplementedError(
            "_update_export_args_post_failure() missing implementation for task "
            f"{self.task}"
        )

    @abstractmethod
    def _get_metrics(self) -> Metrics:
        """
        Retrieve metrics from training output
        """
        raise NotImplementedError(
            f"_get_metrics() missing implementation for task {self.task}"
        )

    @abstractmethod
    def _get_copy_origin_directory(self) -> str:
        """
        Return the absolute path to the directory to copy the model artifacts from
        """
        raise NotImplementedError(
            f"_get_copy_origin_directory missing implementation for task {self.task}"
        )


def _dynamically_register_integration_runner(task: str):
    """
    Dynamically import integration runner to trigger TaskRunner registration. This is
    done to prevent auto-install of integration libraries, triggered by sparseml imports
    """
    if TASK_REGISTRY[task].domain == "nlp":
        from sparsify.auto.tasks.transformers import (  # noqa F401
            QuestionAnsweringRunner,
        )
    elif (
        TASK_REGISTRY[task].domain == "cv"
        and TASK_REGISTRY[task].sub_domain == "detection"
    ):
        from sparsify.auto.tasks.object_detection.yolov5 import (  # noqa F401
            Yolov5Runner,
        )
    elif (
        TASK_REGISTRY[task].domain == "cv"
        and TASK_REGISTRY[task].sub_domain == "classification"
    ):
        from sparsify.auto.tasks.image_classification import (  # noqa F401
            ImageClassificationRunner,
        )

    else:
        raise ValueError(
            f"Task {task} is not yet supported. TaskRunner implementation "
            "missing. Currently registered tasks: "
            f"{[str(task) for task in SUPPORTED_TASKS]}"
        )


def _get_open_port_():
    """
    Find random open port. Used to circumvent issue with ddp trying to re-use
    the same port between run attempts.
    """
    sock = socket.socket()
    sock.bind(("", 0))
    port = sock.getsockname()[1]
    sock.close()
    return port
