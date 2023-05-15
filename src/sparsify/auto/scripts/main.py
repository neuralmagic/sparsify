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
import os

import yaml

from sparsify.auto.tasks import TaskRunner
from sparsify.auto.utils import (
    api_request_config,
    create_save_directory,
    initialize_banner_logger,
    save_history,
)
from sparsify.schemas import APIArgs
from tensorboard.program import TensorBoard


_LOGGER = logging.getLogger("auto_banner")


# TODO: add support for kwargs


def main(api_args: APIArgs):  # TODO: get rid of pydnatic based args?
    initialize_banner_logger()

    # Set up directory for saving
    (
        train_directory,
        log_directory,
        deploy_directory,
    ) = create_save_directory(api_args)

    # Launch tensorboard server
    tensorboard_server = TensorBoard()
    tensorboard_server.configure(argv=[None, "--logdir", log_directory])
    url = tensorboard_server.launch()
    _LOGGER.info(f"TensorBoard listening on {url}")

    # Request config from api and instantiate runner
    config = api_request_config(api_args)
    runner = TaskRunner.create(config)

    # Execute integration run and return metrics
    metrics = runner.train(train_directory=train_directory, log_directory=log_directory)
    yaml.safe_dump(metrics, open(os.path.join(save_history, "metrics.yaml"), "w"))

    runner.export(model_directory=train_directory)
    runner.create_deployment_directory(target_directory=deploy_directory)
