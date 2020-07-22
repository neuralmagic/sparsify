import json
import os
import yaml

from flask import Blueprint, request, current_app

from neuralmagic_studio.utils import (
    get_path,
    get_missing_fields_message,
)

from neuralmagicML.onnx import ProjectConfig, RecalProject, RecalConfig

__all__ = ["config_api_bp"]

config_api_bp = Blueprint(
    "config_api", __name__, url_prefix="/api/projects/<project_id>/config/export"
)


@config_api_bp.route("/", methods=["POST", "PUT"])
def get_recal_config(project_id: str):
    if request.method == "POST":
        missing_fields_message = get_missing_fields_message(["config_fields"])
        if missing_fields_message:
            return missing_fields_message, 400
        body = request.get_json()["config_fields"]
        project = RecalProject(get_path(project_id))
        config = RecalConfig.create_config(project, **body)
        return config.yaml

    elif request.method == "PUT":
        missing_fields_message = get_missing_fields_message(
            ["config_fields", "config_file"]
        )
        if missing_fields_message:
            return missing_fields_message, 400
        body = request.get_json()["config_fields"]
        config_file = request.get_json()["config_file"]
        project = RecalProject(get_path(project_id))

        body["config_file"] = config_file
        config = RecalConfig.create_config(project, **body)
        config.save()
        return config.yaml
