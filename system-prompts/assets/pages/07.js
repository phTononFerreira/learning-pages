/* Página 07 — laboratório de variância */
(function () {
  'use strict';

  var host = document.getElementById('p07-results');
  if (!host) return;

  var runBtn = document.getElementById('p07-run');
  var resetBtn = document.getElementById('p07-reset');
  var live = document.getElementById('p07-live');

  var INPUTS = [
    {
      text: 'meu pedido 4412 atrasou e quero reembolso',
      expected: 'reclamacao',
      zero: ['reclamacao', 'reclamacao', 'reclamacao', 'reclamacao', 'status_pedido', 'reclamacao', 'reclamacao', 'reclamacao', 'reclamacao', 'reclamacao'],
      high: ['reclamacao', 'status_pedido', 'reclamacao', 'reclamacao', 'cancelamento', 'status_pedido', 'reclamacao', 'reclamacao', 'status_pedido', 'reclamacao']
    },
    {
      text: 'como faço para cancelar meu pedido?',
      expected: 'duvida_produto',
      zero: ['duvida_produto', 'duvida_produto', 'duvida_produto', 'duvida_produto', 'duvida_produto', 'duvida_produto', 'duvida_produto', 'duvida_produto', 'duvida_produto', 'duvida_produto'],
      high: ['duvida_produto', 'cancelamento', 'duvida_produto', 'duvida_produto', 'cancelamento', 'cancelamento', 'duvida_produto', 'status_pedido', 'duvida_produto', 'cancelamento']
    },
    {
      text: 'I want to cancel my subscription',
      expected: 'cancelamento',
      zero: ['cancelamento', 'cancelamento', 'outros', 'cancelamento', 'cancelamento', 'cancelamento', 'cancelamento', 'outros', 'cancelamento', 'cancelamento'],
      high: ['cancelamento', 'outros', 'cancelamento', 'cancelamento', 'duvida_produto', 'cancelamento', 'outros', 'cancelamento', 'cancelamento', 'outros']
    }
  ];

  var temp = '0';

  function esc(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function counts(labels) {
    var map = {};
    labels.forEach(function (l) { map[l] = (map[l] || 0) + 1; });
    return Object.keys(map)
      .map(function (l) { return { label: l, n: map[l] }; })
      .sort(function (a, b) { return b.n - a.n || a.label.localeCompare(b.label); });
  }

  function placeholder(msg) {
    host.innerHTML = '';
    var p = document.createElement('p');
    p.className = 'small';
    p.style.margin = '0';
    p.textContent = msg;
    host.appendChild(p);
  }

  function render() {
    var key = temp === '0' ? 'zero' : 'high';
    var summary = [];

    host.innerHTML = '';
    INPUTS.forEach(function (item, i) {
      var labels = item[key];
      var dist = counts(labels);
      var agreement = dist[0].n;
      summary.push(agreement + '/10');

      var card = document.createElement('div');
      card.className = 'card';
      card.style.padding = '14px';

      var head = document.createElement('div');
      head.className = 'mono tiny';
      head.style.color = 'var(--accent)';
      head.textContent = 'ENTRADA ' + String(i + 1).padStart(2, '0') + ' · ESPERADO: ' + item.expected;
      card.appendChild(head);

      var text = document.createElement('p');
      text.className = 'small';
      text.style.margin = '4px 0 10px';
      text.textContent = '“' + item.text + '”';
      card.appendChild(text);

      var chips = document.createElement('div');
      chips.className = 'pill-row';
      chips.style.margin = '0 0 10px';
      labels.forEach(function (l) {
        var chip = document.createElement('span');
        chip.className = 'chip';
        chip.textContent = l;
        chips.appendChild(chip);
      });
      card.appendChild(chips);

      var kv = document.createElement('div');
      kv.className = 'kv';
      kv.innerHTML = '<span>concordância</span><b>' + agreement + ' / 10</b>';
      card.appendChild(kv);

      var hist = document.createElement('div');
      hist.style.marginTop = '8px';
      dist.forEach(function (d) {
        var row = document.createElement('div');
        row.className = 'bar-row';
        row.innerHTML = '<span>' + esc(d.label) + '</span>' +
          '<div class="bar"><span class="bar-fill' + (d.label === item.expected ? ' accent' : '') + '" style="width:' + (d.n * 10) + '%"></span></div>' +
          '<span class="val">' + d.n + '/10</span>';
        hist.appendChild(row);
      });
      card.appendChild(hist);

      host.appendChild(card);
    });

    live.textContent = 'Simulação a temperature ' + temp + '. Concordância por entrada: ' +
      summary.join(', ') + '. A amostra é fixa e não é uma medição do Bedrock.';
  }

  function clear(msg) {
    placeholder(msg);
    live.textContent = 'Resultados limpos.';
  }

  runBtn.addEventListener('click', render);
  resetBtn.addEventListener('click', function () {
    temp = '0';
    SP.$$('#p07-temp [data-temp]').forEach(function (b) {
      var on = b.dataset.temp === '0';
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    clear('Clique em “rodar 10x” para revelar as amostras.');
  });

  SP.$$('#p07-temp [data-temp]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      temp = btn.dataset.temp;
      SP.$$('#p07-temp [data-temp]').forEach(function (b) {
        var on = b === btn;
        b.classList.toggle('is-active', on);
        b.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
      clear('Temperatura ' + temp + ' selecionada. Clique em “rodar 10x” para ver a nova amostra.');
    });
  });

  /* checkpoint */
  SP.quiz('#check', [
    {
      q: 'Temperature 0 garante que a mesma entrada produza sempre a mesma saída?',
      options: [
        'Sim, porque o argmax é único e não há amostragem.',
        'Não: remove a loteria da amostragem, mas batching, kernels, ponto flutuante, cache e versão do modelo ainda variam.',
        'Só garante se top_p for 1.0.',
        'Sim, desde que maxTokens seja 8 e o stop seja newline.'
      ],
      answer: 1,
      why: 'Greedy escolhe o token mais provável, mas a distribuição de logits não é estável entre lotes e infraestruturas. A ausência de amostragem não é ausência de variação.'
    },
    {
      q: 'O que um relatório de eval precisa dizer além da acurácia?',
      options: [
        'A melhor execução entre as tentativas, para não subestimar o modelo.',
        'Apenas a temperatura, porque o resto é ruído de infraestrutura.',
        'K repetições, média e desvio entre runs, versão do modelo, configuração, data e separação dev/test.',
        'O prompt e a data, mas não o número — números variam.'
      ],
      answer: 2,
      why: 'Uma execução é uma amostra. Sem K, versão, configuração e data, o número não é reproduzível; e escolher a melhor execução é reportar o máximo, não o sistema.'
    }
  ], {
    checkpoint: true,
    label: 'checkpoint',
    success: 'Você parou de tratar temperature 0 como botão determinístico e sabe medir a variação.',
    fail: 'Releia as seções 02 e 03. O eval também é uma amostra; reporte a distribuição, não só o pico.'
  });
})();
