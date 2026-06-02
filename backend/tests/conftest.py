import pytest
import os
from fastapi.testclient import TestClient

os.environ.setdefault("TESTING", "1")

from backend.main import app


@pytest.fixture(scope="function")
def client():
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()
