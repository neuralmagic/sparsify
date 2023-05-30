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
import glob
import importlib
import os
import shutil
import subprocess
import tempfile

import pytest

from fastai.vision.all import URLs, untar_data
from sparsify.utils import TASK_REGISTRY


_OUTPUT_DIRECTORY = "sparsify_training_temp_integration_test"
_SPARSIFYML_INSTALLED: bool = importlib.util.find_spec("sparsifyml") is not None
_EXTENSIVE_TESTING_ENABLED = os.environ.get(
    "SPARSIFY_EXTENSIVE_INTEGRATION_TEST", True  # TODO: remove
)


@pytest.mark.parametrize(
    "task, command, extensive",
    [
        (
            "question_answering",
            [
                "sparse-transfer",
                "--use-case",
                "question-answering",
                "--data",
                "squad",
                "--train-kwargs",
                "{'max_steps': 10, 'max_eval_samples': 10}",
            ],
            False,
        ),
        (
            "question_answering",
            [
                "training-aware",
                "--use-case",
                "question-answering",
                "--data",
                "squad",
                "--model",
                "bert-base-uncased",
                "--train-kwargs",
                "{'max_steps': 10, 'max_eval_samples': 10}",
            ],
            True,
        ),
        (
            "text_classification",
            [
                "sparse-transfer",
                "--use-case",
                "text-classification",
                "--data",
                "",
                "--train-kwargs",
                "{'max_steps': 10, 'max_eval_samples': 10, 'task_name': 'mnli' }",  # noqa: E501
            ],
            True,
        ),
        (
            "text_classification",
            [
                "training-aware",
                "--use-case",
                "text-classification",
                "--data",
                "",
                "--model",
                "bert-base-uncased",
                "--train-kwargs",
                "{'max_steps': 10, 'max_eval_samples': 10, 'task_name': 'mnli'}",
            ],
            True,
        ),
        (
            "token_classification",
            [
                "sparse-transfer",
                "--use-case",
                "token-classification",
                "--data",
                "conll2003",
                "--train-kwargs",
                "{'max_steps': 10, 'max_eval_samples': 10}",
            ],
            True,
        ),
        (
            "token_classification",
            [
                "training-aware",
                "--use-case",
                "token-classification",
                "--data",
                "conll2003",
                "--model",
                "bert-base-uncased",
                "--train-kwargs",
                "{'max_steps': 10, 'max_eval_samples': 10}",
            ],
            True,
        ),
        (
            "object_detection",
            [
                "sparse-transfer",
                "--use-case",
                "object-detection",
                "--data",
                "coco128.yaml",
                "--train-kwargs",
                "{'max_steps': 10}",
            ],
            True,
        ),
        (
            "object_detection",
            [
                "training-aware",
                "--use-case",
                "object-detection",
                "--data",
                "coco128.yaml",
                "--model",
                "yolov5s.pt",
                "--train-kwargs",
                "{'max_steps': 10}",
            ],
            False,
        ),
        (
            "image_classification",
            [
                "sparse-transfer",
                "--use-case",
                "image_classification",
                "--data",
                "imagenette",
                "--train-kwargs",
                "{'max_train_steps': 5,'max_eval_steps': 5}",
            ],
            False,
        ),
        (
            "image_classification",
            [
                "training-aware",
                "--use-case",
                "image_classification",
                "--model",
                "zoo:cv/classification/resnet_v1-50/pytorch/sparseml/imagenette/pruned-conservative",  # noqa: E501
                "--data",
                "imagenette",
                "--train-kwargs",
                "{'max_train_steps': 5,'max_eval_steps': 5}",
            ],
            True,
        ),
    ],
)
@pytest.mark.skipif(
    not _SPARSIFYML_INSTALLED, reason="`sparsifyml` needed to run local tests"
)
def test_output(task, command, extensive):
    if extensive and not _EXTENSIVE_TESTING_ENABLED:
        pytest.skip(
            "To enable all integration tests, set "
            "SPARSIFY_EXTENSIVE_INTEGRATION_TEST=true"
        )

    if TASK_REGISTRY[task] == "image_classification":
        data_path = untar_data(URLs.IMAGENETTE_160)
        data_idx = command.index("--data")
        command[data_idx + 1] = str(data_path)
    test_dir = tempfile.TemporaryDirectory(dir=".", prefix=_OUTPUT_DIRECTORY)
    command.extend(["--working-dir", test_dir.name])

    subprocess.check_call(["sparsify.run"] + command)
    _validate_experiment_directory(test_dir.name)

    if TASK_REGISTRY[task] == "image_classification":
        shutil.rmtree(data_path)
    test_dir.cleanup


def _validate_experiment_directory(directory):
    experiment_dir = os.listdir(directory)
    experiment_dir = [
        dir for dir in experiment_dir if os.path.isdir(os.path.join(directory, dir))
    ]
    assert len(experiment_dir) == 1
    experiment_dir = os.path.join(directory, experiment_dir[0])
    _validate_logs_directory(experiment_dir)
    _validate_training_artifacts_directory(experiment_dir)
    _validate_deployment_directory(experiment_dir)
    assert os.path.exists(os.path.join(experiment_dir, "metrics.yaml"))


def _validate_deployment_directory(directory):
    assert os.path.exists(os.path.join(directory, "deployment"))
    assert len(glob.glob(os.path.join(directory, "deployment", "*.onnx"))) > 0
    assert os.path.exists(os.path.join(directory, "deployment", "readme.txt"))


def _validate_logs_directory(directory):
    assert os.path.exists(os.path.join(directory, "logs"))
    assert len(os.listdir(os.path.join(directory, "logs"))) > 0


def _validate_training_artifacts_directory(directory):
    assert os.path.exists(os.path.join(directory, "training_artifacts"))
    assert len(os.listdir(os.path.join(directory, "training_artifacts"))) > 0
