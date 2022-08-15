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
❯ sparsify.package --help
Usage: sparsify.package [OPTIONS] [DIRECTORY]

  Utility to fetch a deployment directory for a task based on a optimizing-
  metric

Options:
  --task [ic|image-classification|image_classification|classification|od|object
  -detection|object_detection|detection|segmentation|qa|question-answering
  |question_answering|text-classification|text_classification|glue|sentiment
  |sentiment_analysis|sentiment-analysis|token-classification|token_classification
  |ner|named-entity-recognition|named_entity_recognition]
                                  The task to find model for NOTE: This
                                  argument is mutually exclusive with dataset
  --dataset TEXT                  The public dataset used to train this model
                                  NOTE: This argument is mutually exclusive
                                  with task
  --optimizing-metric [accuracy|f1|recall|mAP|latency|file_size|memory_usage]
                                  The criterion to search model for
  --scenario [VNNI]               The deployment scenarios to choose from
                                  [default: VNNI]
  --help                          Show this message and exit.
"""

from pathlib import Path
from typing import Any, Dict

import click
from sparsify import package
from sparsify.package_.utils import DEPLOYMENT_SCENARIOS, METRICS, TASKS
from sparsify.package_.utils.cli_helpers import NotRequiredIf, OptionEatAllArguments


def _create_dir_callback(ctx, param, value):
    Path(value).mkdir(exist_ok=True)
    return value


@click.command()
@click.argument(
    "directory",
    type=click.Path(dir_okay=True, file_okay=False),
    default="deployment_directory",
    callback=_create_dir_callback,
)
@click.option(
    "--task",
    type=click.Choice(TASKS, case_sensitive=False),
    cls=NotRequiredIf,
    not_required_if="dataset",
    help="The task to find model for",
)
@click.option(
    "--dataset",
    type=str,
    cls=NotRequiredIf,
    not_required_if="task",
    help="The public dataset used to train this model",
)
@click.option(
    "--optimizing-metric",
    type=tuple,
    default=("accuracy",),
    cls=OptionEatAllArguments,
    help=f"The criterion to search model for, one of {METRICS}",
    show_default=True,
    callback=lambda ctx, self, value: tuple(metric.lower() for metric in value),
)
@click.option(
    "--scenario",
    type=click.Choice(DEPLOYMENT_SCENARIOS, case_sensitive=False),
    default=DEPLOYMENT_SCENARIOS[0] if len(DEPLOYMENT_SCENARIOS) else "VNNI",
    help="The deployment scenarios to choose from",
    show_default=True,
)
def parse_args(**kwargs):
    """
    Utility to fetch a deployment directory for a task based on a
    optimizing-metric
    """
    if not (kwargs.get("task") or kwargs.get("dataset")):
        raise ValueError("At-least one of the `task` or `dataset`")
    return kwargs


def main():
    """
    Driver function
    """
    args: Dict[str, Any] = parse_args()
    package(**args)


if __name__ == "__main__":
    main()
