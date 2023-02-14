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

from sparsify.schemas import APIArgs, Metrics, SparsificationTrainingConfig
from sparsify.utils import get_base_url


__all__ = ["api_request_config", "api_request_tune", "request_student_teacher_configs"]

_CONFIG_REQUEST_END_POINT = "/v1/sparsify/auto/training-config"
_CONFIG_TUNE_END_POINT = "/v1/sparsify/auto/training-config/tune"


def api_request_config(api_args: APIArgs) -> dict:
    """
    Make a server request for the initial training configs

    :return: dictionary of SparsificationTrainingConfig objects
    """
    response = requests.post(
        f"{get_base_url()}{_CONFIG_REQUEST_END_POINT}",
        json=api_args.dict(),
    )
    return response.json()


def api_request_tune(history: Tuple[SparsificationTrainingConfig, Metrics]) -> dict:
    """
    Make a server request for updated hyperparameters to run

    :return: dictionary of SparsificationTrainingConfig object
    """

    response = requests.post(
        f"{get_base_url()}{_CONFIG_TUNE_END_POINT}",
        json=[(config.dict(), metrics.dict()) for config, metrics in history],
    )

    return response.json()


def request_student_teacher_configs(
    api_args: APIArgs,
) -> Tuple[SparsificationTrainingConfig, SparsificationTrainingConfig]:
    """
    Request student and/or teacher sparsification configs from the NM API
    """

    student_config, teacher_config = None, None

    if api_args.teacher_only:
        teacher_config = SparsificationTrainingConfig(**api_request_config(api_args))

    else:
        student_config = SparsificationTrainingConfig(**api_request_config(api_args))
        if student_config.distill_teacher == "auto":
            teacher_input_args = api_args.copy(deep=True)
            teacher_input_args.teacher_only = True
            teacher_config = SparsificationTrainingConfig(
                **api_request_config(teacher_input_args)
            )

    return student_config, teacher_config
