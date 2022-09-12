#!/usr/bin/env python

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

import logging
import sys
from typing import Any, Dict

import click
from sparsify import recipe_template
from sparsify.version import __version__


_LOGGER = logging.getLogger(__name__)


@click.command()
@click.version_option(version=__version__)
@click.option(
    "--pruning",
    "-p",
    # other algos will be added in future
    type=click.Choice(["true", "false", "gmp"], case_sensitive=False),
    default="false",
    help="Specify if recipe should include pruning steps, can also take in the "
    "name of a pruning algorithm",
    show_default=True,
)
@click.option(
    "--quantization",
    "-q",
    # other target hardware(s) will be added in future
    type=click.Choice(["true", "false", "vnni"], case_sensitive=False),
    default="false",
    help="Specify if recipe should include quantization steps, can also take in "
    "the name of the target hardware",
    show_default=True,
)
@click.option(
    "--lr",
    type=click.Choice(
        ["constant", "cyclic", "stepped", "exponential", "linear"], case_sensitive=False
    ),
    default="constant",
    help="Specify growth function for learning rate",
    show_default=True,
)
def parse_args(**kwargs) -> Dict[str, Any]:
    """
    Utility to create a recipe template based on specified options

    Example for using sparsify.recipe_template:

         `sparsify.recipe_template -p true -q true`

         `sparsify.recipe_template -q vnni --lr constant `
    """
    _LOGGER.debug(f"{kwargs}")
    return kwargs


def main():
    """
    Driver function
    """
    context = parse_args.make_context("parse_args", args=sys.argv[1:])
    args: Dict[str, Any] = context.params
    template = recipe_template(**args)
    print(f"Template:\n{template}")


if __name__ == "__main__":
    main()
