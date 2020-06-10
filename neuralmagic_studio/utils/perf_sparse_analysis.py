import os
import json
import numpy as np
from functools import reduce
from typing import Dict, List, Any

__all__ = ["PerfAnalysis"]


BASELINE = "0.0"


def _is_prunable(name: str) -> bool:
    return ("conv" in name) or ("gemm" in name) or "winograd_fused" in name


def _get_array_from_data(data: dict) -> List[int]:
    return [data["x"], data["y"], data["z"]]


def _are_array_equal(array_one: List, array_two: List) -> bool:
    return (
        (array_one == array_two)
        or (
            len(array_one) > len(array_two)
            and array_one[: len(array_two)] == array_two
            and np.prod(array_one[len(array_two) :]) == 1
        )
        or (
            len(array_two) > len(array_one)
            and array_two[: len(array_one)] == array_one
            and np.prod(array_two[len(array_one) :]) == 1
        )
    )


class PerfAnalysis:
    def __init__(self, perf_file: str):
        self._analysis = {}
        if not os.path.exists(perf_file):
            filename = perf_file.split("/")[-1]
            raise FileNotFoundError(f"No perf file {filename}")
        with open(perf_file) as file:
            sparse_json = json.load(file)
        for sparsity in sparse_json:
            sparsity_level = float(sparsity) if sparsity != "None" else 0.0
            self._analysis[str(sparsity_level)] = PerfAnalysisAtSparsity(
                sparse_json[sparsity], sparsity_level
            )

    @staticmethod
    def write(perf_file: str, content: Dict[str, Any]):
        with open(perf_file, "w+") as file:
            file.write(json.dumps(content))
        return PerfAnalysis(perf_file)

    def get_perf_info(self, prunable_nodes: List) -> List[Dict]:
        layer_index_to_node = self._analysis[BASELINE].match(prunable_nodes)
        perf_infos = [
            {
                "baseline": perf_info,
                "id": layer_index_to_node[index].node_key,
                "sparse": [],
            }
            for index, perf_info in enumerate(self._analysis[BASELINE].perf_info)
            if index in layer_index_to_node
        ]
        for sparsity_level in self._analysis.keys():
            if sparsity_level == BASELINE:
                continue
            for index, perf_info in enumerate(self._analysis[sparsity_level].perf_info):
                perf_infos[index]["sparse"].append(perf_info)
        return perf_infos


class PerfAnalysisAtSparsity:
    def __init__(self, data: Dict, sparsity_level: float):
        self._sparsity_level = sparsity_level
        self._layers = []
        for layer in data["layer_info"]:
            if _is_prunable(layer["name"]):
                self._layers.append(PerfNode(layer))

    @property
    def perf_info(self) -> List[Dict]:
        return [
            {
                "flops": layer.flops,
                "sparsity": self._sparsity_level,
                "timing": layer.timing,
            }
            for layer in self._layers
        ]

    def match(self, prunable_nodes: List):
        name_to_idx = {}
        matched_nodes = set()
        for node_index, prunable_node in enumerate(prunable_nodes):
            name_to_idx[prunable_node.node_name] = node_index

        layer_index_to_node = {}
        for layer_index, layer in enumerate(self._layers):

            matches = [node for node in prunable_nodes if layer.is_match(node)]

            if len(matches) == 0:
                raise Exception("Unable to find match.")

            matches = sorted(
                matches,
                key=lambda match: abs(layer_index - name_to_idx[match.node_name]),
            )

            match = matches[0]

            if match.node_name in matched_nodes:
                raise Exception("Duplicate match occured.")
            matched_nodes.add(match)

            layer_index_to_node[layer_index] = match

        return layer_index_to_node


class PerfNode:
    def __init__(self, layer: Dict[str, Any]):
        self._name = layer["name"]
        self._input = _get_array_from_data(layer["input_dims"])
        self._output = _get_array_from_data(layer["output_dims"])
        self._kernel_shape = (
            _get_array_from_data(layer["kernel_dims"]) if "kernel_dims" in layer else []
        )
        self._input_channels = layer["input_dims"]["channels"]
        self._output_channels = layer["output_dims"]["channels"]
        self._strides = _get_array_from_data(layer["strides"])
        self._timing = layer["average_run_time_in_ms"]
        self._required_flops = layer["required_flops"]

    def is_match(self, prunable_node) -> bool:
        return (
            _are_array_equal(self._kernel_shape, prunable_node.kernel_shape)
            and self._input_channels == prunable_node.input_channels
            and self._output_channels == prunable_node.output_channels
        )

    @property
    def name(self) -> str:
        return self._name

    @property
    def timing(self) -> float:
        return self._timing

    @property
    def flops(self) -> float:
        return self._required_flops
