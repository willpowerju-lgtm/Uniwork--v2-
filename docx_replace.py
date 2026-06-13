#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
docx_replace.py — 完整覆盖的 .docx 文本查找/替换。

为什么需要它：python-docx 的常规遍历（document.paragraphs / document.tables）
**只覆盖正文段落和顶层表格**，会漏掉：
  · 嵌套表格（单元格里又套表）
  · 文本框 w:txbxContent / 图形 DrawingML 里的文字
  · 页眉 / 页脚 / 脚注 / 尾注
  · 跨多个 run 被拆开的同一串文字（如 "1,646.54" 被切成 "1," | "646" | ".54"）
这些遗漏正是"全文替换后还残留旧值"的根因。

本脚本在 **XML 层**对所有 w:t（Word 文本）和 a:t（DrawingML 文本）做替换，
按"所属段落"把跨 run 的文字拼起来再换、只改命中那几个 run（保留其余 run 的格式），
并扫描 document / header* / footer* / footnotes / endnotes 全部部件 —— 一处不漏。

用法：
  python docx_replace.py <file.docx> "<旧文本>" "<新文本>"
  python docx_replace.py <file.docx> "<旧文本>" "<新文本>" --dry-run   # 只统计不写盘
输出：JSON {file, old, new, total, by_part}。total==0 时退出码=1（方便调用方发现没命中）。
"""
import sys, io, os, re, json, zipfile, argparse

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

from lxml import etree

W = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'
A = 'http://schemas.openxmlformats.org/drawingml/2006/main'
NS = {'w': W, 'a': A}
WT, WP = f'{{{W}}}t', f'{{{W}}}p'
AT, AP = f'{{{A}}}t', f'{{{A}}}p'

# 哪些部件含正文文字（comments/settings/styles 等不动）
PART_RE = re.compile(r'^word/(document\d*|header\d+|footer\d+|footnotes|endnotes)\.xml$')


def _nearest(el, tag):
    """向上找最近的某 tag 祖先（Clark notation）。"""
    p = el.getparent()
    while p is not None:
        if p.tag == tag:
            return p
        p = p.getparent()
    return None


def _group_by_para(t_elems, ptag):
    """把文本元素按"最近的段落祖先"分组，保持文档顺序。同段的 run 才拼接替换。"""
    groups, order = {}, []
    for t in t_elems:
        p = _nearest(t, ptag)
        key = id(p) if p is not None else ('t', id(t))
        if key not in groups:
            groups[key] = []
            order.append(key)
        groups[key].append(t)
    return [groups[k] for k in order]


def _replace_in_group(ts, old, new):
    """
    在同段的一串文本元素里做 run 感知替换：把各 run 文字拼成整段，
    定位每个匹配跨了哪几个 run，只改这些 run（命中段并入起始 run，沿用其格式），
    其余 run 原样保留。从右往左施工，offset 不串位、new⊇old 也不死循环。
    返回替换次数。
    """
    if not ts:
        return 0
    joined = ''.join((t.text or '') for t in ts)
    starts, i = [], joined.find(old)
    while i >= 0:
        starts.append(i)
        i = joined.find(old, i + len(old))   # 非重叠
    if not starts:
        return 0
    for start in reversed(starts):
        cur = [(t.text or '') for t in ts]
        spans, pos = [], 0
        for tx in cur:
            spans.append((pos, pos + len(tx)))
            pos += len(tx)
        end = start + len(old)

        def frun(p):
            for idx, (a, b) in enumerate(spans):
                if a <= p < b:
                    return idx
            return len(spans) - 1

        si, ei = frun(start), frun(end - 1)
        if si == ei:
            a, _ = spans[si]
            loc = start - a
            ts[si].text = cur[si][:loc] + new + cur[si][loc + len(old):]
        else:
            sa, _ = spans[si]
            ea, _ = spans[ei]
            ts[si].text = cur[si][:start - sa] + new
            for j in range(si + 1, ei):
                ts[j].text = ''
            ts[ei].text = cur[ei][end - ea:]
    return len(starts)


def _process_part(xml_bytes, old, new):
    root = etree.fromstring(xml_bytes)
    total = 0
    for grp in _group_by_para(root.findall('.//w:t', NS), WP):   # Word 文本（含表格/嵌套表/文本框）
        total += _replace_in_group(grp, old, new)
    for grp in _group_by_para(root.findall('.//a:t', NS), AP):   # DrawingML 文本（图形/SmartArt）
        total += _replace_in_group(grp, old, new)
    out = etree.tostring(root, xml_declaration=True, encoding='UTF-8', standalone=True)
    return out, total


def replace(path, old, new, dry_run=False):
    if not old:
        raise ValueError('old text must be non-empty')
    zin = zipfile.ZipFile(path)
    names = zin.namelist()
    by_part, edited, total = {}, {}, 0
    for n in names:
        if PART_RE.match(n):
            out, c = _process_part(zin.read(n), old, new)
            if c > 0:
                edited[n] = out
                by_part[n] = c
                total += c
    result = {'file': path, 'old': old, 'new': new, 'total': total, 'by_part': by_part}
    if dry_run or total == 0:
        zin.close()
        return result
    tmp = path + '.tmp'
    with zipfile.ZipFile(tmp, 'w', zipfile.ZIP_DEFLATED) as zout:
        for n in names:
            info = zin.getinfo(n)
            zout.writestr(info, edited.get(n, zin.read(n)))   # 只换命中部件，其余原样
    zin.close()
    os.replace(tmp, path)
    return result


def main():
    ap = argparse.ArgumentParser(description='Complete-coverage find/replace in a .docx (XML-level).')
    ap.add_argument('file')
    ap.add_argument('old')
    ap.add_argument('new')
    ap.add_argument('--dry-run', action='store_true', help='only count, do not write')
    args = ap.parse_args()
    res = replace(args.file, args.old, args.new, dry_run=args.dry_run)
    print(json.dumps(res, ensure_ascii=False))
    sys.exit(0 if res['total'] > 0 else 1)


if __name__ == '__main__':
    main()
