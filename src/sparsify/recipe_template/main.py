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


from typing import Optional

from torch.nn import Module

from sparseml.pytorch.utils import get_prunable_layers

from sparsify.recipe_template.templates import (
    PRUNE_QUANT_TEMPLATE,
    PRUNE_TEMPLATE,
    QUANT_TEMPLATE,
)

__all__ = ["recipe_template"]


def _format_prunable_layers(prunable_layers):
    if not prunable_layers:
        return "__ALL_PRUNABLE__"
    return [layer_name for layer_name, _ in prunable_layers]


def recipe_template(
    pruning: str = "false",
    quantization: str = "false",
    lr: str = "linear",
    model: Optional[Module] = None,
    **kwargs,
):
    """
    Utility function to return a valid recipe

    :param pruning: An optional string representing which pruning algo must be applied,
        when `true` Gradual Magnitude Pruning is applied. (As of now only GMP supported)
    :param quantization: An optional string representing the kind of quantization to
        be applied or not, set to `vnni` for 4-block, `false` to skip quantization
        altogether
    :param lr: The learning rate growth or decay function to be applied
    :param model: An Optional instantiated pytorch model, if specified the recipe is
        altered according to the model
    :return: A valid yaml string representing the recipe
    """
    template = _get_template(pruning=pruning, quantization=quantization, )
    prunable_layers = get_prunable_layers(model) if model else None

    return template.format(
        learning_rate=lr,
        mask_type="block4" if quantization == "vnni" else "unstructured",
        prunable_params=_format_prunable_layers(prunable_layers)
    )


def _get_template(pruning, quantization):
    if pruning != "false" and quantization != "false":
        return PRUNE_QUANT_TEMPLATE

    elif pruning != "false":
        return PRUNE_TEMPLATE
    else:
        return QUANT_TEMPLATE
