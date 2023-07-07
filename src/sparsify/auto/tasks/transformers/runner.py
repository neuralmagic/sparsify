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
import re
import warnings
from typing import Tuple, Union

import onnx

from pydantic import BaseModel
from sparseml.pytorch.optim.manager import ScheduledModifierManager
from sparseml.transformers.export import export as export_hook
from sparseml.transformers.question_answering import main as question_answering_hook
from sparseml.transformers.text_classification import main as text_classification_hook
from sparseml.transformers.token_classification import main as token_classification_hook
from sparseml.transformers.utils import SparseAutoModel
from sparsify.auto.tasks.runner import TaskRunner
from sparsify.auto.tasks.transformers import (
    QuestionAnsweringArgs,
    TextClassificationArgs,
    TokenClassificationArgs,
    TransformersExportArgs,
)
from sparsify.auto.utils import HardwareSpecs
from sparsify.schemas import Metrics, SparsificationTrainingConfig
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
    export_model_kwarg = "model_path"

    def __init__(self, config: SparsificationTrainingConfig):
        super().__init__(config)
        self._model_save_name = ""

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
        dataset_name, data_file_args = cls.parse_data_args(config.dataset)
        config.kwargs.update(data_file_args)

        if config.task == TASK_REGISTRY.get("text_classification") and (
            dataset_name in _GLUE_TASK_NAMES
        ):
            # text classification GLUE datasets need special treatment
            # since the proper dataset names are set as "task" with
            # the top level dataset as "glue"
            config.kwargs["task_name"] = dataset_name
            dataset_name = "glue"

        train_args = cls.train_args_class(
            model_name_or_path=config.base_model,
            recipe=config.recipe,
            recipe_args=config.recipe_args,
            dataset_name=dataset_name,
            distill_teacher=config.distill_teacher
            if not config.distill_teacher == "off"
            else "disable",
            **config.kwargs,
        )

        export_args = TransformersExportArgs(
            task=_TASK_TO_EXPORT_TASK[cls.task], model_path=train_args.output_dir
        )

        return train_args, export_args

    @classmethod
    def parse_data_args(cls, dataset: str) -> Tuple[Union[str, None], dict]:
        """
        Check if the dataset provided is a data directory. If it is, update the train,
        test and validation file arguments with the approriate filepaths. This function
        assumes any file containing the substrings "train", "test", or "val" are the
        data files expected to be used. Duplicates will be updated to only use one file
        path. Also, existing kwargs for train, test and validation files will be
        overwritten if directory is provided.

        Example directory structure:
        - data_for_training/
            - some_train_file.json
            - some_validation_file.json
            - test_dir/
                - some_test_file.json

        :params dataset: inputted data string arg. Assumed to either be a dataset which
        can be downloaded publicly or a locally available directory containing
        data files.

        :returns: updated dataset, train_file, test_file, and validation_file args
        """
        data_file_args = {}

        def _check_and_update_file(root: str, current_file: str, file_type: str):
            split_type = file_type.split("_")[0]

            if data_file_args.get(file_type, None):
                warnings.warn(
                    f"A {split_type} file was already found with name "
                    f"{data_file_args[file_type]}. Updating with {current_file} "
                )

            if not current_file.lower().endswith(("json", "csv")):
                warnings.warn(
                    f"Found {split_type} file named {current_file} "
                    "with incorrect file type (expected: json or csv). Skipping file."
                )
            else:
                data_file_args[file_type] = os.path.join(root, current_file)

        if os.path.isdir(dataset):
            for root, _, files in os.walk(dataset):
                for f in files:
                    if re.search(r"train", f):
                        _check_and_update_file(root, f, "train_file")
                    elif re.search(r"val", f):
                        _check_and_update_file(root, f, "validation_file")
                    elif re.search(r"test", f):
                        _check_and_update_file(root, f, "test_file")

                if (
                    data_file_args.get("train_file", None)
                    and data_file_args.get("validation_file", None)
                    and data_file_args.get("test_file", None)
                ):
                    break

            if not (
                data_file_args.get("train_file", None)
                and data_file_args.get("validation_file", None)
            ):
                raise Exception(
                    "No training or validation files found. Be sure the "
                    "directory provided to the data arg contains json or csv "
                    "files with the train and val substrings in the filenames."
                )

        if data_file_args:
            dataset = None

        return dataset, data_file_args

    def tune_args_for_hardware(self, hardware_specs: HardwareSpecs):
        """
        Update run args based on detected hardware specifications
        """
        # self.train_args.fp16 = hardware_specs.fp16_available

    def update_run_directory_args(self):
        """
        Update run directories to save to the temporary run directory
        """
        self.train_args.output_dir = self.run_directory
        self.train_args.logging_dir = self.log_directory
        self.export_args.model_path = self.run_directory

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

        onnx_file = os.path.join(self.run_directory, "deployment", "model.onnx")

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
                metrics=None,
                recovery=None,
            )

        with open(os.path.join(self.export_args.model_path, "eval_results.json")) as f:
            results = json.load(f)

        objective_key = (
            "eval_f1" if not self.task == "text_classification" else "eval_accuracy"
        )

        return Metrics(
            metrics={objective_key: results[objective_key]},
            objective_key=objective_key,
            recovery=None,
        )

    def _get_default_deployment_directory(self, train_directory: str) -> str:
        """
        Return the path to where the deployment directory is created by export

        :param train_directory: train directory from which the export directory was
            created. Used for relative pathing
        """
        return os.path.join(train_directory, "deployment")


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


# https://huggingface.co/datasets/glue
_GLUE_TASK_NAMES = {
    "ax",
    "cola",
    "mnli",
    "mnli_matched",
    "mnli_mismatched",
    "mrpc",
    "qnli",
    "qqp",
    "rte",
    "sst2",
    "stsb",
    "wnli",
}


def _load_model_on_task(model_name_or_path, model_type, task, **model_kwargs):
    load_funcs = {
        "masked_language_modeling": SparseAutoModel.masked_language_modeling_from_pretrained,  # noqa
        "question_answering": SparseAutoModel.question_answering_from_pretrained,
        "text_classification": SparseAutoModel.text_classification_from_pretrained,
        "token_classification": SparseAutoModel.token_classification_from_pretrained,
    }
    return load_funcs[task](model_name_or_path, model_type=model_type, **model_kwargs)
