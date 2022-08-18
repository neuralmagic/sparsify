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

import click
from sparsify.package_.utils import METRICS, DEPLOYMENT_SCENARIOS, TASKS
from sparsify.package_.utils.cli_helpers import NotRequiredIf, OptionEatAllArguments


def _create_dir_callback(ctx, param, value):
    return Path(value).mkdir(exist_ok=True)


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
    not_required_if='dataset',
    help="The task to find model for",
)
@click.option(
    "--dataset",
    type=str,
    cls=NotRequiredIf,
    not_required_if='task',
    help="The public dataset used to train this model",
)
@click.option(
    "--optimizing-metric",
    type=click.Choice(METRICS, case_sensitive=False),
    default='accuracy',
    cls=OptionEatAllArguments,
    help="The criterion to search model for",
)
@click.option(
    "--scenario",
    type=click.Choice(DEPLOYMENT_SCENARIOS, case_sensitive=False),
    default=DEPLOYMENT_SCENARIOS[0] if len(DEPLOYMENT_SCENARIOS) else "VNNI",
    help="The deployment scenarios to choose from",
    show_default=True,
)
def main(
    *args, **kwargs
):
    """
    Utility to fetch a deployment directory for a task based on a
    optimizing-metric
    """
    print(kwargs)


if __name__ == "__main__":
    main()
