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
from typing import Any, Dict, Optional

import yaml

from pydantic import BaseModel, Field


__all__ = [
    "SparsificationTrainingConfig",
]


class SparsificationTrainingConfig(BaseModel):
    """
    Configuration class for sparsification aware training using SparseML and its
    training integrations
    """

    task: str = Field(
        title="task",
        description="task to train the sparsified model on",
    )
    dataset: str = Field(
        title="dataset",
        description="path to the dataset to train the task on",
    )
    base_model: str = Field(
        title="base_model",
        description="path to the model to be sparsified",
    )
    save_directory: str = Field(
        title="save_directory",
        description="Absolute path to save directory",
    )
    distill_teacher: Optional[str] = Field(
        title="distil_teacher",
        description="optional path to a distillation teacher for training",
        default=None,
    )
    recipe: str = Field(
        title="recipe",
        description="file path to or zoo stub of sparsification recipe to be applied",
    )
    recipe_args: Dict[str, Any] = Field(
        title="recipe_args",
        description="keyword args to override recipe variables with",
        default_factory=dict,
    )
    kwargs: Dict[str, Any] = Field(
        title="kwargs",
        description="optional task specific arguments to add to config",
        default_factory=dict,
    )

    @classmethod
    def from_yaml(cls, config_yaml: str):
        """
        :param config_yaml: raw yaml string or file path to config yaml file to load
        :return: loaded sparsificaiton training config
        """
        if os.path.exists(config_yaml):
            with open(config_yaml) as yaml_file:
                config_yaml = yaml_file.read()

        return cls.parse_obj(yaml.safe_load(config_yaml))

    def yaml(self, file_path: Optional[str] = None):
        """
        :param file_path: optional file path to write the generated yaml config to
        :return: this config represented as a yaml string
        """
        config_dict = self.dict()

        if file_path:
            with open(file_path, "w") as config_file:
                yaml.dump(config_dict, config_file)

        return yaml.dump(config_dict)
