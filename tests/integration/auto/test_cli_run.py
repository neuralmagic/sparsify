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
import shutil
import subprocess

import pytest

from fastai.vision.all import URLs, untar_data
from sparsify.utils import TASK_REGISTRY


_OUTPUT_DIRECTORY = "pytest_output"
_RUN_DIRECTORY = "pytest_run"
_SPARSIFYML_INSTALLED: bool = importlib.util.find_spec("sparsifyml") is not None
_MAX_STEPS = 1
_NUM_TRIALS = "1"


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
                "--num_trials",
                _NUM_TRIALS,
                "--kwargs",
                (str({"epochs": 1, "batch_size": 64, "project": _RUN_DIRECTORY})),
            ],
            ["last.pt", "last.onnx"],
        ),
        (
            "image_classification",
            [
                "--task",
                "image_classification",
                "--dataset",
                "~/data/imagenette-160",
                "--num_trials",
                _NUM_TRIALS,
                "--save_directory",
                f"{_OUTPUT_DIRECTORY}",
                "--kwargs",
                (
                    str(
                        {
                            "max_train_steps": _MAX_STEPS,
                            "max_eval_steps": _MAX_STEPS,
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
                "--num_trials",
                _NUM_TRIALS,
                "--kwargs",
                (
                    str(
                        {
                            "max_steps": _MAX_STEPS,
                            "max_eval_samples": _MAX_STEPS,
                            "max_predict_samples": _MAX_STEPS,
                            "output_dir": _RUN_DIRECTORY,
                        }
                    )
                ),
                "--teacher_kwargs",
                (
                    str(
                        {
                            "max_steps": _MAX_STEPS,
                            "max_eval_samples": _MAX_STEPS,
                            "max_predict_samples": _MAX_STEPS,
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
                "--num_trials",
                _NUM_TRIALS,
                "--kwargs",
                (
                    str(
                        {
                            "task_name": "mnli",
                            "max_steps": _MAX_STEPS,
                            "max_eval_samples": _MAX_STEPS,
                            "max_predict_samples": _MAX_STEPS,
                            "output_dir": _RUN_DIRECTORY,
                            "label_column_name": "label",
                        }
                    )
                ),
                "--teacher_kwargs",
                (
                    str(
                        {
                            "max_steps": _MAX_STEPS,
                            "max_eval_samples": _MAX_STEPS,
                            "max_predict_samples": _MAX_STEPS,
                            "output_dir": _RUN_DIRECTORY,
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
                "token_classification",
                "--dataset",
                "conll2003",
                "--save_directory",
                f"{_OUTPUT_DIRECTORY}",
                "--num_trials",
                _NUM_TRIALS,
                "--kwargs",
                (
                    str(
                        {
                            "max_steps": _MAX_STEPS,
                            "max_eval_samples": _MAX_STEPS,
                            "max_predict_samples": _MAX_STEPS,
                            "output_dir": _RUN_DIRECTORY,
                        }
                    )
                ),
                "--teacher_kwargs",
                (
                    str(
                        {
                            "max_steps": _MAX_STEPS,
                            "max_eval_samples": _MAX_STEPS,
                            "max_predict_samples": _MAX_STEPS,
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
        if TASK_REGISTRY[task] == "image_classification":
            data_path = untar_data(URLs.IMAGENETTE_160)
            command = command + ["--dataset", str(data_path)]

        subprocess.check_call(["sparsify.auto"] + command)

        yield task

        if TASK_REGISTRY[task] == "image_classification":
            shutil.rmtree(data_path)

        if os.path.exists(_OUTPUT_DIRECTORY):
            shutil.rmtree(_OUTPUT_DIRECTORY)
        if os.path.exists(_RUN_DIRECTORY):
            shutil.rmtree(_RUN_DIRECTORY)

    @pytest.mark.skipif(
        not _SPARSIFYML_INSTALLED, reason="`sparsifyml` needed to run local tests"
    )
    def test_output(self, setup, expected_files):
        print(f"{_SPARSIFYML_INSTALLED:}")
        assert not os.path.exists(_RUN_DIRECTORY)
        assert os.path.exists(_OUTPUT_DIRECTORY)
        assert _find_file_recursively(_OUTPUT_DIRECTORY, "results.txt")
        for file in expected_files:
            assert _find_file_recursively(_OUTPUT_DIRECTORY, file)
