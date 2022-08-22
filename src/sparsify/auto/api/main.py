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
    config = None
    runner_outputs = None
    training_start_time = None

    def _training_complete():
        if config is None:
            return False  # first loop

        # training is complete if sparsify.auto metrics satisfy the given config
        # or the total time of all runs exceeds the maximum training time
        return APIConfigCreator.metrics_satisfied(config, runner_outputs.metrics) or (
            time.time() - training_start_time > max_train_seconds
        )

    while not _training_complete():
        # create or update training config
        if config is None:
            config = APIConfigCreator.get_config(api_args)
            training_start_time = time.time()  # start training time after config init
        else:
            config = APIConfigCreator.update_hyperparameters(
                config, runner_outputs.metrics
            )

        # Create a runner for the task and config
        runner = TaskRunner.create(config)

        # Execute integration run and build output object
        runner_outputs = runner.run()

    # Conduct any generic post-processing and display results to user
    results = runner_outputs.finalize()
    print(results)


if __name__ == "__main__":
    main()
