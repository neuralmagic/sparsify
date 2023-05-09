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
import functools
import inspect
import json
import logging
import uuid
from dataclasses import dataclass
from enum import Enum, unique
from json import JSONDecodeError
from pathlib import Path
from typing import Any, Dict, List, Optional
from urllib.parse import urljoin

import requests

from sparsify.utils.exceptions import InvalidAPIKey, SparsifyLoginRequired


__all__ = [
    "ExperimentStatus",
    "get_non_existent_filename",
    "set_log_level",
    "strtobool",
    "UserInfo",
    "SparsifyCredentials",
    "SparsifyClient",
    "SparsifySession",
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


def debug_logging(function):
    """
    A decorator to log the function name, args, and kwargs before call,
    and the function name and return value after call
    """

    @functools.wraps(function)
    def wrapper(*args, **kwargs):
        _LOGGER.debug(
            f"Calling function {function.__qualname__} with "
            f"args {args} and kwargs {kwargs}"
        )
        result = function(*args, **kwargs)
        _LOGGER.debug(f"Function {function.__name__} returned {result}")
        return result

    return wrapper


@unique
class ExperimentStatus(Enum):
    """
    A class to represent the status of a Sparsify experiment
    """

    PENDING = "pending"
    INITIALIZED = "initialized"
    IN_PROGRESS = "in_progress"
    COMPLETE = "complete"
    ERROR = "error"

    @classmethod
    def initialization_pending(cls, status: str) -> bool:
        """
        :return: True if the experiment is pending initialization,
            or errored out (In which case it could be
            initialized again)
        """
        return status in [cls.PENDING.value, cls.ERROR.value]


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


class SparsifySession(requests.Session):
    """
    A requests session that uses the sparsify base url
    """

    def __init__(self):
        super().__init__()
        self.base_url = "https://sparsify.griffin.internal.neuralmagic.com"

    def request(self, method, url, *args, **kwargs):
        joined_url = urljoin(self.base_url, url)

        response = super().request(method, joined_url, *args, **kwargs)
        try:
            response.raise_for_status()
        except requests.HTTPError as http_error:
            raise RuntimeError(
                "Unable to access sparsify API, "
                f"Error Code: {http_error.response.status_code}"
            ) from http_error
        return response


class SparsifyClient(object):
    """
    A client for the sparsify API

    :param access_token: The access token to use for the client
    """

    def __init__(self, access_token: str):
        self._session: SparsifySession = SparsifySession()
        self._session.headers.update(
            {
                "Authorization": f"Bearer {access_token}",
                "Content-Type": "application/json",
                "accept": "application/json",
            }
        )

    def get(self, url: str, *args, **kwargs):
        """
        Make a get request to the sparsify API

        :param url: The endpoint to make the request to
        """
        return self._session.get(url, *args, **kwargs)

    def post(self, url: str, *args, **kwargs):
        """
        Make a post request to the sparsify API

        :param url: The endpoint to make the request to
        """
        return self._session.post(url, *args, **kwargs)

    def put(self, url: str, *args, **kwargs):
        """
        Make a put request to the sparsify API

        :param url: The endpoint to make the request to
        """
        return self._session.put(url, *args, **kwargs)

    def delete(self, url: str, *args, **kwargs):
        """
        Make a delete request to the sparsify API

        :param url: The endpoint to make the request to
        """
        return self._session.delete(url, *args, **kwargs)

    @debug_logging
    def health_check(self):
        """
        Checks if the sparsify API is up and running
        """
        return self.get("/health/livez")

    @debug_logging
    def create_project_if_does_not_exist(
        self, user_info: UserInfo, project_id: Optional[str] = None
    ):
        """
        Create a project for the user if it does not exist.
        Additionally, if the project_id is provided, verify it exists

        :param user_info: The user's info
        :param project_id: Optional project id to verify
        :return: The project id
        """
        endpoint = "/projects"
        if project_id:
            try:
                self.get(url=f"{endpoint}/{project_id}")
            except requests.HTTPError as http_error:
                raise ValueError(
                    f"Could not verify if project: {project_id} exists."
                ) from http_error
            return project_id

        payload = dict(
            name=f"{user_info.name}_sparsify_project_{uuid.uuid4()}",
            description="sparsify_project created by sparsify.init for "
            f"{user_info.email}",
            owner_user_id=user_info.user_id,
            account_id=user_info.account_id,
        )

        _LOGGER.info("Creating a new project")
        response = self.post(url=endpoint, data=json.dumps(payload))
        project_id = response.json()["project_id"]
        _LOGGER.info(f"Project created with id: {project_id}")
        return project_id

    @debug_logging
    def create_experiment_if_does_not_exist(
        self,
        user_info: UserInfo,
        project_id: str,
        experiment_type: Optional[str] = None,
        use_case: Optional[str] = None,
        experiment_id: Optional[str] = None,
    ) -> str:
        """
        If the experiment_id is provided, check if it exists and return it.
        Otherwise, create a new experiment.

        :param user_info: The user's info
        :param project_id: The project id
        :param experiment_type: The type of experiment, needed to create
            a new experiment if experiment_id is not provided
        :param use_case: The use case, needed to create a new experiment
            if experiment_id is not provided
        :param experiment_id: Optional experiment id to verify
        :return: The experiment id
        """
        endpoint = "/experiments"

        if experiment_id:
            try:
                self.get(url=f"{endpoint}/{experiment_id}")
            except requests.HTTPError as http_error:
                raise ValueError(
                    f"Could not verify if experiment: {experiment_id} exists."
                ) from http_error
            return experiment_id

        if experiment_type is None:
            raise ValueError(
                "--experiment-type required when --experiment-id is not specified."
            )
        if use_case is None:
            raise ValueError(
                "--use-case required when --experiment-id is not specified."
            )

        experiment_name = (
            f"{user_info.name}_sparsify_experiment_"
            f"{experiment_type}_{use_case}_{uuid.uuid4()}"
        )
        payload = dict(
            name=experiment_name,
            experiment_type=experiment_type,
            owner_user_id=user_info.user_id,
            account_id=user_info.account_id,
            project_id=project_id,
        )
        _LOGGER.info("Creating a new experiment")
        response = self.post(url=endpoint, data=json.dumps(payload))
        experiment_id = response.json()["experiment_id"]
        _LOGGER.info(f"Experiment created with id: {experiment_id}")

        self.update_experiment_status(
            experiment_id=experiment_id, status=ExperimentStatus.PENDING.value
        )
        return experiment_id

    @debug_logging
    def create_model_id_if_does_not_exist(
        self,
        user_info: UserInfo,
        model: str,
        project_id: str,
        experiment_id: str,
        model_id: Optional[str] = None,
    ) -> str:
        """
        Create a new model id for the user, if it does not exists.
        Additionally, if the model_id is provided, verify it exists

        :param user_info: The user's info
        :param model: The path to the model
        :param project_id: The project id
        :param experiment_id: The experiment id
        :param model_id: Optional model id to verify
        :return: The model id
        """
        endpoint = "/models"  # noqa: F841

        if model_id:
            try:
                self.get(url=f"{endpoint}/{model_id}")
            except requests.HTTPError as http_error:
                raise ValueError(
                    f"Could not verify if model: {model_id} exists."
                ) from http_error
        # update needed payload
        payload = dict()  # noqa: F841

        _LOGGER.info("Creating a new model")
        # response = self.post(url=endpoint, data=json.dumps(payload))
        # response_data = response.json()

        # TODO: uncomment above and remove below when backend is ready
        response_data = dict(model_id="test_model_id")
        model_id = response_data["model_id"]

        _LOGGER.info(f"Created model id: {model_id}")
        return model_id

    @debug_logging
    def create_analysis(
        user_info: UserInfo,
        model_id: str,
        project_id: str,
        experiment_id: str,
        analysis_type: str,
        analysis_file: str,
    ) -> str:
        """
        Create a new analysis for the user
        Note: As of now this function always returns a dummy analysis id,
        this will be updated when the backend is ready

        :param user_info: The user's info
        :param model_id: The model id
        :param project_id: The project id
        :param experiment_id: The experiment id
        :param analysis_type: The type of analysis
        :param analysis_file: The analysis file
        :return: The analysis id
        """
        endpoint = "/v1/analyses"  # noqa: F841
        files = dict(analysis_file=open(analysis_file))  # noqa: F841
        payload = dict(  # noqa: F841
            analysis_type=analysis_type,
            owner_user_id=user_info.user_id,
            account_id=user_info.account_id,
            project_id=project_id,
            experiment_id=experiment_id,
            model_id=model_id,
        )

        _LOGGER.info("Creating a new analysis")
        # response = self.put(url=endpoint, data=json.dumps(payload), files=files)
        # response_data = response.json()

        # TODO: uncomment above and remove below when backend is ready
        response_data = dict(analysis_id="test_analysis_id")
        analysis_id = response_data["analysis_id"]

        _LOGGER.info(f"Created analysis id: {analysis_id}")
        return analysis_id

    @debug_logging
    def update_experiment_status(self, experiment_id: str, status: str):
        """
        Update the experiment status

        :param experiment_id: The experiment id
        :param status: The status to update to
        """
        endpoint = f"/v1/experiments/{experiment_id}"
        payload = dict(status=status)

        _LOGGER.info(f"Updating experiment status to {status}")
        self.put(url=endpoint, data=json.dumps(payload))
        _LOGGER.info(f"Experiment status updated to {status}")

    @debug_logging
    def update_experiment_eval_metric(self, experiment_id: str, eval_metric: str):
        """
        Update the experiment eval metric

        :param experiment_id: The experiment id
        :param eval_metric: The eval metric to update to
        """
        endpoint = f"/v1/experiments/{experiment_id}"
        payload = dict(eval_metric=eval_metric)

        _LOGGER.info(f"Updating experiment status to {eval_metric}")
        self.put(url=endpoint, data=json.dumps(payload))
        _LOGGER.info(f"Experiment status updated to {eval_metric}")
