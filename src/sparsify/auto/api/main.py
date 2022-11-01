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

import os
import shutil
import time
import warnings
from collections import OrderedDict

from sparsify.auto.api.api_models import APIArgs, Metrics, SparsificationTrainingConfig
from sparsify.auto.tasks import TaskRunner
from sparsify.auto.utils import (
    api_request_config,
    api_request_tune,
    create_save_directory,
    get_trial_artifact_directory,
    load_raw_config_history,
    save_config_history,
)
from tensorboard.program import TensorBoard


def main():
    # Parse CLI args
    api_args = APIArgs.from_cli()
    max_train_seconds = api_args.max_train_time * 60 * 60
    max_tune_trials = api_args.num_trials or float("inf")
    maximum_trial_saves = api_args.maximum_trial_saves or float("inf")

    if api_args.resume:
        # load history from YAML file
        raw_history = load_raw_config_history(api_args.resume)

        # reconstruct run history
        history = [
            (
                SparsificationTrainingConfig(**trial["config"]),
                Metrics(**trial["metrics"]),
            )
            for trial in raw_history.values()
        ]
        best_n_trial_metrics = OrderedDict(
            [
                (idx, (config, metrics))
                for idx, (config, metrics) in sorted(history, key=lambda x: x[1])
            ]
        )
        trial_idx = len(history) - 1

        # request next config file
        config_dict = api_request_tune(history)
        if config_dict.get("tuning_complete"):
            raise ValueError(
                "Tuning stop condition already satisfied for provided run. To turn off "
                "stopping condition use the `--no_stopping` flag"
            )
        config = SparsificationTrainingConfig(**config_dict)

        # set up directory for saving
        save_directory = (
            api_args.resume
            if os.path.isdir(api_args.resume)
            else os.path.dirname(api_args.resume)
        )

    else:
        # setup run loop variables
        history = []
        best_n_trial_metrics = OrderedDict()  # map trail_idx to metrics
        trial_idx = 0

        # request initial training config
        config = SparsificationTrainingConfig(**api_request_config(api_args))

        # set up directory for saving
        save_directory = create_save_directory(api_args)

    # launch tensorboard server
    base_log_directory = api_args.log_directory or os.path.join(save_directory, "logs")
    tensorboard_server = TensorBoard()
    tensorboard_server.configure(argv=[None, "--logdir", base_log_directory])
    url = tensorboard_server.launch()
    print(f"TensorBoard listening on {url}")

    start_idx = trial_idx
    training_start_time = time.time()

    # tune until either (in order of precedence):
    # 1. number of tuning trials used up
    # 2. maximum tuning time exceeded
    # 3. tuning early stopping condition met
    while (
        trial_idx + 1 < start_idx + max_tune_trials
        and time.time() - training_start_time <= max_train_seconds
    ):

        # Create a runner from the config, based on the task specified by config.task
        runner = TaskRunner.create(config)

        # Execute integration run and return metrics
        log_directory = os.path.join(base_log_directory, f"trial_{trial_idx}")
        metrics = runner.train(log_directory)

        # Move models from temporary directory to save directory, while only keeping
        # the best n models
        is_better_than_top_n = any(
            metrics > best_metrics for best_metrics in best_n_trial_metrics.values()
        )
        if (len(best_n_trial_metrics) < maximum_trial_saves) or is_better_than_top_n:
            runner.move_output(target_directory=save_directory, trial_idx=trial_idx)
            best_n_trial_metrics[trial_idx] = metrics

        # If better trial was saved to a total of n+1 saved trials, drop worst one
        if len(best_n_trial_metrics) > maximum_trial_saves:
            drop_trial_idx = min(best_n_trial_metrics, key=best_n_trial_metrics.get)
            shutil.rmtree(get_trial_artifact_directory(api_args, drop_trial_idx))
            del best_n_trial_metrics[drop_trial_idx]

        # save run history as list of pairs of (config, metrics)
        history.append((config, metrics))

        # request a config with a new set of hyperparameters
        config_dict = api_request_tune(history)

        if config_dict.get("tuning_complete"):
            break

        config = SparsificationTrainingConfig(**config_dict)

        trial_idx += 1

    # Get best performing trial number
    best_trial_idx = max(best_n_trial_metrics, key=best_n_trial_metrics.get)

    # In the case of a run resumed from a standalone config history file, the best
    # performing trial may not be contained in the save directory
    trial_artifact_directory = get_trial_artifact_directory(best_trial_idx)
    if best_trial_idx < start_idx and not os.path.exists(trial_artifact_directory):
        warnings.warn(
            f"Best found trial, trail_{best_trial_idx}, originates from the trial "
            "history and the corresponding trial artifact directory "
            f"{trial_artifact_directory} was not found. Completing run without "
            "exporting model"
        )

    # Export model and create deployment folder
    runner.export(target_directory=save_directory, trial_idx=best_trial_idx)
    runner.create_deployment_directory(
        target_directory=save_directory, trial_idx=best_trial_idx
    )
    save_config_history(history=history, target_directory=save_directory)


if __name__ == "__main__":
    main()
