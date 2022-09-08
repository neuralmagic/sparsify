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
from typing import Iterable, Optional, Union

import requests

from sparsify.package.config import BACKEND_URL


__all__ = [
    "package",
]

_LOGGER = logging.getLogger(__name__)


def package(
    task: Optional[str] = None,
    dataset: Optional[str] = None,
    scenario: Optional[str] = None,
    optimizing_metric: Optional[Union[Iterable[str], str]] = None,
    **kwargs,
) -> str:
    """
    A function that returns appropriate SparseZoo stub or deployment directory given
    the task or dataset, optimizing criterions and a deployment scenario

    :param directory: str A local existing directory path to download the deployment
        artifacts to
    :param task: str A supported task
    :param dataset: str The public dataset this model was trained for
    :param scenario: Optional[str] `VNNI` or `vnni for a VNNI compatible machine
    :param optimizing_metric: Optional[List[str], str] representing different metrics
        to prioritize for when searching for models
    :return: The appropriate stub based on specified arguments
    """
    optimizing_metric = (
        [optimizing_metric] if isinstance(optimizing_metric, str) else optimizing_metric
    )

    payload = {
        "task": task,
        "dataset": dataset,
        "scenario": scenario,
        "optimizing_metric": optimizing_metric,
    }

    response = requests.get(
        url=BACKEND_URL,
        headers={"Content-Type": "application/json"},
        params=payload,
    )

    return response.json()
