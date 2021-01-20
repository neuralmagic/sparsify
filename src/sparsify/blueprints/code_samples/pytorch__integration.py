import math

from sparseml.pytorch.optim import ScheduledModifierManager, ScheduledOptimizer
from sparseml.pytorch.utils import PythonLogger, TensorBoardLogger


manager = ScheduledModifierManager.from_yaml("/PATH/TO/config.yaml")
optimizer = ScheduledOptimizer(
    optimizer,
    MODEL,
    manager,
    steps_per_epoch=math.ceil(len(TRAIN_DATASET) / TRAIN_BATCH_SIZE),
    loggers=[TensorBoardLogger(), PythonLogger()],
)
