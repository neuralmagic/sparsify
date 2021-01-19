# Key Concepts/Features/Terms

**Approximated Profile**—A profile that is approximated from the architecture if you did not specify Performance during project setup.

**Average Sensitivity**—The average sensitivity to model optimizations for the given network (comparable across networks to see which can be optimized more than others).

**Baseline FLOPS**—The number of FLOPS for the model without any model optimizations applied.

**Baseline Timing**—The execution time for the model without any optimizations applied.

**Baseline MS**—The execution time, in milliseconds, for the model without any optimizations applied.

**Baseline Parameters**—The number of total parameters for the model without any optimizations applied.

**Baseline Profile**—The profile that you defined and named during project setup. This profile includes measured values of how long it took to run your model as well as each layer in the model.

**Batch Size**—The number of separate inputs fed through the model in one inference.

**BatchNormalization Node**—ONNX specification for this term is [available here](https://github.com/onnx/onnx/blob/master/docs/Operators.md#BatchNormalization).

**Conv (Convolution) Node**—ONNX specification for this term is [available here](https://github.com/onnx/onnx/blob/master/docs/Operators.md#Conv).

**Core Count _or_ CPU Cores**—The number of CPU cores on which to run the model.

**Current Timing**—The execution time for the model with the current optimizations applied.

**Current FLOPS**—The number of FLOPS for the model with the current optimizations applied.

**Current Parameters**—The number of parameters for the model with the current optimizations applied.

**Epoch**—One pass through the training data while training.

**Epoch Range**—A range from start to end of when a modifier will be active during the training process.

**Estimated Baseline Time**—The estimated execution time for the model without any optimizations applied.

**Estimated Current Time**—The estimated execution time for the model with the current optimizations applied.

**Estimated FLOPS Reduction**—Estimated amount of reduction in the FLOPS after applying the current optimizations applied.

**Estimated MS per Batch**—The estimated execution time in milliseconds for the model and given batch size with the current optimizations applied.

**Estimated Params Reduction**—Estimated amount of reduction in the params after applying the current optimizations.

**Estimated Performance Speedup**—Estimated amount of speedup in execution time after applying the current model optimizations.

**Estimated Recovery**—The estimated confidence in recovering the original loss of the model after retraining with the current model optimization.

**Estimated Speedup**—Estimated amount of speedup in execution time after applying the current model optimizations.

**Estimated Time**—The estimated execution time for the model with the current model optimizations applied.

**Export**—Tool that presents the user with various implementation code samples.

**FLOPS**—Floating point operations per second. This tells you how compute-intensive your model is. A larger model has more FLOPS, while a smaller model has fewer FLOPS. In general, a model with more FLOPS will take longer to run.

**FLOPS Profile**—A theoretical measure of performance.

**Gemm Node**—ONNX specification for this term is [available here](https://github.com/onnx/onnx/blob/master/docs/Operators.md#Gemm).

**GlobalAveragePool Node**—ONNX specification for this term is [available here](https://github.com/onnx/onnx/blob/master/docs/Operators.md#GlobalAveragePool).

**Instruction Set**—Relevant CPU instruction sets available on the current machine such as AVX2 AVX512 VNNI.

**Items per Second**—Number of individual data items that can be run through the model in one second.

**Layer Attributes**—Additional metadata for the selected layer.

**Layer Depth**—The layers in order of when they were executed while performing inference with the model.

**Layer Timings**—Individual measured inference timings for each layer.

**Layer Type**—Type of operator that was run for the layer / node. Generic list of operators is [available here](https://github.com/onnx/onnx/blob/master/docs/Operators.md).

**Learning Rate Modifier**—Indicates (as you are training) how the system will control the learning rate for that training process.

**Learning Rate Range**—The range for the learning rate for where it will start and end during the training process.

**Loss**—The loss for the model.

**Loss Profile**—An indication of how each layer responds to and is affected by optimization sensitivity such as pruning. For example, when the graph shows that a layer affects the loss significantly, you may not want to prune that layer. The loss profile also shows how many parameters there are in the model.

**Loss Sensitivity**—An indication of how the model is affected by optimization.

**MaxPool Node**—ONNX specification for this term is [available here](https://github.com/onnx/onnx/blob/a265d94dae7a0a62ec197f67e98896085018372a/docs/Operators.md#MaxPool).

**MS per Batch**—Amount of time in milliseconds it took to perform an inference for the model.

**Optimizer**—Sparsify tool that employs the latest techniques to make your model run faster. Sparsify enables you to optimize using pruning, sparsification (future), and quantization (future).

**ORT**—ONNX Runtime is a performance-focused inference engine for Open Neural Network Exchange models.

**Params**—Parameters in a ML model.

**Params Count**—Number of parameters in a model/layer.

**Performance Profile**—A measure/benchmark of how the current model is performing and what can be done for better performance. A performance profile looks at a detailed view of how fast each layer is running and how much time it is taking as well as how much time can be optimized away through pruning (or quantization in the future). A performance profile is used to optimize, retrain, and utilize Neural Magic’s runtime engine to achieve faster inference timings.

**Performance Sensitivity**—Sensitivity for model optimization such as pruning vs performance. A higher value means more speedup when the model optimization is applied.

**Pooling Nodes**—ONNX specification for this term is [available here](https://github.com/onnx/onnx/blob/a265d94dae7a0a62ec197f67e98896085018372a/docs/Operators.md#MaxPool).

**Profiling**—A unique Sparsify feature that does a layer-by-layer analysis of the model by looking at loss and performance. Rather than simply estimating, profiling determines what parts of your model contribute to performance and what parts contribute to loss. For example, if you optimize the model and cut out one layer completely, how much will that affect the loss? And, how much is that going to affect the performance? This type of information is valuable to know before you begin to optimize.

**Pruning**—Removing weights from a neural network.

**Pruning Range**—The range for pruning for where it will start and end during the training process.

**Pruning Settings**—Additional settings to control the pruning process.

**Quantization**—The process of approximating a neural network that uses floating-point numbers by a neural network of low bit width numbers; dramatically reduces memory requirement and computational cost of using neural networks.

**Recovery Confidence**—The estimated chance of recovering the original accuracy of your model after pruning. Recovery Confidence compares the sparsity values with the optimal for loss use case. This value should be as close to 1 as possible (or greater than 1).

**Relu Nodes**—ONNX specification for this term is [available here](https://github.com/onnx/onnx/blob/a265d94dae7a0a62ec197f67e98896085018372a/docs/Operators.md#Relu).

**Shuffle**—Internal node that ran in the DeepSparse Engine to restructure data in memory to run following ops/layers faster.

**Softmax Nodes**—ONNX specification for this term is [available here](https://github.com/onnx/onnx/blob/a265d94dae7a0a62ec197f67e98896085018372a/docs/Operators.md#Softmax).

**Sparsity**—The number/percentage of parameters in a model or layer that have been or will be set to 0 (removed by pruning).

**Summary Type (Layer Summaries)**—The data summary to display such as baseline or optimized values.

**Thread**—A single sequential flow of control within a program. A thread of execution is the smallest sequence of programmed instructions that can be managed independently by a scheduler, which is typically a part of the operating system.

**Total Sparsity**—The total number/percentage of parameters in a model or layer that have been or will be set to 0 (removed by pruning).

**Training Summary**—Graph of all the modifiers that are running and when those modifiers are active while you are training.

**Value Display**—The way of displaying the values such as as measured, as a total percentage, as the log of the values.

---
**Next step...**

Start or continue using Sparsify!
