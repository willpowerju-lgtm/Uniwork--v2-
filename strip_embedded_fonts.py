#!/usr/bin/env python3
"""剥离 pptx 嵌入字体（Win PowerPoint 嵌入的字体子集在 Mac PowerPoint 上字形错乱 → 乱码）。
幂等：无 fntdata 时输出 SKIP 退出，不改文件。被 server.mjs 的 open_local 调用。
用法: python3 strip_embedded_fonts.py <file.pptx>
"""
import sys, io, re, zipfile

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

def main():
    path = sys.argv[1]
    zin = zipfile.ZipFile(path, 'r')
    if not any(n.startswith('ppt/fonts/') for n in zin.namelist()):
        print('SKIP')   # 无嵌入字体
        return
    buf = io.BytesIO()
    zout = zipfile.ZipFile(buf, 'w', zipfile.ZIP_DEFLATED)
    for item in zin.namelist():
        if item.startswith('ppt/fonts/'):
            continue
        data = zin.read(item)
        if item == 'ppt/presentation.xml':
            t = data.decode('utf-8')
            t = re.sub(r'<p:embeddedFontLst>.*?</p:embeddedFontLst>', '', t, flags=re.S)
            t = t.replace('embedTrueTypeFonts="1"', '')   # 顺手关掉"保存时嵌入"标志
            data = t.encode('utf-8')
        elif item == 'ppt/_rels/presentation.xml.rels':
            data = re.sub(rb'<Relationship[^>]*fonts/font\d+\.fntdata[^>]*/>', b'', data)
        elif item == '[Content_Types].xml':
            data = re.sub(rb'<Default Extension="fntdata"[^>]*/>', b'', data)
            data = re.sub(rb'<Override[^>]*fntdata[^>]*/>', b'', data)
        zout.writestr(item, data)
    zout.close(); zin.close()
    with open(path, 'wb') as f:
        f.write(buf.getvalue())
    print('STRIPPED')

if __name__ == '__main__':
    main()
