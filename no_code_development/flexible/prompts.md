# 1 Idea to PRD

Act as a senior product manager. Write a concise PRD for a local MVP called "Solver#42" for CUHK Business School.

The product must run locally (Python backend + Dockerized PostgreSQL/MongoDB), support role-based access by email domain (teacher vs student), generate standard answers with LLM + web search context, save outputs to both database and local workspace files, and provide a one-click startup script.

Output in Markdown with these sections only: Product Overview, Core Design Decisions, System Architecture, Feature List, Acceptance Criteria, and Project Summary.


# 2 PRD to roadmap


You are a senior Tech Lead and Delivery Manager. Your task is to convert a PRD into an execution-ready roadmap that maximizes reproducibility for a local MVP demo.

## Inputs
- PRD document: @AI_Learning_Assistant
- Project goal: Local runnable MVP (demo-grade), prioritize reproducibility over perfection
- Constraints:
  1. Keep only minimal necessary complexity (no over-engineering)
  2. Decouple development by dependency order
  3. Each module must be implementable by one agent with minimal context
  4. Final result must support one-click local launch and pass verification

## Output Format
Output exactly one Markdown document with title:
`Roadmap for <ProjectName>`

The document must contain all sections below:

1. Scope & Assumptions
- In-Scope (must be delivered in this iteration)
- Out-of-Scope (explicitly excluded)
- Assumptions (environment/account/network prerequisites)

2. Environment Lock
- OS / Python / Docker / DB / key dependency versions
- Fixed ports and directory conventions
- Environment variable list (name, required/optional, example value)

3. Phase Plan (3-7 phases in dependency order)
Use this exact template for every phase:

## Phase N: <Name>
- Goal:
- Inputs:
- Tasks (max 7):
- Outputs/Artifacts (must be concrete files/APIs/scripts):
- Interface Contract (API/schema/state flow):
- Gate Checks (command + expected result):
- Risks:
- Rollback/Recovery:
- Handoff Notes (minimum context for next agent):

4. Integration & E2E
- Integration sequence
- Minimum end-to-end user flow
- Verification commands and pass criteria

5. Reproducibility Checklist
- Fresh-machine rerun steps (Step 1..N)
- Common failures and troubleshooting
- Definition of Done (all must pass)

## Hard Rules
- Command-verifiable: each phase must have at least 2 gate checks
- Artifact-handoff: each phase must produce at least 2 concrete artifacts
- Clear boundaries: explicitly list what is NOT implemented
- No vague narrative, no retrospective storytelling, no slogans
- Keep language concise; prefer checklists/tables

## Self-Check Before Final Output
Before returning the roadmap, silently validate and fix:
- Does every phase include Inputs/Outputs/Gate/Rollback?
- Is every acceptance criterion command-verifiable?
- Are all cross-phase dependencies explicitly declared?
- Can a new engineer rerun this on a fresh machine with only this roadmap?
If any answer is "no", revise before output.

## API Key

Refer to @Bianxie.ipynb to fetch LLM API needed and the way to call it.

# 3 roadmap to MVP

Refer to @roadmap.md, develop the local MVP of Solver 42 step by step. Note Docker Desktop is running now. Ask me to check after each step finished.