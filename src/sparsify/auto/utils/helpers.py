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
Generic helpers for sparsify.auto
"""
import os
import shutil
from datetime import datetime

from sparsify.auto.api.api_models import APIArgs


__all__ = ["SAVE_DIR", "create_run_directory", "remove_iteration_directory"]

SAVE_DIR = "auto_{{task}}{:_%Y_%m_%d_%H_%M_%S}".format(datetime.now())


def create_run_directory(api_args: APIArgs):
    """
    Create base directory structure for a single sparsify.auto run

    """
    run_directory = os.path.join(api_args.save_directory, SAVE_DIR.format(task=api_args.task))
    os.mkdir(os.path.join(run_directory))
    os.mkdir(os.path.join(run_directory, "deployment"))
    os.mkdir(os.path.join(run_directory, "run_artifacts"))
    os.mkdir(os.path.join(run_directory, "logs"))


def remove_iteration_directory(save_directory: str, iteration_idx: int):
    shutil.rmtree(
        os.path.join(
            save_directory, SAVE_DIR, "run_artifacts", f"iteration_{iteration_idx}"
        )
    )
