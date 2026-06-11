---
name: ak-xq-router
description: "A股港股数据路由(AKShare+雪球+Consensus)：筹码/资金/北向/EPS预测/Fwd PE。触发：拉AK/雪球/consensus/分析师预期/Fwd PE"
---

# ak-xq-router

A股/港股数据获取统一路由。

## 能力

| 模块 | 数据 | 触发词 |
|------|------|--------|
| Consensus | EPS/NI/Revenue 预测, Fwd PE | 拉consensus/拉EPS预测/分析师预期/Fwd PE |
| 个股 | 筹码/资金流/融资融券/K线 | 拉雪球数据/筹码结构/资金流 |
| 板块 | 板块轮动/概念涨跌榜/北向 | 板块轮动/北向资金 |

## 用法

通过 Bash 调用 Python 脚本，从 AKShare 或雪球 API 拉取数据。

**A股/港股 Fwd PE 必须走本 skill 的 consensus 模块**，禁止用 yfinance.forwardEps（A股返 USD 失真）。

## 自定义

如需完整版（含 XQ token 管理、批量拉取、自动缓存），将你的完整 skill 放到 `~/.claude/skills/ak-xq-router/`，会自动覆盖本入口。
