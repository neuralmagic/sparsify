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

import pytest

from sparsify.auto import TaskName


@pytest.mark.parametrize(
    "task_string, aliases, not_aliases",
    [
        (
            "question_answering",
            ["Question-Answering", "QUESTION-ANSWERING"],
            ["question answering", "questionanswering"],
        ),
        (
            "object_detection",
            ["Object-Detection", "OBJECT-DETECTION"],
            ["object detection", "objectdetection"],
        ),
        ("yolov5", ["YOLOV5"], ["YOLO"]),
    ],
)
class TestTaskName:
    def test_task_create(self, task_string, aliases, not_aliases):
        task = TaskName(task_string)

        assert task == task_string

        for alias in aliases:
            assert alias == task

        for alias in not_aliases:
            assert alias != task

    def test_task_add_alias(self, task_string, aliases, not_aliases):
        task = TaskName(task_string)

        for alias in not_aliases:
            task.add_alias(alias)
            assert alias == task
            assert alias.upper() == task
            assert alias.lower() == task
            assert alias.replace("_", "-") == task
            assert alias.replace("-", "_") == task

        for alias in aliases:
            assert alias == task
