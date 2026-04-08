from __future__ import annotations

import json
import logging
from typing import Dict, List

from langchain_core.chat_history import InMemoryChatMessageHistory
from langchain_core.messages import AIMessage, HumanMessage

from backend.app.iterative_generation.contracts import (
    ContextManager,
    ContextPacket,
    ModelGateway,
    PromptCompiler,
    PromptPayload,
    PromptSections,
    TelemetrySink,
    TokenEstimate,
    TokenEstimator,
)
from backend.core.config import MODEL_NAME

logger = logging.getLogger(__name__)


def _truncate(text: str, max_chars: int) -> str:
    if len(text) <= max_chars:
        return text
    return f"{text[:max_chars]}\n...[truncated]"


class LangChainContextAdapter(ContextManager):
    """
    Phase-1 default context manager using LangChain InMemoryChatMessageHistory
    to track multi-turn conversation state. Compresses by dropping oldest messages
    on warning, and truncating history string on critical.
    """

    def __init__(
        self,
        max_turns_window: int = 3,
        max_artifact_chars: int = 4000,
    ) -> None:
        self.max_turns_window = max_turns_window
        self.max_artifact_chars = max_artifact_chars
        # session_id -> InMemoryChatMessageHistory
        self._histories: Dict[str, InMemoryChatMessageHistory] = {}

    def _get_history(self, session_id: str) -> InMemoryChatMessageHistory:
        if session_id not in self._histories:
            self._histories[session_id] = InMemoryChatMessageHistory()
        return self._histories[session_id]

    def build_context(
        self,
        session_id: str,
        turn_number: int,
        prompt_sections: PromptSections,
        previous_outputs: List[str],
    ) -> ContextPacket:
        history = self._get_history(session_id)

        # Sync LangChain history with previous_outputs produced this session
        stored_ai_count = sum(1 for m in history.messages if isinstance(m, AIMessage))
        for output in previous_outputs[stored_ai_count:]:
            history.add_message(HumanMessage(content=f"[Turn {turn_number - 1} prompt]"))
            history.add_message(AIMessage(content=output))

        # Retrieve windowed messages (keep last max_turns_window AI outputs)
        ai_messages = [m for m in history.messages if isinstance(m, AIMessage)]
        windowed = ai_messages[-self.max_turns_window :]
        history_summary = "\n\n".join(
            f"[Turn output {i + 1}]\n{m.content}" for i, m in enumerate(windowed)
        ) or "No prior turns."

        artifacts = _truncate(prompt_sections.context_bundle, self.max_artifact_chars)
        return ContextPacket(
            session_id=session_id,
            turn_number=turn_number,
            history_summary=history_summary,
            retrieved_memory=f"LangChain InMemoryChatMessageHistory: {len(history.messages)} messages stored.",
            artifacts=artifacts,
            low_priority_context=prompt_sections.context_bundle,
        )

    def compress_context(self, context_packet: ContextPacket, level: str) -> ContextPacket:
        history = self._get_history(context_packet.session_id)
        if level == "warning":
            # Drop oldest half of messages from LangChain history
            msgs = history.messages
            if len(msgs) > 2:
                history.clear()
                for m in msgs[len(msgs) // 2 :]:
                    history.add_message(m)
            context_packet.artifacts = _truncate(
                context_packet.artifacts, max(500, self.max_artifact_chars // 2)
            )
        elif level == "critical":
            # Keep only the most recent exchange
            msgs = history.messages
            history.clear()
            if msgs:
                for m in msgs[-2:]:
                    history.add_message(m)
            context_packet.history_summary = _truncate(context_packet.history_summary, 800)
            context_packet.artifacts = _truncate(context_packet.artifacts, 1200)
            context_packet.low_priority_context = ""
        return context_packet


class NativeAPIContextAdapter(ContextManager):
    """
    Phase-2 scaffold. Same interface, different implementation entrypoint.
    """

    def build_context(
        self,
        session_id: str,
        turn_number: int,
        prompt_sections: PromptSections,
        previous_outputs: List[str],
    ) -> ContextPacket:
        return ContextPacket(
            session_id=session_id,
            turn_number=turn_number,
            history_summary="\n".join(previous_outputs[-2:]) or "No prior turns.",
            retrieved_memory="Native API retrieval scaffold active.",
            artifacts=prompt_sections.context_bundle,
            low_priority_context=prompt_sections.context_bundle,
        )

    def compress_context(self, context_packet: ContextPacket, level: str) -> ContextPacket:
        if level in {"warning", "critical"}:
            context_packet.artifacts = _truncate(context_packet.artifacts, 1000 if level == "critical" else 2000)
        return context_packet


class SectionPromptCompiler(PromptCompiler):
    def compile(self, prompt_sections: PromptSections, context_packet: ContextPacket) -> PromptPayload:
        section_map: Dict[str, str] = {
            "task_definition": prompt_sections.task_definition,
            "technical_description": prompt_sections.technical_description,
            "iteration_state": prompt_sections.iteration_state,
            "quality_bar": prompt_sections.quality_bar,
            "output_contract": prompt_sections.output_contract,
            "context_bundle": (
                f"Session: {context_packet.session_id}\n"
                f"Turn: {context_packet.turn_number}\n"
                f"History Summary:\n{context_packet.history_summary}\n\n"
                f"Retrieved Memory:\n{context_packet.retrieved_memory}\n\n"
                f"Artifacts:\n{context_packet.artifacts}"
            ),
        }
        compiled_sections = "\n\n".join(
            f"[{name.upper()}]\n{content}" for name, content in section_map.items()
        )
        return PromptPayload(
            system_message="You are a helpful academic assistant that must respect section contracts.",
            user_message=compiled_sections,
            section_map=section_map,
        )


class OpenAIChatGateway(ModelGateway):
    def __init__(self, client) -> None:
        self.client = client

    def generate(self, payload: PromptPayload) -> str:
        completion = self.client.chat.completions.create(
            model=MODEL_NAME,
            messages=[
                {"role": "system", "content": payload.system_message},
                {"role": "user", "content": payload.user_message},
            ],
        )
        return completion.choices[0].message.content


class SimpleTokenEstimator(TokenEstimator):
    """
    Lightweight heuristic estimator for integration observability.
    """

    def __init__(self, context_window_limit: int = 128000) -> None:
        self.context_window_limit = context_window_limit

    @staticmethod
    def _estimate_from_text(text: str) -> int:
        # Simple heuristic: ~4 chars/token for English prompts.
        return max(1, len(text) // 4)

    def estimate(self, payload: PromptPayload, target_output_tokens: int) -> TokenEstimate:
        section_breakdown = {
            section: self._estimate_from_text(value) for section, value in payload.section_map.items()
        }
        estimated_input = sum(section_breakdown.values()) + self._estimate_from_text(payload.system_message)
        estimated_total = estimated_input + target_output_tokens
        utilization_ratio = estimated_total / float(self.context_window_limit)
        return TokenEstimate(
            estimated_input_tokens=estimated_input,
            estimated_output_tokens=target_output_tokens,
            estimated_total_tokens=estimated_total,
            context_window_limit=self.context_window_limit,
            utilization_ratio=utilization_ratio,
            safety_margin_tokens=self.context_window_limit - estimated_total,
            section_breakdown=section_breakdown,
        )


class InMemoryTelemetrySink(TelemetrySink):
    def __init__(self) -> None:
        self.events: List[Dict] = []

    def emit(self, event_name: str, payload: Dict) -> None:
        event = {"event_name": event_name, "payload": payload}
        self.events.append(event)
        logger.info("telemetry_event=%s payload=%s", event_name, json.dumps(payload, ensure_ascii=True))
