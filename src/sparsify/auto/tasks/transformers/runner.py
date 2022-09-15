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

import json
import math
import os
from typing import List, Tuple

import onnx

from pydantic import BaseModel
from sparseml.pytorch.optim.manager import ScheduledModifierManager
from sparseml.transformers.export import export as export_hook
from sparseml.transformers.question_answering import main as question_answering_hook
from sparseml.transformers.text_classification import main as text_classification_hook
from sparseml.transformers.token_classification import main as token_classification_hook
from sparseml.transformers.utils import SparseAutoModel
from sparsify.auto.api import Metrics
from sparsify.auto.configs import SparsificationTrainingConfig
from sparsify.auto.tasks.runner import TaskRunner
from sparsify.auto.tasks.transformers import (
    QuestionAnsweringArgs,
    TextClassificationArgs,
    TokenClassificationArgs,
    TransformersExportArgs,
)
from sparsify.auto.utils import HardwareSpecs
from sparsify.utils import TASK_REGISTRY


__all__ = [
    "QuestionAnsweringRunner",
]


class _TransformersRunner(TaskRunner):
    """
    Class for managing a single run of Transformers. A run may involve
    training, one-shot, or zero-shot sparsification. Final models are exported to onnx
    at end of run for inference and deployment.
    """

    export_hook = staticmethod(export_hook)

    def __init__(self, config: SparsificationTrainingConfig):
        super().__init__(config)

    @classmethod
    def config_to_args(
        cls, config: SparsificationTrainingConfig
    ) -> Tuple[BaseModel, BaseModel]:
        """
        Create sparseml integration args from SparsificationTrainingConfig. Returns
        a tuple of run args in the order (train_args, export_arts)

        :param config: training config to generate run for
        :return: tuple of training and export arguments
        """
        train_args = cls.train_args_class(
            model_name_or_path=config.base_model,
            dataset_name=config.dataset,
            **config.kwargs,
        )

        export_args = TransformersExportArgs(
            task=_TASK_TO_EXPORT_TASK[cls.task], model_path=train_args.output_dir
        )

        return train_args, export_args

    def tune_args_for_hardware(self, hardware_specs: HardwareSpecs):
        """
        Update run args based on detected hardware specifications
        """
        # self.train_args.fp16 = hardware_specs.fp16_available

    def update_run_directory_args(self):
        """
        Update run directories to save to the temporary run directory
        """
        self.train_args.output_dir = os.path.join(
            self._run_directory.name, self.train_args.output_dir
        )
        self.export_args.model_path = self.train_args.output_dir

    def memory_stepdown(self):
        """
        Update run args in the event of an out of memory error, to reduce memory usage
        """
        self.train_args.per_device_train_batch_size //= 2
        self.train_args.gradient_accumulation_steps *= 2
        if (
            self.train_args.per_device_eval_batch_size
            > self.train_args.per_device_train_batch_size
        ):
            self.train_args.per_device_eval_batch_size //= 2

    def _train_completion_check(self) -> bool:
        """
        Checks if train run completed successfully
        """
        model_directory = self.export_args.model_path
        model_file = os.path.join(model_directory, "pytorch_model.bin")

        # Check model file exists
        if not os.path.isfile(model_file):
            return False

        # Check model file is loadable
        try:
            _ = _load_model_on_task(model_directory, "student", self.task)
        except Exception:
            return False

        # Test training ran to completion
        end_epoch = (
            ScheduledModifierManager.from_yaml(self.train_args.recipe).max_epochs
            if self.train_args.recipe
            else self.train_args.num_train_epochs
        )

        if not self.train_args.max_train_samples and not self.train_args.max_steps:
            with open(os.path.join(model_directory, "train_results.json")) as f:
                train_results = json.load(f)
            if not (abs(train_results["epoch"] - math.floor(end_epoch)) < 0.1):
                return False

        return True

    def _export_completion_check(self) -> bool:
        """
        Checks if export run completed successfully
        """

        onnx_file = os.path.join(self._run_directory.name, "deployment", "model.onnx")

        # Check mode file exists
        if not os.path.isfile(onnx_file):
            return False

        # Check onnx graph
        model = onnx.load(onnx_file)
        try:
            onnx.checker.check_model(model)
        except Exception:
            return False

        return True

    def _update_train_args_post_failure(self, error_type: Exception):
        """
        After a run throws an error or fails the the completion check, update args to
        reflect a resumed run. If specific error type is caught, update args to avoid
        error. e.g. for an Out of Memory error, the batch size may be reduced.
        """
        pass

    def _update_export_args_post_failure(self, error_type: Exception):
        """
        After a run throws an error or fails the the completion check, update args to
        reflect a resumed run. If specific error type is caught, update args to avoid
        error.
        """
        pass

    def _get_metrics(self) -> Metrics:
        """
        Retrieve metrics from training output.
        """
        if self.train_args.one_shot:
            return Metrics(
                accuracy=None,
                recovery=None,
            )

        with open(os.path.join(self.export_args.model_path, "eval_results.json")) as f:
            results = json.load(f)

        return Metrics(
            accuracy={"eval_f1": results["eval_f1"]}
            if not self.task == "text_classification"
            else {"eval_accuracy": results["eval_accuracy"]},
            recovery=None,
        )

    def _get_output_files(self) -> List[str]:
        """
        Return list of files to copy into user output directory
        """
        return [
            os.path.relpath(
                os.path.join(os.path.dirname(self.export_args.model_path), dir),
                self._run_directory.name,
            )
            for dir in os.listdir(self._run_directory.name)
        ]


@TaskRunner.register_task(task=TASK_REGISTRY["text_classification"])
class TextClassificationRunner(_TransformersRunner):
    """
    Class for managing a single Question Answering run
    """

    train_hook = staticmethod(text_classification_hook)
    train_args_class = TextClassificationArgs
    sparseml_train_entrypoint = "sparseml.transformers.text_classification"


@TaskRunner.register_task(task=TASK_REGISTRY["token_classification"])
class TokenClassificationRunner(_TransformersRunner):
    """
    Class for managing a single Question Answering run
    """

    train_hook = staticmethod(token_classification_hook)
    train_args_class = TokenClassificationArgs
    sparseml_train_entrypoint = "sparseml.transformers.token_classification"


@TaskRunner.register_task(task=TASK_REGISTRY["question_answering"])
class QuestionAnsweringRunner(_TransformersRunner):
    """
    Class for managing a single Question Answering run
    """

    train_hook = staticmethod(question_answering_hook)
    train_args_class = QuestionAnsweringArgs
    sparseml_train_entrypoint = "sparseml.transformers.question_answering"


_TASK_TO_EXPORT_TASK = {
    "question_answering": "qa",
    "text_classification": "glue",
    "token_classification": "ner",
}


def _load_model_on_task(model_name_or_path, model_type, task, **model_kwargs):
    load_funcs = {
        "masked_language_modeling": SparseAutoModel.masked_language_modeling_from_pretrained,  # noqa
        "question_answering": SparseAutoModel.question_answering_from_pretrained,
        "text_classification": SparseAutoModel.text_classification_from_pretrained,
        "token_classification": SparseAutoModel.token_classification_from_pretrained,
    }
    return load_funcs[task](model_name_or_path, model_type=model_type, **model_kwargs)
