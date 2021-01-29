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
Schemas for anything related to errors occurring in the flask app
"""

from marshmallow import Schema, fields


__all__ = ["ErrorSchema"]


class ErrorSchema(Schema):
    """
    Error schema to return in the event of an error encountered while running the app
    """

    success = fields.Bool(default=False, missing=False, required=False)
    error_code = fields.Int(default=-1, missing=-1, required=False)
    error_type = fields.Str(required=True)
    error_message = fields.Str(required=True)
