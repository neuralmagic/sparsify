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

  sparsify.apply CLI utility to apply sparsify to a given experiment, or
  initialize and run an experiment if not created yet.

Options:
  --experiment-type [sparse-transfer|one-shot|training-aware]
                                  The type of the experiment to run.
  --use-case [document_classification|image_classification|
  information_retrieval|masked_language_modeling|
  multilabel_text_classification|object_detection|question_answering|
  segmentation|sentiment_analysis|text_classification|token_classification]
                                  The task this model is for.
  --project-id TEXT               Id of the project this run belongs to.
  --experiment-id TEXT            Id of the experiment this run belongs to.
  --working-dir TEXT              Path to save the deployment ready model to.
                                  [default:
                                  /home/rahul/github_projects/sparsify]
  --model TEXT                    Path to model.
  --teacher TEXT
  --optimizer [Adadelta|Adagrad|Adam|AdamW|SparseAdam|Adamax|ASGD|SGD|
  RAdam|Rprop|RMSprop|NAdam|LBFGS]
                                  The optimizer to use
  --recipe TEXT                   Recipe to override automatic recipe.
  --recipe-args TEXT
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
  --optim-level FLOAT             Preferred tradeoff between accuracy and
                                  performance. Float value in the range [0,
                                  1]. Default 0.5  [default: 0.5]
  --model-id TEXT                 sparsify model id.
  --version                       Show the version and exit.  [default: False]
  --help                          Show this message and exit.  [default:
                                  False]
"""

import logging
import subprocess
from typing import List

import click
from sparsezoo.analyze import ModelAnalysis
from sparsezoo.analyze.cli import CONTEXT_SETTINGS
from sparsify import init, login
from sparsify.cli import opts
from sparsify.utils import (
    ExperimentStatus,
    SparsifyClient,
    UserInfo,
    get_non_existent_filename,
    set_log_level,
)
from sparsify.version import version_major_minor


__all__ = ["apply"]

_LOGGER = logging.getLogger(__name__)


@click.command(context_settings=CONTEXT_SETTINGS)
@opts.EXPERIMENT_TYPE
@opts.add_info_opts
@opts.add_model_opts(require_model=False, include_optimizer=False)
@opts.add_optim_opts
@opts.add_data_opts
@opts.add_deploy_opts
@opts.OPTIM_LEVEL
@click.option("--model-id", help="sparsify model id.")
@click.version_option(version=version_major_minor)
@click.option("--debug/--no-debug", default=False, hidden=True)
def main(
    debug: bool = False,  # hidden arg for debug logs
    **kwargs,
):
    """
    sparsify.apply CLI utility to apply sparsify to a given experiment, or initialize
    and run an experiment if not created yet.
    """
    set_log_level(logger=_LOGGER, level=logging.DEBUG if debug else logging.INFO)
    apply(**kwargs)
    _LOGGER.debug(f"locals: {locals()}")


def apply(**kwargs):
    login()
    experiment_id = kwargs.get("experiment_id")
    if experiment_id is None:
        experiment_id, project_id = init(**kwargs)
    client = SparsifyClient(scope="sparsify:write")
    client.health_check()
    user_info: UserInfo = client.user_info
    _LOGGER.info(f"Logged in as {user_info.email}")

    experiment_type = kwargs.get("experiment_type")
    if experiment_type is None:
        experiment_type = client.get(
            url=f"/experiments/{experiment_id}/experiment_type"
        )
        kwargs.update({"experiment_type": experiment_type})

    project_id = client.create_project_if_does_not_exist(
        user_info=user_info,
        project_id=kwargs["project_id"],
    )
    kwargs.update({"project_id": project_id})

    command_args: List[str] = []
    if experiment_type == "sparse-transfer":
        command_args = [
            experiment_type,
            "--use-case",
            kwargs["use_case"],
            "--model",
            kwargs["model"],
            "--data",
            kwargs["data"],
            "--train-samples",
            kwargs["train_samples"],
            "--val-samples",
            kwargs["val_samples"],
            "--eval-metric",
            kwargs["eval_metric"],
            "--optim-level",
            kwargs["optim_level"],
            "--recipe",
            kwargs["recipe"],
            "--recipe-args",
            kwargs["recipe_args"],
        ]
    elif experiment_type == "one-shot":
        for key, value in kwargs.items():
            if value is not None:
                command_args.extend([f"--{key}", value])

    elif experiment_type == "training-aware":
        for key, value in kwargs.items():
            if value is not None:
                command_args.extend([f"--{key}", value])
    else:
        raise ValueError(f"Invalid experiment type {experiment_type}")

    command_str = ["sparsify", "run", experiment_type]
    command_str.extend(command_args)

    try:
        client.update_experiment_status(
            experiment_id=experiment_id, status=ExperimentStatus.IN_PROGRESS.value
        )
        subprocess.run(command_str)
        analysis_file_path = str(
            get_non_existent_filename(
                parent_dir=kwargs["working_dir"], filename="analysis.yaml"
            )
        )
        analysis = ModelAnalysis.create(kwargs["working_dir"])
        analysis.yaml(file_path=analysis_file_path)
        analysis_id = client.upload_analysis(
            user_info=user_info,
            model_id=kwargs["model_id"],
            project_id=project_id,
            experiment_id=experiment_id,
            analysis_type="model_analysis",
            analysis_file=analysis_file_path,
        )

        client.update_experiment_status(
            experiment_id=experiment_id, status=ExperimentStatus.COMPLETE.value
        )
    except Exception as exception:
        client.update_experiment_status(
            experiment_id=experiment_id, status=ExperimentStatus.ERROR.value
        )
        raise exception

    _LOGGER.info(
        f"Experiment {experiment_id} complete, analysis id: {analysis_id}, "
        f"artifacts saved to {kwargs['working_dir']}"
    )


if __name__ == "__main__":
    main()
