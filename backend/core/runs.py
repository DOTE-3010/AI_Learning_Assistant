from __future__ import annotations

import uuid
from typing import Any, Callable

from backend.artifacts.filesystem import ArtifactRun, ArtifactWriter
from backend.storage.sqlite import SQLiteRepository

VALID_INTENTS = {"auto", "code_homework", "essay_latex", "beamer_slides", "cheat_sheet"}
VALID_SEARCH_MODES = {"auto", "on", "off"}

RunExecutor = Callable[[SQLiteRepository, ArtifactRun, dict[str, Any]], None]


class RunError(Exception):
    def __init__(
        self,
        status_code: int,
        code: str,
        message: str,
        fields: list[dict[str, str]] | None = None,
    ):
        self.status_code = status_code
        self.code = code
        self.message = message
        self.fields = fields or []
        super().__init__(message)


def run_error_envelope(exc: RunError) -> dict[str, object]:
    error: dict[str, object] = {"code": exc.code, "message": exc.message}
    if exc.fields:
        error["fields"] = exc.fields
    return {"error": error}


def validate_run_request(request: dict[str, Any]) -> None:
    fields: list[dict[str, str]] = []
    intent = request.get("intent", "auto")
    search_mode = request.get("search_mode", "auto")
    task_text = (request.get("task_text") or "").strip()

    if not task_text:
        fields.append({"field": "task_text", "rule": "required"})
    if intent not in VALID_INTENTS:
        raise RunError(400, "unsupported_intent", "Unsupported generation intent.")
    if search_mode not in VALID_SEARCH_MODES:
        fields.append({"field": "search_mode", "rule": "enum"})
    if intent == "cheat_sheet":
        target_pages = (request.get("options") or {}).get("target_pages")
        if not isinstance(target_pages, int) or target_pages <= 0:
            fields.append({"field": "options.target_pages", "rule": "required"})

    if fields:
        raise RunError(400, "validation_error", "Generation request validation failed.", fields)


def default_run_executor(_repo: SQLiteRepository, artifact_run: ArtifactRun, _run: dict[str, Any]) -> None:
    artifact_run.write_log(
        "generation.log",
        "Run accepted and queued. Artifact pipelines are not implemented in this skeleton.\n",
    )
    artifact_run.write_manifest(status="queued")


def create_run(
    repo: SQLiteRepository,
    *,
    current_user: dict[str, Any],
    request: dict[str, Any],
    workspace_root: str | None,
    executor: RunExecutor = default_run_executor,
) -> dict[str, Any]:
    if current_user["role"] != "teacher":
        raise RunError(403, "forbidden", "Students cannot create generation runs yet.")

    validate_run_request(request)
    run_id = str(uuid.uuid4())
    task_text = request["task_text"].strip()
    intent = request.get("intent", "auto")
    search_mode = request.get("search_mode", "auto")
    model_profile_id = request.get("model_profile_id")

    run = repo.create_run(
        id=run_id,
        user_id=current_user["id"],
        intent=intent,
        task_text=task_text,
        search_mode=search_mode,
        status="queued",
        model_profile_id=model_profile_id,
    )

    writer = ArtifactWriter(workspace_root, repository=repo)
    artifact_run = writer.start_run(
        user_label=current_user["email"],
        project_title="local",
        run_id=run_id,
        intent=intent,
        task_text=task_text,
        model={"provider": "openai_compatible", "model": model_profile_id or "unresolved"},
        search={"mode": search_mode, "used": False, "citations": []},
    )
    run = repo.update_run(run_id, output_root=str(artifact_run.run_dir.resolve())) or run
    executor(repo, artifact_run, run)
    return serialize_run(repo.get_run(run_id) or run)


def get_run_for_user(repo: SQLiteRepository, *, run_id: str, user_id: str) -> dict[str, Any]:
    run = repo.get_run(run_id)
    if not run or run["user_id"] != user_id:
        raise RunError(404, "not_found", "Run was not found.")
    return serialize_run(run)


def serialize_run(run: dict[str, Any]) -> dict[str, Any]:
    return {
        "id": run["id"],
        "status": run["status"],
        "intent": run["intent"],
        "task_text": run["task_text"],
        "search_mode": run["search_mode"],
        "model_profile_id": run.get("model_profile_id"),
        "output_root": run.get("output_root"),
        "error_message": run.get("error_message"),
        "created_at": run["created_at"],
        "updated_at": run["updated_at"],
    }
