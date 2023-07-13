


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

# Sparsify Sparse-Transfer Experiment Guide

## Overview
1. Sparse-Transfer Experiment Overview
2. Sparse-Transfer CLI Quickstart
3. Sparse-Transfer Cloud Quickstart
4. Next Steps
5. Resources


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


### Sparse-Transfer CLI Quickstart

Now that you understand what a Sparse-Transfer Experiment is and the benefits, including fine-tuning a pre-optimized, sparse model on your data, you can now use the CLI to effectively run a Sparse-Transfer Experiment. 

Before you run a Sparse-Transfer Experiment, you need to make sure you are logged into the Sparsify CLI. For instructions on Installation and Setup, review the [Sparsify Install and Setup Section](READMEsection.com) in the Sparsify README. 

Sparse-Transfer Experiments use the following general command:

```bash
sparsify.run sparse-transfer --use-case USE_CASE --model MODEL --data DATA --optim-level OPTIM_LEVEL
```

The values for each of the arguments follow these general rules:
- [**`USE_CASE`** ](#use_case)
- [**`MODEL`**](#model) (Optional)
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

For full details on Sparsify use cases, read the [Sparsify Use Cases Guide](https://github.com/neuralmagic/sparsify/blob/main/docs/use-cases-guide.md).

#### MODEL

  
Models are optional for the Sparse-Transfer pathway. If no model is provided, the best model for the given optimization level will be used. 

If you choose to override the model argument, the PyTorch model format is the supported model format for Sparse-Transfer Experiments. The exact format will depend on the pipeline, and therefore the use case, for the Sparse-Transfer Experiment. 

#### DATA

For all Sparsify Experiments, you will need to provide a dataset to create a sparse model.
Due to the varied ML pipelines and implementations, Sparsify standardizes on a few, popular formats for datasets.
You will need to make sure that your data is formatted properly according to the standards listed below.

#####  Predefined Use Cases

Sparse-Transfer Experiments utilize specific dataset standards depending on the use case.
Each one is listed below with an example.

##### Image Classification

For image classification tasks, Sparsify relies on the dataset format standard used by the PyTorch ImageFolder class. 
This format is fairly simple and intuitive, and it is also widely used in the machine-learning community.

##### Specifications

- The root folder should contain subdirectories, each representing a single class of images.
- Images of a particular class/category should be placed inside the corresponding subdirectory.
- The subdirectory name is used as the class label and should be unique for each class.
- The images should be in a format readable by the Python Imaging Library (PIL), which includes formats such as .jpeg, .png, .bmp, etc.
- Images do not need to be of the same size.

The PyTorch ImageFolder class automatically assigns numerical class labels to the images based on the lexicographical order of their class directories. 
Therefore, it is crucial to ensure the directories are properly named to avoid any confusion or mislabeling.

##### Image Classification Example

For an image classification task involving dogs and cats, the dataset directory should be structured as follows:

```
root/dog/xxx.png
root/dog/xxy.png
root/dog/xxz.png

root/cat/123.png
root/cat/nsa.png
root/cat/asd.png
```

In this example, all images within the 'dog' subdirectory will be labeled as 'dog', and all images within the 'cat' subdirectory will be labeled as 'cat'. 
The exact filenames ('xxx.png', 'xxy.png', etc.) do not matter; what matters is the directory structure and the directory names. 

By organizing the data in this way, it can be easily read and labeled by the PyTorch ImageFolder class, and thus easily used for training image classification models in Sparsify. 

Please note, the class labels ('dog', 'cat') are case-sensitive and the order of the classes would be sorted lexicographically. 
Here, 'cat' will be considered class 0, and 'dog' will be class 1, due to alphabetical order.

##### Object Detection / Image Segmentation

For object detection and image segmentation tasks, Sparsify supports the dataset format used by YOLOv5. 
This format is specifically designed for tasks involving bounding boxes and segmentation masks and is widely adopted in the community.

##### Specifications

- Images should be stored in a common directory, generally named `images`.
- Annotations for the images should be stored in a separate directory, often named `labels`.
- Images can be in formats readable by OpenCV (e.g. .jpg, .png).
- Each image should have a corresponding annotation file. The annotation files should be in plain text format (.txt).
- The name of the annotation file should be the same as the corresponding image file, except with a .txt extension.
- Annotation files for object detection should contain one line for each object in the image. Each line should be in the format: `<class> <x_center> <y_center> <width> <height>`, where the values are normalized relative to the size of the image.
- Annotation files for image segmentation should contain information about the segmentation masks.

##### Object Detection / Image Segmentation Example

For an object detection task involving detecting cars and pedestrians, the dataset directory should be structured as follows:

```
dataset/
├── images/
│   ├── image1.jpg
│   └── image2.jpg
└── labels/
    ├── image1.txt
    └── image2.txt
```

For `image1.jpg`, if there's a car and a pedestrian in the image, the corresponding `image1.txt` file could look like this:

```
0 0.5 0.6 0.2 0.3
1 0.7 0.8 0.1 0.2
```

This would mean that there is an object of class 0 (car) centered at (50% of the image width, 60% of the image height) and having a width of 20% of the image width and height 30% of the image height. 
The second line is similar but for an object of class 1 (pedestrian).

For image segmentation, the labels might be more complex, including segmentation masks that indicate which pixels belong to which object category.

Make sure the class labels are consistent with what is expected by the YOLOv5 configuration you are using, and that the bounding box coordinates are normalized as described above.

##### Natural Language (NLP/NLG)

For natural language processing (NLP) and natural language generation (NLG) tasks, Sparsify supports the dataset formats used by the Hugging Face library. 
Hugging Face datasets can be represented in various file formats including JSON, CSV, and JSON lines format (.jsonl).

##### Specifications

- Each row or line in your data file should represent a single example.
- The data must include the features necessary for your task. For example, a dataset for text classification might include 'text' and 'label' fields.
- For JSON files, each line should be a separate, self-contained JSON object.
- For CSV files, the first row should include the column names, and each subsequent row should include the fields for a single example.
- The file should be UTF-8 encoded to support a wide range of text inputs.

##### Natural Language (NLP/NLG) Example

Here's an example of how you might structure a dataset for a sentiment analysis task:

If you're using a JSON lines (.jsonl) format, your file could look like this:

```
{"text": "I love this movie!", "label": "positive"}
{"text": "This movie was awful.", "label": "negative"}
{"text": "I have mixed feelings about this film.", "label": "neutral"}
```

Each line is a separate JSON object, representing a single example.

If you're using a CSV format, your file could look like this:

```
text,label
"I love this movie!","positive"
"This movie was awful.","negative"
"I have mixed feelings about this film.","neutral"
```

The first row contains the column names, and each subsequent row represents a single example.

Whether you choose to use JSON lines or CSV will depend on your specific needs and preferences, but either format will work well with Hugging Face and Sparsify. 
Make sure your data is formatted correctly according to these specifications to ensure it can be used in your experiments.

##### Custom Use Cases
Currently, custom use cases are not supported for dataset representation and datasets must conform to the definitions above. In the near future, these will be supported through plugin specifications.

For full details on Sparsify datasets, read the [Sparsify Datasets Guide](https://github.com/neuralmagic/sparsify/blob/main/docs/datasets-guide.md#sparsify-datasets-guide).

#### OPTIM_LEVEL

When using Sparsify, the optim (sparsification) level is one of the top arguments you should decide on. Specifically, it controls how much sparsification is applied to your model with higher values resulting in faster and more compressed models. At the max range, though, you may see a drop in accuracy.

The optim level can be set anywhere from 0.0 to 1.0, where 0.0 is for no sparsification and 1.0 is for maximum sparsification.
0.5 is the default optim level and is a good starting point for most use cases.

##### Sparse-Transfer Optim Levels

Sparse-Transfer optim_level mappings are unique since they map to models available in the SparseZoo to transfer from. Increasing the optim level will result in smaller and more compressed models. The specific mappings are the following:

-   optim-level == 0.0: the largest model selected from the SparseZoo with no optimizations.
-   optim-level < 0.25: the largest model selected from the SparseZoo with INT8 quantization applied to the model (activations and weights).
-   optim-level < 0.5: the largest model selected from the SparseZoo with both unstructured pruning (sparsity) and INT8 quantization applied to the model.
-   optim-level < 0.75: the medium model selected from the SparseZoo with both unstructured pruning (sparsity) and INT8 quantization applied to the model.
-   optim-level <= 1.0: the smallest model selected from the SparseZoo with both unstructured pruning (sparsity) and INT8 quantization applied to the model.

The default of 0.5 will result in a medium-sized sparse model with INT8 quantization.

For full details on Sparsify Optim Levels, read the [Sparsify Optim (Sparsification) Levels Guide](https://github.com/neuralmagic/sparsify/blob/main/docs/optim-levels-guide.md).


### Example Sparse-Transfer Experiment CLI Commands

Here are code examples of Sparse-Transfer Experiments you may wish to run; pick your use case and start sparsifying with Sparse-Transfer!

#### Running Sparse-Transfer Experiments

##### Computer Vision Use Case:

Let's say you have an image classification use case and want to run a Sparse-Transfer Experiment on the imagenette dataset. You don't care about the specific model architecture and just want to leverage the SparseZoo's best optimized model for classification and just apply your dataset to that model to create an accurate, highly performant model to accelerate inference. 

You are targeting a balanced model, but are targeting a pretty drastic 5-10x performance boost in latency while also maintaining the high accuracy of the model so that you can confidently deploy the model in production to solve your business case. 

You can use a Sparsify Sparse-Transfer Experiment to try and reach your goal. Sparse-Transfer Experiments use existing optimized models and apply your data to them to easily create fine-tuned optimized models. Since you want to very quickly acheive a 5-10x speedup in latency performance and are model agnostic, a Sparse-Transfer Experiment makes the most sense for you for its highly optmized, performant sparsity profile on your data.  

With all of these considerations in mind, you have put together the following Sparse-Transfer Experiment command to run to achieve your goal for this use case: 
```bash
sparsify.run sparse-transfer --use-case image_classification --data imagenette --optim-level 0.5
```

The output is as follows:

MARK

##### NLP Use Case:
You are working on a text classification use case to help classify text reviews received from your customers through your e-commerce website. You have been having slow inference times using the BERT-base model and want to improve the performance to save cost. 

You are targeting a balanced model, but are targeting a pretty drastic 5-10x performance boost in text classification throughput while also maintaining the high accuracy of the model so that you can confidently deploy the model in production to solve your business case. You are focused on improving the throughput of the model to process more requests, faster. The model itself isn't as important as the performance for this text classification use case. 

You are targeting a balanced model in terms of wanting to get a 5-10x performance boost in throughput while having a high accuracy so your classifications are actionable. 

You can use a Sparsify Sparse-Transfer Experiment to try and reach your goal. Since you want to use the SST2 dataset and are model agnostic for this text classification use case, Sparsify will apply your data to a pre-optmized model behind the scenes.   A Sparse-Transfer Experiment makes the most sense for us for high sparsity profile and model agnostic approach in transfer learning your data onto a pre-optmized model. 

With all of these considerations in mind, you have put together the following Sparse-Transfer Experiment command to run to achieve your goal for this use case. 

```bash
sparsify.run sparse-transfer --use-case text_classification --data sst2 --optim-level 0.5
```
The output is as follows:
MARK


### Sparse-Transfer Cloud Quickstart

In addition to manually creating commands, you use the Sparsify Cloud to generate Sparsify Sparse-Transfer Experiment commands as well. 

To get started, read the [Sparsify Cloud User Guide](https://github.com/neuralmagic/sparsify/blob/main/docs/cloud-user-guide.md). 

 
### Next Steps 

Now that you have successfully run a Sparse-Transfer Experiment, check out the [One-Shot](https://github.com/neuralmagic/sparsify/blob/main/docs/one-shot_experiment-guide.md)  and [Training-Aware](https://github.com/neuralmagic/sparsify/blob/main/docs/training-aware_experiment-guide.md) Experiments to target different sparsity profiles. 

 
### Resources
To learn more about Sparsify and all of the available pathways outside of Sparse-Transfer Experiments, refer to the [Sparsify README](https://github.com/neuralmagic/sparsify).
