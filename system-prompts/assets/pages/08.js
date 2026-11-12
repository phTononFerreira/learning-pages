/* Página 08 — avaliação */
(function () {
  'use strict';

  var data = window.SP_DATA;
  if (!data) return;

  var labels = data.labels;
  var rows = data.rows;
  var versions = data.versions;
  var SHORT = {
    saudacao: 'saud',
    duvida_produto: 'duvida',
    status_pedido: 'status',
    reclamacao: 'recl',
    cancelamento: 'cancel',
    falar_humano: 'humano',
    outros: 'outros'
  };

  var state = { version: 'v1', split: 'dev', mode: 'count', unlocked: false, shipAnswered: false };
  var PEEK_KEY = 'sp.peeks.v1';
  var peeks = readPeeks();

  function esc(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function fmt3(n) {
    return Number(n).toFixed(3).replace('.', ',');
  }

  function readPeeks() {
    try {
      var n = parseInt(window.localStorage.getItem(PEEK_KEY) || '0', 10);
      return isFinite(n) && n > 0 ? n : 0;
    } catch (e) {
      return 0;
    }
  }

  function writePeeks(n) {
    try {
      window.localStorage.setItem(PEEK_KEY, String(n));
    } catch (e) {}
  }

  function addPeek() {
    peeks += 1;
    writePeeks(peeks);
    renderPeeks();
  }

  function renderPeeks() {
    var countEl = document.getElementById('peek-count');
    var warnEl = document.getElementById('peek-warn');
    if (countEl) countEl.textContent = peeks + (peeks === 1 ? ' olhada' : ' olhadas');
    if (!warnEl) return;
    if (peeks >= 3) {
      warnEl.hidden = false;
      warnEl.innerHTML =
        '<strong>' +
        peeks +
        ' olhadas no test.</strong> Ele deixou de ser cego: cada abertura informou uma decisão. O próximo número será otimista. Volte ao dev e reserve uma única abertura para o release.';
    } else {
      warnEl.hidden = true;
      warnEl.textContent = '';
    }
  }

  /* ---------- controles ---------- */

  var versionsEl = document.getElementById('eval-versions');
  var splitsEl = document.getElementById('eval-splits');
  var modesEl = document.getElementById('matrix-modes');
  var peekBtn = document.getElementById('peek-btn');

  function buildControls() {
    versionsEl.innerHTML = versions
      .map(function (v) {
        return (
          '<button class="chip" type="button" data-version="' +
          v.id +
          '" title="' +
          esc(v.name + ' — ' + v.sub) +
          '">' +
          v.id +
          '</button>'
        );
      })
      .join('');

    splitsEl.innerHTML =
      '<button class="chip" type="button" data-split="dev">dev</button>' +
      '<button class="chip" type="button" data-split="test" title="test trancado">test</button>';

    modesEl.innerHTML =
      '<button class="chip" type="button" data-mode="count">contagem</button>' +
      '<button class="chip" type="button" data-mode="recall">recall</button>' +
      '<button class="chip" type="button" data-mode="precision">precisão</button>';

    versionsEl.querySelectorAll('[data-version]').forEach(function (b) {
      b.addEventListener('click', function () {
        state.version = b.dataset.version;
        syncControls();
        render();
      });
    });

    splitsEl.querySelectorAll('[data-split]').forEach(function (b) {
      b.addEventListener('click', function () {
        if (b.dataset.split === 'test' && !state.unlocked) return;
        state.split = b.dataset.split;
        syncControls();
        render();
      });
    });

    modesEl.querySelectorAll('[data-mode]').forEach(function (b) {
      b.addEventListener('click', function () {
        state.mode = b.dataset.mode;
        syncControls();
        render();
      });
    });

    peekBtn.addEventListener('click', function () {
      if (state.split === 'test') {
        state.split = 'dev';
      } else {
        if (!state.unlocked) {
          state.unlocked = true;
          addPeek();
        }
        state.split = 'test';
      }
      syncControls();
      render();
    });
  }

  function syncControls() {
    versionsEl.querySelectorAll('[data-version]').forEach(function (b) {
      var on = b.dataset.version === state.version;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    splitsEl.querySelectorAll('[data-split]').forEach(function (b) {
      var on = b.dataset.split === state.split;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
      if (b.dataset.split === 'test') {
        b.disabled = !state.unlocked;
        b.title = state.unlocked ? 'ver o test' : 'test trancado até você abrir';
      }
    });
    modesEl.querySelectorAll('[data-mode]').forEach(function (b) {
      var on = b.dataset.mode === state.mode;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    peekBtn.textContent =
      state.split === 'test' ? 'voltar ao dev' : state.unlocked ? 'ver test' : 'revelar test (+1 olhada)';
  }

  /* ---------- métricas ---------- */

  function compute(rs, version) {
    var per = labels.map(function (lab) {
      var tp = 0;
      var fp = 0;
      var fn = 0;
      var support = 0;
      rs.forEach(function (r) {
        var p = r.pred[version];
        if (r.true === lab) support += 1;
        if (p === lab && r.true === lab) tp += 1;
        else if (p === lab && r.true !== lab) fp += 1;
        else if (p !== lab && r.true === lab) fn += 1;
      });
      var precision = tp + fp ? tp / (tp + fp) : 0;
      var recall = tp + fn ? tp / (tp + fn) : 0;
      var f1 = precision + recall ? (2 * precision * recall) / (precision + recall) : 0;
      return {
        label: lab,
        tp: tp,
        fp: fp,
        fn: fn,
        support: support,
        precision: precision,
        recall: recall,
        f1: f1
      };
    });
    var correct = rs.filter(function (r) {
      return r.pred[version] === r.true;
    }).length;
    var macro = per.reduce(function (a, x) {
      return a + x.f1;
    }, 0) / labels.length;
    return { per: per, correct: correct, n: rs.length, macro: macro, accuracy: correct / rs.length };
  }

  function heatClass(value, max) {
    if (!value || value <= 0) return 'heat-0';
    var level = state.mode === 'count' ? Math.ceil((value / (max || 1)) * 5) : Math.ceil(value * 5);
    return 'heat-' + Math.max(1, Math.min(5, level));
  }

  function renderMatrix(rs, version) {
    var counts = {};
    var rowTot = {};
    var colTot = {};
    labels.forEach(function (t) {
      rowTot[t] = 0;
      colTot[t] = 0;
      labels.forEach(function (p) {
        counts[t + '|' + p] = 0;
      });
    });
    rs.forEach(function (r) {
      counts[r.true + '|' + r.pred[version]] += 1;
      rowTot[r.true] += 1;
      colTot[r.pred[version]] += 1;
    });

    var max = 0;
    labels.forEach(function (t) {
      labels.forEach(function (p) {
        max = Math.max(max, counts[t + '|' + p]);
      });
    });

    var head =
      '<table class="matrix" aria-label="Matriz de confusão: linha é o rótulo verdadeiro, coluna é o previsto"><thead><tr>' +
      '<th class="rowhead" scope="col">verdade \\ previsto</th>' +
      labels
        .map(function (l) {
          return '<th scope="col" title="' + esc(l) + '">' + SHORT[l] + '</th>';
        })
        .join('') +
      '</tr></thead><tbody>';

    var body = labels
      .map(function (t) {
        var cells = labels
          .map(function (p) {
            var n = counts[t + '|' + p];
            var value = n;
            if (state.mode === 'recall') value = rowTot[t] ? n / rowTot[t] : 0;
            if (state.mode === 'precision') value = colTot[p] ? n / colTot[p] : 0;
            var display = state.mode === 'count' ? String(n) : n === 0 ? '0' : Math.round(value * 100) + '%';
            var title =
              t +
              ' → ' +
              p +
              ': ' +
              n +
              ' casos (' +
              (rowTot[t] ? Math.round((n / rowTot[t]) * 100) : 0) +
              '% da linha, ' +
              (colTot[p] ? Math.round((n / colTot[p]) * 100) : 0) +
              '% da coluna)';
            return (
              '<td class="' +
              heatClass(value, max) +
              (t === p ? ' diag' : '') +
              '" title="' +
              esc(title) +
              '">' +
              display +
              '</td>'
            );
          })
          .join('');
        return '<tr><th class="rowhead" scope="row" title="' + esc(t) + '">' + SHORT[t] + '</th>' + cells + '</tr>';
      })
      .join('');

    document.getElementById('matrix-wrap').innerHTML = head + body + '</tbody></table>';
    var cap = document.getElementById('matrix-caption');
    if (cap) {
      cap.textContent =
        state.mode === 'count'
          ? 'Linha = rótulo verdadeiro; coluna = previsto. Números absolutos.'
          : state.mode === 'recall'
            ? 'Cada célula é dividida pelo total da linha: recall por classe verdadeira.'
            : 'Cada célula é dividida pelo total da coluna: precisão por classe prevista.';
    }
  }

  function topErrors(rs, version) {
    var cluster = {};
    rs.forEach(function (r) {
      if (r.pred[version] !== r.true) {
        var k = r.true + '|' + r.pred[version];
        cluster[k] = (cluster[k] || 0) + 1;
      }
    });
    return rs
      .filter(function (r) {
        return r.pred[version] !== r.true;
      })
      .map(function (r) {
        return { row: r, key: r.true + '|' + r.pred[version], count: cluster[r.true + '|' + r.pred[version]] };
      })
      .sort(function (a, b) {
        if (b.count !== a.count) return b.count - a.count;
        return a.row.id.localeCompare(b.row.id);
      })
      .slice(0, 5);
  }

  function renderErrors(rs, version) {
    var host = document.getElementById('m-errors');
    var errs = topErrors(rs, version);
    if (!errs.length) {
      host.innerHTML = '<p class="small" style="margin:10px 0 0">Nenhum erro neste split. Isso não prova generalização: prova que esta amostra é fácil demais.</p>';
      return;
    }
    host.innerHTML = errs
      .map(function (e) {
        var r = e.row;
        return (
          '<div class="p08-error">' +
          '<div class="p08-error-text">“' +
          esc(r.text) +
          '”</div>' +
          '<div class="p08-error-meta">#' +
          esc(r.id) +
          ' · verdade <b>' +
          esc(r.true) +
          '</b> → previsto <b>' +
          esc(r.pred[version]) +
          '</b> · ' +
          e.count +
          (e.count === 1 ? ' caso' : ' casos') +
          ' nesta célula</div>' +
          (r.note ? '<div class="p08-error-meta">' + esc(r.note) + '</div>' : '') +
          '</div>'
        );
      })
      .join('');
  }

  function render() {
    var rs = rows.filter(function (r) {
      return r.split === state.split;
    });
    var m = compute(rs, state.version);
    var ci = SP.wilson(m.correct, m.n);
    var status = document.getElementById('eval-status');
    if (status) status.textContent = state.split + ' · ' + state.version + ' · ' + m.n + ' casos';

    document.getElementById('m-acc').textContent = SP.pct(m.accuracy, 1);
    document.getElementById('m-f1').textContent = SP.pct(m.macro, 1);
    document.getElementById('m-n').textContent = String(m.n);
    document.getElementById('m-ci').textContent = SP.pct(ci[0], 1) + '–' + SP.pct(ci[1], 1);

    var classCount = {};
    rs.forEach(function (r) {
      classCount[r.true] = (classCount[r.true] || 0) + 1;
    });
    var maxCount = 0;
    Object.keys(classCount).forEach(function (k) {
      maxCount = Math.max(maxCount, classCount[k]);
    });
    document.getElementById('m-base').textContent =
      SP.pct(maxCount / m.n, 1) + ' (' + maxCount + '/' + m.n + ')';

    document.getElementById('m-table').innerHTML =
      '<thead><tr><th>classe</th><th class="num">P</th><th class="num">R</th><th class="num">F1</th><th class="num">n</th></tr></thead><tbody>' +
      m.per
        .map(function (c) {
          return (
            '<tr><td><code>' +
            esc(c.label) +
            '</code></td><td class="num">' +
            fmt3(c.precision) +
            '</td><td class="num">' +
            fmt3(c.recall) +
            '</td><td class="num"' +
            (c.f1 < 0.8 ? ' style="color:var(--accent)"' : '') +
            '>' +
            fmt3(c.f1) +
            '</td><td class="num">' +
            c.support +
            '</td></tr>'
          );
        })
        .join('') +
      '</tbody>';

    renderMatrix(rs, state.version);
    renderErrors(rs, state.version);
    syncControls();

    var testRows = rows.filter(function (r) {
      return r.split === 'test';
    });
    var acc3 = testRows.filter(function (r) {
      return r.pred.v3 === r.true;
    }).length / testRows.length;
    var acc4 = testRows.filter(function (r) {
      return r.pred.v4 === r.true;
    }).length / testRows.length;
    var shipTitle = document.getElementById('ship-title');
    if (shipTitle) {
      shipTitle.textContent =
        'v4 fez ' + SP.pct(acc4, 1) + ' no test; v3, ' + SP.pct(acc3, 1) + '. Embarca?';
    }
  }

  /* ---------- McNemar ---------- */

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

  function handleShip(choice) {
    if (state.shipAnswered) return;
    state.shipAnswered = true;
    addPeek();

    var test = rows.filter(function (r) {
      return r.split === 'test';
    });
    var fixed = 0;
    var broken = 0;
    test.forEach(function (r) {
      var before = r.pred.v3 === r.true;
      var after = r.pred.v4 === r.true;
      if (!before && after) fixed += 1;
      if (before && !after) broken += 1;
    });
    var p = mcnemarExact(fixed, broken);
    var acc3 = test.filter(function (r) {
      return r.pred.v3 === r.true;
    }).length / test.length;
    var acc4 = test.filter(function (r) {
      return r.pred.v4 === r.true;
    }).length / test.length;
    var delta = (acc4 - acc3) * 100;
    var deltaPp = delta.toFixed(1).replace('.', ',') + ' pp';
    var corrigidos = fixed === 1 ? 'corrigido' : 'corrigidos';
    var quebrados = broken === 1 ? 'quebrado' : 'quebrados';

    var lead = '';
    if (choice === 'wait') {
      lead = '<b>Correto.</b> Você separou “promissor” de “provado”.';
    } else if (choice === 'yes') {
      lead = '<b>Ainda não.</b> O sinal é bom, mas não sobrevive ao teste pareado.';
    } else {
      lead = '<b>Conservador — e defensável.</b> v4 não é pior; só não há evidência de que seja melhor.';
    }

    var out = document.getElementById('ship-out');
    out.hidden = false;
    out.innerHTML =
      '<p>' +
      lead +
      '</p>' +
      '<p><b>v3 → v4 no test:</b> ' +
      fixed +
      ' ' +
      corrigidos +
      ', ' +
      broken +
      ' ' +
      quebrados +
      '. McNemar exato: <b>p = ' +
      fmtP(p) +
      '</b>. A diferença de ' +
      deltaPp +
      ' não é significativa com n=' +
      test.length +
      '. Colete mais dados ou rode um canary com rollback antes de anunciar ganho. <a href="09-loop.html">A página 09 mostra o teste.</a></p>' +
      '<p class="tiny" style="margin-bottom:0">Esta resposta somou uma olhada ao contador. Revelar o test para decidir também é olhar.</p>';

    document.querySelectorAll('[data-ship]').forEach(function (b) {
      b.disabled = true;
    });
  }

  document.querySelectorAll('[data-ship]').forEach(function (b) {
    b.addEventListener('click', function () {
      handleShip(b.dataset.ship);
    });
  });

  /* ---------- calculadora de amostra ---------- */

  var confEl = document.getElementById('ss-conf');
  var pEl = document.getElementById('ss-p');
  var marginEl = document.getElementById('ss-margin');
  var kEl = document.getElementById('ss-k');
  var nEl = document.getElementById('ss-nobs');

  function wilsonZ(k, n, z) {
    if (!n) return [0, 0];
    var p = k / n;
    var den = 1 + (z * z) / n;
    var centre = (p + (z * z) / (2 * n)) / den;
    var margin = (z * Math.sqrt((p * (1 - p)) / n + (z * z) / (4 * n * n))) / den;
    return [Math.max(0, centre - margin), Math.min(1, centre + margin)];
  }

  function updateSize() {
    var z = parseFloat(confEl.value) || 1.96;
    var p = parseFloat(pEl.value);
    var e = (parseFloat(marginEl.value) || 5) / 100;
    var k = parseInt(kEl.value, 10);
    var n = parseInt(nEl.value, 10);

    var valid = isFinite(p) && p > 0 && p < 1 && isFinite(e) && e > 0;
    var need = valid ? Math.ceil((z * z * p * (1 - p)) / (e * e)) : 0;

    document.getElementById('ss-n').textContent = valid ? String(need) : '—';
    document.getElementById('ss-total').textContent = valid ? String(need * 2) : '—';

    if (!isFinite(k) || k < 0) k = 0;
    if (!isFinite(n) || n < 1) n = 1;
    if (k > n) k = n;

    var ci = wilsonZ(k, n, z);
    document.getElementById('ss-pobs').textContent = SP.pct(k / n, 1);
    document.getElementById('ss-ci').textContent = SP.pct(ci[0], 1) + '–' + SP.pct(ci[1], 1);
    document.getElementById('ss-half').textContent = SP.pct((ci[1] - ci[0]) / 2, 1).replace('%', ' pp');
  }

  [confEl, pEl, marginEl, kEl, nEl].forEach(function (el) {
    el.addEventListener('input', updateSize);
    el.addEventListener('change', updateSize);
  });

  document.getElementById('ss-preset').addEventListener('click', function () {
    confEl.value = '1.96';
    pEl.value = '0.90';
    marginEl.value = '5';
    kEl.value = '56';
    nEl.value = '62';
    updateSize();
  });

  /* ---------- boot ---------- */

  buildControls();
  renderPeeks();
  render();
  updateSize();

  /* quizzes */
  SP.quiz(
    '#check',
    [
      {
        q: 'Por que macro-F1, e não só acurácia, em um classificador de 7 rotas?',
        options: [
          'Porque macro-F1 dá o mesmo peso a cada classe e expõe uma classe rara quebrada, que a acurácia dilui.',
          'Porque macro-F1 sempre é maior que acurácia e impressiona melhor.',
          'Porque acurácia não funciona com mais de duas classes.',
          'Porque macro-F1 mede calibração de probabilidade.'
        ],
        answer: 0,
        why: 'A acurácia pondera pelo suporte: uma classe com 6 casos quase não move o número. Macro-F1 tira a média dos F1 por classe; se <code>outros</code> cai, o macro cai mesmo que a acurácia pareça alta.'
      },
      {
        q: 'O que significa “IC 95% = 80,5%–95,5%” para a acurácia do v3?',
        options: [
          'Há 95% de chance de o modelo acertar entre 80,5% e 95,5% na próxima mensagem.',
          'O modelo tem 95% de confiança nas próprias respostas.',
          'Se repetíssemos o experimento muitas vezes, cerca de 95% dos intervalos construídos assim conteriam a acurácia verdadeira.',
          'A acurácia verdadeira é exatamente 88%, o centro do intervalo.'
        ],
        answer: 2,
        why: 'O intervalo é uma propriedade do procedimento, não da próxima mensagem. Ele quantifica incerteza amostral: com n=62, a estimativa ainda pode se mover vários pontos. Não é probabilidade de acerto nem confiança do modelo.'
      },
      {
        q: 'Por que não iterar no test set, olhando o erro e ajustando o prompt?',
        options: [
          'Porque cada ajuste informado pelo test transforma o test em dev: a próxima medição fica otimista e deixa de estimar generalização.',
          'Porque o test set é pequeno demais para ser lido.',
          'Porque o test set não tem rótulos verdadeiros.',
          'Porque o modelo decora o test set e passa a acertar 100%.'
        ],
        answer: 0,
        why: 'O problema não é o modelo decorar, é você selecionar o prompt usando aquela amostra. O test vira um segundo dev, e o ganho medido incorpora sorte daquela amostra — o winner’s curse. Uma olhada por release, com regra pré-registrada.'
      }
    ],
    {
      checkpoint: true,
      label: 'checkpoint',
      success: 'Você separou estimativa de opinião, viu a incerteza e protegeu o test. Siga para o loop.',
      fail: 'Releia as seções 02 a 04. A pergunta central é sempre “este número sobrevive a outra amostra?”.'
    }
  );
})();
