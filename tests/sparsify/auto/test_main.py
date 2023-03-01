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
from pathlib import Path
from tempfile import TemporaryDirectory
from unittest.mock import MagicMock, patch

import pytest


with suppress(ModuleNotFoundError):
    from sparsify.auto import main
    from sparsify.auto.utils import SAVE_DIR
    from sparsify.schemas import APIArgs, Metrics, SparsificationTrainingConfig

_SPARSIFYML_INSTALLED: bool = importlib.util.find_spec("sparsifyml") is not None

"""
Tests for sparsify.auto main process logic, with emphasis on on file creation, saving,
and tracking flow
"""

# Run definition
_TEMPORARY_DIRECTORY = TemporaryDirectory()
_SAVE_DIRECTORY = _TEMPORARY_DIRECTORY.name
_NUM_TRIALS = 10
_MAXIMUM_SAVES = 3
_TEST_CONFIG = {
    "task": "object_detection",
    "dataset": "coco128.yaml",
    "base_model": "zoo:cv/detection/yolov5-s/pytorch/ultralytics/coco/pruned_quant-aggressive_94",  # noqa E501
    "recipe": "zoo:cv/detection/yolov5-s/pytorch/ultralytics/coco/pruned_quant-aggressive_94",  # noqa E501
    "save_directory": _SAVE_DIRECTORY,
    "num_trials": _NUM_TRIALS,
    "maximum_trial_saves": _MAXIMUM_SAVES,
}
_TEST_TEACHER_CONFIG = None
_ACCURACY_LIST = [0.1, 0.9, 0.3, 0.4, 0.5, 0.6, 0.5, 0.8, 0.4, 0.3]
_METRICS_LIST = [
    Metrics(metrics={"map0.5": acc}, objective_key="map0.5") for acc in _ACCURACY_LIST
]
_RUNNER_MOCK_PATH = "sparsify.auto.tasks.object_detection.yolov5.runner.Yolov5Runner"

# Testing helper function


def _train_side_effect_mock(self):
    # add a dummy file and sub_directory
    output_directory = self._get_model_artifact_directory()
    os.makedirs(output_directory)
    Path(os.path.join(output_directory, "output.txt")).touch()
    os.mkdir(os.path.join(output_directory, "artifact_subdirectory"))


def _export_side_effect_mock(self, model_directory):
    _test_trial_artifact_directory(model_directory)
    deployment_path = os.path.join(model_directory, "deployment")
    os.makedirs(deployment_path)  # create deployment dir
    # add dummy onnx file
    Path(os.path.join(deployment_path, "export_output.onnx")).touch()


@pytest.fixture(autouse=True)
def _cleanup_directory():
    yield
    _TEMPORARY_DIRECTORY.cleanup()
    assert not os.path.exists(_SAVE_DIRECTORY)


def _test_trial_artifact_directory(directory_path: str) -> bool:
    assert os.path.exists(directory_path), f"Directory not found: {directory_path}"
    assert os.listdir(directory_path), f"Directory empty:  {directory_path}"


# Test


@patch(
    "sparsify.auto.scripts.main.TaskRunner._train_distributed",
    side_effect=_train_side_effect_mock,
    autospec=True,
)
@patch(
    "sparsify.auto.scripts.main.TaskRunner._train_api",
    side_effect=_train_side_effect_mock,
    autospec=True,
)
@patch(
    "sparsify.auto.scripts.main.TaskRunner.export",
    side_effect=_export_side_effect_mock,
    autospec=True,
)
@patch(
    f"{_RUNNER_MOCK_PATH}._get_metrics",
    MagicMock(side_effect=_METRICS_LIST),
)
@patch(
    "sparsify.auto.scripts.main.APIArgs.from_cli",
    MagicMock(return_value=APIArgs(**_TEST_CONFIG)),
)
@patch(
    "sparsify.auto.scripts.main.request_student_teacher_configs",
    MagicMock(
        return_value=(
            SparsificationTrainingConfig(**_TEST_CONFIG),
            _TEST_TEACHER_CONFIG,
        )
    ),
)
@patch(
    "sparsify.auto.scripts.main.api_request_tune", MagicMock(return_value=_TEST_CONFIG)
)
@pytest.mark.skipif(
    not _SPARSIFYML_INSTALLED, reason="`sparsifyml` needed to run local tests"
)
def test_main(*args):
    main()

    top_n_trial_idx = sorted(
        range(len(_ACCURACY_LIST)), key=lambda i: _ACCURACY_LIST[i]
    )[-_MAXIMUM_SAVES:]

    assert os.path.exists(_SAVE_DIRECTORY)

    output_path = os.path.join(
        _SAVE_DIRECTORY, SAVE_DIR.format(task=_TEST_CONFIG["task"])
    )
    student_artifact_path = os.path.join(
        output_path, "training", "run_artifacts", "student"
    )
    assert sorted(os.listdir(output_path)) == ["deployment", "training"]
    trails_created = [
        file for file in os.listdir(student_artifact_path) if "trial_" in file
    ]
    assert len(trails_created) == _MAXIMUM_SAVES

    for idx in top_n_trial_idx:
        _test_trial_artifact_directory(
            os.path.join(student_artifact_path, f"trial_{idx}")
        )
