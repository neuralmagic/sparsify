import pytest
import os
import requests
import json
from tests.helper import (
    test_project_id,
    test_project_path,
    test_url,
    test_sample_loss,
    test_sample_perf,
    test_config_loss,
    test_config_perf,
    test_config_balanced,
    test_config_uniform,
)


def test_config_export_loss(
    test_url, test_project_id, test_project_path, test_sample_loss, test_config_loss
):
    response = requests.put(
        os.path.join(
            test_url, "projects", test_project_id, "sparse-analysis/loss/sample"
        ),
        data=json.dumps({"loss": test_sample_loss}),
        headers={"Content-Type": "application/json"},
    )

    response = requests.post(
        os.path.join(test_url, "projects", test_project_id, "config/export"),
        data=json.dumps(
            {
                "config_fields": {
                    "sparsities": [0.8, 0.85, 0.90],
                    "pruning_profile": "loss",
                    "loss_analysis": "sample",
                    "pruning_update_frequency": 1.0,
                    "training_epochs": 100,
                    "init_training_lr": 0.001,
                    "final_training_lr": 0.00001,
                }
            }
        ),
        headers={"Content-Type": "application/json"},
    )

    assert response.status_code == 200
    assert test_config_loss == response.text

    response = requests.put(
        os.path.join(test_url, "projects", test_project_id, "config/export"),
        data=json.dumps(
            {
                "config_fields": {
                    "sparsities": [0.8, 0.85, 0.90],
                    "pruning_profile": "loss",
                    "loss_analysis": "sample",
                    "pruning_update_frequency": 1.0,
                    "training_epochs": 100,
                    "init_training_lr": 0.001,
                    "final_training_lr": 0.00001,
                },
                "config_file": "recal.config.yaml",
            }
        ),
        headers={"Content-Type": "application/json"},
    )

    content = None
    with open(os.path.join(test_project_path, "recal.config.yaml")) as recal_config:
        content = recal_config.read()

    assert response.status_code == 200
    assert test_config_loss == content


def test_config_export_perf(
    test_url, test_project_id, test_project_path, test_sample_perf, test_config_perf
):
    response = requests.put(
        os.path.join(
            test_url, "projects", test_project_id, "sparse-analysis/perf/sample"
        ),
        data=json.dumps({"perf": test_sample_perf}),
        headers={"Content-Type": "application/json"},
    )

    response = requests.post(
        os.path.join(test_url, "projects", test_project_id, "config/export"),
        data=json.dumps(
            {
                "config_fields": {
                    "sparsities": [0.8, 0.85, 0.90],
                    "pruning_profile": "performance",
                    "perf_analysis": "sample",
                    "pruning_update_frequency": 1.0,
                    "training_epochs": 100,
                    "init_training_lr": 0.001,
                    "final_training_lr": 0.00001,
                }
            }
        ),
        headers={"Content-Type": "application/json"},
    )

    assert response.status_code == 200
    assert test_config_perf == response.text

    response = requests.put(
        os.path.join(test_url, "projects", test_project_id, "config/export"),
        data=json.dumps(
            {
                "config_fields": {
                    "sparsities": [0.8, 0.85, 0.90],
                    "pruning_profile": "performance",
                    "perf_analysis": "sample",
                    "pruning_update_frequency": 1.0,
                    "training_epochs": 100,
                    "init_training_lr": 0.001,
                    "final_training_lr": 0.00001,
                },
                "config_file": "recal.config.yaml",
            }
        ),
        headers={"Content-Type": "application/json"},
    )

    content = None
    with open(os.path.join(test_project_path, "recal.config.yaml")) as recal_config:
        content = recal_config.read()

    assert response.status_code == 200
    assert test_config_perf == content


def test_config_export_balanced(
    test_url,
    test_project_id,
    test_project_path,
    test_sample_loss,
    test_sample_perf,
    test_config_balanced,
):
    response = requests.put(
        os.path.join(
            test_url, "projects", test_project_id, "sparse-analysis/loss/sample"
        ),
        data=json.dumps({"loss": test_sample_loss}),
        headers={"Content-Type": "application/json"},
    )

    response = requests.put(
        os.path.join(
            test_url, "projects", test_project_id, "sparse-analysis/perf/sample"
        ),
        data=json.dumps({"perf": test_sample_perf}),
        headers={"Content-Type": "application/json"},
    )

    response = requests.post(
        os.path.join(test_url, "projects", test_project_id, "config/export"),
        data=json.dumps(
            {
                "config_fields": {
                    "sparsities": [0.8, 0.85, 0.90],
                    "pruning_profile": "balanced",
                    "loss_analysis": "sample",
                    "perf_analysis": "sample",
                    "pruning_update_frequency": 1.0,
                    "training_epochs": 100,
                    "init_training_lr": 0.001,
                    "final_training_lr": 0.00001,
                }
            }
        ),
        headers={"Content-Type": "application/json"},
    )

    assert response.status_code == 200
    assert test_config_balanced == response.text

    response = requests.put(
        os.path.join(test_url, "projects", test_project_id, "config/export"),
        data=json.dumps(
            {
                "config_fields": {
                    "sparsities": [0.8, 0.85, 0.90],
                    "pruning_profile": "balanced",
                    "loss_analysis": "sample",
                    "perf_analysis": "sample",
                    "pruning_update_frequency": 1.0,
                    "training_epochs": 100,
                    "init_training_lr": 0.001,
                    "final_training_lr": 0.00001,
                },
                "config_file": "recal.config.yaml",
            }
        ),
        headers={"Content-Type": "application/json"},
    )

    content = None
    with open(os.path.join(test_project_path, "recal.config.yaml")) as recal_config:
        content = recal_config.read()

    assert response.status_code == 200
    assert test_config_balanced == content


def test_config_export_uniform(
    test_url, test_project_id, test_project_path, test_config_uniform
):
    response = requests.post(
        os.path.join(test_url, "projects", test_project_id, "config/export"),
        data=json.dumps(
            {
                "config_fields": {
                    "sparsities": [0.8, 0.85, 0.90],
                    "pruning_profile": "uniform",
                    "pruning_update_frequency": 1.0,
                    "training_epochs": 100,
                    "init_training_lr": 0.001,
                    "final_training_lr": 0.00001,
                }
            }
        ),
        headers={"Content-Type": "application/json"},
    )

    assert response.status_code == 200
    assert test_config_uniform == response.text

    response = requests.put(
        os.path.join(test_url, "projects", test_project_id, "config/export"),
        data=json.dumps(
            {
                "config_fields": {
                    "sparsities": [0.8, 0.85, 0.90],
                    "pruning_profile": "uniform",
                    "pruning_update_frequency": 1.0,
                    "training_epochs": 100,
                    "init_training_lr": 0.001,
                    "final_training_lr": 0.00001,
                },
                "config_file": "recal.config.yaml",
            }
        ),
        headers={"Content-Type": "application/json"},
    )

    content = None
    with open(os.path.join(test_project_path, "recal.config.yaml")) as recal_config:
        content = recal_config.read()

    assert response.status_code == 200
    assert test_config_uniform == content
