(function () {
  "use strict";

  const root = document.getElementById("fc-app");
  if (!root) return;
  const all = window.FLASHCARDS || [];
  const state = { disc: "all", status: "all", deck: [], idx: 0, revealed: false };

  function today() { return window.SP ? window.SP.today() : new Date().toISOString().slice(0, 10); }
  function cardState(id) { return window.SP ? window.SP.card(id) : { box: 1, due: today() }; }
  function normalize(s) { return (s || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase(); }
  function esc(s) {
    return String(s === null || s === undefined ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  function buildDeck() {
    let list = all.slice();
    if (state.disc !== "all") list = list.filter(c => c.disciplina === state.disc);
    if (state.status === "due") list = list.filter(c => { const st = cardState(c.id); return !st.due || st.due <= today(); });
    if (state.status === "known") list = list.filter(c => cardState(c.id).box >= 3);
    if (state.status === "new") list = list.filter(c => !cardState(c.id).last);
    state.deck = list;
    state.idx = 0;
    state.revealed = false;
    render();
  }

  function counts() {
    const known = all.filter(c => cardState(c.id).box >= 3).length;
    const due = all.filter(c => { const st = cardState(c.id); return !st.due || st.due <= today(); }).length;
    const seen = all.filter(c => cardState(c.id).last).length;
    return { known, due, seen, total: all.length };
  }

  function renderCounts() {
    const c = counts();
    const el = document.getElementById("fc-counts");
    if (el) el.innerHTML = `<span><b>${c.total}</b> cards</span><span><b>${c.seen}</b> vistos</span><span><b>${c.known}</b> dominados</span><span><b>${c.due}</b> para hoje</span>`;
  }

  function render() {
    renderCounts();
    const card = state.deck[state.idx];
    const stage = document.getElementById("fc-stage");
    const pos = document.getElementById("fc-pos");
    if (!stage) return;
    if (!card) {
      stage.innerHTML = `<div class="empty">Nenhum card neste filtro. Mude o filtro ou estude uma aula primeiro.</div>`;
      if (pos) pos.textContent = "0 / 0";
      return;
    }
    const st = cardState(card.id);
    stage.innerHTML = `
      <div class="flashcard ${state.revealed ? "revealed" : ""}" data-card-id="${esc(card.id)}">
        <div>
          <div class="fc-label">${esc(card.disciplina_nome)} · ${esc(card.aula_titulo)} · caixa ${st.box}</div>
          <div class="fc-text">${esc(card.pergunta)}</div>
          <div class="fc-answer"><strong>Resposta:</strong> ${esc(card.resposta)}</div>
        </div>
        <div class="fc-hint">${state.revealed ? "Avalie: você lembrou?" : "Clique para revelar · espaço"}</div>
      </div>
      <div class="fc-controls">
        <button class="btn" data-again>Errei · 1</button>
        <button class="btn btn-primary" data-known>Acertei · 2</button>
        <button class="btn btn-ghost" data-flip>Revelar · espaço</button>
      </div>`;
    const fc = stage.querySelector(".flashcard");
    fc.addEventListener("click", () => { state.revealed = !state.revealed; render(); });
    stage.querySelector("[data-flip]").addEventListener("click", e => { e.stopPropagation(); state.revealed = !state.revealed; render(); });
    stage.querySelector("[data-again]").addEventListener("click", e => { e.stopPropagation(); review(false); });
    stage.querySelector("[data-known]").addEventListener("click", e => { e.stopPropagation(); review(true); });
    if (pos) pos.textContent = `${state.idx + 1} / ${state.deck.length}`;
  }

  function review(known) {
    const card = state.deck[state.idx];
    if (!card) return;
    if (window.SP) window.SP.reviewCard(card.id, known);
    state.revealed = false;
    if (state.status === "due" || state.status === "new" || state.status === "learning") {
      buildDeck();
      return;
    }
    if (state.idx < state.deck.length - 1) {
      state.idx++;
    } else {
      state.idx = 0;
      state.deck = state.deck.slice();
    }
    render();
  }

  document.querySelectorAll("[data-fc-disc]").forEach(b => b.addEventListener("click", () => {
    document.querySelectorAll("[data-fc-disc]").forEach(x => x.classList.remove("btn-primary"));
    b.classList.add("btn-primary");
    state.disc = b.getAttribute("data-fc-disc");
    buildDeck();
  }));
  document.querySelectorAll("[data-fc-status]").forEach(b => b.addEventListener("click", () => {
    document.querySelectorAll("[data-fc-status]").forEach(x => x.classList.remove("btn-primary"));
    b.classList.add("btn-primary");
    state.status = b.getAttribute("data-fc-status");
    buildDeck();
  }));
  const shuffle = document.getElementById("fc-shuffle");
  if (shuffle) shuffle.addEventListener("click", () => {
    state.deck = state.deck.slice().sort(() => Math.random() - 0.5);
    state.idx = 0; state.revealed = false; render();
  });
  document.addEventListener("keydown", e => {
    if (/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) return;
    if (e.key === " ") { e.preventDefault(); state.revealed = !state.revealed; render(); }
    if (e.key === "1") review(false);
    if (e.key === "2") review(true);
  });

  buildDeck();
})();
