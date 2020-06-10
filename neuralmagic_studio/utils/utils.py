import os
import json
from typing import Any, Dict
import yaml

from flask import current_app, request

CONFIG_YAML_PATH = "server.yaml"

__all__ = ["get_config_yml", "get_path", "get_missing_fields_message"]


def get_config_yml() -> Dict:
    with open(CONFIG_YAML_PATH) as yml_file:
        config_yml = yaml.load(yml_file)
    return config_yml


def get_path(filename: str) -> str:
    current_path = os.path.join(current_app.config["PROJECT_ROOT"], filename)
    return os.path.abspath(current_path)


def get_missing_fields_message(required_fields) -> Dict[str, str]:
    for required_field in required_fields:
        if required_field not in request.get_json():
            return {"message": f"Missing required field '{required_field}'"}
    return None
