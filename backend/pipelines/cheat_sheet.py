from __future__ import annotations

import json
from typing import Any

from backend.artifacts.filesystem import ArtifactRun
from backend.context.extraction import UploadExtraction
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


def run_cheat_sheet_pipeline(
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
    uploads: tuple[UploadExtraction, ...],
) -> PipelineResult:
    options = options or {}
    target_pages = options.get("target_pages")
    if type(target_pages) is not int or target_pages <= 0:
        raise PipelineError(
            "validation_error",
            "Cheat-sheet generation requires a positive target_pages option.",
            stage="validate_options",
        )

    extraction_log = format_extraction_log(uploads)
    artifact_run.write_log("extraction.log", extraction_log)
    log_lines = [
        "Pipeline: cheat_sheet",
        f"Output preference: {output_preference or 'pdf'}",
        f"Target pages: {target_pages}",
        "Log: logs/extraction.log",
        "Stage: generate_source",
    ]
    system_prompt, user_prompt = build_cheat_sheet_prompt(
        task_text=task_text,
        context_bundle=context_bundle,
        options=options,
        search=search,
        extraction_log=extraction_log,
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
        "cheat-sheet.tex",
        source,
        kind="source",
        media_type="text/x-tex",
    )
    log_lines.extend(["Output: output/cheat-sheet.tex", "Stage: compile_pdf"])

    try:
        compile_result = latex_compiler.compile(
            tex_path=artifact_run.run_dir / "output" / "cheat-sheet.tex",
            output_dir=artifact_run.run_dir / "output",
            job_name="cheat-sheet",
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
        "cheat-sheet.pdf",
        compile_result.pdf_path.read_bytes(),
        kind="pdf",
        media_type="application/pdf",
    )
    log_lines.extend(["Compile: pdf_ok", "Output: output/cheat-sheet.pdf"])
    return PipelineResult(log_text=format_log(log_lines))


def build_cheat_sheet_prompt(
    *,
    task_text: str,
    context_bundle: str,
    options: dict[str, Any],
    search: dict[str, Any],
    extraction_log: str,
) -> tuple[str, str]:
    target_pages = options.get("target_pages")
    paper_size = options.get("paper_size") or "A4"
    density = options.get("density") or "dense"
    system_prompt = (
        "You are an expert teaching assistant compressing course slide material "
        "into complete, print-ready LaTeX cheat sheets. Return only the requested "
        "LaTeX source, with no surrounding explanation."
    )
    output_instruction = (
        f"Return one full compilable LaTeX article document targeting exactly "
        f"{target_pages} {paper_size} page(s) with {density} information density. "
        "Use compact margins, small but readable type, multiple columns, tight "
        "sectioning, equations, definitions, algorithms, and tables where useful. "
        "It must include \\documentclass, required packages such as geometry and "
        "multicol when useful, \\begin{document}, and \\end{document}. Preserve "
        "important caveats from extraction notes, cite any provided web sources in "
        "plain LaTeX, and do not wrap the answer in Markdown fences."
    )
    user_prompt = "\n\n".join(
        [
            "[Cheat-Sheet Task]\n" + task_text.strip(),
            "[PDF Extraction Summary]\n" + extraction_log.strip(),
            "[Prepared Slide Context]\n" + context_bundle.strip(),
            "[Search Citations]\n" + format_citations(search),
            "[Options]\n" + json.dumps(options, sort_keys=True),
            "[Output Contract]\n" + output_instruction,
        ]
    )
    return system_prompt, user_prompt


def format_extraction_log(uploads: tuple[UploadExtraction, ...]) -> str:
    lines = [
        "Cheat-sheet PDF extraction summary",
        f"Upload count: {len(uploads)}",
    ]
    if not uploads:
        lines.append("No uploads were supplied; generation will use task text only.")
        return format_log(lines)

    for upload in uploads:
        lines.extend(
            [
                f"Upload: {upload.original_name}",
                f"Media type: {upload.media_type or 'unknown'}",
                f"Extracted characters: {upload.extracted_chars}",
            ]
        )
        if upload.notes:
            lines.extend(f"Note: {note}" for note in upload.notes)
        else:
            lines.append("Notes: none")
    return format_log(lines)
