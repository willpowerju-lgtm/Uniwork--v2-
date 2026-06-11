# SNDK — Cascade Review Log

记录每次「上游(model/wiki)变更 → 下游(registry/report/charts/wiki)级联」的漂移评估、
miss-guide 检查、LLM-judge thesis 影响与人工决策。供审阅 + git 回滚。

口径铁律:**一律财年(FY)**。FY 截止 6 月 → FY26 = 2025-07 ~ 2026-06 (= 会计季度 26Q1+26Q2+26Q3+26Q4)。
model 自带的 annual 列是**日历年**口径(如其 "FY26" 列 = 26Q3+26Q4+27Q1+27Q2 = 日历2026),**弃用**;
所有 FY 值一律由会计季度合计派生。

---

## 2026-06-10 — model v1（用户手改 Excel，saved as "Sandisk_Corp_SNDK_O_Model_Change v1.xlsx"）

**触发**：用户修改 model 前瞻假设(下调 ASP/价格)。
**来源**：⚠️ 用户 input 修改 —— **未经外部信息源 verify**（无新 ER / 新卖方 / 渠道核查支撑此 ASP 下调）。
**已级联(数字层，仅 report)**：v3.4 季度 99 值；v3.5 年度 FY26/27/28 改挂 model(季度合计)。**wiki 未动(待确认)**。

### 1. 漂移评估（v3.3 旧 model → v1 新 model，仅 source=Excel model）
- 变动 114 条；**>5% material：106** / ≤5% minor：8；最大 **−23.9%**（gaap_ni_27Q3）
- 关键：revenue_FY27 **−10.0%** | eps_FY27 **−16.9%** | net_income_FY27 −15.7% | 27Q1 rev/asp **−22.7%** | revenue_26Q4 −15.4% | eps_FY26 −5.1%
- 判定：**远超 5% 阈值 → 确认路径（非自动修改）**

### 2. Miss-guide 检查（model FQ4'26 vs 管理层指引）
| 指标 | 管理层指引 | model v1 | 判定 |
| --- | --- | --- | --- |
| Revenue | $7.75–8.25B | **$7.53B** | ❌ **跌破下限 −2.9%** |
| Non-GAAP GPM | 79–81% | 80.0% | ✅ |
| Non-GAAP EPS | $30–33 | $30.61 | ✅（近下限） |
- 判定：**收入 miss guide → 必须 raise**（model 现低于管理层自己的下季指引）

### 3. LLM-judge：数值变化触发的 wiki/report 叙述影响
1. **Bull #1（AI→ASP 结构性上行）**：forward ASP −23% 部分削弱核心驱动；可经 Bull #2（NBM floor 锁价）重构为「ASP 低而稳」——方向取决于变更来源性质。
2. **估值 / PT $1,900**：EPS −17%（FY27 200→166）→ 同倍数下 PT 需下修，待定。
3. **Catalyst / re-rating「FQ4'26 指引兑现」**：model 现低于指引 → 该催化剂由「上行触发」转为「下行风险」。
4. **Key Guide 段**：model 假设低于管理层指引 → 需标注分歧 + 待 verify。

### 4. 决策（用户 2026-06-10 确认）
- ✅ 变更来源性质：**未verify假设/情景** —— 来源=用户 model 修改，无外部信息源支撑。
- ✅ 更新范围：**wiki 表 + charts 全回灌**；**thesis / PT $1,900 / catalyst 不改写**，仅标注待 verify。
- ✅ 标注：已写入 wiki §5.2 / §5.3 / §5.4 / §5.6 / §6.2 源注 + Key Guide miss-guide 分歧标注。

### 5. 已执行
- **registry**：99 季度值（v3.4）+ FY26/27/28 改挂 model（v3.5，季度合计口径）。
- **报告**：v3.4（季度）→ v3.5（年度）→ v3.6（同数字，快照回灌后 wiki）。4 格式 + charts 均对齐 model v1。
- **wiki**（`wiki-sandisk/SNDK.md`）：§5.2 财务快照、§5.3 ASP 两行（Bit 行未变）、§5.4 ASP 趋势、§5.6 估值倍数、§6.1 Revenue+YoY、§6.2 GP/OI/NI/NPM/EPS（GPM%/OPM% 未变）、§6.4 OPEX 全部对齐；卖方一致预期表（§7）未动。
- **thesis 触发项（未改，待 verify）**：Bull#1 ASP、PT $1,900、catalyst「FQ4 指引兑现」、Key Guide 分歧 —— 均已标注，待新信息源确认后再定。

### 6. 回滚锚点（git）
- 级联前基线：`report/SNDK/v3.3`（旧 model + 旧 wiki 快照）
- 回灌前 wiki：`versions/v3.5/SNDK_wiki.md`（旧 wiki）；回灌后：`versions/v3.6/SNDK_wiki.md`（新 wiki）
- 旧 model：`Sandisk_Corp_SNDK_O_Model_Change.xlsx`｜新 model：`Sandisk_Corp_SNDK_O_Model_Change v1.xlsx`
- 回滚命令：`python src/build_report.py SNDK --rollback v3.3`（恢复 contract+charts），wiki 从对应 `versions/vX/SNDK_wiki.md` 手动还原。
