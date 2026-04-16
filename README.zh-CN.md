<div align="center">

# 🎓 AI Learning Assistant

**香港中文大学商学院 LLM 智能作业助手**

*从课程资料生成标准答案 · 向学生提供遮罩式引导*

---

[English](./README.md) · [繁體中文](./README.zh-HK.md) · [简体中文](./README.zh-CN.md)

</div>

---

## 👀 项目概览

### 🛠 开发范式

这是DOTE3010课程中带领大家一起做的一个迷你项目，分为demo分支和main分支（MVP水平）。demo分支大体代表了2026年初一次性prompt能够生成的demo水平。不过，即便我们认为LLM的能力会逐步增强，事实上的开发显然不能依赖于一次性的prompt。我们依然强烈推荐学习者通过各种AI工具对于技术可行性和产品需求进行评估，并且自己撰写PRD，然后让AI工具在PRD的指导下完成开发。

我们的基础流程聚焦于PRD -> roadmap -> 正式开发，这其中roadmap在很多地方有不同的名字，例如claude.md或者blueprint.md，然而它们的核心思想是一样的：将一个产品分解为一个个单一职能的，相互解耦的开发阶段。对于现在而言，这么做对于控制单一agent得context window很重要，不过更核心的原因是一些久经考验的软件设计原则：领域驱动设计，单一职能原则，可维护性原则，高内聚低耦合原则等。只要产品还是人类设计的，这些帮助产品设计者和架构师心智负担，解放他们的注意力到创意本身的原则就总是有效的。

我们邀请学习者尝试这些例子，并且尝试自己构筑更好的版本。

### 🛜 LLM中转

众所周知的，在世界的不同地方，使用全部最好的模型并非易事。如果你点击我们的启动脚本，你会发现要求输入Bianxie API key，这是因为我们这里选择了一家名叫Bianxie AI的聚合API的供应商。

需要澄清的是，我们仅仅是偶然选择了这家供应商，我们和他们完全没有任何商业关系。我们鼓励学习者们合规地选择基础模型供应商或是聚合API中转供应商。这个项目是开源的，你完全可以修改.env文件注入你自己的API key。



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

> **注意：** `ai_learning_assistant_dist/images/` 目录包含预先导出的 Docker 镜像压缩包，已从 git 中排除。请另行获取完整发行套件。

---

## ✨ 功能特性

| 功能 | 说明 |
|------|------|
| 🔐 身份验证 | 安全的登录/注册机制，支持持久化与 Token 验证 |
| 📚 课程管理 | 直接在 UI 中创建课程与作业 |
| 📎 参考资料上传 | 附加文本/Markdown 文件作为答案生成的上下文 |
| 💾 本地存储 | 生成的答案自动保存至 `workspace/` 目录 |
| 🕓 历史回放 | 在作业对话中查看过往生成结果 |
| ⚙️ 模型配置 | 可配置 LLM 后端（默认：`gpt-5-mini`） |

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
