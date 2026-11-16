(function () {
  "use strict";

  const root = document.getElementById("quiz");
  if (!root) return;

  const params = new URLSearchParams(location.search);
  const simId = params.get("id") || "diagnostico";
  const modo = params.get("modo") === "estudo" ? "estudo" : "prova";
  const sim = (window.SIMULADOS || []).find(s => s.id === simId);
  const allQ = window.QUESTOES || [];

  function esc(s) {
    return String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  function fmt(s) {
    return esc(s).replace(/`([^`]+)`/g, "<code>$1</code>").replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  }
  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  function fmtTime(sec) {
    sec = Math.max(0, Math.floor(sec));
    const h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), s = sec % 60;
    return h > 0 ? `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}` : `${m}:${String(s).padStart(2, "0")}`;
  }

  if (!sim) {
    root.innerHTML = `<div class="empty">Simulado não encontrado. <a href="index.html">Voltar aos simulados</a>.</div>`;
    return;
  }

  const questions = (sim.questoes || []).map(id => allQ.find(q => q.id === id)).filter(Boolean);
  if (!questions.length) {
    root.innerHTML = `<div class="empty">Questões indisponíveis. <a href="index.html">Voltar aos simulados</a>.</div>`;
    return;
  }
  const state = {
    idx: 0,
    answers: {},
    flags: new Set(),
    submitted: false,
    remaining: sim.tempo_min * 60,
    deadline: Date.now() + sim.tempo_min * 60000,
    started: Date.now(),
    order: {},
    checked: new Set()
  };

  questions.forEach(q => {
    state.order[q.id] = Object.keys(q.alternativas);
  });

  document.title = sim.titulo + " — SP Águas";
  const title = document.getElementById("quiz-title");
  const desc = document.getElementById("quiz-desc");
  const meta = document.getElementById("quiz-meta");
  if (title) title.textContent = sim.titulo;
  if (desc) desc.textContent = sim.descricao;
  if (meta) meta.textContent = `${questions.length} questões · ${sim.tempo_min} min · ${modo === "estudo" ? "modo estudo (feedback imediato)" : "modo prova"}`;

  const main = document.getElementById("quiz-main");
  const palette = document.getElementById("quiz-palette");
  const timer = document.getElementById("quiz-timer");
  const progress = document.getElementById("quiz-progress");
  const submit = document.getElementById("quiz-submit");
  const prev = document.getElementById("quiz-prev");
  const next = document.getElementById("quiz-next");

  function answeredCount() { return Object.keys(state.answers).length; }

  function renderPalette() {
    if (!palette) return;
    palette.innerHTML = questions.map((q, i) => {
      const cls = [i === state.idx ? "current" : "", state.answers[q.id] ? "answered" : "", state.flags.has(q.id) ? "flagged" : ""].join(" ");
      return `<button type="button" class="${cls}" data-jump="${i}" title="Questão ${i + 1}">${i + 1}</button>`;
    }).join("");
    palette.querySelectorAll("[data-jump]").forEach(b => b.addEventListener("click", () => {
      state.idx = Number(b.getAttribute("data-jump"));
      render();
    }));
  }

  function renderProgress() {
    if (progress) progress.textContent = `${answeredCount()} de ${questions.length} respondidas`;
  }

  function renderQuestion() {
    const q = questions[state.idx];
    const selected = state.answers[q.id];
    const isChecked = state.checked.has(q.id);
    const correct = selected && selected.orig === q.gabarito;
    const options = state.order[q.id].map((letter, i) => {
      const display = "ABCDE"[i];
      const text = q.alternativas[letter];
      let cls = "q-option";
      if (selected && selected.orig === letter) cls += " selected";
      if (isChecked && letter === q.gabarito) cls += " correct";
      if (isChecked && selected && selected.orig === letter && !correct) cls += " incorrect";
      return `<label class="${cls}" data-letter="${display}" data-orig="${letter}">
        <input type="radio" name="qq" value="${letter}" ${selected && selected.orig === letter ? "checked" : ""} ${isChecked ? "disabled" : ""}>
        <span><b>${display})</b> ${fmt(text)}</span>
      </label>`;
    }).join("");
    const feedback = isChecked ? `<div class="q-feedback show"><b>${correct ? "Você acertou." : "Resposta correta: " + q.gabarito + "."}</b> ${fmt(q.comentario)}</div>` : "";
    const checkBtn = modo === "estudo" && !isChecked ? `<button class="btn btn-sm" data-check>Conferir</button>` : "";
    main.innerHTML = `
      <div class="q" data-qid="${q.id}">
        <div class="q-head">
          <span class="q-num">Questão ${state.idx + 1} de ${questions.length} · ${esc(q.nivel)}</span>
          <button class="btn btn-sm ${state.flags.has(q.id) ? "btn-primary" : ""}" data-flag>${state.flags.has(q.id) ? "Marcada" : "Marcar"}</button>
        </div>
        <div class="q-stem">${fmt(q.enunciado)}</div>
        <div class="q-options">${options}</div>
        <div class="q-actions">${checkBtn}<span class="q-result"></span></div>
        ${feedback}
      </div>`;
    main.querySelectorAll("input[type=radio]").forEach(inp => {
      inp.addEventListener("change", () => {
        state.answers[q.id] = { orig: inp.value, text: q.alternativas[inp.value] };
        state.checked.delete(q.id);
        renderProgress();
        renderPalette();
        const qq = main.querySelector(".q");
        qq.querySelectorAll(".q-option").forEach(o => o.classList.remove("selected"));
        inp.closest(".q-option").classList.add("selected");
        if (modo === "prova") renderQuestion();
      });
    });
    main.querySelector("[data-flag]").addEventListener("click", () => {
      if (state.flags.has(q.id)) state.flags.delete(q.id); else state.flags.add(q.id);
      render();
    });
    const check = main.querySelector("[data-check]");
    if (check) check.addEventListener("click", () => {
      const sel = state.answers[q.id];
      if (!sel) { const r = main.querySelector(".q-result"); if (r) r.textContent = "Escolha uma alternativa."; return; }
      state.checked.add(q.id);
      if (window.SP) window.SP.recordQuestion(q.id, sel.orig === q.gabarito);
      renderQuestion();
    });
    if (prev) prev.disabled = state.idx === 0;
    if (next) next.textContent = state.idx === questions.length - 1 ? "Última" : "Próxima →";
    renderPalette();
    renderProgress();
  }

  function render() {
    if (state.submitted) return;
    renderQuestion();
  }

  function submitQuiz(auto) {
    if (state.submitted) return;
    const unanswered = questions.length - answeredCount();
    if (!auto && unanswered > 0 && !confirm(`Você deixou ${unanswered} questão(ões) sem resposta. Enviar assim mesmo?`)) return;
    state.submitted = true;
    if (timer) timer.textContent = "—";
    clearInterval(state.timerId);
    const correct = questions.filter(q => state.answers[q.id] && state.answers[q.id].orig === q.gabarito).length;
    const pct = Math.round(100 * correct / questions.length);
    const elapsed = Math.max(0, Math.min(sim.tempo_min * 60, Math.round((Date.now() - state.started) / 1000)));
    if (window.SP) {
      window.SP.recordSim({
        id: sim.id, titulo: sim.titulo, data: new Date().toISOString(),
        acertos: correct, total: questions.length, pct, tempo_seg: elapsed, modo
      });
    }
    const review = questions.map((q, i) => {
      const a = state.answers[q.id];
      const ok = a && a.orig === q.gabarito;
      return `<div class="review-item">
        <div class="review-tag">Q${i + 1} · ${esc(q.nivel)} · ${ok ? "acertou" : "errou"}</div>
        <div class="q-stem">${fmt(q.enunciado)}</div>
        <div class="review-answer">Sua resposta: <b>${a ? fmt(a.text) : "em branco"}</b></div>
        <div class="review-answer">Correta: <b>${fmt(q.alternativas[q.gabarito])}</b></div>
        <div class="review-answer">${fmt(q.comentario)}</div>
      </div>`;
    }).join("");
    main.innerHTML = `
      <div class="quiz-result">
        <div class="kicker">Resultado</div>
        <div class="quiz-score">${correct}<small>/${questions.length} · ${pct}%</small></div>
        <p class="muted" style="margin-top:10px">Tempo: ${fmtTime(elapsed)} · ${modo === "estudo" ? "modo estudo" : "modo prova"}</p>
        <div class="btn-row">
          <a class="btn btn-primary" href="simulado.html?id=${encodeURIComponent(sim.id)}">Refazer</a>
          <a class="btn" href="index.html">Outros simulados</a>
          <a class="btn" href="../dashboard.html">Ver estatísticas</a>
        </div>
      </div>
      <div class="section-head"><h2>Correção comentada</h2></div>
      ${review}`;
    if (palette) palette.innerHTML = "";
    if (submit) submit.style.display = "none";
    if (prev) prev.style.display = "none";
    if (next) next.style.display = "none";
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (prev) prev.addEventListener("click", () => { if (state.idx > 0) { state.idx--; render(); } });
  if (next) next.addEventListener("click", () => { if (state.idx < questions.length - 1) { state.idx++; render(); } });
  if (submit) submit.addEventListener("click", () => submitQuiz(false));

  state.timerId = setInterval(() => {
    if (state.submitted) return;
    state.remaining = Math.max(0, Math.ceil((state.deadline - Date.now()) / 1000));
    if (timer) {
      timer.textContent = fmtTime(state.remaining);
      timer.classList.toggle("warn", state.remaining < 300);
    }
    if (state.remaining <= 0) { clearInterval(state.timerId); submitQuiz(true); }
  }, 1000);
  if (timer) timer.textContent = fmtTime(state.remaining);

  document.addEventListener("keydown", e => {
    if (state.submitted) return;
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    const ae = document.activeElement;
    if (ae && (/^(INPUT|TEXTAREA|SELECT)$/.test(ae.tagName) || ae.isContentEditable)) return;
    if (document.querySelector(".search-overlay.open")) return;
    if (e.key === "ArrowRight" && next) next.click();
    if (e.key === "ArrowLeft" && prev) prev.click();
    if (/^[1-5]$/.test(e.key) && main) {
      const inputs = main.querySelectorAll("input[type=radio]");
      const i = Number(e.key) - 1;
      if (inputs[i]) { inputs[i].checked = true; inputs[i].dispatchEvent(new Event("change")); }
    }
  });

  render();
})();
