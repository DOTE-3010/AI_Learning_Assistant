#!/bin/bash
# Solver#42 Distribution Packager

# Exit on error
set -e

DIST_DIR="Solver42_Dist"
echo "📦 Starting Packaging Process..."

# 1. Ensure backend image is up to date
echo "🔨 Building latest backend image..."
docker compose build backend

# 2. Create dist directory
echo "📂 Creating directory structure..."
rm -rf "$DIST_DIR"
mkdir -p "$DIST_DIR/images"
mkdir -p "$DIST_DIR/workspace"

# 3. Tag the backend image
echo "🏷️  Tagging image..."
docker tag solver42-backend:latest solver42:latest || docker tag solver42_backend:latest solver42:latest || echo "⚠️  Warning: Check image name manually if tag fails"

# 4. Export Images
echo "💾 Exporting Docker Images (This will take a while)..."

echo "   -> Exporting Solver#42 Backend..."
docker save -o "$DIST_DIR/images/backend.tar" solver42:latest

echo "   -> Exporting Postgres..."
docker save -o "$DIST_DIR/images/postgres.tar" postgres:15-alpine

echo "   -> Exporting Mongo..."
docker save -o "$DIST_DIR/images/mongo.tar" mongo:7.0

# 5. Copy Scripts and Configs
echo "📝 Copying configuration files..."
cp docker-compose-dist.yml "$DIST_DIR/docker-compose.yml"
cp start_dist_mac.command "$DIST_DIR/"
cp start_dist_win.bat "$DIST_DIR/"

# Make Mac script executable
chmod +x "$DIST_DIR/start_dist_mac.command"

# Create a README
cat > "$DIST_DIR/README.txt" << EOF
Solver#42 - Local Offline Edition
=================================

Thank you for using Solver#42! This package allows you to run the system locally on your machine without complex setup.

------------------------------------------------------------------------
📋 1. PRE-REQUISITES (MUST READ)
------------------------------------------------------------------------

Before you start, you MUST have "Docker Desktop" installed and running.

[For Mac Users]
1. Download & Install Docker Desktop for Mac: https://www.docker.com/products/docker-desktop/
2. Open "Docker" from your Applications.
3. Wait until the whale icon in the menu bar stops animating.

[For Windows Users]
1. Download & Install Docker Desktop for Windows: https://www.docker.com/products/docker-desktop/
2. During installation, ensure "Use WSL 2 instead of Hyper-V" is CHECKED (Recommended).
   - If asked to update WSL kernel, please follow the link provided by the installer.
   - Or run "wsl --update" in PowerShell as Administrator.
3. Open "Docker Desktop" and wait for the bottom-left status bar to turn GREEN.

------------------------------------------------------------------------
🚀 2. HOW TO START
------------------------------------------------------------------------

Once Docker is running:

[Mac OS]
1. Right-click 'start_dist_mac.command' > Open.
   (If it says "Unidentified Developer", click Open again in the dialog).
2. A terminal window will appear.
3. If it's your first time, it will ask for your API Key.
4. Wait for the system to initialize (First run takes 1-2 mins to install images).
5. The browser will open automatically at: http://localhost:14242

[Windows]
1. Double-click 'start_dist_win.bat'.
2. If Windows SmartScreen appears, click "More Info" > "Run Anyway".
3. Follow the on-screen prompts.
4. The browser will open automatically at: http://localhost:14242

------------------------------------------------------------------------
❓ TROUBLESHOOTING
------------------------------------------------------------------------
Q: It says "Docker is not running"?
A: Please open the Docker Desktop app first and wait for it to fully start.

Q: The browser shows "This site can't be reached"?
A: The system might still be starting up. Wait 10 seconds and refresh the page.

Q: How do I stop it?
A: Open Docker Desktop, go to "Containers", and click the Stop (square) button on the "solver42" group.

=================================
Solver#42 Team
EOF

echo "✅ Packaging Complete!"
echo "👉 Your distribution package is ready in: $DIST_DIR/"
