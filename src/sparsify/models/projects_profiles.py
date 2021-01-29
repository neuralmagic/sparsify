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
DB model classes for project's profiles such as performance and loss
"""

import datetime
import logging
import uuid

from peewee import (
    BooleanField,
    CharField,
    DateTimeField,
    ForeignKeyField,
    IntegerField,
    TextField,
)
from playhouse.sqlite_ext import JSONField

from sparsify.models.base import BaseModel, CSVField
from sparsify.models.jobs import Job
from sparsify.models.projects import Project


__all__ = ["BaseProjectProfile", "ProjectLossProfile", "ProjectPerfProfile"]


_LOGGER = logging.getLogger(__name__)


class BaseProjectProfile(BaseModel):
    """
    Base DB model for project's profiles such as loss and perf
    """

    profile_id = CharField(primary_key=True, default=lambda: uuid.uuid4().hex)
    created = DateTimeField(default=datetime.datetime.now)
    source = TextField(null=True, default=None)
    job = ForeignKeyField(Job, null=True, default=None)
    analysis = JSONField(null=True, default=None)
    name = TextField(null=True, default="")


class ProjectLossProfile(BaseProjectProfile):
    """
    DB model for a project's loss profile.
    A project may have multiple loss profiles stored in the DB.
    """

    project = ForeignKeyField(Project, backref="profiles_loss", on_delete="CASCADE")
    pruning_estimations = BooleanField(default=False)
    pruning_estimation_type = TextField(null=True, default=None)
    pruning_structure = TextField(null=True, default=None)
    quantized_estimations = BooleanField(default=False)
    quantized_estimation_type = TextField(null=True, default=None)


class ProjectPerfProfile(BaseProjectProfile):
    """
    DB model for a project's performance profile.
    A project may have multiple perf profiles stored in the DB
    """

    project = ForeignKeyField(Project, backref="profiles_perf", on_delete="CASCADE")
    batch_size = IntegerField(null=True, default=None)
    core_count = IntegerField(null=True, default=None)
    instruction_sets = CSVField(null=True, default=None)
    pruning_estimations = BooleanField(default=False)
    quantized_estimations = BooleanField(default=False)
    iterations_per_check = IntegerField(null=True, default=None)
    warmup_iterations_per_check = IntegerField(null=True, default=None)
