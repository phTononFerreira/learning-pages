/* Página 09 — iteração */
(function () {
  'use strict';

  var data = window.SP_DATA;
  if (!data) return;

  var labels = data.labels;
  var rows = data.rows;

  function esc(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function comb(n, k) {
    var r = 1;
    for (var i = 1; i <= k; i++) r = (r * (n - k + i)) / i;
    return r;
  }

  function mcnemarExact(b, c) {
    var n = b + c;
    if (!n) return 1;
    var min = Math.min(b, c);
    var obs = comb(n, min) * Math.pow(0.5, n);
    var p = 0;
    for (var k = 0; k <= n; k++) {
      var pmf = comb(n, k) * Math.pow(0.5, n);
      if (pmf <= obs + 1e-12) p += pmf;
    }
    return Math.min(1, p);
  }

  function fmtP(p) {
    return p.toFixed(3).replace('.', ',');
  }

  function fmtPp(v) {
    return (v * 100).toFixed(1).replace('.', ',') + ' pp';
  }

  function topCluster(version, split) {
    var rs = rows.filter(function (r) {
      return r.split === split;
    });
    var map = {};
    rs.forEach(function (r) {
      if (r.pred[version] !== r.true) {
        var k = r.true + '|' + r.pred[version];
        map[k] = (map[k] || 0) + 1;
      }
    });
    var best = { t: labels[0], p: labels[0], n: 0 };
    labels.forEach(function (t) {
      labels.forEach(function (p) {
        if (t === p) return;
        var n = map[t + '|' + p] || 0;
        if (n > best.n) best = { t: t, p: p, n: n };
      });
    });
    return best;
  }

  function examplesFor(cluster, version, split) {
    return rows
      .filter(function (r) {
        return r.split === split && r.true === cluster.t && r.pred[version] === cluster.p;
      })
      .slice(0, 2);
  }

  function transition(from, to, split) {
    var fixed = [];
    var broken = [];
    rows
      .filter(function (r) {
        return r.split === split;
      })
      .forEach(function (r) {
        var a = r.pred[from] === r.true;
        var b = r.pred[to] === r.true;
        if (!a && b) fixed.push(r);
        if (a && !b) broken.push(r);
      });
    return { fixed: fixed.length, broken: broken.length };
  }

  var t1 = topCluster('v1', 'dev');
  var t2 = topCluster('v2', 'dev');
  var tr1 = transition('v1', 'v2', 'test');
  var tr2 = transition('v2', 'v3', 'test');
  var tr3 = transition('v3', 'v4', 'test');
  var testN = rows.filter(function (r) {
    return r.split === 'test';
  }).length;
  var delta14 = (tr3.fixed - tr3.broken) / testN;

  function clusterHtml(cluster, version, label) {
    var ex = examplesFor(cluster, version, 'dev');
    return (
      '<div class="p09-cluster">' +
      '<div class="mono tiny" style="letter-spacing:.12em;text-transform:uppercase">' +
      esc(label) +
      '</div>' +
      '<div class="row" style="gap:16px;align-items:baseline;margin-top:6px">' +
      '<span class="big-num accent">' +
      cluster.n +
      '</span>' +
      '<div><b class="mono">' +
      esc(cluster.t) +
      ' → ' +
      esc(cluster.p) +
      '</b><div class="mono tiny">casos em dev, dos 88</div></div>' +
      '</div>' +
      ex
        .map(function (r) {
          return '<div class="p09-example">#' + esc(r.id) + ' · “' + esc(r.text) + '”</div>';
        })
        .join('') +
      '</div>'
    );
  }

  var rounds = [
    {
      tag: 'v1 → v2',
      intro: 'O cluster é de fronteira: perguntas de processo estão sendo puxadas para <code>status_pedido</code>. Qual mutação ataca a causa?',
      cluster: clusterHtml(t1, 'v1', 'maior célula de erro · dev v1'),
      choices: [
        'Acrescentar definições positivas e contraexemplos para <code>duvida_produto</code> × <code>status_pedido</code>.',
        'Acrescentar mais cinco exemplos few-shot, sem mexer nas definições.',
        'Subir a temperature para 0,7 e deixar o modelo explorar.'
      ],
      correct: 0,
      explain:
        '<b>Definições.</b> O cluster é de regra ausente, não de falta de exemplo. “Garantia”, “prazo” e “rastreio” puxam a classe errada porque nada separa processo de pedido específico. A v2 adiciona definição positiva, contraexemplo e prioridade. Resultado no test: <b>' +
        tr1.fixed +
        ' corrigidos, ' +
        tr1.broken +
        ' quebrados</b>; McNemar p = <b>' +
        fmtP(mcnemarExact(tr1.fixed, tr1.broken)) +
        '</b>. O ganho é real.'
    },
    {
      tag: 'v2 → v3',
      intro: 'A v2 ainda erra fronteiras que já têm definição. O maior cluster continua no mesmo par. Qual mutação ataca a causa?',
      cluster: clusterHtml(t2, 'v2', 'maior célula de erro · dev v2'),
      choices: [
        'Few-shot com casos de fronteira + rótulo plano, sem JSON.',
        'Repetir as definições com mais palavras.',
        'Aumentar <code>maxTokens</code> de 8 para 64.'
      ],
      correct: 0,
      explain:
        '<b>Few-shot + rótulo plano.</b> A definição diz o critério; o exemplo mostra onde ele morde. Os cinco casos ensinam o limite, e o label plano remove preâmbulo e JSON do caminho. A v3 corrige <b>' +
        tr2.fixed +
        ' casos no test, quebra ' +
        tr2.broken +
        '</b>; McNemar p = <b>' +
        fmtP(mcnemarExact(tr2.fixed, tr2.broken)) +
        '</b>. Repetir a definição dilui; maxTokens não era o gargalo de um label.'
    },
    {
      tag: 'v3 → v4',
      intro:
        'No test, a v4 corrige ' +
        tr3.fixed +
        ' casos e quebra ' +
        tr3.broken +
        '. O saldo é +' +
        fmtPp(delta14) +
        '. O que a evidência permite concluir?',
      cluster:
        '<div class="p09-cluster">' +
        '<div class="mono tiny" style="letter-spacing:.12em;text-transform:uppercase">comparação pareada · test</div>' +
        '<div class="row" style="gap:16px;align-items:baseline;margin-top:6px">' +
        '<span class="big-num">' +
        tr3.fixed +
        ' / ' +
        tr3.broken +
        '</span>' +
        '<div><b class="mono">corrigidos / quebrados</b><div class="mono tiny">p = ' +
        fmtP(mcnemarExact(tr3.fixed, tr3.broken)) +
        ' · n = ' +
        testN +
        '</div></div>' +
        '</div>' +
        '</div>',
      choices: [
        'Embarcar e anunciar +' + fmtPp(delta14) + ' de ganho.',
        'Coletar mais dados ou rodar um canary com rollback.',
        'Subir a temperature para buscar mais diversidade.'
      ],
      correct: 1,
      explain:
        '<b>Coletar mais dados / canary.</b> ' +
        tr3.fixed +
        ' corrigidos e ' +
        tr3.broken +
        ' quebrado dão p = <b>' +
        fmtP(mcnemarExact(tr3.fixed, tr3.broken)) +
        '</b>. O saldo de ' +
        fmtPp(delta14) +
        ' é apenas ' +
        (tr3.fixed - tr3.broken) +
        ' casos líquidos em ' +
        testN +
        '. É promissor, não provado. Temperature não resolve evidência; só adiciona variância.'
    }
  ];

  var current = 0;
  var score = 0;
  var answered = false;
  var body = document.getElementById('dg-body');
  var progress = document.getElementById('dg-progress');

  function renderRound() {
    answered = false;
    var r = rounds[current];
    progress.textContent = 'rodada ' + (current + 1) + ' / ' + rounds.length;
    body.innerHTML =
      '<div class="mono tiny" style="letter-spacing:.12em;text-transform:uppercase;margin-bottom:6px">' +
      esc(r.tag) +
      '</div>' +
      '<p class="small" style="margin-bottom:0">' +
      r.intro +
      '</p>' +
      r.cluster +
      '<div id="dg-choices" role="group" aria-label="Escolha uma mutação">' +
      r.choices
        .map(function (c, i) {
          return (
            '<button class="p09-choice" type="button" data-choice="' +
            i +
            '">' +
            c +
            '</button>'
          );
        })
        .join('') +
      '</div>' +
      '<div class="p09-feedback" id="dg-feedback" aria-live="polite" hidden></div>' +
      '<div class="row" style="margin-top:14px">' +
      '<button class="btn btn-sm" type="button" id="dg-next" hidden>próxima rodada</button>' +
      '</div>';

    body.querySelectorAll('[data-choice]').forEach(function (b) {
      b.addEventListener('click', function () {
        if (answered) return;
        answered = true;
        var chosen = parseInt(b.dataset.choice, 10);
        var ok = chosen === r.correct;
        if (ok) score += 1;

        body.querySelectorAll('[data-choice]').forEach(function (x) {
          var i = parseInt(x.dataset.choice, 10);
          x.disabled = true;
          if (i === r.correct) {
            x.classList.add('is-correct');
            x.insertAdjacentHTML('beforeend', '<span class="p09-mark">a mutação certa</span>');
          } else if (i === chosen) {
            x.classList.add('is-wrong');
            x.insertAdjacentHTML('beforeend', '<span class="p09-mark">não é o caminho</span>');
          }
        });

        var fb = document.getElementById('dg-feedback');
        fb.hidden = false;
        fb.innerHTML =
          '<p><b>' +
          (ok ? 'Correto.' : 'Não.') +
          '</b> ' +
          r.explain +
          '</p>';
        var next = document.getElementById('dg-next');
        next.hidden = false;
        next.textContent = current < rounds.length - 1 ? 'próxima rodada' : 'ver resultado';
        next.focus();
      });
    });

    var next = document.getElementById('dg-next');
    next.addEventListener('click', function () {
      if (current < rounds.length - 1) {
        current += 1;
        renderRound();
      } else {
        renderFinal();
      }
    });
  }

  function renderFinal() {
    progress.textContent = 'resultado';
    var msg =
      score === 3
        ? 'Você escolheu a mutação que responde ao cluster nas três rodadas. O hábito vale mais que o placar: olhar o erro, escrever a hipótese, mudar uma coisa.'
        : score === 2
          ? 'Duas de três. Releia a rodada em que a escolha não testava a hipótese: o loop premia a mutação que responde ao cluster, não a mais sofisticada.'
          : 'O placar não é o ponto. O ponto é que cada opção errada confunde “mudar alguma coisa” com “testar uma hipótese”. Refaça olhando o cluster antes das opções.';
    body.innerHTML =
      '<div class="p09-cluster">' +
      '<div class="mono tiny" style="letter-spacing:.12em;text-transform:uppercase">placar</div>' +
      '<div class="big-num accent" style="font-size:44px;margin:6px 0 8px">' +
      score +
      ' / ' +
      rounds.length +
      '</div>' +
      '<p class="small" style="margin:0">' +
      msg +
      '</p>' +
      '</div>' +
      '<button class="btn btn-sm" type="button" id="dg-reset">jogar de novo</button>';
    document.getElementById('dg-reset').addEventListener('click', function () {
      current = 0;
      score = 0;
      renderRound();
    });
  }

  renderRound();

  SP.quiz(
    '#check',
    [
      {
        q: 'O que o teste de McNemar compara?',
        options: [
          'A acurácia média dos dois prompts em todos os casos.',
          'O tempo de resposta dos dois prompts.',
          'A direção das discordâncias: nos casos em que os prompts divergem, B corrige mais do que quebra?',
          'A variância da temperatura entre duas execuções.'
        ],
        answer: 2,
        why: 'McNemar ignora os casos em que ambos acertam ou ambos erram. Ele olha b (B corrige) e c (B quebra) e testa se essa divisão é compatível com uma moeda justa. É um teste pareado, caso a caso.'
      },
      {
        q: 'Por que o +3,2 pp da v4 não está provado, mesmo com 93,5% contra 90,3% no test?',
        options: [
          'Porque foram 3 corrigidos e 1 quebrado: o McNemar exato dá p=0,625, compatível com ruído em n=62.',
          'Porque 93,5% é menor que 90,3% em escala logarítmica.',
          'Porque o test set tem 150 casos e o dev tem 62.',
          'Porque a v4 não passou no teste de temperatura.'
        ],
        answer: 0,
        why: 'A diferença de 3,2 pp é o saldo de dois casos líquidos. O teste pareado mostra que 3 contra 1 é uma divisão comum sob a hipótese nula (p=0,625). O resultado é promissor, mas precisa de mais dados ou de um canary para virar decisão.'
      }
    ],
    {
      checkpoint: true,
      label: 'checkpoint',
      success: 'Você separou mudança de evidência. Siga para a automação — com o mesmo ceticismo.',
      fail: 'Releia as seções 03 e 04. McNemar olha as discordâncias; p não mede a probabilidade de o efeito existir.'
    }
  );
})();
