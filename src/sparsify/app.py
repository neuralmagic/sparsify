# Copyright (c) 2021 - present / Neuralmagic, Inc. All Rights Reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#    http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing,
# software distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

import argparse
import atexit
import logging
import os
from typing import Any, Union

from flasgger import Swagger
from flask import Flask
from flask_cors import CORS

from sparsezoo.utils import clean_path, create_dirs
from sparsify.blueprints import (
    errors_blueprint,
    jobs_blueprint,
    model_repo_blueprint,
    projects_benchmark_blueprint,
    projects_blueprint,
    projects_data_blueprint,
    projects_model_blueprint,
    projects_optim_blueprint,
    projects_profiles_blueprint,
    system_blueprint,
    ui_blueprint,
)
from sparsify.log import set_logging_level
from sparsify.models import database_setup
from sparsify.workers import JobWorkerManager


__all__ = ["run", "main"]

_LOGGER = logging.getLogger(__name__)


def _validate_working_dir(working_dir: str) -> str:
    if not working_dir:
        working_dir = os.getenv("NM_SERVER_WORKING_DIR", "")

    if not working_dir:
        working_dir = os.path.join("~", "sparsify")

    working_dir = clean_path(working_dir)

    try:
        create_dirs(working_dir)
    except Exception as err:
        raise RuntimeError(
            ("Error while trying to create sparsify " "working_dir at {}: {}").format(
                working_dir, err
            )
        )

    return working_dir


def _setup_logging(logging_level: str):
    try:
        logging_level = getattr(logging, logging_level)
    except Exception as err:
        _LOGGER.error(
            "error setting logging level to {}: {}".format(logging_level, err)
        )

    set_logging_level(logging_level)


def _blueprints_setup(app: Flask):
    app.register_blueprint(errors_blueprint)
    app.register_blueprint(jobs_blueprint)
    app.register_blueprint(model_repo_blueprint)
    app.register_blueprint(projects_blueprint)
    app.register_blueprint(projects_benchmark_blueprint)
    app.register_blueprint(projects_data_blueprint)
    app.register_blueprint(projects_model_blueprint)
    app.register_blueprint(projects_optim_blueprint)
    app.register_blueprint(projects_profiles_blueprint)
    app.register_blueprint(system_blueprint)
    app.register_blueprint(ui_blueprint)


def _api_docs_setup(app: Flask):
    Swagger(app)


def _worker_setup():
    manager = JobWorkerManager()

    def _interrupt():
        manager.shutdown()

    atexit.register(_interrupt)
    manager.start()


def run(
    working_dir: str,
    host: str,
    port: int,
    debug: bool,
    logging_level: str,
    ui_path: Union[str, None],
):
    working_dir = _validate_working_dir(working_dir)
    _setup_logging(logging_level)

    if ui_path is None:
        ui_path = os.path.join(os.path.dirname(clean_path(__file__)), "ui")

    app = Flask("sparsify", static_url_path="/unused")
    app.config["MAX_CONTENT_LENGTH"] = 2 * 1024 * 1024 * 1024  # 2 Gb limit
    app.config["UI_PATH"] = ui_path
    CORS(app)

    database_setup(working_dir, app)
    _blueprints_setup(app)
    _api_docs_setup(app)
    _worker_setup()

    app.run(host=host, port=port, debug=debug, threaded=True)


def parse_args() -> Any:
    parser = argparse.ArgumentParser(description="sparsify")
    parser.add_argument(
        "--working-dir",
        default=None,
        type=str,
        help="The path to the working directory to store state in, "
        "defaults to ~/sparsify",
    )
    parser.add_argument(
        "--host",
        default="0.0.0.0",
        type=str,
        help="The host path to launch the server on",
    )
    parser.add_argument(
        "--port", default=5543, type=int, help="The local port to launch the server on"
    )
    parser.add_argument(
        "--debug",
        default=False,
        action="store_true",
        help="Set to run in debug mode",
    )
    parser.add_argument(
        "--logging-level",
        default="INFO",
        type=str,
        help="The logging level to report at",
    )
    parser.add_argument(
        "--ui-path",
        default=None,
        type=str,
        help="The directory to render the UI from, generally should not be set. "
        "By default, will load from the UI packaged with sparsify "
        "under sparsify/ui",
    )

    return parser.parse_args()


def main():
    ARGS = parse_args()
    run(
        ARGS.working_dir,
        ARGS.host,
        ARGS.port,
        ARGS.debug,
        ARGS.logging_level,
        ARGS.ui_path,
    )


if __name__ == "__main__":
    main()
