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

import logging

import click
from sparseml.transformers.export import export as export_hook
from sparsify.auto.tasks.transformers import TransformersExportArgs


_LOGGER = logging.getLogger(__name__)


@click.command()
@click.option(
    "--model_path",
    default=None,
    type=str,
    help="Path to directory where model files for weights, config, and "
    "tokenizer are stored",
)
@click.option(
    "--sequence_length",
    default=384,
    type=int,
    help="Path to directory to store checkpoints",
)
@click.option(
    "--onnx_file_name",
    default="model.onnx",
    type=str,
    help="Name of the exported model",
)
def llama_export(model_path: str, sequence_length: int, onnx_file_name: str):
    export_args = TransformersExportArgs(
        task="text-generation",
        model_path=model_path,
        sequence_length=sequence_length,
        no_convert_qat=True,
        onnx_file_name=onnx_file_name,
    )
    _LOGGER.info("Exporting LLAMA model")
    export_hook(**export_args.dict())
