
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

<h3>Sparsify is a ML-as-a-service platform offering pathways for ML engineers to build sparse models to target optimal general performance at scale. </h3>

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

Use Sparsify to easily create sparse, performant models. Sparsify can help you optimize models from scratch or sparse transfer learn onto your own data to target best-in-class inference performance on your target deployment hardware. To get started with the Sparsify Cloud UI, create an account [here](https://app.neuralmagic.com) and check out the [Sparsify Quickstart Guide](https://docs.neuralmagic.com/sparsify/quickstart).

Sparsify makes applying state-of-the-art [sparsification](https://docs.neuralmagic.com/user-guides/sparsification) algorithms using techniques such as pruning and quantization to any neural network easy with a simple UI and one-command API calls that removes the complexity of hyperparameter tuning and sparsification targets. 

🚨**Note**🚨: Sparsify is currently in an alpha state meaning that many of the pathways and underlying functionaliity may not be fully stable. Please provide your feedback on your experience, what you do not like about the Sparsify Local APIs and what you'd like to see next. Your feedback will be integral in driving the future of Sparsify forward and we thank you in advance. Provide feedback (bug reports, UI issues, CLI errors, or just say hello to our team) [here](https://github.com/neuralmagic/sparsify/issues). 


 ## Recommended Hardware Support and System Requirements

Sparsify requires the same hardware that is required to train standard Neural Networks such as a GPU, TPU, or other specialized hardware for training. We recommend you use a Linux environment with a GPU that has a minimum of X RAM, X GPU Memory, X number of cores and is CUDA-enabled. If you encounter issues setting up your training environment, please file a GitHub issue [here]( 
https://github.com/neuralmagic/sparsify/issues). 

Sparsify is tested on Python 3.7-3.10, ONNX 1.5.0-1.12.0, ONNX opset version 11+, and manylinux compliant systems. Using a  [virtual environment](https://docs.python.org/3/library/venv.html)  is highly recommended.


## Available Sparsify APIs

To run the Sparsify APIs locally, all you need to do is create an account, install and login to Sparsify via your CLI, and provide the required arguments for the experment type you wish to run outlined below. All Sparsify API calls start with the `sparsify.run `command amnd have the following arguments in aggregate: 

```bash
sparsify.run experiment-type \  
--model {MODEL_PATH} \  
--data {DATA_PATH} \  
--use-case use-case \  
--optim-level optim-level
```

Sparsify has 3 experiment types which contain their own set of required arguments: 
```bash
- sparsify.run one-shot ...
- sparsify.run sparse-transfer ...
- sparsify.run training-aware ...
```
- **sparsify. run one-shot** enables you to provide a dense model + calibration dataset and run the Neural Magic One-Shot API on it to generate a sparse model, transfer learned on your calibration dataset all without a full retraining of the model; reducing your time to deploy. The Sparsify One-Shot API creates a sparse ONNX model in the working directory. 

- **sparsify. run training-aware** enables you to provide a use case + training dataset (and optional dense model) and generate a sparse model on your data.  You can customize a recipe further (simple with handful of hyperparameters, advanced entire algorithms), and run training through your pipeline, package it, and deploy it. The Sparsify Training-Aware API creates a sparse ONNX model in the working directory. 

- **sparsify. run sparse-transfer** enables you to provide a use case + training dataset and generate a sparse model via sparse transfer learning on top of an already sparse model provided by Neural Magic.  The Sparsify Sparse-Transfer API takes care of the transfer learning process and fits your data to a model optimized on your metric of choice; making generating performant models for your specific use case easy. The Sparsify Sparse-Transfer API creates a sparse ONNX model in the working directory. 

## Sparsify APIs Usage and Parameters 
#### Training Information: 
The Sparsify APIs will kick off the creation of an initial model based on the optimizing and satisficing metrics defaulted or selected; followed by automatic hyperparameter tuning to optimize the given metric to its highest value.  

The Sparsify training process will run locally on your training hardware and automatically adjust training commands to fit the available training hardware (adjusting gradient accumulation for that setup).  


#### Model Selection
For the One-Shot and Training-Aware APIs, you will need to provide a dense model you wish to optimize for inference. When running the `sparsify.run` command for either of these APIs you'll need to supply the argument `--model PATH_TO_DENSE_ONNX_MODEL` with the path to your model in your local working directory. The maximum model size is 2GB.
  
#### Data Selection
For all Sparsify APIs, you will need to provide a training dataset to fit to your sparse model you wish to create. You will need to make sure that your data is properly formatted to work with the Sparsify APIs. Depending on your use case, your data may need to take a specific form.  

To view how to properly format your data for use with Sparsify, view [Neural Magic's Data Format Guide](www.asdfas/com).  Once your data is properly formatted, run the `sparsify.run` command andbe sure to supply the argument `--data PATH_TO_DATA` with the path to your data in your local working directory. 

#### Use Case Selection:
To use the Sparsify APIs, you must choose a use case and provide a dataset that you wish to get a sparse ONNX model for. You are required to designate both the use-case as well as provide a training dataset that will be applied for the Sparse-Transfer and Training-Aware Experiment APIs. For the One-Shot Experiment API, you'll additionally need to provide a dense model you wish to optimize for inference.
   
   **Use Cases**
   You can select from the following lists of supported list of use-cases (--use-case) to create a performant model for: 
-   CV classification: [*ic, image-classification, image_classification, classification*]
-   CV detection: [*od, object-detection, object_detection, detection*]
-   CV segmentation: [*segmentation*]
-   NLP question answering: [*qa, question-answering, question_answering*]
-   NLP text classification: [*text-classification, text_classification, glue*]
-   Sentiment analysis: [*sentiment, sentiment_analysis, sentiment-analysis*]
-   NLP token classification: [*token-classification, token_classification*]
-   Named entity recognition: [*ner, named-entity-recognition, named_entity_recognition*]


#### Optimization Level:
When using the Sparsify APIs, you will have the ability to set a model optimization level. This optimization level is a value between 0.0 and 1.0 where 0.0 is fully optimized for accuracy and 1.0 is fully optimized for performance. Note that if you fully optimize for one extreme that does not mean that there will be no sparsity present or accuracy will be completely ignored. It just means that Sparsify will optimize your model  to that metric as much as posssible, while maintaining a reasonable accuracy or performance value. 


### Sparsify Sparse-Transfer API Examples:
**CV** 
To get a model that was trained for object detection and that is optimized 80% for performance, you can call the Sparsify Sparse-Transfer Experiment API as follows:
```bash
(sparsify) ~ sparsify.run sparse-transfer
--data ./training_dataset \  
--use-case object-detection \  
--optim-level 0.80
```
**NLP** 
To get a model that was trained for sentiment analysis on your own dataset and that is balanced for performance and accuracy during inference, you can call the Sparsify Sparse-Transfer Experiment API as follows:
```bash
(sparsify) ~ sparsify.run sparse-transfer
--data ./training_dataset \  
--use-case sentiment-analysis \  
--optim-level 0.50
```


### Sparsify One-Shot API Examples:
**CV** 
To get a model that was trained for image classification and that is balanced for performance and accuracy during inference, you can call the Sparsify One-Shot Experiment API as follows:
```bash
(sparsify) ~ sparsify.run one-shot
--model ./model/resnet-50.onnx \
--data ./calibration_dataset \  
--use-case image-classification \  
--optim-level 0.50
```
**NLP** 
To get a model that was trained for question answering on your dataset and that is optimized for max performance, you can call the Sparsify One-Shot Experiment API as follows:
```bash
(sparsify) ~ sparsify.run one-shot
--model ./model/bert-large.onnx \
--data ./calibration_dataset \  
--use-case qa \  
--optim-level 1.0
```

### Sparsify Training-Aware API Examples:REVIEW
**CV** 
To get a model that was trained for image classification and that is balanced for performance and accuracy during inference, you can call the Sparsify Training-Aware Experiment API as follows:
```bash
(sparsify) ~ sparsify.run training-aware
--model ./model/resnet-50.onnx \
--data ./calibration_dataset \  
--use-case image-classification \  
--optim-level 0.50
```
**NLP** 
To get a model that was trained for question answering on your dataset and that is optimized for max performance, you can call the Sparsify Training-Aware Experiment API as follows:
```bash
(sparsify) ~ sparsify.run training-aware
--model ./model/bert-large.onnx \
--data ./calibration_dataset \  
--use-case qa \  
--optim-level 1.0
```


## Highlights

- [Neural Magic Data Formatting Guide](https://docs.neuralmagic.com/sparsify/source/userguide/01-intro.html)

## Tutorials

- [Sparsify Quickstart Guide](https://docs.neuralmagic.com/sparsify/source/userguide/01-intro.html)
- More coming soon!

## Installation

This repository is tested on Python 3.7-3.9, Linux/Debian systems, and Chrome 87+.
It is recommended to install in a [virtual environment](https://docs.python.org/3/library/venv.html) to keep your system in order.

Install with pip using:

```bash
pip install sparsify
```

Depending on your flow, PyTorch, Keras, or TensorFlow must be installed in the local environment along with Sparsify. 


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
