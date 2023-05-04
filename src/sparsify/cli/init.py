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

"""
Usage: sparsify.init [OPTIONS]

  sparsify.init CLI utility to initialize an experiment such that it will
  provision all local and cloud resources necessary, additionally also allows
  users to update hyper-param(s) before applying

Options:
  --experiment-type [sparse-transfer|one-shot|training-aware]
                                  The type of the experiment to run.
  --use-case [image_classification|object_detection|question_answering|
  segmentation|sentiment_analysis|text_classification|token_classification]
                                  The task this model is for.
  --project-id TEXT               Id of the project this run belongs to.
  --experiment-id TEXT            Id of the experiment this run belongs to.
  --working-dir TEXT              Path to save the deployment ready model to.
  --model TEXT                    Path to model.
  --model-id TEXT                 sparsify model id.
  --data TEXT                     Path to dataset folder containing training
                                  data and optionally validation data.
  --eval-metric [kl|accuracy|mAP|recall|f1]
                                  Metric that the model is evaluated against
                                  on the task.  [default: kl]
  --train-samples INTEGER         Number of train samples to use from the
                                  dataset for processing. Will use all train
                                  samples if not specified.
  --val-samples INTEGER           Number of validation samples to use from the
                                  dataset for processing. Will use all eval
                                  samples if not specified.
  --help                          Show this message and exit.  [default:
                                  False]
"""

import logging
from pathlib import Path
from typing import Optional

import click
from sparsezoo.analyze import ModelAnalysis
from sparsezoo.analyze.cli import CONTEXT_SETTINGS
from sparsify.cli import opts
from sparsify.utils import (
    SparsifyClient,
    SparsifyCredentials,
    UserInfo,
    get_non_existent_filename,
    set_log_level,
)


_LOGGER = logging.getLogger(__name__)


@click.command(context_settings=CONTEXT_SETTINGS)
@opts.EXPERIMENT_TYPE
@opts.add_info_opts
@click.option("--model", help="Path to model.")
@click.option("--model-id", help="sparsify model id.")
@opts.add_data_opts
@click.option("--debug/--no-debug", default=False, hidden=True)
def main(
    model: Optional[str],
    model_id: Optional[str],
    experiment_id: Optional[str],
    experiment_type: Optional[str],
    use_case: Optional[str],
    project_id: Optional[str],
    working_dir: Optional[str],
    data: Optional[str],
    eval_metric: Optional[str],
    train_samples: Optional[int],
    val_samples: Optional[int],
    debug: bool = False,  # hidden arg for debug logs
):
    """
    sparsify.init CLI utility to initialize an experiment such that it will
    provision all local and cloud resources necessary, additionally also allows
    users to update hyper-param(s) before applying
    """
    set_log_level(logger=_LOGGER, level=logging.DEBUG if debug else logging.INFO)

    if model is None and model_id is None:
        raise ValueError("--model or --model-id must be specified.")

    credentials = SparsifyCredentials()
    access_token = credentials.get_access_token(scope="sparsify:write")
    client = SparsifyClient(access_token=access_token)
    client.health_check()
    user_info: UserInfo = credentials.get_user_info()
    _LOGGER.info(f"Logged in as {user_info.email}")

    if project_id is None:
        project_id = client.create_new_project(user_info=user_info)

    if experiment_id is None:
        if experiment_type is None:
            raise ValueError(
                "--experiment-type required when --experiment-id is not specified."
            )
        if use_case is None:
            raise ValueError(
                "--use-case required when --experiment-id is not specified."
            )
        experiment_id = client.create_new_experiment(
            user_info=user_info,
            project_id=project_id,
            experiment_type=experiment_type,
            use_case=use_case,
        )

    if model_id is None:
        model_id = client.create_model_id(
            user_info=user_info,
            model=model,
            project_id=project_id,
            experiment_id=experiment_id,
        )

    working_dir = Path(working_dir).mkdir(parents=True, exist_ok=True)
    analysis_file_path = str(
        get_non_existent_filename(workng_dir=working_dir, filename="analysis.yaml")
    )
    analysis = ModelAnalysis.create(model)
    analysis.yaml(file_path=analysis_file_path)
    analysis_id = client.create_analysis(
        user_info=user_info,
        model_id=model_id,
        project_id=project_id,
        experiment_id=experiment_id,
        analysis_type="model_analysis",
        analysis_file=analysis_file_path,
    )
    client.update_experiment_eval_metric(
        experiment_id=experiment_id, eval_metric=eval_metric
    )
    client.update_experiment_status(experiment_id=experiment_id, status="initialized")
    _LOGGER.debug(f"Local args: {locals()}")


if __name__ == "__main__":
    main()
