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


import typing
from enum import Enum

import click
from pydantic import BaseModel


__all__ = [
    "get_click_options_from_base_models",
    "get_base_models_from_options",
]


def get_click_options_from_base_models(
    base_models: typing.Union[BaseModel, typing.List[BaseModel]]
):
    """
    A decorator that takes pydantic BaseModels and converts them into a click options

    :param base_models: a pydantic BaseModel or list of BaseModels to convert
        into click options
    :return: a decorated function that adds click options to the click command it
        is applied to
    """

    def wrapper(func):
        """
        :param func: the function to add the click options to, this function should
            also be a click command, (i.e decorated with @click.command or @click.group)
        """
        options = []
        _base_models = base_models if isinstance(base_models, list) else [base_models]
        for base_model in _base_models:
            for field in base_model.__fields__.values():
                args = ["--{}".format(field.name)]
                kwargs = {}

                kwargs["type"] = _get_type_from_outer_type(field.outer_type_)
                if field.allow_none:
                    kwargs["default"] = None

                if not field.required:
                    kwargs["default"] = field.get_default()
                else:
                    kwargs["required"] = field.required

                kwargs["help"] = field.field_info.description or ""
                options.append(click.option(*args, **kwargs))

        for option in options:
            func = option(func)
        return func

    return wrapper


def get_base_models_from_options(
    models: typing.Union[BaseModel, typing.List[BaseModel]],
    options: typing.Dict[str, typing.Any],
) -> typing.List[BaseModel]:
    if not isinstance(models, list):
        models = [models]

    model_objects = [model.parse_obj(options) for model in models]

    return model_objects


def _get_type_from_outer_type(outer_type):
    if isinstance(outer_type, Enum):
        return click.Choice([e.value for e in outer_type], case_sensitive=False)

    if typing.get_origin(outer_type) is typing.Union:
        raise ValueError("Union types are not supported")

    return outer_type
