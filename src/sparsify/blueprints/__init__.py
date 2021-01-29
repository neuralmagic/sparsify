# Copyright 2021-present Neuralmagic, Inc.
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
Flask blueprints setup for serving UI files and making api requests for the
server application
"""

# flake8: noqa
from .errors import *
from .jobs import *
from .model_repo import *
from .projects import *
from .projects_benchmarks import *
from .projects_data import *
from .projects_model import *
from .projects_optimizations import *
from .projects_profiles import *
from .system import *
from .ui import *
