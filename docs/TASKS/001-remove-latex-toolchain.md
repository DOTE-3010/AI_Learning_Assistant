<!--
Owner: project-maintainer
Status: Completed
Phase: 1 — Cleanup
-->

# Task 001: Remove LaTeX Toolchain from Docker

## Goal

Strip TeX Live and all LaTeX compilation dependencies from the Docker image, reducing image size by ~400 MB and eliminating the old compilation pathway.

## Scope

### Touch

- `Dockerfile`: remove all `texlive-*`, `latexmk`, `fonts-lmodern`, `lmodern` packages.
- `backend/requirements.txt`: remove any LaTeX-related Python dependencies if present.
- `compose.yml`: no LaTeX-related environment variables or volume mounts to clean up (verify).

### Do Not Touch

- Pipeline Python code (handled in tasks 004–007).
- Frontend code.
- Database schema.
- Test files (handled in task 010).

## Steps

1. Open `Dockerfile` and remove the TeX Live apt-get block:
   ```
   fonts-lmodern
   lmodern
   latexmk
   texlive-fonts-recommended
   texlive-latex-base
   texlive-latex-extra
   texlive-latex-recommended
   texlive-xetex
   ```
2. Keep `ca-certificates` (needed for HTTPS/pip).
3. Verify `docker compose -p ai-learning-assistant build` succeeds and the resulting image is significantly smaller.
4. Verify `docker compose -p ai-learning-assistant up -d && curl -fsS http://localhost:14242/health` still passes (the backend starts without TeX Live).

## Verification Commands

```bash
docker compose -p ai-learning-assistant build
docker compose -p ai-learning-assistant up -d
curl -fsS http://localhost:14242/health
docker images ai-learning-assistant --format '{{.Size}}'
docker compose -p ai-learning-assistant down
```

## Acceptance Criteria

- No `texlive` or `latexmk` packages in `Dockerfile`.
- Docker image builds successfully.
- Backend `/health` endpoint responds.
- Image size is noticeably smaller than before (~400 MB reduction).

## Non-Goals

- Do not add Playwright yet (task 002).
- Do not modify any Python pipeline code yet.
