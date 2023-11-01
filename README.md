
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
    <a href="https://docs.neuralmagic.com/archive/sparsify/">
        <img alt="Documentation" src="https://img.shields.io/badge/documentation-darkred?&style=for-the-badge&logo=read-the-docs" height=25>
    </a>
    <a href="https://join.slack.com/t/discuss-neuralmagic/shared_invite/zt-q1a1cnvo-YBoICSIw3L1dmQpjBeDurQ/">
        <img src="https://img.shields.io/badge/slack-purple?style=for-the-badge&logo=slack" height=25 />
    </a>
    <a href="https://github.com/neuralmagic/sparsify/issues">
        <img src="https://img.shields.io/badge/support%20forums-navy?style=for-the-badge&logo=github" height=25 />
    </a>
    <a href="https://github.com/neuralmagic/sparsify/actions/workflows/quality-check.yaml">
        <img alt="Main" src="https://img.shields.io/github/workflow/status/neuralmagic/sparsify/Quality%20Checks/main?label=build&style=for-the-badge" height=25 />
    </a>
    <a href="https://github.com/neuralmagic/sparsify/releases">
        <img alt="GitHub release" src="https://img.shields.io/github/release/neuralmagic/sparsify.svg?style=for-the-badge" height=25 />
    </a>
    <a href="https://github.com/neuralmagic/sparsify/releases">
        <img alt="Stability" src="https://img.shields.io/badge/stability-alpha-f4d03f.svg" height=25>
    </a>
    <a href="https://github.com/neuralmagic/sparsify/blob/main/LICENSE">
        <img alt="GitHub" src="https://img.shields.io/github/license/neuralmagic/sparsify.svg?color=lightgray&style=for-the-badge" height=25 />
    </a>
    <a href="https://github.com/neuralmagic/sparsify/blob/main/CODE_OF_CONDUCT.md">
        <img alt="Contributor Covenant" src="https://img.shields.io/badge/Contributor%20Covenant-v2.1%20adopted-ff69b4.svg?color=yellow&style=for-the-badge" height=25 />
    </a>
    <a href="https://www.youtube.com/channel/UCo8dO_WMGYbWCRnj_Dxr4EA">
        <img src="https://img.shields.io/badge/-YouTube-red?&style=for-the-badge&logo=youtube&logoColor=white" height=25 />
    </a>
     <a href="https://medium.com/limitlessai">
        <img src="https://img.shields.io/badge/medium-%2312100E.svg?&style=for-the-badge&logo=medium&logoColor=white" height=25 />
    </a>
    <a href="https://twitter.com/neuralmagic">
        <img src="https://img.shields.io/twitter/follow/neuralmagic?color=darkgreen&label=Follow&style=social" height=25 />
    </a>
</p>

**🚨 October 2023: Important Sparsify Announcement**

Given our new focus on enabling sparse large language models (LLMs) to run competitively on CPUs, Sparsify Alpha is undergoing upgrades to focus on fine-tuning and optimizing LLMs. This means that we will no longer be providing bug fixes, prioritizing support, or building new features and integrations for non-LLM flows including the CV and NLP Sparsify Pathways.

Neural Magic is super excited about these new efforts in building Sparsify into the best LLM fine-tuning and optimization tool on the market over the coming months and we cannot wait to share more soon. Thanks for your continued support! 

**🚨 July 2023: Sparsify's next generation is now in alpha as of version 1.6.0!**

Sparsify enables you to accelerate inference without sacrificing accuracy by applying state-of-the-art pruning, quantization, and distillation algorithms to neural networks with a simple web application and one-command API calls.

Sparsify empowers you to compress models through two components:
- **[Sparsify Cloud](https://apps.neuralmagic.com/sparsify/)** - a web application that allows you to create and manage Sparsify Experiments, explore hyperparameters, predict performance, and compare results across both Experiments and deployment scenarios.
- **Sparsify CLI/API** - a Python package and GitHub repository that allows you to run Sparsify Experiments locally, sync with the Sparsify Cloud, and integrate them into your workflows.

## Table of Contents
- [Quickstart Guide](#quickstart-guide)
   - [1. Install and Setup](#1-install-and-setup)  
   - [2. Run an Experiment](#2-run-an-experiment)  
   - [3. Compare Results](#3-compare-results)  
   - [4. Deploy a Model](#4-deploy-a-model)     
- [Companion Guides](#companion-guides)  
- [Resources](#resources)  

## Quickstart Guide

<i>
Interested in test-driving our alpha?
Get a sneak peek and influence the product's development process.
Thank you in advance for your feedback and interest!
</i>

This quickstart details several pathways you can work through. 
We encourage you to explore one for Sparsify's full benefits. 
When you finish the quickstart, sparsifying your models is as easy as:

```bash
sparsify.run sparse-transfer --use-case image-classification --data imagenette --optim-level 0.5
```

### 1. Install and Setup

#### 1.1 Verify Prerequisites

First, verify that you have the correct software and hardware to run the Sparsify Alpha.

<details>
<summary>Software</summary>

Sparsify is tested on Python 3.8 and 3.10, ONNX 1.5.0-1.12.0, ONNX opset version 11+, and manylinux compliant systems. 
Sparsify is not supported natively on Windows and MAC OS.

Additionally, for installation from PyPi, pip 20.3+ is required.
</details>

<details>
<summary>Hardware</summary>

Sparsify requires a GPU with CUDA + CuDNN in order to sparsify neural networks.
We recommend you use a Linux system with a GPU that has a minimum of 16GB of GPU Memory, 128GB of RAM, 4 CPU cores, and is CUDA-enabled. 
If you are sparsifying a very large model, you may need more RAM than the recommended 128GB. 
If you encounter issues setting up your training environment, [file a GitHub issue](https://github.com/neuralmagic/sparsify/issues).
</details>

#### 1.2 Create an Account

Creating a new one-time account is simple and free.  
An account is required to manage your Experiments and API keys.  
Visit the [Neural Magic's Web App Platform](https://account.neuralmagic.com/signup) and create an account by entering your email, name, and unique password. 
If you already have a Neural Magic Account, [sign in](https://account.neuralmagic.com/signin) with your email.

<img src="https://drive.google.com/uc?id=1RInSrLsfm0PQLEkjJqD1HzaCWA2yDcNi" alt="Sparsify Sign In" style="height: ; width:400px;"/>

#### 1.3 Install Sparsify

`pip` is the preferred method for installing Sparsify. 
It is advised to create a [fresh virtual environment](https://docs.python.org/3/library/venv.html) to avoid dependency issues.

Install with pip using:
```bash
pip install sparsify-nightly
```

#### 1.4 Log in via CLI

Next, with Sparsify installed on your training hardware:
1. Authorize the local CLI to access your account by running the sparsify.login command and providing your API key.
2. Locate your API key on the homepage of the [Sparsify Cloud](https://apps.neuralmagic.com/sparsify) under the 'Get set up' modal, and copy the command or the API key itself.
3. Run the following command:

```bash
sparsify.login API_KEY
```

### 2. Run an Experiment

Experiments are the core of sparsifying a model. 
They allow you to apply sparsification algorithms to a dataset and model through the three Experiment types detailed below: 
- [One-Shot](#21-one-shot)
- [Training-Aware](#22-training-aware)
- [Sparse-Transfer](#23-sparse-transfer)

All Experiments are run locally on your training hardware and can be synced with the cloud for further analysis and comparison, using Sparsify's two components:
- Sparsify Cloud - explore hyperparameters, predict performance, and generate the desired CLI/API command.
- Sparsify CLI/API - run an experiment.

#### 2.1 One-Shot

| Sparsity | Sparsification Speed | Accuracy |
|----------|----------------------|----------|
| **++**   | **+++++**            | **+++**  |

One-Shot Experiments quickly sparsify your model post-training, providing a 3-5x speedup with minimal accuracy loss, ideal for quick model optimization without retraining your model.

To run a One-Shot Experiment for your model, dataset, and use case, use the following command:
```bash
sparsify.run one-shot --use-case USE_CASE --model MODEL --data DATASET --optim-level OPTIM_LEVEL
```

For example, to sparsify a ResNet-50 model on the ImageNet dataset for image classification, run the following commands:
```bash
wget https://public.neuralmagic.com/datasets/cv/classification/imagenet_calibration.tar.gz
tar -xzf imagenet_calibration.tar.gz -C ./imagenet_calibration
sparsify.run one-shot --use-case image_classification --model "zoo:cv/classification/resnet_v1-50/pytorch/sparseml/imagenet/base-none" --data ./imagenet_calibration --optim-level 0.5
```

Or, to sparsify a BERT model on the SST2 dataset for sentiment analysis, run the following commands:
```bash
wget https://public.neuralmagic.com/datasets/nlp/text_classification/sst2_bert_calibration.tar.gz
tar -xzf sst2_bert_calibration.tar.gz
sparsify.run one-shot --use-case text_classification --model "zoo:nlp/sentiment_analysis/bert-base/pytorch/huggingface/sst2/base-none" --data --data ./sst2_bert_calibration --optim-level 0.5
```

To dive deeper into One-Shot Experiments, read through the [One-Shot Experiment Guide](https://github.com/neuralmagic/sparsify/blob/main/docs/one-shot-experiment-guide.md).

<i>
Note, One-Shot Experiments currently require the model to be in an ONNX format and the dataset to be in a NumPy format.
More details are provided in the One-Shot Experiment Guide.
</i>

#### 2.2 Sparse-Transfer

| Sparsity | Sparsification Speed | Accuracy  |
|----------|----------------------|-----------|
| **++++** | **++++**             | **+++++** |

Sparse-Transfer Experiments quickly create a smaller and faster model for your dataset by transferring from a [SparseZoo](https://sparsezoo.neuralmagic.com/) pre-sparsified foundational model, providing a 5-10x speedup with minimal accuracy loss, ideal for quick model optimization without retraining your model.

To run a Sparse-Transfer Experiment for your model (optional), dataset, and use case, run the following command:
```bash
sparsify.run sparse-transfer --use-case USE_CASE --model OPTIONAL_MODEL --data DATASET --optim-level OPTIM_LEVEL
```

For example, to sparse transfer a SparseZoo model to the Imagenette dataset for image classification, run the following command:
```bash
sparsify.run sparse-transfer --use-case image_classification --data imagenette --optim-level 0.5
```

Or, to sparse transfer a SparseZoo model to the SST2 dataset for sentiment analysis, run the following command:
```bash
sparsify.run sparse-transfer --use-case text_classification --data sst2 --optim-level 0.5
```

To dive deeper into Sparse-Transfer Experiments, read through the [Sparse-Transfer Experiment Guide](https://github.com/neuralmagic/sparsify/blob/main/docs/sparse-transfer-experiment-guide.md).

<i>
Note, Sparse-Transfer Experiments require the model to be saved in a PyTorch format corresponding to the underlying integration such as Ultralytics YOLOv5 or Hugging Face Transformers.
Datasets must additionally match the expected format of the underlying integration.
More details and exact formats are provided in the Sparse-Transfer Experiment Guide.
</i>

#### 2.3 Training-Aware

| Sparsity  | Sparsification Speed  | Accuracy  |
|-----------|-----------------------|-----------|
| **+++++** | **++**                | **+++++** |

Training-aware Experiments sparsify your model during training, providing a 6-12x speedup with minimal accuracy loss, ideal for thorough model optimization when the best performance and accuracy are required.

To run a Training-Aware Experiment for your model, dataset, and use case, run the following command:
```bash
sparsify.run training-aware --use-case USE_CASE --model OPTIONAL_MODEL --data DATASET --optim-level OPTIM_LEVEL
```

For example, to sparsify a ResNet-50 model on the Imagenette dataset for image classification, run the following command:
```bash
sparsify.run training-aware --use-case image_classification --model "zoo:cv/classification/resnet_v1-50/pytorch/sparseml/imagenette/base-none" --data imagenette --optim-level 0.5
```

Or, to sparsify a BERT model on the SST2 dataset for sentiment analysis, run the following command:
```bash
sparsify.run training-aware --use-case text_classification --model "zoo:nlp/sentiment_analysis/bert-base/pytorch/huggingface/sst2/base-none" --data sst2 --optim-level 0.5
```

To dive deeper into Training-Aware Experiments, read through the [Training-Aware Experiment Guide](https://github.com/neuralmagic/sparsify/blob/main/docs/training-aware-experiment-guide.md).

<i>
Note that Training-Aware Experiments require the model to be saved in a PyTorch format corresponding to the underlying integration such as Ultralytics YOLOv5 or Hugging Face Transformers.
Datasets must additionally match the expected format of the underlying integration.
More details and exact formats are provided in the Training-Aware Experiment Guide.
</i>

### 3. Compare Results

Once you have run your Experiment, the results, logs, and deployment files will be saved under the current working directory in the following format:
```text
[EXPERIMENT_TYPE]_[USE_CASE]_{DATE_TIME}
├── deployment
│   ├── model.onnx
│   └── *supporting files*
├── logs
│   ├── *logs*
├── training_artifacts
│   ├── *training artifacts*
    ├── *metrics and results*
```

You can compare the accuracy by looking through the metrics printed out to the console and the metrics saved in the experiment directory.
Additionally, you can use [DeepSparse](https://github.com/neuralmagic/deepsparse) to compare the inference performance on your CPU deployment hardware.

<i>
Note: In the near future, you will be able to visualize the results in Sparsify Cloud, simulate other scenarios and hyperparameters, compare the results to other Experiments, and package for your deployment scenario.
</i>

To run a benchmark on your deployment hardware, use the `deepsparse.benchmark` command with your original model and the new optimized model.
This will run a number of inferences to simulate a real-world scenario and print out the results.

It's as simple as running the following command:
```bash
deepsparse.benchmark --model_path MODEL --scenario SCENARIO
```

For example, to benchmark a dense ResNet-50 model, run the following command:
```bash
deepsparse.benchmark --model_path "zoo:cv/classification/resnet_v1-50/pytorch/sparseml/imagenette/base-none" --scenario sync
```

This can then be compared to the sparsified ResNet-50 model with the following command:
```bash
deepsparse.benchmark --model_path "zoo:cv/classification/resnet_v1-50/pytorch/sparseml/imagenet/pruned95_quant-none" --scenario sync
```

The output will look similar to the following:
```text
DeepSparse, Copyright 2021-present / Neuralmagic, Inc. version: 1.6.0.20230629 COMMUNITY | (fc8b788a) (release) (optimized) (system=avx512, binary=avx512)
deepsparse.benchmark.benchmark_model INFO     deepsparse.engine.Engine:
	onnx_file_path: ./model.onnx
	batch_size: 1
	num_cores: 1
	num_streams: 1
	scheduler: Scheduler.default
	fraction_of_supported_ops: 0.9981
	cpu_avx_type: avx512
	cpu_vnni: False
=Original Model Path: ./model.onnx
Batch Size: 1
Scenario: sync
Throughput (items/sec): 134.5611
Latency Mean (ms/batch): 7.4217
Latency Median (ms/batch): 7.4245
Latency Std (ms/batch): 0.0264
Iterations: 1346
```

See the [DeepSparse Benchmarking User Guide](https://github.com/neuralmagic/deepsparse/blob/main/docs/user-guide/deepsparse-benchmarking.md) for more information on benchmarking.

### 4. Deploy a Model

As an optional step to this quickstart, now that you have your optimized model, you are ready for inferencing. 
To get the most inference performance out of your optimized model, we recommend you deploy on Neural Magic's [DeepSparse](https://docs.neuralmagic.com/deepsparse). 
DeepSparse is built to get the best performance out of optimized models on CPUs.  

DeepSparse Server takes in a task and a model path and will enable you to serve models and `Pipelines` for deployment in HTTP.

You can deploy any ONNX model using DeepSparse Server with the following command:
```bash
deepsparse.server --task USE_CASE --model_path MODEL_PATH
```

Where `USE_CASE` is the use case of your Experiment and `MODEL_PATH` is the path to the deployment folder from the Experiment.

For example, to deploy a sparsified ResNet-50 model, run the following command:
```bash
deepsparse.server --task image_classification --model_path "zoo:cv/classification/resnet_v1-50/pytorch/sparseml/imagenet/pruned95_quant-none"
```

If you're not ready for deploying, congratulations on completing the quickstart!

## Companion Guides

- [Sparsify Cloud User Guide](https://github.com/neuralmagic/sparsify/blob/main/docs/cloud-user-guide.md)
- [Sparsify Datasets Guide](https://github.com/neuralmagic/sparsify/blob/main/docs/datasets-guide.md)
- [Sparsify Models Guide](https://github.com/neuralmagic/sparsify/blob/main/docs/models-guide.md)
- [One-Shot Experiments Guide](https://github.com/neuralmagic/sparsify/blob/main/docs/one-shot-experiment-guide.md)
- [Sparse-Transfer Experiments Guide](https://github.com/neuralmagic/sparsify/blob/main/docs/sparse-transfer-experiment-guide.md)
- [Training-Aware Experiments Guide](https://github.com/neuralmagic/sparsify/blob/main/docs/training-aware-experiment-guide.md)

## Resources

Now that you have explored Sparsify [Alpha], here are other related resources.

### Feedback and Support

Report UI issues and CLI errors, submit bug reports, and provide general feedback about the product to the Sparsify team via the [nm-sparsify Slack Channel](https://join.slack.com/t/discuss-neuralmagic/shared_invite/zt-1xkdlzwv9-2rvS6yQcCs7VDNUcWxctnw), or via [GitHub Issues](https://github.com/neuralmagic/sparsify/issues). Alpha support is provided through those channels.

### Terms and Conditions

Sparsify Alpha is a pre-release version of Sparsify that is still in active development. 
The product is not yet ready for production use; APIs and UIs are subject to change. 
There may be bugs in the Alpha version, which we hope to have fixed before Beta and then a general Q3 2023 release. 
The feedback you provide on quality and usability helps us identify issues, fix them, and make Sparsify even better. 
This information is used internally by Neural Magic solely for that purpose. 
It is not shared or used in any other way.

That being said, we are excited to share this release and hear what you think. 
Thank you in advance for your feedback and interest!

### Learning More

- Documentation: [SparseML](https://docs.neuralmagic.com/sparseml/), [SparseZoo](https://docs.neuralmagic.com/sparsezoo/), [Sparsify](https://docs.neuralmagic.com/archive/sparsify/), [DeepSparse](https://docs.neuralmagic.com/deepsparse/)
- Neural Magic: [Blog,](https://www.neuralmagic.com/blog/) [Resources](https://www.neuralmagic.com/resources/)

### Release History

Official builds are hosted on PyPI

- stable: [sparsify](https://pypi.org/project/sparsify/)
- nightly (dev): [sparsify-nightly](https://pypi.org/project/sparsify-nightly/)

Additionally, more information can be found via [GitHub Releases.](https://github.com/neuralmagic/sparsify/releases)

### License

The project is licensed under the [Apache License Version 2.0](https://github.com/neuralmagic/sparsify/blob/main/LICENSE).

## Community

### Contribute

We appreciate contributions to the code, examples, integrations, and documentation as well as bug reports and feature requests! [Learn how here.](https://github.com/neuralmagic/sparsify/blob/main/CONTRIBUTING.md)

### Join

For user help or questions about Sparsify, sign up or log in to our [**Neural Magic Community Slack**](https://join.slack.com/t/discuss-neuralmagic/shared_invite/zt-q1a1cnvo-YBoICSIw3L1dmQpjBeDurQ). We are growing the community member by member and happy to see you there. Bugs, feature requests, or additional questions can also be posted to our [GitHub Issue Queue.](https://github.com/neuralmagic/sparsify/issues)

You can get the latest news, webinar and event invites, research papers, and other ML Performance tidbits by [subscribing](https://neuralmagic.com/subscribe/) to the Neural Magic community.

For more general questions about Neural Magic, please fill out this [form.](http://neuralmagic.com/contact/)

### Cite

Find this project useful in your research or other communications? 
Please consider citing:

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
