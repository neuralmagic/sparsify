import os
import json
import pytest

from neuralmagicML.utils import RepoModel


TEST_PATH = "/tmp/recal.neuralmagic.com/test_data/"


def download_resnet_18(project_id):
    os.makedirs(TEST_PATH, exist_ok=True)
    target_path = os.path.join(TEST_PATH, project_id)
    os.makedirs(target_path)

    model = RepoModel(
        domain="cv",
        sub_domain="classification",
        architecture="resnet-v1",
        sub_architecture="18",
        dataset="imagenet",
        framework="pytorch",
        desc="base",
    )

    model.download_onnx_file(overwrite=False, save_dir=target_path)
    model.download_data_files(overwrite=False, save_dir=target_path)


@pytest.fixture
def test_project_path():
    project_id = "test_project"
    path = os.path.join(TEST_PATH, project_id)
    if os.path.exists(path):
        return path
    else:
        download_resnet_18(project_id)
        return path


@pytest.fixture
def test_project_id():
    project_id = "test_project"
    if os.path.exists(os.path.join(TEST_PATH, project_id)):
        return project_id
    else:
        download_resnet_18(project_id)
        return project_id


@pytest.fixture
def test_url():
    return "http://0.0.0.0:7890/api"


@pytest.fixture
def test_layer_info():
    with open("tests/layer_info.json") as layer_json:
        return json.load(layer_json)


@pytest.fixture
def test_sample_loss():
    with open("tests/sample_loss.json") as layer_json:
        return json.load(layer_json)


@pytest.fixture
def test_sample_perf():
    with open("tests/sample_perf.json") as layer_json:
        return json.load(layer_json)


@pytest.fixture
def test_config_loss():
    content = None
    with open("tests/test_config_loss.yaml") as yaml_file:
        content = yaml_file.read()
    return content


@pytest.fixture
def test_config_perf():
    content = None
    with open("tests/test_config_perf.yaml") as yaml_file:
        content = yaml_file.read()
    return content


@pytest.fixture
def test_config_balanced():
    content = None
    with open("tests/test_config_balanced.yaml") as yaml_file:
        content = yaml_file.read()
    return content


@pytest.fixture
def test_config_uniform():
    content = None
    with open("tests/test_config_uniform.yaml") as yaml_file:
        content = yaml_file.read()
    return content
