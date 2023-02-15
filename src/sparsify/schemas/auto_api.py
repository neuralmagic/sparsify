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
from functools import total_ordering
from typing import Any, Dict, List, Optional, Union

import yaml

from pydantic import BaseModel, Field, validator
from sparsify.schemas import SampledHyperparameter
from sparsify.utils import DEFAULT_OPTIMIZING_METRIC, METRICS, TASK_REGISTRY


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
    distill_teacher: str = Field(
        title="distil_teacher",
        description="teacher to use for distillation. Can be a path to a model file or "
        "zoo stub, 'off' for no distillation, and default value of 'auto' to auto-tune "
        "base model as teacher",
        default="auto",
    )
    num_trials: Optional[int] = Field(
        title="num_trials",
        description=(
            "Number of tuning trials to be run before returning best found "
            "model. Set to None to not impose a trial limit. max_train_time may limit "
            "the actual num_trials ran"
        ),
        default=None,
    )
    max_train_time: float = Field(
        title="max_train_time",
        description=(
            "Maximum number of hours to train before returning best trained model."
        ),
        default=12.0,
    )
    maximum_trial_saves: Optional[int] = Field(
        title="maximum_trial_saves",
        description=(
            "Number of best trials to save on the drive. Items saved for a trial "
            "include the trained model and associated artifacts. If this value is set "
            "to n, then at most n+1 models will be saved at any given time on the "
            "machine. Default value of None allows for unlimited model saving"
        ),
        default=None,
    )
    no_stopping: bool = Field(
        title="no_stopping",
        description=(
            "Set to True to turn off tuning stopping condition, which may end tuning "
            "early if no improvement was made"
        ),
        default=False,
    )
    resume: Optional[str] = Field(
        title="resume",
        description=(
            "To continue a tuning run, provide path to the high level directory of run "
            "you wish to resume"
        ),
        default=None,
    )
    optimizing_metric: List[str] = Field(
        title="optimizing_metric",
        description=(
            "The criterion to search model for, multiple metrics can be specified, "
            "e.g. --optimizing_metric f1 --optimizing_metric latency. Supported  "
            f"metrics are {METRICS}"
        ),
        default=None,
    )
    kwargs: Optional[Dict[str, Any]] = Field(
        title="kwargs",
        description="optional task specific arguments to add to config",
        default_factory=dict,
    )
    teacher_kwargs: Optional[Dict[str, Any]] = Field(
        title="teacher_kwargs",
        description="optional task specific arguments to add to teacher config",
        default_factory=dict,
    )
    tuning_parameters: Optional[str] = Field(
        title="tuning_parameters",
        description="path to config file containing custom parameter tuning settings. "
        "See example tuning config output for expected format",
        default=None,
    )
    teacher_tuning_parameters: Optional[str] = Field(
        title="teacher_tuning_parameters",
        description="path to config file containing custom teacher parameter tuning "
        "settings. See example tuning config output for expected format",
        default=None,
    )
    teacher_only: bool = Field(
        title="teacher_only",
        description=("set to True to only auto tune the teacher"),
        default=False,
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

    @validator("tuning_parameters")
    def read_tuning_parameters_from_file(cls, tuning_parameters: str) -> str:
        """
        Read in the tuning parameters as a string for passing to NM API
        """
        if tuning_parameters and not tuning_parameters.startswith("-"):
            with open(tuning_parameters, "r") as file:
                return file.read()
        else:
            return tuning_parameters

    @validator("teacher_tuning_parameters")
    def read_teacher_tuning_parameters_from_file(cls, tuning_parameters: str) -> str:
        """
        Read in the tuning parameters as a string for passing to NM API
        """
        if tuning_parameters and not tuning_parameters.startswith("-"):
            with open(tuning_parameters, "r") as file:
                return file.read()
        else:
            return tuning_parameters

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
        description="task to train the sparsified model on",
    )
    dataset: str = Field(
        description="path to the dataset to train the task on",
    )
    base_model: str = Field(
        description="path to the model to be sparsified",
    )
    distill_teacher: str = Field(
        description="optional path to a distillation teacher for training",
        default="auto",
    )
    recipe: str = Field(
        description="file path to or zoo stub of sparsification recipe to be applied",
    )
    recipe_args: Dict[str, Any] = Field(
        description="keyword args to override recipe variables with",
        default_factory=dict,
    )
    kwargs: Dict[str, Any] = Field(
        description="optional task specific arguments to add to config",
        default_factory=dict,
    )
    tuning_parameters: List[SampledHyperparameter] = Field(
        title="tuning_parameters",
        description=(
            "List of tuning hyperparameters. Values are used to overwrite respective "
            "recipe fields"
        ),
        default=[],
    )
    optimizing_metric: List[str] = Field(
        title="optimizing_metric",
        description=(
            "The criterion to search model for, multiple metrics can be specified, "
            "e.g. --optimizing_metric f1 --optimizing_metric latency. Supported  "
            f"metrics are {METRICS}"
        ),
        default=[DEFAULT_OPTIMIZING_METRIC],
    )
    no_stopping: bool = Field(
        title="no_stopping",
        description=(
            "Set to True to turn off tuning stopping condition, which may end tuning "
            "early if no improvement was made"
        ),
        default=False,
    )

    @validator("optimizing_metric")
    def default_optimizing_metric(cls, optimizing_metric):
        return optimizing_metric or [DEFAULT_OPTIMIZING_METRIC]

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
                yaml.dump(data=config_dict, stream=config_file)

        return yaml.dump(config_dict)


@total_ordering
class Metrics(BaseModel):
    """
    Class containing metrics for a trained model. Contains all information needed to
    determine run quality by the config creator.
    """

    metrics: Dict[str, float] = Field(description="Model accuracy on validation set")
    objective_key: str = Field(
        description=(
            "keys of the accuracy dict, for the metrics used to track run quality"
        )
    )
    train_time: Optional[float] = Field(
        description="Total train time, including hyperparameter tuning", default=None
    )

    def _check_valid_operand(self, other):
        if not isinstance(other, Metrics):
            raise TypeError(
                "Comparison not supported between instances of 'Metrics' and "
                f"{type(other)}"
            )
        if self.objective_key != other.objective_key:
            raise ValueError(
                "Comparison not supported between instances of 'Metrics' with "
                f"differing 'objective_key' of '{self.objective_key}' "
                f"and '{other.objective_key}'"
            )

    def __eq__(self, other):
        self._check_valid_operand(other)
        return self.metrics[self.objective_key] == other.metrics[self.objective_key]

    def __lt__(self, other):
        self._check_valid_operand(other)
        return self.metrics[self.objective_key] < other.metrics[self.objective_key]

    @property
    def display_string(self) -> str:
        """
        :return: string representation of metrics values
        """
        string_body = "\n".join(
            [f"{metric}: {value}" for metric, value in self.metrics.items()]
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
        # Support for CLI args that can be repeated
        is_list = getattr(field.outer_type_, "_name", None) == "List"

        if is_dict or is_union:
            argument_kwargs["type"] = str if is_dict else _str_number_union_parser

        if field.required:
            argument_kwargs["required"] = True
        else:
            argument_kwargs["default"] = (
                field.default if not is_dict else str(field.default_factory())
            )

        if is_list:
            argument_kwargs["action"] = "append"
        elif field.type_ == bool:
            argument_kwargs["action"] = "store_false" if field.default else "store_true"

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
