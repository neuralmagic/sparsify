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

import pytest

from click.testing import CliRunner
from sparsify.recipe_template.cli import parse_args


def _test_default_values(args):
    assert args.get("pruning") == "false"
    assert args.get("quantization") == "false"
    assert args.get("lr") == "constant"


def _run_with_cli_runner(args: List[str]):
    runner = CliRunner()
    result = runner.invoke(parse_args, args=args)
    return result


@pytest.mark.parametrize(
    "cli_args",
    [
        "--pruning false --quantization false",
        "",
        "-p false -q false --lr constant",
    ],
)
def test_defaults(cli_args):
    result = _run_with_cli_runner(cli_args.split())
    assert result.exit_code == 0

    output = parse_args.main(cli_args.split(), standalone_mode=False)
    _test_default_values(output)


@pytest.mark.parametrize(
    "cli_args",
    [
        "--pruning true --quantization true",
        "",
        "-p true -q false --lr constant",
        "-p gmp -q vnni --lr cyclic",
    ],
)
def test_valid_invocation(cli_args):
    result = _run_with_cli_runner(cli_args.split())
    assert result.exit_code == 0


@pytest.mark.parametrize(
    "cli_args",
    ["--pruning blah", "--quantization blah", "--lr blah", "model"],
)
def test_click_error_on_invalid_invocation(cli_args):
    result = _run_with_cli_runner(cli_args.split())
    assert result.exit_code == 2
