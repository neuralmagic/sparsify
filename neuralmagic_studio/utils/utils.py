import json
import os
from typing import Any, Dict, List

import numpy as np
import yaml
from flask import current_app, request

CONFIG_YAML_PATH = "server.yaml"

__all__ = [
    "get_config_yml",
    "get_path",
    "get_missing_fields_message",
    "is_prunable",
    "get_array_from_data",
    "are_array_equal",
]


def get_config_yml() -> Dict:
    with open(CONFIG_YAML_PATH) as yml_file:
        config_yml = yaml.safe_load(yml_file)
    return config_yml


def get_path(filename: str) -> str:
    current_path = os.path.join(current_app.config["PROJECT_ROOT"], filename)
    return os.path.abspath(current_path)


def get_missing_fields_message(required_fields) -> Dict[str, str]:
    for required_field in required_fields:
        if required_field not in request.get_json():
            return {"message": f"Missing required field '{required_field}'"}
    return None


def is_prunable(name: str) -> bool:
    name = name.lower()
    return ("conv" in name) or ("gemm" in name) or "winograd_fused" in name


def get_array_from_data(data: dict) -> List[int]:
    return [data["x"], data["y"], data["z"]]


def are_array_equal(array_one: List, array_two: List) -> bool:
    return (
        (array_one == array_two)
        or (
            len(array_one) > len(array_two)
            and array_one[: len(array_two)] == array_two
            and np.prod(array_one[len(array_two) :]) == 1
        )
        or (
            len(array_two) > len(array_one)
            and array_two[: len(array_one)] == array_one
            and np.prod(array_two[len(array_one) :]) == 1
        )
    )
