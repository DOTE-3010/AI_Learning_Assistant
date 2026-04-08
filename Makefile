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
demo-start: frontend-build
	$(PYTHON) demo_launcher.py start

# 3. 重置数据
demo-reset:
	$(PYTHON) demo_launcher.py reset

# 4. 清理
clean:
	rm -rf $(VENV_DIR)
	find . -type d -name "__pycache__" -exec rm -rf {} +

