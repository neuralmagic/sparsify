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
from pathlib import Path
from typing import Optional

import click
from sparsezoo.analyze.cli import CONTEXT_SETTINGS
from sparsezoo.utils import TASKS_WITH_ALIASES
from sparsify.utils import get_non_existent_filename, set_log_level
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
    "--processing_file",
    type=str,
    default=None,
    help="A python file containing a pre-processing (`preprocess`) "
    "and/or post-processing (`postprocess`) function",
)
@click.option(
    "--output_dir",
    type=click.Path(file_okay=False, dir_okay=True, writable=True),
    default=None,
    help="A directory where the packaged deployment directory will "
    "be saved, if not specified it will be saved in the parent "
    "directory of the experiment directory, under `deployment` folder",
)
@click.option("--debug/--no-debug", default=False, hidden=True)
def main(
    experiment: str,
    task: str,
    log_level: str,  # TODO: Change to logging_config and support that
    deploy_type: str,
    processing_file: Optional[str],
    output_dir: Optional[str],
    debug: bool = False,
):
    set_log_level(logger=_LOGGER, level=log_level)
    if deploy_type != "server":
        raise NotImplementedError(f"Deployment type {deploy_type} is not yet supported")

    if output_dir is None:
        output_dir = get_non_existent_filename(
            parent_dir=Path(experiment).parent, filename="deployment"
        )
    else:
        output_dir = Path(output_dir)
        if any(output_dir.iterdir()):
            raise ValueError(
                f"Output directory {output_dir} is not empty. "
                "Please specify an empty directory"
            )
    # move the experiment directory to the output directory
    # move dockerfile to output directory
    # move processing file to output directory
    # create a server-config with processing file if specified
    # display instructions for packaging

    # print(
    #     package_instructions(experiment=experiment, task=task, log_level=log_level)
    # )
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
