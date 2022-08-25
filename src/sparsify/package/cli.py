#!/usr/bin/env python

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
Usage: sparsify.package [OPTIONS] [DIRECTORY]

  Utility to fetch a deployment directory for a task based on a optimizing-
  metric

  Example for using sparsify.package:

       `sparsify.package --task image_classification -m accuracy`

       `sparsify.package --t ic -m accuracy -m compression -s VNNI`

Options:
  --version                       Show the version and exit.
  -t, --task [ic|image-classification|image_classification|classification|od|
  object-detection|object_detection|detection|segmentation|qa|question-answering|
  question_answering|text-classification|text_classification|glue|sentiment|
  sentiment_analysis|sentiment-analysis|token-classification|token_classification|
  ner|named-entity-recognition|named_entity_recognition]
                                  The task to find model for, must be
                                  specified if `--dataset` not provided
  -d, --dataset [imagenette|imagenet|coco|squad|mnli|qqp|sst2|conll2003]
                                  The public dataset used to train this model,
                                  must be specified if `--task` not provided
  -m, --optimizing-metric, --optimizing_metric [accuracy|f1|recall|mAP|compression|
  latency|file_size|memory_usage]
                                  The criterion to search model for  [default:
                                  accuracy]
  -s, --scenario [VNNI|NO_VNNI]   The deployment scenarios to choose from
                                  [default: VNNI]
  --help                          Show this message and exit.
"""
import logging
from pathlib import Path
from typing import Any, Dict

import click
from sparsify import package
from sparsify.utils import DATASETS, DEPLOYMENT_SCENARIOS, METRICS, TASKS
from sparsify.version import __version__


_LOGGER = logging.getLogger(__name__)


def _create_dir_callback(ctx, param, value):
    Path(value).mkdir(exist_ok=True)
    return value


@click.command()
@click.version_option(version=__version__)
@click.argument(
    "directory",
    type=click.Path(dir_okay=True, file_okay=False),
    default="deployment_directory",
    callback=_create_dir_callback,
)
@click.option(
    "--task",
    "-t",
    type=click.Choice(TASKS, case_sensitive=False),
    help="The task to find model for, must be specified if `--dataset` " "not provided",
)
@click.option(
    "--dataset",
    "-d",
    type=click.Choice(DATASETS, case_sensitive=False),
    help="The public dataset used to train this model, must be specified if "
    "`--task` not provided",
)
@click.option(
    "--optimizing-metric",
    "--optimizing_metric",
    "-m",
    default=("accuracy",),
    type=click.Choice(METRICS, case_sensitive=False),
    help="The criterion to search model for",
    show_default=True,
    multiple=True,
    callback=lambda ctx, self, value: tuple(metric.lower() for metric in value),
)
@click.option(
    "--scenario",
    "-s",
    type=click.Choice(DEPLOYMENT_SCENARIOS, case_sensitive=False),
    default=DEPLOYMENT_SCENARIOS[0] if len(DEPLOYMENT_SCENARIOS) else "VNNI",
    help="The deployment scenarios to choose from",
    show_default=True,
)
def parse_args(**kwargs) -> Dict[str, Any]:
    """
    Utility to fetch a deployment directory for a task based on a
    optimizing-metric

    Example for using sparsify.package:

         `sparsify.package --task image_classification -m accuracy`

         `sparsify.package --t ic -m accuracy -m compression -s VNNI`
    """
    if not (kwargs.get("task") or kwargs.get("dataset")):
        raise ValueError("At-least one of the `task` or `dataset`")
    _LOGGER.debug(f"{kwargs}")
    return kwargs


def main():
    """
    Driver function
    """
    args: Dict[str, Any] = parse_args()
    package(**args)


if __name__ == "__main__":
    main()
