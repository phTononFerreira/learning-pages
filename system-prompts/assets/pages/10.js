/* Página 10 — automação */
(function () {
  'use strict';

  var PRICES = {
    micro: { in: 0.035, out: 0.14 },
    lite: { in: 0.06, out: 0.24 },
    pro: { in: 0.8, out: 3.2 }
  };
  var OPT = { in: 0.8, out: 3.2 };

  function num(id, fallback) {
    var el = document.getElementById(id);
    if (!el) return fallback;
    var n = parseFloat(el.value);
    return isFinite(n) ? n : fallback;
  }

  function intNum(id, fallback, min) {
    var n = Math.floor(num(id, fallback));
    return n < min ? min : n;
  }

  function cost(calls, inTok, outTok, price) {
    return (calls * (inTok * price.in + outTok * price.out)) / 1000000;
  }

  function updateCost() {
    var examples = intNum('c-examples', 100, 1);
    var candidates = intNum('c-candidates', 5, 1);
    var rounds = intNum('c-rounds', 6, 1);
    var modelEl = document.getElementById('c-model');
    var price = PRICES[modelEl.value] || PRICES.lite;
    var inTok = Math.max(0, num('c-in', 900));
    var outTok = Math.max(0, num('c-out', 30));
    var optCalls = Math.max(0, Math.floor(num('c-optcalls', 20)));
    var optIn = Math.max(0, num('c-optin', 8000));
    var optOut = Math.max(0, num('c-optout', 2000));

    var calls = examples * candidates * rounds;
    var targetCost = cost(calls, inTok, outTok, price);
    var optCost = cost(optCalls, optIn, optOut, OPT);
    var total = targetCost + optCost;
    var per1k = calls ? (targetCost / calls) * 1000 : 0;

    document.getElementById('c-calls').textContent = calls.toLocaleString('pt-BR');
    document.getElementById('c-target').textContent = SP.money(targetCost);
    document.getElementById('c-opt').textContent = SP.money(optCost);
    document.getElementById('c-total').textContent = SP.money(total);
    document.getElementById('c-per1k').textContent = SP.money(per1k, 4);

    var dspyCalls = 150;
    var gepaCalls = 1600;
    var rows = [
      { name: 'manual', calls: 0, target: 0, total: 0 },
      {
        name: 'DSPy light (~150)',
        calls: dspyCalls,
        target: cost(dspyCalls, inTok, outTok, price),
        total: cost(dspyCalls, inTok, outTok, price) + optCost
      },
      {
        name: 'GEPA light (~1.600)',
        calls: gepaCalls,
        target: cost(gepaCalls, inTok, outTok, price),
        total: cost(gepaCalls, inTok, outTok, price) + optCost
      }
    ];

    document.getElementById('c-compare').innerHTML =
      '<thead><tr><th>abordagem</th><th class="num">chamadas</th><th class="num">custo alvo</th><th class="num">custo total</th></tr></thead><tbody>' +
      rows
        .map(function (r) {
          return (
            '<tr><td>' +
            r.name +
            '</td><td class="num">' +
            r.calls.toLocaleString('pt-BR') +
            '</td><td class="num">' +
            SP.money(r.target) +
            '</td><td class="num">' +
            SP.money(r.total) +
            '</td></tr>'
          );
        })
        .join('') +
      '</tbody>';
  }

  ['c-examples', 'c-candidates', 'c-rounds', 'c-in', 'c-out', 'c-optcalls', 'c-optin', 'c-optout'].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', updateCost);
      el.addEventListener('change', updateCost);
    }
  });
  var modelEl = document.getElementById('c-model');
  if (modelEl) modelEl.addEventListener('change', updateCost);

  /* ---------- recomendador ---------- */

  function recommend() {
    var size = document.getElementById('mr-size').value;
    var pipe = document.getElementById('mr-pipe').value;
    var feedback = document.getElementById('mr-feedback').value;
    var out = document.getElementById('mr-out');
    var title = '';
    var why = '';
    var first = '';

    if (size === 'small') {
      title = 'Manual, por enquanto.';
      why =
        'Com menos de 50 exemplos, o otimizador decora o dev e você não distingue regra de ruído. O gargalo é coleta e definição de rótulo, não busca de prompt.';
      first = 'Rotule mais 30–50 casos, faça dupla checagem em 10–20% e agrupe os erros por (verdade, previsto).';
    } else if (pipe === 'multi') {
      title = 'DSPy com MIPROv2 (GEPA se houver feedback por etapa).';
      why =
        'Um pipeline com várias etapas tem mais de um prompt: otimizar um texto solto não enxerga a composição. DSPy otimiza módulos e demos; MIPRO lida com instruções + demonstrações.';
      first = 'Congele o eval ponta a ponta, defina a métrica de cada etapa e rode MIPRO light. Compare o pipeline inteiro, não só o primeiro nó.';
    } else if (feedback === 'yes') {
      title = 'GEPA light.';
      why =
        'Seu diferencial é o feedback textual por exemplo: é isso que a reflexão consome. O GEPA mantém uma fronteira de Pareto e costuma ficar em 1,5–2,5 mil metric calls no orçamento light.';
      first = 'Escreva o feedback por erro, rode com auto="light" e um reflection_lm forte, e compare com o baseline no dev antes de olhar o test.';
    } else {
      title = 'DSPy MIPROv2 light — ou o loop manual.';
      why =
        'Sem feedback textual, o GEPA tem pouco sobre o que refletir. MIPROv2 usa a métrica exata para escolher instruções e demos; o loop manual ainda é competitivo com 50–150 casos.';
      first = 'Garanta uma métrica exact-match, rode MIPRO light e inspecione os demos escolhidos: o ganho pode vir deles, não das instruções.';
    }

    out.innerHTML =
      '<span class="mono">recomendação</span>' +
      '<p style="margin:6px 0 8px"><b>' +
      title +
      '</b></p>' +
      '<p class="small" style="margin:0 0 8px">' +
      why +
      '</p>' +
      '<p class="tiny" style="margin:0">Primeiro passo: ' +
      first +
      ' Em qualquer cenário: promptfoo no CI e uma única olhada no test.</p>';
  }

  var go = document.getElementById('mr-go');
  if (go) go.addEventListener('click', recommend);

  updateCost();

  SP.quiz(
    '#check',
    [
      {
        q: 'Por que o modelo-alvo precisa ficar fixo durante a otimização?',
        options: [
          'Porque modelos diferentes cobram preços diferentes.',
          'Porque o DSPy só aceita um modelo por execução.',
          'Porque a temperature precisa ser zero para o otimizador funcionar.',
          'Porque, se o alvo muda entre candidatos, o ganho medido pode ser troca de modelo, não de prompt; o candidato aprende atalhos do modelo que avaliou.'
        ],
        answer: 3,
        why: 'O experimento isola uma variável. Se o alvo muda, você não sabe se o ganho veio da instrução, dos demos ou do modelo. O prompt compilado no Pro pode aprender atalhos que o Lite não tem. Fixe modelo, versão e parâmetros; revalide na migração.'
      },
      {
        q: 'Quando o GEPA é um bom ajuste?',
        options: [
          'Quando você tem menos de 50 exemplos e nenhuma métrica confiável.',
          'Quando o problema é parsing de JSON e o parser está quebrado.',
          'Quando há dezenas ou centenas de exemplos, uma métrica estável e feedback textual por erro, com o modelo-alvo fixo.',
          'Quando você quer trocar o modelo de produção sem reavaliar.'
        ],
        answer: 2,
        why: 'A reflexão do GEPA consome feedback textual por exemplo; sem texto, sobra pouco sinal além do score. Com poucos exemplos ou sem eval congelado, coleta e error analysis manual vencem. E o alvo continua fixo: o modelo de reflexão escreve, não substitui o classificador.'
      }
    ],
    {
      checkpoint: true,
      label: 'checkpoint',
      success: 'Você fechou o ato de provar: o otimizador propõe, o eval decide. Siga para o caso completo.',
      fail: 'Releia as seções 02 e 05. A pergunta central é “o que mudou: o prompt ou o modelo?”.'
    }
  );
})();
