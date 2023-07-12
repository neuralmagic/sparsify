
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
4. Resources


### One-Shot Experiment Overivew

| Sparsity | Sparsification Speed | Accuracy |
|----------|----------------------|----------|
| **++**   | **+++++**            | **+++**  |

One-Shot Experiments are the quickest way to create a faster and smaller version of your model.
The algorithms are applied to the model post-training utilizing a calibration dataset, so they result in no further training time and much faster sparsification times compared with Training-Aware Experiments.

Generally, One-Shot Experiments result in a 3-5x speedup with minimal accuracy loss.
They are ideal for when you want to quickly sparsify your model and don't have a lot of time to spend on the sparsification process.


### One-Shot CLI Quickstart

Now that you understand what a One-Shot Experiment is and the benefits including short optimization time due to post-training algorithms, let's jump into how to use the CLI to effectively run a One-Shot Experiment. 

Before you run a One-Shot Experiment, you need to make sure you are logged into the Sparsify CLI. For instruictions on Installation and Login, review the [Sparsify Getting Started Documentation](Link.com).

One-Shot Experiments use the following general command:

```bash
sparsify.run one-shot --use-case USE_CASE --model MODEL --data DATA --optim-level OPTIM_LEVEL
```

The values for each of the arguments follow these general rules:
- [Details]**`EXPERIMENT_TYPE`**: `one-shot`.
- [[Details]](https://github.com/neuralmagic/sparsify/blob/main/docs/use-cases-guide.md)**`USE_CASE`**: the use case you're solving for, such as `image-classification`, `object-detection`, `text-classification`, or a custom use case. For a custom use case, you may ...
- [[Details]](https://github.com/neuralmagic/sparsify/blob/main/docs/models-guide.md) **`MODEL`**:  One-Shot, currently, requires the model to be in an ONNX format. For guidance on how to convert a Pytorch model to ONNX, read our [ONNX Export User Guide](https://docs.neuralmagic.com/user-guides/onnx-export). 
- [[Details]](https://github.com/neuralmagic/sparsify/blob/main/docs/datasets-guide.md)**`DATA`**: One-Shot, currently, only supports NPZ-formatted datasets. To format your dataset to run a One-Shot Experiment, 
- [[Details]](https://github.com/neuralmagic/sparsify/blob/main/docs/optim-levels-guide.md)**`OPTIM_LEVEL`**: the desired sparsification level from 0 (none) to 1 (max). The general rule is that 0 is the baseline model, <0.3 only quantizes the model, 0.3-1.0 increases the sparsity of the model and applies quantization.

### Example CLI Commands

Here are examples of a valid One-Shot Experiment you may wish to run; pick your use case and run your first One-Shot Experiment!

#### Running One-Shot Experiments

Computer Vision:
```bash
sparsify.run one-shot --use-case image_classification --model resnet50 --data imagenette --optim-level 0.5
```

NLP Example:
```bash
sparsify.run one-shot --use-case text_classification --model bert-base --data sst2 --optim-level 0.5
```

### One-Shot Cloud Quickstart

You can use the Sparsify Cloud to generate Sparsify One-Shot Experiment commands that you can then copy and paste into your CLI to run the One-Shot Experiment. 

Note: This One-Shot Cloud Quickstart assumes you have:
1. Created a Sparsify Account and are Signed In
2.  Installed Sparsify in your local training environment via CLI
3.  Logged into Sparsify with your API key

To create a One-Shot Experiment via the Sparsify Cloud, you need to:
1. Click 'Start Sparsifying' on the Homepage.
2. Designate the Use Case, select One-Shot, and set Compression Level.
3. Generate the One-Shot code snippet.
4. Copy the code snippet, replace the model and dataset with your data, and run it in your local training environment.


#### Step 1: Click 'Start Sparsifying'

Once you are on the Sparsify Homepage, click 'Start Sparsifying' on the top right of the screen to begin the sparsification flow.

![Homepage](https://drive.google.com/uc?id=1bm404rtwVV4pNplFysKcuMZ_p480A-Tu)](https://drive.google.com/uc?id=1bm404rtwVV4pNplFysKcuMZ_p480A-Tu)

#### Step 2: Designate the Use Case, select One-Shot, and set Compression Level

You should now be looking at the 'Sparsify a model' modal. 

First, select a Use Case for your model. Note that if your use case is not present in the dropdown, fear not; the use case does not affect the optimization of the model.

Next, select One-Shot as your Experiment Type.

Finally, adjust the Hyperparameter Compression Level slider to designate whether you would like to optimize the model for performance, accuracy, or a balance of both. Note that selecting an extreme on the slider will not completely tank the opposing metric.

![Generate Code Snippetl](https://drive.google.com/uc?id=1Wu628pLt8lGjKzfDMdeDhBJE9dIW2aG7)


#### Generate the One-Shot code snippet 
Click 'Generate Code Snippet' to view the code snipppet generated from your sparsification selections on the next modal. 

#### Copy the code snippet, replace the model and dataset with your data, and run it in your local training environment

Once your code snippet is generated, make sure you have installed Sparsify and are logged in via the CLI. 

Next, copy the code snippet and fill in the paths to your local dense model and/or training dataset as prompted. 

Finally, run the One-Shot Experiment command and wait for your sparse model to complete. You have now completed running a One-Shot Experiment with Sparsify. 
![Generate Code Snippetl](https://drive.google.com/uc?id=1KXC-j0ztWQt42GSUK45JnsZXijOgZQ7k)
 
### Resources
To learn more about Sparsify and all of the available pathways outside of One-Shot Experiments, refer to the [Sparsify README](https://github.com/neuralmagic/sparsify).
