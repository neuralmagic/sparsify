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

# Sparsify Cloud User Guide

The Sparsify Cloud is a web application that allows you to create and manage Sparsify Experiments, explore hyperparameters, predict performance, and compare results across both Experiments and deployment scenarios. 


In this Sparsify Cloud User Guide, we will show you how to:
1. Create a Neural Magic Account.
2. Install Sparsify in your local training environment.
3. Log in using your API key.
4. Run an Experiment.
5. Compare the Experiment results.


## Creating a Neural Magic Account

Creating a new account is simple and free.
An account is required to manage your Experiments and API keys.
Visit the [Neural Magic's Web App Platform](https://account.neuralmagic.com/signup) and create an account by entering your email, name, and unique password. 
If you already have a Neural Magic Account, [sign in](https://account.neuralmagic.com/signin) with your email.

[![SignIn](https://drive.google.com/uc?id=1RInSrLsfm0PQLEkjJqD1HzaCWA2yDcNi)](https://drive.google.com/uc?id=1RInSrLsfm0PQLEkjJqD1HzaCWA2yDcNi)

## Installing Sparsify in Your Local Training Environment

Next, install Sparsify on your training hardware by running the following command:

```bash
pip install sparsify-nightly
```

For more details and system/hardware requirements, see the [Installation](https://github.com/neuralmagic/sparsify/blob/main/README.md#installation) section.

You may copy the command from the Sparsify Cloud in Step 1 in the following screenshot and run that in your training environment to install Sparsify. 

![Homepage](https://drive.google.com/uc?id=1bm404rtwVV4pNplFysKcuMZ_p480A-Tu)


## Log in Utilizing Your API key

With Sparsify installed on your training hardware, you'll need to authorize the local CLI to access your account.
This is done by running the `sparsify.login` command and providing your API key.

Locate your API key on the homepage of the [Sparsify Cloud](https://apps.neuralmagic.com/sparsify/) under the **'Get set up'** modal.
Once you have located this, copy the command or the API key itself and run the following command:

```bash
sparsify.login API_KEY
````

You may copy the command from the Sparsify Cloud in Step 2 and run that in your training environment after installing Sparsify to log in via the Sparsify CLI. For more details on the `sparsify.login` command, see the [CLI/API Guide](https://github.com/neuralmagic/sparsify/blob/main/docs/cli-api-guide.md).

## Running an Experiment
Experiments are the core of sparsifying a model.
They are the process of applying sparsification algorithms in One-Shot, Training-Aware, or Sparse-Transfer to a dataset and model.

All Experiments are run locally on your training hardware and can be synced with Sparsify Cloud for further analysis and comparison.

To run an Experiment, use the Sparsify Cloud to generate a code command to run in your training environment:

1. Click on 'Start Sparsifyng' in the top right corner of the Sparsify Cloud Homepage to bring up the ```Sparsify a model``` modal.

![Sparsify a model](https://drive.google.com/uc?id=1Mjlp_etKkikmTWLrd_vOsRB2856c4U3s)

3. Select a use case for your model. Note that if your use case is not present in the dropdown, fear not; the use case does not affect the optimization of the model.
4. Choose the Experiment Type. To learn more about the Experiments, see the [Sparsify README](https://github.com/neuralmagic/sparsify/blob/main/README.md#run-an-experiment).
5. Adjust the Hyperparameter Compression slider to designate whether you would like to optimize the model for performance, accuracy, or a balance of both. Note that selecting an extreme on the slider will not completely tank the opposing metric.
6. Click 'Generate Code Snippet' to view the code snippet generated from your sparsification selections on the next modal. 
![Generate Code Snippetl](https://drive.google.com/uc?id=14B193hHeYqLeSX8r6C5N1G8beBeXUkYE)
7. Once your code snippet is generated, make sure you have installed Sparsify and are logged in via the CLI. 
8. Copy the code snippet and fill in the paths to your local dense model and/or training dataset as prompted. 
9. Run the command and wait for your sparse model to complete. You have now completed running an Experiment with Sparsify. 
![Generate Code Snippetl](https://drive.google.com/uc?id=1KXC-j0ztWQt42GSUK45JnsZXijOgZQ7k)

## Comparing the Experiment Results

Once you have run your Experiment, you can compare the results printed out to the console using the `deepsparse.benchmark` command. 
In the near future, you will be able to compare the results in Sparsify Cloud, measure other scenarios, and compare the results to other Experiments.


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
