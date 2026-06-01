from __future__ import annotations

import json
import shutil
import subprocess
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Protocol

from backend.artifacts.filesystem import ArtifactRun
from backend.pipelines.common import (
    PipelineError,
    PipelineResult,
    extract_fenced_or_raw,
    format_citations,
    format_log,
)
from backend.providers.base import (
    ModelProviderError,
    TextGenerationProvider,
    TextGenerationRequest,
)


@dataclass(frozen=True)
class LatexCompileResult:
    pdf_path: Path
    log_text: str


class LatexCompileError(Exception):
    def __init__(self, message: str, *, log_text: str):
        self.message = message
        self.log_text = log_text
        super().__init__(message)


class LatexCompiler(Protocol):
    def compile(
        self,
        *,
        tex_path: Path,
        output_dir: Path,
        job_name: str,
    ) -> LatexCompileResult:
        ...


class LatexMkCompiler:
    def __init__(self, *, timeout_seconds: int = 45):
        self.timeout_seconds = timeout_seconds

    def compile(
        self,
        *,
        tex_path: Path,
        output_dir: Path,
        job_name: str,
    ) -> LatexCompileResult:
        latexmk = shutil.which("latexmk")
        if not latexmk:
            raise LatexCompileError(
                "LaTeX compiler latexmk is not available.",
                log_text="latexmk was not found on PATH.\n",
            )

        output_dir.mkdir(parents=True, exist_ok=True)
        pdf_path = output_dir / f"{job_name}.pdf"
        display_cmd = [
            "latexmk",
            "-pdf",
            "-interaction=nonstopmode",
            "-halt-on-error",
            "-file-line-error",
            f"-jobname={job_name}",
            tex_path.name,
        ]
        command = [latexmk, *display_cmd[1:]]

        try:
            result = subprocess.run(
                command,
                cwd=output_dir,
                check=False,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True,
                timeout=self.timeout_seconds,
            )
        except subprocess.TimeoutExpired as exc:
            log_text = _compiler_log(
                display_cmd,
                _coerce_text(exc.stdout),
                _coerce_text(exc.stderr),
                output_dir / f"{job_name}.log",
            )
            raise LatexCompileError(
                "LaTeX PDF compilation timed out.",
                log_text=log_text,
            ) from exc

        log_text = _compiler_log(
            display_cmd,
            result.stdout,
            result.stderr,
            output_dir / f"{job_name}.log",
        )
        if result.returncode != 0 or not pdf_path.exists():
            raise LatexCompileError(
                "LaTeX PDF compilation failed.",
                log_text=log_text,
            )

        return LatexCompileResult(pdf_path=pdf_path, log_text=log_text)


def run_essay_latex_pipeline(
    *,
    artifact_run: ArtifactRun,
    model_profile: dict[str, Any],
    model_provider: TextGenerationProvider,
    latex_compiler: LatexCompiler,
    task_text: str,
    context_bundle: str,
    output_preference: str | None,
    options: dict[str, Any] | None,
    search: dict[str, Any],
    max_output_tokens: int,
) -> PipelineResult:
    log_lines = [
        "Pipeline: essay_latex",
        f"Output preference: {output_preference or 'pdf'}",
        "Stage: generate_source",
    ]
    system_prompt, user_prompt = build_essay_latex_prompt(
        task_text=task_text,
        context_bundle=context_bundle,
        options=options or {},
        search=search,
    )

    try:
        raw_output = model_provider.generate_text(
            TextGenerationRequest(
                profile=model_profile,
                system_prompt=system_prompt,
                user_prompt=user_prompt,
                max_output_tokens=max_output_tokens,
                temperature=0.2,
            )
        )
    except ModelProviderError as exc:
        raise PipelineError(
            exc.code,
            exc.message,
            stage="generate_source",
            log_lines=log_lines,
        ) from exc
    except Exception as exc:
        raise PipelineError(
            "provider_unavailable",
            "The model provider request failed.",
            stage="generate_source",
            log_lines=log_lines,
        ) from exc

    source = extract_fenced_or_raw(raw_output, accepted_languages={"latex", "tex"})
    source = source.strip() + "\n"
    artifact_run.write_output(
        "main.tex",
        source,
        kind="source",
        media_type="text/x-tex",
    )
    log_lines.extend(["Output: output/main.tex", "Stage: compile_pdf"])

    try:
        compile_result = latex_compiler.compile(
            tex_path=artifact_run.run_dir / "output" / "main.tex",
            output_dir=artifact_run.run_dir / "output",
            job_name="main",
        )
    except LatexCompileError as exc:
        artifact_run.write_log("latex.log", exc.log_text)
        raise PipelineError(
            "compile_failed",
            exc.message,
            stage="compile_pdf",
            log_lines=log_lines,
        ) from exc
    except Exception as exc:
        artifact_run.write_log(
            "latex.log",
            "LaTeX compiler raised an unexpected error.\n",
        )
        raise PipelineError(
            "compile_failed",
            "LaTeX PDF compilation failed.",
            stage="compile_pdf",
            log_lines=log_lines,
        ) from exc

    artifact_run.write_log("latex.log", compile_result.log_text)
    artifact_run.write_output(
        "main.pdf",
        compile_result.pdf_path.read_bytes(),
        kind="pdf",
        media_type="application/pdf",
    )
    log_lines.extend(["Compile: pdf_ok", "Output: output/main.pdf"])
    return PipelineResult(log_text=format_log(log_lines))


def build_essay_latex_prompt(
    *,
    task_text: str,
    context_bundle: str,
    options: dict[str, Any],
    search: dict[str, Any],
) -> tuple[str, str]:
    system_prompt = (
        "You are an expert teaching assistant writing complete academic essay and "
        "report deliverables in LaTeX. Return only the requested LaTeX source, with "
        "no surrounding explanation."
    )
    output_instruction = (
        "Return one full compilable LaTeX article document. It must include "
        "\\documentclass, any needed packages, \\begin{document}, and \\end{document}. "
        "Use clear sectioning, cite any provided web sources in plain LaTeX, and do "
        "not wrap the answer in Markdown fences."
    )
    user_prompt = "\n\n".join(
        [
            "[Assignment Task]\n" + task_text.strip(),
            "[Prepared Context]\n" + context_bundle.strip(),
            "[Search Citations]\n" + format_citations(search),
            "[Options]\n" + json.dumps(options, sort_keys=True),
            "[Output Contract]\n" + output_instruction,
        ]
    )
    return system_prompt, user_prompt


def _compiler_log(
    command: list[str],
    stdout: str,
    stderr: str,
    latex_log_path: Path,
) -> str:
    lines = [
        "Command: " + " ".join(command),
        "[stdout]",
        stdout.strip() or "(empty)",
        "[stderr]",
        stderr.strip() or "(empty)",
    ]
    if latex_log_path.exists():
        lines.extend(
            [
                "[latex.log]",
                latex_log_path.read_text(encoding="utf-8", errors="replace").strip()
                or "(empty)",
            ]
        )
    return format_log(lines)


def _coerce_text(value: str | bytes | None) -> str:
    if value is None:
        return ""
    if isinstance(value, bytes):
        return value.decode("utf-8", errors="replace")
    return value
