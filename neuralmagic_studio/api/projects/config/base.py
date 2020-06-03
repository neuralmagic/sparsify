import json
import os
import yaml

from flask import Blueprint, request, current_app

__all__ = ["config_api_bp"]

config_api_bp = Blueprint(
    "config_api", __name__, url_prefix="/api/projects/<project_id>/config"
)

CONFIG_FILE = "recal.config.yaml"


@config_api_bp.route("/", methods=["GET"])
<<<<<<< HEAD:neuralmagic_studio/api/projects/config/base.py
def get_recal_config(project_id: str):
    config_path = os.path.join(
        current_app.config["PROJECT_ROOT"], project_id, CONFIG_FILE
    )
=======
def get_recal_config(model_id):
    config_path = os.path.join(current_app.config["MODEL_ROOT"], model_id, CONFIG_FILE)
>>>>>>> rename config files:server/blueprints/config_api_blueprint.py
    if not os.path.isfile(config_path):
        return {"message": f"Config file for {project_id} does not exist"}, 404

    with open(config_path, "r") as yml_file:
        yml_object = yaml.safe_load(yml_file)
        yml_json = json.dumps(yml_object)

    return yml_json


@config_api_bp.route("export", methods=["POST"])
def export_recal_config(project_id: str):
    request_body = request.get_json()

    target_directory = os.path.join(current_app.config["PROJECT_ROOT"], project_id)

    if not os.path.exists(target_directory):
        return {"message": f"Path {target_directory} does not exist"}, 404

    target_file = os.path.join(target_directory, CONFIG_FILE)

    with open(target_file, "w") as yml_file:
        yml_file.write(yaml.dump(request_body))

    return {"configPath": target_file}
