// 诊断 harness/skills 加载。用字符串 prompt（像 smoke），隔离 settingSources 的影响。
// 用法： SS=none node harness-check.mjs   （settingSources=[]）
//        SS=user node harness-check.mjs   （只 user）
//        node harness-check.mjs           （user,project,local）
//        DBG=1 ... 看 CLI debug
import { query } from '@anthropic-ai/claude-agent-sdk';
import os from 'node:os';
import path from 'node:path';
const VAULT = path.resolve(process.env.UNIWORK_VAULT || path.join(os.homedir(), 'UniworkVault'));
const SS = process.env.SS === 'none' ? [] : (process.env.SS || 'user,project,local').split(',').filter(Boolean);
const noSkills = process.env.NOSKILLS === '1';
const noAuto = process.env.NOAUTO === '1';

console.log('settingSources =', JSON.stringify(SS), '| skills:', noSkills ? 'off' : 'all', '| mode:', noAuto ? 'default' : 'auto');
const t0 = Date.now();
const wd = setTimeout(() => { console.log(`\nWATCHDOG 25s — no init yet (+${Date.now() - t0}ms)`); process.exit(2); }, 25000);

const opts = { cwd: VAULT, settingSources: SS, strictMcpConfig: process.env.NOSTRICT !== '1', maxTurns: 1, stderr: (d) => { if (process.env.DBG) process.stderr.write(d); }, debug: !!process.env.DBG };
if (!noSkills) opts.skills = 'all';
if (!noAuto) { opts.permissionMode = 'auto'; opts.extraArgs = { 'enable-auto-mode': null }; }

const q = query({ prompt: 'Reply with the single word READY and nothing else.', options: opts });
try {
  for await (const m of q) {
    if (m.type === 'system' && m.subtype === 'init') {
      console.log(`INIT (+${Date.now() - t0}ms)  auth=${m.apiKeySource}  model=${m.model}  tools=${(m.tools || []).length}  skills=${(m.skills || []).length}  slash=${(m.slash_commands || []).length}  mcp=${(m.mcp_servers || []).length}`);
      if ((m.skills || []).length) console.log('   skills:', (m.skills || []).join(', '));
      if ((m.slash_commands || []).length) console.log('   slash:', (m.slash_commands || []).join(', '));
      clearTimeout(wd);
    } else if (m.type === 'result') {
      console.log(`RESULT (+${Date.now() - t0}ms)  subtype=${m.subtype}  ${(m.result || '').slice(0, 80)}`);
      break;
    }
  }
} catch (e) { console.log('ERR:', String(e.message || e).slice(0, 200)); }
clearTimeout(wd);
process.exit(0);
