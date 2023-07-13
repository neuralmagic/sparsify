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

# Sparsify Models Guide

For any Sparsify Experiments, a dense model can be supplied for sparsification.
One-Shot is the only experiment type that requires a model to be passed in.
For others, a default model will be chosen to best fit the given use case.
Due to the varied ML pipelines and implementations, Sparsify standardizes on a few popular formats for models.
You will need to make sure that your models are formatted properly according to the standards listed below.

## One-Shot

The ONNX model format is the only currently supported format for One-Shot.
See the [SparseML documentation](https://docs.neuralmagic.com) for exporting to ONNX formats.
In the near future, more formats will be added for support with One-Shot.

## Training-Aware and Sparse-Transfer

The PyTorch model format is the only currently supported format for Training-Aware and Sparse-Transfer Experiments.
The exact format will depend on the pipeline, and therefore the use case, for the experiment.
