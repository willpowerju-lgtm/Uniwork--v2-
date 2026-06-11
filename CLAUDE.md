# CLAUDE.md — Uniwork V2

## What is this

AI investment research workstation. Single-file Vue 3 frontend (`index.html`) + Node gateway (`server.mjs`) wrapping `@anthropic-ai/claude-agent-sdk`. Files live on disk (`~/UniworkVault`, git-backed). Claude reads/writes real files; users review changes inline (green/red diff).

## Setup (run these once)

```bash
# 1. Install Claude Code CLI and log in with your Pro/Max subscription
npm install -g @anthropic-ai/claude-code
claude login   # Choose "Claude account" — NOT "API key"

# 2. Install dependencies
npm install

# 3. (Optional) Create a sample vault
node seed-vault.mjs

# 4. Start the server
node server.mjs
# → Open http://localhost:4199
```

Verify auth: `node smoke.mjs` should print `PONG`.

## Key files

- `index.html` — Frontend (~3800 lines, Vue 3 Composition API, zero build, all CDN)
- `server.mjs` — Backend (~820 lines, Agent SDK gateway + file API + git + watcher)
- `package.json` — Three deps: `@anthropic-ai/claude-agent-sdk`, `chokidar`, `ws`
- `strip_embedded_fonts.py` — Strips Win-embedded fonts from .pptx (CJK garble fix)
- `ARCHITECTURE.md` — Detailed architecture docs
- `BACKLINK_SCHEMA.md` — Wikilink resolution spec

## Dev conventions

- **Single-file frontend**: Edit `index.html`, refresh browser. No bundler.
- **All libraries via CDN/ESM**: TipTap, SuperDoc, Luckysheet, pdf.js, pptx-renderer, marked, turndown, diff-match-patch, JSZip, mammoth — all loaded at runtime.
- **No hardcoded paths**: Use `$HOME` / `os.homedir()` / env vars. Never `/Users/<name>/...`.
- **Server uses ES modules**: `"type": "module"` in package.json. Node 20+ required.
- **Vault = git repo**: Every file change auto-commits. Rollback = new commit (non-destructive).
- **CJK fonts**: `@font-face local()` aliases Win→Mac names. PPT theme fonts resolved via `--pptx-cjk` CSS variable.

## Running tests

```bash
node smoke.mjs       # Auth check (prints PONG)
node test-ws.mjs     # WebSocket protocol test
node harness-check.mjs  # SDK capability probe
```

## Environment variables

| Var | Default | Notes |
|---|---|---|
| `PORT` | `4199` | Server port |
| `UNIWORK_VAULT` | `~/UniworkVault` | Vault directory |
| `UNIWORK_MOCK` | — | `=1` for mock mode (no Claude) |
| `UNIWORK_MODEL` | `claude-opus-4-8` | Default model |

## Architecture overview

```
Browser (index.html, Vue 3)
  ↕ WebSocket /agent + HTTP /vault
server.mjs (Node)
  ↕ @anthropic-ai/claude-agent-sdk query()
Claude Code Runtime (subscription OAuth, full harness)
```

WebSocket ops: `user_turn`, `list_vault`, `save_file`, `save_file_b64`, `commit_file`, `file_history`, `file_rollback`, `move_file`, `open_local`, `set_perm_mode`, `set_fast`.

Events: `vault`, `file_changed`, `turn_start`, `text`, `reasoning`, `tool`, `result`, `toast`.

## Skills (two layers)

### Layer 1: Built-in skills (ship with the repo)

Located in `.claude/skills/` — loaded automatically via `settingSources: ['project']`:

| Skill | Capability | Trigger |
|---|---|---|
| `yfinance-router` | Stock prices, PE, market cap, EPS, dividends, historical data | 查股价/查PE/stock price |
| `ak-xq-router` | A-share/HK: ownership, flows, EPS forecasts, Fwd PE, consensus | 拉AK/consensus/Fwd PE |
| `finance-cowork` | Company wiki build, model digest, report generation, cascade updates | 建wiki/出研报/级联更新 |
| `gs-research-chart` | Institutional research charts (PE band, K-line, drawdown, rebased perf) | 画PE band/研报chart |

Plus system-prompt-level capabilities: `openpyxl` (.xlsx read/write), `python-docx` (.docx read/write).

### Layer 2: User's own skills (auto-loaded)

Any skills in `~/.claude/skills/` are loaded via `settingSources: ['user']`. If a user skill has the same name as a built-in one (e.g. `~/.claude/skills/ak-xq-router/`), the user's more complete version takes precedence.

**To add your own skill**: create `~/.claude/skills/<skill-name>/SKILL.md` with frontmatter (`name`, `description`) and instructions. It will appear in Uniwork's `/` command menu and be available to AI automatically.

### Skill loading order

```
1. User skills     (~/.claude/skills/)        ← your custom skills, highest priority
2. Project skills  (.claude/skills/)          ← built-in Uniwork skills
3. System prompt   (server.mjs UNIWORK_APPEND) ← yfinance/openpyxl/python-docx guidance
```
