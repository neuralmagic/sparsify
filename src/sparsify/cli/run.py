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

import ast
import json
from pathlib import Path

import click
from sparsezoo import Model
from sparsify.check_environment import auto_checks, one_shot_checks
from sparsify.cli import opts


@click.group()
def main():
    """
    Run one of the following commands:
    1. `sparsify.run one-shot`
    2. `sparsify.run sparse-transfer`
    3. `sparsify.run training-aware`
    """
    ...


@main.command()
@opts.add_info_opts(require_known_use_case=False)
@opts.add_model_opts(require_model=True)
@opts.add_data_opts
@opts.add_deploy_opts
@opts.add_optim_opts
def one_shot(**kwargs):
    """
    One shot sparsification of ONNX models
    """
    kwargs["optim_level"] = _validate_optim_level(kwargs.get("optim_level"))

    # raises exception if sparsifyml not installed
    from sparsify.one_shot import one_shot

    one_shot_checks()

    recipe_args = kwargs.get("recipe_args")
    if isinstance(recipe_args, str):
        recipe_args = json.loads(recipe_args)

    one_shot.one_shot(
        model=Path(_maybe_unwrap_zoo_stub(kwargs["model"])),
        dataset_dir=Path(kwargs["data"]),
        num_samples=kwargs["train_samples"] or None,
        deploy_dir=Path(kwargs["working_dir"]),
        eval_metric=kwargs["eval_metric"],
        optim_level=kwargs["optim_level"],
        use_case=kwargs["use_case"],
        recipe_file=Path(kwargs["recipe"]) if kwargs["recipe"] is not None else None,
        recipe_args=recipe_args,
    )


@main.command()
@opts.add_info_opts(require_known_use_case=True)
@opts.add_model_opts(require_model=False)
@opts.add_data_opts
@opts.add_deploy_opts
@opts.add_optim_opts
@opts.add_kwarg_opts
def sparse_transfer(**kwargs):
    """
    Run sparse transfer learning for a use case against a supported task and model
    """
    kwargs["optim_level"] = _validate_optim_level(kwargs.get("optim_level"))

    from sparsify import auto

    auto_checks()

    # recipe arg should be a sparse transfer recipe
    auto.main(_parse_run_args_to_auto(sparse_transfer=True, **kwargs))


@main.command()
@opts.add_info_opts(require_known_use_case=True)
@opts.add_model_opts(require_model=True)
@opts.add_data_opts
@opts.add_deploy_opts
@opts.add_optim_opts
@opts.add_kwarg_opts
def training_aware(**kwargs):
    """
    Run training aware sparsification for a use case against a supported task and model
    """
    kwargs["optim_level"] = _validate_optim_level(kwargs.get("optim_level"))

    from sparsify import auto

    auto_checks()

    # recipe arg should be a training aware recipe
    auto.main(_parse_run_args_to_auto(sparse_transfer=False, **kwargs))


def _parse_run_args_to_auto(sparse_transfer: bool, **kwargs):
    from sparsify.schemas import APIArgs

    if kwargs["eval_metric"] == "kl":
        raise ValueError("--eval-metric kl is not supported currently.")

    recipe_args = (
        ast.literal_eval(kwargs["recipe_args"]) if kwargs["recipe_args"] else {}
    )
    train_kwargs = (
        ast.literal_eval(kwargs["train_kwargs"]) if kwargs["train_kwargs"] else {}
    )

    return APIArgs(
        task=kwargs["use_case"],
        dataset=kwargs["data"],
        save_directory=kwargs["working_dir"],
        optim_level=kwargs["optim_level"],
        base_model=kwargs["model"],
        recipe=kwargs["recipe"],
        recipe_args=recipe_args,
        distill_teacher=kwargs["teacher"] or "off",
        optimizing_metric=[kwargs["eval_metric"]],
        kwargs=train_kwargs,
        run_mode="sparse_transfer" if sparse_transfer else "training_aware",
    )


def _validate_optim_level(optim_level: float) -> float:
    """
    :param optim_level: cli ingested optim_level
    :return: optim level scaled from 0-1
    :raises ValueError: for any values that are not float 0-1 or an integer 1-100
    """
    # optim level should always be defaulted by the CLI, asserting here for safety
    assert optim_level is not None

    if 0 <= optim_level <= 1:
        return optim_level
    elif (1 < optim_level <= 100) and optim_level == int(optim_level):
        return optim_level / 100.0
    else:
        raise ValueError(
            "optim-level must be a float value between 0-1 or an integer value "
            f"between 0-100.  Found {optim_level}"
        )


def _maybe_unwrap_zoo_stub(model_path: str) -> str:
    if model_path.startswith("zoo:"):
        return Model(model_path).onnx_model.path
    return model_path


if __name__ == "__main__":
    main()
