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

import torch


_LOGGER = logging.getLogger(__name__)

__all__ = ["check_for_gpu"]


def check_for_gpu():
    """
    Check for GPU and warn if not found
    """
    _LOGGER.warning("Checking for GPU...")
    if not torch.cuda.is_available():
        _LOGGER.warn(
            "*************************** NO GPU DETECTED ***************************\n"
            "No GPU(s) detected on machine. The use of a GPU for training-aware "
            "sparsification, sparse-transfer learning, and one-shot sparsification is "
            "highly recommended.\n"
            "************************************************************************"
        )
    else:
        _LOGGER.warning("GPU check completed successfully")
