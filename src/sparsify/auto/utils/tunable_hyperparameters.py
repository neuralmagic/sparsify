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
Templates for tunable hyperparameters, to be tuned by the Neural Magic API
"""
from typing import Any, List, NamedTuple, Union

from pydantic import BaseModel, Field, validator
from pydantic.typing import Literal


__all__ = [
    "BaseTunableParameter",
    "SampledHyperparameter",
    "NumericTunableParameter",
    "CategoricalTunableParameter",
]


class BaseTunableParameter(BaseModel):
    """
    Base class for a single hyperparameter that can be tuned via Neural Magic API calls
    """

    name: str = Field(description="Parameter name")
    type: Literal["float", "int", "categorical"] = Field(
        description="Value type, from float, int, or categorical"
    )


SampledHyperparameter = NamedTuple(
    "SampledHyperparameter", [("Definition", BaseTunableParameter), ("Value", Any)]
)


class NumericTunableParameter(BaseTunableParameter):
    """
    Numeric hyperparameter that can be sampled from a range of values
    """

    low: Union[float, int] = Field(
        description="Minimum of value range. Not used for categorical parameters",
        default=None,
    )
    high: Union[float, int] = Field(
        description="Maximum of value range. Not used for categorical parameters",
        default=None,
    )
    step: Union[float, int, None] = Field(
        description=(
            "Size of the discretization step. Not used for categorical parameters, not "
            "required for other parameter types"
        ),
        default=None,
    )
    log: bool = Field(
        description="When true, parameter is sampled on a log scale",
        default=False,
    )

    @validator
    def valid_type(cls, type):
        valid_types = ["float", "int"]
        if type not in valid_types:
            raise ValueError(
                f"type for must be one of {valid_types} for class {cls}. Received "
                f"{type}"
            )


class CategoricalTunableParameter(BaseTunableParameter):
    """
    Categorical hyperparameter that can be sampled from pre-defined, non-ordered values
    """

    choices: List[Union[None, bool, int, float, str]] = Field(
        description="Set of possible value choices to sample from"
    )

    @validator
    def valid_type(cls, type):
        valid_types = ["categorical"]
        if type not in valid_types:
            raise ValueError(
                f"type for must be one of {valid_types} for class {cls}. Received "
                f"{type}"
            )
