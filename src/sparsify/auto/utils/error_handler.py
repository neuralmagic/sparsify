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

import torch

from pydantic import BaseModel, Field


# substrings of exception message that identify out of memory errors
_MEMORY_ERROR_SUBSTRINGS = [
    "CUDA out of memory",
    "Caught RuntimeError in replica",
    "Unable to find a valid cuDNN algorithm to run convolution",
]


class AutoError(BaseModel):
    error: BaseException = Field(description="Caught exception")
    is_memory_error: bool = Field(
        description="True if exception corresponds to an out of memory issue",
        default=False,
    )

    class Config:
        arbitrary_types_allowed = True


class AutoErrorHandler:
    def __init__(self, distributed_training=False):
        self._max_retry_attempts = os.environ.get("NM_MAX_SCRIPT_RETRY_ATTEMPTS", 3)
        self._number_of_attempts = 0
        self._max_memory_stepdowns = os.environ.get(
            "NM_MAX_SCRIPT_MEMORY_STEPDOWNS", 10
        )
        self._number_of_memory_stepdowns = 0
        self._caught_errors = []
        self._python_exceptions = {
            name: value
            for name, value in builtins.__dict__.items()
            if isinstance(value, type) and issubclass(value, BaseException)
        }

        self.distributed_training = distributed_training

    @property
    def max_retry_attempts(self):
        return self._max_retry_attempts

    @property
    def number_of_attempts(self):
        return self._number_of_attempts

    @property
    def max_memory_stepsdowns(self):
        return self._max_memory_stepdowns

    @property
    def number_of_memory_stepdowns(self):
        return self._number_of_memory_stepdowns

    def max_attempts_exceeded(self):
        return (
            self._number_of_attempts >= self._max_retry_attempts
            or self.number_of_memory_stepdowns >= self._max_memory_stepdowns
        )

    def primary_errors_list(self):
        return [
            error.error for error in self._caught_errors if not error.is_memory_error
        ]

    def memory_errors_list(self):
        return [error.error for error in self._caught_errors if error.is_memory_error]

    def save_error(self, exception: Exception):
        # if torch distributed exception thrown, attempt to reconstruct
        # original exception
        if self.distributed_training and isinstance(
            exception, torch.distributed.elastic.multiprocessing.errors.ChildFailedError
        ):
            # Grabbing exception only from first worker
            _, first_error = exception.get_first_failure()
            if isinstance(first_error.message, dict):
                message = first_error.message["message"].split(": ")
                if message[0] in self._python_exceptions:
                    exception = self._python_exceptions[message[0]](message[1])

        self._caught_errors.append(AutoError(error=exception))

        if isinstance(exception, RuntimeError) and (
            any(
                [
                    memory_substring in exception.args[0]
                    for memory_substring in _MEMORY_ERROR_SUBSTRINGS
                ]
            )
        ):
            self._caught_errors[-1].is_memory_error = True
            self._number_of_memory_stepdowns += 1

        else:
            self._number_of_attempts += 1

        return exception

    def is_memory_error(self):
        return self._caught_errors[-1].is_memory_error

    def raise_exception_summary(self):
        if self._number_of_attempts >= self._max_retry_attempts:
            first_error = self._caught_errors[0].error
            # If identical errors raised, print error just once. Otherwise, enumerate
            # errors in printout.
            if all(
                [
                    (
                        (type(error) == type(first_error))
                        and (error.args == first_error.args)
                    )
                    for error in self.primary_errors_list()
                ]
            ):
                raise RuntimeError(
                    f"Run failed after {self._number_of_attempts} attempts with error: "
                    f"{first_error}"
                )

            else:
                error_list = "\n".join(
                    [
                        f"Attempt {attempt_num}: {error}"
                        for attempt_num, error in enumerate(self.primary_errors_list())
                    ]
                )
                raise RuntimeError(
                    f"Run failed after {self._number_of_attempts} ettempts with the "
                    f"following errors:\n{error_list}"
                )

        elif self._max_memory_stepdowns >= self._max_memory_stepdowns:
            raise RuntimeError(
                "Failed to fit model and data into memory after "
                f"stepping down memory {self._number_of_memory_stepdowns} "
                "times"
            )
