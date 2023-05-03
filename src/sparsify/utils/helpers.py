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
from json import JSONDecodeError
from pathlib import Path
from typing import Any, Dict, List

import requests

from sparsify.utils.exceptions import InvalidAPIKey, SparsifyLoginRequired


__all__ = [
    "sparsify_base_url",
    "get_non_existent_filename",
    "set_log_level",
    "strtobool",
    "UserInfo",
    "SparsifyCredentials",
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


def sparsify_base_url():
    """
    :return: The base url to use for the sparsify api
    """
    return "https://sparsify.griffin.internal.neuralmagic.com"


def set_log_level(logger: logging.Logger, level: int) -> None:
    """
    Set the log level for the given logger and all of its handlers

    :param logger: The logger to set the level for
    :param level: The level to set the logger to
    """
    logging.basicConfig(level=level)
    for handler in logger.handlers:
        handler.setLevel(level=level)


def get_non_existent_filename(workng_dir: Path, filename: str) -> Path:
    """
    Get a filename that does not exist in the given directory

    :param workng_dir: The directory to check for the filename
    :param filename: The filename to check for
    :return: The filename that does not exist in the given directory
    """
    if not workng_dir.exists():
        return workng_dir.joinpath(filename)

    i = 1
    while workng_dir.joinpath(filename).exists():
        filename = f"{i}_{filename}"
        i += 1

    return workng_dir.joinpath(filename)


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


class SparsifyCredentials:
    _credentials_path: Path = Path.home().joinpath(
        ".config", "neuralmagic", "credentials.json"
    )
    _token_url: str = "https://accounts.neuralmagic.com/v1/connect/token"

    def __init__(self):
        if not self._credentials_path.exists():
            raise SparsifyLoginRequired(
                "Please run `sparsify login --api-key <your-api-key>` to login"
            )

        try:
            with self._credentials_path.open("r") as fp:
                credentials = json.load(fp)
        except JSONDecodeError as json_error:
            raise SparsifyLoginRequired(
                "The credentials file is not valid JSON. "
                "Please run `sparsify login --api-key <your-api-key>` to login"
            ) from json_error

        if "api_key" not in credentials:
            raise SparsifyLoginRequired(
                "No valid sparsify credentials found. Please run `sparsify.login`"
            )
        self._api_key = credentials["api_key"]
        self.authenticate()

    @property
    def credentials_path(self):
        """
        :return: The path to the sparsify credentials file
        """
        return self._credentials_path

    @property
    def api_key(self):
        """
        :return: The api key
        """
        return self._api_key

    @classmethod
    def from_api_key(cls, api_key: str) -> "SparsifyCredentials":
        """
        Overwrite the credentials file with the given api key
        or create a new file if it does not exist

        :postcondition: The credentials file exists
        :param api_key: The api key to write to the credentials file
        :return: The SparsifyCredentials object
        """
        cls._credentials_path.parent.mkdir(parents=True, exist_ok=True)
        if cls._credentials_path.exists():
            _LOGGER.debug("Overwriting existing credentials file")

        with open(cls._credentials_path, "w") as fp:
            json.dump({"api_key": api_key}, fp)
        return cls()

    def _get_token_response(self, scope: str = "pypi:read") -> Dict[Any, Any]:
        """
        Get the token response using credentials, with the given scope


        :param scope: The scope to request for the token
        :raises InvalidAPIKey: If the api key is invalid
        :raises ValueError: If the response code is not 200
        :return: The requested token response
        """

        response = requests.post(
            self._token_url,
            data={
                "grant_type": "password",
                "username": "api-key",
                "client_id": "ee910196-cd8a-11ed-b74d-bb563cd16e9d",
                "password": self.api_key,
                "scope": scope,
            },
        )

        try:
            response.raise_for_status()
        except requests.HTTPError as http_error:
            error_message = (
                "Sorry, we were unable to authenticate your "
                "Neural Magic Account API key. If you believe "
                "this is a mistake, contact support@neuralmagic.com "
                "to help remedy this issue."
            )
            raise InvalidAPIKey(error_message) from http_error

        if response.status_code != 200:
            raise ValueError(f"Unknown response code {response.status_code}")
        return response.json()

    def authenticate(self):
        """
        Authenticate credentials with sparsify api

        :param scope: The scope to request for the token
        :return: The requested access token
        """

        self._get_token_response()
        _LOGGER.info("Successfully authenticated with Neural Magic Account API key. ")

    def get_access_token(self, scope: str = "pypi:read") -> str:
        """
        Get the access token for the specified scope

        :param scope: The scope to request for the token
        :return: The requested access token
        """
        return self._get_token_response(scope=scope)["access_token"]

    def get_user_info(self) -> UserInfo:
        """
        Get the user info for current credentials

        :precodition: The credentials are authenticated
        :return: The requested UserInfo object
        """
        id_token = self._get_token_response(scope="sparsify:write")["id_token"]
        user_info_segment = id_token.split(".")[1] + "=="
        user_info = json.loads(base64.urlsafe_b64decode(user_info_segment))
        return UserInfo.from_dict(user_info)
