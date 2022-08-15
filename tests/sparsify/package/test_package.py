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

from unittest.mock import patch

import pytest

from sparsify import package


@patch("sparsify.package_module.main.search_function")
@patch("sparsify.package_module.main.download_deployment_directory_from_stub")
def test_valid_execution(download_function, search_function):
    download_function.return_value = ""
    search_function.return_value = ["zoo://vnni"]

    assert package(directory=None, task="ic") == ""
    assert package(task="ic") == ""
    assert package(dataset="imagenet") == ""
    assert package(dataset="imagenet", scenario="vnni") == ""
    assert package(task="qa", dataset="squad", scenario=None) == ""
    assert package(task="qa", dataset="squad", scenario="vnni") == ""


@patch("sparsify.package_module.main.search_function")
def test_value_error(search_function):
    # search results empty
    search_function.return_value = []
    with pytest.raises(ValueError):
        package(task="ic")

    # deployment scenario not found
    search_function.return_value = ["zoo://blah"]
    with pytest.raises(ValueError):
        package(task="ic", scenario="vnni")

    # at-least dataset or task must be specified
    with pytest.raises(ValueError):
        package(scenario="vnni")

    # at-least dataset or task must be specified
    with pytest.raises(ValueError):
        package()
