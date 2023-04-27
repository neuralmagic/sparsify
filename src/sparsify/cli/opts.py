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

import os

import click
from sparsify.utils import constants


__all__ = [
    "EXPERIMENT_TYPE",
    "USE_CASE",
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
    "OPTIM_FOR_HARDWARE",
    "MAX_LATENCY",
    "MIN_THROUGHPUT",
    "MAX_SIZE",
    "MAX_MEMORY",
    "add_data_opts",
    "add_deploy_opts",
    "add_info_opts",
    "add_model_opts",
    "add_optim_opts",
]

_EXPERIMENT_TYPES = ["sparse-transfer", "one-shot", "training-aware"]
_EVAL_METRICS = ["kl", "accuracy", "mAP", "recall", "f1"]
_OPTIM_LEVELS = ["balanced", "throughput", "latency", "size", "memory"]
_DEPLOY_ENGINES = ["deepsparse", "onnxruntime"]

EXPERIMENT_TYPE = click.option(
    "--experiment-type",
    default=None,
    type=click.Choice(_EXPERIMENT_TYPES, case_sensitive=False),
    help="The type of the experiment to run",
)
USE_CASE = click.option(
    "--use-case",
    type=click.Choice(sorted(constants.TASK_REGISTRY.keys())),
    help="The task this model is for",
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
    default=_OPTIM_LEVELS[0],
    type=click.Choice(_OPTIM_LEVELS),
    help="What to optimize the model for.",
)
OPTIM_FOR_HARDWARE = click.option("--optim-for-hardware", default=False, is_flag=True)

MAX_LATENCY = click.option("--max-latency", default=None, type=int)
MIN_THROUGHPUT = click.option("--min-throughput", default=None, type=int)
MAX_SIZE = click.option("--max-size", default=None, type=int)
MAX_MEMORY = click.option("--max-memory", default=None, type=int)


def add_info_opts(f):
    for fn in [WORKING_DIR, EXPERIMENT_ID, PROJECT_ID, USE_CASE]:
        f = fn(f)
    return f


def add_model_opts(*, require_model: bool, require_optimizer: bool):
    model = click.option(
        "--model", required=require_model, type=str, help="Path to model."
    )
    optimizer = click.option(
        "--optimizer", required=require_optimizer, type=str, help="Path to optimizer."
    )

    def wrapped(f):
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
        MAX_MEMORY,
        MAX_SIZE,
        MIN_THROUGHPUT,
        MAX_LATENCY,
        OPTIM_FOR_HARDWARE,
        OPTIM_LEVEL,
        RECIPE_ARGS,
        RECIPE,
    ]:
        f = fn(f)
    return f
