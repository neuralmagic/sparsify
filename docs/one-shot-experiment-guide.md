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

# Sparsify One-Shot Experiment Guide

If you're just getting started with Sparsify, we recommend you try out this One-Shot Experiment pathway first. 
We also have Sparse-Transfer and Training-Aware Experiments, which you can explore in the [Next Steps](#next-steps) section of this guide. 

## Table of Contents

1. [Experiment Overview](#experiment-overview)
2. [CLI Quickstart](#cli-quickstart)
4. [Examples](#examples)
5. [Next Steps](#next-steps)
6. [Resources](#resources)


## Experiment Overview

| Sparsity | Sparsification Speed | Accuracy |
|----------|----------------------|----------|
| **++**   | **+++++**            | **+++**  |

One-Shot Experiments are the quickest way to create a faster and smaller version of your model.
The algorithms are applied to the model post-training, utilizing a calibration dataset, so they result in no further training time and much faster sparsification times compared with Training-Aware Experiments.

Generally, One-Shot Experiments result in a 3-5x speedup with minimal accuracy loss.
They are ideal for when you want to quickly sparsify your model and have limited time to spend on the sparsification process.

The CLI Quickstart below will walk you through the steps to run a One-Shot Experiment on your model.
To utilize the cloud pathways for One-Shot Experiments, review the [Cloud User Guide](./cloud-user-guide.md).

## CLI Quickstart

Now that you understand what a One-Shot Experiment is and the benefits, including short optimization time due to post-training algorithms, you can now use the CLI to effectively run a One-Shot Experiment. 

Before you run a One-Shot Experiment, confirm you are logged into the Sparsify CLI. 
For installation and setup instructions, review the [Install and Setup Section](../README.md#1-install-and-setup) in the Sparsify README. 

One-Shot Experiments use the following general command:

```bash
sparsify.run one-shot --use-case USE_CASE --model MODEL --data DATA --optim-level OPTIM_LEVEL*
```

<i>* optional arguments</i>

The description, rules, and possible values for each of the arguments are described below:
- [USE_CASE](#use_case)
- [MODEL](#model)
- [DATA](#data)
- [OPTIM_LEVEL](#optim_level) (Optional)

### USE_CASE

The generally supported use cases for Sparsify are:
- `cv-classification`
- `cv-detection`
- `cv-segmentation`
- `nlp-question_answering`
- `nlp-text_classification`
- `nlp-sentiment_analysis`
- `nlp-token_classification`
- `nlp-named_entity_recognition`

Note that other aliases are recognized for these use cases, such as image-classification for cv-classification. 
Sparsify will automatically recognize these aliases and apply the correct use case.

For One-Shot Experiments, both the CLIs and APIs always support custom use cases. 
To utilize, run a One-Shot Experiment with `--use-case` set to the desired custom use case. 
This custom use case can be any ASCII string. 

### MODEL

One-Shot requires the model provided to be in an [ONNX format](https://onnx.ai/).
The ONNX model must be exported with static input shapes and not contain custom ONNX operators.
For guidance on how to convert a PyTorch model to ONNX, read our [ONNX Export User Guide](https://docs.neuralmagic.com/user-guides/onnx-export). 

In the near future, more formats including PyTorch will be added for support with One-Shot Experiments.

### DATA

For One-Shot Experiments, Sparsify utilizes the `.npz` format for data storage, which is a file format based on the popular NumPy library. 
In the future, more formats will be added for support with One-Shot Experiments.

Specifically, the following structure is expected for the dataset:
```text
data
├── input1.npz
├── input2.npz
├── input3.npz
```

Where each `input#.npz` file contains a single data sample, and the data sample is structured as a dictionary mapping the input name in the ONNX specification to a numpy array containing the data that matches the input shapes without the batch dimension.
For example, a BERT-style model running with a sequence length of 128 would have the following data sample:
```text
{
  "input_ids": ndarray(128,), 
  "attention_mask": ndarray(128,), 
  "token_type_ids": ndarray(128,)
}
```

For more information on the specs and guides for creating the NPZ format, read the [NPZ Dataset Guide](./datasets-guide.md#npz).

#### OPTIM_LEVEL

When using Sparsify, the optim (sparsification) level is one of the top arguments you should decide on. 
Specifically, it controls how much sparsification is applied to your model, with higher values resulting in faster and more compressed models. 
At the max range, though, you may see a drop in accuracy.

Given that One-Shot is applied in post-training, the sparsity ranges are lowered to avoid accuracy drops as compared with Sparse-Transfer or Training-Aware.
The current ranges are the following (subject to change):
- optim-level == 0.0: no sparsification is applied and the input model is returned as a baseline test case.
- optim-level < 0.3: INT8 quantization of the model (activations and weights) is applied.
- optim-level >= 0.3: unstructured pruning (sparsity) is applied to the weights of the model from 40% for 0.3 to 80% for 1.0 with linear scaling between. 
  Additionally, INT8 quantization of the model is applied.

The default of 0.5 will result in a ~50% sparse model with INT8 quantization.

## Examples

Check back in soon for walkthroughs and examples of One-Shot Experiments applied to various popular models and use cases.

### Next Steps 

Now that you have successfully run a One-Shot Experiment, check out the following guides to continue your Sparsify journey:
- [Sparse Transfer Experiment Guide](./sparse-transfer-experiment-guide.md)
- [Training Aware Experiment Guide](./training-aware-experiment-guide.md)

### Resources

To learn more about Sparsify and the available pathways other than One-Shot Experiments, refer to the [Sparsify README](../README.md).
