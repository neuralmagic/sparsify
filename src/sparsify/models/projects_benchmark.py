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
