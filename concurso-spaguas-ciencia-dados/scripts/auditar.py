import json
import re
import sys
from collections import Counter, defaultdict
from pathlib import Path

BASE = Path(__file__).resolve().parents[1]
CONTEUDO = BASE / "conteudo"
DADOS = BASE / "dados"

URLRE = re.compile(r"https?://[^\s\)\]<>\"']+")
QRE = re.compile(r"### Q\d+.*?\n(.*?)(?=### Q\d+|\n## 6\.|\Z)", re.S)


def main():
    aulas = json.load(open(DADOS / "curriculo.json", encoding="utf-8"))
    esperadas = []
    for d in aulas["disciplinas"]:
        for m in d["modulos"]:
            for a in m["aulas"]:
                esperadas.append(a["id"])
    arquivos = {p.stem: p for p in CONTEUDO.glob("*/*.md") if not p.name.startswith("_")}
    faltando = [a for a in esperadas if a not in arquivos]
    extras = [a for a in arquivos if a not in esperadas]
    print(f"Aulas esperadas: {len(esperadas)} | arquivos: {len(arquivos)}")
    if faltando:
        print("FALTANDO:", ", ".join(faltando))
    if extras:
        print("EXTRAS:", ", ".join(extras))

    respostas = Counter()
    por_disciplina = defaultdict(Counter)
    stems = defaultdict(list)
    urls = set()
    total_q = 0
    for aid, p in sorted(arquivos.items()):
        txt = p.read_text(encoding="utf-8")
        disc = p.parent.name
        for i, bloco in enumerate(QRE.findall(txt), 1):
            total_q += 1
            g = re.search(r"\*\*Gabarito:\*\*\s*([A-E])", bloco)
            if g:
                respostas[g.group(1)] += 1
                por_disciplina[disc][g.group(1)] += 1
            # canonical stem: first non-empty line after heading
            linhas = [l.strip() for l in bloco.splitlines() if l.strip() and not l.startswith("**")]
            if linhas:
                stem = re.sub(r"\W+", " ", linhas[0].lower()).strip()
                stems[stem].append(f"{aid} Q{i}")
        urls.update(URLRE.findall(txt))

    print(f"Questões: {total_q} | distribuição: {dict(sorted(respostas.items()))}")
    for d, c in sorted(por_disciplina.items()):
        print(f"  {d}: {dict(sorted(c.items()))}")
    dup = {k: v for k, v in stems.items() if len(v) > 1 and len(k) > 20}
    if dup:
        print("Possíveis duplicatas:")
        for k, v in list(dup.items())[:15]:
            print("  -", v, "|", k[:90])
    else:
        print("Nenhuma duplicata exata de enunciado.")
    print(f"URLs únicas: {len(urls)}")
    (DADOS / "urls_conteudo.txt").write_text("\n".join(sorted(urls)), encoding="utf-8")


if __name__ == "__main__":
    main()
