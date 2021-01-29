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
Schemas for anything related to system routes
"""

from marshmallow import Schema, fields, validate

from sparsify.schemas.helpers import INFERENCE_ENGINE_TYPES, INSTRUCTION_SETS


__all__ = ["VersionInfoSchema", "SystemInfo", "ResponseSystemInfo"]


class VersionInfoSchema(Schema):
    deepsparse = fields.Str(allow_none=True)
    sparseml = fields.Str(allow_none=True)
    sparsezoo = fields.Str(allow_none=True)
    onnx = fields.Str(allow_none=True)
    onnxruntime = fields.Str(allow_none=True)


class SystemInfo(Schema):
    """
    Schema for the system info the server is currently running on
    """

    vendor = fields.Str(required=False, default=None, missing=None, allow_none=True)
    isa = fields.Str(required=False, default=None, missing=None, allow_none=True)
    vnni = fields.Bool(required=False, default=None, missing=None, allow_none=True)
    num_sockets = fields.Int(
        required=False, default=None, missing=None, allow_none=True
    )
    cores_per_socket = fields.Int(
        required=False, default=None, missing=None, allow_none=True
    )
    threads_per_core = fields.Int(
        required=False, default=None, missing=None, allow_none=True
    )
    l1_instruction_cache_size = fields.Int(
        required=False, default=None, missing=None, allow_none=True
    )
    l1_data_cache_size = fields.Int(
        required=False, default=None, missing=None, allow_none=True
    )
    l2_cache_size = fields.Int(
        required=False, default=None, missing=None, allow_none=True
    )
    l3_cache_size = fields.Int(
        required=False, default=None, missing=None, allow_none=True
    )
    ip_address = fields.Str(required=False, default=None, missing=None, allow_none=True)
    available_engines = fields.List(
        fields.Str(validate=validate.OneOf(INFERENCE_ENGINE_TYPES)),
        required=False,
        default=None,
        missing=None,
        allow_none=True,
    )
    available_instructions = fields.List(
        fields.Str(validate=validate.OneOf(INSTRUCTION_SETS)),
        required=False,
        default=None,
        missing=None,
        allow_none=True,
    )
    version_info = fields.Nested(
        VersionInfoSchema, allow_none=True, default=None, required=False
    )


class ResponseSystemInfo(Schema):
    """
    Schema for returning a response with the system info
    """

    info = fields.Nested(SystemInfo, required=True)
