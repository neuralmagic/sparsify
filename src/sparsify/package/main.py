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
from typing import List, Optional

from sparsezoo import search_models
from sparsify.utils.helpers import (
    download_deployment_directory_from_stub,
    infer_dataset_domain_subdomain,
)


__all__ = [
    "package",
]

_LOGGER = logging.getLogger(__name__)


def package(
    directory: Optional[str] = None,
    task: Optional[str] = None,
    dataset: Optional[str] = None,
    scenario: Optional[str] = None,
    *args,
    **kwargs,
):
    """
    A function that returns a deployment directory given the task or dataset,
    and an optimizing criterion

    :param directory: str A local existing directory path to download the deployment
        artifacts to
    :param task: str A supported task
    :param dataset: str The public dataset this model was trained for
    :param scenario: Optional[str] `VNNI` or `vnni for a VNNI compatible machine
    """

    dataset, domain, subdomain = infer_dataset_domain_subdomain(
        dataset=dataset, task=task
    )

    stubs: List[str] = search_models(
        domain=domain,
        sub_domain=subdomain,
        dataset=dataset,
        return_stubs=True,
    )

    if scenario is not None:
        stubs = [stub for stub in stubs if scenario.lower() in stub]

    if not stubs:
        raise ValueError(
            f"Could not find any relevant stubs for the given task, dataset "
            f"and deployment scenario: {task, dataset, scenario}"
        )
    # naive implementation download first stub
    deployment_path = download_deployment_directory_from_stub(
        stub=stubs[0], directory=directory
    )
    _LOGGER.info(f"Deployment artifacts downloaded to {deployment_path}")
    return deployment_path
