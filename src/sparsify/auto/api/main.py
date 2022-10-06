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
from sparsify.auto.utils import (
    api_request_config,
    api_request_tune,
    create_run_directory,
    remove_trial_directory,
)


def main():
    # Parse CLI args
    api_args = APIArgs.from_cli()
    max_train_seconds = api_args.max_train_time * 60 * 60
    max_tune_trials = api_args.num_trials or math.inf
    maximum_trial_saves = api_args.maximum_trial_saves or math.inf

    # setup run loop variables
    history = []
    best_n_models = []
    trial_idx = 1

    # request initial training config
    config = SparsificationTrainingConfig(**api_request_config(api_args))
    training_start_time = time.time()

    # set up directory for saving
    create_run_directory(api_args)

    # tune until either (in order of precedence):
    # 1. number of tuning trials used up
    # 2. maximum tuning time exceeded
    # 3. tuning early stopping condition met
    while len(history) < max_tune_trials and time.time() - training_start_time <= max_train_seconds:

        # Create a runner from the config, based on the task specified by config.task
        runner = TaskRunner.create(config)

        # Execute integration run and return metrics
        metrics = runner.train()

        # Move models from temporary directory to save directory, while only keeping
        # the best n models
        if len(best_n_models) < maximum_trial_saves or any(
            metrics > best_metrics for _, best_metrics in history
        ):
            if len(best_n_models) == maximum_trial_saves:
                metrics_list = [best_metrics for _, best_metrics in best_n_models]
                remove_trial_directory(
                    api_args.save_directory, metrics_list.index(max(metrics_list))
                )
            runner.move_output(trial_idx)
            best_n_models.append((trial_idx, config, metrics))

        # save run history as list of pairs of (config, metrics)
        history.append((config, metrics))

        # request a config with a new set of hyperparameters
        config_dict = api_request_tune(history)

        if config_dict.get("tuning_complete"):
            break

        config = SparsificationTrainingConfig(**config_dict)

        trial_idx += 1

    # Export model and create deployment folder
    best_trial_idx = best_n_models.index(max(best_n_models))
    runner.export(best_trial_idx)
    runner.create_deployment_directory(best_trial_idx)


if __name__ == "__main__":
    main()
