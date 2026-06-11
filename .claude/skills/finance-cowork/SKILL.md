---
name: finance-cowork
description: "公司wiki协作研究流水线（wiki build/report/cascade）。触发：建wiki/出研报/级联更新/model digest/解析Excel模型"
---

# finance-cowork

公司维基协作研究流水线，三模块闭环。

## 模块

| 模块 | 功能 | 触发词 |
|------|------|--------|
| Wiki Build | 从零建公司wiki（14段schema）+ 解析Excel模型 | 建wiki/build holdings page/model digest/读model |
| Report | 基于wiki出研报 + 版本管理 | 出研报/做report/wiki转word/版本回滚 |
| Cascade | 改model后自动刷新下游报告 | 级联更新/cascade/下修假设反向更新 |

## 用法

Wiki 的结构化数据走 `_data_registry.json`，叙述性内容 LLM 直写 md。报告支持 docx/md/xlsx/pptx 四格式输出，git 版本控制。

## Vault 约定

- `WIKI/<公司>.md` — 一页纸公司 wiki
- `Vault/Company Coverage/<公司>/` — 研报/季报年报/Model/News/Raw 五子目录
- `Vault/Industry Coverage/` — 行业级笔记

## 自定义

完整版（含 COM 重算引擎、漂移闸、人确认流程）放到 `~/.claude/skills/finance-cowork/`。
