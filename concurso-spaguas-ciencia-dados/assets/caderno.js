/* Motor interativo dos cadernos específicos.
   Quiz + flashcards com caixas 1-5 + simulado de 20 questões.
   Sem dependências, sem fetch e sem CDN. */
(function () {
  "use strict";

  if (window.__spaguasCaderno) return;
  window.__spaguasCaderno = true;

  var DATA = (window.CADERNO_DATA && typeof window.CADERNO_DATA === "object") ? window.CADERNO_DATA : {};
  var slug = String(DATA.slug || "caderno").trim() || "caderno";
  var STORAGE_KEY = "spaguas.caderno." + slug;
  var MAX_BOX = 5;
  var MASTERED_BOX = 3;
  var SIM_SIZE = 20;
  var SIM_SECONDS = 30 * 60;

  var questions = normalizeQuestions(DATA.questoes);
  var modules = Array.isArray(DATA.modulos) ? DATA.modulos.filter(function (m) {
    return m && typeof m === "object";
  }) : [];
  var moduleNames = Object.create(null);
  var flatCards = [];

  modules.forEach(function (m, mi) {
    var id = asString(m.id);
    var name = asString(m.nome || m.name || m.titulo);
    if (id && name) moduleNames[id] = name;
    var cards = Array.isArray(m.cards) ? m.cards : [];
    cards.forEach(function (c) {
      if (!c || typeof c !== "object") return;
      flatCards.push({ p: asString(c.p), r: asString(c.r), moduleIndex: mi });
    });
  });

  function asString(v) {
    return v === null || v === undefined ? "" : String(v);
  }

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined && text !== null) node.textContent = asString(text);
    return node;
  }

  function clear(node) {
    while (node && node.firstChild) node.removeChild(node.firstChild);
    return node;
  }

  function pct(part, total) {
    return total ? Math.round((100 * part) / total) : 0;
  }

  function fmtTime(totalSeconds) {
    var sec = Math.max(0, Math.floor(totalSeconds || 0));
    var h = Math.floor(sec / 3600);
    var m = Math.floor((sec % 3600) / 60);
    var s = sec % 60;
    return h > 0
      ? h + ":" + String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0")
      : m + ":" + String(s).padStart(2, "0");
  }

  function todayISO() {
    var d = new Date();
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }

  function shuffle(list) {
    var a = list.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = a[i];
      a[i] = a[j];
      a[j] = tmp;
    }
    return a;
  }

  function normalizeQuestions(source) {
    var seenIds = Object.create(null);
    return (Array.isArray(source) ? source : []).map(function (q, index) {
      if (!q || typeof q !== "object") return null;
      var alternativas = {};
      if (q.alternativas && typeof q.alternativas === "object" && !Array.isArray(q.alternativas)) {
        Object.keys(q.alternativas).forEach(function (key) {
          var letter = asString(key).trim().toUpperCase();
          if (/^[A-Z]$/.test(letter)) alternativas[letter] = asString(q.alternativas[key]);
        });
      }
      var letters = Object.keys(alternativas).sort();
      var gabarito = asString(q.gabarito).trim().toUpperCase();
      if (letters.length < 2 || !alternativas[gabarito]) return null;

      var id = asString(q.id).trim() || "q-" + (index + 1);
      if (seenIds[id]) {
        var suffix = 2;
        while (seenIds[id + "-" + suffix]) suffix++;
        id = id + "-" + suffix;
      }
      seenIds[id] = true;

      return {
        id: id,
        modulo: asString(q.modulo).trim(),
        nivel: asString(q.nivel).trim(),
        enunciado: asString(q.enunciado).trim(),
        alternativas: alternativas,
        letters: letters,
        gabarito: gabarito,
        comentario: asString(q.comentario).trim()
      };
    }).filter(Boolean);
  }

  // ------------------------------------------------------------------ storage

  function defaultState() {
    return { v: 1, quiz: {}, cards: {}, sim: null };
  }

  function readState() {
    var out = defaultState();
    try {
      var raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return out;
      var parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return out;

      if (parsed.quiz && typeof parsed.quiz === "object" && !Array.isArray(parsed.quiz)) {
        Object.keys(parsed.quiz).forEach(function (key) {
          var item = parsed.quiz[key];
          if (!item || typeof item !== "object") return;
          var choice = asString(item.choice).trim().toUpperCase();
          if (!/^[A-Z]$/.test(choice)) return;
          out.quiz[key] = {
            choice: choice,
            ok: item.ok === true || item.ok === 1,
            at: asString(item.at)
          };
        });
      }

      if (parsed.cards && typeof parsed.cards === "object" && !Array.isArray(parsed.cards)) {
        Object.keys(parsed.cards).forEach(function (key) {
          var card = parsed.cards[key];
          if (!card || typeof card !== "object") return;
          var box = parseInt(card.box, 10);
          if (!isFinite(box)) box = 1;
          box = Math.max(1, Math.min(MAX_BOX, box));
          out.cards[key] = {
            box: box,
            seen: Math.max(0, parseInt(card.seen, 10) || 0),
            last: asString(card.last)
          };
        });
      }

      if (parsed.sim && typeof parsed.sim === "object" && !Array.isArray(parsed.sim)) {
        var sim = parsed.sim;
        var best = sim.best;
        var attempts = Math.max(0, parseInt(sim.attempts, 10) || 0);
        if (!best && typeof sim.pct === "number") best = sim;
        if (best && typeof best === "object") {
          var total = parseInt(best.total, 10);
          var hits = parseInt(best.acertos, 10);
          if (isFinite(total) && total > 0 && isFinite(hits)) {
            var percent = parseInt(best.pct, 10);
            if (!isFinite(percent)) percent = pct(hits, total);
            out.sim = {
              attempts: attempts,
              best: {
                acertos: Math.max(0, Math.min(total, hits)),
                total: total,
                pct: Math.max(0, Math.min(100, percent)),
                seg: Math.max(0, parseInt(best.seg, 10) || 0),
                at: asString(best.at)
              }
            };
          }
        }
        if (!out.sim) out.sim = { attempts: attempts, best: null };
      }
    } catch (e) {
      return defaultState();
    }
    return out;
  }

  var state = readState();

  function saveState() {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      /* modo privado ou armazenamento indisponível */
    }
  }

  // --------------------------------------------------------------------- quiz

  var scoreEl = null;
  var progressEl = null;
  var quizItems = [];

  function altLetter(li, index) {
    var b = li.querySelector("b");
    if (b) {
      var match = /^\s*([A-Za-z])\s*\)/.exec(b.textContent || "");
      if (match) return match[1].toUpperCase();
    }
    return "ABCDE".charAt(index);
  }

  function altText(li) {
    var clone = li.cloneNode(true);
    var b = clone.querySelector("b");
    if (b && b.parentNode) b.parentNode.removeChild(b);
    return (clone.textContent || "").replace(/\s+/g, " ").trim();
  }

  function initQuiz() {
    var detailsEls = Array.prototype.slice.call(document.querySelectorAll(".question"));
    if (!detailsEls.length) return;

    var byId = Object.create(null);
    questions.forEach(function (q) { byId[q.id] = q; });
    var usedKeys = Object.create(null);
    var changed = false;

    detailsEls.forEach(function (details, index) {
      var q = byId[details.id] || questions[index] || null;
      if (!q) return;
      var altsList = details.querySelector("ul.alts");
      if (!altsList) return;

      var altEls = Array.prototype.filter.call(altsList.children, function (node) {
        return node && node.tagName === "LI";
      });
      if (altEls.length < 2) return;

      var key = q.id || details.id || "q-" + (index + 1);
      if (usedKeys[key]) {
        var suffix = 2;
        var base = key;
        while (usedKeys[base + "-" + suffix]) suffix++;
        key = base + "-" + suffix;
      }
      usedKeys[key] = true;

      var altItems = [];
      var seenLetters = Object.create(null);
      altEls.forEach(function (li, liIndex) {
        var letter = altLetter(li, liIndex);
        if (!letter || seenLetters[letter]) return;
        seenLetters[letter] = true;
        var text = altText(li);
        li.classList.add("caderno-alt");
        li.setAttribute("role", "button");
        li.setAttribute("tabindex", "0");
        li.setAttribute("aria-pressed", "false");
        li.setAttribute("aria-label", "Alternativa " + letter + ": " + (text || "sem texto"));
        li.setAttribute("data-letter", letter);
        altItems.push({ el: li, letter: letter, text: text });
      });
      if (!altItems.some(function (alt) { return alt.letter === q.gabarito; })) return;

      details.classList.add("caderno-q");
      details.setAttribute("data-caderno-qid", key);

      var feedback = el("div", "caderno-q-feedback");
      feedback.hidden = true;
      feedback.setAttribute("role", "status");
      feedback.setAttribute("aria-live", "polite");

      var feedbackText = el("span", "caderno-q-feedback-text");
      feedback.appendChild(feedbackText);

      var actions = el("div", "caderno-q-actions");
      var retry = el("button", "btn btn-sm caderno-q-retry", "Refazer");
      retry.type = "button";
      retry.setAttribute("aria-label", "Refazer a questão " + (index + 1));
      actions.appendChild(retry);
      feedback.appendChild(actions);
      altsList.parentNode.insertBefore(feedback, altsList.nextSibling);

      var summary = details.querySelector("summary");
      var summarySpans = summary ? Array.prototype.filter.call(summary.children, function (node) {
        return node.tagName === "SPAN";
      }) : [];
      var summaryTag = summarySpans.length > 1 ? summarySpans[summarySpans.length - 1] : null;
      var summaryDefault = summaryTag ? summaryTag.textContent : "";

      var item = {
        details: details,
        key: key,
        q: q,
        altsList: altsList,
        altItems: altItems,
        answer: details.querySelector("details.answer"),
        feedback: feedback,
        feedbackText: feedbackText,
        retry: retry,
        summaryTag: summaryTag,
        summaryDefault: summaryDefault,
        index: index
      };

      function select(letter) {
        if (state.quiz[key]) {
          if (item.answer) item.answer.open = true;
          return;
        }
        var ok = letter === q.gabarito;
        state.quiz[key] = { choice: letter, ok: ok, at: new Date().toISOString() };
        saveState();
        applyAnswer(item, state.quiz[key]);
        updateQuizScore();
      }

      altsList.addEventListener("click", function (event) {
        var target = event.target;
        if (!target || !target.closest) return;
        var li = target.closest("li.caderno-alt");
        if (!li || !altsList.contains(li)) return;
        select(li.getAttribute("data-letter"));
      });

      altsList.addEventListener("keydown", function (event) {
        if (event.key !== "Enter" && event.key !== " " && event.key !== "Spacebar") return;
        var target = event.target;
        if (!target || !target.closest) return;
        var li = target.closest("li.caderno-alt");
        if (!li) return;
        event.preventDefault();
        select(li.getAttribute("data-letter"));
      });

      retry.addEventListener("click", function () {
        resetAnswer(item);
      });

      var stored = state.quiz[key];
      if (stored && !altItems.some(function (alt) { return alt.letter === stored.choice; })) {
        delete state.quiz[key];
        stored = null;
        changed = true;
      }
      if (stored) {
        var recomputed = stored.choice === q.gabarito;
        if (stored.ok !== recomputed) {
          stored.ok = recomputed;
          state.quiz[key] = stored;
          changed = true;
        }
        applyAnswer(item, stored);
      }

      quizItems.push(item);
    });

    if (changed) saveState();
    updateQuizScore();

    var resetAll = document.querySelector("[data-caderno-reset]");
    if (resetAll) {
      resetAll.addEventListener("click", function () {
        var answered = quizItems.filter(function (item) {
          return Boolean(state.quiz[item.key]);
        }).length;
        if (!answered) return;
        if (!window.confirm("Recomeçar as " + quizItems.length + " questões do caderno? O resultado do simulado e as caixas dos flashcards não serão afetados.")) return;
        state.quiz = {};
        saveState();
        quizItems.forEach(function (item) { resetAnswer(item, false); });
        if (quizItems[0] && quizItems[0].altItems[0]) quizItems[0].altItems[0].el.focus();
      });
    }
  }

  function applyAnswer(item, record) {
    var q = item.q;
    item.details.classList.add("is-answered");
    item.details.setAttribute("data-result", record.ok ? "correct" : "wrong");

    item.altItems.forEach(function (alt) {
      var chosen = alt.letter === record.choice;
      var correct = alt.letter === q.gabarito;
      alt.el.classList.toggle("is-correct", correct);
      alt.el.classList.toggle("is-wrong", chosen && !correct);
      alt.el.classList.toggle("is-chosen", chosen);
      alt.el.setAttribute("aria-pressed", chosen ? "true" : "false");
      alt.el.setAttribute("aria-disabled", "true");
      var label = "Alternativa " + alt.letter + ": " + (alt.text || "sem texto");
      if (correct) label += ". Correta.";
      else if (chosen) label += ". Sua resposta, incorreta.";
      else label += ". Alternativa não escolhida.";
      alt.el.setAttribute("aria-label", label);
      alt.el.tabIndex = -1;
    });

    item.feedback.hidden = false;
    item.feedback.classList.toggle("is-correct", record.ok);
    item.feedback.classList.toggle("is-wrong", !record.ok);
    item.feedbackText.textContent = record.ok
      ? "Correto. Gabarito " + q.gabarito + ". Comentário liberado abaixo."
      : "Incorreto. A resposta correta é " + q.gabarito + ". Comentário liberado abaixo.";
    item.retry.hidden = false;
    if (item.answer) item.answer.open = true;
    if (item.summaryTag) item.summaryTag.textContent = record.ok ? "acertou" : "errou";
  }

  function resetAnswer(item, focus) {
    delete state.quiz[item.key];
    saveState();
    item.details.classList.remove("is-answered");
    item.details.removeAttribute("data-result");
    item.altItems.forEach(function (alt) {
      alt.el.classList.remove("is-correct", "is-wrong", "is-chosen");
      alt.el.setAttribute("aria-pressed", "false");
      alt.el.setAttribute("aria-label", "Alternativa " + alt.letter + ": " + (alt.text || "sem texto"));
      alt.el.removeAttribute("aria-disabled");
      alt.el.tabIndex = 0;
    });
    item.feedback.hidden = true;
    item.feedback.classList.remove("is-correct", "is-wrong");
    item.feedbackText.textContent = "";
    item.retry.hidden = true;
    if (item.answer) item.answer.open = false;
    if (item.summaryTag) item.summaryTag.textContent = item.summaryDefault;
    updateQuizScore();
    if (focus !== false && item.altItems[0]) item.altItems[0].el.focus();
  }

  function updateQuizScore() {
    var total = quizItems.length;
    var answered = 0;
    var correct = 0;
    quizItems.forEach(function (item) {
      var record = state.quiz[item.key];
      if (!record) return;
      answered++;
      if (record.choice === item.q.gabarito) correct++;
    });
    var accuracy = pct(correct, total);
    var done = pct(answered, total);

    if (scoreEl) {
      clear(scoreEl);
      var box = el("div", "caderno-score");
      var head = el("div", "caderno-score-head");
      head.appendChild(el("span", "caderno-score-label", "Questões do caderno"));
      head.appendChild(el("span", "caderno-score-pct", accuracy + "%"));
      box.appendChild(head);

      var main = el("div", "caderno-score-main");
      main.appendChild(el("strong", "caderno-score-num", correct + "/" + total));
      main.appendChild(el("span", "caderno-score-txt", "acertos"));
      box.appendChild(main);
      box.appendChild(el("div", "caderno-score-sub",
        answered + " respondida" + (answered === 1 ? "" : "s") +
        " · " + (total - answered) + " em branco"));
      scoreEl.appendChild(box);
    }

    if (progressEl) {
      clear(progressEl);
      var label = el("div", "progress-label");
      var left = el("span");
      left.appendChild(document.createTextNode("Respondidas "));
      left.appendChild(el("b", "", answered + " de " + total));
      var right = el("span", "caderno-progress-acc", "Aproveitamento " + accuracy + "%");
      label.appendChild(left);
      label.appendChild(right);
      progressEl.appendChild(label);

      var bar = el("div", "progress caderno-progress");
      bar.setAttribute("role", "progressbar");
      bar.setAttribute("aria-valuemin", "0");
      bar.setAttribute("aria-valuemax", "100");
      bar.setAttribute("aria-valuenow", String(done));
      bar.setAttribute("aria-valuetext", answered + " de " + total + " respondidas; " + accuracy + "% de acertos");
      var fill = el("div", "progress-bar");
      fill.style.width = done + "%";
      bar.appendChild(fill);
      progressEl.appendChild(bar);
    }
  }

  // --------------------------------------------------------------- flashcards

  var flashItems = [];
  var fcSummaryEl = null;
  var fcFilterBtn = null;
  var fcFilterNote = null;
  var onlyWeak = false;

  function cardState(key) {
    var card = state.cards[key];
    if (!card || typeof card !== "object") return { box: 1, seen: 0, last: "" };
    return {
      box: Math.max(1, Math.min(MAX_BOX, parseInt(card.box, 10) || 1)),
      seen: Math.max(0, parseInt(card.seen, 10) || 0),
      last: asString(card.last)
    };
  }

  function initFlashcards() {
    var flashEls = Array.prototype.slice.call(document.querySelectorAll(".flashcard"));
    if (!flashEls.length) return;

    flashEls.forEach(function (details, index) {
      var summary = details.querySelector("summary");
      var body = details.querySelector(".acc-body");
      var dataCard = flatCards[index] || null;
      var prompt = dataCard && dataCard.p ? dataCard.p : (summary ? summary.textContent : "flashcard " + (index + 1));
      var key = String(index);

      details.classList.add("caderno-fc");
      details.setAttribute("data-caderno-card", key);

      var summaryBox = null;
      if (summary) {
        summaryBox = el("span", "caderno-fc-box caderno-fc-summary-box", "Caixa 1/5");
        summaryBox.setAttribute("data-box", "1");
        summaryBox.setAttribute("aria-label", "Caixa 1 de 5, em revisão");
        var hint = summary.querySelector("span:last-child");
        if (hint && hint.parentNode === summary) summary.insertBefore(summaryBox, hint);
        else summary.appendChild(summaryBox);
      }

      var tools = el("div", "caderno-fc-tools");
      var meta = el("div", "caderno-fc-meta");
      var badge = el("span", "caderno-fc-box", "Caixa 1/5");
      badge.setAttribute("data-box", "1");
      badge.setAttribute("aria-label", "Caixa 1 de 5, em revisão");
      badge.setAttribute("aria-hidden", "true");
      var status = el("span", "caderno-fc-status", "");
      status.setAttribute("role", "status");
      status.setAttribute("aria-live", "polite");
      meta.appendChild(badge);
      meta.appendChild(status);

      var actions = el("div", "caderno-fc-actions");
      var wrong = el("button", "btn btn-sm caderno-fc-wrong", "Errei");
      wrong.type = "button";
      wrong.setAttribute("aria-label", "Errei o flashcard " + (index + 1) + ": " + prompt);
      var right = el("button", "btn btn-sm btn-primary caderno-fc-right", "Acertei");
      right.type = "button";
      right.setAttribute("aria-label", "Acertei o flashcard " + (index + 1) + ": " + prompt);
      actions.appendChild(wrong);
      actions.appendChild(right);
      tools.appendChild(meta);
      tools.appendChild(actions);
      (body || details).appendChild(tools);

      var item = {
        el: details,
        key: key,
        prompt: prompt,
        badge: badge,
        summaryBox: summaryBox,
        status: status,
        wrong: wrong,
        right: right
      };
      flashItems.push(item);

      function rate(known) {
        var current = cardState(key);
        var nextBox = known ? Math.min(MAX_BOX, current.box + 1) : 1;
        state.cards[key] = {
          box: nextBox,
          seen: current.seen + 1,
          last: todayISO()
        };
        saveState();
        applyCard(item);
        updateCardsSummary();
        applyCardFilter();
      }

      wrong.addEventListener("click", function () { rate(false); });
      right.addEventListener("click", function () { rate(true); });
      applyCard(item);
    });

    buildFlashcardToolbar();
    updateCardsSummary();
    applyCardFilter();
  }

  function applyCard(item) {
    var card = cardState(item.key);
    var boxLabel = "Caixa " + card.box + "/5";
    var boxAria = "Caixa " + card.box + " de 5, " + (card.box >= MASTERED_BOX ? "dominado" : "em revisão");
    item.badge.textContent = boxLabel;
    item.badge.setAttribute("data-box", String(card.box));
    item.badge.setAttribute("aria-label", boxAria);
    if (item.summaryBox) {
      item.summaryBox.textContent = boxLabel;
      item.summaryBox.setAttribute("data-box", String(card.box));
      item.summaryBox.setAttribute("aria-label", boxAria);
    }
    item.status.textContent = card.box >= MASTERED_BOX
      ? (card.box === MAX_BOX ? "Dominado — caixa máxima" : "Dominado")
      : "Em revisão";
    item.el.setAttribute("data-caderno-box", String(card.box));
  }

  function buildFlashcardToolbar() {
    var first = flashItems[0] && flashItems[0].el;
    if (!first) return;
    var section = first.closest("section") || first.parentNode;
    if (!section) return;

    var toolbar = el("div", "caderno-fc-toolbar");
    fcSummaryEl = el("span", "caderno-fc-summary", "");
    fcSummaryEl.setAttribute("aria-live", "polite");

    fcFilterBtn = el("button", "btn btn-sm caderno-fc-filter", "Só caixa < 3");
    fcFilterBtn.type = "button";
    fcFilterBtn.setAttribute("aria-pressed", "false");

    fcFilterNote = el("span", "caderno-fc-filter-note", "");
    fcFilterNote.setAttribute("aria-live", "polite");

    var reset = el("button", "btn btn-sm btn-ghost caderno-fc-reset", "Resetar caixas");
    reset.type = "button";
    reset.setAttribute("aria-label", "Resetar as caixas de todos os flashcards deste caderno");

    toolbar.appendChild(fcSummaryEl);
    toolbar.appendChild(fcFilterBtn);
    toolbar.appendChild(fcFilterNote);
    toolbar.appendChild(reset);

    var head = section.querySelector(".section-head");
    if (head && head.nextSibling) section.insertBefore(toolbar, head.nextSibling);
    else if (head) section.appendChild(toolbar);
    else section.insertBefore(toolbar, first);

    fcFilterBtn.addEventListener("click", function () {
      onlyWeak = !onlyWeak;
      applyCardFilter();
    });

    reset.addEventListener("click", function () {
      if (!window.confirm("Resetar as caixas de todos os flashcards deste caderno? O quiz e o simulado não serão afetados.")) return;
      state.cards = {};
      saveState();
      flashItems.forEach(applyCard);
      updateCardsSummary();
      applyCardFilter();
    });
  }

  function updateCardsSummary() {
    if (!fcSummaryEl) return;
    var mastered = flashItems.filter(function (item) {
      return cardState(item.key).box >= MASTERED_BOX;
    }).length;
    var weak = flashItems.length - mastered;
    fcSummaryEl.textContent = mastered + "/" + flashItems.length + " dominados (caixa ≥ 3) · " + weak + " em revisão";
    if (fcFilterBtn) {
      fcFilterBtn.textContent = onlyWeak ? "Mostrar todos (" + flashItems.length + ")" : "Só caixa < 3 (" + weak + ")";
      fcFilterBtn.setAttribute("aria-pressed", onlyWeak ? "true" : "false");
      fcFilterBtn.setAttribute("aria-label", onlyWeak
        ? "Desativar filtro e mostrar todos os flashcards"
        : "Filtrar e mostrar apenas flashcards de caixa menor que 3");
    }
  }

  function applyCardFilter() {
    var visible = 0;
    flashItems.forEach(function (item) {
      var hide = onlyWeak && cardState(item.key).box >= MASTERED_BOX;
      item.el.classList.toggle("caderno-fc-hidden", hide);
      if (hide) item.el.open = false;
      if (!hide) visible++;
    });

    if (fcFilterNote) {
      fcFilterNote.textContent = onlyWeak
        ? (visible ? "Exibindo " + visible + " para revisar." : "Nenhum card na faixa — tudo dominado.")
        : "";
    }
    if (fcFilterBtn) fcFilterBtn.classList.toggle("btn-primary", onlyWeak);
    updateCardsSummary();
  }

  // ----------------------------------------------------------------- simulado

  function initSimulado() {
    var root = document.querySelector("[data-caderno-simulado]");
    if (!root) return;

    if (!questions.length) {
      clear(root);
      root.appendChild(el("div", "empty", "Os dados do simulado não estão disponíveis nesta página."));
      return;
    }

    var sim = {
      active: false,
      submitted: false,
      order: [],
      idx: 0,
      answers: {},
      deadline: 0,
      startedAt: 0,
      remaining: SIM_SECONDS,
      timerId: 0,
      currentOptions: []
    };

    var mainEl = null;
    var paletteEl = null;
    var timerEl = null;
    var mobileTimerEl = null;
    var answeredEl = null;
    var finishBtn = null;

    function bestScore() {
      return state.sim && state.sim.best && typeof state.sim.best === "object" ? state.sim.best : null;
    }

    function attemptsCount() {
      return state.sim ? Math.max(0, parseInt(state.sim.attempts, 10) || 0) : 0;
    }

    function simStat(label, value) {
      var box = el("div", "caderno-sim-stat");
      box.appendChild(el("span", "stat-label", label));
      box.appendChild(el("div", "stat-num", value));
      return box;
    }

    function scrollToRoot() {
      try {
        root.scrollIntoView({ behavior: "smooth", block: "start" });
      } catch (e) { /* navegador antigo */ }
    }

    function stopTimer() {
      if (sim.timerId) {
        window.clearInterval(sim.timerId);
        sim.timerId = 0;
      }
    }

    function renderStart() {
      stopTimer();
      sim.active = false;
      sim.submitted = false;
      sim.order = [];
      sim.answers = {};
      sim.idx = 0;
      mobileTimerEl = null;

      clear(root);
      var count = Math.min(SIM_SIZE, questions.length);
      var best = bestScore();
      var box = el("div", "caderno-sim-start");
      box.appendChild(el("span", "kicker", "Simulado do caderno"));
      box.appendChild(el("h3", "caderno-sim-title", count + " questões · 30 minutos"));

      var lead = el("p", "caderno-sim-lead",
        questions.length > SIM_SIZE
          ? "Sorteio de " + SIM_SIZE + " questões do caderno específico, com 30 minutos de prova."
          : "O caderno tem " + questions.length + " questões; o simulado usa todas, com 30 minutos de prova.");
      box.appendChild(lead);

      var warning = el("div", "caderno-warning");
      warning.appendChild(el("strong", "", "Aviso: "));
      warning.appendChild(document.createTextNode("este é um simulado do caderno específico, não a prova oficial."));
      box.appendChild(warning);

      var stats = el("div", "caderno-sim-stats");
      stats.appendChild(simStat("Questões", String(count)));
      stats.appendChild(simStat("Tempo", "30 min"));
      stats.appendChild(simStat("Melhor", best ? best.acertos + "/" + best.total + " · " + best.pct + "%" : "—"));
      stats.appendChild(simStat("Tentativas", String(attemptsCount())));
      box.appendChild(stats);

      var actions = el("div", "btn-row caderno-sim-start-actions");
      var start = el("button", "btn btn-primary", "Iniciar simulado");
      start.type = "button";
      start.setAttribute("aria-label", "Iniciar simulado do caderno com " + count + " questões e 30 minutos");
      start.addEventListener("click", startSim);
      actions.appendChild(start);
      box.appendChild(actions);

      box.appendChild(el("p", "small muted caderno-sim-note",
        "O melhor resultado fica salvo neste navegador. O sorteio é novo a cada tentativa."));
      root.appendChild(box);
    }

    function startSim() {
      stopTimer();
      sim.active = true;
      sim.submitted = false;
      sim.answers = {};
      sim.idx = 0;
      sim.order = shuffle(questions).slice(0, Math.min(SIM_SIZE, questions.length));
      sim.remaining = SIM_SECONDS;
      sim.startedAt = Date.now();
      sim.deadline = sim.startedAt + SIM_SECONDS * 1000;
      sim.currentOptions = [];

      renderShell();
      renderQuestion();
      updateSide();
      var firstOption = sim.currentOptions[0];
      if (firstOption) {
        try {
          firstOption.el.focus({ preventScroll: true });
        } catch (e) {
          firstOption.el.focus();
        }
      }
      sim.timerId = window.setInterval(tick, 1000);
      scrollToRoot();
    }

    function renderShell() {
      clear(root);
      var wrap = el("div", "caderno-sim caderno-sim-live");

      var header = el("div", "caderno-sim-header");
      header.appendChild(el("span", "kicker", "Simulado do caderno"));
      header.appendChild(el("h3", "caderno-sim-title", sim.order.length + " questões · 30 minutos"));
      header.appendChild(el("p", "caderno-warning", "Simulado do caderno — não é a prova oficial."));
      wrap.appendChild(header);

      var layout = el("div", "caderno-sim-layout");
      mainEl = el("div", "caderno-sim-main");
      mainEl.setAttribute("aria-live", "polite");

      var side = el("aside", "caderno-sim-side");
      side.setAttribute("aria-label", "Painel do simulado");

      side.appendChild(el("span", "caderno-sim-side-label", "Tempo restante"));
      timerEl = el("div", "quiz-timer caderno-sim-timer", fmtTime(sim.remaining));
      timerEl.setAttribute("role", "timer");
      timerEl.setAttribute("aria-label", "Tempo restante do simulado");
      side.appendChild(timerEl);

      answeredEl = el("p", "caderno-sim-answered", "0 de " + sim.order.length + " respondidas");
      answeredEl.setAttribute("aria-live", "polite");
      side.appendChild(answeredEl);

      paletteEl = el("div", "palette caderno-sim-palette");
      paletteEl.setAttribute("role", "group");
      paletteEl.setAttribute("aria-label", "Navegação entre as questões do simulado");
      side.appendChild(paletteEl);

      finishBtn = el("button", "btn btn-primary caderno-sim-finish", "Finalizar simulado");
      finishBtn.type = "button";
      finishBtn.addEventListener("click", function () { finish(false); });
      side.appendChild(finishBtn);

      var legend = el("p", "quiz-legend",
        "Atalhos: ← → navegam e 1–5 marcam a alternativa. Respondida = preenchida.");
      side.appendChild(legend);

      layout.appendChild(mainEl);
      layout.appendChild(side);
      wrap.appendChild(layout);
      root.appendChild(wrap);
    }

    function renderQuestion() {
      var q = sim.order[sim.idx];
      if (!q || !mainEl) return;
      clear(mainEl);
      sim.currentOptions = [];

      var card = el("article", "q caderno-sim-q");

      var mobileBar = el("div", "caderno-sim-mobile-bar");
      mobileBar.setAttribute("aria-hidden", "true");
      mobileBar.appendChild(el("span", "caderno-sim-mobile-label", "Tempo restante"));
      mobileTimerEl = el("span", "caderno-sim-mobile-timer", fmtTime(sim.remaining));
      mobileBar.appendChild(mobileTimerEl);
      card.appendChild(mobileBar);

      var head = el("div", "q-head");
      head.appendChild(el("span", "q-num", "Questão " + (sim.idx + 1) + " de " + sim.order.length));
      var metaParts = [];
      if (q.nivel) metaParts.push(q.nivel);
      if (q.modulo && moduleNames[q.modulo]) metaParts.push(moduleNames[q.modulo]);
      if (metaParts.length) head.appendChild(el("span", "small muted", metaParts.join(" · ")));
      card.appendChild(head);

      var stem = el("div", "q-stem");
      stem.appendChild(el("p", "", q.enunciado));
      card.appendChild(stem);

      var options = el("div", "q-options caderno-sim-options");
      q.letters.forEach(function (letter) {
        var selected = sim.answers[q.id] === letter;
        var button = el("button", "caderno-sim-option");
        button.type = "button";
        button.setAttribute("aria-pressed", selected ? "true" : "false");
        button.setAttribute("aria-label", "Alternativa " + letter + ": " + q.alternativas[letter]);
        if (selected) button.classList.add("is-selected");
        button.appendChild(el("b", "", letter + ")"));
        button.appendChild(document.createTextNode(" "));
        button.appendChild(el("span", "", q.alternativas[letter]));
        button.addEventListener("click", function () {
          choose(q, letter);
        });
        options.appendChild(button);
        sim.currentOptions.push({ el: button, letter: letter });
      });
      card.appendChild(options);

      var nav = el("div", "btn-row caderno-sim-nav");
      var prev = el("button", "btn btn-sm", "← Anterior");
      prev.type = "button";
      prev.disabled = sim.idx === 0;
      prev.addEventListener("click", function () {
        if (sim.idx > 0) {
          sim.idx--;
          renderQuestion();
          renderPalette();
          updateSide();
        }
      });
      var next = el("button", "btn btn-sm", "Próxima →");
      next.type = "button";
      next.disabled = sim.idx === sim.order.length - 1;
      next.addEventListener("click", function () {
        if (sim.idx < sim.order.length - 1) {
          sim.idx++;
          renderQuestion();
          renderPalette();
          updateSide();
        }
      });
      nav.appendChild(prev);
      nav.appendChild(next);
      card.appendChild(nav);

      mainEl.appendChild(card);
      renderPalette();
      updateSide();
    }

    function choose(q, letter) {
      if (sim.submitted) return;
      sim.answers[q.id] = letter;
      sim.currentOptions.forEach(function (option) {
        var on = option.letter === letter;
        option.el.classList.toggle("is-selected", on);
        option.el.setAttribute("aria-pressed", on ? "true" : "false");
      });
      renderPalette();
      updateSide();
    }

    function renderPalette() {
      if (!paletteEl) return;
      clear(paletteEl);
      sim.order.forEach(function (q, index) {
        var button = el("button", "caderno-sim-pbtn", String(index + 1));
        button.type = "button";
        var answered = Boolean(sim.answers[q.id]);
        var current = index === sim.idx;
        if (answered) button.classList.add("is-answered");
        if (current) button.classList.add("is-current");
        if (current) button.setAttribute("aria-current", "step");
        button.setAttribute("aria-label",
          "Questão " + (index + 1) + (answered ? ", respondida" : ", em branco") + (current ? ", atual" : ""));
        button.setAttribute("title", "Questão " + (index + 1));
        button.addEventListener("click", function () {
          sim.idx = index;
          renderQuestion();
        });
        paletteEl.appendChild(button);
      });
    }

    function updateSide() {
      if (!answeredEl) return;
      var answered = sim.order.reduce(function (count, q) {
        return count + (sim.answers[q.id] ? 1 : 0);
      }, 0);
      answeredEl.textContent = answered + " de " + sim.order.length + " respondidas";
      if (finishBtn) finishBtn.textContent = answered === sim.order.length ? "Finalizar e ver nota" : "Finalizar simulado";
      if (timerEl) {
        timerEl.textContent = fmtTime(sim.remaining);
        timerEl.classList.toggle("warn", sim.remaining <= 300);
      }
      if (mobileTimerEl) {
        mobileTimerEl.textContent = fmtTime(sim.remaining);
        mobileTimerEl.classList.toggle("warn", sim.remaining <= 300);
      }
    }

    function tick() {
      if (!sim.active || sim.submitted) return;
      sim.remaining = Math.max(0, Math.ceil((sim.deadline - Date.now()) / 1000));
      if (timerEl) {
        timerEl.textContent = fmtTime(sim.remaining);
        timerEl.classList.toggle("warn", sim.remaining <= 300);
      }
      if (mobileTimerEl) {
        mobileTimerEl.textContent = fmtTime(sim.remaining);
        mobileTimerEl.classList.toggle("warn", sim.remaining <= 300);
      }
      if (sim.remaining <= 0) finish(true);
    }

    function finish(auto) {
      if (!sim.active || sim.submitted) return;
      var unanswered = sim.order.filter(function (q) { return !sim.answers[q.id]; }).length;
      if (!auto && unanswered > 0) {
        var message = "Você deixou " + unanswered + " questão" + (unanswered === 1 ? "" : "ões") +
          " sem resposta. Finalizar assim mesmo?";
        if (!window.confirm(message)) return;
      }

      sim.submitted = true;
      stopTimer();
      var total = sim.order.length;
      var correct = sim.order.filter(function (q) {
        return sim.answers[q.id] === q.gabarito;
      }).length;
      var percent = pct(correct, total);
      var elapsed = Math.max(0, Math.min(SIM_SECONDS, Math.round((Date.now() - sim.startedAt) / 1000)));
      var previous = bestScore();
      var isBest = !previous || percent > previous.pct ||
        (percent === previous.pct && elapsed < (previous.seg || Number.MAX_SAFE_INTEGER));

      if (!state.sim || typeof state.sim !== "object") state.sim = { attempts: 0, best: null };
      state.sim.attempts = (parseInt(state.sim.attempts, 10) || 0) + 1;
      if (isBest) {
        state.sim.best = {
          acertos: correct,
          total: total,
          pct: percent,
          seg: elapsed,
          at: new Date().toISOString()
        };
      }
      saveState();
      renderResult(auto, elapsed, isBest, correct, percent);
      scrollToRoot();
    }

    function reviewItem(q, number, choice) {
      var ok = choice === q.gabarito;
      var item = el("div", "review-item caderno-sim-review-item " + (ok ? "caderno-sim-correct" : "caderno-sim-wrong"));
      item.appendChild(el("div", "review-tag",
        "Q" + number + " · " + (q.nivel || "questão") + " · " + (ok ? "acertou" : (choice ? "errou" : "em branco"))));

      var stem = el("div", "q-stem");
      stem.appendChild(el("p", "", q.enunciado));
      item.appendChild(stem);

      var user = el("div", "review-answer");
      user.appendChild(document.createTextNode("Sua resposta: "));
      user.appendChild(el("b", "", choice ? choice + ") " + q.alternativas[choice] : "em branco"));
      item.appendChild(user);

      var right = el("div", "review-answer");
      right.appendChild(document.createTextNode("Correta: "));
      right.appendChild(el("b", "", q.gabarito + ") " + q.alternativas[q.gabarito]));
      item.appendChild(right);

      if (q.comentario) {
        var comment = el("div", "review-answer caderno-sim-comment");
        comment.appendChild(el("b", "", "Comentário: "));
        comment.appendChild(document.createTextNode(q.comentario));
        item.appendChild(comment);
      }
      return item;
    }

    function renderResult(auto, elapsed, isBest, correct, percent) {
      clear(root);
      mobileTimerEl = null;
      var best = bestScore();
      var total = sim.order.length;
      var wrap = el("div", "caderno-sim caderno-sim-result");

      var top = el("div", "caderno-sim-result-head");
      top.setAttribute("tabindex", "-1");
      top.appendChild(el("span", "kicker", auto ? "Tempo esgotado" : "Resultado do simulado"));
      top.appendChild(el("h3", "caderno-sim-title", "Simulado do caderno — resultado"));
      var score = el("div", "quiz-score caderno-sim-score");
      score.appendChild(document.createTextNode(String(correct)));
      score.appendChild(el("small", "", "/" + total + " · " + percent + "%"));
      top.appendChild(score);

      var verdict = percent >= 80
        ? "Bom desempenho. Reforce os erros e repita em alguns dias."
        : percent >= 60
          ? "Base razoável. Volte aos módulos das questões erradas antes de repetir."
          : "Ainda há lacunas. Revise as lições dos módulos com erro antes de tentar de novo.";
      top.appendChild(el("p", "caderno-sim-verdict", verdict));

      if (isBest) {
        top.appendChild(el("p", "caderno-sim-best", "Novo melhor resultado salvo neste navegador."));
      } else if (best) {
        top.appendChild(el("p", "caderno-sim-best",
          "Melhor até agora: " + best.acertos + "/" + best.total + " · " + best.pct + "%."));
      }

      var warning = el("div", "caderno-warning");
      warning.appendChild(el("strong", "", "Lembrete: "));
      warning.appendChild(document.createTextNode("este simulado é do caderno específico, não a prova oficial."));
      top.appendChild(warning);

      var stats = el("div", "caderno-sim-stats");
      stats.appendChild(simStat("Acertos", correct + "/" + total));
      stats.appendChild(simStat("Tempo", fmtTime(elapsed)));
      stats.appendChild(simStat("Tentativas", String(attemptsCount())));
      stats.appendChild(simStat("Melhor", best ? best.acertos + "/" + best.total + " · " + best.pct + "%" : "—"));
      top.appendChild(stats);

      var actions = el("div", "btn-row");
      var again = el("button", "btn btn-primary", "Refazer simulado");
      again.type = "button";
      again.addEventListener("click", startSim);
      var back = el("button", "btn", "Voltar ao início");
      back.type = "button";
      back.addEventListener("click", function () {
        renderStart();
        var startAgain = root.querySelector(".caderno-sim-start .btn-primary");
        if (startAgain) startAgain.focus();
      });
      actions.appendChild(again);
      actions.appendChild(back);
      if (document.getElementById("questoes")) {
        var link = el("a", "btn", "Revisar questões do caderno");
        link.href = "#questoes";
        actions.appendChild(link);
      }
      top.appendChild(actions);
      wrap.appendChild(top);

      var wrong = sim.order.map(function (q, index) {
        return { q: q, number: index + 1, choice: sim.answers[q.id] || "" };
      }).filter(function (entry) {
        return entry.choice !== entry.q.gabarito;
      });

      var reviewSection = el("section", "caderno-sim-section");
      reviewSection.appendChild(el("h4", "caderno-sim-section-title", "Revisão dos erros"));
      if (!wrong.length) {
        var clean = el("div", "callout caderno-sim-clean");
        clean.appendChild(el("p", "", "Sem erros neste simulado. Refaça em alguns dias para confirmar a retenção."));
        reviewSection.appendChild(clean);
      } else {
        var review = el("div", "caderno-sim-review");
        wrong.forEach(function (entry) {
          review.appendChild(reviewItem(entry.q, entry.number, entry.choice));
        });
        reviewSection.appendChild(review);
      }
      wrap.appendChild(reviewSection);

      var keySection = el("section", "caderno-sim-section");
      keySection.appendChild(el("h4", "caderno-sim-section-title", "Gabarito comentado"));
      var keyDetails = el("details", "accordion caderno-sim-key");
      var summary = el("summary");
      summary.appendChild(el("span", "", "Todas as " + total + " questões"));
      summary.appendChild(el("span", "muted mono", "abrir"));
      keyDetails.appendChild(summary);
      var keyBody = el("div", "acc-body caderno-sim-key-body");
      sim.order.forEach(function (q, index) {
        keyBody.appendChild(reviewItem(q, index + 1, sim.answers[q.id] || ""));
      });
      keyDetails.appendChild(keyBody);
      keySection.appendChild(keyDetails);
      wrap.appendChild(keySection);

      root.appendChild(wrap);
      try {
        top.focus({ preventScroll: true });
      } catch (e) {
        top.focus();
      }
    }

    document.addEventListener("keydown", function (event) {
      if (!sim.active || sim.submitted) return;
      var active = document.activeElement;
      if (active && (/^(INPUT|TEXTAREA|SELECT)$/.test(active.tagName) || active.isContentEditable)) return;
      if (event.altKey || event.ctrlKey || event.metaKey) return;

      var q = sim.order[sim.idx];
      if (!q) return;

      if (event.key === "ArrowLeft") {
        if (sim.idx === 0) return;
        event.preventDefault();
        sim.idx--;
        renderQuestion();
      } else if (event.key === "ArrowRight") {
        if (sim.idx >= sim.order.length - 1) return;
        event.preventDefault();
        sim.idx++;
        renderQuestion();
      } else if (/^[1-5]$/.test(event.key)) {
        var letter = "ABCDE".charAt(Number(event.key) - 1);
        if (!q.alternativas[letter]) return;
        event.preventDefault();
        choose(q, letter);
      }
    });

    renderStart();
  }

  // --------------------------------------------------------------------- init

  function init() {
    scoreEl = document.querySelector("[data-caderno-score]");
    progressEl = document.querySelector("[data-caderno-progress]");
    if (scoreEl) scoreEl.setAttribute("aria-live", "polite");
    else if (progressEl) progressEl.setAttribute("aria-live", "polite");

    initQuiz();
    initFlashcards();
    initSimulado();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
