/* SYS/PRM — shared behaviour. No dependencies. */
(function () {
  'use strict';

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const PAGES = window.SP_PAGES || [];
  const ACTS = window.SP_ACTS || [];
  const PAGE = document.body.dataset.page || 'hub';
  const KEY = 'sp.v1';
  const state = load();

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      const s = raw ? JSON.parse(raw) : {};
      return { done: Array.isArray(s.done) ? s.done : [], checks: s.checks || {}, theme: s.theme || null };
    } catch (e) {
      return { done: [], checks: {}, theme: null };
    }
  }

  function save() {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch (e) {}
  }

  const isDone = (id) => state.done.includes(id);
  const doneCount = () => PAGES.filter((p) => isDone(p.id)).length;
  const pct = (n, d = 0) => (n * 100).toFixed(d).replace('.', ',') + '%';

  function live(msg) {
    let el = $('#live');
    if (!el) {
      el = document.createElement('div');
      el.id = 'live';
      el.className = 'sr-only';
      el.setAttribute('aria-live', 'polite');
      document.body.appendChild(el);
    }
    el.textContent = '';
    requestAnimationFrame(() => {
      el.textContent = msg;
    });
  }

  function toast(msg) {
    let el = $('#toast');
    if (!el) {
      el = document.createElement('div');
      el.id = 'toast';
      el.setAttribute('role', 'status');
      el.style.cssText =
        'position:fixed;left:20px;bottom:20px;z-index:400;background:var(--ink);color:var(--paper);' +
        'padding:11px 14px;font:11px/1.4 var(--mono);letter-spacing:.06em;max-width:min(360px,80vw);' +
        'border:1px solid var(--ink);display:flex;gap:8px;align-items:center';
      el.innerHTML = '<span style="width:6px;height:6px;background:var(--accent);flex:none"></span><span></span>';
      document.body.appendChild(el);
    }
    el.lastElementChild.textContent = msg;
    el.style.opacity = '1';
    clearTimeout(el._t);
    el._t = setTimeout(() => {
      el.style.opacity = '0';
      el.style.transition = 'opacity .2s';
    }, 2400);
  }

  /* ---------- theme ---------- */
  function syncTheme() {
    const btn = $('#btn-theme');
    if (!btn) return;
    const dark = document.documentElement.dataset.theme === 'dark';
    btn.setAttribute('aria-label', dark ? 'Usar tema claro' : 'Usar tema escuro');
  }

  function toggleTheme() {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    state.theme = next;
    save();
    try {
      localStorage.setItem('sp.theme', next);
    } catch (e) {}
    syncTheme();
    live(next === 'dark' ? 'Tema escuro ativado.' : 'Tema claro ativado.');
  }

  /* ---------- progress ---------- */
  function updateProgress() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    const fill = $('#readbar-fill');
    if (fill) fill.style.width = ratio * 100 + '%';
  }

  function syncDoneUI() {
    const n = doneCount();
    const total = PAGES.length || 1;
    $$('.js-done').forEach((btn) => {
      const id = btn.dataset.done;
      const done = isDone(id);
      btn.classList.toggle('is-done', done);
      const label = btn.querySelector('span');
      if (label) label.textContent = done ? 'página concluída' : 'concluir página';
    });
    $$('.js-rail-bar').forEach((el) => (el.style.width = (n / total) * 100 + '%'));
    $$('.js-done-count').forEach((el) => (el.textContent = n));
    $$('.js-hub-bar').forEach((el) => (el.style.width = (n / total) * 100 + '%'));
    $$('.js-hub-count').forEach((el) => (el.textContent = n));
    $$('.js-hub-pct').forEach((el) => (el.textContent = pct(n / total, 0)));
    $$('.path-row[data-page]').forEach((row) => row.classList.toggle('is-done', isDone(row.dataset.page)));
  }

  function complete(id, silent) {
    if (!id || isDone(id)) return;
    state.done.push(id);
    save();
    syncDoneUI();
    const p = PAGES.find((x) => x.id === id);
    if (!silent) {
      toast('Página ' + id + ' concluída' + (p ? ' · ' + p.title : ''));
      live('Página ' + id + ' marcada como concluída.');
    }
  }

  function uncomplete(id) {
    state.done = state.done.filter((x) => x !== id);
    save();
    syncDoneUI();
  }

  /* ---------- copy ---------- */
  function copy(text, btn) {
    const done = () => {
      if (!btn) return;
      const original = btn.innerHTML;
      btn.classList.add('is-copied');
      btn.innerHTML = '<svg class="icon" aria-hidden="true"><use href="#i-check"></use></svg> copiado';
      setTimeout(() => {
        btn.classList.remove('is-copied');
        btn.innerHTML = original;
      }, 1600);
      live('Copiado para a área de transferência.');
    };
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(done).catch(() => fallbackCopy(text, done));
    } else {
      fallbackCopy(text, done);
    }
  }

  function fallbackCopy(text, done) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.cssText = 'position:fixed;left:-9999px;top:0';
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
      done();
    } catch (e) {
      toast('Não foi possível copiar. Selecione o texto.');
    }
    ta.remove();
  }

  function bindCopy() {
    $$('[data-copy]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const sel = btn.dataset.copy;
        const target = sel ? $(sel) : null;
        if (target) copy(target.textContent.trim(), btn);
      });
    });
  }

  /* ---------- tabs ---------- */
  function tabs(root) {
    const list = $('[role="tablist"]', root);
    if (!list) return;
    const tabEls = $$('[role="tab"]', list);
    const panels = $$('[role="tabpanel"]', root);
    function select(i, focus) {
      tabEls.forEach((t, j) => {
        const on = i === j;
        t.setAttribute('aria-selected', on ? 'true' : 'false');
        t.tabIndex = on ? 0 : -1;
      });
      panels.forEach((p, j) => (p.hidden = i !== j));
      if (focus) tabEls[i].focus();
    }
    tabEls.forEach((t, i) => {
      t.addEventListener('click', () => select(i));
      t.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          select((i + 1) % tabEls.length, true);
        }
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          select((i - 1 + tabEls.length) % tabEls.length, true);
        }
      });
    });
    select(Math.max(0, tabEls.findIndex((t) => t.getAttribute('aria-selected') === 'true')));
  }

  /* ---------- quiz ---------- */
  function quiz(target, questions, opts = {}) {
    const root = typeof target === 'string' ? $(target) : target;
    if (!root) return;
    const id = root.id || 'quiz-' + Math.random().toString(36).slice(2, 7);
    root.innerHTML = '';
    root.classList.add('quiz');

    const head = document.createElement('div');
    head.className = 'quiz-head';
    head.innerHTML =
      '<span class="quiz-kicker"><svg class="icon" aria-hidden="true"><use href="#i-target"></use></svg>' +
      (opts.label || 'checkpoint') +
      '</span><span class="quiz-score" aria-live="polite"></span>';
    root.appendChild(head);
    const scoreEl = $('.quiz-score', head);

    let answered = 0;
    let correct = 0;
    const total = questions.length;

    const result = document.createElement('div');
    result.className = 'quiz-result';

    questions.forEach((q, qi) => {
      const wrap = document.createElement('div');
      wrap.className = 'q';
      const title = document.createElement('p');
      title.className = 'q-title';
      title.innerHTML = '<span class="mono muted" style="font-size:10px;letter-spacing:.1em">Q' + (qi + 1) + ' · </span>' + q.q;
      wrap.appendChild(title);
      const optWrap = document.createElement('div');
      optWrap.className = 'q-opts';
      optWrap.setAttribute('role', 'group');
      optWrap.setAttribute('aria-label', 'Questão ' + (qi + 1));
      const why = document.createElement('div');
      why.className = 'q-why';
      why.id = id + '-why-' + qi;
      why.innerHTML = '<b>por quê</b>' + q.why;

      const letters = 'ABCDEF';
      (q.options || []).forEach((opt, oi) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'opt';
        b.dataset.opt = oi;
        b.setAttribute('aria-describedby', why.id);
        b.innerHTML = '<span class="opt-mark">' + letters[oi] + '</span><span>' + opt + '</span>';
        b.addEventListener('click', () => {
          if (wrap.dataset.answered) return;
          wrap.dataset.answered = '1';
          const ok = oi === q.answer;
          b.classList.add(ok ? 'is-correct' : 'is-wrong');
          if (!ok) {
            const right = $('.opt[data-opt="' + q.answer + '"]', optWrap);
            if (right) right.classList.add('is-correct');
          }
          $$('.opt', optWrap).forEach((x) => {
            x.disabled = true;
            if (x !== b && !x.classList.contains('is-correct')) x.classList.add('is-dim');
          });
          why.classList.add('is-open');
          why.setAttribute('role', 'status');
          why.setAttribute('tabindex', '-1');
          why.focus({ preventScroll: true });
          answered += 1;
          if (ok) correct += 1;
          scoreEl.textContent = correct + ' / ' + answered;
          if (opts.onAnswer) opts.onAnswer({ index: qi, ok, q });
          if (answered === total) finish();
        });
        optWrap.appendChild(b);
      });

      wrap.appendChild(optWrap);
      wrap.appendChild(why);
      root.appendChild(wrap);
    });

    function finish() {
      const perfect = correct === total;
      const pctv = Math.round((correct / total) * 100);
      result.innerHTML =
        '<div class="row between" style="align-items:flex-end;gap:16px">' +
        '<div><div class="mono muted" style="font-size:9px;letter-spacing:.14em;text-transform:uppercase;margin-bottom:4px">resultado</div>' +
        '<div class="score-big">' + correct + '<span class="muted" style="font-size:22px">/' + total + '</span></div></div>' +
        '<div class="mono" style="font-size:11px;color:var(--muted)">' + pctv + '% · ' + (perfect ? 'sem erros' : 'revisar') + '</div>' +
        '</div>' +
        '<p class="small" style="margin:12px 0 0">' +
        (perfect
          ? opts.success || 'Fechado. Você pode seguir para a próxima página.'
          : opts.fail || 'Reveja as explicações acima. O objetivo é entender a regra, não acertar por sorte.') +
        '</p>' +
        '<div class="row" style="margin-top:12px"><button type="button" class="btn btn-sm js-retry">' +
        '<svg class="icon" aria-hidden="true"><use href="#i-reset"></use></svg> tentar de novo</button></div>';
      result.classList.add('is-open');
      result.setAttribute('role', 'status');
      result.setAttribute('tabindex', '-1');
      root.appendChild(result);
      result.focus({ preventScroll: true });
      $('.js-retry', result).addEventListener('click', () => {
        root.innerHTML = '';
        quiz(root, questions, opts);
      });
      if (opts.mode === 'score') {
        if (opts.onFinish) opts.onFinish({ correct, total, pct: pctv });
      } else if (perfect && opts.checkpoint !== false) {
        complete(PAGE);
      }
    }

    if (opts.intro) {
      const p = document.createElement('p');
      p.className = 'small';
      p.style.margin = '12px 0 0';
      p.textContent = opts.intro;
      root.insertBefore(p, root.children[1]);
    }
    scoreEl.textContent = '0 / 0';
  }

  /* ---------- checklists ---------- */
  function bindChecks() {
    $$('input[data-check]').forEach((cb) => {
      const key = cb.dataset.check;
      if (state.checks[key]) cb.checked = true;
      cb.addEventListener('change', () => {
        state.checks[key] = cb.checked;
        save();
      });
    });
  }

  /* ---------- toc & scrollspy ---------- */
  function buildToc() {
    const toc = $('#toc');
    const article = $('#content');
    if (!toc || !article) return;
    const heads = $$('h2', article).filter((h) => h.textContent.trim());
    if (!heads.length) {
      toc.innerHTML = '<a href="#content">início</a>';
      return;
    }
    const links = [];
    heads.forEach((h, i) => {
      if (!h.id) h.id = 's' + (i + 1);
      const a = document.createElement('a');
      a.href = '#' + h.id;
      a.textContent = h.textContent.replace(/\s+/g, ' ').trim();
      toc.appendChild(a);
      links.push({ a, h });
    });
    const setActive = (h) => {
      links.forEach((l) => l.a.classList.toggle('is-active', l.h === h));
    };
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((en) => {
            if (en.isIntersecting) setActive(en.target);
          });
        },
        { rootMargin: '-90px 0px -68% 0px', threshold: 0 }
      );
      heads.forEach((h) => io.observe(h));
    }
    setActive(heads[0]);
  }

  /* ---------- index overlay ---------- */
  function buildIndex() {
    const list = $('#index-list');
    if (!list) return;
    const wrap = document.createDocumentFragment();
    ACTS.forEach((act) => {
      const items = PAGES.filter((p) => p.act === act.id);
      if (!items.length) return;
      const block = document.createElement('div');
      block.className = 'index-act';
      block.innerHTML =
        '<div class="index-act-head"><span>' + act.label + '</span><span>/</span><span>' + act.name + '</span></div>';
      items.forEach((p) => {
        const a = document.createElement('a');
        a.className = 'index-row';
        a.href = p.slug + '.html';
        if (p.id === PAGE) {
          a.classList.add('is-current');
          a.setAttribute('aria-current', 'page');
        }
        if (isDone(p.id)) a.classList.add('is-done');
        a.setAttribute('aria-label', p.title + (isDone(p.id) ? ' — concluída' : '') + (p.id === PAGE ? ' — página atual' : ''));
        a.innerHTML =
          '<span class="n">' + p.id + '</span><span class="t">' + p.title + '</span><span class="m">' + p.minutes + ' min</span>';
        block.appendChild(a);
      });
      wrap.appendChild(block);
    });
    list.appendChild(wrap);
  }

  function bindIndex() {
    const overlay = $('#index');
    if (!overlay) return;
    let lastFocus = null;
    const open = () => {
      lastFocus = document.activeElement;
      overlay.hidden = false;
      document.body.classList.add('index-open');
      const openBtn = $('#btn-index');
      if (openBtn) openBtn.setAttribute('aria-expanded', 'true');
      const close = $('#btn-index-close');
      if (close) close.focus();
      live('Índice aberto.');
    };
    const close = () => {
      overlay.hidden = true;
      document.body.classList.remove('index-open');
      const openBtn = $('#btn-index');
      if (openBtn) openBtn.setAttribute('aria-expanded', 'false');
      if (lastFocus) lastFocus.focus();
    };
    const openBtn = $('#btn-index');
    if (openBtn) {
      openBtn.setAttribute('aria-expanded', 'false');
      openBtn.addEventListener('click', open);
    }
    const closeBtn = $('#btn-index-close');
    if (closeBtn) closeBtn.addEventListener('click', close);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) close();
    });
    document.addEventListener('keydown', (e) => {
      if (overlay.hidden) {
        if (e.key === 'i') {
          const t = e.target;
          if (t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) return;
          if (e.metaKey || e.ctrlKey || e.altKey) return;
          open();
        }
        return;
      }
      if (e.key === 'Escape') {
        close();
        return;
      }
      if (e.key === 'Tab') {
        const focusables = Array.from(
          overlay.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')
        ).filter((el) => el.offsetParent !== null);
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });
    overlay.querySelectorAll('.index-panel a').forEach((a) => a.addEventListener('click', close));
  }

  /* ---------- misc ---------- */
  function money(n, digits = 2) {
    return '$' + Number(n).toLocaleString('en-US', { minimumFractionDigits: digits, maximumFractionDigits: digits });
  }

  function wilson(k, n, z = 1.96) {
    if (!n) return [0, 0];
    const p = k / n;
    const den = 1 + (z * z) / n;
    const centre = (p + (z * z) / (2 * n)) / den;
    const margin = (z * Math.sqrt((p * (1 - p)) / n + (z * z) / (4 * n * n))) / den;
    return [Math.max(0, centre - margin), Math.min(1, centre + margin)];
  }

  function tokens(text) {
    return Math.ceil(String(text).trim().length / 3.8);
  }

  function ready(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  }

  // wire global behaviour
  ready(() => {
    if (state.theme && document.documentElement.dataset.theme !== state.theme) {
      document.documentElement.dataset.theme = state.theme;
    }
    syncTheme();
    const themeBtn = $('#btn-theme');
    if (themeBtn) themeBtn.addEventListener('click', toggleTheme);
    bindCopy();
    bindChecks();
    $$('.prompt pre').forEach((pre) => {
      pre.tabIndex = 0;
      pre.setAttribute('aria-label', 'Bloco de prompt; use as setas para rolar');
    });
    bindIndex();
    buildIndex();
    buildToc();
    syncDoneUI();
    updateProgress();
    $$('[data-tabs]').forEach(tabs);
    $$('.js-done').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.done;
        if (isDone(id)) {
          uncomplete(id);
          toast('Página ' + id + ' desmarcada');
        } else {
          complete(id);
        }
      });
    });
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);
    document.documentElement.classList.add('js');
  });

  window.SP = {
    $,
    $$,
    state,
    isDone,
    complete,
    uncomplete,
    toast,
    quiz,
    tabs,
    copy,
    money,
    pct,
    wilson,
    tokens,
    ready,
    page: PAGE,
  };
})();
