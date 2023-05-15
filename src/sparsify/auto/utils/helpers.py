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
import logging
import os
from collections import OrderedDict
from datetime import datetime
from typing import Any, Dict, List, Tuple, Union

import yaml


__all__ = [
    "SAVE_DIR",
    "create_save_directory",
    "get_trial_artifact_directory",
    "save_history",
    "load_raw_config_history",
    "best_n_trials_from_history",
    "initialize_banner_logger",
]

SAVE_DIR = "{{run_mode}}_{{task}}{:_%Y_%m_%d_%H_%M_%S}".format(datetime.now())


def initialize_banner_logger():
    logger = logging.getLogger("auto_banner")
    level = logging.INFO if int(os.getenv("RANK", -1)) in {-1, 0} else logging.ERROR
    logger.setLevel(level)
    handler = logging.StreamHandler()
    handler.setLevel(level)
    handler.setFormatter(_BannerFormatter())
    logger.addHandler(handler)


def create_save_directory(api_args: "APIArgs") -> Tuple[str]:  # noqa: F821
    """
    Create base save directory structure for a single sparsify.auto run

    """
    save_directory = os.path.join(
        api_args.save_directory,
        SAVE_DIR.format(run_mode=api_args.run_mode, task=api_args.task),
    )
    train_directory = os.path.join(save_directory, "training_artifacts")
    log_directory = os.path.join(save_directory, "logs")
    deploy_directory = os.path.join(save_directory, "deployment")
    os.makedirs(save_directory, exist_ok=True)
    os.makedirs(train_directory)
    os.makedirs(log_directory)
    os.makedirs(deploy_directory)

    return train_directory, log_directory, deploy_directory


def save_history(
    history: List[Tuple["SparsificationTrainingConfig", "Metrics"]],  # noqa: F821
    api_args: "APIArgs",  # noqa: F821
    stage: str,
    target_directory: str,
):
    """
    Saves the stage and run history files, where trial history refers to the history of
    one stage and run history refers to the history of all stages
    """
    trial_history_dict = {
        f"trial_{idx}": {"config": config.dict(), "metrics": metrics.dict()}
        for idx, (config, metrics) in enumerate(history)
    }

    # Save stage history
    with open(os.path.join(target_directory, "stage_history.yaml"), "w") as file:
        yaml.safe_dump(
            {**{"api_args": api_args.dict()}, **trial_history_dict},
            file,
        )

    # Update run history file
    filepath = os.path.join(os.path.dirname(target_directory), "run_history.yaml")
    if os.path.exists(filepath):
        with open(filepath, "r") as file:
            run_history = yaml.safe_load(file)
            run_history[stage] = trial_history_dict
    else:
        run_history = {
            **{"api_args": api_args.dict()},
            **{stage: trial_history_dict},
        }

    with open(filepath, "w") as file:
        yaml.safe_dump(run_history, file)


def load_raw_config_history(path: str) -> Dict[str, Any]:
    """
    Loads a raw dict of the run history from the specified run save path, within
    which `run_history.yaml` will be found and loaded
    """
    path = (
        path
        if os.path.isfile(path)
        else os.path.join(path, "training", "run_artifacts", "run_history.yaml")
    )
    if not os.path.exists(path):
        raise ValueError(f"Run history file {path} not found")

    with open(path, "r") as stream:
        return yaml.safe_load(stream)


def best_n_trials_from_history(
    history: List[Tuple["SparsificationTrainingConfig", "Metrics"]],  # noqa: F821
    n: Union[int, float],
):
    """
    Get the top n best trials by metrics from the run history

    :param history: run history
    :param n: number of top trials to extract. Value of inf can be passed to extract all
    the trials
    """
    n = n if n != float("inf") else len(history)
    ordered_trials = sorted(history, key=lambda x: x[1])
    return OrderedDict(
        [(idx, metrics) for idx, (_, metrics) in enumerate(ordered_trials[:n])]
    )


def get_trial_artifact_directory(artifact_directory: str, trial_idx: int) -> str:
    """
    Return the path to the trial from the artifact directory
    """
    return os.path.join(artifact_directory, f"trial_{trial_idx}")


class _BannerFormatter(logging.Formatter):
    blue = "\x1b[94m"
    grey = "\x1b[38;20m"
    yellow = "\x1b[33;20m"
    red = "\x1b[31;20m"
    bold_red = "\x1b[31;1m"
    reset = "\x1b[0m"
    banner_format = (
        f"\n{blue}*************************SPARSIFY AUTO**********************{reset}"
        "\n%(message)s"
        f"\n{blue}************************************************************\n{reset}"
    )

    def format(self, record):
        formatter = logging.Formatter(self.banner_format)
        return formatter.format(record)
