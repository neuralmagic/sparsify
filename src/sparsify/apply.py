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
Usage: sparsify.apply [OPTIONS]

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
  --teacher TEXT
  --optimizer [Adadelta|Adagrad|Adam|AdamW|SparseAdam|Adamax|ASGD|SGD|
  RAdam|Rprop|RMSprop|NAdam|LBFGS]
                                  The optimizer to use
  --recipe TEXT                   Recipe to override automatic recipe.
  --recipe-args TEXT
  --optim-level [balanced|throughput|latency|size|memory]
                                  What to optimize the model for.  
                                  [default: balanced]
  --optim-for-hardware            [default: False]
  --max-latency INTEGER
  --min-throughput INTEGER
  --max-size INTEGER
  --max-memory INTEGER
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
  --deploy-hardware TEXT
  --deploy-engine [deepsparse|onnxruntime]
                                  [default: deepsparse]
  --deploy-scenario TEXT
  --version                       Show the version and exit.  [default: False]
  --help                          Show this message and exit.  [default:
                                  False]
"""

import logging
from typing import Optional

import click
from sparsezoo.analyze.cli import CONTEXT_SETTINGS
from sparsify.cli import opts
from sparsify.utils import SparsifyCredentials, set_log_level
from sparsify.utils.helpers import SparsifyClient, UserInfo
from sparsify.version import version_major_minor


_LOGGER = logging.getLogger(__name__)


@click.command(context_settings=CONTEXT_SETTINGS)
@opts.EXPERIMENT_TYPE
@opts.add_info_opts
@opts.add_model_opts(require_model=False, require_optimizer=False)
@opts.add_optim_opts
@opts.add_data_opts
@opts.add_deploy_opts
@click.option("--model-id", help="sparsify model id.")
@click.option("--debug/--no-debug", default=False, hidden=True)
@click.version_option(version=version_major_minor)
def main(
    model: Optional[str],
    model_id: Optional[str],
    experiment_id: Optional[str],
    experiment_type: Optional[str],
    use_case: Optional[str],
    project_id: Optional[str],
    working_dir: Optional[str],
    debug: bool = False,
    **kwargs,
):
    set_log_level(logger=_LOGGER, level=logging.DEBUG if debug else logging.INFO)
    credentials = SparsifyCredentials()
    access_token = credentials.get_access_token(scope="sparsify:write")
    client = SparsifyClient(access_token=access_token)
    client.health_check()
    user_info: UserInfo = credentials.get_user_info()
    _LOGGER.info(f"Logged in as {user_info.email}")

    if model is None and model_id is None:
        raise ValueError("--model or --model-id must be specified.")

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

    if experiment_type == "sparse-transfer":
        # TODO: sparsify.run sparse-transfer
        ...
    elif experiment_type == "one-shot":
        # TODO: sparsify.run one-shot
        ...
    elif experiment_type == "training-aware":
        # TODO: sparsify.run training-aware
        ...
    else:
        raise ValueError(f"Invalid experiment type {experiment_type}")


if __name__ == "__main__":
    main()
