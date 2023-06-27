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
Usage: sparsify.login [OPTIONS] API_KEY

  sparsify.login utility to log into sparsify locally.

  sparsify.login [API_KEY]

  API_KEY: The API key copied from your sparsify account

Options:
  --version  Show the version and exit.  [default: False]
  --help     Show this message and exit.  [default: False]
"""

import importlib
import logging
import subprocess
import sys
from types import ModuleType
from typing import Optional

import click
from sparsezoo.analyze.cli import CONTEXT_SETTINGS
from sparsify.utils import SparsifyCredentials, set_log_level
from sparsify.utils.exceptions import InvalidAPIKey, SparsifyLoginRequired
from sparsify.version import is_release, version_major_minor


__all__ = [
    "login",
    "import_sparsifyml_authenticated",
    "authenticate",
]


_LOGGER = logging.getLogger(__name__)


@click.command(context_settings=CONTEXT_SETTINGS)
@click.argument("api-key", type=str, required=False)
@click.version_option(version=version_major_minor)
@click.option("--debug/--no-debug", default=False, hidden=True)
def main(api_key: Optional[str] = None, debug: bool = False):
    """
    sparsify.login utility to log into sparsify locally.

    sparsify.login [API_KEY]

    API_KEY: The API key copied from your sparsify account
    """
    set_log_level(logger=_LOGGER, level=logging.DEBUG if debug else logging.INFO)
    _LOGGER.info("Logging into sparsify...")

    login(api_key=api_key)

    _LOGGER.debug("locals: %s", locals())
    _LOGGER.info("Logged in successfully, sparsify setup is complete.")


def login(api_key: Optional[str] = None) -> None:
    """
    Logs into sparsify.

    :param api_key: The API key copied from your account
    """
    if api_key:
        credentials = SparsifyCredentials.login(api_key=api_key)
    else:
        _LOGGER.info(
            "No API key provided, attempting to use credentials stored on disk"
        )
        credentials = SparsifyCredentials()
    install_sparsifyml(access_token=credentials.get_access_token())


def install_sparsifyml(access_token: str) -> None:
    """
    Installs `sparsifyml` from the authenticated pypi server, if not already
    installed or if the version is not the same as the current version.

    :param access_token: The access token to use for authentication
    """
    sparsifyml_spec = importlib.util.find_spec("sparsifyml")
    sparsifyml = importlib.import_module("sparsifyml") if sparsifyml_spec else None

    sparsifyml_installed = (
        sparsifyml_spec is not None
        and sparsifyml.version_major_minor == version_major_minor
    )

    if not sparsifyml_installed:
        _LOGGER.info(
            "Installing sparsifyml version %s from neuralmagic pypi server",
            version_major_minor,
        )
        pypi_url_template = "https://nm:{}@pypi.neuralmagic.com"
        sparsifyml_package_name = "sparsifyml" if is_release else "sparsifyml-nightly"
        subprocess.check_call(
            [
                sys.executable,
                "-m",
                "pip",
                "install",
                "--index-url",
                pypi_url_template.format(access_token),
                f"{sparsifyml_package_name}~={version_major_minor}",
            ]
        )
    else:
        _LOGGER.info(
            f"sparsifyml version {version_major_minor} is already installed, "
            "skipping installation from neuralmagic pypi server"
        )


def import_sparsifyml_authenticated() -> Optional[ModuleType]:
    """
    Authenticates and imports sparsifyml.
    """
    authenticate()
    import sparsifyml

    return sparsifyml


def authenticate(api_key: Optional[str] = None) -> bool:
    """
    Authenticates with sparsify server using the provided API key or the API key
    stored on disk.

    :param api_key: The API key copied from your account, if not provided
        will attempt to use the credentials stored on disk
    :return: True if authenticated, False otherwise
    """
    try:
        login(api_key=api_key)
    except (InvalidAPIKey, SparsifyLoginRequired):
        return False
    return True


if __name__ == "__main__":
    main()
