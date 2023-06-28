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
from typing import Optional

import click
from sparsezoo.analyze.cli import CONTEXT_SETTINGS
from sparsezoo.utils import TASKS_WITH_ALIASES
from sparsify.cli.opts import validate_use_case
from sparsify.utils import set_log_level
from sparsify.utils.package_helpers import package
from sparsify.version import version_major_minor


_LOGGER = logging.getLogger(__name__)


@click.command(context_settings=CONTEXT_SETTINGS)
@click.version_option(version=version_major_minor)
@click.option(
    "--task",
    type=click.Choice(TASKS_WITH_ALIASES, case_sensitive=False),
    callback=validate_use_case,
    help="The task to package deployment directory for",
    required=True,
)
@click.option(
    "--experiment",
    type=click.Path(exists=True, file_okay=False, dir_okay=True, readable=True),
    help="The directory containing the deployment files to package, "
    "or sparsify experiment-id (Not yet supported)",
    required=True,
)
@click.option(
    "--logging-config",
    type=click.Path(exists=True, file_okay=True, dir_okay=False, readable=True),
    help="The logging configuration file to use",
)
@click.option(
    "--deploy-type",
    type=click.Choice(["server"], case_sensitive=False),
    help="Sets the deployment type, only supports `server`",
    default="server",
    required=True,
)
@click.option(
    "--processing_file",
    type=str,
    default=None,
    help="A python file containing a pre-processing (`preprocess`) "
    "and/or post-processing (`postprocess`) function",
)
@click.option(
    "--output_dir",
    type=click.Path(file_okay=False, dir_okay=True, writable=True),
    default=None,
    help="A directory where the packaged deployment directory will "
    "be saved, if not specified it will be saved in the parent "
    "directory of the experiment directory, under `deployment` folder",
)
@click.option("--debug/--no-debug", default=False, hidden=True)
def main(
    experiment: str,
    task: str,
    logging_config: Optional[str],
    deploy_type: str,
    processing_file: Optional[str],
    output_dir: Optional[str],
    debug: bool = False,
):
    set_log_level(logger=_LOGGER, level=logging.DEBUG if debug else logging.INFO)
    if deploy_type != "server":
        raise NotImplementedError(f"Deployment type {deploy_type} is not yet supported")

    package(
        experiment=experiment,
        task=task,
        logging_config=logging_config,
        deploy_type=deploy_type,
        processing_file=processing_file,
        output_dir=output_dir,
    )


if __name__ == "__main__":
    main()
