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
Usage: sparsify.package [OPTIONS]s/sparsify sparsify ❯ sparsify.package --help                                                                                                                                                                                                                                 18:37:37

  Utility to fetch a deployment directory for a task based on a criterion

Options:
  --task [question-answering|qa|text-classification|sentiment-analysis|yolo|yolact|
  image-classification]
                                  The task to find model for  [required]
  --criterion [compression|accuracy|throughput]
                                  The criterion to search model for  [default:
                                  compression]
  --scenario [VNNI]               The deployment scenarios to choose from
                                  [default: VNNI]
  --help                          Show this message and exit.

"""

import click
from sparsify.package_.constants import CRITERIONS, DEPLOYMENT_SCENARIOS, TASKS


@click.command(
    context_settings=dict(token_normalize_func=lambda x: x.replace("-", "_"))
)
@click.option(
    "--task",
    type=click.Choice(TASKS, case_sensitive=False),
    required=True,
    help="The task to find model for",
)
@click.option(
    "--criterion",
    type=click.Choice(CRITERIONS, case_sensitive=False),
    default=CRITERIONS[0] if len(CRITERIONS) else None,
    help="The criterion to search model for",
    show_default=True,
)
@click.option(
    "--scenario",
    type=click.Choice(DEPLOYMENT_SCENARIOS, case_sensitive=False),
    default=DEPLOYMENT_SCENARIOS[0] if len(DEPLOYMENT_SCENARIOS) else None,
    help="The deployment scenarios to choose from",
    show_default=True,
)
def main(task: str, criterion: str):
    """
    Utility to fetch a deployment directory for a task based on a criterion
    """
    print(f"task = {task}, criterion = {criterion}")


if __name__ == "__main__":
    main()
