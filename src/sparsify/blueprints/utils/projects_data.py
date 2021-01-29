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
Helper functions and classes for flask blueprints specific to projects data
"""
import logging

from marshmallow import ValidationError

from sparseml.onnx.utils import DataLoader
from sparsify.blueprints.utils.helpers import HTTPNotFoundError
from sparsify.models import ProjectData


_LOGGER = logging.getLogger(__name__)

__all__ = ["get_project_data_by_ids", "validate_model_data"]


def validate_model_data(data_path: str, model_path: str):
    model_dataloader = DataLoader.from_model_random(model_path, batch_size=1)
    file_dataloader = DataLoader(data_path, None, 1)

    input_from_data, _ = next(file_dataloader)
    input_from_model, _ = next(model_dataloader)

    for data_key, model_key in zip(input_from_data.keys(), input_from_model.keys()):
        if input_from_data[data_key].shape != input_from_model[model_key].shape:
            raise ValidationError(
                "Data shape from input does not match model input shape."
            )
        if input_from_data[data_key].dtype != input_from_model[model_key].dtype:
            raise ValidationError(
                "Data type from input does not match model input type."
            )


def get_project_data_by_ids(project_id: str, data_id: str) -> ProjectData:
    query = ProjectData.get_or_none(
        ProjectData.project_id == project_id, ProjectData.data_id == data_id
    )

    if query is None:
        _LOGGER.error(
            "could not find data with data_id {} for project_id {}".format(
                data_id, project_id
            )
        )
        raise HTTPNotFoundError(
            "could not find data with data_id {} for project_id {}".format(
                data_id, project_id
            )
        )

    return query
