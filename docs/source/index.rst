..
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

===================
Sparsify |version|
===================

Neural network model repository for highly sparse models and optimization recipes

.. raw:: html

    <div style="margin-bottom:16px;">
        <a href="https://github.com/neuralmagic/sparsify/blob/main/LICENSE">
            <img alt="GitHub" src="https://img.shields.io/github/license/neuralmagic/sparsify.svg?color=purple&style=for-the-badge" height=25 style="margin-bottom:4px;">
        </a>
        <a href="https://docs.neuralmagic.com/sparsify/index.html">
            <img alt="Documentation" src="https://img.shields.io/website/http/docs.neuralmagic.com/sparsify/index.html.svg?down_color=red&down_message=offline&up_message=online&style=for-the-badge" height=25 style="margin-bottom:4px;">
        </a>
        <a href="https://github.com/neuralmagic/sparsify/releases">
            <img alt="GitHub release" src="https://img.shields.io/github/release/neuralmagic/sparsify.svg?style=for-the-badge" height=25 style="margin-bottom:4px;">
        </a>
        <a href="https://github.com/neuralmagic.com/sparsify/blob/main/CODE_OF_CONDUCT.md">
            <img alt="Contributor Covenant" src="https://img.shields.io/badge/Contributor%20Covenant-v2.0%20adopted-ff69b4.svg?color=yellow&style=for-the-badge" height=25 style="margin-bottom:4px;">
        </a>
         <a href="https://www.youtube.com/channel/UCo8dO_WMGYbWCRnj_Dxr4EA">
            <img src="https://img.shields.io/badge/-YouTube-red?&style=for-the-badge&logo=youtube&logoColor=white" height=25 style="margin-bottom:4px;">
        </a>
         <a href="https://medium.com/limitlessai">
            <img src="https://img.shields.io/badge/medium-%2312100E.svg?&style=for-the-badge&logo=medium&logoColor=white" height=25 style="margin-bottom:4px;">
        </a>
        <a href="https://twitter.com/neuralmagic">
            <img src="https://img.shields.io/twitter/follow/neuralmagic?color=darkgreen&label=Follow&style=social" height=25 style="margin-bottom:4px;">
        </a>
     </div>

Overview
========

Sparsify is a deep learning autoML tool that simplifies the model optimization process to rapidly achieve the best combination of size, speed, and accuracy on any deep learning model. Sparsify optimizes and benchmarks models informed by industry research insights for ML practitioners, including ML engineers and operators, who need to deploy performant deep learning models fast and at scale. Sparsify shows visual performance potential for your model, including a sliding scale between performance and loss sensitivity, ultimately speeding up the model optimization process from weeks to minutes.

This repository contains the package to locally launch Sparsify where you can create projects to load and optimize your deep learning models. At the end, you can export optimization recipes to integrate with your training workflow.

Related Products
================

- `DeepSparse <https://github.com/neuralmagic/deepsparse />`_:
  CPU inference engine that delivers unprecedented performance for sparse models
- `SparseZoo <https://github.com/neuralmagic/sparsezoo />`_:
  Neural network model repository for highly sparse models and optimization recipes
- `SparseML <https://github.com/neuralmagic/sparseml />`_:
  Libraries for state-of-the-art deep neural network optimization algorithms,
  enabling simple pipelines integration with a few lines of code

Resources and Learning More
===========================

- `DeepSparse Documentation <https://docs.neuralmagic.com/deepsparse/ />`_
- `SparseZoo Documentation <https://docs.neuralmagic.com/sparsezoo/ />`_
- `SparseML Documentation <https://docs.neuralmagic.com/sparseml/ />`_
- `Neural Magic Blog <https://www.neuralmagic.com/blog/ />`_,
  `Resources <https://www.neuralmagic.com/resources/ />`_,
  `Website <https://www.neuralmagic.com/ />`_

Release History
===============

Official builds are hosted on PyPi
- stable: `sparsify <https://pypi.org/project/sparsify/ />`_
- nightly (dev): `sparsify-nightly <https://pypi.org/project/sparsify-nightly/ />`_

Additionally, more information can be found via
`GitHub Releases <https://github.com/neuralmagic/sparsify/releases />`_.

.. toctree::
    :maxdepth: 3
    :caption: General

    quicktour
    installation
    userguide/index

.. toctree::
    :maxdepth: 2
    :caption: API

    api/sparsify

.. toctree::
    :maxdepth: 2
    :caption: Help and Support

    Bugs, Feature Requests <https://github.com/neuralmagic/sparsify/issues>
    Support, General Q&A <https://github.com/neuralmagic/sparsify/discussions>
