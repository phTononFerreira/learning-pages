# Auditoria visual e de UX — SP Águas 2026

**Data:** 15/11/2026  
**Páginas auditadas:** `index.html`, `cadernos/gestao-recursos-hidricos.html`, `plano-estudos.html` (TI e GRH) e `cargos/especialista-gestao-recursos-hidricos.html`.  
**Método:** páginas abertas por `file://` no Chrome 157 headless via Selenium 4.36 + CDP, com viewport real de 1440×2400 e 390×2400; também 390×844 para menu, busca e âncoras. Tema escuro e claro, estados de hover/focus, seletor de cargo, `<details>` aninhados e rolagem das tabelas.  
**Natureza:** auditoria somente leitura. Nenhum HTML, CSS, JS, JSON, script ou doc existente foi editado; o único arquivo criado é este relatório. Não rodei `build_site.py`, validadores nem git, conforme o escopo.

> **Atualização pós-integração (15/11/2026):** esta auditoria foi feita antes de o motor interativo e a expansão de conteúdo entrarem no site. No estado atual, o GRH tem **24 questões e 24 flashcards** e existe um novo caderno de **GA** com 5 módulos, 18 lições, 12 questões e 18 flashcards. As contagens de 12/18 citadas abaixo descrevem o estado auditado. O status de cada correção está no fim do relatório.

> O Chrome headless no Windows impõe largura mínima de 500 px ao `--window-size`. Para o mobile, o viewport de 390 px foi aplicado via `Emulation.setDeviceMetricsOverride`; as primeiras capturas feitas só com `--window-size=390` foram descartadas por serem recortes de um layout de 500 px.

## Resumo executivo

**Nota de prontidão: bom para publicar com ressalvas (7,5/10).**

Não há problema bloqueante: nenhuma das quatro páginas tem overflow horizontal de página em 1440 px ou 390 px; o caderno tem exatamente 6 módulos, 12 questões e 18 flashcards, na ordem e sem duplicação; os `<details>` aninhados funcionam; não há erro de console; e o contraste medido passa em AA nos pares testados. A base visual é consistente, os cards alinham e as tabelas funcionam bem no desktop.

As ressalvas estão concentradas em três frentes: (1) tipografia das listas, onde título e subtítulo aparecem colados em 24 linhas; (2) números e affordances, com “Flashcards dominados 0/0” na home e acordeões sem indicador de abrir/fechar; (3) mobile, onde as tabelas de 5 colunas cortam a coluna “Checkpoint” sem dica de rolagem, o seletor de cargo trunca o texto e as âncoras do caderno caem atrás do topbar fixo. Há ainda um efeito de estado: visitar uma página de cargo grava aquele cargo como alvo antes de o usuário clicar em “Definir como cargo alvo”.

**Placar dos achados:** 0 de severidade alta, 6 médios e 3 baixos. Nenhum item foi inferido sem reprodução; o que não deu para testar está listado ao final.

### Pontos fortes verificados

- **Sem overflow de página:** `document.documentElement.scrollWidth === clientWidth` nas quatro páginas, em 1440 e 390. O único overflow é interno e intencional (`overflow-x:auto`) nas tabelas largas.
- **Caderno completo e sem duplicação:** 6 módulos (`#grh-m1`…`#grh-m6`), 3 lições por módulo (18 lições), 12 questões (`#grh-q1`…`#grh-q12`) e 18 flashcards; zero IDs duplicados e zero textos de flashcard repetidos.
- **Plano correto por cargo:** no estado TI (localStorage limpo), aparece o bloco `ana-ti` e o cronograma detalhado (`data-plan-ti`). No estado GRH, aparece só `esp-grh` e `data-plan-ti` fica `display:none`, com 0 títulos de seção de TI visíveis.
- **Detalhes aninhados:** abrir “Conferir resposta e comentário” dentro de uma questão não fecha a questão; o estado nativo é preservado e a semântica de `<details>` é válida.
- **Contraste e foco:** nenhum par de texto medido ficou abaixo de 4,5:1; o menor foi 5,49:1 (rótulos de 9 px do GRH no tema claro). Hover de card muda a borda para o accent e o foco de link/card mostra outline visível; o select mostra `focus-within` no accent.
- **Links locais:** 41, 35, 20 e 42 links locais nas quatro páginas, respectivamente; nenhum arquivo de destino ausente.
- **Breadcrumb, menu mobile e busca:** breadcrumb do cargo e do caderno está correto; o drawer abre/fecha; a busca mobile ocupa 354 px dentro de 390 px, com input focado e fechamento funcionando.

## Tabela de achados

| # | Severidade | Página | Seletor/elemento | Achado | Correção sugerida |
|---|---|---|---|---|---|
| 1 | **Média** | `index.html` e `cargos/especialista-gestao-recursos-hidricos.html` | `.list-row .title`, `.list-row .sub` | Título e subtítulo são `display:inline`; como as tags são adjacentes no HTML, o texto gruda: “SQL: SELECT, WHERE e ORDER BYEngenharia de Dados…”, “Leitura de gráficos, tabelas e matrizesPensamento Analítico…”. Afeta 8 linhas da home e 16 do cargo. No mobile, a quebra de linha mistura as duas informações. | `.list-row .title, .list-row .sub { display:block; }` e, se necessário, `.list-row .sub { margin-top:2px; }`. |
| 2 | **Média** | `index.html` | `[data-stat-cards]`, `SP.stats().cTotal` | “Flashcards dominados 0/0” no hero e “Dominados 0/0” no card, apesar de a página dizer “135 cards”. A home não carrega `dados/flashcards.js`; `window.FLASHCARDS` fica vazio, `cTotal` vira 0 e `updateWidgets()` sobrescreve o fallback estático `0/135`. | Carregar `dados/flashcards.js` antes de `assets/app.js` na home (como nas páginas de flashcards/dashboard) ou só atualizar o total quando `cTotal > 0`, preservando o fallback. |
| 3 | **Média** | `cadernos/gestao-recursos-hidricos.html` | `html`, `section[id^="grh-m"]`, `#questoes`, `#flashcards`; links `.btn[href^="#"]` | As âncoras internas caem atrás das barras fixas. Com o clique em “3. Hidrogeologia e Segurança de Barragens”, o alvo fica em `top: 0`; no desktop o configbar termina em 113 px e no mobile o topbar em 62 px. O título do módulo e o começo da introdução ficam ocultos. No desktop, 8 dos 9 atalhos ficam cobertos; no mobile, 7 dos 9 (lá, “Fontes” e “Flashcards” escapam pelo limite de rolagem). | Adicionar `html { scroll-padding-top: 124px; }` e, em `max-width:860px`, `scroll-padding-top: 72px`; alternativa: `scroll-margin-top` em `section[id], details[id]`. Testar os 9 atalhos. |
| 4 | **Média** | `plano-estudos.html` (TI e GRH) e `cargos/especialista-gestao-recursos-hidricos.html`, no mobile | `.table-wrap > table` (tabelas de 5 colunas) | Em 390 px, o wrapper tem 352 px e a tabela 424–505 px; a coluna “Checkpoint” fica fora da tela. Exemplos medidos: plano TI, 492/352 e 424/352; plano GRH e cargo, 505/352. O scroll horizontal existe (`scrollLeft` chega a 140–153 px), mas não há scrollbar visível, dica de “arraste” nem primeira coluna fixa; as colunas restantes ficam comprimidas (Tarefas em até 7 linhas). | Em `max-width:560px`, dar `min-width: 620–680px` às tabelas de 5 colunas, adicionar dica visual de rolagem e, se possível, primeira coluna `position:sticky`. Alternativa mais legível: transformar cada linha em um card com rótulos. |
| 5 | **Média** | `cargos/especialista-gestao-recursos-hidricos.html` → `index.html` / `plano-estudos.html` | `assets/app.js` (`initCargo`, `applyCargo(pageId || saved || fallback, true)`); CTA `[data-set-cargo]` | Abrir a página do cargo GRH já grava `spaguas.cargo = "esp-grh"` no `localStorage`, antes de qualquer clique. O CTA “Definir como cargo alvo” (linha 118) fica redundante, e a escolha anterior do usuário é sobrescrita silenciosamente. De volta à home, o configbar/meta dizem GRH (77 vagas, R$ 12.070) enquanto o hero continua TI (3 vagas, R$ 10.366); o plano passa a abrir em GRH. | Persistir o cargo só em ação explícita: no init da página do cargo, aplicar `pageId` para exibição com `persist=false`; manter a gravação no `change` do select e no `[data-set-cargo]`. Se a intenção for “último cargo visto”, remover/relabelar o CTA e avisar a troca. |
| 6 | **Média** | `cadernos/gestao-recursos-hidricos.html` | `#questoes`, `ul.alts li` | O texto instrui “Responda sem consultar. Só abra o gabarito depois de marcar uma alternativa”, mas as 12 questões têm 60 alternativas estáticas: 0 `input`, 0 `button`. As caixas com borda parecem opções clicáveis (o mesmo desenho de `.q-option` em outras páginas) e não respondem ao clique; o usuário só consegue abrir a questão e o gabarito. | Adicionar rádios por questão + botão “Conferir”, com estado selecionado/correto/incorreto; ou, se o formato for intencionalmente de leitura, trocar a instrução para “cubra as alternativas e abra o gabarito” e remover a aparência de opção clicável. |
| 7 | **Baixa** | `cadernos/gestao-recursos-hidricos.html` | `details.accordion > summary`, `details.answer > summary` | O CSS remove o marcador nativo (`list-style:none` e `::-webkit-details-marker{display:none}`) sem substituto. Nas 18 lições não há chevron/+/−; o rótulo “item 1.1” parece metadado, não ação. Nas questões, o rótulo externo “ver gabarito” na verdade abre a questão (não o gabarito), e “ver resposta”/“ver gabarito” não mudam quando o `<details>` está aberto. | Adicionar `summary::after` com “+”/“−” ou chevron que gira em `details[open]`; trocar o rótulo externo para “abrir questão” e o interno para “conferir resposta”; usar dois spans (fechado/aberto) ou JS para o estado do texto. A semântica nativa de `<details>` já está correta. |
| 8 | **Baixa** | Mobile, global (home, caderno, plano, cargo) | `.cargo-select-wrap select`, `.configbar-meta` | O texto do cargo selecionado é cortado no meio da palavra: “Gestão de Recursos Hídricos · 77 vag” e “Tecnologia da Informação e Ciência”. Não há ellipsis; o usuário só vê o texto completo abrindo o dropdown nativo. Como `.configbar-meta` fica `display:none` em `max-width:860px`, a barra perde também o complemento de vagas/salário. | Encurtar os rótulos no mobile (ex.: “TI e Ciência de Dados · 3” / “GRH · 77 vagas”) via `data-*` ou media query, ou usar um controle customizado de duas linhas; adicionar `title` com o texto completo. |
| 9 | **Baixa** | Mobile, global | `.icon-btn`, `.search-btn`, `.sidebar` | Alvos de toque abaixo de 44×44: menu e tema 34×34, busca 37×31. O drawer do menu abre com 280 px, mas não tem backdrop, botão de fechar nem `aria-expanded` atualizado; o restante da página fica visível e rolável ao lado. | Em `max-width:860px`, elevar os botões para 44×44, adicionar backdrop + botão de fechar (e `aria-expanded` no `[data-menu]`), bloquear o scroll do body enquanto o drawer estiver aberto. |

## Medições que sustentam os achados

- **Overflow de página:** 0 ocorrências fora de `.table-wrap` e do sidebar fechado, nas quatro páginas, em 1440 e 390. A home mede 2665 px de altura no desktop e 5707 px no mobile; o caderno, 6496 px e 10.305 px; o plano TI, 2400 px e 5035 px; o cargo GRH, 4156 px e 7026 px.
- **Listas:** 8 `.list-row` na home e 16 no cargo; 16 e 32 spans de título/subtítulo com `display:inline` (48 no total). O problema é de CSS, não de conteúdo.
- **Flashcards:** o HTML estático tem `0/135`, mas o DOM final tem `0/0` nos dois pontos; `window.FLASHCARDS` não é carregado na home e `cTotal` é 0.
- **Âncoras:** desktop, `#grh-m3` em `top:-0,125` com `.configbar` terminando em 113; mobile, `top:0,34` com `.topbar` terminando em 62. Dos 9 atalhos, 8 ficaram cobertos no desktop e 7 no mobile. `scrollMarginTop` computado: `0px`.
- **Tabelas:** desktop 1114/1114 (sem overflow); mobile 352/505 no GRH e no cargo, 352/492 e 352/424 no plano TI. O scroll interno funciona, mas não é sinalizado.
- **Estado do cargo:** após abrir o cargo GRH, `localStorage["spaguas.cargo"]` é `esp-grh`; a home fica com select/meta GRH e H1 TI; o plano mostra `esp-grh` e esconde `data-plan-ti`.
- **Questões:** 12 `<details class="question">`, 60 `<li>` em `.alts`, 12 `<details class="answer">`, 0 inputs e 0 buttons em `#questoes`.
- **Detalhes:** Q1 e Q5 abertos com o `answer` interno aberto; pai e filho permanecem abertos; nenhum ID duplicado; nenhum erro no console.
- **Contraste:** 0 pares abaixo de 4,5:1 nas páginas auditadas; mínimo 5,49:1 (GRH, tema claro, rótulos de 9 px sobre `--surface`), 5,93:1 nos botões primários claros e 7,19:1 ou mais no tema escuro.
- **Hover/focus:** borda de card `#2a2a2a → #38bdf8`; outline de foco `auto 1px` visível; `cargo-select-wrap:focus-within` muda a borda para o accent.
- **Console:** 0 erros e 0 warnings nas quatro páginas.

## O que foi testado de fato

1. **Desktop 1440×2400:** topo e trechos rolados da home, caderno, plano (TI e GRH) e cargo GRH; tema escuro e claro.
2. **Mobile 390×2400:** as mesmas páginas, com viewport real via CDP; menu aberto, busca aberta, questões e flashcards abertos.
3. **Seletor de cargo:** estado padrão TI com `localStorage` limpo; troca para `esp-grh` pelo `<select>` real, com verificação de `hidden`, `display`, textos e tabelas; visita ao cargo GRH seguida de volta à home/plano. Não foi necessária cópia temporária do HTML: o estado GRH foi obtido pelo próprio seletor, que é o caminho real do usuário.
4. **Caderno:** contagem e ordem dos 6 módulos, 18 lições, 12 questões e 18 flashcards; verificação de IDs e textos duplicados; abertura de `<details>` de lição, questão e resposta aninhada; clique nos 9 atalhos de âncora e medição da posição do alvo.
5. **Tabelas:** medição de `scrollWidth`/`clientWidth`, rolagem até `scrollLeft` máximo e captura do estado à esquerda e à direita.
6. **Interação e acessibilidade visual:** hover em card, foco em card/select/skip link, contraste computado de dezenas de combinações de cor/fundo/tamanho, tamanho dos alvos de toque, abertura/fechamento do drawer e da busca.
7. **Links e console:** existência de todos os `href` locais e leitura dos logs do navegador nas quatro páginas.

## O que não foi possível testar

- **Dispositivo físico/touch real:** os gestos foram simulados por CDP; não houve teste em iOS/Android real, com teclado virtual, inércia ou scrollbar overlay nativa.
- **Outros motores:** apenas Chrome/Blink. Não testei Safari, Firefox nem Edge (mesmo Chromium) em versões reais.
- **Leitor de tela e teclado completo:** não fiz traversal completo com NVDA/VoiceOver nem teste de foco preso no drawer; verifiquei apenas outline visível e semântica nativa de `<details>`.
- **Zoom de texto/200%, forced-colors e prefers-reduced-motion:** não testados.
- **Impressão/PDF:** o botão “Imprimir plano” não foi acionado; o CSS de `@media print` não foi validado visualmente.
- **Links externos:** a existência dos arquivos locais foi checada; os links para FGV, Planalto, ANA etc. não foram abertos (sem verificação de rede).
- **Estados com progresso real:** a home foi testada com `localStorage` vazio; não validei os números com aulas/flashcards concluídos, exceto a leitura do código que calcula os totais.
- **Demais páginas/cargos:** fora do escopo; não auditei as outras 7 páginas de cargo, aulas, simulados, dashboard, revisões etc.

## Evidências

Todas as capturas estão em `C:\Users\sanch\AppData\Local\Temp\opencode\qa\` e não foram copiadas para o repositório.

### Home

| Arquivo | O que mostra |
|---|---|
| `01-home-desktop-top.png` | Home 1440, topo: configbar TI, hero, stat row com “Flashcards dominados 0/0”. |
| `02-home-desktop-mid.png` | Prioridades P1 com título/subtítulo colados; cards das disciplinas alinhados. |
| `03-home-desktop-bottom.png` | Rodapé da home, disciplinas e callout de regra de eliminação. |
| `04-home-desktop-light.png` | Tema claro: contraste e hierarquia preservados. |
| `20-home-mobile-top.png` | Home 390: select truncado, hero em 3 linhas, stat row empilhado e 0/0. |
| `21-home-mobile-mid.png` | Mobile: listas P1 com o mesmo problema de concatenação. |
| `23-home-mobile-menu.png` | Drawer aberto em 280 px, sem backdrop/close; conteúdo visível ao lado. |
| `40-home-mobile-search.png` | Busca mobile: modal de 354 px, input focado e resultados legíveis. |
| `42-home-after-cargo-visit-notice.png` | Home após visitar o cargo GRH: configbar/meta GRH, aviso de “trilha ativa GRH” e hero TI. |
| `43-listrows-home.png` | Recorte das 8 linhas P1 da home, evidência direta da concatenação. |
| `44-statrow-home-cards00.png` | Recorte do stat row com “0/0” em Flashcards. |
| `47-mobile-configbar.png` | Recorte do configbar mobile: “Gestão de Recursos Hídricos · 77 vag”. |

### Caderno GRH

| Arquivo | O que mostra |
|---|---|
| `06-caderno-desktop-top.png` | Topo do caderno: 6 módulos/18 lições/12 questões/18 flashcards, atalhos e lições fechadas. |
| `07-caderno-desktop-module1.png` | Módulo 1 aberto: fórmula, exemplo e pegadinha legíveis. |
| `08-caderno-desktop-anchor-m3.png` | Clique no atalho do módulo 3: o título do módulo fica atrás do topbar/configbar. |
| `09-caderno-desktop-questoes.png` | Q1 aberta, alternativas A–E e “Conferir resposta e comentário” aninhado. |
| `10-caderno-desktop-questao-nested.png` | Q5 com o `details.answer` interno aberto; o pai permanece aberto. |
| `11-caderno-desktop-flashcards.png` | 18 flashcards em 2 colunas; respostas de 1.000 m³, P = ET + Q + ΔS, etc. |
| `24-caderno-mobile-top.png` | Caderno 390: stat row empilhado, atalhos em 2 colunas e módulos. |
| `25-caderno-mobile-module1.png` | Módulo 1 aberto no mobile; fórmula quebra em duas linhas sem perder o sentido. |
| `26-caderno-mobile-questoes.png` | Questões no mobile: alternativas em caixas, sem controles de resposta. |
| `27-caderno-mobile-questao.png` | Q1 aberta no mobile, com gabarito comentado. |
| `28-caderno-mobile-flashcards.png` | Flashcards no mobile: um por linha, 210 px de altura mínima. |
| `37-caderno-mobile-anchor-m3.png` | Âncora do módulo 3 no mobile: título coberto pelo topbar de 62 px. |

### Plano de estudos

| Arquivo | O que mostra |
|---|---|
| `12-plano-desktop-ti-top.png` | Plano no estado TI (localStorage limpo), com hero e o bloco do cargo selecionado. |
| `13-plano-desktop-ti-plan.png` | Tabela de 5 fases e rotina diária de 2h. |
| `14-plano-desktop-ti-cronograma.png` | Cronograma S0–S11 com a semana atual destacada. |
| `16-plano-desktop-grh-plan.png` | Estado GRH: só a tabela de 5 fases do GRH; nenhum bloco TI abaixo. |
| `29-plano-mobile-ti-top.png` | Plano mobile: select truncado e hero. |
| `30-plano-mobile-ti-plan.png` | Tabela de 5 fases comprimida; “Checkpoint” fora da tela. |
| `31-plano-mobile-ti-cronograma.png` | Cronograma mobile: 5 colunas comprimidas e “Checkpoint” cortado. |
| `33-plano-mobile-grh-plan.png` | Plano GRH mobile: mesma compressão/corte da coluna final. |
| `38-plano-mobile-grh-table-left.png` | Recorte da tabela GRH à esquerda: Fase/Período/Foco/Tarefas; Checkpoint ausente. |
| `39-plano-mobile-grh-table-right.png` | A mesma tabela após rolar até o fim: Checkpoint aparece, mas as primeiras colunas saem. |
| `48-mobile-table-left.png` | Recorte da tabela mobile no início da rolagem. |
| `49-mobile-table-right.png` | Recorte da tabela mobile no fim da rolagem. |

### Cargo GRH

| Arquivo | O que mostra |
|---|---|
| `17-cargo-grh-desktop-top.png` | Hero do cargo, tags “77 vagas / R$ 12.070 / 308 discursivas / trilha curada”. |
| `18-cargo-grh-desktop-mid.png` | “Aulas mais próximas” com título/subtítulo colados; tabela do plano íntegra no desktop. |
| `19-cargo-grh-desktop-bottom.png` | Plano de 11 semanas, discursiva, pesquisa FGV e CTA “Definir como cargo alvo” com ícone de check. |
| `34-cargo-grh-mobile-top.png` | Cargo mobile: hero, stats empilhados, select truncado. |
| `35-cargo-grh-mobile-mid.png` | Lista de aulas no mobile com a concatenação evidente. |
| `36-cargo-grh-mobile-table.png` | Tabela do plano no mobile: colunas comprimidas e Checkpoint cortado. |
| `45-listrows-cargo.png` | Recorte das 16 linhas de aulas do cargo. |

## Observações não bloqueantes

- **Caderno longo no mobile:** 10.305 px de altura, com 18 flashcards de 210 px empilhados. É longo, mas cada card é legível e não há truncamento de texto; não tratei como defeito, apenas como característica do formato.
- **Tema claro:** a home foi capturada em claro e o contraste foi medido no caderno; não encontrei regressão visual.
- **Tabela do plano no desktop:** as duas tabelas (5 fases e S0–S11) alinham e não têm overflow; o problema é exclusivamente de largura no mobile.
- **Cards:** não encontrei cards desalinhados. Os grids esticam os cards e os metadados ficam no rodapé; a exceção visual é o card único “Caderno específico” em largura total no cargo, que é intencional.

## Ordem sugerida de correção

1. **Achado 1** (list-row): uma regra CSS resolve as 24 linhas e devolve legibilidade à home e ao cargo.
2. **Achado 2** (flashcards 0/0): carregar o dado ou proteger o total; corrige a contradição “135 cards × 0/0”.
3. **Achado 3** (âncoras): uma regra de `scroll-padding-top` resolve todos os atalhos do caderno.
4. **Achado 4** (tabelas mobile): min-width + dica de rolagem (ou layout empilhado); é o ajuste de maior impacto no estudo pelo celular.
5. **Achado 5** (persistência do cargo): evitar sobrescrever a escolha do usuário ao apenas visitar uma página de cargo.
6. **Achado 6** (questões estáticas): alinhar a instrução “marque uma alternativa” com a interação real.
7. **Achados 7–9:** polimento de affordance, seletor mobile e drawer; podem entrar em uma segunda passada.

## Conclusão

O site está **bom para publicar com ressalvas**. A estrutura, o conteúdo do caderno, o plano por cargo, a responsividade de página e o contraste estão sólidos; não há sinal de quebra de layout e não encontrei erro de console. Os problemas encontrados são de acabamento e de expectativa de interação, com destaque para a lista de prioridades, o total de flashcards, as âncoras do caderno e as tabelas no mobile. Corrigindo os cinco primeiros itens, a experiência fica consistente o suficiente para uso diário de estudo.

## Status das correções (15/11/2026)

| # | Status | O que mudou |
|---|---|---|
| 1 | Corrigido | `.list-row .title` e `.list-row .sub` agora são `display:block`; título e subtítulo não se concatenam mais. |
| 2 | Corrigido | `updateWidgets()` preserva o total estático quando `FLASHCARDS` ainda não foi carregado; a home mostra `0/135`, não `0/0`. |
| 3 | Corrigido | `html { scroll-padding-top: 124px; }` no desktop e `72px` até 860px; os atalhos do caderno deixam de ficar sob o topbar/configbar. |
| 4 | Melhorado | Tabelas de 5 e 8 colunas recebem largura mínima no mobile, dica textual de rolagem e `tabindex=0`/`role=region` quando há overflow. |
| 5 | Corrigido | Visitar a página de um cargo não grava mais o cargo no `localStorage`; a persistência só ocorre no seletor ou no CTA “Definir como cargo alvo”. |
| 6 | Resolvido | O motor `assets/caderno.js` transforma as alternativas em controles clicáveis, com feedback, bloqueio, comentário e placar. A instrução “marque uma alternativa” agora corresponde à interação real. |
| 7 | Melhorado | Acordeões ganharam indicador `+`/`−`; o rótulo externo das questões passou a “abrir questão”. |
| 8 | Corrigido | O seletor usa `nome_curto`, `title` com o nome completo e fonte de 11px no mobile; o texto de GRH cabe em 390px. |
| 9 | Parcial | Menu, tema e busca passaram a ter alvos de pelo menos 44px. O drawer ainda não tem backdrop nem botão de fechar dedicado; permanece como melhoria de acabamento. |

Os testes de regressão pós-correção confirmaram: home com `0/135`; cargo só persiste após o CTA; âncora do módulo 3 em `top: 124px` com configbar terminando em `113px`; tabela móvel de 640px com dica visível; quiz, reset global, flashcards, filtro, reset de caixas e simulado funcionando nos dois cadernos, sem erros de console e sem overflow de página em 390px.
