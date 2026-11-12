(function () {
  "use strict";
  const AULAS = window.AULAS || [];
  if (!window.SP) return;
  const s = window.SP.state();

  document.querySelectorAll("[data-disc-card]").forEach(card => {
    const did = card.getAttribute("data-disc-card");
    const aulas = AULAS.filter(a => a.disciplina === did);
    const done = aulas.filter(a => (s.lessons[a.id] || {}).studied).length;
    const pct = aulas.length ? Math.round(100 * done / aulas.length) : 0;
    const p = card.querySelector(`[data-disc-pct="${did}"]`);
    const b = card.querySelector(`[data-disc-bar="${did}"]`);
    if (p) p.textContent = pct + "%";
    if (b) b.style.width = pct + "%";
  });

  document.querySelectorAll("[data-lesson-dot]").forEach(dot => {
    const id = dot.getAttribute("data-lesson-dot");
    if ((s.lessons[id] || {}).studied) dot.classList.add("done");
  });
})();
