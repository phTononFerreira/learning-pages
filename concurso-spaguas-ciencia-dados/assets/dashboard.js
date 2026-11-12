(function () {
  "use strict";

  const AULAS = window.AULAS || [];
  const QUESTOES = window.QUESTOES || [];
  const FLASHCARDS = window.FLASHCARDS || [];
  if (!window.SP) return;
  const s = window.SP.state();
  const stats = window.SP.stats();

  function pct(a, b) { return b ? Math.round(100 * a / b) : 0; }
  function set(id, value) { const el = document.getElementById(id); if (el) el.textContent = value; }
  function bar(id, p) { const el = document.getElementById(id); if (el) el.style.width = p + "%"; }

  set("dash-lessons", `${stats.lessonsDone}/${stats.lessonsTotal}`);
  set("dash-questions", stats.qAttempts ? `${stats.qCorrect}/${stats.qAttempts}` : "0");
  set("dash-accuracy", stats.qAttempts ? `${Math.round(100 * stats.qCorrect / stats.qAttempts)}%` : "—");
  set("dash-cards", `${stats.cardsKnown}/${stats.cTotal}`);
  set("dash-sims", String(stats.sims.length));
  bar("dash-bar-lessons", pct(stats.lessonsDone, stats.lessonsTotal));
  bar("dash-bar-cards", pct(stats.cardsKnown, stats.cTotal));

  // streak
  const days = new Set(s.activity || []);
  let streak = 0;
  const d = new Date();
  for (;;) {
    const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    if (days.has(iso)) { streak++; d.setDate(d.getDate() - 1); } else break;
  }
  set("dash-streak", String(streak));

  // per discipline
  const cont = document.getElementById("dash-disciplinas");
  if (cont) {
    const discs = [...new Set(AULAS.map(a => a.disciplina))];
    cont.innerHTML = discs.map(did => {
      const aulas = AULAS.filter(a => a.disciplina === did);
      const done = aulas.filter(a => (s.lessons[a.id] || {}).studied).length;
      const qs = QUESTOES.filter(q => q.disciplina === did);
      const qa = qs.reduce((acc, q) => acc + ((s.questions[q.id] || {}).attempts || 0), 0);
      const qc = qs.reduce((acc, q) => acc + ((s.questions[q.id] || {}).correct || 0), 0);
      const name = aulas[0] ? aulas[0].disciplina_nome : did;
      return `<div style="margin-bottom:16px">
        <div class="progress-label"><span>${name}</span><span><b>${done}/${aulas.length}</b> aulas · ${qa ? Math.round(100 * qc / qa) + "% em questões" : "sem questões"}</span></div>
        <div class="progress"><div class="progress-bar" style="width:${pct(done, aulas.length)}%"></div></div>
      </div>`;
    }).join("");
  }

  // weak points
  const weak = document.getElementById("dash-fracos");
  if (weak) {
    const rows = [...new Set(QUESTOES.map(q => q.disciplina))].map(did => {
      const qs = QUESTOES.filter(q => q.disciplina === did);
      const a = qs.reduce((acc, q) => acc + ((s.questions[q.id] || {}).attempts || 0), 0);
      const c = qs.reduce((acc, q) => acc + ((s.questions[q.id] || {}).correct || 0), 0);
      return { did, nome: qs[0] ? qs[0].disciplina_nome : did, a, c, p: a ? Math.round(100 * c / a) : null };
    }).filter(x => x.a >= 3).sort((x, y) => x.p - y.p);
    if (!rows.length) weak.innerHTML = `<div class="empty">Responda pelo menos 3 questões por disciplina para ver seus pontos fracos.</div>`;
    else weak.innerHTML = `<div class="list">${rows.slice(0, 5).map(x => `<div class="list-row"><div class="grow"><div class="title">${x.nome}</div><div class="sub">${x.c} acertos em ${x.a} tentativas</div></div><div class="right"><b style="color:${x.p < 60 ? "var(--accent)" : "var(--fg)"}">${x.p}%</b></div></div>`).join("")}</div>`;
  }

  // sims
  const sims = document.getElementById("dash-sims-list");
  if (sims) {
    if (!stats.sims.length) sims.innerHTML = `<div class="empty">Nenhum simulado feito ainda. <a href="simulados/index.html">Comece pelo diagnóstico</a>.</div>`;
    else sims.innerHTML = `<div class="table-wrap"><table><thead><tr><th>Simulado</th><th>Data</th><th>Acertos</th><th>%</th></tr></thead><tbody>${stats.sims.slice().reverse().slice(0, 8).map(x => `<tr><td>${x.titulo}</td><td>${new Date(x.data).toLocaleDateString("pt-BR")}</td><td>${x.acertos}/${x.total}</td><td><b>${x.pct}%</b></td></tr>`).join("")}</tbody></table></div>`;
  }

  const reset = document.getElementById("dash-reset");
  if (reset) reset.addEventListener("click", () => {
    if (confirm("Apagar todo o progresso (aulas, questões, flashcards e simulados)?")) {
      localStorage.removeItem("spaguas.v1");
      location.reload();
    }
  });
})();
