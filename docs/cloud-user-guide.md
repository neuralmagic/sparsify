# Sparsify Cloud User Guide

The Sparsify Cloud is a web application that allows you to create and manage Sparsify Experiments, explore hyperparameters, predict performance, and compare results across both Experiments and deployment scenarios. 


In this Sparsify Cloud User Guide, we will show you how to:
1. Create a Neural Magic Account.
2. Install Sparsify in your local training environment.
3. Login utilizing your API key.
4. Run an Experiment
5. Compare the Experiment results.


## Create a Neural Magic Account

Creating a new account is simple and free.
An account is required to manage your Experiments and API keys.
Visit the [Neural Magic's Web App Platform](https://account.neuralmagic.com/signup) and create an account by entering your email, name, and a unique password. 
If you already have a Neural Magic Account, [sign in](https://account.neuralmagic.com/signin) with your email.

[![SignIn](https://drive.google.com/uc?id=1RInSrLsfm0PQLEkjJqD1HzaCWA2yDcNi)](https://drive.google.com/uc?id=1RInSrLsfm0PQLEkjJqD1HzaCWA2yDcNi)

## Install Sparsify in your local training environment

Next, you'll need to install Sparsify on your training hardware.
To do this, run the following command:

```bash
pip install sparsify
```

For more details and system/hardware requirements, see the [Installation](https://github.com/neuralmagic/sparsify/README.md#installation) section.

You may copy the command from the Sparsify Cloud in step 1 and run that in your training environment to install Sparsify. 

[![Homepage](https://drive.google.com/uc?id=10U3r7lr4fmdKLG_xzRys2avdf2g2GVIN)](https://drive.google.com/uc?id=10U3r7lr4fmdKLG_xzRys2avdf2g2GVIN)


## Login utilizing your API key

With Sparsify installed on your training hardware, you'll need to authorize the local CLI to access your account.
This is done by running the `sparsify.login` command and providing your API key.

Locate your API key on the home page of the [Sparsify Cloud](https://apps.neuralmagic.com/sparsify/) under the **'Get set up'** modal.
Once you have located this, copy the command or the API key itself and run the following command:

```bash
sparsify.login API_KEY
````

You may copy the command from the Sparsify Cloud in step 2 and run that in your training environment after installing Sparsify to log in via the Sparsify CLI. For more details on the `sparsify.login` command, see the [CLI/API Guide](https://github.com/neuralmagic/sparsify/docs/cli-api-guide.md).

## Run an Experiment
Experiments are the core of sparsifying a model.
They are the process of applying sparsification algorithms in One-Shot, Training-Aware, or Sparse-Transfer to a dataset and model.

All Experiments are run locally on your training hardware and can be synced with the cloud for further analysis and comparison.

To run an Experiment, use the Sparsify Cloud to generate a code command to run in your training environment.:

1. Click on 'Start Sparsifyng' in the top right corner of the Sparsify Cloud Homepage to bring up the ```Sparsify a model``` modal.

![Sparsify a model](https://drive.google.com/uc?id=1FyayVSqq5YtKO_dEgt5iMNSZQNsqaQFq)

3. Select a Use Case for your model. Note that if your use case is not present in the dropdown, fear not; the use case does not affect the optimization of the model.
4. Choose the Experiment Type. To learn more about the Experiments, see the [Sparsify README](https://github.com/neuralmagic/sparsify/README.md#run-an-experiment).
5. Adjust the Hyperparameter Compression slider to designate whether you would like to  to optimize the model for performance, accuracy, or a balance of both. Note that selecting an extreme on the slider will not completely tank the opposing metric.
6. Click 'Generate Code Snippet' to view the code snipppet generated from your sparsification selections on the next modal. 
![Generate Code Snippetl](https://drive.google.com/uc?id=14B193hHeYqLeSX8r6C5N1G8beBeXUkYE)

7. Once your code snippet is generated, make sure you have installed Sparsify and are logged in via the CLI. 
8. Copy the code snippet and fill in the paths to your local dense model and/or training dataset as prompted. 
9. Run the command and wait for your sparse model to complete. You have now completed running an Experiment with Sparsify. 
![Generate Code Snippetl](https://drive.google.com/uc?id=1xWrla3ps0qeS70P1bzOIYGeIPXWgHfF_)


To learn more about the arguments for the `sparsify.run` command, see the [CLI/API Guide](https://github.com/neuralmagic/sparsify/docs/cli-api-guide.md).



## Compare the Experiment results

To compare the results of your Experiment with the original dense baseline model, you can use the `deepsparse.benchmark` command with your original model and the new optimized model on your deployment hardware. Models that have been optimized using Sparsify will generally run performantly on DeepSparse, Neural Magic's sparsity-aware CPU inference runtime. 


For more information on benchmarking, see the [DeepSparse Benchmarking User Guide](https://github.com/neuralmagic/deepsparse/blob/main/docs/user-guide/deepsparse-benchmarking.md).

Here is an example of a `deepsparse.benchmark`command: 

```
deepsparse.benchmark zoo:nlp/sentiment_analysis/obert-base/pytorch/huggingface/sst2/pruned90_quant-none --scenario sync

```

*Note: performance improvement is not guaranteed across all runtimes and hardware types.*

