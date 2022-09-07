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

from typing import List

from pydantic import BaseModel


__all__ = ["BaseArgs"]


class BaseArgs(BaseModel):
    """
    Base class for representing integration stage args (train or export)
    """

    def serialize_to_cli_string(self, dashed_keywords) -> List[str]:
        """
        Handles logic for converting pydantic classes into valid argument strings.
        This should set arg standards for all integrations and should generally not
        be overridden. If the need to override comes up, consider updating this method
        instead.

        :return: string of the full CLI command
        """
        args_string_list = []
        for key, value in self.dict().items():
            key = "--" + key
            key = key.replace("_", "-") if dashed_keywords else key
            # Handles bool type args (e.g. --do-train)
            if isinstance(value, bool):
                if value:
                    args_string_list.append(key)
            elif isinstance(value, List):
                if len(value) < 2:
                    raise ValueError(
                        "List arguments must have more one entry. "
                        f"Received {key}:{value}"
                    )
                # Handles args that are both bool and value based (see evolve in yolov5)
                if isinstance(value[0], bool):
                    if value[0]:
                        args_string_list.extend([key, str(value[1])])
                # Handles args that have multiple values after the keyword.
                # e.g. --freeze-layers 0 10 15
                else:
                    args_string_list.append(key)
                    args_string_list.extend(map(str, value))
            # Handles the most straightforward case of keyword followed by value
            # e.g. --epochs 30
            else:
                if value is None or value == "":
                    continue
                args_string_list.extend([key, str(value)])
        return args_string_list
