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


from sparsify.auto import USER_OUT_DIRECTORY
from sparsify.auto.configs import SparsificationTrainingConfig


def test_serialize_sparsificaiton_config_yaml():
    task = "question-answering"
    model_path = (
        "zoo:nlp/masked_language_modeling/bert-base/pytorch/huggingface/"
        "wikipedia_bookcorpus/base-none"
    )
    data_path = "path/to/data"
    recipe = (
        "zoo:nlp/masked_language_modeling/bert-base/pytorch/huggingface/"
        "wikipedia_bookcorpus/base-none"
    )
    recipe_args = dict(pruning_params=["*.encoder", "*.classifier"])
    distill_teacher = (
        "zoo:nlp/question_answering/bert-base/pytorch/huggingface/squad/base-none"
    )
    kwargs = dict(sample_arg="sample")

    sparsification_config_obj = SparsificationTrainingConfig(
        task=task,
        base_model=model_path,
        dataset=data_path,
        save_directory=USER_OUT_DIRECTORY,
        recipe=recipe,
        recipe_args=recipe_args,
        distill_teacher=distill_teacher,
        kwargs=kwargs,
    )
    sparsification_config_yaml = sparsification_config_obj.yaml()
    sparsification_config_reloaded = SparsificationTrainingConfig.from_yaml(
        sparsification_config_yaml
    )

    assert isinstance(sparsification_config_yaml, str)
    assert isinstance(sparsification_config_reloaded, SparsificationTrainingConfig)

    assert sparsification_config_obj.task == sparsification_config_reloaded.task == task
    assert (
        sparsification_config_obj.base_model
        == sparsification_config_reloaded.base_model
        == model_path
    )
    assert (
        sparsification_config_obj.dataset
        == sparsification_config_reloaded.dataset
        == data_path
    )
    assert (
        sparsification_config_obj.save_directory
        == sparsification_config_reloaded.save_directory
        == USER_OUT_DIRECTORY
    )
    assert (
        sparsification_config_obj.recipe
        == sparsification_config_reloaded.recipe
        == recipe
    )
    assert (
        sparsification_config_obj.recipe_args
        == sparsification_config_reloaded.recipe_args
        == recipe_args
    )
    assert (
        sparsification_config_obj.distill_teacher
        == sparsification_config_reloaded.distill_teacher
        == distill_teacher
    )
    assert (
        sparsification_config_obj.kwargs
        == sparsification_config_reloaded.kwargs
        == kwargs
    )
