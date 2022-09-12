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

from sparsify.recipe_template.templates import (
    PRUNE_QUANT_TEMPLATE,
    PRUNE_TEMPLATE,
    QUANT_TEMPLATE,
)


__all__ = ["recipe_template"]


def recipe_template(
    pruning: Optional[str] = "false",
    quantization: Optional[str] = "false",
    **kwargs,
):
    """
    Utility function to return a valid recipe

    :param pruning: An Optional string representing which pruning algo must be applied,
        when `true` Gradual Magnitude Pruning is applied. (As of now only GMP supported)
    :param quantization: An Optional string representing the kind of quantization to
        be applied or not, set to `vnni` for 4-block, `false` to skip quantization
        altogether

    :return: A valid yaml string representing the recipe
    """

    if pruning != "false" and quantization != "false":
        return PRUNE_QUANT_TEMPLATE

    elif pruning != "false":
        return PRUNE_TEMPLATE
    else:
        return QUANT_TEMPLATE
