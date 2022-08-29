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

import time

from sparsify.auto.api.args import APIArgs
from sparsify.auto.configs import APIConfigCreator
from sparsify.auto.tasks import TaskRunner


def main():
    # Parse CLI args
    api_args = APIArgs.from_cli()

    max_train_seconds = api_args.max_train_time * 60 * 60

    # setup run loop variables
    configs = []
    runner_outputs = []

    # initialize configs list with first config
    configs.append(APIConfigCreator.get_config(api_args))

    def _training_complete():
        return (
            new_config is not None
            or (time.time() - training_start_time) >= max_train_seconds
        )

    training_start_time = time.time()

    while not _training_complete():

        # Create a runner for the task and config
        runner = TaskRunner.create(configs[-1])

        # Execute integration run and build output object
        runner_outputs.append(runner.run())

        # Update hyperparameters for the next run
        new_config = APIConfigCreator.update_hyperparameters(
            configs, [output.metrics for output in runner_outputs]
        )

        if new_config:
            configs.append(new_config)

    # Conduct any generic post-processing and display results to user
    results = runner_outputs.finalize()
    print(results)


if __name__ == "__main__":
    main()
