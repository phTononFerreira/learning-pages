import json
import random
import re
from datetime import date, timedelta
from pathlib import Path

BASE = Path(__file__).resolve().parents[1]
CONTEUDO = BASE / "conteudo"
DADOS = BASE / "dados"

DISC_NAMES = {}
DISC_SLUGS = {}
DISC_AREAS = {}


def esc(s: str) -> str:
    return (s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
            .replace('"', "&quot;"))


def inline_md(s: str) -> str:
    s = esc(s)
    codes = []

    def keep_code(m):
        codes.append(m.group(1))
        return f"\x00CODE{len(codes)-1}\x00"

    s = re.sub(r"`([^`]+)`", keep_code, s)
    s = re.sub(r"\[([^\]]+)\]\((https?://[^\s\)]+)\)",
               r'<a href="\2" target="_blank" rel="noopener">\1</a>', s)
    s = re.sub(r"(?<![\w])(https?://[^\s<]+)", r'<a href="\1" target="_blank" rel="noopener">\1</a>', s)
    s = re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", s)
    s = re.sub(r"(?<![\w*])\*([^*\n]+)\*(?![\w*])", r"<em>\1</em>", s)
    for i, c in enumerate(codes):
        s = s.replace(f"\x00CODE{i}\x00", f"<code>{c}</code>")
    return s


def question_md(s: str) -> str:
    """Renderiza enunciado de questão, preservando blocos de código cercados."""
    parts = re.split(r"(```.*?```)", s, flags=re.S)
    out = []
    for part in parts:
        if part.startswith("```"):
            m = re.match(r"```(\w*)\n?(.*?)```", part, flags=re.S)
            lang = m.group(1) if m else ""
            code = m.group(2) if m else part.strip("`")
            cls = f' class="language-{esc(lang)}"' if lang else ""
            out.append(f"<pre><code{cls}>{esc(code.rstrip())}</code></pre>")
        else:
            out.append(inline_md(part))
    return "".join(out)


def md_to_html(text: str) -> str:
    lines = text.splitlines()
    out = []
    i = 0
    while i < len(lines):
        line = lines[i]
        if line.strip().startswith("```"):
            lang = line.strip()[3:].strip()
            buf = []
            i += 1
            while i < len(lines) and not lines[i].strip().startswith("```"):
                buf.append(lines[i])
                i += 1
            i += 1
            cls = f' class="language-{esc(lang)}"' if lang else ""
            out.append(f"<pre><code{cls}>{esc(chr(10).join(buf))}</code></pre>")
            continue
        if line.strip() == "":
            i += 1
            continue
        if line.startswith("|") and i + 1 < len(lines) and re.match(r"^\|[\s:\-\|]+\|$", lines[i + 1].strip()):
            header = [c.strip() for c in line.strip().strip("|").split("|")]
            i += 2
            rows = []
            while i < len(lines) and lines[i].strip().startswith("|"):
                rows.append([c.strip() for c in lines[i].strip().strip("|").split("|")])
                i += 1
            out.append('<div class="table-wrap"><table><thead><tr>')
            out.extend(f"<th>{inline_md(c)}</th>" for c in header)
            out.append("</tr></thead><tbody>")
            for r in rows:
                out.append("<tr>")
                out.extend(f"<td>{inline_md(c)}</td>" for c in r)
                out.append("</tr>")
            out.append("</tbody></table></div>")
            continue
        m = re.match(r"^(#{1,4})\s+(.*)$", line)
        if m:
            level = len(m.group(1))
            out.append(f"<h{level}>{inline_md(m.group(2))}</h{level}>")
            i += 1
            continue
        if line.startswith("> "):
            buf = []
            while i < len(lines) and lines[i].startswith("> "):
                buf.append(lines[i][2:])
                i += 1
            out.append(f"<blockquote>{inline_md(' '.join(buf))}</blockquote>")
            continue
        if re.match(r"^\s*[-*]\s+", line):
            items = []
            while i < len(lines) and re.match(r"^\s*[-*]\s+", lines[i]):
                items.append(re.sub(r"^\s*[-*]\s+", "", lines[i]))
                i += 1
            out.append("<ul>" + "".join(f"<li>{inline_md(x)}</li>" for x in items) + "</ul>")
            continue
        if re.match(r"^\s*\d+\.\s+", line):
            items = []
            while i < len(lines) and re.match(r"^\s*\d+\.\s+", lines[i]):
                items.append(re.sub(r"^\s*\d+\.\s+", "", lines[i]))
                i += 1
            out.append("<ol>" + "".join(f"<li>{inline_md(x)}</li>" for x in items) + "</ol>")
            continue
        if line.strip() in ("---", "***"):
            out.append("<hr>")
            i += 1
            continue
        buf = [line.strip()]
        i += 1
        while i < len(lines) and lines[i].strip() and not re.match(r"^(#{1,4}\s|>\s|\s*[-*]\s|\s*\d+\.\s|\||```|---|\*\*\*)", lines[i]):
            buf.append(lines[i].strip())
            i += 1
        out.append(f"<p>{inline_md(' '.join(buf))}</p>")
    return "\n".join(out)


def plain(text: str) -> str:
    text = re.sub(r"```.*?```", " ", text, flags=re.S)
    text = re.sub(r"`([^`]+)`", r"\1", text)
    text = re.sub(r"\[([^\]]+)\]\([^\)]+\)", r"\1", text)
    text = re.sub(r"[#>*_|]", " ", text)
    text = re.sub(r"\s+", " ", text)
    return text.strip()


def parse_front(txt: str):
    m = re.match(r"^---\n(.*?)\n---\n", txt, re.S)
    if not m:
        return {}, txt
    raw, body = m.group(1), txt[m.end():]
    data = {}
    for line in raw.splitlines():
        if ":" in line:
            k, v = line.split(":", 1)
            data[k.strip()] = v.strip().strip('"').strip("'")
    return data, body


def split_sections(body: str):
    parts = re.split(r"^## (\d)\. (.+)$", body, flags=re.M)
    intro = parts[0]
    secs = {}
    for i in range(1, len(parts), 3):
        secs[parts[i]] = {"titulo": parts[i + 1], "md": parts[i + 2]}
    return intro, secs


def parse_questions(md: str):
    chunks = re.split(r"^### Q(\d+)\s*[—\-]\s*(.+)$", md, flags=re.M)
    qs = []
    for i in range(1, len(chunks), 3):
        n = int(chunks[i])
        nivel = chunks[i + 1].strip().lower()
        block = chunks[i + 2].strip()
        gm = re.search(r"\*\*Gabarito:\*\*\s*([A-E])", block)
        if not gm:
            continue
        before = block[:gm.start()]
        after = block[gm.end():]
        cm = re.search(r"\*\*Comentário:\*\*\s*(.+)", after, re.S)
        comentario = cm.group(1).strip() if cm else ""
        comentario = re.sub(r"\n{2,}", " ", comentario)
        alt_matches = list(re.finditer(r"^([A-E])\)\s*(.*)$", before, flags=re.M))
        if len(alt_matches) != 5:
            continue
        stem = before[:alt_matches[0].start()].strip()
        alts = {}
        for j, am in enumerate(alt_matches):
            end = alt_matches[j + 1].start() if j + 1 < len(alt_matches) else len(before)
            val = before[am.start():end].strip()
            val = re.sub(r"^[A-E]\)\s*", "", val).strip()
            alts[am.group(1)] = val
        qs.append({"n": n, "nivel": nivel, "enunciado": stem, "alternativas": alts,
                   "gabarito": gm.group(1), "comentario": comentario})
    return qs


def parse_flashcards(md: str):
    cards = []
    for line in md.splitlines():
        m = re.match(r"^-\s*P:\s*(.+?)\s*\|\s*R:\s*(.+)$", line.strip())
        if m:
            cards.append({"pergunta": m.group(1).strip(), "resposta": m.group(2).strip()})
    return cards


def parse_sources(md: str):
    out = []
    for line in md.splitlines():
        line = line.strip()
        if not line.startswith("- "):
            continue
        line = line[2:].strip()
        m = re.match(r"\[([^\]]+)\]\((https?://[^\s\)]+)\)", line)
        if m:
            out.append({"titulo": m.group(1).strip(), "url": m.group(2).strip()})
            continue
        um = re.search(r"(https?://[^\s\)\]<]+)", line)
        if um:
            url = um.group(1).rstrip(".,;")
            label = line[:um.start()].strip(" —-–:;.")
            if not label:
                label = url.split("//")[-1].split("/")[0]
            out.append({"titulo": label, "url": url})
    seen, uniq = set(), []
    for s in out:
        if s["url"] not in seen:
            seen.add(s["url"])
            uniq.append(s)
    if not uniq:
        for m in re.finditer(r"(?<!\()(https?://[^\s\)\]<]+)", md):
            url = m.group(1).rstrip(".,;")
            if url not in seen:
                seen.add(url)
                uniq.append({"titulo": url.split("//")[-1].split("/")[0], "url": url})
    return uniq


def load_curriculum():
    cur = json.load(open(DADOS / "curriculo.json", encoding="utf-8"))
    map_aula = {}
    for d in cur["disciplinas"]:
        DISC_NAMES[d["id"]] = d["nome"]
        DISC_SLUGS[d["id"]] = d["slug"]
        DISC_AREAS[d["id"]] = d["area"]
        for m in d["modulos"]:
            for a in m["aulas"]:
                map_aula[a["id"]] = {"disciplina": d, "modulo": m, "aula": a}
    return cur, map_aula


def load_lessons():
    cur, map_aula = load_curriculum()
    lessons = []
    for path in sorted(CONTEUDO.glob("*/*.md")):
        if path.name.startswith("_"):
            continue
        txt = path.read_text(encoding="utf-8")
        front, body = parse_front(txt)
        intro, secs = split_sections(body)
        title_m = re.search(r"^# (.+)$", intro, flags=re.M)
        title = front.get("titulo") or (title_m.group(1) if title_m else path.stem)
        idea_m = re.search(r">\s*\*\*Ideia central:\*\*\s*(.+)", intro)
        idea = idea_m.group(1).strip() if idea_m else ""
        qs = parse_questions(secs.get("5", {}).get("md", ""))
        cards = parse_flashcards(secs.get("6", {}).get("md", ""))
        sources = parse_sources(secs.get("7", {}).get("md", ""))
        meta = map_aula.get(front.get("id", path.stem), {})
        disc = meta.get("disciplina", {})
        mod = meta.get("modulo", {})
        aula = meta.get("aula", {})
        item = {
            "id": front.get("id", path.stem),
            "titulo": title,
            "disciplina": front.get("disciplina", path.parent.name),
            "disciplina_nome": disc.get("nome", ""),
            "disciplina_slug": disc.get("slug", ""),
            "area": disc.get("area", ""),
            "modulo": front.get("modulo", ""),
            "modulo_nome": mod.get("nome", ""),
            "item_edital": front.get("item_edital", ""),
            "tempo": int(front.get("tempo", 40)),
            "nivel": front.get("nivel", "essencial"),
            "objetivos": aula.get("objetivos", []),
            "idea": idea,
            "intro_md": intro,
            "secs": {k: v["md"] for k, v in secs.items()},
            "secs_titulos": {k: v["titulo"] for k, v in secs.items()},
            "questions": qs,
            "cards": cards,
            "sources": sources,
            "path": str(path),
        }
        item["texto"] = plain(title + " " + idea + " " + " ".join(v["md"] for v in secs.values()))
        lessons.append(item)
    return cur, lessons


def build_questions(lessons):
    out = []
    for l in lessons:
        for q in l["questions"]:
            out.append({
                "id": f"q-{l['id']}-{q['n']}",
                "aula_id": l["id"],
                "aula_titulo": l["titulo"],
                "disciplina": l["disciplina"],
                "disciplina_nome": l["disciplina_nome"],
                "nivel": q["nivel"],
                "enunciado": q["enunciado"],
                "alternativas": q["alternativas"],
                "gabarito": q["gabarito"],
                "comentario": q["comentario"],
            })
    return out


def build_flashcards(lessons):
    out = []
    for l in lessons:
        for i, c in enumerate(l["cards"], 1):
            out.append({
                "id": f"f-{l['id']}-{i}",
                "aula_id": l["id"],
                "aula_titulo": l["titulo"],
                "disciplina": l["disciplina"],
                "disciplina_nome": l["disciplina_nome"],
                "pergunta": c["pergunta"],
                "resposta": c["resposta"],
            })
    return out


def build_simulados(questions, lessons):
    by_disc = {}
    for q in questions:
        by_disc.setdefault(q["disciplina"], []).append(q["id"])
    geral = [q["id"] for q in questions if q["disciplina"].startswith("g")]
    espec = [q["id"] for q in questions if q["disciplina"].startswith("s")]

    def sample(pool, n, seed):
        r = random.Random(seed)
        return r.sample(pool, min(n, len(pool)))

    def strat(pool, alloc, seed):
        r = random.Random(seed)
        out = []
        for disc, n in alloc.items():
            ids = [qid for qid in pool if qid.startswith(f"q-{disc}-")]
            out += r.sample(ids, min(n, len(ids)))
        r.shuffle(out)
        return out

    sims = [{
        "id": "diagnostico",
        "titulo": "Diagnóstico inicial",
        "descricao": "20 questões misturadas para medir seu ponto de partida. Use o modo estudo para feedback imediato.",
        "tipo": "diagnostico",
        "tempo_min": 30,
        "questoes": strat(geral, {"g1": 3, "g2": 3, "g3": 2, "g4": 2}, 11)
                     + strat(espec, {"s1": 3, "s2": 3, "s3": 2, "s4": 2}, 12),
    }]
    for d in ["g1", "g2", "g3", "g4", "s1", "s2", "s3", "s4"]:
        if d in by_disc:
            sims.append({
                "id": f"disc-{d}",
                "titulo": f"Simulado — {DISC_NAMES.get(d, d)}",
                "descricao": f"Todas as {len(by_disc[d])} questões desta disciplina, no estilo FGV.",
                "tipo": "disciplina",
                "disciplina": d,
                "tempo_min": max(15, round(len(by_disc[d]) * 1.8)),
                "questoes": by_disc[d],
            })
    for i in range(1, 4):
        sims.append({
            "id": f"geral-{i}",
            "titulo": f"Simulado geral {i}",
            "descricao": "20 questões de Conhecimentos Gerais, 5 por disciplina.",
            "tipo": "geral",
            "tempo_min": 35,
            "questoes": strat(geral, {"g1": 5, "g2": 5, "g3": 5, "g4": 5}, 100 + i),
        })
    for i in range(1, 3):
        sims.append({
            "id": f"especifico-{i}",
            "titulo": f"Simulado específico {i}",
            "descricao": "36 questões de Conhecimentos Específicos, 9 por disciplina.",
            "tipo": "especifico",
            "tempo_min": 70,
            "questoes": strat(espec, {"s1": 9, "s2": 9, "s3": 9, "s4": 9}, 200 + i),
        })
    sims.append({
        "id": "final-1",
        "titulo": "Simulado final — 70 questões",
        "descricao": "Réplica da prova: 20 gerais + 50 específicas. Faça às 8h, em 4 horas, sem consulta.",
        "tipo": "final",
        "tempo_min": 240,
        "questoes": strat(geral, {"g1": 5, "g2": 5, "g3": 5, "g4": 5}, 301)
                     + strat(espec, {"s1": 14, "s2": 17, "s3": 8, "s4": 11}, 302),
    })
    return sims


def build_plano():
    semanas = [
        ("S0", "11–15 nov", "2026-11-11", "2026-11-15", "Setup e diagnóstico", ["g1-01", "g1-02", "s1-01"], "Fazer o diagnóstico inicial; configurar 2h/dia; ler edital.", "Diagnóstico feito; rotina criada."),
        ("S1", "16–22 nov", "2026-11-16", "2026-11-22", "SQL e modelagem", ["s1-02", "s1-03", "s1-04", "s1-05", "s1-06", "s1-07"], "30 questões de SQL; 1 discursiva curta.", "80% em SQL básico."),
        ("S2", "23–29 nov", "2026-11-23", "2026-11-29", "Python, Pandas e estatística", ["s2-01", "s2-02", "s2-03", "s2-04", "s2-05", "s2-06", "g1-03", "g1-04"], "30 questões; flashcards diários.", "Ler e filtrar CSV sem consulta."),
        ("S3", "30 nov–6 dez", "2026-11-30", "2026-12-06", "ML, BI e qualidade", ["s2-07", "s2-08", "s3-01", "s3-02", "g1-05"], "20 questões de ML; 1 simulado de específicas.", "Explicar precisão, recall e F1."),
        ("S4", "7–13 dez", "2026-12-07", "2026-12-13", "Governança, APIs e nuvem", ["s3-03", "s3-04", "s4-01", "s4-02", "g2-01"], "20 questões; 1 discursiva.", "Diferenciar IaaS/PaaS/SaaS e REST."),
        ("S5", "14–20 dez", "2026-12-14", "2026-12-20", "Segurança, TI e água", ["s4-03", "s4-04", "s4-05", "g2-02", "g2-03"], "1 simulado geral; revisão de erros.", "8/20 em gerais."),
        ("S6", "21–27 dez", "2026-12-21", "2026-12-27", "Sistema paulista e Estado", ["g2-04", "g2-05", "g2-06", "g3-01", "g3-02"], "20 questões de gerais; flashcards de leis.", "Explicar SINGREH e SIGRH."),
        ("S7", "28 dez–3 jan", "2026-12-28", "2027-01-03", "Direito, ética, LAI e LGPD", ["g3-03", "g3-04", "g3-05", "g3-06", "g4-01", "g4-02", "g4-03", "g4-04"], "1 simulado geral; 2 discursivas.", "15/20 em gerais."),
        ("S8", "4–10 jan", "2027-01-04", "2027-01-10", "Revisão e pontos fracos", [], "Revisar P1; refazer questões erradas; 1 simulado específico.", "59/70 na objetiva."),
        ("S9", "11–17 jan", "2027-01-11", "2027-01-17", "Simulados e discursiva", [], "2 simulados; 2 discursivas corrigidas; revisão de flashcards.", "27/40 na discursiva."),
        ("S10", "18–24 jan", "2027-01-18", "2027-01-24", "Reta final", [], "1 simulado final completo; revisar caderno de erros; títulos.", "Meta 73–81."),
        ("S11", "25–31 jan", "2027-01-25", "2027-01-31", "Taper e prova", [], "Revisão leve, sono, logística; prova em 31/01 às 8h.", "Chegar às 7h."),
    ]
    return [{"id": s[0], "periodo": s[1], "inicio": s[2], "fim": s[3], "foco": s[4], "aulas": s[5], "tarefas": s[6], "checkpoint": s[7]} for s in semanas]


def write_js(name, var, data):
    p = DADOS / name
    p.write_text(f"window.{var} = " + json.dumps(data, ensure_ascii=False, separators=(",", ":")) + ";\n", encoding="utf-8")
