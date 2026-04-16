.PHONY: install frontend-install frontend-build demo-start demo-stop demo-reset clean

VENV_DIR = venv
PYTHON = $(VENV_DIR)/bin/python
PIP = $(VENV_DIR)/bin/pip

# 1. 安装环境
install:
	python3 -m venv $(VENV_DIR)
	$(PIP) install --upgrade pip
	$(PIP) install -r backend/requirements.txt
	@echo "✅ Environment set up! Run 'make demo-start' to launch."

frontend-install:
	npm --prefix frontend install

frontend-build:
	npm --prefix frontend run build

# 2. 启动演示 (会自动使用 venv 中的 python)
# If npm is unavailable, fallback to committed static assets for demo safety.
demo-start:
	@if command -v npm >/dev/null 2>&1; then \
		echo "🔧 npm detected. Building frontend..."; \
		$(MAKE) frontend-build; \
	else \
		if [ -f backend/static/index.html ] && ls backend/static/assets/index-*.js >/dev/null 2>&1; then \
			echo "⚠️ npm not found. Skipping frontend build and using prebuilt static assets."; \
		else \
			echo "❌ npm not found and no prebuilt frontend assets detected."; \
			echo "Please install Node.js/npm or commit built files under backend/static."; \
			exit 1; \
		fi; \
	fi
	$(PYTHON) demo_launcher.py start

# 3. 重置数据
demo-reset:
	$(PYTHON) demo_launcher.py reset

# 4. 清理
clean:
	rm -rf $(VENV_DIR)
	find . -type d -name "__pycache__" -exec rm -rf {} +

