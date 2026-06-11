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
