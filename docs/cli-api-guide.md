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


# Sparsify CLI/API Guide

The Sparsify CLI/API is a Python package that allows you to run Sparsify Experiments locally, sync with the Sparsify Cloud, and integrate into your own workflows.

## Install Sparsify

Next, you'll need to install Sparsify on your training hardware.
To do this, run the following command:

```bash
pip install sparsify-nightly
```

For more details and system/hardware requirements, see the [Installation](https://github.com/neuralmagic/sparsify#installation) section.

## Login to Sparsify

With Sparsify installed on your training hardware, you'll need to authorize the local CLI to access your account.
This is done by running the `sparsify.login` command and providing your API key.
Locate your API key on the home page of the [Sparsify Cloud](https://apps.neuralmagic.com/sparsify) under the **'Get set up'** modal.
Once you have located this, copy the command or the API key itself and run the following command:

```bash
sparsify.login API_KEY
````

The `sparsify.login API_KEY` command is used to sync your local training environment with the Sparsify Cloud in order to keep track of your Experiments. Once you run the `sparsify.login API_KEY` command, you should see a confirmation via the console that you are logged into Sparsify. To log out of Sparsify, use the `exit` command. 

If you encounter any issues with your API key, reach out to the team via the [nm-sparsify Slack Channel](https://join.slack.com/t/discuss-neuralmagic/shared_invite/zt-1xkdlzwv9-2rvS6yQcCs7VDNUcWxctnw), [email](mailto::rob@neuralmagic.com) or via [GitHub Issues](https://github.com/neuralmagic/sparsify/issues). 


## Run an Experiment 

Experiments are the core of sparsifying a model. 
They are the process of applying sparsification algorithms in One-Shot, Training-Aware, or Sparse-Transfer to a dataset and model.

All Experiments are run locally on your training hardware and can be synced with the cloud for further analysis and comparison.

To run an Experiment, you can use either the CLI or the API depending on your use case.
The Sparsify Cloud provides a UI for exploring hyperparameters, predicting performance, and generating the desired CLI/API command.

The general command for running an Experiment is:

```bash
sparsify.run EXPERIMENT_TYPE --use-case USE_CASE --model MODEL --data DATA --optim-level OPTIM_LEVEL
```

Where the values for each of the arguments follow these general rules:
- EXPERIMENT_TYPE: one of `one-shot`, `training-aware`, or `sparse-transfer`.
  
- USE_CASE: the use case you're solving for such as `image-classification`, `object-detection`, `text-classification`, a custom use case, etc. A full list of supported use cases for each Experiment type can be found [here](https://github.com/neuralmagic/sparsify/blob/main/docs/use-cases-guide.md).
  
- MODEL: the model you want to sparsify which can be a model name such as `resnet50`, a stub from the [SparseZoo](https://sparsezoo.neuralmagic.com), or a path to a local model. For One-Shot, currently the model must be in an ONNX format. For Training-Aware and Sparse-Transfer, the model must be in a PyTorch format. More details on model formats can be found [here](https://github.com/neuralmagic/sparsify/blob/main/docs/models-guide.md).
  
- DATA: the dataset you want to use to the sparsify the model. This can be a dataset name such as `imagenette` or a path to a local dataset. Currently, One-Shot only supports NPZ formatted datasets. Training-Aware and Sparse-Transfer support PyTorch ImageFolder datasets for image classification, YOLOv5/v8 datasets for object detection and segmentation, and HuggingFace datasets for NLP/NLG. More details on dataset formats can be found [here](https://github.com/neuralmagic/sparsify/blob/main/docs/datasets-guide.md).
  
- OPTIM_LEVEL: the desired sparsification level from 0 (none) to 1 (max). The general rule is that 0 is the baseline model, <0.3 only quantizes the model, 0.3-1.0 increases the sparsity of the model and applies quantization. More details on sparsification levels can be found [here](https://github.com/neuralmagic/sparsify/blob/main/docs/optim-levels-guide.md).


### Experiment Type Examples
#### Running One-Shot

| Sparsity | Sparsification Speed | Accuracy |
|----------|----------------------|----------|
| **++**   | **+++++**            | **+++**  |

One-Shot Experiments are the quickest way to create a faster and smaller version of your model.
The algorithms are applied to the model post training utilizing a calibration dataset, so they result in no further training time and much faster sparsification times compared with Training-Aware Experiments.

Generally, One-Shot Experiments result in a 3-5x speedup with minimal accuracy loss.
They are ideal for when you want to quickly sparsify your model and don't have a lot of time to spend on the sparsification process.

CV Example:
```bash
sparsify.run one-shot --use-case image_classification --model resnet50 --data imagenette --optim-level 0.5
```

NLP Example:
```bash
sparsify.run one-shot --use-case text_classification --model bert-base --data sst2 --optim-level 0.5
```

#### Running Sparse-Transfer

| Sparsity | Sparsification Speed | Accuracy  |
|----------|----------------------|-----------|
| **++++** | **++++**             | **+++++** |

Sparse-Transfer Experiments are the second quickest way to create a faster and smaller model for your dataset. 
Sparse, foundational models are sparsified in a Training-Aware manner on a large dataset such as ImageNet.
Then, the sparse patterns are transferred to your dataset through a fine-tuning process.

Generally, Sparse-Transfer Experiments result in a 5-10x speedup with minimal accuracy loss.
They are ideal when a sparse model already exists for your use case, and you want to quickly utilize it for your dataset.
Note, the model argument is optional for Sparse-Transfer Experiments as Sparsify will select the best one from the SparseZoo for your use case if not supplied.

CV Example:
```bash
sparsify.run sparse-transfer --use-case image_classification --data imagenette --optim-level 0.5
```

NLP Example:
```bash
sparsify.run sparse-transfer --use-case text_classification --data sst2 --optim-level 0.5
```

#### Running Training-Aware

| Sparsity  | Sparsification Speed  | Accuracy  |
|-----------|-----------------------|-----------|
| **+++++** | **++**                | **+++++** |

Training-Aware Experiments are the most accurate way to create a faster and smaller model for your dataset.
The algorithms are applied to the model during training, so they offer the best possible recovery of accuracy.
However, they do require additional training time and hyperparameter tuning to achieve the best results.

Generally, Training-Aware Experiments result in a 6-12x speedup with minimal accuracy loss.
They are ideal when you have the time to train a model, have a custom model, or want to achieve the best possible accuracy.
Note, the model argument is optional for Sparse-Transfer Experiments as Sparsify will select the best one from the SparseZoo for your use case if not supplied.

CV Example:
```bash
sparsify.run training-aware --use-case image_classification --model resnet50 --data imagenette --optim-level 0.5
```

NLP Example:
```bash
sparsify.run training-aware --use-case text_classification --model bert-base --data sst2 --optim-level 0.5
```

## Advanced CLI/API Usage
Landing Soon!


## Compare the Experiment results

Once you have run your Experiment, you can compare the results printed out to the console using the `deepsparse.benchmark` command. 
In the near future, you will be able to compare the results in the Cloud, measure other scenarios, and compare the results to other Experiments.


To compare the results of your Experiment with the original dense baseline model, you can use the `deepsparse.benchmark` command with your original model and the new optimized model on your deployment hardware. Models that have been optimized using Sparsify will generally run performantly on DeepSparse, Neural Magic's sparsity-aware CPU inference runtime. 


For more information on benchmarking, see the [DeepSparse Benchmarking User Guide](https://github.com/neuralmagic/deepsparse/blob/main/docs/user-guide/deepsparse-benchmarking.md).

Here is an example of a `deepsparse.benchmark`command: 

```
deepsparse.benchmark zoo:nlp/sentiment_analysis/obert-base/pytorch/huggingface/sst2/pruned90_quant-none --scenario sync

```

The results will look something like this:
```bash
2023-06-30 15:20:41 deepsparse.benchmark.benchmark_model INFO     Thread pinning to cores enabled
downloading...: 100%|████████████████████████| 105M/105M [00:18<00:00, 5.81MB/s]
DeepSparse, Copyright 2021-present / Neuralmagic, Inc. version: 1.6.0.20230629 COMMUNITY | (fc8b788a) (release) (optimized) (system=avx512, binary=avx512)
[7ffba5a84700 >WARN<  operator() ./src/include/wand/utility/warnings.hpp:14] Generating emulated code for quantized (INT8) operations since no VNNI instructions were detected. Set NM_FAST_VNNI_EMULATION=1 to increase performance at the expense of accuracy.
2023-06-30 15:21:13 deepsparse.benchmark.benchmark_model INFO     deepsparse.engine.Engine:
	onnx_file_path: /home/rahul/.cache/sparsezoo/neuralmagic/obert-base-sst2_wikipedia_bookcorpus-pruned90_quantized/model.onnx
	batch_size: 1
	num_cores: 10
	num_streams: 1
	scheduler: Scheduler.default
	fraction_of_supported_ops: 0.9981
	cpu_avx_type: avx512
	cpu_vnni: False
2023-06-30 15:21:13 deepsparse.utils.onnx INFO     Generating input 'input_ids', type = int64, shape = [1, 128]
2023-06-30 15:21:13 deepsparse.utils.onnx INFO     Generating input 'attention_mask', type = int64, shape = [1, 128]
2023-06-30 15:21:13 deepsparse.utils.onnx INFO     Generating input 'token_type_ids', type = int64, shape = [1, 128]
2023-06-30 15:21:13 deepsparse.benchmark.benchmark_model INFO     Starting 'singlestream' performance measurements for 10 seconds
Original Model Path: zoo:nlp/sentiment_analysis/obert-base/pytorch/huggingface/sst2/pruned90_quant-none
Batch Size: 1
Scenario: sync
Throughput (items/sec): 134.5611
Latency Mean (ms/batch): 7.4217
Latency Median (ms/batch): 7.4245
Latency Std (ms/batch): 0.0264
Iterations: 1346
```

*Note: performance improvement is not guaranteed across all runtimes and hardware types.*
