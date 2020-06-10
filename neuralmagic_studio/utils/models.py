import os
from functools import reduce
import json
import math
from typing import List, Dict

import numpy as np
import onnx
from onnx import numpy_helper
from onnx.helper import get_attribute_value, ValueInfoProto
import onnxruntime as rt

try:
    from neuralmagic.model import benchmark_model
except OSError:
    benchmark_model = None
except ModuleNotFoundError:
    benchmark_model = None

DEFAULT_LOSS_SPARSITY_LEVELS = [
    0,
    0.05,
    0.2,
    0.4,
    0.6,
    0.7,
    0.8,
    0.9,
    0.95,
    0.975,
    0.99,
]
DEFAULT_PERF_SPARSITY_LEVELS = [
    None,
    0.4,
    0.6,
    0.7,
    0.8,
    0.85,
    0.875,
    0.9,
    0.925,
    0.95,
    0.975,
    0.99,
]
__all__ = ["RecalModel"]


def _is_prunable(node) -> bool:
    return node.op_type == "Conv" or node.op_type == "Gemm"


def _get_weight_input(inputs) -> List:
    return [inp for inp in inputs if "weight" in inp.name][0]


def prepare_weights_for_sparisty(init):
    weights = numpy_helper.to_array(init)
    density = np.count_nonzero(weights) / weights.size
    sparsity = 1.0 - density

    weights_flatten = numpy_helper.to_array(init).flatten()
    weights_flatten = np.absolute(weights_flatten)
    weights_flatten.sort()

    index_interval = (
        int(len(weights_flatten) / 1000) if len(weights_flatten) >= 1000 else 1
    )
    percent_interval = index_interval / len(weights_flatten)
    iterations = math.ceil(len(weights_flatten) / index_interval)
    return weights_flatten, index_interval, percent_interval, iterations


def _node_name(node) -> str:
    return node.name if node.name else node.output[0]


class RecalModel:
    def __init__(self, path):
        self._path = path
        self._model = onnx.load_model(path)
        onnx.checker.check_model(self._model)

        prunable_nodes = [node for node in self._model.graph.node if _is_prunable(node)]

        # Get output shapes of prunable nodes
        output_to_node = {}
        for node in prunable_nodes:
            intermediate_layer_value_info = ValueInfoProto()
            intermediate_layer_value_info.name = node.output[0]
            output_to_node[node.output[0]] = _node_name(node)
            self._model.graph.output.append(intermediate_layer_value_info)

        sess = rt.InferenceSession(self._model.SerializeToString())

        self._input_shapes = [inp.shape for inp in sess.get_inputs()]
        node_to_shape = reduce(
            lambda accum, current: (
                accum.update({output_to_node[current.name]: current.shape}) or accum
            )
            if current.name in output_to_node
            else accum,
            [out for out in sess.get_outputs()],
            {},
        )

        # Create Prunable Node
        input_to_nodes = {}
        for node in prunable_nodes:
            for inp in node.input:
                input_to_nodes[inp] = _node_name(node)

        node_to_inputs = reduce(
            lambda accum, node: accum.update({node: []}) or accum,
            [_node_name(node) for node in prunable_nodes],
            {},
        )

        for inp in self._model.graph.initializer:
            if inp.name not in input_to_nodes:
                continue
            node_name = input_to_nodes[inp.name]
            node_to_inputs[node_name].append(inp)

        self._prunable_nodes = [
            PrunableNode(
                node, node_to_inputs[_node_name(node)], node_to_shape[_node_name(node)]
            )
            for node in prunable_nodes
        ]

    @property
    def prunable_nodes(self) -> List:
        return self._prunable_nodes

    @property
    def prunable_layers(self) -> List[Dict]:
        return [node.layer_info for node in self._prunable_nodes]

    @property
    def sparse_analysis_loss_approx(self) -> List[Dict]:
        return [node.sparse_analysis_loss_approx for node in self._prunable_nodes]

    @property
    def sparse_analysis_perf_approx(self) -> List[Dict]:
        return [node.sparse_analysis_perf_approx for node in self._prunable_nodes]

    @property
    def input_shapes(self) -> List:
        return self._input_shapes

    @property
    def model_path(self) -> str:
        return self._path

    def run_sparse_analysis_perf(
        self, perf_file: str, sparsity_levels: List[float] = None
    ):
        if benchmark_model is None:
            raise Exception("neuralmagic must be installed to use this feature.")

        if sparsity_levels is None:
            sparsity_levels = DEFAULT_PERF_SPARSITY_LEVELS
        inputs = [
            np.random.rand(*inp_shape).astype(np.float32)
            for inp_shape in self.input_shapes
        ]
        batch_size = self.input_shapes[0][0]
        perf_report = {}

        for sparsity_level in sparsity_levels:
            if sparsity_level == 0:
                sparsity_level = None
            key = str(sparsity_level) if sparsity_level else "0.0"

            perf_report[key] = benchmark_model(
                self.model_path,
                inputs,
                imposed_ks=sparsity_level,
                optimization_level=0,
                batch_size=batch_size,
                num_cores=4,
                num_warmup_iterations=5,
                num_iterations=30,
            )

        with open(perf_file, "w+") as js:
            js.write(json.dumps(perf_report))


class PrunableNode:
    def __init__(self, node, inputs: List, output_shape: List):
        self._node = node
        self._inputs = inputs
        self._output_shape = output_shape

        self._attributes = reduce(
            lambda accum, attribute: accum.update(
                {attribute.name: get_attribute_value(attribute)}
            )
            or accum,
            node.attribute,
            {},
        )

        attribute_string = reduce(
            lambda accum, attribute_key: f"{accum},{attribute_key}={self._attributes[attribute_key]}"
            if accum is not None
            else f"{attribute_key}={self._attributes[attribute_key]}",
            self._attributes.keys(),
            None,
        )
        self._node_key = (
            f"{node.op_type}:(inp={node.input},out={node.output},{attribute_string})"
        ).replace(" ", "")

        self._weight_input = _get_weight_input(self._inputs)
        self._node_name = self._weight_input.name

    @property
    def layer_info(self) -> Dict:
        return {
            "attributes": self._attributes,
            "id": self._node_key,
            "name": self._node_name,
            "inputs": [node_input for node_input in self._node.input],
            "output": [node_output for node_output in self._node.output],
            "op_type": self._node.op_type,
        }

    @property
    def sparse_analysis_loss_approx(self) -> Dict:
        (
            weights_flatten,
            index_interval,
            percent_interval,
            iterations,
        ) = prepare_weights_for_sparisty(self._weight_input)

        sparse = []
        cummulative_loss = 0
        for i in range(iterations):
            cummulative_loss += np.sum(
                weights_flatten[i * index_interval : (i + 1) * index_interval]
            )
            sparsity_percent = min((i + 1) * percent_interval * 100, 100)
            sparse.append({"loss": cummulative_loss, "sparsity": sparsity_percent})

        return {
            "id": self._node_key,
            "sparse": sparse,
            "baseline": {"loss": 0.0, "sparsity": 0.0},
        }

    @property
    def sparse_analysis_perf_approx(self) -> Dict:
        (
            _,
            index_interval,
            percent_interval,
            iterations,
        ) = prepare_weights_for_sparisty(self._weight_input)

        flops = 0
        bias_flops = 0
        for weights in self._inputs:
            if "bias" in weights.name:
                bias_flops = np.prod(numpy_helper.to_array(weights).shape)
            elif self._node.op_type == "Gemm":
                flops += np.prod(numpy_helper.to_array(weights).shape)
            else:
                kernel = np.prod(self._attributes["kernel_shape"])
                flops += (
                    kernel
                    * numpy_helper.to_array(weights).shape[1]
                    * np.prod(self.output_shape[1:])
                )

        for weights in self._inputs:
            sparse = []
            current_flops = flops

            weights_size = numpy_helper.to_array(weights).size
            index_interval = int(weights_size / 1000) if weights_size >= 1000 else 1
            percent_interval = index_interval / weights_size
            iterations = math.ceil(weights_size / index_interval)

            for i in range(iterations):
                sparsity_percent = min((i + 1) * percent_interval * 100, 100)
                current_flops = flops * (1 - sparsity_percent / 100) + bias_flops
                sparse.append(
                    {
                        "flops": float(current_flops),
                        "timings": None,
                        "sparsity": sparsity_percent,
                    }
                )

        return {
            "id": self._node_key,
            "baseline": {"flops": float(flops + bias_flops), "timings": None},
            "sparse": sparse,
        }

    @property
    def node_key(self):
        return self._node_key

    @property
    def node_name(self):
        return self._node_name

    @property
    def kernel_shape(self) -> List[int]:
        return (
            self._attributes["kernel_shape"]
            if "kernel_shape" in self._attributes
            else []
        )

    @property
    def strides(self) -> List[int]:
        return self._attributes["strides"] if "strides" in self._attributes else []

    @property
    def output_shape(self) -> List[int]:
        return self._output_shape

    @property
    def output_channels(self) -> int:
        return self._weight_input.dims[0]

    @property
    def input_channels(self) -> int:
        return self._weight_input.dims[1]
