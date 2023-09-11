# Sparsify Deployment Guide
​
Deploying with Neural Magic's inference runtime, [DeepSparse](https://github.com/neuralmagic/deepsparse), is recommended for the best performance with sparsified models on CPUs.
The deployment folder contains everything necessary to benchmark and deploy a sparsified model with DeepSparse.
​
## Requirements
​
A Linux-based CPU system with Python versions 3.8-3.10 installed and AVX2 or greater instruction set is required to run DeepSparse.
DeepSparse is not currently supported on Windows or MacOS.
To install DeepSparse, its dependencies, and check your system, run the following commands:
​
```bash
pip install deepsparse[server]
deepsparse.check_hardware
```
​
Other installation options may be needed, depending on your use case.
For more details and other installation options, see the [Installation Guide](https://github.com/neuralmagic/deepsparse).

For the latest hardware support and system requirements, see the [Support and Requirements Guide](https://github.com/neuralmagic/deepsparse).
​
## Benchmarking
​
The `deepsparse.benchmark` command enables benchmarking of an ONNX model on your system.
The command takes a model path as a minimum argument and will run the model through a series of inference runs using random data.
For example:
​
```bash
deepsparse.benchmark model.onnx
```
​
For more information on the `deepsparse.benchmark` command, see the [Benchmarking Guide](https://github.com/neuralmagic/deepsparse/blob/main/docs/user-guide/deepsparse-benchmarking.md).
​
## Pipeline Deployments
​
DeepSparse contains many pipeline deployments for different use cases.
These pipelines package up the model inference and any pre- and post-processing steps into a single, optimized callable for deployment.
Additionally, custom pipelines are supported.
For example, a sample custom pipeline for ImageNet is provided below:
​
```python
from deepsparse.pipelines.custom_pipeline import CustomTaskPipeline
from torchvision import transforms
from PIL import Image
import torch
​
preprocess_transforms = transforms.Compose([
    transforms.Resize(256),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])
​
def preprocess(img_file):
    with open(img_file, "rb") as img_file:
        img = Image.open(img_file)
        img = img.convert("RGB")
    img = preprocess_transforms(img)
    batch = torch.stack([img])
    return [batch.numpy()] 
​
custom_pipeline = CustomTaskPipeline(
    model_path="zoo:cv/classification/resnet_v1-50/pytorch/sparseml/imagenet/pruned90_quant-none",
    process_inputs_fn=preprocess,
)
​
scores, probs = custom_pipeline("buddy.jpeg")
```
(Note: Download [buddy.jpeg](https://raw.githubusercontent.com/neuralmagic/deepsparse/main/tests/deepsparse/pipelines/sample_images/buddy.jpeg))

​
For more information on the available pipelines and how to create custom pipelines, see the [Pipeline Deployment Guide](https://github.com/neuralmagic/deepsparse/blob/main/docs/user-guide/deepsparse-benchmarking.md).
​
## Server Deployments
​
DeepSparse additionally contains a performant server deployment for different use cases.
The server deployment packages up the model inference and any pre- and post-processing steps into a single, optimized HTTP request for deployment.
To start the server, run the following command with the appropriate arguments:
​
```bash
deepsparse.server --task TASK --model_path ./deployment/model.onnx
```
​
For more information on the `deepsparse.server` command, see the [Server Deployment Guide](https://github.com/neuralmagic/deepsparse/blob/main/docs/user-guide/deepsparse-server.md).
