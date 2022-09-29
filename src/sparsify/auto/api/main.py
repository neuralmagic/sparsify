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

from sparsify.auto.api.api_models import APIArgs, SparsificationTrainingConfig
from sparsify.auto.tasks import TaskRunner
from sparsify.auto.utils import api_request_config, api_request_tune


def main():
    # Parse CLI args
    api_args = APIArgs.from_cli()
    max_train_seconds = api_args.max_train_time * 60 * 60
    max_tune_iterations = api_args.num_iterations or math.inf

    # setup run loop variables
    history = []
    training_start_time = time.time()

    # request initial training config
    config = SparsificationTrainingConfig(**api_request_config(api_args))

    # tune until either (in order of precedence):
    # 1. number of tuning iterations used up
    # 2. maximum tuning time exceeded
    # 3. tuning early stopping condition met
    while not (len(history) >= max_tune_iterations) or (
        time.time() - training_start_time > max_train_seconds
    ):

        # Create a runner from the config, based on the task specified by config.task
        runner = TaskRunner.create(config)

        # Execute integration run and build output object
        output = runner.run()

        # save run history as list of pairs of (config, metrics)
        history.append((config, output.metrics))

        # request a config with a new set of hyperparameters
        config_dict = api_request_tune(history)

        if config_dict.get("tuning_complete"):
            break

        config = SparsificationTrainingConfig(**config_dict)

    runner.export()

    # Conduct any generic post-processing and display results to user
    results = output.finalize()
    print(results)


if __name__ == "__main__":
    main()
