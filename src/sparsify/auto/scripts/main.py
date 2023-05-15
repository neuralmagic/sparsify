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


# General TODO list
# TODO: replace optimizing_metric with eval metric
# TODO: add support for kwargs

# Unresolved questions
# How are additional trials prompted? How is the info getting passed to the API?

def main(api_args: APIArgs): # TODO: get rid of pydnatic based args?
    initialize_banner_logger()
   
    # Set up directory for saving
    (
        save_directory,
        base_artifact_directory,
        log_directory,
    ) = create_save_directory(api_args) # TODO: Update save structure
    
    # Launch tensorboard server
    tensorboard_server = TensorBoard()
    tensorboard_server.configure(argv=[None, "--logdir", log_directory])
    url = tensorboard_server.launch()
    print(f"TensorBoard listening on {url}")
    
    # Request config from api and instantiate runner
    config = api_request_config(api_args)
    runner = TaskRunner.create(config)
    
    # Execute integration run and return metrics
    metrics = runner.train(log_directory)
    runner.move_output(target_directory=artifact_directory, trial_idx=trial_idx) #TODO: save to correct directory immediately?
    
    runner.export(model_directory=trial_artifact_directory)
    runner.create_deployment_directory(
        target_directory=save_directory, trial_idx=best_trial_idx
    )