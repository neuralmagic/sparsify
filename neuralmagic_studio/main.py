import os
import sys
import traceback
import argparse

from typing import Dict, List, Any, Callable

import uuid
import json

from flask import (
    Flask,
    redirect,
    request,
)
from flask_cors import CORS

from neuralmagic_studio.api import (
    base_api_bp,
    config_api_bp,
    project_base_api_bp,
    project_api_bp,
    ui_bp,
)
from neuralmagic_studio.utils import get_config_yml

UPLOAD_FOLDER = "server/uploads"

app = Flask(__name__, static_url_path="", template_folder="static")
CORS(app)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER


def get_project_root(arg_project_root):
    config_yml = get_config_yml()

    project_root = (
        config_yml["projects-folder"]
        if config_yml and "projects-folder" in config_yml
        else arg_project_root
    )

    if project_root is None:
        project_root = "~/nm-projects"

    project_root = os.path.expanduser(project_root)
    print(project_root)
    if not os.path.exists(project_root):
        raise NotADirectoryError(f"PROJECT_ROOT {project_root} does not exist")

    project_root = os.path.abspath(project_root)
    return project_root


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Neural Magic Studio Server")

    parser.add_argument("--project-root", default=None)

    args = parser.parse_args()

    project_root = get_project_root(args.project_root)

    app.config["PROJECT_ROOT"] = project_root

    app.register_blueprint(base_api_bp)
    app.register_blueprint(project_api_bp)
    app.register_blueprint(ui_bp)
    app.register_blueprint(project_base_api_bp)
    app.register_blueprint(config_api_bp)
    app.run(host="0.0.0.0", port=7890)
