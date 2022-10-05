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
from typing import Optional

import pytest

from sparsify.utils.constants import TaskName, get_dataset_info, get_task_info


@pytest.mark.parametrize(
    "task_name",
    [
        "ic",
        "image_Classification",
        "classification",
        None,
        0,
    ],
)
def test_get_task_info(task_name: Optional[str]):
    task_info = get_task_info(task_name)
    if task_name:
        assert task_info
        assert isinstance(task_info, TaskName)
    else:
        assert task_info is None


@pytest.mark.parametrize("dataset_name", ["mnli", "MNLI", " mnLI ", None, 0])
def test_get_dataset_info(dataset_name: Optional[str]):
    dataset_info = get_dataset_info(dataset_name)
    if dataset_name:
        assert dataset_info
        assert isinstance(dataset_info, TaskName)
    else:
        assert dataset_info is None
