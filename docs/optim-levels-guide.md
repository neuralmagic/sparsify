<!--
Copyright (c) 2021 - present / Neuralmagic, Inc. All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing,
software distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
-->

# Sparsify Optim (Sparsification) Levels Guide

When using Sparsify, the optim (sparsification) level is one of the top arguments you should decide on.
Specifically, it controls how much sparsification is applied to your model with higher values resulting in faster and more compressed models.
At the max range, though, you may see a drop in accuracy.
The optim level can be set anywhere from 0.0 to 1.0, where 0.0 is for no sparsification and 1.0 is for maximum sparsification.
0.5 is the default optim level and is a good starting point for most use cases.

## Optim Level Values

The general rule is that 0.0 is the baseline model, <0.3 only quantizes the model, and 0.3-1.0 increases the sparsity (unstructured/structured pruning) of the model and applies quantization.
The exact mappings of optim levels depends on the experiment type. 
The current mappings for each experiment type are listed below.
Note, these mappings are subject to change in future releases as we continue to improve Sparsify with new algorithms and capabilities.

### One-Shot Optim Levels

Given that one shot is applied in post-training, the sparsity ranges are lowered to avoid accuracy drops as compared with sparse transfer or training aware.
The specific ranges are the following:

- optim-level == 0.0: no sparsification is applied and the input model is returned as a baseline test case.
- optim-level < 0.3: INT8 quantization of the model (activations and weights) is applied.
- optim-level >= 0.3: unstructured pruning (sparsity) is applied to the weights of the model from 40% for 0.3 to 80% for 1.0 with linear scaling between. 
  Additionally, INT8 quantization of the model is applied.

The default of 0.5 will result in a ~50% sparse model with INT8 quantization.

### Sparse Transfer Optim Levels

Sparse transfer mappings are a bit different from one shot and training aware since it maps to models available in the SparseZoo to transfer from.
Increasing the optim level will result in smaller and more compressed models.
The specific mappings are the following:

- optim-level == 0.0: the largest model selected from the SparseZoo with no optimizations.
- optim-level < 0.25: the largest model selected from the SparseZoo with INT8 quantization applied to the model (activations and weights).
- optim-level < 0.5: the largest model selected form the SparseZoo with both unstructured pruning (sparsity) and INT8 quantization applied to the model.
- optim-level < 0.75: the medium model selected from the SparseZoo with both unstructured pruning (sparsity) and INT8 quantization applied to the model.
- optim-level <= 1.0: the smallest model selected from the SparseZoo with both unstructured pruning (sparsity) and INT8 quantization applied to the model.

The default of 0.5 will result in a medium-sized sparse model with INT8 quantization.

### Training-Aware Optim Levels

Given that training aware is applied while training, the sparsity ranges are increased as compared to one shot since accuracy recovery is easier at higher sparsities.
The specific ranges are the following:

- optim-level == 0.0: no sparsification is applied and the input model is returned as a baseline test case.
- optim-level < 0.3: INT8 quantization of the model (activations and weights) is applied.
- optim-level >= 0.3: unstructured pruning (sparsity) is applied to the weights of the model from 60% for 0.3 to 95% for 1.0 with linear scaling between. 
  Additionally, INT8 quantization of the model is applied.

The default of 0.5 will result in a ~70% sparse model with INT8 quantization.
