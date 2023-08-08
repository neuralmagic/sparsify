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
from pathlib import Path
from typing import Dict, Union

from torch.utils.data import DataLoader

from composer import Trainer
from composer.core import Evaluator
from composer.models import HuggingFaceModel
from composer.utils import dist, reproducibility
from llmfoundry import (
    COMPOSER_MODEL_REGISTRY,
    build_finetuning_dataloader,
    build_text_denoising_dataloader,
)
from llmfoundry.data.text_data import build_text_dataloader
from llmfoundry.utils.builders import build_optimizer, build_scheduler, build_tokenizer
from omegaconf import DictConfig
from omegaconf import OmegaConf as om
from sparsify.schemas import APIArgs
from transformers import PreTrainedTokenizerBase


__all__ = ["LLMFinetuner"]

TEXT_DENOISING_MODELS = ["hf_prefix_lm", "hf_t5"]
TEXT_MODELS = ["hf_causal_lm"]


class LLMFinetuner:
    """
    LLMFinetuner which allows finetuning of LLM Models using llmfoundry. Finetuning is
    heavily dependent on providing a llmfoundary-compliant yaml file which sets up
    the training, including which pretrained model to pull as well as the data that is
    to be used for finetuning. Please see the example yaml under samples or the
    llmfoundry repo for additional examples:
    https://github.com/mosaicml/llm-foundry/blob/main/scripts/train/finetune_example/
    """

    def __init__(self, api_args: APIArgs) -> None:
        if os.path.exists(api_args.dataset):
            if Path(api_args.dataset).suffix not in [".yaml", ".yml"]:
                raise RuntimeError(
                    "LLMFinetuner expects a yaml file compliant with llmfoundry."
                )
            with open(api_args.dataset) as yaml_file:
                self._config = om.load(yaml_file)
        else:
            raise FileNotFoundError(
                f"{api_args.dataset} does not exist. Plase ensure "
                " the yaml file exists and the path provided is correct."
            )

        self._model_name = self._config["model"]["name"]
        self._valdiate_yaml()

    @property
    def model_name(self) -> str:
        """
        :return: model name for the LLM
        """
        return self._model_name

    def _valdiate_yaml(self):
        """
        Validate that the provided yaml is compatible with llmfoundry.
        """
        if not self._config.get("train_loader"):
            raise ValueError(
                "the provided config file is missing details on the train_loader"
            )

        data_loaders = [self._config.get("train_loader")]
        if self._config.get("eval_loader"):
            data_loaders.append(self._config.get("eval_loader"))

        for loader in data_loaders:
            if loader["name"] == "text":
                if self.model_name in TEXT_DENOISING_MODELS:
                    raise ValueError(
                        f"Model type {self.model_name} is not supported "
                        " for text dataloaders. Please use the "
                        " text_denoising dataloader."
                    )
            elif loader["name"] == "text_denoising":
                if self.model_name in TEXT_MODELS:
                    raise ValueError(
                        f"Model type {self.model_name} is not supported "
                        " for text_denoising dataloaders. Please use the "
                        " text dataloader."
                    )

    def _build_model(self, tokenizer: PreTrainedTokenizerBase) -> HuggingFaceModel:
        """
        Based on the model name, pull and return the pretrained hugging face model.

        :param tokenizer: transformers tokenizer
        :return: HuggingFaceModel from the mosaicml composer library
        """
        if not COMPOSER_MODEL_REGISTRY.get(self.model_name):
            raise ValueError(
                "Please ensure the model name provided is one of "
                f" {list(COMPOSER_MODEL_REGISTRY.keys())}"
            )
        return COMPOSER_MODEL_REGISTRY[self.model_name](self._config.model, tokenizer)

    def _build_dataloaders(
        self,
        dataloader_config: DictConfig,
        tokenizer: PreTrainedTokenizerBase,
        device_batch_size: int,
    ) -> DataLoader:
        """
        Build a torch dataloader given a DictConfig containing details about the
        dataloader, the tokenizer that is to be applied to the data, and the batch size
        for the dataloader.

        :param dataloader_config DictConfig from the omegaconf library, containing
        details on the dataloader
        :param tokenizer: transformers tokenizer
        :param device_batch_size: batch size for the dataloader
        :return: a torch DataLoader
        """
        if dataloader_config.name == "text":
            return build_text_dataloader(
                dataloader_config,
                tokenizer,
                device_batch_size,
            )
        elif dataloader_config.name == "text_denoising":
            return build_text_denoising_dataloader(
                dataloader_config,
                tokenizer,
                device_batch_size,
            )
        elif dataloader_config.name == "finetuning":
            return build_finetuning_dataloader(
                dataloader_config,
                tokenizer,
                device_batch_size,
            )

    def _get_fsdp_config(self) -> Union[Dict, None]:
        """
        Fetch the fsdp configuration. If <= one gpu devices are available, fsdp is
        turned off.

        :return: fsdp dictionary if number of cuda devices available is > one, else None
        """
        fsdp_config = self._config.get("fsdp_config", None)
        fsdp_config = (
            om.to_container(fsdp_config, resolve=True) if fsdp_config else None
        )

        if dist.get_world_size() <= 1:
            fsdp_config = None

        return fsdp_config

    def _build_trainer(self) -> Trainer:
        """
        Build the trainer object. This involves loading the pretrained model, fetching
        the tokenizer, and setting up the dataloaders, optimizer, and scheduler.

        :return: mosaicml composer Trainer object
        """
        reproducibility.seed_all(self._config.seed)

        tokenizer = build_tokenizer(self._config.tokenizer)
        model = self._build_model(tokenizer)
        optimizer = build_optimizer(self._config.optimizer, model)
        scheduler = build_scheduler(self._config.scheduler)

        train_loader = self._build_dataloaders(
            self._config.train_loader,
            tokenizer,
            self._config.device_train_batch_size,
        )
        eval_loader = Evaluator(
            label="eval",
            dataloader=self._build_dataloaders(
                self._config.eval_loader, tokenizer, self._config.device_eval_batch_size
            ),
            metric_names=list(model.train_metrics.keys()),
        )

        trainer = Trainer(
            run_name=self._config.run_name,
            model=model,
            train_dataloader=train_loader,
            eval_dataloader=[eval_loader],
            optimizers=optimizer,
            schedulers=scheduler,
            max_duration=self._config.max_duration,
            eval_interval=self._config.eval_interval,
            precision=self._config.precision,
            fsdp_config=self._get_fsdp_config(),
            eval_subset_num_batches=self._config.get("eval_subset_num_batches", -1),
            log_to_console=self._config.get("log_to_console", False),
            console_log_interval=self._config.get("console_log_interval", "1ba"),
            device_train_microbatch_size=self._config.get(
                "device_train_microbatch_size", "auto"
            ),
            save_folder=self._config.get("save_folder", None),
            save_filename=self._config.get(
                "save_filename", "ep{epoch}-ba{batch}-rank{rank}.pt"
            ),
            save_latest_filename=self._config.get(
                "save_latest_filename", "latest-rank{rank}.pt"
            ),
            save_interval=self._config.get("save_interval", "1000ba"),
            save_num_checkpoints_to_keep=self._config.get(
                "save_num_checkpoints_to_keep", 1
            ),
            save_overwrite=self._config.get("save_overwrite", False),
            autoresume=self._config.get("autoresume", False),
            dist_timeout=self._config.get("dist_timeout", 600.0),
        )
        return trainer

    def fine_tune(self):
        """
        Run finetuning using the trainer object. Finetuned models will be checkpointed
        to the coonfigured directory.
        """
        trainer = self._build_trainer()
        trainer.fit()