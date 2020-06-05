import os
from typing import Dict, List, Any, Callable

import onnx
from onnx import numpy_helper, AttributeProto, helper
from onnx.helper import get_attribute_value
import onnxruntime as rt
import numpy as np
import random

from functools import reduce
import math

__all__ = ["calc_sparse_loss_sensitivity", "calc_sparse_perf_sensitivity"]


# TODO Implement with actual logic, not mock logic
def calc_sparse_loss_sensitivity(onnx_path: str) -> List[Dict]:
    losses = []

    for i in range(20):
        layer_id = f"Conv:(inp=['input','sequence.{i}.weight','sequence.{i}.bias'],out=['{5+i}'])"
        baseline = {"flops": 1000.0, "loss": 0}

        loss = random.random()
        flops = random.randint(0, 100)

        sparse = []
        for j in range(1000):
            sparse.append(
                {
                    "sparsity": (j + 1) * 0.1,
                    "flops": 1000.0 - (j + 1) + flops,
                    "loss": math.exp((j + 1) * 0.01) + loss,
                }
            )
        losses.append({"layer_id": layer_id, "baseline": baseline, "sparse": sparse})

    return losses


# TODO Implement with actual logic, not mock logic
def calc_sparse_perf_sensitivity(onnx_path: str) -> List[Dict]:
    perf = []

    for i in range(20):
        layer_id = f"Conv:(inp=['input','sequence.{i}.weight','sequence.{i}.bias'],out=['{5+i}'])"
        baseline = {"flops": 1000.0, "timings": None}

        sparse = []
        timings = random.random() * 100
        flops = random.randint(0, 100)

        for j in range(1000):
            sparse.append(
                {
                    "sparsity": (j + 1) * 0.1,
                    "flops": 1000.0 - (j + 1) + flops,
                    "timings": (j + 1) * 0.1 + timings,
                }
            )
        perf.append({"layer_id": layer_id, "baseline": baseline, "sparse": sparse})

    return perf
