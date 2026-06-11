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
