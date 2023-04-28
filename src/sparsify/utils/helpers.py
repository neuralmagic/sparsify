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


import json
import logging
from pathlib import Path

import requests

from sparsify.utils.exceptions import InvalidAPIKey


__all__ = [
    "credentials_exists",
    "get_access_token",
    "get_authenticated_pypi_url",
    "get_sparsify_credentials_path",
    "get_token_url",
    "overwrite_credentials",
    "set_log_level",
    "strtobool",
]
_MAP = {
    "y": True,
    "yes": True,
    "t": True,
    "true": True,
    "on": True,
    "1": True,
    "n": False,
    "no": False,
    "f": False,
    "false": False,
    "off": False,
    "0": False,
}

_LOGGER = logging.getLogger(__name__)


def strtobool(value):
    """
    Emulation of distutils.strtobool since it is deprecated and will be removed
    by Python3.12

    :param value: a str convertible value to be converted to bool
    :returns: a bool representation of the value
    """
    try:
        return _MAP[str(value).lower()]
    except KeyError:
        raise ValueError('"{}" is not a valid bool value'.format(value))


def get_token_url():
    """
    :return: The url to use for getting an access token
    """
    return "https://accounts.neuralmagic.com/v1/connect/token"


def get_sparsify_credentials_path() -> Path:
    """
    :return: The path to the neuralmagic credentials file
    """
    return Path.home().joinpath(".config", "neuralmagic", "credentials.json")


def credentials_exists() -> bool:
    """
    :return: True if the credentials file exists, False otherwise
    """
    return get_sparsify_credentials_path().exists()


def overwrite_credentials(api_key: str) -> None:
    """
    Overwrite the credentials file with the given api key
    or create a new file if it does not exist

    :param api_key: The api key to write to the credentials file
    """
    credentials_path = get_sparsify_credentials_path()
    credentials_path.parent.mkdir(parents=True, exist_ok=True)
    credentials = {"api_key": api_key}

    with credentials_path.open("w") as fp:
        json.dump(credentials, fp)


def get_access_token(api_key: str) -> str:
    """
    Get the access token for the given api key

    :param api_key: The api key to use for authentication
    :return: The requested access token
    """
    response = requests.post(
        get_token_url(),
        data={
            "grant_type": "password",
            "username": "api-key",
            "client_id": "ee910196-cd8a-11ed-b74d-bb563cd16e9d",
            "password": api_key,
            "scope": "pypi:read",
        },
    )

    try:
        response.raise_for_status()
    except requests.HTTPError as http_error:
        error_message = (
            "Sorry, we were unable to authenticate your Neural Magic Account API key. "
            "If you believe this is a mistake, contact support@neuralmagic.com "
            "to help remedy this issue."
        )
        raise InvalidAPIKey(error_message) from http_error

    if response.status_code != 200:
        raise ValueError(f"Unknown response code {response.status_code}")

    _LOGGER.info("Successfully authenticated with Neural Magic Account API key")
    return response.json()["access_token"]


def get_authenticated_pypi_url(access_token: str) -> str:
    """
    Get the authenticated pypi url for the given access token

    :return: The authenticated pypi url
    """
    pypi_url_template = "https://nm:{}@pypi.neuralmagic.com"
    return pypi_url_template.format(access_token)


def set_log_level(logger: logging.Logger, level: int) -> None:
    """
    Set the log level for the given logger and all of its handlers

    :param logger: The logger to set the level for
    :param level: The level to set the logger to
    """
    logging.basicConfig(level=level)
    for handler in logger.handlers:
        handler.setLevel(level=level)
