# Sparsify Models Guide

For the One-Shot and Training-Aware Experiments, you will need to provide a dense model you wish to optimize for inference. 
When running the `sparsify.run` command for either of these Experiments you'll need to supply the argument `--model PATH_TO_DENSE_ONNX_MODEL` with the path to your model in your local working directory.
