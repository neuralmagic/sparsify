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


class ModelArgs(BaseModel):
    model: Optional[str] = Field(description="Path to model")
    optimizer: Optional[Optimizers] = Field(description="The optimizer to use")
    teacher: Optional[str] = Field(description="Path to teacher model")
