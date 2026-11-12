(function () {
  "use strict";

  const KEY = "spaguas.v1";
  const THEME_KEY = "spaguas.theme";

  function todayISO() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  }

  function read() {
    try {
      return JSON.parse(localStorage.getItem(KEY) || "{}");
    } catch (e) {
      return {};
    }
  }

  function write(s) {
    localStorage.setItem(KEY, JSON.stringify(s));
  }

  function ensure(s) {
    s.lessons = s.lessons || {};
    s.questions = s.questions || {};
    s.cards = s.cards || {};
    s.sims = s.sims || [];
    s.activity = s.activity || [];
    s.notes = s.notes || {};
    return s;
  }

  function touch(s) {
    const d = todayISO();
    if (!s.activity.includes(d)) s.activity.push(d);
  }

  const SP = {
    state() { return ensure(read()); },
    save(s) { write(ensure(s)); },
    today: todayISO,
    lesson(id) { const s = this.state(); return s.lessons[id] || { studied: false, last: null, reviews: [] }; },
    markLesson(id, value) {
      const s = this.state();
      if (value) {
        s.lessons[id] = { studied: true, last: todayISO(), reviews: (s.lessons[id] || {}).reviews || [] };
        touch(s);
      } else {
        delete s.lessons[id];
      }
      this.save(s);
      return s.lessons[id];
    },
    addReview(id) {
      const s = this.state();
      const l = s.lessons[id] || { studied: true, reviews: [] };
      l.studied = true;
      l.last = todayISO();
      l.reviews = (l.reviews || []).concat([todayISO()]);
      s.lessons[id] = l;
      touch(s);
      this.save(s);
    },
    recordQuestion(id, correct) {
      const s = this.state();
      const q = s.questions[id] || { attempts: 0, correct: 0 };
      q.attempts += 1;
      if (correct) q.correct += 1;
      q.last = todayISO();
      s.questions[id] = q;
      touch(s);
      this.save(s);
    },
    card(id) { const s = this.state(); return s.cards[id] || { box: 1, due: todayISO(), last: null }; },
    reviewCard(id, known) {
      const s = this.state();
      const c = s.cards[id] || { box: 1 };
      c.box = known ? Math.min(5, (c.box || 1) + 1) : 1;
      const days = [1, 3, 7, 15, 30][c.box - 1] || 1;
      const d = new Date();
      d.setDate(d.getDate() + days);
      c.due = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      c.last = todayISO();
      s.cards[id] = c;
      touch(s);
      this.save(s);
      return c;
    },
    notes(id) { return this.state().notes[id] || ""; },
    saveNotes(id, text) {
      const s = this.state();
      s.notes[id] = text;
      touch(s);
      this.save(s);
    },
    recordSim(entry) {
      const s = this.state();
      s.sims.push(entry);
      touch(s);
      this.save(s);
    },
    stats() {
      const s = this.state();
      const lessonsTotal = (window.AULAS || []).length;
      const qTotal = (window.QUESTOES || []).length;
      const cTotal = (window.FLASHCARDS || []).length;
      const lessonsDone = Object.values(s.lessons).filter(x => x && x.studied).length;
      const qAttempts = Object.values(s.questions).reduce((a, x) => a + (x.attempts || 0), 0);
      const qCorrect = Object.values(s.questions).reduce((a, x) => a + (x.correct || 0), 0);
      const cardsKnown = Object.values(s.cards).filter(x => (x.box || 1) >= 3).length;
      return { lessonsTotal, lessonsDone, qTotal, qAttempts, qCorrect, cTotal, cardsKnown, sims: s.sims, activity: s.activity };
    }
  };
  window.SP = SP;

  // theme
  const root = document.documentElement;
  const savedTheme = localStorage.getItem(THEME_KEY);
  root.dataset.theme = savedTheme || "dark";
  document.addEventListener("click", function (e) {
    const t = e.target.closest("[data-theme-toggle]");
    if (!t) return;
    root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
    localStorage.setItem(THEME_KEY, root.dataset.theme);
  });

  // mobile menu
  const sidebar = document.querySelector(".sidebar");
  document.addEventListener("click", function (e) {
    if (e.target.closest("[data-menu]")) {
      sidebar && sidebar.classList.toggle("open");
    } else if (sidebar && sidebar.classList.contains("open") && !e.target.closest(".sidebar")) {
      sidebar.classList.remove("open");
    }
  });

  // countdown
  const target = new Date("2027-01-31T08:00:00-03:00").getTime();
  function tick() {
    document.querySelectorAll("[data-countdown]").forEach(el => {
      const diff = target - Date.now();
      if (diff <= 0) { el.textContent = "Prova realizada"; return; }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      el.textContent = `${d}d ${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    });
  }
  tick();
  setInterval(tick, 1000);

  // progress widgets
  function pct(a, b) { return b ? Math.round(100 * a / b) : 0; }
  function updateWidgets() {
    const st = SP.stats();
    document.querySelectorAll("[data-stat-lessons]").forEach(el => el.textContent = `${st.lessonsDone}/${st.lessonsTotal}`);
    document.querySelectorAll("[data-stat-questions]").forEach(el => el.textContent = st.qAttempts ? `${st.qCorrect}/${st.qAttempts}` : "0");
    document.querySelectorAll("[data-stat-accuracy]").forEach(el => el.textContent = st.qAttempts ? `${Math.round(100 * st.qCorrect / st.qAttempts)}%` : "—");
    document.querySelectorAll("[data-stat-cards]").forEach(el => el.textContent = `${st.cardsKnown}/${st.cTotal}`);
    document.querySelectorAll("[data-stat-sims]").forEach(el => el.textContent = String(st.sims.length));
    document.querySelectorAll("[data-bar-lessons]").forEach(el => el.style.width = pct(st.lessonsDone, st.lessonsTotal) + "%");
    document.querySelectorAll("[data-bar-cards]").forEach(el => el.style.width = pct(st.cardsKnown, st.cTotal) + "%");
    document.querySelectorAll("[data-today]").forEach(el => el.textContent = new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" }));
  }
  updateWidgets();

  // lesson mark/notes
  document.querySelectorAll("[data-mark-lesson]").forEach(btn => {
    const id = btn.getAttribute("data-mark-lesson");
    const l = SP.lesson(id);
    if (l.studied) {
      btn.textContent = "✓ Estudada — desmarcar";
      btn.classList.add("btn-primary");
    }
    btn.addEventListener("click", () => {
      const cur = SP.lesson(id);
      const next = !cur.studied;
      SP.markLesson(id, next);
      btn.textContent = next ? "✓ Estudada — desmarcar" : "Marcar como estudada";
      btn.classList.toggle("btn-primary", next);
      updateWidgets();
    });
  });
  document.querySelectorAll("[data-notes]").forEach(ta => {
    const id = ta.getAttribute("data-notes");
    ta.value = SP.notes(id);
    let timer;
    ta.addEventListener("input", () => {
      clearTimeout(timer);
      timer = setTimeout(() => SP.saveNotes(id, ta.value), 250);
    });
  });

  // search
  let searchData = null;
  let searchIndex = -1;
  const overlay = document.querySelector("[data-search-overlay]");
  const input = overlay ? overlay.querySelector(".search-input") : null;
  const results = overlay ? overlay.querySelector(".search-results") : null;

  function norm(s) {
    return (s || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  }

  function openSearch() {
    if (!overlay) return;
    overlay.classList.add("open");
    if (!searchData) searchData = window.BUSCA || [];
    setTimeout(() => input && input.focus(), 20);
    renderSearch("");
  }
  function closeSearch() {
    if (!overlay) return;
    overlay.classList.remove("open");
    if (input) input.value = "";
    searchIndex = -1;
  }
  function renderSearch(q) {
    if (!results) return;
    const nq = norm(q).trim();
    let list = searchData || [];
    if (nq) {
      list = list.filter(x => norm(x.titulo + " " + x.texto + " " + x.disciplina).includes(nq));
      list.sort((a, b) => {
        const at = norm(a.titulo), bt = norm(b.titulo);
        return (bt.startsWith(nq) ? 1 : 0) - (at.startsWith(nq) ? 1 : 0);
      });
    }
    list = list.slice(0, 24);
    searchIndex = -1;
    if (!list.length) {
      results.innerHTML = `<div class="search-empty">Nada encontrado. Tente “SQL”, “LGPD”, “outorga” ou “Pandas”.</div>`;
      return;
    }
    results.innerHTML = list.map((x, i) => `<a class="search-result" href="${(window.SITE_ROOT || "") + x.url}" data-i="${i}"><strong>${x.titulo}</strong><span>${x.disciplina} · ${x.tipo}</span></a>`).join("");
    results.querySelectorAll("a").forEach(a => a.addEventListener("click", closeSearch));
  }
  document.querySelectorAll("[data-search-open]").forEach(b => b.addEventListener("click", openSearch));
  if (overlay) {
    overlay.addEventListener("click", e => { if (e.target === overlay) closeSearch(); });
    const close = overlay.querySelector(".search-close");
    if (close) close.addEventListener("click", closeSearch);
    if (input) input.addEventListener("input", () => renderSearch(input.value));
  }
  document.addEventListener("keydown", e => {
    if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) { e.preventDefault(); openSearch(); }
    if (e.key === "/" && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) { e.preventDefault(); openSearch(); }
    if (!overlay || !overlay.classList.contains("open")) return;
    if (e.key === "Escape") closeSearch();
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      const links = [...results.querySelectorAll("a")];
      if (!links.length) return;
      searchIndex = e.key === "ArrowDown" ? Math.min(links.length - 1, searchIndex + 1) : Math.max(0, searchIndex - 1);
      links.forEach((a, i) => a.classList.toggle("active", i === searchIndex));
      links[searchIndex].scrollIntoView({ block: "nearest" });
    }
    if (e.key === "Enter" && searchIndex >= 0) {
      const links = [...results.querySelectorAll("a")];
      if (links[searchIndex]) links[searchIndex].click();
    }
  });
})();
