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
from sparsify.recipe_template.cli import main


def _run_with_cli_runner(args: List[str]):
    runner = CliRunner()
    result = runner.invoke(main, args=args)
    return result


@pytest.mark.parametrize(
    "cli_args",
    [
        "--pruning true --quantization true",
        "",
        "--pruning true --quantization false --lr constant",
        "--pruning gmp --quantization true --lr cyclic --target vnni",
        "--pruning false --quantization false",
        "",
        "--target tensorrt",
        "--target vnni",
        "--help",
    ],
)
@patch("sparsify.recipe_template_module.cli.recipe_template")
def test_valid_invocation(recipe_template_func, cli_args):
    result = _run_with_cli_runner(cli_args.split())
    assert result.exit_code == 0


@pytest.mark.parametrize(
    "cli_args",
    ["--pruning blah", "--quantization blah", "--lr blah", "--target blah"],
)
@patch("sparsify.recipe_template_module.cli.recipe_template")
def test_click_error_on_invalid_invocation(recipe_template_func, cli_args):
    result = _run_with_cli_runner(cli_args.split())
    assert result.exit_code == 2
