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

from typing import Union


class TaskName:
    """
    Immutable class for streamlined handling of task names and their aliases

    Behavior:
    - Current automatic explicit aliases include swapping of the `-` and `_` characters.
    - Current automatic implicit aliases include any case-changes to the task name.
        i.e. task name is case-insensitive.
    - When an additional alias is added to a task name, all of its automatic aliases
        are added as well.
    - Class display and hashing are done on the `.name` string using the default
        string behavior.
    - Class comparison checks that the target object (str or TaskName) is an alias of
        this TaskName. e.g. TaskName("yolov5") == "YOLOv5" -> True.
    """

    __slots__ = ("name", "aliases")

    def __init__(self, name: str):
        if not isinstance(name, str):
            raise ValueError("'name' must be a string")
        super(TaskName, self).__setattr__("name", name.lower().replace("-", "_"))
        super(TaskName, self).__setattr__("aliases", self._get_supported_aliases(name))

    def __setattr__(self, name, value):
        """
        Prevent modification of attributes
        """
        raise AttributeError("Task name cannot be modified")

    def __repr__(self):
        return self.name

    def __str__(self):
        return self.name

    def __eq__(self, other: Union[str, "TaskName"]):
        if isinstance(other, TaskName):
            return other.name == self.name
        elif isinstance(other, str):
            return other.lower() in self.aliases
        else:
            return False

    def __hash__(self):
        return hash(self.name)

    def add_alias(self, alias):
        self.aliases.append(*self._get_supported_aliases(alias))

    def _get_supported_aliases(self, task: str):
        task = task.lower().replace("-", "_")
        aliases = [task]
        if "_" in task:
            aliases.append(task.replace("_", "-"))
        return aliases
