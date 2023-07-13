



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

# Sparsify Training-Aware Experiment Guide

## Overview
1. Training-Aware Experiment Overview
2. Training-Aware CLI Quickstart
3. Training-Aware Cloud Quickstart
4. Next Steps
5. Resources



#### Training-Aware Experiments

| Sparsity  | Sparsification Speed  | Accuracy  |
|-----------|-----------------------|-----------|
| **+++++** | **++**                | **+++++** |

Training-Aware Experiments are the most accurate way to create a faster and smaller model for your dataset.
The algorithms are applied to the model during training, so they offer the best possible recovery of accuracy.
However, they do require additional training time and hyperparameter tuning to achieve the best results.

Generally, Training-Aware Experiments result in a 6-12x speedup with minimal accuracy loss. They are ideal when you have the time to train a model, have a custom model, or want to achieve the best possible accuracy.


### Training-Aware CLI Quickstart

Now that you understand what a Training-Aware Experiment is and the benefits, including the best possible recovery of accuracy for an optimized model, you can now use the CLI to effectively run a Training-Aware Experiment. 

Before you run a Training-Aware Experiment, you need to make sure you are logged into the Sparsify CLI. For instructions on Installation and Setup, review the [Sparsify Install and Setup Section](READMEsection.com) in the Sparsify README. 

Training-Aware Experiments use the following general command:

```bash
sparsify.run training-aware --use-case USE_CASE --model MODEL --data DATA --optim-level OPTIM_LEVEL
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

For Training-Aware Experiments, custom use cases are only supported with the APIs for custom integrations. This is because non-custom integrations utilize plug-ins that correspond to the appropriate use case for training pipelines. To utilize this, ensure that you have a training pipeline ready to go and inject the Sparsify API into the training pipeline with the desired use case passed in as an argument. More info on this specific pathway will be available in the near future as Sparsify development progresses.

For full details on Sparsify use cases, read the [Sparsify Use Cases Guide](https://github.com/neuralmagic/sparsify/blob/main/docs/use-cases-guide.md).

#### MODEL

  
The PyTorch model format is the supported model format for Training-Aware Experiments. The exact format will depend on the pipeline, and therefore the use case, for the Training-Aware Experiment. 

#### DATA

For all Sparsify Experiments, you will need to provide a dataset to create a sparse model.
Due to the varied ML pipelines and implementations, Sparsify standardizes on a few, popular formats for datasets.
You will need to make sure that your data is formatted properly according to the standards listed below.

#####  Predefined Use Cases

Training-Aware Experiments utilize specific dataset standards depending on the use case.
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

This would mean that there is an object of class 0 (car) centered at (50% of image width, 60% of image height) and having a width of 20% of the image width and height 30% of the image height. 
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

##### Training-Aware Optim Levels



Given that Training-Aware is applied while training, the sparsity ranges are increased as compared to one shot since accuracy recovery is easier at higher sparsities.

The specific ranges are the following:

- optim-level == 0.0: no sparsification is applied and the input model is returned as a baseline test case.
- optim-level < 0.3: INT8 quantization of the model (activations and weights) is applied.
- optim-level >= 0.3: unstructured pruning (sparsity) is applied to the weights of the model from 60% for 0.3 to 95% for 1.0 with linear scaling between. 
  Additionally, INT8 quantization of the model is applied.

The default of 0.5 will result in a ~70% sparse model with INT8 quantization.

For full details on Sparsify Optim Levels, read the [Sparsify Optim (Sparsification) Levels Guide](https://github.com/neuralmagic/sparsify/blob/main/docs/optim-levels-guide.md).


### Example Training-Aware Experiment CLI Commands

Here are code examples of Training-Aware Experiments you may wish to run; pick your use case and start sparsifying with Training-Aware!

#### Running Training-Aware Experiments

##### Computer Vision Use Case:

You have an image classification use case and want to run a Training-Aware Experiment on a dense ResNet-50 model using the imagenette dataset. You want to ensure you have the most sparsity to get the best possible performance and maintain a high level of accuracy.

You are targeting a balanced model in terms of wanting to get a 6-12x performance boost in latency while also maintaining the high accuracy of the model so that you can confidently deploy the model in production to solve your business case. 

You can use a Sparsify Training-Aware Experiment to try and reach your goal. Training-Aware Experiments use apply SOTA optimization techniques during training to generate a highly optimized sparse model with very little to no impact on accuracy. Since you want to get the most possible performance speedup in latency and need a high level of accuracy, a Training-Aware Experiment makes the most sense for you for its highly optmized, performant sparsity profile as well as high accuracy profile.  

With all of these considerations in mind, you have put together the following Training-Aware Experiment command to run to achieve your goal for this use case: 
```bash
sparsify.run training-aware --use-case image_classification --model resnet50 --data imagenette --optim-level 0.5
```


The output is as follows:

MARK

##### NLP Use Case:
You are working on a text classification use case to help classify text reviews received from your customers through your e-commerce website. You have been having slow inference times using the BERT-base model, but have an accurate model that you want to ensure does not take a large hit. 

You are targeting a balanced model, but are targeting a significant 6-12x performance boost in text classification throughput while also maintaining the highest level of accuracy with the model so that you can confidently deploy the model in production to solve your business case. You are focused on improving the throughput of the model to process more requests, but sacrifice as few points in accuracy as possible. 

You are targeting a balanced model in terms of wanting to get a 6-12x performance boost in throughput while losing little to no accuracy so your classifications are actionable. 

You can use a Sparsify Training-Aware Experiment to try and reach your goal. Since you want to use the SST2 dataset on BERT-base to get the highest performing model with the lowest accuracy hit, a Training-Aware Experiment makes the most sense for you for its highly optmized, performant sparsity profile as well as high accuracy profile.  

With all of these considerations in mind, you have put together the following Training-Aware Experiment command to run to achieve your goal for this use case. 

```bash
sparsify.run training-aware --use-case text_classification --model bert-base --data sst2 --optim-level 0.5
```
The output is as follows:
MARK


### Training-Aware Cloud Quickstart

In addition to manually creating commands, you use the Sparsify Cloud to generate Sparsify Training-Aware Experiment commands as well. 

To get started, read the [Sparsify Cloud User Guide](https://github.com/neuralmagic/sparsify/blob/main/docs/cloud-user-guide.md). 

 
### Next Steps 

Now that you have successfully run a Training-Aware Experiment, check out the [One-Shot](https://github.com/neuralmagic/sparsify/blob/main/docs/one-shot_experiment-guide.md)  and [Sparse-Transfer](https://github.com/neuralmagic/sparsify/blob/main/docs/sparse-transfer_experiment-guide.md) Experiments to target different sparsity profiles. 

 
### Resources
To learn more about Sparsify and all of the available pathways outside of Training-Aware Experiments, refer to the [Sparsify README](https://github.com/neuralmagic/sparsify).
