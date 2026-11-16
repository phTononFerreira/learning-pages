(function () {
  "use strict";

  function esc(v) {
    return String(v === null || v === undefined ? "" : v)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  // Comentários vêm do build já decodificados pelo atributo; escapa tudo e
  // reabilita apenas as tags usadas nos comentários didáticos.
  function safeComment(raw) {
    return esc(raw)
      .replace(/&lt;(\/?)(code|strong|em|b)&gt;/gi, function (m, close, tag) {
        return "<" + close + tag.toLowerCase() + ">";
      })
      .replace(/&lt;br\s*\/?&gt;/gi, "<br>");
  }

  document.querySelectorAll(".q").forEach(q => {
    const qid = q.getAttribute("data-qid");
    const answer = q.getAttribute("data-answer");
    const options = [...q.querySelectorAll(".q-option")];
    const inputs = [...q.querySelectorAll("input[type=radio]")];
    const check = q.querySelector("[data-check]");
    const feedback = q.querySelector(".q-feedback");
    const result = q.querySelector(".q-result");

    inputs.forEach(inp => {
      inp.addEventListener("change", () => {
        options.forEach(o => o.classList.remove("selected"));
        const lab = inp.closest(".q-option");
        if (lab) lab.classList.add("selected");
      });
    });

    if (check) check.addEventListener("click", () => {
      const sel = inputs.find(i => i.checked);
      if (!sel) { if (result) result.textContent = "Escolha uma alternativa."; return; }
      const chosen = sel.value;
      const ok = chosen === answer;
      options.forEach(o => {
        const letter = o.getAttribute("data-letter");
        o.classList.remove("selected");
        if (letter === answer) o.classList.add("correct");
        if (letter === chosen && !ok) o.classList.add("incorrect");
      });
      inputs.forEach(i => i.disabled = true);
      check.disabled = true;
      if (feedback) {
        feedback.classList.add("show");
        feedback.innerHTML = `<b>${ok ? "Você acertou." : "Resposta correta: " + esc(answer) + "."}</b> ${safeComment(feedback.getAttribute("data-comment") || "")}`;
      }
      if (result) result.textContent = ok ? "Registrado: acerto." : "Registrado: erro.";
      if (window.SP && qid) window.SP.recordQuestion(qid, ok);
    });
  });

  document.querySelectorAll(".flashcard").forEach(card => {
    const cid = card.getAttribute("data-card-id");
    const reveal = () => card.classList.toggle("revealed");
    card.addEventListener("click", e => {
      if (e.target.closest("[data-card-known]")) return;
      reveal();
    });
    card.addEventListener("keydown", e => {
      if (e.key === " " || e.key === "Enter") { e.preventDefault(); reveal(); }
    });
    card.setAttribute("tabindex", "0");
    const controls = card.nextElementSibling && card.nextElementSibling.classList.contains("fc-controls")
      ? card.nextElementSibling
      : card;
    controls.querySelectorAll("[data-card-known]").forEach(btn => {
      btn.addEventListener("click", e => {
        e.stopPropagation();
        const known = btn.getAttribute("data-card-known") === "1";
        if (window.SP && cid) {
          const c = window.SP.reviewCard(cid, known);
          const label = card.querySelector(".fc-hint");
          if (label) label.textContent = `Revisão agendada para ${c.due} · caixa ${c.box}`;
        }
      });
    });
  });

  // TOC active state
  const tocLinks = [...document.querySelectorAll(".toc a[href^='#']")];
  if (tocLinks.length && "IntersectionObserver" in window) {
    const map = new Map();
    tocLinks.forEach(a => {
      const el = document.querySelector(a.getAttribute("href"));
      if (el) map.set(el, a);
    });
    const obs = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          tocLinks.forEach(a => a.style.color = "");
          const a = map.get(en.target);
          if (a) a.style.color = "var(--accent)";
        }
      });
    }, { rootMargin: "-90px 0px -70% 0px" });
    map.forEach((a, el) => obs.observe(el));
  }
})();
