# Roadmap: Decoupled Multi-Turn Iterative Assignment Generation with Context Management

## 1. Objective

Build an incremental, decoupled feature for **multi-turn iterative assignment generation** that:

- Starts with **LangChain-based context management**.
- Uses a **structured, modular prompt contract** so core components remain swappable.
- Enables replacing stack-level implementations (e.g., LangChain vs. native APIs) by editing only the **technical description layer**, not the orchestration logic.
- Includes a **real-time token-counting utility** for context-window observability during integration testing.
- Is implementation-ready for **one-shot, high-quality execution by advanced AI coding models**.

---

## 2. Scope and Non-Goals

### In Scope

- Multi-turn assignment generation with stateful iteration.
- Context pipeline abstraction (memory retrieval, summarization, truncation, ordering).
- Structured prompt framework with strict section contracts.
- LangChain-first adapter implementation.
- Token usage estimation and budget telemetry.
- Integration test hooks for context growth and token safety.

### Out of Scope (Phase 1)

- Full UI redesign.
- Long-term vector DB optimization beyond baseline retrieval.
- Cross-tenant memory federation.
- Multi-model routing optimization.

---

## 3. Design Principles

1. **Component Swappability First**  
   Define interfaces before implementation. Stack-specific logic must stay behind adapters.

2. **Prompt as Contract, Not String**  
   Prompt structure is a typed schema with independent sections and validation rules.

3. **Incremental Delivery**  
   Each phase yields a deployable slice with explicit acceptance criteria.

4. **Token Safety and Observability**  
   Every request computes estimated token load and logs budget margins.

5. **Deterministic Integration Signals**  
   Integration tests assert quality via stable metrics (token envelope, response shape, iteration continuity).

---

## 4. Target Architecture (Decoupled)

## 4.1 Core Modules

- `AssignmentOrchestrator`
  - Runs iterative turn loop.
  - Calls context manager, prompt builder, model gateway, and post-processor.
- `ContextManager` (interface)
  - Builds current context packet from session history and optional retrieval.
  - Applies compression/truncation strategy.
- `PromptCompiler` (interface)
  - Converts structured prompt schema + context packet into final model payload.
- `ModelGateway` (interface)
  - Executes model call through current stack adapter.
- `TokenEstimator` (interface)
  - Estimates token usage before dispatch; logs total + by-section estimates.
- `TelemetrySink` (interface)
  - Emits integration-test-safe metrics/events.

## 4.2 Adapter Layer

- `LangChainContextAdapter` (Phase 1 default)
  - Concrete `ContextManager` implementation using LangChain memory/chains.
- `NativeAPIContextAdapter` (Phase 2 candidate)
  - Drop-in replacement using direct provider APIs.
- `LangChainGatewayAdapter` (optional if model calls remain LangChain-based).
- `NativeAPIGatewayAdapter` (optional if model calls go direct).

## 4.3 Dependency Rule

Orchestrator and prompt schema must depend only on interfaces, never on LangChain classes.

---

## 5. Structured Modular Prompt Specification

Use a machine-readable prompt object composed of immutable sections.

### 5.1 Prompt Schema (Conceptual)

- `task_definition`
  - user objective, constraints, success definition.
- `technical_description`
  - stack-specific implementation notes (this is the swap point).
- `iteration_state`
  - turn index, previous outputs, unresolved issues, refinement goals.
- `quality_bar`
  - required depth, edge-case handling, style constraints.
- `output_contract`
  - strict output shape (sections, JSON schema, formatting requirements).
- `context_bundle`
  - retrieved memory, summarized history, and relevant artifacts.

### 5.2 Swappability Rule

When changing stack (LangChain -> native APIs), update only:

- `technical_description` templates
- relevant adapter implementation

Do **not** modify:

- orchestrator flow
- iteration logic
- prompt section names/semantics
- token observability contract

---

## 6. Token Counting and Context Observability

## 6.1 TokenEstimator Requirements

- Estimate tokens for:
  - each prompt section
  - cumulative input
  - target output allowance
  - total predicted context usage
- Return:
  - `estimated_input_tokens`
  - `estimated_output_tokens`
  - `estimated_total_tokens`
  - `context_window_limit`
  - `utilization_ratio`
  - `safety_margin_tokens`
  - section-level breakdown map

## 6.2 Real-Time Integration Hooks

At every turn, emit telemetry event `context_window_estimate` with:

- session ID, turn number
- estimator backend used
- token estimates and ratio
- warning level:
  - `ok` (<70%)
  - `warning` (70-85%)
  - `critical` (>85%)

## 6.3 Guardrail Policy

- If `warning`: trigger adaptive compression before send.
- If `critical`: force summary compaction + drop low-priority context.
- If still above threshold: fail gracefully with structured retry guidance.

---

## 7. Incremental Delivery Plan

## Phase 0: Contracts and Skeleton (1-2 days)

Deliverables:

- Interface definitions for all core modules.
- Prompt schema definition and validator.
- No-op adapters + telemetry event schema.

Acceptance Criteria:

- Orchestrator compiles with dependency inversion.
- End-to-end dry run passes with mock implementations.

## Phase 1: LangChain-First Functional Path (2-4 days)

Deliverables:

- `LangChainContextAdapter` implementation.
- `PromptCompiler` with section-based assembly.
- `ModelGateway` wired to current model path.

Acceptance Criteria:

- Multi-turn generation works for at least 3 iterative turns.
- Turn `n` output demonstrates use of turn `n-1` state.

## Phase 2: Token Observability Integration (1-2 days)

Deliverables:

- Production `TokenEstimator`.
- `context_window_estimate` telemetry events.
- Threshold guardrails and fallback logic.

Acceptance Criteria:

- Integration logs show per-turn token estimates.
- Warning and critical thresholds are reproducibly triggered in test scenarios.

## Phase 3: Stack-Swappability Validation (1-2 days)

Deliverables:

- `NativeAPIContextAdapter` scaffold (or proof-of-swap branch).
- Alternate `technical_description` template set.
- Adapter selection config flag.

Acceptance Criteria:

- Swap executed by config + technical description change only.
- No orchestrator or schema modifications required.

## Phase 4: Hardening for One-Shot AI Development (1-2 days)

Deliverables:

- Golden-path integration scripts/checklist.
- Prompt quality fixtures for difficult iterative cases.
- Failure mode catalog + mitigation playbook.

Acceptance Criteria:

- Advanced AI model can implement or extend feature in one pass using this roadmap.
- Core quality gates pass without manual re-architecture.

---

## 8. Integration Testing Strategy

## 8.1 Core Test Scenarios

1. **Iteration Continuity**
   - Verify each turn references and refines previous output.
2. **Context Growth Stress**
   - Simulate long sessions and validate compression behaviors.
3. **Token Threshold Response**
   - Assert warning/critical behavior and fallback sequence.
4. **Stack Swap Simulation**
   - Replace technical description + adapter and verify parity.
5. **Output Contract Compliance**
   - Ensure strict output schema remains valid across turns.

## 8.2 Required Test Metrics

- turn completion rate
- contract-valid response rate
- average token utilization ratio
- overflow-prevention success rate
- latency delta after compression

---

## 9. Implementation Blueprint for Advanced AI Models

Use this sequence to maximize one-shot quality:

1. Generate interface files first from Sections 4 and 6.
2. Implement prompt schema and validator from Section 5.
3. Wire orchestrator with dependency injection only.
4. Implement LangChain adapter and pass Phase 1 acceptance tests.
5. Add TokenEstimator + telemetry and pass threshold scenarios.
6. Add swappability validation by implementing a second adapter scaffold.
7. Execute hardening checklist and freeze contracts.

---

## 10. Risks and Mitigations

- **Risk:** Prompt section drift across teams  
  **Mitigation:** enforce schema validation and versioned prompt contracts.

- **Risk:** LangChain-specific assumptions leak into core logic  
  **Mitigation:** ban external stack imports in orchestrator and compiler modules.

- **Risk:** Token estimates differ from provider billing  
  **Mitigation:** log estimator-vs-actual deltas and recalibrate estimation factors.

- **Risk:** Quality drops under aggressive context compression  
  **Mitigation:** preserve priority-ranked context fields and evaluate with golden cases.

---

## 11. Definition of Done

Feature is complete when:

- Multi-turn iterative assignment generation is stable in integration tests.
- Context management is LangChain-powered but fully adapter-isolated.
- Stack swap requires only adapter/config + technical description updates.
- Real-time token estimation is visible and actionable per turn.
- Roadmap acceptance criteria for Phases 0-4 are met.
