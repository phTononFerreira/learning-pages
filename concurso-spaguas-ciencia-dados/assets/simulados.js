(function () {
  "use strict";
  if (!window.SP) return;
  const s = window.SP.state();
  document.querySelectorAll("[data-sim-best]").forEach(el => {
    const id = el.getAttribute("data-sim-best");
    const runs = (s.sims || []).filter(x => x.id === id);
    if (!runs.length) { el.textContent = "—"; return; }
    const best = runs.reduce((a, b) => (b.pct > a.pct ? b : a), runs[0]);
    el.innerHTML = `melhor: <b>${best.pct}%</b>`;
  });
})();
