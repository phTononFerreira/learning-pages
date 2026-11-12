# Análise da banca FGV — SP Águas 2026

**Cargo:** Analista de Suporte à Regulação de Recursos Hídricos I — TI e Ciência de Dados
**Prova:** 31/01/2027 · **Estrutura:** 20 gerais + 50 específicas · **Coleta:** 11/11/2026

> **Escopo e limite.** Primeiro concurso da SP Águas: não há prova anterior do órgão nem prova FGV de ciência de dados em recursos hídricos. Base: provas FGV de TI, dados e regulação de 2022–2026 (EPE 2024, CVM 2024, TJ-RJ 2025, AgSUS 2025, CNU 2025, AGENERSA 2022/2023). Onde não há exemplo real, o achado é marcado **[INFERIDO]**.

## 1. Perfil geral da FGV

- **Caso antes de definição [CONFIRMADO].** A FGV raramente pede a definição seca; monta cenário com personagem, órgão fictício ou tabela e pede a conduta/conclusão. Ex.: TJ-RJ 2025, q31 (contêineres vs VMs em aplicação de alta frequência), q43 (invasão em PaaS) e AGENERSA 2023, q36 (João e Maria, parentesco).
- **Enunciado longo, alternativas longas [CONFIRMADO].** No TJ-RJ 2025 (Cientista de Dados), o enunciado médio tem cerca de 80 palavras (picos de 175), sem as cinco alternativas; há itens com 400+ palavras. A informação decisiva costuma estar na última linha.
- **Alternativas verossímeis, diferença fina [CONFIRMADO].** Quase todas as opções são plausíveis; a correta responde exatamente ao comando. Em TJ-RJ 2025, q50, cinco críticas à validação 70/30 são defensáveis; o detalhe “2019–2023” desloca a leitura para validação temporal.
- **Mistura núcleo + entorno [CONFIRMADO].** Em TI, a FGV cobra o tópico junto com arquitetura, cloud, segurança e governança. No TJ-RJ 2025 (Cientista de Dados), dos 40 itens específicos, cerca de 20 eram de dados/BI/governança, 10 de infraestrutura/segurança, 8 de direito/administração e 2 de gestão/processos.
- **Reuso de itens [CONFIRMADO].** A questão dos “feijões” (método indutivo) aparece igual em TJ-RJ 2025, Cientista de Dados e Analista de Dados Sênior, q1.

## 2. Anatomia das questões

**Ex. 1 — SQL com intenção escondida (TJ-RJ 2025, Analista de Dados Sênior, q45) [CONFIRMADO].** Tabela `PROCESSOS (id_processo, comarca, status)`. Comando: “Para listar apenas as comarcas que possuem mais de um processo ativo, deve-se utilizar a query:”. A correta é `SELECT comarca ... WHERE status='Ativo' GROUP BY comarca HAVING COUNT(*) > 1`. As demais usam `DISTINCT` + subquery (não conta), `WHERE status='Ativo' AND id_processo >= 1` (não agrupa), `status='Inativo'` (troca o filtro) e `ORDER BY COUNT(*) DESC` (ordena, não filtra).

**Ex. 2 — Python de verdade (TJ-RJ 2025, Analista de Dados Sênior, q39) [CONFIRMADO].** Lista de listas `[numero, juiz, valor]`; pede o código que calcula o total por juiz. A correta usa `total[juiz] = total.get(juiz, 0) + valor`. As distratoras fazem `total[processo[1]] += processo[2]` (KeyError), agrupam pelo número do processo, acumulam listas em vez de somar ou invertem chave/valor. É Python básico, dict e laço.

**Ex. 3 — “À exceção de uma” (EPE 2024, Ciência de Dados, q44) [CONFIRMADO].** “As opções a seguir apresentam características funcionais do Power BI e seus componentes, à exceção de uma. Assinale-a.” Quatro alternativas descrevem componentes reais (Fabric, Desktop, .pbix); uma inventa o “Power BI Consolidator”.

**Ex. 4 — Metodologia de ML (TJ-RJ 2025, Cientista de Dados, q50) [CONFIRMADO].** Cenário: 12.000 alunos, 2019–2023, três modelos, split 70/30, acurácias 89%/91%/82%; pergunta como avaliar a metodologia. As cinco alternativas são críticas plausíveis: split padrão, k-fold, stratified split, forward-chaining e holdout final. Em série temporal, split aleatório vaza informação do futuro; a crítica mais precisa é forward-chaining.

**Ex. 5 — Caso de ética/direito (AGENERSA 2023, q36) [CONFIRMADO].** João, servidor federal, recebe recurso; a representante da empresa é Maria, “filha do irmão do seu pai” (sobrinha). Alternativas: impedido, suspeito, não configura, só se tiver orientado, abster-se pela teoria da aparência. A banca exige qualificar o parentesco e distinguir impedimento de suspeição.

## 3. Como a FGV cobra dados/TI

- **SQL e bancos [CONFIRMADO].** Três formatos: “qual query atende” com cinco queries; “quantos registros retorna/remove”; “o que está errado”. Cobra JOIN (INNER/LEFT/RIGHT/FULL/CROSS), NULL, GROUP BY/HAVING, subquery correlacionada, DELETE com subquery, normalização e dependência funcional. No TJ-RJ 2025 Sênior, q45–q47 são três SQLs seguidos; na EPE 2024, q40–q43 cobrem ER, normalização e DW.
- **Python [CONFIRMADO].** Execução de código curto, saída de `print`, listas/dicts/strings/arquivos, `open` e `encoding`, MongoDB (`drop()`) e tipos ordinais. Pandas não apareceu nos itens que examinei, mas está no edital; esperar `read_csv`, filtro, `groupby`, `merge` e `value_counts` é razoável. **[INFERIDO]**
- **Estatística e ML [CONFIRMADO].** Mais interpretação que demonstração: regressão linear, MAE/RMSE/R², acurácia/precisão/recall, matriz de confusão, overfitting/regularização, viés-variância, drift, SMOTE, transfer learning e validação. A conta, quando existe, é simples: em AgSUS 2025, q41, `y = 100 − 0,25x`; 300h → 25; 50h → 87,5.
- **BI [CONFIRMADO].** Power BI é o preferido: visual correto (Matriz para hierarquia), Power Query para ETL, .pbix e Fabric; também cobra gráfico e KPI.
- **Governança e segurança [CONFIRMADO].** LGPD aplicada (finalidade vs adequação vs necessidade; anonimização), tríade CIA, responsabilidade compartilhada em PaaS, backup/autenticação, COBIT/ITIL.
- **Arquitetura, cloud e APIs [CONFIRMADO].** IaaS/PaaS/SaaS, cloud bursting, nuvem híbrida, object storage, lakehouse, star/snowflake, SCD, fato aditivo/não aditivo, REST/JSON/XML. O edital diz “noções”, mas as provas FGV de dados usam vocabulário técnico e trade-offs; a profundidade na SP Águas é **[INFERIDO]**.

### 3.1 Conhecimentos gerais (20 q)

- **Data literacy e RLM [CONFIRMADO].** Gráficos/tabelas, porcentagem, probabilidade e lógica, sempre com contexto. Ex.: AgSUS 2025, q16–q20; CVM 2024, q36–q40.
- **Direito e ética [CONFIRMADO].** Caso com personagem e dois conceitos vizinhos; a resposta depende de qualificar o fato (parentesco, transparência ativa/passiva, ato vinculado/discricionário). Ex.: AGENERSA 2023, q24 e q36.
- **Governo digital e LGPD [CONFIRMADO].** Notícia ou situação + princípio/lei; alternativas com “porque” e definições trocadas. Ex.: CNU 2025 (Bloco 1, q10; Bloco 2, q36–q37); TJ-RJ 2025, q56 e q61.

## 4. Pegadinhas e armadilhas

1. **“Incorreta/exceto” com item inventado.** “Power BI Consolidator” (EPE 2024, q44). Em TI, a FGV inventa produto, sigla ou funcionalidade com nome plausível.
2. **Definições trocadas.** Transparência ativa vs passiva (AGENERSA 2023, q24: a alternativa B inverte as definições), impedimento vs suspeição (q36), data drift vs concept drift (TJ-RJ 2025, Cientista, q46), precisão vs recall, IaaS vs PaaS.
3. **Causa verdadeira, conclusão falsa (ou vice-versa).** Alternativas com “porque”: a primeira parte é correta, a segunda não. No CNU 2025, q10–q12 e q36 usam esse formato.
4. **Absolutos.** “Sempre”, “apenas”, “exclusivamente”, “idêntico”, “elimina”, “todos”. Ex.: TJ-RJ 2025, q31 (A) “isolamento ... idêntico ao das VMs”; q42 (C) “concentrar todas as cargas ... costuma ser mais adequado”. Quase sempre erradas.
5. **Cálculo com armadilha.** Regressão com coeficiente negativo (300h → 25, não 0); Mbps vs MB/s (AgSUS 2025, q33: 8 Mbps ≈ 1 MB/s); percentual “do que exceder”, não do total; média de médias.
6. **Código.** `KeyError` no dict, cabeçalho do CSV, `open(...,"w")` vs `"a"`, `drop()` vs `delete_many({})`, `==` vs `is`, divisão inteira, índice fora do range.
7. **SQL.** `WHERE` vs `HAVING`; `LEFT` vs `INNER`; `COUNT(*)` vs `COUNT(col)`; `NULL` em join e `NOT IN`; `ORDER BY` não filtra; `DISTINCT` não conta ocorrências.
8. **I, II e III.** Um item costuma ser falso por uma palavra; não marque “todas” por preguiça. Ex.: EPE 2024, q40; AgSUS 2025, q42 e q49.
9. **Enunciado com dados irrelevantes.** O comando está no fim; sublinhe o verbo (listar, calcular, identificar, assinalar a incorreta).
10. **Reuso.** Itens repetem entre provas do mesmo ciclo; resolver cadernos recentes é treino direto.

## 5. Incidência por tópico

> **Estimativa de trabalho.** O edital não traz a distribuição por tópico e a SP Águas não tem histórico. A tabela combina o peso do edital, a incidência nas provas FGV de dados (2022–2025) e o formato de 50 questões. **Não é contagem histórica.**

| Tópico | Frequência qualitativa | Prioridade |
|---|---|---|
| SQL, modelagem relacional, ER e normalização | Muito alta | P1 |
| Python e Pandas | Alta | P1 |
| Estatística descritiva, correlação e tendência | Alta | P1 |
| ML: conceitos, métricas, validação e drift | Alta | P1 |
| BI, dashboards, Power BI e ETL | Média-alta | P2 |
| Governança de dados, metadados e qualidade | Média | P2 |
| APIs REST, JSON, XML e cloud (IaaS/PaaS/SaaS) | Média | P2 |
| Segurança, backup, autenticação e LGPD técnica | Média-alta | P2 |
| Governança de TI (COBIT/ITIL) | Baixa-média | P3 |
| Gerais: data literacy, gráficos, RLM e falácias | Alta | P1 |
| Gerais: Lei 9.433/1997, SINGREH e regulação | Alta | P1 |
| Gerais: direito administrativo, ética, LAI/accountability | Alta | P1 |
| Gerais: governo digital, LGPD e segurança | Média-alta | P2 |

**Leitura:** P1 = estudar até resolver questões de prova; P2 = dominar conceito e diferenças; P3 = revisão de véspera. SQL tende a concentrar o maior número de itens; o bloco de gerais tende a ser mais interpretativo e legal.

## 6. Implicações práticas para o estudo

- **Estude por contraste, não por resumo.** Para cada par (WHERE/HAVING, INNER/LEFT, ativa/passiva, impedimento/suspeição, data/concept drift), faça uma tabela “quando usar” x “erro típico”.
- **SQL à mão.** Resolva 30–40 queries curtas em papel, com tabelas de 4–6 linhas; inclua NULL, JOIN sem correspondência, GROUP BY/HAVING e subquery.
- **Python/Pandas.** Memorize os idioms essenciais (`read_csv`, `loc`, `query`, `groupby.agg`, `merge`, `value_counts`, `fillna/dropna`, `sort_values`, `to_datetime`) e treine rastrear código de 10–20 linhas.
- **Estatística/ML.** Para cada métrica, saiba o que mede, quando engana e como interpretar; treine escolher métrica em cenário desbalanceado e detectar overfitting/drift.
- **Gerais.** Leia o comando antes do texto; circule “incorreta/exceto/NÃO”. Treine 20 questões de RLM por semana e um caso de ética/LAI/LGPD por dia.
- **Simulados.** Use provas FGV recentes (EPE, TJ-RJ, AgSUS, CNU) com cronômetro: 70 questões em 4h. Registre o motivo de cada erro (conceito, leitura, cálculo, distrator).
- **Discursiva (curto).** A FGV de dados cobra entrega concreta: CVM 2024 pediu tabela após normalização/discretização + ganho de informação; TJ-RJ 2025, diagrama multidimensional + SQL da fato + ferramenta de visualização + comando Python. Estrutura: (1) o que será feito; (2) fórmula/script/passos; (3) resultado; (4) justificativa. Use itens (a/b/c), mostre as contas e respeite as 40 linhas.

## 7. Fontes

Todas coletadas em **11/11/2026**.

1. FGV — página oficial do concurso SP Águas: https://conhecimento.fgv.br/concursos/spaguas26
2. FGV — Edital nº 01/2026 (PDF): https://conhecimento.fgv.br/sites/default/files/concursos/edital_sp_aguas_versao-final-revisao-comissao-versao-aprovada_aasncskaj_0.pdf
3. FGV — EPE 2024, Analista de Gestão Corporativa/TI — Ciência de Dados: https://conhecimento.fgv.br/sites/default/files/concursos/agc-ti-ciencia-de-dadoscns007-tipo-1.pdf
4. FGV — CVM 2024, Analista — Perfil 7 — Ciência de Dados: https://conhecimento.fgv.br/sites/default/files/concursos/manha-analista-cvm-perfil-7-ciencia-de-dadosperfil-7-tipo-2.pdf
5. FGV — TJ-RJ 2025, Analista Judiciário/TI — Cientista de Dados: https://conhecimento.fgv.br/sites/default/files/concursos/analista-judiciario-tecnologia-da-informacao-cientista-de-dados-ns-a17-cientistadados-tipo-1.pdf
6. FGV — TJ-RJ 2025, Analista Judiciário/TI — Analista de Dados Sênior: https://conhecimento.fgv.br/sites/default/files/concursos/analista-judiciario-tecnologia-da-informacao-analista-de-dados-senior-ns-a16-analistadados-tipo-1.pdf
7. FGV — AgSUS 2025, Analista de Gestão/TI: https://conhecimento.fgv.br/sites/default/files/concursos/analista-de-gestao-tecnologia-da-informacaocns014-tipo-1.pdf
8. FGV — CNU 2025 (2ª edição), Bloco Temático 1: https://conhecimento.fgv.br/sites/default/files/concursos/b1103.pdf
9. FGV — CNU 2025 (2ª edição), Bloco Temático 2: https://conhecimento.fgv.br/sites/default/files/concursos/b2203.pdf
10. FGV — AGENERSA 2022/2023, Especialista em Regulação: https://conhecimento.fgv.br/sites/default/files/concursos/cns002-especialista-em-regulacaocns002-tipo-1.pdf
11. Aprova Concursos — “Perfil da banca FGV” (2026): https://www.aprovaconcursos.com.br/blog/perfil-da-banca-fgv/
12. SP Águas — “SP Águas publica edital de seu primeiro concurso público com 190 vagas”: https://www.spaguas.sp.gov.br/site/sp-aguas-publica-edital-de-seu-primeiro-concurso-publico-com-190-vagas/
