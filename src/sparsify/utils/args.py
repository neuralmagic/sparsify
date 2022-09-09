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

import argparse
import json
from typing import List, Optional, Union

from pydantic import BaseModel, Field, validator
from sparsify.utils import METRICS, TASK_REGISTRY


class BaseCLIArgs(BaseModel):
    """
    Base class for sotring sparsify user inputs
    """

    task: str = Field(
        title="task",
        description="task to train the sparsified model on",
    )
    optimizing_metric: List[str] = Field(
        title="optimizing-metric",
        default=["accuracy", "throughput"],
        description=(
            "Metric(s) on which to optimize model. Mutltiple comma separated value can "
            f"be provided. Supported metrics: {METRICS}"
        ),
    )

    @validator("task")
    def task_must_be_registered(cls, v):
        for task in TASK_REGISTRY.values():
            if v == task:
                return task.name
        nl = "\n"  # backslash not allowed in f string expression
        raise ValueError(
            f"Task '{v}' is not a recognize task. List of supported domains and and "
            "their accepted task name aliases:"
            f"{nl.join([task.pretty_print() for task in TASK_REGISTRY.values()])}"
        )

    @validator("optimizing_metric")
    def metric_must_be_supported(cls, v):
        for metric in v:
            if metric not in METRICS:
                raise ValueError(
                    f"optimizing metrics must be in supported list: {METRICS}\n"
                    f"Unsupported metric provided: {metric}"
                )
        return v

    @classmethod
    def from_cli(cls, args: Optional[List[str]] = None):
        """
        :param args: optional args list to override sys.argv with. Default None
        :return: APIArgs object populated from cli args
        """
        arg_parser = argparse.ArgumentParser()
        _add_schema_to_parser(arg_parser, cls)
        parsed_args = arg_parser.parse_args(args)
        _convert_special_arg_types(parsed_args, cls)
        return cls(**vars(parsed_args))


def _add_schema_to_parser(parser: argparse.ArgumentParser, model: BaseModel):
    # populate ArgumentParser args from pydantic model
    fields = model.__fields__
    for name, field in fields.items():
        argument_kwargs = {}

        is_dict = field.default_factory and isinstance(field.default_factory(), dict)
        is_union = getattr(field.type_, "__origin__", None) is Union
        is_list = getattr(field.type_, "__origin__", None) is List

        argument_kwargs["type"] = (
            str
            if is_dict or is_list
            else _str_number_union_parser
            if is_union
            else field.type_
        )

        if is_list:
            argument_kwargs["nargs"] = "+"

        if field.required:
            argument_kwargs["required"] = True
        else:
            argument_kwargs["default"] = (
                field.default if not is_dict else str(field.default_factory())
            )

        parser.add_argument(
            f"--{name}", dest=name, help=field.field_info.description, **argument_kwargs
        )


def _str_number_union_parser(value: str):
    # type conversion function for "Union" type support with argparse. Supports string
    # and numeric values only
    if value.isdigit():
        return int(value)
    try:
        return float(value)
    except ValueError:
        return value


def _convert_special_arg_types(args: argparse.Namespace, model: BaseModel):
    # convert argparse args that should be dicts or lists from str
    fields = model.__fields__
    for name, field in fields.items():
        if not hasattr(args, name):
            # field not found in args
            continue
        is_dict = field.default_factory and isinstance(field.default_factory(), dict)
        is_list = getattr(field.type_, "__origin__", None) is List
        if is_dict:
            field_val_str = getattr(args, name).replace("'", '"')  # use double quotes
            setattr(args, name, json.loads(field_val_str))
        if is_list:
            setattr(args, name, field_val_str.split(" "))
