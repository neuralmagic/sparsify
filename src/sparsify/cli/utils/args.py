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

from enum import Enum
from typing import Optional

from pydantic import BaseModel, Field


__all__ = [
    "Optimizers",
    "ModelArgs",
]


class Optimizers(Enum):
    """
    Enum for the optimizers supported by sparsify
    """

    adadelta: str = "AdaDelta"
    adagrad: str = "Adagrad"
    adam: str = "Adam"
    adamw: str = "AdamW"
    sparse_adam: str = "SparseAdam"
    adamax: str = "Adamax"
    asgd: str = "ASGD"
    sgd: str = "SGD"
    radam: str = "RAdam"
    rprop: str = "Rprop"
    rmsprop: str = "RMSprop"
    nadam: str = "NAdam"
    lbfgs: str = "LBFGS"


class Engines(Enum):
    """
    Enum for the engines supported by sparsify
    """

    deepsparse: str = "deepsparse"
    onnxruntime: str = "onnxruntime"


class ExperimentType(Enum):
    """
    Enum for the experiment types supported by sparsify
    """

    one_shot: str = "one_shot"
    sparse_transfer: str = "sparse_transfer"
    training_aware: str = "training_aware"


class ModelArgs(BaseModel):
    """
    Model specific arguments for sparsify
    """

    model: Optional[str] = Field(default=None, description="Path to model")
    optimizer: Optional[Optimizers] = Field(
        default=None, description="The optimizer to use"
    )
    teacher: Optional[str] = Field(default=None, description="Path to teacher model")


class DataArgs(BaseModel):
    """
    Data specific arguments for sparsify
    """

    data: Optional[str] = Field(
        default=None,
        description="Path to dataset folder containing training/validation "
        "data or both",
    )
    eval_metric: Optional[str] = Field(
        default=None, description="The metric to use for evaluation"
    )
    train_samples: Optional[int] = Field(
        default=None,
        description="Number of training samples, will represent all samples"
        " if not provided",
    )
    val_samples: Optional[int] = Field(
        default=None,
        description="Number of validation samples, will represent all samples"
        " if not provided",
    )


class DeployArgs(BaseModel):
    """
    Deployment specific arguments for sparsify
    """

    deploy_hardware: Optional[str] = Field(
        default=None, description="The hardware to deploy for"
    )
    deploy_engine: Optional[Engines] = Field(
        default=Engines.deepsparse.value, description="The engine to use for deployment"
    )
    deploy_scenario: Optional[str] = Field(
        default=None, description="The scenario to use for deployment"
    )


class SparsificationArgs(BaseModel):
    """
    Sparsification specific arguments for sparsify
    """

    recipe: Optional[str] = Field(
        default=None, description="The recipe to use for sparsification"
    )
    recipe_args: Optional[str] = Field(
        default=None, description="The recipe arguments to override recipe defaults"
    )
    optim_level: Optional[float] = Field(
        default=None,
        description="The optimization level to use, must be a float b/w [0-1]",
    )
    optim_for_hardware: Optional[float] = Field(
        default=None,
        description="The optimization level for current hardware, "
        "must be a float b/w [0-1]",
    )


class InfoArgs(BaseModel):
    """
    Experiment Information specific arguments for sparsify
    """

    experiment_type: Optional[ExperimentType] = Field(
        default=None,
        description="The experiment type to use, must be one of "
        f"{[element.value for element in ExperimentType]}",
    )

    use_case: Optional[str] = Field(
        default=None, description="The use case this experiment is being run for"
    )

    project_id: Optional[str] = Field(
        default=None, description="The project id for this experiment"
    )

    experiment_id: Optional[str] = Field(
        default=None, description="The experiment id for this experiment"
    )

    working_dir: Optional[str] = Field(
        default=None,
        description="The working directory for this experiment, will default to"
        " the current working directory if not provided",
    )

class APIKey(BaseModel):
    """
    API Key specific arguments for sparsify
    """

    api_key: Optional[str] = Field(
        default=None, description="The sparsify API key"
    )
    