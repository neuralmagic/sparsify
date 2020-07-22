import pytest
import os
import requests
import json
from tests.helper import (
    test_project_id,
    test_project_path,
    test_url,
    TEST_PATH,
    test_layer_info,
    test_sample_loss,
    test_sample_perf,
)

import shutil

try:
    import neuralmagic
except ImportError:
    neuralmagic = None


def test_get_projects(test_url, test_project_id):
    response = requests.get(os.path.join(test_url, "projects"))

    found = False

    assert response.status_code == 200
    for project in response.json()["projects"]:
        found = found or project["projectId"] == test_project_id
    assert found


def test_post_projects(test_url, test_project_id, test_project_path):
    model_file = os.path.join(test_project_path, "model.onnx")
    response = requests.post(
        os.path.join(test_url, "projects"),
        data=json.dumps(
            {"modelPath": model_file, "projectConfig": {"testField": True}}
        ),
        headers={"Content-Type": "application/json"},
    )

    assert response.status_code == 200
    project = response.json()["project"]
    assert "projectId" in project
    assert "testField" in project and project["testField"]

    shutil.rmtree(os.path.join(TEST_PATH, project["projectId"]))


def test_get_project(test_url, test_project_id):
    response = requests.get(os.path.join(test_url, "projects", test_project_id),)

    assert response.status_code == 200
    project = response.json()["project"]
    assert "projectId" in project and project["projectId"] == test_project_id


def test_put_project(test_url, test_project_id):
    response = requests.put(
        os.path.join(test_url, "projects", test_project_id),
        data=json.dumps({"projectConfig": {"testField": True}}),
        headers={"Content-Type": "application/json"},
    )

    assert response.status_code == 200
    project = response.json()["project"]
    assert "projectId" in project and project["projectId"] == test_project_id
    assert "testField" in project and project["testField"]

    response = requests.put(
        os.path.join(test_url, "projects", test_project_id),
        data=json.dumps({"projectConfig": {"testField": False}}),
        headers={"Content-Type": "application/json"},
    )

    assert response.status_code == 200
    project = response.json()["project"]
    assert "projectId" in project and project["projectId"] == test_project_id
    assert "testField" in project and not project["testField"]


def test_prunable_layers(test_url, test_project_id, test_layer_info):
    response = requests.get(
        os.path.join(test_url, "projects", test_project_id, "prunable-layers"),
    )

    assert response.status_code == 200
    layers = response.json()["prunableLayers"]
    assert layers == test_layer_info


def test_loss_approx(test_url, test_project_id, test_layer_info):
    response = requests.get(
        os.path.join(
            test_url, "projects", test_project_id, "sparse-analysis/loss/approx"
        )
    )

    assert response.status_code == 200

    layer_sens = response.json()["layerSensitivities"]
    assert set([layer["id"] for layer in test_layer_info]) == set(
        [layer["id"] for layer in layer_sens]
    )
    for layer in layer_sens:
        assert layer["baseline"]["loss"] == 0
        assert layer["baseline"]["sparsity"] == 0

        layer_sparsity = sorted(layer["sparse"], key=lambda data: data["sparsity"])
        previous_loss = 0
        for data in layer_sparsity:
            assert data["sparsity"] >= 0 and data["sparsity"] <= 1
            assert data["loss"] >= previous_loss
            previous_loss = data["loss"]


def test_perf_approx(test_url, test_project_id, test_layer_info):
    response = requests.get(
        os.path.join(
            test_url, "projects", test_project_id, "sparse-analysis/perf/approx"
        )
    )

    assert response.status_code == 200

    layer_sens = response.json()["layerSensitivities"]
    assert set([layer["id"] for layer in test_layer_info]) == set(
        [layer["id"] for layer in layer_sens]
    )
    for layer in layer_sens:
        assert layer["baseline"]["timing"] is None

        layer_sparsity = sorted(layer["sparse"], key=lambda data: data["sparsity"])
        previous_flops = layer["baseline"]["flops"]
        for data in layer_sparsity:
            assert data["sparsity"] >= 0 and data["sparsity"] <= 1
            assert data["flops"] <= previous_flops
            previous_flops = data["flops"]


def test_loss(test_url, test_project_id, test_sample_loss):
    response = requests.put(
        os.path.join(
            test_url, "projects", test_project_id, "sparse-analysis/loss/sample"
        ),
        data=json.dumps({"loss": test_sample_loss}),
        headers={"Content-Type": "application/json"},
    )

    assert response.status_code == 200
    layer_sens = response.json()["layerSensitivities"]
    assert layer_sens == test_sample_loss

    response = requests.get(
        os.path.join(
            test_url, "projects", test_project_id, "sparse-analysis/loss/sample"
        )
    )

    assert response.status_code == 200
    assert layer_sens == test_sample_loss


@pytest.mark.skipif(
    os.getenv("NM_ML_SKIP_PERFBOARD_RUN", False), reason="Skipping perboard run tests",
)
def test_run_loss(test_url, test_project_id, test_sample_loss):
    response = requests.post(
        os.path.join(
            test_url, "projects", test_project_id, "sparse-analysis/loss/test"
        ),
        data=json.dumps({"loss": test_sample_loss}),
        headers={"Content-Type": "application/json"},
    )

    assert response.status_code == 200
    layer_sens = response.json()["layerSensitivities"]
    assert layer_sens == test_sample_loss


def test_perf(test_url, test_project_id, test_sample_perf):
    response = requests.put(
        os.path.join(
            test_url, "projects", test_project_id, "sparse-analysis/perf/sample"
        ),
        data=json.dumps({"perf": test_sample_perf}),
        headers={"Content-Type": "application/json"},
    )

    assert response.status_code == 200
    layer_sens = response.json()["layerSensitivities"]
    assert layer_sens == test_sample_perf

    response = requests.get(
        os.path.join(
            test_url, "projects", test_project_id, "sparse-analysis/perf/sample"
        )
    )

    assert response.status_code == 200
    assert layer_sens == test_sample_perf


@pytest.mark.skipif(
    os.getenv("NM_ML_SKIP_PERFBOARD_RUN", False) or neuralmagic is None,
    reason="Skipping perboard perf tests",
)
def test_run_perf(test_url, test_project_id, test_sample_perf):
    response = requests.post(
        os.path.join(
            test_url, "projects", test_project_id, "sparse-analysis/perf/test"
        ),
        data=json.dumps({"perf": test_sample_perf}),
        headers={"Content-Type": "application/json"},
    )

    assert response.status_code == 200
    layer_sens = response.json()["layerSensitivities"]
    assert layer_sens == test_sample_perf
