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
