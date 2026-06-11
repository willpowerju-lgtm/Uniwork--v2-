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
