import pytest
import os
import requests

from tests.helper import test_project_id, test_url


def test_status(test_url):
    response = requests.get(os.path.join(test_url, "status"))
    assert response.status_code == 200
