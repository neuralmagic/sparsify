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

import pytest

import click
from click.testing import CliRunner
from pydantic import BaseModel, Field, ValidationError
from sparsify.cli.utils import get_click_options_from_base_model
from sparsify.cli.utils.helpers import get_base_models_from_options


class SimpleFieldsWithDefaults(BaseModel):
    a: int = Field(default=1, description="A simple integer")
    b: int = Field(default=2, description="Another simple integer")


class SimpleFieldWithDefaultFactory(BaseModel):
    a: int = Field(default_factory=lambda: 1, description="A simple integer")


class SimpleFieldsWithoutDefaults(BaseModel):
    a: int = Field(description="A simple required integer")
    b: int = Field(description="Another simple required integer")


class OptionalStringField(BaseModel):
    a: Optional[str] = Field(description="An optional string")


class FooEnum(Enum):
    FOO = "foo"
    BAR = "bar"


class SimpleFieldsWithEnum(BaseModel):
    a: FooEnum = Field(description="A simple enum")


class MutuallyExclusiveFieldsA(BaseModel):
    a: int = Field(description="A simple integer")


class MutuallyExclusiveFieldsB(BaseModel):
    b: int = Field(description="Another simple integer")


@pytest.mark.parametrize(
    "model_or_models, args, exit_code",
    [
        (SimpleFieldsWithDefaults, ["--a", "3", "--b", "4"], 0),
        (SimpleFieldsWithDefaults, ["--a", "3.14", "--b", "4"], 2),
        (SimpleFieldsWithDefaults, [], 0),
        (SimpleFieldsWithDefaults, ["--help"], 0),
        (SimpleFieldsWithoutDefaults, ["--help"], 0),
        (SimpleFieldsWithoutDefaults, [], 2),
        (SimpleFieldsWithoutDefaults, ["--a", "1"], 2),
        (SimpleFieldWithDefaultFactory, [], 0),
        (SimpleFieldWithDefaultFactory, ["--a", "3"], 0),
        (OptionalStringField, [], 0),
        (OptionalStringField, ["--a", "foo"], 0),
        (SimpleFieldsWithEnum, ["--a", "foo"], 0),
        (SimpleFieldsWithEnum, ["--a", "blah"], 2),
        (
            [MutuallyExclusiveFieldsA, MutuallyExclusiveFieldsB],
            ["--a", "1", "--b", "2"],
            0,
        ),
        ([MutuallyExclusiveFieldsA, MutuallyExclusiveFieldsB], ["--a", "1"], 2),
        ([MutuallyExclusiveFieldsA, MutuallyExclusiveFieldsB], ["--help"], 0),
    ],
)
def test_simple_fields(model_or_models, args, exit_code):
    @click.command()
    @get_click_options_from_base_model(model_or_models)
    def main(**kwargs):
        pass

    runner = CliRunner()
    result = runner.invoke(main, args)
    assert result.exit_code == exit_code


@pytest.mark.parametrize(
    "model_or_models, args, expected_error",
    [
        (SimpleFieldsWithDefaults, {"a": 3, "b": 4}, None),
        (SimpleFieldsWithDefaults, {"a": 3.14, "b": 4}, None),  # will be cast to int
        (SimpleFieldsWithDefaults, {"a": 3.14, "b": "blah"}, ValidationError),
        (OptionalStringField, {}, None),
    ],
)
def test_get_base_models_from_options(model_or_models, args, expected_error):
    if expected_error:
        with pytest.raises(expected_error):
            get_base_models_from_options(model_or_models, args)

    else:
        base_models = get_base_models_from_options(model_or_models, args)

        models = model_or_models
        if not isinstance(models, list):
            models = [models]

        assert len(base_models) == len(models)

        for expected_model_class, actual_model in zip(models, base_models):
            assert expected_model_class == actual_model.__class__
            for field in expected_model_class.__fields__.values():
                if field.name in args:
                    actual_field_value = getattr(actual_model, field.name)
                    expected_field_value = args[field.name]
                    assert (
                        actual_field_value == expected_field_value
                        or actual_field_value == field.outer_type_(expected_field_value)
                    )
