from __future__ import annotations

import json
from typing import Any

from backend.artifacts.filesystem import ArtifactRun
from backend.pipelines.common import (
    PipelineError,
    PipelineResult,
    extract_fenced_or_raw,
    format_citations,
    format_log,
)
from backend.pipelines.essay_latex import LatexCompileError, LatexCompiler
from backend.providers.base import (
    ModelProviderError,
    TextGenerationProvider,
    TextGenerationRequest,
)


def run_beamer_slides_pipeline(
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
        "Pipeline: beamer_slides",
        f"Output preference: {output_preference or 'pdf'}",
        "Stage: generate_source",
    ]
    system_prompt, user_prompt = build_beamer_slides_prompt(
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

    source = extract_fenced_or_raw(
        raw_output,
        accepted_languages={"beamer", "latex", "tex"},
    )
    source = source.strip() + "\n"
    artifact_run.write_output(
        "slides.tex",
        source,
        kind="source",
        media_type="text/x-tex",
    )
    log_lines.extend(["Output: output/slides.tex", "Stage: compile_pdf"])

    try:
        compile_result = latex_compiler.compile(
            tex_path=artifact_run.run_dir / "output" / "slides.tex",
            output_dir=artifact_run.run_dir / "output",
            job_name="slides",
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
        "slides.pdf",
        compile_result.pdf_path.read_bytes(),
        kind="pdf",
        media_type="application/pdf",
    )
    log_lines.extend(["Compile: pdf_ok", "Output: output/slides.pdf"])
    return PipelineResult(log_text=format_log(log_lines))


def build_beamer_slides_prompt(
    *,
    task_text: str,
    context_bundle: str,
    options: dict[str, Any],
    search: dict[str, Any],
) -> tuple[str, str]:
    system_prompt = (
        "You are an expert teaching assistant writing complete presentation "
        "deliverables in LaTeX Beamer. Return only the requested LaTeX source, "
        "with no surrounding explanation."
    )
    output_instruction = (
        "Return one full compilable LaTeX Beamer document. It must include "
        "\\documentclass{beamer}, any needed packages, \\title/\\author when useful, "
        "\\begin{document}, multiple complete \\begin{frame}...\\end{frame} blocks, "
        "and \\end{document}. Use a simple replaceable visual theme, cite any "
        "provided web sources in plain LaTeX, and do not wrap the answer in "
        "Markdown fences."
    )
    user_prompt = "\n\n".join(
        [
            "[Presentation Task]\n" + task_text.strip(),
            "[Prepared Context]\n" + context_bundle.strip(),
            "[Search Citations]\n" + format_citations(search),
            "[Options]\n" + json.dumps(options, sort_keys=True),
            "[Output Contract]\n" + output_instruction,
        ]
    )
    return system_prompt, user_prompt
