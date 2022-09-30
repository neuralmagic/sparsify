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


__all__ = ["get_backend_url", "get_base_url"]
_END_POINT = "/v1/sparsify/package/recommend-stub"
_DEFAULT_BASE_URL = "http://0.0.0.0:8000"


def get_base_url() -> str:
    """
    :return The base url for sparsify.package server
    """
    return os.getenv("SPARSIFY_BACKEND_URL", default=_DEFAULT_BASE_URL)


def get_backend_url() -> str:
    """
    :return The backend url  for sparsify.package server
    """
    return get_base_url() + _END_POINT
