import json
from pathlib import Path

import pytest

from backend.api.auth import get_auth_repository
from backend.api.runs import (
    get_run_executor,
    get_run_repository,
    get_run_search_adapter,
    get_workspace_root,
)
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


class FakeSearchAdapter:
    def __init__(self, *, results=None, error: Exception | None = None):
        self.results = list(results or [])
        self.error = error
        self.calls = []

    def search(self, query: str, *, max_results: int = 3):
        self.calls.append({"query": query, "max_results": max_results})
        if self.error:
            raise self.error
        return list(self.results)


@pytest.fixture()
def run_client(client, tmp_path, monkeypatch):
    repo = SQLiteRepository.from_path(tmp_path / "runs.sqlite")
    workspace_root = tmp_path / "workspace"
    monkeypatch.delenv("MODEL_API_KEY", raising=False)
    monkeypatch.setenv("MODEL_SECRET_FILE", str(tmp_path / "missing.env"))
    app.dependency_overrides[get_auth_repository] = lambda: repo
    app.dependency_overrides[get_run_repository] = lambda: repo
    app.dependency_overrides[get_workspace_root] = lambda: str(workspace_root)
    yield client, repo, workspace_root
    app.dependency_overrides.pop(get_auth_repository, None)
    app.dependency_overrides.pop(get_run_repository, None)
    app.dependency_overrides.pop(get_workspace_root, None)
    app.dependency_overrides.pop(get_run_executor, None)
    app.dependency_overrides.pop(get_run_search_adapter, None)


def test_teacher_can_create_queued_run_and_fetch_status(run_client):
    client, repo, workspace_root = run_client
    headers = _register_and_login(client, "teacher@cuhk.edu.hk")
    calls = []

    def fake_executor(_repo, artifact_run, run, preparation):
        calls.append(run["id"])
        assert preparation.routing.resolved_intent == "code_homework"
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
    assert body["routing"]["pipeline"] == "code_homework"
    assert body["context"]["warning_level"] == "ok"
    assert body["context"]["source"] == "heuristic"
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


def test_student_can_create_queued_run(run_client):
    client, _repo, _workspace_root = run_client
    headers = _register_and_login(client, "student@link.cuhk.edu.hk")

    def fake_executor(_repo, artifact_run, _run, _preparation):
        artifact_run.write_log("generation.log", "queued by fake executor\n")
        artifact_run.write_manifest(status="queued")

    app.dependency_overrides[get_run_executor] = lambda: fake_executor

    response = client.post(
        "/api/runs",
        headers=headers,
        json={"task_text": "Write an essay.", "intent": "essay_latex", "search_mode": "off"},
    )

    assert response.status_code == 202
    assert response.json()["status"] == "queued"


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


def test_run_api_rejects_auto_intent(run_client):
    client, _repo, _workspace_root = run_client
    headers = _register_and_login(client, "teacher@cuhk.edu.hk")

    response = client.post(
        "/api/runs",
        headers=headers,
        json={"task_text": "Guess from this prompt.", "intent": "auto", "search_mode": "off"},
    )

    assert response.status_code == 400
    assert response.json()["error"]["code"] == "unsupported_intent"


def test_run_api_rejects_missing_intent(run_client):
    client, _repo, _workspace_root = run_client
    headers = _register_and_login(client, "teacher@cuhk.edu.hk")

    response = client.post(
        "/api/runs",
        headers=headers,
        json={"task_text": "Please infer the assignment type.", "search_mode": "off"},
    )

    assert response.status_code == 400
    assert response.json()["error"]["code"] == "unsupported_intent"


def test_run_api_rejects_unsupported_code_output_preference(run_client):
    client, _repo, _workspace_root = run_client
    headers = _register_and_login(client, "teacher@cuhk.edu.hk")

    response = client.post(
        "/api/runs",
        headers=headers,
        json={
            "task_text": "Write code.",
            "intent": "code_homework",
            "output_preference": "pdf",
            "search_mode": "off",
        },
    )

    assert response.status_code == 400
    body = response.json()
    assert body["error"]["code"] == "validation_error"
    assert {"field": "output_preference", "rule": "enum"} in body["error"]["fields"]


def test_search_mode_off_skips_adapter_call_and_persists_no_citations(run_client):
    client, repo, _workspace_root = run_client
    headers = _register_and_login(client, "teacher@cuhk.edu.hk")
    adapter = FakeSearchAdapter(
        results=[{"title": "Should not run", "url": "https://example.com", "snippet": "n/a"}]
    )
    app.dependency_overrides[get_run_search_adapter] = lambda: adapter

    response = client.post(
        "/api/runs",
        headers=headers,
        json={"task_text": "Write code.", "intent": "code_homework", "search_mode": "off"},
    )

    assert response.status_code == 202
    body = response.json()
    assert adapter.calls == []
    assert repo.list_citations_for_run(body["id"]) == []

    manifest_path = Path(body["output_root"]) / "manifest.json"
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    assert manifest["search"]["mode"] == "off"
    assert manifest["search"]["decision"] == "off_disabled"
    assert manifest["search"]["used"] is False
    assert manifest["search"]["citations"] == []


def test_search_mode_on_calls_adapter_and_persists_citations(run_client):
    client, repo, _workspace_root = run_client
    headers = _register_and_login(client, "teacher@cuhk.edu.hk")
    adapter = FakeSearchAdapter(
        results=[
            {
                "title": "Reference Title",
                "url": "https://example.edu/reference",
                "snippet": "Evidence snippet.",
            }
        ]
    )
    app.dependency_overrides[get_run_search_adapter] = lambda: adapter

    response = client.post(
        "/api/runs",
        headers=headers,
        json={"task_text": "Write an essay with references.", "intent": "essay_latex", "search_mode": "on"},
    )

    assert response.status_code == 202
    body = response.json()
    assert len(adapter.calls) == 1

    citations = repo.list_citations_for_run(body["id"])
    assert len(citations) == 1
    assert citations[0]["title"] == "Reference Title"
    assert citations[0]["url"] == "https://example.edu/reference"
    assert citations[0]["snippet"] == "Evidence snippet."

    manifest_path = Path(body["output_root"]) / "manifest.json"
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    assert manifest["search"]["mode"] == "on"
    assert manifest["search"]["decision"] == "forced_on"
    assert manifest["search"]["used"] is True
    assert manifest["search"]["citations"] == [
        {
            "title": "Reference Title",
            "url": "https://example.edu/reference",
            "snippet": "Evidence snippet.",
        }
    ]


def test_search_mode_auto_records_decision(run_client):
    client, _repo, _workspace_root = run_client
    headers = _register_and_login(client, "teacher@cuhk.edu.hk")
    adapter = FakeSearchAdapter(results=[])
    app.dependency_overrides[get_run_search_adapter] = lambda: adapter

    response = client.post(
        "/api/runs",
        headers=headers,
        json={
            "task_text": "Summarize key literature on this topic.",
            "intent": "essay_latex",
            "search_mode": "auto",
        },
    )

    assert response.status_code == 202
    body = response.json()
    manifest_path = Path(body["output_root"]) / "manifest.json"
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    assert manifest["search"]["mode"] == "auto"
    assert manifest["search"]["decision"] == "auto_use_search"
    assert manifest["search"]["used"] is True
    assert len(adapter.calls) == 1


def test_search_mode_on_failure_marks_run_failed(run_client):
    client, _repo, _workspace_root = run_client
    headers = _register_and_login(client, "teacher@cuhk.edu.hk")
    adapter = FakeSearchAdapter(error=RuntimeError("search provider offline"))
    app.dependency_overrides[get_run_search_adapter] = lambda: adapter

    response = client.post(
        "/api/runs",
        headers=headers,
        json={"task_text": "Need references.", "intent": "essay_latex", "search_mode": "on"},
    )

    assert response.status_code == 202
    body = response.json()
    assert body["status"] == "failed"
    assert "search_unavailable" in (body["error_message"] or "")
    assert len(adapter.calls) == 1

    manifest_path = Path(body["output_root"]) / "manifest.json"
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    assert manifest["status"] == "failed"
    assert manifest["search"]["decision"] == "forced_on_failed"
    assert manifest["search"]["used"] is False
