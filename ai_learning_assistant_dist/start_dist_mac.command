#!/bin/bash

# 获取脚本所在目录的绝对路径
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$DIR"

echo "🚀 Starting AI Learning Assistant (Offline Edition)..."

# 1. 检查 Docker 是否运行
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker Desktop first."
    echo "   Docker 未运行，请先启动 Docker Desktop。"
    read -n 1 -s -r -p "Press any key to exit..."
    exit 1
fi

# 2. 检查并加载离线镜像
echo "📦 Checking system images..."

# 函数：检查并加载镜像
load_image_if_missing() {
    image_name=$1
    tar_file=$2
    # 使用 docker image inspect 检查镜像是否存在
    if ! docker image inspect "$image_name" > /dev/null 2>&1; then
        if [ -f "$tar_file" ]; then
            echo "   ⚡️ Installing $image_name (First run only)..."
            docker load -i "$tar_file"
            echo "   ✅ Installed."
        else
            echo "   ❌ Error: Image file $tar_file not found!"
            exit 1
        fi
    else
        echo "   ✅ $image_name is ready."
    fi
}

# 按需加载三个核心镜像
load_image_if_missing "ai_learning_assistant:latest" "images/backend.tar"
load_image_if_missing "postgres:15-alpine" "images/postgres.tar"
load_image_if_missing "mongo:7.0" "images/mongo.tar"

# 3. 检查配置 (.env)
if [ ! -f ".env" ]; then
    echo "⚠️  No .env file found."
    echo "To use AI features, we need your API Key."
    read -p "🔑 Please enter your Bianxie API Key: " API_KEY
    echo "BIANXIE_API_KEY=$API_KEY" > .env
    echo "✅ Configuration saved to .env"
fi

echo "✨ Launching services..."

# 清理可能存在的同名冲突容器 (针对从开发版切换到分发版的情况)
clean_conflict() {
    name=$1
    if docker ps -a --format '{{.Names}}' | grep -q "^${name}$"; then
        echo "   ♻️  Cleaning up existing container: $name"
        docker rm -f "$name" > /dev/null 2>&1
    fi
}
clean_conflict "ai_learning_assistant-backend"
clean_conflict "ai_learning_assistant-postgres"
clean_conflict "ai_learning_assistant-mongo"
clean_conflict "solver42-backend"
clean_conflict "solver42-postgres"
clean_conflict "solver42-mongo"

# 使用 docker compose 启动 (不带 --build，因为是成品镜像)
docker compose -p ai_learning_assistant up -d

if [ $? -eq 0 ]; then
    echo "✅ System is running!"
    echo "⏳ Waiting for services to initialize..."
    sleep 5
    echo "🌍 Opening User Interface..."
    open "http://localhost:14242"
else
    echo "❌ Failed to start services."
fi

# 保持窗口开启
read -n 1 -s -r -p "Press any key to exit..."

