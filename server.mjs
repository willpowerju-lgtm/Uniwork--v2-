// Uniwork V2 — Node 后端网关
// 把 Claude Code 完整 harness（@anthropic-ai/claude-agent-sdk）接到浏览器 GUI。
// 本地走订阅 OAuth（不传 API key）。真·文件系统：Claude 直接改 Vault 里的真实文件，
// 前端用绿增红删 diff 复核。
//
// 跑：  node server.mjs            （需先 `claude login` 订阅）
//      UNIWORK_MOCK=1 node server.mjs   （模拟驱动，无需鉴权，用于全栈自测）
//
// 环境变量：
//   PORT          默认 4199
//   UNIWORK_VAULT 默认 ~/UniworkVault
//   UNIWORK_MOCK  =1 时用模拟 agent（不调真 SDK）
//   UNIWORK_MODEL 默认模型，默认 claude-opus-4-8

import http from 'node:http';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { execFile } from 'node:child_process';
import { WebSocketServer } from 'ws';
import chokidar from 'chokidar';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ---------- 配置 ----------
const PORT = parseInt(process.env.PORT || '4199', 10);
const VAULT = path.resolve(process.env.UNIWORK_VAULT || path.join(os.homedir(), 'UniworkVault'));
const MOCK = process.env.UNIWORK_MOCK === '1' || process.argv.includes('--mock');
const DEFAULT_MODEL = process.env.UNIWORK_MODEL || 'claude-opus-4-8[1m]';   // [1m] 后缀 = 1M 上下文档；裸 claude-opus-4-8 是标准窗口
const WEBROOT = __dirname;

fs.mkdirSync(VAULT, { recursive: true });

// ---------- git 版本历史（Vault 是 git 仓库）：每次接受改动 commit 一条，可列历史/回滚 ----------
const GIT_ID = ['-c', 'user.name=Uniwork', '-c', 'user.email=uniwork@local', '-c', 'core.quotepath=false'];
function git(args, encoding = 'utf8') {                 // execFile，无 shell → 中文文件名/参数不用转义
  return new Promise((resolve, reject) => {
    execFile('git', ['-C', VAULT, ...args], { maxBuffer: 64 * 1024 * 1024, encoding }, (err, stdout, stderr) => {
      if (err) { err.message = (encoding === 'buffer' ? '' : String(stderr || '')) + err.message; reject(err); }
      else resolve(stdout);
    });
  });
}
async function gitHistory(rel) {                        // 该文件的提交历史 [{sha,time,msg}]（最新在前）
  let out = ''; try { out = await git(['log', '--follow', '--format=%H%x1f%aI%x1f%s', '--', rel]); } catch {}
  return out.trim() ? out.trim().split('\n').map(l => { const [sha, time, msg] = l.split('\x1f'); return { sha, time, msg }; }) : [];
}
async function gitCommitFile(rel, message) {            // 把该文件的当前盘内容 commit 一条（无改动则跳过），返回新 sha 或 null
  try {
    await git(['add', '--', rel]);
    const st = await git(['status', '--porcelain', '--', rel]);
    if (!st.trim()) return null;                        // 与 HEAD 一致 → 不产生空 commit
    await git([...GIT_ID, 'commit', '-m', message || ('编辑 ' + rel), '--', rel]);
    return (await git(['rev-parse', 'HEAD'])).trim();
  } catch (e) { return null; }
}
// AI 改文件前的「原始版本」快照：若工作区与 HEAD 有差异 / 文件尚未入库，则提交一条作为可回滚基线（已干净 = HEAD 即基线，跳过）
async function snapshotBaselineIfNeeded(absPath) {
  try {
    if (!absPath) return;
    if (absPath !== VAULT && !absPath.startsWith(VAULT + path.sep)) return;
    const rel = path.relative(VAULT, absPath); if (!rel || rel.startsWith('..')) return;
    await gitCommitFile(rel, '原始版本');
  } catch {}
}

// ---------- registry 一致性闸：focus 标的的「下游派生件」(研报 docx / wiki md) 改动 commit 前，
// 核对里面被动过的数字是否还和 model 派生的 _data_registry.json(SSOT) 对得上。对不上 → 不拦提交（git 非破坏），
// 但 raise 给前端，引导走"从 model 起算级联"。模型(xlsx)/registry(json) 是上游，不在此闸内。----------
const REG_CHECK_PY = path.join(__dirname, 'registry_check.py');
const DOCX_REPLACE_PY = path.join(__dirname, 'docx_replace.py');   // 完整覆盖的 docx 查找/替换（嵌套表/文本框/页眉脚+跨run），见 UNIWORK_APPEND
function findRegistryFor(rel) {                          // rel(相对 VAULT) → 该标的的 _data_registry.json 绝对路径，找不到返回 null
  let d = path.dirname(path.join(VAULT, rel));
  while (d.startsWith(VAULT)) {                          // 向上找最近的、且位于 Company Coverage 子树内的 registry
    const reg = path.join(d, '_data_registry.json');
    if (d.includes(path.sep + 'Company Coverage' + path.sep) && fs.existsSync(reg)) return reg;
    if (d === VAULT) break;
    d = path.dirname(d);
  }
  if (/(^|\/)WIKI\//i.test(rel)) {                       // WIKI/<T>.md → 映射回 Company Coverage/<T>/registry
    const t = path.basename(rel).replace(/\.md$/i, '');
    const cc = path.join(VAULT, 'Vault', 'Company Coverage', t, '_data_registry.json');
    if (fs.existsSync(cc)) return cc;
  }
  return null;
}
async function registryConsistencyCheck(rel) {           // 返回 {divergences:[...]} 或 null（一致/不适用）
  try {
    const ext = path.extname(rel).toLowerCase();
    if (!['.docx', '.md'].includes(ext)) return null;    // 只盯报告/wiki 文本派生件
    if (path.basename(rel) === '_data_registry.json' || /(^|\/)model\//i.test(rel)) return null;  // 上游源，跳过
    const reg = findRegistryFor(rel);
    if (!reg) return null;
    const abs = path.join(VAULT, rel);
    if (!fs.existsSync(abs)) return null;
    let oldArg = [], tmp = null;
    try {                                                // HEAD 版本(= 改动前)落临时文件，二进制安全
      const buf = await git(['show', 'HEAD:' + rel], 'buffer');
      tmp = path.join(os.tmpdir(), 'uw_old_' + process.pid + '_' + Date.now() + ext);
      await fsp.writeFile(tmp, Buffer.from(buf));
      oldArg = ['--old', tmp];
    } catch { /* 无 HEAD = 新文件 → 脚本走 no-baseline，不报 */ }
    const out = await new Promise((res) => {
      execFile('python3', [REG_CHECK_PY, '--registry', reg, '--new', abs, ...oldArg, '--label', rel],
        { env: { ...process.env, PYTHONIOENCODING: 'utf-8', PYTHONUTF8: '1' }, maxBuffer: 16 * 1024 * 1024 },
        (err, stdout) => res(String(stdout || '').trim()));
    });
    if (tmp) fsp.unlink(tmp).catch(() => {});
    let j = null; try { j = JSON.parse(out); } catch { return null; }
    return (j && j.ok === false && Array.isArray(j.divergences) && j.divergences.length) ? j : null;
  } catch { return null; }
}

// 真 SDK 仅在非 mock 时动态加载（mock 模式下即使没装/没鉴权也能跑）
let agentQuery = null;
if (!MOCK) {
  ({ query: agentQuery } = await import('@anthropic-ai/claude-agent-sdk'));
}

// ---------- 小工具 ----------
const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.md': 'text/markdown; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.gif': 'image/gif',
  '.webp': 'image/webp', '.bmp': 'image/bmp', '.ico': 'image/x-icon', '.avif': 'image/avif',
  '.pdf': 'application/pdf',
  '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.csv': 'text/csv; charset=utf-8',
};
const mimeOf = (p) => MIME[path.extname(p).toLowerCase()] || 'application/octet-stream';

// 把相对路径安全解析到 Vault 内（防目录穿越）。返回绝对路径或 null。
function resolveInVault(rel) {
  if (typeof rel !== 'string') return null;
  const clean = rel.replace(/^[/\\]+/, '');
  const abs = path.resolve(VAULT, clean);
  if (abs !== VAULT && !abs.startsWith(VAULT + path.sep)) return null;
  return abs;
}
const relOf = (abs) => path.relative(VAULT, abs).split(path.sep).join('/');

// ---------- 回收站 / 挂载 根目录约定 ----------
const TRASH = '回收站';            // 删除 = git mv 到这里（可恢复）；它是 Vault 根目录项
const IMPORT = 'User import';      // 「添加」挂载的外部文件夹 symlink 进这里（gitignore，不入库）
const TRASH_MANIFEST = '.manifest.json';   // 记 {trashName: {from,at,type}}；dotfile → listVault 不显示

async function readTrashManifest() {
  try { return JSON.parse(await fsp.readFile(path.join(VAULT, TRASH, TRASH_MANIFEST), 'utf8')); } catch { return {}; }
}
async function writeTrashManifest(obj) {
  await fsp.mkdir(path.join(VAULT, TRASH), { recursive: true });
  await fsp.writeFile(path.join(VAULT, TRASH, TRASH_MANIFEST), JSON.stringify(obj, null, 2), 'utf8');
}
async function uniqueChildName(parentRel, leaf) {        // 在 parentRel 下取不冲突的名字（同名加 (2)/(3)…）
  const ext = path.extname(leaf), base = leaf.slice(0, leaf.length - ext.length);
  let name = leaf, n = 2;
  while (true) {
    try { await fsp.lstat(path.join(VAULT, parentRel, name)); name = base + ' (' + (n++) + ')' + ext; }
    catch { return name; }
  }
}
async function ensureImportGitignored() {                // 把 User import/ 写进 .gitignore，避免 git 跟踪挂载进来的外部大文件夹
  const gi = path.join(VAULT, '.gitignore');
  let cur = ''; try { cur = await fsp.readFile(gi, 'utf8'); } catch {}
  if (!cur.split('\n').some(l => l.trim() === IMPORT + '/' || l.trim() === '/' + IMPORT + '/')) {
    await fsp.writeFile(gi, (cur && !cur.endsWith('\n') ? cur + '\n' : cur) + IMPORT + '/\n', 'utf8');
  }
}

// 走查 Vault 目录树 → { folders:[...rel], files:[{path,name,ext,size}] }
async function listVault() {
  const folders = [];
  const files = [];
  async function walk(dir, depth) {
    if (depth > 12) return;                            // 防挂载外部文件夹有环 / 过深时炸栈
    let ents;
    try { ents = await fsp.readdir(dir, { withFileTypes: true }); } catch { return; }
    for (const e of ents) {
      if (e.name.startsWith('.')) continue;           // 跳过 .git / 回收站 manifest 等 dotfile
      if (e.name.startsWith('~$') || e.name.endsWith('.tmp')) continue;   // Office 锁文件/临时文件不进侧栏（PowerPoint/Word 打开期间产生）
      const abs = path.join(dir, e.name);
      let isDir = e.isDirectory(), isFile = e.isFile();
      if (e.isSymbolicLink()) {                        // 挂载进来的外部文件夹/文件：跟随 symlink 判类型，才能在树里展开
        try { const s = await fsp.stat(abs); isDir = s.isDirectory(); isFile = s.isFile(); } catch { continue; }
      }
      if (isDir) { folders.push(relOf(abs)); await walk(abs, depth + 1); }
      else if (isFile) {
        let size = 0; try { size = (await fsp.stat(abs)).size; } catch {}
        files.push({ path: relOf(abs), name: e.name, ext: path.extname(e.name).toLowerCase(), size });
      }
    }
  }
  await walk(VAULT, 0);
  folders.sort(); files.sort((a, b) => a.path.localeCompare(b.path));
  return { folders, files };
}

// ---------- HTTP：静态 + /vault 文件读 ----------
const server = http.createServer(async (req, res) => {
  try {
    const u = new URL(req.url, `http://localhost:${PORT}`);
    // Vault 文件读取（text/binary 都走这里）
    if (u.pathname === '/vault') {
      const abs = resolveInVault(u.searchParams.get('path') || '');
      if (!abs) { res.writeHead(400); return res.end('bad path'); }
      let data; try { data = await fsp.readFile(abs); } catch { res.writeHead(404); return res.end('not found'); }
      res.writeHead(200, { 'Content-Type': mimeOf(abs), 'Cache-Control': 'no-store', 'Access-Control-Allow-Origin': '*' });
      return res.end(data);
    }
    if (u.pathname === '/api/status') {
      res.writeHead(200, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
      return res.end(JSON.stringify({ vault: VAULT, mock: MOCK, model: DEFAULT_MODEL }));
    }
    // 静态文件（webroot = v2 目录）
    let p = decodeURIComponent(u.pathname);
    if (p === '/' || p === '') p = '/index.html';
    const abs = path.resolve(WEBROOT, '.' + p);
    if (abs !== WEBROOT && !abs.startsWith(WEBROOT + path.sep)) { res.writeHead(403); return res.end('forbidden'); }
    let data; try { data = await fsp.readFile(abs); } catch { res.writeHead(404); return res.end('not found'); }
    res.writeHead(200, { 'Content-Type': mimeOf(abs), 'Cache-Control': 'no-store' });
    res.end(data);
  } catch (e) {
    res.writeHead(500); res.end('server error: ' + (e?.message || e));
  }
});

// ---------- 流式输入通道：AsyncIterable<SDKUserMessage> ----------
// SDK 按需 pull 下一条 user 消息；本轮没结束时 enqueue 的消息会留在队列，天然保证轮序。
class MessageChannel {
  constructor() { this.queue = []; this.resolveNext = null; this.closed = false; }
  enqueue(msg) {
    if (this.closed) throw new Error('channel closed');
    if (this.resolveNext) { const r = this.resolveNext; this.resolveNext = null; r({ value: msg, done: false }); }
    else this.queue.push(msg);
  }
  close() {
    this.closed = true;
    if (this.resolveNext) { const r = this.resolveNext; this.resolveNext = null; r({ value: undefined, done: true }); }
  }
  [Symbol.asyncIterator]() {
    return {
      next: () => {
        if (this.queue.length) return Promise.resolve({ value: this.queue.shift(), done: false });
        if (this.closed) return Promise.resolve({ value: undefined, done: true });
        return new Promise((res) => { this.resolveNext = res; });
      },
    };
  }
}

const userMsg = (text, sessionId) => ({
  type: 'user',
  message: { role: 'user', content: text },
  parent_tool_use_id: null,
  session_id: sessionId || undefined,
  uuid: crypto.randomUUID(),
});

// ---------- 权限：平衡策略 ----------
// 只读 → 自动放行；Vault 内编辑 → 自动放行（之后前端 diff 复核）；
// Bash / 联网 / Vault 外编辑 / 其它 → 弹 GUI 复核（支持「本会话总是允许」）。
const AUTO_ALLOW = new Set(['Read', 'Grep', 'Glob', 'LS', 'NotebookRead', 'TodoWrite', 'Skill', 'Task', 'WebSearch', 'WebFetch']);  // 联网读取也自动放行，研究流不打断
const EDIT_TOOLS = new Set(['Edit', 'Write', 'MultiEdit', 'NotebookEdit', 'Update']);

function editPathInVault(input) {
  const p = input?.file_path || input?.notebook_path || input?.path;
  if (!p) return false;
  const abs = path.resolve(p);                       // Claude 一般给绝对路径
  return abs === VAULT || abs.startsWith(VAULT + path.sep);
}
function toolTitle(name, input) {
  const f = input?.file_path || input?.path || input?.notebook_path;
  if (name === 'Bash') return 'Bash：' + String(input?.command || '').slice(0, 120);
  if (name === 'PowerShell') return 'PowerShell：' + String(input?.command || '').slice(0, 120);   // Windows shell 工具：审批条里显示实际命令，别只显示裸 "PowerShell"
  if (name === 'WebSearch') return '联网搜索：' + String(input?.query || '').slice(0, 60);
  if (name === 'WebFetch') return '抓取网页：' + String(input?.url || '').slice(0, 80);
  if (name === 'Grep') return 'Grep：' + String(input?.pattern ?? '').slice(0, 50) + (input?.path ? ' @' + relOfAny(input.path) : (input?.glob ? ' (' + input.glob + ')' : ''));
  if (name === 'Glob') return 'Glob：' + String(input?.pattern ?? '').slice(0, 60);
  if (name === 'Skill') return 'Skill：' + String(input?.command || input?.skill || input?.name || '').slice(0, 50);
  if (name === 'Task') return 'Task：' + String(input?.description || input?.subagent_type || '').slice(0, 60);
  if (name === 'TodoWrite') { const todos = Array.isArray(input?.todos) ? input.todos : []; const cur = todos.find(t => t.status === 'in_progress'); return 'TodoWrite：' + (cur ? cur.content : todos.length + ' 项待办'); }
  if (name === 'AskUserQuestion') { const q = input?.questions?.[0]; return 'AskUserQuestion：' + String(q?.header || q?.question || '请用户选择').slice(0, 50); }
  if (name === 'ToolSearch') return 'ToolSearch：' + String(input?.query ?? '').slice(0, 50);
  if (name === 'Agent') return 'Agent：' + String(input?.description || input?.subagent_type || input?.prompt || '').slice(0, 60);
  if (typeof name === 'string' && name.startsWith('mcp__')) {
    const key = ['query', 'q', 'keyword', 'path', 'url', 'command', 'symbol', 'name', 'text', 'prompt'].find(k => input?.[k] != null);
    const short = name.replace(/^mcp__/, '').replace(/__/g, '·');
    return short + (key ? '：' + String(input[key]).slice(0, 50) : '');
  }
  if (f) return name + '：' + relOfAny(f);
  return name;
}
const relOfAny = (p) => { try { const a = path.resolve(p); return a.startsWith(VAULT + path.sep) ? relOf(a) : p; } catch { return p; } };
// 从 Edit/MultiEdit/Write 的 input 提取 {path, old, new} 供前端做内联绿增红删复核（仅 Vault 内）
function extractEdits(name, input) {
  if (!input) return null;
  const rel = (p) => { try { const a = path.resolve(p); return a.startsWith(VAULT + path.sep) ? relOf(a) : null; } catch { return null; } };
  if (name === 'Edit') { const p = rel(input.file_path); if (!p) return null; return [{ path: p, old: String(input.old_string ?? ''), new: String(input.new_string ?? '') }]; }
  if (name === 'MultiEdit' && Array.isArray(input.edits)) { const p = rel(input.file_path); if (!p) return null; return input.edits.map(e => ({ path: p, old: String(e.old_string ?? ''), new: String(e.new_string ?? '') })); }
  if (name === 'Write') { const p = rel(input.file_path); if (!p) return null; return [{ path: p, old: null, new: String(input.content ?? ''), write: true }]; }
  return null;
}

// ---------- WebSocket 网关 ----------
const wss = new WebSocketServer({ server, path: '/agent' });
const send = (ws, obj) => { try { if (ws.readyState === 1) ws.send(JSON.stringify(obj)); } catch {} };
const ctxOf = (u) => u ? ((u.input_tokens || 0) + (u.cache_read_input_tokens || 0) + (u.cache_creation_input_tokens || 0)) : 0;   // 上下文占用 = 喂给模型的 prompt tokens（input + 两类 cache）
const sendCtx = (ws, tabId, usage) => { const ctxTokens = ctxOf(usage); if (ctxTokens > 0) send(ws, { ev: 'ctx', tabId, ctxTokens }); };   // 实时推上下文占用（message_start/delta）

// 自写抑制：save_file 写盘后，只忽略「内容与我们刚写的完全一致」的那一次 watcher 回声
// （用内容比对而非时间窗口，避免把 agent 随后对同一文件的真实编辑也误抑制掉）
const selfWrites = new Map(); // absPath -> 最近自写的内容
function markSelfWrite(abs, content) { selfWrites.set(abs, content); }

const clients = new Set();

wss.on('connection', (ws) => {
  const conn = {
    ws,
    tabs: new Map(),          // tabId -> tab state
    pendingPerms: new Map(),  // reqId -> resolve(decision)
    pendingDialogs: new Map(),// reqId -> resolve(answer)：AskUserQuestion 选择卡的待答 promise
    sessionAllow: new Set(),  // 工具名 → 本会话总是允许
    permSeq: 0,
    permMode: 'auto',         // 'auto'=危险命令(Bash等)弹审批条 / 'bypass'=全放行(连改文件的 Bash 都不审批)
    fastMode: false,          // Fast mode（Opus 提速输出）；前端开关 → set_fast op
    effortLevel: null,        // 推理 effort：null=默认(adaptive)；'low'/'medium'/'high'/'xhigh'
  };
  clients.add(conn);
  send(ws, { ev: 'hello', vault: VAULT, mock: MOCK, model: DEFAULT_MODEL, harness: harnessInfo });

  ws.on('message', (raw) => { handleMessage(conn, raw).catch((e) => send(ws, { ev: 'error', message: String(e?.message || e) })); });
  ws.on('error', (e) => { console.warn('[ws error]', e?.code || e?.message || e); });   // 必须监听：客户端协议错误/异常断开(浏览器关 tab、网络抖动、ECONNRESET)会在 socket 上 emit 'error'，无监听器即成 uncaughtException 崩整服务(崩溃重启循环根因)。后续 'close' 负责清理
  ws.on('close', () => {
    clients.delete(conn);
    for (const tab of conn.tabs.values()) {
      try { tab.channel.close(); } catch {}
      // interrupt() 是 async：对已收尾/dead 的 query 调用会 reject「ProcessTransport is not ready」→ 必须吞掉 promise，否则 unhandledRejection 崩整服务。dead 的直接跳过
      if (!tab.dead) { try { Promise.resolve(tab.query?.interrupt?.()).catch(() => {}); } catch {} }
    }
    conn.tabs.clear();
  });
});

async function handleMessage(conn, raw) {
  let m; try { m = JSON.parse(raw.toString()); } catch { return; }
  const { ws } = conn;
  switch (m.op) {
    case 'list_vault': { send(ws, { ev: 'vault', ...(await listVault()) }); break; }
    case 'open_file': {
      const abs = resolveInVault(m.path); if (!abs) return send(ws, { ev: 'error', message: 'bad path' });
      let text = ''; try { text = await fsp.readFile(abs, 'utf8'); } catch (e) { return send(ws, { ev: 'error', message: 'read fail: ' + e.message }); }
      send(ws, { ev: 'file', path: m.path, text }); break;
    }
    case 'save_file': {
      const abs = resolveInVault(m.path); if (!abs) return send(ws, { ev: 'error', message: 'bad path' });
      await fsp.mkdir(path.dirname(abs), { recursive: true });
      markSelfWrite(abs, m.text ?? '');
      try { await fsp.chmod(abs, 0o644); } catch {}      // 源文件可能只读（如从微信/只读源复制进来）→ 先放开写权限
      await fsp.writeFile(abs, m.text ?? '', 'utf8');
      send(ws, { ev: 'saved', path: m.path }); break;
    }
    case 'save_file_b64': {                              // 写二进制文件（xlsx/docx）：前端序列化后 base64 落真实文件
      const abs = resolveInVault(m.path); if (!abs) return send(ws, { ev: 'error', message: 'bad path' });
      await fsp.mkdir(path.dirname(abs), { recursive: true });
      markSelfWrite(abs, '<binary>');                    // 二进制 watcher 读不出 text → 靠 has(abs)+text===null 抑制自写回声
      try { await fsp.chmod(abs, 0o644); } catch {}      // 只读源文件 → 放开写权限再写
      await fsp.writeFile(abs, Buffer.from(m.b64 || '', 'base64'));
      send(ws, { ev: 'saved', path: m.path }); break;
    }
    case 'sheet_patch': {                                // 无损单元格回写：只改被编辑的单元格所在 worksheet XML，其余 zip part 逐字节原样保留
      const abs = resolveInVault(m.path); if (!abs) return send(ws, { ev: 'error', message: 'bad path' });
      const edits = Array.isArray(m.edits) ? m.edits : [];
      if (!edits.length) { send(ws, { ev: 'saved', path: m.path, applied: 0 }); break; }
      const tmpJson = path.join(os.tmpdir(), `sheetpatch_${Date.now()}_${Math.random().toString(36).slice(2)}.json`);
      try {
        await fsp.writeFile(tmpJson, JSON.stringify({ edits }), 'utf8');
        markSelfWrite(abs, '<binary>');                  // 抑制 watcher 自写回声（二进制：has(abs)+text===null）
        try { await fsp.chmod(abs, 0o644); } catch {}
        const scriptPath = path.join(WEBROOT, 'sheet_patch.py');
        const out = await new Promise((res) => execFile('python3', [scriptPath, abs, tmpJson],
          { env: { ...process.env, PYTHONIOENCODING: 'utf-8', PYTHONUTF8: '1' }, maxBuffer: 16 * 1024 * 1024 },
          (err, stdout, stderr) => res({ err, stdout: String(stdout || ''), stderr: String(stderr || '') })));
        let result = null;
        try { result = JSON.parse(out.stdout.trim().split('\n').pop() || '{}'); } catch {}
        if (!result || !result.ok) {
          const msg = (result && result.errors && result.errors.join('；')) || out.stderr || (out.err && out.err.message) || '未知错误';
          send(ws, { ev: 'sheet_patch_err', path: m.path, message: msg });
        } else {
          send(ws, { ev: 'saved', path: m.path, applied: result.applied });
        }
      } catch (e) {
        send(ws, { ev: 'sheet_patch_err', path: m.path, message: String(e.message || e) });
      } finally {
        fsp.unlink(tmpJson).catch(() => {});
      }
      break;
    }
    case 'discard_file': {                               // 拒绝二进制改动：丢弃工作区改动，恢复到 HEAD（上一个已接受/基线版本）→ 通知前端重载
      const abs = resolveInVault(m.path); if (!abs) return send(ws, { ev: 'error', message: 'bad path' });
      const isMd = m.path.toLowerCase().endsWith('.md');
      try { markSelfWrite(abs, isMd ? '' : '<binary>'); await git(['checkout', 'HEAD', '--', m.path]); }
      catch (e) { return send(ws, { ev: 'error', message: '还原失败：' + e.message }); }
      let text = null; if (isMd) { try { text = await fsp.readFile(abs, 'utf8'); } catch {} }
      send(ws, { ev: 'file_changed', path: m.path, newText: text, binary: !isMd, rolledBack: true });
      break;
    }
    case 'file_history': { send(ws, { ev: 'history', path: m.path, entries: await gitHistory(m.path) }); break; }
    case 'file_head_b64': {                              // 取 git HEAD（本轮 AI 改动前 = 上一个已接受版本）的二进制内容 → 前端做 SuperDoc 原生修订对比的基线
      let b64 = null, err = null;
      try { const buf = await git(['show', 'HEAD:' + m.path], 'buffer'); b64 = Buffer.from(buf).toString('base64'); }
      catch (e) { err = String(e.message || e); }       // 文件从未提交过 → 无 HEAD 版本，前端回退为「无基线」
      send(ws, { ev: 'file_head', path: m.path, b64, err }); break;
    }
    case 'commit_file': {
      const warn = await registryConsistencyCheck(m.path);   // 提交前比对（此刻 HEAD 仍是改动前版本）
      const sha = await gitCommitFile(m.path, m.message);
      send(ws, { ev: 'committed', path: m.path, sha });
      if (warn) {                                            // 改到了 model 派生数字 → raise，引导从 model 级联
        const list = warn.divergences.slice(0, 10).map(d =>
          `· ${d.key}（${d.period || ''}${d.unit ? ' ' + d.unit : ''}）：model=${d.registry_value} → 你改成了≈${d.gone_replaced_by}`).join('\n');
        const prompt = `我刚在「${m.path}」里改了下面这些 model 派生的数字，它们已经和 model / registry 对不上了：\n${list}\n\n请按级联铁律处理：先问我这次改动的依据（是否有新信息源 / 幅度多少 / 确不确定），确认后从 model 起算级联（改 model 假设 → 重算 → registry → 研报/wiki/图表全部重渲），不要让数字只停在报告里。`;
        send(ws, { ev: 'registry_warn', tabId: m.tabId || 'main', file: m.path, divergences: warn.divergences, prompt });
      }
      break;
    }
    case 'open_local': {                                 // 用系统默认应用打开 vault 文件（Word/PPT/Excel 原生编辑；保存后 watcher 自动 commit + 前端自动重渲）
      const abs = resolveInVault(m.path); if (!abs) return send(ws, { ev: 'error', message: 'bad path' });
      // pptx 先剥嵌入字体：Win PowerPoint 嵌入的字体子集在 Mac PowerPoint 上字形错乱（实测全篇乱码）。幂等，无嵌入时 SKIP 不动文件
      if (/\.pptx$/i.test(abs)) {
        try {
          const scriptPath = path.join(WEBROOT, 'strip_embedded_fonts.py');
          const out = await new Promise((res) => execFile('python3', [scriptPath, abs], { env: { ...process.env, PYTHONIOENCODING: 'utf-8', PYTHONUTF8: '1' } }, (err, stdout) => res(err ? 'ERR' : String(stdout).trim())));
          if (out === 'STRIPPED') {
            markSelfWrite(abs, '<binary>');               // 抑制 watcher 回声（前端不需要为此重渲）
            await gitCommitFile(m.path, '剥离嵌入字体（跨平台兼容）');
            send(ws, { ev: 'toast', message: '已剥离 Win 嵌入字体（避免 Mac PowerPoint 乱码），原版在历史里' });
          }
        } catch (e) { /* 剥离失败不阻塞打开 */ }
      }
      const cmd = process.platform === 'darwin' ? 'open' : process.platform === 'win32' ? 'cmd' : 'xdg-open';
      const args = process.platform === 'win32' ? ['/c', 'start', '', abs] : [abs];
      execFile(cmd, args, (err) => { if (err) send(ws, { ev: 'error', message: '本地打开失败：' + err.message }); });
      send(ws, { ev: 'opened_local', path: m.path }); break;
    }
    case 'reveal_local': {                                // 在系统文件管理器里打开：文件夹→直接打开该文件夹；文件→打开所在文件夹并选中该文件
      const abs = resolveInVault(m.path); if (!abs) return send(ws, { ev: 'error', message: 'bad path' });
      let isDir = false;
      try { isDir = (await fsp.stat(abs)).isDirectory(); } catch (e) { return send(ws, { ev: 'error', message: '打开文件夹失败：' + e.message }); }
      let cmd, args, opts = {};
      if (process.platform === 'darwin') { cmd = 'open'; args = isDir ? [abs] : ['-R', abs]; }                   // open -R 在 Finder 里定位并选中文件
      else if (process.platform === 'win32') {                                                                   // explorer 的 /select 必须"裸出"、只给路径本身加引号
        cmd = 'explorer'; opts = { windowsVerbatimArguments: true };                                            // 否则路径含空格(如 "Company Coverage")时 node 会把整个 "/select,<path>" 连开关一起加引号，
        args = isDir ? ['"' + abs + '"'] : ['/select,"' + abs + '"'];                                           // explorer 认不出 /select → 跳到默认目录(即用户说的"路径不对")。成功也返回非零退出码
      }
      else { cmd = 'xdg-open'; args = [isDir ? abs : path.dirname(abs)]; }                                       // Linux：无统一的“选中”，退而打开所在目录
      execFile(cmd, args, opts, (err) => { if (err && process.platform !== 'win32') send(ws, { ev: 'error', message: '打开文件夹失败：' + err.message }); });
      send(ws, { ev: 'revealed_local', path: m.path }); break;
    }
    case 'make_folder': {                                // 新建文件夹：磁盘 mkdir → 广播刷新树（空目录 listVault 也会带上）
      const abs = resolveInVault(m.path); if (!abs) return send(ws, { ev: 'error', message: 'bad path' });
      try { await fsp.mkdir(abs, { recursive: true }); } catch (e) { return send(ws, { ev: 'error', message: '建文件夹失败：' + e.message }); }
      broadcast({ ev: 'vault_dirty' }); send(ws, { ev: 'folder_made', path: m.path }); break;
    }
    case 'move_file': {                                  // 拖拽换文件夹：把文件移到目标目录（git mv 保历史，回退 fs.rename）→ 广播 moved + 刷新树
      const fromAbs = resolveInVault(m.from), toAbs = resolveInVault(m.to);
      if (!fromAbs || !toAbs) return send(ws, { ev: 'error', message: 'bad path' });
      if (fromAbs === toAbs) return;
      try {
        await fsp.mkdir(path.dirname(toAbs), { recursive: true });
        try { await fsp.access(toAbs); return send(ws, { ev: 'error', message: '目标已存在同名文件：' + m.to }); } catch {}   // 不覆盖
        markSelfWrite(fromAbs, ''); markSelfWrite(toAbs, '<binary>');   // 抑制自写回声
        try { await git(['mv', m.from, m.to]); }
        catch { await fsp.rename(fromAbs, toAbs); }
        try { await git([...GIT_ID, 'commit', '-m', '移动 ' + path.basename(m.from) + ' → ' + (path.dirname(m.to) || '根'), '--', m.from, m.to]); } catch {}
      } catch (e) { return send(ws, { ev: 'error', message: '移动失败：' + e.message }); }
      broadcast({ ev: 'moved', from: m.from, to: m.to });
      broadcast({ ev: 'vault_dirty' }); break;
    }
    case 'rename_path': {                                // 右键重命名：文件或文件夹（git mv 保历史，回退 fs.rename）→ 同目录换名 → 广播 moved（更新打开中 tab 路径）+ 刷新树
      const fromAbs = resolveInVault(m.from), toAbs = resolveInVault(m.to);
      if (!fromAbs || !toAbs) return send(ws, { ev: 'error', message: 'bad path' });
      if (fromAbs === toAbs) return;
      try {
        try { await fsp.access(toAbs); return send(ws, { ev: 'error', message: '已存在同名：' + path.basename(m.to) }); } catch {}   // 不覆盖
        markSelfWrite(fromAbs, ''); markSelfWrite(toAbs, '<binary>');   // 抑制自写回声（与 move_file 一致）
        try { await git(['mv', m.from, m.to]); }
        catch { await fsp.rename(fromAbs, toAbs); }
        try { await git([...GIT_ID, 'commit', '-m', '重命名 ' + path.basename(m.from) + ' → ' + path.basename(m.to)]); } catch {}
      } catch (e) { return send(ws, { ev: 'error', message: '重命名失败：' + e.message }); }
      broadcast({ ev: 'moved', from: m.from, to: m.to });
      broadcast({ ev: 'vault_dirty' }); break;
    }
    case 'delete_path': {                                // 右键删除 = 移入回收站（git mv 保历史 + manifest 记原路径，可恢复）→ 广播 deleted（关打开中 tab）+ 刷新树
      const abs = resolveInVault(m.path); if (!abs) return send(ws, { ev: 'error', message: 'bad path' });
      if (m.path === TRASH || m.path.startsWith(TRASH + '/') || m.path === IMPORT || m.path === 'Vault' || m.path === 'WIKI')
        return send(ws, { ev: 'error', message: '该项不可删除' });
      let type = 'file'; try { type = (await fsp.stat(abs)).isDirectory() ? 'folder' : 'file'; } catch {}
      const trashName = await uniqueChildName(TRASH, m.path.split('/').pop());
      const trashRel = TRASH + '/' + trashName, trashAbs = resolveInVault(trashRel);
      try {
        await fsp.mkdir(path.join(VAULT, TRASH), { recursive: true });
        markSelfWrite(abs, ''); markSelfWrite(trashAbs, '<binary>');
        try { await git(['mv', m.path, trashRel]); }                    // 入库文件：git mv 保历史
        catch { await fsp.rename(abs, trashAbs); }                      // 未入库（刚上传/刚建）：直接移
        const mani = await readTrashManifest(); mani[trashName] = { from: m.path, at: new Date().toISOString(), type };
        await writeTrashManifest(mani);
        try { await git([...GIT_ID, 'add', '-A', '--', TRASH]); await git([...GIT_ID, 'commit', '-m', '移入回收站 ' + m.path]); } catch {}
      } catch (e) { return send(ws, { ev: 'error', message: '删除失败：' + e.message }); }
      broadcast({ ev: 'deleted', path: m.path });
      broadcast({ ev: 'vault_dirty' }); break;
    }
    case 'restore_trash': {                              // 回收站恢复：按 manifest 把条目移回原路径（原位有同名则加「(恢复)」后缀）
      const mani = await readTrashManifest(); const entry = mani[m.name];
      if (!entry) return send(ws, { ev: 'error', message: '回收站没有该条目' });
      const trashRel = TRASH + '/' + m.name, trashAbs = resolveInVault(trashRel);
      if (!trashAbs) return send(ws, { ev: 'error', message: 'bad path' });
      let dest = entry.from, destAbs = resolveInVault(dest);
      if (!destAbs) return send(ws, { ev: 'error', message: '原路径非法' });
      try {
        try { await fsp.access(destAbs); const ext = path.extname(dest), base = dest.slice(0, dest.length - ext.length); dest = base + ' (恢复)' + ext; destAbs = resolveInVault(dest); } catch {}
        await fsp.mkdir(path.dirname(destAbs), { recursive: true });
        markSelfWrite(trashAbs, ''); markSelfWrite(destAbs, '<binary>');
        try { await git(['mv', trashRel, dest]); } catch { await fsp.rename(trashAbs, destAbs); }
        delete mani[m.name]; await writeTrashManifest(mani);
        try { await git([...GIT_ID, 'add', '-A']); await git([...GIT_ID, 'commit', '-m', '从回收站恢复 ' + dest]); } catch {}
      } catch (e) { return send(ws, { ev: 'error', message: '恢复失败：' + e.message }); }
      broadcast({ ev: 'moved', from: trashRel, to: dest });
      broadcast({ ev: 'vault_dirty' }); break;
    }
    case 'purge_trash': {                                // 回收站里单条彻底删除（git rm；内容仍在 git 史，但移出工作区）
      const trashRel = TRASH + '/' + m.name, trashAbs = resolveInVault(trashRel);
      if (!trashAbs || !m.name) return send(ws, { ev: 'error', message: 'bad path' });
      try {
        try { await git(['rm', '-r', '-f', '--', trashRel]); } catch { await fsp.rm(trashAbs, { recursive: true, force: true }); }
        const mani = await readTrashManifest(); delete mani[m.name]; await writeTrashManifest(mani);
        try { await git([...GIT_ID, 'add', '-A']); await git([...GIT_ID, 'commit', '-m', '彻底删除 ' + m.name]); } catch {}
      } catch (e) { return send(ws, { ev: 'error', message: '彻底删除失败：' + e.message }); }
      broadcast({ ev: 'deleted', path: trashRel });
      broadcast({ ev: 'vault_dirty' }); break;
    }
    case 'empty_trash': {                                // 清空回收站
      try {
        const dir = path.join(VAULT, TRASH); let ents = []; try { ents = await fsp.readdir(dir); } catch {}
        const items = ents.filter(n => n !== TRASH_MANIFEST);
        if (items.length) {
          try { await git(['rm', '-r', '-f', '--', ...items.map(n => TRASH + '/' + n)]); }
          catch { for (const n of items) { try { await fsp.rm(path.join(dir, n), { recursive: true, force: true }); } catch {} } }
        }
        await writeTrashManifest({});
        try { await git([...GIT_ID, 'add', '-A']); await git([...GIT_ID, 'commit', '-m', '清空回收站']); } catch {}
      } catch (e) { return send(ws, { ev: 'error', message: '清空失败：' + e.message }); }
      broadcast({ ev: 'vault_dirty' }); break;
    }
    case 'mount_path': {                                 // 「添加」：把本地绝对路径（文件夹/文件）symlink 挂载到 User import/ 下（不复制、live）
      const src = typeof m.path === 'string' ? m.path.trim() : '';
      if (!src || !path.isAbsolute(src)) return send(ws, { ev: 'error', message: '请提供本地绝对路径（如 /Users/you/folder）' });
      try { await fsp.stat(src); } catch { return send(ws, { ev: 'error', message: '路径不存在或无权访问：' + src }); }
      const leaf = path.basename(src.replace(/[/\\]+$/, '')) || 'mounted';
      const linkRel = IMPORT + '/' + await uniqueChildName(IMPORT, leaf), linkAbs = resolveInVault(linkRel);
      try {
        await fsp.mkdir(path.join(VAULT, IMPORT), { recursive: true });
        await ensureImportGitignored();
        await fsp.symlink(src, linkAbs);
      } catch (e) { return send(ws, { ev: 'error', message: '挂载失败：' + e.message }); }
      broadcast({ ev: 'vault_dirty' }); send(ws, { ev: 'mounted', path: linkRel, src }); break;
    }
    case 'unmount': {                                    // 卸载挂载点：只删 symlink，不动外部原始文件夹
      const abs = resolveInVault(m.path); if (!abs) return send(ws, { ev: 'error', message: 'bad path' });
      if (!m.path.startsWith(IMPORT + '/')) return send(ws, { ev: 'error', message: '只能卸载 User import 下的挂载' });
      try {
        const st = await fsp.lstat(abs);
        if (!st.isSymbolicLink()) return send(ws, { ev: 'error', message: '这不是挂载链接（外部内容请在 Finder 里管理）' });
        await fsp.unlink(abs);                            // 只移除链接
      } catch (e) { return send(ws, { ev: 'error', message: '卸载失败：' + e.message }); }
      broadcast({ ev: 'deleted', path: m.path });
      broadcast({ ev: 'vault_dirty' }); break;
    }
    case 'file_rollback': {                              // 恢复某历史版本 → 落盘 → 记一条回滚 commit → 通知前端重载（非破坏，可继续回滚）
      const abs = resolveInVault(m.path); if (!abs) return send(ws, { ev: 'error', message: 'bad path' });
      const isMd = m.path.toLowerCase().endsWith('.md');
      let buf; try { buf = await git(['show', m.sha + ':' + m.path], 'buffer'); } catch (e) { return send(ws, { ev: 'error', message: '回滚失败：' + e.message }); }
      markSelfWrite(abs, isMd ? buf.toString('utf8') : '<binary>');
      await fsp.writeFile(abs, buf);
      await gitCommitFile(m.path, '回滚到 ' + String(m.sha).slice(0, 7));
      send(ws, { ev: 'file_changed', path: m.path, newText: isMd ? buf.toString('utf8') : null, binary: !isMd, rolledBack: true });
      send(ws, { ev: 'history', path: m.path, entries: await gitHistory(m.path) });
      break;
    }
    case 'user_turn': await userTurn(conn, m); break;
    case 'interrupt': {
      const tab = conn.tabs.get(m.tabId);
      if (tab && !tab.dead) {
        tab.dead = true;                                  // 旧 query 作废：consumer 静默其尾部事件（见 runConsumer）
        try { await tab.query?.interrupt?.(); } catch {}
        try { tab.channel.close(); } catch {}             // 关输入通道，让旧 query 收尾、session 落盘
        tab.needsRestart = true;                          // SDK 0.3.x：interrupt 会把本 query 打成 error_during_execution 死态、后续消息无响应 → 下次 user_turn 用 resume:sessionId 起新 query（保留上下文）
        send(ws, { ev: 'interrupted', tabId: m.tabId });
      }
      break;
    }
    case 'permission_response': { const r = conn.pendingPerms.get(m.reqId); if (r) { conn.pendingPerms.delete(m.reqId); r(m.decision); } break; }
    case 'dialog_response': { const r = conn.pendingDialogs.get(m.reqId); if (r) { conn.pendingDialogs.delete(m.reqId); r(m.answer); } break; }   // AskUserQuestion 选择卡回传
    case 'set_perm_mode': { conn.permMode = (m.mode === 'bypass' ? 'bypass' : 'auto'); break; }
    case 'set_fast': {                                   // Fast mode 开关：已建立的 query 热切换，新建的走 options.settings
      conn.fastMode = !!m.on;
      for (const [, tab] of conn.tabs || new Map()) {
        try { tab.query?.applyFlagSettings?.({ fastMode: conn.fastMode }); } catch (e) { /* 旧 session 不支持就忽略 */ }
      }
      break;
    }
    case 'set_effort': {                                 // Effort level 热切换
      const v = ['low','medium','high','xhigh'].includes(m.level) ? m.level : null;
      conn.effortLevel = v;
      for (const [, tab] of conn.tabs || new Map()) {
        try { tab.query?.applyFlagSettings?.({ effortLevel: v }); } catch (e) {}
      }
      break;
    }
    case 'set_model': { const tab = conn.tabs.get(m.tabId); if (tab) { tab.model = m.model; if (tab.query?.setModel) { try { await tab.query.setModel(m.model); } catch {} } } break; }
    default: break;
  }
}

// ---------- 一次用户回合 ----------
async function userTurn(conn, m) {
  const { ws } = conn;
  const tabId = m.tabId || 'main';
  let tab = conn.tabs.get(tabId);

  // 组装注入了「当前打开文件」上下文的 user 文本
  let text = m.text || '';
  const isSlash = text.trimStart().startsWith('/');   // 斜杠命令（/skill …）：原样交给 claude-code runtime，绝不加前缀，否则 / 不在行首 → runtime 不识别、当普通文本
  const ctx = [];
  if (!isSlash) {
    if (m.openFile) ctx.push(`【当前打开的文件：${m.openFile}】（可用 Read 查看；要改就直接 Edit/Write 这个真实文件）`);
    if (Array.isArray(m.quotes)) for (const q of m.quotes) {
      if (q?.text) ctx.push(`【用户选中片段】\n${q.text}` + (q.note ? `\n（批注：${q.note}）` : ''));
    }
  }
  if (ctx.length) text = ctx.join('\n\n') + '\n\n' + text;

  if (MOCK) return mockTurn(conn, tabId, m, text);

  // 真 SDK：首条消息时建会话；被中断过的 tab（needsRestart）旧 query 已死 → resume 同一 session 重建，保留上下文
  if (!tab || tab.needsRestart) {
    let resume = null;
    if (tab?.needsRestart) {
      resume = tab.sessionId;                                                                    // 续上原 session id（实测 resume 能完整带回历史上下文）
      try { await Promise.race([tab.consumer, new Promise((r) => setTimeout(r, 6000))]); } catch {}   // 等旧 query 彻底收尾、session 落定后再 resume（否则刚中断就 resume 会读到半写 session 而无响应）；6s 兜底防卡死
    }
    tab = await startTab(conn, tabId, m.model || DEFAULT_MODEL, m.openFile, resume);
    conn.tabs.set(tabId, tab);
  }
  tab.openFile = m.openFile || tab.openFile;
  activeTurns++;                                        // server 端回合计数：watcher 判定「AI 改」vs「外部改」的唯一权威
  send(ws, { ev: 'turn_start', tabId });
  try { tab.channel.enqueue(userMsg(text, tab.sessionId)); }
  catch (e) { send(ws, { ev: 'error', tabId, message: '通道已关闭：' + e.message }); }
}

async function startTab(conn, tabId, model, openFile, resume) {
  const channel = new MessageChannel();
  const abort = new AbortController();
  const tab = { channel, abort, query: null, sessionId: resume || null, model, openFile, consumer: null };

  const options = {
    cwd: VAULT,
    model,
    ...(resume ? { resume } : {}),                   // 中断后重建：续上原 session，保留对话上下文
    abortController: abort,
    settings: { fastMode: !!conn.fastMode, ...(conn.effortLevel ? { effortLevel: conn.effortLevel } : {}) },
    settingSources: ['user', 'project', 'local'],   // 加载 ~/.claude/skills + CLAUDE.md + slash cmds
    skills: 'all',
    systemPrompt: { type: 'preset', preset: 'claude_code', append: UNIWORK_APPEND },
    permissionMode: 'default',
    allowDangerouslySkipPermissions: true,           // 允许动态切模式；实际决策走 canUseTool
    canUseTool: makeCanUseTool(conn, tabId),          // 轻量审批：只读/Vault编辑/联网自动放行；Bash/外部/未知 → 前端小型内联审批
    includePartialMessages: true,
    enableFileCheckpointing: true,
    thinking: { type: 'adaptive' },
    // 注：AskUserQuestion 不走 SDK 的 onUserDialog/supportedDialogKinds —— 实测一旦提供 canUseTool，CLI 就在 canUseTool 处把它短路成 allow/deny，permission_ask_user_question dialog 永不 emit。改在 canUseTool 里拦截，见 makeCanUseTool。
    // env 不设置 → 继承 process.env（保留 PATH/HOME，且本机无 ANTHROPIC_API_KEY → 走订阅）
  };

  tab.query = agentQuery({ prompt: channel, options });
  tab.consumer = runConsumer(conn, tabId, tab);
  return tab;
}

const UNIWORK_APPEND = `你运行在 Uniwork V2 投研工作台的后端，用户通过浏览器 GUI 与你交互。
- 工作目录(cwd)就是用户的 Vault 知识库；用户「当前打开的文件」会在消息里以【当前打开的文件：<相对路径>】标注。
- **默认所有「改/补充/修订/计算/追加/替换」都是直接改当前打开的那个真实文件本身**——不是给建议、不是贴代码块让用户复制、不是只在回答里写改后内容。用户说「这句话末尾加一句 X」「把 D2 改成 52」时，**直接动手改真实文件，不用用户每次说明用什么工具、改哪个路径**（当前打开文件路径已在消息里给你）。改完前端自动显示 diff 复核 + 版本历史，用户接受/拒绝即可。
- **级联铁律（focus 标的＝ Vault/Company Coverage/<T>/ 下有 _data_registry.json + model/ 的公司，如 SNDK/NVDA）**：这类公司的"数字"是一条有向单链 —— **model（Excel 假设）→ _data_registry.json（SSOT 单一数字源）→ 研报 docx / wiki / 图表（下游派生件）**。凡是会改变**假设或预测数字**的请求（"下季 ASP 下行""下修毛利""价格没那么乐观了""把 26Q4 收入改成 X"），**必须从 model 起算、向下游级联，不能因为"用户正打开着研报"就把数字直接落在研报里**：① 先判定命中哪个 driver / 哪几期（自然语言→driver 是你的 judge），幅度不明确就先 raise 用户确认、绝不臆造；② 走 /finance-cowork 的 cascade：改 model 假设 → 重算 → re-digest → 派生新 registry → 漂移闸＋miss-guide → 出 preview → **逐条 raise 用户确认**（>5% 漂移或击穿管理层 guide 必须确认）→ apply → 研报/wiki/图表全部重渲。③ **执行与回写（AI 真跑级联时）**：cascade 引擎是完整版 finance-cowork（~/.claude/skills/finance-cowork，写到它自己的 output/{T}/，用 --model 指向 vault 里的模型）；跑完把新的 _data_registry.json / 研报 / wiki / 图表**同步回 vault 的 Vault/Company Coverage/<T>/（**最终研报 docx 落 Output/**、registry 落标的根目录、wiki/图表/中间产物落 WIP/；与"产出报告自动归档"约定一致）**；**关键顺序：先把新 registry 落到 vault 盘上、再提交重渲后的下游文件**——这样下游数字和 registry 同时为新值，一致性闸自然为绿；顺序反了（报告先改、registry 没回写）闸会误报。**禁止直接手改下游 docx/wiki 里的数字、也禁止直接手改 registry**——否则研报会和 model 对不上。只有**纯定性/措辞**改动（风险段、表述、不含数字）才就地直接改下游文件。一句话：**改数字＝从 model 起级联；改文字＝就地改。** 另：若收到系统提示"我刚在某报告里改了 model 派生数字、和 model 对不上"，那是一致性闸触发——按上面流程，先问依据再从 model 级联，别只在报告里改回去。
- 按文件类型选工具（自动选，别问用户）：.md / .txt → Edit/Write（自动放行）；.xlsx → Bash 跑 python+openpyxl（load_workbook→改单元格→save，尽量保留公式/格式）；.docx → Bash 跑 python+python-docx。xlsx/docx 是二进制，不能用 Edit/Write 文本工具，只能 python。
- **改 .docx 里某个数值/文本（尤其"把全文某价格/某串全部替换成 X"）务必用内置脚本，别自己写 python-docx 遍历**：\`python "${DOCX_REPLACE_PY}" <docx绝对路径> "<旧文本>" "<新文本>"\`（加 \`--dry-run\` 只统计不写盘）。它在 XML 层覆盖正文＋**嵌套表格／文本框／图形／页眉页脚／脚注尾注**，并能处理被拆到多个 run 的同一串文字，输出 JSON {total,by_part}。直接用 python-docx 的 document.paragraphs / document.tables 遍历**只覆盖顶层段落和顶层表格，会漏掉嵌套表/文本框/页眉脚和跨 run 的字串**——替换后看似改完、实则残留旧值（这是真出过的 bug）。脚本退出码=1 表示一处都没命中，需检查旧文本是否逐字正确。
- 读文件用 Read、找文件用 Glob/Grep（都自动放行）。别用 Bash 的 cat/sed/ls/echo 读写 Vault 文本文件。Bash 留给改二进制文件和真正的 shell 活（跑脚本/拉数据）。
- **纯解释/分析/问答类问题（如"这句话什么意思""帮我解读"）直接回答，不要调任何 shell**。Windows 上读/搜 Vault 一律用 Read/Grep/Glob，**别用 PowerShell 的 Get-Content/Select-String/Get-ChildItem**——shell 命令要弹审批条会打断你，解释类任务根本不该碰 shell。
- 主动顺着笔记里的 [[双链]] 和 Grep 去读相关笔记，把分散在多篇里的依据串起来再回答，并引用具体文件:行。
- **Vault 结构约定**：Vault/Company Coverage/<公司名>/ 下设 研报、季报年报、Model、News、Raw 五个子目录（已进入 focus 的标的）；Vault/Industry Coverage/ 放行业级笔记；Vault/Screening/ 放初筛标的（通常就一段录音/几行 notes，未进 focus）；WIKI/<公司名>.md 是该公司的一页纸 wiki。Vault/_uploads/ 是用户从对话框上传的附件。
- **产出报告自动归档（重要）**：给某公司生成的最终成品报告——研报 .docx / 三表模型 .xlsx / deck .pptx / .md 报告——写到 \`Vault/Company Coverage/<公司名>/Output/\`（目录已建好；不存在就先 \`mkdir -p\`）。**但 Output/ 只保留该公司「当前最新」的一份成品**：生成新版本时，先把 Output/ 里的上一版**挪到该公司的 \`WIP/\`**，再把新版写进 Output/。文件名带版本号递增、不覆盖（结果：最新 \`_v10\` 在 Output/，旧的 \`_v1…_v9\` 都在 WIP/）。中间稿/数据底稿/历史版本统统在 \`WIP/\`，**Output/ 永远只有一份最新成品**。用户没指定路径时默认按此归档，不用问。
- **出报告时若请求可能隐含"改数字"（如"capex 不可持续→压业绩""价格下行""下修毛利""增速放缓"这种既能当定性叙事、也能理解成下修假设的请求）**：动手前**先用 AskUserQuestion 弹 in-app 选择卡问清用户**要哪种 —— (A) 只基于现有 model/registry **渲染一份报告**、不改任何数字（report_render → 出到 Output/）；还是 (B) 真的**下修该假设、走级联更新**（model→重算→registry→重渲，按级联铁律）。**别替用户默认**，问清再动手；选 A 才出报告、选 B 才动 model。这正是级联铁律里"幅度不明确先 raise 用户确认"在 web portal 的落地方式。
- 用户说「build wiki vault / 给 X 建档 / 立项 X / 把 X 加入覆盖」时，按这个约定建档：① 用 Write 建 WIKI/<公司>.md 一页纸 wiki（商业模式 / 投资逻辑 / 关键财务 / 主要风险 / 估值，把你这轮已做的研究填进去、缺的留占位），并用 [[双链]] 关联相关公司或行业笔记；② 建 Vault/Company Coverage/<公司>/ 骨架——研报、季报年报、Model、News、Raw 五个子目录（可 Bash mkdir -p 一次建好；若有已下到的研报/纪要就归到对应子目录）。建完一句话告诉用户建了哪些。
- **录音 → 会议纪要流程**：用户上传录音让你做纪要/meeting minutes 时——① 用 llm-subagent ASR 转写（前台同步跑、等它转完、别后台，几十秒就好；TOS 若报签名错误已会自动回退 inline，无需特殊处理）；② 走 visiting-memo 会议纪要模板生成 .docx；③ **识别完成后顺手把原始录音和生成的纪要都按「YYYYMMDD_公司_主题」重命名，一起归到对应公司的 News 目录**（录音 .m4a 和纪要 .docx 同名不同后缀，方便对照）。
- 数值原子性：价格/估值/PE/宏观等精确数字必须来自工具或原始数据，不得臆造、不得手动换算；取不到就说取不到。
- 中文为主，英文术语保留原文。回答简洁、给来源。

内置投研能力（直接用，不要问用户装没装）：
| 能力 | 用法 | 触发场景 |
|------|------|----------|
| yfinance | Bash 跑 python + yfinance | 股价/PE/市值/涨跌/EPS/分红/历史K线（美股/港股ADR）|
| /ak-xq-router | 调 skill | A股港股数据：筹码/资金/北向/EPS预测/Fwd PE/共识预期 |
| /finance-cowork | 调 skill | 公司wiki建档/维护、解析Excel模型(model digest)、出研报(report)、级联更新(cascade) |
| /gs-research-chart | 调 skill | 机构研报风格图表：PE band/K线/drawdown/rebased perf/revenue YoY/季度营收 |
| openpyxl | Bash 跑 python + openpyxl | 读写 .xlsx（改单元格/公式/格式）|
| python-docx | Bash 跑 python + python-docx；**全文替换数值/文本一律走 docx_replace.py（见上：覆盖嵌套表/文本框/页眉脚+跨run，避免漏改残留）** | 读写 .docx（改段落/表格/样式）|

拉数据优先级：专用工具 > 联网搜索。股价用 yfinance，A股预期用 ak-xq-router，别先搜再说。`;

// 把选择卡回答格式化成给 Claude 的自然语言（deny+message 是 AskUserQuestion 在 headless 下唯一可行的回传通道）
function formatAskAnswer(answer) {
  const picks = Array.isArray(answer?.picks) ? answer.picks : [];
  const lines = picks.map((p) => {
    const sel = (Array.isArray(p.selected) ? p.selected : []).filter(Boolean);
    const parts = [...sel];
    if (p.custom && String(p.custom).trim()) parts.push('（其他）' + String(p.custom).trim());
    return '· ' + (p.header || p.question || '问题') + '：' + (parts.length ? parts.join('、') : '(未选)');
  });
  return '用户已通过选择框作答：\n' + lines.join('\n') + '\n\n请直接据此继续，不要再次调用 AskUserQuestion 重复提问。';
}
function makeCanUseTool(conn, tabId) {
  return async (toolName, input, opts) => {
    // AskUserQuestion：headless 下走不通原生选择 UI（onUserDialog 被 canUseTool 短路、且无 Ink TTY，
    // 实测声明 supportedDialogKinds:['permission_ask_user_question']+onUserDialog 也不触发）。唯一可行注入点
    // 就是这里 → 弹前端选择卡，等用户选完，用 deny+message 把选择回传给 Claude。即便 bypass 也要弹（用户要的
    // 就是"被问到"），故置于全放行判断之前。
    if (toolName === 'AskUserQuestion') {
      const questions = Array.isArray(input?.questions) ? input.questions : [];
      if (!questions.length) return { behavior: 'deny', message: '（AskUserQuestion 未携带 questions，已跳过）' };
      const reqId = 'ask-' + (++conn.permSeq);
      send(conn.ws, { ev: 'ask_question', tabId, reqId, questions });
      return await new Promise((resolve) => {
        conn.pendingDialogs.set(reqId, (answer) => {
          if (!answer || answer.cancelled) { resolve({ behavior: 'deny', message: '用户跳过了这次选择（没有作答）。请不要重复调用 AskUserQuestion，按你已有的信息继续，或等用户下一条指令。', interrupt: !!(answer && answer.interrupt) }); return; }
          resolve({ behavior: 'deny', message: formatAskAnswer(answer) });
        });
        opts?.signal?.addEventListener?.('abort', () => {
          if (conn.pendingDialogs.has(reqId)) { conn.pendingDialogs.delete(reqId); resolve({ behavior: 'deny', message: '已中断', interrupt: true }); }
        }, { once: true });
      });
    }
    // 0) bypass 模式：全放行（连改文件的 Bash/python 都不弹审批条）
    if (conn.permMode === 'bypass') return { behavior: 'allow', updatedInput: input };
    // 1) 本会话已「总是允许」
    if (conn.sessionAllow.has(toolName)) return { behavior: 'allow', updatedInput: input };
    // 2) 只读工具
    if (AUTO_ALLOW.has(toolName)) return { behavior: 'allow', updatedInput: input };
    // 3) Vault 内编辑 → 自动接受（之后前端 diff 复核）；Vault 外编辑 → 弹窗
    if (EDIT_TOOLS.has(toolName) && editPathInVault(input)) {
      const p = input?.file_path || input?.notebook_path || input?.path;
      await snapshotBaselineIfNeeded(path.resolve(p));   // 改之前留一条「原始版本」，方便用户回滚
      return { behavior: 'allow', updatedInput: input };
    }
    // 4) 其它（Bash / 联网 / Vault 外 / MCP / 未知）→ 弹 GUI
    const reqId = 'perm-' + (++conn.permSeq);
    send(conn.ws, {
      ev: 'permission_request', tabId, reqId, toolName,
      title: opts?.title || toolTitle(toolName, input),
      displayName: opts?.displayName, description: opts?.description,
      input: summarizeInput(toolName, input),
    });
    return await new Promise((resolve) => {
      conn.pendingPerms.set(reqId, (decision) => {
        if (decision === 'allow') resolve({ behavior: 'allow', updatedInput: input });
        else if (decision === 'allow-always') { conn.sessionAllow.add(toolName); resolve({ behavior: 'allow', updatedInput: input }); }
        else resolve({ behavior: 'deny', message: '用户拒绝了此操作', interrupt: decision === 'cancel' });
      });
      opts?.signal?.addEventListener?.('abort', () => {
        if (conn.pendingPerms.has(reqId)) { conn.pendingPerms.delete(reqId); resolve({ behavior: 'deny', message: '已中断', interrupt: true }); }
      }, { once: true });
    });
  };
}
function summarizeInput(name, input) {
  const o = {};
  for (const k of ['command', 'query', 'url', 'file_path', 'path', 'description']) if (input?.[k] != null) o[k] = String(input[k]).slice(0, 300);
  return o;
}

// ---------- 消费 SDK 消息流 → ws 事件 ----------
// 文本/思考只取 stream_event 增量；tool_use 只取完整 assistant 消息（避免重复 + 免去 partial-json 修复）。
async function runConsumer(conn, tabId, tab) {
  const { ws } = conn;
  try {
    for await (const msg of tab.query) {
      if (tab.dead) {                                    // 被中断的旧 query 仍会吐尾部事件 → 静默
        if (msg.type === 'system' && msg.subtype === 'init' && msg.session_id) tab.sessionId = msg.session_id;   // 但仍记下 session id：哪怕中断早于 init，下次 user_turn 也能 resume 续上下文
        if (msg.type !== 'result') continue;             // 放行 result 以归还 activeTurns
      }
      switch (msg.type) {
        case 'system':
          if (msg.subtype === 'init') {
            tab.sessionId = msg.session_id;
            send(ws, { ev: 'session', tabId, sessionId: msg.session_id, model: msg.model, apiKeySource: msg.apiKeySource, skills: msg.skills || [], slash: msg.slash_commands || [], tools: msg.tools || [], mcp: msg.mcp_servers || [], permissionMode: msg.permissionMode });
          } else if (msg.subtype === 'permission_denied') {
            send(ws, { ev: 'tool_done', tabId, id: msg.tool_use_id, isError: true, summary: msg.message });
          }
          break;
        case 'stream_event': {
          const ev = msg.event;
          if (ev?.type === 'content_block_delta') {
            if (ev.delta?.type === 'text_delta' && ev.delta.text) send(ws, { ev: 'content', tabId, delta: ev.delta.text });
            else if (ev.delta?.type === 'thinking_delta' && ev.delta.thinking) send(ws, { ev: 'reasoning', tabId, delta: ev.delta.thinking });
          } else if (ev?.type === 'message_start') {            // 仿 claudian：每个（子）消息开头就拿到 input_tokens（=喂给模型的上下文）→ 实时推 ctx，不等 result
            sendCtx(ws, tabId, ev.message?.usage);
          } else if (ev?.type === 'message_delta' && ev.usage) {   // agentic 多步里上下文随工具结果增长 → message_delta 也带 usage，继续刷新
            sendCtx(ws, tabId, ev.usage);
          }
          break;
        }
        case 'assistant': {
          const blocks = msg.message?.content;
          if (Array.isArray(blocks)) for (const b of blocks) {
            if (b.type === 'tool_use') {
              const ev = { ev: 'tool', tabId, id: b.id, name: b.name, title: toolTitle(b.name, b.input) };
              const ed = extractEdits(b.name, b.input);
              if (ed) ev.edits = ed;
              send(ws, ev);
            }
          }
          if (msg.error) send(ws, { ev: 'error', tabId, message: 'AI 错误：' + msg.error });
          break;
        }
        case 'user': {
          const blocks = msg.message?.content;
          if (Array.isArray(blocks)) for (const b of blocks) {
            if (b.type === 'tool_result') send(ws, { ev: 'tool_done', tabId, id: b.tool_use_id, isError: !!b.is_error });
          }
          break;
        }
        case 'result': {
          activeTurns = Math.max(0, activeTurns - 1); lastTurnEndAt = Date.now();
          if (tab.dead) break;                                 // 中断的旧 query：已发过 interrupted，丢弃这条收尾 result（否则前端重复 finishTurn/drainQueue）
          const ctxTokens = ctxOf(msg.usage);                  // 最终权威值（与实时 ctx 同口径）
          send(ws, { ev: 'result', tabId, subtype: msg.subtype, isError: !!msg.is_error, turns: msg.num_turns, cost: msg.total_cost_usd, ctxTokens }); }
          break;
        default: break;
      }
    }
  } catch (e) {
    if (!tab.dead) {                                          // 中断旧 query 抛出的 ede_diagnostic 不是真错误，不报给前端
      const txt = String(e?.message || e);
      const authish = /not logged in|authentication|\/login|oauth/i.test(txt);
      send(ws, { ev: 'error', tabId, message: txt, auth: authish });
    }
  } finally {
    tab.consumerRunning = false;
  }
}

// ---------- 模拟驱动（UNIWORK_MOCK=1）：不调真 SDK，跑通全栈 ----------
async function mockTurn(conn, tabId, m, text) {
  const { ws } = conn;
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  send(ws, { ev: 'turn_start', tabId });
  send(ws, { ev: 'session', tabId, sessionId: 'mock-' + tabId, model: '(mock)', apiKeySource: 'oauth', skills: ['hf-morning-brief', 'deep-research-workflow', 'earnings-review'], tools: ['Read', 'Edit', 'Bash', 'WebSearch'], mcp: [], permissionMode: 'default' });
  // 思考
  for (const t of ['我先看下当前文件，', '判断要不要改，', '再决定动哪几段。']) { send(ws, { ev: 'reasoning', tabId, delta: t }); await sleep(120); }
  const wantsEdit = /改|修改|edit|补充|更新|append/i.test(m.text || '');
  const wantsBash = /bash|跑|运行|命令|terminal/i.test(m.text || '');

  if (wantsBash) { // 演示权限弹窗
    const reqId = 'perm-' + (++conn.permSeq);
    send(ws, { ev: 'permission_request', tabId, reqId, toolName: 'Bash', title: 'Bash：echo hello', input: { command: 'echo hello' } });
    const decision = await new Promise((res) => { conn.pendingPerms.set(reqId, (d) => { conn.pendingPerms.delete(reqId); res(d); }); });
    send(ws, { ev: 'tool', tabId, id: 'mb', name: 'Bash', title: 'Bash：echo hello' });
    await sleep(150);
    send(ws, { ev: 'tool_done', tabId, id: 'mb', isError: decision === 'deny' || decision === 'cancel', summary: decision.startsWith('allow') ? 'hello' : '用户拒绝' });
  }

  for (const t of ['好的，', '我来处理。\n\n']) { send(ws, { ev: 'content', tabId, delta: t }); await sleep(100); }

  if (wantsEdit && m.openFile) { // 真实改一个 Vault 文件 → 触发 watcher → 前端 diff
    const abs = resolveInVault(m.openFile);
    if (abs) {
      try {
        const cur = await fsp.readFile(abs, 'utf8').catch(() => '');
        const stamp = `\n\n> （Uniwork mock 于本回合追加的一段，用于演示绿增红删 diff 复核。）\n`;
        send(ws, { ev: 'tool', tabId, id: 'me', name: 'Edit', title: 'Edit：' + m.openFile });
        await fsp.writeFile(abs, cur + stamp, 'utf8');   // 不标 selfWrite → watcher 会推 file_changed
        await sleep(120);
        send(ws, { ev: 'tool_done', tabId, id: 'me', isError: false });
        send(ws, { ev: 'content', tabId, delta: '已在文末追加一段，请在编辑器里复核（✓ 接受 / ✗ 拒绝）。' });
      } catch (e) { send(ws, { ev: 'content', tabId, delta: '（mock 改文件失败：' + e.message + '）' }); }
    }
  } else {
    send(ws, { ev: 'content', tabId, delta: '这是 mock 回复：把 `UNIWORK_MOCK` 去掉并 `claude login` 后即接真 Claude。' });
  }
  send(ws, { ev: 'result', tabId, subtype: 'success', isError: false, turns: 1, cost: 0 });
}

// ---------- Vault 文件监听 → 推 file_changed ----------
let activeTurns = 0, lastTurnEndAt = 0;                 // agent 回合状态（watcher auto-commit 判定用）
const autoCommitT = new Map();                          // path → debounce timer：外部编辑自动 commit（单点，多客户端不抢跑）
function scheduleAutoCommit(rel) {
  // AI 回合中 / 刚结束 15s 内的写盘 = AI 改动 → 不自动 commit（留给前端审批流：接受才 commit，拒绝 checkout HEAD 还原）
  if (activeTurns > 0 || Date.now() - lastTurnEndAt < 15000) return;
  // xlsx/docx 外部改动也走前端审批（单元格 diff / Word 修订），接受才 commit —— server 不抢跑
  if (/\.(xlsx|xls|csv|docx)$/i.test(rel)) return;
  clearTimeout(autoCommitT.get(rel));
  autoCommitT.set(rel, setTimeout(() => { autoCommitT.delete(rel); gitCommitFile(rel, '本地编辑'); }, 2500));
}
const watcher = chokidar.watch(VAULT, { ignored: /(^|[/\\])(\.(git|DS_Store)|~\$)/, ignoreInitial: true, followSymlinks: true, awaitWriteFinish: { stabilityThreshold: 800, pollInterval: 100 } });   // followSymlinks:true → 挂载的外部文件夹也实时同步；~$ = Office 锁文件不广播；稳定窗口 800ms 等 Office/python 分段写盘完成（200ms 实测会拿到半写 zip）
watcher.on('all', async (event, abs) => {
  if (event === 'addDir' || event === 'unlinkDir') { broadcast({ ev: 'vault_dirty' }); return; }   // 本地新建/删除文件夹 → 实时刷新侧栏树（含空文件夹，listVault 会带上）
  if (!['add', 'change', 'unlink'].includes(event)) return;
  const rel = relOf(abs);
  if (event === 'unlink') { selfWrites.delete(abs); broadcast({ ev: 'file_changed', path: rel, deleted: true }); broadcast({ ev: 'vault_dirty' }); return; }
  const isMd = path.extname(abs).toLowerCase() === '.md';
  let text = null;
  if (isMd) { try { text = await fsp.readFile(abs, 'utf8'); } catch {} }
  // 自写回声抑制：内容与我们刚写的一致 → 跳过这一次（之后的真实编辑照常推送）
  if (selfWrites.has(abs)) {
    const sw = selfWrites.get(abs);
    if (text === null || sw === text) { selfWrites.delete(abs); return; }
  }
  broadcast({ ev: 'file_changed', path: rel, newText: text, binary: !isMd });   // 二进制(xlsx/docx) newText=null + binary:true → 前端重新拉盘内容重渲染
  scheduleAutoCommit(rel);                              // 外部编辑（PowerPoint/Word/Excel/编辑器保存）→ server 单点记历史；AI 改动跳过（走前端审批）
  if (event === 'add') broadcast({ ev: 'vault_dirty' });
});
function broadcast(obj) { for (const c of clients) send(c.ws, obj); }

// 启动时跑一次 throwaway query 抓 init → 缓存 harness 真·加载的 skills/slash_commands/tools（与本地 Claude Code 完全一致），
// 让前端 / 菜单连上即有、不必先发一条消息。静态不变，缓存一次即可。
let harnessInfo = null;
async function warmHarness() {
  if (MOCK) { harnessInfo = { skills: ['hf-morning-brief', 'deep-research-workflow', 'earnings-review'], slash: ['hf-morning-brief', 'deep-research-workflow', 'earnings-review', 'clear', 'compact'], tools: ['Read', 'Edit', 'Bash', 'WebSearch'], model: DEFAULT_MODEL }; broadcast({ ev: 'harness', ...harnessInfo }); return; }
  if (!agentQuery) return;
  try {
    const q = agentQuery({ prompt: 'Reply with the single word READY.', options: {
      cwd: VAULT, settingSources: ['user', 'project', 'local'], skills: 'all',
      systemPrompt: { type: 'preset', preset: 'claude_code', append: UNIWORK_APPEND },
      permissionMode: 'default', allowDangerouslySkipPermissions: true, maxTurns: 1,
    } });
    for await (const m of q) {
      if (m.type === 'system' && m.subtype === 'init') {
        harnessInfo = { skills: m.skills || [], slash: m.slash_commands || [], tools: m.tools || [], model: m.model };
        broadcast({ ev: 'harness', ...harnessInfo });            // 推给已连接客户端
        console.log(`  harness: ${harnessInfo.skills.length} skills / ${harnessInfo.slash.length} slash / ${harnessInfo.tools.length} tools`);
        break;                                                   // 拿到 init 即可，停掉 warmup query
      }
    }
  } catch (e) { console.warn('warmHarness failed:', e.message); }
}

// ---------- 启动 ----------
async function ensureRoots() {                                   // 让「回收站」「User import」常驻为根目录项（即使空也显示）
  try { await fsp.mkdir(path.join(VAULT, TRASH), { recursive: true }); } catch {}
  try { await fsp.mkdir(path.join(VAULT, IMPORT), { recursive: true }); await ensureImportGitignored(); } catch {}
}

// 兜底：单条 stray async 拒绝不应整服务崩溃（如 WS 断开时对已收尾 query 调 interrupt 触发的 reject）。记录但不退出
process.on('unhandledRejection', (e) => { console.warn('[unhandledRejection]', e?.message || e); });
// 兜底：任何漏网的同步未捕获异常也不应崩掉本地服务(否则计划任务重启 99 次后彻底停)。记录但不退出
process.on('uncaughtException', (e) => { console.error('[uncaughtException]', e?.stack || e?.message || e); });

server.listen(PORT, () => {
  console.log(`Uniwork V2 后端  http://localhost:${PORT}`);
  console.log(`  Vault : ${VAULT}`);
  console.log(`  模式  : ${MOCK ? 'MOCK（模拟 agent，无需鉴权）' : '真 Claude（需 claude login 订阅）'}`);
  console.log(`  模型  : ${DEFAULT_MODEL}`);
  ensureRoots();                                                 // 建两个常驻根目录
  warmHarness();                                                 // 预热（拿 / 命令列表），不阻塞启动
});
