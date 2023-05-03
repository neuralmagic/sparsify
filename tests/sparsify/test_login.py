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
File to test `sparsify.login` command line utility
"""

from pathlib import Path

from click.testing import CliRunner
from sparsify.login import main


def test_login():
    api_key: str = "8WQrBFuQiQqZV9HgQwDvyU9hLiWqfdgY"

    runner = CliRunner()
    # test with api key provided
    result = runner.invoke(
        main,
        [
            "--api-key",
            api_key,
        ],
    )
    assert result.exit_code == 0

    # test with no api key provided (will use credentials file)
    result = runner.invoke(main)
    assert result.exit_code == 0

    # test with no api key provided and no credentials file
    # (will fail with SparsifyLoginRequired)

    # remove credentials file
    sparsify_credentials_path: Path = Path.home().joinpath(
        ".config", "neuralmagic", "credentials.json"
    )

    if sparsify_credentials_path.exists():
        sparsify_credentials_path.unlink()

    result = runner.invoke(main)
    assert result.exit_code != 0
