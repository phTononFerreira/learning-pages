import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { site, acts, pages, essential } from './site.config.mjs';

const root = path.dirname(fileURLToPath(import.meta.url));
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const exists = (p) => fs.existsSync(path.join(root, p));

const icons = read('assets/icons.svg');
const actOf = (n) => acts.find((a) => a.id === n);
const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const topbar = (page) => `
<header class="topbar">
  <div class="topbar-inner">
    <a class="brand" href="index.html" aria-label="SYS/PRM — início">
      <span class="brand-mark" aria-hidden="true"></span>
      <span class="brand-name">SYS/PRM</span>
      <span class="brand-sub">system prompts</span>
    </a>
    <div class="topbar-right">
      ${page ? `<span class="page-count mono">${page.id} / ${pages.length}</span>` : `<span class="page-count mono">${pages.length} páginas</span>`}
      <button class="icon-btn" id="btn-index" type="button" aria-label="Abrir índice" aria-haspopup="dialog" aria-controls="index">
        <svg class="icon" aria-hidden="true"><use href="#i-menu"></use></svg>
        <span class="icon-btn-label">índice</span>
      </button>
      <button class="icon-btn" id="btn-theme" type="button" aria-label="Alternar tema">
        <svg class="icon icon-sun" aria-hidden="true"><use href="#i-sun"></use></svg>
        <svg class="icon icon-moon" aria-hidden="true"><use href="#i-moon"></use></svg>
      </button>
    </div>
  </div>
</header>`;

const pageHead = (page) => {
  const act = actOf(page.act);
  return `
  <header class="page-head">
    <div class="kicker">
      <span class="kicker-dot" aria-hidden="true"></span>
      ${act.label} · ${act.name.toUpperCase()} <span class="kicker-sep">/</span> PÁGINA ${page.id}
    </div>
    <h1>${esc(page.title)}</h1>
    <p class="deck">${esc(page.deck)}</p>
    <div class="page-meta">
      <span class="meta-item">
        <svg class="icon" aria-hidden="true"><use href="#i-clock"></use></svg>
        ${page.minutes} min
      </span>
      <span class="meta-item">
        <svg class="icon" aria-hidden="true"><use href="#i-${page.icon}"></use></svg>
        ${page.kicker}
      </span>
      <span class="meta-tags">${page.tags.map((t) => `<span class="tag">${esc(t)}</span>`).join('')}</span>
    </div>
  </header>`;
};

const pager = (page) => {
  const i = pages.findIndex((p) => p.id === page.id);
  const prev = pages[i - 1];
  const next = pages[i + 1];
  return `
  <nav class="pager" aria-label="Navegação entre páginas">
    ${prev ? `<a class="pager-link pager-prev" href="${prev.slug}.html"><span class="pager-dir">← anterior</span><span class="pager-title">${esc(prev.title)}</span></a>` : `<a class="pager-link pager-prev" href="index.html"><span class="pager-dir">← início</span><span class="pager-title">Mapa do curso</span></a>`}
    <button class="btn pager-done js-done" type="button" data-done="${page.id}">
      <svg class="icon" aria-hidden="true"><use href="#i-check"></use></svg>
      <span>concluir página</span>
    </button>
    ${next ? `<a class="pager-link pager-next" href="${next.slug}.html"><span class="pager-dir">próxima →</span><span class="pager-title">${esc(next.title)}</span></a>` : `<a class="pager-link pager-next" href="13-recapitulo.html"><span class="pager-dir">fim →</span><span class="pager-title">Recapitulação</span></a>`}
  </nav>`;
};

const shell = ({ page, content, isHub = false }) => {
  const title = page ? `${page.id} · ${page.title} — ${site.name}` : `${site.title} — ${site.name}`;
  const desc = page ? page.deck : site.description;
  const pageScript = page && exists(`assets/pages/${page.id}.js`) ? `<script defer src="assets/pages/${page.id}.js"></script>` : '';
  const body = isHub
    ? content
    : `<div class="page-grid">
        <article class="page" id="content">
          ${pageHead(page)}
          ${content}
          ${pager(page)}
        </article>
        <aside class="rail" aria-label="Nesta página">
          <div class="rail-inner">
            <div class="rail-label mono">nesta página</div>
            <nav class="toc" id="toc"></nav>
            <div class="rail-progress">
              <div class="rail-label mono">progresso</div>
              <div class="bar"><span class="bar-fill js-rail-bar"></span></div>
              <div class="rail-note mono"><span class="js-done-count">0</span> / ${pages.length} páginas</div>
            </div>
          </div>
        </aside>
      </div>`;

  return `<!doctype html>
<html lang="${site.lang}" data-theme="light">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<meta name="color-scheme" content="light dark">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' fill='%23FFFFFF'/%3E%3Crect x='7' y='7' width='18' height='18' fill='none' stroke='%23111111' stroke-width='1.5'/%3E%3Crect x='13' y='13' width='6' height='6' fill='%23E4572E'/%3E%3C/svg%3E">
<link rel="stylesheet" href="assets/site.css">
<script>
  try {
    var t = localStorage.getItem('sp.theme');
    if (!t) t = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    document.documentElement.dataset.theme = t;
  } catch (e) {}
</script>
</head>
<body data-page="${page ? page.id : 'hub'}">
<a class="skip" href="#main">Pular para o conteúdo</a>
<div class="readbar" aria-hidden="true"><span id="readbar-fill"></span></div>
${topbar(page)}
<main id="main" class="${isHub ? 'shell shell-hub' : 'shell'}">
  ${body}
</main>
<footer class="site-foot">
  <div class="shell foot-inner">
    <div class="foot-brand">
      <span class="brand-mark" aria-hidden="true"></span>
      <span class="mono">SYS/PRM</span>
      <span class="foot-sep">/</span>
      <span class="small">engenharia de system prompts, sem teatro</span>
    </div>
    <div class="foot-links mono">
      <a href="index.html">mapa</a>
      <a href="13-recapitulo.html#fontes">fontes</a>
    </div>
  </div>
</footer>
${icons}
<div class="index" id="index" hidden>
  <div class="index-panel" role="dialog" aria-modal="true" aria-labelledby="index-title">
    <div class="index-head">
      <div>
        <div class="kicker">mapa do curso</div>
        <h2 id="index-title">${site.name}</h2>
      </div>
      <button class="icon-btn" id="btn-index-close" type="button" aria-label="Fechar índice">
        <svg class="icon" aria-hidden="true"><use href="#i-x"></use></svg>
      </button>
    </div>
    <div class="index-body" id="index-list"></div>
    <div class="index-foot">
      <a class="btn btn-accent" href="index.html">voltar ao início</a>
      <span class="mono small">${site.totalMinutes} min · ${pages.length} páginas</span>
    </div>
  </div>
</div>
<noscript><div class="noscript">Este material usa JavaScript para as interações. O texto continua legível, mas os laboratórios não funcionam.</div></noscript>
<script>
  window.SP_PAGES = ${JSON.stringify(pages)};
  window.SP_ACTS = ${JSON.stringify(acts)};
  window.SP_CURRENT = ${JSON.stringify(page ? page.id : 'hub')};
  window.SP_ESSENTIAL = ${JSON.stringify(essential)};
</script>
<script src="assets/data/intents.js"></script>
<script defer src="assets/app.js"></script>
${pageScript}
</body>
</html>`;
};

const buildPage = (page) => {
  const file = `content/${page.slug}.html`;
  if (!exists(file)) {
    console.warn(`! missing ${file} — placeholder`);
    return shell({
      page,
      content: `<section class="sec"><p class="lead">Conteúdo em construção.</p></section>`,
    });
  }
  return shell({ page, content: read(file) });
};

for (const page of pages) {
  fs.writeFileSync(path.join(root, `${page.slug}.html`), buildPage(page));
  console.log(`✓ ${page.slug}.html`);
}

const hub = shell({ page: null, content: read('content/hub.html'), isHub: true });
fs.writeFileSync(path.join(root, 'index.html'), hub);
console.log('✓ index.html');

// gate de vazamento: casos de demonstração não podem estar no golden set
try {
  execFileSync(process.execPath, ['tools/check-leakage.mjs'], { cwd: root, stdio: 'inherit' });
} catch (e) {
  process.exitCode = 1;
}
