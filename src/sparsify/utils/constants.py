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

from collections import namedtuple


__all__ = [
    "METRICS",
    "DEPLOYMENT_SCENARIOS",
    "TASKS",
    "TASK_REGISTRY",
    "TaskInfo",
    "DATASET_REGISTRY",
    "DATASETS",
]

TaskInfo = namedtuple("TaskInfo", "domain, subdomain")

METRICS = [
    "accuracy",
    "f1",
    "recall",
    "mAP",
    "compression",
    "latency",
    "file_size",
    "memory_usage",
]

DEPLOYMENT_SCENARIOS = [
    "VNNI",
    "NO_VNNI",
]

TASK_REGISTRY = {
    "ic": TaskInfo(domain="cv", subdomain="classification"),
    "image-classification": TaskInfo(domain="cv", subdomain="classification"),
    "image_classification": TaskInfo(domain="cv", subdomain="classification"),
    "classification": TaskInfo(domain="cv", subdomain="classification"),
    "od": TaskInfo(domain="cv", subdomain="detection"),
    "object-detection": TaskInfo(domain="cv", subdomain="detection"),
    "object_detection": TaskInfo(domain="cv", subdomain="detection"),
    "detection": TaskInfo(domain="cv", subdomain="detection"),
    "segmentation": TaskInfo(domain="cv", subdomain="segmentation"),
    "qa": TaskInfo(domain="nlp", subdomain="question_answering"),
    "question-answering": TaskInfo(domain="nlp", subdomain="question_answering"),
    "question_answering": TaskInfo(domain="nlp", subdomain="question_answering"),
    "text-classification": TaskInfo(domain="nlp", subdomain="text_classification"),
    "text_classification": TaskInfo(domain="nlp", subdomain="text_classification"),
    "glue": TaskInfo(domain="nlp", subdomain="text_classification"),
    "sentiment": TaskInfo(domain="nlp", subdomain="sentiment_analysis"),
    "sentiment_analysis": TaskInfo(domain="nlp", subdomain="sentiment_analysis"),
    "sentiment-analysis": TaskInfo(domain="nlp", subdomain="sentiment_analysis"),
    "token-classification": TaskInfo(domain="nlp", subdomain="token_classification"),
    "token_classification": TaskInfo(domain="nlp", subdomain="token_classification"),
    "ner": TaskInfo(domain="nlp", subdomain="token_classification"),
    "named-entity-recognition": TaskInfo(
        domain="nlp", subdomain="token_classification"
    ),
    "named_entity_recognition": TaskInfo(
        domain="nlp", subdomain="token_classification"
    ),
}

DATASET_REGISTRY = {
    "imagenette": TaskInfo(domain="cv", subdomain="classification"),
    "imagenet": TaskInfo(domain="cv", subdomain="classification"),
    "coco": TaskInfo(domain="cv", subdomain="detection"),
    "squad": TaskInfo(domain="nlp", subdomain="question_answering"),
    "mnli": TaskInfo(domain="nlp", subdomain="text_classification"),
    "qqp": TaskInfo(domain="nlp", subdomain="text_classification"),
    "sst2": TaskInfo(domain="nlp", subdomain="text_classification"),
    "conll2003": TaskInfo(domain="nlp", subdomain="token_classification"),
}

TASKS = list(TASK_REGISTRY.keys())
DATASETS = list(DATASET_REGISTRY.keys())
