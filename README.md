<div align="center">

# 🎓 AI Learning Assistant

**An LLM-powered assignment assistant for CUHK Business School**

*Generates standard answers from course materials · Provides masked guidance to students*

---

[English](./README.md) · [繁體中文](./README.zh-HK.md) · [简体中文](./README.zh-CN.md)

</div>

---

## 👀 Project Overview

### 🛠 Development Paradigms

This is a mini-project developed as part of the DOTE3010 course, divided into two branches: demo and main (MVP level). The demo branch represents what a single-shot prompt could generate in early 2026. However, even as LLM capabilities continue to advance, real-world development cannot rely on one-off prompts. We strongly recommend that learners use various AI tools to evaluate technical feasibility and product requirements, draft their own PRD (Product Requirements Document), and then use AI tools to execute the development under the guidance of that PRD.

Our foundational workflow focuses on PRD -> Roadmap -> Formal Development. This "Roadmap" phase goes by various names, such as claude.md or blueprint.md, yet the core philosophy remains the same: decomposing a product into single-responsibility, decoupled development stages. Currently, this is vital for managing an agent's context window. More importantly, it adheres to time-tested software design principles: Domain-Driven Design (DDD), Single Responsibility Principle, Maintainability, and High Cohesion/Low Coupling. As long as products are designed by humans, these principles—which reduce the cognitive load for architects and free up their focus for creativity—will remain essential.

We invite learners to explore these examples and attempt to architect superior versions themselves.

### 🛜 LLM Proxy

As is well known, accessing the full suite of top-tier models can be difficult in different parts of the world. If you run our startup script, you will be prompted to enter a Bianxie API key. This is because we have utilized Bianxie AI, an aggregate API provider, for this project.

To clarify: our choice of this provider is purely incidental based on the developer's personal preference; we have no commercial relationship with them. We encourage learners to choose foundational model providers or aggregate API proxies in compliance with local regulations. This project is open-source, and you are free to modify the .env file to inject your own API key.


## 📦 Versions

### 🛠 Demo — Mac (Development Build)

> A local development build for Mac, intended for internal testing and demonstration.

| Item | Detail |
|------|--------|
| Prerequisites | Docker Desktop (running) · Python 3.10+ |
| Start URL | `http://localhost:14242` |
| Default Email | `teacher@cuhk.edu.hk` |
| Default Password | `Aa12345678` |

**Steps:**
1. Double-click `start_demo.command`
2. The script automatically creates a `venv`, starts Docker DBs, and launches the Web UI

---

### 🚀 Distribution — Offline Standalone Edition

> A self-contained offline package bundling all Docker images. No internet connection required after setup. Supports **Mac** and **Windows**.

**Prerequisites:** Docker Desktop (running) — no Python or other dependencies needed.

<details>
<summary><b>Mac</b> — <code>start_dist_mac.command</code></summary>

1. Right-click `start_dist_mac.command` → **Open**
   *(If "Unidentified Developer" appears, click **Open** again in the dialog)*
2. On first run, you will be prompted for your **API Key**
3. Wait **1–2 minutes** for initialization
4. Browser opens automatically at `http://localhost:14242`

</details>

<details>
<summary><b>Windows</b> — <code>start_dist_win.bat</code></summary>

1. Double-click `start_dist_win.bat`
2. If Windows SmartScreen appears → **More Info** → **Run Anyway**
3. Follow the on-screen prompts
4. Browser opens automatically at `http://localhost:14242`

</details>

> **Note:** The `ai_learning_assistant_dist/images/` directory contains pre-exported Docker image tarballs and is excluded from git. Obtain the full distribution package separately.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔐 Authentication | Secure Login/Register with persistence and token validation |
| 📚 Course Management | Create new courses and assignments directly in the UI |
| 📎 Reference Upload | Attach text/markdown files as context for answer generation |
| 💾 Local Storage | Generated answers automatically saved to `workspace/` |
| 🕓 History Playback | View past generation results in the assignment chat |
| ⚙️ Model Config | Configurable LLM backend (default: `gpt-5-mini`) |

---

## 🗂 Workspace & Artifacts

When an answer is generated, the system:
1. Saves the record to **MongoDB** (for history)
2. Writes the file to local disk at:

```
workspace/{Course_Title}/{Assignment_Title}/solution_{timestamp}.{ext}
```

---

## 🛠 Troubleshooting

| Symptom | Fix |
|---------|-----|
| "Docker not running" | Launch Docker Desktop and wait for it to fully start |
| "This site can't be reached" | System may still be initializing — wait 10 s and refresh |
| Need a clean reset *(Demo only)* | Run `make demo-reset` — **⚠️ deletes all registered users** |
