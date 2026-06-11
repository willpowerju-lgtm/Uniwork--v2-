---
type: wiki
kind: coverage
ticker: "NVDA"
name: "NVIDIA Corporation"
aliases: ["NVDA", "英伟达", "Nvidia"]
exchange: "NASDAQ"
sector: "Semiconductors"
updated: 2026-06-11
status: active
cssclasses: [holdings]
---

# NVDA

## 投资论点 (Key Thesis)

> **核心命题**: NVDA 是 AI 基础设施唯一的全栈平台提供商 (GPU + CPU + LPU + networking + storage)，DC 营收从 FY25Q2 $26.3B 飙升至 FY27Q1 $75.2B (+92% YoY)。真正的 swing factor 在于：custom ASIC 替代速度、Vera CPU $200B 新 TAM 能否兑现、agentic AI token 需求能否维持指数级增长。

---

### Bull Case (Our View)

**1. 加速计算替代通用计算——$1T+ DC 收入能见度有 PO 支撑 ✅**

NVDA 的 Data Center 营收在 8 季内从 $26.3B (FY25Q2) 跃升至 $75.2B (FY27Q1)，YoY 增速从 154% 降至 56% 后重新加速至 92%，全年 FY26 DC 营收达 $193.7B（+68% YoY）。GTC Mar 2026 上，管理层披露 Blackwell + Rubin 系统的采购订单支撑收入至少 $1T+（通过 CY2027 end，不含 Groq/CPU/Rubin Ultra）——这不是预测而是已有 PO 的下限。FY27Q1 10-Q 显示供应承诺总额达 $119B（QoQ +27%，其中 $95B 在 FY2027E 内到期），原材料库存 QoQ +96%，是管理层主动为 Rubin 量产预置的信号。← ER FY27Q1, Citi_30413829, Citi_30432744

**2. Agentic AI 第三次 platform shift——token 需求将 50x 增长 🟡**

管理层在 CES Jan 2026 首次明确表述：agentic AI 与 reasoning AI 组合将驱动 token 生成量 50x 增长（vs 单纯 reasoning 的 5x），使 2026-2027 需求周期远大于初代生成式 AI 浪潮。FY27Q1 EC，管理层将 Data Center 内部客户结构重新分组为"Hyperscale ~50%"与"AI Clouds + Industrial + Enterprise ~50%"，标志着收入来源多元化正在加深——inference 与 enterprise AI 的增量需求开始承担和 hyperscaler 同等的营收权重。2026 年已出现 AWS AgentCore 情境记忆、Google Nested Learning 等结构性需求信号（← Citi_30389978, Citi_30394336）。← ER FY27Q1, Citi_30394336

**3. Vera CPU 打开全新 $200B standalone CPU TAM ✅**

FY27Q1 EC 首次给出具体指引：FY2027 年 Vera CPU 销售额 $20B（客户含 Meta、Microsoft，Citi 推断），并将 2030 年 standalone CPU TAM 定为 $200B——这是完全独立于 $1T+ GPU/Networking DC 管线之外的增量市场。Computex Jun 2026 确认 Vera CPU 进入全面量产，CPU-GPU 配比从历史 1:2 升至接近 1:1，意味着每套系统的 CPU ASP 贡献翻倍。Anthropic 和 OpenAI 已作为早期采用者部署 256-CPU 独立机架，3x SQL / 6x 数据处理性能优于 AMD/Intel X86（← Citi_30434725）。← ER FY27Q1 EC, Citi_30432569, Citi_30434725

**4. Rubin 已进入全面量产——执行风险消除 ✅**

Computex Jun 2026 正式确认 Vera Rubin 进入 full production，比 Blackwell 的"芯片→服务器"制造难度更低（沿用 NVL 框架），Citi 认为供应链执行风险较 Blackwell 时期大幅下降。NVL72 平台 agent 吞吐量 10x vs Blackwell，Groq 3 LPX 整合后总吞吐提升 35x，Spectrum-6 网络和 BlueField-4 存储协同构成最具成本效益的全栈推理方案。Production shipments 预计 FY27Q3（~Oct 2026）开始，Q4 放量。FY27Q1 原材料库存 +96% QoQ 是管理层预置供应链的领先指标（← Citi_30432744, Citi_30434725）。← Citi_30432569, Citi_30434725

**5. 50%+ FCF 返还承诺 + 资本结构支撑下行 ✅**

FY27Q1，NVIDIA 宣布新增 $80B 回购授权，季度分红从 $0.01 提升至 $0.25（+2,400%），单季股东回报达 ~$20B（历史最高）。Computex Day 2 进一步确认：50%+ FCF 返还承诺不只限于 FY2027，而是延伸至后续年度——这是 NVDA 历史上首次明确的多年资本回报承诺，体现管理层对持续盈利能力的强烈信心。以 Citi FY28E EPS $10.20 计，当前估值对应 28x FY28 EPS（← Citi_30429659 估值调整）。← ER FY27Q1, Citi_30432473, Citi_30435141

---

### Bear Case / 空头逻辑

**1. Custom ASIC 以 94% CAGR 增长——替代速度可能快于共识预期 ⚠️**

Citi 模型显示定制 ASIC 市场 C2025-C2028E CAGR 为 94%（vs 商用 GPU 30%），绝对规模从小基数增长至 $150B（C2028E），而商用 GPU TAM 为 $454B。Google TPU 8t/8i（Cloud Next Apr 2026）训练+推理性能 4x 提升，且 Google 已开始向外部客户销售 TPU 硬件。Amazon Trainium 持续拓展外部客户。Meta 据报正在谈判 2027 年使用 Google TPU，微软 Maia 虽有延迟但研发未中止（← Citi_30387538, news Apr 2026）。若 NVIDIA 的"CUDA 护城河"在定制化场景中无法复制，从 90% 降至 81% 的 merchant GPU 份额可能是乐观估计。← Citi_30387538, Citi_30429659

**2. GM 天花板已被管理层明确封顶在 mid-70s，无上行空间 ⚠️**

FY26Q4 EC 管理层 callback 中明确警告投资者不要将 GM 建模于 mid-70s 以上（← Citi_30408748: "cautioned investors not to model GM above mid-70s"）。HBM/CoWoS 内存价格持续上行，Rubin 产品组合切换期间 GM 存在波动风险——Blackwell 过渡期（FY25Q4-FY26Q2）GM 从 75.7% 降至 73.5%，FY26Q1 H20 charge 更将 GM 压至 61.0%（← ER FY26Q1）。Non-GAAP accounting 政策从 FY27Q1 起将 SBC 纳入（FY27Q1 opex non-GAAP 含 $1.9B SBC），进一步压缩可比口径 GM，投资者可能低估了长期 GM 天花板对 FCF 复合增长的约束。← ER FY26Q1, Citi_30408748

**3. 客户集中度上升——Top 2 客户占 FY27Q1 营收 38% ⚠️**

10-Q 数据显示，Compute & Networking 板块 Top 2 客户占比从 FY26Q1 的 16%/14% 上升至 FY27Q1 的 21%/17%，单季度绝对金额极大（约 $17B + $14B）。任何单一超大规模客户若转向自研芯片或减少订购量，将对季度营收产生超预期影响。FY25Q3 就曾出现四个 10%+ 客户合计占比 61% 的极端集中（← Citi_30386545）。2024 年 Meta 谈判使用 Google TPU、Microsoft Maia 延迟但不取消，说明这一风险在未来 1-2 年内将持续存在。← 10-Q FY27Q1, Citi_30432744

**4. 中国市场结构性收缩至 6%——$4.5B 损失已成常态 ⚠️**

FY26Q1 H20 charge $4.5B 将 non-GAAP GM 从 ~71% 压至 61.0%，且额外 $2.5B H20 营收无法出货。此后 FY26Q2-Q4 H20 销售微乎其微，FY27Q1 China/HK 收入占比仅 6%（vs FY25 的约 26%）。美商务部 Jun 2026 新规进一步将出口管制延伸至中国实体全球子公司，实质上永久封堵了通过非中国实体绕行的可能性。中国仍是全球最大 AI 投资市场之一，NVDA 永久性缺席该市场意味着需要美国/欧洲/主权 AI 来弥补约 $25-30B 的年化缺口。← ER FY26Q1, 10-Q FY27Q1, news Jun 2026

**5. 估值拥挤 + 分析师下调信号——回调风险已被部分机构关注 🟡**

FY27Q1 业绩后次日（May 22），有分析师以"估值风险+持仓拥挤"为由下调 NVDA（← news MarketBeat 2026-05-22），即便基本面仍强。Citi 本身在 May 2026 preview 中已将估值倍数从 30x FY28 EPS 压缩至 28x（← Citi_30429659），体现市场对高增长持续性的隐性折价。若 FY27Q2 $91B 指引未能大幅超预期，市场可能出现"buy the rumor, sell the news"的技术性调整，尤其是在 Rubin 切换期 GM 可能再度低于 75% 的背景下。← news, Citi_30429659

---

### Tail Risk

| 场景 | 概率 | 影响 | 监控信号 |
| ---- | ---- | ---- | -------- |
| Hyperscaler CapEx 急刹车（DeepSeek 类事件重演） | 低 (<10%) | 极高——DC 营收 YoY 增速腰斩，GM 受架构切换双重打压 | AWS/Azure/GCP CapEx guidance 下修 >15%；GPU 二手市场价格崩溃 |
| Custom ASIC 提前超越 Citi 81% C2028E 预测 | 中 (~20%) | 中高——merchant GPU 市场份额压缩至 <75%，ASP 承压 | Google/Amazon 对外 ASIC 销售披露；Meta 正式使用 Google TPU 的官方声明 |
| Rubin 量产执行延误（类似早期 Blackwell delay） | 低中 (~15%) | 中——FY27Q3-Q4 营收 miss，GM 在过渡期低于 mid-70s | TSMC CoWoS-S 产能报道；HBM4 良率报告；NVDA inventory 异常积累 |

---

### 近期股价 Driver 复盘

**YTD 2026 驱动因子表**

| 时间段 | 驱动因素 | 方向 | 内/外因 | 论点意义 | 状态 |
| ------ | -------- | ---- | ------- | -------- | ---- |
| Jan 2026 / CES | Jensen 宣布 Vera Rubin 6 款新芯片 + agentic AI 50x token 需求 + Groq CES 细节 | 正 | 内因 | 确认 bull case 第三 platform shift | ✅ 验证 |
| Feb 2026 / FY26Q4 earnings | 营收 $68.1B beat, Q1 guide $78B 大幅超预期 ($73B Street)；Citi TP $270→$300 | 正 | 内因 | 超预期幅度创近 4 季最大；GM 75.2% 超预期 | ✅ 验证 |
| Mar 2026 / GTC | $1T+ DC PO-backed floor 确认；Jensen "compute = revenues"逻辑；CPU TAM 首披露 | 正 | 内因 | 长期能见度大幅改善，股价从 $181 反弹 | ✅ 验证 |
| Apr 2026 / Google Cloud Next | Google TPU 8t/8i 4x 性能提升；竞争担忧升温；Citi 估值倍数从 30x 压缩至 28x | 负 | 外因 | ASIC bear case 证据加强；短期情绪承压 | ⚠️ 挑战 |
| May 2026 / FY27Q1 earnings | 营收 $81.6B, Q2 guide $91B（再次大幅超预期）；$80B 回购 + 分红 2400% 提升 | 正 | 内因 | Rubin 前最后一个"纯 Blackwell"季度，bull 基本面完胜 | ✅ 验证 |
| Jun 2026 / Computex | Rubin full production 确认；Vera CPU $20B FY27 指引；出口管制新规 + Warren 听证 | 正/负混合 | 内/外 | Rubin 执行风险消除（bull）vs 监管阴影再起（bear） | 🟡 进行中 |

**当前定价分析**（截至 2026-06-11，参考 Citi 最近报告股价 ~$224）

压制因素（市场正在 discount 的风险）:
- 出口管制升级：美商务部全球范围出口许可新规，中国 6% 营收占比存在进一步下行风险
- GM 天花板：mid-70s 封顶论点已被市场消化，无 GM 超预期弹性
- 估值倍数压缩：Citi 已从 30x 降至 28x FY28 EPS，反映增长阶段成熟化

支撑因素（市场认可的逻辑）:
- $91B Q2 guide + Rubin full production 确认：近期收入能见度最高
- $1T+ PO-backed DC pipeline：机构资金有"强制持仓"压力
- 50%+ FCF 返还承诺：类似科技版"股息防御"，吸引价值型配置

下一个 re-rating 触发器:
- FY27Q2 earnings (Aug 26)：$91B guide vs actual——如 beat $3B+，Rubin 放量初期数据超预期，可能触发新一轮 TP 上调
- Vera Rubin 首批出货量公告（FY27Q3 开始）：CPU:GPU=1:1 比例能否兑现是 $200B CPU TAM 论点的关键验证节点
- Hyperscaler CY2026 CapEx 更新：若 AWS/Azure/GCP Q2 guidance 维持 $700B+，市场可能重新评估 ASIC 替代速度是否被高估

## 关键指引 (Key Guide)

> 数字来源：guide_seeker metric_matrix + _er_extract.json，单位 $B 除非特别标注。
> 会计政策注意：FY27Q1 起 non-GAAP 含 SBC（← ER FY26Q4 guidance_raw）。

---

### FY27Q1 实际结果 vs FY26Q4 指引

| 指标 | FY26Q4 指引 | FY27Q1 实际 | Beat/Miss | 备注 |
|------|------------|------------|-----------|------|
| Revenue ($B) | $78.0 ±2% | $81.6 | **+$3.6B beat** | 4.6% 高于指引中值 ← ER FY27Q1 |
| Non-GAAP GM% | 75.0% ±50bps | 75.0% | In-line | SBC 已含入新 non-GAAP 政策，实质同步 ← ER FY27Q1 |
| Non-GAAP Opex ($B) | $7.5 | $8.3 (actual GAAP $7.6) | 略高 | 含 SBC $1.9B；新政策下首季 ← ER FY26Q4/FY27Q1 |
| Non-GAAP EPS | 隐含 ~$1.80 | $1.87 | **+beat** | 含 SBC 新政策后的首次可比 EPS ← ER FY27Q1 |
| DC Revenue ($B) | 指引未单独披露 | $75.2 | — | +21% QoQ，+92% YoY ← ER FY27Q1 |

---

### 历史 Guide vs Actual 对比 (8季)

| 季度 | 指引 Revenue ($B) | 实际 Revenue ($B) | Beat ($B) | Beat % | 指引 GM% (non-GAAP) | 实际 GM% (non-GAAP) | GM Beat |
|------|-----------------|-----------------|---------|--------|-------------------|-------------------|---------|
| FY25Q3 | 32.5 | 35.1 | +2.6 | +7.9% | 75.0% | 75.0% | In-line |
| FY25Q4 | 37.5 | 39.3 | +1.8 | +4.9% | 73.5% | 73.5% | In-line |
| FY26Q1 | 43.0 | 44.1 | +1.1 | +2.5% | 71.0% | 61.0%* | **-1000bps miss** |
| FY26Q2 | 45.0 | 46.7 | +1.7 | +3.9% | 72.0% | 72.7% | +70bps beat |
| FY26Q3 | 54.0 | 57.0 | +3.0 | +5.6% | 73.5% | 73.6% | +10bps beat |
| FY26Q4 | 65.0 | 68.1 | +3.1 | +4.8% | 75.0% | 75.2% | +20bps beat |
| FY27Q1 | 78.0 | 81.6 | +3.6 | +4.6% | 75.0% | 75.0% | In-line |
| (next) FY27Q2 | **91.0** | — | — | — | 75.0% | — | — |

*FY26Q1 GM miss 系 H20 出口管制导致 $4.5B 一次性存货减值；ex-charge GM = 71.3% ← ER FY26Q1 special_items

> **规律小结**：连续 7 季 Revenue beat 指引（中值 +$1.1B–+$3.6B，+2.5%–+7.9%）；GM 除 FY26Q1 H20 冲击外基本 in-line 或小幅 beat，管理层对 mid-70s 区间控制较精准。

---

### FY27Q2 管理层指引

| 指标 | 指引值 | 说明 |
|------|--------|------|
| Revenue | $91.0B ±2% | 隐含中值 +11.5% QoQ / +96% YoY ← ER FY27Q1 guidance_raw |
| Non-GAAP GM% | 75.0% ±50bps | 含 SBC（新 non-GAAP 政策） ← ER FY27Q1 |
| GAAP GM% | 74.9% ±50bps | ← ER FY27Q1 |
| Non-GAAP Opex | $8.3B | ← ER FY27Q1 guidance_raw |
| GAAP Opex | ~$8.5B | ← ER FY27Q1 guidance_raw |
| FY27 全年税率 | 16%–18% | 低于前期 17%–19%，因地理收入结构变化 ← ER FY27Q1 |
| China DC compute | 不含任何中国 DC 算力收入 | "not assuming any Data Center compute revenue from China" ← ER FY27Q1 |

---

### FY27 全年指引（定性）

| 项目 | 管理层表述 | 来源 |
|------|-----------|------|
| GM | "still expecting to be in the mid seventies" | ← EC FY27Q1, Colette Kress |
| Opex 增速 | "upper 40% range year over year" | ← EC FY27Q1, Colette Kress（由 R&D 扩张及 AI 工具使用加速驱动） |
| 税率 | 16%–18%（GAAP & non-GAAP） | ← ER FY27Q1 guidance_raw |
| Blackwell+Rubin 累计销售 | "$1 trillion from 2025 through calendar 2027" | ← EC FY27Q1, Colette Kress |
| Vera CPU 全年 | "visibility to nearly $20 billion in total CPU revenue this year" | ← EC FY27Q1, Colette Kress |
| VeraRubin 生产出货 | Q3 FY27 开始（~Oct 2026），Q4 继续量产 | ← EC FY27Q1, Colette Kress |

---

### China Caveat 历史演变

| 季度 | 指引中的 China 措辞 | 含义 |
|------|-------------------|------|
| FY25Q2–FY25Q4 | 无专项说明 | H20 可正常销售 |
| FY26Q1 | "reflects ~$8.0B loss in H20 revenue due to export control" | 4月9日管制令，含 $8B 减收影响 |
| FY26Q2 | "has not assumed any H20 shipments to China" | 明确排除中国 H20 出货 |
| FY26Q3 | "not assuming any data center compute revenue from China" | 扩大为整体 DC 算力 |
| FY26Q4 | "not assuming any Data Center compute revenue from China" | 延续 |
| FY27Q1 | "not assuming any Data Center compute revenue from China" | 延续；注明已获 H200 批准但尚未产生收入 |

---

### Non-GAAP 会计政策变更说明

从 **FY27Q1 起**，NVDA 将 **股权激励（SBC）纳入 non-GAAP 财务指标**（此前 non-GAAP 排除 SBC）。
- FY27Q1 non-GAAP opex（含 SBC）= $8.3B（GAAP $7.6B）
- FY27Q1 non-GAAP EPS = $1.87（含 SBC 约 $1.9B per quarter 影响）
- **跨期对比时需调整**：FY26Q4 之前的 non-GAAP EPS/GM 均不含 SBC，直接对比 FY27Q1+ 存在低估偏差
- ← ER FY26Q4 next_q_guidance note；ER FY27Q1 eps.note

---

### 要点 (管理层关键表述)

1. **"Compute equals revenues."** — Jensen Huang, FY26Q4 EC（对 Vivek Arya 及 Atif Malik 的问题，重复三次）: "In this new world of AI, compute equals revenues. Without compute, there is no way to generate tokens. Without tokens, there is no way to grow revenues." ← EC FY26Q4

2. **GM 天花板已被明确封顶**：Colette Kress, FY26Q3 EC: "input costs are on the rise but we are working to hold gross margins in the mid-seventies." ← EC FY26Q3；FY26Q4 EC: "For the full year, we continue to see gross margins in the mid-70s." ← EC FY26Q4（Citi_30408748 将此表述记为"cautioned investors not to model GM above mid-70s"）

3. **GM 最关键杠杆是产品代际领先**：Colette Kress, FY26Q4 EC: "The single most important lever of our gross margins is actually delivering generational leads to our customers." ← EC FY26Q4

4. **FY27Q2 $91B 指引背后的信心来源**：Colette Kress, FY27Q1 EC: "Giving us full confidence in $1 trillion in Blackwell and Rubin revenue we foresee from 2025 through calendar 2027." ← EC FY27Q1

5. **Opex upper-40s 增速合理性**：管理层解释为 R&D 持续投入 + AI 工具使用加速（AI productivity tools），并非失控扩张，每代 6 芯片的研发强度客观要求高 opex ← EC FY27Q1, Colette Kress

## EC Q&A 关键问答 (Earnings Call Delta)

> 来源：_ALL_EC_SUMMARIES.md，verbatim quotes 标明 speaker + quarter。
> 覆盖 FY26Q3 (2025-11-19)、FY26Q4 (2026-02-25)、FY27Q1 (2026-05-20)。

---

### FY27Q1 (2026-05-20)

- **[Joseph Moore / Morgan Stanley] Q: 为何重新分拆业务段（Hyperscale vs ACIE）？CPU $20B 数字含义？**
  → Jensen Huang: "AI is very diverse… The 20 billion is for standalone CPU. And remember, we have Vera used in 4 ways: VeraRubin system, standalone Vera CPU, Vera with CX9 for storage, and Vera with CX9 for confidential computing." 解释 ACIE 包含 AI natives、企业、sovereign，因需要全栈方案且 offtake 多元；Hyperscale 代表大型公有云。 ← EC FY27Q1

- **[Benjamin Reitzes / Melius] Q: 数据中心业务 ex-China +120% YoY；hyperscaler CapEx 能否持续增长？**
  → Jensen Huang: "We should be growing faster than hyperscale CapEx… Compute is revenues. Compute is profit. And so the world is changing. If you look at the second category — AI native clouds, enterprise, sovereign AI — that is growing incredibly fast. I expect the second category to be larger over time." 强调两个增长引擎并行，ACIE 将最终超越 Hyperscale 总量。 ← EC FY27Q1

- **[Timothy Arcuri / UBS] Q: CPX 和 LPX 的 traction？LPX 是否占 fat-synthesis ~20%？**
  → Jensen Huang（关于 LPX 定位）: "The use case for LPX is not broad. It is, you know, intended for somebody who has a fairly large portfolio of different types of token services… I expect that LPX and other SRAM-based decode-focused, high token rate accelerators will always be a niche product for some time." 明确 LPX 是高端 niche，不会挑战 Blackwell/VeraRubin 的主导地位。 ← EC FY27Q1

- **[Vivek Arya / BofA] Q: Vera CPU 与 GPU 是增量还是蚕食？$20B 是否包含 VeraRubin 捆绑销售？**
  → Jensen Huang: "The $20 billion is for standalone CPU… An agent is essentially a harness… the harness runs on CPU. And the tool use runs on CPUs… In the future, you will have an agent using a PC. The thinking happens on GPUs. The orchestration essentially runs on CPUs." 明确 CPU 与 GPU 协同而非替代，$200B TAM 为净增量 ← EC FY27Q1

- **[James Schneider / Goldman Sachs] Q: $1 trillion 可见度是否包含 Vera CPU？最大上行空间来源？**
  → Jensen Huang: "We did not include any standalone Vera CPU in that number. I expect that to be the second largest incremental source… LPX would be third, because of its SRAM architecture — low latency, high interactivity, but throughput and context processing ability are limited." 说明 $1T 口径保守，Vera CPU 是最大 upside 来源。 ← EC FY27Q1

- **[Jensen 闭幕发言 — "Top 5 Things"（精华表述）]**:
  > "Demand has gone parabolic. The reason is simple. Agentic AI has arrived. AI can now do productive and valuable work. Tokens are now profitable, so model makers are in a race to produce more. In the AI era, compute capacity is revenue, and profits. NVIDIA is the platform of this era."
  — Jensen Huang, 闭幕陈述 ← EC FY27Q1
  
  五项 NVDA 差异化论据：(1) 运行每个 frontier AI model；(2) 在每个 hyperscale 云；(3) 全栈 AI factory 方案覆盖 ACIE/sovereign；(4) CUDA 延伸至 edge/robotics/AI-RAN；(5) Vera — 首款为 agentic AI 构建的 CPU，打开 $200B 新 TAM。 ← EC FY27Q1

---

### FY26Q4 (2026-02-25)

- **[Vivek Arya / BofA] Q: Hyperscaler CapEx $700B，投资者担心无法持续增长——NVDA 是否仍能增长？**
  → Jensen Huang（"compute equals revenues"核心表述）: "In this new world of AI, compute equals revenues. Without compute, there is no way to generate tokens. Without tokens, there is no way to grow revenues. So in this new world of AI, compute equals revenues… I am certain that at this point… the token generation rate is growing exponentially." ← EC FY26Q4

- **[Ben Reitzes / Melius] Q: 中长期 GM 能否维持 mid-70s？Rubin transition 期间会否再现 FY26Q1 那样的 GM 波动？**
  → Colette Kress: "The single most important lever of our gross margins is actually delivering generational leads to our customers. That is the single most important thing. If we could deliver generationally, performance per watt that exceeds dramatically what Moore's Law can do, if we can deliver performance per dollar, dramatically more than the cost of our systems… then can continue to sustain our gross margins." ← EC FY26Q4

- **[Atif Malik / Citi] Q: 随 inference workload 增加，CUDA 的战略重要性？**
  → Jensen Huang: "These agentic systems are spawning off different agents, working with the team, the number of tokens that are being generated is really, really gone exponential… CapEx translates to compute. Compute with the right architecture translates to maximizing revenues, and compute equals revenues. Architecture is incredibly important. It is more than strategic now. It directly affects their earnings. And choosing the right architecture, the one with the best performance per watt, is literally everything." ← EC FY26Q4

- **[Aaron Rakers / Wells Fargo] Q: Vera CPU standalone 战略意义？为何此时进入 CPU 市场？**
  → Jensen Huang: "We made fundamentally different architecture decisions about our CPUs compared to rest of the world CPUs… it is designed to be focused on very high data processing capabilities… Vera was designed to be an excellent CPU for post-training… some of the use cases in the entire pipeline of artificial intelligence includes using a lot of CPUs. When you accelerate the algorithms to the limit, as we have, Amdahl's Law would suggest that you need really, really fast single-threaded CPUs. And that is the reason why we built Grace to be extraordinarily great at single-threaded performance. And Vera is off the charts better than that." ← EC FY26Q4

- **管理层披露：SBC 纳入 non-GAAP（Colette Kress 在 Q1 outlook 段落）**:
  > "Starting this quarter, we will be including stock-based compensation expense in our non-GAAP results. Stock-based compensation is a foundational component of our compensation program to attract and retain world-class talent."
  — Colette Kress ← EC FY26Q4（FY27Q1 outlook 段落）

---

### FY26Q3 (2025-11-19)

- **[Aaron Rakers / Wells Fargo] Q: Jensen 对 custom ASIC 竞争的看法有无变化？**
  → Jensen Huang（竞争格局"Five Things"防御论）: "There are five things that make us special. The first thing: we accelerate every phase of that transition — CPU to GPU accelerated computing, generative AI, agentic AI. Every single phase, we are excellent at. Second: we're excellent at every phase of AI — pre-training, post-training, inference. Third: we're now the only architecture in the world that runs every AI model. Fourth: we're in every cloud — everywhere from cloud to on-prem to robotic systems to edge devices to PCs. Fifth, and probably most important: our offtake is so diverse. It's not about just putting a random ASIC into a data center — where's the offtake coming from? The diversity of capability coming from? NVIDIA has such incredibly good offtake, our ecosystem is so large." ← EC FY26Q3

- **[C.J. Muse / Cantor Fitzgerald] Q: supply 能否在 12–18 个月内追上需求？**
  → Jensen Huang: "The clouds are sold out, and our GPU installed base — both new and previous generations, including Blackwell, Hopper, and Ampere — is fully utilized… the amount of computation necessary, as a result of those three things [pre-training, post-training, inference scaling laws], has gone completely exponential." 重申三大 scaling law 完好，三重 platform shift 同步加速 ← EC FY26Q3

- **[Stacy Rasgon / Bernstein] Q: FY27 GM 最大成本压力是什么？如何对抗？**
  → Colette Kress: "Input costs are on the rise but we are working to hold gross margins in the mid-seventies… Next year, there are input prices that are well known in the industries that we need to work through. And our systems are by no means very easy to work with. There are tremendous amount of components, many different parts of it… we believe if we look at working again on cost improvements, cycle time, and mix, that we will work to try and hold at our gross margins in the mid-seventies." ← EC FY26Q3

- **[Jim Schneider / Goldman Sachs] Q: FY27 推断收益占比走势，以及 Rubin CPX 的市场定位？**
  → Jensen Huang: "CPX is designed for long context type of workload generation… its perf per dollar is excellent… There are three scaling laws that are scaling at the same time. The first scaling law called pre-training continues to be very effective. The second is post-training — scaling exponentially. And then the third is inference. Because of chain of thought, because of reasoning capabilities, AIs are essentially reading, thinking, before it answers. And the amount of computation necessary as a result of those three things has gone completely exponential." ← EC FY26Q3

- **Colette Kress 关于 Blackwell ramp 可见度（prepared remarks）**:
  > "Currently, we have visibility to a half a trillion dollars in Blackwell and Rubin revenue from the start of this year through the end of calendar year 2026."
  — Colette Kress ← EC FY26Q3 prepared remarks（后在 FY27Q1 更新为 $1 trillion CY25–CY27）

## 业务结构备忘 (Other Key Facts)

NVDA 是 AI 基础设施领域唯一的全栈平台提供商，覆盖 GPU 计算、CPU（Vera）、LPU 推理（Groq 3 LPX）、NVLink 高速互联、Spectrum-X 以太网和 BlueField 存储处理的端到端架构。Data Center 营收从 FY25Q2 的 $26.3B 飙升至 FY27Q1 的 $75.2B（+92% YoY），占总营收 92%，且在 FY27Q1 完成报告结构重组：由原来 5 分部（DC/Gaming/ProViz/Auto/OEM）合并为 2 市场平台（Data Center + Edge Computing），DC 内再拆 Hyperscale（~50%，$38B）与 ACIE（AI Clouds/Industrial/Enterprise，~50%，$37B）。

商业模式的护城河构建在三层飞轮上：CUDA 软件生态（Hugging Face 上 150 万 AI 模型全部跑在 CUDA 上 ← FY26Q3 EC）锁定开发者；NVLink 72 全连接域实现 144 GPU 作为单 GPU 运行，切换成本极高；从数据处理到预训练、后训练到推理的全流程覆盖确保"单一架构"投资可用于 AI 的每一阶段。管理层将 NVDA 定位为"每个前沿 AI 模型都跑在上面的唯一平台"（← FY27Q1 EC，Jensen 5 things，thing 1）。

Agentic AI 是 Jensen 反复强调的第三次平台迁移（前两次：GPU 加速计算替代 CPU、生成式 AI 替代传统 ML），管理层预计 token 需求将达到 50x 增长（← CES Jan 2026，Citi_30394336）。在 agentic AI 时代，compute = revenues 是 Jensen 在 FY26Q4 EC 的核心论断，逻辑链：inference 生成 token → token 变现 → 更多 compute 直接转化为更多营收，使 hyperscaler CapEx 扩张具备内生性（← FY26Q4 EC）。

---

### 技术路线

| 代际 | 主要产品 | 状态（截至 2026-06-11） | 关键指标 |
|------|---------|----------------------|---------|
| Hopper | H100 / H200 / H20（出口版） | 成熟期；旧 A100 云端仍满载 | H200 交货 H100 同等推理吞吐量提升 2x；H20 因出口管制已停售至中国 |
| Blackwell | GB200/GB300, NVL72 | 主力放量；FY25Q4 开始商用，FY26Q3 GB300 超过 GB200 成为主力 | NVL72 vs H200：推理性能 10-15x，cost-per-token -10x（← FY26Q3 EC semianalysis benchmark）|
| Blackwell Ultra | GB300 Ultra | FY26Q2 开始 ramp | 2.7x 吞吐量提升 + -60% cost-per-token vs GB200（过去 6 个月，← FY27Q1 EC）|
| Vera Rubin | NVL72 Vera Rubin（7 芯片：Vera CPU + Rubin GPU + NVLink 6 + ConnectX-9 + BlueField-4 + Spectrum-6 + Groq 3 LPX） | FY27Q3 开始量产出货（← FY27Q1 EC；Computex Jun 2026 确认 full production） | vs Blackwell：35x 推理吞吐量，agent throughput 10x（← Citi_30434725）|
| Rubin CPX | 长上下文专用 GPU | 2026 发布，niche | GDDR7 内存，TCO vs HBM 降低 ~3x，专为长上下文推理设计（← Citi_30389978）|
| Vera CPU | 独立 ARM 架构 CPU | FY27 正式出货，$20B 年销售额 guidance | 3x SQL 性能 / 6x 数据处理 vs AMD/Intel X86（← Citi_30434725）；1:1 CPU-GPU ratio（趋近）|

**成本趋势**：Blackwell 复杂系统架构导致 GM 在 FY25Q4-FY26Q1 区间跌至 73.5%-61%（FY26Q1 含 $4.5B H20 减值），FY26Q4 回升至 75.2% 并稳定在 mid-70s。管理层在 FY26Q4 callback 明确告诫投资者不要将 GM 建模于 mid-70s 以上（← Citi_30408748）。Colette Kress 核心逻辑："GM 最重要的杠杆是每代产品向客户交付代际性能领先"（← FY26Q4 EC）。HBM/CoWoS/晶圆是主要成本压力来源，NVDA 通过提前锁定供应链（supply commitments $119B → $145B）对冲。

---

### 成本结构 & 单位经济

NVDA 的 GM 经历了 Hopper 峰值（~78.9% FY25Q1）→ Blackwell 导入期压缩（73.5-61%）→ mid-70s 修复的路径。当前 non-GAAP GM 稳定在 75%，Rubin 过渡期管理层预计维持 mid-70s（← Citi_30408748，FY26Q4 EC）。

| 指标 | FY25Q2 | FY26Q2 | FY26Q4 | FY27Q1 |
|------|--------|--------|--------|--------|
| Total Revenue | $30.0B | $46.7B | $68.1B | $81.6B |
| Non-GAAP GM | 75.7% | 72.7% | 75.2% | 75.0% |
| Non-GAAP Opex | $3.0B | $4.2B | $5.0B | ~$7.5B |
| R&D Budget (年化) | — | — | ~$20B | ~$20B+ |
| FCF | — | — | $35B | $49B |

Opex 增速被管理层指引为 FY27 全年 upper 40s YoY（← FY27Q1 EC），主要驱动：新产品 engineering、compute/infrastructure 成本及 AI 工具（Cursor/Claude Code）使用加速。R&D 预算接近 $20B/年（← FY26Q4 EC），是极端协同设计（extreme codesign）战略的体现。

---

### 竞争格局

**市场份额**

| 领域 | NVDA 估计份额 | 主要竞争者 | 来源 |
|------|------------|----------|------|
| AI 加速器（merchant GPU） | ~90%（C2025E）→ ~81%（C2028E） | Google TPU, Amazon Trainium, Broadcom ASIC | Citi_30387538 |
| AI 训练 | 主导（NVLink 规模效应，唯一 MoE 优化平台） | Google TPU 8（训练性能提升 4x） | news Apr 2026，ER FY26Q3 |
| AI 推理 | 快速扩张；被 SemiAnalysis 评为"inference king" | Google TPU 8i（推理），Groq（高速推理，已被 NVDA 收编） | FY26Q4 EC，FY27Q1 EC |
| AI 联网 | Spectrum-X Ethernet 已超过所有竞争对手总和 | Arista（传统以太网），Cisco | FY27Q1 EC Colette |
| Custom ASIC 整体 | ASIC CAGR 94% vs merchant GPU 30%，但基数小：$150B vs $454B by C2028E | Broadcom（主要代工方），Marvell | Citi_30429659 |

**竞争动态**

- **Google TPU 8t/8i**：4x 训练/推理性能提升（← news Apr 2026），是 Citi 追踪的最严峻 custom ASIC 威胁。Google 已开始对外出售 TPU 算力，并在 Citi 模型中被标注为 Meta 2027 可能采购 Google GCP + TPU 的潜在供应商（← Citi_30387538）。NVDA 反制：Vera Rubin + Groq LPX 组合在延迟侧直接对标 TPU 的极低延迟优势；35x 推理吞吐量优势提升整体 TCO（← Citi_30413625）。

- **Amazon Trainium**：持续扩展内外部客户，与 Google 共同构成"已规模化"的 custom ASIC 阵营。AWS 与 NVDA 在 NVLink 集成上建立合作（FY26Q4 宣布），同时 Trainium 仍在推进中，显示 hyperscaler"双轨战略"。

- **Broadcom custom ASIC**：Citi 框架中 custom ASIC $150B TAM 的主要代工方。ASIC CAGR 94% 来自极低基数，但 NVDA 维护的观点是：ASIC 只能做特定模型，无法覆盖 Hopper-era 投资已积累的 CUDA 生态（← FY26Q3 EC Jensen 5 things，thing 3）。

- **AMD MI300X/MI350**：赢得 OpenAI 部分 GPU 合同（← Citi_30429659），是 merchant GPU 市场的唯一有效竞争者。NVDA 反制逻辑：Vera CPU 用 3x SQL / 6x 数据处理直接 outperform AMD X86 CPU（← Citi_30434725）；MI 系列在推理性能和软件生态深度上仍落后 2-3 代。

- **NVDA 防御策略（Jensen 5 层逻辑）**：(1) 全阶段覆盖（pre-training/post-training/inference 任意切换）；(2) 全模型运行（MoE/dense/diffusion/autoregressive，唯一做到）；(3) 全云部署（offtake 多样性，AI natives 最需要）；(4) 全边缘延伸（robotics/AV/base station）；(5) offtake 多样性降低客户平台切换意愿（← FY26Q3 EC，Jensen closing remarks）。Meta/Microsoft 的 MTIA/Maia 自研 ASIC 持续延迟进一步验证了 NVDA 平台的不可替代性（← Citi_30387538）。

---

### 产业链定位

**定位**：NVDA 是 AI 基础设施价值链的核心节点——不制造、不集成，但提供所有关键 IP，并通过 CUDA 软件栈和 NVLink 标准把价值锁定在自己手中。

| 环节 | 关键玩家 | NVDA 角色 |
|------|---------|---------|
| 芯片设计 | NVDA（GPU/CPU/DPU/Switch） | 主导：7 芯片协同设计（Rubin 平台）|
| 晶圆制造 | TSMC（首选）；TSMC 美国厂（Blackwell 晶圆已在美产出，← FY26Q3 EC） | 依赖；供应链瓶颈之一 |
| 封装 | CoWoS（TSMC）；Amcor；SPIL | 关键瓶颈：CoWoS + HBM 是 GM 压力主要来源 |
| HBM 内存 | SK Hynix（主要）；Micron；Samsung | 依赖；已锁定 2026-2027 供应（← Citi_30408748）|
| 系统集成 | Foxconn；Quanta；Wiwynn；Dell；HP；Supermicro；Lenovo | NVDA 提供 MGX 模组架构，ODM/OEM 集成入客户数据中心 |
| 网络 | NVDA（Spectrum-X/InfiniBand）；Lumentum（CPO 光学，← Citi_30408160）；Corning（光纤，← Citi_30408160） | NVLink 是 NVDA 专有，Spectrum-X 已超过所有以太网竞争对手总和 |
| 云平台 | AWS；Azure；Google Cloud；OCI；CoreWeave | 下游客户，同时也是 NVDA 最大的 offtake 来源和竞争意识体 |
| AI 应用层 | OpenAI；Anthropic；xAI；Meta；Cursor | 生态投资对象；NVDA 以股权深度绑定前沿模型 maker |

**关键合作/依赖**：
- **TSMC**：晶圆和 CoWoS 封装首选，美国建厂降低单一供应风险（Blackwell 第一批美产晶圆 FY26Q3 庆祝）
- **SK Hynix**：HBM3e 主要供应商，2026-2027 供应已锁定
- **Anthropic / OpenAI**：生态核心，NVDA 各投资 $10B 和待定金额，Anthropic 是 Vera CPU 首批采用者
- **Meta**：全承诺（all-commitment）供应协议，百万级 Blackwell+Rubin GPU 订单（← FY26Q4 EC）
- **Groq**：$20B 非独占许可协议（Dec 2025），Groq 3 LPX 已集成入 NVL72 系统栈（← Citi_30393092，Citi_30434725）

---

### DC 内部拆解：Compute + Networking 轨迹

| Quarter | DC Total ($B) | DC Compute ($B) | DC Networking ($B) | Networking YoY |
|---------|--------------|----------------|-------------------|----------------|
| FY25Q2  | 26.3 | ~22.6 | ~3.7 | — |
| FY25Q3  | 30.8 | ~26.8 | ~3.7 (↓15% QoQ) | +20% YoY |
| FY25Q4  | 35.6 | ~32.6 | ~3.0 | -9% YoY |
| FY26Q1  | 39.1 | 34.1 | 5.0 | +56% YoY |
| FY26Q2  | 41.1 | 33.8 | 7.3 | +98% YoY |
| FY26Q3  | 51.2 | 43.0 | 8.2 | +162% YoY |
| FY26Q4  | 62.3 | 51.3 | 11.0 | +263% YoY |
| FY27Q1  | 75.2 | 60.4 | 14.8 | +199% YoY |

**Networking 增长逻辑**：FY25Q4 是过渡低谷（NVLink 8/InfiniBand → NVLink 72/Spectrum-X），之后随 GB200/GB300 NVL72 系统大规模出货，NVLink 计算 fabric 收入爆发式增长。NVL72 让 72 个 GPU 作为单一 GPU 运行，NVLink 是这个能力的物理基础。Spectrum-X Ethernet 在 FY27Q1 已超过所有以太网竞争对手总和（← FY27Q1 EC）。InfiniBand 在 FY27Q1 YoY 增长 4x+（← FY27Q1 EC Colette）。

全年 FY26 Networking 收入超过 $31B，是收购 Mellanox 时（FY2021）的 10x 以上（← FY26Q4 EC）。

---

### FY27Q1 新分部拆解：Hyperscale vs ACIE

FY27Q1 起 NVDA 正式披露 DC 二级分部，投资者首次获得 Hyperscale 与非 Hyperscale 的量化对比。

| 分部 | FY27Q1 收入 | QoQ | 定义 | 增长驱动 |
|------|-----------|-----|------|---------|
| **Hyperscale** | $38B（~50%） | +12% | 全球公有云 + 最大消费互联网公司 | 仍是最大绝对额；搜索/推荐/广告系统从 CPU→GPU 迁移提供稳定基础 |
| **ACIE** | $37B（~50%） | +31% | AI Clouds（AI 原生云）、Industrial（制造/能源/主权 AI）、Enterprise（on-prem） | AI cloud 收入 YoY 超过 3x；是增速最快的子分部 |

**ACIE 快于 Hyperscale 的结构原因**：AI 原生公司（Anthropic、CoreWeave、xAI、Perplexity、Cursor 等）不自建芯片，高度依赖 NVDA 完整解决方案；主权 AI 在 FY27Q1 YoY 增长 >80%，基础设施部署已覆盖近 40 国（← FY27Q1 EC Colette）。Jensen 预期 ACIE 长期将远超 Hyperscale，因为它对应 $50-80T 的工业/企业全球经济体量（← FY27Q1 EC Jensen，segmentation Q&A）。

NVDA 战略上唯一能规模化服务 ACIE 的能力来自：全栈完整方案（硬件+软件+系统集成支持）+ 广泛生态合作伙伴覆盖 + CUDA 跨行业加速库（计算光刻/流体动力学/分子动力学等），而 custom ASIC 完全不适用于这一高度碎片化的长尾市场。

**物理 AI 作为第三增长曲线**：FY27Q1 物理 AI 累计 12 个月收入已超过 $9B（← FY27Q1 EC Colette），包括自动驾驶（Waymo、Tesla、Uber Robotaxi 覆盖近 30 城市 4 大洲 by 2028）、人形机器人（Boston Dynamics、Figure 等）、数字孪生工厂（Foxconn、Toyota、TSMC）。Jensen 预期机器人 edge 未来将代表数万亿美元 TAM，是未来第三个独立增长引擎（← FY26Q4 EC，FY27Q1 EC）。

---

来源速查：segment 数据 ← ER extract；Networking 轨迹 ← ER FY26Q1-FY27Q1 mgmt_highlights；竞争框架 ← Citi_30429659；5 things defense ← FY26Q3 EC closing remarks；FY27Q1 segmentation ← FY27Q1 EC Colette + Jensen；ACIE 增速 ← FY27Q1 EC Colette（+31% QoQ）；物理 AI ← FY27Q1 EC Colette（$9B TTM）

## Key Take-Away

> 尚无研究 activity，后续由 librarian takeaway 自动填充。

<!-- KEY_TAKEAWAY_AUTO_START -->
<!-- KEY_TAKEAWAY_AUTO_END -->

## Key Stats

### 5.1 股价 & 市值 (Price & Market Cap)
| 指标 | 值 |
| ---- | ---- |
| 实时股价 | $200.42 (2026-06-11 yfinance) |
| 市值 | $4,854.4B |
| 股份数 | 24,221M |
| EV | $4,809.8B |
| 52周区间 | $140.85-$236.54 |
| P/E (TTM) | 30.7x |

### 5.2 财务快照 (Financial Snapshot)
| 指标 | FY28E | FY29E | FY30E | FY31E |
| ---- | ---- | ---- | ---- | ---- |
| Revenue (USD mn) | 454,326 | 541,907 | 636,560 | 747,962 |
| GPM | 75.2% | 75.2% | 75.2% | 75.2% |
| Non-GAAP NI (USD mn) | 264,513 | 322,800 | 386,720 | 462,388 |
| Non-GAAP EPS | 10.81 | 13.20 | 15.81 | 18.90 |

### 5.3 运营 / 商业化 KPIs (Operating KPIs)

| 指标 | 27Q1 | 27Q2E | 27Q3E | 27Q4E | 28Q1E | 28Q2E | 28Q3E | 28Q4E |
| ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- |
| *期末(CY)* | *Apr'26* | *Jul'26* | *Oct'26* | *Jan'27* | *Apr'27* | *Jul'27* | *Oct'27* | *Jan'28* |
| 分部收入增速假设 (Y/Y%) — Y/Y Datacenter Revenue Growth, % | — | 104% | 65% | 40% | 30% | 30% | 25% | 25% |
| 分部收入增速假设 (Y/Y%) — Y/Y Gaming Revenue Growth, % | — | 30% | 25% | 20% | 25% | 25% | 25% | 20% |
| 盈利假设 (税率/GM) — Non-GAAP Tax Rate | — | 17% | 15% | 15% | 15% | 15% | 15% | 15% |
| 盈利假设 (税率/GM) — Y/Y Improvement in non-GAAP gross margin, bps | — | 230bps | 100bps | 100bps | 0bps | 0bps | 0bps | 0bps |

> 来源：model 预测假设（driver_addresses）。对齐 model_digest critical_assumptions。

### 5.4 产品 / 定价细分 (Product & Pricing)

FY27Q1（Apr-Q 2026）起，NVDA 将报告结构重组为两个市场平台：**Data Center**（$75.2B，占总营收 92%）和 **Edge Computing**（$6.4B，占 8%），取代此前的 Gaming/ProViz/Auto/OEM/DC 五分部。以下表格保留历史可比数据，并以 FY27Q1 新框架呈现最新期。

#### 终端市场收入拆分（历史对比）

| 分部 | FY26Q4 收入 | QoQ | YoY | 占 FY26Q4 总收入 | 定价特征 |
|------|-----------|-----|-----|-----------------|---------|
| Data Center | $62.3B | +22% | +75% | 91.5% | B300/NVL72 系统为主；ASP 随平台代际大幅提升 |
| Gaming（已归入 Edge） | $3.7B | — | +47% | 5.5% | RTX 50-series Blackwell 提价；供应持续紧张 |
| Pro Viz（已归入 Edge） | $1.3B | +74% | +159% | 1.9% | DGX Spark Blackwell 工作站驱动；首次突破 $1B |
| Automotive（已归入 Edge） | $604M | — | +6% | 0.9% | DRIVE Orin/Thor 自动驾驶平台 |
| OEM/Other（已归入 Edge） | $161M | — | — | 0.2% | 嵌入式和 OEM 渠道 |

| 分部 | FY27Q1 收入 | QoQ | YoY | 占 FY27Q1 总收入 | 定价特征 |
|------|-----------|-----|-----|-----------------|---------|
| Data Center | $75.2B | +21% | +92% | 92.2% | Blackwell 300 系列（GB300/NVL72）为绝对主力；DC compute $60.4B + networking $14.8B |
| Edge Computing | $6.4B | +10% | +29% | 7.8% | Blackwell 工作站需求强；消费端因内存/系统价格偏高略有软化 |

#### DC 内部定价分层

NVDA 不公布单 GPU 价格，但可从以下维度推断 ASP 趋势：

| 指标 | 数据 | 来源 |
|------|------|------|
| H100 云端租金（YTD 涨幅） | +20% | ← FY27Q1 EC Colette |
| A100 云端租金（YTD 涨幅） | +15% | ← FY27Q1 EC Colette |
| GB200 NVL72 系统估算 ASP | ~$300K–$400K/rack（行业估算） | Citi research（非官方，市场传播数字）|
| GB300/Vera Rubin NVL72 系统 ASP 趋势 | CPU 内容接近 1:1 GPU → 每系统 CPU ASP 贡献翻倍（← 历史 1 CPU per 2 GPUs → 趋近 1:1） | ← Citi_30434725 |
| Vera CPU 独立销售 guidance（FY27） | ~$20B，standalone CPU TAM 2030E $200B | ← FY27Q1 EC，Citi_30432569 |
| Hyperscale CapEx（2026 预测） | ~$700B，趋近 2027 $1T | ← FY26Q4 EC，FY27Q1 EC |

#### 定价护城河：per-token 经济学

NVDA 定价逻辑的核心不是 GPU 售价，而是**AI factory 的 lifetime token cost**。Jensen 在 GTC（Mar 2026）明确指出：NVDA 系统 ASP 更高，但每 token 成本更低，因为吞吐量和能效更优，"token cost 和 hardware price 只是松散相关"（← Citi_30413829）。管理层反复引用 GB300 vs H200 的 10x 性能/瓦特和 10x 低 cost-per-token 作为核心定价论据（← FY26Q4 EC Colette，FY27Q1 EC Colette）。

这一定价逻辑在 agentic AI 时代进一步强化：当 AI lab 上市后，管理层预期叙事将从"成本"转向"最高性能系统"，进一步支撑 ASP 和 GM durability（← Citi_30432569）。

#### Edge Computing / 消费端定价

| 产品线 | 状态 | 定价特征 |
|--------|------|---------|
| GeForce RTX 50-series（Blackwell） | FY25Q4 发布；FY26Q1 5070/5060 推出 | 消费端 AI PC 溢价；供应约束支撑价格 |
| DGX Spark | FY26Q3 发布，Pro Viz 主力 | B2B 工作站，Grace Blackwell 小型化，Blackwell Pro Viz $760M FY26Q3 |
| RTX Spark（ARM，与 Microsoft/MediaTek 合研） | Computex Jun 2026 发布 | 1 petaflop AI + 128GB 统一内存；AI-native PC 新品类；面向消费/开发者双市场（← Citi_30434725）|
| Nintendo Switch 2（NVDA 处理器） | FY26Q1 宣布 | OEM 授权，不单独公布 |

来源：ER extract segment_revenue（FY25Q2-FY27Q1）；FY27Q1 EC Colette；Citi_30413829；Citi_30434725；Citi_30432569

### 5.5 对标同业 (Capability vs Peers)

#### 核心能力对比

| 维度 | NVDA (Blackwell / Vera Rubin) | Google TPU 8t/8i | AWS Trainium 2 | AMD MI300X / MI350 | Broadcom Custom ASIC |
|------|------------------------------|-----------------|----------------|-------------------|---------------------|
| **训练性能** | 主导；NVLink 72 全连接，GB300 vs H200：10x perf/watt（← FY26Q3 EC）；MLPerf 每代全面胜出 | 4x 性能提升（TPU 8t，← news Apr 2026）；MoE 模型训练有竞争力 | 扩展内外部客户，具体 benchmark 少见 | MI300X 赢得部分 OpenAI 训练合同（← Citi_30429659）；但 HBM 带宽和 NVLink 等效缺失 | 不面向训练；面向固定拓扑 inference |
| **推理性能** | Vera Rubin vs Blackwell：35x inference throughput（← Citi_30434725）；SemiAnalysis "inference king"（← FY26Q4 EC）；Groq LPX 高速推理已集成 NVL72 | TPU 8i：低延迟推理具竞争力；Google 已开始对外售 TPU 算力 | Trainium 面向 AWS 内部推理；具体性能数据有限 | 在推理吞吐量上落后 Grace Blackwell 2-3 代 | 特定任务固定推理极低成本，但不支持模型多样性 |
| **软件生态** | CUDA：25 年积累；1.5M Hugging Face 模型；CUDA-X 全套加速库；TensorRT-LLM 推理优化（← FY26Q3 EC，FY26Q4 EC）；长期 backward compatibility | JAX/XLA：Google 内部深度优化；外部开发者支持相对有限 | AWS SDK + PyTorch 整合；外部生态仍在建立 | ROCm 成熟度远低于 CUDA；软件生态是最大短板 | 无通用 SDK；只支持与客户共同定义的特定拓扑 |
| **TCO / 运营成本** | 最低 cost-per-token（GV300 vs 任意对比平台，← FY26Q4 EC）；H100 租金 YTD +20%（← FY27Q1 EC）；6 年旧 A100 仍满载运行 | TPU 成本优势在 Google 内部测算；外部定价对比少 | Trainium 号称对标 H100 TCO，但 AWS 内部生产力测量难以独立验证 | 在 OpenAI 部分合同中通过价格竞争获客，推测比 NVDA 便宜 | 单任务 ASIC 固定推理成本极低；但只适合特定量大、稳定的推理任务 |
| **市场份额** | merchant GPU ~90% C2025E → ~81% C2028E（← Citi_30387538）；DC networking：所有以太网竞争对手总和的领先（← FY27Q1 EC） | custom ASIC 总体 CAGR 94%（← Citi_30429659）；Google 硬件外售是新变量 | custom ASIC 阵营的一部分；Citi 合并 ASIC TAM $150B by C2028E | merchant GPU 细分：AMD = 次要竞争者，有限 design win | custom ASIC（含 Marvell）合计 $150B C2028E TAM（← Citi_30429659）|

#### 竞争动态叙述

**Google / Alphabet（TPU 8t/8i）**
Google TPU 是 Citi 跟踪的最严峻 custom ASIC 威胁，TPU 8t（训练）和 8i（推理）据报道各有 4x 性能提升（← news Apr 2026）。Google 正在推进对外出售 TPU 算力（XGS bare metal 实例），且 Meta 据报道正在谈判 2027 年使用 Google GCP + TPU（← Citi_30387538），这是 Citi 模型中的 bear case 核心场景之一。但 Google 目前仅在自身生态内深度优化（JAX/XLA），外部开发者采用度受限；NVDA 通过 Vera Rubin + Groq LPX 的组合，在延迟层面直接与 TPU 竞争，35x 推理吞吐量优势支撑整体 TCO 论据（← Citi_30413625）。

**Amazon / AWS（Trainium 2）**
AWS Trainium 与 Google TPU 共同构成已规模化的 custom ASIC 阵营，且两者都在积极拓展外部客户。Trainium 面向 AWS Bedrock 生态，在 AWS 内部有规模优势。值得注意的是，AWS 同时宣布与 NVDA 合作在 NVLink 集成上扩展（← FY26Q4 EC），以及 FY27Q1 AWS 将部署 100 万+ Blackwell 和 Rubin GPU（← FY27Q1 EC Colette），显示 hyperscaler 普遍采用"双轨策略"——内部 ASIC 做已知稳定负载，NVDA 做前沿/多样化负载。

**AMD（MI300X / MI350）**
AMD 是 merchant GPU 市场唯一有效竞争者，在 OpenAI 部分 GPU 合同中胜出（← Citi_30429659），且 AMD X86 CPU 是 Vera CPU 性能对比的基准（NVDA 声称 3x SQL、6x 数据处理性能优势 ← Citi_30434725）。AMD MI 系列的核心短板：(1) 没有等效 NVLink 高速互联，多 GPU 域通信带宽大幅劣于 NVL72；(2) ROCm 生态成熟度与 CUDA 差距仍达数年；(3) 在 MoE 模型（当前主流推理架构）上的优化深度不足。Citi 维持 NVDA 压倒性胜出的判断，但承认 AMD 在成本敏感型大客户中有存在感。

**Broadcom（custom ASIC 代工代表）**
Broadcom 不直接与 NVDA 的完整系统竞争，而是作为 Google TPU、Meta MTIA、Microsoft Maia 等 custom ASIC 的代工商参与竞争。Citi 模型使用 AVGO 约 30% 的 networking-to-compute dollar attach ratio 构建 DC semis TAM 框架（← Citi_30429659）。Custom ASIC 的结构性限制：每款 ASIC 只能高效运行与其一起设计的特定模型拓扑，model 架构迭代时 ASIC 面临大幅折旧风险，而 NVDA CUDA 的历史 backward compatibility 使 6 年前的 A100 仍满载（← FY26Q3 EC）。

**Meta MTIA / Microsoft Maia（延迟的自研 ASIC）**
Meta 的 MTIA 和 Microsoft 的 Maia 持续面临延迟（← Citi_30387538），两者仍是 NVDA 的主要客户：Meta 签署"全承诺"供应协议，百万级 Blackwell + Rubin GPU 订单（← FY26Q4 EC）；Microsoft 与 NVDA 合研 RTX Spark AI PC，并为 Vera CPU 早期采用者（← Citi_30434725）。这一"自研受挫 + 继续扩大 NVDA 采购"的模式，是 Citi bear case（ASIC 快速替代）中最重要的反驳证据。

#### 整体供给纪律 vs 价格战

当前 AI 加速器市场不存在传统意义的价格战：NVDA 系统定价溢价，但因 cost-per-token 领先，客户 ROI 为正；hyperscaler CapEx 增速 ~90-100% YoY（← FY27Q1 EC），供给全面紧张，H100 租金 YTD +20%（← FY27Q1 EC）。Custom ASIC 阵营（Google/AWS）选择性在特定任务上成本竞争，而非全面替代。AMD 在个别大客户合同中通过价格获得立足点。整体市场逻辑是"供给纪律"而非"价格战"，Citi 预期这一格局延续至 Rubin 过渡期（mid-70s GM 可维持）。

来源：Citi_30387538（ASIC share model）；Citi_30429659（TAM framework）；Citi_30413625（Rubin LPU 35x throughput）；Citi_30434725（Vera CPU 性能 benchmark）；FY26Q3 EC（Jensen 5 things，competitive defense）；FY27Q1 EC（inference market share，LPX niche comment）；news Apr 2026（Google TPU 8t/8i 4x）

### 5.6 估值多重对比 (Valuation Multiples)
| Multiple | FY28E | FY29E | FY30E | FY31E |
| ---- | ---- | ---- | ---- | ---- |
| **P/E (Non-GAAP)** | 18.5x | 15.2x | 12.7x | 10.6x |
| EV/Revenue | 10.6x | 8.9x | 7.6x | 6.4x |

> 基于股价 $200.42，EV $4,809.8B。EPS/Revenue 来自 Internal model。

<!-- PE_BAND_AUTO_START -->
<!-- PE_BAND_AUTO_END -->

## 财务数据

> **FY-CY 对齐**: NVDA 财年结束月=Jan；最新实际季 27Q1(Feb–Apr 2026);其后为 forecast(E 后缀)。

### 6.1 Revenue (USD mn)
| 指标 | 25Q4 | 26Q1 | 26Q2 | 26Q3 | 26Q4 | 27Q1 | 27Q2E | 27Q3E |
| ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- |
| *期末(CY)* | *Jan'25* | *Apr'25* | *Jul'25* | *Oct'25* | *Jan'26* | *Apr'26* | *Jul'26* | *Oct'26* |
| Revenue | 39,331 | 44,062 | 46,743 | 57,006 | 68,127 | 81,615 | 90,933 | 91,536 |
| YoY % | — | +69% | +56% | +62% | +73% | +85% | +95% | +61% |

### 6.2 利润 & Margin (Non-GAAP)
| 指标 | 25Q4 | 26Q1 | 26Q2 | 26Q3 | 26Q4 | 27Q1 | 27Q2E | 27Q3E |
| ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- |
| *期末(CY)* | *Jan'25* | *Apr'25* | *Jul'25* | *Oct'25* | *Jan'26* | *Apr'26* | *Jul'26* | *Oct'26* |
| Gross Profit | 28,723 | 26,668 | 33,853 | 41,849 | 51,093 | 61,157 | 68,066 | 68,211 |
| GPM % | 73.5% | 61.0% | 72.7% | 73.6% | 75.2% | 75.0% | 75.0% | 74.6% |
| Operating Income | 25,516 | 23,275 | 30,165 | 37,752 | 46,107 | 53,783 | 59,836 | 61,535 |
| OPM % | 64.9% | 52.8% | 64.5% | 66.2% | 67.7% | 65.9% | 65.8% | 67.2% |
| Non-GAAP NI | 22,066 | 19,894 | 25,783 | 31,767 | 39,552 | 45,548 | 49,553 | 52,414 |
| NPM % | 56.1% | 45.2% | 55.2% | 55.7% | 58.1% | 55.8% | 54.5% | 57.3% |
| EPS | 0.89 | 0.81 | 1.05 | 1.30 | 1.62 | 1.87 | 2.03 | 2.14 |

> 口径：Non-GAAP（排除 SBC/一次性项目）。来源：Internal model

### 6.4 OPEX 明细 (USD mn)
| 指标 | 25Q4 | 26Q1 | 26Q2 | 26Q3 | 26Q4 | 27Q1 | 27Q2E | 27Q3E |
| ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- |
| *期末(CY)* | *Jan'25* | *Apr'25* | *Jul'25* | *Oct'25* | *Jan'26* | *Apr'26* | *Jul'26* | *Oct'26* |
| S&M | 646 | 685 | 739 | 751 | 928 | 1,295 | 1,892 | 1,206 |
| R&D | 2,732 | 2,898 | 3,071 | 3,464 | 4,212 | 6,154 | 6,429 | 5,562 |
| Total OPEX (Non-GAAP) | 4,689 | 5,030 | 5,413 | 5,839 | 6,794 | 7,621 | 8,321 | 6,768 |

> ⚠️ S&M/R&D 为 model 口径（可能含 SBC），Total OPEX 为 Non-GAAP。差额主要为 SBC 分配。


## Market Consensus

### CapIQ Consensus

| 指标 | FY27E | FY28E | FY29E |
| ---- | ---- | ---- | ---- |
| TEV/Revenue | 12.8x | 9.1x | 7.5x |
| TEV/EBITDA | 19.0x | 13.5x | 11.0x |
| P/E | 23.2x | 16.4x | 13.3x |

> Source: S&P Capital IQ consensus

### 券商预期 (Sell-side)

- Citi Research (Buy) TP $300

> Source: sell-side research reports (T3)

## Catalyst Tracking Calendar

> **时间范围**: 2026-06 至 2026-12（未来 6 个月关键事件）
> **影响标注**: ↑ 正面 / ↓ 负面 / ~ 中性观察

| 时间 | 事件 | 来源 | 影响 |
| ---- | ---- | ---- | ---- |
| 2026-06-11 | 参议员 Warren 原定 AI 出口管制国会听证（Jensen Huang 已于 6/8 拒绝出席） | CNBC / news | ↓ 政治风险信号：Jensen 拒绝出席引发进一步监管关注；后续可能有更强制性召唤或新立法提案 |
| 2026-06（进行中） | 美商务部新规：中国实体全球范围适用出口许可，影响 Blackwell 向中国海外子公司销售 | GuruFocus / news Jun 2026 | ↓ 结构性风险：原本绕道第三国的销售路径被封堵；China/HK 6% 营收占比可能进一步压缩 |
| 2026-06（进行中） | Computex 后续：Vera Rubin full production 确认 + NVL72 系统规格详细披露 | Citi_30434725, NVIDIA Newsroom | ↑ Rubin 执行风险消除；CPU:GPU 1:1 比例首次公开，$200B CPU TAM 论点开始受市场关注 |
| 2026-06（进行中） | OpenAI 投资协议最终落地（描述为 "close to being done" → "in finalization"） | Citi_30408748, Citi_30408972 | ↑ 确认 NVDA 与顶级 AI 实验室深度绑定；OpenAI 作为 Vera CPU 早期采用者增强 CPU TAM 叙事 |
| 2026-07（预期） | Google I/O 或后续 Google TPU 外销进展更新（竞争监控点） | news, Citi_30429659 | ↓ 若 Google 扩大 TPU 外销规模，ASIC share 上升速度可能快于 Citi 81% C2028E 预测 |
| 2026-07（预期） | Hyperscaler Q2 财报季（AWS/Azure/GCP）：CY2026 CapEx guidance 更新 | 行业监控 | ↑/↓ 若维持/上修 $700B+ 水平支撑 NVDA；若下修 >15% 则 bull case 核心假设受挑战 |
| 2026-08-26（预期） | NVDA FY27Q2 earnings：$91B 指引 vs 实际（± 2%）；Rubin 首季度出货数据 | ER FY27Q1 next_q_guidance | ↑ 核心催化剂——$91B guide 是 Rubin 切换前的"纯 Blackwell 量产高峰"；beat $3B+ 可能触发 TP 再上调至 $330+ |
| 2026-Q3（~Oct 2026） | Vera Rubin production shipments 正式开始（FY27Q3），Q4 加速放量 | Citi_30432569, ER FY27Q1 EC | ↑ Rubin 首批出货量 + CPU:GPU 比例是验证 $200B CPU TAM 论点的关键节点；供应瓶颈（CoWoS/HBM4）能否打通决定 Q4 收入弹性 |
| 2026-Q3/Q4（预期） | Intel 合作/投资监管审批结果（$5B 股权，Oct-Q 10-Q 显示待批） | Citi_30386545, ER FY25Q3 | ~ 若获批：供应链深度绑定信号，InfiniBand/CPU 协同可能加速；若受阻：关注替代供应商策略 |
| 2026-Q4（预期） | Rubin Ultra 时间线更新（超出当前 $1T+ DC pipeline 的增量收入） | Citi_30413625, Citi_30408748 | ↑ Rubin Ultra 首次指引将打开 FY28 想象空间；Citi TP $300 基于 28x FY28 EPS $10.20，Rubin Ultra 加速可上调 EPS |
| 2026-全年（持续） | 申请 50%+ FCF 返还：$80B 回购 + 季度分红 $0.25（每季约 $20B 回报速率） | ER FY27Q1, Citi_30435141 | ↑ 机械性下行支撑；若营收按 guide 走、FCF 维持高位，实际回购执行进度是股价支撑锚 |

---

**关键观察节点**（投资决策 checklist）

- **FY27Q2 earnings (Aug 26)** — $91B guide 是否大幅 beat + GM 能否守住 75%；Rubin 初期出货是否提前
- **Rubin 首批出货 (Oct 2026 附近)** — CPU/GPU 1:1 比例实际兑现度；CoWoS-S / HBM4 产能是否成为瓶颈
- **出口管制跟踪** — Warren 听证后是否有立法提案；商务部新规实际影响季度营收幅度
- **ASIC 竞争指标** — Google 外销 TPU 客户数量及规模；Meta 是否正式宣布使用 Google TPU in 2027

## 券商评级日历

| 日期 | 券商 | 评级 | TP | 关键 take |
| ---- | ---- | ---- | ---- | ---- |
| — | Citi Research | Buy | $300 | NVDA是全球唯一拥有GPU+CPU+LPU+Networking+Software全栈AI compute platform at scale的公司。$1T+ DC revenue floor(CY2025-2027)不含CPU/LPX/Hopper上行空间。← Citi 30413829; Agentic AI是第三大需求拐点(after generative AI and reasoning)，management targeting 50x token generation growth vs 5x from reasoning alone。推理需求已inflect。← Citi 30394336, Citi 30432569 |

## 近期要点

### 公司公告

- **2026-06-01** Computex 2026: Rubin 平台正式发布，6 款新芯片，NVL72 平台相较 Blackwell agent 吞吐量提升 10x，推理 token 成本降低 10x；Vera Rubin 确认进入全面量产，投资者对延迟的担忧正式消除。 ← [NVIDIA Newsroom](https://nvidianews.nvidia.com/news/rubin-platform-ai-supercomputer)

- **2026-06-01** Computex Day 1 同场发布 RTX Spark（ARM 架构 AI PC，与微软/联发科合作研发），搭载 1 petaflop AI 算力和最高 128GB 统一内存，标志 NVDA 正式进入 AI 原生消费 PC 市场。 ← [Citi Research](internal:Citi_30434725)

- **2026-05-20** FY27Q1（截至 2026-04-27）业绩：营收 $81.6B（+85% YoY），数据中心营收 $75.2B（+92% YoY），非-GAAP EPS $1.87（含 SBC，新会计口径），FY27Q2 指引 $91.0B ±2%。同步宣布 $80B 回购计划及季度股息提升 25x 至 $0.25/股。 ← [SEC EDGAR](https://www.sec.gov/Archives/edgar/data/0001045810/000104581026000051/q1fy27pr.htm)

---

### 监管 / 政策

- **2026-06-04 — 2026-06-08** 参议员 Warren 邀请 Jensen Huang 出席 6/11 国会 AI 出口管制听证，Huang 于 6/8 拒绝出席；事件凸显 NVDA 在 AI 芯片出口问题上的政治敞口，属负面政治风险信号。 ← [CNBC](https://www.cnbc.com/2026/06/08/nvidia-jensen-huang-senate-elizabeth-warren-ai-china-export-controls.html)

- **2026-06-01** 美商务部推出新规：中国实体出口许可要求延伸至其全球范围内子公司，高端 AI 芯片（Blackwell）向中国海外关联企业的销售受影响；中国/香港营收已压缩至仅 6%（FY27Q1 10-Q），新规使结构性风险延续。 ← [GuruFocus](https://www.gurufocus.com/news/8893112/nvidia-faces-stricter-export-restrictions-affecting-ai-chip-sales-nvda)

- **2025-04-09** 美国政府要求 H20 芯片出口须许可证，NVDA 在 FY26Q1 计提 $4.5B H20 库存及采购义务减值，一次性将非 GAAP GM 压低至 61.0%（剔除后 71.3%）；该影响已消化，但出口管制风险格局已永久改变。 ← [SEC EDGAR](https://www.sec.gov/Archives/edgar/data/0001045810/000104581025000115/q1fy26pr.htm)

---

### 竞品动态

- **2026-04-25** 定制 AI 芯片（Google TPU + AWS Trainium + Broadcom ASIC）被分析师认定为比 AMD 更大的结构性威胁；NVDA ~40% 营收来自同时自研 ASIC 的 4 大超大规模客户，客户集中与竞争加剧并存。 ← [Motley Fool](https://www.fool.com/investing/2026/04/25/meet-biggest-threat-nvidia-ai-chips-its-not-amd/)

- **2026-04-01** Google Cloud Next 2026 发布 TPU 8t（训练）+ TPU 8i（推理），相较上一代性能提升 4x，并开始向外部客户销售；Citi 认为是现有 GPU 竞争对手中技术威胁最显著的事件。 ← [Yahoo Finance](https://finance.yahoo.com/sectors/technology/article/google-announces-2-ai-chips-as-competition-with-nvidia-heats-up-120011883.html)

- **2025-11-25** Citi 报告（Citi_30387538）：Meta 正与 Google 谈判 2027 年迁移至 Google TPU；Citi 模型预计 NVDA merchant GPU 份额从 C2025E 的 90% 小幅降至 C2028E 的 81%，定制 ASIC 以 94% CAGR 增长但基数较小（C2028E $150B vs GPU $454B）。 ← [Citi Research](internal:Citi_30387538)

---

### 分析师 / 市场

- **2026-05-22** 某分析师下调 NVDA 评级：主要理由为估值风险与持仓拥挤，基本面仍强劲；与 Citi 维持 Buy/$300 TP 形成对比，显示市场出现分歧。 ← [MarketBeat](https://www.marketbeat.com/instant-alerts/nvidia-nasdaqnvda-shares-down-19-after-analyst-downgrade-2026-05-22/)

- **2026-05-21** Citi 维持 Buy，TP $300：积极评价 FY27Q1 Vera CPU $20B 指引及 $200B 新 CPU TAM（至 2030 年），同时上调 FY27/28/29E EPS +8%/+6%/+8%；Rubin 生产出货将于 FY27Q3（约 2026 年 10 月）开始。 ← [Citi Research](internal:Citi_30432569)



## 研报索引

**券商** (1)

- Citi Research (Buy)


## Peer Link

### 直接竞争 — 定制 ASIC

| 公司 | Ticker | 关系 | 备注 |
| ---- | ------ | ---- | ---- |
| Google / Alphabet | GOOGL | TPU 直接竞争；外部客户销售 | TPU 8t/8i 发布（2026-04），训练+推理性能 4x 提升；Meta 据报谈判 2027 年迁至 Google TPU；Google 将 TPU 销售外部客户，被 Citi 标为最大结构性竞争威胁 |
| Amazon (AWS) | AMZN | Trainium 直接竞争；也是 NVDA 大客户 | AWS Trainium 持续扩张外部客户；AWS re:Invent（2025-12）发布 AgentCore episodic memory，推动推理和 HBM 需求；与 NVDA 同时具备竞争与供应商双重关系 |
| Meta Platforms | META | MTIA 自研（进展迟缓）；同时是 NVDA 全承诺客户 | Meta MTIA 定制 ASIC 项目延迟；Meta 与 NVDA 签订全承诺（all-commitment）供应协议；同时据报正谈判 2027 年使用 Google TPU；Vera CPU 客户之一 |
| Microsoft | MSFT | Maia 自研（进展迟缓）；Vera CPU 锚定客户 | Microsoft Maia 定制 ASIC 项目延迟；同时是 Vera CPU 和 RTX Spark AI PC 的联合开发方（co-developed Windows AI PC）；NVDA 表示 Vera CPU 销售包含 Microsoft |

### GPU 竞争

| 公司 | Ticker | 关系 | 备注 |
| ---- | ------ | ---- | ---- |
| AMD | AMD | GPU 直接竞争；Vera CPU X86 性能对标 | AMD MI300X 被超大规模客户选择性采购；Citi（2026-05）指出 AMD 已赢得 OpenAI GPU 合同；NVDA 声称 Vera CPU 在 SQL 工作负载性能达 AMD X86 的 3x、数据处理达 6x |

### 战略投资 / 生态合作

| 公司 | Ticker | 关系 | 备注 |
| ---- | ------ | ---- | ---- |
| Intel | INTC | 战略投资；Vera CPU X86 性能对标 | NVDA 承诺投资最高 $5B 入股 Intel（待监管批准，截至 2025-10 Q 尚未完成）；Intel X86 同为 Vera CPU 性能对比基准 |
| Groq | 未上市 | 授权合作；LPU/LPX 技术来源 | NVDA 以 ~3x 最新估值签订 $20B 非独家授权协议（2025-12）；Groq LPU IP 用于 NVDA 的 LPX 推理芯片；Groq 3 LPX 已集成进 NVL72 Vera Rubin 系统栈，带来 35x 吞吐量提升，目标覆盖大客户约 25% 的工作负载 |
| Anthropic | 未上市 | 战略投资；Vera CPU 早期采用者 | NVDA 承诺投资最高 $10B（2025-11 宣布）；Anthropic 是 Vera CPU 首批客户，NVDA 称正"积极加速"与 Anthropic 合作 |
| OpenAI | 未上市 | 战略投资（推进中）；Vera CPU 早期采用者 | NVDA 持有 OpenAI 投资意向书，Citi（2026-02）称投资协议"接近完成"，10-K 显示"正在最终确认"；OpenAI 是 Vera CPU 早期采用者；同时 OpenAI GPU 合同被 AMD 部分赢得 |

### 供应链 / 光学网络生态

| 公司 | Ticker | 关系 | 备注 |
| ---- | ------ | ---- | ---- |
| Broadcom | AVGO | 网络芯片供应链；ASIC 代工竞争 | Citi 在 DC 半导体 TAM 模型中使用 AVGO ~30% 的 networking-to-compute 美元附着率；同时 AVGO 是定制 ASIC 代工的核心供应商，在 ASIC 竞争格局中具有双重角色 |
| Lumentum | LITE | CPO（共封装光学）光网络受益方 | Citi OFC 预览报告（Citi_30408160）中 Buy 评级；NVDA Spectrum-X CPO 部署推动 LITE 需求，Citi 上调 TP 至 $800（从 $560）并上修 FY27/28E EPS +19%/+18% |
| Corning | GLW | 光纤网络受益方 | 同属 OFC 报告受益标的，Citi Buy 评级；CY28E EPS 上调至 $5.10（牛市情景 $5.74），受益于数据中心光纤需求扩张 |
| IonQ | IONQ | 量子计算合作伙伴 | NVDA Quantum Day（2026-04）发布 Ising 开放平台；IonQ 是首批部署 NVIDIA Ising Decoding 模型的量子硬件合作方；Citi Buy 评级 |

## Footnotes

**数据来源**：
- Internal Model (T1/T2)
- S&P Capital IQ Consensus (T2)
- WebSearch news (T4)

*Wiki built: 2026-06-11*