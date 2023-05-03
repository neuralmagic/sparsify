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
A file to test sparsify helpers and utilities
"""

import json
from pathlib import Path

import pytest
from requests import HTTPError

from sparsify.utils.exceptions import InvalidAPIKey, SparsifyLoginRequired
from sparsify.utils.helpers import SparsifyCredentials, UserInfo


@pytest.fixture
def api_key() -> str:
    return "8WQrBFuQiQqZV9HgQwDvyU9hLiWqfdgY"


@pytest.fixture
def sparsify_credentials(api_key: str) -> SparsifyCredentials:
    return SparsifyCredentials.from_api_key(api_key=api_key)


def test_sparsify_credentials_errors():
    sparsify_credentials_path: Path = Path.home().joinpath(
        ".config", "neuralmagic", "credentials.json"
    )
    # remove credentials file
    if sparsify_credentials_path.exists():
        sparsify_credentials_path.unlink()
    assert sparsify_credentials_path.exists() is False
    with pytest.raises(SparsifyLoginRequired):
        SparsifyCredentials()

    sparsify_credentials_path.parent.mkdir(parents=True, exist_ok=True)

    # create empty credentials file
    sparsify_credentials_path.touch()
    with pytest.raises(SparsifyLoginRequired):
        SparsifyCredentials()

    sparsify_credentials_path.unlink()
    # create credentials file with no api key
    with open(sparsify_credentials_path, "w") as fp:
        json.dump({}, fp)
        with pytest.raises(SparsifyLoginRequired):
            SparsifyCredentials()


def test_sparsify_credentials(api_key: str):
    sparsify_credentials_path: Path = Path.home().joinpath(
        ".config", "neuralmagic", "credentials.json"
    )
    sparsify_credentials_path.parent.mkdir(parents=True, exist_ok=True)
    with open(sparsify_credentials_path, "w") as fp:
        json.dump({"api_key": api_key}, fp)
    sparsify_credentials = SparsifyCredentials()
    assert sparsify_credentials.api_key == api_key


def test_sparsify_credentials_from_api_key(api_key: str):
    sparsify_credentials = SparsifyCredentials.from_api_key(api_key=api_key)
    assert sparsify_credentials.api_key == api_key


def test_valid_authentication(api_key: str):
    sparsify_credentials = SparsifyCredentials.from_api_key(api_key=api_key)
    sparsify_credentials.authenticate()


def test_invalid_authentication():
    with pytest.raises((InvalidAPIKey, HTTPError)):
        SparsifyCredentials.from_api_key(api_key="invalid")


@pytest.mark.parametrize("scope", ["pypi:read", "sparsify:write"])
def test_get_access_token(sparsify_credentials: SparsifyCredentials, scope: str):
    assert sparsify_credentials.get_access_token() is not None
    assert isinstance(sparsify_credentials.get_access_token(), str)


def test_get_user_info(sparsify_credentials: SparsifyCredentials):
    actual = sparsify_credentials.get_user_info()
    expected = UserInfo(
        name="Joe Demo",
        user_id="1d8ad7b8-6007-4bcc-a870-20f91e56dc01",
        email="jdemo@neuralmagic.com",
        email_verified=False,
        account_id="c61a3625-b699-41d8-b0a8-0b2b6e0307b6",
        client_id="ee910196-cd8a-11ed-b74d-bb563cd16e9d",
        aud=["nm:external", "ee910196-cd8a-11ed-b74d-bb563cd16e9d"],
    )

    assert actual == expected
