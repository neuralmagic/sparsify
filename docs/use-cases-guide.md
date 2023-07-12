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

# Sparsify Use Cases Guide

To use Sparsify, you must specify a use case for all experiments to run.
A use case is the specific task or domain/sub-domain you wish to sparsify a model for such as image classification, object detection, or text classification.
It is used to enable Sparsify to apply the best sparsification techniques for your use case, to automatically package the model for deployment, and depending on what is run, to load specific pipelines for data loading and training.

## Use Cases

The generally supported use cases for Sparsify currently are:
- CV - classification: `cv-classification`
- CV - detection: `cv-detection`
- CV - segmentation: `cv-segmentation`
- NLP - question answering: `nlp-question_answering`
- NLP - text classification: `nlp-text_classification`
- NLP - sentiment analysis: `nlp-sentiment_analysis`
- NLP - token classification: `nlp-token_classification`
- NLP - named entity recognition: `nlp-named_entity_recognition`

Note, other aliases are recognized for these use cases, such as image-classification for cv-classification.
Sparsify will automatically recognize these aliases and apply the correct use case.

### Custom Use Cases

If you wish to use Sparsify for a use case that is not in the list of currently supported use cases, you can use a custom use case for some pathways in Sparsify.
The custom use cases will be saved into the Sparsify Cloud for future reuse when run through a supported pathway.
The pathways that support custom use cases are listed below.

Note, custom use cases will prevent Sparsify from applying known, domain-specific knowledge for the sparsification of your model.
Additionally, it will prevent autofill of the pre- and post-processing functions when creating a deployment package.

#### One-Shot

For One-Shot Experiments, both the CLIs and APIs always will support custom use cases.
To utilize, run a One-Shot Experiment with `--use-case` set to the desired custom use case.

### Training-Aware

For Training-Aware Experiments, custom use cases are only supported with the APIs for custom integrations.
This is because non-custom integrations utilize plug-ins that correspond to the appropriate use case for training pipelines.
To utilize this, ensure that you have a training pipeline ready to go and inject the Sparsify API into the training pipeline with the desired use case passed in as an argument.
More info on this specific pathway will be available in the near future as Sparsify development progresses.
