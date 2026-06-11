# Uniwork V2

AI-powered investment research workstation built on Claude Code's full harness. Select text, ask AI, review changes inline — across Markdown, Word, Excel, PDF, PowerPoint, and HTML.

> Single-file frontend (`index.html`, Vue 3 CDN, zero build step). Node gateway (`server.mjs`) wraps `@anthropic-ai/claude-agent-sdk` and exposes the complete Claude Code runtime to the browser. Files live on disk (`~/UniworkVault`, git-backed) — Claude reads and writes real files, not browser memory.

---

## Features

### Multi-format document workspace
Open `.md` `.docx` `.xlsx` `.pdf` `.pptx` `.html` side by side. Each format uses a specialized renderer:

| Format | Renderer | Capabilities |
|---|---|---|
| Markdown | TipTap (ProseMirror) | WYSIWYG editing, `[[wikilinks]]`, AI suggestion review |
| Word | SuperDoc 1.39.0 (ProseMirror) | High-fidelity rendering, tracked changes for AI review |
| Excel | Luckysheet | Formula-capable grid, cell range selection → AI |
| PDF | pdf.js | Render + text layer for selection |
| PowerPoint | pptx-renderer 1.1.0 | DOM/SVG high-fidelity, text selectable |
| HTML | iframe + designMode | Full-fidelity preview with inline editing |

### Select → Ask AI
Select text in **any** document type → floating bubble appears above the selection (with persistent highlight) → write a comment or press Enter to attach the quote to your conversation. Works with mouse drag, trackpad three-finger drag, keyboard Shift-select, and double-click word select.

### AI edits with inline review
When Claude modifies a file, you review before accepting:

- **Markdown**: Per-suggestion green insertions / red deletions with inline ✓/✗ controls
- **Word (.docx)**: SuperDoc tracked changes — red strikethrough / green additions + right-side review rail with per-item accept/reject
- **PowerPoint**: Slide-anchored approval cards showing what changed per slide
- **Non-text changes** (images, layout): Notification bar with accept/reject

### Git Time Machine
Every file change is auto-committed. Full history browser, one-click rollback, undo rollback — all non-destructive (rollback creates a new commit).

### Wikilinks & backlinks
`[[double brackets]]` render as clickable links. Backlink panel shows all files referencing the current note. Resolution works across folders (basename match with path override). Supports `[[path/to/note|display alias]]` syntax.

### Full Claude Code harness
Not a thin wrapper — runs the **complete** Claude Code runtime: Read / Write / Edit / Bash / Grep / WebSearch / WebFetch / Task / Skill / MCP / hooks / subagents. Loads all your `~/.claude/skills`. Uses your subscription (OAuth), not API keys.

### File management
- Drag-and-drop files **and folders** in the tree to reorganize (git mv, preserves history)
- Drag external files onto a specific folder to upload there (or onto empty space for vault root)
- Right-click context menu: rename, delete (→ recycle bin), new subfolder, upload to folder
- Import external folder mounts (symlink, no copy)

---

## Quick Start

### Prerequisites
- **Node.js 20+** (22+ recommended)
- **Claude Code CLI** with an active Pro / Max subscription

### 1. Install Claude Code and log in

```bash
npm install -g @anthropic-ai/claude-code
claude login
# → Choose "Claude account (Pro/Max subscription)" — NOT "API key"
```

> **Important**: The Agent SDK requires subscription OAuth. API keys are rejected server-side. Verify login: `node smoke.mjs` should print `PONG`.

### 2. Install and run

```bash
cd uniwork-v2
npm install
node server.mjs
```

Open **http://localhost:4199**. Status badge shows `● Online` when connected and authenticated.

### 3. (Optional) Seed a sample vault

```bash
node seed-vault.mjs
# Creates ~/UniworkVault with sample company wikis, research notes, and git baseline
```

### Environment variables

| Variable | Default | Description |
|---|---|---|
| `PORT` | `4199` | Server port |
| `UNIWORK_VAULT` | `~/UniworkVault` | Vault directory (auto git-init if needed) |
| `UNIWORK_MOCK` | — | Set `=1` for mock mode (no Claude, UI testing) |
| `UNIWORK_MODEL` | `claude-opus-4-8` | Default model |

---

## Claude Code Integration

### If you already use Claude Code
Uniwork V2 is ready out of the box — it reuses the same `~/.claude` credentials, skills, and hooks. Just `npm install && node server.mjs`.

### Auto-configuration for Claude Code

The repo includes a `CLAUDE.md` — any Claude Code instance that opens this project will automatically understand the architecture, setup steps, and available skills. No manual briefing needed.

### Skills: built-in + your own

Uniwork ships with 4 built-in investment research skills (in `.claude/skills/`):

| Skill | Capability |
|---|---|
| `yfinance-router` | Stock prices, PE, market cap, EPS, dividends, historical K-line |
| `ak-xq-router` | A-share/HK consensus, ownership, flows, EPS forecasts, Fwd PE |
| `finance-cowork` | Company wiki build/maintain, model digest, report generation |
| `gs-research-chart` | Institutional charts: PE band, drawdown, rebased perf, revenue YoY |

**Plus your own skills** — anything in `~/.claude/skills/` is loaded automatically. If you have a more complete version of a built-in skill (same name), yours takes priority.

**To add a custom skill**: create `~/.claude/skills/<name>/SKILL.md` with frontmatter and instructions. It appears in the `/` command menu and AI uses it automatically.

```
Skill loading priority:
1. ~/.claude/skills/     ← your skills (highest priority)
2. .claude/skills/       ← built-in Uniwork skills
3. System prompt         ← yfinance/openpyxl/python-docx guidance
```

### How the connection works

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

### WebSocket protocol

**Client → Server**

| Op | Description |
|---|---|
| `user_turn` | Send user message with quotes, file context, model |
| `list_vault` | Request file tree |
| `save_file` / `save_file_b64` | Write text / binary file |
| `commit_file` | Git commit with message |
| `file_history` | Git log for a file |
| `file_rollback` | Rollback to specific commit |
| `move_file` | Move file or folder (git mv) |
| `make_folder` | Create directory |
| `open_local` | Open in native app (Word/Excel/PowerPoint) |
| `set_perm_mode` | Switch auto / bypass permission mode |
| `set_fast` | Toggle fast mode |

**Server → Client**

| Event | Description |
|---|---|
| `vault` | Full file tree (folders + files) |
| `file_changed` | File modified on disk (triggers review if AI turn active) |
| `turn_start` / `text` / `reasoning` / `tool` / `result` | Streaming AI turn lifecycle |
| `committed` / `history` | Git events |
| `toast` | User-facing notification |

---

## Core Modules & Open-Source Stack

### Open-source dependencies

**Frontend** (all CDN/ESM, zero build):

| Library | Version | License | Role |
|---|---|---|---|
| [Vue 3](https://vuejs.org/) | 3.4.21 | MIT | Reactive UI framework (Composition API, single-file) |
| [TipTap](https://tiptap.dev/) | 2.11.5 | MIT | Markdown WYSIWYG editor (ProseMirror core) — editing, wikilink decorations, AI suggestion review |
| [SuperDoc](https://github.com/nicosResworworlds/super-doc) | 1.39.0 | Apache-2.0 | Word (.docx) high-fidelity rendering + editing (ProseMirror core) — tracked changes for AI review |
| [Luckysheet](https://github.com/dream-num/Luckysheet) | 2.1.13 | MIT | Excel-compatible spreadsheet (formulas, cell selection, multi-sheet) |
| [pdf.js](https://mozilla.github.io/pdf.js/) | 3.11.174 | Apache-2.0 | PDF rendering with selectable text layer |
| [pptx-renderer](https://github.com/nicosResworworlds/pptx-renderer) | 1.1.0 | Apache-2.0 | PowerPoint DOM/SVG rendering (text selectable, EMF/WMF vector support) |
| [marked](https://marked.js.org/) | 12.0.2 | MIT | Markdown → HTML parser |
| [turndown](https://github.com/mixmark-io/turndown) | 7.1.3 | MIT | HTML → Markdown converter (save TipTap edits back to .md) |
| [diff-match-patch](https://github.com/google/diff-match-patch) | 20121119 | Apache-2.0 | Text diff engine for markdown green/red inline review |
| [mammoth](https://github.com/mwilliamson/mammoth.js) | 1.7.2 | BSD-2 | .docx → HTML (used for legacy import path) |
| [JSZip](https://stuk.github.io/jszip/) | 3.10.1 | MIT | ZIP manipulation — .pptx/.docx XML diff, theme font extraction |
| [LuckyExcel](https://github.com/nicosResworworlds/LuckyExcel) | 1.0.1 | MIT | .xlsx → Luckysheet data converter |
| [jQuery](https://jquery.com/) | 3.7.1 | MIT | Luckysheet dependency |
| [html-docx-js](https://github.com/nicosResworworlds/html-docx-js) | 0.3.1 | MIT | HTML → .docx export |

**Backend** (npm):

| Package | Version | Role |
|---|---|---|
| [@anthropic-ai/claude-agent-sdk](https://docs.anthropic.com/en/docs/agents/agent-sdk) | ^0.3.0 | Claude Code runtime — full harness (tools, skills, MCP, hooks) |
| [chokidar](https://github.com/paulmillr/chokidar) | ^4.0.0 | File system watcher (vault change detection) |
| [ws](https://github.com/websockets/ws) | ^8.18.0 | WebSocket server |

### Module: Markdown editor + AI review

**Stack**: TipTap (ProseMirror) + marked + turndown + diff-match-patch

The TipTap editor renders `.md` files as WYSIWYG with live `[[wikilink]]` decorations (ProseMirror `Decoration.inline`). When AI modifies a file, `diff-match-patch` computes the delta between old and new text, then injects per-change `<ins>`/`<del>` decorations with inline ✓/✗ accept/reject buttons (ProseMirror Plugin). Accepted changes are applied to the editor state; rejected ones restore the original text. The editor saves back to `.md` via turndown (HTML→Markdown).

### Module: Word (.docx) editor + AI review

**Stack**: SuperDoc 1.39.0 (ProseMirror core) + JSZip

SuperDoc provides Word-faithful rendering with pagination, fonts, tables, and headers. For AI review, the flow is: load the AI-modified version → load the git HEAD baseline → `compareDocuments()` to compute the diff → `replayDifferences({applyTrackedChanges:true})` to inject native Word tracked changes (red strikethrough / green additions). A right-side review rail lists each change with per-item accept/reject. Non-text changes (images, styles) are detected via JSZip byte-level comparison of `word/media/*` entries and shown as a notification bar.

SuperDoc's built-in comments module is disabled (`modules:{comments:false}`) to avoid conflicting with the app's own selection→Ask AI bubble. The `trackChanges` module remains enabled for AI review.

### Module: Spreadsheet (.xlsx)

**Stack**: Luckysheet + LuckyExcel + openpyxl (server-side Python)

LuckyExcel converts `.xlsx` → Luckysheet data format on the frontend. Luckysheet provides the formula-capable grid with cell range selection. When AI modifies an `.xlsx`, it runs Python + openpyxl server-side (preserving formulas and formatting). The frontend detects the file change via chokidar watcher and reloads the sheet.

### Module: PDF viewer

**Stack**: pdf.js 3.11.174

Renders PDF pages to canvas with a transparent text layer overlay for selection. Selection flows into the same bubble→Ask AI pipeline as other formats.

### Module: PowerPoint (.pptx) viewer + AI review

**Stack**: pptx-renderer 1.1.0 (DOM/SVG) + JSZip

`PptxViewer.open()` renders all slides as DOM/SVG elements with selectable text spans. Zoom uses per-slide `transform:scale()` with sized wrappers (not CSS zoom, which triggers ResizeObserver infinite reflow). For AI review, JSZip extracts slide XML from old and new versions, text-level diff identifies changed slides, and floating approval cards are anchored to each changed slide.

**CJK font handling**: Windows font names are aliased via `@font-face local()` declarations (KaiTi→Kaiti SC, SimSun→Songti SC, etc.). For theme fonts (`+mn-ea` references that the renderer doesn't resolve to explicit names), the deck's `theme1.xml` is parsed at render time to extract the minor-font EA typeface, mapped to the macOS equivalent, and injected as `--pptx-cjk` CSS custom property in the blanket font rule.

**Embedded font stripping**: `strip_embedded_fonts.py` removes Windows-embedded font subsets from .pptx files (these cause garbled CJK glyphs on macOS PowerPoint). Runs automatically when opening a .pptx in the native app via "Open Local".

### Module: HTML viewer + editor

**Stack**: iframe + designMode

HTML files render in an iframe with full script execution. For static HTML, `designMode='on'` enables inline text editing. For JS-rendered HTML (detected by stripping scripts and checking if `textContent < 200`), a staticization pass runs the scripts in a hidden iframe, waits for render settle, then serializes the DOM and strips scripts to produce an editable static snapshot.

### Module: Selection → Ask AI (unified pipeline)

**Stack**: ProseMirror events + DOM Selection API + position:fixed overlay

All 6 document types feed into a single bubble pipeline:
- **md / docx**: ProseMirror `selectionUpdate` event (works with mouse, trackpad three-finger drag, keyboard)
- **pdf / pptx**: capture-phase `mouseup` listener on document (beats ProseMirror's event suppression)
- **html**: iframe-to-parent `mouseup` bridge with coordinate offset translation
- **xlsx**: Luckysheet `rangeSelect` hook

Selection highlight persists while the bubble is open (position:fixed overlay rects from `getClientRects()`), independent of focus — so the highlight stays when the cursor moves to the comment input. IME composing guard prevents premature send on Enter during CJK input.

### Module: Wikilinks & backlinks

**Stack**: custom ProseMirror Plugin + regex resolver

`[[target]]` and `[[target|alias]]` are decorated in real-time by a ProseMirror Plugin that scans text nodes for the pattern. Resolution: NFC-normalize + lowercase, strip `.md/.txt/.docx` extension; if target contains `/`, match by path suffix; otherwise match by basename (folder-agnostic). Backlinks are computed by scanning all prefetched `.md` files for outbound links and checking if they resolve to the current file. Click navigates; unresolved links show in red.

### Module: Git Time Machine

**Stack**: Node `child_process` → git CLI

The vault is a standard git repo. `scheduleAutoCommit` debounces file changes and commits with awareness of AI turns (AI-modified files go through the review UI before committing, not auto-committed). History browser shows `git log --follow` per file. Rollback creates a new commit with the old content (non-destructive — you can undo a rollback by rolling forward). File moves use `git mv` to preserve history.

### Module: Agent gateway

**Stack**: @anthropic-ai/claude-agent-sdk + ws

One `query()` session per chat tab. The server injects a system prompt with vault context, the currently open file's content, and conversation history. Streaming events (`assistant` text/reasoning, `tool_use`, `result`) are mapped to WebSocket messages. Permission mode defaults to `auto` (model-based classifier, no popups). `AskUserQuestion` tool calls are intercepted and routed to a frontend selection card UI (the only viable path in headless mode). The server caches harness info (loaded skills, tools, MCP servers) on startup via a throwaway init query.

---

## Persistent Service (macOS)

```bash
# Create a LaunchAgent for auto-start on login + restart on crash
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

# Edit paths above, then load:
launchctl bootstrap gui/$(id -u) ~/Library/LaunchAgents/com.uniwork.v2.plist

# Manage:
launchctl kickstart -k gui/$(id -u)/com.uniwork.v2    # restart
launchctl bootout gui/$(id -u)/com.uniwork.v2         # stop
```

---

## File Structure

```
uniwork-v2/
├── index.html              # Frontend (Vue 3 single file, ~3800 lines)
├── server.mjs              # Backend gateway (~820 lines)
├── package.json            # 3 deps: claude-agent-sdk + chokidar + ws
├── CLAUDE.md               # Auto-config for Claude Code instances
├── ARCHITECTURE.md         # Detailed architecture docs
├── BACKLINK_SCHEMA.md      # Wikilink resolution spec
├── seed-vault.mjs          # Sample vault generator (copies samples/ → ~/UniworkVault)
├── smoke.mjs               # Auth check (prints PONG)
├── strip_embedded_fonts.py # PPTX embedded font stripper (Win→Mac CJK fix)
├── harness-check.mjs       # SDK capability probe
├── test-ws.mjs             # WebSocket protocol test
├── samples/                # Full vault snapshot — `node seed-vault.mjs` copies this to ~/UniworkVault for a complete, reproducible demo
│   ├── WIKI/
│   │   ├── focus/                   # SNDK.md, NVDA.md (focus coverage wikis, clickable [[wikilinks]])
│   │   ├── emerging peers/          # MU, WDC, Kioxia, SK Hynix, Samsung, SIMO, STX
│   │   └── Industry Coverage/       # AI compute/storage industry report
│   └── Vault/
│       ├── Company Coverage/
│       │   ├── SNDK/                # Full finance-cowork workspace: banker_reports (+PDFs),
│       │   │                        #   conferences, earnings_calls/releases, capital_iq, model,
│       │   │                        #   _data_registry.json, 研报/, WIP/ (cascade workspace)
│       │   └── NVDA/                # Same — full coverage + WIP cascade workspace
│       └── Samples/                 # AAPL deck/memo, MiniMax docx, HV industry deck
└── .claude/
    ├── launch.json         # Dev server config
    └── skills/             # Built-in research skills
        ├── ak-xq-router/
        ├── finance-cowork/
        ├── gs-research-chart/
        └── yfinance-router/
```

---

## Finance Cowork: Company Wiki Research Pipeline

The `finance-cowork` skill is a closed-loop research pipeline for maintaining structured company coverage. It powers the wiki/vault content that Uniwork renders.

### Architecture: 3-module closed loop

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

### Design principles

| Principle | Meaning |
|---|---|
| **Numbers in schema, narrative direct-write** | Only data goes in `_data_registry.json`; analysis/thesis LLM writes directly to `_sections/*.md` |
| **Mechanical vs semantic** | Code handles: cell writes, recalc, drift math, rendering. LLM handles: driver mapping, thesis changes, narrative rewrites |
| **Numerical atomicity** | Numbers only from Excel/filings/API — LLM never generates or converts numbers; extraction failure = `—`, not a guess |
| **One-way flow + gate stops** | Upstream = wiki + registry; downstream = Word/charts. Changes above threshold stop at gate for human confirmation |

### Module overview

| Module | What it does | Key tech |
|---|---|---|
| **A. model_digest** | 6-step Excel → structured data extraction | Pure openpyxl, zero LLM. Reads IS/BS/CF tabs, extracts KPIs, fiscal calendar auto-detection |
| **B. build_wiki** | Multi-source → 14-section company wiki | Dual-channel (numbers from registry, narrative from LLM). Synthesize → render → QC gate |
| **C. report_render** | Wiki → Word research report | `{REG:revenue_fy26}` placeholders auto-filled. Git version control, diff preview |
| **D. cascade_update** | Model change → reverse propagate everything | COM recalc → drift detection → gate → rewrite wiki + registry + report |

### Data registry

The `_data_registry.json` is the single source of truth for all numbers:

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

Every number in a wiki or report traces back to a registry entry. Tier A = official filings; Tier B = sell-side/web (labeled with source + confidence).

> **Full technical spec**: [`docs/finance-cowork-design.md`](docs/finance-cowork-design.md) (302 lines — module internals, file layout, quality gates, cascade algorithm, CLI commands)

---

## Security

- **No API keys**: Pure subscription OAuth. Credentials stay in `~/.claude` (macOS Keychain), never in the repo.
- **Sandboxed**: `cwd` = Vault directory. Operations outside vault require permission.
- **Dual rollback**: Git commits + SDK file checkpointing.
- **Local-only**: Designed for single-user, local machine use.

## License

Research and educational use. AI output is for reference only and does not constitute investment advice.
