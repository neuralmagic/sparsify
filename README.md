
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

<h1><img alt="tool icon" src="https://neuralmagic.com/wp-content/uploads/2023/03/Sparsify.svg" />&nbsp;&nbsp;Sparsify [Alpha]</h1>

<h3> ML model optimization product to accelerate inference. </h3>

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

## Overview


Sparsify enables you to apply model compression techniques to accelerate inference. Use Sparsify to easily create sparse, performant models. Sparsify can help you optimize models from scratch or sparse transfer learn onto your own data to target best-in-class inference performance on your target deployment hardware. To get started with the Sparsify Cloud UI, create an account [here](https://app.neuralmagic.com) and check out the [Sparsify Quickstart Guide](https://docs.neuralmagic.com/sparsify/quickstart).

Sparsify makes applying state-of-the-art [sparsification](https://docs.neuralmagic.com/user-guides/sparsification) algorithms using techniques such as pruning and quantization to any neural network easy with a simple UI and one-command API calls that removes the complexity of hyperparameter tuning and sparsification targets which can accelerate inference speeds.

To run the Sparsify locally, all you need to do is create an account, install and log in to Sparsify via your CLI, and provide the required arguments for the experiment type you wish to run outlined below. The Sparsify training process will run locally on your training hardware and automatically adjust training commands to fit the available training hardware (adjusting gradient accumulation for that setup). To run a Sparsify Experiment, all Experiment API calls start with the `sparsify.run` command and have the following arguments in aggregate: 

```bash
sparsify.run experiment-type \  
--model {MODEL_PATH} \  
--data {DATA_PATH} \  
--use-case use-case \  
--optim-level optim-level
```

Sparsify has three experiment types each with different attributes across sparsity, sparsification speed, and accuracy: 
```bash
- sparsify.run one-shot...
- sparsify.run sparse-transfer...
- sparsify.run training-aware...
```

🔎 **Featured One-Shot Experiment Example:**

`sparsify.run one-shot --use-case image_classification --model MODEL_PATH --data DATA_PATH --working-dir sparsify`

🚨**Note**🚨: Sparsify is currently an alpha release, so you have the opportunity to influence the development process for the product. You can report UI issues and CLI errors, submit bug reports, and provide general feedback about the product to the team via [email](mailto: rob@neuralmagic.com) or via [GitHub Issues](https://github.com/neuralmagic/sparsify/issues).  Please do NOT use this alpha unless you are ready for bugs and want to contribute to the process by reporting them to us.

As an alpha release, no support is provided but you can refer to this README for guidance on usage and example commands. We appreciate your input as it helps us make fixes and add improvements that much more quickly, so we can get the final release ready to launch. Thank you for your interest and support! 


### One-Shot 

A **One-Shot** Experiment enables you to generate a sparse model from a dense model and a calibration dataset, without having to retrain your model.


**Attributes**  
Sparsity: **+++**  
Sparsification Speed:**+++++**  
Accuracy:**+++**  

### Sparse-Transfer

A **Sparse-Transfer** Experiment enables you to provide a dataset for a use case and create a sparse performant model fit on your data.

**Attributes**  
Sparsity: **+++++**  
Sparsification Speed:**++++**  
Accuracy:**++++**  

### Training-Aware

A **Training-Aware** Experiment enables you to train any dense model with your training set, to create a sparsification recipe and apply it to the dense model to sparsify it.

**Attributes**  
Sparsity:**++++**  
Sparsification Speed:**+++**  
Accuracy:**+++++**  

## Quick Start

We'll show you how to:

-  Create a Neural Magic Account.
-   Install Sparsify in your local training environment. Using a  [virtual environment](https://docs.python.org/3/library/venv.html)  is highly recommended.
-   Get your Sparsify API key.
-   Generate code to run your first experiment


### Create a Neural Magic Account CAN WE PERMALINK THESE

Creating a new account is simple and free. Visit the [Neural Magic's Web App Platform](https://account.neuralmagic.com/signup)  and create an account using your email. If you already have a Neural Magic Account, [sign in](https://account.neuralmagic.com/signup) with your email.

[![User profile](https://neuralmagicdev.wpengine.com/wp-content/uploads/2023/06/Screenshot-2023-06-15-at-11.38.00-AM.png)](https://neuralmagicdev.wpengine.com/wp-content/uploads/2023/06/Screenshot-2023-06-15-at-11.38.00-AM.png)


###  Install Sparsify

There are several ways to install Sparsify on your system. The easiest way is using  `pip`. It is advised to create a fresh [virtual environment](https://docs.python.org/3/library/venv.html)  before installing Sparisfy to avoid dependency issues.

This repository is tested on Python 3.8-3.10, Linux/Debian systems, and Chrome 87+.

Install with pip using:

```bash
pip install sparsify
```

Depending on your flow, PyTorch, Keras, or TensorFlow must be installed in the local environment along with Sparsify. 


### Get your Sparsify API Key

1.  Once you successfully log in to your Sparsify Account, you will see your current API Key under step 3 of the **'Get set up'**  modal. 
2. Click  **Copy**  to copy the API key to the clipboard.

[![Homepage](https://neuralmagic.wpengine.com/wp-content/uploads/2023/06/Screenshot-2023-06-15-at-11.36.12-AM.png)](https://neuralmagic.wpengine.com/wp-content/uploads/2023/06/Screenshot-2023-06-15-at-11.36.12-AM.png)


### Generate code snippet for an Experiment
1. Click on 'Start Sparsifying' on the Sparsify Homepage.
2. Select your Use Case, Experiment Type and Optimization tradeoff via the slider.
[![Sparsify Modal](https://neuralmagic.wpengine.com/wp-content/uploads/2023/06/Screenshot-2023-06-15-at-11.36.32-AM.png)]([https://neuralmagic.wpengine.com/wp-content/uploads/2023/06/Screenshot-2023-06-15-at-11.36.12-AM.png](https://neuralmagic.wpengine.com/wp-content/uploads/2023/06/Screenshot-2023-06-15-at-11.36.32-AM.png))

3. Click 'Generate Code Snippet'.
4. Make sure you have installed and logged into Sparsify via your CLI.
5. Copy the code snippet and substitute in your local data_path and/or model_path in the code snippet and run via the CLI.

[![Sparsify Modal](https://neuralmagic.wpengine.com/wp-content/uploads/2023/06/Screenshot-2023-06-15-at-11.36.40-AM.png)]([https://neuralmagic.wpengine.com/wp-content/uploads/2023/06/Screenshot-2023-06-15-at-11.36.40-AM.png))



 ### Recommended Hardware Support and System Requirements

Sparsify requires a GPU with CUDA + CuDNN in order to train the sparse models. We recommend you use a Linux environment with a GPU that has a minimum of 128 GB of RAM, 16 GB of GPU Memory, 4 cores, and is CUDA-enabled. If you encounter issues setting up your training environment, file a GitHub issue [here]( https://github.com/neuralmagic/sparsify/issues).
https://github.com/neuralmagic/sparsify/issues). 

Sparsify is tested on Python 3.8-3.10, ONNX 1.5.0-1.12.0, ONNX opset version 11+, and manylinux compliant systems. Using a  [virtual environment](https://docs.python.org/3/library/venv.html)  is highly recommended.

## Run an Experiment

### One-Shot Experiment Examples

**CV**  
To get a model that was trained for image classification and that is balanced for performance and accuracy during inference, you can call the Sparsify One-Shot Experimentas follows:
```bash
(sparsify) ~ sparsify.run one-shot
--model ./model/resnet-50.onnx \
--data ./calibration_dataset \  
--use-case image-classification \  
--optim-level 0.50
```

**NLP**   
To get a model that was trained for question answering on your dataset and that is optimized for max performance, you can call the Sparsify One-Shot Experiment as follows:
```bash
(sparsify) ~ sparsify.run one-shot
--model ./model/bert-large.onnx \
--data ./calibration_dataset \  
--use-case qa \  
--optim-level 1.0
```

### Sparse-Transfer Experiment Examples

**CV**   
To get a model that was trained for object detection and that is optimized 80% for performance, you can call the Sparsify Sparse-Transfer Experiment as follows:
```bash
(sparsify) ~ sparsify.run sparse-transfer
--data ./training_dataset \  
--use-case object-detection \  
--optim-level 0.80
```
**NLP**   
To get a model that was trained for sentiment analysis on your own dataset and that is balanced for performance and accuracy during inference, you can call the Sparsify Sparse-Transfer Experiment as follows:
```bash
(sparsify) ~ sparsify.run sparse-transfer
--data ./training_dataset \  
--use-case sentiment-analysis \  
--optim-level 0.50
```

### Training-Aware Experiment Examples

**CV**   
To get a model that was trained for image classification and that is balanced for performance and accuracy during inference, you can call the Sparsify Training-Aware Experiment as follows:
```bash
(sparsify) ~ sparsify.run training-aware
--model ./model/resnet-50.onnx \
--data ./calibration_dataset \  
--use-case image-classification \  
--optim-level 0.50
```
**NLP**   
To get a model that was trained for question answering on your dataset and that is optimized for max performance, you can call the Sparsify Training-Aware Experiment as follows:
```bash
(sparsify) ~ sparsify.run training-aware
--model ./model/bert-large.onnx \
--data ./calibration_dataset \  
--use-case qa \  
--optim-level 1.0
```

## Sparsify APIs Usage and Parameters

#### Model Selection  
For the One-Shot and Training-Aware Experiments, you will need to provide a dense model you wish to optimize for inference. When running the `sparsify.run` command for either of these Experiments you'll need to supply the argument `--model PATH_TO_DENSE_ONNX_MODEL` with the path to your model in your local working directory. The maximum model size is 2GB.
  
#### Data Selection  
For all Sparsify Experiments, you will need to provide a training dataset to fit to your sparse model you wish to create. You will need to make sure that your data is properly formatted to work with Sparsify. Depending on your use case, your data may need to take a specific form.  

To view how to properly format your data for use with Sparsify, view the Use Case Data Tutorials below (LINK) . Once your data is properly formatted, run the `sparsify.run` command and be sure to supply the argument `--data PATH_TO_DATA` with the path to your data in your local working directory. 

#### Use Case Selection  
To use Sparsify, you must designate a use case and provide a dataset that you wish to get a sparse ONNX model for. You are required to designate both the use-case as well as provide a training dataset that will be applied for the Sparse-Transfer and Training-Aware Experiments. For the One-Shot Experiment, you will additionally need to provide a dense model you wish to optimize for inference.
   
   **Use Cases**  
   You can select from the following lists of supported list of use-cases (--use-case) to create a performant model for: 
-   CV - classification: `cv-classification`
-   CV - detection: `cv-detection`
-   CV - segmentation: `cv-segmentation`
-   NLP - question answering: `nlp-question_answering`
-   NLP - text classification: `nlp-text_classification`
-   NLP - sentiment analysis: `nlp-sentiment_analysis`
-   NLP - token classification: `nlp-token_classification`
-   NLP - named entity recognition: `nlp-named_entity_recognition`


#### Optimization Level  
When using Sparsify, you will have the ability to set a model optimization level. This optimization level is a value between 0.0 and 1.0 where 0.0 is fully optimized for accuracy and 1.0 is fully optimized for performance. Note that if you fully optimize for one extreme that does not mean that there will be no sparsity present or accuracy will be completely ignored. It just means that Sparsify will optimize your model to that metric as much as possible, while maintaining a reasonable accuracy or performance value. 

## Examples and Tutorials  


### Data Formatting Tutorial 

#### CV - classification: `cv-classification`  

Your data should be in the `COCO` format for cv-classification

**Example**   


#### CV - detection: `cv-detection`  

Your data should be in the [`COCO` format](https://cocodataset.org/#format-data)  for cv-detection use cases. 

**Example**   
```
To be filled in. 

# import dataset

# format dataset in proper coco format 

# save to local directory

# sparsify.run one-shot
--model ./yolov5.onnx \
--data ./coco_dataset \  
--use-case image-classification \  
--optim-level 0.50
```

REPEAT



-   CV - detection: `cv-detection`
-   CV - segmentation: `cv-segmentation`
-   NLP - question answering: `nlp-question_answering`
-   NLP - text classification: `nlp-text_classification`
-   NLP - sentiment analysis: `nlp-sentiment_analysis`
-   NLP - token classification: `nlp-token_classification`
-   NLP - named entity recognition: `nlp-named_entity_recognition`

## Resources

### Learning More

- Documentation: [SparseML,](https://docs.neuralmagic.com/sparseml/) [SparseZoo,](https://docs.neuralmagic.com/sparsezoo/) [Sparsify,](https://docs.neuralmagic.com/sparsify/) [DeepSparse](https://docs.neuralmagic.com/deepsparse/)
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
