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
DB model classes for project's optimizations and modifiers
"""

import logging
import uuid

from peewee import CharField, FloatField, ForeignKeyField, TextField

from sparsify.models.base import BaseCreatedModifiedModel, ListObjField
from sparsify.models.projects import Project
from sparsify.models.projects_profiles import ProjectLossProfile, ProjectPerfProfile


__all__ = [
    "ProjectOptimization",
    "ProjectOptimizationModifierPruning",
    "ProjectOptimizationModifierQuantization",
    "ProjectOptimizationModifierLRSchedule",
    "ProjectOptimizationModifierTrainable",
]


_LOGGER = logging.getLogger(__name__)


class ProjectOptimization(BaseCreatedModifiedModel):
    """
    DB model for a project's optimization (stores modifier settings).
    A project may have multiple optimizations stored in the DB.
    """

    optim_id = CharField(primary_key=True, default=lambda: uuid.uuid4().hex)
    project = ForeignKeyField(Project, backref="optims", on_delete="CASCADE")
    name = TextField(null=True, default="")
    notes = TextField(null=True, default="")
    profile_perf = ForeignKeyField(ProjectPerfProfile, null=True, default=None)
    profile_loss = ForeignKeyField(ProjectLossProfile, null=True, default=None)
    start_epoch = FloatField(null=True, default=None)
    end_epoch = FloatField(null=True, default=None)


class ProjectOptimizationModifierPruning(BaseCreatedModifiedModel):
    """
    DB model for a project's optimization pruning modifier.
    """

    modifier_id = CharField(primary_key=True, default=lambda: uuid.uuid4().hex)
    optim = ForeignKeyField(
        ProjectOptimization, backref="pruning_modifiers", on_delete="CASCADE"
    )
    start_epoch = FloatField(null=True, default=None)
    end_epoch = FloatField(null=True, default=None)
    update_frequency = FloatField(null=True, default=None)
    mask_type = TextField(null=True, default=None)
    sparsity = FloatField(null=True, default=None)
    balance_perf_loss = FloatField(null=True, default=None)
    filter_min_sparsity = FloatField(null=True, default=None)
    filter_min_perf_gain = FloatField(null=True, default=None)
    filter_min_recovery = FloatField(null=True, default=None)
    nodes = ListObjField(null=True, default=None)

    est_recovery = FloatField(null=True, default=None)
    est_loss_sensitivity = FloatField(null=True, default=None)
    est_perf_sensitivity = FloatField(null=True, default=None)
    est_time = FloatField(null=True, default=None)
    est_time_baseline = FloatField(null=True, default=None)
    est_time_gain = FloatField(null=True, default=None)
    params = FloatField(null=True, default=None)
    params_baseline = FloatField(null=True, default=None)
    compression = FloatField(null=True, default=None)
    flops = FloatField(null=True, default=None)
    flops_baseline = FloatField(null=True, default=None)
    flops_gain = FloatField(null=True, default=None)


class ProjectOptimizationModifierQuantization(BaseCreatedModifiedModel):
    """
    DB model for a project's optimization quantization modifier.
    """

    modifier_id = CharField(primary_key=True, default=lambda: uuid.uuid4().hex)
    optim = ForeignKeyField(
        ProjectOptimization, backref="quantization_modifiers", on_delete="CASCADE"
    )
    start_epoch = FloatField(null=True, default=None)
    end_epoch = FloatField(null=True, default=None)
    level = TextField(null=True, default=None)
    balance_perf_loss = FloatField(null=True, default=None)
    filter_min_perf_gain = FloatField(null=True, default=None)
    filter_min_recovery = FloatField(null=True, default=None)
    nodes = ListObjField(null=True, default=None)

    est_recovery = FloatField(null=True, default=None)
    est_loss_sensitivity = FloatField(null=True, default=None)
    est_perf_sensitivity = FloatField(null=True, default=None)
    est_time = FloatField(null=True, default=None)
    est_time_baseline = FloatField(null=True, default=None)
    est_time_gain = FloatField(null=True, default=None)
    params = FloatField(null=True, default=None)
    params_baseline = FloatField(null=True, default=None)
    compression = FloatField(null=True, default=None)
    flops = FloatField(null=True, default=None)
    flops_baseline = FloatField(null=True, default=None)
    flops_gain = FloatField(null=True, default=None)


class ProjectOptimizationModifierLRSchedule(BaseCreatedModifiedModel):
    """
    DB model for a project's learning rate schedule modifier.
    """

    modifier_id = CharField(primary_key=True, default=lambda: uuid.uuid4().hex)
    optim = ForeignKeyField(
        ProjectOptimization, backref="lr_schedule_modifiers", on_delete="CASCADE"
    )
    start_epoch = FloatField(null=True, default=None)
    end_epoch = FloatField(null=True, default=None)
    init_lr = FloatField(null=True, default=None)
    final_lr = FloatField(null=True, default=None)
    lr_mods = ListObjField(null=True, default=None)


class ProjectOptimizationModifierTrainable(BaseCreatedModifiedModel):
    """
    DB model for a project's optimization trainable modifier.
    """

    modifier_id = CharField(primary_key=True, default=lambda: uuid.uuid4().hex)
    optim = ForeignKeyField(
        ProjectOptimization, backref="trainable_modifiers", on_delete="CASCADE"
    )
    start_epoch = FloatField(null=True, default=None)
    end_epoch = FloatField(null=True, default=None)
    nodes = ListObjField(null=True, default=None)
