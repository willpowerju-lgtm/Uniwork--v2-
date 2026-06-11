---
name: gs-research-chart
description: "机构研报风格图表生成器 (navy+coral, Exhibit N 标题)。触发：gs-chart/研报chart/PE band/画PE/画估值带/画K线/drawdown/rebased perf/revenue yoy"
---

# gs-research-chart

机构研报风格图表生成器。Navy + coral 配色，Exhibit N:... 标题格式。

## 图表类型

| 类型 | 触发词 | 说明 |
|------|--------|------|
| PE Band | PE band/画PE/画估值带 | 历史 PE 均值±标准差带 |
| K线 | 画K线 | OHLC + 成交量 |
| Drawdown | drawdown | 最大回撤时序图 |
| Rebased Performance | rebased perf | 多股归一化对比 |
| Revenue YoY | revenue yoy/季度营收 | 营收同比柱状图 |
| Excess Return | excess return | 相对基准超额收益 |

## 用法

通过 Bash 调用 Python + matplotlib 生成 PNG/SVG 图表。数据来自 yfinance 或用户提供的数据。输出到 Vault 或当前目录。

## 自定义

完整版（含更多图表类型、自动数据拉取、批量生成）放到 `~/.claude/skills/gs-research-chart/`。
