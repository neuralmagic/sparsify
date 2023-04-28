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
import os
from typing import Tuple

import requests

from sparsify.login import import_sparsifyml_authenticated
from sparsify.schemas import APIArgs, Metrics, RunMode, SparsificationTrainingConfig
from sparsify.utils import get_base_url, strtobool


sparsifyml = import_sparsifyml_authenticated()

from sparsifyml.auto import (  # noqa: E402
    auto_training_config_initial,
    auto_training_config_tune,
)


__all__ = ["api_request_config", "api_request_tune", "request_student_teacher_configs"]

_CONFIG_REQUEST_END_POINT = "/v1/sparsify/auto/training-config"
_CONFIG_TUNE_END_POINT = "/v1/sparsify/auto/training-config/tune"

SPARSIFY_SERVER: bool = strtobool(os.getenv(key="SPARSIFY_SERVER", default="False"))


def api_request_config(api_args: APIArgs) -> dict:
    """
    Make a request for the initial training configs

    :return: dictionary of SparsificationTrainingConfig objects
    """
    response = (
        requests.post(
            f"{get_base_url()}{_CONFIG_REQUEST_END_POINT}", json=api_args.dict()
        ).json()
        if SPARSIFY_SERVER
        else auto_training_config_initial(user_args=api_args).dict()
    )
    return response


def api_request_tune(history: Tuple[SparsificationTrainingConfig, Metrics]) -> dict:
    """
    Make a server request for updated hyperparameters to run

    :return: dictionary of SparsificationTrainingConfig object
    """

    response = (
        requests.post(
            f"{get_base_url()}{_CONFIG_TUNE_END_POINT}",
            json=[(config.dict(), metrics.dict()) for config, metrics in history],
        ).json()
        if SPARSIFY_SERVER
        else auto_training_config_tune(
            trial_history=[(config, metrics) for config, metrics in history]
        ).dict()
    )
    return response


def request_student_teacher_configs(
    api_args: APIArgs,
) -> Tuple[SparsificationTrainingConfig, SparsificationTrainingConfig]:
    """
    Request student and/or teacher sparsification configs from the NM API
    """

    student_config, teacher_config = None, None

    if RunMode(api_args.run_mode) == RunMode.teacher_only:
        teacher_config = SparsificationTrainingConfig(**api_request_config(api_args))

    else:
        student_config = SparsificationTrainingConfig(**api_request_config(api_args))
        if student_config.distill_teacher == "auto":
            teacher_input_args = api_args.copy(deep=True)
            teacher_input_args.run_mode = RunMode.teacher_only
            teacher_config = SparsificationTrainingConfig(
                **api_request_config(teacher_input_args)
            )

    return student_config, teacher_config
