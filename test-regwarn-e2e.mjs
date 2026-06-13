// E2E：手改研报里一个 model 派生数字 → 经 WS commit_file → 服务端应回 committed + registry_warn。
// 用显式 sha reset 清理，保证 vault 历史不被污染。
import WebSocket from 'ws';
import { execFileSync } from 'node:child_process';
import os from 'node:os';
import path from 'node:path';

const VAULT = path.join(os.homedir(), 'UniworkVault');
const REL = 'Vault/Company Coverage/SNDK/研报/SNDK_report_v3.3.docx';
const ABS = path.join(VAULT, REL);
const g = (...a) => execFileSync('git', ['-C', VAULT, ...a], { encoding: 'utf8' }).trim();

const preSha = g('rev-parse', 'HEAD');
console.log('pre-test HEAD =', preSha);

// 1) 在 docx 里干净地改掉一个 distinctive、Excel-model、单次出现的整数 token
const py = `
import sys, io, json, docx, os
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
report=r'''${ABS}'''
reg=json.load(open(os.path.join(os.path.dirname(report),'..','_data_registry.json'),encoding='utf-8'))
cands=[(k,int(v['value'])) for k,v in reg['entries'].items()
       if isinstance(v.get('value'),(int,float)) and not isinstance(v['value'],bool)
       and v.get('source')=='Excel model' and float(v['value']).is_integer()
       and abs(v['value'])>=300 and not (1990<=v['value']<=2099)]
d=docx.Document(report)
def runs(doc):
    for p in doc.paragraphs:
        for r in p.runs: yield r
    for tb in doc.tables:
        for row in tb.rows:
            for c in row.cells:
                for p in c.paragraphs:
                    for r in p.runs: yield r
import collections
# 统计每个候选值的精确 token 出现次数（带千分位或裸数字），挑唯一出现的
text='\\n'.join(r.text for r in runs(d))
import re
def count(iv):
    forms=[f'{iv:,}', str(iv)]
    return sum(len(re.findall(r'(?<!\\d)'+re.escape(f)+r'(?!\\d)', text)) for f in forms), forms
chosen=None
for k,iv in cands:
    c,forms=count(iv)
    if c==1: chosen=(k,iv,forms); break
if not chosen:
    print('NOCAND'); sys.exit(0)
k,iv,forms=chosen
new='7'  # 改成一个明显不同、不会和其它 registry 值撞的小数字字符串... 用具体值
newval='321'
done=False
for r in runs(d):
    for f in forms:
        if re.search(r'(?<!\\d)'+re.escape(f)+r'(?!\\d)', r.text):
            r.text=re.sub(r'(?<!\\d)'+re.escape(f)+r'(?!\\d)', newval, r.text, count=1); done=True; break
    if done: break
d.save(report)
print(json.dumps({'key':k,'old':iv,'new':int(newval)},ensure_ascii=False))
`;
const mut = execFileSync('python3', ['-c', py], { encoding: 'utf8', env: { ...process.env, PYTHONIOENCODING: 'utf-8', PYTHONUTF8: '1' } }).trim();
console.log('mutation:', mut);
if (mut === 'NOCAND') { console.log('找不到唯一出现的候选，跳过'); process.exit(0); }

// 2) WS 连接 → commit_file → 捕获事件
const ws = new WebSocket('ws://localhost:4199/agent');
let got = { committed: false, warn: null };
const finish = (code) => {
  try { g('reset', '--hard', preSha); } catch (e) { console.log('reset 失败', e.message); }
  const postSha = g('rev-parse', 'HEAD');
  console.log('cleanup → HEAD =', postSha, postSha === preSha ? '(已还原 ✅)' : '(⚠️未还原)');
  console.log('\n结果：committed=%s  registry_warn=%s', got.committed, got.warn ? 'YES ✅' : 'NO ❌');
  if (got.warn) console.log(JSON.stringify(got.warn, null, 2));
  try { ws.close(); } catch {}
  process.exit(code);
};
const wd = setTimeout(() => { console.log('WATCHDOG 20s'); finish(2); }, 20000);
ws.on('open', () => { console.log('ws open → 发 commit_file'); ws.send(JSON.stringify({ op: 'commit_file', path: REL, message: '测试：手改 model 派生数字', tabId: 'main' })); });
ws.on('message', (data) => {
  let m; try { m = JSON.parse(data); } catch { return; }
  if (m.ev === 'committed' && m.path === REL) got.committed = true;
  if (m.ev === 'registry_warn') { got.warn = { file: m.file, tabId: m.tabId, n: (m.divergences || []).length, divergences: m.divergences, promptHead: (m.prompt || '').slice(0, 120) }; clearTimeout(wd); setTimeout(() => finish(0), 400); }
});
ws.on('error', (e) => { console.log('ws error', e.message); clearTimeout(wd); finish(1); });
