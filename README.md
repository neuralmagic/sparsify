<!---
Copyright 2021 Neuralmagic, Inc. All rights reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
-->

# [Related Icon Here] Sparsify

### Easy-to-use UI to optimize neural networks for better performance and smaller sizes
<p>
    <a href="https://github.com/neuralmagic/comingsoon/blob/master/LICENSE">
        <img alt="GitHub" src="https://img.shields.io/github/license/neuralmagic/comingsoon.svg?color=purple&style=for-the-badge" height=25>
    </a>
    <a href="https://docs.neuralmagic.com/sparsify/index.html">
        <img alt="Documentation" src="https://img.shields.io/website/http/neuralmagic.com/sparsify/index.html.svg?down_color=red&down_message=offline&up_message=online&style=for-the-badge" height=25>
    </a>
    <a href="https://github.com/neuralmagic/sparsify/releases">
        <img alt="GitHub release" src="https://img.shields.io/github/release/neuralmagic/sparsify.svg?style=for-the-badge" height=25>
    </a>
    <a href="https://github.com/neuralmagic.com/comingsoon/blob/master/CODE_OF_CONDUCT.md">
        <img alt="Contributor Covenant" src="https://img.shields.io/badge/Contributor%20Covenant-v2.0%20adopted-ff69b4.svg?color=yellow&style=for-the-badge" height=25>
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

Sparsify improves model performance for deployment at scale using the latest model compression techniques. Use Sparsify to analyze, optimize, and integrate your neural network for production using a visual interface.

## Quick Tour and Documentation

Follow the quick tour below to get started.
For a more in-depth read, check out [Sparsify documentation](https://docs.neuralmagic.com/sparsify/).

### Installation and Requirements

- Requires Python 3.6 or higher. 
- Use Case: Computer Vision - Image Classification, Object Detection
- Model Architectures: Deep Learning Neural Network Architectures (e.g., CNNs, DNNs - refer to SparseZoo for examples)
- ONNX: Ability to provide an ONNX file
- Instruction Set: Ideally CPUs with AVX-512 (e.g., Intel Xeon Cascade Lake, Icelake, Skylake) and 2 FMAs. VNNI support required for sparse quantization.
- OS / Environment: Ubuntu, CentOS, RHEL, Amazon Linux 
- FP32 bit precision (quantized performance coming soon)

To install, these packages will be required:

```python
$ pip install sparsify
$ pip install sparseml
$ pip install sparsezoo
```
Optionally, you may also want to install the Neural Magic Inference Engine if you want to use it with Sparify.

```python
$ pip install engine
```
### Downloading and Usage
Tutorial notebooks and use cases are provided for easily integrating and using the models in the Sparsify. 
Check the ??? [Tutorials section](INSERT PATH HERE) for more details. [TODO ENGINEERING: CLARIFY HOW TUTORIALS WILL BE ADDED IF ANY]
The APIs provided to interface with the Sparsify are located in `neuralmagicML.utils`. 

To retrieve all available models in the repo, you can use the `available_models` function. 
It returns a list of `RepoModel` objects.
Example code:
```python
from neuralmagicML.utils import available_models, RepoModel

models = available_models()  # type: List[RepoModel]
print(models)
```

### Available Models and Recipes
A number of pre-trained models are available in this API. Included are both baseline and recalibrated models for higher performance. These can optionally be used with [Neural Magic Inference Engine](https://github.com/neuralmagic/engine/). The types available for each model architecture are noted in the [Sparsify model repository listing](docs/available-models.md).

### Development Setup
[TODO ENGINEERING: dev instructions or point to CONTRIBUTING.md]

## Resources and Learning More
* [Sparsify Documentation](https://docs.neuralmagic.com/sparsify/)
* [Sparsify Use Cases](INSERT PATH HERE)
* [Sparsify Examples] Coming soon in February 2021
* [Neural Magic Blog](https://www.neuralmagic.com/blog/)
* [Neural Magic](https://www.neuralmagic.com/)

[TODO ENGINEERING: table with links for deeper topics or other links that should be included above]

## Contributing

We appreciate contributions to the code, documentation and examples, documentation!

- Report issues and bugs directly in [this GitHub project](https://github.com/neuralmagic/sparsify/issues).
- Learn how to work with the Sparsify source code, including building and testing Sparsify models and recipes as well as contributing code changes to Sparsify by reading our [Development and Contribution guidelines](CONTRIBUTING.md).

Give Sparsify a shout out on social! Are you able write a blog post, do a lunch ’n learn, host a meetup, or simply share via your networks? Help us build the community, yay! Here’s some details to assist:
- item 1 [TODO MARKETING: NEED METHODS]
- item n

## Join the Community

For user help or questions about Sparsify, please use our [GitHub Discussions](https://www.github.com/neuralmagic/sparsify/issues). Everyone is welcome!

You can get the latest news, webinar invites, and other ML Performance tidbits by [connecting with the Neural Magic community](https://www.neuralmagic.com/NEED_URL/).[TODO MARKETING: NEED METHOD]

For more general questions about Neural Magic please contact us this way [Method](URL). [TODO MARKETING: NEED METHOD]

[TODO MARKETING: Example screenshot here]

## License

The project is licensed under the [Apache License Version 2.0](LICENSE).

## Release History

[Track this project via GitHub Releases.](https://github.com/neuralmagic/sparsify/releases)
