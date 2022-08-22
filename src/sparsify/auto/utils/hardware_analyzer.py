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
import warnings
from typing import List

import torch

from pydantic import BaseModel, Field


__ALL__ = ["HardwareSpecs", "analyze_hardware"]


class HardwareSpecs(BaseModel):
    """
    Class containing information gleaned from local machine
    """

    cuda_available: bool = Field(description="Whether cuda is available on the system")
    device_count: int = Field(description="Number of devices detected")
    device_names: List[str] = Field(description="Names of devices available")
    fp16_available: bool = Field(description="True if mixed precision available")


def analyze_hardware() -> HardwareSpecs:
    """
    Return a HardwareSpecs class filled with information on the local machine
    """
    return HardwareSpecs(
        cuda_available=_cuda_available(),
        device_count=torch.cuda.device_count() or 1,
        device_names=[f"cuda:{idx}" for idx in range(torch.cuda.device_count())]
        or (["CPU"]),
        fp16_available=torch.cuda.has_half,
    )


def _cuda_available() -> bool:
    """
    Check that cuda is available and cuda operations pass as expected
    """
    if torch.cuda.is_available():
        device = torch.device("cuda:0")
        try:
            tensor = torch.rand(4, 4).to(device)  # noqa: F841
            del tensor
        except RuntimeError:
            warnings.warn(
                "Detected CUDA drivers installed on system but could not perform "
                "Tensor operation on cuda:0 device"
            )
            return False
        return True
    return False
