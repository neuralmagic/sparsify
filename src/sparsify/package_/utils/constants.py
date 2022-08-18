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

__all__ = [
    "TASKS",
    "METRICS",
    "DEPLOYMENT_SCENARIOS",
]

TASKS = [
    "ic", "image-classification", "image_classification", "classification",
    "od", "object-detection", "object_detection", "detection",
    "segmentation",
    "qa", "question-answering", "question_answering",
    "text-classification", "text_classification", "glue",
    "sentiment", "sentiment_analysis", "sentiment-analysis",
    "token-classification", "token_classification",
    "ner", "named-entity-recognition", "named_entity_recognition",
]
METRICS = [
    "accuracy",
    "f1",
    "recall",
    "mAP",
    "latency",
    "file_size",
    "memory_usage",
]

DEPLOYMENT_SCENARIOS = [
    "VNNI",
]
