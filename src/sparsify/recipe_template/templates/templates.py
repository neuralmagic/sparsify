# flake8:noqa

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


__all__ = [
    "PRUNE_TEMPLATE",
    "QUANT_TEMPLATE",
    "PRUNE_QUANT_TEMPLATE",
]


QUANT_TEMPLATE = """
# Epoch Params
num_pruning_active_epochs: 20
num_pruning_finetuning_epochs: 10
num_qat_active_epochs: 2.5
num_qat_finetuning_epochs: 2.5

# LR params
init_lr: 1.5e-4
final_lr: 0
lr_func: linear # swap in based on lr type from user

# Pruning Params
pruning_init_sparsity: 0.7
pruning_final_sparsity: 0.9
pruning_update_frequency: 0.01
mask_type: "unstructured" 
global_sparsity: False

# QAT Params
quantization_submodules: null

# convenience variables
_num_pruning_epochs: eval(num_pruning_active_epochs + num_pruning_finetuning_epochs)
_num_qat_epochs: eval(num_qat_active_epochs + num_qat_finetuning_epochs)
_num_epochs: eval(_num_pruning_epochs + _num_qat_epochs)


pruning_modifiers:
 - !ConstantPruningModifier
 start_epoch: 0.0
 params: __ALL_PRUNABLE__

quantization_modifiers:
 - !QuantizationModifier
 start_epoch: eval(_num_pruning_epochs)
 submodules: eval(quantization_submodules)
 disable_quantization_observer_epoch: eval(_num_pruning_epochs + 
 num_qat_active_epochs)
 freeze_bn_stats_epoch: eval(_num_pruning_epochs + num_qat_active_epochs)
 tensorrt: False # update if tensorrt is target deployment
 quantize_linear_activations: False
 quantize_conv_activations: False
 quantize_embedding_activations: False
 exclude_module_types: ['LayerNorm', 'Tanh']
"""

PRUNE_TEMPLATE = """
# Epoch Params
num_pruning_active_epochs: 20
num_pruning_finetuning_epochs: 10

# LR params
init_lr: 1.5e-4
final_lr: 0
lr_func: linear  # swap in based on lr type from user

# Pruning Params
pruning_init_sparsity: 0.7
pruning_final_sparsity: 0.9
pruning_update_frequency: 0.01
mask_type: "unstructured"  # when user specifies VNNI target, use "block4", "2:4" for 
tensorrt
global_sparsity: False


# convenience variables
_num_pruning_epochs: eval(num_pruning_activce_epochs + num_pruning_finetuning_epochs)
_num_epochs: eval(num_pruning_active_epochs + num_pruning_finetuning_epochs)


# Modifiers:
training_modifiers:
  - !EpochRangeModifier
    start_epoch: 0.0
    end_epoch: eval(_num_epochs)
    
  - !LearningRateFunctionModifier
    start_epoch: 0
    end_epoch: eval(_num_epochs)
    lr_func: eval(lr_func)
    init_lr: eval(init_lr)
    final_lr: eval(final_lr)

pruning_modifiers:  # only add in if pruning is specified
  - !MagnitudePruningModifier 
    params: __ALL_PRUNABLE__  
    start_epoch: 0
    end_epoch: eval(num_pruning_active_epochs)
    init_sparsity: eval(pruning_init_sparsity)
    final_sparsity: eval(pruning_final_sparsity)
    update_frequency: eval(pruning_update_frequency)
    mask_type: eval(mask_type)
    global_sparsity: eval(global_sparsity)
"""

PRUNE_QUANT_TEMPLATE = """

# Epoch Params
num_pruning_active_epochs: 20
num_pruning_finetuning_epochs: 10
num_qat_active_epochs: 2.5
num_qat_finetuning_epochs: 2.5

# LR params
init_lr: 1.5e-4
final_lr: 0
lr_func: linear  # swap in based on lr type from user

# Pruning Params
pruning_init_sparsity: 0.7
pruning_final_sparsity: 0.9
pruning_update_frequency: 0.01
mask_type: "unstructured"  # when user specifies VNNI target, use "block4", "2:4" for 
tensorrt
global_sparsity: False

# QAT Params
quantization_submodules: null  # default to target all (None), user may override with 
a list to target only

# convenience variables
_num_pruning_epochs: eval(num_pruning_active_epochs + num_pruning_finetuning_epochs)
_num_qat_epochs: eval(num_qat_active_epochs + num_qat_finetuning_epochs)
_num_epochs: eval(_num_pruning_epochs + _num_qat_epochs)


# Modifiers:
training_modifiers:
  - !EpochRangeModifier
    start_epoch: 0.0
    end_epoch: eval(_num_epochs)

  - !LearningRateFunctionModifier
    start_epoch: 0
    end_epoch: eval(_num_epochs)
    lr_func: eval(lr_func)
    init_lr: eval(init_lr)
    final_lr: eval(final_lr)

pruning_modifiers:  
  - !MagnitudePruningModifier 
    params: __ALL_PRUNABLE__  
    start_epoch: 0
    end_epoch: eval(num_pruning_activce_epochs)
    init_sparsity: eval(pruning_init_sparsity)
    final_sparsity: eval(pruning_final_sparsity)
    update_frequency: eval(pruning_update_frequency)
    mask_type: eval(mask_type)
    global_sparsity: eval(global_sparsity)

quantization_modifiers: 
  - !QuantizationModifier
      start_epoch: eval(_num_pruning_epochs)
      submodules: eval(quantization_submodules)
      disable_quantization_observer_epoch: eval(_num_pruning_epochs + 
      num_qat_active_epochs)
      freeze_bn_stats_epoch: eval(_num_pruning_epochs + num_qat_active_epochs)
      tensorrt: False  # update if tensorrt is target deployment
      quantize_linear_activations: False
      quantize_conv_activations: False
      quantize_embedding_activations: False
      exclude_module_types: ['LayerNorm', 'Tanh']
"""
