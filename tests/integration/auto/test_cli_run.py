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
import subprocess

import pytest

from fastai.vision.all import URLs, untar_data
from sparsify.auto.utils import TaskName


_OUTPUT_DIRECTORY = "./pytest_output"
_RUN_DIRECTORY = "./pytest_run"


def _find_file_recursively(directory: str, file_name_or_extension: str) -> bool:
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith(file_name_or_extension):
                return True
    return False


@pytest.mark.parametrize(
    "task, command, expected_files",
    [
        (
            "object_detection",
            [
                "--task",
                "object_detection",
                "--dataset",
                "coco128.yaml",
                "--save_directory",
                f"{_OUTPUT_DIRECTORY}",
                "--kwargs",
                (str({"epochs": 1, "batch_size": 128, "project": _RUN_DIRECTORY})),
            ],
            ["last.pt", "last.onnx"],
        ),
        (
            "image_classification",
            [
                "--task",
                "image_classification",
                "--save_directory",
                f"{_OUTPUT_DIRECTORY}",
                "--kwargs",
                (
                    str(
                        {
                            "max_train_steps": 2,
                            "train_batch_size": 128,
                            "save_dir": _RUN_DIRECTORY,
                        }
                    )
                ),
            ],
            ["model.pth", "model.onnx"],
        ),
        (
            "question_answering",
            [
                "--task",
                "question_answering",
                "--dataset",
                "squad",
                "--save_directory",
                f"{_OUTPUT_DIRECTORY}",
                "--kwargs",
                (
                    str(
                        {
                            "max_steps": 20,
                            "per_device_train_batch_size": 128,
                            "output_dir": _RUN_DIRECTORY,
                        }
                    )
                ),
            ],
            ["pytorch_model.bin", "model.onnx"],
        ),
        (
            "text_classification",
            [
                "--task",
                "text_classification",
                "--dataset",
                "glue",
                "--save_directory",
                f"{_OUTPUT_DIRECTORY}",
                "--kwargs",
                (
                    str(
                        {
                            "task_name": "mnli",
                            "max_steps": 20,
                            "per_device_train_batch_size": 128,
                            "output_dir": _RUN_DIRECTORY,
                            "label_column_name": "label",
                        }
                    )
                ),
            ],
            ["pytorch_model.bin", "model.onnx"],
        ),
        (
            "token_classification",
            [
                "--task",
                "question_answering",
                "--dataset",
                "conll2003",
                "--save_directory",
                f"{_OUTPUT_DIRECTORY}",
                "--kwargs",
                (
                    str(
                        {
                            "max_steps": 20,
                            "per_device_train_batch_size": 128,
                            "output_dir": _RUN_DIRECTORY,
                        }
                    )
                ),
            ],
            ["pytorch_model.bin", "model.onnx"],
        ),
    ],
)
class TestAbridgedCLIRun:
    @pytest.fixture()
    def setup(self, task, command):
        if TaskName(task) == "image_classification":
            data_path = untar_data(URLs.IMAGENETTE_160)
            command = command + ["--dataset", str(data_path)]

        subprocess.check_call(["sparsify.auto"] + command)

        yield task

        if TaskName(task) == "image_classification":
            shutil.rmtree(data_path)

        if os.path.exists(_OUTPUT_DIRECTORY):
            shutil.rmtree(_OUTPUT_DIRECTORY)
        if os.path.exists(_RUN_DIRECTORY):
            shutil.rmtree(_RUN_DIRECTORY)

    def test_output(self, setup, expected_files):
        assert not os.path.exists(_RUN_DIRECTORY)
        assert os.path.exists(_OUTPUT_DIRECTORY)
        assert _find_file_recursively(_OUTPUT_DIRECTORY, "results.txt")
        for file in expected_files:
            assert _find_file_recursively(_OUTPUT_DIRECTORY, file)
