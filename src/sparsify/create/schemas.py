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
Schemas for supporting sparsify.create
"""

from typing import Optional

from pydantic import BaseModel, Field


__all__ = [
    "RecipeVariables",
]


class RecipeVariables(BaseModel):
    """
    Standardized recipe variables that may be overwritten in auto-generated recipes
    """

    # Training Vars
    num_epochs: float = Field(default=20.0, description="total epochs")
    init_lr: float = Field(default=1e-3, description="initial LR before scheduling")
    final_lr: float = Field(default=1e-7, description="target LR for end of scheduler")
    target: Optional[str] = Field(
        default=None, description="target hardware for deployment. ('vnni', 'tensorrt')"
    )
    # Sparsification Vars
    sparsity: float = Field(default=0.8, description="target pruning final sparsity")
    mask_type: str = Field(default="unstructured", description="pruning type/structure")
    global_sparsity: bool = Field(
        default=True, description="global/layerwise sparsity when set to True/False"
    )
    # Distillation Vars
    hardness: float = Field(default=0.5, description="distillation hardness")
    temperature: float = Field(default=2.0, description="distillation temperature")
