
<!--
Copyright (c) 2023 - present / Neuralmagic, Inc. All Rights Reserved.

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

<h1><img alt="Sparsify tool icon" src="https://neuralmagic.com/wp-content/uploads/2023/03/Sparsify.svg" />&nbsp;&nbsp;Sparsify [Alpha]</h1>

<h3> ML model optimization product to accelerate inference </h3>

<p>
    <a href="https://docs.neuralmagic.com/sparsify/">
        <img alt="Documentation" src="https://img.shields.io/badge/documentation-darkred?&style=for-the-badge&logo=read-the-docs" height=25>
    </a>
    <a href="https://join.slack.com/t/discuss-neuralmagic/shared_invite/zt-q1a1cnvo-YBoICSIw3L1dmQpjBeDurQ/">
        <img src="https://img.shields.io/badge/slack-purple?style=for-the-badge&logo=slack" height=25>
    </a>
    <a href="https://github.com/neuralmagic/sparsify/issues">
        <img src="https://img.shields.io/badge/support%20forums-navy?style=for-the-badge&logo=github" height=25>
    </a>
    <a href="https://github.com/neuralmagic/sparsify/actions/workflows/quality-check.yaml">
        <img alt="Main" src="https://img.shields.io/github/workflow/status/neuralmagic/sparsify/Quality%20Checks/main?label=build&style=for-the-badge" height=25>
    </a>
    <a href="https://github.com/neuralmagic/sparsify/releases">
        <img alt="GitHub release" src="https://img.shields.io/github/release/neuralmagic/sparsify.svg?style=for-the-badge" height=25>
    </a>
    <a href="https://github.com/neuralmagic/sparsify/releases">
        <img alt="Stability" src="https://img.shields.io/badge/stability-alpha-f4d03f.svg" height=25>
    </a>
    <a href="https://github.com/neuralmagic/sparsify/blob/main/LICENSE">
        <img alt="GitHub" src="https://img.shields.io/github/license/neuralmagic/sparsify.svg?color=lightgray&style=for-the-badge" height=25>
    </a>
    <a href="https://github.com/neuralmagic/sparsify/blob/main/CODE_OF_CONDUCT.md">
        <img alt="Contributor Covenant" src="https://img.shields.io/badge/Contributor%20Covenant-v2.1%20adopted-ff69b4.svg?color=yellow&style=for-the-badge" height=25>
    </a>
    <a href="https://www.youtube.com/channel/UCo8dO_WMGYbWCRnj_Dxr4EA">
        <img src="https://img.shields.io/badge/-YouTube-red?&style=for-the-badge&logo=youtube&logoColor=white" height=25>
    </a>
     <a href="https://medium.com/limitlessai">
        <img src="https://img.shields.io/badge/medium-%2312100E.svg?&style=for-the-badge&logo=medium&logoColor=white" height=25>
    </a>
    <a href="https://twitter.com/neuralmagic">
        <img src="https://img.shields.io/twitter/follow/neuralmagic?color=darkgreen&label=Follow&style=social" height=25>
    </a>
</p>

![Logo](https://drive.google.com/uc?id=1XnlBKpRQdsnLC4IPoiCoihXJNFh8y7OL)

# Welcome to the Sparsify Alpha Quick Start

## Introduction
🚨 **July 2023: Sparsify's next generation is now in alpha as of version 1.6.0!**

This Quick Start provides a brief overview of Sparsify and then details several pathways you can work through. We encourage you to explore each for Sparsify's full benefits. As of this update, support for [Sparsify's first generation](https://docs.neuralmagic.com/sparsify) has been deprecated. We highly recommend you try the alpha to get a sneak peek and influence the product's development process.

### Feedback and Support
Report UI issues and CLI errors, submit bug reports, and provide general feedback about the product to the team via the [nm-sparsify Slack Channel](https://join.slack.com/t/discuss-neuralmagic/shared_invite/zt-1xkdlzwv9-2rvS6yQcCs7VDNUcWxctnw), or via [GitHub Issues](https://github.com/neuralmagic/sparsify/issues). Alpha support is provided through those channels.

🚨 **Sparsify Alpha Terms and Conditions**

Sparsify Alpha is a pre-release version of Sparsify that is still in active development. The product is not yet ready for production use; APIs and UIs are subject to change. There may be bugs in the Alpha version, which we hope to have fixed before Beta and then a general Q3 2023 release. The feedback you provide on quality and usability helps us identify issues, fix them, and make Sparsify even better. This information is used internally by Neural Magic solely for that purpose. It is not shared or used in any other way.

That being said, we are excited to share this release and hear what you think. Thank you in advance for your feedback and interest!

## Overview

Sparsify enables you to accelerate inference without sacrificing accuracy by applying state-of-the-art pruning, quantization, and distillation algorithms to neural networks with a simple web application and one-command API calls. 

Sparsify empowers you to compress models through two components: 

* Sparsify Cloud - a web application that allows you to create and manage Sparsify Experiments, explore hyperparameters, predict performance, and compare results across both Experiments and deployment scenarios.  
* Sparsify CLI/API - a Python package that allows you to run Sparsify Experiments locally, sync with the Sparsify Cloud, and integrate them into your own workflows.

In this quick start, you will:

1. [Verify prerequisites](#step-1-prerequisites).
2. [Create an account](#step-2-account-creation) a Neural Magic Account.
3. [Install](#step-3-installation) Sparsify in your local training environment.
4. [Log in](#step-4-sparsify-login) utilizing your API key.
5. [Run an Experiment](#step-5-running-experiments).
   * [Experiments Overview](#experiments-overview)
  		* [One-Shot Experiments](#one-shot-experiments)
  		* [Sparse-Transfer Experiments](#sparse-transfer-experiments)
  		* [Training-Aware Experiments](#training-aware-experiments)
	* [Command Syntax and Argument Guides](#command-syntax-and-arguments)
		* `EXPERIMENT_TYPE`
		* `USE_CASE` [guide](https://github.com/neuralmagic/sparsify/blob/main/docs/use-cases-guide.md)
         * `MODEL` [guide](https://github.com/neuralmagic/sparsify/blob/main/docs/models-guide.md)
        * `DATA`[guide](https://github.com/neuralmagic/sparsify/blob/main/docs/datasets-guide.md)
        * `OPTIM_LEVEL` [guide](https://github.com/neuralmagic/sparsify/blob/main/docs/optim-levels-guide.md)
    *  [Example Commands by Experiment Type](#example-commands-by-experiment-type)
        * [Running One-Shot Experiments](#running-one-shot-experiments)
        * [Running Sparse-Transfer Experiments](#running-sparse-transfer-experiments)
        * [Running Training-Aware Experiments](#running-training-aware-experiments)
7. [Compare](#step-6-comparing-experiment-results) the Experiment results.
8. [Deploy optimized models](#step-7-deploying-your-model-with-deepsparse) with DeepSpare (optional).

When you finish this quick start, sparsifying your models is as easy as:

```bash
sparsify.run sparse-transfer --use-case image-classification --data imagenette --optim-level 50 --train-kwargs '{"dataset": "imagenette"}'

```
## Step 1: Prerequisites
First, verify that you have the correct software and hardware to run the Sparsify Alpha.

**Software:** Sparsify is tested on Python 3.8 and 3.10, ONNX 1.5.0-1.12.0, ONNX opset version 11+, and manylinux compliant systems. Sparsify is not supported natively on Windows and MAC OS.

**Hardware:** Sparsify requires a GPU with CUDA + CuDNN in order to sparsify neural networks. 
We recommend you use a Linux system with a GPU that has a minimum of 16GB of GPU Memory, 128GB of RAM, 4 CPU cores, and is CUDA-enabled. If you are sparsifying a very large model, you may need more RAM than the recommended 128GB.
If you encounter issues setting up your training environment, [file a GitHub issue](https://github.com/neuralmagic/sparsify/issues).

## Step 2: Account Creation

Creating a new one-time account is simple and free. An account is required to manage your Experiments and API keys.
Visit the [Neural Magic's Web App Platform](https://account.neuralmagic.com/signup) and create an account by entering your email, name, and unique password. If you already have a Neural Magic Account, [sign in](https://account.neuralmagic.com/signin) with your email.

See the [Sparsify Cloud User Guide](https://github.com/neuralmagic/sparsify/blob/main/docs/cloud-user-guide.md) for more details.

## Step 3: Installation

`pip` is the preferred method for installing Sparsify. It is advised to create a fresh [virtual environment](https://docs.python.org/3/library/venv.html) to avoid dependency issues.

Install with pip using:

```bash
pip install sparsify
```
## Step 4: Sparsify Login

Next, with Sparsify installed on your training hardware:
1. Authorize the local CLI to access your account by running the `sparsify.login` command and providing your API key.
2. Locate your API key on the homepage of the [Sparsify Cloud](https://apps.neuralmagic.com/sparsify) under the **'Get set up'** modal, and copy the command or the API key itself.
3. Run the following command:

```bash
sparsify.login API_KEY
````

See the related guides for more details on: 
* Locating the API_KEY - [Sparsify Cloud User Guide](https://github.com/neuralmagic/sparsify/blob/main/docs/cloud-user-guide.md).
* Running the `sparsify.login` command - [CLI/API Guide](https://github.com/neuralmagic/sparsify/blob/main/docs/cli-api-guide.md).

**Note:** Every time you use Sparsify, you will need to log in via the Sparsify CLI so that your local session can sync with your account in the Sparsify Cloud. 

## Step 5: Running Experiments

In this section, you will learn about Sparsify Experiments and run an Experiment. 

### Experiments Overview
Experiments are the core of sparsifying a model. They allow you to apply sparsification algorithms to a dataset and model through the three Experiment types detailed below: One-Shot, Training-Aware, or Sparse-Transfer. All Experiments are run locally on your training hardware and can be synced with the cloud for further analysis and comparison, using Sparsify's two components: 

* Sparsify Cloud - explore hyperparameters, predict performance, and generate the desired CLI/API command.
	*  See the [Sparsify Cloud User Guide](https://github.com/neuralmagic/sparsify/blob/main/docs/cloud-user-guide.md) for more details on generating commands from the Sparsify Cloud.
	
* Sparsify CLI/API - run an experiment depending on your use case.

Learn more about the Experiment types and understand which use case might be best for your task.

#### One-Shot Experiments

| Sparsity | Sparsification Speed | Accuracy |
|----------|----------------------|----------|
| **++**   | **+++++**            | **+++**  |

One-Shot Experiments are the quickest way to create a faster and smaller version of your model.
The algorithms are applied to the model post-training utilizing a calibration dataset, so they result in no further training time and much faster sparsification times compared with Training-Aware Experiments.

Generally, One-Shot Experiments result in a 3-5x speedup with minimal accuracy loss.
They are ideal for when you want to quickly sparsify your model and don't have a lot of time to spend on the sparsification process.

#### Sparse-Transfer Experiments

| Sparsity | Sparsification Speed | Accuracy  |
|----------|----------------------|-----------|
| **++++** | **++++**             | **+++++** |

Sparse-Transfer Experiments are the second quickest way to create a faster and smaller model for your dataset. 
Sparse, foundational models are sparsified in a Training-Aware manner on a large dataset such as ImageNet.
Then, the sparse patterns are transferred to your dataset through a fine-tuning process.

Generally, Sparse-Transfer Experiments result in a 5-10x speedup with minimal accuracy loss.
They are ideal when a sparse model already exists for your use case, and you want to quickly utilize it for your dataset.
Note, the model argument is optional for Sparse-Transfer Experiments as Sparsify will select the best one from the SparseZoo for your use case if not supplied.

#### Training-Aware Experiments

| Sparsity  | Sparsification Speed  | Accuracy  |
|-----------|-----------------------|-----------|
| **+++++** | **++**                | **+++++** |

Training-Aware Experiments are the most accurate way to create a faster and smaller model for your dataset.
The algorithms are applied to the model during training, so they offer the best possible recovery of accuracy.
However, they do require additional training time and hyperparameter tuning to achieve the best results.

Generally, Training-Aware Experiments result in a 6-12x speedup with minimal accuracy loss.
They are ideal when you have the time to train a model, have a custom model, or want to achieve the best possible accuracy.
Note, the model argument is optional for Sparse-Transfer Experiments, as Sparsify will select the best one from the SparseZoo for your use case if not supplied.

### Command Syntax and Arguments
Now that you have learned about Experiments and the various types, you are ready to run an Experiment.
Running Experiments uses the following general command:

```bash
sparsify.run EXPERIMENT_TYPE --use-case USE_CASE --model MODEL --data DATA --optim-level OPTIM_LEVEL
```

The values for each of the arguments follow these general rules:
- **`EXPERIMENT_TYPE`**: one of `one-shot`, `training-aware`, or `sparse-transfer`.
- [[Guide]](https://github.com/neuralmagic/sparsify/blob/main/docs/use-cases-guide.md) **`USE_CASE`**: the use case you're solving for, such as `image-classification`, `object-detection`, `text-classification`, or a custom use case.
- [[Guide]](https://github.com/neuralmagic/sparsify/blob/main/docs/models-guide.md) **`MODEL`**: the model you want to sparsify which can be a model name such as `resnet50`, a stub from the [SparseZoo](https://sparsezoo.neuralmagic.com), or a path to a local model. For One-Shot, currently, the model must be in an ONNX format. For Training-Aware and Sparse-Transfer, the model must be in a PyTorch format.
- [[Guide]](https://github.com/neuralmagic/sparsify/blob/main/docs/datasets-guide.md) **`DATA`**: the dataset you want to use to sparsify the model. This can be a dataset name such as `imagenette` or a path to a local dataset. Currently, One-Shot only supports NPZ-formatted datasets. Training-Aware and Sparse-Transfer support PyTorch ImageFolder datasets for image classification, YOLOv5/v8 datasets for object detection and segmentation, and Hugging Face datasets for NLP/NLG.
- [[Guide]](https://github.com/neuralmagic/sparsify/blob/main/docs/optim-levels-guide.md) **`OPTIM_LEVEL`**: the desired sparsification level from 0 (none) to 1 (max). The general rule is that 0 is the baseline model, <0.3 only quantizes the model, 0.3-1.0 increases the sparsity of the model and applies quantization.

### Example Commands by Experiment Type

Here are examples you may wish to run; pick your use case and see if you can successfully run your first experiment!
With successful experiments, a `model.onnx` file will be created in your working directory, which will be the optimized model, and you will have no CLI errors.

#### Running One-Shot Experiments

Computer Vision:
```bash
sparsify.run one-shot --use-case image_classification --model resnet50 --data imagenette --optim-level 0.5
```

NLP:
```bash
sparsify.run one-shot --use-case text_classification --model bert-base --data sst2 --optim-level 0.5
```

#### Running Sparse-Transfer Experiments

Computer Vision:
```bash
sparsify.run sparse-transfer --use-case image_classification --data imagenette --optim-level 0.5
```

NLP:
```bash
sparsify.run sparse-transfer --use-case text_classification --data sst2 --optim-level 0.5
```

#### Running Training-Aware Experiments

Computer Vision:
```bash
sparsify.run training-aware --use-case image_classification --model resnet50 --data imagenette --optim-level 0.5
```

NLP:
```bash
sparsify.run training-aware --use-case text_classification --model bert-base --data sst2 --optim-level 0.5
```

## Step 6: Comparing Experiment Results

Once you have run your Experiment, compare the results printed out to the console using the `deepsparse.benchmark` command. 
In the near future, you will be able to compare the results in the Cloud, measure other scenarios, and compare the results to other Experiments.


To compare the results of your Experiment with the original dense baseline model, use the `deepsparse.benchmark` command with your original model and the new optimized model on your deployment hardware. Models that have been optimized using Sparsify will generally run performantly on DeepSparse, Neural Magic's sparsity-aware CPU inference runtime. 


See the [DeepSparse Benchmarking User Guide](https://github.com/neuralmagic/deepsparse/blob/main/docs/user-guide/deepsparse-benchmarking.md) for more information on benchmarking.

Here is an example of a `deepsparse.benchmark`command: 

```
deepsparse.benchmark zoo:nlp/sentiment_analysis/obert-base/pytorch/huggingface/sst2/pruned90_quant-none --scenario sync

```

The results will look something like this:
```bash
2023-06-30 15:20:41 deepsparse.benchmark.benchmark_model INFO     Thread pinning to cores enabled
downloading...: 100%|████████████████████████| 105M/105M [00:18<00:00, 5.81MB/s]
DeepSparse, Copyright 2021-present / Neuralmagic, Inc. version: 1.6.0.20230629 COMMUNITY | (fc8b788a) (release) (optimized) (system=avx512, binary=avx512)
[7ffba5a84700 >WARN<  operator() ./src/include/wand/utility/warnings.hpp:14] Generating emulated code for quantized (INT8) operations since no VNNI instructions were detected. Set NM_FAST_VNNI_EMULATION=1 to increase performance at the expense of accuracy.
2023-06-30 15:21:13 deepsparse.benchmark.benchmark_model INFO     deepsparse.engine.Engine:
	onnx_file_path: /home/rahul/.cache/sparsezoo/neuralmagic/obert-base-sst2_wikipedia_bookcorpus-pruned90_quantized/model.onnx
	batch_size: 1
	num_cores: 10
	num_streams: 1
	scheduler: Scheduler.default
	fraction_of_supported_ops: 0.9981
	cpu_avx_type: avx512
	cpu_vnni: False
2023-06-30 15:21:13 deepsparse.utils.onnx INFO     Generating input 'input_ids', type = int64, shape = [1, 128]
2023-06-30 15:21:13 deepsparse.utils.onnx INFO     Generating input 'attention_mask', type = int64, shape = [1, 128]
2023-06-30 15:21:13 deepsparse.utils.onnx INFO     Generating input 'token_type_ids', type = int64, shape = [1, 128]
2023-06-30 15:21:13 deepsparse.benchmark.benchmark_model INFO     Starting 'singlestream' performance measurements for 10 seconds
Original Model Path: zoo:nlp/sentiment_analysis/obert-base/pytorch/huggingface/sst2/pruned90_quant-none
Batch Size: 1
Scenario: sync
Throughput (items/sec): 134.5611
Latency Mean (ms/batch): 7.4217
Latency Median (ms/batch): 7.4245
Latency Std (ms/batch): 0.0264
Iterations: 1346
```

*Note: performance improvement is not guaranteed across all runtimes and hardware types.*

## Step 7: Deploying Your Model With DeepSparse

As an optional step to this quick start, now that you have your optimized model, you are ready for inferencing. To get the most inference performance out of your optimized model, we recommend you deploy on Neural Magic's [DeepSparse](https://docs.neuralmagic.com/deepsparse). DeepSparse is built to get the best performance out of optimized models on CPUs.  

DeepSparse Server takes in a task and a model path and will enable you to serve models and `Pipelines` for deployment in HTTP.

You can deploy any ONNX model using DeepSparse Server by running:
```bash
deepsparse.server \  
task question_answering \  
--model_path "zoo:nlp/question_answering/bert-base/pytorch/huggingface/squad/12layer_pruned80_quant-none-vnni"`
```

To run inference on your own model, change the model path to the location of your `model.onnx` file. Consult the [DeepSparse Server Docs](https://docs.neuralmagic.com/user-guides/deploying-deepsparse/deepsparse-server) for more details.

If you're not ready for deploying, congratulations on completing the quick start! We welcome your [Sparsify Alpha feedback and support issues](#feedback-and-support) as described at the beginning of this guide.

# Resources
Now that you have explored the Sparsify Alpha Quick Start, here are other related resources.

## Learning More

- Documentation: [SparseML,](https://docs.neuralmagic.com/sparseml/) [SparseZoo,](https://docs.neuralmagic.com/sparsezoo/) [Sparsify (1st Generation),](https://docs.neuralmagic.com/sparsify/) [DeepSparse](https://docs.neuralmagic.com/deepsparse/)
- Neural Magic: [Blog,](https://www.neuralmagic.com/blog/) [Resources](https://www.neuralmagic.com/resources/)

## Release History

Official builds are hosted on PyPI

- stable: [sparsify](https://pypi.org/project/sparsify/)
- nightly (dev): [sparsify-nightly](https://pypi.org/project/sparsify-nightly/)

Additionally, more information can be found via [GitHub Releases.](https://github.com/neuralmagic/sparsify/releases)

## License

The project is licensed under the [Apache License Version 2.0](https://github.com/neuralmagic/sparsify/blob/main/LICENSE).

## Community

### Contribute

We appreciate contributions to the code, examples, integrations, and documentation as well as bug reports and feature requests! [Learn how here.](https://github.com/neuralmagic/sparsify/blob/main/CONTRIBUTING.md)

### Join

For user help or questions about Sparsify, sign up or log in to our [**Neural Magic Community Slack**](https://join.slack.com/t/discuss-neuralmagic/shared_invite/zt-q1a1cnvo-YBoICSIw3L1dmQpjBeDurQ). We are growing the community member by member and happy to see you there. Bugs, feature requests, or additional questions can also be posted to our [GitHub Issue Queue.](https://github.com/neuralmagic/sparsify/issues)

You can get the latest news, webinar and event invites, research papers, and other ML Performance tidbits by [subscribing](https://neuralmagic.com/subscribe/) to the Neural Magic community.

For more general questions about Neural Magic, please fill out this [form.](http://neuralmagic.com/contact/)

### Cite

Find this project useful in your research or other communications? Please consider citing:

```bibtex
@InProceedings{
    pmlr-v119-kurtz20a, 
    title = {Inducing and Exploiting Activation Sparsity for Fast Inference on Deep Neural Networks}, 
    author = {Kurtz, Mark and Kopinsky, Justin and Gelashvili, Rati and Matveev, Alexander and Carr, John and Goin, Michael and Leiserson, William and Moore, Sage and Nell, Bill and Shavit, Nir and Alistarh, Dan}, 
    booktitle = {Proceedings of the 37th International Conference on Machine Learning}, 
    pages = {5533--5543}, 
    year = {2020}, 
    editor = {Hal Daumé III and Aarti Singh}, 
    volume = {119}, 
    series = {Proceedings of Machine Learning Research}, 
    address = {Virtual}, 
    month = {13--18 Jul}, 
    publisher = {PMLR}, 
    pdf = {http://proceedings.mlr.press/v119/kurtz20a/kurtz20a.pdf},
    url = {http://proceedings.mlr.press/v119/kurtz20a.html}, 
    abstract = {Optimizing convolutional neural networks for fast inference has recently become an extremely active area of research. One of the go-to solutions in this context is weight pruning, which aims to reduce computational and memory footprint by removing large subsets of the connections in a neural network. Surprisingly, much less attention has been given to exploiting sparsity in the activation maps, which tend to be naturally sparse in many settings thanks to the structure of rectified linear (ReLU) activation functions. In this paper, we present an in-depth analysis of methods for maximizing the sparsity of the activations in a trained neural network, and show that, when coupled with an efficient sparse-input convolution algorithm, we can leverage this sparsity for significant performance gains. To induce highly sparse activation maps without accuracy loss, we introduce a new regularization technique, coupled with a new threshold-based sparsification method based on a parameterized activation function called Forced-Activation-Threshold Rectified Linear Unit (FATReLU). We examine the impact of our methods on popular image classification models, showing that most architectures can adapt to significantly sparser activation maps without any accuracy loss. Our second contribution is showing that these these compression gains can be translated into inference speedups: we provide a new algorithm to enable fast convolution operations over networks with sparse activations, and show that it can enable significant speedups for end-to-end inference on a range of popular models on the large-scale ImageNet image classification task on modern Intel CPUs, with little or no retraining cost.} 
}
```

```bibtex
@misc{
    singh2020woodfisher,
    title={WoodFisher: Efficient Second-Order Approximation for Neural Network Compression}, 
    author={Sidak Pal Singh and Dan Alistarh},
    year={2020},
    eprint={2004.14340},
    archivePrefix={arXiv},
    primaryClass={cs.LG}
}
```
