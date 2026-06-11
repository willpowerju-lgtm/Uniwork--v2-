// 全栈协议自测（mock 模式）：连 ws，跑文件 API + 一轮带编辑的 user_turn + 权限弹窗。
import WebSocket from 'ws';
const PORT = process.env.PORT || 4199;
const got = [];
const ws = new WebSocket(`ws://localhost:${PORT}/agent`);
const log = (...a) => console.log(...a);
const sendOp = (o) => ws.send(JSON.stringify(o));
let permResolved = false;

const timeout = setTimeout(() => { log('TIMEOUT'); summarize(); process.exit(1); }, 15000);

function summarize() {
  clearTimeout(timeout);
  const evs = got.map(g => g.ev).join(',');
  const fileChanged = got.find(g => g.ev === 'file_changed' && g.newText);
  const sawSession = got.some(g => g.ev === 'session');
  const sawResult = got.some(g => g.ev === 'result');
  const sawPermReq = got.some(g => g.ev === 'permission_request');
  log('\n=== EVENTS ===\n' + evs);
  log('\n=== CHECKS ===');
  log('session:', sawSession, '| result:', sawResult, '| permission_request:', sawPermReq);
  log('file_changed(newText present):', !!fileChanged, fileChanged ? '→ len=' + fileChanged.newText.length : '');
  const content = got.filter(g => g.ev === 'content').map(g => g.delta).join('');
  const reasoning = got.filter(g => g.ev === 'reasoning').map(g => g.delta).join('');
  log('reasoning:', JSON.stringify(reasoning.slice(0, 60)));
  log('content:', JSON.stringify(content.slice(0, 120)));
  const ok = sawSession && sawResult && fileChanged && sawPermReq;
  log('\n=== RESULT:', ok ? 'PASS ✅' : 'FAIL ❌', '===');
  process.exit(ok ? 0 : 1);
}

ws.on('open', () => log('ws open'));
ws.on('message', async (raw) => {
  const m = JSON.parse(raw.toString());
  got.push(m);
  log('<<', m.ev, m.ev === 'content' || m.ev === 'reasoning' ? JSON.stringify(m.delta) : (m.ev === 'file_changed' ? m.path : ''));
  if (m.ev === 'hello') {
    // 1) 写一个测试文件
    sendOp({ op: 'save_file', path: 'WIKI/test.md', text: '# 测试笔记\n\n初始内容。\n' });
  }
  if (m.ev === 'saved' && m.path === 'WIKI/test.md') {
    sendOp({ op: 'list_vault' });
  }
  if (m.ev === 'vault') {
    log('   vault files:', m.files.map(f => f.path).join(', '));
    sendOp({ op: 'open_file', path: 'WIKI/test.md' });
  }
  if (m.ev === 'file' && m.path === 'WIKI/test.md') {
    log('   opened, text len=', m.text.length);
    // 2) 一轮带编辑的 user_turn（mock 会真实改这个文件）
    sendOp({ op: 'user_turn', tabId: 'main', text: '帮我改一下这份笔记，补充一段', openFile: 'WIKI/test.md', model: 'mock' });
  }
  // 3) 收到权限弹窗 → 放行（演示 Bash 弹窗：触发第二轮）
  if (m.ev === 'permission_request' && !permResolved) {
    permResolved = true;
    log('   → responding allow to', m.reqId);
    sendOp({ op: 'permission_response', reqId: m.reqId, decision: 'allow' });
  }
  // 第一轮 result 后，发一轮 bash 触发权限弹窗
  if (m.ev === 'result' && got.filter(g => g.ev === 'result').length === 1) {
    sendOp({ op: 'user_turn', tabId: 'main', text: '跑个 bash 命令看看', openFile: 'WIKI/test.md', model: 'mock' });
  }
  // 第二轮 result → 收尾
  if (m.ev === 'result' && got.filter(g => g.ev === 'result').length === 2) {
    setTimeout(summarize, 300);
  }
});
ws.on('error', (e) => { log('ws error', e.message); process.exit(1); });
