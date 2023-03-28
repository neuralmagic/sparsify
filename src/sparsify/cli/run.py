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

from pathlib import Path

import click
from sparsify.cli import opts


@click.group()
def main():
    """
    TODO
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

    one_shot.one_shot(
        task=kwargs["use_case"],
        model_file=Path(kwargs["model"]),
        dataset_dir=Path(kwargs["data"]),
        num_samples=kwargs["train_samples"] or -1,
        deploy_dir=Path(kwargs["working_dir"]),
        eval_metric=kwargs["eval_metric"],
        opt_level=kwargs["optim_level"],
        recipe_file=Path(kwargs["recipe"]) if kwargs["recipe"] is not None else None,
    )


@main.command()
@opts.add_info_opts
@opts.add_model_opts(require_model=False, require_optimizer=True)
@opts.add_data_opts
@opts.add_deploy_opts
@opts.add_optim_opts
def sparse_transfer(**kwargs):
    """
    TODO
    """
    ...


@main.command()
@opts.add_info_opts
@opts.add_model_opts(require_model=False, require_optimizer=True)
@opts.add_data_opts
@opts.add_deploy_opts
@opts.add_optim_opts
def training_aware(**kwargs):
    """
    TODO
    """
    ...


if __name__ == "__main__":
    main()
