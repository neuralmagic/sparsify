

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

## Overview
1. One-Shot Experiment Overview
2. One-Shot CLI Quickstart
3. One-Shot Cloud Quickstart
4. Next Steps
5. Resources


### One-Shot Experiment Overview

| Sparsity | Sparsification Speed | Accuracy |
|----------|----------------------|----------|
| **++**   | **+++++**            | **+++**  |

One-Shot Experiments are the quickest way to create a faster and smaller version of your model.
The algorithms are applied to the model post-training, utilizing a calibration dataset, so they result in no further training time and much faster sparsification times compared with Training-Aware Experiments.

Generally, One-Shot Experiments result in a 3-5x speedup with minimal accuracy loss.
They are ideal for when you want to quickly sparsify your model and don't have a lot of time to spend on the sparsification process.


### One-Shot CLI Quickstart

Now that you understand what a One-Shot Experiment is and the benefits, including short optimization time due to post-training algorithms, you can now use the CLI to effectively run a One-Shot Experiment. 

Before you run a One-Shot Experiment, confirm you are logged into the Sparsify CLI. For installation and setup instructions, review the [Sparsify Install and Setup Section](README section.com) in the Sparsify README. 

One-Shot Experiments use the following general command:

```bash
sparsify.run one-shot --use-case USE_CASE --model MODEL --data DATA --optim-level OPTIM_LEVEL
```

The values for each of the arguments follow these general rules:
- [**`USE_CASE`** ](#use_case)
- [**`MODEL`**](#model)
- [**`DATA`**](#data)
- [**`OPTIM_LEVEL`**](#optim_level)

#### USE_CASE

The generally supported use cases for Sparsify are:

-   CV - classification:  `cv-classification`
-   CV - detection:  `cv-detection`
-   CV - segmentation:  `cv-segmentation`
-   NLP - question answering:  `nlp-question_answering`
-   NLP - text classification:  `nlp-text_classification`
-   NLP - sentiment analysis:  `nlp-sentiment_analysis`
-   NLP - token classification:  `nlp-token_classification`
-   NLP - named entity recognition:  `nlp-named_entity_recognition`

Note, other aliases are recognized for these use cases such as image-classification for cv-classification. Sparsify will automatically recognize these aliases and apply the correct use case.

For One-Shot Experiments, both the CLIs and APIs always support custom use cases. To utilize, run a One-Shot Experiment with `--use-case` set to the desired custom use case. This custom use case can be any string as long as it does not contain ASCII characters. 

For full details on Sparsify use cases, read the [Sparsify Use Cases Guide](https://github.com/neuralmagic/sparsify/blob/main/docs/use-cases-guide.md).

#### MODEL

One-Shot requires the model provided to be in an [ONNX format](https://onnx.ai/). For guidance on how to convert a PyTorch model to ONNX, read our [ONNX Export User Guide](https://docs.neuralmagic.com/user-guides/onnx-export). 

In the near future, more formats including PyTorch will be added for support with One-Shot Experiments.

#### DATA

For One-Shot Experiments, Sparsify utilizes the `.npz` format for data storage, which is a file format based on the popular NumPy library. This format is efficient and versatile. 

##### Dataset Specifications

- Each `.npz` file should contain a single data sample, with no batch dimension. This data sample will be run through the ONNX model.
- The `.npz` file should be structured as a dictionary, mapping the input name in the ONNX specification to a numpy array containing the data.
- All data samples should be stored under the same directory, typically named `data`.

The local file structure should look like the following:

```text
data
  -- input1.npz
  -- input2.npz
  -- input3.npz
```

##### Example

For example, if you have a BERT-style model with a sequence length of 128, each `.npz` file should contain a dictionary mapping input names ("input_ids", "attention_mask", "token_type_ids") to numpy arrays of the appropriate size:

```text
{
    "input_ids": ndarray(128,), 
    "attention_mask": ndarray(128,), 
    "token_type_ids": ndarray(128,)
}
```

The dictionary keys should match the names of the inputs in the ONNX model specification, and the shapes of the arrays should match the expected input shapes of the model.

##### Generating NPZ Files

Below is an example script for generating this file structure from a PyTorch module **before the ONNX export**:

```python
import numpy as np
import torch
from torch import Tensor

class NumpyExportWrapper(torch.nn.Module):
    def __init__(self, model):
        super(NumpyExportWrapper, self).__init__()
        self.model = model
        self.model.eval()  # Set model to evaluation mode
        self.numpy_data = []

    def forward(self, *args, **kwargs):
        with torch.no_grad():
            inputs = {}
            batch_size = 0

            for index, arg in enumerate(args):
                if isinstance(arg, Tensor):
                    inputs[f"input_{index}"] = arg
                    batch_size = arg.size[0]

            for key, val in kwargs.items():
                if isinstance(val, Tensor):
                    inputs[key] = val
                    batch_size = val.shape[0]

            start_index = len(self.numpy_data)
            for _ in range(batch_size):
                self.numpy_data.append({})

            for input_key in iter(inputs):
              for idx, input in enumerate(inputs[input_key]):
                  self.numpy_data[start_index+idx][input_key] = input

            return self.model(*args, **kwargs)

    def save(self, path: str = "data"):
        for index, item in enumerate(self.numpy_data):
            npz_file_path = f'{path}/input{str(index).zfill(4)}.npz'
            np.savez(npz_file_path, **item)

        print(f'Saved {len(self.numpy_data)} npz files to {path}')

model = NumpyExportWrapper(YOUR_MODEL)
for data in YOUR_DATA_LOADER:
    model(data[0])
model.save()
```

Note: Replace `YOUR_MODEL` and `YOUR_DATA_LOADER` with your PyTorch model and data loader, respectively.

For full details on Sparsify datasets, read the [Sparsify Datasets Guide](https://github.com/neuralmagic/sparsify/blob/main/docs/datasets-guide.md#sparsify-datasets-guide).

#### OPTIM_LEVEL

When using Sparsify, the optim (sparsification) level is one of the top arguments you should decide on. Specifically, it controls how much sparsification is applied to your model with higher values resulting in faster and more compressed models. At the max range, though, you may see a drop in accuracy.

The optim level can be set anywhere from 0.0 to 1.0, where 0.0 is for no sparsification and 1.0 is for maximum sparsification.
0.5 is the default optim level and is a good starting point for most use cases.

##### One-Shot Optim Levels

Given that One-Shot is applied in post-training, the sparsity ranges are lowered to avoid accuracy drops as compared with sparse transfer or training aware.
The specific ranges are the following:

- optim-level == 0.0: no sparsification is applied and the input model is returned as a baseline test case.
- optim-level < 0.3: INT8 quantization of the model (activations and weights) is applied.
- optim-level >= 0.3: unstructured pruning (sparsity) is applied to the weights of the model from 40% for 0.3 to 80% for 1.0 with linear scaling between. 
  Additionally, INT8 quantization of the model is applied.

The default of 0.5 will result in a ~50% sparse model with INT8 quantization.


For full details on Sparsify optim levels, read the [Sparsify Optim (Sparsification) Levels Guide](https://github.com/neuralmagic/sparsify/blob/main/docs/optim-levels-guide.md).


### Example One-Shot Experiment CLI Commands

Here are code examples of One-Shot Experiments you may wish to run; pick your use case and start sparsifying with One-Shot!

#### Running One-Shot Experiments

##### Computer Vision Use Case:

You have an image classification use case and want to run a One-Shot Experiment on a dense ResNet-50 model using the imagenette dataset. You want to quickly and cheaply generate a sparse model so that you can build a prototype of the ResNet-50 model inferencing on a CPU server in the cloud with DeepSparse. Getting a working model that meets your deployment requirements on the imagenette dataset will give you the confidence to continue on your initiative knowing you can hit the metrics required for the business. 

You are targeting a balanced model in terms of wanting to get a 3-5x performance boost in latency while also maintaining the high accuracy of the model so that you can confidently deploy the model in production to solve your business case. 

You can use a Sparsify One-Shot Experiment to try and reach your goal. You have a standard ResNet-50 model as your dense baseline on imagenette which Sparsify already has as an alias model and npz formatted dataset hosted for you to use out of the box. Since you want to very quickly achieve a 3-5x speedup in latency performance with minimal training costs, a One-Shot Experiment makes the most sense for you for its fast optimization and lower, moderately performant sparsity profile. 

With all of these considerations in mind, run the following One-Shot Experiment command to achieve this use case goal: 
```bash
sparsify.run one-shot --use-case image_classification --model resnet50 --data imagenette --optim-level 0.5
```
The output is as follows:

MARK

##### NLP Use Case:
You are working on a text classification use case to help classify text reviews received from your customers through your e-commerce website. You have been having slow inference times using the BERT-base model and want to improve the performance to save costs. 

You want to quickly and cheaply generate a sparse BERT-base model so that you can use it to classify our customer reviews at a lower cost due to the improved performance and speed of the model. You are focused on improving the throughput of the model to process more requests, faster. 

You are targeting a balanced model in terms of wanting to get a 3-5x performance boost in throughput while having a high accuracy so your classifications are actionable. 

You can use a Sparsify One-Shot Experiment to try and reach your goal. You have a standard BERT-base model as our dense baseline on the SST2 dataset which Sparsify already has as an alias model and npz formatted dataset hosted for you to use out of the box. You want to try and reduce your costs by improving the throughput performance of your model and you are limited by our compute spend and team size. A One-Shot Experiment makes the most sense for you for its fast optimization and lower cost pathway as opposed to fully retraining the model to optimize it. 

With all of these considerations in mind, run the following One-Shot Experiment command to achieve your goal this use case goal: 

```bash
sparsify.run one-shot --use-case text_classification --model bert-base --data sst2 --optim-level 0.5
```
The output is as follows:
MARK


### One-Shot Cloud Quickstart

In addition to manually creating commands, you can use the Sparsify Cloud to generate Sparsify One-Shot Experiment commands. 

To get started, read the [Sparsify Cloud User Guide](https://github.com/neuralmagic/sparsify/blob/main/docs/cloud-user-guide.md). 

 
### Next Steps 

Now that you have successfully run a One-Shot Experiment, check out the [Sparse-Transfer](LINK.com)  and [Training-Aware](LINK.com) Experiments to target different sparsity profiles. 

 
### Resources
To learn more about Sparsify and all of the available pathways outside of One-Shot Experiments, refer to the [Sparsify README](https://github.com/neuralmagic/sparsify).
