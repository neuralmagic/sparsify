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
import shutil
import time
import warnings
from collections import OrderedDict
from typing import Dict, List, Tuple

from sparsify.auto.tasks import TaskRunner
from sparsify.auto.utils import (
    api_request_config,
    api_request_tune,
    best_n_trials_from_history,
    create_save_directory,
    get_trial_artifact_directory,
    initialize_banner_logger,
    load_raw_config_history,
    request_student_teacher_configs,
    save_history,
)
from sparsify.schemas import APIArgs, Metrics, SparsificationTrainingConfig
from tensorboard.program import TensorBoard


_LOGGER = logging.getLogger("auto_banner")


def main():
    initialize_banner_logger()

    # Tuning tracking variables
    history = {"teacher": [], "student": []}
    best_n_trial_metrics = {
        "teacher": OrderedDict(),
        "student": OrderedDict(),
    }  # map trail_idx to metrics
    start_idx = 0
    resume_stage = None

    # Parse CLI args
    api_args = APIArgs.from_cli()

    # Load state from previous run
    if api_args.resume:
        _LOGGER.info(f"Resuming run from {api_args.resume}")

        # Load history from YAML file
        raw_history = load_raw_config_history(api_args.resume)

        # API args to be loaded from history file, all CLI args passed on this call
        # to be ignored
        resume_directory = api_args.resume
        api_args = APIArgs(**raw_history["api_args"])
        api_args.resume = resume_directory

        # Reconstruct run history
        history["teacher"] = [
            (
                SparsificationTrainingConfig(**trial["config"]),
                Metrics(**trial["metrics"]),
            )
            for trial in raw_history["teacher"].values()
        ]

        history["student"] = [
            (
                SparsificationTrainingConfig(**trial["config"]),
                Metrics(**trial["metrics"]),
            )
            for trial in raw_history["student"].values()
        ]

        best_n_trial_metrics["teacher"] = best_n_trials_from_history(
            history["teacher"], api_args.maximum_trial_saves
        )
        best_n_trial_metrics["student"] = best_n_trials_from_history(
            history["student"], api_args.maximum_trial_saves
        )

        # Only teacher and student stages supported at this time
        resume_stage = (
            "student"
            if (
                len(history["student"]) > 0
                or len(history["teacher"]) == api_args.num_trials
            )
            else "teacher"
        )
        start_idx = len(history[resume_stage])

        # Check whether the run can continue to be tuned
        config_dict = api_request_tune(history[resume_stage])
        if config_dict.get("tuning_complete"):
            if resume_stage == "student":
                raise ValueError(
                    "Tuning stop condition already satisfied for provided run. To turn "
                    "off stopping condition use the `--no_stopping` flag"
                )
            else:
                warnings.warn(
                    "Tuning stop condition already satisfied for teacher "
                    "stage. Skipping to training student. To turn off stopping  "
                    "condition use the `--no_stopping` flag"
                )

        student_config, teacher_config = None, None
        if resume_stage == "student":
            student_config = SparsificationTrainingConfig(**config_dict)
        else:
            teacher_config = SparsificationTrainingConfig(**config_dict)
            if not api_args.teacher_only:
                student_config = api_request_config(api_args)

        save_directory = api_args.resume
        base_log_directory = os.path.join(save_directory, "training", "logs")
        base_artifact_directory = os.path.join(
            save_directory, "training", "run_artifacts"
        )

    else:
        # Request initial training configs
        student_config, teacher_config = request_student_teacher_configs(api_args)

        # Set up directory for saving
        (
            save_directory,
            base_artifact_directory,
            base_log_directory,
        ) = create_save_directory(api_args)

    # Launch tensorboard server
    tensorboard_server = TensorBoard()
    tensorboard_server.configure(argv=[None, "--logdir", base_log_directory])
    url = tensorboard_server.launch()
    print(f"TensorBoard listening on {url}")

    max_tune_trials = api_args.num_trials or float("inf")
    tuning_start_time = time.time()

    # Train teacher
    if teacher_config:
        _LOGGER.info("Starting hyperparameter tuning on teacher model")

        teacher_artifact_directory = os.path.join(base_artifact_directory, "teacher")
        teacher_log_directory = os.path.join(base_log_directory, "teacher")

        teacher_runner = _train(
            config=teacher_config,
            api_args=api_args,
            history=history["teacher"],
            best_n_trial_metrics=best_n_trial_metrics["teacher"],
            start_idx=start_idx,
            max_tune_trials=max_tune_trials,
            tuning_start_time=tuning_start_time,
            artifact_directory=teacher_artifact_directory,
            log_directory=teacher_log_directory,
            stage="teacher",
        )

        # Determine the best teacher trained and assign to student
        best_trial_idx = max(
            best_n_trial_metrics["teacher"], key=best_n_trial_metrics["teacher"].get
        )
        best_trial_path = get_trial_artifact_directory(
            teacher_artifact_directory, best_trial_idx
        )
        best_teacher_path = os.path.join(
            best_trial_path, teacher_runner.model_save_name
        )

        if student_config:
            student_config.distill_teacher = best_teacher_path

    # Train student
    if student_config:
        _LOGGER.info("Starting hyperparameter tuning on student model")

        student_artifact_directory = os.path.join(base_artifact_directory, "student")
        student_log_directory = os.path.join(base_log_directory, "student")

        student_runner = _train(
            config=student_config,
            api_args=api_args,
            history=history["student"],
            best_n_trial_metrics=best_n_trial_metrics["student"],
            start_idx=start_idx
            if not (api_args.resume and resume_stage == "teacher")
            else 0,
            max_tune_trials=max_tune_trials,
            tuning_start_time=tuning_start_time,
            artifact_directory=student_artifact_directory,
            log_directory=student_log_directory,
            stage="student",
        )

        # Export student and create deployment directory
        best_trial_idx = max(
            best_n_trial_metrics["student"], key=best_n_trial_metrics["student"].get
        )
        trial_artifact_directory = get_trial_artifact_directory(
            student_artifact_directory, best_trial_idx
        )

        _LOGGER.info(
            "Tuning complete. Exporting model from the best trial, "
            f"#{best_trial_idx}"
        )

        student_runner.export(model_directory=trial_artifact_directory)
        student_runner.create_deployment_directory(
            target_directory=save_directory, trial_idx=best_trial_idx
        )


def _train(
    config: SparsificationTrainingConfig,
    api_args: APIArgs,
    history: List[Tuple[SparsificationTrainingConfig, Metrics]],
    best_n_trial_metrics: Dict[int, Metrics],
    start_idx: int,
    max_tune_trials: int,
    tuning_start_time: float,
    artifact_directory: str,
    log_directory: str,
    stage: str,
):
    """
    Perform hyperparamter tuning by training multiple iterations of the model

    :param config: config to define the initial training running
    :param api_args: user defined settings
    :param history: history of runs attempted so far in this experiment. Empty unless
        the --resume flag was used
    :param best_n_trial_metrics: mapping of trail_idx to metrics for at most n runs with
        the best metrics. Empty unless the --resume flag was used
    :param start_idx: trial number to start on. 0 unless the --resume flag was used
    :param max_tune_trials: maximum number of tuning trials to run
    :param tuning_start_time: time at which auto parameter tuning started
    :param artifact_directory: path to the artifacts directory for this stage
    :param log directory: path to the logging directory for this stage
    :param stage: name of stage, used for saving to the run history file
    """
    maximum_trial_saves = api_args.maximum_trial_saves or float("inf")
    trial_idx = start_idx

    # tune until either (in order of precedence):
    # 1. number of tuning trials used up
    # 2. maximum tuning time exceeded
    # 3. tuning early stopping condition met
    while (
        trial_idx < max_tune_trials
        and time.time() - tuning_start_time <= api_args.max_train_time * 60 * 60
    ):
        _LOGGER.info(f"Starting tuning trial #{trial_idx}")

        # Create a runner from the config, based on the task specified by config.task
        runner = TaskRunner.create(config)

        # Execute integration run and return metrics
        metrics = runner.train(log_directory)
        log_directory = os.path.join(log_directory, f"trial_{trial_idx}")

        # Move models from temporary directory to save directory, while only keeping
        # the best n models
        is_better_than_top_n = any(
            metrics > best_metrics for best_metrics in best_n_trial_metrics.values()
        )
        if (len(best_n_trial_metrics) < maximum_trial_saves) or is_better_than_top_n:
            runner.move_output(target_directory=artifact_directory, trial_idx=trial_idx)
            best_n_trial_metrics[trial_idx] = metrics

            _LOGGER.info(
                f"Trial #{trial_idx} in top {maximum_trial_saves} seen so far. Saving "
                "to run artifacts directory"
            )

        # If better trial was saved to a total of n+1 saved trials, drop worst one
        if len(best_n_trial_metrics) > maximum_trial_saves:
            drop_trial_idx = min(best_n_trial_metrics, key=best_n_trial_metrics.get)
            shutil.rmtree(
                get_trial_artifact_directory(artifact_directory, drop_trial_idx)
            )
            del best_n_trial_metrics[drop_trial_idx]

            _LOGGER.info(
                f"Dropping trial #{drop_trial_idx} from top {maximum_trial_saves} "
                "saved trials"
            )

        # save run history as list of pairs of (config, metrics)
        history.append((config, metrics))
        save_history(
            history=history,
            api_args=api_args,
            stage=stage,
            target_directory=artifact_directory,
        )

        # request a config with a new set of hyperparameters
        config_dict = api_request_tune(history)

        if config_dict.get("tuning_complete"):
            break

        config = SparsificationTrainingConfig(**config_dict)

        trial_idx += 1

    return runner


if __name__ == "__main__":
    main()
