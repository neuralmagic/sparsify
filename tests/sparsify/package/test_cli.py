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
from typing import List
from unittest.mock import patch

import pytest

from click.testing import CliRunner
from sparsify.package.cli import main


def _run_with_cli_runner(args: List[str]):
    runner = CliRunner()
    result = runner.invoke(main, args=args)
    return result


@pytest.mark.parametrize(
    "cli_args",
    [
        "--task blah",
        "--task ic --optimizing_metric blah",
        "--dataset blah",
        "--dataset mnli --task blah",
        "-d",
        "-m",
        "-t",
    ],
)
@patch("sparsify.package_module.cli.package")
def test_click_error_on_invalid_invocation(package_function, cli_args):
    result = _run_with_cli_runner(cli_args.split())
    assert result.exit_code == 2


@pytest.mark.parametrize("cli_args", ["", "--optimizing-metric accuracy"])
@patch("sparsify.package_module.cli.package")
def test_value_error_when_dataset_and_task_not_provided(package_function, cli_args):
    with pytest.raises(ValueError):
        main.main(cli_args.split(), standalone_mode=False)


@pytest.mark.parametrize(
    "cli_args",
    [
        "--task ic",
        "--dataset imagenette",
        "--task ic --dataset imagenette"
        "deployment_directory --task ic --dataset imagenette --optimizing-metric "
        "accuracy",
        "--task ic --optimizing-metric accuracy --optimizing_metric compression",
    ],
)
@patch("sparsify.package_module.cli.package")
def test_valid_invocation(package_function, cli_args):
    result = _run_with_cli_runner(cli_args.split())
    assert result.exit_code == 0
