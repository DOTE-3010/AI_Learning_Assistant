#!/bin/zsh
set -e

cd "$(dirname "$0")"

PROJECT_NAME="ai-learning-assistant"
BACKEND_URL="${AILA_BACKEND_URL:-http://127.0.0.1:14242}"

wait_for_backend() {
  for _ in {1..180}; do
    if curl -fsS "${BACKEND_URL}/health" >/dev/null 2>&1; then
      return 0
    fi
    sleep 2
  done
  return 1
}

echo "AI Learning Assistant"
echo "Checking Docker Desktop..."

if ! command -v docker >/dev/null 2>&1; then
  echo "Docker Desktop was not found. Install Docker Desktop, then run this launcher again."
  exit 1
fi

if ! docker info >/dev/null 2>&1; then
  echo "Docker Desktop is installed but not running. Attempting to open it..."
  open -a Docker >/dev/null 2>&1 || true
  for _ in {1..60}; do
    if docker info >/dev/null 2>&1; then
      break
    fi
    sleep 2
  done
fi

if ! docker info >/dev/null 2>&1; then
  echo "Docker Desktop did not become ready. Start Docker Desktop and run this launcher again."
  exit 1
fi

if [ -x "apps/desktop/node_modules/.bin/electron" ]; then
  echo "Starting Electron shell..."
  npm --prefix apps/desktop run start
else
  echo "Electron dependencies are not installed; starting the rebuilt Docker runtime directly."
  docker compose -p "$PROJECT_NAME" up -d
  echo "Waiting for backend health..."
  if ! wait_for_backend; then
    echo "Backend did not become healthy. Recent backend logs:"
    docker compose -p "$PROJECT_NAME" logs --tail=80 backend || true
    exit 1
  fi
  echo "Workbench: ${BACKEND_URL}/ui/"
  open "${BACKEND_URL}/ui/" >/dev/null 2>&1 || true
fi
