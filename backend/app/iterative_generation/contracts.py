from __future__ import annotations

from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from typing import Dict, List, Optional


@dataclass
class PromptSections:
    task_definition: str
    technical_description: str
    iteration_state: str
    quality_bar: str
    output_contract: str
    context_bundle: str


@dataclass
class ContextPacket:
    session_id: str
    turn_number: int
    history_summary: str
    retrieved_memory: str
    artifacts: str
    low_priority_context: str = ""


@dataclass
class PromptPayload:
    system_message: str
    user_message: str
    section_map: Dict[str, str]


@dataclass
class TokenEstimate:
    estimated_input_tokens: int
    estimated_output_tokens: int
    estimated_total_tokens: int
    context_window_limit: int
    utilization_ratio: float
    safety_margin_tokens: int
    section_breakdown: Dict[str, int]


@dataclass
class IterationResult:
    final_output: str
    turn_outputs: List[str] = field(default_factory=list)
    telemetry_events: List[Dict] = field(default_factory=list)


class ContextManager(ABC):
    @abstractmethod
    def build_context(
        self,
        session_id: str,
        turn_number: int,
        prompt_sections: PromptSections,
        previous_outputs: List[str],
    ) -> ContextPacket:
        raise NotImplementedError

    @abstractmethod
    def compress_context(self, context_packet: ContextPacket, level: str) -> ContextPacket:
        raise NotImplementedError


class PromptCompiler(ABC):
    @abstractmethod
    def compile(self, prompt_sections: PromptSections, context_packet: ContextPacket) -> PromptPayload:
        raise NotImplementedError


class ModelGateway(ABC):
    @abstractmethod
    def generate(self, payload: PromptPayload) -> str:
        raise NotImplementedError


class TokenEstimator(ABC):
    @abstractmethod
    def estimate(self, payload: PromptPayload, target_output_tokens: int) -> TokenEstimate:
        raise NotImplementedError


class TelemetrySink(ABC):
    @abstractmethod
    def emit(self, event_name: str, payload: Dict) -> None:
        raise NotImplementedError
