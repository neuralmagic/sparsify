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
Tests APIConfigCreator and its implementations
"""

import pytest

from sparsify.auto import (
    DEFAULT_OUTPUT_DIRECTORY,
    APIArgs,
    APIConfigCreator,
    SparsificationTrainingConfig,
)


@pytest.mark.parametrize(
    "api_config,expected_sparsification_config",
    [
        # YOLOv5
        (
            # task, dataset only
            APIArgs(task="object_detection", dataset="/path/to/dataset"),
            SparsificationTrainingConfig(
                task="object_detection",
                dataset="/path/to/dataset",
                base_model=(
                    "zoo:cv/detection/yolov5-l/pytorch/ultralytics/coco/"
                    "pruned_quant-aggressive_95?recipe_type=transfer"
                ),
                save_directory=DEFAULT_OUTPUT_DIRECTORY,
                recipe=(
                    "zoo:cv/detection/yolov5-l/pytorch/ultralytics/coco/"
                    "pruned_quant-aggressive_95?recipe_type=transfer"
                ),
            ),
        ),
        (
            # local model + kwargs
            APIArgs(
                task="object_detection",
                dataset="/path/to/dataset",
                base_model="/path/to/local/model",
                kwargs={"fp16": False},
            ),
            SparsificationTrainingConfig(
                task="object_detection",
                dataset="/path/to/dataset",
                base_model="/path/to/local/model",
                save_directory=DEFAULT_OUTPUT_DIRECTORY,
                recipe=(
                    "zoo:cv/detection/yolov5-l/pytorch/ultralytics/coco/"
                    "pruned_quant-aggressive_95"
                ),
                kwargs={"fp16": False},
            ),
        ),
        # Image Classification
        (
            # local model + kwargs
            APIArgs(
                task="image_classification",
                dataset="/path/to/dataset",
                base_model="/path/to/local/model",
                kwargs={"use-mixed-precision": False},
            ),
            SparsificationTrainingConfig(
                task="image_classification",
                dataset="/path/to/dataset",
                base_model="/path/to/local/model",
                save_directory=DEFAULT_OUTPUT_DIRECTORY,
                recipe=(
                    "zoo:cv/classification/resnet_v1-50/pytorch/sparseml/imagenet/"
                    "pruned90_quant-none"
                ),
                kwargs={
                    "arch_key": "resnet50",
                    "test_batch_size": 64,
                    "train_batch_size": 64,
                    "use-mixed-precision": False,
                },
            ),
        ),
        # Transformers
        (
            # local model + kwargs
            APIArgs(
                task="token_classification",
                dataset="/path/to/dataset",
                base_model="/path/to/local/model",
            ),
            SparsificationTrainingConfig(
                task="token_classification",
                dataset="/path/to/dataset",
                base_model="/path/to/local/model",
                distill_teacher="/path/to/local/model",
                save_directory=DEFAULT_OUTPUT_DIRECTORY,
                recipe=(
                    "zoo:nlp/token_classification/bert-base/pytorch/huggingface/"
                    "conll2003/12layer_pruned80_quant-none-vnni"
                ),
            ),
        ),
        (
            # task, dataset only
            APIArgs(task="question_answering", dataset="/path/to/dataset"),
            SparsificationTrainingConfig(
                task="question_answering",
                dataset="/path/to/dataset",
                base_model=(
                    "zoo:nlp/masked_language_modeling/bert-base/pytorch/huggingface/"
                    "wikipedia_bookcorpus/12layer_pruned80_quant-none-vnni"
                ),
                distill_teacher=(
                    "zoo:nlp/masked_language_modeling/bert-base/pytorch/huggingface/"
                    "wikipedia_bookcorpus/12layer_pruned80_quant-none-vnni"
                ),
                save_directory=DEFAULT_OUTPUT_DIRECTORY,
                recipe=(
                    "zoo:nlp/masked_language_modeling/bert-base/pytorch/huggingface/"
                    "wikipedia_bookcorpus/12layer_pruned80_quant-none-vnni"
                    "?recipe_type=transfer-question_answering"
                ),
            ),
        ),
        # Transformers
        (
            # local model + kwargs
            APIArgs(
                task="token_classification",
                dataset="/path/to/dataset",
                base_model="/path/to/local/model",
            ),
            SparsificationTrainingConfig(
                task="token_classification",
                dataset="/path/to/dataset",
                base_model="/path/to/local/model",
                distill_teacher="/path/to/local/model",
                save_directory=DEFAULT_OUTPUT_DIRECTORY,
                recipe=(
                    "zoo:nlp/token_classification/bert-base/pytorch/huggingface/"
                    "conll2003/12layer_pruned80_quant-none-vnni"
                ),
            ),
        ),
        (
            # task, dataset only
            APIArgs(task="question_answering", dataset="/path/to/dataset"),
            SparsificationTrainingConfig(
                task="question_answering",
                dataset="/path/to/dataset",
                base_model=(
                    "zoo:nlp/masked_language_modeling/bert-base/pytorch/huggingface/"
                    "wikipedia_bookcorpus/12layer_pruned80_quant-none-vnni"
                ),
                distill_teacher=(
                    "zoo:nlp/masked_language_modeling/bert-base/pytorch/huggingface/"
                    "wikipedia_bookcorpus/12layer_pruned80_quant-none-vnni"
                ),
                save_directory=DEFAULT_OUTPUT_DIRECTORY,
                recipe=(
                    "zoo:nlp/masked_language_modeling/bert-base/pytorch/huggingface/"
                    "wikipedia_bookcorpus/12layer_pruned80_quant-none-vnni"
                    "?recipe_type=transfer-question_answering"
                ),
            ),
        ),
    ],
)
def test_api_config_creator(api_config, expected_sparsification_config):
    generated_sparsification_config = APIConfigCreator.get_config(api_config)

    assert isinstance(generated_sparsification_config, SparsificationTrainingConfig)
    assert generated_sparsification_config.task == expected_sparsification_config.task
    assert generated_sparsification_config.dataset == (
        expected_sparsification_config.dataset
    )
    assert generated_sparsification_config.base_model == (
        expected_sparsification_config.base_model
    )
    assert generated_sparsification_config.save_directory == (
        expected_sparsification_config.save_directory
    )
    assert generated_sparsification_config.distill_teacher == (
        expected_sparsification_config.distill_teacher
    )
    assert generated_sparsification_config.recipe == (
        expected_sparsification_config.recipe
    )
    assert generated_sparsification_config.recipe_args == (
        expected_sparsification_config.recipe_args
    )
    assert generated_sparsification_config.kwargs == (
        expected_sparsification_config.kwargs
    )
