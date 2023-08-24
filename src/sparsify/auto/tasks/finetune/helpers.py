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

from composer.core import Algorithm, Event


all = ["attach_masks", "MaskPrunedWeights"]


class MaskPrunedWeights(Algorithm):
    """
    Composer specific hook which allows us to mask weights after a specific event,
    in this case at the end of the batch. Provided as input to the Trainer while
    finetuning. Note: can also mask weights before the forward pass by adding
    `or event == Event.BATCH_START`
    """

    def match(self, event, state):
        return event == Event.BATCH_END

    @torch.no_grad()
    def apply(self, event, state, logger):
        def mask_weights(module):
            if hasattr(module, "constant_pruning_mask"):
                module.weight *= module.constant_pruning_mask

        state.model.apply(mask_weights)


def attach_masks(model: torch.nn.Module):
    """
    Recursively attach masks to weights which have already been pruned to avoid
    finetuning them further.

    :param model: torch.nnn.Module to recursively attach masks to if the weights are
    already pruned
    """
    for _, module in model.named_children():
        if isinstance(module, torch.nn.Linear):
            constant_pruning_mask = torch.where(
                module.weight == 0,
                torch.tensor(0, dtype=torch.uint8),
                torch.tensor(1, dtype=torch.uint8),
            )
            module.register_buffer(
                "constant_pruning_mask", constant_pruning_mask, persistent=False
            )
        else:
            attach_masks(module)
