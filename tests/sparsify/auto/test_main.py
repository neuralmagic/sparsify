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

import pytest


with suppress(ModuleNotFoundError):
    from sparsify.schemas import Metrics

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
