<!--
Owner: project-maintainer
Last Reviewed: 2026-06-09
Status: Active
-->

# Decision: Split macOS Launchers Into Stable .command Stubs Plus scripts/ Logic

## Status

Accepted for the local macOS dev/QA launcher workflow.

## Date

2026-06-09

## Context

`run_web.command` and `run_desktop.command` at the project root are the only sanctioned double-click entry points for the local dev/QA workflow on macOS. On macOS Sequoia/Tahoe, whenever Cursor (or any other GUI app without an "App Management" entitlement) writes to a file, the kernel attaches the `com.apple.provenance` extended attribute. `AppleSystemPolicy` (ASP) then refuses to `execve()` that file when it is launched from Finder/Terminal.app, and the process is SIGKILL'd in the kernel before the script's first `echo`. The result is a silent "double-click does nothing, no launcher log under `data/logs/`" failure that is indistinguishable from a missing Docker daemon or a broken script unless the human inspects `/usr/bin/log show --predicate 'eventMessage CONTAINS "AppleSystemPolicy"'`.

The provenance xattr is kernel-managed and cannot be removed by `xattr -d` or `xattr -c` from inside Cursor's process tree, because the kernel immediately re-tags any file Cursor touches. A workflow that requires the human to re-bless launcher files after every agent edit is not acceptable for routine development.

## Decision

Split each macOS launcher into two layers:

1. A small, stable stub at the project root (`run_web.command`, `run_desktop.command`). The stub is ~10 lines, only computes its own directory and `exec`s `/bin/zsh` on the real launcher script. The stub MUST NOT be edited from Cursor or any other GUI app. `.cursor/rules/launcher-stability.mdc` encodes this constraint for AI agents.
2. The real launcher logic under `scripts/launcher-web.sh` and `scripts/launcher-desktop.sh`. These files may be freely edited by Cursor or any other tool. The stub invokes them as `exec /bin/zsh ./scripts/launcher-X.sh`, which only triggers ASP on `/bin/zsh` (Apple-signed, always allowed); the script argument is read as data by zsh, never `execve`'d directly, so ASP does not inspect it.

A one-shot human repair script `scripts/bless-launchers.sh` recreates the stubs on fresh inodes from the human's Terminal.app to strip leftover provenance xattrs if a stub is ever accidentally rewritten. The script is idempotent and safe to re-run; it does not work when invoked from Cursor's terminal because Cursor's process tree re-tags the new files immediately.

## Consequences

- Positive:
  - Double-click launch from Finder works reliably across agent edits to launcher logic.
  - All launcher-logic iteration happens under `scripts/`, where Cursor can write freely with no host-OS side effects.
  - The failure mode (silent SIGKILL before logging) becomes detectable: any agent that triggers it has violated the `.cursor/rules/launcher-stability.mdc` constraint, and the fix path is a single command.
  - The project-folder-level fix is portable to other contributors without requiring host-level System Settings changes.
- Negative:
  - One additional indirection level when reading what a launcher does (stub -> `scripts/launcher-X.sh`).
  - The human must run `bash scripts/bless-launchers.sh` once after this ADR lands, and again only if the rule is later violated.
- Follow-up:
  - Native packaged launchers (signed `.app` bundles or pkg installers) supersede the stub design when phase C ships them; this ADR applies only to the host-side dev/QA `.command` workflow.

## Alternatives Considered

- Programmatic `xattr` cleanup from inside the script: rejected because Cursor's process tree immediately re-tags the file, and kernel-managed `com.apple.provenance` is not removable from a Cursor-spawned process.
- Granting Terminal.app or Cursor "App Management" permission system-wide: rejected because the human asked for a project-folder-level fix that does not depend on host-level System Settings or other contributors having to replicate them.
- Single self-contained `.command` file that re-`exec`s itself via a clean process: rejected because ASP rejects the initial `execve()` before any in-script logic can run.
- Replacing the `.command` files with a signed launcher binary: deferred until the packaging phase; out of scope for the dev/QA workflow.

## Supersedes

None.
