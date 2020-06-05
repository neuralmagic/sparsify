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

__all__ = ["Model", "PrunableNode"]


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


class Model:
    def __init__(self, path: str):
        self._model = onnx.load_model(path)
        self._path = "/".join(path.split("/")[:-1])
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
    def prunable_layers(self) -> List[Dict]:
        return [node.layer_info for node in self._prunable_nodes]

    @property
    def sparse_analysis_loss_approx(self) -> List[Dict]:
        return [node.sparse_analysis_loss_approx for node in self._prunable_nodes]

    @property
    def sparse_analysis_perf_approx(self) -> List[Dict]:
        return [node.sparse_analysis_perf_approx for node in self._prunable_nodes]


class PrunableNode:
    def __init__(self, node, inputs, output_shape: List):
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
