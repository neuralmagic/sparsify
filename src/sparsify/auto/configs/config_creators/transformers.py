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
APIConfigCreator to create sparsification configs for transformers runs
"""

from abc import abstractmethod
from typing import List

from sparsezoo import Model
from sparsify.auto.api import Metrics
from sparsify.auto.configs import APIConfigCreator
from sparsify.auto.configs.config_creators.helpers import (
    maybe_add_stub_arg,
    select_best_recipe_type,
)
from sparsify.auto.configs.sparsification_training_config import (
    SparsificationTrainingConfig,
)


__all__ = [
    "TextClassificationAPIConfigCreator",
    "TokenClassificationAPIConfigCreator",
    "TransformersAPIConfigCreator",
    "QuestionAnsweringAPIConfigCreator",
]


class TransformersAPIConfigCreator(APIConfigCreator):
    @staticmethod
    def update_hyperparameters(
        config: SparsificationTrainingConfig, metrics: Metrics
    ) -> SparsificationTrainingConfig:
        """
        Use metrics to tune training hyperparameters for improved results
        """
        return config

    @staticmethod
    def metrics_satisfied(
        config: SparsificationTrainingConfig, metrics: Metrics
    ) -> bool:
        """
        Check if run metrics meet the expected level for this config
        """
        return True

    def _set_base_model(self):
        """
        Sets config base model to the given value from API args or defaults to
        a pruned quantized transfer learning model run otherwise
        """
        if self.api_args.base_model:
            base_model = self.api_args.base_model
        else:
            # default to sparse transfer learn from pruned quantized model
            base_model = self._select_transfer_teacher_stub()
        self.config_args["base_model"] = base_model
        self.config_args["distill_teacher"] = base_model

    def _set_recipe(self):
        """
        Sets config recipe to the given value from API args. If not present and
        model is set to a SparseZoo stub, selects a full or transfer learning recipe
        from the sparsezoo. If model is not a SparseZoo stub (ie local file), defaults
        to a full pruning + quantization recipe from the zoo
        """
        if self.config_args["base_model"].startswith("zoo:"):
            # model from sparsezoo, infer if transfer learning or
            # base recipe should be used
            stub = self.config_args["base_model"]
            if "recipe_type=" not in stub:
                # recipe type not specified by model stub - infer from available
                recipe_types = Model(stub).recipes.available
                target_recipe_type = select_best_recipe_type(
                    recipe_types, ["transfer", "original"]
                )
                stub = maybe_add_stub_arg(stub, "recipe_type", target_recipe_type)
            recipe = stub
        else:
            # default to assume full sparsification run using recipe from zoo
            recipe = self._select_full_sparsification_recipe_stub()
        self.config_args["recipe"] = recipe

    @abstractmethod
    def _select_full_sparsification_recipe_stub(self) -> str:
        raise NotImplementedError()

    def _select_transfer_teacher_stub(self) -> str:
        return (
            "zoo:nlp/masked_language_modeling/bert-base/pytorch/huggingface/"
            "wikipedia_bookcorpus/12layer_pruned80_quant-none-vnni"
        )

    def _select_best_recipe_type(self, recipe_types: List[str]) -> str:
        # allow for override of recipe type priorities by task (ie for dataset)
        return select_best_recipe_type(recipe_types, ["transfer", "original"])


@APIConfigCreator.register(task="text_classification")
class TextClassificationAPIConfigCreator(TransformersAPIConfigCreator):
    def _select_full_sparsification_recipe_stub(self) -> str:
        # TODO: placeholder - using QA recipe because there is currently
        #       no 12 layer pruned quantized bert in the Zoo
        return (
            "zoo:nlp/question_answering/bert-base/pytorch/huggingface/"
            "squad/12layer_pruned80_quant-none-vnni"
        )

    def _select_best_recipe_type(self, recipe_types: List[str]) -> str:
        # allow for override of recipe type priorities by task (ie for dataset)
        return select_best_recipe_type(
            recipe_types, ["transfer-text_classification", "transfer", "original"]
        )


@APIConfigCreator.register(task="token_classification")
class TokenClassificationAPIConfigCreator(TransformersAPIConfigCreator):
    def _select_full_sparsification_recipe_stub(self) -> str:
        return (
            "zoo:nlp/token_classification/bert-base/pytorch/huggingface/"
            "conll2003/12layer_pruned80_quant-none-vnni"
        )

    def _select_best_recipe_type(self, recipe_types: List[str]) -> str:
        # allow for override of recipe type priorities by task (ie for dataset)
        return select_best_recipe_type(
            recipe_types, ["transfer-token_classification", "transfer", "original"]
        )


@APIConfigCreator.register(task="question_answering")
class QuestionAnsweringAPIConfigCreator(TransformersAPIConfigCreator):
    def _select_full_sparsification_recipe_stub(self) -> str:
        return (
            "zoo:nlp/question_answering/bert-base/pytorch/huggingface/"
            "squad/12layer_pruned80_quant-none-vnni"
        )

    def _select_best_recipe_type(self, recipe_types: List[str]) -> str:
        # allow for override of recipe type priorities by task (ie for dataset)
        return select_best_recipe_type(
            recipe_types, ["transfer-question_answering", "transfer", "original"]
        )
