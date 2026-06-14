# Uniwork V2

[English](README.md) | **简体中文**

基于 Claude Code 完整 harness 打造的 AI 投研工作站。选中文字、问 AI、行内审阅改动——覆盖 Markdown、Word、Excel、PDF、PowerPoint、HTML 六种格式。

> 单文件前端（`index.html`，Vue 3 CDN，零构建步骤）。Node 网关（`server.mjs`）封装 `@anthropic-ai/claude-agent-sdk`，把完整的 Claude Code runtime 暴露给浏览器。文件落在磁盘上（`~/UniworkVault`，git 托管）——Claude 读写的是真实文件，不是浏览器内存。

---

## 功能特性

### 多格式文档工作区
并排打开 `.md` `.docx` `.xlsx` `.pdf` `.pptx` `.html`。每种格式用专门的渲染器：

| 格式 | 渲染器 | 能力 |
|---|---|---|
| Markdown | TipTap (ProseMirror) | 所见即所得编辑、`[[wikilinks]]`、AI 建议审阅 |
| Word | SuperDoc 1.39.0 (ProseMirror) | 高保真渲染、tracked changes 供 AI 审阅 |
| Excel | Luckysheet | 支持公式的表格、单元格区域选中 → AI |
| PDF | pdf.js | 渲染 + 文字层供选中 |
| PowerPoint | pptx-renderer 1.1.0 | DOM/SVG 高保真，文字可选中 |
| HTML | iframe + designMode | 全保真预览 + 行内编辑 |

### 选中 → 问 AI
在**任意**文档类型里选中文字 → 选区上方浮出气泡（带持久高亮）→ 写评论或按 Enter 把引文挂到对话。支持鼠标拖拽、触控板三指拖拽、键盘 Shift 选中、双击选词。

### AI 改动 + 行内审阅
Claude 修改文件时，你先审阅再接受：

- **Markdown**：逐条建议的绿色新增 / 红色删除，带行内 ✓/✗ 控件
- **Word (.docx)**：SuperDoc tracked changes——红色删除线 / 绿色新增 + 右侧审阅栏逐项接受/拒绝
- **PowerPoint**：锚定到 slide 的审批卡片，显示每页改了什么
- **非文本改动**（图片、版式）：通知栏接受/拒绝

### Git 时光机
每次文件改动自动 commit。完整历史浏览、一键回滚、撤销回滚——全部非破坏性（回滚会生成一个新 commit）。

### Wikilinks 与反向链接
`[[双方括号]]` 渲染为可点击链接。反向链接面板列出所有引用当前笔记的文件。解析跨文件夹生效（按 basename 匹配，可用路径覆盖）。支持 `[[path/to/note|显示别名]]` 语法。

### 完整的 Claude Code harness
不是薄封装——跑的是**完整**的 Claude Code runtime：Read / Write / Edit / Bash / Grep / WebSearch / WebFetch / Task / Skill / MCP / hooks / subagents。加载你全部的 `~/.claude/skills`。用你的订阅（OAuth），不用 API key。

### 文件管理
- 在文件树里拖拽文件**和文件夹**重组（git mv，保留历史）
- 把外部文件拖到指定文件夹上传到那里（拖到空白处则传到 vault 根）
- 右键菜单：重命名、删除（→ 回收站）、新建子文件夹、上传到文件夹
- 挂载外部文件夹（symlink，不复制）

---

## 快速开始

### 前置条件
- **Node.js 20+**（推荐 22+）
- **Claude Code CLI** + 有效的 Pro / Max 订阅

### 1. 安装 Claude Code 并登录

```bash
npm install -g @anthropic-ai/claude-code
claude login
# → 选 "Claude account (Pro/Max subscription)"——不要选 "API key"
```

> **重要**：Agent SDK 需要订阅 OAuth。API key 会被服务端拒绝。验证登录：`node smoke.mjs` 应打印 `PONG`。

### 2. 安装并运行

```bash
cd uniwork-v2
npm install
node server.mjs
```

打开 **http://localhost:4199**。连接并认证成功后，状态徽标显示 `● Online`。

### 3.（可选）初始化示例 vault

```bash
node seed-vault.mjs
# 在 ~/UniworkVault 生成示例公司 wiki、研究笔记和 git 基线
```

### 环境变量

| 变量 | 默认值 | 说明 |
|---|---|---|
| `PORT` | `4199` | 服务端口 |
| `UNIWORK_VAULT` | `~/UniworkVault` | Vault 目录（需要时自动 git init） |
| `UNIWORK_MOCK` | — | 设 `=1` 进入 mock 模式（无 Claude，仅测 UI） |
| `UNIWORK_MODEL` | `claude-opus-4-8` | 默认模型 |

---

## Claude Code 集成

### 如果你已经在用 Claude Code
Uniwork V2 开箱即用——复用同一套 `~/.claude` 凭证、skills 和 hooks。直接 `npm install && node server.mjs`。

### Claude Code 自动配置

repo 内含 `CLAUDE.md`——任何打开本项目的 Claude Code 实例都会自动理解架构、安装步骤和可用 skills，无需手动 briefing。

### Skills：内置 + 你自己的

Uniwork 自带 4 个内置投研 skill（在 `.claude/skills/`）：

| Skill | 能力 |
|---|---|
| `yfinance-router` | 股价、PE、市值、EPS、分红、历史 K 线 |
| `ak-xq-router` | A 股/港股共识、股东、资金流、EPS 预测、Fwd PE |
| `finance-cowork` | 公司 wiki 建立/维护、model digest、报告生成 |
| `gs-research-chart` | 机构级图表：PE band、drawdown、rebased perf、revenue YoY |

**加上你自己的 skill**——`~/.claude/skills/` 里的任何东西都会自动加载。如果你有内置 skill 的更完整版本（同名），你的优先。

**添加自定义 skill**：建 `~/.claude/skills/<name>/SKILL.md`，写好 frontmatter 和指令。它会出现在 `/` 命令菜单，AI 自动调用。

```
Skill 加载优先级：
1. ~/.claude/skills/     ← 你的 skills（最高优先级）
2. .claude/skills/       ← 内置 Uniwork skills
3. System prompt         ← yfinance/openpyxl/python-docx 指引
```

### 连接是怎么工作的

```
Browser (index.html)
  ↕  WebSocket ws://localhost:4199/agent
  ↕  HTTP GET  /vault?path=...

server.mjs (Node)
  ├── Static file server + /vault file API
  ├── chokidar file watcher → broadcasts file_changed
  ├── Git integration (auto-commit, history, rollback, mv)
  └── Per-tab query() → streams AI events to browser
        ↕
@anthropic-ai/claude-agent-sdk
  → ~/.claude OAuth (subscription login)
  → Full harness: settingSources:['user','project','local'], skills:'all'
  → Loads your skills + built-in skills + system prompt capabilities
  → permissionMode:'auto' (no popups; file review via diff UI)
```

### WebSocket 协议

**客户端 → 服务端**

| 操作 | 说明 |
|---|---|
| `user_turn` | 发送用户消息，带引文、文件上下文、模型 |
| `list_vault` | 请求文件树 |
| `save_file` / `save_file_b64` | 写文本 / 二进制文件 |
| `commit_file` | 带 message 的 git commit |
| `file_history` | 某文件的 git log |
| `file_rollback` | 回滚到指定 commit |
| `move_file` | 移动文件或文件夹（git mv） |
| `make_folder` | 创建目录 |
| `open_local` | 用原生 app 打开（Word/Excel/PowerPoint） |
| `set_perm_mode` | 切换 auto / bypass 权限模式 |
| `set_fast` | 切换 fast 模式 |

**服务端 → 客户端**

| 事件 | 说明 |
|---|---|
| `vault` | 完整文件树（文件夹 + 文件） |
| `file_changed` | 磁盘上文件被改（若 AI turn 进行中则触发审阅） |
| `turn_start` / `text` / `reasoning` / `tool` / `result` | 流式 AI turn 生命周期 |
| `committed` / `history` | Git 事件 |
| `toast` | 面向用户的通知 |

---

## 核心模块与开源技术栈

### 开源依赖

**前端**（全部 CDN/ESM，零构建）：

| 库 | 版本 | 许可证 | 作用 |
|---|---|---|---|
| [Vue 3](https://vuejs.org/) | 3.4.21 | MIT | 响应式 UI 框架（Composition API，单文件） |
| [TipTap](https://tiptap.dev/) | 2.11.5 | MIT | Markdown 所见即所得编辑器（ProseMirror 内核）——编辑、wikilink 装饰、AI 建议审阅 |
| [SuperDoc](https://github.com/nicosResworworlds/super-doc) | 1.39.0 | Apache-2.0 | Word (.docx) 高保真渲染 + 编辑（ProseMirror 内核）——tracked changes 供 AI 审阅 |
| [Luckysheet](https://github.com/dream-num/Luckysheet) | 2.1.13 | MIT | Excel 兼容电子表格（公式、单元格选中、多 sheet） |
| [pdf.js](https://mozilla.github.io/pdf.js/) | 3.11.174 | Apache-2.0 | PDF 渲染 + 可选中文字层 |
| [pptx-renderer](https://github.com/nicosResworworlds/pptx-renderer) | 1.1.0 | Apache-2.0 | PowerPoint DOM/SVG 渲染（文字可选中，支持 EMF/WMF 矢量） |
| [marked](https://marked.js.org/) | 12.0.2 | MIT | Markdown → HTML 解析器 |
| [turndown](https://github.com/mixmark-io/turndown) | 7.1.3 | MIT | HTML → Markdown 转换器（把 TipTap 编辑存回 .md） |
| [diff-match-patch](https://github.com/google/diff-match-patch) | 20121119 | Apache-2.0 | 文本 diff 引擎，用于 markdown 绿/红行内审阅 |
| [mammoth](https://github.com/mwilliamson/mammoth.js) | 1.7.2 | BSD-2 | .docx → HTML（用于 legacy 导入路径） |
| [JSZip](https://stuk.github.io/jszip/) | 3.10.1 | MIT | ZIP 操作——.pptx/.docx XML diff、主题字体提取 |
| [LuckyExcel](https://github.com/nicosResworworlds/LuckyExcel) | 1.0.1 | MIT | .xlsx → Luckysheet 数据转换器 |
| [jQuery](https://jquery.com/) | 3.7.1 | MIT | Luckysheet 依赖 |
| [html-docx-js](https://github.com/nicosResworworlds/html-docx-js) | 0.3.1 | MIT | HTML → .docx 导出 |

**后端**（npm）：

| 包 | 版本 | 作用 |
|---|---|---|
| [@anthropic-ai/claude-agent-sdk](https://docs.anthropic.com/en/docs/agents/agent-sdk) | ^0.3.0 | Claude Code runtime——完整 harness（tools、skills、MCP、hooks） |
| [chokidar](https://github.com/paulmillr/chokidar) | ^4.0.0 | 文件系统监听（vault 变更检测） |
| [ws](https://github.com/websockets/ws) | ^8.18.0 | WebSocket 服务端 |

### 模块：Markdown 编辑器 + AI 审阅

**技术栈**：TipTap (ProseMirror) + marked + turndown + diff-match-patch

TipTap 编辑器把 `.md` 文件渲染为所见即所得，并实时装饰 `[[wikilink]]`（ProseMirror `Decoration.inline`）。AI 修改文件时，`diff-match-patch` 计算新旧文本的 delta，再逐条注入 `<ins>`/`<del>` 装饰，带行内 ✓/✗ 接受/拒绝按钮（ProseMirror Plugin）。接受的改动写入编辑器 state，拒绝的恢复原文。编辑器通过 turndown（HTML→Markdown）存回 `.md`。

### 模块：Word (.docx) 编辑器 + AI 审阅

**技术栈**：SuperDoc 1.39.0（ProseMirror 内核）+ JSZip

SuperDoc 提供 Word 级保真渲染，含分页、字体、表格、页眉。AI 审阅流程：加载 AI 改后的版本 → 加载 git HEAD 基线 → `compareDocuments()` 算 diff → `replayDifferences({applyTrackedChanges:true})` 注入原生 Word tracked changes（红色删除线 / 绿色新增）。右侧审阅栏逐条列出改动，可逐项接受/拒绝。非文本改动（图片、样式）通过 JSZip 对 `word/media/*` 条目做字节级比对检测，以通知栏展示。

SuperDoc 自带的批注模块被禁用（`modules:{comments:false}`），以免和 app 自己的"选中→问 AI"气泡冲突。`trackChanges` 模块保持启用以供 AI 审阅。

### 模块：电子表格 (.xlsx)

**技术栈**：Luckysheet + LuckyExcel + openpyxl（服务端 Python）

LuckyExcel 在前端把 `.xlsx` → Luckysheet 数据格式。Luckysheet 提供支持公式、可选中单元格区域的表格。AI 修改 `.xlsx` 时，在服务端跑 Python + openpyxl（保留公式和格式）。前端通过 chokidar 监听到文件变更后重新加载表格。

### 模块：PDF 阅读器

**技术栈**：pdf.js 3.11.174

把 PDF 页渲染到 canvas，叠加透明文字层供选中。选中后流入和其它格式一致的"气泡→问 AI"管线。

### 模块：PowerPoint (.pptx) 阅读器 + AI 审阅

**技术栈**：pptx-renderer 1.1.0（DOM/SVG）+ JSZip

`PptxViewer.open()` 把所有 slide 渲染为带可选中文字 span 的 DOM/SVG 元素。缩放用逐 slide 的 `transform:scale()` + 定尺包裹层（不用 CSS zoom，后者会触发 ResizeObserver 无限 reflow）。AI 审阅时，JSZip 提取新旧版本的 slide XML，文本级 diff 识别变更的 slide，浮动审批卡片锚定到每张变更的 slide。

**CJK 字体处理**：Windows 字体名通过 `@font-face local()` 声明做别名（KaiTi→Kaiti SC、SimSun→Songti SC 等）。对主题字体（渲染器无法解析为显式字体名的 `+mn-ea` 引用），在渲染时解析 deck 的 `theme1.xml` 提取 minor-font EA 字体，映射到 macOS 等价字体，并作为 `--pptx-cjk` CSS 自定义属性注入到全局字体规则。

**嵌入字体剥离**：`strip_embedded_fonts.py` 移除 .pptx 里 Windows 嵌入的字体子集（这些会在 macOS PowerPoint 上导致 CJK 乱码）。通过"Open Local"用原生 app 打开 .pptx 时自动运行。

### 模块：HTML 阅读器 + 编辑器

**技术栈**：iframe + designMode

HTML 文件在 iframe 里渲染，脚本完整执行。对静态 HTML，`designMode='on'` 启用行内文字编辑。对 JS 渲染的 HTML（剥脚本后检测 `textContent < 200` 判定），跑一遍静态化：在隐藏 iframe 里执行脚本，等渲染稳定，再序列化 DOM 并剥脚本，产出可编辑的静态快照。

### 模块：选中 → 问 AI（统一管线）

**技术栈**：ProseMirror events + DOM Selection API + position:fixed overlay

全部 6 种文档类型汇入同一条气泡管线：
- **md / docx**：ProseMirror `selectionUpdate` 事件（支持鼠标、触控板三指拖拽、键盘）
- **pdf / pptx**：document 上的捕获阶段 `mouseup` 监听（绕过 ProseMirror 的事件抑制）
- **html**：iframe-to-parent 的 `mouseup` 桥接 + 坐标偏移换算
- **xlsx**：Luckysheet `rangeSelect` 钩子

气泡打开期间选中高亮持续存在（`getClientRects()` 出的 position:fixed overlay 矩形），与焦点无关——所以光标移到评论输入框时高亮仍在。IME 组字保护防止 CJK 输入时按 Enter 提前发送。

### 模块：Wikilinks 与反向链接

**技术栈**：自定义 ProseMirror Plugin + 正则解析器

`[[target]]` 和 `[[target|alias]]` 由一个扫描文本节点匹配该模式的 ProseMirror Plugin 实时装饰。解析：NFC 归一 + 小写、去 `.md/.txt/.docx` 后缀；若 target 含 `/` 按路径后缀匹配，否则按 basename 匹配（与文件夹无关）。反向链接通过扫描所有预取的 `.md` 文件的出链、检查是否解析到当前文件来计算。点击导航；未解析的链接显示为红色。

### 模块：Git 时光机

**技术栈**：Node `child_process` → git CLI

vault 是标准 git repo。`scheduleAutoCommit` 对文件改动做防抖并提交，且感知 AI turn（AI 改的文件先过审阅 UI 再提交，不自动 commit）。历史浏览器对每个文件展示 `git log --follow`。回滚生成一个带旧内容的新 commit（非破坏性——往前滚即可撤销回滚）。文件移动用 `git mv` 保留历史。

### 模块：Agent 网关

**技术栈**：@anthropic-ai/claude-agent-sdk + ws

每个聊天 tab 一个 `query()` 会话。服务端注入一段 system prompt，含 vault 上下文、当前打开文件的内容、对话历史。流式事件（`assistant` text/reasoning、`tool_use`、`result`）映射为 WebSocket 消息。权限模式默认 `auto`（基于模型的分类器，无弹窗）。`AskUserQuestion` 工具调用被拦截并路由到前端选择卡 UI（headless 模式下唯一可行路径）。服务端在启动时通过一次性 init query 缓存 harness 信息（已加载的 skills、tools、MCP servers）。

---

## 常驻服务 (macOS)

```bash
# 创建 LaunchAgent：登录自启 + 崩溃自动重启
cat > ~/Library/LaunchAgents/com.uniwork.v2.plist << 'PLIST'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN"
  "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0"><dict>
  <key>Label</key><string>com.uniwork.v2</string>
  <key>ProgramArguments</key><array>
    <string>node</string>
    <string>/full/path/to/uniwork-v2/server.mjs</string>
  </array>
  <key>WorkingDirectory</key><string>/full/path/to/uniwork-v2</string>
  <key>RunAtLoad</key><true/>
  <key>KeepAlive</key><true/>
  <key>StandardOutPath</key><string>/tmp/uniwork-v2.log</string>
  <key>StandardErrorPath</key><string>/tmp/uniwork-v2.err</string>
</dict></plist>
PLIST

# 改好上面的路径，然后 load：
launchctl bootstrap gui/$(id -u) ~/Library/LaunchAgents/com.uniwork.v2.plist

# 管理：
launchctl kickstart -k gui/$(id -u)/com.uniwork.v2    # 重启
launchctl bootout gui/$(id -u)/com.uniwork.v2         # 停止
```

---

## 文件结构

```
uniwork-v2/
├── index.html              # 前端（Vue 3 单文件，~3800 行）
├── server.mjs              # 后端网关（~820 行）
├── package.json            # 3 个依赖：claude-agent-sdk + chokidar + ws
├── CLAUDE.md               # 给 Claude Code 实例的自动配置
├── ARCHITECTURE.md         # 详细架构文档
├── BACKLINK_SCHEMA.md      # Wikilink 解析规范
├── seed-vault.mjs          # 示例 vault 生成器（把 samples/ → ~/UniworkVault）
├── smoke.mjs               # 认证检查（打印 PONG）
├── strip_embedded_fonts.py # PPTX 嵌入字体剥离器（Win→Mac CJK 修复）
├── harness-check.mjs       # SDK 能力探针
├── test-ws.mjs             # WebSocket 协议测试
├── samples/                # 完整 vault 快照——`node seed-vault.mjs` 拷到 ~/UniworkVault 即得一个完整可复现的 demo
│   ├── WIKI/
│   │   ├── focus/                   # SNDK.md、NVDA.md（focus coverage wiki，可点 [[wikilinks]]）
│   │   ├── emerging peers/          # MU、WDC、Kioxia、SK Hynix、Samsung、SIMO、STX
│   │   └── Industry Coverage/       # AI 算力/存储行业报告
│   └── Vault/
│       ├── Company Coverage/
│       │   ├── SNDK/                # 完整 finance-cowork 工作区：banker_reports (+PDFs)、
│       │   │                        #   conferences、earnings_calls/releases、capital_iq、model、
│       │   │                        #   _data_registry.json、研报/、WIP/（级联工作区）
│       │   └── NVDA/                # 同上——完整 coverage + WIP 级联工作区
│       └── Samples/                 # AAPL deck/memo、MiniMax docx、HV 行业 deck
└── .claude/
    ├── launch.json         # 开发服务器配置
    └── skills/             # 内置研究 skills
        ├── ak-xq-router/
        ├── finance-cowork/
        ├── gs-research-chart/
        └── yfinance-router/
```

---

## Finance Cowork：公司 Wiki 研究流水线

`finance-cowork` skill 是一条维护结构化公司覆盖的闭环研究流水线。它产出 Uniwork 渲染的 wiki/vault 内容。

### 架构：3 模块闭环

```
┌──────────────────────────────────────────────────────────┐
│  ① Wiki Build (Ground Truth)                             │
│     model.xlsx → model_digest (openpyxl, zero LLM)       │
│     → _data_registry.json (single source of truth)        │
│     → 14-section wiki .md (LLM direct-write)              │
├──────────────────────────────────────────────────────────┤
│  ② Report + Version Control                              │
│     wiki + registry → Word/docx (Uninodue format)         │
│     {REG:key} placeholders auto-filled from registry      │
│     git-backed version control + diff + rollback           │
├──────────────────────────────────────────────────────────┤
│  ③ Cascade Update (reverse propagation)                   │
│     model changed → COM recalc → drift detection          │
│     → gate: human/LLM confirms → rewrite downstream       │
│     → wiki + registry + report all updated                 │
└──────────────────────────────────────────────────────────┘
         ③ feeds back into ① — closed loop
```

### 设计原则

| 原则 | 含义 |
|---|---|
| **数字进 schema，叙述直写** | 只有数据进 `_data_registry.json`；分析/论点由 LLM 直接写 `_sections/*.md` |
| **机械 vs 语义** | 代码负责：单元格写入、重算、漂移计算、渲染。LLM 负责：driver 映射、thesis 变更、叙述改写 |
| **数值原子性** | 数字只从 Excel/filings/API 来——LLM 不生成也不换算；提取失败 = `—`，不猜 |
| **单向流 + 闸口停** | 上游 = wiki + registry；下游 = Word/charts。超阈值的改动停在闸口等人确认 |

### 模块总览

| 模块 | 做什么 | 关键技术 |
|---|---|---|
| **A. model_digest** | 6 步 Excel → 结构化数据提取 | 纯 openpyxl，零 LLM。读 IS/BS/CF tab，抽 KPI，财历自动识别 |
| **B. build_wiki** | 多源 → 14 段公司 wiki | 双通道（数字从 registry，叙述从 LLM）。synthesize → render → QC gate |
| **C. report_render** | Wiki → Word 研报 | `{REG:revenue_fy26}` 占位符自动填充。Git 版本控制，diff 预览 |
| **D. cascade_update** | Model 变更 → 反向级联到全部下游 | COM 重算 → 漂移检测 → 闸口 → 改写 wiki + registry + report |

### Data registry

`_data_registry.json` 是所有数字的单一可信源：

```json
{
  "revenue_fy26q3": {
    "value": 59500, "unit": "USD mn",
    "source": "ER FY26Q3", "tier": "A",
    "extracted": "2026-05-01",
    "downstream": ["wiki:financial_snapshot", "report:page3"]
  }
}
```

wiki 或报告里的每个数字都能追溯到一条 registry 条目。Tier A = 官方 filings；Tier B = 卖方/web（标注来源 + 置信度）。

> **完整技术规格**：[`docs/finance-cowork-design.md`](docs/finance-cowork-design.md)（302 行——模块内部、文件布局、质量闸、级联算法、CLI 命令）

---

## 更新日志

### 2026-06-14

- **对话内文件卡片**：AI 回复中引用 vault 文件时，渲染为可点击的文件卡片（W 蓝色 = `.docx`，X 绿色 = `.xlsx`，P 橙色 = `.pptx` 等）。点击直接在工作台预览；vault 外的文件会先复制到 `_uploads/`。
- **Slash 命令高亮**：输入框中已识别的 `/命令` 变蓝色显示，未识别的保持原色。Tab 键现在也可载入选中的命令建议。
- **刷新后恢复页面**：打开的标签和当前文件按浏览器标签页独立持久化（`sessionStorage`），刷新后回到上次浏览的位置，而非回到默认页。
- **Effort 档位对齐 Claude API**：Opus 4.8 显示 `low/medium/high/xhigh/max`；Opus 4.6 和 Sonnet 4.6 显示 `low/medium/high/max`。切换模型后自动重新同步 effort 到后端。后端现在支持 `max`。
- **工具栏对齐**：按钮（`Git`、`历史`、`本地打开`）统一 28px 高。移除「已自动保存」指示器。大模型"只读逐表加载"提示条增加关闭按钮。
- **图片预览**：PNG、JPG、GIF、WebP、SVG、BMP 文件在预览区内联渲染。
- **默认模型**：从 Opus 4.8 切换为 Opus 4.6 1M 上下文，effort 默认 `high`。

---

## 安全

- **无 API key**：纯订阅 OAuth。凭证留在 `~/.claude`（macOS Keychain），绝不进 repo。
- **沙箱化**：`cwd` = Vault 目录。vault 之外的操作需要授权。
- **双重回滚**：Git commits + SDK 文件 checkpoint。
- **仅本地**：为单用户、本机使用设计。

## 许可

研究与教育用途。AI 输出仅供参考，不构成投资建议。
