<!--
Owner: project-maintainer
Status: Pending
Phase: 4 — Electron Packaging
Depends: 010, 011, 012
-->

# Task 013: Electron Packaging for Release

## Goal

Re-verify and update the Electron shell to package the HTML-native web product for desktop distribution. Confirm Docker detection, backend health, window lifecycle, and the complete generation flow works through the Electron wrapper.

## Scope

### Touch

- `apps/desktop/`: Electron shell configuration, main process, preload scripts.
- `scripts/launcher-desktop.sh`: verify Docker startup commands still work with the slimmer image.
- `compose.yml`: verify no LaTeX-related configuration remains.
- Electron packaging config (electron-builder or equivalent).

### Do Not Touch

- Backend pipeline code (already migrated).
- Frontend code (already updated).
- Database schema.

## Steps

1. Verify Docker image builds and starts from the Electron launcher:
   ```bash
   npm --prefix apps/desktop run build
   npm --prefix apps/desktop run smoke
   ```

2. Update any Electron-specific configuration:
   - If the Electron main process references LaTeX or TeX-related health checks, remove them.
   - Verify the Docker health check endpoint (`/health`) still works.
   - Verify the workbench URL (`/ui/`) loads correctly in the Electron BrowserWindow.

3. Test the complete flow through Electron:
   - App launches → Docker starts → backend healthy → workbench loads.
   - User can register/login, configure model settings, create a run.
   - Generated HTML preview appears in the artifact panel.
   - PDF download works.

4. Update launcher scripts if needed:
   - `scripts/launcher-desktop.sh`: verify it doesn't reference TeX Live or LaTeX.
   - `scripts/launcher-web.sh`: same verification.

5. Run the desktop smoke test:
   ```bash
   npm --prefix apps/desktop run launch-smoke
   ```

6. Verify dependency audit:
   ```bash
   npm --prefix apps/desktop audit --json
   ```

## Verification Commands

```bash
npm --prefix apps/desktop run build
npm --prefix apps/desktop run smoke
npm --prefix apps/desktop run launch-smoke
npm --prefix apps/desktop audit --json
docker compose -p ai-learning-assistant config
```

## Acceptance Criteria

- Electron shell builds without errors.
- Desktop smoke test passes.
- Docker image starts from the Electron launcher and backend responds.
- The workbench loads and HTML artifact previews render in the Electron window.
- No references to LaTeX, TeX Live, or latexmk in Electron or launcher code.
- `compose.yml` has no LaTeX-related configuration.
- Launch smoke passes on macOS.

## Non-Goals

- Do not implement code signing or notarization (future phase).
- Do not add auto-update or crash reporting.
- Do not change the Electron shell architecture (it's a thin wrapper).
- This task blocks on human declaration that the web product is acceptable.

## Human Gate

Phase 4 does not begin until the human explicitly declares Phases 1–3 complete and the web product acceptable for packaging.
