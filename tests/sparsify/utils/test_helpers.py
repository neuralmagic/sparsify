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

from pathlib import Path
from typing import Dict

import pytest

from sparsify.utils.helpers import (
    download_deployment_directory_from_stub,
    infer_dataset_domain_subdomain,
)


_CV_STUBS = [
    "zoo:cv/classification/resnet_v1-50/pytorch/sparseml/imagenet"
    "/pruned95_quant-none",
]

_NLP_STUBS = [
    "zoo:nlp/question_answering/bert-base/pytorch/huggingface/squad"
    "/pruned95_obs_quant-none"
]

_BASE_FILES = {"model.onnx"}
_ALL_FILES = _BASE_FILES.union(("config.json", "tokenizer.json"))

_STUBS_AND_EXPECTED_FILES = [(_stub, _BASE_FILES) for _stub in _CV_STUBS]
_STUBS_AND_EXPECTED_FILES.extend((_stub, _ALL_FILES) for _stub in _NLP_STUBS)


def _get_file_dict(
    folder_path: str,
    recursive: bool = True,
) -> Dict[str, str]:
    """
    Returns a mapping of filename --> absolute file path, for
    all files within a given folder; note searches for files
    recursively by default

    :param folder_path: Path to a directory
    :param recursive: if Truthy then folder_path is searched recursively
    """
    folder_path = Path(folder_path)
    file_dict = {}
    for file in folder_path.iterdir():
        if file.is_file():
            file_dict[file.name] = file.absolute()
        elif recursive:
            file_dict.update(_get_file_dict(file, recursive=recursive))
    return file_dict


@pytest.mark.parametrize("stub, expected_files", _STUBS_AND_EXPECTED_FILES)
def test_model_deployment_directory_exists(stub, expected_files):
    model_dir = download_deployment_directory_from_stub(stub)

    assert isinstance(model_dir, str)
    assert Path(model_dir).is_dir()

    downloaded_files = _get_file_dict(folder_path=model_dir)

    for filename in expected_files:
        assert filename in downloaded_files


@pytest.mark.parametrize(
    "dataset, task, expected",
    [
        (None, "ic", (None, "cv", "classification")),
        ("imagenette", "ic", ("imagenette", "cv", "classification")),
        ("blah", "ic", (None, "cv", "classification")),
        ("imagenet", "blah", ("imagenet", "cv", "classification")),
        ("coco", "segmentation", ("coco", "cv", "segmentation")),
        ("coco", "object_detection", ("coco", "cv", "detection")),
    ],
)
def test_infer_dataset_domain_subdomain(dataset, task, expected):
    assert infer_dataset_domain_subdomain(dataset=dataset, task=task) == expected


@pytest.mark.parametrize(
    "dataset, task",
    [
        ("mnli", "classification"),
        ("coco", "text_classification"),
        ("blah", "blah"),
    ],
)
def test_infer_dataset_domain_subdomain_raises_value_error(dataset, task):
    with pytest.raises(ValueError):
        infer_dataset_domain_subdomain(dataset=dataset, task=task)
