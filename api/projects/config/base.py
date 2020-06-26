import json
import os
import yaml

from flask import Blueprint, request, current_app

from neuralmagic_studio.utils import get_path, ProjectConfig, RecalProject

__all__ = ["config_api_bp"]

config_api_bp = Blueprint(
    "config_api", __name__, url_prefix="/api/projects/<project_id>/config/export"
)


@config_api_bp.route("/", methods=["GET", "POST"])
def get_recal_config(project_id: str):
    if request.method == "GET":
        return RecalProject(get_path(project_id)).config.yaml

    elif request.method == "POST":
        missing_fields_message = get_missing_fields_message(["config"])
        if missing_fields_message:
            return missing_fields_message, 400
        config = request.json()["config"]

        ProjectConfig(project_id).overwrite(config)
        return RecalProject(get_path(project_id)).config.yaml
