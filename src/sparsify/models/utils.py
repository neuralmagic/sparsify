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

from flask import Flask
from playhouse.flask_utils import FlaskDB

from sparsify.models import (
    Job,
    Project,
    ProjectBenchmark,
    ProjectData,
    ProjectLossProfile,
    ProjectModel,
    ProjectOptimization,
    ProjectOptimizationModifierLRSchedule,
    ProjectOptimizationModifierPruning,
    ProjectOptimizationModifierQuantization,
    ProjectOptimizationModifierTrainable,
    ProjectPerfProfile,
    database,
    storage,
)


__all__ = ["database_setup"]


def database_setup(working_dir: str, app: Flask = None):
    storage.init(working_dir)
    db_path = os.path.join(working_dir, "db.sqlite")
    database.init(db_path)

    if app:
        FlaskDB(app, database)

    database.connect()
    models = [
        Job,
        Project,
        ProjectBenchmark,
        ProjectModel,
        ProjectData,
        ProjectLossProfile,
        ProjectPerfProfile,
        ProjectOptimization,
        ProjectOptimizationModifierPruning,
        ProjectOptimizationModifierQuantization,
        ProjectOptimizationModifierLRSchedule,
        ProjectOptimizationModifierTrainable,
    ]
    database.create_tables(
        models=models,
        safe=True,
    )
    for model in models:
        model.raw("PRAGMA foreign_keys=ON").execute()
    database.start()
    database.close()
