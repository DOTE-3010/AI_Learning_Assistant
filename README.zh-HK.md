<div align="center">

# 🎓 AI Learning Assistant

**香港中文大學商學院 LLM 智能作業助手**

*從課程資料生成標準答案 · 向學生提供遮罩式引導*

---

[English](./README.md) · [繁體中文](./README.zh-HK.md) · [简体中文](./README.zh-CN.md)

</div>

---

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
