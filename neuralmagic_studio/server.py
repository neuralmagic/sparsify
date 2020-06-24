import logging
from typing import Any, Callable, Dict, List

from flask import Flask, redirect, request
from flask_cors import CORS
from neuralmagic_studio.api import (
    base_api_bp,
    config_api_bp,
    project_api_bp,
    project_base_api_bp,
    ui_bp,
)
from neuralmagic_studio.utils import get_project_root

__all__ = ["setup_flask"]


def setup_flask(
    app: Flask, project_root: str, host: str, port: str, logging_level: str
):
    """
    Sets up and runs Flask app

    :param app: Flask app to start
    :param project_root: Path to where models are saved
    :param host: Host where Flask server will be run
    :param port: Port where Flask server will be run
    :param logging_level: Logging level
    """
    logging_level = logging_level.upper()

    project_root = get_project_root(project_root)
    app.config["PROJECT_ROOT"] = project_root

    app.register_blueprint(base_api_bp)
    app.register_blueprint(project_api_bp)
    app.register_blueprint(ui_bp)
    app.register_blueprint(project_base_api_bp)
    app.register_blueprint(config_api_bp)

    try:
        logging.getLogger().setLevel(getattr(logging, logging_level))
    except AttributeError as e:
        logging.error(e)

    logging.info(f"Running NeuralMagic Studio from {project_root} on {host}:{port}")
    app.run(host=host, port=port)
