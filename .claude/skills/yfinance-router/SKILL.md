---
name: yfinance-router
description: "yfinance 股票数据路由：股价/PE/市值/EPS/分红/历史K线。触发：查股价/查PE/查市值/stock price/yfinance/get quote"
---

# yfinance-router

通过 Python yfinance 库获取全球股票实时和历史数据。

## 能力

| 数据 | 示例 | 说明 |
|------|------|------|
| 实时行情 | 现价/涨跌/成交量 | `yf.Ticker('AAPL').info` |
| 估值 | PE/PB/市值/EV | trailing + forward |
| 财务 | EPS/Revenue/Net Income | 季度+年度 |
| 历史 | K线/收盘价序列 | `history(period='1y')` |
| 分红 | 股息率/分红历史 | `dividends` |
| 持仓 | 机构持仓比例 | `institutional_holders` |

## 用法

```python
import yfinance as yf
t = yf.Ticker('AAPL')
t.info['currentPrice']      # 实时价
t.info['trailingPE']        # PE
t.history(period='1y')      # 历史K线
```

## 注意

- **美股/ADR**：yfinance 数据完整，推荐使用
- **A股/港股**：forwardEps 返回 USD（A股会 ×6 失真），Fwd PE 必须走 `/ak-xq-router`
- 安装：`pip install yfinance`（如未安装，Bash 中 `pip install yfinance` 即可）

## 自定义

如需封装更复杂的数据管道（批量拉取、自动缓存、定时刷新），放到 `~/.claude/skills/yfinance-router/`。
