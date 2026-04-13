from __future__ import annotations

from dataclasses import dataclass
from typing import List

from backend.app.iterative_generation.contracts import (
    ContextManager,
    IterationResult,
    ModelGateway,
    PromptCompiler,
    PromptSections,
    TelemetrySink,
    TokenEstimator,
)
from backend.app.iterative_generation.prompt_schema import (
    get_validation_error_message,
    validate_prompt_sections,
)


@dataclass
class OrchestratorConfig:
    turns: int = 3
    target_output_tokens: int = 1200


class AssignmentOrchestrator:
    def __init__(
        self,
        context_manager: ContextManager,
        prompt_compiler: PromptCompiler,
        model_gateway: ModelGateway,
        token_estimator: TokenEstimator,
        telemetry_sink: TelemetrySink,
        config: OrchestratorConfig | None = None,
    ) -> None:
        self.context_manager = context_manager
        self.prompt_compiler = prompt_compiler
        self.model_gateway = model_gateway
        self.token_estimator = token_estimator
        self.telemetry_sink = telemetry_sink
        self.config = config or OrchestratorConfig()

    @staticmethod
    def _warning_level(utilization_ratio: float) -> str:
        if utilization_ratio > 0.85:
            return "critical"
        if utilization_ratio >= 0.70:
            return "warning"
        return "ok"

    @staticmethod
    def _make_retry_guidance() -> str:
        return (
            "Generation paused: context window remains above critical threshold after compression.\n"
            "Retry guidance:\n"
            "1) Reduce attached reference content.\n"
            "2) Lower iteration turn count.\n"
            "3) Narrow task constraints to essential requirements."
        )

    def run(self, session_id: str, seed_sections: PromptSections) -> IterationResult:
        try:
            validate_prompt_sections(seed_sections)
        except Exception as exc:
            return IterationResult(final_output=get_validation_error_message(exc))

        previous_outputs: List[str] = []
        for turn in range(1, self.config.turns + 1):
            turn_sections = PromptSections(
                task_definition=seed_sections.task_definition,
                technical_description=seed_sections.technical_description,
                iteration_state=(
                    f"{seed_sections.iteration_state}\n"
                    f"Turn index: {turn}/{self.config.turns}\n"
                    f"Unresolved issues: refine structure, correctness, and edge cases.\n"
                    f"Previous outputs count: {len(previous_outputs)}"
                ),
                quality_bar=seed_sections.quality_bar,
                output_contract=seed_sections.output_contract,
                context_bundle=seed_sections.context_bundle,
            )

            context_packet = self.context_manager.build_context(
                session_id=session_id,
                turn_number=turn,
                prompt_sections=turn_sections,
                previous_outputs=previous_outputs,
            )
            payload = self.prompt_compiler.compile(turn_sections, context_packet)
            estimate = self.token_estimator.estimate(payload, self.config.target_output_tokens)
            warning_level = self._warning_level(estimate.utilization_ratio)

            telemetry_payload = {
                "session_id": session_id,
                "turn_number": turn,
                "estimator_backend": self.token_estimator.__class__.__name__,
                "estimated_input_tokens": estimate.estimated_input_tokens,
                "estimated_output_tokens": estimate.estimated_output_tokens,
                "estimated_total_tokens": estimate.estimated_total_tokens,
                "context_window_limit": estimate.context_window_limit,
                "utilization_ratio": estimate.utilization_ratio,
                "safety_margin_tokens": estimate.safety_margin_tokens,
                "warning_level": warning_level,
                "section_breakdown": estimate.section_breakdown,
            }
            self.telemetry_sink.emit("context_window_estimate", telemetry_payload)

            if warning_level in {"warning", "critical"}:
                context_packet = self.context_manager.compress_context(context_packet, warning_level)
                payload = self.prompt_compiler.compile(turn_sections, context_packet)
                estimate = self.token_estimator.estimate(payload, self.config.target_output_tokens)
                if self._warning_level(estimate.utilization_ratio) == "critical":
                    previous_outputs.append(self._make_retry_guidance())
                    break

            output = self.model_gateway.generate(payload)
            previous_outputs.append(output or "")

        final_output = previous_outputs[-1] if previous_outputs else self._make_retry_guidance()
        telemetry_events = getattr(self.telemetry_sink, "events", [])
        return IterationResult(
            final_output=final_output,
            turn_outputs=previous_outputs,
            telemetry_events=telemetry_events,
        )
