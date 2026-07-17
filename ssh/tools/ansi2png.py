#!/usr/bin/env python3
"""Render a tmux `capture-pane -e` ANSI dump to PNG so it can be inspected.

Half-blocks (▀ ▄ █) are drawn as exact pixel pairs; every other glyph is
drawn with a monospace TTF over its background color.

usage: ansi2png.py input.txt output.png [cell_w cell_h]
"""
import sys
import re
from PIL import Image, ImageDraw, ImageFont

CUBE = [0, 95, 135, 175, 215, 255]

def color256(n):
    if n < 16:
        base = [
            (0,0,0),(205,0,0),(0,205,0),(205,205,0),(0,0,238),(205,0,205),(0,205,205),(229,229,229),
            (127,127,127),(255,0,0),(0,255,0),(255,255,0),(92,92,255),(255,0,255),(0,255,255),(255,255,255)]
        return base[n]
    if n < 232:
        n -= 16
        return (CUBE[n//36], CUBE[(n//6)%6], CUBE[n%6])
    v = 8 + (n-232)*10
    return (v,v,v)

DEFAULT_FG = (242,237,228)
DEFAULT_BG = (13,22,38)

def parse(path):
    text = open(path, encoding='utf-8', errors='replace').read()
    rows = []
    # SGR state persists across lines: tmux capture-pane emits one stream.
    fg, bg = DEFAULT_FG, DEFAULT_BG
    bold = False
    for line in text.split('\n'):
        cells = []
        i = 0
        while i < len(line):
            ch = line[i]
            if ch == '\x1b':
                m = re.match(r'\x1b\[([0-9;]*)m', line[i:])
                if m:
                    params = [int(p) if p else 0 for p in m.group(1).split(';')] or [0]
                    j = 0
                    while j < len(params):
                        p = params[j]
                        if p == 0:
                            fg, bg, bold = DEFAULT_FG, DEFAULT_BG, False
                        elif p == 1:
                            bold = True
                        elif p == 22:
                            bold = False
                        elif p in (38, 48):
                            if j+1 < len(params) and params[j+1] == 2 and j+4 < len(params):
                                col = tuple(params[j+2:j+5])
                                if p == 38: fg = col
                                else: bg = col
                                j += 4
                            elif j+1 < len(params) and params[j+1] == 5 and j+2 < len(params):
                                col = color256(params[j+2])
                                if p == 38: fg = col
                                else: bg = col
                                j += 2
                        elif 30 <= p <= 37: fg = color256(p-30)
                        elif 90 <= p <= 97: fg = color256(p-90+8)
                        elif 40 <= p <= 47: bg = color256(p-40)
                        elif 100 <= p <= 107: bg = color256(p-100+8)
                        elif p == 39: fg = DEFAULT_FG
                        elif p == 49: bg = DEFAULT_BG
                        elif p == 7: fg, bg = bg, fg
                        j += 1
                    i += m.end()
                    continue
                # other escape (cursor etc.) — skip to letter
                m2 = re.match(r'\x1b\[[0-9;?]*[A-Za-z]', line[i:])
                i += m2.end() if m2 else 1
                continue
            cells.append((ch, fg, bg, bold))
            i += 1
        rows.append(cells)
    while rows and not rows[-1]:
        rows.pop()
    return rows

def render(rows, out, cw=10, chh=20):
    ncols = max((len(r) for r in rows), default=80)
    nrows = len(rows)
    img = Image.new('RGB', (ncols*cw, nrows*chh), DEFAULT_BG)
    d = ImageDraw.Draw(img)
    try:
        font = ImageFont.truetype('DejaVuSansMono.ttf', chh-4)
        fontb = ImageFont.truetype('DejaVuSansMono-Bold.ttf', chh-4)
    except Exception:
        font = fontb = ImageFont.load_default()
    for y, row in enumerate(rows):
        for x, (ch, fg, bg, bold) in enumerate(row):
            x0, y0 = x*cw, y*chh
            if ch == '▀':
                d.rectangle([x0, y0, x0+cw-1, y0+chh//2-1], fill=fg)
                d.rectangle([x0, y0+chh//2, x0+cw-1, y0+chh-1], fill=bg)
            elif ch == '▄':
                d.rectangle([x0, y0, x0+cw-1, y0+chh//2-1], fill=bg)
                d.rectangle([x0, y0+chh//2, x0+cw-1, y0+chh-1], fill=fg)
            elif ch == '█':
                d.rectangle([x0, y0, x0+cw-1, y0+chh-1], fill=fg)
            elif ch == '▌':
                d.rectangle([x0, y0, x0+cw-1, y0+chh-1], fill=bg)
                d.rectangle([x0, y0, x0+cw//2-1, y0+chh-1], fill=fg)
            else:
                d.rectangle([x0, y0, x0+cw-1, y0+chh-1], fill=bg)
                if ch.strip():
                    d.text((x0, y0), ch, fill=fg, font=fontb if bold else font)
    img.save(out)
    print(f'wrote {out} ({ncols}x{nrows} cells)')

if __name__ == '__main__':
    inp, outp = sys.argv[1], sys.argv[2]
    cw = int(sys.argv[3]) if len(sys.argv) > 3 else 10
    chh = int(sys.argv[4]) if len(sys.argv) > 4 else 20
    render(parse(inp), outp, cw, chh)
