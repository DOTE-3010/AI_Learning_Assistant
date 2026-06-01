from __future__ import annotations

import json
import re
from dataclasses import dataclass
from typing import Any

FENCE_PATTERN = re.compile(r"```([A-Za-z0-9_-]*)[^\n`]*\n(.*?)```", re.DOTALL)


@dataclass(frozen=True)
class PipelineResult:
    log_text: str


class PipelineError(Exception):
    def __init__(
        self,
        code: str,
        message: str,
        *,
        stage: str,
        log_lines: list[str] | None = None,
    ):
        self.code = code
        self.message = message
        self.stage = stage
        self.log_lines = list(log_lines or [])
        super().__init__(message)

    def to_log_text(self) -> str:
        payload = {
            "error": {
                "code": self.code,
                "message": self.message,
                "stage": self.stage,
            }
        }
        return format_log(
            [*self.log_lines, "Run failed.", json.dumps(payload, sort_keys=True)]
        )


def extract_fenced_or_raw(raw_output: str, *, accepted_languages: set[str]) -> str:
    text = raw_output.strip()
    fences = [
        (language.strip().lower(), body.strip())
        for language, body in FENCE_PATTERN.findall(text)
    ]
    for language, body in fences:
        if language in accepted_languages:
            return body
    if fences:
        return fences[0][1]
    return text


def format_citations(search: dict[str, Any]) -> str:
    citations = search.get("citations") or []
    if not citations:
        return "No web citations were used."
    lines = []
    for index, citation in enumerate(citations, 1):
        title = citation.get("title") or "Untitled source"
        url = citation.get("url") or "no-url"
        snippet = citation.get("snippet") or ""
        lines.append(f"{index}. {title} - {url}\n{snippet}".strip())
    return "\n".join(lines)


def format_log(lines: list[str]) -> str:
    return "\n".join(lines).rstrip() + "\n"
