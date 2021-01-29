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
Helper functions and classes for flask blueprints specific to project benchmark
"""
import logging

from sparsify.blueprints.utils.helpers import HTTPNotFoundError
from sparsify.models import ProjectBenchmark


__all__ = ["get_project_benchmark_by_ids"]

_LOGGER = logging.getLogger(__name__)


def get_project_benchmark_by_ids(
    project_id: str, benchmark_id: str
) -> ProjectBenchmark:
    """
    Get a project benchmark by its project_id and benchmark_id

    :param project_id: project id of the optimizer
    :param benchmark_id: benchmark id of the optimizer
    :return: Project benchmark with provided ids
    """
    benchmark = ProjectBenchmark.get_or_none(
        ProjectBenchmark.project_id == project_id,
        ProjectBenchmark.benchmark_id == benchmark_id,
    )

    if benchmark is None:
        _LOGGER.error(
            f"could not find project benchmark for project {project_id} "
            f"with benchmark_id {benchmark_id}"
        )
        raise HTTPNotFoundError(
            f"could not find project benchmark for project {project_id} "
            f"with benchmark_id {benchmark_id}"
        )

    return benchmark
