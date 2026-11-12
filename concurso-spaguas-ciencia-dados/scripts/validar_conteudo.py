import re
import sys
from pathlib import Path

BASE = Path(__file__).resolve().parents[1]
CONTEUDO = BASE / "conteudo"
DISCIPLINAS = {"g1", "g2", "g3", "g4", "s1", "s2", "s3", "s4"}
SECOES = ["## 1. Essencial", "## 2. Quadro", "## 3. Pegadinha", "## 4. Macete", "## 5. Questões", "## 6. Flashcards", "## 7. Fontes"]

FRONT = re.compile(r"^---\n(.*?)\n---\n", re.S)
QRE = re.compile(r"### Q\d+.*?\n(.*?)(?=### Q\d+|\n## 6\.|\Z)", re.S)
URLRE = re.compile(r"https?://[^\s\)\]]+")


def check_file(path: Path):
    erros = []
    txt = path.read_text(encoding="utf-8")
    m = FRONT.search(txt)
    if not m:
        return ["frontmatter ausente"]
    front = m.group(1)
    campos = dict(re.findall(r"^(\w+):\s*(.+)$", front, re.M))
    for c in ["id", "titulo", "disciplina", "modulo", "item_edital", "tempo", "nivel"]:
        if c not in campos:
            erros.append(f"frontmatter sem {c}")
    if campos.get("id") != path.stem:
        erros.append(f"id {campos.get('id')} != arquivo {path.stem}")
    if campos.get("disciplina") != path.parent.name:
        erros.append(f"disciplina {campos.get('disciplina')} != pasta {path.parent.name}")
    for s in SECOES:
        if s not in txt:
            erros.append(f"seção ausente: {s}")
    nq = len(re.findall(r"^### Q\d+", txt, re.M))
    if nq != 3:
        erros.append(f"{nq} questões (esperado 3)")
    gab = re.findall(r"\*\*Gabarito:\*\*\s*([A-E])", txt)
    if len(gab) != nq:
        erros.append(f"{len(gab)} gabaritos para {nq} questões")
    com = re.findall(r"\*\*Comentário:\*\*", txt)
    if len(com) != nq:
        erros.append(f"{len(com)} comentários para {nq} questões")
    for i, bloco in enumerate(QRE.findall(txt), 1):
        alts = re.findall(r"^([A-E])\)", bloco, re.M)
        if len(alts) != 5:
            erros.append(f"Q{i}: {len(alts)} alternativas (esperado 5)")
    cards = re.findall(r"^- P: .+\| R: .+$", txt, re.M)
    if len(cards) < 3:
        erros.append(f"{len(cards)} flashcards (mínimo 3)")
    urls = URLRE.findall(txt)
    if len(urls) < 2:
        erros.append(f"{len(urls)} URLs (mínimo 2)")
    palavras = len(re.sub(r"```.*?```", "", txt, flags=re.S).split())
    if palavras < 350:
        erros.append(f"texto curto: {palavras} palavras")
    if palavras > 1400:
        erros.append(f"texto longo: {palavras} palavras")
    if "TODO" in txt or "Lorem" in txt or "{{" in txt:
        erros.append("placeholder encontrado")
    return erros


def main():
    arquivos = sorted(p for p in CONTEUDO.glob("*/*.md") if not p.name.startswith("_"))
    if not arquivos:
        print("Nenhum arquivo de conteúdo encontrado.")
        return 1
    total_erros = 0
    for p in arquivos:
        erros = check_file(p)
        if erros:
            total_erros += len(erros)
            print(f"\n[{p.parent.name}/{p.name}]")
            for e in erros:
                print("  -", e)
    print(f"\nArquivos: {len(arquivos)} | Erros: {total_erros}")
    return 1 if total_erros else 0


if __name__ == "__main__":
    sys.exit(main())
