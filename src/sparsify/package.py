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
Usage: sparsify.package [OPTIONS]

Options:
  --version                       Show the version and exit.  [default: False]
  --task [image_classification|object_detection|segmentation|question_answering|
  text_classification|sentiment_analysis|token_classification]
                                  The task to package depoyment directory for
                                  [required]
  --deployment-dir DIRECTORY      The directory containing the deployment
                                  files to package  [required]
  --help                          Show this message and exit.  [default:
                                  False]
"""
import logging
from pathlib import Path

import click
from sparsezoo.analyze.cli import CONTEXT_SETTINGS
from sparsezoo.utils import TASKS_WITH_ALIASES
from sparsify.utils import set_log_level
from sparsify.version import version_major_minor


__all__ = ["package_instructions"]
_LOGGER = logging.getLogger(__name__)


@click.command(context_settings=CONTEXT_SETTINGS)
@click.version_option(version=version_major_minor)
@click.option(
    "--task",
    type=click.Choice(TASKS_WITH_ALIASES, case_sensitive=False),
    help="The task to package depoyment directory for",
    required=True,
)
@click.option(
    "--experiment",
    type=click.Path(exists=True, file_okay=False, dir_okay=True, readable=True),
    help="The directory containing the deployment files to package, "
    "or sparsify experiment-id (Not yet supported)",
    required=True,
)
@click.option(
    "--log-level",
    type=click.Choice(
        ["debug", "info", "warn", "critical", "error"], case_sensitive=False
    ),
    help="Sets the logging level",
    default="info",
    required=True,
)
@click.option(
    "--deploy-type",
    type=click.Choice(["server"], case_sensitive=False),
    help="Sets the deployment type, only supports `server`",
    default="server",
    required=True,
)
@click.option(
    "--preprocessing",
    type=str,
    help="Sets the pre-processing function to use",
)
@click.option(
    "--postprocessing",
    type=str,
    help="Sets the post-processing function to use",
)
@click.option("--debug/--no-debug", default=False, hidden=True)
def main(
    experiment: str,
    task: str,
    log_level: str,
    deploy_type: str,
    preprocessing: str,
    postprocessing: str,
    debug: bool = False,
):
    set_log_level(logger=_LOGGER, level=log_level)
    if deploy_type != "server":
        raise NotImplementedError(f"Deployment type {deploy_type} is not yet supported")
    if preprocessing is not None:
        raise NotImplementedError(
            f"Pre-processing function {preprocessing} is not yet supported"
        )
    if postprocessing is not None:
        raise NotImplementedError(
            f"Post-processing function {postprocessing} is not yet supported"
        )
    print(
        package_instructions(experiment=experiment, task=task, log_level=log_level)
    )
    _LOGGER.debug(f"locals: {locals()}")


def package_instructions(experiment: str, task: str, log_level: str = "info"):
    """
    Returns instructions for packaging a deployment directory for a given task.

    :param experiment: The path to the deployment directory
    :param task: The task to package depoyment directory for
    :param log_level: Sets the logging level for deepsparse.server command
    :return: The instructions for packaging a deployment directory for a given task
    """
    dockerfile_directory = Path(__file__).parent.parent / "docker"
    dockerfile_path = dockerfile_directory / "Dockerfile"
    deployment_instructions = f"""
        Use the dockerfile in {dockerfile_path} to build sparsify
        image and run the `deepsparse.server`

        Run the following command inside `{dockerfile_directory}`
        directory (Note: replace <API_KEY> with appropriate sparsify api key):

        ```bash
        docker build --build-arg SPARSIFY_API_KEY=<API_KEY> -t sparsify_docker . \\
            && docker run -it -v {experiment}:/home/deployment  \\
                sparsify_docker deepsparse.server \\
                    --task {task} --model_path /home/deployment \\
                    --log-level {log_level}
        ```
    """
    return deployment_instructions
