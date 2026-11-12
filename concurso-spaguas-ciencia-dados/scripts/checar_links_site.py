import re
from pathlib import Path
from urllib.parse import urlparse

BASE = Path(__file__).resolve().parents[1]
HREF = re.compile(r'(?:href|src)="([^"]+)"')
bad = []
total = 0
for p in BASE.rglob("*.html"):
    txt = p.read_text(encoding="utf-8")
    for raw in HREF.findall(txt):
        if raw.startswith(("http://", "https://", "mailto:", "data:", "#")):
            continue
        total += 1
        clean = raw.split("#")[0].split("?")[0]
        if not clean:
            continue
        target = (p.parent / clean).resolve()
        if not target.exists():
            bad.append((str(p.relative_to(BASE)), raw))
print(f"Links locais verificados: {total} | quebrados: {len(bad)}")
for p, raw in bad[:80]:
    print(f"  {p} -> {raw}")
