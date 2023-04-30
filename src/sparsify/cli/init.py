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
import tempfile
import uuid
from typing import Optional, TextIO

import requests

import click
from sparsezoo.analyze import ModelAnalysis
from sparsezoo.analyze.cli import CONTEXT_SETTINGS
from sparsify.cli import opts
from sparsify.login import authenticate
from sparsify.utils.helpers import (
    UserInfo,
    base_url,
    request_access_token,
    request_user_info,
    set_log_level,
)


_LOGGER = logging.getLogger(__name__)


@click.command(context_settings=CONTEXT_SETTINGS)
@opts.EXPERIMENT_TYPE
@opts.add_info_opts
@click.option("--model", help="Path to model")
@click.option("--model-id", help="sparsify model id")
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

    if model is None and model_id is None:
        raise ValueError("--model or --model-id must be specified.")

    session = create_session()
    health_check(session=session)

    user_info = UserInfo.from_dict(request_user_info())
    _LOGGER.info(f"Logged in as {user_info.email}")

    session.headers.update(
        {"Content-Type": "application/json", "accept": "application/json"}
    )
    if project_id is None:
        project_id = create_new_project(session=session, user_info=user_info)

    if experiment_id is None:
        if experiment_type is None:
            raise ValueError(
                "--experiment-type required when --experiment-id is not specified."
            )
        if use_case is None:
            raise ValueError(
                "--use-case required when --experiment-id is not specified."
            )
        experiment_id = create_new_experiment(
            session=session,
            user_info=user_info,
            project_id=project_id,
            experiment_type=experiment_type,
            use_case=use_case,
        )

    if model_id is None:
        model_id = create_model_id(
            session=session,
            user_info=user_info,
            model=model,
            project_id=project_id,
            experiment_id=experiment_id,
        )

    with tempfile.NamedTemporaryFile() as temp_analysis:
        analysis = ModelAnalysis.create(model)
        analysis.yaml(temp_analysis.name)
        analysis_id = create_analysis(
            session=session,
            user_info=user_info,
            model_id=model_id,
            project_id=project_id,
            experiment_id=experiment_id,
            analysis_type="model_analysis",
            analysis_file=temp_analysis,
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

    :raises RuntimeError: If the API is not up
    :return: True if the API is up, else raises a RuntimeError
    """
    endpoint = base_url() + "/health/livez"
    _LOGGER.info("Running health check")
    response = session.get(endpoint)
    if response.status_code != 200:
        raise RuntimeError("Health check failed")

    _LOGGER.info("Health check passed")
    return True


def create_new_project(session: requests.Session, user_info: UserInfo):
    """
    Create a project for the user if one does not exist.

    :param session: A session with the Sparsify API
    :param user_info: The user's info
    """
    endpoint = base_url() + "/v1/projects"
    payload = dict(
        name=f"{user_info.name}_sparsify_project_{uuid.uuid4()}",
        description="sparsify_project created by sparsify.init for {user_info.email}}",
        owner_user_id=user_info.user_id,
        account_id=user_info.account_id,
    )

    _LOGGER.info("Creating a new project")
    response = session.post(url=endpoint, data=payload)

    response.raise_for_status()
    _LOGGER.info("Project created")
    return response.json()["project_id"]


def create_new_experiment(
    session: requests.Session,
    user_info: UserInfo,
    project_id: str,
    experiment_type: str,
    use_case: str,
) -> str:
    """
    Create a new experiment for the user

    :param session: A session with the Sparsify API
    :param user_info: The user's info
    :param project_id: The project id
    :param experiment_type: The type of experiment
    :param use_case: The use case
    :return: The experiment id
    """
    endpoint = base_url() + "/v1/experiments"
    experiment_name = (
        f"{user_info.name}_sparsify_experiment_"
        f"{experiment_type}_{use_case}_{uuid.uuid4()}"
    )
    payload = dict(
        name=experiment_name,
        experiment_type=experiment_type,
        owner_user_id=user_info.user_id,
        account_id=user_info.account_id,
        project_id=project_id,
    )
    _LOGGER.info("Creating a new experiment")
    response = session.post(url=endpoint, data=payload)
    response.raise_for_status()
    experiment_id = response.json()["experiment_id"]
    _LOGGER.info(f"Experiment created with id: {experiment_id}")
    return experiment_id


def create_model_id(
    session: requests.Session,
    user_info: UserInfo,
    model: str,
    project_id: str,
    experiment_id: str,
) -> str:
    """
    Create a new model id for the user
    Note: As of now this function always returns a dummy model id,
    this will be updated when the backend is ready

    :param session: A session with the Sparsify API
    :param user_info: The user's info
    :param model: The path to the model
    :param project_id: The project id
    :param experiment_id: The experiment id
    :return: The model id
    """
    endpoint = base_url() + "/v1/models"  # noqa: F841
    payload = dict()  # noqa: F841

    _LOGGER.info("Creating a new model")
    # response = session.post(url=endpoint, data=payload)
    # response.raise_for_status()
    # response_data = response.json()

    # TODO: uncomment above and remove below when backend is ready
    response_data = dict(model_id="test_model_id")
    model_id = response_data["model_id"]

    _LOGGER.info(f"Created model id: {model_id}")
    return model_id


def create_analysis(
    session: requests.Session,
    user_info: UserInfo,
    model_id: str,
    project_id: str,
    experiment_id: str,
    analysis_type: str,
    analysis_file: TextIO,
) -> str:
    """
    Create a new analysis for the user
    Note: As of now this function always returns a dummy analysis id,
    this will be updated when the backend is ready

    :param session: A session with the Sparsify API
    :param user_info: The user's info
    :param model_id: The model id
    :param project_id: The project id
    :param experiment_id: The experiment id
    :param analysis_type: The type of analysis
    :param analysis_file: The analysis file
    :return: The analysis id
    """
    endpoint = base_url() + "/v1/analyses"  # noqa: F841
    files = dict(analysis_file=analysis_file)  # noqa: F841
    payload = dict(  # noqa: F841
        analysis_type=analysis_type,
        owner_user_id=user_info.user_id,
        account_id=user_info.account_id,
        project_id=project_id,
        experiment_id=experiment_id,
        model_id=model_id,
    )

    _LOGGER.info("Creating a new analysis")
    # response = session.post(url=endpoint, data=payload, files=files)
    # response.raise_for_status()
    # response_data = response.json()

    # TODO: uncomment above and remove below when backend is ready
    response_data = dict(analysis_id="test_analysis_id")
    analysis_id = response_data["analysis_id"]

    _LOGGER.info(f"Created analysis id: {analysis_id}")
    return analysis_id


if __name__ == "__main__":
    main()
