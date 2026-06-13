// Dry-run 复测：更新 system prompt(级联铁律) 后，打开 SNDK 研报丢一个"下修预期"软信号，
// AI 是否会【识别这是级联场景 + propose 命中哪个 driver/哪几期 + 提议幅度并等用户确认】，
// 而不是直接动 Word。忠实复刻 server.mjs 的 query() options，写工具一律 dry-run 拦截。
import { query } from '@anthropic-ai/claude-agent-sdk';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const VAULT = path.resolve(process.env.UNIWORK_VAULT || path.join(os.homedir(), 'UniworkVault'));
const MODEL = process.env.UNIWORK_MODEL || 'claude-opus-4-8[1m]';
const serverSrc = fs.readFileSync(new URL('./server.mjs', import.meta.url), 'utf8');
const UNIWORK_APPEND = serverSrc.match(/const UNIWORK_APPEND = `([\s\S]*?)`;/)[1];

const AUTO_ALLOW = new Set(['Read', 'Grep', 'Glob', 'LS', 'NotebookRead', 'TodoWrite', 'Skill']);
const DRY_MSG = '（演示环境：写操作与命令暂不实际执行。）';

const openFile = 'Vault/Company Coverage/SNDK/研报/SNDK_report_v3.3.docx';
const userText = '最近好像有新闻说下个季度存储价格会有下降，没有那么乐观的预期了';
const prompt = `【当前打开的文件：${openFile}】（可用 Read 查看；要改就直接 Edit/Write 这个真实文件）\n\n${userText}`;

const toolLog = []; let finalText = '';
const watchdog = setTimeout(() => { console.log('\n=WATCHDOG='); dump(); process.exit(2); }, 220000);
function dump() {
  console.log('\n===== 工具调用顺序 =====');
  toolLog.forEach((t, i) => console.log(`${String(i + 1).padStart(2)}. ${t.allowed ? '✅' : '⛔'} ${t.name} ${t.summary}`));
  console.log('\n===== 最终回答 =====\n' + finalText.trim());
}
const q = query({ prompt, options: {
  cwd: VAULT, model: MODEL, settingSources: ['user', 'project', 'local'], skills: 'all',
  systemPrompt: { type: 'preset', preset: 'claude_code', append: UNIWORK_APPEND },
  permissionMode: 'default', includePartialMessages: false, maxTurns: 16,
  canUseTool: async (name, input) => {
    const summary = JSON.stringify(['command', 'file_path', 'query', 'skill', 'description']
      .reduce((o, k) => (input?.[k] != null ? (o[k] = String(input[k]).slice(0, 80), o) : o), {})).slice(0, 180);
    const allowed = AUTO_ALLOW.has(name); toolLog.push({ name, summary, allowed });
    return allowed ? { behavior: 'allow', updatedInput: input } : { behavior: 'deny', message: DRY_MSG };
  }, stderr: () => {},
} });
try {
  for await (const m of q) {
    if (m.type === 'system' && m.subtype === 'init') console.log('INIT model=%s skills=%d', m.model, (m.skills || []).length);
    else if (m.type === 'assistant') { const t = (m.message?.content || []).filter(b => b.type === 'text').map(b => b.text).join(''); if (t) finalText += t + '\n'; }
    else if (m.type === 'result') console.log('RESULT %s turns=%s $%s', m.subtype, m.num_turns, m.total_cost_usd);
  }
  clearTimeout(watchdog); dump();
} catch (e) { clearTimeout(watchdog); console.log('THREW:', String(e?.stack || e).slice(0, 600)); dump(); process.exitCode = 1; }
