from __future__ import annotations

import json
import uuid
from dataclasses import dataclass
from typing import Any, Callable

from backend.artifacts.filesystem import ArtifactRun, ArtifactWriter
from backend.context.builder import ContextBuildError, PreparedContext, build_run_context
from backend.context.search_policy import (
    DuckDuckGoSearchAdapter,
    SearchPolicyDecision,
    SearchPolicyError,
    WebSearchAdapter,
    execute_search_policy,
)
from backend.core.model_settings import MODEL_API_KEY_REF, default_profile_values
from backend.pipelines.beamer_slides import run_beamer_slides_pipeline
from backend.pipelines.code_homework import (
    normalize_output_preference,
    run_code_homework_pipeline,
)
from backend.pipelines.common import PipelineError
from backend.pipelines.essay_latex import (
    LatexCompiler,
    LatexMkCompiler,
    run_essay_latex_pipeline,
)
from backend.pipelines.router import (
    SUPPORTED_INTENTS,
    RoutingDecision,
    UnsupportedIntentError,
    route_intent,
)
from backend.providers.base import TextGenerationProvider
from backend.providers.openai_compatible import OpenAICompatibleTextProvider
from backend.storage.sqlite import SQLiteRepository

VALID_INTENTS = set(SUPPORTED_INTENTS)
VALID_SEARCH_MODES = {"auto", "on", "off"}


@dataclass(frozen=True)
class RunPreparation:
    routing: RoutingDecision
    context: PreparedContext
    model: dict[str, Any]

    def to_dict(self) -> dict[str, Any]:
        return {
            "routing": self.routing.to_dict(),
            "context": self.context.to_dict(),
            "model": self.model,
        }


RunExecutor = Callable[[SQLiteRepository, ArtifactRun, dict[str, Any], RunPreparation], None]


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
    intent = request.get("intent")
    search_mode = request.get("search_mode", "auto")
    task_text = (request.get("task_text") or "").strip()

    if not task_text:
        fields.append({"field": "task_text", "rule": "required"})
    if intent not in VALID_INTENTS:
        raise RunError(400, "unsupported_intent", "Unsupported generation intent.")
    if search_mode not in VALID_SEARCH_MODES:
        fields.append({"field": "search_mode", "rule": "enum"})
    if intent == "code_homework":
        try:
            normalize_output_preference(request.get("output_preference"))
        except PipelineError:
            fields.append({"field": "output_preference", "rule": "enum"})
    if intent == "cheat_sheet":
        target_pages = (request.get("options") or {}).get("target_pages")
        if not isinstance(target_pages, int) or target_pages <= 0:
            fields.append({"field": "options.target_pages", "rule": "required"})

    if fields:
        raise RunError(400, "validation_error", "Generation request validation failed.", fields)


def default_run_executor(
    repo: SQLiteRepository,
    artifact_run: ArtifactRun,
    run: dict[str, Any],
    preparation: RunPreparation,
) -> None:
    model_provider = OpenAICompatibleTextProvider()
    if preparation.routing.target.pipeline == "code_homework":
        execute_code_homework_run(
            repo,
            artifact_run,
            run,
            preparation,
            model_provider=model_provider,
        )
        return
    if preparation.routing.target.pipeline == "essay_latex":
        execute_essay_latex_run(
            repo,
            artifact_run,
            run,
            preparation,
            model_provider=model_provider,
            latex_compiler=LatexMkCompiler(),
        )
        return
    if preparation.routing.target.pipeline == "beamer_slides":
        execute_beamer_slides_run(
            repo,
            artifact_run,
            run,
            preparation,
            model_provider=model_provider,
            latex_compiler=LatexMkCompiler(),
        )
        return

    payload = {
        "routing": preparation.routing.to_dict(),
        "context": preparation.context.estimate.to_dict(),
        "search": artifact_run.search,
        "uploads": [upload.to_summary_dict() for upload in preparation.context.uploads],
    }
    artifact_run.write_log(
        "generation.log",
        "Run accepted and queued. Artifact pipelines are not implemented in this skeleton.\n"
        + json.dumps(payload, indent=2, sort_keys=True)
        + "\n",
    )
    artifact_run.write_manifest(status="queued")


def make_run_executor(
    model_provider: TextGenerationProvider,
    *,
    latex_compiler: LatexCompiler | None = None,
) -> RunExecutor:
    def _executor(
        repo: SQLiteRepository,
        artifact_run: ArtifactRun,
        run: dict[str, Any],
        preparation: RunPreparation,
    ) -> None:
        if preparation.routing.target.pipeline == "code_homework":
            execute_code_homework_run(
                repo,
                artifact_run,
                run,
                preparation,
                model_provider=model_provider,
            )
            return
        if preparation.routing.target.pipeline == "essay_latex":
            execute_essay_latex_run(
                repo,
                artifact_run,
                run,
                preparation,
                model_provider=model_provider,
                latex_compiler=latex_compiler or LatexMkCompiler(),
            )
            return
        if preparation.routing.target.pipeline == "beamer_slides":
            execute_beamer_slides_run(
                repo,
                artifact_run,
                run,
                preparation,
                model_provider=model_provider,
                latex_compiler=latex_compiler or LatexMkCompiler(),
            )
            return
        default_run_executor(repo, artifact_run, run, preparation)

    return _executor


def execute_code_homework_run(
    repo: SQLiteRepository,
    artifact_run: ArtifactRun,
    run: dict[str, Any],
    preparation: RunPreparation,
    *,
    model_provider: TextGenerationProvider,
) -> None:
    repo.update_run(run["id"], status="running", error_message=None)
    try:
        result = run_code_homework_pipeline(
            artifact_run=artifact_run,
            model_profile=preparation.model,
            model_provider=model_provider,
            task_text=run["task_text"],
            context_bundle=preparation.context.context_bundle,
            output_preference=preparation.routing.output_preference,
            options=preparation.routing.options,
            search=artifact_run.search,
            max_output_tokens=preparation.context.estimate.estimated_output_tokens,
        )
    except PipelineError as exc:
        repo.update_run(
            run["id"],
            status="failed",
            error_message=f"{exc.code}: {exc.message}",
        )
        artifact_run.write_log("generation.log", exc.to_log_text())
        artifact_run.write_manifest(status="failed")
        return

    repo.update_run(run["id"], status="succeeded", error_message=None)
    artifact_run.write_log("generation.log", result.log_text)
    artifact_run.write_manifest(status="succeeded")


def execute_essay_latex_run(
    repo: SQLiteRepository,
    artifact_run: ArtifactRun,
    run: dict[str, Any],
    preparation: RunPreparation,
    *,
    model_provider: TextGenerationProvider,
    latex_compiler: LatexCompiler,
) -> None:
    repo.update_run(run["id"], status="running", error_message=None)
    try:
        result = run_essay_latex_pipeline(
            artifact_run=artifact_run,
            model_profile=preparation.model,
            model_provider=model_provider,
            latex_compiler=latex_compiler,
            task_text=run["task_text"],
            context_bundle=preparation.context.context_bundle,
            output_preference=preparation.routing.output_preference,
            options=preparation.routing.options,
            search=artifact_run.search,
            max_output_tokens=preparation.context.estimate.estimated_output_tokens,
        )
    except PipelineError as exc:
        repo.update_run(
            run["id"],
            status="failed",
            error_message=f"{exc.code}: {exc.message}",
        )
        artifact_run.write_log("generation.log", exc.to_log_text())
        artifact_run.write_manifest(status="failed")
        return

    repo.update_run(run["id"], status="succeeded", error_message=None)
    artifact_run.write_log("generation.log", result.log_text)
    artifact_run.write_manifest(status="succeeded")


def execute_beamer_slides_run(
    repo: SQLiteRepository,
    artifact_run: ArtifactRun,
    run: dict[str, Any],
    preparation: RunPreparation,
    *,
    model_provider: TextGenerationProvider,
    latex_compiler: LatexCompiler,
) -> None:
    repo.update_run(run["id"], status="running", error_message=None)
    try:
        result = run_beamer_slides_pipeline(
            artifact_run=artifact_run,
            model_profile=preparation.model,
            model_provider=model_provider,
            latex_compiler=latex_compiler,
            task_text=run["task_text"],
            context_bundle=preparation.context.context_bundle,
            output_preference=preparation.routing.output_preference,
            options=preparation.routing.options,
            search=artifact_run.search,
            max_output_tokens=preparation.context.estimate.estimated_output_tokens,
        )
    except PipelineError as exc:
        repo.update_run(
            run["id"],
            status="failed",
            error_message=f"{exc.code}: {exc.message}",
        )
        artifact_run.write_log("generation.log", exc.to_log_text())
        artifact_run.write_manifest(status="failed")
        return

    repo.update_run(run["id"], status="succeeded", error_message=None)
    artifact_run.write_log("generation.log", result.log_text)
    artifact_run.write_manifest(status="succeeded")


def prepare_run_request(
    repo: SQLiteRepository,
    *,
    current_user: dict[str, Any],
    request: dict[str, Any],
) -> RunPreparation:
    validate_run_request(request)
    try:
        routing = route_intent(
            request.get("intent"),
            output_preference=request.get("output_preference"),
            options=request.get("options"),
        )
    except UnsupportedIntentError as exc:
        raise RunError(400, "unsupported_intent", "Unsupported generation intent.") from exc

    model = _resolve_model_for_run(
        repo,
        user_id=current_user["id"],
        model_profile_id=request.get("model_profile_id"),
    )
    try:
        prepared_context = build_run_context(
            repo,
            task_text=(request.get("task_text") or "").strip(),
            intent=routing.resolved_intent,
            search_mode=request.get("search_mode", "auto"),
            upload_ids=request.get("upload_ids") or [],
            options=routing.options,
            context_window_limit=model.get("context_window_hint"),
        )
    except ContextBuildError as exc:
        raise RunError(exc.status_code, exc.code, exc.message, exc.fields) from exc

    return RunPreparation(routing=routing, context=prepared_context, model=model)


def create_run(
    repo: SQLiteRepository,
    *,
    current_user: dict[str, Any],
    request: dict[str, Any],
    workspace_root: str | None,
    executor: RunExecutor = default_run_executor,
    search_adapter: WebSearchAdapter | None = None,
) -> dict[str, Any]:
    preparation = prepare_run_request(repo, current_user=current_user, request=request)
    run_id = str(uuid.uuid4())
    task_text = request["task_text"].strip()
    intent = preparation.routing.resolved_intent
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
        model=_manifest_model(preparation.model),
        search={
            "mode": preparation.context.search_policy.mode,
            "decision": preparation.context.search_policy.decision,
            "used": False,
            "citations": [],
        },
    )
    run = repo.update_run(run_id, output_root=str(artifact_run.run_dir.resolve())) or run
    search_result = _run_search_policy(
        repo,
        run_id=run_id,
        decision=preparation.context.search_policy,
        adapter=search_adapter or DuckDuckGoSearchAdapter(),
    )
    artifact_run.search = search_result

    if preparation.context.search_policy.mode == "on" and search_result["decision"] == "forced_on_failed":
        run = (
            repo.update_run(
                run_id,
                status="failed",
                error_message="search_unavailable: Web search is unavailable for forced search mode.",
            )
            or run
        )
        artifact_run.write_log(
            "generation.log",
            "Run failed before generation.\n"
            + json.dumps({"error": {"code": "search_unavailable"}}, indent=2, sort_keys=True)
            + "\n",
        )
        artifact_run.write_manifest(status="failed")
        return serialize_run(run, preparation=preparation)

    executor(repo, artifact_run, run, preparation)
    return serialize_run(repo.get_run(run_id) or run, preparation=preparation)


def get_run_for_user(repo: SQLiteRepository, *, run_id: str, user_id: str) -> dict[str, Any]:
    run = repo.get_run(run_id)
    if not run or run["user_id"] != user_id:
        raise RunError(404, "not_found", "Run was not found.")
    return serialize_run(run)


def serialize_run(
    run: dict[str, Any],
    *,
    preparation: RunPreparation | None = None,
) -> dict[str, Any]:
    body = {
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
    if preparation:
        body["routing"] = preparation.routing.to_dict()
        body["context"] = preparation.context.estimate.to_dict()
    return body


def _resolve_model_for_run(
    repo: SQLiteRepository,
    *,
    user_id: str,
    model_profile_id: str | None,
) -> dict[str, Any]:
    profile: dict[str, Any] | None = None
    if model_profile_id:
        profile = repo.get_model_profile(model_profile_id)
        if not profile or profile.get("user_id") not in {None, user_id}:
            raise RunError(404, "not_found", "Model profile was not found.")
    else:
        profile = repo.get_default_model_profile(user_id) or repo.get_default_model_profile(None)

    if not profile:
        defaults = default_profile_values()
        return {
            "profile_id": "environment-default",
            "provider": defaults["provider"],
            "base_url": defaults["base_url"],
            "model": defaults["model"],
            "api_key_ref": MODEL_API_KEY_REF,
            "context_window_hint": defaults["context_window_hint"],
        }

    return {
        "profile_id": profile["id"],
        "provider": profile["provider"],
        "base_url": profile["base_url"],
        "model": profile["model"],
        "api_key_ref": profile.get("api_key_ref"),
        "context_window_hint": profile.get("context_window_hint"),
    }


def _manifest_model(model: dict[str, Any]) -> dict[str, Any]:
    return {
        "profile_id": model.get("profile_id"),
        "provider": model.get("provider"),
        "model": model.get("model"),
    }


def _run_search_policy(
    repo: SQLiteRepository,
    *,
    run_id: str,
    decision: SearchPolicyDecision,
    adapter: WebSearchAdapter,
) -> dict[str, Any]:
    try:
        executed = execute_search_policy(decision=decision, adapter=adapter)
    except SearchPolicyError:
        return {
            "mode": decision.mode,
            "decision": "forced_on_failed",
            "used": False,
            "citations": [],
        }

    citations = [dict(citation) for citation in executed.citations]
    for citation in citations:
        repo.create_citation(
            run_id=run_id,
            title=citation.get("title"),
            url=citation.get("url"),
            snippet=citation.get("snippet"),
        )

    return {
        "mode": executed.mode,
        "decision": executed.decision,
        "used": executed.used,
        "citations": citations,
    }
