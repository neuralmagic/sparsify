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
from pathlib import Path

import yaml

from sparsify.auto.tasks import TaskRunner
from sparsify.auto.utils import (
    api_request_config,
    create_save_directory,
    initialize_banner_logger,
)
from sparsify.schemas import APIArgs
from sparsify.schemas.auto_api import SparsificationTrainingConfig
from sparsify.utils import get_task_info
from tensorboard.program import TensorBoard
from tensorboard.util import tb_logging


_LOGGER = logging.getLogger("auto_banner")


def main(api_args: APIArgs):
    initialize_banner_logger()

    # Set up directory for saving
    (
        train_directory,
        log_directory,
        deploy_directory,
    ) = create_save_directory(api_args)

    if api_args.task in get_task_info("finetune").aliases:
        _LOGGER.info(
            "Running finetuning. "
            "Currently only arguments passed for use-case and data will be considered"
        )
        config = SparsificationTrainingConfig(
            task=api_args.task, dataset=api_args.dataset, base_model=None, recipe=None
        )
        runner = TaskRunner.create(config)
        runner.train(train_directory=train_directory, log_directory=log_directory)
        return

    _suppress_tensorboard_logs()

    # Launch tensorboard server
    tensorboard_server = TensorBoard()
    tensorboard_server.configure(argv=[None, "--logdir", log_directory])
    url = tensorboard_server.launch()
    _LOGGER.info(f"TensorBoard listening on {url}")

    # Request config from api and instantiate runner

    raw_config = api_request_config(api_args)
    config = SparsificationTrainingConfig(**raw_config)

    runner = TaskRunner.create(config)
    # Execute integration run and return metrics
    metrics = runner.train(train_directory=train_directory, log_directory=log_directory)

    yaml.safe_dump(
        metrics.dict(), (Path(train_directory).parent / "metrics.yaml").open("w")
    )
    runner.export(model_directory=train_directory)
    runner.create_deployment_directory(
        train_directory=train_directory, deploy_directory=deploy_directory
    )


def _suppress_tensorboard_logs():
    # set tensorboard logger to warning level
    #  avoids a constant stream of logs from tensorboard
    tb_logger = tb_logging.get_logger()
    tb_logger.setLevel(logging.WARNING)
