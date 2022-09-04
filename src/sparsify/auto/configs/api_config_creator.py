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
Base functionality for creating a sparsification config from the Sparsify.Auto
entrypoint API
"""


from abc import ABC, abstractmethod
from typing import Any, Dict, List

from sparsify.auto.api import APIArgs, Metrics
from sparsify.auto.configs.sparsification_training_config import (
    SparsificationTrainingConfig,
)
from sparsify.auto.utils import TaskName


__all__ = [
    "APIConfigCreator",
]


_CONFIG_CREATOR_IMPLS = {}  # map task name to config creator class


class APIConfigCreator(ABC):
    """
    Base class for generating a sparsification config from sparsify.auto entrypoint API
    args.  All calls to create a config should go through APIConfigCreator.get_config
    regardless of task or args.

    Expected Usage:

    ```python
    sparsification_config = APIConfigCreator.get_config(api_args)
    ```

    Lifecycle:
    Config arguments are set incrementally, so current steps in the creation process
    may reference previous steps

    Sub-classes should implement _set_base_model_and_distill_teacher and _set_recipe

    1. `task` and `dataset` are set from the given APIArgs
    2. `base_model` and optional `distill_teacher` set by calling _set_base_model
    3. `recipe` and optional `recipe_args` set by calling _set_recipe
    4. `kwargs` should be set as needed in previous methods to support the set
        arguments

    :param api_args: APIArgs schema parsed from sparsify.auto entrypoint API. Task name
        must match task of this creator implementation
    """

    def __init__(self, api_args: APIArgs):
        self._api_args = api_args
        self._config_args = None
        self._build_config_args()
        self._config = SparsificationTrainingConfig(**self._config_args)

    @classmethod
    def get_config(cls, api_args: APIArgs) -> SparsificationTrainingConfig:
        """
        Generates a SparsificationTrainingConfig based on the given APIArgs

        :param api_args: Sparsify.Auto API entrypoint args object
        :return: generated SparsificationTrainingConfig
        """
        config_creator_constructor = cls._get_config_creator_constructor(
            TaskName(api_args.task)
        )
        config_creator = config_creator_constructor(api_args)
        return config_creator.config

    @classmethod
    def register(cls, task: TaskName):
        """
        Decorator to register task implementations of APIConfigCreator with the
        get_config method registry

        :param task: main task name the implementor class creates configs for
        """

        def _register_config_creator_decorator(config_creator_class: APIConfigCreator):
            if not issubclass(config_creator_class, cls):
                raise RuntimeError(
                    f"Attempting to register config creator {config_creator_class}. "
                    f"Registered config creators must inherit from {cls}"
                )

            if task in _CONFIG_CREATOR_IMPLS and (
                config_creator_class is not _CONFIG_CREATOR_IMPLS[task]
            ):
                raise RuntimeError(
                    f"task {task} already registered by a different "
                    f"implementation: {_CONFIG_CREATOR_IMPLS[task]}"
                )
            _CONFIG_CREATOR_IMPLS[task] = config_creator_class

            # set task and task_aliases as class level property
            cls.task = task

            return config_creator_class

        return _register_config_creator_decorator

    @staticmethod
    def task_list() -> List[TaskName]:
        """
        Return a list of registered tasks
        """
        return list(str(key) for key in _CONFIG_CREATOR_IMPLS.keys())

    @staticmethod
    def task_aliases_dict() -> Dict[str, List[str]]:
        """
        Return a dictionary mapping the default task name (str) to a list of task
        aliases (str)
        """
        return {str(task): task.aliases for task in _CONFIG_CREATOR_IMPLS}

    @property
    def config(self) -> SparsificationTrainingConfig:
        """
        :return: the SparsificationTrainingConfig generated by this config creator from
            the given APIArgs
        """
        return self._config

    @property
    def api_args(self) -> APIArgs:
        """
        :return: the APIArgs object the SparsificationTrainingConfig should be created
            from
        """
        return self._api_args

    @property
    def config_args(self) -> Dict[str, Any]:
        """
        :return: dictionary containing the currently set arguments for the
            SparsificationTrainingConfig to be created
        """
        return self._config_args

    @staticmethod
    def update_hyperparameters(
        config: SparsificationTrainingConfig, metrics: Metrics
    ) -> SparsificationTrainingConfig:
        """
        Use metrics to tune training hyperparameters for improved results
        """
        config_creator_class = APIConfigCreator._get_config_creator_constructor(
            config.task
        )
        return config_creator_class.update_hyperparameters(config, metrics)

    @staticmethod
    def metrics_satisfied(
        config: SparsificationTrainingConfig, metrics: Metrics
    ) -> bool:
        """
        Check if run metrics meet the expected level for this config
        """
        config_creator_class = APIConfigCreator._get_config_creator_constructor(
            config.task
        )
        return config_creator_class.metrics_satisfied(config, metrics)

    @staticmethod
    def _get_config_creator_constructor(task):
        config_creator_constructor = _CONFIG_CREATOR_IMPLS.get(task)

        if not config_creator_constructor:
            raise ValueError(
                f"No {APIConfigCreator.__name__} implementation found for task {task}."
                " Implementations must be registered with the .register() decorator"
            )

        return config_creator_constructor

    @abstractmethod
    def _set_base_model(self):
        """
        Method must set `base_model` in `self._config_args` optionally sets
        `distill_teacher`
        """
        raise NotImplementedError()

    @abstractmethod
    def _set_recipe(self):
        """
        Method must set `recipe` in `self._config_args` optionally sets `recipe_args`
        """
        raise NotImplementedError()

    def _build_config_args(self):
        # builds config args for SparsificationTrainingConfig incrementally
        # from the given `api_args`
        self._config_args = dict(
            task=self._api_args.task,
            dataset=self._api_args.dataset,
            save_directory=self._api_args.save_directory,
            distill_teacher=self._api_args.distill_teacher,  # optionally set w/ model
            recipe_args=self._api_args.recipe_args,  # optionally set with recipe
            kwargs=self._api_args.kwargs,  # optionally built along config
        )

        self._set_base_model()
        if not self._config_args.get("base_model"):
            raise RuntimeError(
                f"{self.__class__.__name__} must set base_model in _set_base_model "
                f"found {self._config_args.get('base_model')}"
            )

        self._set_recipe()
        if not self._config_args.get("recipe"):
            raise RuntimeError(
                f"{self.__class__.__name__} must set recipe in _set_recipe "
                f"found {self._config_args.get('recipe')}"
            )
