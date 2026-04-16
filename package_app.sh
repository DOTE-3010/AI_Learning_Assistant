#!/bin/bash
# AI Learning Assistant Distribution Packager

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$SCRIPT_DIR"

# Priority: first CLI arg > DIST_DIR env var > default folder name.
TARGET_DIR_INPUT="${1:-${DIST_DIR:-ai_learning_assistant_dist}}"
if [[ "$TARGET_DIR_INPUT" = /* ]]; then
    DIST_DIR="$TARGET_DIR_INPUT"
else
    DIST_DIR="$PROJECT_ROOT/$TARGET_DIR_INPUT"
fi

COMPOSE_DEV="$PROJECT_ROOT/docker-compose.yml"
COMPOSE_DIST="$PROJECT_ROOT/docker-compose-dist.yml"
MAC_STARTER="$PROJECT_ROOT/start_dist_mac.command"
WIN_STARTER="$PROJECT_ROOT/start_dist_win.bat"

for required_file in "$COMPOSE_DEV" "$COMPOSE_DIST" "$MAC_STARTER" "$WIN_STARTER"; do
    if [[ ! -f "$required_file" ]]; then
        echo "Error: required file missing: $required_file"
        exit 1
    fi
done

echo "Starting packaging..."
echo "Target directory: $DIST_DIR"

echo "Building latest backend image..."
docker compose -f "$COMPOSE_DEV" build backend

echo "Preparing output directory..."
rm -rf "$DIST_DIR"
mkdir -p "$DIST_DIR/images" "$DIST_DIR/workspace"

echo "Tagging backend image for distribution..."
if docker image inspect ai_learning_assistant-backend:latest >/dev/null 2>&1; then
    docker tag ai_learning_assistant-backend:latest ai_learning_assistant:latest
elif docker image inspect ai_learning_assistant_backend:latest >/dev/null 2>&1; then
    docker tag ai_learning_assistant_backend:latest ai_learning_assistant:latest
elif docker image inspect ai_learning_assistant:latest >/dev/null 2>&1; then
    echo "ai_learning_assistant:latest already exists."
else
    echo "Error: backend image not found after build."
    exit 1
fi

echo "Verifying database images..."
for img in postgres:15-alpine mongo:7.0; do
    if ! docker image inspect "$img" >/dev/null 2>&1; then
        echo "Pulling missing image: $img"
        docker pull "$img"
    fi
done

echo "Exporting docker images..."
docker save -o "$DIST_DIR/images/backend.tar" ai_learning_assistant:latest
docker save -o "$DIST_DIR/images/postgres.tar" postgres:15-alpine
docker save -o "$DIST_DIR/images/mongo.tar" mongo:7.0

echo "Copying runtime files..."
cp "$COMPOSE_DIST" "$DIST_DIR/docker-compose.yml"
cp "$MAC_STARTER" "$DIST_DIR/"
cp "$WIN_STARTER" "$DIST_DIR/"
chmod +x "$DIST_DIR/start_dist_mac.command"

echo "Packaging complete."
echo "Distribution directory ready at: $DIST_DIR"
