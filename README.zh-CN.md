<div align="center">

# 🎓 Solver#42

**香港中文大学商学院 LLM 智能作业助手**

*从课程资料生成标准答案 · 向学生提供遮罩式引导*

---

[English](./README.md) · [繁體中文](./README.zh-HK.md) · [简体中文](./README.zh-CN.md)

</div>

---

## 📦 版本说明

### 🛠 Demo — Mac（开发版）

> 供内部测试与演示使用的本地开发版本，仅支持 Mac。

| 项目 | 说明 |
|------|------|
| 环境需求 | Docker Desktop（需运行中）· Python 3.10+ |
| 访问地址 | `http://localhost:14242` |
| 默认账号 | `teacher@cuhk.edu.hk` |
| 默认密码 | `Aa12345678` |

**启动步骤：**
1. 双击 `start_demo.command`
2. 脚本会自动创建 `venv`、启动 Docker 数据库，并打开 Web UI

---

### 🚀 Distribution — 离线独立版

> 预先打包所有 Docker 镜像的完整离线套件，配置完成后无需网络连接。支持 **Mac** 与 **Windows**。

**环境需求：** Docker Desktop（需运行中）— 无需安装 Python 或其他依赖。

<details>
<summary><b>Mac</b> — <code>start_dist_mac.command</code></summary>

1. 右键点击 `start_dist_mac.command` → **打开**
   *（若出现「无法验证开发者」，在对话框中再次点击**打开**）*
2. 首次运行时，系统会提示输入 **API Key**
3. 等待约 **1–2 分钟**完成初始化
4. 浏览器将自动打开 `http://localhost:14242`

</details>

<details>
<summary><b>Windows</b> — <code>start_dist_win.bat</code></summary>

1. 双击 `start_dist_win.bat`
2. 若出现 Windows SmartScreen 警告 → **更多信息** → **仍要运行**
3. 按照屏幕提示操作
4. 浏览器将自动打开 `http://localhost:14242`

</details>

> **注意：** `Solver42_Dist/images/` 目录包含预先导出的 Docker 镜像压缩包，已从 git 中排除。请另行获取完整发行套件。

---

## ✨ 功能特性

| 功能 | 说明 |
|------|------|
| 🔐 身份验证 | 安全的登录/注册机制，支持持久化与 Token 验证 |
| 📚 课程管理 | 直接在 UI 中创建课程与作业 |
| 📎 参考资料上传 | 附加文本/Markdown 文件作为答案生成的上下文 |
| 💾 本地存储 | 生成的答案自动保存至 `workspace/` 目录 |
| 🕓 历史回放 | 在作业对话中查看过往生成结果 |
| ⚙️ 模型配置 | 可配置 LLM 后端（默认：`gemini-2.5-pro-preview`） |

---

## 🗂 工作区与产出文件

每次生成答案时，系统会：
1. 将记录保存至 **MongoDB**（用于历史查询）
2. 将文件写入本地磁盘：

```
workspace/{课程名称}/{作业名称}/solution_{时间戳}.{扩展名}
```

---

## 🛠 常见问题

| 症状 | 解决方法 |
|------|----------|
| 「Docker 未运行」 | 打开 Docker Desktop，等待完全启动 |
| 「无法访问此网站」 | 系统可能仍在初始化，等待 10 秒后刷新页面 |
| 需要完全重置 *（仅 Demo 版）* | 执行 `make demo-reset` — **⚠️ 将删除所有已注册用户** |
