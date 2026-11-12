(function () {
  "use strict";

  const AULAS = window.AULAS || [];
  const CARDS = window.FLASHCARDS || [];
  if (!window.SP) return;
  const s = window.SP.state();
  const today = window.SP.today();

  function addDays(iso, n) {
    const d = new Date(iso + "T12:00:00");
    d.setDate(d.getDate() + n);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  }
  const intervals = [1, 7, 30, 60];

  const dueLessons = [];
  Object.entries(s.lessons || {}).forEach(([id, l]) => {
    if (!l || !l.studied || !l.last) return;
    const n = (l.reviews || []).length;
    const next = addDays(l.last, intervals[Math.min(n, intervals.length - 1)]);
    if (next <= today) dueLessons.push({ id, last: l.last, next, reviews: n });
  });
  dueLessons.sort((a, b) => a.next.localeCompare(b.next));

  const dueCards = CARDS.filter(c => {
    const st = s.cards[c.id];
    return st && st.due && st.due <= today;
  });

  const box = document.getElementById("rev-lessons");
  if (box) {
    if (!dueLessons.length) box.innerHTML = `<div class="empty">Nenhuma aula vencida. Estude uma nova ou volte amanhã.</div>`;
    else box.innerHTML = `<div class="list">${dueLessons.map(x => {
      const a = AULAS.find(y => y.id === x.id) || { titulo: x.id, disciplina_nome: "" };
      return `<div class="list-row"><span class="badge-dot done"></span><div class="grow"><div class="title">${a.titulo}</div><div class="sub">${a.disciplina_nome} · última revisão ${x.last} · intervalo ${intervals[Math.min(x.reviews, 3)]}d</div></div><div class="right"><a class="btn btn-sm" href="aulas/${x.id}.html">Revisar</a> <button class="btn btn-sm" data-review="${x.id}">Feito</button></div></div>`;
    }).join("")}</div>`;
  }

  const cbox = document.getElementById("rev-cards");
  if (cbox) {
    if (!dueCards.length) cbox.innerHTML = `<div class="empty">Nenhum flashcard vencido. Volte amanhã ou estude novos cards.</div>`;
    else cbox.innerHTML = `<div class="list">${dueCards.slice(0, 12).map(c => `<div class="list-row"><span class="badge-dot done"></span><div class="grow"><div class="title">${c.pergunta}</div><div class="sub">${c.disciplina_nome} · ${c.aula_titulo}</div></div><div class="right"><a class="btn btn-sm" href="flashcards.html">Revisar</a></div></div>`).join("")}</div>`;
  }

  document.querySelectorAll("[data-review]").forEach(b => b.addEventListener("click", () => {
    window.SP.addReview(b.getAttribute("data-review"));
    b.textContent = "Feito ✓";
    b.disabled = true;
  }));

  const lc = document.getElementById("rev-count-lessons");
  const cc = document.getElementById("rev-count-cards");
  if (lc) lc.textContent = String(dueLessons.length);
  if (cc) cc.textContent = String(dueCards.length);
})();
