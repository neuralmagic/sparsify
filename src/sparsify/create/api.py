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
User facing API entrypoints for sparsify.create
"""

import logging
from typing import Any, Dict, Optional, Union

import torch
from torch.nn import Module

from sparseml.pytorch.optim import ScheduledModifierManager
from sparsify.create.schemas import RecipeVariables
from sparsifyml.create import create_recipe


_LOGGER = logging.getLogger(__name__)


def initialize(
    model: Module,
    optimizer: torch.optim.Optimizer,
    steps_per_epoch: int,
    pruning: Union[str, bool, None] = True,
    quantization: Union[bool, str] = True,
    lr: str = "linear",
    distillation: bool = False,
    distillation_teacher: Optional[Union[str, Module]] = None,
    scaler: Optional[torch.cuda.amp.GradScaler] = None,
    recipe_variables: Union[RecipeVariables, Dict[str, Any], None] = None,
):
    """
    Prepares a pytorch model and optimizer for sparsification. Under the hood,
    a sparsification recipe will be created and initialized with SparseML to
    apply the desired optimizations

    :param model: PyTorch Module to sparsify
    :param optimizer: the optimizer used in model training
    :param steps_per_epoch: number of steps (batches) in each epoch
    :param pruning: optional pruning algorithm to use in the recipe, can be any of the
        following, `true` (represents Magnitude/Global-Magnitude pruning according to
        global_sparsity), `false` (No pruning), `acdc`, `mfac`, `movement`, `obs`,
        `constant`, `transfer`, or `sparse-transfer`. Defaults to `true`
    :param quantization: `True` if quantization needs to be applied else `False`.
        Defaults to `True`
    :param lr: the learning rate schedule function. Defaults to `linear`
    :param distillation: if `True` distillation will be added to the recipe.
        distillation_teacher should also be provided to initialize distillation if
        using a custom teacher. Will default to 'self' distillation if distillation
        is enabled with no teacher set
    :param scaler: scaler used to wrap optimizer for mix precision training, may be
        any object that wraps the optimizer `step` call
    :param distillation_teacher: teacher Module to use with distillation if enabled,
        defaults to self distillation if None provided
    :param recipe_variables: additional variables to override training with
    :return: tuple of the sparsification manager
        (`sparseml.pytorch.optim.ScheduledModifierManager`) and the wrapped optimizer
        object (scaler if provided otherwise optimizer)
    """

    # create recipe from sparsifyml
    _LOGGER.info(
        f"[sparsify] Creating recipe with pruning={pruning}, "
        f"quantization={quantization}, distilation={distillation}"
    )
    if pruning in ["transfer", "sparse-transfer"]:
        pruning = "constant"
    recipe_variables = recipe_variables or RecipeVariables()  # get defaults
    recipe = create_recipe(
        model=model,
        pruning=pruning,
        quantization=quantization,
        distillation=distillation,
        lr=lr,
        recipe_variables=recipe_variables,
    )

    _LOGGER.info(
        "Initializing sparsification by wrapping "
        f"{scaler.__class__.__name__ or 'optimizer'}"
    )
    manager = ScheduledModifierManager.from_yaml(recipe)
    manager.initialize(
        module=model,
        epoch=0.0,
        distillation_teacher=(
            distillation_teacher or "self" if distillation else "disable"
        ),
    )

    wrapped_optim = manager.modify(
        model,
        optimizer,
        steps_per_epoch=steps_per_epoch,
        wrap_optim=scaler,
    )

    return manager, wrapped_optim
