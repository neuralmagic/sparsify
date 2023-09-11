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
import glob
import logging
import os
import re
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
    "create_yolo_data_yaml",
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


def create_yolo_data_yaml(dataset: str) -> str:
    """
    Check if the dataset provided is a data directory. If it is, check if there is
    a yaml file within the directory and return the path to the yaml. If not, build
    a yolov5 yaml file based on the provided data directory path. An example of the
    directory structure for the provided directory path is shown below. There must
    subdirectories in the provided directory named `images`, `labels` and a text
    file called `classes.txt` which includes the list of the classes for the
    particular dataset, ordered by class id. The `images` and `labels` folders
    should contain identically named train, test, and validation data folder.
    For details on what images and labels should look like, please see the yolov5
    repository: https://github.com/ultralytics/yolov5/tree/master.

    Example directory structure:
    - data_for_training/
        - labels/
            - train/
            - val/
            - test/
        - images/
            - train/
            - val/
            - test/
        - classes.txt

    :params dataset: inputted data string arg. Assumed to either be a dataset which
    can be downloaded publicly or a locally available directory containing
    data files.

    :returns: path to yaml to download or the newly built yaml. If the data string
    arg is a yaml for a publicly available dataset, this function will return the
    same string. Otherwise, the path to the newly generated yaml will be returned.
    """
    data_file_args = {}
    image_dir = "images"
    class_path = "classes.txt"
    yaml_path = "data_local.yaml"

    def _check_and_update_file(file_type: str, path: str):
        if data_file_args.get(file_type, None):
            data_file_args[file_type].append(path)
        else:
            data_file_args[file_type] = [path]

    # Case where the user provides just a yaml file path
    if not os.path.isdir(dataset):
        return dataset

    # Case where the user provides a data directory with a yaml file
    # Only one will be returned if multiple are provided
    yaml_paths = glob.glob(f"{dataset}/*.y*ml")
    if len(yaml_paths) > 0:
        return yaml_paths[0]

    image_path = os.path.join(dataset, image_dir)
    class_list_path = os.path.join(dataset, class_path)

    if not os.path.exists(image_path):
        raise ValueError(
            f"The the provided directory path {dataset} "
            "does not contain a folder called `images`. A subdirectory must "
            "exist which contains the data folders."
        )

    if not os.path.exists(class_list_path):
        raise ValueError(
            f"The the provided directory path {dataset} "
            "does not contain a classes.txt file. A file must be "
            "present which includes a list of the classes for the dataset."
        )

    data_file_args["path"] = dataset

    for d in os.listdir(image_path):
        current_path = os.path.join(image_dir, d)
        if re.search(r"train", d):
            _check_and_update_file("train", current_path)
        elif re.search(r"val", d):
            _check_and_update_file("val", current_path)
        elif re.search(r"test", d):
            _check_and_update_file("test", current_path)

    if not (data_file_args.get("train") and data_file_args.get("val")):
        raise Exception(
            "No training or validation folders found. Be sure the "
            "directory provided to the data arg contains folders "
            "with the train and val substrings in the filenames."
        )

    # Store the newly generated yaml in the same directory as the data
    dataset = os.path.join(dataset, yaml_path)

    with open(class_list_path, "r") as f:
        class_list = f.readlines()

    classes = {idx: label.strip() for idx, label in enumerate(class_list)}

    with open(dataset, "w") as f:
        yaml.safe_dump({**data_file_args, "names": classes}, f, sort_keys=False)

    return dataset


def create_save_directory(api_args: "APIArgs") -> Tuple[str]:  # noqa: F821
    """
    Create base save directory structure for a single sparsify.auto run

    """
    save_directory = os.path.join(
        api_args.save_directory,
        SAVE_DIR.format(run_mode=api_args.run_mode.value, task=api_args.task),
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
        f"\n{blue}*************************SPARSIFY***************************{reset}"
        "\n%(message)s"
        f"\n{blue}************************************************************\n{reset}"
    )

    def format(self, record):
        formatter = logging.Formatter(self.banner_format)
        return formatter.format(record)
