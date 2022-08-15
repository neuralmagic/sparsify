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

from click.testing import CliRunner
from sparsify.package_.cli import parse_args


def _test_default_values(args):
    assert args.get("directory") == "deployment_directory"
    assert args.get("optimizing_metric") == ("accuracy",)


def run_with_cli_runner(args):
    runner = CliRunner()
    result = runner.invoke(parse_args, args=args)
    return result


@pytest.mark.parametrize(
    "cli_args",
    [
        "--task ic",
        "--dataset imagenette",
        "--task ic --dataset imagenette"
        "deployment_directory --task ic --dataset imagenette --optimizing-metric "
        "accuracy",
    ],
)
def test_valid_invocation(cli_args):
    result = run_with_cli_runner(cli_args.split())
    assert result.exit_code == 0

    output = parse_args.main(cli_args.split(), standalone_mode=False)
    _test_default_values(output)


@pytest.mark.parametrize(
    "cli_args",
    [
        "--task blah",
    ],
)
def test_click_error_on_invalid_invocation(cli_args):
    result = run_with_cli_runner(cli_args.split())
    assert result.exit_code == 2


@pytest.mark.parametrize("cli_args", ["", "--optimizing-metric accuracy"])
def test_value_error_when_dataset_and_task_not_provided(cli_args):
    with pytest.raises(ValueError):
        parse_args.main(cli_args.split(), standalone_mode=False)
