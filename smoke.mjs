// Auth + round-trip smoke test for the Claude Agent SDK.
// Goal: learn whether query() can authenticate in THIS environment (so we know
// if live end-to-end testing is possible, or if a standalone `claude login` is needed).
import { query } from '@anthropic-ai/claude-agent-sdk';

const t0 = Date.now();
let gotInit = false, gotText = '';
const watchdog = setTimeout(() => { console.log('WATCHDOG 120s — likely hung on auth/login. exiting.'); process.exit(2); }, 120000);
try {
  const q = query({
    prompt: 'Reply with exactly the single word: PONG',
    options: {
      cwd: process.cwd(),
      permissionMode: 'default',   // NOT bypass — balanced-safe
      tools: [],                   // no tools at all: pure model round-trip, zero agent capability
      canUseTool: async () => ({ behavior: 'deny', message: 'smoke test: tools disabled' }),
      settingSources: [],          // isolation: skip user CLAUDE.md/skills for a clean auth test
      maxTurns: 1,
      includePartialMessages: false,
      stderr: (d) => process.stderr.write('[stderr] ' + d),
    },
  });
  for await (const m of q) {
    if (m.type === 'system' && m.subtype === 'init') {
      gotInit = true;
      console.log('INIT  apiKeySource=%s  model=%s  cwd=%s  tools=%d', m.apiKeySource, m.model, m.cwd, (m.tools||[]).length);
    } else if (m.type === 'assistant') {
      const txt = (m.message?.content || []).filter(b => b.type === 'text').map(b => b.text).join('');
      if (txt) gotText += txt;
      if (m.error) console.log('ASSISTANT.error=', m.error);
    } else if (m.type === 'result') {
      console.log('RESULT subtype=%s is_error=%s result=%j cost=%s', m.subtype, m.is_error, (m.result||'').slice(0,120), m.total_cost_usd);
    }
  }
  console.log('TEXT=%j', gotText.trim());
  console.log('OK in %dms (init=%s)', Date.now()-t0, gotInit);
  clearTimeout(watchdog);
} catch (e) {
  clearTimeout(watchdog);
  console.log('THREW after %dms:', Date.now()-t0);
  console.log(String(e && e.stack || e).slice(0, 1500));
  process.exitCode = 1;
}
