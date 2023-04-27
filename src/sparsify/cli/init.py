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

from typing import Optional

import click
from sparsezoo.analyze.cli import CONTEXT_SETTINGS
from sparsify.cli import opts


@click.command(context_settings=CONTEXT_SETTINGS)
@opts.EXPERIMENT_TYPE
@opts.add_info_opts
@click.option("--model", required=True, help="Path to model")
@opts.add_data_opts
def main(
    experiment_id: Optional[str],
    experiment_type: Optional[str],
    use_case: Optional[str],
    **kwargs,
):
    """
    Sparsify.init CLI utility to initialize an experiment such that it will
    provision all local and cloud resources necessary, additionally also allows
    users to update hyper-param(s) before applying
    """
    if experiment_id is None:
        if experiment_type is None:
            raise ValueError(
                "--experiment-type required when --experiment-id is not specified."
            )
        if use_case is None:
            raise ValueError(
                "--use-case required when --experiment-id is not specified."
            )


if __name__ == "__main__":
    main()
