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
import os
from collections import OrderedDict
from datetime import datetime
from typing import Any, Dict, List, Tuple

import yaml


__all__ = [
    "SAVE_DIR",
    "create_save_directory",
    "get_trial_artifact_directory",
    "save_trial_history",
    "load_raw_config_history",
    "best_n_trials_from_history",
]

SAVE_DIR = "auto_{{task}}{:_%Y_%m_%d_%H_%M_%S}".format(datetime.now())


def create_save_directory(api_args: "APIArgs") -> str:  # noqa: F821
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


def get_trial_artifact_directory(
    api_args: "APIArgs", trial_idx: int  # noqa: F821
) -> str:
    """
    Return the path to a trial's save directory
    """
    return os.path.join(
        api_args.save_directory,
        SAVE_DIR.format(task=api_args.task),
        "run_artifacts",
        f"trial_{trial_idx}",
    )


def save_trial_history(
    history: List[Tuple["SparsificationTrainingConfig", "Metrics"]],  # noqa: F821
    target_directory: str,
):
    """
    Saves the config history to a YAML file
    """
    with open(os.path.join(target_directory, "trial_history.yaml"), "w") as file:
        yaml.safe_dump(
            {
                f"trial_{idx}": {"config": config.dict(), "metrics": metrics.dict()}
                for idx, (config, metrics) in enumerate(history)
            },
            file,
        )


def load_raw_config_history(path: str) -> Dict[str, Any]:
    """
    Loads a raw dict of the config history from the specified path. Path can be path to
    the YAML file or path to the directory containing `trial_history.yaml`
    """
    path = path if os.path.isfile(path) else os.path.join(path, "trial_history.yaml")
    if not os.path.exists(path):
        raise ValueError(f"Trial history file {path} not found")

    with open(path, "r") as stream:
        return yaml.safe_load(stream)


def best_n_trials_from_history(history, n):
    n = n if n != float("inf") else len(history)
    ordered_trials = sorted(history, key=lambda x: x[1])
    return OrderedDict(
        [
            (idx, (config, metrics))
            for idx, (config, metrics) in enumerate(ordered_trials[:n])
        ]
    )
