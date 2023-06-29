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

from deepsparse.loggers.config import PipelineSystemLoggingConfig
from deepsparse.server.config import EndpointConfig, ServerConfig
from sparsify.utils.helpers import (
    base_model_to_yaml,
    copy_file,
    get_non_existent_filename,
)


__all__ = ["package", "DOCKERFILE_DIRECTORY"]

DOCKERFILE_DIRECTORY: Path = (
    Path(__file__).parent.parent.parent.parent / "docker" / "package"
)
_LOGGER = logging.getLogger(__name__)


def package(
    experiment: str,
    use_case: str,
    logging_config: Optional[str],
    deploy_type: str = "server",
    processing_file: Optional[str] = None,
    output_dir: Optional[str] = None,
    return_instructions: bool = False,
) -> Optional[str]:
    """
    Given an experiment directory and other configs, packages everything into a
    deployment directory with a dockerfile and display instructions on how to run a
    deepsparse server. Note: current implementation only supports `server` deploy type
    and needs the docker directory from sparsify repo, future work will translate this
    function to use pre-built docker images from deepsparse repo, removing this
    requirement

    :pre-condition: docker directory from sparsify repo is available, and placed at the
        same level as in the sparsify repo
    :pre-condition: only supports `server` deploy type
    :pre-condition: `processing_file` is a valid python file containing pre-processing
        and/or post-processing utilities as expected by deepsparse server
    :param experiment: the experiment directory containing the model and configs
    :param use_case: the task to package deployment directory for
    :param logging_config: the logging configuration file to use with deepsparse server
    :param deploy_type: sets the deployment type, only supports `server`
    :param processing_file: the `processing_file` to use with deepsparse server
    :param output_dir: the directory where the packaged deployment directory will be,
        defaults to `deployment` folder in the current working directory
    :param return_instructions: if True, returns the instructions on how to run the
        deepsparse server, defaults to False
    :return: the instructions on how to run the deepsparse server if
        ``return_instructions` is True, else None
    """
    # define paths
    local_output_dir_path: Path = (
        Path(output_dir)
        if output_dir is not None
        else get_non_existent_filename(
            parent_dir=Path(experiment).parent, filename="deployment"
        )
    )
    local_server_config_path: Path = get_non_existent_filename(
        parent_dir=local_output_dir_path, filename="server-config.yaml"
    )
    docker_output_dir: Path = Path("/home/deployment")
    deployment_readme_path: Path = get_non_existent_filename(
        parent_dir=local_output_dir_path, filename="README.md"
    )
    # copy artifacts
    copied_dockerfile: Path = copy_file(
        DOCKERFILE_DIRECTORY / "Dockerfile", dest=local_output_dir_path
    )
    copied_experiment_dir: Path = copy_file(
        Path(experiment), dest=local_output_dir_path
    )

    # get endpoint config relative to docker output dir
    endpoint_config: EndpointConfig = _get_endpoint_config(
        task=use_case,
        processing_file=processing_file,
        local_output_dir_path=local_output_dir_path,
        docker_output_dir=docker_output_dir,
        logging_config=logging_config,
        copied_experiment_dir_name=copied_experiment_dir.name,
    )
    base_model_to_yaml(
        model=ServerConfig(endpoints=[endpoint_config]),
        file_path=str(local_server_config_path),
    )

    # place deployment instructions
    deployment_instructions = _get_deployment_instructions(
        dockerfile_path=copied_dockerfile,
        docker_output_dir=docker_output_dir,
        local_output_dir=local_output_dir_path,
        local_server_config_path=local_server_config_path,
    )

    deployment_readme_path.write_text(deployment_instructions)

    _LOGGER.info(
        "Package created at %s. To deploy instructions at %s" %
        (local_output_dir_path, deployment_readme_path)
    )
    _LOGGER.debug("locals: %s" % locals())

    if return_instructions:
        return deployment_instructions


def _get_endpoint_config(
    task: str,
    processing_file: Optional[str],
    local_output_dir_path: Path,
    docker_output_dir: Path,
    logging_config: Optional[str],
    copied_experiment_dir_name: str,
) -> EndpointConfig:
    """
    Returns the endpoint config for the given task

    :param task: the task to package deployment directory for
    :param processing_file: the processing file to copy
    :param local_output_dir_path: the local output directory path
    :param docker_output_dir: the docker output directory to use for the endpoint
    :param logging_config: the logging config file path
    :param copied_experiment_dir_name: the name of the copied experiment directory
    :return: the endpoint config for the given task
    """
    endpoint_config: EndpointConfig = EndpointConfig(
        task=task,
        name=f"{task}-endpoint",
        route="/predict",
        model=str(docker_output_dir.joinpath(copied_experiment_dir_name)),
    )

    endpoint_config.kwargs = _get_processing_file_kwargs_for_endpoint_config(
        processing_file=processing_file,
        task=task,
        output_dir=local_output_dir_path,
        docker_output_dir=docker_output_dir,
    )

    endpoint_config.logging_config = _load_logging_config(logging_config=logging_config)
    return endpoint_config


def _get_deployment_instructions(
    dockerfile_path: Path,
    local_output_dir: Path,
    local_server_config_path: Path,
    docker_output_dir: Path,
):
    """
    Returns the deployment instructions to be displayed to the user

    :param dockerfile_path: the path to the dockerfile
    :param local_output_dir: the local output directory where the deployment artifacts
        exist
    :param local_server_config_path: the local server config path
    :param docker_output_dir: the docker output directory to use for the endpoint
    :return: the deployment instructions to be displayed to the user
    """
    return f"""
    Use the dockerfile at {dockerfile_path} to build deepsparse
    image and run the `deepsparse.server`

    Run the following command inside `{local_output_dir}` directory:

    ```bash
    docker build --target prod --build-arg DEPS=all --tag deepsparse_docker . \\
    && docker container run --interactive --tty --publish 5543:5543 \\
    --volume {local_output_dir}:{docker_output_dir} \\
    deepsparse_docker deepsparse.server \\
     --config_file {docker_output_dir.joinpath(local_server_config_path.name)}
    ```
    """


def _load_logging_config(
    logging_config: Optional[str] = None,
) -> Optional[PipelineSystemLoggingConfig]:
    """
    Loads the logging config from the given file path, if provided

    :param logging_config: the logging config file path
    :return: PipelineSystemLoggingConfig object if valid yaml
        logging_config is provided, else None
    """
    if not logging_config:
        return

    with open(logging_config, "r") as fp:
        logging_config_obj = yaml.safe_load(fp)
    return PipelineSystemLoggingConfig(**logging_config_obj)


def _get_processing_file_kwargs_for_endpoint_config(
    processing_file: Optional[str], task: str, output_dir: Path, docker_output_dir: Path
):
    """
    Copies the processing file to the output directory and returns the kwargs to be
    added to the endpoint config

    :param processing_file: the processing file to copy
    :param task: the task to package deployment directory for
    :param output_dir: the output directory to copy the processing file to
    :param docker_output_dir: the docker output directory to use for the endpoint
    :return: the kwargs to be added to the endpoint config
    """
    if not processing_file:
        return {}

    if task != "custom":
        raise ValueError(
            "Processing file is only supported for custom tasks, "
            f"but task {task} was specified"
        )
    processing_file_path: Path = copy_file(Path(processing_file), output_dir)
    # Add the processing file to the endpoint config
    return {
        "processing_file": str(docker_output_dir.joinpath(processing_file_path.name)),
    }
