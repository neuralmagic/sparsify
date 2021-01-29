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
DB model classes for project's benchmark
"""
import datetime
import uuid

from peewee import CharField, DateTimeField, ForeignKeyField, IntegerField, TextField
from playhouse.sqlite_ext import JSONField

from sparsify.models.base import BaseCreatedModifiedModel, ListObjField
from sparsify.models.jobs import Job
from sparsify.models.projects import Project


__all__ = ["ProjectBenchmark"]


class ProjectBenchmark(BaseCreatedModifiedModel):
    """
    DB model for a project's benchmark
    """

    benchmark_id = CharField(primary_key=True, default=lambda: uuid.uuid4().hex)
    project = ForeignKeyField(Project, backref="benchmarks", on_delete="CASCADE")
    created = DateTimeField(default=datetime.datetime.now)
    name = TextField(null=True, default="")
    inference_models = ListObjField(null=True, default=None)
    core_counts = JSONField(null=True, default=None)
    batch_sizes = JSONField(null=True, default=None)
    instruction_sets = JSONField(null=True, default=None)
    source = TextField(null=True, default="")
    warmup_iterations_per_check = IntegerField(default=5)
    iterations_per_check = IntegerField(default=30)
    job = ForeignKeyField(Job, null=True, default=None)
    result = JSONField(null=True, default=None)
