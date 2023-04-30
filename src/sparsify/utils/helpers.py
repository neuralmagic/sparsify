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


import base64
import inspect
import json
import logging
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Dict, List, Optional

import requests

from sparsify.utils.exceptions import InvalidAPIKey, SparsifyLoginRequired


__all__ = [
    "base_url",
    "credentials_exists",
    "get_api_key_from_credentials",
    "get_authenticated_pypi_url",
    "get_sparsify_credentials_path",
    "get_token_url",
    "get_token_response",
    "overwrite_credentials",
    "request_access_token",
    "request_user_info",
    "set_log_level",
    "strtobool",
    "UserInfo",
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


def base_url():
    """
    :return: The base url to use for the sparsify api
    """
    return "https://sparsify.griffin.internal.neuralmagic.com"


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

    _LOGGER.info(f"Successfully over-wrote credentials to {credentials_path}")


def get_api_key_from_credentials() -> str:
    """
    Get the api key from the credentials file

    :precondition: The credentials file exists
    :raises SparsifyLoginRequired: If the credentials file does not exist
        or does not contain an api key
    :return: The api key
    """
    _LOGGER.info("Checking for credentials file")
    credentials_path = get_sparsify_credentials_path()
    if not credentials_path.exists():
        raise SparsifyLoginRequired(
            "Please run `sparsify login --api-key <your-api-key>` to login"
        )

    _LOGGER.info(f"Found credentials file at {credentials_path}")
    with credentials_path.open("r") as fp:
        credentials = json.load(fp)

    if "api_key" not in credentials:
        raise SparsifyLoginRequired(
            "No valid sparsify credentials found. Please run `sparsify.login`"
        )
    return credentials["api_key"]


def get_token_response(api_key: Optional[str] = None) -> Dict[Any, Any]:
    """
    Get the token response for the given api key

    :param api_key: The api key to use for authentication, if None, will use the
        api key from the credentials file
    :raises InvalidAPIKey: If the api key is invalid
    :raises ValueError: If the response code is not 200
    :return: The requested token response
    """
    if api_key is None:
        api_key = get_api_key_from_credentials()

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
    return response.json()


def request_access_token(api_key: Optional[str] = None) -> str:
    """
    Get the access token for the given api key

    :param api_key: The api key to use for authentication
    :return: The requested access token
    """
    return get_token_response(api_key=api_key)["access_token"]


def request_user_info(api_key: Optional[str] = None) -> Dict[Any, Any]:
    """
    Get the user info for the given api key

    :param api_key: The api key to use for authentication
    :return: The requested user info
    """
    _LOGGER.info("Requesting user info")
    id_token = get_token_response(api_key=api_key)["id_token"]
    user_info_segment = id_token.split(".")[1] + "=="
    user_info = json.loads(base64.urlsafe_b64decode(user_info_segment))
    _LOGGER.debug(f"User info: {user_info}")
    return user_info


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


@dataclass
class UserInfo:
    name: str
    user_id: str
    email: str
    email_verified: bool
    account_id: str
    client_id: str
    aud: List[str]

    @classmethod
    def from_dict(cls, kwargs):
        return cls(
            **{
                key: value
                for key, value in kwargs.items()
                if key in inspect.signature(cls).parameters
            }
        )
