import os
import logging
import json

from typing import List, Dict, Callable
from neuralmagic_studio.utils import RecalProject, get_project_root

__all__ = [
    "run_sparse_analysis_loss",
    "add_sparse_analysis_loss",
    "run_sparse_analysis_perf",
    "add_sparse_analysis_perf",
    "create_project",
]


def _get_project(project_id: str, project_root: str):
    project_root = get_project_root(project_root)
    project_path = os.path.join(project_root, project_id)
    return RecalProject(project_path)


def _add_sparse_analysis(
    project: RecalProject, file_name: str, source: str, content: str, command: Callable,
):
    if source is None and content is None:
        raise Exception("Must specificy either source or content")
    elif source is not None:
        with open(source) as source_file:
            content = json.load(source_file)
    else:
        content = json.loads(content)

    results = command(file_name, content=content)
    return results


def run_sparse_analysis_loss(
    project_id: str,
    project_root: str,
    loss_file: str,
    batch_size: int,
    sparsity_levels: List[float],
    samples_per_measurement: int,
):
    """
    Runs sparse analysis loss. Requires neuralmagicML to be installed.

    :param project_id: Id of project to run
    :param project_root: Root folder where projects are saved
    :param loss_file: Loss file name where sparse analysis will be saved
    :param batch_size: the batch size of the inputs to be used with the model, default is 1
    :param sparsity_levels: Sparsity levels for sparse analysis
    :param samples_per_measurement: Samples per measurement to be ran
    :return: Loss Analysis in format:
    [
        {
            "baseline": {
                "sparsity": 0.0,
                "loss": 0.0
            },
            "id": NODE ID,
            "sparse": [{
                "sparsity": 0.4,
                "loss": 1.2
            },
            ...
            ]
        },
        ...
    ]
    """
    project = _get_project(project_id, project_root)

    results = project.run_sparse_analysis_loss(
        loss_file,
        batch_size=batch_size,
        sparsity_levels=sparsity_levels,
        samples_per_measurement=samples_per_measurement,
    )
    logging.info(
        f"Successfully saved sparse analysis at {project.loss_file_path(loss_file)}"
    )
    return results


def add_sparse_analysis_loss(
    project_id: str, project_root: str, loss_file: str, source: str, content: str
):
    """
    Saves a sparse analysis to a project from either an existing file or string representation

    :param project_id: Id of project to run
    :param project_root: Root folder where projects are saved
    :param loss_file: Loss file name where sparse analysis will be saved
    :param source: Source file to load sparse analysis
    :param content: Content to save to sparse analysis. Will be ignored if `source` is provided
    :return: Loss Analysis in format:
    [
        {
            "baseline": {
                "sparsity": 0.0,
                "loss": 0.0
            },
            "id": NODE ID,
            "sparse": [{
                "sparsity": 0.4,
                "loss": 1.2
            },
            ...
            ]
        },
        ...
    ]
    """
    project = _get_project(project_id, project_root)
    results = _add_sparse_analysis(
        project, loss_file, source, content, project.write_sparse_analysis_loss,
    )

    logging.info(
        f"Successfully saved sparse analysis at {project.loss_file_path(loss_file)}"
    )
    return results


def run_sparse_analysis_perf(
    project_id: str,
    project_root: str,
    perf_file: str,
    batch_size: int,
    sparsity_levels: List[float],
    optimization_level: int,
    num_cores: int,
    num_warmup_iterations: int,
    num_iterations: int,
):
    """
    Runs sparse analysis performance. Requires neuralmagic to be installed.

    :param project_id: Id of project to run
    :param project_root: Root folder where projects are saved
    :param perf_file: Perf file name where sparse analysis will be saved
    :param batch_size: the batch size of the inputs to be used with the model, default is 1
    :param sparsity_levels: Sparsity levels for sparse analysis
    :param optimization_level: how much optimization to perform, default is 1
    :param num_cores: the number of physical cores to run the model on, default is -1 (detect physical cores num)
    :param num_iterations: number of times to repeat execution, default is 1
    :param num_warmup_iterations: number of times to repeat unrecorded before starting actual benchmarking iterations
    :return: Perf Analysis in format:
    [
        {
            "baseline": {
                "sparsity": 0.0,
                "flops": 1000,
                "timing": 1.0
            },
            "id": NODE ID,
            "sparse": [{
                "sparsity": 0.4,
                "flops": 1000,
                "timing": 0.9
            },
            ...
            ]
        },
        ...
    ]
    """
    project = _get_project(project_id, project_root)

    results = project.run_sparse_analysis_perf(
        perf_file,
        batch_size=batch_size,
        sparsity_levels=sparsity_levels,
        optimization_level=optimization_level,
        num_cores=num_cores,
        num_warmup_iterations=num_warmup_iterations,
        num_iterations=num_iterations,
    )

    logging.info(
        f"Successfully saved sparse analysis at {project.perf_file_path(perf_file)}"
    )
    return results


def add_sparse_analysis_perf(
    project_id: str, project_root: str, perf_file: str, source: str, content: str
):
    """
    Saves a sparse analysis to a project from either an existing file or string representation

    :param project_id: Id of project to run
    :param project_root: Root folder where projects are saved
    :param perf_file: Perf file name where sparse analysis will be saved
    :param source: Source file to load sparse analysis
    :param content: Content to save to sparse analysis. Will be ignored if `source` is provided
    :return: Perf Analysis in format:
    [
        {
            "baseline": {
                "sparsity": 0.0,
                "flops": 1000,
                "timing": 1.0
            },
            "id": NODE ID,
            "sparse": [{
                "sparsity": 0.4,
                "flops": 1000,
                "timing": 0.9
            },
            ...
            ]
        },
        ...
    ]
    """
    project = _get_project(project_id, project_root)
    results = _add_sparse_analysis(
        project, loss_file, source, content, project.write_sparse_analysis_perf,
    )

    logging.info(
        f"Successfully saved sparse analysis at {project.perf_file_path(loss_file)}"
    )
    return results


def create_project(
    model_path: str, project_root: str, project_name: str,
):
    """
    Creates a new project using model

    :param model_path: Path of onnx model
    :param project_root: Root folder where projects are saved
    :param project_name: Name of project
    :return: Project Config:
    {
        "projectId": 12345-67890
        "projectName": "test"
    }
    """
    config = RecalProject.register_project(
        model_path, {"projectName": project_name}, project_root=project_root
    )
    logging.info(f"Created project with ID {config.id}")
    return config.config_settings
