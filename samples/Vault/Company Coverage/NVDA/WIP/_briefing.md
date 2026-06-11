# NVDA Wiki Briefing

> **用途**: 本文件是给 Layer 2 Sonnet agent 的指令文档。你需要按下面指定的段落、素材范围和质量标准撰写 wiki section。数字必须标来源。

---

## 核心论点 (一句话)

NVDA 是 AI 基础设施唯一的全栈平台提供商 (GPU + CPU + LPU + networking + storage)，DC 营收从 FY25Q2 $26.3B 飙升至 FY27Q1 $75.2B（+92% YoY），但 mid-70s GM 天花板已被管理层明确封顶，真正的 swing factor 在于：(1) custom ASIC 替代速度 (Citi 模型 90%→81% by CY28)，(2) Vera CPU $200B 新 TAM 能否兑现，(3) agentic AI token 需求能否维持指数级增长。

---

## 研究主线 (bull vs bear 核心张力)

### Bull 核心

NVDA 拥有三重增长飞轮：(a) 加速计算替代通用计算——$1T 存量 CPU 基础设施向 GPU 迁移仍处早期；(b) generative AI → agentic AI 第三次 platform shift，管理层称 token 生成量将 50x 增长（← CES Jan 2026, Citi_30394336）；(c) Vera CPU 打开全新 $200B standalone CPU TAM（← FY27Q1 EC, $20B FY27 guidance）。$1T+ Blackwell/Rubin DC 收入 floor（CY2025-2027, excludes CPU/LPX）是 purchase-order-backed 的可见性（← GTC Mar 2026, Citi_30413829）。Rubin 已 full production（← Computex Jun 2026, Citi_30434725），execution risk 大幅降低。50%+ FCF 返还承诺 + $80B buyback + 25x 分红增长提供下行支撑。

### Bear 核心

Custom ASIC 正以 94% CAGR 增长（vs merchant GPU 30%），Google TPU 8t/8i 性能 4x 提升（← news Apr 2026），Amazon Trainium 持续扩展外部客户。Meta 正谈判 2027 年使用 Google TPU（← Citi_30387538）。Top 2 客户集中度从 FY25 的 12%/11% 升至 FY27Q1 的 21%/17%（← 10-Q, Citi_30432744）。中国市场结构性收缩至仅 6% 收入（← 10-Q FY27Q1）。GM 被管理层明确封顶在 mid-70s（← FY26Q4 EC callback, Citi_30408748: "cautioned investors not to model GM above mid-70s"）。

### 核心张力

市场定价的关键变量不是"NVDA 能否继续增长"（短期增长几乎确定），而是"增长的质量和持续性"——具体而言：(1) 当 hyperscaler CapEx 增速从 ~100% 放缓时，NVDA 的 ACIE（AI Cloud/Industrial/Enterprise）第二增长曲线能否接力？(2) Vera CPU 是增量 TAM 还是会挤占 GPU ASP？(3) Rubin transition 期间 GM 能否守住 mid-70s？FY26Q1 H20 charge 曾一次性将 GM 砸到 61%——architecture transition 期的 GM volatility 是已被验证的风险。

---

## 各段目标 + 素材分配

### §1 投资论点 (s1_thesis.md)

- **目标问题**:
  1. Top 5 bull points 是什么？每条在哪几季得到验证/被挑战？
  2. Top 5 bear points 是什么？每条的 severity 和 timeline？
  3. Bull/bear 哪个方向的证据在最近 2 季加强了？

- **读什么素材**:
  - ER extract → `cross_quarter_themes` (8 个主题) + `guidance_trajectory` (revenue + GM guidance 序列)
  - Banker extract → `citi_key_themes` (8 个主题) + `bull_bear_from_citi`
  - News → `analyst` bucket (downgrade + Citi maintain)

- **质量标准**:
  - 每条 bull/bear 2-3 句
  - 含具体数字 + 季度验证状态: ✅ 已验证 / 🟡 进行中 / ⚠️ 面临挑战
  - 每条标 source (← ER FY27Q1 / ← Citi 30432569 / ← news)
  - Bull 和 Bear 各不少于 5 条

- **关键数字 (从 ER extract 直接搬运, 不允许 LLM 换算)**:
  - DC revenue trajectory: $26.3B → $30.8B → $35.6B → $39.1B → $41.1B → $51.2B → $62.3B → $75.2B (FY25Q2-FY27Q1, ← ER)
  - Non-GAAP GM trajectory: 75.7% → 75.0% → 73.5% → 61.0%(H20 charge) → 72.7% → 73.6% → 75.2% → 75.0% (FY25Q2-FY27Q1, ← ER)
  - Revenue guidance sequence: $32.5B → $37.5B → $43.0B → $45.0B → $54.0B → $65.0B → $78.0B → $91.0B (← ER guidance_trajectory)
  - Citi TP: $270 → $300 (Feb 2026), current Buy/$300 (← Banker aggregate)
  - Citi FY29E revenue debut: $566B (← Citi_30408799)
  - C2025-C2028 revenue CAGR: 35% (← Citi_30408799)

### §2 关键指引 (s2_guidance.md)

- **目标问题**:
  1. 过去 8 季 revenue guidance vs actual 的 beat/miss pattern？
  2. GM guidance 的走势如何反映 architecture transition cycle？
  3. Forward guidance (FY27Q2: $91B) 的隐含增长率和关键假设？
  4. Opex 增长指引 (upper 40s YoY) 是否可持续？

- **读什么素材**:
  - Guide seeker → `metric_matrix` (revenue/guide_revenue/guide_gross_margin 逐季) + 每季 `guidance_raw`
  - ER extract → `guidance_trajectory` (完整 8 季 sequence)
  - ER extract → `next_q_guidance` per quarter (含 China/H20 caveats)

- **质量标准**:
  - 历史 guide vs actual 对比表 (8 季), 格式:

    | Quarter | Guide Rev ($B) | Actual Rev ($B) | Beat ($B) | Guide GM% | Actual GM% |
    |---------|---------------|-----------------|-----------|-----------|------------|

  - Forward guide + FY full-year GM target (mid-70s)
  - 注明 guidance 中的 China caveat 变化 (FY26Q1 起 "H20 revenue loss", FY26Q2 起 "no H20 assumed", FY26Q4 起 "no DC compute from China")
  - Non-GAAP accounting policy change: SBC included from FY27Q1

- **关键数字 (guide_seeker metric_matrix 直接搬运)**:
  - guide_revenue: 32.5 → 37.5 → 43.0 → 45.0 → 54.0 → 65.0 → 78.0 → 91.0 (← guide_seeker)
  - actual revenue: 30040 → 35082 → 39331 → 44062 → 46743 → 57006 → 68127 → 81615 ($M, ← guide_seeker/ER)
  - guide_gross_margin (non-GAAP): 75.0 → 73.5 → 71.0 → 72.0 → 73.5 → 75.0 → 75.0 → 75.0 (← guide_seeker)

### §2B EC Q&A (s2b_ec_qa.md)

- **目标问题**:
  1. 管理层对 agentic AI demand 的具体表述 (verbatim quotes)?
  2. Jensen 对 custom ASIC 竞争的回应原话？
  3. Colette 对 GM durability 的表述？
  4. 管理层对 Vera CPU TAM 的阐述？
  5. 管理层对 "compute = revenues" 的论证逻辑？

- **读什么素材**:
  - `_ALL_EC_SUMMARIES.md` — 重点读 FY26Q3 (line ~2100-2280), FY26Q4 (line ~2280-2500), FY27Q1 (line ~2505-2741)
  - 对于 FY26Q4: Jensen 的 "compute equals revenues" speech, Colette 的 "single most important lever of our gross margins is actually delivering generational leads"
  - 对于 FY27Q1: Jensen 的 "Demand has gone parabolic", segmentation rationale, Vera CPU $20B/$200B TAM, LPX niche positioning, 5 things that make NVIDIA special

- **质量标准**:
  - 每条 verbatim quote 标明 speaker + quarter
  - 每季提取 3-5 个关键管理层表述
  - 重点摘录 Jensen 对竞争格局的 5 points defense (← FY26Q3 EC: every phase of acceleration, every phase of AI, every model, every cloud, offtake diversity)
  - 标明 Jensen 对 LPX 的 niche 定位: "not broad... niche product for some time" (← FY27Q1 EC)

### §3 业务结构 (s3_business.md)

- **目标问题**:
  1. **终端市场**: DC 内部结构 (Hyperscale ~50% vs ACIE ~50%) 如何演变？FY27Q1 新报告分部意味着什么？
  2. **技术路线**: Hopper → Blackwell → Blackwell Ultra → Vera Rubin 的 timeline 和 revenue 贡献？
  3. **竞争格局**: GPU vs custom ASIC 的动态? NVDA 的 5 层防御逻辑?
  4. **产业链**: Networking inflection (从 $3.7B 到 $14.8B) 的驱动因素？NVLink compute fabric 的战略意义？

- **读什么素材**:
  - Banker extract → `citi_key_themes` (竞争, ASIC share, networking) + `peer_mentions` (全部 14 peers)
  - ER extract → `cross_quarter_themes` ("Networking inflection", "Segment mix shift", "Data Center dominance")
  - ER extract → `segment_revenue` per quarter (DC/Gaming/ProViz/Auto/OEM 到 FY26Q4; DC/Edge from FY27Q1)
  - EC summaries → FY26Q3 Jensen's "5 things that make us special"; FY27Q1 segmentation rationale

- **质量标准**:
  - 每子段 2-3 句
  - DC 内部拆解表:

    | Quarter | DC Compute ($B) | DC Networking ($B) | Networking YoY |
    |---------|----------------|-------------------|----------------|
    | FY26Q1  | ~34.1          | ~5.0              | +56%           |
    | FY26Q2  | ~33.8          | ~7.3              | +98%           |
    | FY26Q3  | ~43.0          | ~8.2              | +162%          |
    | FY26Q4  | ~51.3          | ~11.0             | +263%          |
    | FY27Q1  | ~60.4          | ~14.8             | +199%          |

  - 竞争格局需含 Citi 的 GPU/ASIC TAM 框架: merchant GPU $454B vs ASIC $150B by C2028E (← Citi_30429659)
  - 提及 Google TPU 8t/8i 4x 性能提升 (← news Apr 2026)
  - Segment restructure 从 5 segment 到 2 market platform (Data Center + Edge Computing) in FY27Q1

### §8 催化剂 (s8_catalyst.md)

- **目标问题**:
  1. 未来 6 个月 (Jun-Dec 2026) 的关键事件/催化剂？
  2. 产品 milestone (Vera Rubin production shipments Q3 FY27)?
  3. 监管风险事件？
  4. 竞争事件？

- **读什么素材**:
  - News → `regulatory` + `competitive` + `company_announcement`
  - ER extract → FY27Q1 `next_q_guidance` + `mgmt_highlights`
  - Banker extract → `catalysts_mentioned` (across all 20 reports)

- **质量标准**:
  - 日期 + 事件 + 影响方向 (positive/negative/neutral) 表格

    | 时间 | 事件 | 来源 | 影响 |
    |------|------|------|------|

  - 至少 10 个催化剂
  - 关键催化剂 (必须包含):
    - FY27Q2 earnings (Aug 26, 2026) — $91B guide vs actual (← ER FY27Q1)
    - Vera Rubin production shipments commence Q3 FY27 (~Oct 2026) (← Citi_30432569, ER FY27Q1)
    - 参议员 Warren AI 出口管制听证 (Jun 2026) — Jensen 拒绝出席 (← news)
    - 美商务部新规: 中国实体全球范围出口许可 (← news Jun 2026)
    - Google TPU 8t/8i 竞争 (← news Apr 2026)
    - OpenAI investment finalization (← Citi_30408748: "close to being done")
    - Hyperscaler CY2026 CapEx approaching $700B→$1T by 2027 (← FY26Q4 EC, FY27Q1 EC)
    - Computex 2026 Vera CPU full production confirmed (← Citi_30434725)
    - RTX Spark ARM-based AI PC launch (← Citi_30434725)
    - 50%+ FCF return commitment + $80B buyback (← Citi_30435141, ER FY27Q1)

### §10 近期要点 (s10_news.md)

- **读什么素材**:
  - `news/_news_aggregated.json` (全部 10 条, 已按 4 桶分类)

- **质量标准**:
  - 4 桶分类: company_announcement / regulatory / competitive / analyst
  - 每条标日期 + 来源 (SEC/CNBC/Yahoo Finance/Citi/etc.)
  - 中文概述, 每条 1-2 句
  - Regulatory 桶需特别标注:
    - H20 $4.5B charge (Apr 2025) — 已发生, 影响已消化 (← ER FY26Q1)
    - 新规: 中国实体全球范围出口许可 (Jun 2026) — ongoing risk
    - Warren 听证邀请 (Jun 2026) — Jensen 拒绝, 政治风险信号

### §13 Peers (s13_peers.md)

- **读什么素材**:
  - Banker extract → `peer_mentions` (14 companies)

- **质量标准**:
  - 列表 + 简短 context (每 peer 2-3 句)
  - 按竞争关系分类:
    - **直接竞争 (custom ASIC)**: Google/Alphabet (TPU), Amazon/AWS (Trainium), Meta (MTIA delayed), Microsoft (Maia delayed)
    - **GPU 竞争**: AMD (MI300X, won OpenAI contracts)
    - **战略投资/合作**: Intel ($5B equity), Groq ($20B licensing deal), Anthropic ($10B investment), OpenAI (investment pending)
    - **供应链/生态**: Broadcom (AVGO, networking attach), Lumentum (LITE, CPO), Corning (GLW, optical), IonQ (INFQ, quantum)
  - 注明 AMD 的竞争维度: "AMD cited as winning OpenAI GPU contracts" (← Citi_30429659)

---

## 数据源优先级 (给 Sonnet agent 的交叉验证规则)

```
T1 ER filing (最高优先级) — 季度财务数字以此为准
   文件: _er_extract.json
   
T2 Model map (digest) — 模型结构和 key assumptions
   文件: NVDA_model_map.json
   
T3 Banker (Citi Research) — 分析师观点、估值、竞争框架
   文件: _banker_extract.json
   doc_id 格式: Citi_30XXXXXX
   
T4 News — 近期事件, 最低优先级, 定性为主
   文件: _news_aggregated.json

T5 EC Summaries — 管理层原话, verbatim quotes
   文件: _ALL_EC_SUMMARIES.md
   
交叉验证规则:
- 财务数字: T1 > T3 > T4 (若冲突, 以 T1 为准)
- 竞争分析: T3 + T5 交叉验证
- 管理层表述: T5 为准 (verbatim), T1 补充 highlights
- forward estimates: T3 (Citi) 标明为 sell-side estimate
```

---

## Appendix: 关键财务轨迹速查 (from ER extract, $M unless noted)

| Quarter | Total Rev | DC Rev | Non-GAAP GM | Non-GAAP EPS | Revenue Guide (next Q) |
|---------|-----------|--------|-------------|--------------|----------------------|
| FY25Q2  | 30,040    | 26,272 | 75.7%       | $0.68        | $32.5B ±2%           |
| FY25Q3  | 35,082    | 30,771 | 75.0%       | $0.81        | $37.5B ±2%           |
| FY25Q4  | 39,331    | 35,580 | 73.5%       | $0.89        | $43.0B ±2%           |
| FY26Q1  | 44,062    | 39,112 | 61.0%*      | $0.81*       | $45.0B ±2% (H20 loss)|
| FY26Q2  | 46,743    | 41,096 | 72.7%       | $1.05        | $54.0B ±2%           |
| FY26Q3  | 57,006    | 51,215 | 73.6%       | $1.30        | $65.0B ±2%           |
| FY26Q4  | 68,127    | 62,314 | 75.2%       | $1.62        | $78.0B ±2%           |
| FY27Q1  | 81,615    | 75,246 | 75.0%       | $1.87†       | $91.0B ±2%           |

*FY26Q1: $4.5B H20 charge depressed GM; ex-charge GM = 71.3%, EPS = $0.96 (← ER FY26Q1)
†FY27Q1: Non-GAAP now includes SBC (new policy from FY27Q1); GAAP EPS $2.39 inflated by $15.9B equity gains (← ER FY27Q1)

---

## Appendix: Citi Estimates Snapshot (← Citi_30429659, Citi_30432569)

| Metric | Value | Source |
|--------|-------|--------|
| FY27E EPS (incl SBC) | $8.02 | Citi_30408799 |
| FY28E EPS (incl SBC) | $10.20 | Citi_30408799 |
| FY29E Revenue | $566B | Citi_30408799 |
| C2025-C2028 Rev CAGR | 35% | Citi_30408799 |
| Vera CPU FY27 sales | $20B | Citi_30432569, ER FY27Q1 EC |
| CPU TAM 2030E | $200B | Citi_30432569, ER FY27Q1 EC |
| Merchant GPU C2028E | $454B | Citi_30429659 |
| Custom ASIC C2028E | $150B | Citi_30429659 |
| Combined Accel TAM C2028E | $603B | Citi_30429659 |
| DC cumulative sales CY25-27 | $1T+ floor | Citi_30413829 |
| TP | $300 (Buy) | Citi, current |
| Valuation basis | 28x FY28 EPS | Citi_30429659 |

---

*Generated by Layer 1 Opus orchestrator, 2026-06-11*
*Sources: 8 quarters ER (FY25Q2-FY27Q1), 20 Citi reports, guide_seeker, model_map, 10 news items, 8 EC transcripts*
