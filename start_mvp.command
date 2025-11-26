#!/bin/bash

# 获取脚本所在目录的绝对路径
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$DIR"

echo "🚀 Starting Solver#42 MVP Environment..."

# 检查 make 是否存在
if ! command -v make &> /dev/null; then
    echo "❌ 'make' command not found. Please install Xcode Command Line Tools."
    read -p "Press any key to exit..."
    exit 1
fi

# 检查 Docker 是否运行
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker Desktop first."
    read -p "Press any key to exit..."
    exit 1
fi

# 检查是否需要初次安装
if [ ! -d "venv" ]; then
    echo "📦 First time run detected. Installing dependencies..."
    make install
fi

echo "✨ Launching system..."
make demo-start

# 防止窗口闪退（如果发生错误）
read -p "Press any key to exit..."




