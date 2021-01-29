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

import math

from sparseml.tensorflow_v1.optim import (
    EXTRAS_KEY_LEARNING_RATE,
    EXTRAS_KEY_SUMMARIES,
    ScheduledModifierManager,
)
from sparseml.tensorflow_v1.utils import tf_compat


with tf_compat.Graph().as_default() as graph:
    CREATE_MODEL_GRAPH = None

    global_step = tf_compat.train.get_or_create_global_step()
    manager = ScheduledModifierManager.from_yaml("/PATH/TO/config.yaml")
    mod_ops, mod_extras = manager.create_ops(
        steps_per_epoch=math.ceil(len(TRAIN_DATASET) / TRAIN_BATCH_SIZE)
    )
    summary_ops = mod_extras[EXTRAS_KEY_SUMMARIES]
    learning_rate = mod_extras[EXTRAS_KEY_LEARNING_RATE]

    with tf_compat.Session() as sess:
        sess.run(tf_compat.global_variables_initializer())

        for epoch in range(manager.max_epochs):
            for batch in range(TRAIN_BATCH_SIZE):
                sess.run(TRAIN_OP)
                sess.run(mod_ops)
