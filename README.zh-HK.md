<div align="center">

# 🎓 AI Learning Assistant

**香港中文大學商學院 LLM 智能作業助手**

*從課程資料生成標準答案 · 向學生提供遮罩式引導*

---

[English](./README.md) · [繁體中文](./README.zh-HK.md) · [简体中文](./README.zh-CN.md)

</div>

---

## 👀 專案概覽

### 🛠 開發範式

這是 DOTE3010 課程中帶領大家一起做的一個迷你項目，分為 demo 分支和 main 分支（MVP 水平）。demo 分支大體代表了 2026 年初一次性 Prompt 能夠生成的原型。不過，即便我們認為 LLM 的能力會逐步增強，事實上的開發顯然不能依賴於一次性的 Prompt。我們依然強烈推薦學習者通過各種 AI 工具對於技術可行性和產品需求進行評估，並且自己撰寫 PRD，然後讓 AI 工具在 PRD 的指導下完成開發。

我們的基礎流程聚焦於 PRD -> Roadmap -> 正式開發，這其中 Roadmap 在很多地方有不同的名字，例如 claude.md 或者 blueprint.md，然而它們的核心思想是一樣的：將一個產品分解為一個個單一職能的、相互解耦的開發階段。對於現狀而言，這麼做對於控制單一 Agent 的 Context Window（上下文窗口）很重要，不過更核心的原因是一些久經考驗的軟體設計原則：領域驅動設計 (DDD)、單一職能原則、可維護性原則、高內聚低耦合原則等。只要產品還是人類設計的，這些幫助產品設計者和架構師減輕心智負擔、解放注意力到創意本身的原則就總是有效的。

我們邀請學習者嘗試這些例子，並且嘗試自己構築更好的版本。

### 🛜 LLM 中轉

眾所周知，在世界的不同地方，使用全部最好的模型並非易事。如果你點擊我們的啟動腳本，你會發現要求輸入 Bianxie API key，這是因為我們這裡選擇了一家名叫 Bianxie AI 的聚合 API 供應商。

需要澄清的是，我們僅僅是偶然選擇使用這家供應商，我們和他們完全沒有任何商業關係。我們鼓勵學習者們在合規的前提下，選擇基礎模型供應商或是聚合 API 中轉供應商。這個項目是開源的，你完全可以修改 .env 文件注入你自己的 API key。



## 📦 版本說明

### 🛠 Demo — Mac（開發版）

> 供內部測試與演示使用的本地開發版本，僅支援 Mac。

| 項目 | 說明 |
|------|------|
| 環境需求 | Docker Desktop（需執行中）· Python 3.10+ |
| 存取網址 | `http://localhost:14242` |
| 預設帳號 | `teacher@cuhk.edu.hk` |
| 預設密碼 | `Aa12345678` |

**啟動步驟：**
1. 雙擊 `start_demo.command`
2. 腳本會自動建立 `venv`、啟動 Docker 資料庫，並開啟 Web UI

---

### 🚀 Distribution — 離線獨立版

> 預先打包所有 Docker 映像檔的完整離線套件，設定完成後無需網路連線。支援 **Mac** 與 **Windows**。

**環境需求：** Docker Desktop（需執行中）— 無需安裝 Python 或其他依賴。

<details>
<summary><b>Mac</b> — <code>start_dist_mac.command</code></summary>

1. 右鍵點擊 `start_dist_mac.command` → **開啟**
   *（若出現「無法驗證開發者」，在對話框中再次點擊**開啟**）*
2. 首次執行時，系統會提示輸入 **API Key**
3. 等待約 **1–2 分鐘**完成初始化
4. 瀏覽器將自動開啟 `http://localhost:14242`

</details>

<details>
<summary><b>Windows</b> — <code>start_dist_win.bat</code></summary>

1. 雙擊 `start_dist_win.bat`
2. 若出現 Windows SmartScreen 警告 → **更多資訊** → **仍要執行**
3. 依照畫面提示操作
4. 瀏覽器將自動開啟 `http://localhost:14242`

</details>

> **注意：** `ai_learning_assistant_dist/images/` 目錄包含預先匯出的 Docker 映像檔壓縮包，已從 git 排除。請另行取得完整發行套件。

---

## ✨ 功能特色

| 功能 | 說明 |
|------|------|
| 🔐 身份驗證 | 安全的登入/註冊機制，支援持久化與 Token 驗證 |
| 📚 課程管理 | 直接在 UI 中建立課程與作業 |
| 📎 參考資料上傳 | 附加文字/Markdown 檔案作為答案生成的上下文 |
| 💾 本地儲存 | 生成的答案自動儲存至 `workspace/` 目錄 |
| 🕓 歷史回放 | 在作業對話中查看過往生成結果 |
| ⚙️ 模型設定 | 可設定 LLM 後端（預設：`gpt-5-mini`） |

---

## 🗂 工作區與產出檔案

每次生成答案時，系統會：
1. 將記錄儲存至 **MongoDB**（用於歷史查詢）
2. 將檔案寫入本地磁碟：

```
workspace/{課程名稱}/{作業名稱}/solution_{時間戳記}.{副檔名}
```

---

## 🛠 疑難排解

| 症狀 | 解決方法 |
|------|----------|
| 「Docker 未執行」 | 開啟 Docker Desktop，等待完全啟動 |
| 「無法連線到此網站」 | 系統可能仍在初始化，等待 10 秒後重新整理 |
| 需要完全重置 *（僅 Demo 版）* | 執行 `make demo-reset` — **⚠️ 將刪除所有已註冊使用者** |
