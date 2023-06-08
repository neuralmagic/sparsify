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

import pytest

from sparsify.utils.helpers import copy


@pytest.fixture
def non_existent_dir(tmp_path):
    yield tmp_path / "non_existent_temp_dir"


@pytest.fixture
def non_existent_file(tmp_path):
    yield tmp_path / "non_existent_temp_file.txt"


@pytest.fixture
def existing_empty_dir(tmp_path):
    dir = tmp_path / "existing_empty_dir"
    dir.mkdir()
    yield dir


@pytest.fixture
def existing_file(tmp_path):
    file_ = tmp_path / "existing_file.txt"
    file_.write_text("test")
    yield file_


@pytest.fixture
def existing_dir_with_file(tmp_path):
    dir = tmp_path / "temp_dir_with_file"
    dir.mkdir()
    file_ = dir / "existing_file.txt"
    file_.write_text("test")
    yield dir


@pytest.mark.parametrize(
    "path, exists",
    [
        (pytest.lazy_fixture("non_existent_dir"), False),
        (pytest.lazy_fixture("non_existent_file"), False),
        (pytest.lazy_fixture("existing_empty_dir"), True),
        (pytest.lazy_fixture("existing_file"), True),
        (pytest.lazy_fixture("existing_dir_with_file"), True),
    ],
)
def test_check_existence(path, exists):
    assert path.exists() == exists


@pytest.mark.parametrize(
    "path_a, path_b, expected",
    [
        (
            pytest.lazy_fixture("non_existent_dir"),
            pytest.lazy_fixture("non_existent_dir"),
            FileNotFoundError(),
        ),
        (
            pytest.lazy_fixture("non_existent_dir"),
            pytest.lazy_fixture("non_existent_file"),
            FileNotFoundError(),
        ),
        (
            pytest.lazy_fixture("non_existent_file"),
            pytest.lazy_fixture("non_existent_dir"),
            FileNotFoundError(),
        ),
        (
            pytest.lazy_fixture("non_existent_file"),
            pytest.lazy_fixture("non_existent_file"),
            FileNotFoundError(),
        ),
        (
            pytest.lazy_fixture("non_existent_dir"),
            pytest.lazy_fixture("existing_empty_dir"),
            FileNotFoundError(),
        ),
        (
            pytest.lazy_fixture("non_existent_dir"),
            pytest.lazy_fixture("existing_file"),
            FileNotFoundError(),
        ),
        (
            pytest.lazy_fixture("non_existent_file"),
            pytest.lazy_fixture("existing_empty_dir"),
            FileNotFoundError(),
        ),
        (
            pytest.lazy_fixture("non_existent_file"),
            pytest.lazy_fixture("existing_file"),
            FileNotFoundError(),
        ),
        (
            pytest.lazy_fixture("existing_empty_dir"),
            pytest.lazy_fixture("non_existent_dir"),
            None,
        ),
        (
            pytest.lazy_fixture("existing_empty_dir"),
            pytest.lazy_fixture("non_existent_file"),
            ValueError(),
        ),
        (
            pytest.lazy_fixture("existing_file"),
            pytest.lazy_fixture("non_existent_dir"),
            None,
        ),
        (
            pytest.lazy_fixture("existing_file"),
            pytest.lazy_fixture("non_existent_file"),
            None,
        ),
        (
            pytest.lazy_fixture("existing_empty_dir"),
            pytest.lazy_fixture("non_existent_dir"),
            None,
        ),
        (
            pytest.lazy_fixture("existing_empty_dir"),
            pytest.lazy_fixture("non_existent_file"),
            ValueError(),
        ),
    ],
)
def test_copy(path_a, path_b, expected):
    if isinstance(expected, (OSError, ValueError)):
        with pytest.raises(expected.__class__):
            copy(path_a, path_b)
    else:
        copy(path_a, path_b)
        if path_a.is_dir():
            assert path_b.is_dir()
            assert list(path_a.iterdir()) == list(path_b.iterdir())
        else:
            assert path_b.is_file()
            assert path_a.read_text() == path_b.read_text()
