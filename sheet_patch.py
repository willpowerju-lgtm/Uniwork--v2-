#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
sheet_patch.py — 无损单元格回写（保真编辑 .xlsx）。

为什么存在：浏览器里 Luckysheet 可编辑，但旧的回写用 SheetJS 从内存值重建整个
workbook，丢样式/数字格式/合并/列宽/批注/图表/customXml/calcChain，并把字符串内联化
（实测 1.7MB 原模型被改写成 5.96MB 空壳）。本脚本只改“被编辑到的那几个单元格”所在
worksheet 的 XML，其余 zip part（sharedStrings/styles/customXml/comments/drawings/
printerSettings/calcChain…）逐字节原样拷贝 → 真正无损。

用法：
    python3 sheet_patch.py <xlsx_path> <edits_json_path>

edits_json 结构（r/c 为 0-based，对齐 Luckysheet）：
    {"edits":[
        {"sheet":"Model","r":2,"c":2,"t":"n","v":223.5},          # 数字
        {"sheet":"Model","r":0,"c":0,"t":"s","v":"NVIDIA Corp"},   # 文本（写 inlineStr，不动 sharedStrings）
        {"sheet":"Model","r":4,"c":3,"t":"f","f":"C5*1.1"},        # 公式（去掉前导 =；Excel/Luckysheet 重载重算）
        {"sheet":"Model","r":9,"c":1,"t":"empty"}                  # 清空（保留样式）
    ]}

输出：stdout 一行 JSON {"ok":bool,"applied":int,"errors":[...]}；原地原子替换文件。
"""
import sys, io, os, re, json, zipfile, shutil, tempfile
import xml.etree.ElementTree as ET
from xml.sax.saxutils import escape as _xml_escape

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

MAIN_NS = 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'
PKG_REL_NS = 'http://schemas.openxmlformats.org/package/2006/relationships'
DOC_REL_NS = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships'


def col_letter(c0: int) -> str:
    s = ''
    c = c0 + 1
    while c > 0:
        c, r = divmod(c - 1, 26)
        s = chr(65 + r) + s
    return s


def addr(r0: int, c0: int) -> str:
    return f'{col_letter(c0)}{r0 + 1}'


def col_index_from_addr(a: str) -> int:
    m = re.match(r'([A-Z]+)\d+', a)
    letters = m.group(1)
    n = 0
    for ch in letters:
        n = n * 26 + (ord(ch) - 64)
    return n - 1


def sheet_name_to_part(zf: zipfile.ZipFile) -> dict:
    """workbook.xml + workbook.xml.rels → {sheet_name: 'xl/worksheets/sheetN.xml'}"""
    wb = zf.read('xl/workbook.xml')
    rels = zf.read('xl/_rels/workbook.xml.rels')
    rid_to_target = {}
    for rel in ET.fromstring(rels):
        rid = rel.get('Id'); tgt = rel.get('Target')
        if rid and tgt:
            # 规范化为 xl/ 下的完整路径
            t = tgt.lstrip('/')
            if not t.startswith('xl/'):
                t = 'xl/' + t
            rid_to_target[rid] = t
    out = {}
    root = ET.fromstring(wb)
    sheets = root.find(f'{{{MAIN_NS}}}sheets')
    for sh in sheets:
        name = sh.get('name')
        rid = sh.get(f'{{{DOC_REL_NS}}}id')
        if name and rid in rid_to_target:
            out[name] = rid_to_target[rid]
    return out


def build_cell_xml(a: str, s_attr: str, e: dict) -> str:
    t = e.get('t')
    if t == 'n':
        v = e.get('v')
        if isinstance(v, float) and v.is_integer():
            v = int(v)
        return f'<c r="{a}"{s_attr}><v>{v}</v></c>'
    if t == 'f':
        f = str(e.get('f', '')).lstrip('=')
        return f'<c r="{a}"{s_attr}><f>{_xml_escape(f)}</f></c>'
    if t == 'empty':
        return f'<c r="{a}"{s_attr}/>'
    # default: string → inlineStr（不触碰 sharedStrings.xml）
    txt = '' if e.get('v') is None else str(e.get('v'))
    return f'<c r="{a}"{s_attr} t="inlineStr"><is><t xml:space="preserve">{_xml_escape(txt)}</t></is></c>'


def patch_sheet_text(text: str, edits: list, errors: list) -> tuple:
    """对单个 worksheet XML 文本应用 edits，返回 (new_text, applied)。仅触碰目标单元格。"""
    applied = 0
    for e in edits:
        a = addr(e['r'], e['c'])
        # 精确匹配 <c r="A1" ...>(...)</c> 或自闭合 <c r="A1" .../>；r="A1" 后必跟引号→A10 不会误匹配
        pat = re.compile(r'<c r="' + re.escape(a) + r'"([^>]*?)(?:/>|>.*?</c>)', re.S)
        m = pat.search(text)
        if m:
            attrs = m.group(1)
            sm = re.search(r'\ss="(\d+)"', attrs)
            s_attr = f' s="{sm.group(1)}"' if sm else ''
            text = text[:m.start()] + build_cell_xml(a, s_attr, e) + text[m.end():]
            applied += 1
        else:
            ok = _insert_cell(text, a, e)
            if ok is None:
                errors.append(f'{e.get("sheet")}!{a}: 行/单元格不存在且插入失败')
            else:
                text = ok
                applied += 1
    return text, applied


def _insert_cell(text: str, a: str, e: dict):
    """目标单元格不存在 → 在对应 <row> 内按列序插入；行不存在 → 在 <sheetData> 内按行序插入。"""
    r1 = int(re.match(r'[A-Z]+(\d+)', a).group(1))
    cidx = col_index_from_addr(a)
    newcell = build_cell_xml(a, '', e)
    # 找该行
    rowpat = re.compile(r'<row r="' + str(r1) + r'"([^>]*?)(/>|>)', re.S)
    rm = rowpat.search(text)
    if rm:
        if rm.group(2) == '/>':
            # 自闭合空行 → 展开为含该 cell 的行
            open_tag = f'<row r="{r1}"{rm.group(1)}>'
            return text[:rm.start()] + open_tag + newcell + '</row>' + text[rm.end():]
        # 普通行：取出行体，在列序位置插入
        body_start = rm.end()
        body_end = text.find('</row>', body_start)
        if body_end < 0:
            return None
        body = text[body_start:body_end]
        insert_at = len(body)  # 默认追加到行尾
        for cm in re.finditer(r'<c r="([A-Z]+\d+)"', body):
            if col_index_from_addr(cm.group(1)) > cidx:
                insert_at = cm.start()
                break
        new_body = body[:insert_at] + newcell + body[insert_at:]
        return text[:body_start] + new_body + text[body_end:]
    # 行不存在 → 在 sheetData 内按行序插入新行
    sd = re.search(r'<sheetData\s*/>', text)
    if sd:
        return text[:sd.start()] + f'<sheetData><row r="{r1}">{newcell}</row></sheetData>' + text[sd.end():]
    sd_open = re.search(r'<sheetData[^>]*>', text)
    if not sd_open:
        return None
    body_start = sd_open.end()
    body_end = text.find('</sheetData>', body_start)
    if body_end < 0:
        return None
    body = text[body_start:body_end]
    insert_at = len(body)
    for rmt in re.finditer(r'<row r="(\d+)"', body):
        if int(rmt.group(1)) > r1:
            insert_at = rmt.start()
            break
    new_row = f'<row r="{r1}">{newcell}</row>'
    new_body = body[:insert_at] + new_row + body[insert_at:]
    return text[:body_start] + new_body + text[body_end:]


def main():
    if len(sys.argv) < 3:
        print(json.dumps({'ok': False, 'errors': ['usage: sheet_patch.py <xlsx> <edits.json>']}))
        return
    xlsx, edits_path = sys.argv[1], sys.argv[2]
    errors = []
    try:
        with open(edits_path, 'r', encoding='utf-8') as fh:
            edits = json.load(fh).get('edits', [])
    except Exception as ex:
        print(json.dumps({'ok': False, 'errors': [f'读取 edits 失败: {ex}']})); return
    if not edits:
        print(json.dumps({'ok': True, 'applied': 0, 'errors': []})); return

    try:
        zin = zipfile.ZipFile(xlsx, 'r')
    except Exception as ex:
        print(json.dumps({'ok': False, 'errors': [f'打开 xlsx 失败: {ex}']})); return

    with zin:
        try:
            name2part = sheet_name_to_part(zin)
        except Exception as ex:
            print(json.dumps({'ok': False, 'errors': [f'解析 workbook 结构失败: {ex}']})); return

        # 按 worksheet part 分组 edits
        by_part = {}
        for e in edits:
            part = name2part.get(e.get('sheet'))
            if not part:
                errors.append(f'找不到 sheet「{e.get("sheet")}」'); continue
            by_part.setdefault(part, []).append(e)

        patched = {}
        applied_total = 0
        for part, es in by_part.items():
            raw = zin.read(part)
            txt = raw.decode('utf-8')
            new_txt, applied = patch_sheet_text(txt, es, errors)
            # 校验改后 sheet XML 良构
            try:
                ET.fromstring(new_txt)
            except ET.ParseError as pe:
                print(json.dumps({'ok': False, 'errors': [f'{part} 改后 XML 非法: {pe}'] + errors})); return
            patched[part] = new_txt.encode('utf-8')
            applied_total += applied

        if applied_total == 0:
            print(json.dumps({'ok': False, 'applied': 0, 'errors': errors or ['没有可应用的改动']})); return

        # 写临时 zip：被改 part 用新内容，其余逐字节拷贝
        fd, tmp = tempfile.mkstemp(suffix='.xlsx', dir=os.path.dirname(os.path.abspath(xlsx)))
        os.close(fd)
        try:
            with zipfile.ZipFile(tmp, 'w', zipfile.ZIP_DEFLATED) as zout:
                for item in zin.infolist():
                    data = patched.get(item.filename)
                    if data is None:
                        data = zin.read(item.filename)        # 原样字节
                    # 保留原压缩类型与外部属性，避免奇怪的兼容问题
                    zi = zipfile.ZipInfo(item.filename, date_time=item.date_time)
                    zi.compress_type = item.compress_type
                    zi.external_attr = item.external_attr
                    zi.internal_attr = item.internal_attr
                    zi.create_system = item.create_system
                    zout.writestr(zi, data)
        except Exception as ex:
            try: os.remove(tmp)
            except OSError: pass
            print(json.dumps({'ok': False, 'errors': [f'写临时文件失败: {ex}'] + errors})); return

    # zin 已关闭。校验 zip 完整性后原子替换
    try:
        with zipfile.ZipFile(tmp, 'r') as zt:
            bad = zt.testzip()
            if bad is not None:
                raise RuntimeError(f'zip 校验失败: {bad}')
    except Exception as ex:
        try: os.remove(tmp)
        except OSError: pass
        print(json.dumps({'ok': False, 'errors': [f'输出校验失败: {ex}'] + errors})); return

    os.replace(tmp, xlsx)
    print(json.dumps({'ok': True, 'applied': applied_total, 'errors': errors}, ensure_ascii=False))


if __name__ == '__main__':
    main()
