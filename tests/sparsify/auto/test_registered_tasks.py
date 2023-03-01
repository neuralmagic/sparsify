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
import ast
from contextlib import suppress

import pytest
import requests
from requests.exceptions import ConnectionError


with suppress(ModuleNotFoundError):
    from sparsify.auto.tasks import TaskRunner
    from sparsify.utils import TASK_REGISTRY, get_base_url


def _is_service_online():
    try:
        response = requests.get(get_base_url())
        if not response.ok:
            return False
        return True
    except ConnectionError:
        return False


@pytest.mark.skipif(not _is_service_online(), reason="NM API service not online")
def test_task_names_runner_and_config():
    # Test that the config creator and task runner have the same tasks registered
    response = requests.get(
        f"{get_base_url()}/v1/sparsify/auto/training-config/supported-tasks",
    )
    assert response.status_code

    assert [char in response.text for char in ["[]"]]
    config_tasks = [TASK_REGISTRY[task] for task in ast.literal_eval(response.text)]

    runner_tasks = TaskRunner.supported_tasks()
    assert set(config_tasks) == set(runner_tasks)

    # Test that the config creator and task runner recognize the same task name aliases
    config_task_aliases = {task.name: task.aliases for task in config_tasks}
    runner_task_aliases = TaskRunner.supported_task_aliases()

    for task, config_aliases in config_task_aliases.items():
        assert set(config_aliases) == set(runner_task_aliases[task])
