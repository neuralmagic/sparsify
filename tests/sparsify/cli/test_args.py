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
import click
from click.testing import CliRunner
from pydantic import BaseModel, Field
import pytest
from sparsify.cli.utils import get_click_options_from_base_model


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
        "model, args, exit_code", [
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
            # (SimpleFieldsWithEnum, ["--a", "foo"], 0),
            # (SimpleFieldsWithEnum, ["--a", "blah"], 2),
            ([MutuallyExclusiveFieldsA, MutuallyExclusiveFieldsB], ["--a", "1", "--b", "2"], 0)
            ([MutuallyExclusiveFieldsA, MutuallyExclusiveFieldsB], ["--a", "1" ], 2)
            ([MutuallyExclusiveFieldsA, MutuallyExclusiveFieldsB], ["--help" ], 0)

        ]
)
def test_simple_fields(model, args, exit_code):
    @click.command()
    @get_click_options_from_base_model(model)
    def main(**kwargs):
        pass

    runner = CliRunner()
    result = runner.invoke(main, args)
    assert result.exit_code == exit_code


