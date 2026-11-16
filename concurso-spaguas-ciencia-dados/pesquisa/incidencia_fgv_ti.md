# Incidência FGV em TI e Ciência de Dados

**Recorte:** provas FGV de 2022–2026 para Analista/Especialista em TI, Ciência de Dados, Banco de Dados, BI e áreas afins. **Coleta:** 11/11/2026. **Método:** leitura dos cadernos e extração das questões específicas; incidência qualitativa, não contagem estatística. Corpus: 9 cadernos, ~400 questões.

> **Aviso:** a SP Águas é concurso inaugural. A incidência abaixo é proxy de estilo, não previsão do que cairá. A FGV muda o perfil conforme o cargo: em Banco de Dados, SQL domina; em Ciência de Dados, ML/Python dominam; em TI generalista, governança e segurança ganham peso.

## 1. Tabela de incidência

Critério: **Alta** = tema central, presente em ≥4 provas ou em bloco próprio; **Média** = 2–3 provas, 1–3 questões; **Baixa** = 0–1 prova.

| Tópico | Incidência | Como a FGV cobra | Evidência |
|---|---|---|---|
| SQL (SELECT, WHERE, ORDER BY, GROUP BY, JOIN) | **Alta** | Prever saída; escolher a query correta; contar linhas de JOIN; `EXISTS` vs `INNER JOIN`; `HAVING` | TJ-MS Q29/Q42; TJRJ Q45/Q46; CVM Q43/Q45 |
| Modelagem ER, SGBD e normalização | **Alta** | Símbolo de Chen; cardinalidade; 1FN–3FN/BCNF; PK/FK/UNIQUE; modelo relacional | ALEGO Q45/Q46; TJ-MS Q30/Q34/Q35; SEFAZ-AM Q50 |
| ETL, qualidade e limpeza | **Média** | Definir etapa; escolher ferramenta; dimensão de qualidade; `dropna`; data lake vs DW | MPU Q47; CVM Q36; ALEGO Q42 |
| Python, Pandas e NumPy | **Alta** | Prever output; método correto; dict/lista; view vs copy; `fit`/`predict` | ALEGO Q59; CVM Q28/Q36; MPU Q51; TJRJ Q40 |
| Estatística descritiva | **Média** | Média vs mediana; coeficiente de variação; boxplot/outliers | SEAP-PR Q27/Q28/Q33; CVM Q53 |
| Correlação e tendência | **Baixa** | Interpretar heatmap/matriz; sinal e força | SEAP-PR Q35 (única direta) |
| ML: conceitos e tipos | **Alta** | Supervisionado vs não supervisionado; algoritmo; overfitting; clustering | ALEGO Q44/Q48/Q53; CVM Q5/Q15; TJ/MT Q65 |
| Matriz de confusão, precisão e recall | **Média** | Fórmulas; escolher a métrica pelo custo do erro | ALEGO Q58; CVM Q1 |
| BI, DW e dashboards | **Alta** | DW vs data lake; OLAP; star/snowflake; tipos de fato; Power BI | TJRJ Q41–Q44/Q49/Q50; MPU Q46/Q53/Q54; CVM Q32 |
| Governança de dados e metadados | **Média** | DAMA/DMBOK; dados mestres; `COMMENT ON`; linhagem | MPU Q50; TJ-MS Q33 |
| APIs REST, JSON e XML | **Média** | Gramática JSON; objeto vs array; REST/SOAP/WSDL | SEFAZ-AM Q9/Q10; CVM Q29/Q30 |
| Nuvem: IaaS, PaaS, SaaS | **Média** | Escolher o modelo por cenário; autonomia; pública/privada | CVM Q2; SEFAZ-AM Q21/Q22/Q25 |
| Segurança e backup | **Média** | CIA; cripto simétrica/assimétrica; backup lógico; LGPD | TJ-MS Q43; SEFAZ-AM Q48/Q54; TJ/MT Q47 |
| Governança de TI | **Média** | COBIT, ITIL, ISO 38500, PDTIC | TJ/MT Q41/Q44/Q51/Q67; SEFAZ-AM Q35 |

## 2. Formatos de cobrança

- **Cinco alternativas, uma correta**, quase sempre "assinale a opção". Em 2024–2026, cresceu o enunciado-cenário com ferramenta nomeada (Power BI, Pentaho, PostgreSQL, Oracle, MongoDB).
- **Previsão de saída de código** (SQL e Python) é o formato mais comum em dados. Não se pede código longo; pede-se o resultado ou o comando que completa o script.
- **I/II/III + "está correto o que se afirma em"** e **V/F** são usados para conceitos e fórmulas.
- **Cálculo curto**: linhas de JOIN, média/mediana, coeficiente de variação, precisão/recall.
- **Enunciado negativo** ("NÃO corresponde", "incorreta") aparece com frequência; marque a palavra antes de responder.
- Em provas de CD, há **detalhe de biblioteca/versão** (scikit-learn 1.6.1, pandas, matplotlib) e **produto de BI** (OBIEE, QlikView). Em TI generalista, cobra-se **vocabulário de governança** (COBIT/ITIL) e **segurança**.

## 3. Exemplos reais

- **SQL:** TJ-MS Q29 pede a lista "sem repetições" de fornecedores com produtos abaixo de 20; as alternativas misturam `EXISTS`, `INNER JOIN`, `UNION` e `ANY` — o `INNER JOIN` duplicaria fornecedores. TJ-MS Q42 dá tabelas de 9 e 10 registros e pede os totais em `INNER`, `RIGHT`, `FULL`, `CROSS` e `LEFT` (6, 10, 13, 90, 9). TJRJ Q45 cobra `GROUP BY comarca` + `HAVING COUNT(*) > 1`.
- **ER/SGBD:** ALEGO Q45 pergunta o elemento gráfico de "relacionamento" na notação de Chen (losango); TJ-MS Q35 classifica um esquema com chave composta e sem dependências transitivas (3FN); SEFAZ-AM Q50 cobra BCNF a partir de dependências funcionais.
- **ETL/limpeza:** MPU Q47 monta o cenário MongoDB → Pentaho → Data Mart PostgreSQL → dashboard no MicroStrategy; CVM Q36 mostra `df.dropna(inplace=True)` e pede o efeito (remover linhas com células vazias, não duplicatas).
- **Python/Pandas:** ALEGO Q59 pergunta o tipo da estrutura `{...}` (dicionário); MPU Q51 explora `arr.copy()` vs `arr.view()`; CVM Q28 cobra `fit(X1,y)` e `predict(X2)` no scikit-learn.
- **Estatística/correlação:** SEAP-PR Q27 parte de 36 idades com média 42 e mediana 41 e acrescenta 38, 38, 42 e 50: a média continua 42, mas **nada se pode afirmar** sobre a nova mediana. Q28 pede o maior coeficiente de variação; Q33, o gráfico para outliers (boxplot); Q35, a leitura de um heatmap de correlação entre cinco variáveis.
- **ML:** CVM Q1 pede a métrica a maximizar quando o falso negativo é caro (revocação); ALEGO Q58 mistura as fórmulas de especificidade, recall, precisão e VPN; ALEGO Q53 pede os centróides do K-Means.
- **BI/dashboards:** TJRJ Q49 cobra o visual "Matriz" para hierarquia; Q50, o Power Query para ETL; MPU Q46, `drillthrough` no Power BI; CVM Q32, data lake para dados estruturados, semiestruturados e não estruturados.
- **Governança/API/nuvem:** MPU Q50 cobra a área do DAMA/DMBOK para dados mestres; TJ-MS Q33, `COMMENT ON TABLE` como metadado; SEFAZ-AM Q10, a definição de string JSON; CVM Q2, IaaS; TJ-MS Q43, `mysqldump`.

## 4. Dez pegadinhas recorrentes

1. **Precisão ≠ recall ≠ acurácia.** Precisão = VP/(VP+FP); recall = VP/(VP+FN); acurácia = (VP+VN)/total. ALEGO Q58 troca os denominadores; CVM Q1 exige escolher recall quando deixar passar caso grave custa caro.
2. **Média vs mediana.** A média reage a todos os valores; a mediana, à posição. Acrescentar valores que somam a mesma média mantém a média e pode deslocar a mediana — SEAP-PR Q27 explora exatamente isso.
3. **INNER vs LEFT vs FULL vs CROSS.** `INNER` só pares casados; `LEFT` preserva a esquerda; `FULL` preserva as duas; `CROSS` é produto cartesiano. TJ-MS Q42 e SEFAZ-AM Q45 cobram contagem de linhas, não sintaxe.
4. **WHERE vs GROUP BY/HAVING.** `WHERE` filtra linhas antes do agrupamento; `HAVING` filtra grupos depois. `WHERE` não pode filtrar resultado de agregação. TJRJ Q45 usa `HAVING COUNT`; TJ-MS Q29 usa `HAVING` em alternativa incorreta.
5. **GROUP BY vs DISTINCT/EXISTS.** "Sem repetições" nem sempre pede `DISTINCT`: com join 1:N, o `EXISTS` costuma ser a resposta correta (TJ-MS Q29).
6. **IaaS vs PaaS vs SaaS.** IaaS entrega infraestrutura (o cliente gerencia SO/aplicação); PaaS entrega plataforma; SaaS entrega software pronto. CVM Q2 pede IaaS para "servidores, rede, armazenamento"; SEFAZ-AM Q21 pergunta qual dá mais autonomia (IaaS).
7. **JSON objeto vs array.** Objeto é coleção **não ordenada** de pares nome-valor; array é lista ordenada. String JSON usa aspas duplas; `undefined` não existe no JSON. CVM Q29 e SEFAZ-AM Q10 exploram isso.
8. **DW vs Data Lake vs Data Mart.** Data lake guarda dados brutos, estruturados ou não; DW é orientado por assunto, integrado e não volátil; data mart é recorte departamental. CVM Q32 e ALEGO Q62 usam as definições trocadas.
9. **Dimensão degenerada vs junk vs bridge.** Número de processo é dimensão degenerada; flags/indicadores aleatórios vão para junk dimension; relacionamento N:N exige bridge table. ALEGO Q47, MPU Q54 e CVM Q42 cobram essa distinção.
10. **1FN/2FN/3FN vs BCNF.** 1FN exige atomicidade; 2FN elimina dependência parcial; 3FN elimina dependência transitiva; BCNF exige que todo determinante seja chave candidata. TJ-MS Q35 e SEFAZ-AM Q50 testam a diferença.

**Menções rápidas:** `dropna()` não remove duplicatas (CVM Q36); fato percentual é **não aditivo** (TJRJ Q43); `//` em Python é divisão inteira (TJ/MT Q45); overfitting é desempenho bom no treino e ruim no teste (TJ/MT Q65).

## 5. Leitura estratégica para a SP Águas

- **Prioridade máxima:** SQL (interpretação e JOIN), modelagem ER/normalização e vocabulário de BI/DW. São os de maior incidência e estão no edital.
- **Prioridade alta:** Python/Pandas (métodos e saída de código), estatística descritiva (média/mediana, variância/desvio, boxplot) e métricas de ML (matriz de confusão, precisão, recall). A FGV cobra fórmula e interpretação, não implementação.
- **Prioridade média:** definições de ETL/qualidade, governança/metadados, APIs/JSON/XML, IaaS/PaaS/SaaS, segurança/backup e COBIT/ITIL. São baratas de estudar e aparecem como questões diretas.
- **Não superinvestir:** internals de Oracle (RMAN, tablespace, views DBA), BCNF com prova formal e ML avançado (LSTM, word2vec, TD3). Isso aparece em provas de Banco de Dados/CVM/ALEGO, mas o edital da SP Águas pede "noções". Ainda assim, FGV já cobrou detalhe de ferramenta (Power Query, `fit`/`predict`), então não ignorar o básico operacional.

## 6. Lacunas declaradas

- **Correlação linear:** não localizei questão direta em prova FGV de TI/CD no recorte. A única evidência é SEAP-PR Q35 (heatmap, prova de Auditor Fiscal, bloco "Análise de Dados"). Tratar como incidência baixa, mas estudar sinal, força e leitura de matriz.
- **Estatística descritiva básica:** as provas de CD (CVM/ALEGO) pendem para inferência e ML; média/mediana/CV/boxplot aparecem na SEAP-PR Q27/Q28/Q33, usada como prova próxima.
- **Governança de dados:** nos exames de TI, aparece como DAMA/dados mestres e `COMMENT ON`; não encontrei cobrança profunda de linhagem ou catálogo.
- **SP Águas:** não há prova anterior da FGV para este certame; qualquer previsão é estimativa.

## 7. Fontes (coletadas em 11/11/2026)

1. **SEFAZ-AM 2022 — Analista de TI (manhã):** https://conhecimento.fgv.br/sites/default/files/concursos/analista_de_tecnologia_da_informacao_da_fazenda_estadual_manhacns003_tipo_2.pdf
2. **SEFAZ-AM 2022 — Analista de TI (tarde):** https://conhecimento.fgv.br/sites/default/files/concursos/analista_de_tecnologia_da_informacao_da_fazenda_estadual_tardecns203_tipo_1.pdf
3. **CVM 2024 — Analista CVM, Perfil 7, Ciência de Dados:** https://conhecimento.fgv.br/sites/default/files/concursos/tarde-analista-cvm-perfil-7-ciencia-de-dadosperfil-7-tipo-2.pdf
4. **TJ-MS 2024 — Analista de Banco de Dados:** https://conhecimento.fgv.br/sites/default/files/concursos/tecnico-de-nivel-superior-analista-de-sistemas-computacionais-analista-de-banco-de-dadoscr-03-bd-tipo-1.pdf
5. **TJ/MT 2024 — Analista Judiciário/TI:** https://conhecimento.fgv.br/sites/default/files/concursos/cns102-analista-judiciario-analista-de-ti-t02.pdf
6. **MPU 2025 — Analista do MPU/Desenvolvimento de Sistemas:** https://conhecimento.fgv.br/sites/default/files/concursos/a06-analista-do-mpu-desenvolvimento-de-sistemasa06-tipo-1.pdf
7. **ALEGO (Edital 01/2025) — Analista de Ciência de Dados:** https://conhecimento.fgv.br/sites/default/files/concursos/analista-legislativo-analista-de-ciencia-de-dados-cns101-tipo-1.pdf
8. **TJRJ 2025/2026 (edital 2025) — Analista de Dados Sênior:** https://conhecimento.fgv.br/sites/default/files/concursos/analista-judiciario-tecnologia-da-informacao-analista-de-dados-senior-ns-a16-analistadados-tipo-1.pdf
9. **SEAP-PR 2025 — Auditor Fiscal (bloco "Análise de Dados", usado só para estatística/correlação):** https://conhecimento.fgv.br/sites/default/files/concursos/auditor-fiscal-manhacns101-tipo-1.pdf
