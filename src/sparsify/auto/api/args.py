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

import os
from typing import Any, Dict, Optional

from pydantic import BaseModel, Field
from sparsify.utils import BaseCLIArgs


__all__ = ["APIArgs", "Metrics", "APIOutput", "USER_OUT_DIRECTORY"]

USER_OUT_DIRECTORY = "./output"


class APIArgs(BaseCLIArgs):
    """
    Class containing the front-end arguments for Sparsify.Auto
    """

    dataset: str = Field(
        title="dataset",
        description="path to dataset to train on",
    )
    save_directory: str = Field(
        title="save_directory",
        description="Absolute path to save directory",
        default=USER_OUT_DIRECTORY,
    )
    base_model: Optional[str] = Field(
        title="base_model",
        default=None,
        description="path to base model to begin sparsification from",
    )
    recipe: Optional[str] = Field(
        title="recipe",
        default=None,
        description="file path to or zoo stub of sparsification recipe to be applied",
    )
    recipe_args: Optional[Dict[str, Any]] = Field(
        title="recipe_args",
        description="keyword args to override recipe variables with",
        default_factory=dict,
    )
    distill_teacher: Optional[str] = Field(
        title="distil_teacher",
        description="optional path to a distillation teacher model for training",
        default=None,
    )
    max_train_time: float = Field(
        title="max_train_time",
        description=(
            "Maximum number of hours to train before returning best trained "
            "model. At least one model will be trained in a given run regardless of "
            "the maximum train time set here."
        ),
        default=12.0,
    )
    kwargs: Optional[Dict[str, Any]] = Field(
        title="kwargs",
        description="optional task specific arguments to add to config",
        default_factory=dict,
    )


class Metrics(BaseModel):
    """
    Class containing metrics for a trained model. Contains all information needed to
    determine run quality by the config creator.
    """

    accuracy: Dict[str, float] = (
        Field(description="Model accuracy on validation set"),
    )
    recovery: Optional[float] = Field(
        description="model accuracy as a percentage of the dense model's accuracy",
        default=None,
    )

    @property
    def display_string(self) -> str:
        """
        :return: string representation of metrics values
        """
        string_body = "\n".join(
            [f"{metric}: {value}" for metric, value in self.accuracy.items()]
        )
        return f"Post-training metrics:\n{string_body}\n"


class APIOutput(BaseModel):
    """
    Class containing Sparsify.Auto output information
    """

    config: BaseModel = Field("config used to train model")
    metrics: Metrics = Field(description="Post-training metrics")
    model_directory: str = Field(
        description=(
            "path to SparseZoo compatible model directory generated integration run"
        )
    )
    deployment_directory: str = Field(
        description="Pipeline compatible deployment directory"
    )
    train_time: Optional[float] = Field(
        description="Total train time, including hyperparameter tuning", default=None
    )

    def finalize(self):
        """
        :return: string detailed text of results, results are also written to
            results.txt in the `model_directory`
        """
        output_string = self.output_string
        with open(os.path.join(self.model_directory, "results.txt"), "w") as f:
            f.write(output_string)
        return output_string

    @property
    def output_string(self) -> str:
        """
        :return: detailed text summarizing run results
        """
        return (
            "-------------------- Sparsify.Auto Results --------------------\n"
            f"Finished training {self.config.task} model on your dataset.\n"
            "\n"
            f"{self.metrics.display_string}"
            "\n"
            "You can find your sparsified model and everything you need to deploy "
            f"in {self.model_directory}\n"
        )
