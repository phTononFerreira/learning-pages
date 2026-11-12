/* SYS/PRM — resumão animado. Sem dependências. */
(function (window, document) {
  'use strict';

  var LABELS = ['saudacao', 'duvida_produto', 'status_pedido', 'reclamacao', 'cancelamento', 'falar_humano', 'outros'];
  var PRIORITY = ['falar_humano', 'cancelamento', 'reclamacao', 'status_pedido', 'duvida_produto', 'saudacao', 'outros'];
  var TOTAL = { dev: 88, test: 62 };
  var HITS = {
    dev: { v1: 59, v2: 73, v3: 79, v4: 82 },
    test: { v1: 39, v2: 50, v3: 56, v4: 58 }
  };
  var ACC = {
    dev: { v1: '67,0%', v2: '83,0%', v3: '89,8%', v4: '93,2%' },
    test: { v1: '62,9%', v2: '80,6%', v3: '90,3%', v4: '93,5%' }
  };

  var SLIDES = [
    { id: 1, slug: 'diagnostico', beats: 3, init: function () { return { caseIdx: 0 }; } },
    { id: 2, slug: 'taxonomia', beats: 3, init: function () { return { selectedLabel: null }; } },
    { id: 3, slug: 'estrutura', beats: 3, init: function () { return { order: ['contrato', 'exemplos', 'definicoes', 'entrada'] }; } },
    { id: 4, slug: 'regras', beats: 3, init: function () { return { ruleIdx: 0, mode: 'negativa' }; } },
    { id: 5, slug: 'few-shot', beats: 3, init: function () { return { pack: 'A' }; } },
    { id: 6, slug: 'contrato', beats: 3, init: function () { return { rawIdx: 0 }; } },
    { id: 7, slug: 'temperatura', beats: 3, init: function () { return { temp: 0, maxTokens: 200, stopSeq: false }; } },
    { id: 8, slug: 'avaliacao', beats: 3, init: function () { return { version: 'v1', split: 'dev' }; } },
    { id: 9, slug: 'loop', beats: 3, init: function () { return { transition: 'v1_v2' }; } },
    { id: 10, slug: 'automacao', beats: 3, init: function () { return { scenario: 'sem_golden' }; } },
    { id: 11, slug: 'producao', beats: 3, init: function () { return { model: 'lite', volume: 100000, cache: false }; } },
    { id: 12, slug: 'cheat-sheet', beats: 3, init: function () { return { checks: [false, false, false, false, false, false] }; } }
  ];

  var state = {
    ready: false,
    slide: 1,
    beat: 1,
    maxBeat: 3,
    autoplay: false,
    reduced: false,
    timer: null,
    int: {}
  };

  var DATA = {};

  var S3_BLOCKS = {
    definicoes: { code: 'A', label: 'Papel + taxonomia + regras de prioridade' },
    exemplos: { code: 'B', label: 'Exemplos few-shot de fronteira' },
    entrada: { code: 'C', label: 'Mensagem do cliente delimitada' },
    contrato: { code: 'D', label: 'Contrato de saída: 1 dos 7 labels' }
  };

  var S4_RULES = [
    {
      name: 'Fronteira 1 · prazo vs atraso',
      neg: 'Não classifique como reclamacao se o cliente não estiver xingando ou se o prazo ainda não tiver expirado, não deixe de usar status_pedido quando for só pergunta de entrega.',
      pos: 'SE o cliente pergunta onde está o pedido dentro do prazo -> status_pedido. SE relata prazo vencido, avaria ou erro de cobrança -> reclamacao.'
    },
    {
      name: 'Fronteira 2 · preço vs cancelamento',
      neg: 'Evite marcar cancelamento quando a pessoa só reclamar que achou caro mas não pedir para encerrar a compra atual.',
      pos: 'SE há pedido explícito para desistir ou estornar compra existente -> cancelamento. SE há queixa de valor após compra sem pedir estorno -> reclamacao.'
    }
  ];

  var S5_PACKS = {
    A: {
      name: 'Pacote A · 10 óbvios',
      items: [
        { text: 'bom dia', label: 'saudacao' },
        { text: 'olá, tudo bem?', label: 'saudacao' },
        { text: 'quero cancelar', label: 'cancelamento' },
        { text: 'onde está meu pedido?', label: 'status_pedido' },
        { text: 'o produto chegou quebrado', label: 'reclamacao' },
        { text: 'quero falar com alguém', label: 'falar_humano' },
        { text: 'qual o preço?', label: 'duvida_produto' },
        { text: 'boa tarde', label: 'saudacao' },
        { text: 'meu pedido atrasou', label: 'reclamacao' },
        { text: 'obrigado', label: 'saudacao' }
      ],
      dev: '83,0%', test: '80,6%', note: 'sem ganho mensurável', p: '—', width: '83.0'
    },
    B: {
      name: 'Pacote B · 5 fronteiras (v3)',
      items: [
        { text: 'Pedido 9012 feito ontem, qual o código de rastreio?', label: 'status_pedido' },
        { text: 'Pedido 9012 atrasado há 10 dias e ninguém responde!', label: 'reclamacao' },
        { text: 'Cancelem minha assinatura e me passem um atendente humano já.', label: 'falar_humano' },
        { text: 'Essa cafeteira 220v tem pronta entrega para o CEP 01001-000?', label: 'duvida_produto' },
        { text: 'Vocês têm vaga aberta para trabalhar no estoque?', label: 'outros' }
      ],
      dev: '89,8%', test: '90,3%', note: '+6,8 p.p. no dev', p: 'p≈0,031', width: '89.8'
    }
  };

  var S6_PAYLOADS = [
    { label: 'Label plano', raw: 'status_pedido' },
    { label: 'JSON válido', raw: '{"intent":"reclamacao"}' },
    { label: 'JSON truncado', raw: '{"intent":"cancelamento"' },
    { label: 'Label alucinado', raw: 'suporte_tecnico_urgente' }
  ];

  var S10_SCENARIOS = [
    {
      id: 'sem_golden', title: 'Temos 10 exemplos soltos e a taxonomia muda toda semana', status: 'BLOQUEADO', tool: 'Nenhuma ainda', tone: 'bad',
      reason: 'Sem taxonomia estável e golden set, DSPy, GEPA, OPRO ou APE só fazem overfitting no ruído.'
    },
    {
      id: 'ci_pr', title: 'Temos o prompt v3/v4 estável e queremos evitar regressão em PRs', status: 'RECOMENDADO', tool: 'promptfoo', tone: 'good',
      reason: 'Rode os 88 casos de dev (ou os 150) em CI/CD, verificando contrato, latência e regressão a custo baixo.'
    },
    {
      id: 'otimizar', title: 'Temos 88 dev, 62 test, métrica travada e queremos buscar few-shot/instruções', status: 'RECOMENDADO', tool: 'DSPy / GEPA / OPRO / APE', tone: 'good',
      reason: 'Compile demonstrações e evolua regras, sempre avaliando diretamente no Nova Lite 1.0.'
    },
    {
      id: 'trocar', title: 'Queremos otimizar em um modelo gigante e rodar o texto final no Nova Lite 1.0', status: 'ARMADILHA', tool: 'Modelo diferente', tone: 'bad',
      reason: 'Quebra a regra do modelo-alvo fixo. O prompt otimizado em outro LLM raramente preserva o ganho.'
    }
  ];

  var MODELS = {
    micro: { name: 'Nova Micro', in: 0.035, out: 0.14 },
    lite: { name: 'Nova Lite', in: 0.06, out: 0.24 },
    pro: { name: 'Nova Pro', in: 0.80, out: 3.20 }
  };

  var S12_ITEMS = [
    'Taxonomia fechada em 7 labels com prioridade falar_humano > cancelamento > reclamacao > status_pedido > duvida_produto > saudacao > outros.',
    'Estrutura em blocos com prefixo estático no topo, entrada delimitada e contrato de label plano colado ao fim.',
    'Regras positivas (1 por linha) e 5 exemplos few-shot focados em hard negatives de fronteira.',
    'Inferência configurada com temperature: 0, topP: 0.9, maxTokens: 8, stopSequences: ["\\n"] e fallback outros após 1 retry.',
    'Avaliação auditada em 88 casos dev e 62 test com IC de Wilson e teste pareado de McNemar.',
    'Produção dimensionada com Prompt Caching (mín. 1.000 tokens, TTL 5 min), Guardrails (por 1.000 chars/política) e plano para Nova 2 Lite.'
  ];

  var S12_TEMPLATE = [
    'You are the intent classifier for Loja Norte.',
    'Return exactly one label from the list and nothing else.',
    '',
    'LABELS',
    '- saudacao',
    '- duvida_produto',
    '- status_pedido',
    '- reclamacao',
    '- cancelamento',
    '- falar_humano',
    '- outros',
    '',
    'PRIORITY (when multiple intents appear)',
    'falar_humano > cancelamento > reclamacao > status_pedido > duvida_produto > saudacao > outros',
    '',
    'RULES',
    '1. Route explicit requests for a human to falar_humano, even if the message also mentions cancelamento or reclamacao.',
    '2. Route explicit requests to cancel or refund an existing purchase to cancelamento.',
    '3. Route reports of a late, damaged or wrong order to reclamacao; a simple tracking question within the deadline is status_pedido.',
    '4. Route pre-purchase questions about features, price or availability to duvida_produto.',
    '5. Route greetings without a request to saudacao.',
    '6. Route out-of-scope, unintelligible, too short or ambiguous messages to outros.',
    '',
    'EXAMPLES',
    'Input: "Pedido 9012 feito ontem, qual o código de rastreio?"',
    'Output: status_pedido',
    'Input: "Pedido 9012 atrasado há 10 dias e ninguém responde!"',
    'Output: reclamacao',
    'Input: "Cancelem minha assinatura e me passem um atendente humano já."',
    'Output: falar_humano',
    'Input: "Essa cafeteira 220v tem pronta entrega para o CEP 01001-000?"',
    'Output: duvida_produto',
    'Input: "Vocês têm vaga aberta para trabalhar no estoque?"',
    'Output: outros',
    '',
    'INPUT',
    '<mensagem>{{message}}</mensagem>',
    '',
    'OUTPUT',
    'One label. No JSON. No explanation.'
  ].join('\n');

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function clamp(v, min, max) { return Math.max(min, Math.min(max, Number(v) || min)); }
  function esc(v) {
    return String(v == null ? '' : v)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  function safeTokens(text) {
    if (window.SP && typeof window.SP.tokens === 'function') {
      try { return window.SP.tokens(text); } catch (e) {}
    }
    return Math.ceil(String(text).trim().length / 3.8);
  }
  function safePct(n, d) {
    if (window.SP && typeof window.SP.pct === 'function') {
      try { return window.SP.pct(n, d || 0); } catch (e) {}
    }
    return (Number(n) * 100).toFixed(d || 0).replace('.', ',') + '%';
  }
  function safeMoney(n, d) {
    if (window.SP && typeof window.SP.money === 'function') {
      try { return window.SP.money(n, d); } catch (e) {}
    }
    return '$' + Number(n).toLocaleString('en-US', {
      minimumFractionDigits: d == null ? 2 : d,
      maximumFractionDigits: d == null ? 2 : d
    });
  }
  function safeWilson(k, n) {
    if (window.SP && typeof window.SP.wilson === 'function') {
      try { return window.SP.wilson(k, n); } catch (e) {}
    }
    if (!n) return [0, 0];
    var p = k / n, z = 1.96;
    var den = 1 + (z * z) / n;
    var centre = (p + (z * z) / (2 * n)) / den;
    var margin = (z * Math.sqrt((p * (1 - p)) / n + (z * z) / (4 * n * n))) / den;
    return [Math.max(0, centre - margin), Math.min(1, centre + margin)];
  }
  function pct1(x) { return (Number(x) * 100).toFixed(1).replace('.', ',') + '%'; }
  function int(n) { return Number(n).toLocaleString('pt-BR'); }
  function moneySmart(n) {
    if (n >= 1) return safeMoney(n, 2);
    if (n >= 0.01) return safeMoney(n, 4);
    return safeMoney(n, 8);
  }
  function ensure(n) {
    if (!state.int[n]) state.int[n] = SLIDES[n - 1].init();
    if (n === 12 && (!Array.isArray(state.int[n].checks) || state.int[n].checks.length !== 6)) {
      state.int[n].checks = [false, false, false, false, false, false];
    }
    return state.int[n];
  }

  /* ---------------- Slide 01 ---------------- */
  function getS1Cases() {
    if (DATA.s1) return DATA.s1;
    var rows = window.SP_DATA && Array.isArray(window.SP_DATA.rows) ? window.SP_DATA.rows : [];
    var wrong = rows.filter(function (r) {
      return r && r.split === 'dev' && r.pred && r.pred.v1 && r.pred.v1 !== r.true;
    });
    var picked = [];
    ['015', '033', '043'].forEach(function (id) {
      var hit = wrong.filter(function (r) { return String(r.id) === id; })[0];
      if (hit && picked.indexOf(hit) < 0) picked.push(hit);
    });
    wrong.forEach(function (r) { if (picked.length < 3 && picked.indexOf(r) < 0) picked.push(r); });
    if (!picked.length) {
      picked = [
        { text: 'opa', pred: 'outros', truth: 'saudacao', note: 'Curto ou ambíguo demais; o modelo forçou uma classe em vez de abster.' },
        { text: 'como funciona a garantia?', pred: 'status_pedido', truth: 'duvida_produto', note: 'Fronteira: pergunta de processo tratada como ação.' },
        { text: 'como faço para cancelar minha assinatura?', pred: 'status_pedido', truth: 'duvida_produto', note: 'Hard negative: a palavra-chave puxou a classe errada.' }
      ];
    }
    DATA.s1 = picked.slice(0, 3).map(function (r) {
      return { text: r.text, pred: r.pred && r.pred.v1 ? r.pred.v1 : r.pred, truth: r.truth || r.true, note: r.note };
    });
    return DATA.s1;
  }

  function renderS1() {
    var st = ensure(1);
    var cases = getS1Cases();
    var wrap = $('#rz-s1-cases');
    var out = $('#rz-s1-out');
    if (!wrap || !out) return;
    wrap.innerHTML = cases.map(function (c, i) {
      return '<button class="rz-btn rz-btn-sm' + (i === st.caseIdx ? ' is-active' : '') + '" type="button" data-rz-action="case" data-value="' + i + '" aria-pressed="' + (i === st.caseIdx) + '">Caso 0' + (i + 1) + '</button>';
    }).join('');
    var c = cases[clamp(st.caseIdx, 0, cases.length - 1)];
    var wrong = c.pred !== c.truth;
    out.innerHTML =
      '<div class="rz-kv"><span>Mensagem</span><div>' + esc(c.text) + '</div></div>' +
      '<div class="rz-kv"><span>Predição v1</span><div class="mono">' + esc(c.pred) + '</div></div>' +
      '<div class="rz-kv"><span>Gabarito</span><div class="mono rz-accent">' + esc(c.truth) + '</div></div>' +
      '<div class="rz-verdict ' + (wrong ? 'is-bad' : 'is-good') + '"><b>' + (wrong ? 'Falha da v1' : 'Acerto da v1') + '</b>' +
      esc(c.note || (wrong ? 'A predição não corresponde à ação esperada.' : 'Predição alinhada ao gabarito.')) + '</div>';
  }

  /* ---------------- Slide 02 ---------------- */
  function renderS2() {
    var st = ensure(2);
    var wrap = $('#rz-s2-chips');
    var out = $('#rz-s2-out');
    if (!wrap || !out) return;
    wrap.innerHTML = LABELS.map(function (label) {
      return '<button class="rz-btn rz-btn-sm' + (st.selectedLabel === label ? ' is-active' : '') + '" type="button" data-rz-action="label" data-value="' + label + '" aria-pressed="' + (st.selectedLabel === label) + '">' + label + '</button>';
    }).join('');
    if (!st.selectedLabel) { out.innerHTML = ''; return; }
    var correct = st.selectedLabel === 'falar_humano';
    var pos = PRIORITY.indexOf(st.selectedLabel) + 1;
    var above = PRIORITY.slice(0, pos - 1);
    var msg = correct
      ? 'falar_humano está no topo da cadeia. Mesmo com “cancelar” na frase, o pedido explícito por atendente humano vence. v2 (+ Definições) levou o dev de 67,0% a 83,0%.'
      : st.selectedLabel + ' ocupa a ' + pos + 'ª posição. Acima dele: ' + (above.length ? above.join(' > ') : 'ninguém') + '. A mensagem pede atendimento humano explícito; o label obrigatório é falar_humano.';
    out.innerHTML = '<div class="rz-verdict ' + (correct ? 'is-good' : 'is-bad') + '"><b>' + (correct ? 'Correto' : 'Incorreto') + '</b>' + esc(msg) + '</div>';
  }

  /* ---------------- Slide 03 ---------------- */
  function renderS3() {
    var st = ensure(3);
    var list = $('#rz-s3-list');
    var score = $('#rz-s3-score');
    var out = $('#rz-s3-out');
    if (!list || !score || !out) return;
    list.innerHTML = st.order.map(function (id, i) {
      var b = S3_BLOCKS[id];
      return '<li data-block="' + id + '">' +
        '<span class="rz-block-code">' + b.code + '</span>' +
        '<span class="rz-block-label">' + esc(b.label) + '</span>' +
        '<button class="rz-btn rz-btn-sm rz-icon-btn" type="button" data-rz-action="move" data-index="' + i + '" data-dir="-1" aria-label="Mover ' + esc(b.label) + ' para cima"' + (i === 0 ? ' disabled' : '') + '>↑</button>' +
        '<button class="rz-btn rz-btn-sm rz-icon-btn" type="button" data-rz-action="move" data-index="' + i + '" data-dir="1" aria-label="Mover ' + esc(b.label) + ' para baixo"' + (i === st.order.length - 1 ? ' disabled' : '') + '>↓</button>' +
        '</li>';
    }).join('');
    var ok1 = st.order[0] === 'definicoes';
    var ok2 = st.order[2] === 'entrada' && st.order[3] === 'contrato';
    var ok3 = st.order[3] === 'contrato';
    var flags = [[ok1, 'definições no topo'], [ok2, 'entrada antes do contrato'], [ok3, 'contrato no fim']];
    score.innerHTML = flags.map(function (f) {
      return '<span class="rz-tag"' + (f[0] ? ' style="border-color:var(--accent);color:var(--accent-text)"' : '') + '>' + (f[0] ? 'OK' : 'PENDENTE') + ' · ' + f[1] + '</span>';
    }).join('');
    if (ok1 && ok2 && ok3) {
      out.innerHTML = '<div class="rz-verdict is-good"><b>Estrutura canônica</b>Definições e regras no topo (prefixo estável), exemplos no meio, entrada delimitada e contrato colado ao fim. Legível, auditável e cacheável.</div>';
    } else {
      out.innerHTML = '<div class="rz-verdict is-bad"><b>Ajuste a ordem</b>O contrato precisa fechar o prompt, depois da mensagem. Definições e regras vêm antes dos exemplos. Estrutura não promete ganho de acurácia sozinha.</div>';
    }
  }

  /* ---------------- Slide 04 ---------------- */
  function decorateRule(text, mode) {
    var out = esc(text);
    if (mode === 'negativa') return out.replace(/(Não|não|nunca|Evite)/g, '<span class="rz-neg">$1</span>');
    return out.replace(/\bSE\b/g, '<span class="rz-pos">SE</span>').replace(/ENTÃO/g, '<span class="rz-pos">ENTÃO</span>');
  }

  function renderS4() {
    var st = ensure(4);
    var rule = S4_RULES[st.ruleIdx];
    var fronts = $('#rz-s4-frontiers');
    var modes = $('#rz-s4-modes');
    var text = $('#rz-s4-text');
    var meta = $('#rz-s4-meta');
    var out = $('#rz-s4-out');
    if (!fronts || !modes || !text || !meta || !out) return;
    fronts.innerHTML = S4_RULES.map(function (r, i) {
      return '<button class="rz-btn rz-btn-sm' + (i === st.ruleIdx ? ' is-active' : '') + '" type="button" data-rz-action="frontier" data-value="' + i + '" aria-pressed="' + (i === st.ruleIdx) + '">' + esc(r.name) + '</button>';
    }).join('');
    modes.innerHTML = [['negativa', 'Negativa prolixa'], ['positiva', 'Positiva atômica']].map(function (m) {
      return '<button class="rz-btn rz-btn-sm' + (st.mode === m[0] ? ' is-active' : '') + '" type="button" data-rz-action="mode" data-value="' + m[0] + '" aria-pressed="' + (st.mode === m[0]) + '">' + m[1] + '</button>';
    }).join('');
    var tokNeg = safeTokens(rule.neg);
    var tokPos = safeTokens(rule.pos);
    var delta = tokNeg - tokPos;
    var diff = tokNeg ? Math.round((delta / tokNeg) * 100) : 0;
    text.innerHTML = '<div class="rz-pre" style="max-height:none">' + decorateRule(st.mode === 'negativa' ? rule.neg : rule.pos, st.mode) + '</div>';
    meta.innerHTML =
      '<span class="rz-tag">negativa ~' + tokNeg + ' tokens</span>' +
      '<span class="rz-tag">positiva ~' + tokPos + ' tokens</span>' +
      '<span class="rz-tag" style="border-color:var(--accent);color:var(--accent-text)">' + (delta >= 0 ? '-' : '+') + Math.abs(diff) + '% tokens</span>';
    out.innerHTML = st.mode === 'negativa'
      ? '<div class="rz-verdict is-bad"><b>Alerta</b>Múltiplas negações (“não classifique… se não… não deixe de…”) custam tokens e confundem um modelo compacto. A condição fica difícil de verificar.</div>'
      : '<div class="rz-verdict is-good"><b>Ótimo</b>Condição SE → ENTÃO direta, atômica e verificável. Menos tokens de entrada e fronteira inequívoca entre classes vizinhas.</div>';
  }

  /* ---------------- Slide 05 ---------------- */
  function renderS5() {
    var st = ensure(5);
    var pack = S5_PACKS[st.pack] || S5_PACKS.A;
    var wrap = $('#rz-s5-packs');
    var list = $('#rz-s5-list');
    var meta = $('#rz-s5-meta');
    var out = $('#rz-s5-out');
    if (!wrap || !list || !meta || !out) return;
    wrap.innerHTML = ['A', 'B'].map(function (key) {
      return '<button class="rz-btn rz-btn-sm' + (st.pack === key ? ' is-active' : '') + '" type="button" data-rz-action="pack" data-value="' + key + '" aria-pressed="' + (st.pack === key) + '">' + esc(S5_PACKS[key].name) + '</button>';
    }).join('');
    list.innerHTML = pack.items.map(function (item, i) {
      return '<li><span class="rz-block-code">' + String(i + 1).padStart(2, '0') + '</span><span class="rz-block-label">' + esc(item.text) + ' <span class="rz-mono rz-muted">→ ' + esc(item.label) + '</span></span></li>';
    }).join('');
    var tokens = safeTokens(pack.items.map(function (x) { return x.text; }).join(' '));
    meta.innerHTML =
      '<div class="rz-cols-2"><div class="rz-stat"><b>' + pack.dev + '</b><span>dev</span></div><div class="rz-stat"><b>' + pack.test + '</b><span>test</span></div></div>' +
      '<div class="rz-bar-track" style="margin-top:6px"><div class="rz-bar-fill is-accent" style="width:' + pack.width + '%"></div></div>' +
      '<p class="rz-note">' + tokens + ' tokens de exemplos · ' + esc(pack.note) + ' · ' + esc(pack.p) + '</p>';
    out.innerHTML = st.pack === 'B'
      ? '<div class="rz-verdict is-good"><b>Eficiente (v3)</b>Com 5 exemplos focados nas fronteiras reais, o dev sobe de 83,0% para 89,8% (+6 corrigidos, 0 quebrados, p≈0,031) e o test chega a 90,3%.</div>'
      : '<div class="rz-verdict is-bad"><b>Ineficiente</b>Gasta mais tokens repetindo casos triviais que a v2 já acertava, sem resolver as colisões entre status_pedido, reclamacao e falar_humano.</div>';
  }

  /* ---------------- Slide 06 ---------------- */
  function validateOutput(raw) {
    var text = String(raw).trim();
    if (LABELS.indexOf(text) >= 0) return { ok: true, label: text, kind: 'label' };
    try {
      var obj = JSON.parse(text);
      if (obj && typeof obj.intent === 'string' && LABELS.indexOf(obj.intent) >= 0) {
        return { ok: true, label: obj.intent, kind: 'json' };
      }
    } catch (e) {}
    return { ok: false, label: 'outros', kind: 'invalid' };
  }

  function renderS6() {
    var st = ensure(6);
    var payload = S6_PAYLOADS[clamp(st.rawIdx, 0, S6_PAYLOADS.length - 1)];
    var inputs = $('#rz-s6-inputs');
    var raw = $('#rz-s6-raw');
    var pipe = $('#rz-s6-pipe');
    var out = $('#rz-s6-out');
    if (!inputs || !raw || !pipe || !out) return;
    inputs.innerHTML = S6_PAYLOADS.map(function (p, i) {
      return '<button class="rz-btn rz-btn-sm' + (i === st.rawIdx ? ' is-active' : '') + '" type="button" data-rz-action="payload" data-value="' + i + '" aria-pressed="' + (i === st.rawIdx) + '">' + (i + 1) + ' · ' + esc(p.label) + '</button>';
    }).join('');
    var v = validateOutput(payload.raw);
    raw.textContent = payload.raw;
    var steps = [
      ['1. Resposta bruta', 'done'],
      ['2. Validador', v.ok ? 'done' : 'fail'],
      ['3. Retry (máx 1)', v.ok ? 'skip' : 'fail'],
      ['4. Fila final', v.ok ? 'done' : 'fail']
    ];
    pipe.innerHTML = steps.map(function (s) {
      var detail = s[0].indexOf('Retry') >= 0 ? (v.ok ? 'não usado' : '1 retry falhou') : (s[0].indexOf('Fila') >= 0 ? (v.ok ? v.label : 'outros') : (s[0].indexOf('Validador') >= 0 ? (v.ok ? 'ok' : 'falhou') : 'recebida'));
      return '<li class="is-' + s[1] + '"><b>' + s[0] + '</b>' + esc(detail) + '</li>';
    }).join('');
    var tok = safeTokens(payload.raw);
    if (v.ok) {
      out.innerHTML = '<div class="rz-verdict is-good"><b>' + (v.kind === 'json' ? 'Passou com custo extra' : 'Passou de primeira') + '</b>' +
        (v.kind === 'json'
          ? 'JSON válido e label dentro do enum: ' + v.label + '. Mas as chaves e aspas custam tokens de formatação sem ganho de acurácia.'
          : 'Label plano dentro do enum: ' + v.label + '. Zero overhead de chaves, 0 retries, roteado para ' + v.label + '.') +
        ' <span class="rz-mono">(' + tok + ' tokens)</span></div>';
    } else {
      out.innerHTML = '<div class="rz-verdict is-bad"><b>' + (payload.raw.indexOf('{') >= 0 ? 'Falha sintática' : 'Violação de enum') + '</b>' +
        (payload.raw.indexOf('{') >= 0
          ? 'JSON truncado falhou no parse. O código dispara no máximo 1 retry; se persistir inválido, aplica fallback para outros.'
          : 'Label fora das 7 classes permitidas. Após 1 tentativa de correção sem sucesso, o chamado é contido em outros.') +
        ' <span class="rz-mono">(' + tok + ' tokens por tentativa)</span></div>';
    }
  }

  /* ---------------- Slide 07 ---------------- */
  function renderS7() {
    var st = ensure(7);
    var temp = $('#rz-s7-temp');
    var max = $('#rz-s7-max');
    var stop = $('#rz-s7-stop');
    var config = $('#rz-s7-config');
    var output = $('#rz-s7-output');
    var out = $('#rz-s7-out');
    if (!temp || !max || !stop || !config || !output || !out) return;
    temp.innerHTML = [[0, '0 · greedy'], [0.7, '0.7 · amostragem']].map(function (v) {
      return '<button class="rz-btn rz-btn-sm' + (st.temp === v[0] ? ' is-active' : '') + '" type="button" data-rz-action="temp" data-value="' + v[0] + '" aria-pressed="' + (st.temp === v[0]) + '">' + v[1] + '</button>';
    }).join('');
    max.innerHTML = [[8, '8 tokens'], [200, '200 tokens']].map(function (v) {
      return '<button class="rz-btn rz-btn-sm' + (st.maxTokens === v[0] ? ' is-active' : '') + '" type="button" data-rz-action="maxtokens" data-value="' + v[0] + '" aria-pressed="' + (st.maxTokens === v[0]) + '">' + v[1] + '</button>';
    }).join('');
    stop.innerHTML = [[true, '["\\n"] ativo'], [false, 'sem stop']].map(function (v) {
      return '<button class="rz-btn rz-btn-sm' + (st.stopSeq === v[0] ? ' is-active' : '') + '" type="button" data-rz-action="stop" data-value="' + v[0] + '" aria-pressed="' + (st.stopSeq === v[0]) + '">' + v[1] + '</button>';
    }).join('');
    var cfg = {
      temperature: st.temp,
      topP: 0.9,
      maxTokens: st.maxTokens,
      stopSequences: st.stopSeq ? ['\\n'] : []
    };
    config.textContent = JSON.stringify(cfg, null, 2);
    var canonical = st.temp === 0 && st.maxTokens === 8 && st.stopSeq;
    var textOut, outTokens, feedback;
    if (st.maxTokens === 200 && !st.stopSeq) {
      textOut = 'reclamacao\nExplicação: O cliente demonstra insatisfação com o prazo...';
      outTokens = 42;
      feedback = '<div class="rz-verdict is-bad"><b>Desperdício detectado</b>O modelo tenta explicar, você paga até 200 tokens de saída e quebra o parser de linha única.</div>';
    } else if (st.maxTokens === 8 && !st.stopSeq) {
      textOut = 'reclamacao\nJust';
      outTokens = 8;
      feedback = '<div class="rz-verdict is-bad"><b>Corte por maxTokens</b>Sem stop sequence, o modelo continua a frase e o teto de 8 tokens corta no meio. O contrato não fica limpo.</div>';
    } else if (st.temp !== 0) {
      textOut = 'reclamacao';
      outTokens = 2;
      feedback = '<div class="rz-verdict is-bad"><b>Risco de variância</b>Temperature 0.7 introduz sorteio em fronteiras próximas (ex.: 52% status_pedido vs 48% reclamacao). O classificador não precisa disso.</div>';
    } else if (!canonical) {
      textOut = 'reclamacao';
      outTokens = 2;
      feedback = '<div class="rz-verdict is-bad"><b>Configuração incompleta</b>Falta travar maxTokens: 8. Com 200 tokens, o modelo pode continuar explicando depois do label.</div>';
    } else {
      textOut = 'reclamacao';
      outTokens = 2;
      feedback = '<div class="rz-verdict is-good"><b>Configuração canônica</b>O modelo emite apenas o label e para na primeira quebra de linha. Custo mínimo de saída ($0,24 / 1M).</div>';
    }
    output.textContent = textOut;
    var cost = outTokens / 1e6 * 0.24;
    out.innerHTML = feedback + '<p class="rz-note">' + outTokens + ' tokens de saída · ' + safeMoney(cost, 8) + ' por chamada · greedy ≠ determinismo absoluto.</p>';
  }

  /* ---------------- Slide 08 ---------------- */
  function macroF1(split, version) {
    if (!window.SP_DATA || !Array.isArray(window.SP_DATA.rows)) return null;
    var rows = window.SP_DATA.rows.filter(function (r) { return r.split === split && r.pred && r.pred[version]; });
    if (!rows.length) return null;
    var f1 = [];
    LABELS.forEach(function (label) {
      var tp = 0, fp = 0, fn = 0;
      rows.forEach(function (r) {
        var pred = r.pred[version];
        if (r.true === label && pred === label) tp += 1;
        else if (r.true !== label && pred === label) fp += 1;
        else if (r.true === label && pred !== label) fn += 1;
      });
      if (tp + fn > 0) {
        var precision = tp / (tp + fp || 1);
        var recall = tp / (tp + fn || 1);
        f1.push(precision + recall ? (2 * precision * recall) / (precision + recall) : 0);
      }
    });
    return f1.length ? f1.reduce(function (a, b) { return a + b; }, 0) / f1.length : null;
  }

  function topConfusions(split, version) {
    if (!window.SP_DATA || !Array.isArray(window.SP_DATA.rows)) return [];
    var map = {};
    window.SP_DATA.rows.forEach(function (r) {
      if (r.split !== split || !r.pred || !r.pred[version]) return;
      var pred = r.pred[version];
      if (pred === r.true) return;
      var key = r.true + ' → ' + pred;
      map[key] = (map[key] || 0) + 1;
    });
    return Object.keys(map).map(function (k) { return [k, map[k]]; }).sort(function (a, b) { return b[1] - a[1]; }).slice(0, 3);
  }

  function renderS8() {
    var st = ensure(8);
    var versions = $('#rz-s8-versions');
    var splits = $('#rz-s8-splits');
    var metrics = $('#rz-s8-metrics');
    var matrix = $('#rz-s8-matrix');
    var out = $('#rz-s8-out');
    if (!versions || !splits || !metrics || !matrix || !out) return;
    versions.innerHTML = ['v1', 'v2', 'v3', 'v4'].map(function (v) {
      return '<button class="rz-btn rz-btn-sm' + (st.version === v ? ' is-active' : '') + '" type="button" data-rz-action="version" data-value="' + v + '" aria-pressed="' + (st.version === v) + '">' + v + '</button>';
    }).join('');
    splits.innerHTML = [['dev', 'Dev · 88'], ['test', 'Test · 62']].map(function (s) {
      return '<button class="rz-btn rz-btn-sm' + (st.split === s[0] ? ' is-active' : '') + '" type="button" data-rz-action="split" data-value="' + s[0] + '" aria-pressed="' + (st.split === s[0]) + '">' + s[1] + '</button>';
    }).join('');
    var hits = HITS[st.split][st.version];
    var total = TOTAL[st.split];
    var acc = hits / total;
    var ci = safeWilson(hits, total);
    var f1 = macroF1(st.split, st.version);
    metrics.innerHTML =
      '<div class="rz-row-between"><div><div class="rz-mini">acurácia oficial</div><div class="rz-big-num">' + ACC[st.split][st.version] + '</div></div><div class="rz-mono">' + hits + ' / ' + total + ' acertos</div></div>' +
      '<div class="rz-bar-track" style="margin-top:7px"><div class="rz-bar-fill is-accent" style="width:' + (acc * 100).toFixed(1) + '%"></div><div class="rz-range" style="left:' + (ci[0] * 100).toFixed(1) + '%;width:' + ((ci[1] - ci[0]) * 100).toFixed(1) + '%"></div></div>' +
      '<p class="rz-note">IC 95% de Wilson: ' + pct1(ci[0]) + ' – ' + pct1(ci[1]) + ' · macro-F1 ' + (f1 == null ? '—' : f1.toFixed(2).replace('.', ',')) + '</p>';
    var conf = topConfusions(st.split, st.version);
    matrix.innerHTML = conf.length
      ? '<div style="overflow-x:auto"><table class="rz-table"><thead><tr><th>confusão real → predito</th><th class="num">casos</th></tr></thead><tbody>' +
        conf.map(function (c) { return '<tr><td class="mono">' + esc(c[0]) + '</td><td class="num">' + c[1] + '</td></tr>'; }).join('') +
        '</tbody></table></div>'
      : '<p class="rz-note">Sem confusões nesta combinação.</p>';
    out.innerHTML = st.split === 'dev'
      ? '<p class="rz-note">Partição de trabalho: leia cada erro, monte a matriz e formule uma hipótese. A acurácia é oficial e congelada; o macro-F1 é calculado dos casos.</p>'
      : '<p class="rz-note">Partição cega: 62,9% → 80,6% → 90,3% → 93,5%. Se o ganho generalizou, ótimo. Se você ajustar regras olhando aqui, o termômetro morre.</p>';
  }

  /* ---------------- Slide 09 ---------------- */
  var S9_TRANSITIONS = {
    v1_v2: { label: 'v1 → v2 (+ Definições)', from: 'v1', to: 'v2', fromHits: 39, toHits: 50, fixed: 11, broken: 0, p: '≈ 0,001', sig: true, devFrom: '67,0%', devTo: '83,0%', testFrom: '62,9%', testTo: '80,6%' },
    v2_v3: { label: 'v2 → v3 (+ Few-shot)', from: 'v2', to: 'v3', fromHits: 50, toHits: 56, fixed: 6, broken: 0, p: '≈ 0,031', sig: true, devFrom: '83,0%', devTo: '89,8%', testFrom: '80,6%', testTo: '90,3%' },
    v3_v4: { label: 'v3 → v4 (Ajuste fino)', from: 'v3', to: 'v4', fromHits: 56, toHits: 58, fixed: 3, broken: 1, p: '= 0,625 (NS)', sig: false, devFrom: '89,8%', devTo: '93,2%', testFrom: '90,3%', testTo: '93,5%' }
  };

  function renderS9() {
    var st = ensure(9);
    var t = S9_TRANSITIONS[st.transition] || S9_TRANSITIONS.v1_v2;
    var buttons = $('#rz-s9-transitions');
    var matrix = $('#rz-s9-matrix');
    var verdict = $('#rz-s9-verdict');
    var out = $('#rz-s9-out');
    if (!buttons || !matrix || !verdict || !out) return;
    buttons.innerHTML = Object.keys(S9_TRANSITIONS).map(function (key) {
      return '<button class="rz-btn rz-btn-sm' + (st.transition === key ? ' is-active' : '') + '" type="button" data-rz-action="transition" data-value="' + key + '" aria-pressed="' + (st.transition === key) + '">' + esc(S9_TRANSITIONS[key].label) + '</button>';
    }).join('');
    var bothCorrect = t.fromHits - t.broken;
    var bothWrong = TOTAL.test - bothCorrect - t.fixed - t.broken;
    matrix.innerHTML =
      '<table class="rz-matrix"><thead><tr><th></th><th>' + t.to + ' acertou</th><th>' + t.to + ' errou</th></tr></thead><tbody>' +
      '<tr><th>' + t.from + ' acertou</th><td>' + bothCorrect + '</td><td' + (t.broken ? ' class="is-accent"' : '') + '>' + t.broken + '</td></tr>' +
      '<tr><th>' + t.from + ' errou</th><td' + (t.fixed ? ' class="is-accent"' : '') + '>' + t.fixed + '</td><td>' + bothWrong + '</td></tr>' +
      '</tbody></table>';
    verdict.innerHTML =
      '<div class="rz-cols-2"><div class="rz-stat"><b>' + t.fixed + '</b><span>corrigidos</span></div><div class="rz-stat is-accent"><b>' + t.broken + '</b><span>quebrados</span></div></div>' +
      '<div class="rz-verdict ' + (t.sig ? 'is-good' : 'is-bad') + '"><b>' + (t.sig ? 'Promover' : 'Parar') + '</b>' +
      (t.sig
        ? 'Ganho estatisticamente significativo (p' + t.p + '). A mudança corrigiu sem quebrar; vire a nova baseline.'
        : '3 corrigidos contra 1 quebrado está dentro do ruído amostral. O loop manual atingiu o platô do dataset.') +
      '</div>';
    out.innerHTML = '<p class="rz-note">McNemar no <b>test (62 casos)</b>: ' + t.testFrom + ' → ' + t.testTo + '. No dev: ' + t.devFrom + ' → ' + t.devTo + '. O teste é pareado nos mesmos casos; não compare proporções independentes.</p>';
  }

  /* ---------------- Slide 10 ---------------- */
  function renderS10() {
    var st = ensure(10);
    var wrap = $('#rz-s10-scenarios');
    var out = $('#rz-s10-out');
    if (!wrap || !out) return;
    wrap.innerHTML = S10_SCENARIOS.map(function (s) {
      return '<button class="rz-btn" style="justify-content:flex-start;text-align:left;min-height:auto;padding:8px 9px" role="radio" aria-checked="' + (st.scenario === s.id) + '" data-rz-action="scenario" data-value="' + s.id + '">' + esc(s.title) + '</button>';
    }).join('');
    var current = S10_SCENARIOS.filter(function (s) { return s.id === st.scenario; })[0] || S10_SCENARIOS[0];
    out.innerHTML = '<div class="rz-verdict ' + (current.tone === 'good' ? 'is-good' : 'is-bad') + '"><b>' + esc(current.status) + ' · ' + esc(current.tool) + '</b>' + esc(current.reason) + '</div>';
  }

  /* ---------------- Slide 11 ---------------- */
  function renderS11() {
    var st = ensure(11);
    var models = $('#rz-s11-models');
    var volumes = $('#rz-s11-volumes');
    var cache = $('#rz-s11-cache');
    var out = $('#rz-s11-out');
    if (!models || !volumes || !cache || !out) return;
    models.innerHTML = Object.keys(MODELS).map(function (key) {
      var m = MODELS[key];
      return '<button class="rz-btn rz-btn-sm' + (st.model === key ? ' is-active' : '') + '" type="button" data-rz-action="model" data-value="' + key + '" aria-pressed="' + (st.model === key) + '">' + m.name + '</button>';
    }).join('');
    volumes.innerHTML = [10000, 100000, 1000000].map(function (v) {
      return '<button class="rz-btn rz-btn-sm' + (st.volume === v ? ' is-active' : '') + '" type="button" data-rz-action="volume" data-value="' + v + '" aria-pressed="' + (st.volume === v) + '">' + int(v) + ' req' + '</button>';
    }).join('');
    cache.innerHTML = [[false, 'Sem cache'], [true, 'Com cache']].map(function (v) {
      return '<button class="rz-btn rz-btn-sm' + (st.cache === v[0] ? ' is-active' : '') + '" type="button" data-rz-action="cache" data-value="' + v[0] + '" aria-pressed="' + (st.cache === v[0]) + '">' + v[1] + '</button>';
    }).join('');
    var m = MODELS[st.model] || MODELS.lite;
    var vol = st.volume;
    var inCost = vol * (1200 / 1e6) * m.in;
    var outCost = vol * (8 / 1e6) * m.out;
    var total = inCost + outCost;
    var cached = vol * (((1000 * 0.10 + 200) / 1e6) * m.in + (8 / 1e6) * m.out);
    var finalTotal = st.cache ? cached : total;
    var saved = total - cached;
    var pctSaved = total ? Math.round((saved / total) * 100) : 0;
    out.innerHTML =
      '<div class="rz-row-between" style="margin-top:10px"><div><div class="rz-mini">custo mensal simulado</div><div class="rz-big-num">' + moneySmart(finalTotal) + '</div></div><div class="rz-mono">' + int(vol) + ' req/mês</div></div>' +
      '<div class="rz-kv"><span>Entrada</span><div>' + safeMoney(st.cache ? vol * ((1000 * 0.10 + 200) / 1e6) * m.in : inCost, 2) + ' · 1.200 tokens/req (1.000 estáticos + 200 dinâmicos)</div></div>' +
      '<div class="rz-kv"><span>Saída</span><div>' + safeMoney(outCost, 2) + ' · 8 tokens/req</div></div>' +
      '<div class="rz-kv"><span>Por request</span><div>' + safeMoney(finalTotal / vol, 8) + ' por chamada</div></div>' +
      '<div class="rz-kv"><span>Cache</span><div>' + (st.cache ? 'economia de ' + safeMoney(saved, 2) + ' (' + pctSaved + '%) · premissa didática de leitura a 10% do input' : 'desligado') + '</div></div>' +
      '<p class="rz-note">Fórmula: volume × ((1.200 / 1M) × preço_in + (8 / 1M) × preço_out). Cache exige prefixo ≥ 1.000 tokens, TTL 5 min e até 4 checkpoints. Guardrails cobram por 1.000 chars/política. EOL do Lite 1.0 após dez/2025 → Nova 2 Lite.</p>' +
      (st.model === 'pro' ? '<p class="rz-note is-accent">Nova Pro custa mais de 13x o Lite no input. Para 7 intenções, um modelo enxuto bem instruído evita esse gasto.</p>' : '');
  }

  /* ---------------- Slide 12 ---------------- */
  function renderS12List() {
    var st = ensure(12);
    var wrap = $('#rz-s12-checks');
    if (!wrap) return;
    wrap.innerHTML = S12_ITEMS.map(function (text, i) {
      return '<label class="rz-check"><input type="checkbox" data-rz-check="' + i + '"' + (st.checks[i] ? ' checked' : '') + '><span>' + esc(text) + '</span></label>';
    }).join('');
  }

  function syncS12() {
    var st = ensure(12);
    var done = st.checks.filter(Boolean).length;
    var count = $('#rz-s12-count');
    var bar = $('#rz-s12-bar');
    var out = $('#rz-s12-out');
    if (!count || !bar || !out) return;
    count.textContent = done + ' / 6';
    bar.style.width = (done / 6 * 100) + '%';
    out.innerHTML = done === 6
      ? '<div class="rz-verdict is-good"><b>Prontidão 100%</b>Taxonomia, estrutura, exemplos, inferência, avaliação e produção estão cobertos. Copie o template e leve para o seu projeto.</div>'
      : '<p class="rz-note">Prontidão em andamento: revise os itens restantes antes do deploy.</p>';
  }

  function renderS12() {
    renderS12List();
    syncS12();
  }

  function copyText(text, done) {
    var finished = false;
    function finish(ok) { if (finished) return; finished = true; done(ok); }
    function fallback() {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.left = '-9999px';
      ta.style.top = '0';
      document.body.appendChild(ta);
      ta.select();
      var ok = false;
      try { ok = document.execCommand('copy'); } catch (e) {}
      document.body.removeChild(ta);
      finish(ok);
    }
    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      navigator.clipboard.writeText(text).then(function () { finish(true); }, fallback);
    } else {
      fallback();
    }
  }

  /* ---------------- Engine ---------------- */
  var RENDERERS = {
    1: renderS1, 2: renderS2, 3: renderS3, 4: renderS4, 5: renderS5, 6: renderS6,
    7: renderS7, 8: renderS8, 9: renderS9, 10: renderS10, 11: renderS11, 12: renderS12
  };

  function renderInteraction(n) {
    if (RENDERERS[n]) RENDERERS[n]();
  }

  function parseHash() {
    var m = /^#\/(\d{1,2})$/.exec(window.location.hash);
    if (!m) return null;
    var n = parseInt(m[1], 10);
    if (!n || n < 1 || n > 12) return null;
    return n;
  }

  function syncHash(n) {
    var target = '#/' + n;
    if (window.location.hash === target) return;
    try { window.history.replaceState(null, '', target); }
    catch (e) { window.location.hash = target; }
  }

  function updateChrome() {
    var fill = $('#rz-bar-fill');
    if (fill) fill.style.width = (state.slide / 12 * 100) + '%';
    var counter = $('#rz-counter');
    if (counter) counter.textContent = String(state.slide).padStart(2, '0') + ' / 12';
    var dots = $('#rz-beats');
    if (dots) {
      var html = '';
      for (var i = 1; i <= state.maxBeat; i += 1) {
        html += '<span class="rz-dot' + (i <= state.beat ? ' is-on' : '') + '"></span>';
      }
      dots.innerHTML = html;
    }
    var prev = $('#rz-prev');
    var next = $('#rz-next');
    var step = $('#rz-step');
    var auto = $('#rz-auto');
    if (prev) prev.disabled = state.slide === 1 && state.beat === 1;
    if (next) next.disabled = state.slide === 12;
    if (step) {
      step.disabled = state.slide === 12 && state.beat === state.maxBeat;
      step.textContent = state.beat < state.maxBeat ? 'Próximo beat →' : (state.slide < 12 ? 'Próximo slide →' : 'Fim');
    }
    if (auto) {
      auto.disabled = state.reduced;
      auto.setAttribute('aria-pressed', state.autoplay ? 'true' : 'false');
      auto.classList.toggle('is-active', state.autoplay);
      auto.textContent = state.autoplay ? 'Pausar' : 'Autoplay';
    }
  }

  function render() {
    var meta = SLIDES[state.slide - 1];
    state.maxBeat = meta.beats;
    state.beat = clamp(state.beat, 1, meta.beats);
    $$('.rz-slide').forEach(function (sec) {
      var on = Number(sec.getAttribute('data-slide')) === state.slide;
      sec.classList.toggle('is-active', on);
      sec.setAttribute('aria-hidden', on ? 'false' : 'true');
      if (on) {
        $$('.rz-beat', sec).forEach(function (beat) {
          var n = Number(beat.getAttribute('data-beat'));
          beat.classList.toggle('is-visible', state.reduced || n <= state.beat);
        });
      }
    });
    updateChrome();
    renderInteraction(state.slide);
    saveSession();
  }

  function goToSlide(n, opts) {
    opts = opts || {};
    n = clamp(n, 1, 12);
    state.slide = n;
    ensure(n);
    state.beat = state.reduced ? SLIDES[n - 1].beats : 1;
    if (!opts.skipHash) syncHash(n);
    render();
    scheduleAutoplay();
  }

  function stepForward() {
    if (!state.reduced && state.beat < state.maxBeat) {
      state.beat += 1;
      render();
      scheduleAutoplay();
      return;
    }
    if (state.slide < 12) {
      goToSlide(state.slide + 1);
    } else {
      stopAutoplay();
    }
  }

  function stepBack() {
    if (state.beat > 1) {
      state.beat -= 1;
      render();
      scheduleAutoplay();
      return;
    }
    if (state.slide > 1) {
      goToSlide(state.slide - 1);
      state.beat = SLIDES[state.slide - 1].beats;
      render();
      scheduleAutoplay();
    }
  }

  function resetCurrent() {
    state.int[state.slide] = SLIDES[state.slide - 1].init();
    state.beat = 1;
    stopAutoplay();
    render();
  }

  function stopAutoplay() {
    state.autoplay = false;
    if (state.timer) { clearTimeout(state.timer); state.timer = null; }
    updateChrome();
  }

  function scheduleAutoplay() {
    if (state.timer) { clearTimeout(state.timer); state.timer = null; }
    if (!state.autoplay || state.reduced) return;
    var delay = state.beat < state.maxBeat ? 2500 : 3800;
    state.timer = setTimeout(function () {
      if (!state.autoplay) return;
      if (state.beat < state.maxBeat) {
        state.beat += 1;
        render();
        scheduleAutoplay();
      } else if (state.slide < 12) {
        stepForward();
      } else {
        stopAutoplay();
      }
    }, delay);
  }

  function toggleAutoplay() {
    if (state.reduced) return;
    state.autoplay = !state.autoplay;
    if (state.autoplay) scheduleAutoplay();
    else stopAutoplay();
    updateChrome();
  }

  function saveSession() {
    try {
      window.sessionStorage.setItem('sp.rz.v1', JSON.stringify({
        slide: state.slide, beat: state.beat, int: state.int
      }));
    } catch (e) {}
  }

  function loadSession() {
    try {
      var raw = window.sessionStorage.getItem('sp.rz.v1');
      if (!raw) return null;
      var obj = JSON.parse(raw);
      return obj && obj.slide ? obj : null;
    } catch (e) { return null; }
  }

  function isFormTarget(target) {
    return !!(target && target.closest && target.closest('input, textarea, select, [contenteditable="true"]'));
  }

  function isControlTarget(target) {
    return !!(target && target.closest && target.closest('button, a, [role="button"], [role="tab"], [role="radio"], [role="checkbox"]'));
  }

  function onKeydown(e) {
    if (e.defaultPrevented || e.ctrlKey || e.metaKey || e.altKey) return;
    if (isFormTarget(e.target)) return;
    var key = e.key;
    var control = isControlTarget(e.target);
    if (control && (key === ' ' || key === 'Spacebar')) return;
    if (control && e.target.closest('.rz-lab') && (key === 'ArrowLeft' || key === 'ArrowRight' || key === 'Home' || key === 'End')) return;
    if (key === 'ArrowRight' || key === ' ' || key === 'Spacebar') {
      e.preventDefault(); stepForward();
    } else if (key === 'ArrowLeft') {
      e.preventDefault(); stepBack();
    } else if (key === 'Home') {
      e.preventDefault(); goToSlide(1);
    } else if (key === 'End') {
      e.preventDefault(); goToSlide(12);
    } else if (key === 'p' || key === 'P') {
      e.preventDefault(); toggleAutoplay();
    } else if (key === 'r' || key === 'R') {
      e.preventDefault(); resetCurrent();
    }
  }

  function onDeckClick(e) {
    var el = e.target && e.target.closest ? e.target.closest('[data-rz-action]') : null;
    if (!el) return;
    var action = el.getAttribute('data-rz-action');
    if (state.autoplay) stopAutoplay();
    if (action === 'reset') { resetCurrent(); return; }
    var st = ensure(state.slide);

    if (action === 'case') {
      st.caseIdx = clamp(Number(el.getAttribute('data-value')), 0, 2);
      renderS1();
    } else if (action === 'label') {
      st.selectedLabel = el.getAttribute('data-value');
      renderS2();
    } else if (action === 'move') {
      var i = Number(el.getAttribute('data-index'));
      var dir = Number(el.getAttribute('data-dir'));
      var id = st.order[i];
      var j = i + dir;
      if (j < 0 || j >= st.order.length) return;
      st.order[i] = st.order[j];
      st.order[j] = id;
      renderS3();
      var again = $('#rz-s3-list [data-block="' + id + '"] [data-dir="' + dir + '"]');
      if (again) again.focus();
    } else if (action === 'frontier') {
      st.ruleIdx = clamp(Number(el.getAttribute('data-value')), 0, S4_RULES.length - 1);
      renderS4();
    } else if (action === 'mode') {
      st.mode = el.getAttribute('data-value') === 'positiva' ? 'positiva' : 'negativa';
      renderS4();
    } else if (action === 'pack') {
      st.pack = el.getAttribute('data-value') === 'B' ? 'B' : 'A';
      renderS5();
    } else if (action === 'payload') {
      st.rawIdx = clamp(Number(el.getAttribute('data-value')), 0, S6_PAYLOADS.length - 1);
      renderS6();
    } else if (action === 'temp') {
      st.temp = Number(el.getAttribute('data-value')) === 0.7 ? 0.7 : 0;
      renderS7();
    } else if (action === 'maxtokens') {
      st.maxTokens = Number(el.getAttribute('data-value')) === 8 ? 8 : 200;
      renderS7();
    } else if (action === 'stop') {
      st.stopSeq = el.getAttribute('data-value') === 'true';
      renderS7();
    } else if (action === 'preset') {
      st.temp = 0; st.maxTokens = 8; st.stopSeq = true;
      renderS7();
    } else if (action === 'version') {
      st.version = el.getAttribute('data-value');
      renderS8();
    } else if (action === 'split') {
      st.split = el.getAttribute('data-value') === 'test' ? 'test' : 'dev';
      renderS8();
    } else if (action === 'transition') {
      st.transition = el.getAttribute('data-value');
      renderS9();
    } else if (action === 'scenario') {
      st.scenario = el.getAttribute('data-value');
      renderS10();
    } else if (action === 'model') {
      st.model = el.getAttribute('data-value');
      renderS11();
    } else if (action === 'volume') {
      st.volume = Number(el.getAttribute('data-value')) || 100000;
      renderS11();
    } else if (action === 'cache') {
      st.cache = el.getAttribute('data-value') === 'true';
      renderS11();
    } else if (action === 'check-all') {
      st.checks = [true, true, true, true, true, true];
      renderS12();
    } else if (action === 'check-none') {
      st.checks = [false, false, false, false, false, false];
      renderS12();
    } else if (action === 'copy') {
      copyText(S12_TEMPLATE, function (ok) {
        if (ok && window.SP && typeof window.SP.toast === 'function') {
          window.SP.toast('Template canônico copiado!');
        } else {
          var out = $('#rz-s12-out');
          if (out) out.innerHTML = '<p class="rz-note is-accent">' + (ok ? 'Template copiado.' : 'Não foi possível copiar automaticamente; selecione o texto do template.') + '</p>';
        }
      });
    }
  }

  function onDeckChange(e) {
    var cb = e.target && e.target.closest ? e.target.closest('input[data-rz-check]') : null;
    if (!cb) return;
    var st = ensure(12);
    var i = Number(cb.getAttribute('data-rz-check'));
    if (i >= 0 && i < st.checks.length) {
      st.checks[i] = cb.checked;
      syncS12();
      saveSession();
    }
  }

  var swipeStart = null;

  function onPointerDown(e) {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    if (e.target && e.target.closest && e.target.closest('button, a, input, select, textarea, .rz-lab')) return;
    swipeStart = { x: e.clientX, y: e.clientY };
  }

  function onPointerUp(e) {
    if (!swipeStart) return;
    var dx = e.clientX - swipeStart.x;
    var dy = e.clientY - swipeStart.y;
    swipeStart = null;
    if (Math.abs(dx) >= 48 && Math.abs(dy) < 30) {
      if (dx < 0) stepForward();
      else stepBack();
    }
  }

  function onHashChange() {
    var n = parseHash();
    if (n && n !== state.slide) goToSlide(n, { skipHash: true });
    else if (!n) goToSlide(1);
  }

  function onVisibility() {
    if (document.hidden && state.autoplay) stopAutoplay();
  }

  function applyMotion() {
    state.reduced = !!state.motionQuery.matches;
    if (state.reduced) {
      state.beat = state.maxBeat;
      stopAutoplay();
      render();
    }
  }

  function init() {
    if (state.ready) return;
    state.ready = true;
    state.motionQuery = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
    state.reduced = !!(state.motionQuery && state.motionQuery.matches);

    var deck = $('#rz-deck');
    if (deck) {
      deck.addEventListener('click', onDeckClick);
      deck.addEventListener('change', onDeckChange);
      deck.addEventListener('pointerdown', onPointerDown, { passive: true });
      deck.addEventListener('pointerup', onPointerUp, { passive: true });
    }
    var prev = $('#rz-prev');
    var next = $('#rz-next');
    var step = $('#rz-step');
    var auto = $('#rz-auto');
    var reset = $('#rz-reset');
    if (prev) prev.addEventListener('click', stepBack);
    if (next) next.addEventListener('click', function () { if (state.slide < 12) goToSlide(state.slide + 1); });
    if (step) step.addEventListener('click', stepForward);
    if (auto) auto.addEventListener('click', toggleAutoplay);
    if (reset) reset.addEventListener('click', resetCurrent);

    document.addEventListener('keydown', onKeydown);
    window.addEventListener('hashchange', onHashChange);
    document.addEventListener('visibilitychange', onVisibility);
    if (state.motionQuery) {
      if (state.motionQuery.addEventListener) state.motionQuery.addEventListener('change', applyMotion);
      else if (state.motionQuery.addListener) state.motionQuery.addListener(applyMotion);
    }

    var hash = parseHash();
    var saved = hash ? null : loadSession();
    if (saved) {
      state.int = saved.int || {};
      goToSlide(saved.slide);
      state.beat = clamp(saved.beat || 1, 1, SLIDES[state.slide - 1].beats);
      render();
    } else {
      goToSlide(hash || 1);
    }
  }

  window.RZ = {
    state: state,
    slides: SLIDES,
    goToSlide: goToSlide,
    stepForward: stepForward,
    stepBack: stepBack,
    reset: resetCurrent
  };

  if (window.SP && typeof window.SP.ready === 'function') window.SP.ready(init);
  else if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})(window, document);
