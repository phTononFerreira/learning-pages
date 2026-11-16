import json
import re
import shutil
from datetime import date, datetime
from pathlib import Path

import build_lib as B

BASE = Path(__file__).resolve().parents[1]
CONTEUDO = BASE / "conteudo"
DADOS = BASE / "dados"

# ---------------------------------------------------------------- icons
ICONS = {
    "home": '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/>',
    "file": '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v5h5"/><path d="M9 13h6M9 17h6"/>',
    "target": '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>',
    "book": '<path d="M4 4h7a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H4z"/><path d="M20 4h-4a3 3 0 0 0-3 3v13a2 2 0 0 1 2-2h5z"/>',
    "clipboard": '<path d="M8 4h8v3H8z"/><path d="M6 5H4v16h16V5h-2"/><path d="M8 11h8M8 15h8M8 19h5"/>',
    "cards": '<rect x="3" y="5" width="13" height="16"/><path d="M8 3h13v14"/><path d="M7 10h5M7 14h5"/>',
    "refresh": '<path d="M20 7v5h-5"/><path d="M4 17v-5h5"/><path d="M6.1 8a7 7 0 0 1 11.5-1L20 12M4 12l2.4 5a7 7 0 0 0 11.5-1"/>',
    "calendar": '<rect x="3" y="5" width="18" height="16"/><path d="M3 9h18M8 3v4M16 3v4"/><path d="M8 13h2M14 13h2M8 17h2M14 17h2"/>',
    "chart": '<path d="M4 20V4"/><path d="M4 20h16"/><path d="M8 16v-5M12 16V8M16 16v-8"/>',
    "link": '<path d="M10 13a5 5 0 0 0 7 0l2-2a5 5 0 0 0-7-7l-1 1"/><path d="M14 11a5 5 0 0 0-7 0l-2 2a5 5 0 0 0 7 7l1-1"/>',
    "search": '<circle cx="11" cy="11" r="7"/><path d="m16 16 5 5"/>',
    "sun": '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4"/>',
    "moon": '<path d="M20 14.5A8 8 0 0 1 9.5 4 8.5 8.5 0 1 0 20 14.5z"/>',
    "menu": '<path d="M4 6h16M4 12h16M4 18h16"/>',
    "x": '<path d="M5 5l14 14M19 5 5 19"/>',
    "arrow-left": '<path d="M19 12H5"/><path d="m11 18-6-6 6-6"/>',
    "arrow-right": '<path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>',
    "check": '<path d="m4 12 5 5L20 6"/>',
    "clock": '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    "layers": '<path d="m12 3 9 5-9 5-9-5z"/><path d="m3 13 9 5 9-5"/><path d="m3 18 9 5 9-5"/>',
    "database": '<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v7c0 1.7 3.6 3 8 3s8-1.3 8-3V5"/><path d="M4 12v7c0 1.7 3.6 3 8 3s8-1.3 8-3v-7"/>',
    "code": '<path d="m8 6-6 6 6 6"/><path d="m16 6 6 6-6 6"/><path d="m14 4-4 16"/>',
    "dashboard": '<rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/>',
    "server": '<rect x="3" y="4" width="18" height="6"/><rect x="3" y="14" width="18" height="6"/><path d="M7 7h.01M7 17h.01M11 7h7M11 17h7"/>',
    "scale": '<path d="M12 3v18M5 7h14"/><path d="m5 7-3 7h6z"/><path d="m19 7-3 7h6z"/><path d="M8 21h8"/>',
    "water": '<path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"/><path d="M9 14a3 3 0 0 0 3 3"/>',
    "cloud": '<path d="M7 18a4 4 0 0 1 0-8 6 6 0 0 1 11-1 4 4 0 0 1 1 8z"/>',
    "card": '<rect x="3" y="5" width="18" height="14"/><path d="M3 9h18M7 14h4M15 14h2"/>',
    "print": '<path d="M6 9V3h12v6"/><rect x="3" y="9" width="18" height="8"/><path d="M6 17v4h12v-4"/><path d="M18 12h.01"/>',
    "external": '<path d="M14 3h7v7"/><path d="M10 14 21 3"/><path d="M21 14v7H3V3h7"/>',
    "plus": '<path d="M12 5v14M5 12h14"/>',
    "flag": '<path d="M5 21V4h9l-1 4h6l-1 5h-6l-1 4H5"/>',
    "quote": '<path d="M4 6h8v6H4z"/><path d="M12 6h8v6h-8z"/><path d="M4 12v6h8M12 12v6h8"/>',
}


def icon(name, cls="", size=18):
    return (f'<svg class="{cls}" width="{size}" height="{size}" viewBox="0 0 24 24" fill="none" '
            f'stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="miter" '
            f'aria-hidden="true">{ICONS.get(name, ICONS["file"])}</svg>')


# ---------------------------------------------------------------- data
def load_cadernos():
    out = []
    for p in sorted(DADOS.glob("caderno_*.json")):
        cad = json.load(open(p, encoding="utf-8"))
        cad["_arquivo"] = p.name
        out.append(cad)
    return out


def sync_caderno_metadata(cargos, cadernos):
    by_id = {c["id"]: c for c in cargos["cargos"]}
    for cad in cadernos:
        cargo = by_id.get(cad["cargo_id"])
        if not cargo:
            continue
        cargo["caderno"] = {
            "slug": cad["slug"],
            "titulo": cad["titulo"],
            "modulos": len(cad["modulos"]),
            "licoes": sum(len(m["licoes"]) for m in cad["modulos"]),
            "questoes": len(cad["questoes"]),
            "flashcards": sum(len(m["cards"]) for m in cad["modulos"]),
            "descricao": cad.get("descricao", ""),
        }
        cargo["status_label"] = "Trilha curada + caderno específico"


def load_all():
    cur, lessons = B.load_lessons()
    questions = B.build_questions(lessons)
    cards = B.build_flashcards(lessons)
    sims = B.build_simulados(questions, lessons)
    plano = B.build_plano()
    prioridades = json.load(open(DADOS / "prioridades.json", encoding="utf-8"))["aulas"]
    edital = json.load(open(BASE / "pesquisa" / "edital_estruturado.json", encoding="utf-8"))
    temas = json.load(open(BASE / "pesquisa" / "temas_discursivos.json", encoding="utf-8"))
    cargos = json.load(open(DADOS / "cargos.json", encoding="utf-8"))
    cadernos = load_cadernos()
    sync_caderno_metadata(cargos, cadernos)
    return cur, lessons, questions, cards, sims, plano, prioridades, edital, temas, cargos, cadernos


def write_derived(lessons):
    for l in lessons:
        d = CONTEUDO / l["disciplina"] / l["id"]
        d.mkdir(parents=True, exist_ok=True)
        fm = (f"---\nid: {l['id']}\ntitulo: \"{l['titulo']}\"\ndisciplina: {l['disciplina']}\n"
              f"modulo: {l['modulo']}\nitem_edital: \"{l['item_edital']}\"\ntempo: {l['tempo']}\nnivel: {l['nivel']}\n---\n\n")
        intro = f"# {l['titulo']}\n\n> **Ideia central:** {l['idea']}\n\n"
        aula = fm + intro
        for k in ["1", "2", "3", "4"]:
            if k in l["secs"]:
                aula += f"## {k}. {l['secs_titulos'][k]}\n\n{l['secs'][k].strip()}\n\n"
        aula += "## Fontes\n\n" + "\n".join(f"- [{s['titulo']}]({s['url']})" for s in l["sources"]) + "\n"
        (d / "aula.md").write_text(aula, encoding="utf-8")

        resumo = f"# Resumo — {l['titulo']}\n\n> {l['idea']}\n\n"
        for k in ["1", "2", "3", "4"]:
            if k in l["secs"]:
                resumo += f"## {k}. {l['secs_titulos'][k]}\n\n{l['secs'][k].strip()}\n\n"
        resumo += "**Revisar:** D+1, D+7, D+30.\n"
        (d / "resumo.md").write_text(resumo, encoding="utf-8")

        ex = f"# Exercícios — {l['titulo']}\n\n"
        for q in l["questions"]:
            ex += f"## Q{q['n']} ({q['nivel']})\n\n{q['enunciado']}\n\n"
            for k in "ABCDE":
                ex += f"{k}) {q['alternativas'][k]}\n"
            ex += "\n"
        (d / "exercicios.md").write_text(ex, encoding="utf-8")

        gab = f"# Gabarito — {l['titulo']}\n\n"
        for q in l["questions"]:
            gab += f"## Q{q['n']} — {q['gabarito']}\n\n{q['comentario']}\n\n"
        gab += "## Flashcards\n\n" + "\n".join(f"- {c['pergunta']} — {c['resposta']}" for c in l["cards"]) + "\n"
        (d / "gabarito.md").write_text(gab, encoding="utf-8")


def build_search(lessons, sims, cargos, cadernos=None):
    out = []
    for l in lessons:
        out.append({
            "titulo": l["titulo"], "disciplina": l["disciplina_nome"], "tipo": "Aula",
            "url": f"aulas/{l['id']}.html", "texto": l["texto"][:900],
        })
    for cad in (cadernos or []):
        cad_text = " ".join(
            [m["nome"] + " " + " ".join(l["titulo"] + " " + " ".join(l["essencial"]) for l in m["licoes"])
             for m in cad["modulos"]]
        )
        out.append({
            "titulo": cad["titulo"],
            "disciplina": "Cargos e preparação", "tipo": "Caderno",
            "url": f"cadernos/{cad['slug']}.html",
            "texto": f"{cad['subtitulo']} {cad_text}",
        })
    for c in cargos["cargos"]:
        topics = " ".join(f"{d['nome']} {' '.join(d['topicos'])}" for d in c["disciplinas"])
        out.append({
            "titulo": f"{c['enfase']} — {c['emprego_curto']}",
            "disciplina": "Cargos e preparação", "tipo": "Trilha",
            "url": f"cargos/{c['slug']}.html",
            "texto": f"{c['emprego']} {c['enfase']} {c['vagas_total']} vagas {c['salario']} {c['resumo']} {topics} plano trilha discursiva",
        })
    pages = [
        ("Cargos e preparação", "Concurso", "Cargos", "cargos/index.html", "8 cargos ênfases vagas salário trilha plano comparação"),
        ("Edital resumido", "Concurso", "Edital", "edital.html", "vagas salário datas regras prova objetiva discursiva títulos desempate cronograma"),
        ("Estratégia de aprovação", "Concurso", "Estratégia", "estrategia.html", "banca FGV nota de corte concorrência meta discursiva temas erros"),
        ("Disciplinas", "Concurso", "Índice", "disciplinas/index.html", "todas as disciplinas módulos aulas"),
        ("Simulados", "Concurso", "Simulados", "simulados/index.html", "prova questões correção tempo"),
        ("Flashcards", "Concurso", "Memorização", "flashcards.html", "active recall repetição espaçada"),
        ("Discursiva", "Concurso", "Discursiva", "discursiva.html", "40 linhas template temas português checklist"),
        ("Plano de estudos", "Concurso", "Plano", "plano-estudos.html", "11 semanas 2h por dia cronograma revisões"),
        ("Estatísticas", "Concurso", "Dashboard", "dashboard.html", "progresso acertos pontos fracos"),
        ("Revisões", "Concurso", "Revisão", "revisoes.html", "D+1 D+7 D+30 vencidas"),
        ("Fontes", "Concurso", "Referências", "fontes.html", "links documentação legislação"),
        ("Pesquisa completa", "Concurso", "Pesquisa", "pesquisa.html", "edital banca estratégia discursiva metodologia"),
    ]
    for t, d, tipo, url, txt in pages:
        out.append({"titulo": t, "disciplina": d, "tipo": tipo, "url": url, "texto": txt})
    for s in sims:
        out.append({"titulo": s["titulo"], "disciplina": "Simulados", "tipo": "Simulado",
                    "url": f"simulados/simulado.html?id={s['id']}", "texto": s["descricao"]})
    return out


# ---------------------------------------------------------------- layout
NAV = [
    ("index", "Painel", "home", "index.html"),
    ("cargos", "Cargos", "layers", "cargos/index.html"),
    ("edital", "Edital", "file", "edital.html"),
    ("estrategia", "Estratégia", "target", "estrategia.html"),
    ("disciplinas", "Disciplinas", "book", "disciplinas/index.html"),
    ("simulados", "Simulados", "clipboard", "simulados/index.html"),
    ("flashcards", "Flashcards", "cards", "flashcards.html"),
    ("discursiva", "Discursiva", "quote", "discursiva.html"),
    ("revisoes", "Revisões", "refresh", "revisoes.html"),
    ("plano", "Plano", "calendar", "plano-estudos.html"),
    ("dashboard", "Estatísticas", "chart", "dashboard.html"),
    ("fontes", "Fontes", "link", "fontes.html"),
]

CARGOS_DATA = {}


def cargo_by_id(cid):
    for c in CARGOS_DATA.get("cargos", []):
        if c["id"] == cid:
            return c
    return CARGOS_DATA.get("cargos", [{}])[0]


def cargo_options(selected):
    groups = {}
    for c in CARGOS_DATA.get("cargos", []):
        groups.setdefault(c["emprego"], []).append(c)
    out = []
    for emprego, items in groups.items():
        out.append(f'<optgroup label="{B.esc(emprego)}">')
        for c in items:
            sel = " selected" if c["id"] == selected else ""
            out.append(f'<option value="{c["id"]}"{sel}>{B.esc(c.get("nome_curto", c["enfase"]))} · {c["vagas_total"]} vagas</option>')
        out.append("</optgroup>")
    return "".join(out)


def money(v):
    return "R$ " + f"{v:,.0f}".replace(",", ".")


def layout(page_id, title, body, prefix="", crumb="", scripts=None, styles=None, desc="", cargo_id=None):
    scripts = scripts or []
    styles = styles or []
    nav = []
    for pid, label, ic, href in NAV:
        active = "active" if (pid == page_id or (page_id in ("aula", "disciplina") and pid == "disciplinas")
                              or (page_id in ("cargo", "cargos", "caderno") and pid == "cargos")
                              or (page_id == "simulado" and pid == "simulados")
                              or (page_id == "pesquisa" and pid == "fontes")) else ""
        nav.append(f'<a class="{active}" href="{prefix}{href}">{icon(ic)}<span>{label}</span></a>')
    extra = "".join(f'<script src="{prefix}{s}"></script>' for s in scripts)
    style_links = "".join(f'\n<link rel="stylesheet" href="{prefix}{s}">' for s in styles)
    selected = cargo_id or CARGOS_DATA.get("default", "ana-ti")
    cargo = cargo_by_id(selected)
    cargo_meta = f"{cargo['vagas_total']} vagas · {money(cargo['salario'])} · {cargo['status_label']}"
    cargo_link = f"{prefix}cargos/{cargo['slug']}.html"
    html_attrs = f'data-cargo="{selected}"' + (f' data-cargo-page="{cargo_id}"' if cargo_id else "")
    notice_hidden = " hidden"
    return f"""<!doctype html>
<html lang="pt-BR" data-theme="dark" {html_attrs}>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="description" content="{B.esc(desc or 'Plataforma de estudos para o concurso SP Águas 2026 — 8 cargos e ênfases, com trilhas, plano e núcleo comum.')}">
<title>{B.esc(title)} — SP Águas 2026</title>
<script>try{{var h=document.documentElement,c=localStorage.getItem("spaguas.cargo");if(c&&!h.hasAttribute("data-cargo-page")){{h.dataset.cargo=c}}}}catch(e){{}}</script>
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' fill='%231d4ed8'/%3E%3Ctext x='16' y='22' font-family='Arial' font-size='13' font-weight='bold' fill='white' text-anchor='middle'%3ESA%3C/text%3E%3C/svg%3E">
<link rel="stylesheet" href="{prefix}assets/style.css">{style_links}
</head>
<body data-page="{page_id}">
<a class="skip" href="#main">Ir para o conteúdo</a>
<div class="app">
  <aside class="sidebar">
    <a class="brand" href="{prefix}index.html">
      <span class="brand-mark">SA</span>
      <span class="brand-text"><strong>SP Águas 2026</strong><small>8 cargos · 190 vagas</small></span>
    </a>
    <nav class="nav" aria-label="Navegação principal">
      <span class="nav-label">Estudo</span>
      {''.join(nav[:9])}
      <span class="nav-label">Gestão</span>
      {''.join(nav[9:])}
    </nav>
    <div class="sidebar-foot">
      <strong>31 jan 2027 · 8h</strong><br>
      Prova objetiva + discursiva<br>
      <span class="mono" data-countdown>—</span>
    </div>
  </aside>
  <div class="content">
    <header class="topbar">
      <div class="topbar-left">
        <button class="icon-btn menu-btn" data-menu aria-label="Abrir menu">{icon('menu')}</button>
        <div class="crumb">{crumb}</div>
      </div>
      <div class="topbar-right">
        <button class="search-btn" data-search-open aria-label="Buscar">{icon('search', size=15)}<span>Buscar</span><kbd>/</kbd></button>
        <button class="icon-btn" data-theme-toggle aria-label="Alternar tema">{icon('sun', size=16)}</button>
      </div>
    </header>
    <div class="configbar">
      <div class="configbar-inner">
        <span class="configbar-label">Cargo alvo</span>
        <div class="cargo-select-wrap">
          <span class="cargo-dot" aria-hidden="true"></span>
          <select data-cargo-select aria-label="Selecionar cargo alvo" title="{B.esc(cargo['enfase'])} · {cargo['vagas_total']} vagas">{cargo_options(selected)}</select>
        </div>
        <span class="configbar-meta" data-cargo-meta>{B.esc(cargo_meta)}</span>
        <a class="configbar-link" data-cargo-link href="{cargo_link}">Preparação do cargo {icon('arrow-right', size=13)}</a>
      </div>
    </div>
    <main class="main" id="main">
      <div class="cargo-notice" data-cargo-notice{notice_hidden}>
        <span class="cargo-notice-label">Trilha ativa</span>
        <p><strong data-cargo-label>{B.esc(cargo['enfase'])}</strong> — este material completo é da ênfase TI e Ciência de Dados. <a data-cargo-link href="{cargo_link}">Abrir a preparação do cargo →</a></p>
      </div>
      {body}
    </main>
    <footer class="footer">
      <span>Projeto independente de estudos. Dados oficiais: <a href="https://conhecimento.fgv.br/concursos/spaguas26" target="_blank" rel="noopener">FGV</a> · edital de 10/11/2026.</span>
      <span class="mono">coleta 11–14/11/2026</span>
    </footer>
  </div>
</div>
<div class="search-overlay" data-search-overlay>
  <div class="search-modal">
    <div class="search-top">{icon('search')}<input class="search-input" type="search" placeholder="Buscar aula, cargo, tópico, lei, comando..." aria-label="Buscar"><button class="search-close" aria-label="Fechar">×</button></div>
    <div class="search-results"></div>
    <div class="search-hint">↑ ↓ para navegar · Enter para abrir · Esc para fechar</div>
  </div>
</div>
<script>window.SITE_ROOT = "{prefix}";</script>
<script src="{prefix}dados/aulas.js"></script>
<script src="{prefix}dados/cargos.js"></script>
<script src="{prefix}dados/busca.js"></script>
<script src="{prefix}assets/app.js"></script>
{extra}
</body>
</html>"""


def tag(text, cls=""):
    return f'<span class="tag {cls}">{B.esc(text)}</span>'


def progress(label, pct_val):
    return (f'<div class="progress-label"><span>{label}</span><span><b>{pct_val}%</b></span></div>'
            f'<div class="progress"><div class="progress-bar" style="width:{pct_val}%"></div></div>')


# ---------------------------------------------------------------- pages
def page_index(ctx):
    prios = ctx["prioridades"]
    p1 = [p for p in prios if p["faixa"] == "P1"][:8]
    p1_html = "".join(f'<a class="list-row" href="aulas/{p["aula_id"]}.html"><span class="badge-dot"></span><span class="grow"><span class="title">{B.esc(p["titulo"])}</span><span class="sub">{B.esc(p["disciplina"])} · item {p["item_edital"]}</span></span><span class="right">{tag("P1", "tag-p1")}</span></a>' for p in p1)
    discs = ctx["cur"]["disciplinas"]
    disc_html = "".join(
        f'<a class="card" href="disciplinas/{d["slug"]}.html" data-disc-card="{d["id"]}"><div class="card-icon">{icon(d["icone"])}</div><h3>{B.esc(d["nome"])}</h3><p>{B.esc(d["descricao"])}</p><div class="meta"><span>{len([a for m in d["modulos"] for a in m["aulas"]])} aulas</span><span data-disc-pct="{d["id"]}">0%</span></div><div class="progress"><div class="progress-bar" data-disc-bar="{d["id"]}"></div></div></a>'
        for d in discs)
    caderno_links = "".join(
        f'<p><strong>{B.esc(cargo_by_id(cad["cargo_id"])["enfase"])}</strong> já tem caderno específico com '
        f'{sum(len(m["licoes"]) for m in cad["modulos"])} lições, {len(cad["questoes"])} questões comentadas e '
        f'{sum(len(m["cards"]) for m in cad["modulos"])} flashcards. '
        f'<a href="cadernos/{cad["slug"]}.html">Abrir o caderno →</a></p>'
        for cad in ctx["cadernos"])
    body = f"""
<section class="hero">
  <span class="kicker">Primeiro concurso da SP Águas · banca FGV</span>
  <h1>Analista de Suporte à Regulação de Recursos Hídricos I<br><span class="muted">TI e Ciência de Dados</span></h1>
  <p class="lead">Um plano de 81 dias para 3 vagas: conteúdo enxuto, questões no estilo FGV, flashcards e simulados. Este painel é da ênfase TI; o seletor acima abre as trilhas dos outros 7 cargos.</p>
  <div class="hero-meta">{tag("3 vagas AC", "tag-solid")}{tag("8 cargos", "tag-solid")}{tag("R$ 10.366")}{tag("70 questões")}{tag("31/01/2027")}{tag("FGV")}</div>
  <div class="stat-row">
    <div class="stat"><div class="stat-label">Faltam para a prova</div><div class="stat-num" data-countdown>—</div><div class="stat-note">31/01/2027, 8h (Brasília)</div></div>
    <div class="stat"><div class="stat-label">Aulas estudadas</div><div class="stat-num" data-stat-lessons>0/45</div><div class="stat-note">de 45 aulas compactas</div></div>
    <div class="stat"><div class="stat-label">Questões</div><div class="stat-num" data-stat-questions>0</div><div class="stat-note"><span data-stat-accuracy>—</span> de acerto</div></div>
    <div class="stat"><div class="stat-label">Flashcards dominados</div><div class="stat-num" data-stat-cards>0/135</div><div class="stat-note">caixa 3 ou superior</div></div>
  </div>
</section>

<section class="section">
  <div class="section-head"><h2 class="section-title">Comece por aqui</h2><span class="section-sub">na ordem, leva 20 minutos</span></div>
  <div class="grid grid-3">
    <a class="card" href="edital.html"><div class="card-icon">{icon('file')}</div><h3>1. Entenda as regras</h3><p>Mínimos, pesos, discursiva, títulos e cronograma. O que elimina antes de qualquer conteúdo.</p><div class="meta"><span>Edital resumido</span><span>→</span></div></a>
    <a class="card" href="simulados/simulado.html?id=diagnostico&modo=estudo"><div class="card-icon">{icon('target')}</div><h3>2. Faça o diagnóstico</h3><p>20 questões misturadas, com feedback imediato. Descubra onde você já está e onde dói.</p><div class="meta"><span>30 min</span><span>→</span></div></a>
    <a class="card" href="plano-estudos.html"><div class="card-icon">{icon('calendar')}</div><h3>3. Siga o plano</h3><p>11 semanas, 2h por dia, com revisão D+1/D+7/D+30 e simulados nos fins de semana.</p><div class="meta"><span>Plano completo</span><span>→</span></div></a>
  </div>
</section>

<section class="section">
  <div class="section-head"><h2 class="section-title">8 cargos, um núcleo comum</h2><span class="section-sub">troque o cargo na barra acima</span></div>
  <div class="callout"><span class="label">Novo seletor de cargo</span>
    <p>O painel completo é da ênfase <strong>TI e Ciência de Dados</strong>. As outras 7 ênfases têm trilha curada, plano de 11 semanas e reaproveitamento das 21 aulas do núcleo comum. <a href="cargos/index.html">Comparar os 8 cargos e abrir a preparação →</a></p>
    {caderno_links}
  </div>
</section>

<section class="section">
  <div class="section-head"><h2 class="section-title">Seu progresso</h2><span class="section-sub">salvo neste navegador</span></div>
  <div class="grid grid-2">
    <div class="card"><h3>Aulas</h3><p>45 aulas, 32h de núcleo. Marque cada uma ao terminar.</p><div class="progress-label"><span>Aulas estudadas</span><span data-stat-lessons>0/45</span></div><div class="progress"><div class="progress-bar" data-bar-lessons></div></div><div class="meta"><span data-stat-lessons>0/45</span><a href="disciplinas/index.html">Ver disciplinas →</a></div></div>
    <div class="card"><h3>Flashcards</h3><p>135 cards com repetição espaçada. Um fato por card.</p><div class="progress-label"><span>Dominados</span><span data-stat-cards>0/135</span></div><div class="progress"><div class="progress-bar" data-bar-cards></div></div><div class="meta"><span>caixa 3+</span><a href="flashcards.html">Revisar →</a></div></div>
  </div>
</section>

<section class="section">
  <div class="section-head"><h2 class="section-title">Prioridades P1</h2><span class="section-sub">maior retorno por hora</span></div>
  <div class="list">{p1_html}</div>
</section>

<section class="section">
  <div class="section-head"><h2 class="section-title">As 8 disciplinas</h2><span class="section-sub">4 gerais + 4 específicas</span></div>
  <div class="grid grid-4">{disc_html}</div>
</section>

<section class="section">
  <div class="callout"><span class="label">Regra que elimina</span>
    <p><strong>Objetiva:</strong> mínimo de 8/20 em Gerais e 20/50 em Específicas, cumulativamente. <strong>Discursiva:</strong> mínimo de 10/20 em cada uma das 2 questões. Só os 12 primeiros da ênfase têm a discursiva corrigida.</p>
  </div>
</section>
"""
    return layout("index", "Painel", body, "", "<b>Painel</b>", scripts=["assets/disciplinas.js"])


def cargo_card(c, prefix=""):
    return (f'<a class="card cargo-card cargo-accent-{c["id"]}" href="{prefix}{c["slug"]}.html">'
            f'<div class="meta" style="padding:0"><span class="cargo-dot"></span><span>{c["vagas_total"]} vagas</span><span class="small">{B.esc(c["status_label"])}</span></div>'
            f'<h3>{B.esc(c["enfase"])}</h3>'
            f'<p>{B.esc(c["resumo"])}</p>'
            f'<div class="meta"><span>{money(c["salario"])}</span><span>{c["limite_correcao"]} discursivas</span></div>'
            f'</a>')


def page_cargos_index(ctx):
    cargos = CARGOS_DATA["cargos"]
    total_vagas = sum(c["vagas_total"] for c in cargos)
    groups = {}
    for c in cargos:
        groups.setdefault(c["emprego"], []).append(c)
    groups_html = ""
    for emprego, items in groups.items():
        cards = "".join(cargo_card(c) for c in items)
        groups_html += (f'<section class="section"><div class="section-head"><h2 class="section-title">{B.esc(emprego)}</h2>'
                        f'<span class="section-sub">{sum(x["vagas_total"] for x in items)} vagas · {money(items[0]["salario"])}</span></div>'
                        f'<div class="grid grid-4">{cards}</div></section>')
    rows = "".join(
        f'<tr><td>{B.esc(c["emprego_curto"])}</td><td><a href="{c["slug"]}.html"><b>{B.esc(c["enfase"])}</b></a></td>'
        f'<td class="mono">{c["vagas_total"]}</td><td class="mono">{c["vagas_ac"]}</td><td class="mono">{c["vagas_pcd"]}</td>'
        f'<td class="mono">{money(c["salario"])}</td><td class="mono">{c["limite_correcao"]}</td>'
        f'<td><span class="small muted">{B.esc(c["status_label"])}</span></td></tr>'
        for c in cargos)
    common = CARGOS_DATA["comum"]
    admin_anchor = "#fgv-admin" if (BASE / "pesquisa" / "fgv_cargos_administrativos.md").exists() else ""
    amb_anchor = "#fgv-ambiental" if (BASE / "pesquisa" / "fgv_cargos_ambientais.md").exists() else ""
    common_cards = "".join(
        f'<a class="card" href="../disciplinas/{d["slug"]}.html"><h3>{B.esc(d["nome"])}</h3>'
        f'<p>{len(d["aulas"])} aulas no material atual. Serve aos 8 cargos.</p>'
        f'<div class="meta"><span>{B.esc(d["id"].upper())}</span><span>núcleo comum</span></div></a>'
        for d in common["disciplinas"])
    body = f"""
<section class="hero">
  <span class="kicker">8 cargos · 2 empregos · 190 vagas</span>
  <h1>Escolha o seu cargo.<br><span class="muted">O núcleo é comum; a trilha muda.</span></h1>
  <p class="lead">O edital tem 4 ênfases de Especialista e 4 de Analista. Todas fazem as mesmas 20 questões gerais; as 50 específicas mudam. Reaproveite as 21 aulas do núcleo comum e siga a trilha do seu cargo.</p>
  <div class="hero-meta">{tag(f"{total_vagas} vagas", "tag-solid")}{tag("8 ênfases")}{tag("20 gerais + 50 específicas")}{tag("FGV")}</div>
  <div class="stat-row">
    <div class="stat"><div class="stat-label">Vagas totais</div><div class="stat-num">{total_vagas}</div><div class="stat-note">170 Especialista + 20 Analista</div></div>
    <div class="stat"><div class="stat-label">Ênfases</div><div class="stat-num">8</div><div class="stat-note">4 + 4</div></div>
    <div class="stat"><div class="stat-label">Núcleo comum</div><div class="stat-num">21</div><div class="stat-note">aulas · 63 questões · 63 cards</div></div>
    <div class="stat"><div class="stat-label">Prova</div><div class="stat-num">31/01/27</div><div class="stat-note">objetiva + discursiva</div></div>
  </div>
</section>

<section class="section">
  <div class="section-head"><h2 class="section-title">Comparar os 8 cargos</h2><span class="section-sub">vagas, salário e limite de correção</span></div>
  <div class="table-wrap table-wide table-xwide"><table><thead><tr><th>Emprego</th><th>Ênfase</th><th>Vagas</th><th>AC</th><th>PcD</th><th>Salário</th><th>Discursivas</th><th>Material</th></tr></thead><tbody>{rows}</tbody></table></div>
  <p class="small muted" style="margin-top:8px">Limite de correção = 4 × vagas da ênfase (item 11.7), incluindo empatados; candidatos PcD habilitados são corrigidos à parte.</p>
</section>

{groups_html}

<section class="section">
  <div class="section-head"><h2 class="section-title">Reaproveite o núcleo comum</h2><span class="section-sub">{common["aulas"]} aulas · {common["questoes_banco"]} questões · {common["flashcards"]} flashcards</span></div>
  <div class="grid grid-4">{common_cards}</div>
  <div class="callout" style="margin-top:16px"><span class="label">Como usar</span><p>{B.esc(common['descricao'])}</p></div>
</section>

<section class="section">
  <div class="section-head"><h2 class="section-title">Pesquisa de campo</h2><span class="section-sub">edital + provas FGV análogas</span></div>
  <div class="grid grid-2">
    <a class="card" href="../pesquisa.html#cargos-edital"><h3>Anexo I por cargo</h3><p>Extração fiel das disciplinas e tópicos das 8 ênfases.</p><div class="meta"><span>edital</span><span>→</span></div></a>
    <a class="card" href="../pesquisa.html{admin_anchor}"><h3>FGV — administrativos</h3><p>Administração Pública, Direito e Econômico-Financeira em provas anteriores.</p><div class="meta"><span>pesquisa</span><span>→</span></div></a>
    <a class="card" href="../pesquisa.html{amb_anchor}"><h3>FGV — ambientais</h3><p>Recursos hídricos, gestão ambiental e monitoramento em provas anteriores.</p><div class="meta"><span>pesquisa</span><span>→</span></div></a>
    <a class="card" href="../pesquisa.html"><h3>Limites da pesquisa</h3><p>Primeiro concurso da SP Águas: não há prova anterior do órgão.</p><div class="meta"><span>transparência</span><span>→</span></div></a>
  </div>
</section>
"""
    return layout("cargos", "Cargos e preparação", body, "../", "<b>Cargos</b> · 8 ênfases", desc="Compare os 8 cargos da SP Águas 2026 e abra a trilha de preparação do seu cargo.")


def page_cargo(ctx, cargo):
    lessons = {l["id"]: l for l in ctx["lessons"]}
    common = CARGOS_DATA["comum"]
    common_cards = "".join(
        f'<a class="card" href="../disciplinas/{d["slug"]}.html"><h3>{B.esc(d["nome"])}</h3>'
        f'<p>{len(d["aulas"])} aulas · questões e flashcards do núcleo comum.</p>'
        f'<div class="meta"><span>{B.esc(d["id"].upper())}</span><span>reaproveite</span></div></a>'
        for d in common["disciplinas"])
    reuso = cargo.get("reuso", [])
    if "all" in reuso:
        reuso_html = ('<div class="callout"><span class="label">Material completo</span><p>As 45 aulas, 135 questões e 15 simulados já cobrem esta ênfase. '
                      '<a href="../plano-estudos.html">Siga o plano de 11 semanas</a> ou <a href="../disciplinas/index.html">veja as disciplinas</a>.</p></div>')
    else:
        items = []
        for lid in reuso:
            l = lessons.get(lid)
            if not l:
                continue
            items.append(f'<a class="list-row" href="../aulas/{lid}.html"><span class="badge-dot"></span><span class="grow"><span class="title">{B.esc(l["titulo"])}</span><span class="sub">{B.esc(l["disciplina_nome"])}</span></span><span class="right">aula</span></a>')
        reuso_html = f'<div class="list">{ "".join(items) }</div><p class="small muted" style="margin-top:8px">Estas aulas do núcleo comum são as mais próximas da sua ênfase. As demais continuam valendo para as 20 questões gerais.</p>'
    discs_html = ""
    for d in cargo["disciplinas"]:
        aulas_html = ""
        if d.get("aulas"):
            links = " · ".join(f'<a class="small" href="../aulas/{aid}.html">{B.esc(lessons[aid]["titulo"])}</a>' for aid in d["aulas"] if aid in lessons)
            aulas_html = f'<p class="small"><strong>Aulas do material:</strong> {links}</p>'
        topics = "".join(f"<li>{B.esc(t)}</li>" for t in d["topicos"])
        discs_html += (f'<details class="accordion"><summary><span>{B.esc(d["nome"])}</span>'
                       f'<span>{tag(d["prioridade"], "tag-p1" if d["prioridade"] == "P1" else "tag-p2")} <span class="muted mono">{d["horas"]}h</span></span></summary>'
                       f'<div class="acc-body"><p class="small muted">{B.esc(d["foco"])}</p><ul>{topics}</ul>{aulas_html}</div></details>')
    plan_rows = "".join(
        f'<tr><td class="mono">{p["fase"]}</td><td class="mono">{B.esc(p["periodo"])}</td><td><b>{B.esc(p["foco"])}</b></td><td>{B.esc(p["tarefas"])}</td><td>{B.esc(p["checkpoint"])}</td></tr>'
        for p in cargo["plano"])
    disc_cards = "".join(f'<div class="card"><h3>{B.esc(t)}</h3><p>{B.esc(d)}</p></div>' for t, d in cargo["discursiva"])
    fgv_items = "".join(f"<li>{B.esc(x)}</li>" for x in cargo["fgv"]["evidencias"])
    fgv_sources = "".join(f'<li><a href="{s["url"]}" target="_blank" rel="noopener">{B.esc(s["titulo"])}</a></li>' for s in cargo["fgv"]["fontes"])
    resources = "".join(f'<li><a href="{r["url"]}" target="_blank" rel="noopener">{B.esc(r["titulo"])}</a><br><span class="small muted">{B.esc(r["nota"])}</span></li>' for r in cargo["recursos"])
    hours = sum(d["horas"] for d in cargo["disciplinas"])
    status_callout = ""
    caderno_html = ""
    if cargo.get("caderno"):
        cad = cargo["caderno"]
        status_callout = (f'<div class="callout"><span class="label">Trilha curada + caderno específico</span><p>Esta ênfase tem um caderno próprio de <strong>{cad["licoes"]} lições</strong>, '
                          f'<strong>{cad["questoes"]} questões</strong> e <strong>{cad["flashcards"]} flashcards</strong>, além do núcleo comum. Ainda não é uma trilha de 45 aulas nem um banco de questões completo; '
                          f'o material abaixo deixa claro o que é específico e o que é reaproveitado.</p></div>')
        caderno_html = (f'\n\n<section class="section"><div class="section-head"><h2 class="section-title">Caderno específico</h2>'
                        f'<span class="section-sub">{cad["modulos"]} módulos · {cad["licoes"]} lições</span></div>'
                        f'<a class="card cargo-card cargo-accent-{cargo["id"]}" href="../cadernos/{cad["slug"]}.html">'
                        f'<div class="meta" style="padding:0"><span class="cargo-dot"></span><span>Material específico</span><span class="small">{cad["questoes"]} questões · {cad["flashcards"]} cards</span></div>'
                        f'<h3>{B.esc(cad["titulo"])}</h3>'
                        f'<p>{B.esc(cad.get("descricao") or cargo["resumo"])}</p>'
                        f'<div class="meta"><span>ler o caderno</span><span>→</span></div></a></section>')
    elif cargo["status"] == "trilha":
        status_callout = (f'<div class="callout"><span class="label">Trilha curada</span><p>Esta ênfase ainda não tem 45 aulas nem banco de questões próprio. A trilha abaixo foi montada com o Anexo I do edital e provas FGV análogas; '
                          f'o núcleo comum de 20 questões é integralmente reaproveitado. <a href="../pesquisa.html#cargos-edital">Ver a extração do edital</a>.</p></div>')
    else:
        status_callout = (f'<div class="callout"><span class="label">Material completo</span><p>Esta é a única ênfase com material completo: 45 aulas, 135 questões, 135 flashcards e 15 simulados. '
                          f'<a href="../plano-estudos.html">Abrir o plano de 11 semanas</a>.</p></div>')
    body = f"""
<section class="hero">
  <span class="kicker">{B.esc(cargo["emprego"])} · Edital 01/2026</span>
  <h1>{B.esc(cargo["enfase"])}</h1>
  <p class="lead">{B.esc(cargo["resumo"])}</p>
  <div class="hero-meta">{tag(f"{cargo['vagas_total']} vagas", "tag-solid")}{tag(money(cargo["salario"]))}{tag(f"{cargo['limite_correcao']} discursivas")}{tag(cargo["status_label"])}</div>
  <div class="stat-row">
    <div class="stat"><div class="stat-label">Vagas</div><div class="stat-num">{cargo['vagas_total']}</div><div class="stat-note">{cargo['vagas_ac']} AC · {cargo['vagas_pcd']} PcD</div></div>
    <div class="stat"><div class="stat-label">Salário inicial</div><div class="stat-num">{money(cargo['salario'])}</div><div class="stat-note">40h · CLT</div></div>
    <div class="stat"><div class="stat-label">Correção da discursiva</div><div class="stat-num">{cargo['limite_correcao']}</div><div class="stat-note">4× as vagas da ênfase</div></div>
    <div class="stat"><div class="stat-label">Carga da trilha</div><div class="stat-num">~{hours + 70}h</div><div class="stat-note">{hours}h específicas + 40h gerais + 30h discursiva</div></div>
  </div>
</section>

{status_callout}{caderno_html}

<section class="section">
  <div class="section-head"><h2 class="section-title">Núcleo comum</h2><span class="section-sub">igual para os 8 cargos</span></div>
  <div class="grid grid-4">{common_cards}</div>
  <h3 style="margin-top:22px">Aulas mais próximas da sua ênfase</h3>
  {reuso_html}
</section>

<section class="section">
  <div class="section-head"><h2 class="section-title">Trilha específica</h2><span class="section-sub">50 questões · sequência sugerida</span></div>
  {discs_html}
</section>

<section class="section">
  <div class="section-head"><h2 class="section-title">Plano de 11 semanas</h2><span class="section-sub">2h/dia · revisão D+1/D+7/D+30</span></div>
  <div class="table-wrap table-wide"><table><thead><tr><th>Fase</th><th>Período</th><th>Foco</th><th>Tarefas</th><th>Checkpoint</th></tr></thead><tbody>{plan_rows}</tbody></table></div>
  <p class="small muted" style="margin-top:8px">A carga assume ~160h. Se tiver 1h/dia, corte pela metade as horas específicas e mantenha 20 min de questões por dia.</p>
</section>

<section class="section">
  <div class="section-head"><h2 class="section-title">Prova discursiva</h2><span class="section-sub">2 questões · 40 linhas · 20 pontos cada</span></div>
  <div class="grid grid-2">{disc_cards}</div>
  <div class="callout" style="margin-top:16px"><span class="label">Estrutura</span><p><strong>Abertura (4–5 linhas):</strong> responda o comando e situe o problema. <strong>Desenvolvimento (28–32):</strong> 3 blocos com conceito, aplicação à SP Águas e lei/dado. <strong>Fecho (3–4):</strong> síntese e recomendação.</p></div>
</section>

<section class="section">
  <div class="section-head"><h2 class="section-title">Pesquisa FGV</h2><span class="section-sub">estilo e incidência</span></div>
  <div class="callout"><span class="label">Leitura</span><p>{B.esc(cargo['fgv']['resumo'])}</p></div>
  <div class="grid grid-2">
    <div class="card"><h3>O que observar</h3><ul>{fgv_items}</ul></div>
    <div class="card"><h3>Provas usadas como proxy</h3><ul>{fgv_sources}</ul></div>
  </div>
  <p class="small muted">A SP Águas não tem prova anterior. As provas acima são de outros certames da FGV e servem para estilo/incidência, não como previsão do conteúdo exato.</p>
</section>

<section class="section">
  <div class="section-head"><h2 class="section-title">Recursos</h2><span class="section-sub">fontes oficiais e documentação</span></div>
  <ul class="source-list">{resources}</ul>
</section>

<section class="section">
  <div class="btn-row">
    <button class="btn btn-primary" data-set-cargo="{cargo['id']}">{icon('check', size=14)} Definir como cargo alvo</button>
    <a class="btn" href="index.html">Comparar os 8 cargos</a>
    <a class="btn" href="../disciplinas/index.html">Núcleo comum</a>
    <a class="btn" href="../simulados/index.html">Simulados</a>
  </div>
</section>
"""
    return layout("cargo", cargo["enfase"], body, "../", f'<a href="index.html">Cargos</a> / <b>{B.esc(cargo["nome_curto"])}</b>', desc=cargo["resumo"], cargo_id=cargo["id"])


def page_caderno(ctx, cad):
    cargo = cargo_by_id(cad["cargo_id"])
    total_licoes = sum(len(m["licoes"]) for m in cad["modulos"])
    total_cards = sum(len(m["cards"]) for m in cad["modulos"])
    total_questoes = len(cad["questoes"])
    mod_links = "".join(
        f'<a class="btn btn-sm" href="#{m["id"]}">{m["numero"]}. {B.esc(m["nome"])}</a>'
        for m in cad["modulos"])
    mods_html = ""
    for m in cad["modulos"]:
        licoes = ""
        for l in m["licoes"]:
            bullets = "".join(f"<li>{B.inline_md(x)}</li>" for x in l["essencial"])
            formula = (f'<div class="formula"><span class="label">Fórmula / regra</span>'
                       f'<code>{B.esc(l["formula"])}</code></div>') if l.get("formula") else ""
            exemplo = f'<p><strong>Exemplo:</strong> {B.inline_md(l["exemplo"])}</p>' if l.get("exemplo") else ""
            pegadinha = (f'<div class="callout callout-muted"><span class="label">Pegadinha</span>'
                         f'<p>{B.inline_md(l["pegadinha"])}</p></div>') if l.get("pegadinha") else ""
            licoes += (f'<details class="accordion" id="{l["id"]}"><summary>'
                       f'<span>{B.esc(l["titulo"])}</span><span class="muted mono">item {B.esc(l["item"])}</span>'
                       f'</summary><div class="acc-body lesson-body"><ul>{bullets}</ul>{formula}{exemplo}{pegadinha}</div></details>')
        mods_html += (f'<section class="section" id="{m["id"]}">'
                      f'<div class="section-head"><h2 class="section-title">{m["numero"]}. {B.esc(m["nome"])}</h2>'
                      f'<span class="section-sub">item {B.esc(m["edital"])} · {m["horas"]}h</span></div>'
                      f'<p class="lead" style="font-size:14px">{B.inline_md(m["foco"])}</p>'
                      f'{licoes}</section>')
    qs_html = ""
    for i, q in enumerate(cad["questoes"], 1):
        alts = "".join(f'<li><b>{k})</b> {B.inline_md(v)}</li>' for k, v in q["alternativas"].items())
        qs_html += (f'<details class="accordion question" id="{q["id"]}"><summary>'
                    f'<span>Q{i} — {B.esc(q["nivel"])}</span><span class="muted mono">abrir questão</span></summary>'
                    f'<div class="acc-body lesson-body"><p>{B.inline_md(q["enunciado"])}</p>'
                    f'<ul class="alts">{alts}</ul>'
                    f'<details class="answer"><summary>Conferir resposta e comentário</summary>'
                    f'<p><strong>Gabarito: {q["gabarito"]}.</strong> {B.inline_md(q["comentario"])}</p>'
                    f'</details></div></details>')
    fontes = "".join(
        f'<li><a href="{f["url"]}" target="_blank" rel="noopener">{B.esc(f["titulo"])}</a>'
        f'<br><span class="small muted">{B.esc(f["nota"])}</span></li>'
        for f in cad["fontes"])
    cards_flat = "".join(
        f'<details class="accordion flashcard"><summary><span>{B.esc(s["p"])}</span>'
        f'<span class="muted mono">ver resposta</span></summary>'
        f'<div class="acc-body"><p>{B.inline_md(s["r"])}</p></div></details>'
        for m in cad["modulos"] for s in m["cards"])
    hero_titulo = cad.get("hero_titulo") or {
        "esp-grh": "Da hidrologia à segurança de barragens",
        "esp-ga": "Política ambiental, água e território",
    }.get(cad["cargo_id"], f"Prepare-se para {cargo['enfase']}")
    como_usar = cad.get("como_usar") or (
        f"Este caderno cobre os {len(cad['modulos'])} blocos específicos da ênfase, mas "
        f"<strong>não substitui o núcleo comum</strong> de 21 aulas e 63 questões do banco. "
        f"Sequência sugerida: núcleo comum → uma lição por dia → questões do módulo → flashcards D+1/D+7 → discursiva.")
    limite = cad.get("limite") or (
        "Este é o primeiro concurso da SP Águas: não existe prova anterior do órgão. "
        "O caderno é construído a partir do Anexo I e de conceitos técnicos consolidados; "
        "as provas FGV de órgãos análogos servem para estilo, não como previsão do conteúdo exato.")
    simulado_n = min(20, total_questoes)
    caderno_data = {
        "slug": cad["slug"],
        "titulo": cad["titulo"],
        "questoes": cad["questoes"],
        "modulos": [{"nome": m["nome"], "cards": m["cards"]} for m in cad["modulos"]],
    }
    data_json = json.dumps(caderno_data, ensure_ascii=False, separators=(",", ":")).replace("</", "<\\/")
    body = f"""
<section class="hero">
  <span class="kicker">Caderno específico · {B.esc(cargo['enfase'])}</span>
  <h1>{B.esc(hero_titulo)}</h1>
  <p class="lead">{B.esc(cad["aviso"])}</p>
  <div class="hero-meta">{tag(f"{cargo['vagas_total']} vagas", "tag-solid")}{tag(money(cargo["salario"]))}{tag("50 específicas")}{tag("FGV")}</div>
  <div class="stat-row">
    <div class="stat"><div class="stat-label">Módulos</div><div class="stat-num">{len(cad["modulos"])}</div><div class="stat-note">sequência do Anexo I</div></div>
    <div class="stat"><div class="stat-label">Lições</div><div class="stat-num">{total_licoes}</div><div class="stat-note">conceito + exemplo + pegadinha</div></div>
    <div class="stat"><div class="stat-label">Questões</div><div class="stat-num">{total_questoes}</div><div class="stat-note">com gabarito comentado</div></div>
    <div class="stat"><div class="stat-label">Flashcards</div><div class="stat-num">{total_cards}</div><div class="stat-note">para revisão espaçada</div></div>
  </div>
</section>

<div class="callout">
  <span class="label">Como usar</span>
  <p>{como_usar}</p>
</div>

<div class="btn-row" style="margin-bottom:22px">{mod_links}<a class="btn btn-sm" href="#questoes">Questões</a><a class="btn btn-sm" href="#simulado">Simulado</a><a class="btn btn-sm" href="#flashcards">Flashcards</a><a class="btn btn-sm" href="#fontes">Fontes</a></div>

{mods_html}

<section class="section" id="questoes">
  <div class="section-head"><h2 class="section-title">Questões do caderno</h2><span class="section-sub">{total_questoes} questões · gabarito comentado</span></div>
  <p class="lead" style="font-size:14px">Responda sem consultar. Só abra o gabarito depois de marcar uma alternativa; a explicação foi escrita para corrigir o raciocínio, não só o resultado.</p>
  <div class="caderno-toolbar">
    <div class="caderno-progress-wrap" data-caderno-progress></div>
    <div class="caderno-score-wrap" data-caderno-score></div>
    <button class="btn btn-sm" type="button" data-caderno-reset>Recomeçar questões</button>
  </div>
  {qs_html}
</section>

<section class="section" id="simulado">
  <div class="section-head"><h2 class="section-title">Simulado do caderno</h2><span class="section-sub">{simulado_n} questões · 30 min · correção comentada</span></div>
  <p class="lead" style="font-size:14px">Simulado específico deste caderno, montado com questões do próprio material. Não é a prova oficial e não substitui os simulados completos.</p>
  <div data-caderno-simulado></div>
  <noscript><p class="small muted">O simulado interativo precisa de JavaScript. As questões comentadas continuam disponíveis acima.</p></noscript>
</section>

<section class="section" id="flashcards">
  <div class="section-head"><h2 class="section-title">Flashcards</h2><span class="section-sub">{total_cards} cards · um fato por card</span></div>
  <div class="grid grid-2" data-caderno-cards>
    {cards_flat}
  </div>
</section>

<section class="section" id="fontes">
  <div class="section-head"><h2 class="section-title">Fontes</h2><span class="section-sub">edital, legislação e bases oficiais</span></div>
  <ul class="source-list">{fontes}</ul>
  <div class="callout" style="margin-top:18px"><span class="label">Limite</span><p>{limite}</p></div>
</section>

<section class="section">
  <div class="btn-row">
    <a class="btn btn-primary" href="../cargos/{cargo['slug']}.html">Voltar à preparação do cargo</a>
    <a class="btn" href="../pesquisa.html#fgv-ambiental">Pesquisa FGV — ambientais</a>
    <a class="btn" href="../plano-estudos.html">Plano de estudos</a>
    <a class="btn" href="../simulados/index.html">Simulados</a>
  </div>
</section>
<script>window.CADERNO_DATA = {data_json};</script>
"""
    return layout("caderno", cad["titulo"], body, "../",
                  f'<a href="../cargos/index.html">Cargos</a> / <a href="../cargos/{cargo["slug"]}.html">{B.esc(cargo["nome_curto"])}</a> / <b>Caderno</b>',
                  desc=cad["aviso"], cargo_id=cad["cargo_id"],
                  styles=["assets/caderno.css"], scripts=["assets/caderno.js"])


def page_edital(ctx):
    e = ctx["edital"]
    v = e["vagas_foco"]
    item_map = {}
    for l in ctx["lessons"]:
        for code in re.findall(r"\d+\.\d+", l["item_edital"]):
            item_map.setdefault(code, l["id"])
    cron = "".join(f'<tr><td>{B.esc(c["fase"])}</td><td>{B.esc(c["evento"])}</td><td class="mono">{B.esc(c.get("texto_edital") or c.get("inicio") or "")}</td></tr>' for c in e["cronograma"])
    def prog_block(title, items):
        out = []
        for it in items:
            lis = []
            for x in it["itens"]:
                lid = item_map.get(x["codigo"])
                link = f' <a class="small" href="aulas/{lid}.html">aula →</a>' if lid else ""
                lis.append(f'<li><span class="mono muted">{B.esc(x["codigo"])}</span> {B.esc(x["texto"])}{link}</li>')
            out.append(f'<details class="accordion"><summary><span>{B.esc(it["titulo"])}</span><span class="muted mono">{B.esc(it["codigo"])}</span></summary><div class="acc-body"><ul>{"".join(lis)}</ul></div></details>')
        return "".join(out)
    gerais = prog_block("Gerais", e["conteudo_programatico"]["gerais"])
    espec = prog_block("Específicos", e["conteudo_programatico"]["especificos"])
    tit = "".join(f'<tr><td>{B.esc(t["titulo"])}</td><td>{B.esc(t["descricao"])}</td><td class="mono">{t["valor"]:.2f}</td></tr>' for t in e["titulos"]["itens"])
    desemp = "".join(f'<li><strong>{d["ordem"]}.</strong> {B.esc(d["criterio"])}</li>' for d in e["desempate"]["ordem"])
    body = f"""
<section class="hero">
  <span class="kicker">Edital nº 01/2026 · publicado em 10/11/2026</span>
  <h1>O que decide a sua vaga</h1>
  <p class="lead">Resumo fiel do edital, sem interpretação. Todos os números e regras abaixo foram conferidos no PDF oficial da FGV.</p>
  <div class="stat-row">
    <div class="stat"><div class="stat-label">Vagas</div><div class="stat-num">3 <small>AC</small></div><div class="stat-note">0 PcD nesta ênfase</div></div>
    <div class="stat"><div class="stat-label">Salário</div><div class="stat-num">R$ 10.366</div><div class="stat-note">40h · CLT</div></div>
    <div class="stat"><div class="stat-label">Questões</div><div class="stat-num">70</div><div class="stat-note">20 gerais + 50 específicas</div></div>
    <div class="stat"><div class="stat-label">Prova</div><div class="stat-num">31/01/27</div><div class="stat-note">objetiva 8h · discursiva 15h</div></div>
  </div>
</section>

<section class="section">
  <div class="section-head"><h2 class="section-title">Etapas e notas</h2><span class="section-sub">nota final = 50 + 40 + 10</span></div>
  <div class="grid grid-3">
    <div class="card"><div class="kicker">1 · objetiva</div><h3>70 questões · 50 pontos</h3><p>1 ponto por acerto, convertido para 0–50. Mínimo 8/20 em Gerais e 20/50 em Específicas.</p></div>
    <div class="card"><div class="kicker">2 · discursiva</div><h3>2 questões · 40 pontos</h3><p>20 pontos cada, até 40 linhas. Mínimo 10/20 em cada. Corrigida para até 12 candidatos (4×3), incluindo empatados; PcD à parte.</p></div>
    <div class="card"><div class="kicker">3 · títulos</div><h3>até 10 pontos</h3><p>Doutorado 4,5; mestrado 3,5; especialização 2,0. Só classificatória; não elimina.</p></div>
  </div>
</section>

<section class="section">
  <div class="section-head"><h2 class="section-title">Cronograma</h2><span class="section-sub">datas oficiais do Anexo II</span></div>
  <div class="table-wrap"><table><thead><tr><th>Fase</th><th>Evento</th><th>Data</th></tr></thead><tbody>{cron}</tbody></table></div>
</section>

<section class="section">
  <div class="section-head"><h2 class="section-title">Conteúdo programático</h2><span class="section-sub">cada item tem uma aula</span></div>
  <div class="grid grid-2">
    <div><h3>Conhecimentos Gerais</h3>{gerais}</div>
    <div><h3>Conhecimentos Específicos</h3>{espec}</div>
  </div>
</section>

<section class="section">
  <div class="section-head"><h2 class="section-title">Títulos</h2><span class="section-sub">1 ponto = 1,4 questão objetiva</span></div>
  <div class="table-wrap"><table><thead><tr><th>Título</th><th>Descrição</th><th>Valor</th></tr></thead><tbody>{tit}</tbody></table></div>
</section>

<section class="section">
  <div class="section-head"><h2 class="section-title">Desempate</h2><span class="section-sub">nesta ordem</span></div>
  <ol>{desemp}</ol>
</section>

<section class="section">
  <div class="callout"><span class="label">Atenção</span><p>Este é o primeiro concurso da SP Águas: não existe nota de corte oficial. A página de <a href="estrategia.html">estratégia</a> usa concursos FGV comparáveis e marca claramente o que é estimativa.</p></div>
  <div class="btn-row"><a class="btn btn-primary" href="{next((f['url'] for f in e.get('fontes', []) if f.get('tipo') == 'edital_pdf_oficial'), '#')}" target="_blank" rel="noopener">Abrir edital oficial {icon('external', size=14)}</a><a class="btn" href="pesquisa.html">Ver pesquisa completa</a></div>
</section>
"""
    return layout("edital", "Edital", body, "", "<b>Edital</b> · regras e cronograma")


def page_estrategia(ctx):
    body = f"""
<section class="hero">
  <span class="kicker">Estratégia · 81 dias até a prova</span>
  <h1>3 vagas não perdoam amadorismo</h1>
  <p class="lead">A meta não é “saber TI”: é ficar entre os 12 primeiros na objetiva e entre os 3 melhores na final. A discursiva decide empates e elimina quem entrega pouco.</p>
  <div class="stat-row">
    <div class="stat"><div class="stat-label">Vagas</div><div class="stat-num">3</div><div class="stat-note">12 discursivas corrigidas</div></div>
    <div class="stat"><div class="stat-label">Meta conservadora</div><div class="stat-num">73</div><div class="stat-note">42/50 + 27/40 + 4,0</div></div>
    <div class="stat"><div class="stat-label">Meta agressiva</div><div class="stat-num">81,5</div><div class="stat-note">45/50 + 31/40 + 5,5</div></div>
    <div class="stat"><div class="stat-label">Corte estimado dos 12</div><div class="stat-num">52–57</div><div class="stat-note">acertos/70</div></div>
  </div>
</section>

<section class="section">
  <div class="section-head"><h2 class="section-title">Como a FGV cobra</h2><span class="section-sub">5 padrões que se repetem</span></div>
  <div class="grid grid-2">
    <div class="card"><h3>Caso antes de definição</h3><p>Personagem, órgão fictício ou tabela; a informação decisiva costuma estar na última linha do enunciado.</p></div>
    <div class="card"><h3>Alternativas verossímeis</h3><p>Quase todas parecem certas. A correta responde exatamente ao comando; as outras trocam uma palavra.</p></div>
    <div class="card"><h3>Definições trocadas</h3><p>WHERE × HAVING, INNER × LEFT, precisão × recall, ativa × passiva, impedimento × suspeição, IaaS × PaaS.</p></div>
    <div class="card"><h3>Produto ou sigla inventada</h3><p>“Power BI Consolidator” já apareceu. Em “exceto”, desconfie de nomes que você nunca viu.</p></div>
    <div class="card"><h3>Causa verdadeira, conclusão falsa</h3><p>Alternativas com “porque”: a primeira parte pode estar certa e a segunda errada.</p></div>
    <div class="card"><h3>Contagem e cálculo curto</h3><p>Linhas de JOIN, média vs mediana, precisão/recall, Mbps vs MB/s. A conta é simples; a armadilha é o denominador.</p></div>
  </div>
</section>

<section class="section">
  <div class="section-head"><h2 class="section-title">O que mais cai</h2><span class="section-sub">prioridade por retorno</span></div>
  <div class="table-wrap"><table><thead><tr><th>Bloco</th><th>Questões prováveis</th><th>Foco</th><th>Prioridade</th></tr></thead><tbody>
    <tr><td>SQL, bancos e ETL</td><td>12–14</td><td>JOINs, GROUP BY/HAVING, ER, limpeza</td><td>{tag("P1", "tag-p1")}</td></tr>
    <tr><td>Python, Pandas, estatística e ML</td><td>12–14</td><td>filtros, groupby, média/mediana, desvio, precisão/recall</td><td>{tag("P1", "tag-p1")}</td></tr>
    <tr><td>BI e governança de dados</td><td>8–10</td><td>dashboards, ciclo de vida, metadados, qualidade</td><td>{tag("P2", "tag-p2")}</td></tr>
    <tr><td>Infra, APIs, nuvem e segurança</td><td>12–14</td><td>REST, JSON/XML, IaaS/PaaS/SaaS, backup</td><td>{tag("P2", "tag-p2")}</td></tr>
    <tr><td>Gerais: dados e raciocínio</td><td>5–6</td><td>gráficos, tabelas, falácias, causa-raiz</td><td>{tag("P1", "tag-p1")}</td></tr>
    <tr><td>Gerais: águas, Estado, ética, LAI/LGPD</td><td>9–10</td><td>Lei 9.433, SINGREH, art. 37, LAI, LGPD</td><td>{tag("P1", "tag-p1")}</td></tr>
  </tbody></table></div>
  <p class="small muted">Distribuição estimada pelo número de subitens do edital e pela incidência em provas FGV de TI/dados. Não é contagem oficial.</p>
</section>

<section class="section">
  <div class="section-head"><h2 class="section-title">Cenários de nota</h2><span class="section-sub">NF = 50 × (acertos/70) + discursiva + títulos</span></div>
  <div class="table-wrap"><table><thead><tr><th>Cenário</th><th>Acertos/70</th><th>Objetiva/50</th><th>Discursiva/40</th><th>Títulos</th><th>NF</th></tr></thead><tbody>
    <tr><td>Correção (12º)</td><td>52–57</td><td>37,1–40,7</td><td>20–24</td><td>0–3,5</td><td><b>57–68</b></td></tr>
    <tr><td>Rigoroso (3º)</td><td>57–59</td><td>40,7–42,1</td><td>22–26</td><td>2–4</td><td><b>65–72</b></td></tr>
    <tr><td>Base (3º)</td><td>59–61</td><td>42,1–43,6</td><td>27–29</td><td>3,5–5</td><td><b>73–78</b></td></tr>
    <tr><td>Favorável (3º)</td><td>62–64</td><td>44,3–45,7</td><td>31–33</td><td>4,5–6</td><td><b>80–85</b></td></tr>
    <tr><td>Sem títulos</td><td>62–63</td><td>44,3–45,0</td><td>30–32</td><td>0</td><td><b>74–77</b></td></tr>
  </tbody></table></div>
  <p class="small muted">Estimativas comparativas (CVM 2024, TCE-PE 2025, TCE-PI 2025, TJRJ 2025). Não há corte oficial da SP Águas.</p>
</section>

<section class="section">
  <div class="section-head"><h2 class="section-title">Discursiva</h2><span class="section-sub">2 questões · 40 linhas · 20 pontos cada</span></div>
  <div class="grid grid-2">
    <div class="card"><h3>Estrutura de 40 linhas</h3><p><strong>1. Abertura (4–5):</strong> responda o comando e situe o problema.<br><strong>2. Desenvolvimento (28–32):</strong> 3 blocos com conceito, aplicação à SP Águas e dado/lei.<br><strong>3. Fecho (3–4):</strong> síntese e recomendação.</p></div>
    <div class="card"><h3>Checklist</h3><p>☐ Respondi todos os itens? ☐ Usei pelo menos uma lei/norma? ☐ Apliquei à regulação? ☐ Fechei com recomendação? ☐ Passei de 40 linhas?</p></div>
  </div>
  <h3 style="margin-top:22px">Temas prováveis</h3>
  <div class="grid grid-2">
    <div class="card"><h3>Governança de dados na regulação</h3><p>Qualidade, metadados, catálogo, linhagem e uso de dados para fiscalização.</p></div>
    <div class="card"><h3>Dashboards para decisão regulatória</h3><p>KPI, escolha de visual, público, frequência e limites do painel.</p></div>
    <div class="card"><h3>ETL e qualidade de dados de outorga</h3><p>Extração, limpeza, consistência, duplicidade e rastreabilidade.</p></div>
    <div class="card"><h3>LGPD e dados abertos</h3><p>Minimização, anonimização, compartilhamento e transparência.</p></div>
    <div class="card"><h3>IA/ML na fiscalização</h3><p>Classificação de risco, métricas, viés, explicabilidade e supervisão humana.</p></div>
    <div class="card"><h3>Transformação digital e segurança</h3><p>Desmaterialização, autenticação, backup e continuidade.</p></div>
  </div>
  <div class="btn-row" style="margin-top:14px"><a class="btn" href="pesquisa.html#discursiva">Ler análise discursiva completa</a></div>
</section>

<section class="section">
  <div class="callout"><span class="label">O risco</span><p>Com ~750 candidatos estimados, a vaga exige o top 12 na objetiva e o top 3 na final. Títulos podem valer até 10 pontos — o equivalente a 14 questões objetivas. Sem títulos, mire 76+.</p></div>
</section>
"""
    return layout("estrategia", "Estratégia", body, "", "<b>Estratégia</b> · banca, metas e discursiva")


def page_disciplinas_index(ctx):
    discs = ctx["cur"]["disciplinas"]
    cards = "".join(
        f'<a class="card" href="{d["slug"]}.html" data-disc-card="{d["id"]}"><div class="card-icon">{icon(d["icone"])}</div><div class="meta" style="padding:0"><span>{B.esc(d["area"])}</span><span>{sum(len(m["aulas"]) for m in d["modulos"])} aulas</span></div><h3>{B.esc(d["nome"])}</h3><p>{B.esc(d["descricao"])}</p><div class="progress-label"><span>Progresso</span><span data-disc-pct="{d["id"]}">0%</span></div><div class="progress"><div class="progress-bar" data-disc-bar="{d["id"]}"></div></div></a>'
        for d in discs)
    body = f"""
<section class="hero"><span class="kicker">45 aulas · 32h de núcleo</span><h1>Disciplinas</h1><p class="lead">Cada aula é uma página de 5–7 minutos: essencial, quadro comparativo, pegadinha, 3 questões e 3 flashcards. Nada além do edital.</p></section>
<section class="section"><div class="grid grid-3">{cards}</div></section>
"""
    return layout("disciplinas", "Disciplinas", body, "../", '<a href="../index.html">Painel</a> / <b>Disciplinas</b>', scripts=["assets/disciplinas.js"])


def page_disciplina(ctx, d):
    prio = {p["aula_id"]: p for p in ctx["prioridades"]}
    mods = []
    for m in d["modulos"]:
        rows = []
        for a in m["aulas"]:
            p = prio.get(a["id"], {})
            ptag = tag(p.get("faixa", "P2"), "tag-p1" if p.get("faixa") == "P1" else "tag-p2")
            rows.append(f'<a class="list-row" href="../aulas/{a["id"]}.html"><span class="badge-dot" data-lesson-dot="{a["id"]}"></span><span class="grow"><span class="title">{a["id"]} · {B.esc(a["titulo"])}</span><span class="sub">item {a["item_edital"]} · {a["minutos"]} min</span></span><span class="right">{ptag}</span></a>')
        mods.append(f'<details class="accordion" open><summary><span>{B.esc(m["nome"])}</span><span class="muted mono">{len(m["aulas"])} aulas</span></summary><div class="acc-body"><div class="list">{"".join(rows)}</div></div></details>')
    body = f"""
<section class="hero">
  <span class="kicker">{B.esc(d["area"])} · item {d["id"].upper()}</span>
  <h1>{B.esc(d["nome"])}</h1>
  <p class="lead">{B.esc(d["descricao"])}</p>
  <div class="hero-meta">{tag(f"{sum(len(m['aulas']) for m in d['modulos'])} aulas")}{tag("P1/P2")}{tag("estilo FGV")}</div>
</section>
<section class="section">
  <div class="section-head"><h2 class="section-title">Módulos</h2><span class="section-sub">estude na ordem; o pré-requisito está na própria aula</span></div>
  {''.join(mods)}
  <div class="callout"><span class="label">Como estudar</span><p>Leia o Essencial (10 min), feche a página e reescreva a ideia central. Depois faça as 3 questões sem consultar. Só então abra o gabarito. Marque a aula como estudada para liberar a revisão D+1.</p></div>
</section>
"""
    return layout("disciplina", d["nome"], body, "../", f'<a href="../disciplinas/index.html">Disciplinas</a> / <b>{B.esc(d["nome"])}</b>', scripts=["assets/disciplinas.js"])


def render_question(q, idx, prefix="../"):
    qid = q["_qid"]
    alts = "".join(f'<label class="q-option" data-letter="{k}"><input type="radio" name="{qid}" value="{k}"><span><b>{k})</b> {B.inline_md(q["alternativas"][k])}</span></label>' for k in "ABCDE")
    return f"""<div class="q" data-qid="{qid}" data-answer="{q['gabarito']}">
  <div class="q-head"><span class="q-num">Q{idx} · {B.esc(q['nivel'])}</span></div>
  <div class="q-stem">{B.question_md(q['enunciado'])}</div>
  <div class="q-options">{alts}</div>
  <div class="q-actions"><button class="btn btn-sm" data-check>Conferir</button><span class="q-result"></span></div>
  <div class="q-feedback" data-comment="{B.inline_md(q['comentario']).replace('"', '&quot;')}"></div>
</div>"""


def page_aula(ctx, l, prev, nxt):
    qs = []
    for i, q in enumerate(l["questions"], 1):
        qq = dict(q)
        qq["_qid"] = f"q-{l['id']}-{i}"
        qs.append(render_question(qq, i))
    cards = "".join(f'<div class="flashcard" data-card-id="f-{l["id"]}-{i}"><div><div class="fc-label">{B.esc(l["disciplina_nome"])}</div><div class="fc-text">{B.inline_md(c["pergunta"])}</div><div class="fc-answer"><strong>Resposta:</strong> {B.inline_md(c["resposta"])}</div></div><div class="fc-hint">Clique para revelar · avalie abaixo</div></div><div class="fc-controls"><button class="btn btn-sm" data-card-known="0">Errei</button><button class="btn btn-sm btn-primary" data-card-known="1">Acertei</button></div>' for i, c in enumerate(l["cards"], 1))
    sources = "".join(f'<li><a href="{s["url"]}" target="_blank" rel="noopener">{B.esc(s["titulo"])}</a></li>' for s in l["sources"])
    toc = "".join(f'<a href="#s{k}">{k}. {B.esc(l["secs_titulos"][k])}</a>' for k in ["1", "2", "3", "4"] if k in l["secs"])
    toc += '<a href="#questoes">5. Questões</a><a href="#flashcards">6. Flashcards</a><a href="#fontes">7. Fontes</a>'
    secs = ""
    for k in ["1", "2", "3", "4"]:
        if k in l["secs"]:
            secs += f'<section id="s{k}"><h2>{k}. {B.esc(l["secs_titulos"][k])}</h2>{B.md_to_html(l["secs"][k])}</section>'
    prev_html = f'<a href="{prev["id"]}.html"><span>← Anterior</span>{B.esc(prev["titulo"])}</a>' if prev else "<span></span>"
    next_html = f'<a class="next" href="{nxt["id"]}.html"><span>Próxima →</span>{B.esc(nxt["titulo"])}</a>' if nxt else "<span></span>"
    body = f"""
<header class="lesson-header">
  <div class="kicker">{B.esc(l['disciplina_nome'])} · {B.esc(l['modulo_nome'])} · item {l['item_edital']}</div>
  <h1>{B.esc(l['titulo'])}</h1>
  <p class="lead">{B.inline_md(l['idea'])}</p>
  <div class="lesson-meta">{tag(f"{l['tempo']} min")}{tag(l['nivel'])}{tag("P1" if any(p['aula_id']==l['id'] and p['faixa']=='P1' for p in ctx['prioridades']) else "P2", "tag-p1" if any(p['aula_id']==l['id'] and p['faixa']=='P1' for p in ctx['prioridades']) else "tag-p2")}</div>
</header>
<div class="lesson-layout">
  <article class="lesson-body">
    <blockquote><strong>Ideia central:</strong> {B.inline_md(l['idea'])}</blockquote>
    {secs}
    <section id="questoes"><h2>5. Questões</h2><p class="small muted">Responda sem consultar. O comentário só aparece depois de conferir.</p>{''.join(qs)}</section>
    <section id="flashcards"><h2>6. Flashcards</h2><p class="small muted">Um fato por card. Clique para revelar e avalie sua lembrança.</p>{cards}</section>
    <section id="fontes"><h2>7. Fontes</h2><ul class="source-list">{sources}</ul></section>
    <div class="lesson-actions"><button class="btn" data-mark-lesson="{l['id']}">Marcar como estudada</button><span class="small muted">Revisões: D+1 · D+7 · D+30</span></div>
    <label class="small muted" for="notes">Suas anotações (salvas neste navegador)</label>
    <textarea class="notes" id="notes" data-notes="{l['id']}" placeholder="O que você errou? Qual a regra?"></textarea>
    <div class="prevnext">{prev_html}{next_html}</div>
  </article>
  <aside class="toc"><div class="section-title">Nesta aula</div>{toc}</aside>
</div>
"""
    return layout("aula", l["titulo"], body, "../", f'<a href="../disciplinas/index.html">Disciplinas</a> / <a href="../disciplinas/{l["disciplina_slug"]}.html">{B.esc(l["disciplina_nome"])}</a> / <b>{B.esc(l["titulo"])}</b>', scripts=["assets/lesson.js"])


def page_discursiva(ctx):
    temas = []
    for t in ctx["temas"]:
        prob = str(t.get("probabilidade", "")).replace("-", " ")
        conceitos = "".join(f"<li>{B.esc(x)}</li>" for x in t.get("conceitos_obrigatorios", []))
        blocos = "".join(f'<li><strong>{B.esc(b.get("bloco", ""))} ({B.esc(b.get("linhas_sugeridas", ""))} linhas):</strong> {B.esc(b.get("conteudo", ""))}</li>' for b in t.get("estrutura_3_blocos", []))
        repertorio = "".join(f"<li>{B.esc(x)}</li>" for x in t.get("repertorio_legal_tecnico", []))
        erros = "".join(f"<li>{B.esc(x)}</li>" for x in t.get("erros_a_evitar", []))
        fontes = "".join(f'<li><a href="{f["url"]}" target="_blank" rel="noopener">{B.esc(f["titulo"])}</a></li>' for f in t.get("fontes", []))
        temas.append(f"""<details class="accordion">
  <summary><span>{B.esc(t['titulo'])}</span><span class="tag {'tag-p1' if 'alta' in prob else 'tag-p2'}">{B.esc(prob)}</span></summary>
  <div class="acc-body lesson-body">
    <p><strong>Por que é provável:</strong> {B.esc(t.get('por_que_provavel', ''))}</p>
    <p><strong>Conexão com a SP Águas:</strong> {B.esc(t.get('conexao_sp_aguas', ''))}</p>
    <h4>Conceitos que não podem faltar</h4><ul>{conceitos}</ul>
    <h4>Estrutura em 3 blocos</h4><ul>{blocos}</ul>
    <h4>Repertório legal e técnico</h4><ul>{repertorio}</ul>
    <h4>Comando de treino (não oficial)</h4><p>{B.esc(t.get('comando_treino', ''))}</p>
    <h4>Erros a evitar</h4><ul>{erros}</ul>
    <h4>Fontes</h4><ul>{fontes}</ul>
  </div>
</details>""")
    body = f"""
<section class="hero">
  <span class="kicker">2 questões · 40 linhas · 20 pontos cada</span>
  <h1>Discursiva</h1>
  <p class="lead">A prova que mais elimina. Mínimo de 10/20 em cada questão e correção só para os 12 primeiros. Não é redação escolar: é parecer técnico com lei, dado e recomendação.</p>
  <div class="stat-row">
    <div class="stat"><div class="stat-label">Questões</div><div class="stat-num">2</div><div class="stat-note">40 linhas cada</div></div>
    <div class="stat"><div class="stat-label">Mínimo por questão</div><div class="stat-num">10/20</div><div class="stat-note">50% da nota</div></div>
    <div class="stat"><div class="stat-label">Peso na final</div><div class="stat-num">40</div><div class="stat-note">de 100 pontos</div></div>
    <div class="stat"><div class="stat-label">Meta</div><div class="stat-num">27/40</div><div class="stat-note">13,5 em cada</div></div>
  </div>
</section>

<section class="section">
  <div class="section-head"><h2 class="section-title">Template de 40 linhas</h2><span class="section-sub">abertura · desenvolvimento · fecho</span></div>
  <div class="table-wrap"><table><thead><tr><th>Bloco</th><th>Linhas</th><th>O que entra</th></tr></thead><tbody>
    <tr><td><strong>Abertura</strong></td><td>1–5</td><td>Responda o comando em uma frase e situe o problema. Diga qual é a tese.</td></tr>
    <tr><td><strong>Desenvolvimento 1</strong></td><td>6–15</td><td>Conceito + norma/aula + aplicação à SP Águas. Um parágrafo, uma ideia.</td></tr>
    <tr><td><strong>Desenvolvimento 2</strong></td><td>16–27</td><td>Diagnóstico ou método: como fazer, com dado, indicador, SQL, fórmula ou fluxo.</td></tr>
    <tr><td><strong>Desenvolvimento 3</strong></td><td>28–35</td><td>Riscos, limites, LGPD, segurança ou trade-offs. Mostre que você sabe o que pode dar errado.</td></tr>
    <tr><td><strong>Fecho</strong></td><td>36–40</td><td>Síntese e recomendação. Não introduza tema novo.</td></tr>
  </tbody></table></div>
</section>

<section class="section">
  <div class="section-head"><h2 class="section-title">Português que a banca cobra</h2><span class="section-sub">clareza vale mais que erudição</span></div>
  <div class="grid grid-2">
    <div class="card"><h3>Frases curtas</h3><p>Uma ideia por frase. Sujeito claro, verbo forte, complemento próximo. Se a frase tem 3 orações, corte.</p></div>
    <div class="card"><h3>Voz ativa</h3><p>“A SP Águas fiscaliza” em vez de “a fiscalização é realizada pela SP Águas”. Mais direto e menos erro de concordância.</p></div>
    <div class="card"><h3>Conectivos</h3><p>Use “portanto”, “além disso”, “por outro lado”, “em consequência”. Não comece todo parágrafo com “O”.</p></div>
    <div class="card"><h3>Sem coloquialismo</h3><p>Nada de “a gente”, “dá para”, “muito legal”. Registro formal, sem juridiquês decorado.</p></div>
    <div class="card"><h3>Números e leis</h3><p>Cite a norma e o artigo quando tiver certeza. Se não tiver, descreva a regra sem inventar número.</p></div>
    <div class="card"><h3>Revisão de 5 minutos</h3><p>Procure: concordância, crase, “onde” por “em que”, “mas/mais”, “porque/por que”, pontuação e repetição.</p></div>
  </div>
</section>

<section class="section">
  <div class="section-head"><h2 class="section-title">12 temas prováveis</h2><span class="section-sub">probabilidade, estrutura e repertório</span></div>
  {''.join(temas)}
</section>

<section class="section">
  <div class="section-head"><h2 class="section-title">Como treinar</h2><span class="section-sub">50 minutos por questão</span></div>
  <div class="grid grid-3">
    <div class="card"><div class="kicker">5 min</div><h3>Esqueleto</h3><p>Leia o comando, marque o verbo e os itens (a/b/c). Escreva 5 tópicos e a tese.</p></div>
    <div class="card"><div class="kicker">35 min</div><h3>Escrever</h3><p>Sem consulta. Use o template. Deixe o fecho para o fim e não passe de 40 linhas.</p></div>
    <div class="card"><div class="kicker">10 min</div><h3>Corrigir</h3><p>Checklist: comando, lei, aplicação, recomendação, português. Anote o erro e reescreva o parágrafo.</p></div>
  </div>
  <div class="callout"><span class="label">Frequência</span><p>Uma por semana até dezembro; duas por semana em janeiro. Alterne temas de dados (governança, ETL, ML) e de regulação (outorga, cobrança, fiscalização).</p></div>
  <div class="btn-row"><a class="btn" href="pesquisa.html#discursiva">Ler análise discursiva completa</a><a class="btn" href="estrategia.html">Voltar à estratégia</a></div>
</section>
"""
    return layout("discursiva", "Discursiva", body, "", "<b>Discursiva</b> · template, temas e português")


def page_simulados_index(ctx):
    sims = ctx["sims"]
    cards = []
    for s in sims:
        typ = {"diagnostico": "Diagnóstico", "disciplina": "Disciplina", "geral": "Gerais", "especifico": "Específicas", "final": "Final"}.get(s["tipo"], s["tipo"])
        cards.append(f'<div class="card" data-sim-card="{s["id"]}"><div class="meta" style="padding:0"><span>{tag(typ, "tag-p1" if s["tipo"] == "final" else "")}</span><span>{s["tempo_min"]} min</span></div><h3>{B.esc(s["titulo"])}</h3><p>{B.esc(s["descricao"])}</p><div class="meta"><span>{len(s["questoes"])} questões</span><span data-sim-best="{s["id"]}">—</span></div><div class="btn-row"><a class="btn btn-primary btn-sm" href="simulado.html?id={s["id"]}">Iniciar prova</a><a class="btn btn-sm" href="simulado.html?id={s["id"]}&modo=estudo">Modo estudo</a></div></div>')
    body = f"""
<section class="hero"><span class="kicker">Correção automática · feedback comentado</span><h1>Simulados</h1><p class="lead">Comece pelo diagnóstico. Depois alterne disciplina, gerais e específicas. Na última semana, faça o final às 8h, sem consulta, em 4 horas.</p><div class="hero-meta">{tag("70 questões no final")}{tag("modo prova")}{tag("modo estudo")}</div></section>
<section class="section"><div class="section-head"><h2 class="section-title">Escolha um simulado</h2><span class="section-sub">o melhor resultado fica salvo</span></div><div class="grid grid-3">{''.join(cards)}</div></section>
<section class="section"><div class="callout"><span class="label">Como usar</span><p><strong>Modo prova:</strong> cronômetro, sem feedback até o fim. <strong>Modo estudo:</strong> feedback imediato por questão. Os simulados gerais e específicos sorteiam questões dos bancos; os simulados por disciplina usam todas as questões dela.</p></div></section>
"""
    return layout("simulados", "Simulados", body, "../", '<a href="../index.html">Painel</a> / <b>Simulados</b>', scripts=["assets/simulados.js"])


def page_simulado(ctx):
    body = """
<section class="hero" style="padding-bottom:16px">
  <span class="kicker">Simulado · correção automática</span>
  <h1 id="quiz-title">Carregando…</h1>
  <p class="lead" id="quiz-desc"></p>
  <div class="hero-meta"><span class="tag" id="quiz-meta"></span></div>
</section>
<div class="quiz-shell" id="quiz">
  <div class="quiz-main" id="quiz-main"></div>
  <aside class="quiz-side">
    <div class="section-title">Tempo</div>
    <div class="quiz-timer" id="quiz-timer">—</div>
    <div class="section-title" style="margin-top:14px">Progresso</div>
    <div class="small muted" id="quiz-progress">0 de 0</div>
    <div class="palette" id="quiz-palette"></div>
    <div class="quiz-legend">Número = questão<br>Contorno = atual<br>Preenchido = respondida</div>
    <div class="btn-row" style="margin-top:14px">
      <button class="btn btn-sm" id="quiz-prev">← Anterior</button>
      <button class="btn btn-sm" id="quiz-next">Próxima →</button>
    </div>
    <button class="btn btn-primary" id="quiz-submit" style="width:100%;margin-top:10px">Enviar respostas</button>
    <a class="btn btn-ghost btn-sm" href="index.html" style="width:100%;margin-top:6px">Sair</a>
  </aside>
</div>
"""
    return layout("simulado", "Simulado", body, "../", '<a href="../simulados/index.html">Simulados</a> / <b>Prova</b>', scripts=["dados/questoes.js", "dados/simulados.js", "assets/quiz.js"])


def page_flashcards(ctx):
    discs = ctx["cur"]["disciplinas"]
    disc_btns = "".join(f'<button class="btn btn-sm" data-fc-disc="{d["id"]}">{B.esc(d["nome"].split(",")[0])}</button>' for d in discs)
    body = f"""
<section class="hero"><span class="kicker">Active recall · repetição espaçada</span><h1>Flashcards</h1><p class="lead">135 cards, um fato por card. Revele a resposta, avalie sua lembrança e o sistema agenda a próxima revisão (caixas 1–5).</p></section>
<section class="section"><div id="fc-app">
  <div class="fc-progress" id="fc-counts"></div>
  <div class="btn-row" style="margin-bottom:8px"><button class="btn btn-sm btn-primary" data-fc-status="all">Todos</button><button class="btn btn-sm" data-fc-status="due">Para hoje</button><button class="btn btn-sm" data-fc-status="new">Novos</button><button class="btn btn-sm" data-fc-status="known">Dominados</button><button class="btn btn-sm" id="fc-shuffle">Embaralhar</button></div>
  <div class="btn-row" style="margin-bottom:14px"><button class="btn btn-sm btn-primary" data-fc-disc="all">Todas</button>{disc_btns}</div>
  <div id="fc-stage"></div>
  <div class="small muted" style="margin-top:10px">Atalhos: espaço revela · 1 errei · 2 acertei · <span id="fc-pos">0 / 0</span></div>
</div></section>
"""
    return layout("flashcards", "Flashcards", body, "", "<b>Flashcards</b>", scripts=["dados/flashcards.js", "assets/flashcards.js"])


def page_plano(ctx):
    plano = ctx["plano"]
    today = date.today().isoformat()
    rows = []
    for w in plano:
        cur = " week-current" if w["inicio"] <= today <= w["fim"] else ""
        rows.append(f'<tr class="{cur}"><td class="mono">{w["id"]}</td><td><b>{w["periodo"]}</b></td><td>{B.esc(w["foco"])}</td><td>{B.esc(w["tarefas"])}</td><td>{B.esc(w["checkpoint"])}</td></tr>')
    cargo_plan_blocks = ""
    for c in ctx["cargos"]["cargos"]:
        plan_rows = "".join(
            f'<tr><td class="mono">{p["fase"]}</td><td class="mono">{B.esc(p["periodo"])}</td><td><b>{B.esc(p["foco"])}</b></td><td>{B.esc(p["tarefas"])}</td><td>{B.esc(p["checkpoint"])}</td></tr>'
            for p in c["plano"])
        plan_note = ("Plano de 5 fases do material completo; o cronograma detalhado está logo abaixo."
                     if c["status"] == "completo" else
                     "Plano de 5 fases da trilha curada. Ajuste as horas ao seu tempo e mantenha 20 questões/dia.")
        plan_caderno = (f' <a href="cadernos/{c["caderno"]["slug"]}.html">Abrir o caderno específico →</a>'
                        if c.get("caderno") else "")
        cargo_plan_blocks += (f'<div data-plan-block="{c["id"]}" hidden>'
                              f'<div class="section-head"><h2 class="section-title">{B.esc(c["enfase"])}</h2>'
                              f'<span class="section-sub">{c["vagas_total"]} vagas · {B.esc(c["status_label"])}</span></div>'
                              f'<div class="table-wrap table-wide"><table><thead><tr><th>Fase</th><th>Período</th><th>Foco</th><th>Tarefas</th><th>Checkpoint</th></tr></thead>'
                              f'<tbody>{plan_rows}</tbody></table></div>'
                              f'<p class="small muted" style="margin-top:8px">{plan_note}{plan_caderno}</p></div>')
    body = f"""
<section class="hero"><span class="kicker">Plano personalizado · 11 semanas · 2h/dia</span><h1>Daqui até 31 de janeiro</h1><p class="lead">81 dias, ~160 horas. O bloco abaixo segue o cargo escolhido na barra de configuração. O cronograma detalhado (S0–S11) é o do material completo de TI; as outras ênfases usam a sequência de 5 fases do plano específico.</p><div class="hero-meta">{tag("2h por dia")}{tag("revisão D+1/D+7/D+30")}{tag("3 simulados completos")}</div></section>
<section class="section"><div class="section-head"><h2 class="section-title">Plano do cargo selecionado</h2><span class="section-sub">troque o cargo na barra acima</span></div><div class="callout"><span class="label">Como ler</span><p>O bloco do cargo selecionado mostra a sequência específica. Se você escolher TI, o cronograma detalhado (S0–S11) aparece logo abaixo.</p></div>{cargo_plan_blocks}</section>
<div data-plan-ti>
<section class="section"><div class="section-head"><h2 class="section-title">Rotina diária de 2h</h2><span class="section-sub">ajuste os blocos, não a frequência</span></div><div class="grid grid-4">
  <div class="card"><div class="kicker">15 min</div><h3>Revisão</h3><p>Flashcards vencidos + 2 questões da aula anterior, sem consultar.</p></div>
  <div class="card"><div class="kicker">55 min</div><h3>Aula nova</h3><p>Uma aula de 30–60 min. Leia, feche e reescreva a ideia central.</p></div>
  <div class="card"><div class="kicker">35 min</div><h3>Questões</h3><p>10–15 questões do tema + correção. Anote erro → causa → regra.</p></div>
  <div class="card"><div class="kicker">15 min</div><h3>Discursiva</h3><p>Um parágrafo de 10 linhas ou reescrita de um trecho. 3x por semana.</p></div>
</div></section>
<section class="section"><div class="section-head"><h2 class="section-title">Cronograma</h2><span class="section-sub">a semana atual aparece destacada</span></div><div class="table-wrap table-wide"><table><thead><tr><th>Sem.</th><th>Período</th><th>Foco</th><th>Tarefas</th><th>Checkpoint</th></tr></thead><tbody>{''.join(rows)}</tbody></table></div></section>
<section class="section"><div class="section-head"><h2 class="section-title">Regras do plano</h2><span class="section-sub">o que não é negociável</span></div><div class="grid grid-2">
  <div class="card"><h3>Ordem</h3><p>SQL → Python/Pandas → estatística → ML → BI/governança → infra → águas → direito/ética → LGPD → discursiva. Gerais entram 30 min/dia desde a primeira semana para não estourar o mínimo de 8/20.</p></div>
  <div class="card"><h3>Revisão</h3><p>D+1: 10 min. D+7: 15 min. D+30: 20 min. Se acertar menos de 60% em D+7, antecipe para D+3. Erro volta uma caixa; acerto dobra o intervalo.</p></div>
  <div class="card"><h3>Simulados</h3><p>A partir da semana 3, um por semana. Nas semanas 9–10, dois completos às 8h de domingo, com a discursiva à tarde.</p></div>
  <div class="card"><h3>Discursiva</h3><p>Uma por semana a partir da semana 2. Sempre com cronômetro de 50 min e correção por checklist. Meta: 27/40.</p></div>
</div></section>
</div>
<section class="section"><div class="callout"><span class="label">Se você tem menos de 2h</span><p>Mantenha 20 min de questões + 20 min de flashcards + 1 aula curta. Corte o tempo de leitura, nunca a recuperação ativa.</p></div><div class="btn-row"><button class="btn" onclick="window.print()">{icon('print', size=14)} Imprimir plano</button><a class="btn" href="dashboard.html">Acompanhar progresso</a></div></section>
"""
    return layout("plano", "Plano de estudos", body, "", "<b>Plano de estudos</b>")


def page_dashboard(ctx):
    body = f"""
<section class="hero"><span class="kicker">Progresso local · sem login</span><h1>Estatísticas</h1><p class="lead">Tudo fica no seu navegador. Use para decidir a próxima sessão: o que está fraco, o que venceu e quanto falta.</p></section>
<section class="section"><div class="stat-row">
  <div class="stat"><div class="stat-label">Aulas</div><div class="stat-num" id="dash-lessons">0/45</div><div class="progress" style="margin-top:8px"><div class="progress-bar" id="dash-bar-lessons"></div></div></div>
  <div class="stat"><div class="stat-label">Questões</div><div class="stat-num" id="dash-questions">0</div><div class="stat-note"><span id="dash-accuracy">—</span> de acerto</div></div>
  <div class="stat"><div class="stat-label">Flashcards</div><div class="stat-num" id="dash-cards">0/135</div><div class="progress" style="margin-top:8px"><div class="progress-bar" id="dash-bar-cards"></div></div></div>
  <div class="stat"><div class="stat-label">Simulados</div><div class="stat-num" id="dash-sims">0</div><div class="stat-note">sequência: <b id="dash-streak">0</b> dias</div></div>
</div></section>
<section class="section"><div class="section-head"><h2 class="section-title">Por disciplina</h2><span class="section-sub">aulas estudadas e acerto em questões</span></div><div id="dash-disciplinas"></div></section>
<section class="section"><div class="section-head"><h2 class="section-title">Pontos fracos</h2><span class="section-sub">menor acerto com pelo menos 3 tentativas</span></div><div id="dash-fracos"></div></section>
<section class="section"><div class="section-head"><h2 class="section-title">Simulados recentes</h2><span class="section-sub">últimos 8</span></div><div id="dash-sims-list"></div></section>
<section class="section"><div class="callout"><span class="label">Reset</span><p>Apagar o progresso é irreversível. Use apenas se quiser começar do zero.</p><button class="btn" id="dash-reset">Apagar progresso</button></div></section>
"""
    return layout("dashboard", "Estatísticas", body, "", "<b>Estatísticas</b>", scripts=["dados/questoes.js", "dados/flashcards.js", "assets/dashboard.js"])


def page_revisoes(ctx):
    body = f"""
<section class="hero"><span class="kicker">Repetição espaçada</span><h1>Revisões</h1><p class="lead">Aulas vencidas pelo intervalo D+1/D+7/D+30 e flashcards com revisão para hoje. Se não houver nada, estude uma aula nova.</p><div class="hero-meta">{tag("D+1")}{tag("D+7")}{tag("D+30")}{tag("D+60")}</div></section>
<section class="section"><div class="section-head"><h2 class="section-title">Aulas vencidas</h2><span class="section-sub"><b id="rev-count-lessons">0</b> para revisar</span></div><div id="rev-lessons"></div></section>
<section class="section"><div class="section-head"><h2 class="section-title">Flashcards para hoje</h2><span class="section-sub"><b id="rev-count-cards">0</b> cards</span></div><div id="rev-cards"></div></section>
<section class="section"><div class="callout"><span class="label">Como funciona</span><p>Ao marcar uma aula como estudada, ela entra na fila. A primeira revisão é D+1; depois D+7, D+30 e D+60. Flashcards usam caixas 1–5: erro volta para a caixa 1; acerto sobe uma caixa.</p></div></section>
"""
    return layout("revisoes", "Revisões", body, "", "<b>Revisões</b>", scripts=["dados/flashcards.js", "assets/revisoes.js"])


def page_fontes(ctx):
    groups = {}
    for l in ctx["lessons"]:
        groups.setdefault(l["disciplina_nome"], {})
        for s in l["sources"]:
            groups[l["disciplina_nome"]][s["url"]] = s["titulo"]
    blocks = []
    for name, items in groups.items():
        lis = "".join(f'<li><a href="{u}" target="_blank" rel="noopener">{B.esc(t)}</a><br><span class="mono small muted">{B.esc(u)}</span></li>' for u, t in sorted(items.items()))
        blocks.append(f'<details class="accordion"><summary><span>{B.esc(name)}</span><span class="muted mono">{len(items)} links</span></summary><div class="acc-body"><ul class="source-list">{lis}</ul></div></details>')
    caderno_cards = "".join(
        f'<a class="card" href="cadernos/{cad["slug"]}.html"><h3>{B.esc(cad["titulo"].replace("Caderno específico — ", ""))}</h3>'
        f'<p>{sum(len(m["licoes"]) for m in cad["modulos"])} lições, {len(cad["questoes"])} questões e '
        f'{sum(len(m["cards"]) for m in cad["modulos"])} flashcards.</p></a>'
        for cad in ctx["cadernos"])
    body = f"""
<section class="hero"><span class="kicker">Transparência · coleta 11/11/2026</span><h1>Fontes</h1><p class="lead">Toda aula aponta para documentação oficial, legislação ou referência técnica. Links verificados na data de coleta; sites com bloqueio anti-bot (ISO) podem exigir navegador.</p></section>
<section class="section"><div class="section-head"><h2 class="section-title">Links por disciplina</h2><span class="section-sub">mesmos links do rodapé de cada aula</span></div>{''.join(blocks)}</section>
<section class="section"><div class="section-head"><h2 class="section-title">Documentos do projeto</h2><span class="section-sub">pesquisa, metodologia e QA</span></div><div class="grid grid-2">
  <a class="card" href="pesquisa.html"><h3>Pesquisa completa</h3><p>Edital estruturado, análise da banca, estratégia, discursiva e metodologia.</p></a>
  <a class="card" href="cargos/index.html"><h3>Cargos e trilhas</h3><p>8 ênfases, vagas, salário e preparação por cargo.</p></a>
  {caderno_cards}
  <a class="card" href="pesquisa/edital_resumo.md"><h3>Edital resumido (md)</h3><p>Versão markdown para leitura offline.</p></a>
  <a class="card" href="pesquisa/base_legislacao.md"><h3>Base de legislação</h3><p>Leis artigo por artigo, com links oficiais.</p></a>
  <a class="card" href="pesquisa/repositorio_conhecimento.json"><h3>Repositório de fontes</h3><p>129 fontes classificadas por disciplina e tópico.</p></a>
</div></section>
<section class="section"><div class="callout"><span class="label">Fonte primária</span><p><a href="https://conhecimento.fgv.br/sites/default/files/concursos/edital_sp_aguas_versao-final-revisao-comissao-versao-aprovada_aasncskaj_0.pdf" target="_blank" rel="noopener">Edital nº 01/2026 — PDF oficial da FGV</a> · <a href="https://doe.sp.gov.br/executivo/secretaria-de-meio-ambiente-infraestrutura-e-logistica/edital-n-01-2026-2026110913311162268742" target="_blank" rel="noopener">DOE-SP</a></p></div></section>
"""
    return layout("fontes", "Fontes", body, "", "<b>Fontes</b>")


def page_pesquisa(ctx):
    docs = [
        ("edital", "Edital resumido", "pesquisa/edital_resumo.md"),
        ("cargos-edital", "Cargos e Anexo I", "pesquisa/cargos_edital_anexo.md"),
        ("fgv-admin", "FGV — cargos administrativos", "pesquisa/fgv_cargos_administrativos.md"),
        ("fgv-ambiental", "FGV — cargos ambientais", "pesquisa/fgv_cargos_ambientais.md"),
        ("banca", "Análise da banca FGV", "pesquisa/analise_banca.md"),
        ("estrategia", "Estratégia de aprovação", "pesquisa/estrategia_aprovacao.md"),
        ("discursiva", "Análise da discursiva", "pesquisa/analise_discursiva.md"),
        ("metodologia", "Metodologia do material", "pesquisa/metodologia_material.md"),
        ("qa-juridico", "QA jurídico", "pesquisa/qa_juridico.md"),
        ("qa-dados", "QA de SQL, Python e ML", "pesquisa/qa_tecnico_dados.md"),
        ("qa-infra", "QA de infraestrutura e lógica", "pesquisa/qa_tecnico_infra.md"),
    ]
    blocks = []
    for anchor, title, path in docs:
        p = BASE / path
        if not p.exists():
            continue
        html = B.md_to_html(p.read_text(encoding="utf-8"))
        blocks.append(f'<details class="accordion" id="{anchor}"><summary><span>{B.esc(title)}</span><span class="muted mono">markdown</span></summary><div class="acc-body lesson-body">{html}</div></details>')
    body = f"""
<section class="hero"><span class="kicker">Fase de pesquisa · concluída antes do conteúdo</span><h1>Pesquisa completa</h1><p class="lead">Documentos que sustentam o material: edital, banca, concorrência, discursiva, metodologia de aprendizagem e revisão de qualidade. Leia o que precisar; o site já resume o essencial.</p><div class="hero-meta">{tag("fonte primária")}{tag("fatos × estimativas")}{tag("QA independente")}</div></section>
<section class="section">{''.join(blocks)}</section>
"""
    return layout("pesquisa", "Pesquisa", body, "", '<a href="fontes.html">Fontes</a> / <b>Pesquisa</b>')


# ---------------------------------------------------------------- main
def main():
    global CARGOS_DATA
    ctx = {}
    cur, lessons, questions, cards, sims, plano, prioridades, edital, temas, cargos, cadernos = load_all()
    CARGOS_DATA = cargos
    ctx.update(cur=cur, lessons=lessons, questions=questions, cards=cards, sims=sims, plano=plano, prioridades=prioridades, edital=edital, temas=temas, cargos=cargos, cadernos=cadernos)

    write_derived(lessons)
    search = build_search(lessons, sims, cargos, cadernos)

    # data files
    for name, data in [("aulas", lessons), ("questoes", questions), ("flashcards", cards), ("simulados", sims), ("busca", search), ("plano", plano)]:
        (DADOS / f"{name}.json").write_text(json.dumps(data, ensure_ascii=False, indent=1), encoding="utf-8")
    B.write_js("aulas.js", "AULAS", [{k: v for k, v in l.items() if k not in ("secs", "intro_md", "path", "texto")} for l in lessons])
    B.write_js("questoes.js", "QUESTOES", questions)
    B.write_js("flashcards.js", "FLASHCARDS", cards)
    B.write_js("simulados.js", "SIMULADOS", sims)
    B.write_js("busca.js", "BUSCA", search)
    B.write_js("plano.js", "PLANO", plano)
    B.write_js("cargos.js", "CARGOS", cargos)

    # root pages
    pages = {
        "index.html": page_index(ctx),
        "edital.html": page_edital(ctx),
        "estrategia.html": page_estrategia(ctx),
        "flashcards.html": page_flashcards(ctx),
        "discursiva.html": page_discursiva(ctx),
        "plano-estudos.html": page_plano(ctx),
        "dashboard.html": page_dashboard(ctx),
        "revisoes.html": page_revisoes(ctx),
        "fontes.html": page_fontes(ctx),
        "pesquisa.html": page_pesquisa(ctx),
    }
    for name, html in pages.items():
        (BASE / name).write_text(html, encoding="utf-8")

    # cargos
    (BASE / "cargos").mkdir(exist_ok=True)
    (BASE / "cargos" / "index.html").write_text(page_cargos_index(ctx), encoding="utf-8")
    for c in cargos["cargos"]:
        (BASE / "cargos" / f"{c['slug']}.html").write_text(page_cargo(ctx, c), encoding="utf-8")

    # cadernos específicos
    (BASE / "cadernos").mkdir(exist_ok=True)
    for cad in cadernos:
        (BASE / "cadernos" / f"{cad['slug']}.html").write_text(page_caderno(ctx, cad), encoding="utf-8")

    # disciplines
    (BASE / "disciplinas").mkdir(exist_ok=True)
    (BASE / "disciplinas" / "index.html").write_text(page_disciplinas_index(ctx), encoding="utf-8")
    for d in cur["disciplinas"]:
        (BASE / "disciplinas" / f"{d['slug']}.html").write_text(page_disciplina(ctx, d), encoding="utf-8")

    # lessons
    (BASE / "aulas").mkdir(exist_ok=True)
    for i, l in enumerate(lessons):
        prev = lessons[i - 1] if i > 0 else None
        nxt = lessons[i + 1] if i + 1 < len(lessons) else None
        (BASE / "aulas" / f"{l['id']}.html").write_text(page_aula(ctx, l, prev, nxt), encoding="utf-8")

    # simulados
    (BASE / "simulados").mkdir(exist_ok=True)
    (BASE / "simulados" / "index.html").write_text(page_simulados_index(ctx), encoding="utf-8")
    (BASE / "simulados" / "simulado.html").write_text(page_simulado(ctx), encoding="utf-8")

    # clean-url aliases (redirect to the canonical root pages)
    for alias, target in [("flashcards", "../flashcards.html"), ("plano-estudos", "../plano-estudos.html"), ("dashboard", "../dashboard.html")]:
        (BASE / alias).mkdir(exist_ok=True)
        (BASE / alias / "index.html").write_text(
            f'<!doctype html><html lang="pt-BR"><head><meta charset="utf-8">'
            f'<meta http-equiv="refresh" content="0; url={target}">'
            f'<link rel="canonical" href="{target}"><title>Redirecionando…</title></head>'
            f'<body><p>Esta página mudou. <a href="{target}">Continuar</a>.</p></body></html>',
            encoding="utf-8")

    print(f"OK: {len(lessons)} aulas, {len(questions)} questões, {len(cards)} cards, {len(sims)} simulados, {len(cargos['cargos'])} cargos, {len(cadernos)} caderno(s)")
    print(f"Páginas: {len(pages) + 1 + len(cargos['cargos']) + len(cadernos) + 1 + len(cur['disciplinas']) + len(lessons) + 2}")


if __name__ == "__main__":
    main()
