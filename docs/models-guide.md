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

# Sparsify Models Guide

For most Sparsify Experiments, you will need to provide a base model to create a sparse model from.
Due to the varied ML pipelines and implementations, Sparsify standardizes on a few popular formats for models.
You will need to make sure that your model is formatted properly according to the standards listed below.

## Table of Contents

1. [Image Classification](#image-classification)
2. [Object Detection](#object-detection)
3. [Image Segmentation](#image-segmentation)
4. [NLP](#nlp)
5. [ONNX](#onnx)
6. [Custom](#custom)

## Image Classification

For image classification tasks, Sparsify relies on the PTH format generated from SparseML.
Specifically, the PTH format generated from the `ModuleExporter` class in SparseML.
This will save a model in the PTH format with the following structure:

### Structure
```text
{
  "state_dict": model.state_dict(),
  "optimizer": optimizer.state_dict(),
  "recipe": recipe,
  "epoch": epoch,
  "arch_key": arch_key,
}
```

### Example
```python
from sparseml.pytorch.image_classification.utils import ModuleExporter
from torchvision.models import resnet18

model = resnet18()
exporter = ModuleExporter(model, "./")
exporter.export_pytorch(
    optimizer=None,
    epoch=-1,
    recipe=None,
    name=f"{model}.pth",
    arch_key="resnet18",
)
```

## Object Detection

For object detection tasks, Sparsify utilizes the YOLO format for models.
This is the same format used by Ultralytics [YOLOv5/YOLOv8](https://docs.ultralytics.com/)
This is the default format that is saved from training within the YOLOv5 or YOLOv8 repos.

More information on the YOLO format can be found [here](https://docs.ultralytics.com/tasks/detect/#models).

## Image Segmentation

For image segmentation tasks, Sparsify utilizes the YOLO format for models.
This is the same format used by Ultralytics [YOLOv5/YOLOv8](https://docs.ultralytics.com/)
This is the default format that is saved from training within the YOLOv5 or YOLOv8 repos.

More information on the YOLO format can be found [here](https://docs.ultralytics.com/tasks/segment/#models).

## NLP

For NLP tasks, Sparsify utilizes the HuggingFace Models format and expectations.
This includes the standard tokenizer.json, config.json, and bin files.
If using any of the standard transformers pathways externally or through SparseML, then this is the default format models are saved in.

More information on the HuggingFace Models format can be found [here](https://huggingface.co/transformers/model_sharing.html).

## ONNX

For One-Shot Experiments, Sparsify utilizes the `.ONNX` format for models. 
In the future, more formats will be added for support with One-Shot Experiments.

For more information on the ONNX format, see the [ONNX website](https://onnx.ai/).
For more information on exporting to the ONNX format, see our docs page [here](https://docs.neuralmagic.com/user-guides/onnx-export).
