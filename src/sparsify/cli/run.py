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
from pathlib import Path

import click
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
@opts.add_info_opts
@opts.add_model_opts(require_model=True, require_optimizer=False)
@opts.add_data_opts
@opts.add_deploy_opts
@opts.add_optim_opts
def one_shot(**kwargs):
    """
    One shot sparsification of ONNX models
    """
    # raises exception if sparsifyml not installed
    from sparsify.one_shot import one_shot

    recipe_args = kwargs.get("recipe_args")
    if isinstance(recipe_args, str):
        recipe_args = json.loads(recipe_args)

    one_shot.one_shot(
        task=kwargs["use_case"],
        model_file=Path(kwargs["model"]),
        dataset_dir=Path(kwargs["data"]),
        num_samples=kwargs["train_samples"] or -1,
        deploy_dir=Path(kwargs["working_dir"]),
        eval_metric=kwargs["eval_metric"],
        opt_level=kwargs["optim_level"],
        recipe_file=Path(kwargs["recipe"]) if kwargs["recipe"] is not None else None,
        recipe_args=recipe_args,
    )


@main.command()
@opts.add_info_opts
@opts.add_model_opts(require_model=False, require_optimizer=True)
@opts.add_data_opts
@opts.add_deploy_opts
@opts.add_optim_opts
def sparse_transfer(**kwargs):
    """
    Run sparse transfer learning for a use case against a supported task and model
    """
    from sparsify import auto

    # recipe arg should be a sparse transfer recipe
    auto.main(_parse_run_args_to_auto(sparse_transfer=True, **kwargs))


@main.command()
@opts.add_info_opts
@opts.add_model_opts(require_model=False, require_optimizer=True)
@opts.add_data_opts
@opts.add_deploy_opts
@opts.add_optim_opts
def training_aware(**kwargs):
    """
    Run training aware sparsification for a use case against a supported task and model
    """
    from sparsify import auto

    # recipe arg should be a training aware recipe
    auto.main(_parse_run_args_to_auto(sparse_transfer=False, **kwargs))


def _parse_run_args_to_auto(sparse_transfer: bool, **kwargs):
    from sparsify.schemas import APIArgs

    if kwargs["eval_metric"] == "kl":
        raise ValueError("--eval-metric kl is not supported currently.")

    return APIArgs(
        task=kwargs["use_case"],
        dataset=kwargs["data"],
        save_directory=kwargs["working_dir"],
        optim_level=kwargs["optim_level"],
        base_model=kwargs["model"],
        recipe=kwargs["recipe"],
        recipe_args=kwargs["recipe_args"] or {},
        distill_teacher=kwargs["teacher"] or "off",
        num_trials=1,  # for now, only running 1 trial
        max_train_time=100000,  # 1 trial, so setting max time arbitrarily high
        maximum_trial_saves=1,  # 1 trial
        optimizing_metric=[kwargs["eval_metric"]],
        kwargs={},  # not yet supported
        teacher_kwargs={},
        tuning_parameters=None,
        teacher_tuning_parameters=None,
        run_mode="sparse_transfer" if sparse_transfer else "training_aware",
    )


if __name__ == "__main__":
    main()
