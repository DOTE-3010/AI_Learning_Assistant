<!--
Owner: project-maintainer
Last Reviewed: 2026-06-01
Status: Active
-->

# Contract: Artifact Filesystem

## Purpose

Generated work must be visible, portable, and inspectable as normal files.

## Root

First-phase default:

```text
workspace/
```

Future tasks may introduce a user-selectable project root. Any root must be mounted into Docker and accessible from Electron.

## Run Folder Shape

```text
workspace/
  <safe-user-or-local>/
    <safe-project-title>/
      runs/
        <run-id>/
          input/
            task.md
            uploads/
          output/
            main.tex
            main.pdf
            solution.py
            solution.ipynb
            slides.tex
            slides.pdf
            cheat-sheet.tex
            cheat-sheet.pdf
          logs/
            generation.log
            latex.log
          manifest.json
```

Only files relevant to a run need to exist.

## `manifest.json`

```json
{
  "schema_version": 1,
  "run_id": "01H...",
  "revision_of_run_id": null,
  "intent": "essay_latex",
  "created_at": "2026-05-31T00:00:00Z",
  "model": {
    "provider": "openai_compatible",
    "model": "qwen-plus"
  },
  "search": {
    "mode": "auto",
    "used": true,
    "citations": [
      {"title": "Source title", "url": "https://example.com"}
    ]
  },
  "inputs": [
    {"path": "input/task.md", "kind": "task"},
    {"path": "input/uploads/reference.pdf", "kind": "upload"}
  ],
  "outputs": [
    {"path": "output/main.tex", "kind": "source"},
    {"path": "output/main.pdf", "kind": "pdf"}
  ],
  "status": "succeeded"
}
```

## Filename Rules

- Sanitize path segments.
- Preserve original upload extension when safe.
- Avoid overwriting by using run-specific folders.
- Revision runs always create a new run-specific folder and may reference the prior run id in `manifest.json`; they never overwrite previous output.
- Never write outside the configured root.
- Keep `.tex` source even if PDF compilation fails.

## Artifact Kinds

| Intent | Required Output | Optional Output |
| --- | --- | --- |
| `code_homework` | `.py` or `.ipynb` | README, tests |
| `essay_latex` | `main.tex` | `main.pdf`, references |
| `beamer_slides` | `slides.tex` | `slides.pdf`, speaker notes |
| `cheat_sheet` | `cheat-sheet.tex` | `cheat-sheet.pdf`, extraction notes |

## Errors

Filesystem failures are surfaced through the run, not as a separate transport. Uses the canonical envelope (`errors.md`):

- A path-traversal or unsafe-segment attempt is refused and the run fails with `internal_error` (sanitized message; never echoes the offending absolute path).
- A `compile_failed` run still writes `output/*.tex` and `logs/latex.log`, plus a `manifest.json` with `status: failed`.

## Validation Rules

- All writes stay within the configured workspace root; `..` and absolute segments are rejected.
- `manifest.json` is written last for a succeeded run so its presence implies completeness.
- Every path listed in `manifest.json` `inputs`/`outputs` exists on disk when `status` is `succeeded`.

## Compatibility

- Additive: new optional `manifest.json` keys, new artifact `kind` values, new optional output files.
- Breaking (ADR required): bumping `schema_version`, renaming the `input/`/`output/`/`logs/` layout, or changing the run-folder path scheme.

## Versioning

- `manifest.json` carries `schema_version` (currently `1`). Readers must tolerate unknown additive keys.

## Acceptance Checks

- Every succeeded run has `manifest.json`.
- Failed LaTeX runs still keep source and logs.
- Electron can reveal the run folder in the host filesystem.
- SQLite artifact rows point to files that exist.

## Open Questions

- Whether to support a user-selectable project root in phase 1 or keep `workspace/` fixed until the desktop shell lands.
