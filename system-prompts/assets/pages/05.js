/* Página 05 — seletor few-shot */
(function () {
  'use strict';

  var pool = document.getElementById('p05-pool');
  if (!pool) return;

  var cards = SP.$$('#p05-pool [role="checkbox"]');
  var coverageEl = document.getElementById('p05-coverage');
  var coverageText = document.getElementById('p05-coverage-text');
  var preview = document.getElementById('p05-preview');
  var why = document.getElementById('p05-why');
  var suggestBtn = document.getElementById('p05-suggest');
  var clearBtn = document.getElementById('p05-clear');

  var CATS = ['typical', 'boundary', 'hard-negative', 'adversarial', 'short', 'english'];
  var NAMES = {
    typical: 'típico',
    boundary: 'fronteira',
    'hard-negative': 'hard negative',
    adversarial: 'adversarial',
    short: 'curto',
    english: 'inglês'
  };
  var MAX = 5;
  var selected = [];

  function dataOf(card) {
    var spans = card.querySelectorAll('span');
    return {
      id: card.dataset.id,
      cat: card.dataset.cat,
      text: spans[1] ? spans[1].textContent.trim() : '',
      label: spans[2] ? spans[2].textContent.replace('→', '').trim() : ''
    };
  }

  function byId(id) {
    for (var i = 0; i < cards.length; i += 1) {
      if (cards[i].dataset.id === id) return cards[i];
    }
    return null;
  }

  function announce(msg) {
    coverageText.textContent = msg;
  }

  function sync() {
    cards.forEach(function (card) {
      var on = selected.indexOf(card.dataset.id) > -1;
      card.setAttribute('aria-checked', on ? 'true' : 'false');
      card.style.borderColor = on ? 'var(--accent)' : 'var(--line)';
      card.style.background = on ? 'color-mix(in srgb, var(--accent) 7%, transparent)' : 'transparent';
      var tag = card.querySelector('span');
      if (tag) {
        tag.textContent = on ? card.dataset.cat + ' · selecionado' : card.dataset.cat;
        tag.style.color = on ? 'var(--accent)' : 'var(--muted)';
      }
    });

    /* cobertura */
    var counts = {};
    CATS.forEach(function (cat) { counts[cat] = 0; });
    selected.forEach(function (id) {
      var card = byId(id);
      if (card) counts[card.dataset.cat] += 1;
    });

    coverageEl.innerHTML = '';
    var missing = [];
    CATS.forEach(function (cat) {
      var chip = document.createElement('span');
      chip.className = 'chip' + (counts[cat] > 0 ? ' is-active' : '');
      chip.textContent = NAMES[cat] + ' · ' + counts[cat];
      coverageEl.appendChild(chip);
      if (!counts[cat]) missing.push(NAMES[cat]);
    });

    if (!selected.length) {
      announce('Nenhum exemplo selecionado. Escolha até cinco.');
    } else {
      var covered = CATS.filter(function (cat) { return counts[cat] > 0; }).length;
      var base = selected.length + (selected.length === 1 ? ' exemplo' : ' exemplos') +
        ' · ' + covered + ' de 6 categorias cobertas.';
      var msg = base + (missing.length ? ' Faltam: ' + missing.join(', ') + '.' : ' Todas as categorias estão representadas.');
      var typicals = counts.typical;
      if (typicals === selected.length) {
        msg += ' Atenção: todos são típicos. O modelo aprende o formato, não a fronteira.';
      } else if (typicals >= 3) {
        msg += ' Atenção: ' + typicals + ' de ' + selected.length + ' são típicos; sobra pouca fronteira.';
      }
      announce(msg + ' Cobertura não é acurácia: falta avaliar no dev.');
    }

    /* prévia do bloco */
    preview.innerHTML = '';
    if (!selected.length) {
      var empty = document.createElement('p');
      empty.className = 'small';
      empty.style.margin = '0';
      empty.textContent = 'Selecione exemplos para montar o bloco do prompt.';
      preview.appendChild(empty);
    } else {
      var head = document.createElement('div');
      head.className = 'mono tiny';
      head.style.color = 'var(--accent)';
      head.textContent = 'EXAMPLES · ' + selected.length + '/5';
      preview.appendChild(head);
      selected.forEach(function (id) {
        var card = byId(id);
        if (!card) return;
        var d = dataOf(card);
        var line = document.createElement('div');
        line.className = 'mono';
        line.style.fontSize = '11px';
        line.style.lineHeight = '1.45';
        line.textContent = d.text + '  →  ' + d.label;
        preview.appendChild(line);
      });
      var tail = document.createElement('div');
      tail.className = 'tiny';
      tail.textContent = 'Regra: o exemplo precisa ensinar a fronteira, não a palavra.';
      preview.appendChild(tail);
    }
  }

  function toggle(card) {
    var id = card.dataset.id;
    var idx = selected.indexOf(id);
    if (idx > -1) {
      selected.splice(idx, 1);
    } else {
      if (selected.length >= MAX) {
        announce('Limite de cinco exemplos. Desmarque um antes de adicionar outro.');
        return;
      }
      selected.push(id);
    }
    why.textContent = '';
    sync();
  }

  cards.forEach(function (card) {
    card.addEventListener('click', function () { toggle(card); });
  });

  suggestBtn.addEventListener('click', function () {
    selected = ['t1', 'b1', 'h1', 'a1', 's1'];
    sync();
    why.textContent = 'Por que este conjunto: t1 ancora o formato; b1 separa “como cancelar” de “quero cancelar”; ' +
      'h1 pune a palavra “cancelado”; a1 ensina que texto é dado, não instrução; s1 ensina a abster em entrada curta. ' +
      'Cinco vagas não cobrem tudo: inglês fica de fora. Se houver code-switch no tráfego, troque s1 por e1 — e aceite a lacuna de abstenção.';
  });

  clearBtn.addEventListener('click', function () {
    selected = [];
    why.textContent = '';
    sync();
  });

  sync();

  /* checkpoint */
  SP.quiz('#check', [
    {
      q: 'Um conjunto com três exemplos de cancelamento, todos contendo a palavra “cancelar”, tende a ensinar o quê?',
      options: [
        'A regra de que ação explícita vence pergunta de processo, mesmo sem contraste.',
        'O atalho “cancelar → cancelamento”: o modelo acerta a paráfrase com a palavra e erra quando a dúvida usa o mesmo verbo.',
        'Apenas o formato da saída, sem nenhum efeito na decisão.',
        'Nada, porque três exemplos são sempre insuficientes para qualquer tarefa.'
      ],
      answer: 1,
      why: 'Exemplos ensinam regra, formato e atalho. Sem um boundary e um hard negative, o atalho lexical domina — e “como faço para cancelar?” continua caindo na classe errada.'
    },
    {
      q: 'O que precisa ficar fora do golden set?',
      options: [
        'Somente os casos do test que o modelo errou.',
        'Todos os casos fáceis, para aumentar a dificuldade da avaliação.',
        'Os casos usados no prompt e suas paráfrases próximas, além de entradas que já trazem o rótulo esperado no texto.',
        'Nada: repetir o prompt no golden set é uma forma válida de medir aderência.'
      ],
      answer: 2,
      why: 'Caso do prompt no golden set mede memorização. Quase-duplicatas e rótulos embutidos no texto fazem o mesmo. O conjunto de avaliação precisa ser disjunto do que foi usado para ensinar.'
    }
  ], {
    checkpoint: true,
    label: 'checkpoint',
    success: 'Você escolhe exemplos pela fronteira que eles ensinam — e sabe o que manter fora da avaliação.',
    fail: 'Releia as seções 02 e 04. O exemplo é evidência da regra; o golden set é a prova independente.'
  });
})();
