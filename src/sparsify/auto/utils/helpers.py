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
Generic helpers for sparsify.auto
"""
from __future__ import annotations

import os
from datetime import datetime
from typing import TYPE_CHECKING


if TYPE_CHECKING:
    from sparsify.auto import APIArgs


__all__ = ["SAVE_DIR", "create_save_directory", "get_trial_artifact_directory"]

SAVE_DIR = "auto_{{task}}{:_%Y_%m_%d_%H_%M_%S}".format(datetime.now())


def create_save_directory(api_args: APIArgs) -> str:
    """
    Create base save directory structure for a single sparsify.auto run

    """
    save_directory = os.path.join(
        api_args.save_directory, SAVE_DIR.format(task=api_args.task)
    )
    os.makedirs(save_directory, exist_ok=True)
    os.mkdir(os.path.join(save_directory, "run_artifacts"))
    os.mkdir(os.path.join(save_directory, "logs"))

    return save_directory


def get_trial_artifact_directory(api_args: APIArgs, trial_idx: int) -> str:
    """
    Return the path to a trial's save directory
    """
    return os.path.join(
        api_args.save_directory,
        SAVE_DIR.format(task=api_args.task),
        "run_artifacts",
        f"trial_{trial_idx}",
    )
