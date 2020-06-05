import os
import json
from typing import Any, Dict
import yaml

from flask import current_app

CONFIG_YAML_PATH = "server.yaml"

__all__ = ["get_config_yml", "get_path"]


def get_config_yml() -> Dict:
    with open(CONFIG_YAML_PATH) as yml_file:
        config_yml = yaml.load(yml_file)
    return config_yml


def get_path(filename: str) -> str:
    current_path = os.path.join(current_app.config["PROJECT_ROOT"], filename)
    return os.path.abspath(current_path)
