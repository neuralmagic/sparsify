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
Pydantic model classes defining the standards for user input, communication with
the Neural Magic API, and output to user
"""

import argparse
import json
import os
from typing import Any, Dict, List, Optional, Union

import yaml

from pydantic import BaseModel, Field, validator
from sparsify.utils import TASK_REGISTRY


__all__ = [
    "APIArgs",
    "SparsificationTrainingConfig",
    "Metrics",
    "DEFAULT_OUTPUT_DIRECTORY",
]

DEFAULT_OUTPUT_DIRECTORY = "./output"


class APIArgs(BaseModel):
    """
    Class containing the front-end arguments for Sparsify.Auto
    """

    task: str = Field(
        title="task",
        description="task to train the sparsified model on",
    )
    dataset: str = Field(
        title="dataset",
        description="path to dataset to train on",
    )
    save_directory: str = Field(
        title="save_directory",
        description="Absolute path to save directory",
        default=DEFAULT_OUTPUT_DIRECTORY,
    )
    performance: Union[str, float] = Field(
        title="performance",
        description=(
            "Preferred tradeoff between accuracy and performance. Can be a string or a "
            "float value in the range [0, 1]. Currently supported strings (and their "
            "respective float values are `accuracy` (0), `balanced` (0.5), and "
            "`performant` (1.0)"
        ),
        default="balanced",
    )
    base_model: Optional[str] = Field(
        title="base_model",
        default=None,
        description="path to base model to begin sparsification from",
    )
    recipe: Optional[str] = Field(
        title="recipe",
        default=None,
        description="file path to or zoo stub of sparsification recipe to be applied",
    )
    recipe_args: Optional[Dict[str, Any]] = Field(
        title="recipe_args",
        description="keyword args to override recipe variables with",
        default_factory=dict,
    )
    distill_teacher: Optional[str] = Field(
        title="distil_teacher",
        description="optional path to a distillation teacher model for training",
        default=None,
    )
    num_iterations: Optional[int] = Field(
        title="num_iterations",
        description=(
            "Number of tuning iterations to be run before returning best found "
            "model. max_train_time may limit the actual num_iterations ran"
        ),
        default=None,
    )
    max_train_time: float = Field(
        title="max_train_time",
        description=(
            "Maximum number of hours to train before returning best trained " "model."
        ),
        default=12.0,
    )
    maximum_model_saves: Optional[int] = Field(
        title="maximum_model_saves",
        description=(
            "Number of best models to save on the drive. If this value is set to n, "
            "then at most n+1 models will be saved at any given time on the machine. "
            "Default value of None allows for unlimited model saving"
        ),
        default=None,
    )
    kwargs: Optional[Dict[str, Any]] = Field(
        title="kwargs",
        description="optional task specific arguments to add to config",
        default_factory=dict,
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

    @classmethod
    def from_cli(cls, args: Optional[List[str]] = None):
        """
        :param args: optional args list to override sys.argv with. Default None
        :return: APIArgs object populated from cli args
        """
        arg_parser = argparse.ArgumentParser()
        _add_schema_to_parser(arg_parser, cls)
        parsed_args = arg_parser.parse_args(args)
        _convert_dict_args(parsed_args, cls)
        return cls(**vars(parsed_args))


class SparsificationTrainingConfig(BaseModel):
    """
    Configuration class for sparsification aware training using SparseML and its
    training integrations
    """

    task: str = Field(
        title="task",
        description="task to train the sparsified model on",
    )
    dataset: str = Field(
        title="dataset",
        description="path to the dataset to train the task on",
    )
    base_model: str = Field(
        title="base_model",
        description="path to the model to be sparsified",
    )
    save_directory: str = Field(
        title="save_directory",
        description="Absolute path to save directory",
    )
    distill_teacher: Optional[str] = Field(
        title="distil_teacher",
        description="optional path to a distillation teacher for training",
        default=None,
    )
    recipe: str = Field(
        title="recipe",
        description="file path to or zoo stub of sparsification recipe to be applied",
    )
    recipe_args: Dict[str, Any] = Field(
        title="recipe_args",
        description="keyword args to override recipe variables with",
        default_factory=dict,
    )
    kwargs: Dict[str, Any] = Field(
        title="kwargs",
        description="optional task specific arguments to add to config",
        default_factory=dict,
    )

    @classmethod
    def from_yaml(cls, config_yaml: str):
        """
        :param config_yaml: raw yaml string or file path to config yaml file to load
        :return: loaded sparsification training config
        """
        if os.path.exists(config_yaml):
            with open(config_yaml) as yaml_file:
                config_yaml = yaml_file.read()

        return cls.parse_obj(yaml.safe_load(config_yaml))

    def yaml(self, file_path: Optional[str] = None):
        """
        :param file_path: optional file path to write the generated yaml config to
        :return: this config represented as a yaml string
        """
        config_dict = self.dict()

        if file_path:
            with open(file_path, "w") as config_file:
                yaml.dump(config_dict, config_file)

        return yaml.dump(config_dict)


class Metrics(BaseModel):
    """
    Class containing metrics for a trained model. Contains all information needed to
    determine run quality by the config creator.
    """

    accuracy: Dict[str, float] = (
        Field(description="Model accuracy on validation set"),
    )
    recovery: Optional[float] = Field(
        description="model accuracy as a percentage of the dense model's accuracy",
        default=None,
    )
    train_time: Optional[float] = Field(
        description="Total train time, including hyperparameter tuning", default=None
    )

    @property
    def display_string(self) -> str:
        """
        :return: string representation of metrics values
        """
        string_body = "\n".join(
            [f"{metric}: {value}" for metric, value in self.accuracy.items()]
        )
        return f"Post-training metrics:\n{string_body}\n"

    def finalize(self):
        """
        :return: string detailed text of results, results are also written to
            results.txt in the `model_directory`
        """
        output_string = self.output_string
        with open(os.path.join(self.model_directory, "results.txt"), "w") as f:
            f.write(output_string)
        return output_string

    @property
    def output_string(self) -> str:
        """
        :return: detailed text summarizing run results
        """
        return (
            "-------------------- Sparsify.Auto Results --------------------\n"
            f"Finished training {self.config.task} model on your dataset.\n"
            "\n"
            f"{self.metrics.display_string}"
            "\n"
            "You can find your sparsified model and everything you need to deploy "
            f"in {self.model_directory}\n"
        )


def _add_schema_to_parser(parser: argparse.ArgumentParser, model: BaseModel):
    # populate ArgumentParser args from pydantic model
    fields = model.__fields__
    for name, field in fields.items():
        argument_kwargs = {}

        is_dict = field.default_factory and isinstance(field.default_factory(), dict)
        is_union = getattr(field.type_, "__origin__", None) is Union

        argument_kwargs["type"] = (
            str if is_dict else _str_number_union_parser if is_union else field.type_
        )
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


def _convert_dict_args(args: argparse.ArgumentParser, model: BaseModel):
    # convert argparse args that should be dicts from str
    fields = model.__fields__
    for name, field in fields.items():
        is_dict = field.default_factory and isinstance(field.default_factory(), dict)
        if not is_dict or not hasattr(args, name):
            # field is not a dict field or field not parsed
            continue
        field_val_str = getattr(args, name).replace("'", '"')  # use double quotes
        setattr(args, name, json.loads(field_val_str))
