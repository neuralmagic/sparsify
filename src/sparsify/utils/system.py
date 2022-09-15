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

"""
Utilities for ONNX based ML system info and validation
"""

import socket
from typing import Any, Dict, List, Union

from pkg_resources import get_distribution

import psutil


try:
    import deepsparse

    deepsparse_import_err = None
except Exception as deepsparse_err:
    deepsparse = None
    deepsparse_import_err = deepsparse_err

try:
    import onnxruntime

    ort_import_err = None
except Exception as ort_err:
    onnxruntime = None
    ort_import_err = ort_err


__all__ = [
    "available_ml_engines",
    "ml_engines_errors",
    "get_ml_sys_info",
]


def available_ml_engines() -> List[str]:
    """
    :return: List of available inference providers on current system. Potential values
        include ['deepsparse', 'ort_cpu', 'ort_gpu']
    """
    # ORT availability
    engines = []

    if deepsparse is not None:
        engines.append("deepsparse")

    if onnxruntime is not None:
        ort_providers = onnxruntime.get_available_providers()
        if "CPUExecutionProvider" in ort_providers:
            engines.append("ort_cpu")
        if "CUDAExecutionProvider" in ort_providers:
            engines.append("ort_gpu")

    return engines


def ml_engines_errors() -> Dict[str, Exception]:
    """
    :return: a dictionary containing any errors encountered when importing ML engines
        on the current system
    """
    return {
        "deepsparse": deepsparse_import_err,
        "onnxruntime": ort_import_err,
    }


def _get_package_version(package: str) -> Union[None, str]:
    try:
        return get_distribution(package).version
    except Exception:
        return None


def get_ml_version_info() -> Dict[str, str]:
    """
    :return: a dictionary containing the version information of sparseml,
        deepsparse, onnxruntime, and onnx if installed.
    """
    sparseml_version = _get_package_version("sparseml") or _get_package_version(
        "sparseml-nightly"
    )
    deepsparse_version = _get_package_version("deepsparse") or _get_package_version(
        "deepsparse-nightly"
    )
    onnxruntime_version = _get_package_version("onnxruntime")
    onnx_version = _get_package_version("onnx")

    return {
        "sparseml": sparseml_version,
        "onnxruntime": onnxruntime_version,
        "deepsparse": deepsparse_version,
        "onnx": onnx_version,
    }


def get_ml_sys_info() -> Dict[str, Any]:
    """
    :return: a dictionary containing info for the system and ML engines on the system.
        Such as number of cores, instruction sets, available engines, etc
    """
    sys_info = {
        "available_engines": available_ml_engines(),
        "ip_address": None,
        "version_info": get_ml_version_info(),
    }

    try:
        # sometimes this isn't available, wrap to protect and not fail
        sys_info["ip_address"] = socket.gethostbyname(socket.gethostname())
    except Exception:
        pass

    # get sys info from deepsparse.cpu
    if deepsparse is not None:
        deepsparse_info = deepsparse.cpu.cpu_architecture()
        deepsparse_info = {
            k.lower(): v for k, v in deepsparse_info.items()
        }  # standardize case
        sys_info.update(deepsparse_info)  # add to main dict

        sys_info["available_instructions"] = (
            deepsparse_info["isa"]
            if isinstance(deepsparse_info["isa"], list)
            else [deepsparse_info["isa"]]
        )
        sys_info["available_instructions"] = [
            ins.upper() for ins in sys_info["available_instructions"]
        ]
    else:
        sys_info["cores_per_socket"] = psutil.cpu_count(logical=False)

    return sys_info
