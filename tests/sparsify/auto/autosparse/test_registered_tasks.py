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
from sparsify.auto.configs import APIConfigCreator
from sparsify.auto.tasks import TaskRunner


def test_task_names_runner_and_config():
    # Test that the config creator and task runner have the same tasks registered
    config_tasks = APIConfigCreator.supported_tasks()
    runner_tasks = TaskRunner.supported_tasks()

    assert set(config_tasks) == set(runner_tasks)

    # Test that the config creator and task runner recognize the same task name aliases
    config_task_aliases = APIConfigCreator.supported_task_aliases()
    runner_task_aliases = TaskRunner.supported_task_aliases()

    for task, config_aliases in config_task_aliases.items():
        assert set(config_aliases) == set(runner_task_aliases[task])
