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
DB model classes for a project and it's nested files
"""

import datetime
import logging
import os
import shutil
import uuid
from abc import abstractmethod

from peewee import CharField, DateTimeField, FloatField, IntegerField, TextField

from sparseml.utils import create_dirs, path_file_size
from sparsify.models.base import BaseModel


__all__ = ["BaseProjectModel", "Project", "PROJECTS_DIR_NAME"]


_LOGGER = logging.getLogger(__name__)
PROJECTS_DIR_NAME = "projects"


class BaseProjectModel(BaseModel):
    @abstractmethod
    def setup_filesystem(self):
        """
        Setup the local file system so that it can be used with the data
        """
        raise NotImplementedError()

    @abstractmethod
    def validate_filesystem(self):
        """
        Validate that the local file system and expected files are correct and exist
        """
        raise NotImplementedError()

    @abstractmethod
    def delete_filesystem(self):
        """
        Delete the state from the local file system
        """
        raise NotImplementedError()


class Project(BaseProjectModel):
    """
    DB model for a project's data file.
    A project may have multiple data files stored in the DB.
    """

    project_id = CharField(primary_key=True, default=lambda: uuid.uuid4().hex)
    name = TextField(null=True, default="")
    description = TextField(null=True, default="")
    created = DateTimeField(default=datetime.datetime.now)
    modified = DateTimeField(default=datetime.datetime.now)
    training_optimizer = TextField(null=True, default=None)
    training_epochs = IntegerField(null=True, default=None)
    training_lr_init = FloatField(null=True, default=None)
    training_lr_final = FloatField(null=True, default=None)

    @property
    def dir_path(self) -> str:
        """
        :return: the local directory path for where project's files are stored
        """
        project_id = self.project_id  # type: str

        return os.path.join(self._meta.storage.root_path, PROJECTS_DIR_NAME, project_id)

    @property
    def dir_size(self) -> int:
        """
        Size of the folder on the local file system
        containing all of the files for the project
        """
        try:
            return path_file_size(self.dir_path)
        except Exception:
            return 0

    def save(self, *args, **kwargs):
        """
        Override for peewee save function to update the modified date
        """
        self.modified = datetime.datetime.now()

        return super().save(*args, **kwargs)

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
                "project directory at {} does not exist anymore".format(self.dir_path)
            )

    def delete_filesystem(self):
        """
        Delete the folder from the local file system
        containing all of the files for the project
        """
        shutil.rmtree(self.dir_path)
