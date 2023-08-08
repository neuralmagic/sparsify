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

import builtins
import os
from typing import List, Optional

import torch


# substrings of exception message that identify out of memory errors
MEMORY_ERROR_SUBSTRINGS = [
    "CUDA out of memory",
    "Caught RuntimeError in replica",
    "Unable to find a valid cuDNN algorithm to run convolution",
]


class ErrorHandler:
    """
    Class for managing raised exceptions when invoking sparseml runs. Utility includes
    processing raised errors into desired format and providing error history and info
    needed to make decisions on sparseml run re-attempts and sparsify run termination
    """

    def __init__(self, distributed_training=False):
        self._max_retry_attempts = os.environ.get("NM_MAX_SCRIPT_RETRY_ATTEMPTS", 3)
        self._max_memory_stepdowns = os.environ.get(
            "NM_MAX_SCRIPT_MEMORY_STEPDOWNS", 10
        )

        # dictionary of built in python exceptions for rebuilding exceptions
        # caught by torch ddp
        self._python_exceptions = {
            name: value
            for name, value in builtins.__dict__.items()
            if isinstance(value, type) and issubclass(value, BaseException)
        }

        self._caught_runtime_errors = []
        self._caught_memory_errors = []
        self._caught_memory_error_on_last_attempt = False

        self.distributed_training = distributed_training

    @property
    def caught_runtime_errors(self) -> List[Exception]:
        """
        List of errors caught during integration runs, excluding those caused by out
        of memory errors
        """
        return self._caught_runtime_errors

    @property
    def caught_memory_errors(self) -> List[Exception]:
        """
        List of out of memory errors caught
        """
        return self._caught_memory_errors

    @property
    def max_retry_attempts(self) -> int:
        """
        Maximum number of runs to attempt for an integration stage, excluding those that
        failed with an out of memory error. Once maximum is reached, exception is raised
        with error history
        """
        return self._max_retry_attempts

    @property
    def max_memory_stepsdowns(self) -> int:
        """
        Maximum number of memory stepdowns to attempt before raising memory exception
        """
        return self._max_memory_stepdowns

    def max_attempts_exceeded(self) -> bool:
        """
        Returns True if termination criteria reached
        """
        return (
            len(self._caught_runtime_errors) >= self._max_retry_attempts
            or len(self._caught_memory_errors) >= self._max_memory_stepdowns
        )

    def save_error(self, exception: Optional[Exception]):
        """
        Process and save exception, if one was raised

        :param exception: raised exception or None (if the run was successful)
        """
        if exception is None:
            self._caught_memory_error_on_last_attempt = False
            return

        # if torch distributed exception thrown, attempt to reconstruct
        # original exception
        if self.distributed_training and isinstance(
            exception,
            torch.distributed.elastic.multiprocessing.errors.ChildFailedError,
        ):
            # Grabbing exception only from first worker
            _, first_error = exception.get_first_failure()
            if isinstance(first_error.message, dict):
                message = first_error.message["message"].split(": ")
                if message[0] in self._python_exceptions:
                    exception = self._python_exceptions[message[0]](message[1])

        # Check if an out of memory error was thrown by comparing error message with
        # substrings that are known to represent out of memory errors
        if isinstance(exception, RuntimeError) and (
            any(
                [
                    memory_substring in exception.args[0]
                    for memory_substring in MEMORY_ERROR_SUBSTRINGS
                ]
            )
        ):
            self._caught_memory_errors.append(exception)
            self._caught_memory_error_on_last_attempt = True

        else:
            self._caught_runtime_errors.append(exception)
            self._caught_memory_error_on_last_attempt = False

    def is_memory_error(self) -> bool:
        """
        Returns true if the last run raised an out of memory error
        """
        return self._caught_memory_error_on_last_attempt

    def raise_exception_summary(self):
        """
        Raise an exception that summarizes the exception history for run attempts
        of this stage only
        """

        # Run failed due to non-memory related error
        if len(self._caught_runtime_errors) >= self._max_retry_attempts:
            first_error = self._caught_runtime_errors[0]
            # If identical errors raised, print error just once. Otherwise, enumerate
            # errors in printout.
            if all(
                [
                    (
                        (type(error) is type(first_error))
                        and (error.args == first_error.args)
                    )
                    for error in self._caught_runtime_errors
                ]
            ):
                raise RuntimeError(
                    f"Run failed after {len(self._caught_runtime_errors)} attempts "
                    f"with error: {first_error}"
                )

            else:
                error_list = "\n".join(
                    [
                        f"Attempt {attempt_num}: {error}"
                        for attempt_num, error in enumerate(self._caught_runtime_errors)
                    ]
                )
                raise RuntimeError(
                    f"Run failed after {len(self._caught_runtime_errors)} attempts "
                    f"with the following errors:\n{error_list}"
                )

        # Run failed due to memory error that couldn't be overcome
        elif len(self._caught_memory_errors) >= self._max_memory_stepdowns:
            raise RuntimeError(
                "Failed to fit model and data into memory after "
                f"stepping down memory {len(self._caught_memory_errors)} "
                "times"
            )
