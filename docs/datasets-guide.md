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
Due to the varied ML pipelines and implementations, Sparsify standardizes on a few, popular formats for datasets.
You will need to make sure that your data is formatted properly according to the standards listed below.

## Predefined Use Cases

### Training Aware and Sparse Transfer

Training Aware and Sparse Transfer utilize specific dataset standards depending on the use case.
Each one is listed below with an example.

#### Image Classification

For image classification tasks, Sparsify relies on the dataset format standard used by the PyTorch ImageFolder class. 
This format is fairly simple and intuitive, and it is also widely used in the machine learning community.

##### Specifications

- The root folder should contain subdirectories, each representing a single class of images.
- Images of a particular class/category should be placed inside the corresponding subdirectory.
- The subdirectory name is used as the class label and should be unique for each class.
- The images should be in a format readable by the Python Imaging Library (PIL), which includes formats such as .jpeg, .png, .bmp, etc.
- Images do not need to be of the same size.

The PyTorch ImageFolder class automatically assigns numerical class labels to the images based on the lexicographical order of their class directories. 
Therefore, it is crucial to ensure the directories are properly named to avoid any confusion or mislabeling.

##### Example

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
Here, 'cat' will be considered class 0 and 'dog' will be class 1, due to alphabetical order.

#### Object Detection / Image Segmentation

For object detection and image segmentation tasks, Sparsify supports the dataset format used by YOLOv5. 
This format is specifically designed for tasks involving bounding boxes and segmentation masks, and is widely adopted in the community.

##### Specifications

- Images should be stored in a common directory, generally named `images`.
- Annotations for the images should be stored in a separate directory, often named `labels`.
- Images can be in formats readable by OpenCV (e.g. .jpg, .png).
- Each image should have a corresponding annotation file. The annotation files should be in plain text format (.txt).
- The name of the annotation file should be the same as the corresponding image file, except with a .txt extension.
- Annotation files for object detection should contain one line for each object in the image. Each line should be in the format: `<class> <x_center> <y_center> <width> <height>`, where the values are normalized relative to the size of the image.
- Annotation files for image segmentation should contain information about the segmentation masks.

##### Example

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

#### Natural Language (NLP/NLG)

For natural language processing (NLP) and natural language generation (NLG) tasks, Sparsify supports the dataset formats used by the Hugging Face library. 
Hugging Face datasets can be represented in various file formats including JSON, CSV, and JSON lines format (.jsonl).

##### Specifications

- Each row or line in your data file should represent a single example.
- The data must include the features necessary for your task. For example, a dataset for text classification might include 'text' and 'label' fields.
- For JSON files, each line should be a separate, self-contained JSON object.
- For CSV files, the first row should include the column names, and each subsequent row should include the fields for a single example.
- The file should be UTF-8 encoded to support a wide range of text inputs.

##### Example

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

### One Shot

For one-shot experiments, Sparsify utilizes the `.npz` format for data storage, which is a file format based on the popular NumPy library. 
This format is efficient and versatile. 
In the near future, more functionality will be landed such that the definitions given above for Training Aware and Sparse Transfer will work as well.

#### Specifications

- Each `.npz` file should contain a single data sample, with no batch dimension. This data sample will be run through the ONNX model.
- The `.npz` file should be structured as a dictionary, mapping the input name in the ONNX specification to a numpy array containing the data.
- All data samples should be stored under the same directory, typically named `data`.

The local file structure should look like the following:

```text
data
  -- input1.npz
  -- input2.npz
  -- input3.npz
```

#### Example

For example, if you have a BERT-style model with a sequence length of 128, each `.npz` file should contain a dictionary mapping input names ("input_ids", "attention_mask", "token_type_ids") to numpy arrays of the appropriate size:

```text
{
    "input_ids": ndarray(128,), 
    "attention_mask": ndarray(128,), 
    "token_type_ids": ndarray(128,)
}
```

The dictionary keys should match the names of the inputs in the ONNX model specification, and the shapes of the arrays should match the expected input shapes of the model.

#### Generating NPZ Files

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
                    batch_size = arg.size[0]
                
            start_index = len(self.numpy_data)
            for _ in range(batch_size):
                self.numpy_data.append({})
            
            for index, (input_key, input_batch) in enumerate(inputs):
                for input_ in input_batch:
                    self.numpy_data[start_index + index][input_key] = input_
            
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

Note: Replace YOUR_MODEL and YOUR_DATA_LOADER with your PyTorch model and data loader, respectively.

## Custom Use Cases

Currently, custom use cases are not supported for dataset representation and datasets must conform to the definitions above.
In the near future, these will be supported through plugin specifications.
