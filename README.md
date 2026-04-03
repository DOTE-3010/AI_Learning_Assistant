<div align="center">

# 🎓 Solver#42

**An LLM-powered assignment assistant for CUHK Business School**

*Generates standard answers from course materials · Provides masked guidance to students*

---

[English](./README.md) · [繁體中文](./README.zh-HK.md) · [简体中文](./README.zh-CN.md)

</div>

---

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

> **Note:** The `Solver42_Dist/images/` directory contains pre-exported Docker image tarballs and is excluded from git. Obtain the full distribution package separately.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔐 Authentication | Secure Login/Register with persistence and token validation |
| 📚 Course Management | Create new courses and assignments directly in the UI |
| 📎 Reference Upload | Attach text/markdown files as context for answer generation |
| 💾 Local Storage | Generated answers automatically saved to `workspace/` |
| 🕓 History Playback | View past generation results in the assignment chat |
| ⚙️ Model Config | Configurable LLM backend (default: `gemini-2.5-pro-preview`) |

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
