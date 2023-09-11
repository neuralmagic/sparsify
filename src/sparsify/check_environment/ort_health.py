# Copyright (c) 2021 - present / Neuralmagic, Inc. All Rights Reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#    http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing,
# software distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.


import logging
import signal
from typing import List, Optional

import numpy
import torch
from onnx import TensorProto, helper

import onnxruntime as ort
from deepsparse.utils import generate_random_inputs, get_input_names
from sparsify.login import import_sparsifyml_authenticated


import_sparsifyml_authenticated()
from sparsifyml.one_shot.utils import run_onnx_model  # noqa: E402


__all__ = ["check_ort_health"]

_LOGGER = logging.getLogger(__name__)


CUDA_HELP_STRING = (
    "If you would like to run on GPU, please ensure that your CUDA and cuDNN "
    "versions are compatible with the installed version of onnxruntime-gpu: "
    "https://onnxruntime.ai/docs/execution-providers/CUDA-ExecutionProvider.html#requirements"  # noqa: E501
)


def _create_simple_conv_graph(
    image_pixels_side: int = 32,
    channel_count: int = 3,
    batch_size: int = 1,
    kernel_size: int = 3,
    kernel_count: int = 10,
):
    feature_size_side = image_pixels_side - kernel_size + 1

    # The inputs and outputs
    X = helper.make_tensor_value_info(
        "X",
        TensorProto.FLOAT,
        [batch_size, channel_count, image_pixels_side, image_pixels_side],
    )
    Y = helper.make_tensor_value_info(
        "Y",
        TensorProto.FLOAT,
        [batch_size, kernel_count, feature_size_side, feature_size_side],
    )

    # Create nodes for Conv, Relu, Flatten, and Gemm (Fully Connected) operations
    conv_node = helper.make_node(
        "Conv",
        inputs=["X", "conv_weight", "conv_bias"],
        outputs=["conv_result"],
        kernel_shape=[kernel_size, kernel_size],
    )

    relu_node1 = helper.make_node(
        "Relu",
        inputs=["conv_result"],
        outputs=["Y"],
    )

    # Define the weights for the Conv and Gemm layers
    conv_weight = helper.make_tensor(
        "conv_weight",
        TensorProto.FLOAT,
        [kernel_count, channel_count, kernel_size, kernel_size],
        numpy.random.randn(kernel_count, channel_count, kernel_size, kernel_size),
    )
    conv_bias = helper.make_tensor(
        "conv_bias", TensorProto.FLOAT, [kernel_count], numpy.random.randn(kernel_count)
    )

    # Create the graph (model)

    graph_def = helper.make_graph(
        [conv_node, relu_node1],
        "SimpleCNN",
        inputs=[X],
        outputs=[Y],
        initializer=[conv_weight, conv_bias],
    )

    return helper.make_model(graph_def, producer_name="onnx-example")


def check_ort_health(providers: Optional[List[str]] = None):
    """
    Checks that the model can be executed with the set providers

    :param model: model to check
    :param providers: list of providers use for ORT execution
    """
    _LOGGER.warning("Checking onnxruntime-gpu environment health...")

    model = _create_simple_conv_graph()

    providers = (
        ["CUDAExecutionProvider"]
        if torch.cuda.is_available()
        else ["CPUExecutionProvider"]
    )

    # If cuda device found by torch, ensure it's found by ORT as well
    if ort.get_device() != "GPU" and "CUDAExecutionProvider" in providers:
        raise RuntimeError(
            "CUDA enabled device detected on your machine, but is not detected by "
            "onnxruntime. If you would like to run on CPU, please set "
            "CUDA_VISIBLE_DEVICES=-1. Note that this is likely to slow down model "
            f"compression significantly. {CUDA_HELP_STRING}"
        )

    # Ensure that ORT can execute the model
    random_input = {
        input_name: input
        for input_name, input in zip(
            get_input_names(model), generate_random_inputs(model)
        )
    }

    # Define a custom exception and signal handler
    class _TerminationSignal(Exception):
        pass

    def handle_termination_signal(signum, frame):
        raise _TerminationSignal("Termination signal received")

    # Register the signal handler for SIGTERM and SIGINT signals
    signal.signal(signal.SIGTERM, handle_termination_signal)
    signal.signal(signal.SIGINT, handle_termination_signal)

    try:
        run_onnx_model(
            model=model,
            input_batch=random_input,
            providers=providers,
        )
    except _TerminationSignal as ts:
        print("Termination signal caught:", ts)
    except Exception as e:
        # If run fails, try again with CPU only to ensure this is a CUDA environment
        # issue
        if providers != ["CPUExecutionProvider"]:
            try:
                run_onnx_model(
                    model=model,
                    input_batch=random_input,
                    providers=["CPUExecutionProvider"],
                )

                raise RuntimeError(
                    "ONNXRuntime execution failed with CUDAExecutionProvider"
                    "but succeeded with CPUExecutionProvider. This is indicative"
                    f"of a likely issue with nnxruntime-gpu install {CUDA_HELP_STRING}"
                ) from e

            except RuntimeError:
                pass

        raise RuntimeError(
            "ONNXRuntime execution failed with both CUDAExecutionProvider and "
            "CPUExecutionProvider. Ensure that onnxruntime-gpu and its dependencies "
            "are properly installed."
        ) from e

    _LOGGER.warning("onnxruntime-gpu environment check completed successfully")
