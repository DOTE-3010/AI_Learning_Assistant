.PHONY: install frontend-install frontend-build demo-start demo-stop demo-reset clean

VENV_DIR = venv
PYTHON = $(VENV_DIR)/bin/python
PIP = $(VENV_DIR)/bin/pip
STATIC_INDEX = backend/static/index.html
STATIC_ASSETS_DIR = backend/static/assets

# 1. 安装环境
install:
	python3 -m venv $(VENV_DIR)
	$(PIP) install --upgrade pip
	$(PIP) install -r backend/requirements.txt
	@echo "✅ Environment set up! Run 'make demo-start' to launch."

frontend-install:
	npm --prefix frontend install

frontend-build:
	@if command -v npm > /dev/null 2>&1; then \
		echo "📦 npm detected. Building frontend..."; \
		if npm --prefix frontend run build; then \
			echo "✅ Frontend build completed."; \
		else \
			echo "⚠️ Frontend build failed. Falling back to prebuilt static files..."; \
			if [ -f "$(STATIC_INDEX)" ] && [ -d "$(STATIC_ASSETS_DIR)" ]; then \
				echo "✅ Using existing prebuilt frontend from backend/static."; \
			else \
				echo "❌ Prebuilt frontend files are missing."; \
				echo "   Install npm and run 'make frontend-build' once on a build machine."; \
				exit 1; \
			fi; \
		fi; \
	else \
		echo "⚠️ npm not found. Skipping frontend build and using prebuilt static files..."; \
		if [ -f "$(STATIC_INDEX)" ] && [ -d "$(STATIC_ASSETS_DIR)" ]; then \
			echo "✅ Using existing prebuilt frontend from backend/static."; \
		else \
			echo "❌ Prebuilt frontend files are missing."; \
			echo "   Install npm and run 'make frontend-build' once on a build machine."; \
			exit 1; \
		fi; \
	fi

# 2. 启动演示 (会自动使用 venv 中的 python)
demo-start: frontend-build
	$(PYTHON) demo_launcher.py start

# 3. 重置数据
demo-reset:
	$(PYTHON) demo_launcher.py reset

# 4. 清理
clean:
	rm -rf $(VENV_DIR)
	find . -type d -name "__pycache__" -exec rm -rf {} +

