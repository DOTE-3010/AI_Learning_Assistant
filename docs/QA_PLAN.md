<!--
Owner: project-maintainer
Last Reviewed: 2026-06-05
Status: Active
-->

# Whole-Product QA Plan

## Purpose

This plan governs the post-development QA phase for the phase-1 Electron plus Docker product. It turns the human-requested QA order into repo-native instructions so rotating agents can test, report, fix, and hand off without relying on hidden chat context.

## Source Context

- `docs/IMPLEMENTATION_SUMMARY.md` for what the completed development queue claims to have built.
- `docs/SPEC.md` for product acceptance criteria.
- `docs/ARCH.md` for module boundaries.
- `docs/RULES.md` for testing, security, and review rules.
- `docs/CONTRACTS/` for stable interfaces.
- `docs/TASKS/` for the active QA task queue.

## Pre-QA Entry Gate

QA could not start while the former pre-QA upload blocker was open. The backend upload API is part of the existing upload contract and phase-1 product acceptance criteria, so its absence was treated as a blocker rather than a QA risk.

As of 2026-06-03, the upload blocker was resolved and the agent QA sequence proceeded through smoke, module functional, and integration testing. As of 2026-06-05, the human cleared the completed numbered QA queue from `docs/TASKS/`; durable QA results remain under `docs/QA_REPORTS/`, and the current active task is `docs/TASKS/001-pre-e2e-runtime-contract-repairs.md`.

The upload blocker is cleared only when:

- `POST /api/uploads` accepts authenticated multipart uploads for the phase-1 file types in `docs/CONTRACTS/uploads.md`.
- `GET /api/uploads/{id}` returns authenticated metadata without raw bytes.
- Upload bytes are stored on disk and metadata is stored in SQLite without path traversal.
- Backend tests cover success, auth, validation, unsupported media type, and oversized-file behavior.
- The mocked smoke path no longer intentionally avoids upload coverage.

## QA Sequence

QA must run in this order:

1. Agent module smoke tests.
2. Agent module unit/functional tests.
3. Agent integration tests.
4. Human end-to-end functional tests.

Do not begin QA until the pre-QA entry gate is closed. Do not advance to the next QA phase while open blockers remain in the current phase. Non-blocking risks may advance only after the human accepts them or asks an agent to fix them.

## Ownership

- Agents execute phases 1 through 3, report blockers and risks to the human after testing, then fix blockers and human-approved risks.
- The human executes phase 4. Agents may prepare the checklist and later fix human-reported blockers or human-selected risks.
- Agents must not silently convert QA into feature work. Any new feature, contract change, auth semantic change, secret-storage change, model default change, or distribution decision needs human approval.

## Module Map

| Module | Smoke focus | Unit/functional focus | Integration focus |
| --- | --- | --- | --- |
| Backend API | App imports, route registration, health endpoint, auth guard basics, upload route registration | Auth, settings, uploads, runs, error envelope, run events | Authenticated upload plus run creation through mocked provider |
| SQLite storage | Database initialization and migration path | Repository behavior for users, sessions, model profiles, runs, uploads, artifacts, citations | Data survives container/app restart where practical |
| Artifact filesystem | Workspace root creation and path safety | Manifest, logs, output files, traversal rejection | Host-mounted workspace contains expected run folder |
| Model provider | Mock provider and profile validation load | Redaction, missing key/auth/unavailable errors, context window hints | Mocked OpenAI-compatible flow produces a run without live secrets |
| Context/search/revision | Context builder imports and policy defaults | Upload extraction, search mode policy, context estimates, revision budgeting | Uploaded inputs can feed a mocked run where the intent supports them |
| Pipelines | Router resolves explicit intents | Code, essay, Beamer, and cheat-sheet pipeline behavior | At least one full mocked run writes manifest and output |
| Frontend workbench | Vite build and static asset serving | Auth flow, locale catalog, controls, preview states, context dial behavior | `/ui/` served by backend and linked assets load |
| Desktop/runtime | Electron smoke script and Compose config | Docker detection/startup script behavior where testable | Docker runtime boots backend and serves workbench |
| Governance/docs | Governance check passes | Active tasks and reports stay current | QA reports preserve risk/fix decisions |

## Blockers And Risks

A blocker prevents phase exit. Examples: a verification command cannot run, a product acceptance criterion is impossible, a core module cannot import/start, a required API contract is missing, a security rule is violated, or a generated artifact cannot be created in the mocked phase-1 path.

A risk is non-blocking but important. Examples: missing coverage, brittle fallback behavior, unverified live-provider behavior, locale layout uncertainty, performance concern, dependency warning, or future packaging concern.

## Agent QA Report Format

Each agent-executed QA phase must report to the human before fixes and again after fixes. Reports should also be saved under `docs/QA_REPORTS/` when the phase produces lasting findings.

Use this shape:

```markdown
# QA Report: <phase>

## Scope
- Task file:
- Modules covered:

## Commands And Results
| Command/check | Result | Notes |
| --- | --- | --- |

## Blockers
- <blocker, affected module, evidence, proposed fix>

## Risks
- <risk, likelihood/impact, proposed disposition>

## Fixes Applied
- <file/module, change, reason>

## Retest Results
- <command/check and result>

## Human Decisions Needed
- <decision, options, recommendation>
```

Do not include raw API keys, authorization tokens, private uploaded document text, or full prompts in QA reports.

## Advancement Rules

- A phase is complete only when its verification commands/checks have run, blockers are fixed or explicitly waived by the human, and risks are listed with a human disposition.
- If a fix changes product behavior, rerun the narrow failed check and the nearest broader check.
- If a fix changes a contract, update the contract and matching tests in the same follow-up task after human approval.
- If a command is skipped, record why, what it would have covered, and whether the skip is a blocker or accepted risk.
- The human end-to-end phase should not start until agent module smoke, agent unit/functional, and agent integration phases have no open blockers.
