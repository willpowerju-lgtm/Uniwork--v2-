# Finance Cowork — 公司维基协作研究流水线（代码架构）



> Finance Cowork skill 的代码架构导读。权威 spec = skill 目录内 `SKILL.md`。

持仓公司的**持续维护流水线**：多源素材（`model.xlsx` / 季报 ER / 年报 AR / 电话会 EC / 券商研报 / 调研纪要 / CapIQ / news）→ 结构化公司 wiki（14 段 schema）+ 数字单一源 registry → 派生 Word 研报（默认 docx）→ 改了 model 反向级联刷新全链路。覆盖 NVDA / SNDK / AAPL / KO / BYD / AVGO。

**一句话架构**：数字走 `_data_registry.json`（确定性、schema、单一源），叙述 LLM 直写 `_sections/*.md`（无 JSON 中间层），render 末步拼合。系统是**闭环**：真理源(wiki+registry) —派生→ Office 交付物 —识别核心变更→ 反向级联刷新所有下游 + git 留痕。**机械部分代码做，语义判断停在闸口等人/LLM 确认。**


*上层 = 三模块闭环（① Ground Truth → ② 报告协作 → ③ 数据级联 → 回写真理）；下层 = 工程流水线（A model_digest → registry → B build_wiki → C report_render → D cascade_update）。*

---

## 设计原则

| 原则 | 含义 |
|---|---|
| **数字 schema / 叙述直写** | 只有数据相关的进 registry；判断/叙述 LLM 直接写 `_sections/*.md`，不经 JSON 中间层承载语义 |
| **机械 vs 语义** | COM 写单元、重算、算漂移、渲染 = 代码；driver 映射、动不动 thesis/PT、叙述怎么改 = LLM + 用户 |
| **数值原子性 / 宁缺毋假** | 数字只从 Excel / filing / API 提取，LLM 不生成不换算；提取失败标 `—`，不填空 |
| **单向流 + 闸口停** | 上游 = wiki(叙述) + registry/Excel(数字)，下游 = Word/PPT/charts；超阈值停在闸口出 preview，不动 live |
| **自动推导优先，config 做覆盖** | `fiscal_calendar` 从 ER pack 自动推财历，JSON config 只做高置信覆盖/缓存，不靠手填 |
| **第一性原理、反 over-engineering** | 从结果倒推最简实现；删掉过的层反而更稳（曾删 `fill_gaps`/`model_interpreter`/gap-JSON 共 −776 LOC） |

---

## 架构总览：3 模块闭环 = 工程内部 A / B / C / D

整体是一个**闭环**，不是单向流水线：**① Ground Truth（真理源）—派生→ ② 报告协作（Office）—识别变更→ ③ 数据级联—回写→ ① 真理源**。

| 概念模块 | 闭环角色 | 工程内部 | 入口命令 |
|---|---|---|---|
| **① wiki build** | 真理源（wiki 叙事 + registry 数字） | A `model_digest` + B `build_wiki`（synthesize / registry / render / qc） | `python src/build_wiki.py {T} --wiki-dir {dir}` |
| **② report + 版本控制** | 派生 + 人编辑 | C `report_render` / `build_report`（`{REG:}` 占位符 + git 版本，默认出 docx） | `python src/build_report.py {T} --note "..."` |
| **③ 反向级联** | 回环（反向追溯 + git 版本） | D `cascade_update`（COM 重算 + 漂移闸 + miss-guide + 人确认） | `python src/cascade_update.py {model\|drivers\|set\|apply} {T}` |

数字单一源 = `output/{T}/_data_registry.json`：B 渲染从它取数，C 报告 `{REG:}` 占位符从它取数，D 级联向它回写。三模块是依赖链 **① → ② → ③**（缺上游先跑上游）。

> **Module ① 的输入是「源集合」，不是单一 model**——model 只贡献数字，叙事体量主要来自 filings / 纪要 / 研报：数字 → registry（`model.xlsx` 预测假设 · CapIQ consensus · filings actuals）；叙事 → `_sections`（季报 ER · 年报 AR · 电话会 EC · banker 研报 · 调研纪要 · news，LLM 直写 md）。

---

## Module A · model_digest（6-step，纯 openpyxl，零 LLM）

读任意 banker/analyst Excel model，产出两份 JSON。已验证 Citi/JPM/GS 格式，覆盖 SNDK/KO/AAPL/AVGO/NVDA。

```bash
python src/model_digest.py {xlsx_path} -o output/{TICKER}_digest.json
```

| Step | 做什么 | 关键产物 |
|---|---|---|
| **1 Sheet Inventory** | 识别 IS / Revenue / GM 核心 tab | `sheet_inventory{core_tabs}` |
| **2 P&L Label Scan** | 扫 label 列正则匹配指标行，auto-detect label 列；非 GAAP 覆盖 GAAP；负向锚防误匹配（net_income 排 CF 行、rd 排 in-process） | `row_map{metric→{row,label,label_col}}` |
| **3 Period Detection** | 找季度/年度列 + actual/estimate 分界 | `period_col_index`、`model_freshness` |
| **4 Financial Extract** | row_map × col_map 提所有指标×期间 + 派生 GP/GPM/OPM/NPM/EPS（NPM 用 non_gaap_ni，不混 GAAP） | `full_financials{quarterly,annual}` |
| **5 Formula Trace** | 从 P&L output 反向追到 hardcode 假设单元（`trace.py` 递归 depth=6，三重校验寻址） | `driver_addresses[]` |
| **6 Synthesis** | business profile + driver 地址簿 | `model_map` |

**`driver_addresses[i]`** —— 级联的核心数据结构（**用 label 寻址，不用裸行列号**，改 model 行序不会错位）：

```json
{
  "find_by": "three_way_validation",
  "label": "Y/Y Datacenter Revenue Growth, %",
  "sheet": "Model", "is_core": true, "category": "growth_rate",
  "traced_from": ["revenue","gross_profit","operating_income"],   // 这个 driver 喂哪些 output
  "drives": ["revenue","gross_margin","net_income","eps"],
  "current_assumptions": { "27Q2": {"value": 1.04}, "27Q3": {"value": 0.65}, ... }
}
```

**actual / estimate 边界**（Step 3 多信号，`model_freshness = {latest_actual_period, first_estimate_period, method}`）：
1. **财历对齐（主）**：`fiscal_calendar.resolve(ticker, er_dir)` 给"今天之前已披露的最近季" = 最新 actual。
2. **公式 vs hardcode（辅）**：output 行（revenue/NI）actual=hardcode、forecast=公式（信号打在 output 行，不是 driver 行）。
3. **外部核对（QC 兜底）**：`qc_gate` 比 model 最新季 revenue vs `guide_seeker` 抽的 ER 实际，对不上 → 提醒 model 需更新。

**`fiscal_calendar`（财历自动推导）**：优先级 manual seed > ER pack 自动推导 + 缓存 > 旧缓存 > 空。从 ER 文件名 `..._fyYYqQ.md` 取 (报告月, 季号)，对各候选 fy_end_month 算报告滞后 `(report_month − quarter_end_month) % 12` ∈ [1,3]，取总滞后最小者（NVDA fy_end=1 ~1mo / SNDK fy_end=6 ~2mo 都对）。产物 `quarter_end_label("27Q1") → "Apr'26"`（季度表"期末(CY)"行直接用）。

---

## Module B · build_wiki（双通道 × 三阶段 × 14 板块）

全系统最重的模块。`build_wiki.py {T} --wiki-dir {dir}` 串确定性主链；LLM 叙述层由主线程并行 sub-agent 另跑，产物缓存在 `_sections/`。


*Wiki Build 子架构。定量 §5/6/7/9 自动挂载、定性 §1/2/3/8 LLM 直写；每个 reader 由 `reader_prompt.py` 机械注入"表格读取契约"防列串行。实测 SNDK ~10min / ~500K token（3 Sonnet + 1 Opus，42 份素材）。*

### 双通道（架构主轴）

| 通道 | 装什么 | 谁产 | 落点 |
|---|---|---|---|
| **数字主链**（确定性，脚本） | §5/§6/§7/§9/§14 表格数字 | model_digest → guide_seeker → synthesize → registry → render | `_data_registry.json` |
| **叙述直写**（LLM） | §1/§2/§3/§8/§10/§13 散文判断 | 主线程定调 `_briefing.md` → Sonnet×N 直写 | `_sections/*.md` |
| **结构化选取**（LLM→schema 桥） | metadata 覆盖 + broker 数字 + §5.3 选哪些 driver 当 KPI | 抽数 sub-agent | `_facts.json` |

> 没有 `_gap_template` / `_gap_filled` / `fill_gaps` / `model_interpreter` —— 这些"用 JSON 搬运叙述语义"的中间层已删。

### 三阶段流水线

| 步 | 脚本 / agent | 读 | 写 |
|---|---|---|---|
| **Phase 0 预处理** | `clean_sources.py` + 1 Sonnet | 原始素材 | `_build/_cleaned/`（ER −4% / Banker −46~77% / EC→ER 摘要 −92%；合并 `_ALL_EC_SUMMARIES.md`）。**后续只读 _cleaned/** |
| **Phase 1 全并行** | bash bg ×3（0 token）+ Sonnet ×3 + WebSearch ×2 | `_cleaned/` | `digest`+`model_map` / `guide_seeker.json` / CapIQ；3×`_*_extract.json`（ER/Banker/Conf，契约注入）；news。wall clock ≈ max(Banker ~7min) |
| **Phase 2a synthesize** | `synthesize.py` | `_facts.json` + digest + guide | `_interpreted_data.json` + `management_guidance.forward_guide` |
| **Phase 2b Layer 1** | Opus 定调（~30K） | Phase 1 全产出 | `_briefing.md`（cross-check 按信源优先级：一手 ER/filing > 内部 model > 卖方 > web → 核心论点 + bull/bear 主线 + 每段目标问题 + 素材分配） |
| **Phase 2c Layer 2** | Sonnet ×4 并行（每个 40-80K） | briefing + 对应素材 | `_sections/sX.md`（A:§1+§8 / B:§2+§2b / C:§3+§5.4/5.5 / D:§10+§13） |
| **Phase 2d Layer 3** | Opus 整合（~50-80K） | 全部 `_sections` | 一致性 cross-check + 去重 + 统一口径 + 覆写 `_sections` + 写 `_facts.json` |
| **确定性收尾** | synthesize → news_aggregator → registry → render → qc_gate | — | `{T}.md` + 18 项 QC |

### 14 段标准 Schema（产物）

| 段 | 内容 | 来源 |
|---|---|---|
| §1 投资论点 / §2 关键指引 / §3 业务结构 / §8 Catalyst | 核心 thesis / guidance / 商业模式 / 催化剂 | **LLM 直写** |
| §5 Key Stats（6 子表） / §6 财务 8Q strip / §7 Consensus / §9 券商评级 | 股价·财务·KPI·定价·估值 / 8Q trailing / 卖方预期 / 评级 TP | **自动挂载**（registry） |
| §4 Key Take-Away（7 桶） / §10 近期要点 | 研究 activity / 新闻公告 | 自动 + 人审 |
| §11 交叉引用 / §12 研报索引 / §13 Peer Link / §14 Footnotes | wikilink / 研报 metadata / 同业双链 / 数据源说明 | 自动（§13 人确认） |

**关键分工**：定量 §5/6/7/9 自动挂载（行情 API / Filing / Consensus / 研报 PDF 解析），定性 §1/2/3/8 LLM 直写。自动计算：§5.3 KPI（`_facts.kpis` × `driver_addresses`）、§5.6 PE（price/EPS）、§6 YoY%、日历期末行（`fiscal_calendar`）。

### QC gate（18 项 = 9 BLOCKER + 9 WARNING，render 末尾）

14 段完整 · §1 论点≥3 · §2 有指引表 · §6 ≥6 期 · §6 NI 有数据 · §5.2 年度有效 · §8 催化剂 · §5.3 有 driver（BLOCKER）；**model-vs-ER 离线新鲜度**（model 最新季 revenue vs guide_seeker ER）· §7 券商预期 · §10 新闻+URL · 来源标注 · §10 分桶无串桶 · §3 竞争格局/产业链（WARNING）。

---

## Data Registry —— 数字的单一可信源

数字层 ground truth。每个数字一条 **flat entry**，key = `{metric}_{period}`。**registry 不复刻依赖 DAG**——血缘在 `model_map.driver_addresses`，文件路由靠下游 `{REG:}` 占位符，registry 只存"当期值 + 信任标注"。


*registry 是唯一数字枢纽。**正向**：model.xlsx（model_digest）/ CapIQ（parse_capiq）/ filings / guide_seeker / `_facts.json` → registry → wiki §5/6/7 表（render.py）+ 报告 docx（`{REG:}`）+ charts（+ provenance 门），三者钉死同源。**反向（级联）**：改 model → COM `CalculateFull` 重算 → re-digest → 漂移/miss-guide 闸口停 → 人确认 → overlay registry → 重渲全下游。*

```json
{
  "version": "...", "ticker": "NVDA", "created_at": "...",
  "metadata": {
    "fiscal_year_end": 1,
    "capiq_consensus": {"pe": ..., "eps": ..., "revenue": ..., "tev_rev": ...},
    "stock_data": {"price": ..., "pe_trailing": ..., "mktcap": ..., "ev": ...}
  },
  "entries": {
    "revenue_27Q1": {
      "key": "revenue_27Q1", "value": 81615, "unit": "mn", "currency": "USD",
      "tier": "T1", "period": "27Q1", "source": "Excel model",
      "source_file": "...xlsx", "status": "actual", "fetched_at": "2026-06-11"
    },
    "gpm_pct_27Q1": { "...": "...", "unit": "%", "value": 75.0, "status": "actual" }
  },
  "broker_reports": [ ... ],
  "management_guidance": { "forward_guide": {"period": "27Q2", "revenue_b": 91.0, "gpm_pct": 75.0} },
  "qualitative": { ... },
  "kpi_groups": { ... }
}
```

- **entry 字段** = `key / value / unit / currency / tier / period / source / source_file / status / fetched_at`（无 `derived_from`、无 `used_in`）。
- **tier**（`registry.py` 按 actual/forecast 实际赋值，非纯信源分级）：**T1** = actual（filing / model 实际值）；**T2** = model 关键假设 / driver（§5.3 KPI 驱动）；**T3** = forecast（model 预测期财务 + 卖方 broker 预测）；**T4** = 预留（`VALID_TIERS` 含，当前代码未赋值）。
- **status**：`actual` / `forecast`，由 `model_freshness` 边界定（见 Module A）。
- **unit 归一化**：`gpm_pct`=75.0（已×100）；driver 的 pct/rate 分数(1.04) 注册时 ×100→104.0 标 `%`，bps 标 `bps`——保证 wiki §5.3 与报告 `{REG:}` 渲染一致。
- **`management_guidance.forward_guide`** 是级联 **miss-guide 闸**的锚（`guide_seeker` → `synthesize` 注入）；**`kpi_groups`** 是 §5.3 渲染源；**`metadata.capiq_consensus` / `stock_data`** 喂估值表（`stock_data` 从 `_stock.json` 缓存，yfinance 失败有 fallback）。

**§5.3 driver KPI 注册**：按 `_facts.json.kpis` 选取的 driver 标签，到 `driver_addresses[].current_assumptions` **每次 build 重取当期值** → 归一化 → 注册为 T2 entry。**选取 = LLM，取值 = 确定性。**

---

## Module C · report_render / build_report（wiki → Uninodue 研报，版本控制）

精简版 deep-research：从简化 question pool 选题 → 看 wiki + raw material（gap 才 websearch）→ 写 banker JSON contract（数字用 `{REG:key}` 占位符）→ 一个脚本解析占位符 + 渲染 Word（默认只出 docx）。

**数据源分工**：叙述/判断从 **wiki**（§1/§2/§3/§8/§9）直接提炼，不重新推导；数字从 **registry**（`{REG:key}`）。`{REG:revenue_26Q3}` → `entries["revenue_26Q3"].value`，单位感知格式化；缺 key → 报错拒渲（绝不写 `[missing]`）。

**强制数据块（级联锚，不可省）**：每份报告必须含 ① 完整 IS 季度表（≥8Q + 年度预测，逐格 `{REG:metric_period}`）② §5.3 KPI/driver 假设表 ③ 3 张图（`report_charts.py` 从 registry 取数 + 落 `_chart_provenance.json`）。它们让"改一次模型、全篇刷新"成立。

```bash
python src/report_render.py {T}      # 自动跑 charts → 数字门 → 占位符解析 → 黑话门 → banker Word 渲染
python src/build_report.py {T} --note "改了啥"   # 日常生产入口：版本管理 + docx + git
```

**版本管理（`build_report.py`，日常入口）**：`contract.json` 是可编辑 SSOT（文字 + `{REG:}` 占位符）。**build 永远从当前 contract 增量出版本，绝不从头重写**。

| 诉求 | 命令 | 行为 |
|---|---|---|
| 在我的基础上改 | `--note "..."` | 从当前 contract 增量 → 新版本（默认 docx）。contract+registry 没变 → noop 拦 |
| registry 数字变了要 raise | `--note`（自动拦）→ `--override` | 检测 registry 较当前版漂移 → **RAISE 列出 `key:旧→新` 并停**；`--override` 才级联进 word |
| wiki 更新了（正向同步） | `--wiki-diff` → 改 contract → `--note` | 打印 wiki 行级 diff → 据此改 contract 叙述（数字仍走 `{REG:}`） |

辅助：`--rollback vX`（恢复某版）｜`--major`｜`--list`。**版本号** v1→v2.1…v2.9→v3。**每版默认只出 docx**（`EXTRA_FORMATS=()`，见 `build_report.py`；md/xlsx/pptx 导出器保留但默认关闭，改成 `("md","xlsx","pptx")` 恢复）+ contract + charts + registry 快照（驱动反向 drift）+ wiki 快照（驱动正向 diff）+ `CHANGELOG.md` + `_versions.json`。**Git**：每版 `git commit` + tag `report/{T}/vX`（项目根，本地，不 push）。

---

## Module D · cascade_update（反向级联）

**上游假设变更 → 模型重算 → registry → 报告/wiki/charts** 的固化流程。铁律：**机械部分代码做，语义部分 LLM judge 做**（不做全自动 auto-pilot）。两条入口共用同一道闸：

| 入口 | 触发 | 命令 |
|---|---|---|
| **Path A** | 你手改 Excel model | `cascade_update.py model {T} --model PATH` |
| **Path B** | 你给一个假设（"Wall St 下调下季 ASP QoQ -10%"） | `cascade_update.py drivers {T} --model PATH`（LLM 选驱动）→ `set {T} --sheet "..." --row N --set 26Q4=-0.10 --reason "..."` |

**机械链**（代码）：COM 定位 `driver_addresses` 的驱动单元 → 写入 → Excel `CalculateFull` 全表重算 → SaveAs 新文件（原文件不动）→ re-digest → **读回验证**（新驱动值==所设，写错单元即中止）→ `synthesize→registry` 派生新值 → 算漂移 + miss-guide → 出 `_cascade_preview.json`，**不动 live registry（闸口停）**。

**闸**（`assess_drift` + `miss_guide_check`）：逐条 %漂移（`DRIFT_PCT_GATE=5%`）+ **被指引季** model vs `management_guidance.forward_guide`（动态读 period，非硬编码；仅查下限击穿）。
- ≤5% 且不 miss-guide → 可直接改；
- >5% 或 miss-guide → **确认路径**：LLM judge thesis/PT 触发项 + raise 用户 + 写 `CASCADE_REVIEW.md` 留痕。

**LLM judge 决策点**（语义，不 codify）：① 自然语言假设映射到哪个 driver / 哪几期 ② 漂移 → thesis/catalyst/PT 是否改 ③ 源是否 verified ④ 叙述怎么写。

**确认后** `cascade_update.py apply {T}`：把 preview 的新值 overlay 进 live registry（FY 按会计季度合计派生）→ **打印下一步命令供主线程执行**（apply 本身不自动跑）：`build_report.py {T} --override` + wiki §5/§6 表回灌 + 版本快照。**收尾必跑** `python src/qc_consistency.py {T}`（确定性，不掺 LLM）：① registry sourcing（schema / 源单一 / 模型恒等式 GP=Rev−COGS·GPM·EPS=NI/Shares / 财年=Σ季度）② 结果比对（报告引用的 registry 数字出现在 **docx**（必有）+ charts + wiki；md/pptx/xlsx 在 docx-only 模式不产出即跳过，不算 FAIL）。全 PASS exit 0，任一 FAIL exit 1。依赖 `pywin32` + 本机 Excel。

---

## 各道门（质量是挡出来的）

| 门 | 位置 | 挡什么 |
|---|---|---|
| **QC gate（18）** | B 出口 | 14 段完整 / §6 有数据 / model-vs-ER 新鲜度 / §5.3 有 driver |
| **黑话门**（`report_qc.py`） | C 渲染前 | 内部机制词（级联 / registry / `{REG:}` / 原始 ID / 分级标签）泄漏进交付物 → 拒渲 |
| **图↔registry / 缺 key 门** | C 渲染前 | 图表与 registry 不同源 / 占位符找不到 → FAIL |
| **漂移 + miss-guide 闸** | D | >5% 漂移 / model 跌破指引 → 停 raise |
| **一致性 QC**（`qc_consistency.py`） | D 收尾 | 报告引用的 registry 数字 vs docx（+ 存在的 md/pptx/xlsx）+ charts + wiki 对不上 → exit 1 |
| **回归网**（`tests/test_regression.py`） | 全局 | 每个修过的 bug 钉成断言（boundary / 财历 / label scan / NPM 口径 / 驱动单位 / 级联一致性…） |

---

## 文件清单（`src/`）

```
build_wiki.py        # ① 主入口（确定性数字主链单命令编排：digest→guide→synthesize→registry→render→qc）
fiscal_calendar.py   # 财历：FY季↔日历日期 + ER pack 自动推导 fy_end/latest_actual
model_digest.py      # A：6-step model 理解
model_reader.py      # 财务指标提取 + revenue build-up 溯源 + 公式链追踪
trace.py             # 公式链溯源（递归 depth=6）
resolve.py           # 三重校验寻址（label + sheet + 期列）
guide_seeker.py      # ER/EC guidance 抽取（forward guide + actuals）
parse_capiq.py       # CapIQ KeyStats xlsx → consensus multiples + quarterly actuals
clean_sources.py     # Phase 0 预处理：ER 行级剥离、Banker PDF disclosure 剥离
extract.py           # Phase 1 机械提取：PDF 文本/表格 + Excel 数据（空格对齐表交给 LLM 解析）
news_aggregator.py   # WebSearch 新闻 + 落盘 + 分桶
reader_prompt.py     # Phase 1/2 reader dispatch prompt builder：机械注入表格读取契约
synthesize.py        # digest + guide + capiq + _facts.json → _interpreted_data（纯数字 + metadata + brokers）
registry.py          # 数据注册表（T1-T4）+ §5.3 KPI driver 注入
render.py            # 14 段渲染：数字表从 registry，叙述段拼 _sections/*.md
qc_gate.py           # B 出口 QC（含 model vs ER 离线新鲜度）
report_charts.py     # C：registry → 3 张研报图，喂 vendored gs-research-chart
report_render.py     # C：自动跑 charts → 数字门 → 占位符解析 → 黑话门 → banker Word 渲染
report_qc.py         # C：黑话门
report_export.py     # C：resolved contract → MD + Excel + PPT
build_report.py      # C：版本管理 + git 版本控制 + docx 导出（md/xlsx/pptx 导出器保留但默认关闭）
cascade_update.py    # D：反向级联（Path A/B + COM 重算 + 漂移闸 + miss-guide）
qc_consistency.py    # D 收尾一致性 QC（registry sourcing + 结果比对）

references/reader_contract.md     # 表格读取契约 SSOT（reader_prompt.py 注入）
references/question_pool_lite.md  # C：M1-M9 精简 question pool
vendor/banker-report-creator/     # 剥离进项目：Word 渲染器
vendor/gs-research-chart/         # 剥离进项目：研报图表库
```

**自洽可跑**：模块 C 不依赖 `~/.claude/skills`（`report_render` 优先用 `vendor/`）。外部仅需 node + npm `docx` + python `matplotlib/pandas/Pillow/openpyxl/pdfplumber/pywin32`。

---

## 怎么跑

```bash
# ① 建 wiki（前置：input_pack/{T}/ 有素材包）
python src/build_wiki.py {T} --wiki-dir {materials_dir}    # 6 步全确定性；LLM 叙述/_facts 由主线程并行 sub-agent 产出

# ② 出报告 / 改一版 / 回滚（前置：① 跑过，有 _data_registry.json + {T}.md）
python src/build_report.py {T} --note "..."                # 增量出新版本（docx + git tag）
python src/build_report.py {T} --rollback vX               # 回滚

# ③ 级联更新（前置：② 出过版本 + 有 model.xlsx）
python src/cascade_update.py drivers {T} --model PATH      # Path B：LLM 选驱动
python src/cascade_update.py set {T} --model PATH --sheet "..." --row N --set 27Q2=0.85 --reason "..."
python src/cascade_update.py apply {T}                     # 确认后 overlay + 级联下游

# 回归网
python tests/test_regression.py
```

**示例资产**：`assets/NVDA/` + `assets/SNDK/`（实跑出的 wiki.md + registry.json，gold-standard 样板 + 测试 fixture；拷回 `output/{T}/` 即可直接跑 ② / ③）。NVDA fy_end=1 / SNDK fy_end=6，覆盖财历边界两种情况。

---

## 关键约束

1. **数值原子性**：数字只从 PDF/Excel/API 提取，LLM 不生成数字；提取失败标 `—` + `[待补]`。
2. **Model 地址用 label 不用行列号**：三重校验（label + sheet + 期列），改行序不错位。
3. **PDF 只出文本**：`pdfplumber`，表格由 Claude 解析（禁止 Read tool 读 PDF）。
4. **§6 口径统一**：同一表内不混 GAAP / Non-GAAP，标注口径。
5. **CapIQ 为 consensus**：CapIQ 作市场共识，model 作 internal estimate。
6. **表格读取契约**：dispatch 解析空格对齐财务表的 sub-agent 前，必须 `python src/reader_prompt.py {ER|Banker|Conf|raw} {T}` 机械注入契约（SSOT `references/reader_contract.md`）——表头锚定取值、禁按位置取数、禁混口径、列归属存疑即标 `⚠️` 不猜。
7. **UTF-8 强制**：env `PYTHONIOENCODING=utf-8 PYTHONUTF8=1`。

---

*Finance Cowork skill technical spec*
*端到端实测：SNDK ~15min / ~500K tokens（3 Sonnet + 1 Opus，42 份素材）· Model Digest 验证 5/6 通过（SNDK/KO/AAPL/AVGO/NVDA）*
