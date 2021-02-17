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
DB model classes for jobs
"""

import datetime
import logging
import uuid
from enum import Enum

from peewee import BooleanField, CharField, DateTimeField, Field, TextField
from playhouse.sqlite_ext import JSONField

from sparsify.models.base import BaseModel


__all__ = ["JobStatus", "JobStatusField", "Job"]


_LOGGER = logging.getLogger(__name__)


class JobStatus(Enum):
    """
    Enumerator class for tracking the status of jobs
    """

    pending = "pending"
    started = "started"
    canceling = "canceling"
    completed = "completed"
    canceled = "canceled"
    error = "error"


class JobStatusField(Field):
    """
    peewee DB field for saving and loading JobStatus from the database
    """

    field_type = "VARCHAR"

    def db_value(self, value: JobStatus):
        return value.name

    def python_value(self, value: str):
        return JobStatus[value]


class Job(BaseModel):
    """
    DB model for a project's job.
    """

    job_id = CharField(primary_key=True, default=lambda: uuid.uuid4().hex)
    project_id = CharField()
    created = DateTimeField(default=datetime.datetime.now)
    modified = DateTimeField(default=datetime.datetime.now)
    type_ = CharField()
    worker_args = JSONField(null=True, default=None)
    worker_ack = BooleanField(default=False)
    status = JobStatusField(default=JobStatus.pending)
    progress = JSONField(null=True, default=None)
    error = TextField(null=True)

    def save(self, *args, **kwargs):
        """
        Override for peewee save function to update the modified date
        """
        self.modified = datetime.datetime.now()

        return super().save(*args, **kwargs)
