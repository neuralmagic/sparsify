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
DB model classes for a project's model file
"""

import datetime
import logging
import os
import uuid

from peewee import CharField, DateTimeField, ForeignKeyField, TextField
from playhouse.sqlite_ext import JSONField

from sparseml.utils import create_dirs
from sparsify.models.jobs import Job
from sparsify.models.projects import PROJECTS_DIR_NAME, BaseProjectModel, Project


__all__ = ["ProjectModel", "PROJECTS_MODEL_DIR_NAME"]


_LOGGER = logging.getLogger(__name__)
PROJECTS_MODEL_DIR_NAME = "model"


class ProjectModel(BaseProjectModel):
    """
    DB model for a project's model file.
    A project must have only one model file stored in the DB.
    """

    model_id = CharField(primary_key=True, default=lambda: uuid.uuid4().hex)
    project = ForeignKeyField(
        Project, unique=True, backref="models", on_delete="CASCADE"
    )
    created = DateTimeField(default=datetime.datetime.now)
    source = TextField(null=True, default=None)
    job = ForeignKeyField(Job, null=True, default=None)
    file = TextField(null=True, default=None)
    analysis = JSONField(null=True, default=None)

    @property
    def dir_path(self) -> str:
        """
        :return: the local directory path for where the model file is stored
        """
        project_id = self.project_id  # type: str

        return os.path.join(
            self._meta.storage.root_path,
            PROJECTS_DIR_NAME,
            project_id,
            PROJECTS_MODEL_DIR_NAME,
        )

    @property
    def file_path(self) -> str:
        """
        :return: the local file path to the data file
        """
        file_name = self.file  # type: str

        return os.path.join(self.dir_path, file_name)

    def setup_filesystem(self):
        """
        Setup the local file system so that it can be used with the data
        """
        create_dirs(self.dir_path)

    def validate_filesystem(self):
        """
        Validate that the local file system and expected files are correct and exist
        """
        if not os.path.exists(self.dir_path):
            raise FileNotFoundError(
                "project model directory at {} does not exist anymore".format(
                    self.dir_path
                )
            )

        if self.file and not os.path.exists(self.file_path):
            raise FileNotFoundError(
                "project model file at {} does not exist anymore".format(self.file_path)
            )

    def delete_filesystem(self):
        """
        Delete the model file from the local file system
        """
        if self.file:
            os.remove(self.file_path)
