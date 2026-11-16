import re
from pathlib import Path
from urllib.parse import unquote

BASE = Path(__file__).resolve().parents[1]
HREF = re.compile(r'(?:href|src)="([^"]+)"')
ANCHOR_ID = re.compile(r'\bid="([^"]+)"')
ANCHOR_NAME = re.compile(r'<a\b[^>]*\sname="([^"]+)"', re.I)
SKIP = ("http://", "https://", "mailto:", "data:", "javascript:", "tel:")

bad_files = []
bad_anchors = []
files_total = 0
anchors_total = 0
ids_cache = {}


def ids_of(path):
    if path not in ids_cache:
        txt = path.read_text(encoding="utf-8")
        ids_cache[path] = set(ANCHOR_ID.findall(txt)) | set(ANCHOR_NAME.findall(txt))
    return ids_cache[path]


for page in sorted(BASE.rglob("*.html")):
    rel_page = str(page.relative_to(BASE))
    for raw in HREF.findall(page.read_text(encoding="utf-8")):
        if raw.startswith(SKIP):
            continue
        clean, _, fragment = raw.partition("#")
        clean = unquote(clean.split("?")[0])
        target = (page.parent / clean).resolve() if clean else page

        if clean:
            files_total += 1
            if not target.exists():
                bad_files.append((rel_page, raw))
                continue

        if not fragment:
            continue
        # Âncoras só são verificáveis em HTML; markdown/JSON não expõem ids.
        if target.suffix.lower() not in (".html", ".htm"):
            continue
        anchors_total += 1
        if unquote(fragment) not in ids_of(target):
            bad_anchors.append((rel_page, raw))

print(f"Links locais (arquivos): {files_total} | quebrados: {len(bad_files)}")
for p, raw in bad_files[:80]:
    print(f"  {p} -> {raw}")
print(f"Âncoras locais: {anchors_total} | quebradas: {len(bad_anchors)}")
for p, raw in bad_anchors[:80]:
    print(f"  {p} -> {raw}")
