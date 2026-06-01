from __future__ import annotations

from typing import Annotated, Any

from fastapi import APIRouter, Depends, Header, Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel, ConfigDict, Field

from backend.api.auth import get_auth_repository
from backend.core.runs import (
    RunError,
    RunExecutor,
    create_run,
    default_run_executor,
    get_run_for_user,
    run_error_envelope,
)
from backend.core.weak_auth import current_user_from_authorization
from backend.context.search_policy import DuckDuckGoSearchAdapter, WebSearchAdapter
from backend.storage.sqlite import SQLiteRepository

router = APIRouter(prefix="/api/runs", tags=["runs"])


class RunCreateRequest(BaseModel):
    model_config = ConfigDict(protected_namespaces=())

    task_text: str
    intent: str | None = None
    output_preference: str | None = None
    search_mode: str = "auto"
    model_profile_id: str | None = None
    upload_ids: list[str] = Field(default_factory=list)
    options: dict[str, Any] = Field(default_factory=dict)


async def run_error_handler(_request: Request, exc: RunError) -> JSONResponse:
    return JSONResponse(status_code=exc.status_code, content=run_error_envelope(exc))


def get_run_repository() -> SQLiteRepository:
    return SQLiteRepository.from_path()


def get_workspace_root() -> str | None:
    return None


def get_run_executor() -> RunExecutor:
    return default_run_executor


def get_run_search_adapter() -> WebSearchAdapter:
    return DuckDuckGoSearchAdapter()


def run_current_user(
    authorization: Annotated[str | None, Header()] = None,
    repo: SQLiteRepository = Depends(get_auth_repository),
) -> dict[str, Any]:
    return current_user_from_authorization(repo, authorization)


@router.post("")
def post_run(
    request: RunCreateRequest,
    current_user: dict[str, Any] = Depends(run_current_user),
    repo: SQLiteRepository = Depends(get_run_repository),
    workspace_root: str | None = Depends(get_workspace_root),
    executor: RunExecutor = Depends(get_run_executor),
    search_adapter: WebSearchAdapter = Depends(get_run_search_adapter),
) -> JSONResponse:
    body = create_run(
        repo,
        current_user=current_user,
        request=request.model_dump(),
        workspace_root=workspace_root,
        executor=executor,
        search_adapter=search_adapter,
    )
    return JSONResponse(status_code=202, content=body)


@router.get("/{run_id}")
def get_run(
    run_id: str,
    current_user: dict[str, Any] = Depends(run_current_user),
    repo: SQLiteRepository = Depends(get_run_repository),
) -> dict[str, Any]:
    return get_run_for_user(repo, run_id=run_id, user_id=current_user["id"])
