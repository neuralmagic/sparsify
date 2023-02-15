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

import pytest

from sparsify.schemas import APIArgs


@pytest.mark.parametrize(
    "target_api_args",
    [
        APIArgs(task="question-answering", dataset="squad"),
        APIArgs(
            task="image-classification",
            dataset="imagenette",
            base_model="zoo:resnet50",
            recipe="zoo:resnet50-pruned_quant",
            recipe_args=dict(target_sparsity=0.8),
            distill_teacher="zoo:resnet50",
            kwargs=dict(model_tag="resnet50-imagenette"),
        ),
    ],
)
def test_api_args_from_cli(target_api_args):
    api_fields = APIArgs.__fields__

    # build cli args
    cli_args = []
    for field_name, field in api_fields.items():
        target_val = getattr(target_api_args, field_name)
        default_val = (
            field.default_factory() if field.default_factory else field.default
        )

        if target_val == default_val:
            # unfilled default
            continue

        if isinstance(target_val, dict):
            target_val = str(target_val)
        cli_args.append(f"--{field_name}")
        cli_args.append(target_val)

    parsed_api_args = APIArgs.from_cli(args=cli_args)

    for field_name in api_fields.keys():
        target_val = getattr(target_api_args, field_name)
        parsed_val = getattr(parsed_api_args, field_name)
        assert isinstance(parsed_val, type(target_val))
        assert target_val == parsed_val
