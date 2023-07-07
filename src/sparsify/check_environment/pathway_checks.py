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


from sparsify.check_environment import check_for_gpu, check_ort_health


__all__ = ["one_shot_checks", "auto_checks"]


def one_shot_checks():
    """
    Check environment for compatibility with one-shot sparsification
    """
    check_for_gpu()
    check_ort_health()


def auto_checks():
    """
    Check environment for compatibility with training-aware sparsification and
    sparse-transfer learning
    """
    check_for_gpu()
