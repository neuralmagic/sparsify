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

import subprocess

import pytest
import requests

from sparsify.package.config import BASE_URL


smallest_qa_model = (
    "zoo:nlp/question_answering/distilbert-none/pytorch/huggingface"
    "/squad/pruned80_quant-none-vnni"
)


@pytest.mark.dependency()
def test_server_is_up():
    response = requests.get(BASE_URL)
    assert response.status_code == 200


@pytest.mark.dependency(depends=["test_server_is_up"])
@pytest.mark.slow()
@pytest.mark.parametrize(
    "command, expected_stub",
    [("sparsify.package -t qa -d squad -m compression", smallest_qa_model)],
)
def test_end_to_end_run(command, expected_stub):
    subprocess.check_call(command.split())

    output = subprocess.check_output(command.split())
    assert expected_stub in str(output)
