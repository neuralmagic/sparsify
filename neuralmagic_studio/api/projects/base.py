import os
import shutil
import json
from typing import Callable
import uuid
import yaml

from flask import Blueprint, request, current_app, abort

from neuralmagic_studio.utils import get_path

from neuralmagic_studio.mock_api import (
    calc_sparse_loss_sensitivity,
    calc_sparse_perf_sensitivity,
)

from neuralmagic_studio.utils import Model

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
def get_files_in_directory():
    project_root = current_app.config["PROJECT_ROOT"]
    if request.method == "GET":
        if not os.path.exists(project_root):
            return {"message": f"Path {project_root} does not exist"}, 404

        if not os.path.isdir(project_root):
            return {"message": f"Path {project_root} links to file not directory"}, 404

        directories = list(
            filter(
                lambda file: os.path.isdir(os.path.join(project_root, file)),
                os.listdir(project_root),
            )
        )

        projects = [{"projectId": directory} for directory in directories]

        return {"projects": projects}

    elif request.method == "POST":
        project_path = request.get_json()["projectPath"]

        project_id = str(uuid.uuid4())
        target_path = os.path.join(project_root, project_id)

        project_path = os.path.expanduser(project_path)

        if not os.path.exists(project_path):
            return {"message": f"Path {project_root} does not exist"}, 404
        if not os.path.isfile(project_path) or not allowed_file(project_path):
            return {"message": f"Path {project_root} is not a valid file"}, 404

        os.makedirs(target_path, exist_ok=True)
        target_file = os.path.join(target_path, "model.onnx")
        shutil.copy(project_path, target_file)

        return {"projectPath": target_path}

    return abort(405)


def handle_project(project_id: str, project_function: Callable):

    project_path = os.path.join(
        current_app.config["PROJECT_ROOT"], project_id, "model.onnx"
    )

    if not os.path.exists(project_path):
        return {"message": f"Project ID {project_id} does not exist"}, 404

    try:
        return project_function(project_path)
    except Exception as e:
        current_app.logger.error(traceback.format_exc())
        return {"message": "failure", "error": str(e)}, 500


@project_api_bp.route("/prunable-layers", methods=["GET"])
def get_prunable_layers(project_id: str):
    return handle_project(
        project_id,
        lambda project_path: {"prunableLayers": Model(project_path).prunable_layers},
    )


@project_api_bp.route("/sparse-analysis/loss/approx", methods=["GET"])
def get_approx_sparse_loss(project_id: str):
    return handle_project(
        project_id,
        lambda project_path: {
            "layerSensitivities": Model(project_path).sparse_analysis_loss_approx
        },
    )


@project_api_bp.route("/sparse-analysis/perf/approx", methods=["GET"])
def get_approx_sparse_perf(project_id: str):
    return handle_project(
        project_id,
        lambda project_path: {
            "layerSensitivities": Model(project_path).sparse_analysis_perf_approx
        },
    )


@project_api_bp.route("/sparse-analysis/loss", methods=["GET"])
def get_sparse_loss(project_id: str):
    return handle_project(
        project_id,
        lambda project_path: {
            "layerSensitivities": calc_sparse_loss_sensitivity(project_path)
        },
    )


@project_api_bp.route("/sparse-analysis/loss/<analysis_id>", methods=["GET"])
def get_sparse_loss_by_id(project_id: str, analysis_id: str):
    return handle_project(
        project_id,
        lambda project_path: {
            "layerSensitivities": calc_sparse_loss_sensitivity(project_path)
        },
    )


@project_api_bp.route("/sparse-analysis/perf", methods=["GET"])
def get_sparse_perf(project_id: str):
    return handle_project(
        project_id,
        lambda project_path: {
            "layerSensitivities": calc_sparse_perf_sensitivity(project_path)
        },
    )


@project_api_bp.route("/sparse-analysis/perf/<analysis_id>", methods=["GET"])
def get_sparse_perf_by_id(project_id: str, analysis_id: str):
    return handle_project(
        project_id,
        lambda project_path: {
            "layerSensitivities": calc_sparse_perf_sensitivity(project_path)
        },
    )
