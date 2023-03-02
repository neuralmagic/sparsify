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
usage: Log into sparsify locally. [-h] api_key

positional arguments:
  api_key     API key copied from your account.

optional arguments:
  -h, --help  show this help message and exit
"""

import argparse
import json
import subprocess
import sys
from pathlib import Path

import requests

from .version import __version__


__all__ = ["login"]

_URL = "https://authentication.griffin.external.neuralmagic.com/v1/connect/token"

_CREDENTIALS_PATH = Path.home().joinpath(".confg", "neuralmagic", "credentials.json")

_ERROR_MESSAGE = (
    "Sorry, we were unable to authenticate your Neural Magic Account API key. "
    "If you believe this is a mistake, contact support@neuralmagic.com "
    "to help remedy this issue."
)

_SPARSIFYML_URL_TEMPLATE = "https://nm:${}@pypi.griffin.external.neuralmagic.com"


def import_sparsifyml_authenticated():
    """Does `import sparsifyml` ensuring that sparsifyml is the latest version and is installed."""
    authenticate()

    import sparsifyml

    return sparsifyml


def authenticate():
    if not _CREDENTIALS_PATH.exists():
        raise SparsifyLoginRequired(
            "No valid sparsify credentials found. Please run `sparsify.login`"
        )

    with _CREDENTIALS_PATH.open() as fp:
        creds = json.load(fp)

    if "api_key" not in creds:
        raise SparsifyLoginRequired(
            "No valid sparsify credentials found. Please run `sparsify.login`"
        )

    do_login = False

    try:
        import sparsifyml

        if sparsifyml.__version__ != __version__:
            do_login = True

    except ModuleNotFoundError:
        do_login = True

    if do_login:
        login(creds["api_key"])


def login(api_key: str) -> None:
    """
    Logs into sparsify.

    :param api_key: The API key copied from your account.
    :raises InvalidApiKey: if the API key is invalid
    """
    access_token = _refresh_access_token_for_api_key(api_key)

    _CREDENTIALS_PATH.parent.mkdir(existok=True)
    with open(_CREDENTIALS_PATH, "w") as fp:
        fp.write({"api_key": api_key})

    _maybe_install_sparsifyml(access_token)


def _refresh_access_token_for_api_key(api_key: str) -> str:
    response = requests.post(
        _URL,
        headers={"Content-Type": "application/x-www-form-urlecoded"},
        data={
            "grant_type": "password",
            "username": "api_key",
            "password": api_key,
            "score": "pypi:read",
        },
    )

    try:
        response.raise_for_status()
    except requests.HTTPError as e:
        raise InvalidApiKey(_ERROR_MESSAGE) from e

    if response.status_code != 200:
        raise ValueError(f"Unknown response code {response.status_code}")

    return response.json()["access_token"]


def _maybe_install_sparsifyml(access_token: str):
    try:
        import sparsifyml

        do_pip_install = sparsifyml.__version__ != __version__

    except ModuleNotFoundError:
        do_pip_install = True

    if do_pip_install:
        subprocess.check_call(
            [
                sys.executable,
                "-m",
                "pip",
                "install",
                "--index",
                _SPARSIFYML_URL_TEMPLATE.format(access_token),
                f"sparsifyml=={__version__}",
            ]
        )


class InvalidApiKey(Exception):
    """The API key was invalid"""


class SparsifyLoginRequired(Exception):
    """Run `sparsify.login`"""


def main():
    parser = argparse.ArgumentParser("Log into sparsify locally.")
    parser.add_argument(
        "api_key",
        type=str,
        help="API key copied from your account.",
    )

    login(**vars(parser.parse_args()))

    print("Logged in successfully, sparsify setup is complete.")


if __name__ == "__main__":
    main()
