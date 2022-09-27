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
Helper functions for communicating with the Neural Magic API
"""
from typing import Tuple

import requests

from sparsify.auto.api.api_models import APIArgs, Metrics, SparsificationTrainingConfig
from sparsify.utils import NEURAL_MAGIC_API_ADDRESS


__all__ = ["api_request_config", "api_request_tune"]


def api_request_config(api_args: APIArgs) -> dict:
    """
    Make a server request for the initial training config

    :return: dictionary of SparsificationTrainingConfig object
    """
    response = requests.post(
        f"{NEURAL_MAGIC_API_ADDRESS}/v1/sparsify/auto/training-config",
        json=api_args.dict(),
    )
    # TODO: add proper server error handling. Waiting for server to have
    # graceful failure protocol
    return response.json()


def api_request_tune(history: Tuple[SparsificationTrainingConfig, Metrics]) -> dict:
    """
    Make a server request for updated hyperparameters to run

    :return: dictionary of SparsificationTrainingConfig object
    """

    response = requests.post(
        f"{NEURAL_MAGIC_API_ADDRESS}/v1/sparsify/auto/training-config/tune",
        json=[(config.dict(), metrics.dict()) for config, metrics in history],
    )

    return response.json()
