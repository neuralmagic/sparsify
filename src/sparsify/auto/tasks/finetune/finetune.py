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
import os
from enum import Enum
from pathlib import Path
from typing import Dict, Tuple, Union

import torch
from torch.utils.data import DataLoader

import click
from composer import Trainer
from composer.core import Evaluator
from composer.models import HuggingFaceModel
from composer.utils import dist, get_device, reproducibility
from llmfoundry import (
    COMPOSER_MODEL_REGISTRY,
    build_finetuning_dataloader,
    build_text_denoising_dataloader,
)
from llmfoundry.data.text_data import build_text_dataloader
from llmfoundry.utils.builders import (
    build_logger,
    build_optimizer,
    build_scheduler,
    build_tokenizer,
)
from llmfoundry.utils.config_utils import update_batch_size_info
from omegaconf import DictConfig
from omegaconf import OmegaConf as om
from sparsify.auto.tasks.finetune.helpers import MaskPrunedWeights, attach_masks
from transformers import PreTrainedTokenizerBase


__all__ = ["FineTuner"]

TEXT_DENOISING_MODELS = ["hf_prefix_lm", "hf_t5"]
TEXT_MODELS = ["hf_causal_lm"]

_LOGGER = logging.getLogger(__name__)
_LOGGER.setLevel(logging.INFO)


class LLMDataTypes(Enum):
    TEXT = "text"
    TEXT_DENOISING = "text_denoising"
    FINETUNING = "finetuning"


class FineTuner:

    """
    LLMFinetuner which allows finetuning of LLM Models using llmfoundry. Finetuning is
    heavily dependent on providing a llmfoundary-compliant yaml file which sets up
    the training, including which pretrained model to pull as well as the data that is
    to be used for finetuning. Please see the example yaml under samples or the
    llmfoundry repo for additional examples:
    https://github.com/mosaicml/llm-foundry/blob/main/scripts/train/finetune_example/
    """

    def __init__(
        self,
        dataset_path: Union[str, Path],
        train_directory: Union[str, Path],
        log_dir: Union[str, Path],
    ) -> None:
        """
        :param dataset_path: path to the llmfoundry compliant yaml file
        :param train_directory: path to log the checkpoints for the model
        :param log_dir: path to store the specified logger (such as tensorboard)

        """
        if os.path.exists(dataset_path):
            if Path(dataset_path).suffix not in [".yaml", ".yml"]:
                raise RuntimeError(
                    "LLMFinetuner expects a yaml file compliant with llmfoundry."
                )
            with open(dataset_path) as yaml_file:
                self._train_config = om.load(yaml_file)
        else:
            raise FileNotFoundError(
                f"{dataset_path} does not exist. Plase ensure "
                " the yaml file exists and the path provided is correct."
            )

        if self._train_config.get("loggers"):
            for _, log_config in self._train_config["loggers"].items():
                if "log_dir" in log_config:
                    log_config["log_dir"] = os.path.join(log_dir, log_config["log_dir"])
                else:
                    log_config["log_dir"] = log_dir

        self._train_config.save_folder = os.path.join(
            train_directory, Path(self._train_config.save_folder)
        )
        self._model_name = self._train_config["model"]["name"]
        self._validate_yaml()

    @property
    def model_name(self) -> str:
        """
        :return: model name for the LLM
        """
        return self._model_name

    def _validate_yaml(self):
        """
        Validate that the provided yaml is compatible with llmfoundry.
        """
        if not self._train_config.get("train_loader"):
            raise ValueError(
                "the provided config file is missing details on the train_loader"
            )

        data_loaders = [self._train_config.get("train_loader")]
        if self._train_config.get("eval_loader"):
            data_loaders.append(self._train_config.get("eval_loader"))

        for loader in data_loaders:
            if loader["name"] == LLMDataTypes.TEXT.value:
                if self.model_name in TEXT_DENOISING_MODELS:
                    raise ValueError(
                        f"Model type {self.model_name} is not supported "
                        " for text dataloaders. Please use the "
                        " text_denoising dataloader."
                    )
            elif loader["name"] == LLMDataTypes.TEXT_DENOISING.value:
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
        if self.model_name not in COMPOSER_MODEL_REGISTRY:
            raise ValueError(
                "Please ensure the model name provided is one of "
                f" {list(COMPOSER_MODEL_REGISTRY.keys())}"
            )
        return COMPOSER_MODEL_REGISTRY[self.model_name](
            self._train_config.model, tokenizer
        )

    def _load_weights_and_attach_masks(
        self, tokenizer: PreTrainedTokenizerBase
    ) -> Tuple[torch.nn.Module, Union[None, "MaskPrunedWeights"]]:
        """
        If a load_path is provided, attempt to load in weights from the specified
        location. Because the mask may be sparse, attach masks, masking where the
        weights have already been pruned.

        :return: tuple including the model with weights loaded from the `load_path`
        and with buffers attached for pruning masks. Also returns the MaskPrunedWeights
        algorithm.
        """
        model = self._build_model(tokenizer)
        try:
            model.load_state_dict(
                torch.load(self._train_config.get("load_path"), map_location="cpu")[
                    "state"
                ]["model"],
                strict=True,
            )
        except Exception as e:
            _LOGGER.error(f" Failed to load weights. Returning pretrained model {e}")
            if self._train_config.model.pretrained is False:
                self._train_config.model.pretrained = True
                model = self._build_model(tokenizer)
            return model, None

        attach_masks(model)
        return model, MaskPrunedWeights()

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
        if dataloader_config.name == LLMDataTypes.TEXT.value:
            return build_text_dataloader(
                dataloader_config,
                tokenizer,
                device_batch_size,
            )
        elif dataloader_config.name == LLMDataTypes.TEXT_DENOISING.value:
            return build_text_denoising_dataloader(
                dataloader_config,
                tokenizer,
                device_batch_size,
            )
        elif dataloader_config.name == LLMDataTypes.FINETUNING.value:
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
        fsdp_config = self._train_config.get("fsdp_config", None)
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
        reproducibility.seed_all(self._train_config.seed)
        if dist.get_world_size() > 1:
            dist.initialize_dist(get_device(None))

        self._train_config = update_batch_size_info(self._train_config)

        tokenizer = build_tokenizer(self._train_config.tokenizer)

        algorithms = []
        # If a load_path is provided, try loading weights from the provided path
        if self._train_config.get("load_path"):
            self._train_config.model.pretrained = False
        else:
            self._train_config.model.pretrained = True

        model, algorithm = self._load_weights_and_attach_masks(tokenizer)
        if algorithm:
            algorithms.append(algorithm)

        optimizer = build_optimizer(self._train_config.optimizer, model)
        scheduler = build_scheduler(self._train_config.scheduler)

        loggers = [
            build_logger(name, logger_cfg)
            for name, logger_cfg in (self._train_config.get("loggers") or {}).items()
        ]

        train_loader = self._build_dataloaders(
            self._train_config.train_loader,
            tokenizer,
            self._train_config.device_train_batch_size,
        )
        eval_loader = Evaluator(
            label="eval",
            dataloader=self._build_dataloaders(
                self._train_config.eval_loader,
                tokenizer,
                self._train_config.device_eval_batch_size,
            ),
            metric_names=list(model.train_metrics.keys()),
        )

        trainer = Trainer(
            run_name=self._train_config.run_name,
            model=model,
            train_dataloader=train_loader,
            eval_dataloader=[eval_loader],
            optimizers=optimizer,
            schedulers=scheduler,
            loggers=loggers,
            algorithms=algorithms,
            max_duration=self._train_config.max_duration,
            eval_interval=self._train_config.eval_interval,
            precision=self._train_config.precision,
            fsdp_config=self._get_fsdp_config(),
            save_folder=self._train_config.save_folder,
            eval_subset_num_batches=self._train_config.get(
                "eval_subset_num_batches", -1
            ),
            log_to_console=self._train_config.get("log_to_console", False),
            progress_bar=self._train_config.get("progress_bar", True),
            console_log_interval=self._train_config.get("console_log_interval", "1ba"),
            device_train_microbatch_size=self._train_config.get(
                "device_train_microbatch_size", "auto"
            ),
            save_filename=self._train_config.get(
                "save_filename", "ep{epoch}-ba{batch}-rank{rank}.pt"
            ),
            save_latest_filename=self._train_config.get(
                "save_latest_filename", "latest-rank{rank}.pt"
            ),
            save_interval=self._train_config.get("save_interval", "1000ba"),
            save_num_checkpoints_to_keep=self._train_config.get(
                "save_num_checkpoints_to_keep", 1
            ),
            save_overwrite=self._train_config.get("save_overwrite", False),
            autoresume=self._train_config.get("autoresume", False),
            dist_timeout=self._train_config.get("dist_timeout", 600.0),
        )
        return trainer

    def fine_tune(self):
        """
        Run finetuning using the trainer object. Finetuned models will be checkpointed
        to the coonfigured directory.
        """
        trainer = self._build_trainer()
        trainer.fit()


@click.command()
@click.option("--yaml", default=None, type=str, help="Path to the training yaml")
@click.option(
    "--checkpoints",
    default=None,
    type=str,
    help="Path to directory to store checkpoints",
)
@click.option("--logging", default=None, type=str, help="Path to store log")
def parse_args_and_run(
    yaml: Union[str, Path],
    checkpoints: Union[str, Path],
    logging: Union[str, Path],
):
    """
    Serves as the entrypoint for ddp LLM finetuning.

    :param yaml: path to the llmfoundry compliant yaml file
    :param checkpoints: path to log the checkpoints for the model
    :param logging: path to store the specified logger (such as tensorboard)
    """
    finetuner = FineTuner(yaml, checkpoints, logging)
    finetuner.fine_tune()


# train_hook
def main(**kwargs):
    finetuner = FineTuner(kwargs["yaml"], kwargs["checkpoints"], kwargs["logging"])
    finetuner.fine_tune()
