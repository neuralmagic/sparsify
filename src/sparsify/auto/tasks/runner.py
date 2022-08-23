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
import tempfile
import warnings
from abc import abstractmethod
from collections import OrderedDict
from functools import wraps
from typing import Dict, List, Optional, Tuple

import torch
from torch.distributed.elastic.multiprocessing.errors import ChildFailedError


try:
    from torch.distributed.run import main as launch_ddp

    ddp_entrypoint = "run"
except ImportError:
    from torch.distributed.launch import launch as launch_ddp

    ddp_entrypoint = "launch"

from pydantic import BaseModel
from sparsify.auto.api import APIOutput, Metrics
from sparsify.auto.configs import SparsificationTrainingConfig
from sparsify.auto.utils import HardwareSpecs, TaskName, analyze_hardware


__all__ = ["MAX_RETRY_ATTEMPTS", "retry_stage", "TaskRunner"]

MAX_RETRY_ATTEMPTS = os.environ.get("NM_MAX_SCRIPT_RETRY_ATTEMPTS", 3)
MAX_MEMORY_STEPDOWNS = os.environ.get("NM_MAX_SCRIPT_MEMORY_STEPDOWNS", 10)
_TASK_RUNNER_IMPLS = {}


def retry_stage(max_attempts: int, stage: str):
    """
    Decorator function for catching and trying to continue failed sparseml runs

    :param max_attempts: maximum number of times to retry
    :param stage: name of stage to evalutate and potentially retry ('train', 'export')
    """
    # TODO: repackage logic into an error handler class
    def _decorator(func):
        wraps(func)

        def _wrapper(self, *args, **kwargs):
            if not isinstance(self, TaskRunner):
                raise RuntimeError(
                    f"retry_stage only supported for TaskRunner, found {type(self)}"
                )

            attempt_num = 0
            memory_stepdowns_attempted = 0
            errors = OrderedDict()  # 1-indexed mapping of attempt number to error
            while attempt_num < max_attempts:
                attempt_num += 1
                try:
                    out = func(self, *args, **kwargs)
                except Exception as e:
                    # if torch distributed exception thrown, attempt to reconstruct
                    # original exception
                    if isinstance(e, ChildFailedError):
                        # Grabbing exception only from first worker
                        _, first_error = e.get_first_failure()
                        message = first_error.message["message"].split(": ")
                        if message[0] in _CHILD_EXCEPTIONS_TO_CATCH:
                            e = _CHILD_EXCEPTIONS_TO_CATCH[message[0]](message[1])
                    errors[attempt_num] = e
                error = errors.get(attempt_num)

                # clear hanging memory
                torch.cuda.empty_cache()
                gc.collect()

                # If run is verified as completed and no error was thrown, run is
                # considered successful
                if not error and self.completion_check(stage):
                    return out

                # Handle out of memory errors as a special case
                if isinstance(error, RuntimeError) and (
                    "CUDA out of memory" in error.args[0]
                    or "Caught RuntimeError in replica" in error.args[0]
                ):
                    if memory_stepdowns_attempted < MAX_MEMORY_STEPDOWNS:
                        warnings.warn(
                            "Failed to fit model and data into memory. Cutting "
                            "batch size by half to reduce memory usage"
                        )
                        self.memory_stepdown()
                        memory_stepdowns_attempted += 1

                        # remove error and attempt from regular error history
                        del errors[attempt_num]
                        attempt_num -= 1

                    else:
                        raise RuntimeError(
                            "Failed to fit model and data into memory after "
                            f"stepping down memory {memory_stepdowns_attempted} "
                            "times"
                        )

                # Run did not succeed. Update args to attempt to resume run.
                self.update_args_post_failure(stage, errors.get(attempt_num))

            if not len(errors):
                warnings.warn(
                    "Could not verify proper run completion. Attempting to return best"
                    "model"
                )
                return out

            first_error = list(errors.values())[0]
            # If identical errors raised, print error just once. Otherwise, enumerate
            # errors in printout.
            if all(
                [
                    (
                        (type(error) == type(first_error))
                        and (error.args == first_error.args)
                    )
                    for error in errors.values()
                ]
            ):
                raise RuntimeError(
                    f"Run failed after {attempt_num} attempts with error: {first_error}"
                )

            else:
                error_list = "\n".join(
                    [
                        f"Attempt {attempt_num}: {error}"
                        for attempt_num, error in errors.items()
                    ]
                )
                raise RuntimeError(
                    f"Run failed after {attempt_num} with the following errors:\n"
                    f"{error_list}"
                )

        return _wrapper

    return _decorator


class TaskRunner:
    """
    Class for managing a single run of an integration. A run may involve
    training, one-shot, or zero-shot sparsification. Final models are exported to onnx
    at end of run for inference and deployment

    :param config: training config to base run on
    """

    def __init__(self, config: SparsificationTrainingConfig):
        self._config = config
        self.train_args, self.export_args = self.config_to_args(self.config)
        self.dashed_cli_kwargs = False  # True if CLI args require "-" as word separator

        self.hardware_specs = analyze_hardware()
        self.tune_args_for_hardware(self.hardware_specs)

    @staticmethod
    def create(config: SparsificationTrainingConfig) -> "TaskRunner":
        """
        Return an initialized instance of the integration runner

        :param config: training config defining the run
        """

        if config.task not in _TASK_RUNNER_IMPLS:
            raise ValueError(
                f"Unknown task {config.task}. Task runners must be declared with the "
                "TaskRunner.register decorator. Currently registered tasks: "
                f"{list(_TASK_RUNNER_IMPLS.keys())}"
            )

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

    @staticmethod
    def pydantic_args_to_cli(args, dashed_keywords=False) -> List[str]:
        """
        Handles logic for converting pydantic classes into valid argument strings.
        This should set arg standards for all integrations and should generally not
        be overridden. If the need to override comes up, consider updating this method
        instead.

        :return: string of the full CLI command
        """
        args_string_list = []
        for key, value in args.dict().items():
            key = "--" + key
            key = key.replace("_", "-") if dashed_keywords else key
            # Handles bool type args (e.g. --do-train)
            if isinstance(value, bool):
                if value:
                    args_string_list.append(key)
            elif isinstance(value, List):
                if len(value) < 2:
                    raise ValueError(
                        "List arguments must have more one entry. "
                        f"Received {key}:{value}"
                    )
                # Handles args that are both bool and value based (see evolve in yolov5)
                if isinstance(value[0], bool):
                    if value[0]:
                        args_string_list.extend([key, str(value[1])])
                # Handles args that have multiple values after the keyword.
                # e.g. --freeze-layers 0 10 15
                else:
                    args_string_list.append(key)
                    args_string_list.extend(map(str, value))
            # Handles the most straightforward case of keyword followed by value
            # e.g. --epochs 30
            else:
                if value is None:
                    continue
                args_string_list.extend([key, str(value)])
        return args_string_list

    @property
    def config(self):
        return self._config

    @abstractmethod
    @retry_stage(max_attempts=MAX_RETRY_ATTEMPTS, stage="train")
    def train(self):
        """
        Run training
        """
        ddp_args = [
            "--no_python",
            "--nproc_per_node",
            "auto",
            f"{self.sparseml_entrypoint}.train",
        ]
        ddp_args += self.pydantic_args_to_cli(self.train_args, self.dashed_cli_kwargs)

        launch_ddp(ddp_args)

    @abstractmethod
    @retry_stage(max_attempts=MAX_RETRY_ATTEMPTS, stage="export")
    def export(self):
        """
        Run export
        """
        self.export_hook(**self.export_args.dict())

    @staticmethod
    def task_list() -> List[TaskName]:
        """
        Return a list of registered tasks
        """
        return list(_TASK_RUNNER_IMPLS.keys())

    @staticmethod
    def task_aliases_dict() -> Dict[str, List[str]]:
        """
        Return a dictionary mapping the default task name (str) to a list of task
        aliases (str)
        """
        return {str(task): task.aliases for task in _TASK_RUNNER_IMPLS}

    @abstractmethod
    def run(self) -> APIOutput:
        """
        Run train and export
        """
        self._run_directory = tempfile.TemporaryDirectory()
        self.update_run_directory_args()
        self.train()
        self.export()
        return self.build_output()

    def update_run_directory_args(self):
        """
        Update run directories to save to the temporary run directory
        """
        raise NotImplementedError(
            "update_run_directory_args() missing implementation for task {self.task}"
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
            "Unrecognized stage value: {stage}. Supported values are train and export"
        )

    def tune_args_for_hardware(self, hardware_specs: HardwareSpecs):
        """
        Update run args based on detected hardware specifications
        """
        raise NotImplementedError(
            "tune_args_for_hardware() missing implementation for task {self.task}"
        )

    def memory_stepdown(self):
        """
        Update run args in the event of an out of memory error, to reduce memory usage
        """
        raise NotImplementedError(
            "memory_stepdown() missing implementation for task {self.task}"
        )

    def build_output(self) -> APIOutput:
        """
        Construct APIOutput object from completed run information
        """
        if not (self.completion_check("train") and self.completion_check("export")):
            warnings.warn(
                "Run did not complete successfully. Output generated may not reflect "
                "a valid run"
            )

        files = self._get_output_files()

        # Build output in generic manner
        output = APIOutput(
            config=self.config,
            metrics=self._get_metrics(),
            model_directory=self.config.save_directory,
            deployment_directory="",
        )

        # Move files to be saved to user output directory and delete run directory
        for file in files:
            target_directory = os.path.dirname(
                os.path.join(self.config.save_directory, file)
            )
            if not os.path.exists(target_directory):
                os.makedirs(target_directory)
            shutil.move(
                os.path.join(self._run_directory.name, file),
                os.path.join(self.config.save_directory, file),
            )

        # Clean up run directory
        self._run_directory.cleanup()

        return output

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
    def _get_output_files(self):
        """
        Return list of files to copy into user output directory
        """
        raise NotImplementedError(
            f"_get_output_files() missing implementation for task {self.task}"
        )
