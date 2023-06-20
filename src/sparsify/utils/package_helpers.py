import logging
from pathlib import Path
from typing import Optional

import yaml
from deepsparse.loggers.config import PipelineSystemLoggingConfig
from deepsparse.server.config import EndpointConfig, ServerConfig
from sparsify.utils import (
    get_non_existent_filename,
    copy_file,
    base_model_to_yaml,
)

__all__ = ["package", "DOCKERFILE_DIRECTORY"]

DOCKERFILE_DIRECTORY: Path = (
        Path(__file__).parent.parent.parent / "docker" / "package"
)
_LOGGER = logging.getLogger(__name__)


def package(
        experiment: str,
        task: str,
        logging_config: Optional[str],
        deploy_type: str,
        processing_file: Optional[str],
        output_dir: Optional[str],
) -> None:
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
    :param task: the task to package deployment directory for
    :param logging_config: the logging configuration file to use with deepsparse server
    :param deploy_type: sets the deployment type, only supports `server`
    :param processing_file: the `processing_file` to use with deepsparse server
    :param output_dir: the directory where the packaged deployment directory will be,
        defaults to `deployment` folder in the current working directory
    """
    # define paths
    local_output_dir_path: Path = (
        Path(output_dir)
        if output_dir is not None
        else get_non_existent_filename(
            parent_dir=Path(experiment).parent,
            filename="deployment"
        )
    )
    local_server_config_path: Path = get_non_existent_filename(
        parent_dir=local_output_dir_path, filename="server-config.yaml"
    )
    docker_output_dir: Path = Path("/home/deployment")

    # copy artifacts
    copied_dockerfile: Path = copy_file(
        DOCKERFILE_DIRECTORY / "Dockerfile", dest=local_output_dir_path
    )
    copied_experiment_dir: Path = copy_file(
        Path(experiment), dest=local_output_dir_path
    )

    # get endpoint config relative to docker output dir
    endpoint_config: EndpointConfig = _get_endpoint_config(
        task=task,
        processing_file=processing_file,
        local_output_dir_path=local_output_dir_path,
        docker_output_dir=docker_output_dir,
        logging_config=logging_config,
        copied_experiment_dir_name=copied_experiment_dir.name,
    )
    base_model_to_yaml(
        model=ServerConfig(endpoints=[endpoint_config]),
        file_path=str(local_server_config_path)
    )

    # display deployment instructions
    print(
        _get_deployment_instructions(
            dockerfile_path=copied_dockerfile,
            docker_output_dir=docker_output_dir,
            local_output_dir=local_output_dir_path,
            local_server_config_path=local_server_config_path,
        )
    )
    _LOGGER.debug("locals: %s", locals())


def _get_deployment_instructions(
        dockerfile_path: Path,
        local_output_dir: Path,
        local_server_config_path: Path,
        docker_output_dir: Path
):
    return f"""
    Use the dockerfile at {dockerfile_path} to build deepsparse
    image and run the `deepsparse.server`

    Run the following command inside `{local_output_dir}` directory:

    ```bash
    docker build --target prod --build-arg DEPS=all -t deepsparse_docker . \\
    && docker container run -it -p 5543:5543 -v {local_output_dir}:{docker_output_dir} \\
    deepsparse_docker deepsparse.server \\
     --config_file {docker_output_dir.joinpath(local_server_config_path.name)}
    ```
    """


def _load_logging_config(
        logging_config: Optional[str]
) -> Optional[PipelineSystemLoggingConfig]:
    if not logging_config:
        return

    with open(logging_config, "r") as fp:
        logging_config_obj = yaml.safe_load(fp)
    return PipelineSystemLoggingConfig(**logging_config_obj)


def _get_processing_file_kwargs(processing_file: Optional[str], task: str,
                                output_dir: Path, docker_output_dir: Path):
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
        "processing_file": str(
            docker_output_dir.joinpath(processing_file_path.name)
        ),
    }


def _get_endpoint_config(
        task: str,
        processing_file: Optional[str],
        local_output_dir_path: Path,
        docker_output_dir: Path,
        logging_config: Optional[str],
        copied_experiment_dir_name: str,
):
    endpoint_config: EndpointConfig = EndpointConfig(
        task=task,
        name=f"{task}-endpoint",
        route="/predict",
        model=str(docker_output_dir.joinpath(copied_experiment_dir_name)),
    )

    endpoint_config.kwargs = _get_processing_file_kwargs(
        processing_file=processing_file,
        task=task,
        output_dir=local_output_dir_path,
        docker_output_dir=docker_output_dir,
    )

    endpoint_config.logging_config = _load_logging_config(logging_config=logging_config)
    return endpoint_config
