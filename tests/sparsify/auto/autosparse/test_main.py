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

import os
import shutil
from unittest.mock import MagicMock, patch

import pytest

from sparsify.auto import SAVE_DIR, APIArgs, Metrics, main


"""
Tests for sparsify.auto main process logic, with emphasis on on file creation, saving,
and tracking flow
"""

# Run definition

_SAVE_DIRECTORY = "./test_main"
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
_ACCURACY_LIST = [0.1, 0.9, 0.3, 0.4, 0.5, 0.6, 0.5, 0.8, 0.4, 0.3]
_METRICS_LIST = [
    Metrics(accuracy={"map0.5": acc}, tracked_accuracy_key="map0.5")
    for acc in _ACCURACY_LIST
]
_RUNNER_MOCK_PATH = "sparsify.auto.tasks.object_detection.yolov5.runner.Yolov5Runner"

_TRIAL_PATH = os.path.join(
    _SAVE_DIRECTORY,
    SAVE_DIR.format(task=_TEST_CONFIG["task"]),
    "run_artifacts",
    "trial_{trial_idx}",
)

# Testing helper function


def _train_side_effect_mock(self):
    train_artifact_path = self._get_copy_origin_directory()
    os.makedirs(train_artifact_path)  # create train output directory
    # add a dummy file and sub_directory
    with open(os.path.join(train_artifact_path, "train_output"), mode="a"):
        pass
    os.mkdir(os.path.join(train_artifact_path, "artifact_subdirectory"))


def _export_side_effect_mock(self, trial_idx):
    _test_trial_artifact_directory(trial_idx)
    deployment_path = os.path.join(
        _TRIAL_PATH.format(trial_idx=trial_idx), "deployment"
    )
    os.makedirs(deployment_path)  # create deployment dir
    # add dummy onnx file
    with open(os.path.join(deployment_path, "export_output.onnx"), mode="a"):
        pass


@pytest.fixture(autouse=True)
def _cleanup_directory():
    yield
    shutil.rmtree(_SAVE_DIRECTORY)


def _test_trial_artifact_directory(trial_idx: int) -> bool:
    directory_path = _TRIAL_PATH.format(trial_idx=trial_idx)
    assert os.path.exists(directory_path), f"Directory not found: {directory_path}"
    assert os.listdir(directory_path), f"Directory empty:  {directory_path}"


# Test


@patch(
    "sparsify.auto.api.main.TaskRunner._train_distributed",
    side_effect=_train_side_effect_mock,
    autospec=True,
)
@patch(
    "sparsify.auto.api.main.TaskRunner._train_api",
    side_effect=_train_side_effect_mock,
    autospec=True,
)
@patch(
    "sparsify.auto.api.main.TaskRunner.export",
    side_effect=_export_side_effect_mock,
    autospec=True,
)
@patch(
    f"{_RUNNER_MOCK_PATH}._get_metrics",
    MagicMock(side_effect=_METRICS_LIST),
)
@patch(
    "sparsify.auto.api.main.APIArgs.from_cli",
    MagicMock(return_value=APIArgs(**_TEST_CONFIG)),
)
@patch(
    "sparsify.auto.api.main.api_request_config", MagicMock(return_value=_TEST_CONFIG)
)
@patch("sparsify.auto.api.main.api_request_tune", MagicMock(return_value=_TEST_CONFIG))
def test_main(*args):
    main()

    top_n_trial_idx = sorted(
        range(len(_ACCURACY_LIST)), key=lambda i: _ACCURACY_LIST[i]
    )[-_MAXIMUM_SAVES:]

    assert os.path.exists(_SAVE_DIRECTORY)

    for idx in top_n_trial_idx:
        _test_trial_artifact_directory(idx)
