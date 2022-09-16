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

import math
import time

import requests

from sparsify.auto.api.api_models import APIArgs, SparsificationTrainingConfig
from sparsify.auto.tasks import TaskRunner
from sparsify.utils import NEURAL_MAGIC_API_ADDRESS


def main():
    # Parse CLI args
    api_args = APIArgs.from_cli()
    max_train_seconds = api_args.max_train_time * 60 * 60
    max_tune_iterations = api_args.num_iterations or math.inf

    # setup run loop variables
    configs = []
    runner_outputs = []
    training_start_time = time.time()

    # tune until either (in order of precedence):
    # 1. number of tuning iterations used up
    # 2. maximum tuning time exceeded
    # 3. tuning early stopping condition met
    while not (len(configs) >= max_tune_iterations) or (
        time.time() - training_start_time > max_train_seconds
    ):
        # request initial training config
        if len(configs) == 0:
            # TODO: add proper server error handling. Waiting for server to have
            # graceful failure protocol
            response = requests.post(
                f"{NEURAL_MAGIC_API_ADDRESS}/v1/sparsify/auto/training-config",
                json=api_args.dict(),
            )
            configs.append(SparsificationTrainingConfig(**response.json()))

        last_config = configs[-1]

        # Create a runner from the config, based on the task specified by config.task
        runner = TaskRunner.create(last_config)

        # Execute integration run and build output object
        runner_outputs.append(runner.run())

        # request a config with a new set of hyperparameters
        response = requests.post(
            f"{NEURAL_MAGIC_API_ADDRESS}/v1/sparsify/auto/training-config/tune",
            json={
                "configs": [config.dict() for config in configs],
                "metrics": [output.metrics.dict() for output in runner_outputs],
            },
        )

        if response.json().get("tuning_complete"):
            break

        configs.append(SparsificationTrainingConfig(**response.json()))

    # Conduct any generic post-processing and display results to user
    results = runner_outputs.finalize()
    print(results)


if __name__ == "__main__":
    main()
