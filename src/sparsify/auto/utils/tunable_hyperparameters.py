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
from typing import Any, List, Union

from pydantic import BaseModel, Field, validator
from pydantic.typing import Literal


__all__ = [
    "BaseParameterDistribution",
    "SampledHyperparameter",
    "NumericParameterDistribution",
    "CategoricalParameterDistribution",
]


class BaseParameterDistribution(BaseModel):
    """
    Base class for a hyperparameter distribution, which can be sampled and tuned via
    Neural Magic API calls
    """

    value_type: Literal["float", "int", "categorical"] = Field(
        description="Value type, from float, int, or categorical"
    )


class NumericParameterDistribution(BaseParameterDistribution):
    """
    Numeric distribution which can represent a float or integer hyperparameter
    distribution
    """

    low: Union[float, int] = Field(
        description="Minimum of value range",
    )
    high: Union[float, int] = Field(
        description="Maximum of value range",
    )
    step: Union[float, int, None] = Field(
        description=("Option size of the discretization step"),
        default=None,
    )
    log: bool = Field(
        description="When true, parameter is sampled on a log scale",
        default=False,
    )

    @validator("value_type")
    def valid_type(cls, value_type):
        valid_types = ["float", "int"]
        if value_type not in valid_types:
            raise ValueError(
                f"type for must be one of {valid_types} for class {cls}. Received "
                f"{value_type}"
            )
        return value_type


class CategoricalParameterDistribution(BaseParameterDistribution):
    """
    Categorical distribution constructed from pre-defined, non-ordered values
    """

    choices: List[Union[None, bool, int, float, str]] = Field(
        description="Set of possible value choices to sample from"
    )

    @validator("value_type")
    def valid_type(cls, value_type):
        valid_types = ["categorical"]
        if value_type not in valid_types:
            raise ValueError(
                f"type for must be one of {valid_types} for class {cls}. Received "
                f"{value_type}"
            )
        return value_type


class SampledHyperparameter(BaseModel):
    """
    Represents an instance of a sampled hyperparameter, with distribution and value
    """

    name: str = Field(description="Parameter name")
    source: str = Field(
        description=(
            "Source of where the parameter is controlled. Either 'recipe' or 'CLI', "
            "case insensitive."
        )
    )
    distribution: Union[
        NumericParameterDistribution, CategoricalParameterDistribution
    ] = Field(description="Distribution from which the parameter may be sampled")
    value: Any = Field(description="Samples parameter value")

    @validator("source")
    def lowercase_source(cls, source):
        if source.lower() not in ["recipe", "cli"]:
            raise ValueError(
                f"Source must be 'recipe' or 'cli', case-insensitive. Got {source}"
            )
        return source.lower()
