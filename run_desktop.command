#!/bin/zsh
set -u

export PATH="/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:${PATH:-}"

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR" || exit 1

LOG_DIR="${SCRIPT_DIR}/data/logs"
mkdir -p "$LOG_DIR" >/dev/null 2>&1 || true
LOG_FILE="${LOG_DIR}/launcher-$(date +%Y%m%d-%H%M%S).log"
exec > >(tee -a "$LOG_FILE") 2>&1

PROJECT_TITLE="AI Learning Assistant"
PROJECT_NAME="ai-learning-assistant"
BACKEND_URL="${AILA_BACKEND_URL:-http://127.0.0.1:14242}"

pause_on_failure() {
  if [ -t 0 ] && [ "${AILA_NO_PAUSE:-}" != "1" ]; then
    echo
    echo "Press any key to close this window."
    read -k 1 _unused
  fi
}

fail() {
  echo
  echo "Launch failed: $1"
  echo "Log file: ${LOG_FILE}"
  pause_on_failure
  exit 1
}

wait_for_backend() {
  for _ in {1..180}; do
    if curl -fsS "${BACKEND_URL}/health" >/dev/null 2>&1; then
      return 0
    fi
    sleep 2
  done
  return 1
}

echo "$PROJECT_TITLE"
echo "Launcher log: ${LOG_FILE}"
echo "Checking Docker Desktop..."

if [ -x "apps/desktop/node_modules/.bin/electron" ] && command -v node >/dev/null 2>&1; then
  echo "Starting Electron shell..."
  echo "The desktop window will handle Docker startup and show any startup errors."
  (
    cd apps/desktop || exit 1
    ./node_modules/.bin/electron .
  )
  electron_status=$?
  if [ "$electron_status" -ne 0 ]; then
    fail "Electron exited with status ${electron_status}."
  fi
  exit 0
fi

echo "Electron dependencies are not installed or Node.js is not on PATH."
echo "Starting the rebuilt Docker runtime directly and opening the browser fallback."

if ! command -v docker >/dev/null 2>&1; then
  fail "Docker Desktop was not found. Install Docker Desktop, then run this launcher again."
fi

if ! docker info >/dev/null 2>&1; then
  echo "Docker Desktop is installed but not running. Attempting to open it..."
  open -a Docker >/dev/null 2>&1 || true
  for _ in {1..60}; do
    if docker info >/dev/null 2>&1; then
      break
    fi
    if [ $((_ % 5)) -eq 0 ]; then
      echo "Still waiting for Docker Desktop... ${_}/60"
    fi
    sleep 2
  done
fi

if ! docker info >/dev/null 2>&1; then
  fail "Docker Desktop did not become ready. Start Docker Desktop and run this launcher again."
fi

docker compose -p "$PROJECT_NAME" up -d || fail "Docker Compose could not start the backend."
echo "Waiting for backend health..."
if ! wait_for_backend; then
  echo "Backend did not become healthy. Recent backend logs:"
  docker compose -p "$PROJECT_NAME" logs --tail=80 backend || true
  fail "Backend health check timed out."
fi
echo "Workbench: ${BACKEND_URL}/ui/"
open "${BACKEND_URL}/ui/" >/dev/null 2>&1 || true
