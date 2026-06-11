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
