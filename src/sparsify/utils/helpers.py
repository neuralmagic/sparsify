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
from typing import Optional, Tuple

from sparsezoo import Model
from sparsify.utils.constants import DATASET_REGISTRY, TASK_REGISTRY, TaskInfo


__all__ = [
    "download_deployment_directory_from_stub",
    "infer_dataset_domain_subdomain",
]


def download_deployment_directory_from_stub(stub: str, directory: Optional[str] = None):
    """
    Download deployment directory from stub and return it's local path

    :param stub: A valid SparseZoo stub
    :param directory: An optional local path to download deployment artifacts to
    :return: The local path of the deployment directory for the stub
    """

    model = (
        Model(source=stub, download_path=directory) if directory else Model(source=stub)
    )
    model.deployment.download()
    return model.deployment.path


def infer_dataset_domain_subdomain(
    dataset: Optional[str],
    task: Optional[str],
) -> Tuple[Optional[str], str, str]:
    """
    Infer dataset, domain and subdomain from the given dataset and task. Note
    at-least one out of dataset and task must be provided

    :param dataset: Optional[str] An optional dataset name, must be specified
        if task not given
    :param task: Optional[str] An optional task name, must be specified
        if task not specified
    :return: A tuple of the format (dataset, domain, subdomain)
    """
    task_info: Optional[TaskInfo] = TASK_REGISTRY.get(task)
    dataset_task_info: Optional[TaskInfo] = DATASET_REGISTRY.get(dataset)
    if not task_info and not dataset_task_info:
        raise ValueError(
            f"Could not find any info for the given (task, dataset): {task, dataset}"
        )
    if task_info and dataset_task_info:
        if task_info.domain != dataset_task_info.domain:
            raise ValueError(
                f"Domain mismatch for the given (task, dataset): {task, dataset}"
            )
    domain = task_info.domain if task_info else dataset_task_info.domain
    subdomain = task_info.subdomain if task_info else dataset_task_info.subdomain
    dataset = dataset if dataset_task_info else None
    return dataset, domain, subdomain
