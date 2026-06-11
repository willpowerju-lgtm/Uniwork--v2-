// 把 repo 内 samples/（完整 vault 快照：WIKI + Vault/Company Coverage 全套素材 + WIP 级联工作区）
// materialize 成 ~/UniworkVault 的真实文件，并 git init + 首 commit 作为「拒绝/撤销」复核的 checkpoint 基线。
//
// 跑： node seed-vault.mjs            （vault 已有内容则跳过，不覆盖）
//     node seed-vault.mjs --force    （清空 vault 后重新铺，慎用）
//
// 复现说明：samples/ 是 SNDK / NVDA 两个 focus 标的的完整 finance-cowork 工作区
//   （原始素材 banker_reports/conferences/earnings_*/capital_iq/model/news +
//    _data_registry.json + WIP 级联工作区），clone 后跑本脚本即可在 Uniwork 里
//   完整复现：wiki 双链跳转、AI 改文件复核、finance-cowork 级联更新。
import fsp from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SEED = path.join(__dirname, 'samples');
const VAULT = path.resolve(process.env.UNIWORK_VAULT || path.join(os.homedir(), 'UniworkVault'));
const FORCE = process.argv.includes('--force');

async function exists(p) { try { await fsp.access(p); return true; } catch { return false; } }

// 递归复制 src → dst（保留目录结构；已存在文件默认跳过，--force 时覆盖）
async function copyTree(src, dst) {
  await fsp.mkdir(dst, { recursive: true });
  for (const ent of await fsp.readdir(src, { withFileTypes: true })) {
    if (ent.name === '.DS_Store' || ent.name.startsWith('~$')) continue;
    const s = path.join(src, ent.name), d = path.join(dst, ent.name);
    if (ent.isDirectory()) { await copyTree(s, d); }
    else if (ent.isFile()) {
      if (!FORCE && await exists(d)) continue;             // 不覆盖用户已有文件
      await fsp.copyFile(s, d);
    }
  }
}

async function main() {
  if (!await exists(SEED)) { console.error('找不到 samples/ 种子目录'); process.exit(1); }

  const vaultHasContent = await exists(path.join(VAULT, 'WIKI')) || await exists(path.join(VAULT, 'Vault'));
  if (vaultHasContent && !FORCE) {
    console.log(`${VAULT} 已有内容。如需重新铺种子，先备份后跑 --force。`);
    return;
  }
  if (FORCE && vaultHasContent) {
    console.log(`--force：清空 ${VAULT}/{WIKI,Vault} 重铺`);
    await fsp.rm(path.join(VAULT, 'WIKI'), { recursive: true, force: true });
    await fsp.rm(path.join(VAULT, 'Vault'), { recursive: true, force: true });
  }

  console.log(`铺种子 → ${VAULT}`);
  await copyTree(SEED, VAULT);

  // 常驻根目录项（即使空也显示）
  await fsp.mkdir(path.join(VAULT, '回收站'), { recursive: true });
  await fsp.mkdir(path.join(VAULT, 'User import'), { recursive: true });
  const gi = path.join(VAULT, '.gitignore');
  if (!await exists(gi)) await fsp.writeFile(gi, 'User import/\n.DS_Store\n', 'utf8');

  // git init + 首 commit（Uniwork 的 Time Machine 基线）
  const G = `git -C "${VAULT}"`;
  if (!await exists(path.join(VAULT, '.git'))) {
    execSync(`${G} init -q -b main`);
  }
  execSync(`${G} add -A`);
  try {
    execSync(`${G} -c user.name=Uniwork -c user.email=uniwork@local commit -q -m "初始版本"`);
    console.log('git 初始版本已提交（Uniwork 历史基线）');
  } catch { console.log('（无变更，跳过 commit）'); }

  console.log(`\n完成。启动： node server.mjs  → http://localhost:4199`);
}

main().catch(e => { console.error(e); process.exit(1); });
