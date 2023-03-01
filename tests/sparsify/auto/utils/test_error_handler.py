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
import importlib
import os
from contextlib import suppress
from itertools import cycle, islice
from typing import Any, List

import pytest


with suppress(ModuleNotFoundError):
    from sparsify.auto.utils import MEMORY_ERROR_SUBSTRINGS, ErrorHandler
_SPARSIFYML_INSTALLED: bool = importlib.util.find_spec("sparsifyml") is not None


try:
    from torch.distributed.run import main  # noqa F401

    import_ddp_error = None

except ImportError as ddp_error:
    import_ddp_error = ddp_error

DDP_ENABLED = not (import_ddp_error or os.environ.get("NM_AUTO_DISABLE_DDP"))


_EXPECTED_OUTCOMES = {
    "s0e": "success",
    "f1e": "same error failure",
    "s1e": "same error success",
    "fme": "multi error failure",
    "sme": "multi error success",
    "foom": "oom error failure",
    "soom": "oom error success",
}


def _modify_list_length(lists: List[List[Any]], length: int):
    return (list(islice(cycle(lst), length)) for lst in lists)


@pytest.mark.parametrize(
    "expected_outcome, errors, is_oom_error",
    [
        (_EXPECTED_OUTCOMES["s0e"], [], []),
        (
            _EXPECTED_OUTCOMES["f1e"],
            [RuntimeError("Error 1"), RuntimeError("Error 1"), RuntimeError("Error 1")],
            [False, False, False],
        ),
        (
            _EXPECTED_OUTCOMES["fme"],
            [RuntimeError("Error 1"), RuntimeError("Error 2"), RuntimeError("Error 3")],
            [False, False, False],
        ),
        (
            _EXPECTED_OUTCOMES["fme"],
            [
                RuntimeError("Error 1"),
                FileNotFoundError("Error 2"),
                ValueError("Error 3"),
            ],
            [False, False, False],
        ),
        (
            _EXPECTED_OUTCOMES["sme"],
            [RuntimeError("Error 1"), RuntimeError("Error 2")],
            [
                False,
                False,
            ],
        ),
        (
            _EXPECTED_OUTCOMES["foom"],
            [
                RuntimeError(f"filler {substring} text")
                for substring in MEMORY_ERROR_SUBSTRINGS
            ],
            [True] * len(MEMORY_ERROR_SUBSTRINGS),
        ),
        (
            _EXPECTED_OUTCOMES["soom"],
            [
                RuntimeError(f"filler {substring} text")
                for substring in MEMORY_ERROR_SUBSTRINGS
            ],
            [True] * len(MEMORY_ERROR_SUBSTRINGS),
        ),
    ],
)
@pytest.mark.skipif(
    not _SPARSIFYML_INSTALLED, reason="`sparsifyml` needed to run local tests"
)
def test_error_handler(expected_outcome, errors, is_oom_error):
    # Test the test
    assert len(errors) == len(is_oom_error)
    assert expected_outcome in _EXPECTED_OUTCOMES.values()

    error_handler = ErrorHandler(distributed_training=DDP_ENABLED)

    # Test expected field intialization
    assert error_handler.max_retry_attempts > 0
    assert error_handler.max_memory_stepsdowns > 0
    assert len(error_handler.caught_runtime_errors) == 0
    assert len(error_handler.caught_memory_errors) == 0
    assert not error_handler.is_memory_error()
    assert error_handler.distributed_training == (DDP_ENABLED)
    assert not error_handler.max_attempts_exceeded()

    # expected failure after too many attempts
    if expected_outcome in [_EXPECTED_OUTCOMES["f1e"], _EXPECTED_OUTCOMES["fme"]]:
        errors, is_oom_error = _modify_list_length(
            [errors, is_oom_error], error_handler.max_retry_attempts
        )

    # expected success despite (potentially) some errors
    elif expected_outcome in [_EXPECTED_OUTCOMES["s1e"], _EXPECTED_OUTCOMES["sme"]]:
        errors, is_oom_error = _modify_list_length(
            [errors, is_oom_error], error_handler.max_retry_attempts - 1
        )

    # expected failure after too many memory errors
    elif expected_outcome == _EXPECTED_OUTCOMES["foom"]:
        errors, is_oom_error = _modify_list_length(
            [errors, is_oom_error], error_handler.max_memory_stepsdowns
        )

    # expected success despite (potentially) some memory errors
    elif expected_outcome == _EXPECTED_OUTCOMES["soom"]:
        errors, is_oom_error = _modify_list_length(
            [errors, is_oom_error], error_handler.max_memory_stepsdowns - 1
        )

    # test error handling
    for error, is_oom in zip(errors, is_oom_error):
        assert not error_handler.max_attempts_exceeded()
        error_handler.save_error(error)
        assert error_handler.is_memory_error() == is_oom

    if expected_outcome in [
        _EXPECTED_OUTCOMES["f1e"],
        _EXPECTED_OUTCOMES["fme"],
        _EXPECTED_OUTCOMES["foom"],
    ]:
        assert error_handler.max_attempts_exceeded()
        if expected_outcome in [_EXPECTED_OUTCOMES["f1e"], _EXPECTED_OUTCOMES["fme"]]:
            with pytest.raises(RuntimeError, match="Run failed after"):
                error_handler.raise_exception_summary()
        else:
            with pytest.raises(
                RuntimeError, match="Failed to fit model and data into memory after"
            ):
                error_handler.raise_exception_summary()
