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

import click
from sparsify import package
from sparsify.utils import (
    DATASETS, DEFAULT_DEPLOYMENT_SCENARIO, DEFAULT_OPTIMIZING_METRIC,
    DEPLOYMENT_SCENARIOS,
    METRICS, TASKS_WITH_ALIASES,
)
from sparsify.version import __version__

_LOGGER = logging.getLogger(__name__)


@click.command(context_settings=dict(show_default=True))
@click.version_option(version=__version__)
@click.argument(
    "directory",
    type=str,
    default="",  # defaulting to `None` throws a missing argument Error
)
@click.option(
    "--task",
    type=click.Choice(TASKS_WITH_ALIASES, case_sensitive=False),
    help="The task to find model for, must be specified if `--dataset` not provided",
)
@click.option(
    "--dataset",
    type=click.Choice(DATASETS, case_sensitive=False),
    help="The public dataset used to train this model, must be specified if "
         "`--task` not provided",
)
@click.option(
    "--optimizing-metric",
    "--optimizing_metric",
    default=(DEFAULT_OPTIMIZING_METRIC,),
    type=click.Choice(METRICS, case_sensitive=False),
    help="The criterion to search model for, multiple metrics can be specified "
         "like the following  `--optimizing_metric [METRIC-1] "
         "--optimizing_metric [METRIC-2]` where METRIC-1, METRIC-2 can be any "
         "supported optimizing metric",
    multiple=True,
    callback=lambda ctx, self, value: tuple(metric.lower() for metric in value),
)
@click.option(
    "--target",
    type=click.Choice(DEPLOYMENT_SCENARIOS, case_sensitive=False),
    default=DEFAULT_DEPLOYMENT_SCENARIO,
    help="Deployment target scenario (ie 'VNNI' for VNNI capable CPUs)",
    show_default=True,
)
def main(**kwargs):
    """
    Utility to fetch a deployment directory for a task based on specified
    optimizing-metric

    Example for using sparsify.package:

         1) `sparsify.package --task image_classification -m accuracy`

         2) `sparsify.package --task ic \
            --optimizing_metric accuracy \
            --optimizing_metric compression \
            --target VNNI`
    """
    if not (kwargs.get("task") or kwargs.get("dataset")):
        raise ValueError("At-least one of the `task` or `dataset`")
    _LOGGER.debug(f"{kwargs}")
    results = package(**kwargs)
    print(f"Relevant Stubs: {results}")


if __name__ == "__main__":
    main()
