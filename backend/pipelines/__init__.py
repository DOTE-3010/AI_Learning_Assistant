"""Artifact generation pipeline package."""

from backend.pipelines.beamer_slides import run_beamer_slides_pipeline
from backend.pipelines.cheat_sheet import run_cheat_sheet_pipeline
from backend.pipelines.code_homework import run_code_homework_pipeline
from backend.pipelines.common import PipelineError, PipelineResult
from backend.pipelines.essay_latex import (
    LatexCompileError,
    LatexCompileResult,
    LatexCompiler,
    LatexMkCompiler,
    run_essay_latex_pipeline,
)
from backend.pipelines.router import (
    PIPELINE_TARGETS,
    SUPPORTED_INTENTS,
    RoutingDecision,
    UnsupportedIntentError,
    route_intent,
)

__all__ = [
    "PIPELINE_TARGETS",
    "LatexCompileError",
    "LatexCompileResult",
    "LatexCompiler",
    "LatexMkCompiler",
    "PipelineError",
    "PipelineResult",
    "SUPPORTED_INTENTS",
    "RoutingDecision",
    "UnsupportedIntentError",
    "run_beamer_slides_pipeline",
    "run_cheat_sheet_pipeline",
    "run_code_homework_pipeline",
    "run_essay_latex_pipeline",
    "route_intent",
]
