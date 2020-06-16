import os
import shutil
import json
import traceback
from typing import Callable
import uuid
import yaml

from flask import Blueprint, request, current_app, abort

from neuralmagic_studio.utils import (
    get_path,
    RecalProject,
    ProjectConfig,
    get_missing_fields_message,
)

__all__ = ["project_base_api_bp", "project_api_bp"]

ALLOWED_EXTENSIONS = {"onnx"}

project_base_api_bp = Blueprint(
    "project_management_api", __name__, url_prefix="/api/projects"
)


project_api_bp = Blueprint(
    "projects_api", __name__, url_prefix="/api/projects/<project_id>"
)


def allowed_file(filename: str) -> bool:
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


@project_base_api_bp.route("/", methods=["POST", "GET"])
def projects():
    project_root = current_app.config["PROJECT_ROOT"]
    if request.method == "GET":
        if not os.path.exists(project_root):
            return {"message": f"Path {project_root} does not exist"}, 404

        directories = [
            get_path(folder)
            for folder in os.listdir(project_root)
            if os.path.isdir(get_path(folder))
        ]

        projects = [
            ProjectConfig(directory).config_settings for directory in directories
        ]

        return {"projects": projects}

    elif request.method == "POST":
        missing_fields_message = get_missing_fields_message(
            ["modelPath", "projectConfig"]
        )
        if missing_fields_message:
            return missing_fields_message, 400

        model_path = request.get_json()["modelPath"]
        config_settings = request.get_json()["projectConfig"]

        project_id = str(uuid.uuid4())
        project_path = get_path(project_id)

        model_path = os.path.expanduser(model_path)
        if not os.path.exists(model_path):
            return {"message": f"Path {model_path} does not exist"}, 404
        if not os.path.isfile(model_path) or not allowed_file(model_path):
            return {"message": f"Path {model_path} is not a valid file"}, 404

        os.makedirs(project_path, exist_ok=True)

        config_settings["projectId"] = project_id
        project_config = ProjectConfig(project_path)
        project_config.write(config_settings)

        target_file = os.path.join(project_path, "model.onnx")
        shutil.copy(model_path, target_file)

        return {
            "project": project_config.config_settings,
        }
    else:
        return (
            {"message": f"Unsupported method {request.method} for {request.path}"},
            405,
        )


@project_api_bp.route("/", methods=["GET", "PUT"])
def get_project(project_id: str):
    if request.method == "GET":
        if os.path.exists(get_path(project_id)):
            return {"project": ProjectConfig(get_path(project_id)).config_settings}
        return {"message": f"Project {project_id} does not exist"}, 404
    elif request.method == "PUT":
        missing_fields_message = get_missing_fields_message(["projectConfig"])
        if missing_fields_message:
            return missing_fields_message, 400
        update_config = request.get_json()["projectConfig"]
        if os.path.exists(get_path(project_id)):
            project_config = ProjectConfig(get_path(project_id))
            project_config.write(update_config)
            return {"project": project_config.config_settings}
        return {"message": f"Project {project_id} does not exist"}, 404
    else:
        return (
            {"message": f"Unsupported method {request.method} for {request.path}"},
            405,
        )


def handle_project(project_id: str, project_function: Callable):
    if not os.path.exists(get_path(project_id)):
        return {"message": f"Project ID {project_id} does not exist"}, 404

    try:
        return project_function(get_path(project_id))
    except FileNotFoundError as e:
        current_app.logger.error(traceback.format_exc())
        return {"message": str(e)}, 404
    except Exception as e:
        current_app.logger.error(traceback.format_exc())
        return {"message": str(e)}, 500


@project_api_bp.route("/prunable-layers", methods=["GET"])
def get_prunable_layers(project_id: str):
    return handle_project(
        project_id,
        lambda project_path: {
            "prunableLayers": RecalProject(project_path).prunable_layers
        },
    )


@project_api_bp.route("/sparse-analysis/loss/approx", methods=["GET"])
def get_approx_sparse_loss(project_id: str):
    return handle_project(
        project_id,
        lambda project_path: {
            "layerSensitivities": RecalProject(project_path).sparse_analysis_loss_approx
        },
    )


@project_api_bp.route("/sparse-analysis/perf/approx", methods=["GET"])
def get_approx_sparse_perf(project_id: str):
    return handle_project(
        project_id,
        lambda project_path: {
            "layerSensitivities": RecalProject(project_path).sparse_analysis_perf_approx
        },
    )


@project_api_bp.route("/sparse-analysis/loss", methods=["GET"])
def get_sparse_loss(project_id: str):
    return handle_project(
        project_id,
        lambda project_path: {
            "layerSensitivities": RecalProject(project_path).sparse_analysis_perf
        },
    )


@project_api_bp.route(
    "/sparse-analysis/loss/<analysis_id>", methods=["GET", "POST", "PUT"]
)
def get_sparse_loss_by_id(project_id: str, analysis_id: str):
    if request.method == "GET":
        return handle_project(
            project_id,
            lambda project_path: {
                "layerSensitivities": RecalProject(
                    project_path
                ).get_sparse_analysis_loss(analysis_id)
            },
        )
    elif request.method == "POST":
        return handle_project(
            project_id,
            lambda project_path: {
                "layerSensitivities": RecalProject(
                    project_path
                ).run_sparse_analysis_loss(analysis_id)
            },
        )

    elif request.method == "PUT":
        missing_fields_message = get_missing_fields_message(["perf"])
        if missing_fields_message:
            return missing_fields_message, 400
        content = request.get_json()["perf"]

        return handle_project(
            project_id,
            lambda project_path: {
                "layerSensitivities": RecalProject(
                    project_path
                ).write_sparse_analysis_loss(analysis_id, content)
            },
        )
    return (
        {"message": f"Unsupported method {request.method} for {request.path}"},
        405,
    )


@project_api_bp.route("/sparse-analysis/perf", methods=["GET"])
def get_sparse_perf(project_id: str):
    return handle_project(
        project_id,
        lambda project_path: {
            "layerSensitivities": RecalProject(project_path).sparse_analysis_perf
        },
    )


@project_api_bp.route(
    "/sparse-analysis/perf/<analysis_id>", methods=["GET", "POST", "PUT"]
)
def get_sparse_perf_by_id(project_id: str, analysis_id: str):
    if request.method == "GET":
        return handle_project(
            project_id,
            lambda project_path: {
                "layerSensitivities": RecalProject(
                    project_path
                ).get_sparse_analysis_perf(analysis_id)
            },
        )
    elif request.method == "POST":
        return handle_project(
            project_id,
            lambda project_path: {
                "layerSensitivities": RecalProject(
                    project_path
                ).run_sparse_analysis_perf(analysis_id)
            },
        )

    elif request.method == "PUT":
        missing_fields_message = get_missing_fields_message(["perf"])
        if missing_fields_message:
            return missing_fields_message, 400
        content = request.get_json()["perf"]

        return handle_project(
            project_id,
            lambda project_path: {
                "layerSensitivities": RecalProject(
                    project_path
                ).write_sparse_analysis_perf(analysis_id, content)
            },
        )

    return (
        {"message": f"Unsupported method {request.method} for {request.path}"},
        405,
    )
