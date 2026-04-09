@echo off
cd /d "%~dp0"

echo 🚀 Starting AI Learning Assistant (Offline Edition)...

:: 1. Check Docker
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not running. Please start Docker Desktop first.
    echo    Docker 未运行，请先启动 Docker Desktop。
    pause
    exit /b
)

:: 2. Load Offline Images
echo 📦 Checking system images...

:: Function-like logic for checking images using call
call :CheckAndLoad "ai_learning_assistant:latest" "images\backend.tar"
if %errorlevel% neq 0 exit /b

call :CheckAndLoad "postgres:15-alpine" "images\postgres.tar"
if %errorlevel% neq 0 exit /b

call :CheckAndLoad "mongo:7.0" "images\mongo.tar"
if %errorlevel% neq 0 exit /b

:: 3. Check .env
if not exist .env (
    echo ⚠️  No .env file found.
    echo To use the AI features, we need your API Key.
    set /p API_KEY="🔑 Please enter your Bianxie API Key: "
    (echo BIANXIE_API_KEY=%API_KEY%) > .env
    echo ✅ Configuration saved to .env
)

echo ✨ Launching services...

:: Clean up conflicting containers
docker rm -f ai_learning_assistant-backend >nul 2>&1
docker rm -f ai_learning_assistant-postgres >nul 2>&1
docker rm -f ai_learning_assistant-mongo >nul 2>&1
docker rm -f solver42-backend >nul 2>&1
docker rm -f solver42-postgres >nul 2>&1
docker rm -f solver42-mongo >nul 2>&1

docker compose up -d

if %errorlevel% equ 0 (
    echo ✅ System is running!
    echo ⏳ Waiting for services to initialize...
    timeout /t 5 >nul
    echo 🌍 Opening User Interface...
    start http://localhost:14242
) else (
    echo ❌ Failed to start services.
)

pause
exit /b

:: Subroutine to check and load image
:CheckAndLoad
docker image inspect %1 >nul 2>&1
if %errorlevel% neq 0 (
    if exist %2 (
        echo    ⚡️ Installing %1 (First run only)...
        docker load -i %2
        echo    ✅ Installed.
    ) else (
        echo    ❌ Error: Image file %2 not found!
        exit /b 1
    )
) else (
    echo    ✅ %1 is ready.
)
exit /b 0

