# Styleguide — SYS/PRM

Leia isto antes de escrever qualquer página. O objetivo é consistência visual e técnica sem tocar nos arquivos compartilhados.

## Arquivos

Cada página tem exatamente dois arquivos seus:

- `content/XX-slug.html` — fragmento HTML (o build injeta topbar, header, TOC, pager, footer).
- `assets/pages/XX.js` — JavaScript da página (o build injeta `<script defer>` automaticamente).

**Não edite** `assets/site.css`, `assets/app.js`, `build.mjs`, `site.config.mjs`, `content/hub.html` nem outras páginas. Se precisar de um componente novo, use um `<style>` inline no topo do fragmento com prefixo único (`.p07-...`).

Não rode `node build.mjs` enquanto outros builders estiverem trabalhando. O integrador roda.

## Estrutura do fragmento

```html
<style>
  /* opcional, escopado */
</style>

<section class="sec" id="primeira-secao">
  <div class="sec-head"><span class="sec-num">01</span><h2>Título da seção</h2></div>
  <p class="lead">Abertura curta. Uma ideia.</p>
  ...
</section>

<section class="sec" id="checkpoint">
  <div class="sec-head"><span class="sec-num">05</span><h2>Checkpoint</h2></div>
  <p>Uma pergunta, sem consultar.</p>
  <div class="quiz" id="check"></div>
</section>

<div class="sources">
  <details>
    <summary>Fontes e notas desta página</summary>
    <div class="details-body">
      <ol>
        <li>Autor, <a href="https://..." target="_blank" rel="noopener">Título</a> — o que foi usado.</li>
      </ol>
    </div>
  </details>
</div>
```

- 3 a 5 seções + checkpoint. 650–950 palavras. Uma ideia por seção.
- Todo `<h2>` vira item do TOC. Dê `id` às seções.
- `sec-num` é 01, 02, 03… dentro da página.
- Use `<p class="lead">` só na primeira seção.
- Sem `<h1>`, sem `<html>`, sem `<body>`.

## Componentes disponíveis

### Texto e callouts

```html
<p class="lead">…</p>
<p class="small">…</p>
<p class="tiny">…</p>
<span class="mono">saudacao</span>

<div class="callout"><div class="callout-label"><svg class="icon"><use href="#i-info"></use></svg> label</div><p>…</p></div>
<div class="callout callout-accent">…</div>
<div class="callout callout-ink">…</div>
<div class="callout callout-quote"><p>frase</p><cite>autor</cite></div>
```

### Grids, cards, stats

```html
<div class="two-col">…</div>
<div class="three-col"><div>…</div>…</div>
<div class="cards"><div class="card"><div class="card-num">01</div><h3>…</h3><p class="small">…</p></div>…</div>
<div class="stats"><div class="stat"><b>93%</b><span>acurácia no test</span></div>…</div>
```

### Prompt, diff, tabela

```html
<div class="prompt">
  <div class="prompt-head">
    <span class="prompt-title"><b>v3</b> · system prompt</span>
    <button class="copy-btn" type="button" data-copy="#prompt-v3"><svg class="icon"><use href="#i-copy"></use></svg> copiar</button>
  </div>
  <pre id="prompt-v3"><code>texto…</code></pre>
</div>

<div class="diff">
  <div class="diff-del">Use `outros` quando não souber.</div>
  <div class="diff-add">Use `outros` para fora de escopo, curto demais ou ambíguo; registre o motivo.</div>
</div>

<div class="table-wrap"><table>…</table></div>
<p class="caption">…</p>
```

Escape `<` como `&lt;` dentro de `<pre><code>`. Para prompts, escreva em inglês (o modelo é instruído em inglês; a explicação é em pt-BR).

### Botões, chips, tabs

```html
<button class="btn" type="button">…</button>
<button class="btn btn-accent">…</button>
<button class="btn btn-sm btn-ghost">…</button>
<div class="pill-row"><button class="chip is-active">…</button></div>

<div class="tabs" data-tabs>
  <div class="tablist" role="tablist">
    <button class="tab" role="tab" aria-selected="true">DSPy</button>
    <button class="tab" role="tab" aria-selected="false">GEPA</button>
  </div>
  <div class="tabpanel" role="tabpanel">…</div>
  <div class="tabpanel" role="tabpanel" hidden>…</div>
</div>
```

### Lab (interação)

```html
<div class="lab">
  <div class="lab-head">
    <span class="lab-title"><svg class="icon"><use href="#i-terminal"></use></svg> nome do laboratório</span>
    <span class="lab-status">status</span>
  </div>
  <div class="lab-body">
    <div class="lab-grid">
      <div><!-- controles --></div>
      <div class="lab-out">…</div>
    </div>
  </div>
</div>
```

Campos: `.field` com `<span>` + input/select/textarea. `.kv` para pares chave/valor. `.big-num` para número grande. `.bar` + `.bar-fill` para barras. `.range-row` para slider + output.

### Matriz, passos, checklist

```html
<div class="matrix-wrap"><table class="matrix">…</table></div>
<div class="legend"><span><i class="heat-3"></i> 3–5 casos</span>…</div>

<div class="steps">
  <div class="step"><div><h3>…</h3><p>…</p></div></div>
</div>

<label class="check"><input type="checkbox" data-check="p08-1"><span>…</span></label>
```

Classes de calor: `heat-0` … `heat-5`, `heat-accent`.

### SVG

Use `viewBox`, `stroke-width="1"`, sem gradiente/sombra, `fill="none"`, `vector-effect="non-scaling-stroke"` quando escalar. Classes: `.fig`, `.s-line`, `.s-ink`, `.s-accent`, `.s-box`, `.s-box-accent`, `.s-fill`, `.s-fill-accent`, `text.ink`, `text.accent`. Sempre com `<title>` e `role="img"`.

### Ícones

`<svg class="icon" aria-hidden="true"><use href="#i-ALGO"></use></svg>`

Disponíveis: `alert, grid, layers, list, copy, braces, thermometer, chart, loop, cpu, target, shield, check, menu, x, sun, moon, clock, arrow-right, arrow-left, chevron-down, info, spark, bug, flow, terminal, book, play, reset, external, plus, minus, search, eye, lock, scale, route, message, database, ruler, dollar, warning, quote`.

## JavaScript

`window.SP` oferece:

- `SP.$(sel)` / `SP.$$(sel)` — querySelector / querySelectorAll em array.
- `SP.quiz(sel, questions, opts)` — renderiza quiz e cuida de feedback, score e conclusão da página.
- `SP.tokens(texto)` — estimativa (~3,8 chars/token).
- `SP.money(n, digits=2)` — `$1.234,56`? Retorna `$1,234.56` (en-US); use para custos.
- `SP.pct(n, digits)` — 0.933 → `93,3%`.
- `SP.wilson(k, n)` — `[lo, hi]` intervalo de 95%.
- `SP.toast(msg)`, `SP.complete(id)`, `SP.isDone(id)`.
- `SP.ready(fn)`.

Quiz:

```js
SP.quiz('#check', [
  { q: '…', options: ['…','…','…'], answer: 1, why: '…' },
], {
  checkpoint: true,
  label: 'checkpoint',
  success: '…',
  fail: '…',
});
```

`checkpoint: true` marca a página como concluída quando todas estão corretas. Use `checkpoint: false` para quizzes de previsão. Não crie outro mecanismo de conclusão.

Para laboratórios, escreva JS puro com `addEventListener`. Nada de frameworks, CDN, fetch ou `import`. Tudo deve funcionar em `file://`.

## Dataset

`window.SP_DATA` (carregado em todas as páginas) tem:

```js
{
  labels: ['saudacao', …],           // 7
  descriptions: { saudacao: '…' },
  versions: [{ id:'v1', name:'Zero-shot', sub:'…' }, …],
  rows: [{
    id:'001',
    text:'…',
    true:'saudacao',
    split:'dev' | 'test',
    tags:['boundary', …],
    pred: { v1:'saudacao', v2:'…', v3:'…', v4:'…' },
    note:'…'
  }]
}
```

`window.SP_CASES` tem 12 casos de demonstração (`text`, `expected`, `why`, `trap`) **fora** do golden set.

Fatos congelados (use exatamente estes):

- 150 casos: 88 dev, 62 test.
- Acurácia no dev: v1 67,0% · v2 83,0% · v3 89,8% · v4 93,2%.
- Acurácia no test: v1 62,9% · v2 80,6% · v3 90,3% · v4 93,5%.
- v1→v2 no test: 11 corrigidos, 0 quebrados (McNemar significativo, p≈0,001).
- v2→v3: 6 corrigidos, 0 quebrados (p≈0,031).
- v3→v4: 3 corrigidos, 1 quebrado (p=0,625 — **não significativo**).
- O “31% em outros” é o estado v0 narrativo, antes do dataset.
- Dataset sintético e didático, não benchmark.

Labels e definições: `saudacao`, `duvida_produto`, `status_pedido`, `reclamacao`, `cancelamento`, `falar_humano`, `outros`. Prioridade: `falar_humano > cancelamento > reclamacao > status_pedido > duvida_produto > saudacao > outros`.

## Fatos técnicos (Nova Lite 1.0)

- 300K contexto, 10K saída máxima; sem structured outputs nativos; tool use client-side; sem toggle de raciocínio.
- `temperature=0` é greedy, **não** determinístico (batching/kernels).
- Para classificação: `temperature=0`, `topP=0.9`, `maxTokens=8`, `stopSequences=["\n"]`, label plano.
- JSON no Nova Lite 1.0 é probabilístico; validar no código, 1 retry, fallback `outros`.
- Prompt caching explícito: mínimo 1.000 tokens, TTL 5 min, até 4 checkpoints.
- Preços de referência Nova Lite: $0,06/1M entrada, $0,24/1M saída. Micro: $0,035/$0,14. Pro: $0,80/$3,20.
- Guardrails: cobrança por 1.000 caracteres por política; pode custar mais que o modelo.
- EOL do Nova Lite 1.0 sinalizado para depois de dez/2025;cite a migração para Nova 2 Lite quando relevante.

## Tom e escopo

- Português brasileiro, direto, sem “vamos mergulhar”, sem motivação vazia.
- Cada seção ensina uma decisão; exemplos concretos da Loja Norte.
- Interação obrigatória: o aluno **decide** algo, recebe consequência e explicação. Nada de clique decorativo.
- Não invente números além dos fatos acima. Se simular, rotule “simulação didática”.
- Toda página termina com checkpoint + fontes (2–5 links primários: AWS docs, Anthropic, papers).
- Sem border-radius, sombra, gradiente, emoji ou imagem externa.
- Accent `#E4572E` só em ação, número-chave, estado ativo ou erro. Não use como decoração.

## Checklist antes de entregar

- [ ] Fragmento começa em `<section>` e não tem `<h1>`.
- [ ] 3–5 seções, 650–950 palavras, uma ideia por seção.
- [ ] Pelo menos uma interação real (lab, seletor, parser, dashboard, teste).
- [ ] Checkpoint com `SP.quiz('#check', ..., {checkpoint:true})`.
- [ ] Fatos e números batem com o dataset.
- [ ] Nenhum arquivo compartilhado editado.
- [ ] JS em `assets/pages/XX.js`, sem dependências, e `node --check` passa.
- [ ] Nenhum `border-radius`, `box-shadow` ou `linear-gradient`.
- [ ] Links com `target="_blank" rel="noopener"`.
- [ ] Funciona por teclado; feedback com texto, não só cor.
