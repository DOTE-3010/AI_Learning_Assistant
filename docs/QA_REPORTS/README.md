<!--
Owner: project-maintainer
Last Reviewed: 2026-06-05
Status: Active
-->

# QA Reports

## Purpose

This directory stores durable summaries from whole-product QA. Reports should capture evidence, blockers, risks, fixes, retests, and human decisions without requiring future agents to search chat history.

## Filename Pattern

Use:

```text
YYYY-MM-DD-<phase>-<short-slug>.md
```

Examples:

- `2026-06-03-agent-module-smoke.md`
- `2026-06-03-agent-integration.md`
- `2026-06-04-human-e2e.md`
- `2026-06-05-human-e2e-completion.md`

## Required Sections

Each report should include:

- `## Scope`
- `## Commands And Results`
- `## Blockers`
- `## Risks`
- `## Fixes Applied`
- `## Retest Results`
- `## Human Decisions Needed`

## Safety Rules

- Do not include raw API keys, bearer tokens, private uploaded document text, full prompts, or copied proprietary source material.
- Summarize logs. Include only the shortest useful excerpt when a failure needs evidence.
- If a report records an accepted risk, name who accepted it and on what date.
