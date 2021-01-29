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

"""
Flask blueprint setup for serving UI files for the server application
"""

import logging
import os
from http import HTTPStatus

from flasgger import swag_from
from flask import Blueprint, current_app, send_from_directory

from sparsify.schemas import ErrorSchema


__all__ = ["ui_blueprint"]


_LOGGER = logging.getLogger(__name__)

ui_blueprint = Blueprint("ui", __name__, url_prefix="/")


@ui_blueprint.route("/", defaults={"path": ""})
@ui_blueprint.route("/<path:path>")
@swag_from(
    {
        "tags": ["UI"],
        "summary": "Get a supporting file or the root index.html file for the UI",
        "produces": ["text/html", "application/json"],
        "parameters": [],
        "responses": {
            HTTPStatus.OK.value: {
                "description": "The index html or supporting file",
                "content": {"text/html": {}},
            },
            HTTPStatus.INTERNAL_SERVER_ERROR.value: {
                "description": "Information for the error that occurred",
                "schema": ErrorSchema,
            },
        },
    },
)
def render_file(path: str):
    """
    Route for getting either a supporting file or the root index.html file for the UI

    :param path: the path requested for a UI file to render,
        note this is a catch all, so may improperly catch other misspelled routes
        and therefore fail to render them
    :return: response containing either the main index.html file or supporting file
        for the ui, uses send_from_directory.
    """
    if path != "" and os.path.exists(os.path.join(current_app.config["UI_PATH"], path)):
        _LOGGER.info(
            "sending {} file from {}".format(path, current_app.config["UI_PATH"])
        )
        return send_from_directory(current_app.config["UI_PATH"], path)
    else:
        _LOGGER.info(
            "sending index.html file at {} from {}".format(
                path, current_app.config["UI_PATH"]
            )
        )
        return send_from_directory(current_app.config["UI_PATH"], "index.html")
