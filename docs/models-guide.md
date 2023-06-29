# Sparsify Models Guide

For any Sparsify Experiments, a dense model can be supplied for sparsification.
One Shot is the only experiment type that requires a model to be passed in.
For others, a default model will be chosen to best fit the given use case.
Due to the varied ML pipelines and implementations, Sparsify standardizes on a few, popular formats for models.
You will need to make sure that your models are formatted properly according to the standards listed below.

## One Shot

The ONNX model format is the only currently supported one for one shot.
See the SparseML documentation for exporting to ONNX formats.
In the near future, more formats will be added for support with one shot.

## Training Aware and Sparse Transfer

The PyTorch model format is the only currently supported one for training aware and sparse transfer experiments.
The exact format will depend on the pipeline, and therefore the use case, for the experiment.
