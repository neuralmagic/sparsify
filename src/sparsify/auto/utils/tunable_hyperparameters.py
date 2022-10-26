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
from typing import Any, Callable, Dict, List, Optional, Union

from pydantic import BaseModel, Field, validator
from pydantic.typing import Literal


__all__ = [
    "BaseTunableParameter",
    "SampledHyperparameter",
    "NumericTunableParameter",
    "CategoricalTunableParameter",
    "TunableParameterFactory",
]


class BaseTunableParameter(BaseModel):
    """
    Base class for a single hyperparameter that can be tuned via Neural Magic API calls
    """

    name: str = Field()
    value_type: Literal["float", "int", "categorical"] = Field(
        description="Value type, from float, int, or categorical"
    )


class NumericTunableParameter(BaseTunableParameter):
    """
    Numeric hyperparameter that can be sampled from a range of values
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


# TODO: rename to definition
class CategoricalTunableParameter(BaseTunableParameter):
    """
    Categorical hyperparameter that can be sampled from pre-defined, non-ordered values
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
    definition: Union[
        CategoricalTunableParameter, NumericTunableParameter, BaseTunableParameter
    ] = Field()
    value: Any = Field()


class TunableParameterFactory:
    def __init__(
        self,
        name: str,
        value_type: str,
        parameter_fields_callable: Optional[Callable[[Any], Dict]] = None,
        **parameter_kwargs,
    ):
        valid_types = ["float", "int", "categorical"]
        if value_type not in valid_types:
            raise ValueError(
                f"type for must be one of {valid_types}. Received {value_type}"
            )

        if not parameter_fields_callable and not parameter_kwargs:
            raise ValueError(
                "At least one of parameter_fields_callable or parameter_kwargs must be "
                "provided"
            )

        self.name = name
        self.value_type = value_type
        self.constructor_class = (
            CategoricalTunableParameter
            if self.value_type == "categorical"
            else NumericTunableParameter
        )
        self.parameter_fields_callable = parameter_fields_callable
        self.parameter_kwargs = parameter_kwargs
        self.parameter_kwargs["name"] = name
        self.parameter_kwargs["value_type"] = value_type

        if not self.parameter_fields_callable:
            required_fields = set(
                [
                    key
                    for key, val in self.constructor_class.__fields__.items()
                    if val.required
                ]
            )
            provided_fields = set(self.parameter_kwargs)

            if required_fields != provided_fields:
                missing_fields = list(required_fields - provided_fields)
                extra_fields = list(provided_fields - required_fields)
                extra_fields = [
                    field not in self.constructor_class.__fields__.keys()
                    for field in extra_fields
                ]

                if missing_fields or extra_fields:
                    raise ValueError(
                        "Provided parameter_kwargs don't match expected fields for "
                        f"{self.constructor_class}."
                        f"\nExpected: {sorted(required_fields)}"
                        f"\nReceived: {sorted(provided_fields)}"
                    )

    def __call__(
        self, value: Union[None, bool, int, float, str]
    ) -> BaseTunableParameter:
        parameter_fields = (
            self.parameter_fields_callable(value)
            if self.parameter_fields_callable
            else {}
        )
        parameter_fields.update(self.parameter_kwargs)
        return self.constructor_class(**parameter_fields)
