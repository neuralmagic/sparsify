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

import os


__all__ = ["BACKEND_URL"]
_END_POINT = "/v1/sparsify/package/recommend-stub"


def _get_backend_url():
    """
    Returns the backend url for sparsify.package service
    """
    default_base_url = "http://0.0.0.0:8000"
    base_url = os.getenv("SPARSIFY_BACKEND_URL", default=default_base_url)
    return base_url + _END_POINT


BACKEND_URL = _get_backend_url()
