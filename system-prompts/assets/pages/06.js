/* Página 06 — parser playground */
(function () {
  'use strict';

  var input = document.getElementById('p06-input');
  if (!input) return;

  var stepsHost = document.getElementById('p06-steps');
  var finalEl = document.getElementById('p06-final');
  var fallbackEl = document.getElementById('p06-fallback');
  var retryEl = document.getElementById('p06-retry');
  var verdict = document.getElementById('p06-verdict');

  var LABELS = ['saudacao', 'duvida_produto', 'status_pedido', 'reclamacao', 'cancelamento', 'falar_humano', 'outros'];
  var SYNONYMS = {
    cancelar: 'cancelamento',
    'cancelamento de assinatura': 'cancelamento',
    status: 'status_pedido',
    'status do pedido': 'status_pedido',
    rastreio: 'status_pedido',
    atendente: 'falar_humano',
    humano: 'falar_humano',
    suporte: 'falar_humano',
    'falar com humano': 'falar_humano',
    oi: 'saudacao',
    ola: 'saudacao',
    duvida: 'duvida_produto',
    produto: 'duvida_produto',
    reclamar: 'reclamacao',
    outro: 'outros'
  };

  var mode = 'label';

  function esc(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function normalize(s) {
    var out = s;
    if (out.normalize) out = out.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    return out.toLowerCase();
  }

  function finish(label, fallback, retry, why) {
    return { label: label, fallback: fallback, retry: retry, why: why };
  }

  function run(raw, contract) {
    var steps = [];
    var v = raw.trim();

    function step(name, status, detail) {
      steps.push({ name: name, status: status, detail: detail });
    }

    step('trim', v ? 'ok' : 'falhou', v ? 'espaços externos removidos.' : 'entrada vazia.');
    if (!v) {
      return { steps: steps, result: finish('outros', true, 1, 'Entrada vazia: não há o que normalizar. O Flow recebe `outros` e a flag.') };
    }

    if (contract === 'label') {
      var fenced = v.replace(/^```[a-z]*\s*/i, '').replace(/```\s*$/i, '').trim();
      step('cercas markdown', fenced !== v ? 'ok' : 'ignorado', fenced !== v ? 'cerca removida.' : 'nenhuma cerca encontrada.');
      v = fenced;

      if (/^[\[{]/.test(v)) {
        step('contrato label', 'falhou', 'a saída começa com JSON, mas o contrato é label plano.');
        return { steps: steps, result: finish('outros', true, 1, 'Contrato incompatível: JSON não é label plano. O retry deve repetir o contrato; se falhar de novo, `outros` + flag.') };
      }
      step('contrato label', 'ok', 'sem JSON, sem estrutura.');

      var before = v;
      v = v.replace(/^(categoria|intent|label|resposta|sa[ií]da|classificacao|classificação)\s*[:=]\s*/i, '');
      v = v.replace(/^(eu acho que\s+(?:e|é)|acho que\s+(?:e|é)|parece que\s+(?:e|é)|creio que\s+(?:e|é))\s+/i, '');
      v = v.replace(/^["'`]+|["'`]+$/g, '').replace(/[.!?;:]+$/g, '').trim();
      step('prefixo / limpeza', before !== v ? 'ok' : 'ignorado', before !== v ? 'prefixo, quotes ou pontuação removidos.' : 'nada a remover.');
    } else {
      var fencedJson = v.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '').trim();
      step('cercas markdown', fencedJson !== v ? 'ok' : 'ignorado', fencedJson !== v ? 'cerca removida.' : 'nenhuma cerca encontrada.');
      v = fencedJson;

      var obj;
      try {
        obj = JSON.parse(v);
      } catch (e) {
        step('JSON.parse', 'falhou', 'JSON malformado ou truncado.');
        return { steps: steps, result: finish('outros', true, 1, 'Parse falhou. O retry recebe a mensagem de erro; se repetir, `outros` + flag.') };
      }
      step('JSON.parse', 'ok', 'objeto válido.');

      if (!obj || Array.isArray(obj) || typeof obj !== 'object' || typeof obj.intent !== 'string') {
        step('campo intent', 'falhou', 'objeto sem `intent` string.');
        return { steps: steps, result: finish('outros', true, 1, 'JSON válido, campo ausente. O contrato exige `intent`; o fallback é `outros` com flag.') };
      }
      step('campo intent', 'ok', 'intent = "' + obj.intent + '".');
      v = obj.intent;
    }

    var norm = normalize(v).trim();
    step('normalizar', 'ok', norm !== v ? 'caixa e acentos normalizados: ' + norm + '.' : 'já normalizado: ' + norm + '.');
    if (!norm) {
      step('enum match', 'falhou', 'string vazia após normalizar.');
      step('sinônimos', 'ignorado', 'não há chave.');
      step('fallback', 'ok', 'outros + flag.');
      return { steps: steps, result: finish('outros', true, 1, 'Sem conteúdo: `outros` + flag.') };
    }

    var label = null;
    var via = '';

    if (LABELS.indexOf(norm) > -1) {
      step('enum match', 'ok', '"' + norm + '" é um dos sete labels.');
      step('sinônimos', 'ignorado', 'não foi necessário.');
      label = norm;
      via = 'enum';
    } else {
      step('enum match', 'falhou', '"' + norm + '" não está no enum.');
      if (SYNONYMS[norm]) {
        step('sinônimos', 'ok', '"' + norm + '" → ' + SYNONYMS[norm] + '.');
        label = SYNONYMS[norm];
        via = 'sinonimo';
      } else {
        step('sinônimos', 'falhou', 'nenhum mapping fechado.');
      }
    }

    if (!label) {
      step('fallback', 'ok', 'outros + parse_failed=true.');
      return { steps: steps, result: finish('outros', true, 1, 'Nenhum label válido. Retry único com a mensagem de erro; se repetir, `outros` + flag. O texto cru nunca chega ao Flow.') };
    }

    step('fallback', 'ignorado', 'label válido; não se aplica.');
    var why = via === 'sinonimo'
      ? 'Válido via sinônimo fechado. O Flow recebe `' + label + '`; registre o mapping aplicado.'
      : 'Válido. O Flow pode comparar `' + label + '` com igualdade.';
    if (contract === 'json') why += ' O contrato JSON foi cumprido e o campo `intent` foi extraído.';
    return { steps: steps, result: finish(label, false, 0, why) };
  }

  function render(out) {
    stepsHost.innerHTML = out.steps.map(function (s) {
      var statusClass = s.status === 'falhou' ? 'accent' : s.status === 'ok' ? '' : 'muted';
      return '<div class="step"><div><h3>' + esc(s.name) +
        ' <span class="mono ' + statusClass + '" style="font-size:9px;letter-spacing:.08em">' + s.status + '</span></h3>' +
        '<p>' + esc(s.detail) + '</p></div></div>';
    }).join('');

    finalEl.textContent = out.result.label;
    finalEl.classList.toggle('accent', out.result.fallback);
    input.setAttribute('aria-invalid', out.result.fallback ? 'true' : 'false');
    fallbackEl.textContent = out.result.fallback ? 'sim · outros' : 'não';
    retryEl.textContent = out.result.retry ? '1 (política)' : '0';
    verdict.textContent = out.result.why;
  }

  function refresh() {
    var mt = document.getElementById('p06-maxtokens');
    if (mt) mt.textContent = mode === 'json' ? '32' : '8';
    render(run(input.value, mode));
  }

  input.addEventListener('input', refresh);

  SP.$$('[data-sample]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      input.value = btn.dataset.sample;
      refresh();
      input.focus();
    });
  });

  SP.$$('#p06-mode [data-mode]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      mode = btn.dataset.mode;
      SP.$$('#p06-mode [data-mode]').forEach(function (b) {
        var on = b === btn;
        b.classList.toggle('is-active', on);
        b.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
      refresh();
    });
  });

  refresh();

  /* checkpoint */
  SP.quiz('#check', [
    {
      q: 'Um JSON válido com o campo `intent` garante que a classe está correta?',
      options: [
        'Não: o schema valida a forma; o modelo pode devolver um rótulo válido e semanticamente errado.',
        'Sim: se o schema passou, o rótulo é necessariamente o certo.',
        'Não, porque o Flow não consegue ler JSON em nenhuma hipótese.',
        'Sim, desde que temperature seja 0.7.'
      ],
      answer: 0,
      why: 'O contrato resolve a interface, não a decisão. `{"intent":"saudacao"}` para “meu pedido atrasou” é JSON perfeito e classificação errada. Só a avaliação pega isso.'
    },
    {
      q: 'O modelo devolve `{"intent":"status` — truncado. Qual é a resposta correta do sistema?',
      options: [
        'Rotear como `status_pedido`, porque o prefixo já indica a intenção.',
        'Retry único com a mensagem de erro; se falhar de novo, `outros` + flag, sem passar o texto cru ao Flow.',
        'Aumentar `maxTokens` para 8.000 e repetir até vir JSON completo.',
        'Descartar a mensagem sem registrar nada.'
      ],
      answer: 1,
      why: 'Truncamento é falha de contrato. O retry único tenta corrigir com contexto do erro; se repetir, o fallback explícito protege o Flow. O texto cru nunca deve virar condição.'
    }
  ], {
    checkpoint: true,
    label: 'checkpoint',
    success: 'Você separou formato de semântica e sabe o que fazer quando o parser não fecha.',
    fail: 'Releia as seções 01, 03 e 04. Contrato é interface; parsing é higiene; fallback é política.'
  });
})();
