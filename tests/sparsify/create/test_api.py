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

import torch
from torch.nn import Module

from sparseml.pytorch.models import mobilenet
from sparsify.create import initialize


def _module_is_quantized(module: Module) -> bool:
    return any(
        submodule.__class__.__name__ == "FakeQuantize" for submodule in module.modules()
    )


def _module_sparsity(module: Module):
    total_params = 0.0
    total_nonzero = 0.0

    for name, parameter in module.named_parameters():
        if ".weight" not in name or "conv" not in name:
            continue
        total_params += parameter.data.numel()
        total_nonzero += parameter.data.count_nonzero()

    if total_params == 0:
        return 0

    return 1 - (total_nonzero / total_params)


def test_create_initialize_and_recipe_apply_mobilenet():
    model = mobilenet(pretrained=True)
    optim = torch.optim.SGD(model.parameters(), lr=0.1)

    # sanity check
    assert not _module_is_quantized(model)
    assert _module_sparsity(model) < 0.01

    manager, optim = initialize(model, optim, 4)
    # check manager content
    assert manager.pruning_modifiers
    assert manager.quantization_modifiers
    assert not manager.distillation_modifiers
    assert optim.__class__.__name__ == "RecipeManagerStepWrapper"

    # emulate entire range of training steps
    for _ in range(20 * 4 + 1):
        optim.step()

    # check expected structure post training
    assert _module_is_quantized(model)
    assert abs(_module_sparsity(model) - 0.8) < 0.05
