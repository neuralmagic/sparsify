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
                                  The type of the experiment to run
  --use-case [image_classification|object_detection|question_answering|
  segmentation|sentiment_analysis|text_classification|token_classification]
                                  The task this model is for
  --project-id TEXT               Id of the project this run belongs to.
  --experiment-id TEXT            Id of the experiment this run belongs to.
  --working-dir TEXT              Path to save the deployment ready model to
                                  [default:
                                  /home/rahul/github_projects/sparsify]
  --model TEXT                    Path to model  [required]
  --data TEXT                     Path to dataset folder containing training
                                  data and optionally validation data
  --eval-metric [kl|accuracy|mAP|recall|f1]
                                  Metric that the model is evaluated against
                                  on the task. None means it is based on
                                  --use-case.  [default: kl]
  --train-samples INTEGER         Number of samples to use from the dataset
                                  for processing. None means the entire
                                  dataset.
  --val-samples INTEGER           Number of samples to use from the dataset
                                  for processing. None means the entire
                                  dataset.
  --help                          Show this message and exit.  [default:
                                  False]
"""

import logging
from typing import Optional

import requests

import click
from sparsezoo.analyze.cli import CONTEXT_SETTINGS
from sparsify.cli import opts
from sparsify.login import authenticate
from sparsify.utils.helpers import (
    base_url,
    request_access_token,
    request_user_info,
    set_log_level,
)


_LOGGER = logging.getLogger(__name__)


@click.command(context_settings=CONTEXT_SETTINGS)
@opts.EXPERIMENT_TYPE
@opts.add_info_opts
@click.option("--model", required=True, help="Path to model")
@opts.add_data_opts
@click.option("--debug/--no-debug", default=False, hidden=True)
def main(
    model: str,
    experiment_id: Optional[str],
    experiment_type: Optional[str],
    use_case: Optional[str],
    project_id: Optional[str],
    working_dir: Optional[str],
    data: Optional[str],
    eval_metric: Optional[str],
    train_samples: Optional[str],
    val_samples: Optional[str],
    debug: bool = False,  # hidden arg for debug logs
):
    """
    sparsify.init CLI utility to initialize an experiment such that it will
    provision all local and cloud resources necessary, additionally also allows
    users to update hyper-param(s) before applying
    """
    set_log_level(logger=_LOGGER, level=logging.DEBUG if debug else logging.INFO)
    session = create_session()

    _LOGGER.info("Running health check")
    if not health_check(session=session):
        raise RuntimeError("Health check failed")

    user_info = request_user_info()

    if experiment_id is None:
        if experiment_type is None:
            raise ValueError(
                "--experiment-type required when --experiment-id is not specified."
            )
        if use_case is None:
            raise ValueError(
                "--use-case required when --experiment-id is not specified."
            )

    _LOGGER.debug(f"Local args: {locals()}")


def create_session() -> requests.Session:
    """
    Create a session with the Sparsify API, authenticated with the user's API key.
    Additionally, set the session's headers to include the access token.

    :return: A session with the Sparsify API
    """
    session = requests.Session()
    authenticate()
    access_token = request_access_token()
    session.headers.update({"Authorization": f"Bearer {access_token}"})
    return session


def health_check(session: requests.Session) -> bool:
    """
    Check if the Sparsify API is up.

    :return: True if the API is up, False otherwise
    """
    endpoint = base_url() + "/health/livez"
    response = session.get(endpoint)
    result = response.status_code == 200
    if result:
        _LOGGER.info("Health check passed")
    else:
        _LOGGER.error("Health check failed")
    return result


if __name__ == "__main__":
    main()
