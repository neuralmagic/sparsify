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

import yaml

import click
from deepsparse.loggers.config import PipelineSystemLoggingConfig
from deepsparse.server.config import EndpointConfig, ServerConfig
from sparsezoo.analyze.cli import CONTEXT_SETTINGS
from sparsezoo.utils import TASKS_WITH_ALIASES
from sparsify.utils import (
    base_model_to_yaml,
    copy,
    get_non_existent_filename,
    set_log_level,
)
from sparsify.version import version_major_minor


_LOGGER = logging.getLogger(__name__)


@click.command(context_settings=CONTEXT_SETTINGS)
@click.version_option(version=version_major_minor)
@click.option(
    "--task",
    type=click.Choice(TASKS_WITH_ALIASES, case_sensitive=False),
    help="The task to package deployment directory for",
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
    "--logging-config",
    type=click.Path(exists=True, file_okay=True, dir_okay=False, readable=True),
    help="The logging configuration file to use",
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
    logging_config: Optional[str],
    deploy_type: str,
    processing_file: Optional[str],
    output_dir: Optional[str],
    debug: bool = False,
):
    set_log_level(logger=_LOGGER, level=logging.DEBUG if debug else logging.INFO)
    if deploy_type != "server":
        raise NotImplementedError(f"Deployment type {deploy_type} is not yet supported")

    if output_dir is None:
        output_dir = get_non_existent_filename(
            parent_dir=Path(experiment).parent, filename="deployment"
        )
    else:
        output_dir = Path(output_dir)

    dockerfile_directory: Path = Path(__file__).parent.parent.parent / "docker"
    dockerfile_path: Path = copy(dockerfile_directory / "Dockerfile", output_dir)

    new_experiment_dir: Path = copy(Path(experiment), output_dir)
    docker_output_dir = Path("/home/deployment")

    endpoint_config = EndpointConfig(
        task=task,
        name=f"{task}-endpoint",
        route="/predict",
        model=str(docker_output_dir.joinpath(new_experiment_dir.name)),
    )

    if processing_file:
        if task != "custom":
            raise ValueError(
                "Processing file is only supported for custom tasks, "
                f"but task {task} was specified"
            )
        processing_file_path: Path = copy(Path(processing_file), output_dir)
        # Add the processing file to the endpoint config
        endpoint_config.kwargs = {
            "processing_file": str(
                docker_output_dir.joinpath(processing_file_path.name)
            ),
        }

    if logging_config:
        with open(logging_config, "r") as fp:
            logging_config_obj = yaml.safe_load(fp)
        endpoint_config.logging_config = PipelineSystemLoggingConfig(
            **logging_config_obj
        )

    server_config = ServerConfig(endpoints=[endpoint_config])
    config_path: Path = get_non_existent_filename(
        parent_dir=output_dir, filename="server-config.yaml"
    )
    base_model_to_yaml(model=server_config, file_path=str(config_path))

    deployment_instructions = f"""
    Use the dockerfile at {dockerfile_path} to build deepsparse
    image and run the `deepsparse.server`

    Run the following command inside `{output_dir}` directory:

    ```bash
    docker build -t deepsparse_docker . \\
    && docker container run -it -p 5543:5543 -v {output_dir}:{docker_output_dir} \\
    --build-arg DEPS=all deepsparse_docker \\
     deepsparse.server \\
     --config_file {docker_output_dir.joinpath(config_path.name)}
    ```
    """
    print(deployment_instructions)
    _LOGGER.debug(f"locals: {locals()}")
