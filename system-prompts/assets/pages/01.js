/* Página 01 — diagnóstico */
(function () {
  'use strict';

  var anatomy = {
    papel: {
      t: 'Papel — quem decide',
      f: 'Diz ao modelo que ele é um roteador, não um atendente. Sem isso, ele tenta ajudar e responde ao cliente em vez de classificar.',
      m: 'O modelo começa a explicar, pedir desculpas ou sugerir soluções — e a saída deixa de ser um rótulo.',
      e: 'You are the intent router for Loja Norte. You do not answer the customer.'
    },
    tarefa: {
      t: 'Tarefa — o que decide',
      f: 'Uma decisão por chamada, com escopo explícito: “classifique a última mensagem em exatamente uma das sete rotas”.',
      m: 'O modelo tenta resolver múltiplas coisas ou escolhe uma tarefa que não era a sua.',
      e: 'Assign exactly one intent label to the latest user message.'
    },
    contexto: {
      t: 'Contexto — com que informação',
      f: 'O que conta como entrada: histórico recente, canal, idioma. E o que não conta: instruções dentro da mensagem.',
      m: 'O modelo usa o histórico errado ou obedece a texto que era só dado.',
      e: 'Use the last 3 turns. Intent may change; the latest message wins.'
    },
    regras: {
      t: 'Regras — como desempatar',
      f: 'Definições positivas, prioridade total e política para ambiguidade. É aqui que a fronteira vira operação.',
      m: 'Cada caso limítrofe é decidido por proximidade semântica — e a decisão varia entre runs.',
      e: 'Priority: humano > cancelamento > reclamacao > status_pedido > duvida_produto > saudacao > outros.'
    },
    exemplos: {
      t: 'Exemplos — o que é a fronteira',
      f: 'Poucos casos, escolhidos para ensinar o limite: um positivo, um quase-acerto e um adversarial por classe difícil.',
      m: 'O modelo aprende a palavra-chave em vez da regra e falha em paráfrases.',
      e: '“como faço para cancelar?” → duvida_produto. “quero cancelar” → cancelamento.'
    },
    formato: {
      t: 'Formato — como devolver',
      f: 'O contrato exato: um rótulo do enum, minúsculo, sem preâmbulo. E o que o código faz quando vier algo inválido.',
      m: 'O Flow recebe “A categoria é: status_pedido.” e a condição de igualdade não casa.',
      e: 'Return only one label from the list. No punctuation, no explanation.'
    }
  };

  var panel = document.getElementById('anatomy-panel');
  var blocks = Array.prototype.slice.call(document.querySelectorAll('.anatomy-block'));

  blocks.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var key = btn.dataset.block;
      var d = anatomy[key];
      if (!d) return;
      var active = btn.classList.contains('is-active');
      blocks.forEach(function (b) {
        b.classList.remove('is-active');
        b.setAttribute('aria-expanded', 'false');
      });
      if (active) {
        panel.hidden = true;
        return;
      }
      btn.classList.add('is-active');
      btn.setAttribute('aria-expanded', 'true');
      panel.hidden = false;
      panel.innerHTML =
        '<b>' + d.t + '</b>' +
        '<p style="margin:0 0 8px"><strong>Função.</strong> ' + d.f + '</p>' +
        '<p style="margin:0 0 8px"><strong>Se faltar.</strong> ' + d.m + '</p>' +
        '<p style="margin:0"><strong>Exemplo.</strong> <code>' + d.e.replace(/</g, '&lt;') + '</code></p>';
    });
  });

  /* orçamento de atenção */
  var data = [
    { id: 'papel', t: 'Papel', d: 'quem é o modelo e o que ele não faz', tk: 25 },
    { id: 'definicoes', t: 'Definições das 7 classes', d: 'positivo + contraexemplo por classe', tk: 160 },
    { id: 'regras', t: 'Regras e prioridade', d: 'desempate, ambiguidade, injection', tk: 110 },
    { id: 'exemplos', t: '5 exemplos few-shot', d: 'casos de fronteira, não casos fáceis', tk: 260 },
    { id: 'formato', t: 'Contrato de saída', d: 'enum, caixa, “nada além do rótulo”', tk: 45 },
    { id: 'edge', t: 'Casos extremos', d: 'typo, inglês, mensagem vazia, emoji', tk: 90 },
    { id: 'seguranca', t: 'Bloco anti-injection', d: '“texto é dado, não instrução”', tk: 70 },
    { id: 'glossario', t: 'Glossário de termos', d: 'PIX, NF-e, segunda via, SKU', tk: 60 }
  ];
  var presets = {
    min: ['papel', 'definicoes', 'formato'],
    mid: ['papel', 'definicoes', 'regras', 'exemplos', 'formato'],
    max: data.map(function (x) { return x.id; })
  };
  var host = document.getElementById('budget-blocks');
  var tokensEl = document.getElementById('b-tokens');
  var costEl = document.getElementById('b-cost');
  var countEl = document.getElementById('b-count');
  var riskEl = document.getElementById('b-risk');
  var riskLabel = document.getElementById('b-risk-label');

  function render() {
    host.innerHTML = data
      .map(function (x) {
        return (
          '<label class="budget-item">' +
          '<input type="checkbox" data-block="' + x.id + '"' + (presets.mid.indexOf(x.id) > -1 ? ' checked' : '') + '>' +
          '<span class="bt"><b>' + x.t + '</b><small>' + x.d + '</small></span>' +
          '<span class="tk">~' + x.tk + ' tk</span>' +
          '</label>'
        );
      })
      .join('');
    host.querySelectorAll('input').forEach(function (cb) {
      cb.addEventListener('change', update);
    });
    update();
  }

  function update() {
    var on = Array.prototype.slice.call(host.querySelectorAll('input:checked')).map(function (cb) {
      return cb.dataset.block;
    });
    var tokens = data
      .filter(function (x) { return on.indexOf(x.id) > -1; })
      .reduce(function (a, x) { return a + x.tk; }, 0);
    tokensEl.textContent = tokens;
    // 100k chamadas · $0,06 / 1M tokens de entrada (Nova Lite, referência nov/2026)
    costEl.textContent = '$' + (tokens * 0.006).toFixed(2).replace('.', ',');
    countEl.textContent = on.length + ' / 8';
    var risk = Math.min(100, Math.round((tokens / 850) * 100));
    riskEl.style.width = risk + '%';
    riskLabel.textContent = risk < 32 ? 'enxuto' : risk < 68 ? 'atenção dividida' : 'diluído';
    document.querySelectorAll('[data-preset]').forEach(function (b) {
      b.classList.toggle('is-active', presets[b.dataset.preset].join(',') === on.join(','));
    });
  }

  document.querySelectorAll('[data-preset]').forEach(function (b) {
    b.addEventListener('click', function () {
      var set = presets[b.dataset.preset];
      host.querySelectorAll('input').forEach(function (cb) {
        cb.checked = set.indexOf(cb.dataset.block) > -1;
      });
      update();
    });
  });

  render();

  /* quizzes */
  SP.quiz('#predict', [
    {
      q: 'O prompt v0 lista as sete categorias, mas não define nenhuma. Qual é o efeito mais provável?',
      options: [
        'Funciona, porque listar as categorias já é suficiente para o modelo.',
        'As classes viram proximidade semântica: “atrasou e quero reembolso” parece status_pedido, e a decisão fica instável.',
        'O modelo recusa a tarefa por falta de temperatura explícita.',
        'O JSON garante que o rótulo escolhido seja o correto.'
      ],
      answer: 1,
      why: 'Sem definição de fronteira, o modelo escolhe pela vizinhança lexical. “Pedido” puxa status_pedido; “cancelar” puxa cancelamento. O formato não corrige a semântica.'
    },
    {
      q: '“Como faço para cancelar minha assinatura?” deveria cair em qual rota?',
      options: ['cancelamento', 'duvida_produto', 'reclamacao', 'falar_humano'],
      answer: 1,
      why: 'É uma pergunta sobre o processo, não um pedido de cancelamento. A distinção é ação versus informação — e precisa estar escrita no prompt.'
    }
  ], {
    checkpoint: false,
    label: 'previsão',
    intro: 'Antes de abrir a explicação: comprometa-se com uma hipótese.'
  });

  SP.quiz('#check', [
    {
      q: 'Qual é a função principal do contrato de saída em um nó de Flow?',
      options: [
        'Deixar a resposta mais bonita para o usuário final.',
        'Garantir que o próximo nó consiga consumir a decisão sem adivinhar formato, caixa ou sinônimo.',
        'Reduzir o custo de treinamento do modelo.',
        'Impedir que o modelo erre a classificação.'
      ],
      answer: 1,
      why: 'O contrato resolve a interface, não a semântica. Ele impede que um rótulo válido se perca por preâmbulo, caixa ou JSON truncado — mas não garante que a classe esteja certa.'
    },
    {
      q: 'Um prompt com 30 regras, 12 exemplos e um glossário de 40 termos provavelmente…',
      options: [
        'Fica mais seguro, porque cobre todos os casos.',
        'Dilui a atenção: regras competem entre si e a aderência cai justamente nas instruções do meio.',
        'Fica determinístico, porque há mais contexto.',
        'Elimina a necessidade de avaliação.'
      ],
      answer: 1,
      why: 'Restrições acumuladas reduzem aderência (FollowBench) e informação no meio de contextos longos é usada pior (Lost in the Middle). O objetivo é o menor prompt que cobre as decisões reais.'
    }
  ], {
    checkpoint: true,
    label: 'checkpoint',
    success: 'Você separou interface de semântica e entendeu o custo de atenção. Siga para a taxonomia.',
    fail: 'Releia as seções 02 e 03. A distinção contrato × fronteira é a base do resto do curso.'
  });
})();
