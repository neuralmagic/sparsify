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

# Sparsify Training-Aware Experiment Guide

The Sparsify Training-Aware Experiment Guide is a guide for running Training-Aware Experiments with the Sparsify CLI.
We also have One-Shot and Sparse-Transfer Experiments, which you can explore in the [Next Steps](#next-steps) section of this guide.

## Table of Contents

1. [Experiment Overview](#experiment-overview)
2. [CLI Quickstart](#cli-quickstart)
4. [Examples](#examples)
5. [Next Steps](#next-steps)
6. [Resources](#resources)

## Experiment Overview

| Sparsity  | Sparsification Speed  | Accuracy  |
|-----------|-----------------------|-----------|
| **+++++** | **++**                | **+++++** |

Training-Aware Experiments are the most accurate way to create a faster and smaller model for your dataset.
The algorithms are applied to the model during training, so they offer the best possible recovery of accuracy.
However, they do require additional training time and hyperparameter tuning to achieve the best results.

Generally, Training-Aware Experiments result in a 6–12x speedup with minimal accuracy loss. 
They are ideal when you have the time to train a model, have a custom model, or want to achieve the best possible accuracy.

The CLI Quickstart below will walk you through the steps to run a Training-Aware Experiment on your model.
To utilize the cloud pathways for Training-Aware Experiments, review the [Cloud User Guide](./cloud-user-guide.md).

## CLI Quickstart

Now that you understand what a Training-Aware Experiment is and the benefits, including the best possible recovery of accuracy for an optimized model, you're ready to use the CLI to effectively run a Training-Aware Experiment.

Before you run a Training-Aware Experiment, confirm you are logged in to the Sparsify CLI. 
For instructions on Installation and Setup, review the [Sparsify Install and Setup Section](https://github.com/neuralmagic/sparsify#1-install-and-setup) in the Sparsify README.

Training-Aware Experiments use the following general command:

```bash
sparsify.run training-aware --use-case USE_CASE --model MODEL --data DATA --optim-level OPTIM_LEVEL*
```

<i>* optional arguments</i>

The values for each of the arguments follow these general rules:
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

Currently, custom use cases are not supported for Training-Aware Experiments.

#### MODEL

Models are optional for the Sparse-Transfer pathway. 
If no model is provided, a performance and accuracy balanced base model for the use case will be chosen.

If you choose to override the model, it is expected to be a pre-sparsified model and adhere to the following formats depending on the use case:
- `cv-classification`: SparseML PTH Format
  - [Image Classification Models Guide](./models-guide.md#image-classification)
- `cv-detection` - YOLOv5/YOLOv8 Format 
  - [Object Detection Models Guide](./models-guide.md#object-detection)
  - Example structure: data/classes.txt; data/images/{SPLIT}/{IMAGE.EXT}; data/labels/{SPLIT}/{IMAGE.EXT})
- `cv-segmentation` - YOLOv5/YOLOv8 Format
  - [Image Segmentation Models Guide](./models-guide.md#image-segmentation)
- `nlp-*`: Hugging Face Format
  - [NLP Models Guide](./models-guide.md#nlp)

Currently, custom use cases are not supported for model representation and models must conform to the definitions above.
In the near future, these will be supported through plugin specifications.

For full details on Sparsify models, read the [Sparsify Models Guide](./models-guide.md).

#### DATA

For all Sparsify Experiments, you will need to provide a dataset to create a sparse model.
Due to the varied ML pipelines and implementations, Sparsify standardizes on a few popular formats for datasets.
Confirm that your data is formatted properly according to the standards listed below.

Different use cases may require different input formats depending on what is considered standard for that use case.
Specifically, the following are the supported formats as well as links to specs and guides for creating datasets for each format:
- `cv-classification`: Image Folder Format
  - [Image Classification Dataset Guide](./datasets-guide.md#image-classification)
  - Example structure: data/{SPLIT}/{CLASS}/{IMAGE.EXT})
- `cv-detection` - YOLO Format 
  - [Object Detection Dataset Guide](./datasets-guide.md#object-detection)
  - Example structure: data/classes.txt; data/images/{SPLIT}/{IMAGE.EXT}; data/labels/{SPLIT}/{IMAGE.EXT})
- `cv-segmentation` - YOLO Format
  - [Image Segmentation Dataset Guide](./datasets-guide.md#image-segmentation)
  - Example structure: data/classes.txt; data/images/{SPLIT}/{IMAGE.EXT}; data/annotations/{SPLIT}/{IMAGE.EXT})
- `nlp-*`: Hugging Face CSV or JSONW Format
  - [NLP Dataset Guide](./datasets-guide.md#nlp)
  - Example structure: data/{SPLIT}.csv or data/{SPLIT}.jsonl or data/{SPLIT}.json

Currently, custom use cases are not supported for dataset representation and datasets must conform to the definitions above. 
In the near future, these will be supported through plugin specifications.

For full details on Sparsify datasets, read the [Sparsify Datasets Guide](./datasets-guide.md).

#### OPTIM_LEVEL

When using Sparsify, the optim (sparsification) level is one of the top arguments you should decide on. 
Specifically, it controls how much sparsification is applied to your model with higher values resulting in faster and more compressed models. 
At the max range, though, you may see a drop in accuracy.

Given that Training-Aware is applied while training, the sparsity ranges are increased as compared to one shot since accuracy recovery is easier at higher sparsities.
The specific ranges are the following:
- optim-level == 0.0: no sparsification is applied and the input model is returned as a baseline test case.
- optim-level < 0.3: INT8 quantization of the model (activations and weights) is applied.
- optim-level >= 0.3: unstructured pruning (sparsity) is applied to the weights of the model from 60% for 0.3 to 95% for 1.0 with linear scaling between. 
  Additionally, INT8 quantization of the model is applied.

The default of 0.5 will result in a ~70% sparse model with INT8 quantization, and is a good default to start with.

## Examples

Check back in soon for walkthroughs and examples of One-Shot Experiments applied to various popular models and use cases.
 
### Next Steps 

Now that you have successfully run a Training-Aware Experiment, check out the following guides to continue your Sparsify journey:
- [One-Shot Experiment Guide](./one-shot-experiment-guide.md)
- [Sparse Transfer Experiment Guide](./sparse-transfer-experiment-guide.md)
 
### Resources

To learn more about Sparsify and the available pathways other than Training-Aware Experiments, refer to the [Sparsify README](../README.md).
