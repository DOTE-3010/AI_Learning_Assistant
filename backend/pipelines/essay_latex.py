from __future__ import annotations

import json
import shutil
import subprocess
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Callable, Protocol

from backend.artifacts.filesystem import ArtifactRun
from backend.pipelines.common import (
    PipelineError,
    PipelineResult,
    extract_fenced_or_raw,
    format_citations,
    format_log,
)
from backend.pipelines.latex_diagrams import (
    DIAGRAM_POLICY_INSTRUCTION,
    sanitize_latex_diagram_placeholders,
)
from backend.providers.base import (
    ModelProviderError,
    TextGenerationProvider,
    TextGenerationRequest,
)
from backend.timing import RunTimingRecorder, measure_stage


@dataclass(frozen=True)
class LatexCompileResult:
    pdf_path: Path
    log_text: str
    repaired: bool = False


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


def compile_latex_with_repair(
    *,
    tex_path: Path,
    output_dir: Path,
    job_name: str,
    document_kind: str,
    model_profile: dict[str, Any],
    model_provider: TextGenerationProvider,
    latex_compiler: LatexCompiler,
    max_output_tokens: int,
    accepted_languages: set[str],
    emit_event: Callable[[str, str], None] | None = None,
    timing: RunTimingRecorder | None = None,
) -> LatexCompileResult:
    try:
        with measure_stage(timing, "compile_pdf"):
            return latex_compiler.compile(
                tex_path=tex_path,
                output_dir=output_dir,
                job_name=job_name,
            )
    except LatexCompileError as initial_error:
        if emit_event:
            emit_event("repair_source", "Repairing LaTeX source after compile failure")

        try:
            with measure_stage(timing, "repair_generation"):
                repaired_source = repair_latex_source(
                    tex_path=tex_path,
                    compile_log=initial_error.log_text,
                    document_kind=document_kind,
                    model_profile=model_profile,
                    model_provider=model_provider,
                    max_output_tokens=max_output_tokens,
                    accepted_languages=accepted_languages,
                )
        except ModelProviderError as exc:
            raise LatexCompileError(
                initial_error.message,
                log_text=_repair_log(
                    initial_error.log_text,
                    f"Repair model request failed: {exc.code}: {exc.message}\n",
                ),
            ) from exc
        except Exception as exc:
            raise LatexCompileError(
                initial_error.message,
                log_text=_repair_log(
                    initial_error.log_text,
                    "Repair model request failed unexpectedly.\n",
                ),
            ) from exc

        with measure_stage(timing, "artifact_persistence"):
            tex_path.write_text(repaired_source, encoding="utf-8")
        if emit_event:
            emit_event("compile_pdf", "Compiling repaired LaTeX PDF")

        try:
            with measure_stage(timing, "compile_pdf"):
                repaired_result = latex_compiler.compile(
                    tex_path=tex_path,
                    output_dir=output_dir,
                    job_name=job_name,
                )
        except LatexCompileError as repaired_error:
            raise LatexCompileError(
                repaired_error.message,
                log_text=_repair_log(
                    initial_error.log_text,
                    "Repair source written; repaired compile still failed.\n",
                    repaired_error.log_text,
                ),
            ) from repaired_error

        return LatexCompileResult(
            pdf_path=repaired_result.pdf_path,
            log_text=_repair_log(
                initial_error.log_text,
                "Repair source written; repaired compile succeeded.\n",
                repaired_result.log_text,
            ),
            repaired=True,
        )


def repair_latex_source(
    *,
    tex_path: Path,
    compile_log: str,
    document_kind: str,
    model_profile: dict[str, Any],
    model_provider: TextGenerationProvider,
    max_output_tokens: int,
    accepted_languages: set[str],
) -> str:
    source = tex_path.read_text(encoding="utf-8", errors="replace")
    system_prompt = (
        "You are an expert LaTeX repair assistant. Return only a complete, "
        "corrected LaTeX source file with no Markdown fences or explanation."
    )
    user_prompt = "\n\n".join(
        [
            f"[Document Kind]\n{document_kind}",
            "[Broken LaTeX Source]\n" + source.strip(),
            "[Compiler Log]\n" + _clip_for_repair_prompt(compile_log),
            "[Repair Contract]\n"
            "Fix the smallest set of LaTeX issues needed for pdflatex/latexmk "
            "to compile successfully. Preserve the user's substantive content, "
            "sectioning, and citations where possible. Common fixes include "
            "table column alignment mismatches, unescaped special characters, "
            "missing package declarations, malformed environments, and broken "
            "math delimiters. "
            + DIAGRAM_POLICY_INSTRUCTION
            + " Return the full corrected source, not a patch.",
        ]
    )
    raw_output = model_provider.generate_text(
        TextGenerationRequest(
            profile=model_profile,
            system_prompt=system_prompt,
            user_prompt=user_prompt,
            max_output_tokens=max(1000, max_output_tokens),
            temperature=0.0,
        )
    )
    repaired_source = extract_fenced_or_raw(raw_output, accepted_languages=accepted_languages)
    repaired_source = sanitize_latex_diagram_placeholders(repaired_source)
    return repaired_source.strip() + "\n"


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
    emit_event: Callable[[str, str], None] | None = None,
    timing: RunTimingRecorder | None = None,
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
    if emit_event:
        emit_event("generate_source", "Generating essay LaTeX source")

    try:
        with measure_stage(timing, "provider_generation"):
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
    source = sanitize_latex_diagram_placeholders(source)
    source = source.strip() + "\n"
    artifact_run.write_output(
        "main.tex",
        source,
        kind="source",
        media_type="text/x-tex",
    )
    log_lines.extend(["Output: output/main.tex", "Stage: compile_pdf"])
    if emit_event:
        emit_event("compile_pdf", "Compiling LaTeX PDF")

    try:
        compile_result = compile_latex_with_repair(
            tex_path=artifact_run.run_dir / "output" / "main.tex",
            output_dir=artifact_run.run_dir / "output",
            job_name="main",
            document_kind="essay_latex article",
            model_profile=model_profile,
            model_provider=model_provider,
            latex_compiler=latex_compiler,
            max_output_tokens=max_output_tokens,
            accepted_languages={"latex", "tex"},
            emit_event=emit_event,
            timing=timing,
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
    if compile_result.repaired:
        log_lines.append("Repair: source_repaired")
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
        "not wrap the answer in Markdown fences. "
        + DIAGRAM_POLICY_INSTRUCTION
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


def _repair_log(
    initial_log: str,
    repair_note: str,
    repaired_log: str | None = None,
) -> str:
    lines = [
        "[initial compile failure]",
        initial_log.strip() or "(empty)",
        "[repair]",
        repair_note.strip() or "(empty)",
    ]
    if repaired_log is not None:
        lines.extend(["[recompile]", repaired_log.strip() or "(empty)"])
    return format_log(lines)


def _clip_for_repair_prompt(text: str, *, limit: int = 12000) -> str:
    stripped = text.strip()
    if len(stripped) <= limit:
        return stripped
    head = stripped[: limit // 2]
    tail = stripped[-limit // 2 :]
    return head + "\n\n[...compiler log truncated...]\n\n" + tail
def _coerce_text(value: str | bytes | None) -> str:
    if value is None:
        return ""
    if isinstance(value, bytes):
        return value.decode("utf-8", errors="replace")
    return value
