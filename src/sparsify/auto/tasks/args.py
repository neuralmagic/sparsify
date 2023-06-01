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

from typing import List, Optional

from pydantic import BaseModel


__all__ = ["BaseArgs"]


class BaseArgs(BaseModel):
    """
    Base class for representing integration stage args (train or export)
    """

    def serialize_to_cli_string(self, underscores_to_dashes) -> List[str]:
        """
        Handles logic for converting pydantic classes into valid argument strings.

        :return: string of the full CLI command
        """
        args_string_list = []
        for key, value in self.dict().items():
            key = key.replace("_", "-") if underscores_to_dashes else key
            # Handles bool type args (e.g. --do-train)
            if isinstance(value, bool):
                bool_str = self._serialize_bool(key, value)
                if bool_str is not None:
                    args_string_list.append(bool_str)
            elif isinstance(value, List):
                list_str = self._serialize_list(key, value)
                if list_str is not None:
                    args_string_list.extend(list_str)
            # Handles the most straightforward case of keyword followed by value
            # e.g. --epochs 30
            else:
                value_str = self._serialize_value(key, value)
                if value_str is not None:
                    args_string_list.extend(value_str)
        return args_string_list

    def _serialize_value(self, key: str, value: str) -> Optional[List[str]]:
        """
        Handles logic for converting most values to valid argument strings.

        :return: list of serialized strings or None
        """
        if value is None or value == "":
            return None
        return [f"--{key}", str(value)]

    def _serialize_bool(self, key: str, value: bool) -> Optional[str]:
        """
        Handles logic for converting bools to valid argument strings.

        :return: serialized string or None
        """
        if value:
            return "--" + key
        return None

    def _serialize_list(self, key: str, value: List) -> Optional[List[str]]:
        """
        Handles logic for converting lists to valid argument strings.

        :return: list of serialized strings
        """
        if len(value) < 2:
            raise ValueError(
                "List arguments must have more one entry. " f"Received {key}:{value}"
            )
        # Handles args that are both bool and value based (see evolve in yolov5)
        if isinstance(value[0], bool):
            if value[0]:
                return [f"--{key}", str(value[1])]
            return None
        # Handles args that have multiple values after the keyword.
        # e.g. --freeze-layers 0 10 15
        else:
            return [f"--{key}", map(str, value)]
