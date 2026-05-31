import json
from pathlib import Path

import pytest

from backend.api.auth import get_auth_repository
from backend.api.runs import get_run_executor, get_run_repository, get_workspace_root
from backend.main import app
from backend.storage.sqlite import SQLiteRepository


def _register_and_login(client, email: str) -> dict[str, str]:
    response = client.post(
        "/api/auth/register",
        json={
            "email": email,
            "password": "correct-horse",
            "confirm_password": "correct-horse",
        },
    )
    assert response.status_code == 200
    login = client.post(
        "/api/auth/login",
        json={"email": email, "password": "correct-horse"},
    )
    assert login.status_code == 200
    return {"Authorization": f"Bearer {login.json()['token']}"}


@pytest.fixture()
def run_client(client, tmp_path):
    repo = SQLiteRepository.from_path(tmp_path / "runs.sqlite")
    workspace_root = tmp_path / "workspace"
    app.dependency_overrides[get_auth_repository] = lambda: repo
    app.dependency_overrides[get_run_repository] = lambda: repo
    app.dependency_overrides[get_workspace_root] = lambda: str(workspace_root)
    yield client, repo, workspace_root
    app.dependency_overrides.pop(get_auth_repository, None)
    app.dependency_overrides.pop(get_run_repository, None)
    app.dependency_overrides.pop(get_workspace_root, None)
    app.dependency_overrides.pop(get_run_executor, None)


def test_teacher_can_create_queued_run_and_fetch_status(run_client):
    client, repo, workspace_root = run_client
    headers = _register_and_login(client, "teacher@cuhk.edu.hk")
    calls = []

    def fake_executor(_repo, artifact_run, run):
        calls.append(run["id"])
        artifact_run.write_log("generation.log", "queued by fake executor\n")
        artifact_run.write_manifest(status="queued")

    app.dependency_overrides[get_run_executor] = lambda: fake_executor

    response = client.post(
        "/api/runs",
        headers=headers,
        json={
            "task_text": "Write a Python solution.",
            "intent": "code_homework",
            "output_preference": "py",
            "search_mode": "off",
            "upload_ids": [],
            "options": {},
        },
    )

    assert response.status_code == 202
    body = response.json()
    assert body["status"] == "queued"
    assert body["intent"] == "code_homework"
    assert calls == [body["id"]]

    run = repo.get_run(body["id"])
    assert run["task_text"] == "Write a Python solution."
    output_root = Path(body["output_root"])
    assert output_root.is_relative_to(workspace_root)
    assert (output_root / "input" / "task.md").exists()
    manifest = json.loads((output_root / "manifest.json").read_text(encoding="utf-8"))
    assert manifest["status"] == "queued"

    status = client.get(f"/api/runs/{body['id']}", headers=headers)
    assert status.status_code == 200
    assert status.json()["id"] == body["id"]
    assert status.json()["status"] == "queued"


def test_run_api_rejects_missing_token(run_client):
    client, _repo, _workspace_root = run_client

    response = client.post(
        "/api/runs",
        json={"task_text": "Write code.", "intent": "code_homework", "search_mode": "off"},
    )

    assert response.status_code == 401
    assert response.json()["error"]["code"] == "unauthorized"


def test_run_api_rejects_student_generation(run_client):
    client, _repo, _workspace_root = run_client
    headers = _register_and_login(client, "student@link.cuhk.edu.hk")

    response = client.post(
        "/api/runs",
        headers=headers,
        json={"task_text": "Write code.", "intent": "code_homework", "search_mode": "off"},
    )

    assert response.status_code == 403
    assert response.json()["error"]["code"] == "forbidden"


def test_run_api_validates_contract_fields(run_client):
    client, _repo, _workspace_root = run_client
    headers = _register_and_login(client, "teacher@cuhk.edu.hk")

    response = client.post(
        "/api/runs",
        headers=headers,
        json={"task_text": "Compress slides.", "intent": "cheat_sheet", "search_mode": "auto"},
    )

    assert response.status_code == 400
    body = response.json()
    assert body["error"]["code"] == "validation_error"
    assert {"field": "options.target_pages", "rule": "required"} in body["error"]["fields"]
