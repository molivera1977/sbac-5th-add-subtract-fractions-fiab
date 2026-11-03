# The tab icon: "Mrs." over "O" in the cover title's font and blue (Lexend 700, --pd #1e40af, -0.03em),
# on a white tile so it shows on dark tabs too. One line ("Mrs. O") was tried 11/2: at 16 px it is a smudge.
#   python3 tools/make-icon.py      → icons/favicon.svg, icons/favicon-32.png, icons/apple-touch-icon.png
# Bump ?v= on the three <link>s in index.html after a change.
import os, re, tempfile, urllib.request
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.boundsPen import BoundsPen
from PIL import Image, ImageDraw, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, '..', 'icons')
BLUE, TILE = '#1e40af', '#ffffff'
LINES = ['Mrs.', 'O']
TRACK, CAP, PAD, GAP = -30, 700, 6, 0.3  # font units (1000 upm); PAD + line gap in a 100-unit square

css = urllib.request.urlopen('https://fonts.googleapis.com/css2?family=Lexend:wght@700&text=Mrs.O').read().decode()
font_file = os.path.join(tempfile.mkdtemp(), 'lexend-700.ttf')
urllib.request.urlretrieve(re.search(r'url\((https://fonts\.gstatic\.com[^)]+)\)', css).group(1), font_file)
f = TTFont(font_file)
gs, cmap, hm = f.getGlyphSet(), f.getBestCmap(), f['hmtx']

def run(text):
    """Each letter and where it starts, in font units."""
    x, out = 0, []
    for ch in text:
        out.append((ch, cmap[ord(ch)], x))
        x += hm[cmap[ord(ch)]][0] + TRACK
    return out

def draw(pen, letters, dx, dy, s):
    for _, g, x in letters:
        gs[g].draw(TransformPen(pen, (s, 0, 0, -s, dx + x * s, dy)))

def ink(letters):
    bp = BoundsPen(gs)
    draw(bp, letters, 0, 0, 1)
    return bp.bounds

runs = [run(t) for t in LINES]
s = (100 - 2 * PAD) / max(ink(r)[2] - ink(r)[0] for r in runs)
tall = CAP * s * len(runs) + CAP * s * GAP * (len(runs) - 1)
if tall > 100 - 2 * PAD:
    s *= (100 - 2 * PAD) / tall
    tall = 100 - 2 * PAD
placed, y = [], (100 - tall) / 2  # (letters, left, baseline) in the 100-unit square
for r in runs:
    x0, _, x1, _ = ink(r)
    y += CAP * s
    placed.append((r, 50 - (x0 + x1) * s / 2, y))
    y += CAP * s * GAP

os.makedirs(OUT, exist_ok=True)
pen = SVGPathPen(gs, ntos=lambda v: ('%.2f' % v).rstrip('0').rstrip('.'))
for r, left, base in placed:
    draw(pen, r, left, base, s)
with open(os.path.join(OUT, 'favicon.svg'), 'w') as fh:
    fh.write(f"<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'>"
             f"<rect width='100' height='100' rx='20' fill='{TILE}'/>"
             f"<path fill='{BLUE}' d='{pen.getCommands()}'/></svg>\n")

def png(size, name, rounded):
    """Drawn 8× bigger, then shrunk, so the edges are smooth. iOS rounds its own corners: a square tile there."""
    k = size * 8 / 100
    im = Image.new('RGBA', (size * 8, size * 8), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    d.rounded_rectangle((0, 0, size * 8 - 1, size * 8 - 1), radius=20 * k if rounded else 0, fill=TILE)
    face = ImageFont.truetype(font_file, round(1000 * s * k))
    for r, left, base in placed:
        for ch, _, x in r:
            d.text(((left + x * s) * k, base * k), ch, font=face, fill=BLUE, anchor='ls')
    im.resize((size, size), Image.LANCZOS).save(os.path.join(OUT, name))

png(32, 'favicon-32.png', True)
png(180, 'apple-touch-icon.png', False)
print('icons/: favicon.svg, favicon-32.png, apple-touch-icon.png · cap height', round(CAP * s, 1), 'of 100')
