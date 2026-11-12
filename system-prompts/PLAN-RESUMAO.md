# PLANO DE ARQUITETURA COMPLETO: RESUMÃO ANIMADO (`resumao.html`)

## 1. Objetivo e Não-Objetivos
- **Objetivo de produto**: Entregar um deck interativo standalone (`resumao.html`, 12 slides, 6–8 minutos, full-viewport) que sintetiza toda a engenharia de system prompts do curso SYS/PRM aplicada ao classificador de 7 intenções da Loja Norte no Amazon Bedrock (Nova Lite 1.0).
- **Objetivo técnico**: Funcionar 100% offline sob protocolo `file://`, zero etapa de build, zero dependências externas ou CDN, reaproveitando `assets/site.css`, `assets/app.js` (`SP.quiz`, `SP.pct`, `SP.money`, `SP.wilson`, `SP.tokens`, `SP.toast`) e `assets/data/intents.js` (`window.SP_DATA`, `window.SP_CASES`).
- **Diretriz estética inegociável**: Papel `#fff`, tinta `#111`, dark `#0a0a0a`, accent `#E4572E` exclusivo para ação primária, números-chave e estados ativos; bordas `1px solid`; zero `border-radius`, zero `box-shadow`, zero `gradient`, zero emojis; ícones em SVG inline com `stroke-width="1.5"`.
- **Não-objetivo pedagógico**: Substituir os laboratórios extensos das 13 páginas do curso ou duplicar os estilos base já fornecidos por `assets/site.css` (`.lab`, `.quiz`, `.steps`, `.matrix`, `.bar`, `.callout`, `.chip`, `.tabs`).
- **Não-objetivo de integração**: Alterar `site.config`, scripts de build ou arquivos existentes do curso; o integrador externo adicionará apenas 1 link de entrada no hub principal.

---

## 2. Modelo de Navegação, Estados e Acessibilidade Global

### 2.1. Máquina de Estados Central (`RZ.state`)
O deck opera sobre um único objeto de estado reativo em memória, sincronizado com a URL (`location.hash`) e opcionalmente com `sessionStorage` (em bloco `try/catch` para tolerar restrições de `file://`):

```text
RZ.state = {
  slide: 1,               // Inteiro de 1 a 12
  beat: 1,                // Inteiro de 1 até RZ_SLIDES[slide - 1].beats (2 a 4)
  maxBeat: 3,             // Total de beats do slide ativo
  autoplay: false,        // Booleano: reprodução automática ativa/pausada
  reducedMotion: false,   // Booleano lido de matchMedia('(prefers-reduced-motion: reduce)')
  timerId: null,          // ID do setTimeout do autoplay ativo
  interactions: {         // Estado isolado de cada uma das 12 micro-interações
    1: { caseIdx: 0 },
    2: { selectedLabel: null },
    3: { order: ['contrato', 'exemplos', 'regras', 'taxonomia', 'papel', 'entrada'] },
    4: { mode: 'negativa', ruleIdx: 0 },
    5: { pack: 'dez_medianos' },
    6: { rawIdx: 0 },
    7: { temp: 0, maxTokens: 200, stopSeq: false },
    8: { version: 'v1', split: 'dev' },
    9: { transition: 'v1_v2' },
    10: { scenario: 'sem_golden' },
    11: { model: 'lite', cache: false, guardrails: false },
    12: { checks: [false, false, false, false, false, false] }
  }
}
```

### 2.2. Deep Linking e URL (`#/1` a `#/12`)
- **Formato canônico**: `#/1` até `#/12`.
- **Leitura inicial (`parseHash`)**: Extrai regex `/^#\/(\d{1,2})$/`. Se ausente, NaN, `< 1` ou `> 12`, normaliza para `#/1` usando `history.replaceState(null, '', '#/1')`.
- **Mudança de slide**: Atualiza `location.hash = '#/' + slide` ou `history.replaceState` para não poluir o histórico a cada beat. Beats não alteram a URL; entrar num slide via hash inicia em `beat = 1` (ou `beat = maxBeat` se `reducedMotion === true`).
- **Listener `hashchange`**: Permite usar os botões Voltar/Avançar do navegador para alternar slides com limpeza imediata de timers pendentes.

### 2.3. Mapa de Teclado e Proteção de Foco
| Tecla | Condição de Guarda | Ação Executada |
|---|---|---|
| `ArrowRight` ou `Space` | Foco fora de `input`, `select`, `textarea`, `button`, `[role="tab"]`, `[role="radio"]` | Se `beat < maxBeat`, executa `nextBeat()`; senão, se `slide < 12`, executa `goToSlide(slide + 1)`. |
| `ArrowLeft` | Mesma guarda de foco | Se `beat > 1` e `!reducedMotion`, executa `prevBeat()`; senão, se `slide > 1`, executa `goToSlide(slide - 1)`. |
| `Home` | Mesma guarda de foco | Vai para o slide 1 (`goToSlide(1)`). |
| `End` | Mesma guarda de foco | Vai para o slide 12 (`goToSlide(12)`). |
| `KeyP` | Sem tecla modificadora (`Ctrl`, `Alt`, `Meta`) e fora de campos | Alterna `toggleAutoplay()`. |
| `KeyR` | Sem tecla modificadora (`Ctrl`, `Alt`, `Meta`) e fora de campos | Executa `resetCurrentSlide()` (`Shift + KeyR` executa `resetAllSlides()`). |

### 2.4. Gestos Touch / Swipe
- Implementado via `pointerdown` e `pointerup` no elemento `<main id="rz-deck">` (apenas quando `e.pointerType === 'touch'`).
- **Critério de disparo**: `Math.abs(deltaX) >= 48` pixels e `Math.abs(deltaY) <= 30` pixels em janela de tempo `<= 600ms`.
- **Ignorar em áreas interativas**: Se `e.target.closest('.rz-interactive, button, select, input, .matrix, .tabs')` for verdadeiro, o gesto de swipe é abortado para não conflitar com scroll horizontal de tabelas ou cliques em controles.
- `deltaX < -48` aciona `stepForward()` (próximo beat ou slide); `deltaX > 48` aciona `prevSlide()`.

### 2.5. Barra de Progresso, Contador e Autoplay
- **Barra de progresso superior (`.rz-progress`)**: Largura total da viewport, altura `2px`, fundo `#e5e5e5`, preenchimento `.rz-bar-fill` em `#E4572E` com largura calculada por `((slide - 1 + (beat / maxBeat)) / 12) * 100 + '%'`.
- **Contador numérico (`#rz-counter`)**: Exibe `01/12` até `12/12` com `font-variant-numeric: tabular-nums`, acompanhado de indicadores visuais de beat (`[■][■][□]`) clicáveis.
- **Autoplay**:
  - Quando ativado (`aria-pressed="true"`), agenda `setTimeout` de `2.400ms` entre beats do mesmo slide e `3.600ms` no último beat antes de avançar ao próximo slide.
  - Ao chegar no último beat do slide 12, desliga automaticamente (`autoplay = false`).
  - Qualquer clique manual dentro de `.rz-interactive`, tecla de navegação ou evento `document.hidden === true` (`visibilitychange`) pausa o autoplay imediatamente para não atropelar a leitura do usuário.

### 2.6. Comportamento sob `prefers-reduced-motion: reduce`
- Detectado na inicialização e monitorado via `matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', ...)`.
- Quando ativo:
  1. Toda entrada em slide define imediatamente `beat = maxBeat` (todos os beats aparecem visíveis de uma vez).
  2. O botão "Próximo beat" fica desabilitado (`disabled`, `aria-disabled="true"`) e a navegação avança diretamente de slide em slide.
  3. Todas as durações de transição CSS caem para `0ms !important`.
  4. O autoplay inicia desligado e, se acionado pelo usuário, apenas troca de slide a cada `5.000ms` sem animação intermediária.

---

## 3. Sistema de Animação (Beats, Classes CSS e Timeline)

### 3.1. Regras e Restrições de Estilo
- **Duração máxima**: `220ms` para revelação de beat (limite estrito do projeto: `<= 400ms`).
- **Troca de slide**: Corte seco (`0ms`) estilo caderno técnico, resetando o scroll interno do palco para o topo (`scrollTop = 0`).
- **Proibições visuais**: Nenhum `border-radius`, nenhum `box-shadow`, nenhum `linear-gradient` ou `radial-gradient`, nenhuma biblioteca CSS/JS.

### 3.2. Especificação das Classes `.rz-*`
```css
.rz-body {
  margin: 0;
  background: #fff;
  color: #111;
  overflow: hidden;
  height: 100vh;
  display: grid;
  grid-template-rows: 56px 1fr;
}
.rz-top {
  border-bottom: 1px solid #111;
  background: #fff;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.rz-progress {
  width: 100%;
  height: 3px;
  background: #e5e5e5;
}
.rz-bar-fill {
  height: 100%;
  background: #E4572E;
  transition: width 180ms linear;
}
.rz-deck {
  height: calc(100vh - 56px);
  overflow: hidden;
  position: relative;
}
.rz-slide {
  display: none;
  height: 100%;
  overflow-y: auto;
  padding: 24px 32px;
  box-sizing: border-box;
  grid-template-rows: auto 1fr auto;
  gap: 20px;
  max-width: 1280px;
  margin: 0 auto;
}
.rz-slide.is-active {
  display: grid;
}
.rz-stage {
  display: grid;
  grid-template-columns: 5fr 7fr;
  gap: 24px;
  align-items: start;
}
.rz-beat {
  opacity: 0;
  transform: translateY(8px);
  pointer-events: none;
  transition: opacity 220ms linear, transform 220ms linear;
}
.rz-beat.is-visible {
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
}
.rz-interactive {
  border: 1px solid #111;
  background: #fff;
  padding: 16px;
}
.rz-interactive.is-dark {
  background: #0a0a0a;
  color: #fff;
  border-color: #111;
}
.rz-accent {
  color: #E4572E;
  font-weight: 700;
}
.rz-btn-active {
  background: #E4572E !important;
  color: #fff !important;
  border-color: #111 !important;
}
@media (max-width: 900px) {
  .rz-body { overflow: auto; height: auto; min-height: 100vh; }
  .rz-deck { height: auto; overflow: visible; }
  .rz-slide { height: auto; padding: 16px; }
  .rz-stage { grid-template-columns: 1fr; }
}
@media (prefers-reduced-motion: reduce) {
  .rz-beat, .rz-bar-fill {
    transition-duration: 0ms !important;
    transform: none !important;
  }
}
```

---

## 4. Tabela Consolidada dos 12 Slides

| Nº | Título | 3 Pontos-Chave | Micro-Interação (Input -> Feedback) | Beats (2–4) |
|---|---|---|---|---|
| 01 | Diagnóstico: O Ralo dos 31% em Outros | 1. No estado v0 narrativo, 31% dos chamados da Loja Norte caem no balde genérico `outros`.<br>2. O prompt inicial v1 acerta apenas 67,0% no dev set (88 casos) e 62,9% no test set (62 casos).<br>3. Sem critérios de fronteira, o modelo confunde desabafo emocional com a ação operacional da fila. | Selecionar 1 de 3 casos do dev set de `window.SP_DATA` -> compara o chute errado da v1 com o label correto e exibe a fila de destino desperdiçada. | B1: Placar v0 (31% em `outros`) e baseline v1 (67,0% dev / 62,9% test).<br>B2: Inspecionador interativo de 3 casos do dev set.<br>B3: Diagnóstico da causa-raiz (ausência de definições operacionais). |
| 02 | Taxonomia: Label É Ação de Roteamento | 1. Classificar intenção é decidir qual equipe ou sistema age agora, não rotular o humor do cliente.<br>2. As 7 classes fechadas cobrem toda a operação: `saudacao`, `duvida_produto`, `status_pedido`, `reclamacao`, `cancelamento`, `falar_humano` e `outros`.<br>3. Mensagens com múltiplas intenções obedecem à prioridade estrita: `falar_humano > cancelamento > reclamacao > status_pedido > duvida_produto > saudacao > outros`. | Resolver 3 mensagens com dupla intenção clicando no label vencedor -> aplica a régua de tie-break e mostra o salto da v2 (+ Definições) para 83,0% no dev. | B1: Os 7 labels fechados e suas filas.<br>B2: Régua de precedência explícita.<br>B3: Arena de desempate + resultado v1->v2 (83,0% dev / 80,6% test). |
| 03 | Estrutura: Ordem Vence Prosa | 1. Um system prompt de produção organiza-se em blocos demarcados: Papel, Taxonomia, Regras, Exemplos, Entrada e Contrato.<br>2. As instruções de restrição crítica ficam coladas ao dado de entrada para reduzir perda de atenção.<br>3. O contrato de saída fecha o prompt como última instrução antes da geração dos tokens. | Reordenar 4 blocos estruturais com botões Subir/Descer -> valida a checklist de arquitetura (sem prometer ganho mágico de acurácia isolado da semântica). | B1: Anatomia em blocos vs parágrafo monolítico.<br>B2: Construtor interativo de ordem de blocos.<br>B3: Veredito arquitetural (manutenibilidade, cacheabilidade e ancoragem final). |
| 04 | Regras de Decisão: Positivas e Atômicas | 1. Escrever uma regra por linha no formato condicional explícito (`SE condição -> ENTÃO label`).<br>2. Instruções afirmativas orientam melhor a distribuição de probabilidade do que listas de proibições.<br>3. Cada regra resolve uma fronteira ambígua recorrente observada nos erros do conjunto de desenvolvimento. | Alternar entre redação negativa/vaga e redação positiva/atômica em 3 fronteiras críticas -> exibe a queda de tokens via `SP.tokens` e elimina ambiguidade. | B1: Princípio 1 regra por linha + comando positivo.<br>B2: Laboratório de reescrita de regras.<br>B3: Impacto em tokens e previsibilidade de fronteira. |
| 05 | Few-Shot: 3 Bons > 10 Medianos (e os 5 da v3) | 1. Três exemplos de fronteira bem escolhidos superam dez exemplos fáceis e redundantes.<br>2. Bons exemplos operam como hard negatives: pares quase idênticos na superfície, mas com labels distintos.<br>3. Na Loja Norte, adicionar 5 exemplos cirúrgicos na v3 (+ Few-shot) elevou o dev de 83,0% para 89,8% (test: 90,3%). | Comparar o pacote inchado (10 exemplos óbvios) com o pacote enxuto da v3 (5 hard negatives) -> mostra custo em tokens e ganho real v2->v3 (+6 corrigidos, 0 quebrados). | B1: Regra de bolso (3 bons > 10 medianos) e conceito de hard negative.<br>B2: Seletor comparativo de pacotes de exemplos.<br>B3: Resultado empírico v3 (89,8% dev / 90,3% test, p≈0,031). |
| 06 | Contrato de Saída: Label Plano vs JSON | 1. O Nova Lite 1.0 não possui structured outputs nativos; exigir label plano em linha única é o contrato mais rápido e barato.<br>2. Quando o sistema consumidor exige JSON, a saída deve ser tratada como probabilística e validada em código.<br>3. A pipeline de defesa aplica validação estrita de schema e enum, faz no máximo 1 retry e cai em fallback `outros`. | Injetar 4 respostas brutas do modelo no validador -> percorre visualmente as etapas Validar, 1 Retry e Fallback `outros` com contagem de tokens gastos. | B1: Limitação do Nova Lite 1.0 e vantagem do label plano.<br>B2: Simulador de pipeline de validação e retry.<br>B3: Regra operacional de contenção (`outros`). |
| 07 | Temperatura e Inferência no Nova Lite 1.0 | 1. `temperature: 0` seleciona o token mais provável (greedy), mas não garante determinismo absoluto em ponto flutuante.<br>2. A configuração enxuta do classificador trava `temperature: 0`, `topP: 0.9`, `maxTokens: 8` e `stopSequences: ["\n"]`.<br>3. No Nova Lite 1.0 (300K contexto, 10K saída, tool use client-side, sem toggle de raciocínio), limitar tokens impede explicações parasitas. | Alternar entre preset frouxo (`maxTokens: 200` sem stop sequence) e preset travado (`maxTokens: 8`, `stopSequences: ["\n"]`) -> compara saída gerada e desperdício de tokens. | B1: Especificações técnicas do Amazon Nova Lite 1.0.<br>B2: Painel interativo de parâmetros de inferência.<br>B3: Diferença entre greedy decoding e determinismo absoluto. |
| 08 | Avaliação: Golden Set 88/62, Macro-F1 e IC de Wilson | 1. O dataset sintético/didático de 150 casos é congelado em 88 casos de dev (para iterar) e 62 de test (blind final).<br>2. Acurácia global mascara falhas em classes pequenas; a decisão técnica exige olhar a matriz de confusão e o Macro-F1.<br>3. Com amostras finitas (88 e 62), toda porcentagem deve ser lida com seu intervalo de confiança de Wilson (`SP.wilson`). | Selecionar versão (`v1` a `v4`) e partição (`dev` 88 ou `test` 62) -> calcula acurácia, IC de Wilson 95% via `SP.wilson` e exibe os pares de confusão reais de `SP_DATA`. | B1: Higiene de dados (88 dev vs 62 test).<br>B2: Explorador de métricas v1–v4 com `SP.wilson` e matriz.<br>B3: Por que nunca ajustar regras olhando o conjunto de teste. |
| 09 | O Loop de Iteração: 1 Mudança e Teste de McNemar | 1. Cada versão altera apenas uma dimensão por vez, guiada pela análise dos erros da versão anterior.<br>2. Na comparação pareada sobre os mesmos 62 casos do test, importam apenas os casos que mudaram de lado: corrigidos vs quebrados.<br>3. O teste de McNemar confirma significância em v1->v2 (11/0, p≈0,001) e v2->v3 (6/0, p≈0,031), mas mostra v3->v4 (3/1, p=0,625) como estatisticamente não significativo (NS). | Inspecionar as 3 transições (`v1->v2`, `v2->v3`, `v3->v4`) -> exibe a tabela 2x2 de discordância, o p-valor exato e o veredito de engenharia. | B1: Disciplina científica (1 variável por vez + error analysis).<br>B2: Analisador pareado de McNemar nas 3 transições.<br>B3: Interpretação prática do `p=0,625 (NS)` na v4 (93,2% dev / 93,5% test). |
| 10 | Automação: DSPy, GEPA, OPRO, APE e promptfoo | 1. `promptfoo` automatiza bateria de regressão em CI; APE, OPRO, DSPy e GEPA buscam instruções e exemplos automaticamente.<br>2. Otimizadores automáticos exigem golden set confiável, métrica clara e orçamento para centenas de chamadas ao modelo.<br>3. O modelo-alvo deve permanecer fixo (Nova Lite 1.0) durante toda a busca, pois prompts otimizados em outro LLM não transferem ganho. | Escolher o estágio atual do time em 4 cenários -> recebe a recomendação da ferramenta adequada (ou alerta de bloqueio se faltar base manual). | B1: Papel de cada ferramenta (`promptfoo`, APE, OPRO, DSPy, GEPA).<br>B2: Seletor de diagnóstico de maturidade para automação.<br>B3: Regra do modelo-alvo fixo e controle de orçamento de avaliação. |
| 11 | Produção: Segurança, Cache, Guardrails e Custo Real | 1. Blindar a entrada com delimitadores claros, validação pós-modelo, logging estruturado e Bedrock Guardrails (cobrados por 1.000 chars por política).<br>2. O Prompt Caching no Bedrock exige mínimo de 1.000 tokens, tem TTL de 5 minutos e suporta até 4 checkpoints.<br>3. A tabela por 1M de tokens (Lite $0,06/$0,24; Micro $0,035/$0,14; Pro $0,80/$3,20) e o EOL do Lite 1.0 após dez/2025 (migrar para Nova 2 Lite) guiam o TCO. | Simular volume e alternar família Nova (Micro, Lite, Pro) e Prompt Cache sobre a premissa didática (1.200 tokens in, 8 out) -> calcula fatura via `SP.money`. | B1: Defesa em profundidade (injection, Guardrails, logs).<br>B2: Regras de Prompt Caching (1.000 tokens, 5 min, 4 checkpoints) e EOL dez/2025.<br>B3: Calculadora financeira explícita com `SP.money`. |
| 12 | Cheat Sheet e Caixa de Ferramentas Final | 1. Síntese operacional completa: 7 labels, cadeia de prioridade, config `temp 0 / topP 0.9 / maxTokens 8 / stop ["\n"]` e contrato plano.<br>2. Trajetória auditada: Dev `67,0% -> 83,0% -> 89,8% -> 93,2%` e Test `62,9% -> 80,6% -> 90,3% -> 93,5%`.<br>3. Checklist final de prontidão destrava o template canônico do System Prompt v4 pronto para cópia. | Marcar os 6 critérios de prontidão de engenharia e acionar "Copiar System Prompt Canônico" -> valida prontidão e dispara `SP.toast`. | B1: Quadro-resumo de todos os números e parâmetros congelados.<br>B2: Checklist interativo de aceite de produção.<br>B3: Visualizador e botão de cópia do System Prompt final. |

---

## 5. Copy Final em pt-BR e Wireframe de Cada Slide (Slides 01 a 12)

### Convenção de Layout do Palco (`.rz-slide`)
Cada slide possui 3 faixas verticais fixas:
1. **Cabeçalho do Slide (`.rz-head`)**: Sempre visível desde a entrada (`beat >= 1`). Contém o `kicker` (caixa alta, `12px`, `#E4572E` para número do módulo + `#111` para categoria) e o `h1` (`28px`, peso 700, linha seca).
2. **Palco Principal (`.rz-stage`)**: Grid de 2 colunas em desktop (`5fr` à esquerda para os 3 pontos-chave e síntese conceitual; `7fr` à direita para a bancada interativa `.rz-interactive`).
3. **Rodapé do Slide (`.rz-foot`)**: Aparece no último beat (`data-beat="3"`). Contém um `.callout` de 1 linha com a regra de bolso ("Leve para produção") e o botão local "Resetar interação".

---

### SLIDE 01 — Diagnóstico: O Ralo dos 31% em Outros
- **Kicker**: `SLIDE 01 / 12 · DIAGNÓSTICO DE BASELINE`
- **Título (`h1`)**: `Diagnóstico: O Ralo dos 31% em Outros`
- **3 Pontos-Chave (Coluna Esquerda — Beat 1)**:
  1. `No estado v0 narrativo da Loja Norte, 31% das mensagens reais dos clientes caem na categoria residual outros, gerando fila manual cara.`
  2. `Ao medir o prompt inicial v1 no dataset sintético/didático de 150 casos (88 dev + 62 test), a acurácia é de apenas 67,0% no dev e 62,9% no test.`
  3. `Sem definições operacionais, o modelo classifica pelo tom emocional do texto ou hesita diante de qualquer ambiguidade.`
- **Bancada Interativa (Coluna Direita — Beat 2)**:
  - **Título da bancada**: `Inspecionador de Falhas da Baseline v1 (Dados do Dev Set em SP_DATA)`
  - **Texto de apoio**: `Selecione um chamado real para comparar a predição da v1 com o gabarito operacional da Loja Norte.`
  - **Botões seletores**: `Caso 01: Desabafo + Pedido` | `Caso 02: Atraso Crítico` | `Caso 03: Dúvida Ambígua`
  - **Rótulos do painel de resultado**: `Mensagem do Cliente` / `Predição v1 (67,0% dev)` / `Gabarito Oficial` / `Consequência Operacional`
  - **Mensagens de feedback por caso**:
    - Caso 01: `Falha v1: o modelo desviou para outros/reclamacao por falta de critério objetivo de roteamento. Custo: transbordo desnecessário.`
    - Caso 02: `Falha v1: o modelo confundiu consulta de rastreio com reclamação genérica sem checar se o prazo venceu.`
    - Caso 03: `Falha v1: na dúvida entre catálogo e suporte, o prompt vago empurrou o chamado para a vala comum de outros.`
  - **Botão de reset**: `Resetar caso`
- **Síntese de Rodapé (Beat 3)**:
  - **Callout**: `Regra 01: Você não conserta um prompt no escuro. Meça o vazamento em outros e separe 88 casos de dev e 62 de test antes de editar uma palavra.`
- **Wireframe por Beat**:
  - `Beat 1`: Revela cabeçalho + 3 pontos-chave + placar numérico em destaque (`31%` em `outros` no v0; `67,0%` dev / `62,9%` test na v1).
  - `Beat 2`: Revela a bancada `.rz-interactive` com os 3 seletores de casos de `window.SP_DATA` e o comparador lado a lado.
  - `Beat 3`: Revela o `.callout` de rodapé com a regra de diagnóstico.

---

### SLIDE 02 — Taxonomia: Label É Ação de Roteamento
- **Kicker**: `SLIDE 02 / 12 · TAXONOMIA E PRECEDÊNCIA`
- **Título (`h1`)**: `Taxonomia: Label É Ação de Roteamento`
- **3 Pontos-Chave (Coluna Esquerda — Beat 1)**:
  1. `Uma label de intenção não descreve o sentimento do cliente; ela dispara a fila exata de atendimento que deve agir sobre o ticket.`
  2. `O espaço de saída é fechado em 7 labels: saudacao, duvida_produto, status_pedido, reclamacao, cancelamento, falar_humano e outros.`
  3. `Quando o cliente mistura duas intenções na mesma mensagem, aplica-se a prioridade estrita: falar_humano > cancelamento > reclamacao > status_pedido > duvida_produto > saudacao > outros.`
- **Bancada Interativa (Coluna Direita — Beat 2)**:
  - **Título da bancada**: `Simulador de Tie-Break (+ Definições na v2)`
  - **Texto de apoio**: `Mensagem recebida: "Meu pedido 4819 está atrasado há uma semana, quero cancelar essa compra ou falar com um atendente humano agora!" — Qual label deve vencer?`
  - **Botões de ação (7 chips)**: `saudacao` | `duvida_produto` | `status_pedido` | `reclamacao` | `cancelamento` | `falar_humano` | `outros`
  - **Mensagens de feedback**:
    - Se clicar em `falar_humano` (Correto): `CORRETO: falar_humano está no topo da cadeia de prioridade (falar_humano > cancelamento > reclamacao > status_pedido...). Definir fronteiras e prioridade levou a v2 (+ Definições) de 67,0% para 83,0% no dev (80,6% no test).`
    - Se clicar em `cancelamento`: `INCORRETO: Embora o cliente cite cancelar, o pedido explícito por atendente humano tem precedência máxima: falar_humano > cancelamento.`
    - Se clicar em `reclamacao` ou `status_pedido`: `INCORRETO: Há atraso e insatisfação, mas na cadeia falar_humano > cancelamento > reclamacao > status_pedido, o transbordo humano vence.`
    - Se clicar em `duvida_produto`, `saudacao` ou `outros`: `INCORRETO: A mensagem exige ação crítica imediata. Pela régua de prioridade, o label obrigatório é falar_humano.`
  - **Botão de reset**: `Limpar escolha`
- **Síntese de Rodapé (Beat 3)**:
  - **Callout**: `Regra 02: Na versão v2 (+ Definições), explicitar o que cada label inclui/exclui e a ordem de desempate corrigiu 11 casos no test sem quebrar nenhum (p≈0,001); no dev, 67,0% -> 83,0%.`
- **Wireframe por Beat**:
  - `Beat 1`: Revela os 3 pontos + faixa horizontal com os 7 labels e setas de precedência `>`.
  - `Beat 2`: Revela o card da mensagem multi-intenção e os 7 botões `.chip` interativos.
  - `Beat 3`: Revela o placar da evolução `v1 (67,0%) -> v2 (83,0%)` e o `.callout` final.

---

### SLIDE 03 — Estrutura: Ordem Vence Prosa
- **Kicker**: `SLIDE 03 / 12 · ARQUITETURA DO DOCUMENTO`
- **Título (`h1`)**: `Estrutura: Ordem Vence Prosa`
- **3 Pontos-Chave (Coluna Esquerda — Beat 1)**:
  1. `Substitua parágrafos corridos por seções nomeadas e isoladas: Papel, Taxonomia, Regras de Decisão, Exemplos, Dado de Entrada e Contrato de Saída.`
  2. `Posicione instruções críticas e restrições perto do dado de entrada para evitar diluição no meio do contexto.`
  3. `Feche o prompt sempre com o contrato de saída imediatamente antes da geração para ancorar o formato do primeiro token.`
- **Bancada Interativa (Coluna Direita — Beat 2)**:
  - **Título da bancada**: `Construtor de Anatomia do Prompt (4 Blocos Essenciais)`
  - **Texto de apoio**: `Use os botões Subir (↑) e Descer (↓) para colocar os blocos na sequência canônica de engenharia. Nota: boa estrutura organiza a manutenção e o cache, mas não substitui as definições semânticas da v2.`
  - **Itens reordenáveis (Estado inicial embaralhado)**:
    1. `[Bloco D] Contrato de Saída (Responda apenas com 1 dos 7 labels)`
    2. `[Bloco B] Exemplos Few-Shot de Fronteira`
    3. `[Bloco A] Papel + Taxonomia + Regras de Prioridade`
    4. `[Bloco C] Mensagem do Cliente delimitada (<mensagem>...</mensagem>)`
  - **Botões por item**: `↑ Subir` | `↓ Descer`
  - **Mensagens de feedback**:
    - Enquanto fora da ordem `[A, B, C, D]`: `Diagnóstico estrutural: Atenção! O Contrato de Saída precisa ficar no fim (após a mensagem do cliente) e as Definições/Regras devem preceder os Exemplos.`
    - Quando na ordem exata `[A, B, C, D]`: `ESTRUTURA CANÔNICA ATINGIDA: 1. Papel/Taxonomia/Regras (prefixo estático) -> 2. Exemplos -> 3. Entrada delimitada -> 4. Contrato colado ao fim. Prompt legível, auditável e pronto para Prompt Caching.`
  - **Botão de reset**: `Embaralhar blocos`
- **Síntese de Rodapé (Beat 3)**:
  - **Callout**: `Regra 03: Ordem estrutural não cria inteligência sozinha, mas garante que o prefixo estático fique no topo (para cache) e o contrato de saída fique colado ao final.`
- **Wireframe por Beat**:
  - `Beat 1`: Revela os 3 pontos + diagrama comparativo "Prosa Monolítica vs Seções Demarcadas".
  - `Beat 2`: Revela a lista reordenável de 4 blocos com indicadores de conformidade (Prefixo Estático / Proximidade do Dado / Ancoragem Final).
  - `Beat 3`: Revela o `.callout` final reforçando a separação entre organização estrutural e ganho semântico.

---

### SLIDE 04 — Regras de Decisão: Positivas e Atômicas
- **Kicker**: `SLIDE 04 / 12 · ENGENHARIA DE REGRAS`
- **Título (`h1`)**: `Regras de Decisão: Positivas e Atômicas`
- **3 Pontos-Chave (Coluna Esquerda — Beat 1)**:
  1. `Escreva exatamente uma regra de decisão por linha usando condição verificável: SE [sinal explícito no texto] -> ENTÃO [label].`
  2. `Prefira formulações positivas ("Classifique como status_pedido quando...") em vez de negações encadeadas ("Não use reclamacao se não houver...").`
  3. `Resolva colisões apontando explicitamente para a cadeia de prioridade de tie-break, sem deixar o desempate para a criatividade do modelo.`
- **Bancada Interativa (Coluna Direita — Beat 2)**:
  - **Título da bancada**: `Refinador de Regras: Negativa Prolixa vs Positiva Atômica`
  - **Texto de apoio**: `Compare como a reescrita afirmativa reduz tokens (via SP.tokens) e elimina dupla interpretação na fronteira entre status_pedido e reclamacao.`
  - **Botões de seleção de fronteira**: `Fronteira 1: Prazo vs Atraso` | `Fronteira 2: Preço vs Cancelamento`
  - **Botões de modo**: `Versão Negativa e Prolixa` | `Versão Positiva e Atômica`
  - **Textos comparados**:
    - Fronteira 1 (Negativa): `"Não classifique como reclamacao se o cliente não estiver xingando ou se o prazo ainda não tiver expirado, não deixe de usar status_pedido quando for só pergunta de entrega."`
    - Fronteira 1 (Positiva): `"SE o cliente pergunta onde está o pedido dentro do prazo -> status_pedido. SE relata prazo vencido, avaria ou erro de cobrança -> reclamacao."`
    - Fronteira 2 (Negativa): `"Evite marcar cancelamento quando a pessoa só reclamar que achou caro mas não pedir para encerrar a compra atual."`
    - Fronteira 2 (Positiva): `"SE há pedido explícito para desistir ou estornar compra existente -> cancelamento. SE há queixa de valor após compra sem pedir estorno -> reclamacao."`
  - **Mensagens de feedback**:
    - Modo Negativo: `ALERTA: Múltiplas negações ("Não classifique... se não estiver... não deixe de...") aumentam o custo em tokens e confundem modelos compactos como o Nova Lite 1.0.`
    - Modo Positivo: `ÓTIMO: Condição SE -> ENTÃO direta, atômica e verificável. Menos tokens de entrada e fronteira inequívoca entre classes vizinhas.`
  - **Botão de reset**: `Voltar para versão negativa`
- **Síntese de Rodapé (Beat 3)**:
  - **Callout**: `Regra 04: Uma linha = uma regra = uma condição positiva. Se você precisou escrever "não" três vezes na mesma frase, reescreva como critério de inclusão.`
- **Wireframe por Beat**:
  - `Beat 1`: Revela os 3 pontos + fórmula visual `SE [critério observável] -> ENTÃO [label]`.
  - `Beat 2`: Revela a bancada com seletor de fronteira, toggle Negativa/Positiva, contador `SP.tokens` ao vivo e diagnóstico.
  - `Beat 3`: Revela o `.callout` de rodapé.

---

### SLIDE 05 — Few-Shot: 3 Bons > 10 Medianos (e os 5 da v3)
- **Kicker**: `SLIDE 05 / 12 · SELEÇÃO DE EXEMPLOS`
- **Título (`h1`)**: `Few-Shot: 3 Bons > 10 Medianos`
- **3 Pontos-Chave (Coluna Esquerda — Beat 1)**:
  1. `Poucos exemplos cirúrgicos (3 bons superam 10 medianos) ensinam mais do que dezenas de frases óbvias que o modelo já acerta em zero-shot.`
  2. `Priorize hard negatives: pares de mensagens parecidas na superfície, mas que pertencem a labels diferentes por um detalhe de regra.`
  3. `No experimento da Loja Norte, a versão v3 (+ Few-shot com 5 exemplos de fronteira) elevou a acurácia no dev de 83,0% para 89,8% e no test de 80,6% para 90,3%.`
- **Bancada Interativa (Coluna Direita — Beat 2)**:
  - **Título da bancada**: `Simulador de Curadoria Few-Shot: Volume vs Fronteira`
  - **Texto de apoio**: `Alterne entre um pacote inchado de casos fáceis e o pacote v3 (+ Few-shot, 5 exemplos de fronteira) para ver o efeito nas colisões do dev set.`
  - **Botões seletores**: `Pacote A: 10 Exemplos Óbvios ("Bom dia", "Quero cancelar")` | `Pacote B (v3): 5 Exemplos de Fronteira (Hard Negatives)`
  - **Conteúdo exibido no Pacote B (v3)**:
    - Exemplo 1 (`status_pedido` vs `reclamacao`): `"Pedido 9012 feito ontem, qual o código de rastreio?" -> status_pedido`
    - Exemplo 2 (`reclamacao` vs `status_pedido`): `"Pedido 9012 atrasado há 10 dias e ninguém responde!" -> reclamacao`
    - Exemplo 3 (`cancelamento` vs `falar_humano`): `"Cancelem minha assinatura e me passem um atendente humano já." -> falar_humano`
    - Exemplo 4 (`duvida_produto` vs `status_pedido`): `"Essa cafeteira 220v tem pronta entrega para o CEP 01001-000?" -> duvida_produto`
    - Exemplo 5 (`outros` legítimo): `"Vocês têm vaga aberta para trabalhar no estoque?" -> outros`
  - **Mensagens de feedback**:
    - Pacote A: `INEFICIENTE: Gasta mais tokens repetindo casos triviais que a v2 (83,0% dev) já acertava, sem resolver colisões entre status_pedido, reclamacao e falar_humano.`
    - Pacote B (v3): `EFICIENTE (v3 + Few-shot): Com 5 exemplos focados nas fronteiras reais de erro, a acurácia salta de 83,0% para 89,8% no dev e chega a 90,3% no test (+6 corrigidos, 0 quebrados, p≈0,031).`
  - **Botão de reset**: `Voltar ao Pacote A`
- **Síntese de Rodapé (Beat 3)**:
  - **Callout**: `Regra 05: Só adicione um exemplo ao prompt se ele iluminar uma fronteira onde a versão anterior errou no conjunto de desenvolvimento.`
- **Wireframe por Beat**:
  - `Beat 1`: Revela os 3 pontos + comparativo conceitual "Caso Óbvio vs Hard Negative".
  - `Beat 2`: Revela a bancada com os 2 pacotes, lista de exemplos, contagem de tokens (`SP.tokens`) e barra de acurácia (`83,0% -> 89,8%`).
  - `Beat 3`: Revela o `.callout` final com o resultado estatístico `6 corrigidos, 0 quebrados, p≈0,031` no test.

---

### SLIDE 06 — Contrato de Saída: Label Plano vs JSON
- **Kicker**: `SLIDE 06 / 12 · CONTRATO E RESILIÊNCIA`
- **Título (`h1`)**: `Contrato de Saída: Label Plano vs JSON`
- **3 Pontos-Chave (Coluna Esquerda — Beat 1)**:
  1. `O Amazon Nova Lite 1.0 não possui structured outputs nativos; exigir apenas o label plano em linha única reduz latência, custo e risco de erro sintático.`
  2. `Se a arquitetura exigir JSON, trate a resposta como probabilística: nunca faça JSON.parse direto sem validação de schema e de enum dos 7 labels.`
  3. `O protocolo de resiliência em produção é determinístico: Validar no código -> 1 Retry curto se falhar -> Fallback seguro para outros.`
- **Bancada Interativa (Coluna Direita — Beat 2)**:
  - **Título da bancada**: `Testador de Pipeline de Saída e Contenção`
  - **Texto de apoio**: `Dispare uma resposta bruta do modelo para inspecionar o comportamento do validador em código.`
  - **Botões de entrada simulada**:
    - `Entrada 1 (Label Plano): status_pedido`
    - `Entrada 2 (JSON Válido): {"intent":"reclamacao"}`
    - `Entrada 3 (JSON Truncado): {"intent":"cancelamento"`
    - `Entrada 4 (Label Alucinado): suporte_tecnico_urgente`
  - **Rótulos da pipeline visual**: `[1. Resposta Bruta]` -> `[2. Validador de Enum/JSON]` -> `[3. Retry (máx 1)]` -> `[4. Fila Final]`
  - **Mensagens de feedback**:
    - Entrada 1: `PASSOU DE PRIMEIRA: Label plano pertence ao enum dos 7 labels. Zero overhead de chaves/aspas, 0 retries, roteado para status_pedido.`
    - Entrada 2: `PASSOU COM CUSTO EXTRA: JSON válido e label dentro do enum, mas consumiu tokens extras de formatação sem ganho de acurácia.`
    - Entrada 3: `FALHA SINTÁTICA -> 1 RETRY -> RECUPERADO/FALLBACK: JSON truncado falhou no parse. O código dispara no máximo 1 retry; se persistir inválido, aplica fallback para outros.`
    - Entrada 4: `VIOLAÇÃO DE ENUM -> 1 RETRY -> FALLBACK OUTROS: Label fora das 7 classes permitidas. Após 1 tentativa de correção sem sucesso, o chamado é contido com segurança em outros.`
  - **Botão de reset**: `Resetar testador`
- **Síntese de Rodapé (Beat 3)**:
  - **Callout**: `Regra 06: Para classificar 1 entre 7 intenções no Nova Lite 1.0, prefira label plano. Se usar JSON, valide no código, permita 1 retry e tenha fallback para outros.`
- **Wireframe por Beat**:
  - `Beat 1`: Revela os 3 pontos + tabela comparativa "Label Plano vs JSON no Nova Lite 1.0".
  - `Beat 2`: Revela o simulador de 4 entradas com o diagrama de estados da pipeline iluminando o caminho percorrido.
  - `Beat 3`: Revela o `.callout` de rodapé.

---

### SLIDE 07 — Temperatura e Inferência no Nova Lite 1.0
- **Kicker**: `SLIDE 07 / 12 · PARÂMETROS DO MODELO`
- **Título (`h1`)**: `Temperatura e Inferência no Nova Lite 1.0`
- **3 Pontos-Chave (Coluna Esquerda — Beat 1)**:
  1. `Configurar temperature: 0 ativa a decodificação greedy (escolhe sempre o token mais provável), mas greedy não significa determinismo matemático absoluto.`
  2. `O perfil canônico do classificador usa temperature: 0, topP: 0.9, maxTokens: 8 e stopSequences: ["\n"] com saída em label plano.`
  3. `Limites do Amazon Nova Lite 1.0: janela de 300K tokens de entrada, até 10K tokens de saída, sem structured outputs, tool use client-side e sem toggle de raciocínio.`
- **Bancada Interativa (Coluna Direita — Beat 2)**:
  - **Título da bancada**: `Mesa de Controle de Inferência (Bedrock Converse API)`
  - **Texto de apoio**: `Alterne os parâmetros abaixo para observar como maxTokens: 8 e stopSequences: ["\n"] cortam explicações indesejadas na raiz.`
  - **Controles interativos**:
    - Seletor `temperature`: `0 (Greedy)` | `0.7 (Amostragem)`
    - Seletor `maxTokens`: `8 tokens` | `200 tokens`
    - Toggle `stopSequences`: `["\n"] Ativo` | `Sem Stop Sequence`
    - Botão de preset rápido: `Aplicar Configuração Canônica`
  - **Mensagens de feedback**:
    - Quando `temperature: 0`, `maxTokens: 8`, `stopSequences: ["\n"]`: `CONFIGURAÇÃO CANÔNICA ATIVA: O modelo emite apenas o label plano (ex.: cancelamento) e para imediatamente na primeira quebra de linha. Custo mínimo de saída ($0,24 / 1M).`
    - Quando `maxTokens: 200` e `Sem Stop Sequence`: `DESPERDÍCIO DETECTADO: Se o modelo tentar explicar ("cancelamento\nJustificativa: o cliente pediu..."), você paga até 200 tokens de saída ($0,24 / 1M) e quebra o parser de linha única.`
    - Quando `temperature: 0.7`: `RISCO DE VARIÂNCIA: Em casos de fronteira próxima (ex.: 52% status_pedido vs 48% reclamacao), temperatura > 0 introduz sorteio desnecessário entre execuções.`
  - **Botão de reset**: `Restaurar estado desregulado`
- **Síntese de Rodapé (Beat 3)**:
  - **Callout**: `Regra 07: Trave temperature: 0, topP: 0.9, maxTokens: 8 e stopSequences: ["\n"]. E mesmo em temp 0, mantenha validação de código porque hardware paralelo pode variar no empate.`
- **Wireframe por Beat**:
  - `Beat 1`: Revela os 3 pontos + ficha técnica oficial do Nova Lite 1.0 (`300K ctx / 10K out / client-side tools`).
  - `Beat 2`: Revela a mesa de controle com JSON de configuração ao vivo e simulação da string retornada pelo modelo.
  - `Beat 3`: Revela o `.callout` final.

---

### SLIDE 08 — Avaliação: Golden Set 88/62, Macro-F1 e IC de Wilson
- **Kicker**: `SLIDE 08 / 12 · RIGOR DE AVALIAÇÃO`
- **Título (`h1`)**: `Avaliação: Golden Set 88/62, Macro-F1 e IC de Wilson`
- **3 Pontos-Chave (Coluna Esquerda — Beat 1)**:
  1. `O dataset sintético/didático de 150 casos é dividido em 88 casos de dev (para diagnosticar e iterar) e 62 casos de test (isolados para validação final).`
  2. `Acurácia global sozinha engana em datasets desbalanceados; avalie a matriz de confusão e o Macro-F1, que dá peso igual às 7 classes.`
  3. `Em amostras de 88 ou 62 casos, 1 erro equivale a ~1,1% ou ~1,6%; use sempre o intervalo de confiança de Wilson (SP.wilson) para medir a incerteza.`
- **Bancada Interativa (Coluna Direita — Beat 2)**:
  - **Título da bancada**: `Explorador de Resultados Oficiais (v1 a v4)`
  - **Texto de apoio**: `Alterne entre as versões e entre as partições Dev (88) e Test (62) para inspecionar a acurácia exata e o IC de Wilson de 95% calculado por SP.wilson.`
  - **Controles seletores**:
    - Botões de versão: `v1 (Baseline)` | `v2 (+ Definições)` | `v3 (+ Few-shot)` | `v4 (Final)`
    - Botões de partição: `Dev Set (88 casos)` | `Test Set (62 casos)`
  - **Tabela de referência exata renderizada pelo controle**:
    - `v1`: Dev `67,0%` (`59/88`) / Test `62,9%` (`39/62`)
    - `v2 (+ Definições)`: Dev `83,0%` (`73/88`) / Test `80,6%` (`50/62`)
    - `v3 (+ Few-shot)`: Dev `89,8%` (`79/88`) / Test `90,3%` (`56/62`)
    - `v4`: Dev `93,2%` (`82/88`) / Test `93,5%` (`58/62`)
  - **Mensagens de feedback**:
    - Ao inspecionar `Dev Set (88 casos)`: `Partição de trabalho (88 casos): Aqui você pode ler cada erro individual em SP_DATA, construir a matriz de confusão e formular hipóteses para a próxima versão.`
    - Ao inspecionar `Test Set (62 casos)`: `Partição cega (62 casos): Os resultados (62,9% -> 80,6% -> 90,3% -> 93,5%) confirmam que os ganhos obtidos no dev generalizaram sem overfitting.`
  - **Botão de reset**: `Voltar para v1 / Dev`
- **Síntese de Rodapé (Beat 3)**:
  - **Callout**: `Regra 08: Se você ler os casos do test set (62) para criar regras no prompt, você vazou dados e destruiu seu termômetro de generalização.`
- **Wireframe por Beat**:
  - `Beat 1`: Revela os 3 pontos + esquema visual da partição `150 = 88 dev + 62 test`.
  - `Beat 2`: Revela o painel com seletores `v1..v4` e `dev/test`, barra de IC de Wilson via `SP.wilson(acertos, total)` e resumo das confusões de `window.SP_DATA`.
  - `Beat 3`: Revela o `.callout` final.

---

### SLIDE 09 — O Loop de Iteração: 1 Mudança e Teste de McNemar
- **Kicker**: `SLIDE 09 / 12 · MÉTODO CIENTÍFICO DE ITERAÇÃO`
- **Título (`h1`)**: `O Loop: 1 Mudança por Vez e McNemar`
- **3 Pontos-Chave (Coluna Esquerda — Beat 1)**:
  1. `Altere apenas uma variável por versão (definições na v2, exemplos na v3, ajuste fino na v4) após classificar os erros da matriz de confusão.`
  2. `Como as duas versões são avaliadas sobre os mesmos 62 casos do test set, a comparação correta não é de proporções independentes, mas pareada.`
  3. `O teste de McNemar olha exclusivamente para os casos discordantes (corrigidos vs quebrados) para separar evolução real de sorte amostral.`
- **Bancada Interativa (Coluna Direita — Beat 2)**:
  - **Título da bancada**: `Analisador de Transições Pareadas (McNemar no Test Set — 62 Casos)`
  - **Texto de apoio**: `Selecione uma transição entre versões consecutivas para examinar os casos corrigidos, os quebrados e o p-valor oficial.`
  - **Botões de transição**:
    - `Transição 1: v1 -> v2 (+ Definições)`
    - `Transição 2: v2 -> v3 (+ Few-shot)`
    - `Transição 3: v3 -> v4 (Ajuste Fino)`
  - **Dados e feedback exatos por transição**:
    - `v1 -> v2 (+ Definições)`: `Acurácia Dev: 67,0% -> 83,0% | Test: 62,9% -> 80,6% | Corrigidos: 11 | Quebrados: 0 | p ≈ 0,001. VEREDITO: Ganho altamente significativo. Promover v2 como nova baseline.`
    - `v2 -> v3 (+ Few-shot)`: `Acurácia Dev: 83,0% -> 89,8% | Test: 80,6% -> 90,3% | Corrigidos: 6 | Quebrados: 0 | p ≈ 0,031. VEREDITO: Ganho estatisticamente significativo (p < 0,05) com os 5 exemplos de fronteira. Promover v3.`
    - `v3 -> v4 (Ajuste Fino)`: `Acurácia Dev: 89,8% -> 93,2% | Test: 90,3% -> 93,5% | Corrigidos: 3 | Quebrados: 1 | p = 0,625 (NS). VEREDITO: Não significativo (NS). 3 corrigidos contra 1 quebrado está dentro do ruído amostral; hora de parar de mexer manualmente no prompt.`
  - **Botão de reset**: `Voltar para v1 -> v2`
- **Síntese de Rodapé (Beat 3)**:
  - **Callout**: `Regra 09: Quando o teste de McNemar aponta p = 0,625 (NS) como em v3 -> v4 (3 corrigidos, 1 quebrado), o loop manual atingiu o platô do dataset atual.`
- **Wireframe por Beat**:
  - `Beat 1`: Revela os 3 pontos + diagrama do ciclo `Avaliar no Dev (88) -> Agrupar Erros -> 1 Hipótese -> McNemar no Test (62) -> Keep/Revert`.
  - `Beat 2`: Revela o seletor das 3 transições com placar grande `Corrigidos vs Quebrados`, valor de `p` e carimbo de decisão.
  - `Beat 3`: Revela o `.callout` final explicando o critério de parada em `p = 0,625 (NS)`.

---

### SLIDE 10 — Automação: DSPy, GEPA, OPRO, APE e promptfoo
- **Kicker**: `SLIDE 10 / 12 · OTIMIZAÇÃO E REGRESSÃO AUTOMÁTICA`
- **Título (`h1`)**: `Automação: Quando Vale, Custo e Modelo Fixo`
- **3 Pontos-Chave (Coluna Esquerda — Beat 1)**:
  1. `Diferencie automação de teste (promptfoo rodando suíte de regressão a cada commit) de otimização algorítmica de prompt (APE, OPRO, DSPy, GEPA).`
  2. `Otimizadores automáticos só compensam quando já existem taxonomia fechada, golden set confiável (88/62) e métrica determinística.`
  3. `Mantenha o modelo-alvo fixo (Amazon Nova Lite 1.0) durante toda a busca: um prompt otimizado em outro modelo raramente preserva o ganho após migração.`
- **Bancada Interativa (Coluna Direita — Beat 2)**:
  - **Título da bancada**: `Seletor de Estratégia de Automação`
  - **Texto de apoio**: `Escolha o cenário real do seu projeto para identificar a ferramenta recomendada e os riscos de custo.`
  - **Botões de cenário**:
    - `Cenário A: Temos apenas 10 exemplos soltos e a taxonomia ainda muda toda semana`
    - `Cenário B: Temos o prompt v3/v4 estável e queremos evitar regressão em Pull Requests`
    - `Cenário C: Temos 88 casos dev, 62 test, métrica travada e queremos buscar melhores combinações de few-shot/instruções no Nova Lite 1.0`
    - `Cenário D: Queremos otimizar o prompt usando um modelo gigante caro e depois rodar o texto final no Nova Lite 1.0`
  - **Mensagens de feedback**:
    - Cenário A: `BLOQUEADO: Não use DSPy, GEPA, OPRO ou APE agora. Sem taxonomia estável e sem golden set, o otimizador apenas fará overfitting no ruído.`
    - Cenário B: `RECOMENDADO: promptfoo. Ideal para rodar os 88 casos de dev (ou 150 totais) em CI/CD, verificando contrato, latência e regressão a custo baixíssimo.`
    - Cenário C: `RECOMENDADO: DSPy / GEPA (para compilar demonstrações e evoluir regras) ou APE / OPRO (para busca de instrução), sempre avaliando diretamente no Nova Lite 1.0.`
    - Cenário D: `ARMADILHA CLÁSSICA: Quebra a regra do modelo-alvo fixo. Otimize executando a avaliação no próprio Nova Lite 1.0 (ou Nova 2 Lite na migração pós-EOL dez/2025).`
  - **Botão de reset**: `Resetar cenário`
- **Síntese de Rodapé (Beat 3)**:
  - **Callout**: `Regra 10: Comece com promptfoo para travar regressões. Só ligue DSPy, GEPA, OPRO ou APE quando o loop manual já tiver esgotado os erros óbvios no modelo-alvo fixo.`
- **Wireframe por Beat**:
  - `Beat 1`: Revela os 3 pontos + quadro comparativo das 5 ferramentas (`promptfoo`, `APE`, `OPRO`, `DSPy`, `GEPA`).
  - `Beat 2`: Revela a árvore de decisão interativa de 4 cenários com recomendação técnica e alerta de custo/overfitting.
  - `Beat 3`: Revela o `.callout` final.

---

### SLIDE 11 — Produção: Segurança, Cache, Guardrails e Custo Real
- **Kicker**: `SLIDE 11 / 12 · OPERAÇÃO EM PRODUÇÃO NO BEDROCK`
- **Título (`h1`)**: `Produção: Segurança, Cache e Custo Real`
- **3 Pontos-Chave (Coluna Esquerda — Beat 1)**:
  1. `Trate toda mensagem do cliente como dado não confiável: isole com delimitadores, aplique Bedrock Guardrails (cobrados por 1.000 caracteres por política) e registre logs auditáveis.`
  2. `O Prompt Caching no Bedrock exige prefixo mínimo de 1.000 tokens, possui TTL de 5 minutos e permite até 4 checkpoints por requisição.`
  3. `Preços por 1M de tokens (entrada / saída): Nova Lite $0,06 / $0,24; Nova Micro $0,035 / $0,14; Nova Pro $0,80 / $3,20. Planeje a migração para o Nova 2 Lite devido ao EOL do Nova Lite 1.0 após dez/2025.`
- **Bancada Interativa (Coluna Direita — Beat 2)**:
  - **Título da bancada**: `Calculadora de Custo de Produção (Premissa Didática Explícita)`
  - **Texto de apoio**: `Premissa didática fixa por requisição: 1.200 tokens de entrada (sendo 1.000 tokens de prefixo estático do system prompt elegível ao mínimo de cache + 200 tokens da mensagem do cliente) e 8 tokens de saída (maxTokens: 8).`
  - **Controles interativos**:
    - Seletor de Modelo: `Nova Micro ($0,035 / $0,14)` | `Nova Lite ($0,06 / $0,24)` | `Nova Pro ($0,80 / $3,20)`
    - Seletor de Volume: `10.000 req` | `100.000 req` | `1.000.000 req`
    - Toggle de Premissa de Cache: `Sem Prompt Cache` | `Com Prompt Cache Ativo (TTL 5 min, mín. 1.000 tokens)`
  - **Fórmula explícita exibida na bancada**:
    - `Sem cache: Custo = Volume * ((1.200 / 1.000.000) * Preço_In + (8 / 1.000.000) * Preço_Out)`
    - `Premissa didática de cache: Os 1.000 tokens do checkpoint estático ficam retidos no TTL de 5 min (modelado didaticamente na simulação como leitura cacheada com 90% de redução sobre o bloco estático de 1.000 tokens, mantendo os 200 tokens dinâmicos e os 8 tokens de saída na tarifa cheia; nota explícita na UI informa que a simulação de cache é premissa didática sobre os preços base congelados).`
  - **Mensagens de feedback**:
    - Ao selecionar `Nova Lite`: `No Nova Lite ($0,06 in / $0,24 out), 1.200 tokens de entrada custam $0,072 por 1.000 req e os 8 tokens de saída custam apenas $0,00192 por 1.000 req. Atenção: EOL do Nova Lite 1.0 ocorre após dez/2025 -> planejar migração para Nova 2 Lite.`
    - Ao selecionar `Nova Pro`: `No Nova Pro ($0,80 in / $3,20 out), o custo sobe mais de 13x em relação ao Lite. Para classificação de 7 intenções, um modelo enxuto bem instruído evita esse gasto.`
    - Ao ativar `Com Prompt Cache Ativo`: `O prefixo do system prompt precisa ter pelo menos 1.000 tokens e ser posicionado antes da mensagem variável em até 4 checkpoints (TTL de 5 min).`
  - **Botão de reset**: `Resetar calculadora`
- **Síntese de Rodapé (Beat 3)**:
  - **Callout**: `Regra 11: Coloque tudo que é fixo acima do checkpoint de cache (mín. 1.000 tokens, TTL 5 min), monitore Guardrails (cobrados por 1.000 chars/política) e prepare o teste de regressão para o Nova 2 Lite (pós-dez/2025).`
- **Wireframe por Beat**:
  - `Beat 1`: Revela os 3 pontos + tabela oficial de preços (`Lite`, `Micro`, `Pro`), regras de cache e aviso de EOL dez/2025.
  - `Beat 2`: Revela a calculadora com a fórmula explícita (`1.200 tokens in + 8 tokens out`), seletores e valores formatados com `SP.money`.
  - `Beat 3`: Revela o `.callout` final.

---

### SLIDE 12 — Cheat Sheet e Caixa de Ferramentas Final
- **Kicker**: `SLIDE 12 / 12 · SÍNTESE E PRONTIDÃO`
- **Título (`h1`)**: `Cheat Sheet e Caixa de Ferramentas`
- **3 Pontos-Chave (Coluna Esquerda — Beat 1)**:
  1. `Trajetória completa no dataset de 150 casos (88 dev + 62 test): Dev evoluiu de 67,0% (v1) -> 83,0% (v2 + Definições) -> 89,8% (v3 + Few-shot, 5 exemplos) -> 93,2% (v4); Test evoluiu de 62,9% -> 80,6% -> 90,3% -> 93,5%.`
  2. `Contrato e inferência travados: 7 labels fechados, tie-break falar_humano > cancelamento > reclamacao > status_pedido > duvida_produto > saudacao > outros, temp 0, topP 0.9, maxTokens 8, stopSequences ["\n"], validação + 1 retry + fallback outros.`
  3. `Antes de ir para produção, valide todos os itens da lista de verificação abaixo e copie o esqueleto canônico do System Prompt.`
- **Bancada Interativa (Coluna Direita — Beat 2)**:
  - **Título da bancada**: `Checklist de Prontidão para Produção + Gerador de Template`
  - **Texto de apoio**: `Marque os 6 critérios de aceite da engenharia de system prompts e copie o template final para o seu projeto.`
  - **6 Checkboxes interativos**:
    1. `[ ] Taxonomia fechada em 7 labels com prioridade falar_humano > cancelamento > reclamacao > status_pedido > duvida_produto > saudacao > outros.`
    2. `[ ] Estrutura em blocos com prefixo estático no topo, entrada delimitada e contrato de label plano colado ao fim.`
    3. `[ ] Regras positivas (1 por linha) e 5 exemplos few-shot focados em hard negatives de fronteira.`
    4. `[ ] Inferência configurada com temperature: 0, topP: 0.9, maxTokens: 8, stopSequences: ["\n"] e fallback outros após 1 retry.`
    5. `[ ] Avaliação auditada em 88 casos dev e 62 test com IC de Wilson e teste pareado de McNemar no test.`
    6. `[ ] Produção dimensionada com Prompt Caching (mín. 1.000 tokens, TTL 5 min), Guardrails (por 1.000 chars/política) e plano para Nova 2 Lite (EOL Lite 1.0 após dez/2025).`
  - **Botões de ação**: `Marcar todos` | `Copiar Template Canônico v4` | `Resetar checklist`
  - **Mensagens de feedback**:
    - Parcial (`1..5` marcados): `Prontidão em andamento: revise os itens restantes para blindar seu classificador antes do deploy.`
    - Completo (`6/6` marcados): `PRONTIDÃO 100% VALIDADA: Seu classificador segue integralmente o método SYS/PRM.`
    - Ao clicar em `Copiar Template Canônico v4`: Copia o template estruturado para a área de transferência (com fallback via `<textarea>` oculto para `file://`) e dispara `SP.toast('Template canônico copiado!')`.
- **Síntese de Rodapé (Beat 3)**:
  - **Callout**: `Fim do Resumão SYS/PRM: Engenharia de prompt não é adivinhação; é taxonomia clara, estrutura previsível, contrato validado e avaliação estatística rigorosa.`
- **Wireframe por Beat**:
  - `Beat 1`: Revela os 3 pontos + tabela consolidada de evolução `v1 -> v2 -> v3 -> v4` (Dev, Test, Corrigidos/Quebrados, p-valor de McNemar).
  - `Beat 2`: Revela o checklist de 6 itens, barra de prontidão e bloco de código do template canônico com botão de cópia.
  - `Beat 3`: Revela o `.callout` de encerramento e link de retorno para `index.html`.

---

## 6. Especificação Completa das 12 Micro-Interações

### Interação 01 — Inspecionador de Falhas da Baseline v1
- **Dados de entrada**: Array de 3 casos do dev set em `window.SP_DATA` (com fallback embutido caso `window.SP_DATA` tenha formato diferente, garantindo zero erro em runtime).
- **Estados**: `caseIdx` em `{0, 1, 2}` (inicial: `0`).
- **Validações**: Índice restrito ao intervalo `0..2`.
- **Feedback correto/errado**: Exibe lado a lado o texto do ticket, o label previsto pela `v1` (destacado com borda `#E4572E` quando diverge do gabarito), o label real esperado e a explicação de 1 linha do motivo do erro.
- **Reset**: Retorna `caseIdx = 0` e re-renderiza o cartão.
- **Acessibilidade**: Grupo de botões com `role="tablist"` ou `role="radiogroup"`, cada botão com `aria-checked="true/false"`, e painel de saída com `aria-live="polite"`.
- **Casos de borda**: Se `window.SP_DATA` não estiver carregado por falha externa, usa 3 casos canônicos de fallback compatíveis com a Loja Norte sem lançar exceção.

### Interação 02 — Arena de Tie-Break na Taxonomia
- **Dados de entrada**: Mensagem multi-intenção fixa e lista ordenada dos 7 labels oficiais (`['falar_humano', 'cancelamento', 'reclamacao', 'status_pedido', 'duvida_produto', 'saudacao', 'outros']`).
- **Estados**: `selectedLabel` em `null | string` (inicial: `null`).
- **Validações**: Verifica se `selectedLabel === 'falar_humano'`.
- **Feedback correto/errado**:
  - Se `selectedLabel === 'falar_humano'`: aplica classe `.rz-btn-active` no botão, exibe selo `[CORRETO]` e explica por que `falar_humano` vence `cancelamento` e `reclamacao`.
  - Se qualquer outro label: exibe a posição do label clicado na régua (`1º a 7º`) e mostra quem está acima dele na hierarquia.
- **Reset**: Define `selectedLabel = null` e oculta o veredito.
- **Acessibilidade**: `role="group"` com `aria-labelledby`, botões com `aria-pressed="true/false"`, resultado anunciado em container `role="status"`.
- **Casos de borda**: Cliques repetidos no mesmo label mantêm o estado idempotente sem piscar a tela.

### Interação 03 — Construtor de Ordem Estrutural
- **Dados de entrada**: Lista de 4 blocos arquiteturais (`id: 'definicoes' | 'exemplos' | 'entrada' | 'contrato'`) iniciando na ordem embaralhada `['contrato', 'exemplos', 'definicoes', 'entrada']`. Ordem alvo: `['definicoes', 'exemplos', 'entrada', 'contrato']`.
- **Estados**: Array `order` de comprimento 4.
- **Validações**: A cada clique em `↑` (índice `i > 0`) ou `↓` (índice `i < 3`), troca `order[i]` com `order[i ± 1]` e avalia 3 critérios booleanos:
  1. `definicoes` está no topo (`order[0] === 'definicoes'`)?
  2. `entrada` vem imediatamente antes de `contrato` (`order.indexOf('entrada') === 2`)?
  3. `contrato` fecha o prompt (`order[3] === 'contrato'`)?
- **Feedback correto/errado**: Mostra checklist de 3 indicadores estruturais (`[OK]` ou `[PENDENTE]`). Não exibe ganho fictício de acurácia; informa explicitamente que a estrutura garante legibilidade, prefixo cacheável e ancoragem do contrato final.
- **Reset**: Restaura `['contrato', 'exemplos', 'definicoes', 'entrada']`.
- **Acessibilidade**: Botões `↑` e `↓` com `aria-label` descritivo (ex.: `"Mover Contrato de Saída para baixo"`), desabilitados (`disabled`) quando o item está no extremo superior ou inferior; após mover um item, o foco permanece no botão equivalente daquele bloco.
- **Casos de borda**: Impede clique em `↑` no índice 0 e `↓` no índice 3.

### Interação 04 — Refinador de Regras (Negativa vs Positiva)
- **Dados de entrada**: 2 fronteiras de decisão, cada uma com texto `negativa` e texto `positiva`.
- **Estados**: `{ ruleIdx: 0 | 1, mode: 'negativa' | 'positiva' }` (inicial: `{ ruleIdx: 0, mode: 'negativa' }`).
- **Validações**: Calcula estimativa de tokens de ambos os textos usando `SP.tokens(texto)` (ou fallback `Math.ceil(texto.length / 4)` se `SP.tokens` não estiver disponível).
- **Feedback correto/errado**: No modo `negativa`, sublinha as partículas negativas (`Não`, `nunca`, `evite`) e mostra o custo maior em tokens; no modo `positiva`, destaca a estrutura `SE ... -> ENTÃO ...` e a redução percentual de tokens.
- **Reset**: Retorna para `{ ruleIdx: 0, mode: 'negativa' }`.
- **Acessibilidade**: Padrão `.tabs` com `role="tablist"` e `role="tab"`, `aria-selected="true/false"`.
- **Casos de borda**: Se `SP.tokens` retornar número inteiro, formata com separador pt-BR.

### Interação 05 — Comparador de Curadoria Few-Shot (v3)
- **Dados de entrada**: Objeto com dois pacotes: `dez_medianos` (resumo de 10 exemplos triviais) e `cinco_fronteira` (os 5 exemplos de fronteira da versão `v3`).
- **Estados**: `pack: 'dez_medianos' | 'cinco_fronteira'` (inicial: `'dez_medianos'`).
- **Validações**: Compara tokens consumidos e exibe as métricas congeladas da transição `v2 -> v3`.
- **Feedback correto/errado**:
  - `dez_medianos`: mostra que exemplos fáceis inflacionam o prompt sem ensinar a separar `status_pedido` de `reclamacao`.
  - `cinco_fronteira`: mostra os 5 exemplos de fronteira e o salto oficial da `v2` (`83,0%` dev / `80,6%` test) para a `v3` (`89,8%` dev / `90,3%` test, `6` corrigidos e `0` quebrados, `p≈0,031`).
- **Reset**: Retorna para `pack = 'dez_medianos'`.
- **Acessibilidade**: Botões de alternância com `aria-pressed` e tabela de exemplos com `caption` oculto para leitores de tela.
- **Casos de borda**: Layout com altura máxima controlada (`max-height: 240px; overflow-y: auto`) para não estourar a altura do slide em telas menores.

### Interação 06 — Simulador de Validação, Retry e Fallback
- **Dados de entrada**: 4 payloads simulados de saída bruta do modelo:
  1. `'status_pedido'`
  2. `'{"intent":"reclamacao"}'`
  3. `'{"intent":"cancelamento"'`
  4. `'suporte_tecnico_urgente'`
- **Estados**: `rawIdx: 0 | 1 | 2 | 3` (inicial: `0`).
- **Validações**: Executa uma função pura real `validateModelOutput(raw)` que verifica se a string limpa pertence aos 7 labels ou se é um JSON válido cujo campo `intent` pertence aos 7 labels.
- **Feedback correto/errado**: Ilumina os nós do fluxograma `[1. Saída] -> [2. Validação] -> [3. Retry (0 ou 1)] -> [4. Destino Final]`. Quando há falha (índices 2 e 3), mostra o acionamento de `1 retry` e o destino de segurança `outros`.
- **Reset**: Volta a `rawIdx = 0`.
- **Acessibilidade**: Fluxograma marcado como `<ol class="steps">` com `aria-current="step"` na etapa determinante.
- **Casos de borda**: Nunca usa `eval`; usa `JSON.parse` dentro de `try/catch` estrito.

### Interação 07 — Mesa de Inferência do Nova Lite 1.0
- **Dados de entrada**: Opções discretas para `temp` (`0` ou `0.7`), `maxTokens` (`8` ou `200`) e `stopSeq` (`true` para `["\n"]` ou `false` para `[]`).
- **Estados**: `{ temp: 0, maxTokens: 200, stopSeq: false }` (inicia com `maxTokens` alto e sem stop sequence para o aluno corrigir).
- **Validações**: Verifica se o estado atual bate com a configuração canônica `{ temp: 0, maxTokens: 8, stopSeq: true }`.
- **Feedback correto/errado**: Mostra a resposta simulada do modelo:
  - Com `stopSeq: false` e `maxTokens: 200`: exibe `"reclamacao\nExplicação: O cliente demonstra insatisfação com o prazo..."` (42 tokens gerados, quebra de contrato).
  - Com `stopSeq: true` e `maxTokens: 8`: exibe `"reclamacao"` (2 tokens gerados, corte limpo na quebra de linha).
- **Reset**: Restaura `{ temp: 0, maxTokens: 200, stopSeq: false }`.
- **Acessibilidade**: `fieldset` agrupando cada parâmetro, botões com `aria-pressed`.
- **Casos de borda**: Botão "Aplicar Configuração Canônica" ajusta os 3 controles simultaneamente em 1 clique.

### Interação 08 — Explorador de Avaliação (Golden Set + Wilson)
- **Dados de entrada**: `window.SP_DATA` (150 casos, 7 labels, predições `v1..v4`) + tabela congelada de acertos:
  - Dev (`n = 88`): `v1 = 59` (`67,0%`), `v2 = 73` (`83,0%`), `v3 = 79` (`89,8%`), `v4 = 82` (`93,2%`).
  - Test (`n = 62`): `v1 = 39` (`62,9%`), `v2 = 50` (`80,6%`), `v3 = 56` (`90,3%`), `v4 = 58` (`93,5%`).
- **Estados**: `{ version: 'v1' | 'v2' | 'v3' | 'v4', split: 'dev' | 'test' }` (inicial: `{ version: 'v1', split: 'dev' }`).
- **Validações**: Invoca `SP.wilson(hits, total)` para obter `[low, high]` do intervalo de confiança de 95% e formata porcentagens com vírgula. Se `window.SP_DATA` estiver presente, extrai também os 3 pares `(real -> predito)` com maior número de confusões naquela versão/partição.
- **Feedback correto/errado**: Exibe o número exato de acertos (`hits / total`), a porcentagem oficial congelada, a faixa do IC de Wilson (`[low% — high%]`) desenhada numa barra `.bar` e as principais confusões entre classes.
- **Reset**: Retorna a `{ version: 'v1', split: 'dev' }`.
- **Acessibilidade**: Tabela de confusões com `<th scope="col">` e `<th scope="row">`, região de métricas com `aria-live="polite"`.
- **Casos de borda**: Fallback limpo para o resumo de confusões caso a estrutura interna de `window.SP_DATA` varie.

### Interação 09 — Analisador Pareado de McNemar
- **Dados de entrada**: As 3 transições congeladas no test set (`62` casos):
  - `v1_v2`: `{ label: 'v1 -> v2 (+ Definições)', devFrom: '67,0%', devTo: '83,0%', testFrom: '62,9%', testTo: '80,6%', fixed: 11, broken: 0, p: '≈ 0,001', sig: true }`
  - `v2_v3`: `{ label: 'v2 -> v3 (+ Few-shot)', devFrom: '83,0%', devTo: '89,8%', testFrom: '80,6%', testTo: '90,3%', fixed: 6, broken: 0, p: '≈ 0,031', sig: true }`
  - `v3_v4`: `{ label: 'v3 -> v4 (Ajuste Fino)', devFrom: '89,8%', devTo: '93,2%', testFrom: '90,3%', testTo: '93,5%', fixed: 3, broken: 1, p: '= 0,625 (NS)', sig: false }`
- **Estados**: `transition: 'v1_v2' | 'v2_v3' | 'v3_v4'` (inicial: `'v1_v2'`).
- **Validações**: Seleção exclusiva entre as 3 chaves válidas.
- **Feedback correto/errado**: Renderiza a matriz 2x2 de concordância/discordância, destaca em `#E4572E` a relação `Corrigidos vs Quebrados` (`11/0`, `6/0`, `3/1`), mostra o `p-valor` e explica por que `v3 -> v4` (`p = 0,625 NS`) indica que não há evidência estatística forte de superioridade sobre a `v3`.
- **Reset**: Volta a `transition = 'v1_v2'`.
- **Acessibilidade**: Botões de transição com `aria-pressed` e matriz 2x2 acessível por leitor de tela.
- **Casos de borda**: Números exibidos literalmente a partir das strings congeladas para evitar arredondamentos divergentes.

### Interação 10 — Árvore de Decisão de Automação
- **Dados de entrada**: 4 cenários (`sem_golden`, `ci_pr`, `otimizar_v3`, `trocar_modelo`).
- **Estados**: `scenario` (inicial: `'sem_golden'`).
- **Validações**: Mapeamento determinístico `scenario -> { status, tool, reason }`.
- **Feedback correto/errado**: Exibe selo (`[BLOQUEADO]`, `[RECOMENDADO: promptfoo]`, `[RECOMENDADO: DSPy / GEPA / OPRO / APE]`, `[ARMADILHA: MODELO DIFERENTE]`) e justificativa de engenharia.
- **Reset**: Volta a `scenario = 'sem_golden'`.
- **Acessibilidade**: `role="radiogroup"` com navegação por clique e teclado.
- **Casos de borda**: Textos concisos para caber sem scroll interno em 1080p.

### Interação 11 — Calculadora de Custo e Cache no Bedrock
- **Dados de entrada**:
  - Preços oficiais por 1M de tokens (`in` / `out`):
    - `micro`: `{ in: 0.035, out: 0.14, name: 'Nova Micro' }`
    - `lite`: `{ in: 0.06, out: 0.24, name: 'Nova Lite 1.0 (EOL após dez/2025 -> Nova 2 Lite)' }`
    - `pro`: `{ in: 0.80, out: 3.20, name: 'Nova Pro' }`
  - Premissa fixa explícita: `inputTokens = 1200` (`1000` estáticos no checkpoint de cache + `200` dinâmicos da mensagem do cliente) e `outputTokens = 8`.
- **Estados**: `{ model: 'lite' | 'micro' | 'pro', volume: 10000 | 100000 | 1000000, cache: boolean }` (inicial: `{ model: 'lite', volume: 100000, cache: false }`).
- **Validações e Fórmula**:
  - `costNoCache = volume * ((1200 / 1e6) * m.in + (8 / 1e6) * m.out)`
  - `costWithCache (premissa didática) = volume * (((1000 * 0.10 + 200) / 1e6) * m.in + (8 / 1e6) * m.out)` — acompanhado de nota textual obrigatória informando que a economia exibida é uma premissa didática aplicada ao bloco estático de 1.000 tokens (TTL 5 min, até 4 checkpoints).
- **Feedback correto/errado**: Formata valores em dólares usando `SP.money(valor)` (ou fallback `'$' + valor.toFixed(2).replace('.', ',')`), mostra a decomposição Entrada vs Saída e destaca o aviso de Guardrails (cobrados por 1.000 caracteres por política) e o EOL do Nova Lite 1.0 após dez/2025.
- **Reset**: Restaura `{ model: 'lite', volume: 100000, cache: false }`.
- **Acessibilidade**: Controles rotulados e saída em `<output aria-live="polite">`.
- **Casos de borda**: Verifica se `SP.money` existe; se a assinatura esperar centavos ou float, trata de forma compatível após inspeção no Passo 1.

### Interação 12 — Checklist de Prontidão + Cópia do Prompt Canônico
- **Dados de entrada**: Array de 6 itens booleanos de verificação e string do template canônico do System Prompt v4 da Loja Norte.
- **Estados**: `checks: [boolean x 6]` (inicial: todos `false`).
- **Validações**: Conta `done = checks.filter(Boolean).length` e calcula porcentagem `Math.round((done / 6) * 100)`.
- **Feedback correto/errado**: Atualiza barra `.bar` de prontidão (`0%` a `100%`). O botão "Copiar Template Canônico v4" funciona em qualquer estado, copiando via `navigator.clipboard.writeText` com fallback para `document.execCommand('copy')` em `<textarea>` temporário (necessário porque alguns navegadores restringem `navigator.clipboard` em `file://`) e aciona `SP.toast('Template copiado para a área de transferência')`.
- **Reset**: Desmarca os 6 checkboxes (`checks.fill(false)`).
- **Acessibilidade**: `<input type="checkbox">` nativos associados a `<label>` clicáveis de linha inteira.
- **Casos de borda**: Se `navigator.clipboard` rejeitar em `file://`, o fallback síncrono copia sem erro de console e ainda assim exibe o toast.

---

## 7. Arquitetura do Motor JS (`assets/resumao.js`)

### 7.1. Organização Modular em IIFE (`window.RZ`)
Para evitar poluição do escopo global e funcionar em `file://` sem ES Modules (`type="module"` sofre bloqueio de CORS em `file://` quando referencia outros arquivos), todo o código residirá em `assets/resumao.js` dentro de uma IIFE atribuída a `window.RZ`:

1. **`RZ.config & RZ_SLIDES`**: Metadados declarativos dos 12 slides, contagens de beats e dados congelados das interações.
2. **`RZ.state`**: Estado vivo da aplicação + métodos `saveSession()` e `loadSession()` protegidos por `try/catch`.
3. **`RZ.motion`**: Detecção e listener de `prefers-reduced-motion: reduce`.
4. **`RZ.router`**: `parseHash()`, `syncHash()`, `goToSlide(n, opts)`, `nextBeat()`, `prevBeat()`, `stepForward()`.
5. **`RZ.autoplay`**: `startAutoplay()`, `stopAutoplay()`, `toggleAutoplay()`, `scheduleNextTick()`.
6. **`RZ.render`**:
   - `updateChrome()`: atualiza barra `.rz-bar-fill`, contador `NN/12`, dots de beats, estado `disabled` dos botões Anterior/Próximo/Beat e atributo `aria-pressed` do Autoplay.
   - `updateSlideVisibility()`: ativa `.is-active` apenas na `<section>` do slide atual e aplica `.is-visible` em todos os `.rz-beat` cujo `Number(dataset.beat) <= state.beat`.
   - `renderInteraction(slideNum)`: atualiza apenas o container `#rz-int-{slideNum}` correspondente.
7. **`RZ.handlers`**: Funções puras de atualização para cada interação (`handleSlide1` a `handleSlide12`) acionadas por delegação de eventos única em `#rz-deck`.
8. **`RZ.lifecycle`**: `init()` e `destroy()` (remove listeners de `keydown`, `hashchange`, `visibilitychange`, `pointerdown`/`pointerup` e limpa `clearTimeout(state.timerId)`).

### 7.2. Pseudocódigo do Motor de Beats e Navegação
```javascript
(function (window, document) {
  'use strict';

  var RZ_SLIDES = [
    {
      id: 1,
      slug: 'diagnostico',
      kicker: 'SLIDE 01 / 12 · DIAGNÓSTICO DE BASELINE',
      title: 'Diagnóstico: O Ralo dos 31% em Outros',
      beats: 3,
      defaultState: function () { return { caseIdx: 0 }; }
    },
    { id: 2, slug: 'taxonomia', beats: 3, defaultState: function () { return { selectedLabel: null }; } },
    { id: 3, slug: 'estrutura', beats: 3, defaultState: function () { return { order: ['contrato', 'exemplos', 'definicoes', 'entrada'] }; } },
    { id: 4, slug: 'regras', beats: 3, defaultState: function () { return { ruleIdx: 0, mode: 'negativa' }; } },
    { id: 5, slug: 'few-shot', beats: 3, defaultState: function () { return { pack: 'dez_medianos' }; } },
    { id: 6, slug: 'contrato', beats: 3, defaultState: function () { return { rawIdx: 0 }; } },
    { id: 7, slug: 'temperatura', beats: 3, defaultState: function () { return { temp: 0, maxTokens: 200, stopSeq: false }; } },
    { id: 8, slug: 'avaliacao', beats: 3, defaultState: function () { return { version: 'v1', split: 'dev' }; } },
    { id: 9, slug: 'loop-mcnemar', beats: 3, defaultState: function () { return { transition: 'v1_v2' }; } },
    { id: 10, slug: 'automacao', beats: 3, defaultState: function () { return { scenario: 'sem_golden' }; } },
    { id: 11, slug: 'producao-custo', beats: 3, defaultState: function () { return { model: 'lite', volume: 100000, cache: false }; } },
    { id: 12, slug: 'cheat-sheet', beats: 3, defaultState: function () { return { checks: [false, false, false, false, false, false] }; } }
  ];

  var state = {
    slide: 1,
    beat: 1,
    maxBeat: 3,
    autoplay: false,
    reducedMotion: false,
    timerId: null,
    interactions: {}
  };

  function getSlideMeta(n) {
    return RZ_SLIDES[n - 1] || RZ_SLIDES[0];
  }

  function goToSlide(targetSlide, preserveHash) {
    var clamped = Math.max(1, Math.min(12, Number(targetSlide) || 1));
    var meta = getSlideMeta(clamped);
    state.slide = clamped;
    state.maxBeat = meta.beats;
    state.beat = state.reducedMotion ? meta.beats : 1;

    if (!preserveHash) {
      try {
        history.replaceState(null, '', '#/' + clamped);
      } catch (e) {
        location.hash = '#/' + clamped;
      }
    }
    syncDOM();
    scheduleAutoplayTick();
  }

  function stepForward() {
    if (!state.reducedMotion && state.beat < state.maxBeat) {
      state.beat += 1;
      syncDOM();
      scheduleAutoplayTick();
      return;
    }
    if (state.slide < 12) {
      goToSlide(state.slide + 1, false);
    } else {
      stopAutoplay();
    }
  }

  function syncDOM() {
    var sections = document.querySelectorAll('.rz-slide');
    for (var i = 0; i < sections.length; i++) {
      var sec = sections[i];
      var sNum = Number(sec.getAttribute('data-slide'));
      var active = sNum === state.slide;
      sec.classList.toggle('is-active', active);
      sec.setAttribute('aria-hidden', active ? 'false' : 'true');
      if (active) {
        var beats = sec.querySelectorAll('.rz-beat');
        for (var b = 0; b < beats.length; b++) {
          var bNum = Number(beats[b].getAttribute('data-beat'));
          beats[b].classList.toggle('is-visible', state.reducedMotion || bNum <= state.beat);
        }
      }
    }
    renderChrome();
    renderInteraction(state.slide);
  }

  window.RZ = {
    state: state,
    slides: RZ_SLIDES,
    goToSlide: goToSlide,
    stepForward: stepForward
  };
})(window, document);
```

---

## 8. Tabela de Fatos Congelados (Fonte Única da Verdade)

Nenhum outro número de experimento, preço ou especificação pode ser introduzido:

| Categoria | Fato Congelado Exato | Onde é Citado |
|---|---|---|
| **Estado narrativo inicial** | `31%` dos casos caindo em `outros` (estado v0 narrativo) | S01, S12 |
| **Dataset** | `150` casos sintéticos/didáticos = `88` dev + `62` test | S01, S08, S09, S10, S12 |
| **Acurácia Dev (88 casos)** | `v1`: `67,0%` / `v2 (+ Definições)`: `83,0%` / `v3 (+ Few-shot)`: `89,8%` / `v4`: `93,2%` | S01, S02, S05, S08, S09, S12 |
| **Acurácia Test (62 casos)** | `v1`: `62,9%` / `v2 (+ Definições)`: `80,6%` / `v3 (+ Few-shot)`: `90,3%` / `v4`: `93,5%` | S01, S02, S05, S08, S09, S12 |
| **McNemar v1 -> v2 (+ Definições)** | `11` corrigidos, `0` quebrados, `p ≈ 0,001` (no test, 62 casos) | S02, S09, S12 |
| **McNemar v2 -> v3 (+ Few-shot)** | `6` corrigidos, `0` quebrados, `p ≈ 0,031` (no test, 62 casos, com `5` exemplos de fronteira) | S05, S09, S12 |
| **McNemar v3 -> v4** | `3` corrigidos, `1` quebrado, `p = 0,625` (NS — não significativo, no test) | S09, S12 |
| **7 Labels fechados** | `saudacao`, `duvida_produto`, `status_pedido`, `reclamacao`, `cancelamento`, `falar_humano`, `outros` | S02, S06, S12 |
| **Prioridade de Tie-Break** | `falar_humano > cancelamento > reclamacao > status_pedido > duvida_produto > saudacao > outros` | S02, S04, S12 |
| **Amazon Nova Lite 1.0** | `300K` ctx, `10K` out, sem structured outputs, tool use client-side, sem toggle de raciocínio | S06, S07, S10, S11, S12 |
| **EOL do Nova Lite 1.0** | EOL após `dez/2025` -> recomendar migração para `Nova 2 Lite` | S10, S11, S12 |
| **Configuração de Inferência** | `temperature: 0`, `topP: 0.9`, `maxTokens: 8`, `stopSequences: ["\n"]`, saída em label plano | S06, S07, S11, S12 |
| **Contrato JSON e Resiliência** | Validar no código, `1` retry, fallback `outros` | S06, S12 |
| **Prompt Caching no Bedrock** | Mínimo `1.000` tokens, TTL `5 min`, até `4` checkpoints | S03, S11, S12 |
| **Preços por 1M de tokens** | Lite `$0,06 / $0,24`; Micro `$0,035 / $0,14`; Pro `$0,80 / $3,20` | S07, S11, S12 |
| **Fórmula didática de S11** | `1.200` tokens de entrada (`1.000` estáticos + `200` dinâmicos) e `8` tokens de saída; cache como premissa didática | S11 |
| **Bedrock Guardrails** | Cobrados por `1.000` caracteres por política | S11, S12 |
| **Ferramentas de Automação** | `DSPy`, `GEPA`, `OPRO`, `APE`, `promptfoo` | S10 |

---

## 9. Plano de Testes Objetivo e Critérios de Aceite Finais

### 9.1. Roteiro de Verificação Sem Framework (6 Cenários)
1. **Teste de abertura offline (`file://`)**:
   - **O que verificar**: Abrir `system-prompts/resumao.html` diretamente pelo protocolo `file://` e checar DevTools Console e aba Network.
   - **Resultado esperado**: `0` erros no Console, `0` requisições HTTP externas, `typeof window.SP === 'object'`, `typeof window.SP_DATA === 'object'`, `typeof window.RZ === 'object'`.
2. **Teste de Deep Link e Histórico (`#/1` a `#/12`)**:
   - **O que verificar**: Acessar `resumao.html#/9`, recarregar a página, depois testar `resumao.html#/99` e `resumao.html#invalido`.
   - **Resultado esperado**: `#/9` abre diretamente no Slide 09 (McNemar); hashes inválidos redirecionam silenciosamente para `#/1` e exibem `01/12`.
3. **Teste de Beats e Teclado**:
   - **O que verificar**: A partir de `#/1` (com reduced motion desligado), pressionar `ArrowRight` 3 vezes.
   - **Resultado esperado**: 1º toque revela Beat 2; 2º toque revela Beat 3; 3º toque avança para o Slide 02 (`#/2`, Beat 1). Pressionar `Home` leva a `#/1`; `End` leva a `#/12`.
4. **Teste de Guarda de Foco**:
   - **O que verificar**: Focar um `<select>` ou `<button>` dentro de `.rz-interactive` e pressionar `Space` ou `ArrowRight`.
   - **Resultado esperado**: O controle interativo recebe a ação nativa sem que o deck pule de slide acidentalmente.
5. **Teste de `prefers-reduced-motion: reduce`**:
   - **O que verificar**: Emular `prefers-reduced-motion: reduce` no DevTools Rendering e navegar entre slides.
   - **Resultado esperado**: Todos os blocos `.rz-beat` de cada slide já nascem com `.is-visible`, `transition-duration` computada igual a `0s`, botão "Próximo beat" desabilitado e `ArrowRight` trocando diretamente de slide.
6. **Auditoria Estática de Restrições Visuais e Editoriais (`grep`)**:
   - **O que verificar**: Buscar em `resumao.html` e `assets/resumao.js` por `border-radius`, `box-shadow`, `gradient`, emojis Unicode e números com ponto decimal indevido em texto pt-BR.
   - **Resultado esperado**: `0` ocorrências de `border-radius` (exceto `0`), `0` de `box-shadow` (exceto `none`), `0` de `gradient`, `0` emojis, e presença exata de `67,0%`, `83,0%`, `89,8%`, `93,2%`, `62,9%`, `80,6%`, `90,3%`, `93,5%`, `0,001`, `0,031`, `0,625`.

### 9.2. Checklist de Critérios de Aceite Finais
- [ ] Página `system-prompts/resumao.html` e script `system-prompts/assets/resumao.js` criados sem tocar em nenhum outro arquivo existente.
- [ ] Todos os 12 slides implementados com título, kicker, no máximo 3 pontos-chave, 1 micro-interação funcional com consequência e 3 beats.
- [ ] Atribuição correta das versões: `v2 = + Definições` (`83,0%` dev / `80,6%` test) e `v3 = + Few-shot` com `5` exemplos (`89,8%` dev / `90,3%` test); o Slide 03 (Estrutura) não promete ganho numérico de acurácia.
- [ ] Calculadora do Slide 11 exibe explicitamente a fórmula com `1.200` tokens de entrada, `8` de saída e identifica o cálculo de cache como premissa didática.
- [ ] Funciona integralmente em teclado, mouse, touch/swipe, `file://` e `prefers-reduced-motion: reduce`, com zero erros no console.

---

## 10. Riscos de Implementação e Mitigação

| Risco | Causa Provável | Mitigação Arquitetural no Código |
|---|---|---|
| **1. Bloqueio de `navigator.clipboard` e `sessionStorage` em `file://`** | Navegadores restringem APIs de área de transferência e storage em origens locais sem HTTPS. | Envolver `sessionStorage` em `try/catch` (operando em RAM se bloqueado) e implementar fallback de cópia no Slide 12 com `<textarea readonly>` fora da tela + `document.execCommand('copy')` + `SP.toast`. |
| **2. Assinaturas de `SP.*` ou formato de `SP_DATA`/`SP_CASES` divergentes do esperado** | Diferença sutil nos parâmetros de `SP.wilson`, `SP.money` ou nomes de campos em `window.SP_DATA`. | O Passo 1 da execução lê as primeiras linhas de `assets/app.js` e `assets/data/intents.js` antes de codificar, além de criar wrappers seguros (`safePct`, `safeMoney`, `safeWilson`, `safeTokens`) que delegam a `window.SP` quando disponível. |
| **3. Conflito de atalhos de teclado com controles interativos** | Usuário pressiona `Space` para ativar um botão da micro-interação e o listener global de `keydown` avança o beat/slide. | No listener global de `keydown`, checar `e.target.closest('button, input, select, textarea, a, [role="button"], [role="tab"], [role="radio"]')`: se verdadeiro e a tecla for `Space` ou setas dentro de seletor, abortar o atalho global do deck. |
| **4. Estouro vertical de conteúdo em telas de notebook (1366x768) ou mobile** | As 3 faixas do slide + bancada interativa podem ultrapassar `calc(100vh - 56px)`. | Definir `overflow-y: auto` no próprio `.rz-slide`, usar tipografia enxuta (`15px` corpo, `26px` título) e em viewports `<= 900px` liberar o `body` para scroll vertical nativo contínuo por slide. |
| **5. Timers órfãos de Autoplay durante cliques rápidos** | Usuário clica em "Próximo" ou interage na bancada enquanto um `setTimeout` de autoplay está pendente. | Centralizar qualquer agendamento em `scheduleAutoplayTick()` que sempre executa `clearTimeout(state.timerId)` na primeira linha, e pausar o autoplay automaticamente ao detectar clique dentro de `.rz-interactive`. |

---

## 11. Ordem de Execução Detalhada para o Implementador

1. **Passo 1 — Inspeção Rápida das Interfaces Existentes (Somente Leitura)**:
   - Ler as primeiras 100 linhas de `system-prompts/assets/app.js` para verificar as assinaturas exatas de `SP.quiz`, `SP.pct`, `SP.money`, `SP.wilson`, `SP.tokens` e `SP.toast`.
   - Ler as primeiras 60 linhas de `system-prompts/assets/data/intents.js` para confirmar os nomes das propriedades de `window.SP_DATA` e `window.SP_CASES`.
   - Ler os seletores principais de `system-prompts/assets/site.css` (`.lab`, `.quiz`, `.steps`, `.matrix`, `.bar`, `.callout`, `.chip`, `.tabs`) para reaproveitar classes existentes sem duplicar CSS.
2. **Passo 2 — Construção do Motor e Dados em `system-prompts/assets/resumao.js`**:
   - Implementar a IIFE `window.RZ` com a tabela `RZ_SLIDES`, os fatos congelados da Seção 8, os wrappers seguros para `window.SP.*` e o controlador de navegação (hash `#/1..#/12`, teclado com guarda de foco, swipe touch, barra de progresso, autoplay e listener `prefers-reduced-motion`).
3. **Passo 3 — Implementação das 12 Micro-Interações em `system-prompts/assets/resumao.js`**:
   - Codificar os renderizadores e handlers delegados (`data-rz-action`) das 12 interações seguindo fielmente os estados, textos de feedback e regras de negócio das Seções 5 e 6 (incluindo `v2 = + Definições`, `v3 = + Few-shot` com 5 exemplos, Slide 03 focado em clareza/ordem sem prometer acurácia e Slide 11 com a fórmula explícita de `1.200` tokens de entrada e `8` de saída).
4. **Passo 4 — Construção de `system-prompts/resumao.html`**:
   - Escrever o HTML completo com cabeçalho de navegação fixo (`.rz-top`), barra de progresso, contador `01/12`, controles de beat/slide/autoplay/reset, estilos escopados `.rz-*` (respeitando papel `#fff`, tinta `#111`, dark `#0a0a0a`, accent `#E4572E`, bordas `1px`, zero radius/sombra/gradiente) e as 12 seções `<section class="rz-slide" data-slide="1..12">` com a copy final da Seção 5 dividida em `data-beat="1"`, `data-beat="2"` e `data-beat="3"`.
5. **Passo 5 — Auditoria Automatizada via Grep**:
   - Verificar no código gerado a ausência total de `border-radius` não-zero, `box-shadow` não-none, `gradient`, emojis, chamadas `fetch()` ou URLs externas, e confirmar a grafia exata de todos os números congelados em formato pt-BR com vírgula.
6. **Passo 6 — Revisão Final de Isolamento**:
   - Confirmar que apenas `system-prompts/resumao.html` e `system-prompts/assets/resumao.js` foram criados/modificados, mantendo todas as páginas do curso e configurações intactas para o integrador.

---

## 12. Fora de Escopo
- Modificar `index.html`, qualquer uma das 13 páginas de conteúdo do curso, `site.config`, `assets/site.css`, `assets/app.js` ou `assets/data/intents.js`.
- Realizar chamadas de rede para a AWS Bedrock, usar bibliotecas externas (React, Vue, Tailwind, Chart.js, GSAP) ou carregar fontes/ícones de CDNs.
- Criar animações decorativas sem função pedagógica, efeitos de partículas, sombras, cantos arredondados ou gradientes.
