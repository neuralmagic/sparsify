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

# flake8: noqa

import os
from typing import Any, Callable, Union

from torch import Tensor
from torch.nn import Module
from torch.optim import SGD
from torch.optim.optimizer import Optimizer
from torch.utils.data import DataLoader, Dataset

from sparseml import get_main_logger
from sparseml.pytorch.optim import ScheduledModifierManager, ScheduledOptimizer
from sparseml.pytorch.utils import (
    LossWrapper,
    ModuleExporter,
    ModuleTester,
    ModuleTrainer,
    PythonLogger,
    TensorBoardLogger,
    default_device,
    model_to_device,
)
from sparseml.utils import clean_path


LOGGER = get_main_logger()


def train(
    working_dir: str,
    config_path: str,
    model: Module,
    train_dataset: Dataset,
    val_dataset: Dataset,
    batch_size: int,
    optim_const: Callable[[Module], Optimizer],
    loss: Union[LossWrapper, Callable[[Any, Any], Tensor]],
    devices: str,
):
    """
    Dataset setup
    """
    LOGGER.info("batch_size set to {}".format(batch_size))
    LOGGER.info("train_dataset set to {}".format(train_dataset))
    LOGGER.info("val_dataset set to {}".format(val_dataset))

    train_loader = DataLoader(
        train_dataset,
        batch_size=batch_size,
        shuffle=True,
        num_workers=8,
        pin_memory=True,
    )
    val_loader = DataLoader(
        val_dataset,
        batch_size=batch_size,
        shuffle=False,
        num_workers=8,
        pin_memory=True,
    )

    """
    Model, optimizer, loss setup
    """
    model_dir = clean_path(os.path.join(working_dir, "model"))
    optim = optim_const(model)

    LOGGER.info("model set to {}".format(model))
    LOGGER.info("optimizer set to {}".format(optim))
    LOGGER.info("loss set to {}".format(loss))
    LOGGER.info("devices set to {}".format(devices))

    """
    Manager and config setup
    """
    manager = ScheduledModifierManager.from_yaml(config_path)
    logs_dir = clean_path(os.path.join(working_dir, "logs"))
    loggers = [TensorBoardLogger(logs_dir), PythonLogger()]
    optim = ScheduledOptimizer(
        optim, model, manager, steps_per_epoch=len(train_loader), loggers=loggers
    )

    """
    Training and testing
    """
    model, device, device_ids = model_to_device(model, devices)
    trainer = ModuleTrainer(model, device, loss, optim, loggers=loggers)
    tester = ModuleTester(model, device, loss, loggers=loggers, log_steps=-1)

    epoch = -1
    tester.run_epoch(val_loader, epoch=epoch)

    for epoch in range(manager.max_epochs):
        LOGGER.info("starting training epoch {}".format(epoch))
        train_res = trainer.run_epoch(train_loader, epoch)
        LOGGER.info("finished training epoch {}: {}".format(epoch, train_res))
        val_res = tester.run_epoch(val_loader, epoch)
        LOGGER.info("finished validation epoch {}: {}".format(epoch, val_res))

    exporter = ModuleExporter(model, model_dir)
    exporter.export_pytorch(optim, epoch)

    for data in val_loader:
        exporter.export_onnx(data)


def train_setup():
    def _create_optim(_model: Module) -> Optimizer:
        return SGD(
            _model.parameters(),
            lr=0.1,
            momentum=0.9,
            nesterov=True,
            weight_decay=0.0001,
        )

    # fill in the appropriate values below for your training flow
    train(
        working_dir=clean_path("."),
        config_path="/PATH/TO/CONFIG.yaml",
        model=None,
        train_dataset=None,
        val_dataset=None,
        batch_size=64,
        optim_const=_create_optim,
        loss=None,
        devices=default_device(),
    )


if __name__ == "__main__":
    train_setup()
