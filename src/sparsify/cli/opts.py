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

import logging
import os
from functools import partial

import click
from sparsify.utils.constants import TASK_REGISTRY


__all__ = [
    "EXPERIMENT_TYPE",
    "PROJECT_ID",
    "EXPERIMENT_ID",
    "WORKING_DIR",
    "TEACHER",
    "DATA",
    "EVAL_METRIC",
    "TRAIN_SAMPLES",
    "VAL_SAMPLES",
    "DEPLOY_HARDWARE",
    "DEPLOY_ENGINE",
    "DEPLOY_SCENARIO",
    "RECIPE",
    "RECIPE_ARGS",
    "OPTIM_LEVEL",
    "add_data_opts",
    "add_deploy_opts",
    "add_info_opts",
    "add_model_opts",
    "add_optim_opts",
]

_LOGGER = logging.getLogger(__name__)

_EXPERIMENT_TYPES = ["sparse-transfer", "one-shot", "training-aware"]
_EVAL_METRICS = ["accuracy", "mAP", "recall", "f1"]  # TODO: add back kl
_DEPLOY_ENGINES = ["deepsparse", "onnxruntime"]


def validate_use_case(ctx, param, value, strict: bool = True):
    # click validator for --use-case

    # task_name: TaskName
    for task_name in TASK_REGISTRY.values():
        # TaskName __eq__ matches against aliases and str standardization
        if value == task_name:
            return value

    if strict:
        raise ValueError(
            f"Unknown use-case {value}, supported use cases: "
            f"{list(TASK_REGISTRY.keys())}"
        )
    else:
        _LOGGER.warning(
            f"Unknown use-case {value}, full feature set may not be availble for "
            "custom use cases"
        )
        return value


EXPERIMENT_TYPE = click.option(
    "--experiment-type",
    default=None,
    type=click.Choice(_EXPERIMENT_TYPES, case_sensitive=False),
    help="The type of the experiment to run",
)
PROJECT_ID = click.option(
    "--project-id",
    default=None,
    type=str,
    help="Id of the project this run belongs to.",
)
EXPERIMENT_ID = click.option(
    "--experiment-id",
    default=None,
    type=str,
    help="Id of the experiment this run belongs to.",
)
WORKING_DIR = click.option(
    "--working-dir",
    default=os.path.abspath(os.getcwd()),
    type=str,
    help="Path to save the deployment ready model to",
)

TEACHER = click.option("--teacher", default=None, type=str)

DATA = click.option(
    "--data",
    required=True,
    type=str,
    help=(
        "Path to dataset folder containing training data"
        " and optionally validation data"
    ),
)
EVAL_METRIC = click.option(
    "--eval-metric",
    default=_EVAL_METRICS[0],
    type=click.Choice(_EVAL_METRICS),
    help=(
        "Metric that the model is evaluated against on the task. "
        "None means it is based on --use-case."
    ),
)
TRAIN_SAMPLES = click.option(
    "--train-samples",
    default=None,
    type=int,
    help=(
        "Number of samples to use from the dataset for processing. "
        "None means the entire dataset."
    ),
)
VAL_SAMPLES = click.option(
    "--val-samples",
    default=None,
    type=int,
    help=(
        "Number of samples to use from the dataset for processing. "
        "None means the entire dataset."
    ),
)

DEPLOY_HARDWARE = click.option("--deploy-hardware", default=None, type=str)
DEPLOY_ENGINE = click.option(
    "--deploy-engine", default=_DEPLOY_ENGINES[0], type=click.Choice(_DEPLOY_ENGINES)
)
DEPLOY_SCENARIO = click.option("--deploy-scenario", default=None, type=str)

RECIPE = click.option(
    "--recipe", default=None, type=str, help="Recipe to override automatic recipe."
)
RECIPE_ARGS = click.option("--recipe-args", default=None, type=str)
OPTIM_LEVEL = click.option(
    "--optim-level",
    default=0.5,
    type=float,
    help=(
        "Preferred tradeoff between accuracy and performance. Float value in the range "
        "[0, 1]. Default 0.5"
    ),
)
TRAIN_KWARGS = click.option("--train-kwargs", default=None, type=str)


def add_info_opts(*, require_known_use_case=True):
    use_case = click.option(
        "--use-case",
        required=True,
        type=str,
        callback=partial(validate_use_case, strict=require_known_use_case),
        help="The task this model is for",
    )

    def wrapped(f):
        for fn in [WORKING_DIR, EXPERIMENT_ID, PROJECT_ID, use_case]:
            f = fn(f)
        return f

    return wrapped


def add_model_opts(*, require_model: bool, include_optimizer: bool = False):
    model = click.option(
        "--model", required=require_model, type=str, help="Path to model."
    )
    optimizer = click.option(
        "--optimizer", required=False, type=str, help="Path to optimizer."
    )

    def wrapped(f):
        if include_optimizer:
            f = optimizer(f)
        f = TEACHER(f)
        f = model(f)
        return f

    return wrapped


def add_data_opts(f):
    for fn in [VAL_SAMPLES, TRAIN_SAMPLES, EVAL_METRIC, DATA]:
        f = fn(f)
    return f


def add_deploy_opts(f):
    for fn in [DEPLOY_SCENARIO, DEPLOY_ENGINE, DEPLOY_HARDWARE]:
        f = fn(f)
    return f


def add_optim_opts(f):
    for fn in [
        RECIPE_ARGS,
        RECIPE,
        OPTIM_LEVEL,
    ]:
        f = fn(f)
    return f


def add_kwarg_opts(f):
    f = TRAIN_KWARGS(f)
    return f
