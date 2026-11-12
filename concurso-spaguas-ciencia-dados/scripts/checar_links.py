import concurrent.futures as cf
import urllib.request
import urllib.error
from pathlib import Path

BASE = Path(__file__).resolve().parents[1]
urls = [u.strip() for u in (BASE / "dados" / "urls_conteudo.txt").read_text(encoding="utf-8").splitlines() if u.strip()]
UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124 Safari/537.36"


def check(url):
    req = urllib.request.Request(url, headers={"User-Agent": UA}, method="GET")
    try:
        with urllib.request.urlopen(req, timeout=15) as r:
            return url, r.status
    except urllib.error.HTTPError as e:
        return url, e.code
    except Exception as e:
        return url, type(e).__name__


resultados = []
with cf.ThreadPoolExecutor(max_workers=10) as ex:
    for url, status in ex.map(check, urls):
        resultados.append((url, status))

ruins = [(u, s) for u, s in resultados if s != 200]
print(f"Verificadas: {len(resultados)} | OK: {len(resultados)-len(ruins)} | problemas: {len(ruins)}")
for u, s in ruins:
    print(s, u)
(BASE / "dados" / "links_status.txt").write_text("\n".join(f"{s}\t{u}" for u, s in resultados), encoding="utf-8")
