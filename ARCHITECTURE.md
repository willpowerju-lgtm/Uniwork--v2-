# Uniwork V2 · 技术架构文档

> 单文件 Vue3 前端 + Node 网关，把 **Claude Code 完整 harness**（订阅 OAuth）接到一个浏览器内的 AI 投研工作台，操作对象是**磁盘上真实的 git 仓库 Vault**（`~/UniworkVault`）。
>
> 本文讲**核心架构 + 各板块实现方式 + 关键设计决策**。面向用户的简介见 [README.md](README.md)。

---

## 0. 一句话定位

| | V1 (`uniwork-v1/`) | **V2 (本目录)** |
|---|---|---|
| AI | DeepSeek + 手写 2-tool function calling | **Claude + 完整 Claude Code harness** |
| 工具 | 自写的 search / edit 两个函数 | Read/Write/Edit/Bash/Grep/Glob/WebSearch/WebFetch/Task/Skill/MCP/hooks/subagents + 你的 `~/.claude/skills`（80+） |
| 鉴权 | DeepSeek API key | **你的订阅（OAuth），不用 API key** |
| 文件 | 浏览器内存 + IndexedDB | **磁盘真实文件**（`~/UniworkVault`，git 仓库） |
| 后端 | `server.py`（静态 + 搜索代理） | `server.mjs`（Node 网关，SDK 把 harness 暴露给浏览器） |

前端仍是**单文件 `index.html`（Vue3 全 CDN，零构建）**，2800 行；后端 `server.mjs` 约 600 行。

---

## 1. 顶层架构

```
┌─────────────────────────────────────────────────────────────┐
│  浏览器  index.html  (Vue3 global build，全 CDN，零构建)          │
│                                                               │
│  侧栏文件树   四类渲染器          对话区(多 tab)                   │
│  (实时同步)   md/docx/xlsx/pdf    流式COT + /命令 + @引用 + 📎      │
└───────┬───────────────┬───────────────────┬──────────────────┘
        │ ① HTTP        │ ② WebSocket /agent │ ③ 反向推送(同一 WS)
        │ GET /vault    │ 双向 JSON 消息      │ 后端 broadcast
        ▼               ▼                    ▲
┌─────────────────────────────────────────────────────────────┐
│  Node 网关  server.mjs  (ESM, port 4199)                       │
│                                                               │
│  http.createServer ── 静态 + /vault?path= 取字节 + /api/status  │
│  WebSocketServer{path:'/agent'} ── 每 tab 一条 query() 流        │
│  文件 op (open/save/move/rename/delete/make_folder/history…)    │
│  chokidar.watch(VAULT) ──► 盘有变化就 broadcast(vault_dirty)    │
│  git ── 每个写操作一次 commit (历史/回滚/恢复)                    │
│  canUseTool ── 权限策略   warmHarness ── 启动预热 / 命令列表      │
└───────┬───────────────────────────────────────┬──────────────┘
        │ @anthropic-ai/claude-agent-sdk          │ fs / git
        ▼ spawn 自带 claude-code runtime           ▼
┌──────────────────────────────┐      ┌────────────────────────┐
│  Claude Code Harness          │      │  ~/UniworkVault (git)    │
│  ~/.claude OAuth (订阅)        │      │  WIKI/  Vault/          │
│  ~/.claude/skills + CLAUDE.md │◄────►│  公司 Coverage 三级目录  │
│  Read/Edit/Bash/Skill/MCP…    │ cwd  │  真实 .md/.docx/.xlsx    │
└──────────────────────────────┘      └────────────────────────┘
```

### 三条数据通道（关键）

工作台靠**三条独立通道**协作，理解了这三条就理解了整个数据流：

1. **① HTTP `GET /vault?path=…`** —— 取**文件字节**。前端渲染 docx/xlsx/pdf 时 `fetch(vaultUrl(path)).arrayBuffer()`，md 用 `.text()`。盘是唯一 ground-truth，每次打开都现取（带 `&t=Date.now()` 破缓存）。
2. **② WebSocket `/agent`** —— **对话 + 文件操作**。前端发 `{op, …}`，后端回 `{ev, …}`。AI 对话（`user_turn`）、文件增删改移、历史回滚都走这里。
3. **③ chokidar 反向推送（复用同一 WS 广播）** —— **盘→页面实时同步**。后端 watch 整个 Vault，**任何**文件变化（不管是 AI 改的、你在 Finder/编辑器改的、还是另一个进程改的）都 broadcast `vault_dirty`/`file_changed`，前端据此重建侧栏树或重渲染打开的文件。**这就是"文件导航栏和本地实时同步"的实现**——无轮询、无需手动刷新。

---

## 2. 后端 `server.mjs`

### 2.1 鉴权：订阅 OAuth，不用 API key

- SDK（`@anthropic-ai/claude-agent-sdk`）`query()` 会 spawn 自带的 claude-code runtime，runtime 读 `~/.claude` 的 OAuth 登录态（Pro/Max 订阅）。
- **桌面 App 的登录态外部 Node 进程无法复用**（token 在 host 进程内、`HOST_AUTH_REFRESH`），所以后端必须有**独立的 `claude login`**（一次性，只有用户能做，交互式 OAuth）。
- 环境里**不带 `ANTHROPIC_API_KEY`**——API key 路径在 SDK client 上反而被封（claudian issue #376 实锤），订阅 OAuth 才是正路。

### 2.2 query() 配置（每个对话 tab 一条流）

```js
query({ prompt: <streaming-input>, options: {
  cwd: VAULT,                                    // 沙箱根 = ~/UniworkVault
  settingSources: ['user','project','local'],    // 显式加载 ~/.claude/skills + CLAUDE.md + slash 命令
  skills: 'all',
  systemPrompt: { type:'preset', preset:'claude_code', append: UNIWORK_APPEND },  // 注入投研约束/数值原子性/Vault 结构约定
  permissionMode: 'default',
  allowDangerouslySkipPermissions: true,          // 允许动态切 bypass；实际决策走 canUseTool
  includePartialMessages: true,                   // token 级流式
  enableFileCheckpointing: true,                  // 支持文件 checkpoint
  canUseTool: makeCanUseTool(conn, tabId),        // 权限回调（见 2.6）
}})
```

`UNIWORK_APPEND` 是追加在 `claude_code` 预设之后的投研定制系统提示（Vault 三级结构约定、`build wiki vault` 指令、录音→会议纪要流程、"直接改当前打开文件不用每次说工具/路径"等）。
> ⚠️ 它是**反引号模板串**——内部**禁止再出现反引号**（会提前闭合模板，`node --check` 能过但运行时报错）。

### 2.3 SDKMessage → 前端事件映射

后端把 SDK 的消息 union 翻译成精简的 `{ev}` 推给前端：

| SDK 消息 | 后端转发 `ev` | 前端落点 |
|---|---|---|
| `system`(init) | `session`（携带 sessionId / model / skills / **slash_commands** / tools / mcp / apiKeySource） | 存 session_id，填 `/` 命令列表 |
| `stream_event`（partial） | `reasoning{delta}` / `content{delta}` | COT 折叠区 / 正文流式追加 |
| `assistant` blocks | text→`content`、thinking→`reasoning`、tool_use→`tool` | 工具 chip |
| tool 执行完 | `tool_done` | chip 收尾 |
| `result` | `result`（携带 `ctxTokens` = input+cache_read+cache_creation） | 收尾 + **context 圆环**用量 |

### 2.4 WebSocket 文件操作全表（前端 → 后端）

| op | 作用 | git 行为 |
|---|---|---|
| `list_vault` | 列出整棵树 + md 正文 → `vault` 事件 | — |
| `save_file` / `save_file_b64` | 写 md 文本 / 写二进制(base64，docx/xlsx/上传) | — |
| `commit_file` | 接受改动 → 提交当前版本 | `git commit` |
| `discard_file` | 拒绝改动 → 还原到 HEAD | `git checkout HEAD -- path` |
| `file_history` | 取某文件的提交历史 | `git log` |
| `file_rollback` | 回滚到任一历史版本（非破坏，记一条回滚 commit） | `git show sha:path` → 落盘 + commit |
| `file_head_b64` | 取 HEAD 版本字节（docx 原生修订对比的基线） | `git show HEAD:path` |
| `make_folder` | 新建文件夹 | mkdir |
| `move_file` | 拖拽换文件夹 | `git mv` + commit |
| **`rename_path`** | **右键重命名（文件/文件夹）** | **`git mv` + commit（保历史）** |
| **`delete_path`** | **右键删除 = 移入回收站（文件/文件夹）** | **`git mv → 回收站/` + manifest 记原路径 + commit（可恢复）** |
| **`restore_trash`** | **回收站恢复到原位** | **`git mv 回收站/x → 原路径` + commit** |
| **`purge_trash` / `empty_trash`** | **回收站单条 / 全部彻底删除** | **`git rm` + commit** |
| **`mount_path`** | **「添加」：按本地绝对路径挂载文件夹** | **`fs.symlink → User import/`（gitignore，不入库）** |
| **`unmount`** | **卸载挂载点（不删外部原文件）** | **`fs.unlink` symlink** |
| `user_turn` / `interrupt` / `set_model` / `set_perm_mode` / `permission_response` | 对话 / 中断 / 切模型 / 切权限 / 审批应答 | — |

### 2.5 git-backed Vault：历史 / 回滚 / 删除可恢复

Vault 是一个 git 仓库，**每个写操作都自动 commit**。带来三件事：
- **修改历史**：每个文件可查 `git log`，侧栏"🕘 历史"列出所有版本，可回滚到任一版本（回滚本身也是一次 commit，可继续回滚，非破坏）。
- **接受 / 拒绝 = commit / checkout**：AI 改了文件→盘上已是新版→"接受"只需 commit；"拒绝"= `git checkout HEAD -- path` 还原。
- **删除 = 移入回收站（可恢复）**：右键删除把文件/文件夹 `git mv` 到 `回收站/`，并在 `回收站/.manifest.json`（dotfile，不显示在树里）记下 `{原路径, 时间, 类型}`。回收站是常驻根目录项，右键里 **恢复到原位** / **彻底删除**，根目录右键 **清空回收站**。恢复 = 按 manifest `git mv` 回原路径。彻底删除/清空 = `git rm`（内容仍在 git 历史，但移出工作区）。详见 §3.1 / §3.6。

### 2.6 chokidar watcher + 自写抑制（实时同步的核心）

```js
chokidar.watch(VAULT, { ignored:/\.(git|DS_Store)/, ignoreInitial:true,
                        awaitWriteFinish:{ stabilityThreshold:200 } })
```

- 文件 `add`/`change` → 读内容 → `file_changed{path,newText}` + `vault_dirty`；`unlink` → `file_changed{deleted}` + `vault_dirty`。
- 文件夹 `addDir`/`unlinkDir` → `vault_dirty`（含空目录）。
- **自写抑制**：后端自己 `save_file` 写盘也会触发 watcher → 回声。用 `selfWrites` map 记下刚写的内容，watcher 回调里若"内容与刚写的一致"就跳过这一次（之后真实的外部编辑照常推送）。二进制读不出文本，用 `has(abs)+text===null` 判定。
- **效果**：你在 Finder 删个文件、用 vim 改个 md、AI 跑 Bash 生成文件——侧栏树 1 秒内自动更新，无需刷新。这是设计预期，已 E2E 验证双向同步。

### 2.7 canUseTool 权限策略（auto / bypass 两档）

`set_perm_mode` 切换，前端底部 auto/bypass 开关（localStorage 持久）：

- **bypass**：全放行（连改文件的 Bash/python 都不弹）。
- **auto**（默认）依次判定：`sessionAllow`（本会话已"总是允许"过）→ `AUTO_ALLOW`（只读 Read/Grep/Glob + 联网 WebSearch/WebFetch）→ `EDIT_TOOLS` 且**路径在 Vault 内** → 以上命中即放行；否则（Bash / Vault 外写 / 未知工具）→ 推 `permission_request` 给前端，弹**内联审批条**（允许 / 总是允许 / 拒绝 / 中断）。
- **注意**：Vault 内文件编辑是**自动放行**的——它不弹权限窗，改动通过**绿增红删 diff 复核**来把关（那是改前/改后盘内容对比，不是权限弹窗）。

### 2.8 harness 预热

`warmHarness()` 在 server 启动时跑一条 throwaway `query()`（maxTurns:1）抓 init 消息，缓存 `{skills, slash, tools, model}` 并 broadcast `harness`。这样前端**连上就有完整 `/` 命令列表**（80 skills / 98 slash / 42 tools，与本地 Claude Code 完全一致），不必先发一条消息。`hello` 事件也带上缓存。

---

## 3. 前端 `index.html`

Vue3 global build，单文件，`createApp({ setup(){…} }).mount('#app')`。全 CDN 零构建（Vue / TipTap@esm.sh / SuperDoc@esm.sh / Luckysheet / pdf.js / mammoth / SheetJS / diff-match-patch / marked / turndown）。

### 3.1 侧栏文件树（实时同步 + 双链 + 拖拽 + 右键 + 建夹）

- **数据**：`list_vault` → `vault` 事件 → `buildFilesFromVault(folders, files)`，文件带 `folder` 路径字段。`treeRows` 是 computed，按 `expandedFolders` 展开态拍平成可渲染行（folder/file，带 depth）。
- **根目录（4 个）**：`📚 WIKI`（每公司一页维基 md）、`🗄️ Vault`（Company Coverage / Industry Coverage / Screening → 各公司文件夹 → 研报/季报年报/Model/News/Raw）、`🗑 回收站`（删除的东西，可恢复，§3.6）、`🔗 User import`（挂载进来的本地文件夹，§3.6）。后两个由 `ensureRoots()` 在启动时 mkdir，常驻显示。彩色 SVG 图标按类型/层级上色。
- **双链 + 反向链接**：md 里 `[[笔记名]]` 经 TipTap ProseMirror inline decoration 实时渲染成可点链接（解析=蓝/未解析=红），点击跳转或建新笔记；笔记底部反向链接面板。**解析/着色/跳转/反向链接全部走唯一实现 `BL` 模块，严格遵循 [BACKLINK_SCHEMA.md](BACKLINK_SCHEMA.md)**：只有显式 `[[…]]` 且能 resolve 到本笔记（按 `note.id` 判等、非同名、未解析/自引用/纯文本提及都不算）才算反向链接；每条产出过 `BL.validate`，`BL.audit()` 可全库自检。
- **拖拽换夹**：`.tfile` draggable，`.tfolder` 作 droptarget → `move_file`（git mv）。
- **右键菜单（数据驱动，按区域分支）**：`@contextmenu` → `menuFor(row)` 按路径返回菜单项 `[{ic,label,note,danger,act}]`（空数组=不弹）+ 全屏 backdrop 点外即关。普通区=重命名/删除；`回收站/`=恢复/彻底删除、回收站根=清空；`User import/` 挂载点=卸载、根=添加挂载；Vault/WIKI 根与挂载内部=不可改。重命名=行内输入（自动选中除扩展名部分）→ `rename_path`。**文件和文件夹通用**。
  - 关键：`rowKey`（folder→`d:`+path / file→`f:`+id）做内联改名的 v-if 比对——不能用对象 identity，`treeRows` 每次重算行对象引用都变。
  - 关键：`handleMoved` 用**前缀替换**（`path===from || startsWith(from+'/')`）——文件夹改名时其内打开的 tab 路径同步、不断链；`handleDeleted` 按前缀关掉被删路径下所有打开 tab。
- **新建文件夹**：sb-head `📁＋` 或文件夹行 hover `＋` → 行内输入 → `make_folder`。

### 3.6 回收站 & 挂载本地文件夹

- **回收站**：删除走"移入回收站"（§2.5），可恢复/彻底删除/清空。回收站 + manifest 全在 git 里，所以回收站本身也版本化。
- **添加（挂载）**：侧栏 `＋ 添加` → 输入本地**绝对路径** → `mount_path` 在 `User import/` 下建 **symlink**（不复制、live 指向外部文件夹）。`listVault` 的 `walk` 跟随 symlink（Dirent 对 symlink 的 isDirectory/isFile 都 false，需 `fsp.stat` 解析真实类型）+ depth≤12 防环；chokidar `followSymlinks:false` 避免深度 watch 大文件夹炸（其内容变化靠手动刷新，树仍显示）。`/vault?path=` 读取跟随 symlink → 拿到外部内容；Claude harness 也能 Read 挂载路径（路径 lexical 落在 cwd 沙箱内）。`User import/` 写进 `.gitignore`，外部内容不进版本库。**卸载** = `unmount` 只删 symlink，外部原文件夹分毫不动。

### 3.2 四类文件渲染器

| 类型 | 渲染器 | 实现要点 |
|---|---|---|
| **md** | TipTap (ProseMirror) | 单一所见即所得可编辑视图；`[[双链]]` decoration；blur 时 `save_file` 落盘；`marked`/`turndown` 进出 |
| **docx** | **SuperDoc** (@harbour-enterprises, esm.sh) | 真 .docx 进出、ProseMirror 内核、高保真。手改 → `exportDocx()` → `save_file_b64`。**用原生 Word 修订/审阅做复核**（见 3.3） |
| **xlsx/csv** | **Luckysheet** + LuckyExcel + SheetJS | 真 Excel 体验；Cmd+D/R 填充；缩放 `setSheetZoom`；csv 经 SheetJS 桥接 |
| **pdf** | **pdf.js** (UMD) | canvas 渲染 + 文字层（可选中→加入对话），只读 |

- **居中/缩放**：docx 默认居中（`.docx-host` flex center），进修订模式才左移给修订栏让位；Word 缩放走 SuperDoc 工具栏，Excel 走 Luckysheet zoom 滑块。
- **二进制取字节**：统一 `fetch(vaultUrl(f.path)).arrayBuffer()`（pdf/docx）或 `.blob()`，md 用 `.text()`。

### 3.3 三种复核机制（AI 改了文件怎么给你看 + 逐条批）

| 文件类型 | 复核方式 | 实现 |
|---|---|---|
| **md** | 绿增红删 hunk diff | `mdHunkEdits(old,new)`（diff-match-patch 全文 hunk），重载编辑器 + 标记，逐条/整体 ✓接受 ✗拒绝 |
| **docx** | **Word 原生修订/审阅**（最佳） | SuperDoc `compareDocuments(基线)` → `replayDifferences({applyTrackedChanges})` → 正文内联红删绿增 + 右侧逐条 rail（`trackChanges.list()` + `.decide({accept/reject})`）。**单实例顺序**：取 HEAD 基线 + 新版各载一次、快照 `{state,converter,schema}` 对比（⚠️ SuperDoc 全局 store，两实例必打架） |
| **xlsx** | 单元格级 diff | 重载 sheet + 对比变更单元格，接受/拒绝 |

复核进行中收到的 `vault_dirty` 会**暂存**（`pendingVaultRefresh`），等复核结束再重建侧栏——否则 openFile 重渲染会抹掉绿增红删标记。

### 3.4 对话区

- **多 tab 会话**：≤3 个对话 tab，每个绑一条后端 query() 流，独立 interrupt/resume（session_id）。`sess.bound` 跟随当前打开文件（让"这句改一下"知道改哪个文件）。
- **流式**：`reasoning`(COT 折叠) + `content`(正文) token 级追加；工具调用显示 chip；Esc → `interrupt`。
- **输入框**：`/` 唤起命令菜单（来自 `conn.slash` 真实 harness 列表，非硬编码）；`@` 引用文件；**📎 上传附件**（`onChatAttach` → `save_file_b64` 写 `Vault/_uploads/` → 作为上下文，AI 用真实路径 Read）；斜杠命令原样下发（不加文件上下文前缀，否则 `/` 不在行首 runtime 不识别）。
- **底部栏**：模型选择（Opus 4.8 · 1M）、auto/bypass 权限开关、**context 占用圆环**（SVG donut，`stroke-dasharray=2π·9`、offset 按 token 占用百分比，65%/85% 阈值变橙/红）。
- **权限审批条**：`permission_request` → 内联条（允许/总是允许/拒绝）→ `permission_response`。

### 3.5 IndexedDB 持久化

跨刷新不丢：文件树状态 / 会话 / 上传 / 表格快照 / docx+pdf buffer / UI 状态。`serFile/serSession` 只产纯对象（避开 Vue Proxy）；`hydrating` 标志屏蔽还原期保存（防 deep-watch 死循环）；`?reset` / `resetLocal()` 清库。
> 注：盘是文档内容的 ground-truth，IndexedDB 只缓存 UI 状态与二进制 buffer；文档实际内容每次都从 `/vault` 现取。

---

## 4. 录音 → 会议纪要（ASR E2E 流程）

完全在 demo 内跑通（不靠旁路 Bash）：

1. 📎 上传录音（m4a → `Vault/_uploads/`，`onChatAttach` 真上传）。
2. 对话说"做 meeting minutes"。
3. app 的 Claude：`llm-subagent` skill 跑火山方舟 ASR 转写 → `visiting-memo` skill 套会议纪要模板 → 生成 .docx 存进 `Company Coverage/<公司>/News/`，并按 `YYYYMMDD_公司_主题` 重命名原始录音 + 纪要。

**关键坑**：SDK app **没有** CLI 的"后台任务完成自动 re-invoke"机制——若 Claude 把 ASR 丢 `run_in_background` 就结束 turn 等 wakeup，会永远不回来。修法：系统提示里要求 **ASR 前台同步跑**（几十秒），一个 turn 内转写→读 transcript→生成 docx 全做完。TOS 上传在 macOS 签名失败 → skill 已改成自动回退 inline(base64)。

---

## 5. 目录结构 & 运行

```
uniwork-v2/
├─ index.html        前端单文件（Vue3，2800 行）
├─ server.mjs        Node 网关（SDK + WS + 文件 op + watcher，600 行）
├─ seed-vault.mjs    把种子结构写进 ~/UniworkVault 并 git init
├─ package.json      deps: @anthropic-ai/claude-agent-sdk / ws / chokidar
├─ harness-check.mjs / smoke.mjs / test-ws.mjs   自检脚本
├─ sample_*.{docx,xlsx,pdf}                       样例文件
├─ README.md         面向用户的简介
└─ ARCHITECTURE.md   ← 本文
```

```bash
# 一次性：装独立 CLI + 订阅登录（只有你能做，交互式 OAuth）
npm install -g @anthropic-ai/claude-code && claude login    # 选订阅，别用 API key

# 跑
cd uniwork-v2 && npm install
node seed-vault.mjs      # 首次：建 ~/UniworkVault
node server.mjs          # → http://localhost:4199
node server.mjs --mock   # 纯 UI 不接 Claude（调前端用）
```

- **改了 `server.mjs` 必须重启**（preview_stop + preview_start）；**改 `index.html` 只需 reload 页面**。
- docx 走 SuperDoc（esm.sh CDN，需联网）；md/xlsx/pdf 走 TipTap/Luckysheet/pdf.js。

---

## 6. 安全 / 凭证

- **订阅 OAuth**，环境不带 `ANTHROPIC_API_KEY`。
- **数值原子性**（CLAUDE.md 全局铁律）：精确数字只能由脚本/原始 API 产生，LLM 只搬运不转换；失败宁缺毋假（null + 来源说明）。
- **沙箱**：`cwd: VAULT` + canUseTool + 路径校验（`/vault` 与静态服务都做 `startsWith(根)` 防越界）。
- GitHub PAT 从坚果云 WebDAV 读取（不硬编码、不向用户索取）；`config.local.js`（DeepSeek 时代遗留）不进版本库。
- ASR 上传到用户自己的火山方舟 TOS（用户既有工作流，已授权）。

---

## 7. 关键设计决策与坑（速查）

| 决策/坑 | 说明 |
|---|---|
| 盘 = 唯一 ground-truth | IndexedDB 只缓存 UI/buffer；文档内容每次 `/vault` 现取，避免双写不一致 |
| SuperDoc 单实例顺序 | 全局 store，两实例并存必互相 teardown；对比用"顺序载入 + 快照 `{state,converter,schema}`" |
| HTTP 模块缓存污染 | 反复 reload preview 做 SuperDoc 实验会污染 HTTP 模块缓存→后续 docx 全卡死；解法是换全新 browser context（preview_stop+start），JS/IDB reload 清不掉它 |
| 自写抑制 | `selfWrites` map 防 save→watcher→file_changed 回声 |
| 前缀感知 move/delete | 文件夹改名/删除时同步其内打开 tab 的路径，避免断链或误关 |
| `UNIWORK_APPEND` 无反引号 | 它是模板串，内部反引号会提前闭合 |
| 斜杠命令不加前缀 | `/skill` 原样下发，加上下文前缀会让 `/` 不在行首、runtime 不识别 |
| ASR 前台同步 | SDK app 无后台 wakeup，ASR 必须前台跑完 |

---

*维护：Uniwork 投研工作站 · V2 接 Claude Code harness · 最后更新随实现演进*
