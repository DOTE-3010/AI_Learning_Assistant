from __future__ import annotations

import json
from dataclasses import dataclass, replace
from typing import Any

from backend.context.budget import (
    ContextEstimate,
    ContextSection,
    estimate_context_budget,
    estimate_text_tokens,
    section_kind_for_upload,
)
from backend.context.extraction import UploadExtraction, extract_upload
from backend.context.search_policy import SearchPolicyDecision, decide_search_policy
from backend.storage.sqlite import SQLiteRepository


class ContextBuildError(Exception):
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


@dataclass(frozen=True)
class PreparedContext:
    context_bundle: str
    estimate: ContextEstimate
    uploads: tuple[UploadExtraction, ...]
    search_policy: SearchPolicyDecision

    def to_dict(self) -> dict[str, Any]:
        return {
            "context_bundle_chars": len(self.context_bundle),
            "estimate": self.estimate.to_dict(),
            "uploads": [upload.to_summary_dict() for upload in self.uploads],
            "search_policy": self.search_policy.to_dict(),
        }


def build_run_context(
    repo: SQLiteRepository,
    *,
    task_text: str,
    intent: str,
    search_mode: str,
    upload_ids: list[str] | None = None,
    options: dict[str, Any] | None = None,
    context_window_limit: int | None = None,
) -> PreparedContext:
    uploads = tuple(_load_upload_contexts(repo, upload_ids or []))
    sections = [ContextSection(name="task_text", text=task_text, kind=_task_kind(intent))]
    bundle_parts = ["[Task]\n" + task_text]

    for upload in uploads:
        upload_kind = section_kind_for_upload(upload.original_name, upload.media_type)
        sections.append(
            ContextSection(
                name=f"upload:{upload.id}",
                text=upload.as_context_text(),
                kind=upload_kind,
            )
        )
        bundle_parts.append(upload.as_context_text())

    if options:
        option_text = json.dumps(options, sort_keys=True)
        sections.append(ContextSection(name="options", text=option_text, kind="prose"))
        bundle_parts.append("[Options]\n" + option_text)

    estimate = estimate_context_budget(
        sections,
        intent=intent,
        options=options,
        context_window_limit=context_window_limit,
    )
    search_policy = decide_search_policy(
        search_mode=search_mode,
        intent=intent,
        task_text=task_text,
        upload_count=len(uploads),
    )

    return PreparedContext(
        context_bundle="\n\n".join(bundle_parts),
        estimate=estimate,
        uploads=_uploads_with_token_estimates(uploads),
        search_policy=search_policy,
    )


def _load_upload_contexts(
    repo: SQLiteRepository, upload_ids: list[str]
) -> list[UploadExtraction]:
    contexts: list[UploadExtraction] = []
    for upload_id in upload_ids:
        upload = repo.get_upload(upload_id)
        if not upload:
            raise ContextBuildError(
                400,
                "not_found",
                "A referenced upload was not found.",
                [{"field": "upload_ids", "rule": "exists"}],
            )
        contexts.append(extract_upload(upload))
    return contexts


def _uploads_with_token_estimates(
    uploads: tuple[UploadExtraction, ...]
) -> tuple[UploadExtraction, ...]:
    estimated: list[UploadExtraction] = []
    for upload in uploads:
        kind = section_kind_for_upload(upload.original_name, upload.media_type)
        estimated.append(
            replace(
                upload,
                estimated_tokens=estimate_text_tokens(upload.as_context_text(), kind=kind),
            )
        )
    return tuple(estimated)


def _task_kind(intent: str) -> str:
    if intent == "code_homework":
        return "code"
    if intent in {"essay_latex", "beamer_slides", "cheat_sheet"}:
        return "latex"
    return "prose"
