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

from typing import Tuple

from pydantic import BaseModel
from sparsify.auto.tasks.finetune.args import FineTuneTrainArgs
from sparsify.auto.tasks.finetune.finetune import main as train_hook
from sparsify.auto.tasks.runner import TaskRunner
from sparsify.auto.utils import HardwareSpecs
from sparsify.schemas import Metrics, SparsificationTrainingConfig
from sparsify.utils import TASK_REGISTRY


__all__ = [
    "LLMFinetuner",
]


@TaskRunner.register_task(task=TASK_REGISTRY["finetune"])
class LLMFinetuner(TaskRunner):
    """
    TaskRunner for LLM finetuning. Currently set-up as a shell to leverage TaskRunner's
    ddp functionality for finetuning. Function definitions will be completed as
    functionality is further supported.
    """

    train_hook = staticmethod(train_hook)
    export_model_kwarg = "None"

    def __init__(self, config: SparsificationTrainingConfig):
        super().__init__(config)

    @classmethod
    def config_to_args(
        cls, config: SparsificationTrainingConfig
    ) -> Tuple[BaseModel, BaseModel]:
        train_args = FineTuneTrainArgs(yaml=config.dataset)

        return train_args, None

    def update_run_directory_args(self):
        pass

    def _train_completion_check(self) -> bool:
        pass

    def _export_completion_check(self) -> bool:
        pass

    def _update_train_args_post_failure(self, error_type: Exception):
        pass

    def _update_export_args_post_failure(self, error_type: Exception):
        pass

    def _get_metrics(self) -> Metrics:
        pass

    def _get_default_deployment_directory(self, train_directory: str) -> str:
        pass

    def tune_args_for_hardware(self, hardware_specs: HardwareSpecs):
        pass
