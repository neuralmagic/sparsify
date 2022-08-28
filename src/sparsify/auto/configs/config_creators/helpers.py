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

"""
Helper functions for APIConfigCreator implementations
"""


from typing import List, Optional


__all__ = [
    "maybe_add_stub_arg",
    "select_best_recipe_type",
]


def maybe_add_stub_arg(stub: str, arg_name: str, arg_val: Optional[str]) -> str:
    """
    :param stub: stub to potentially add variable to
    :param arg_name: stub variable key to potentially add
    :param arg_val: optional value for stub variable
    :return: the stub with the given variable added if present
    """
    if not arg_val:
        # arg val not set, return with no modifications
        return stub
    if "?" in stub:
        # query params already exist, append
        return f"{stub}&{arg_name}={arg_val}"
    return f"{stub}?{arg_name}={arg_val}"


def select_best_recipe_type(
    recipe_types: List[str], recipe_type_priorities: List[str]
) -> Optional[str]:
    """
    Selects an item from recipe_types that contains one of the given
    priorities in order of priority

    :param recipe_types: list of potential recipe types to select
    :return: first recipe type that contains the recipe type priority in order. If no
        match if found None will be returned
    """
    for target_recipe_type in recipe_type_priorities:
        for recipe_type in recipe_types:
            if target_recipe_type.lower() in recipe_type.lower():
                return recipe_type

    # fall back to default recipe
    return None
