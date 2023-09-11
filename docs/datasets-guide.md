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

# Sparsify Datasets Guide

For all Sparsify Experiments, you will need to provide a dataset to create a sparse model.
Due to the varied ML pipelines and implementations, Sparsify standardizes on a few popular formats for datasets.
You will need to make sure that your data is formatted properly according to the standards listed below.

## Table of Contents

1. [Image Classification](#image-classification)
2. [Object Detection](#object-detection)
3. [Image Segmentation](#image-segmentation)
4. [NLP](#nlp)
5. [NPZ](#npz)
6. [Custom](#custom)

## Image Classification

For image classification tasks, Sparsify relies on the standard `SPLIT/CLASS/IMAGE` format used by the PyTorch ImageFolder class.

### Specifications
- The root folder should contain `train` and `val` subdirectories, each representing the training and validation splits of the dataset.
- Each split should contain subdirectories, each representing a single class of images.
- Images of a particular class/category should be placed inside the corresponding subdirectory.
- The subdirectory name is used as the class label and should be unique for each class.
- The images should be in a format readable by the Python Imaging Library (PIL), which includes formats such as .jpeg, .png, .bmp, etc.
- Images do not need to be of the same size.

The root directory containing the splits data samples should be passed to the CLI as the `--data` argument.

### Structure
```text
data
├── train
│   ├── class_1
│   │   ├── image_1.png
│   │   ├── image_2.png
│   │   └── ...
│   ├── class_2
│   │   ├── image_1.png
│   │   ├── image_2.png
│   │   └── ...
│   └── ...
└── val
    ├── class_1
    │   ├── image_1.png
    │   ├── image_2.png
    │   └── ...
    ├── class_2
    │   ├── image_1.png
    │   ├── image_2.png
    │   └── ...
    └── ...
```

For more details and examples on creating image classification datasets for Sparsify, read the [Sparsify Datasets Guide](https://github.com/neuralmagic/sparsify/blob/main/docs/datasets-guide.md).

### Example



## Object Detection

For object detection tasks, Sparsify utilizes the YOLO format for datasets.
This is the same format used by Ultralytics [YOLOv5/YOLOv8](https://docs.ultralytics.com/datasets/detect/)
The format is made up of a YAML file containing the root dataset location, the classes, and the training and validation split locations.

If a directory is supplied instead and there is no YAML file within the directory, Sparsify will automatically create one for you.
To auto create a YAML file, the directory structure must be the same as listed below in addition to containing a classes.txt file which contains the class names with one per line.

### Specifications
- The root folder should contain `labels` and `images` subdirectories.
- Underneath both the `labels` and `images` directories, there should be `train` and `val` subdirectories, each representing the training and validation splits of the dataset.
- The split directories under `labels` should contain the YOLO format label files with a single `.txt` file per image. 
- The text files underneath the `labels` directories should contain a single line per object of the format `class_index x_center y_center width height` where the coordinates are normalized between 0 and 1 and the class numbers are zero-indexed.
- The split directories under `images` should contain the images of any size in a format readable by the Python Imaging Library (PIL), which includes formats such as .jpeg, .png, .bmp, etc.
- Each image file must have a corresponding label file with the same name in the `labels` directory.
- If supplying a directory without a YAML file, the directory must also contain a `classes.txt` file with one class name per line in the same order as the class numbers in the label files.

### Structure
```text
data
├── images
│   ├── train
│   │   ├── image_1.png
│   │   ├── image_2.png
│   │   └── ...
│   ├── val
│   │   ├── image_1.png
│   │   ├── image_2.png
│   │   └── ...
│   └── ...
├── labels
│   ├── train
│   │   ├── image_1.txt
│   │   ├── image_2.txt
│   │   └── ...
│   ├── val
│   │   ├── image_1.txt
│   │   ├── image_2.txt
│   │   └── ...
│   └── ...
├── classes.txt
└── dataset.yaml
```

For more details and examples on creating object detection datasets for Sparsify, read the [Sparsify Datasets Guide](https://github.com/neuralmagic/sparsify/blob/main/docs/datasets-guide.md).

### Example


## Image Segmentation

For image segmentation tasks, Sparsify utilizes the YOLO format for datasets.
This is the same format used by Ultralytics [YOLOv5/YOLOv8](https://docs.ultralytics.com/datasets/segment/)
The format is made up of a YAML file containing the root dataset location, the classes, and the training and validation split locations.

If a directory is supplied instead and there is no YAML file within the directory, Sparsify will automatically create one for you.
To auto create a YAML file, the directory structure must be the same as listed below in addition to containing a classes.txt file which contains the class names with one per line.

### Specifications
- The root folder should contain `annotations` and `images` subdirectories.
- Underneath both the `annotations` and `images` directories, there should be `train` and `val` subdirectories, each representing the training and validation splits of the dataset.
- The split directories under `annotations` should contain the YOLO format annotation files with a single `.txt` file per image.
- The text files underneath the `annotations` directories should contain a single line per object of the format `class_index x_1 y_1 x_2 y_2 x_3 y_3` where the coordinates that bound the object are normalized between 0 and 1 and the class numbers are zero-indexed.
- The split directories under `images` should contain the images of any size in a format readable by the Python Imaging Library (PIL), which includes formats such as .jpeg, .png, .bmp, etc.
- Each image file must have a corresponding annotation file with the same name in the `annotations` directory.
- If supplying a directory without a YAML file, the directory must also contain a `classes.txt` file with one class name per line in the same order as the class numbers in the annotation files.

### Structure
```text
data
├── images
│   ├── train
│   │   ├── image_1.png
│   │   ├── image_2.png
│   │   └── ...
│   ├── val
│   │   ├── image_1.png
│   │   ├── image_2.png
│   │   └── ...
│   └── ...
├── annotations
│   ├── train
│   │   ├── image_1.txt
│   │   ├── image_2.txt
│   │   └── ...
│   ├── val
│   │   ├── image_1.txt
│   │   ├── image_2.txt
│   │   └── ...
│   └── ...
├── classes.txt
└── dataset.yaml
```

For more details and examples on creating segmentation datasets for Sparsify, read the [Sparsify Datasets Guide](https://github.com/neuralmagic/sparsify/blob/main/docs/datasets-guide.md).

### Example


## NLP

For NLP tasks, Sparsify utilizes the HuggingFace [Datasets](https://huggingface.co/docs/datasets/) format and expectations.
Hugging Face datasets can be represented in various file formats, including CSV, and JSON lines format (.jsonl).

Specifications:
- The root folder should contain JSON or CSV files associated with each split of the dataset.
- The JSON or CSV files must be named such that the training data contains the word `train`, validation data contains the word `val`, and any optional test data contains the word `test`.
- For JSON files, each line must be a JSON object representing a single data sample.
- For CSV files, the first row must be a header row containing the column names.
- The label column must be named `label`.
- The features column will be dynamically determined based on the column names and the rules below
  - If both `setence1` and `sentence2` are present, these columns will be taken as the features.
  - Otherwise the first non label columns will be used for the features with sentence1 being set to the first column and setence2 being set to the second if present.
- The files should be UTF-8 encoded.

### Structure

#### JSON
```text
data
├── train.json
├── val.json
└── test.json
```

Where the contents of each JSON file would look like the following:
```text
{"text": "I love this movie!", "label": "positive"}
{"text": "This movie was awful.", "label": "negative"}
{"text": "I have mixed feelings about this film.", "label": "neutral"}
```

#### CSV
```text
data
├── train.csv
├── val.csv
└── test.csv
```

Where the contents of each CSV file would look like the following:
```text
text,label
"I love this movie!","positive"
"This movie was awful.","negative"
"I have mixed feelings about this film.","neutral"
```

### Example



## NPZ

For One-Shot Experiments, Sparsify utilizes the `.npz` format for data storage, which is a file format based on the popular NumPy library. 
In the future, more formats will be added for support with One-Shot Experiments.

### Specifications
- Each `.npz` file should contain a single data sample, with no batch dimension.
  This data sample will be run through the ONNX model.
- The `.npz` file should be structured as a dictionary, mapping the input name in the ONNX specification to a numpy array containing the data.
- All data samples should be stored under the same directory, typically named `data`. 

The root directory containing the data samples should be passed to the CLI as the `--data` argument.

### Structure
```text
data
├── input1.npz
├── input2.npz
├── input3.npz
```

Where each `input#.npz` file contains a single data sample, and the data sample is structured as a dictionary mapping the input name in the ONNX specification to a numpy array containing the data that matches the input shapes without the batch dimension.
For example, a BERT-style model running with a sequence length of 128 would have the following data sample:
```text
{
  "input_ids": ndarray(128,), 
  "attention_mask": ndarray(128,), 
  "token_type_ids": ndarray(128,)
}
```

### Example

Below is an example script for generating this file structure from a PyTorch module before the ONNX export:

```python
import numpy as np
import torch
from torch import Tensor

class NumpyExportWrapper(torch.nn.Module):
    def __init__(self, model):
        super(NumpyExportWrapper, self).__init__()
        self.model = model
        self.model.eval()  # Set model to evaluation mode
        self.numpy_data = []

    def forward(self, *args, **kwargs):
        with torch.no_grad():
            inputs = {}
            batch_size = 0

            for index, arg in enumerate(args):
                if isinstance(arg, Tensor):
                    inputs[f"input_{index}"] = arg
                    batch_size = arg.size[0]

            for key, val in kwargs.items():
                if isinstance(val, Tensor):
                    inputs[key] = val
                    batch_size = val.shape[0]

            start_index = len(self.numpy_data)
            for _ in range(batch_size):
                self.numpy_data.append({})

            for input_key in iter(inputs):
              for idx, input in enumerate(inputs[input_key]):
                  self.numpy_data[start_index+idx][input_key] = input

            return self.model(*args, **kwargs)

    def save(self, path: str = "data"):
        for index, item in enumerate(self.numpy_data):
            npz_file_path = f'{path}/input{str(index).zfill(4)}.npz'
            np.savez(npz_file_path, **item)

        print(f'Saved {len(self.numpy_data)} npz files to {path}')

model = NumpyExportWrapper(YOUR_MODEL)
for data in YOUR_DATA_LOADER:
    model(data[0])
model.save()
```

Note: Replace `YOUR_MODEL` and `YOUR_DATA_LOADER` with your PyTorch model and data loader, respectively.

## Custom

Currently, custom use cases are not supported for dataset representation and datasets must conform to the definitions above.
In the near future, these will be supported through plugin specifications.
