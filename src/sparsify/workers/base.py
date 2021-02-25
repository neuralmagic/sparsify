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
Code related to the base implementations for job workers
"""

from abc import abstractmethod
from typing import Any, Dict, Iterator


__all__ = ["JobWorkerRegistry", "JobWorker"]


class JobWorkerRegistry(type):
    """
    Registry class for handling and storing BaseJobWorker sub class instances.
    All subclasses are added to the the REGISTRY property
    """

    REGISTRY = {}

    def __new__(cls, name, bases, attrs):
        new_cls = type.__new__(cls, name, bases, attrs)
        cls.REGISTRY[new_cls.__name__] = new_cls

        return new_cls

    @staticmethod
    def create_worker(job):
        cls = JobWorkerRegistry.REGISTRY[job.type_]
        worker = cls(job.job_id, job.project_id, **job.worker_args)

        return worker


class JobWorker(object, metaclass=JobWorkerRegistry):
    """
    The base job worker instance all job workers must extend

    :param job_id: the id of the job the worker is being run for
    :param project_id: the id of the project the job belongs to
    """

    @classmethod
    def get_type(cls) -> str:
        """
        :return: the type of job worker
        """
        return cls.__name__

    @classmethod
    @abstractmethod
    def format_args(cls, **kwargs) -> Dict[str, Any]:
        """
        Format a given args into proper args to be stored for later use
        in the constructor for the job worker.

        :param kwargs: the args to format
        :return: the formatted args to be stored for later use
        """
        raise NotImplementedError()

    def __init__(self, job_id: str, project_id: str):
        self._job_id = job_id
        self._project_id = project_id

    @property
    def job_id(self) -> str:
        """
        :return: the id of the job the worker is being run for
        """
        return self._job_id

    @property
    def project_id(self) -> str:
        """
        :return: the id of the project the job belongs to
        """
        return self._project_id

    @abstractmethod
    def run(self) -> Iterator[Dict[str, Any]]:
        """
        Perform the work for the job.
        Must be implemented as an iterator that returns a
        dictionary containing the progress object on each progress step.

        :return: an iterator containing progress update information
        """
        raise NotImplementedError()
