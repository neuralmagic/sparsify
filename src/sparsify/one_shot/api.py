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


import argparse
from pathlib import Path

from sparsezoo import Model
from sparsify.login import import_sparsifyml_authenticated
from sparsify.utils import constants


sparsifyml = import_sparsifyml_authenticated()
from sparsifyml import one_shot  # noqa: E402


__all__ = [
    "one_shot",
]

_SUPPORTED_MODEL_FORMATS = [".onnx"]


def main():
    parser = argparse.ArgumentParser(
        formatter_class=argparse.ArgumentDefaultsHelpFormatter
    )

    info = parser.add_argument_group("Project")
    info.add_argument(
        "--task",
        required=True,
        choices=sorted(constants.TASK_REGISTRY.keys()),
        help="The task this model is for",
    )
    info.add_argument(
        "--deploy-dir",
        default=None,
        type=str,
        help="Path to save the deployment ready model to",
    )

    model = parser.add_argument_group("Model")
    model.add_argument(
        "--model",
        required=True,
        type=str,
        help=(
            "Path to model file. "
            f"The following formats are supported: {_SUPPORTED_MODEL_FORMATS}"
        ),
    )
    model.add_argument(
        "--recipe", default=None, type=str, help="Recipe to override automatic recipe."
    )

    data = parser.add_argument_group("Data")
    data.add_argument(
        "--dataset", required=True, type=str, help="Path to dataset folder"
    )
    data.add_argument(
        "--num-samples",
        default=-1,
        type=int,
        help=(
            "Number of samples to use from the dataset for processing. "
            "-1 means the entire dataset."
        ),
    )
    data.add_argument(
        "--eval-metric",
        default="kl",
        choices=["kl", "accuracy", "mAP", "recall", "f1"],
        help="Metric that the model is evaluated against on the task.",
    )

    optim = parser.add_argument_group("Optimization")
    optim.add_argument(
        "--optim-level",
        default=0.5,
        type=int,
        help=(
            "Preferred tradeoff between accuracy and performance. Float value in the "
            "range [0, 1]. Default 0.5"
        ),
    )

    args = parser.parse_args()

    one_shot.one_shot(
        task=args.task,
        model_file=Path(_maybe_unwrap_zoo_stub(args.model)),
        dataset_dir=Path(args.dataset),
        num_samples=args.num_samples,
        deploy_dir=Path(args.deploy_dir),
        eval_metric=args.eval_metric,
        optim_level=args.optim_level,
        recipe_file=Path(args.recipe) if args.recipe is not None else None,
    )


def _maybe_unwrap_zoo_stub(model_path: str) -> str:
    if model_path.startswith("zoo:"):
        return Model(model_path).onnx_model.path
    return model_path


if __name__ == "__main__":
    main()
