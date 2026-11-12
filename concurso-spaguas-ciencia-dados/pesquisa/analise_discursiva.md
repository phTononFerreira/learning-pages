# Análise da prova discursiva — SP Águas/FGV

**Ênfase:** Tecnologia da Informação e Ciência de Dados — Analista de Suporte à Regulação de Recursos Hídricos I.
**Coleta:** 11/11/2026. `FATO` = verificado em edital, prova ou documento oficial; `INFERÊNCIA` = dedução, não garantia.

## 1. O que o edital fixa (fato)

| Item | Regra |
|---|---|
| Formato | 2 questões discursivas, até 40 linhas cada, 20 pontos cada |
| Data/horário | 31/01/2027, 15h–19h (Brasília), manuscrita |
| Habilitação | mínimo 10/20 em **cada** questão; abaixo disso, eliminação |
| Correção | apenas os 12 primeiros da ênfase (4 × 3 vagas), incluindo empatados; PcD à parte |
| Critérios | domínio do conteúdo, pertinência, argumentação, organização/clareza e Língua Portuguesa |
| Nota zero | em branco, fuga ao tema, ilegível, identificação, ausência de abordagem pertinente |
| Excedente | linhas acima de 40 são desconsideradas |

Fonte: edital, itens 11.6–11.15. Não há mínimo de linhas; o texto pode ser menor, mas precisa cobrir o comando. A correção é anônima, só o caderno definitivo vale, e o padrão de correção só é divulgado no período recursal (11.8). A habilitação é por questão: não há compensação entre elas.

## 2. Como a FGV cobra (fato + inferência)

**Fato — formatos observados.** Nos exemplos localizados, a FGV usa dois desenhos: (i) **redação/dissertação**, com texto motivador e rubrica de estrutura + gramática; e (ii) **questão discursiva técnica**, com caso e itens (a, b, c), corrigida por espelho. A extensão varia de 20 a 30 linhas; a SP Águas fixou 40. O comando usa verbos operacionais ("explique", "calcule", "justifique", "proponha"). **Texto motivador:** use um dado ou contraste na fundamentação; não o parafraseie.

**Fato — o comparador mais próximo.** A CVM 2024 (FGV, agência reguladora) teve 2 questões, 30 linhas e 20 pontos cada, com mínimo de 16/40 no total. No perfil Ciência de Dados, a questão 1 pediu KDD, normalização, discretização e ganho de informação a partir de uma tabela; a questão 2 trouxe código Python/SQL e pediu modelo multidimensional, snowflake, saída de comando e visualização. Nesses exemplos, a FGV cobrou **tarefa concreta**, não dissertação livre.

**Fato — outros exemplos.** TJ-RJ (Cientista de Dados): 1 questão, 30 linhas, com acurácia em base desbalanceada, SMOTE, XAI e LGPD. TCE-GO 2024 (TI): 2 questões, 20 linhas, com cálculo de precisão/recall/F1 e um plano COBIT. A rubrica da FGV (PSS/MINC 2024) separa 18 pontos de estrutura e 12 de correção gramatical, com dedução por erro.

**Inferência.** Para a SP Águas, o cenário mais provável é 2 questões aplicadas, cada uma com um caso curto (tabela, base de outorgas, indicadores de escassez) e 3–4 comandos. O formato "redação" é menos provável, pois o edital fala em conhecimentos do cargo e dá 40 linhas por questão.

## 3. Os cinco critérios, traduzidos (inferência)

| Critério | Regra prática |
|---|---|
| Domínio do conteúdo | 3–5 conceitos-chave, definidos com precisão e atualizados |
| Pertinência | responder cada verbo/item, na ordem, sem tangenciar |
| Argumentação | tese, evidência, causa/consequência e trade-off; explicar o "porquê" e o "e se" |
| Organização/clareza | 4–5 parágrafos, tópico frasal, conectivos, 1 ideia por parágrafo |
| Língua Portuguesa | norma culta, impessoalidade, precisão lexical, sem oralidade |

Citação legal errada é pior que ausência de citação.

## 4. Mapa de temas (12 temas prováveis)

Critério de priorização: (i) subitem explícito do edital; (ii) ancoragem concreta na SP Águas; (iii) possibilidade de 3+ comandos em 40 linhas. Probabilidade é estimativa, não previsão; o paralelo com a CVM é de formato e banca, não de conteúdo.

| # | Tema | Bloco do edital | Âncora SP Águas | Prob. |
|---|---|---|---|---|
| 1 | Governança e qualidade de dados do cadastro de outorgas | III.3.2; I.1.1–1.3 | SOE, SIDeCC, cadastro de usuários | Média-alta |
| 2 | ETL e integração de dados para fiscalização | I.1.3; IV.4.1 | SIDeCC-R, PROFISC, fiscalização | Alta |
| 3 | Dashboard e indicadores de escassez hídrica | III.3.1; II.2.2 | Protocolo de Escassez, Sala de Situação, Hidro App | Alta |
| 4 | Machine learning para priorizar fiscalização | II.2.3 | fiscalização, PROFISC, risco | Alta |
| 5 | LGPD nas bases de dados da SP Águas | Geral IV.4.3; III.3.2 | CPF/CNPJ de usuários, dados abertos | Média-alta |
| 6 | Segurança e continuidade dos sistemas de outorga | Geral IV.4.2; IV.4.3 | SOE, SIDeCC, disponibilidade | Média-alta |
| 7 | APIs REST e interoperabilidade no SINGREH/SIGRH | IV.4.1 | SOE, SIGRH, 21 CBHs, dados abertos | Média-alta |
| 8 | Computação em nuvem para dados hidrológicos | IV.4.2 | volume de dados, Sala de Situação, DR | Média |
| 9 | Governança de TI e gestão de serviços | IV.4.4; Geral II.2.4 | agência reguladora, serviços digitais, SLA | Média-alta |
| 10 | Transparência ativa, dados abertos e accountability | Geral III.3.3; III.3.2 | Plano de Dados Abertos, 33 datasets (na coleta) | Média-alta |
| 11 | Estatística descritiva e séries hidrológicas | II.2.2; I.1.3 | SPI, chuva, vazão, falhas de série | Alta |
| 12 | SQL, modelagem e Pandas para análise regulatória | I.1.1–1.2; II.2.1 | base de outorgas, consultas gerenciais | Alta |

Detalhamento, comandos de treino e repertório: `temas_discursivos.json`. **Fora do recorte:** hidrologia física e cobrança não são o núcleo da ênfase; SQL/Pandas aparecem no tema 12 e também podem ser cobrados na objetiva.

## 5. Template de 40 linhas

| Bloco | Linhas | Função | Conteúdo |
|---|---|---|---|
| Abertura | 1–4 | contexto + tese + roteiro | 1 frase de contexto (SP Águas/regulação); 1 tese; 1 recorte; 1 transição |
| Bloco 1 | 5–13 | fundamentos | 2–3 conceitos; 1–2 normas; 1 exemplo |
| Bloco 2 | 14–27 | aplicação e diagnóstico | sistemas/dados da SP Águas; causa-raiz; riscos; trade-offs |
| Bloco 3 | 28–36 | proposta e argumentação | 3 medidas; 1 objeção/limitação; 1 indicador de sucesso |
| Fecho | 37–40 | síntese | retomada da tese; 1 recomendação prioritária |

**Se a questão vier com itens (a, b, c):** 1–3 linhas de abertura; um parágrafo por item (10–12 linhas); 2–3 linhas de fecho. Se o item pedir cálculo, mostre a fórmula, os valores intermediários e a interpretação — não só o resultado.

**Tempo (4h):** 15 min de leitura; 70 min por questão (10 de esqueleto, 50 de escrita e 10 de revisão); ~85 min de margem para transcrição e imprevistos. **Texto:** 40 linhas ≈ 400–500 palavras; um parágrafo de 8–10 linhas ≈ 100–120 palavras. Se couber em 32 linhas, não encha até 40.

## 6. Checklist de correção (autoavaliação)

Dar 0, 1 ou 2 por item; total 20. **Não é o espelho oficial.**

1. Respondi a todos os verbos e itens do comando?
2. A introdução tem tese clara e recorte?
3. Usei pelo menos 3 conceitos corretos do edital?
4. Citei corretamente ao menos 2 normas/artefatos técnicos?
5. Conectei a resposta à SP Águas (outorga, fiscalização, cobrança, escassez, dados)?
6. Expliquei causas, consequências e trade-offs, em vez de só listar?
7. Reconheci um risco, limitação ou contra-argumento?
8. Há 4–5 parágrafos com tópico frasal e progressão?
9. A língua está na norma culta, impessoal, sem marcas de oralidade?
10. A resposta cabe em 40 linhas, está legível e sem identificação?

**Leitura:** 18–20 = excelente; 14–17 = aprovado com margem; 10–13 = risco; <10 = reprovado. O mínimo é 10; a classificação exige mais.

## 7. Como treinar em 2h/dia (11/11/2026 a 31/01/2027)

**Bloco diário (2h):** 15 min de repertório; 60 min de escrita (1 questão ou bloco de 12 linhas, com cronômetro); 30 min de correção (checklist, espelho e reescrita do pior parágrafo); 15 min de revisão espaçada.

**Ciclo semanal (14h):** 4 dias úteis × 2h; sábado, 1 simulação completa de 4h (2 questões, manuscritas, em folha de 40 linhas); domingo, 2h de correção e log de erros; 1 dia de descanso.

**Fases (11,5 semanas):** semanas 1–3, fundamentos; 4–6, questões completas; 7–9, 1 simulado/semana + correção; 10–11, pontos fracos + simulado final; 27–30/01, revisão leve.

**Treino de mão:** 1 página/dia nas 3 primeiras semanas; 40 linhas em 55 min até a semana 6. A prova é manuscrita, sem corretor líquido.

## 8. Fontes

- Edital SP Águas 2026 — https://conhecimento.fgv.br/sites/default/files/concursos/edital_sp_aguas_versao-final-revisao-comissao-versao-aprovada_aasncskaj_0.pdf
- Critérios de correção FGV (PSS/MINC 2024) — https://conhecimento.fgv.br/sites/default/files/concursos/comunicado-criterios-de-correcao-prova-discursiv.pdf
- CVM 2024 — edital — https://conhecimento.fgv.br/sites/default/files/concursos/edital-1-2024-abertura-concurso-cvm.pdf
- CVM 2024 — discursiva Ciência de Dados — https://conhecimento.fgv.br/sites/default/files/concursos/manha-analista-cvm-perfil-7-ciencia-de-dadosperfil-7-tipo-1.pdf
- TJ-RJ — Cientista de Dados — https://conhecimento.fgv.br/sites/default/files/concursos/analista-judiciario-tecnologia-da-informacao-cientista-de-dados-ns-a17-cientistadados-tipo-1.pdf
- TCE-GO 2024 — TI — https://conhecimento.fgv.br/sites/default/files/concursos/analista-de-controle-externo-tecnologia-da-informacaocns205-tipo-1.pdf
- TCE-RR 2024 — Análise de Dados — https://conhecimento.fgv.br/sites/default/files/concursos/auditor-de-controle-externo-tecnologia-com-especialidade-em-analise-de-dadosdns306-tipo-1.pdf
- SP Águas — https://www.spaguas.sp.gov.br/site/
- SP Águas — Outorgas — https://www.spaguas.sp.gov.br/site/outorga/
- SP Águas — LGPD — https://www.spaguas.sp.gov.br/site/lgpd/
- SP Águas — Protocolo de Escassez — https://apps.spaguas.sp.gov.br/protocolo/
- SP Águas — Sala de Situação — https://salasituacaosp.spaguas.sp.gov.br/sssp/boletins-diario.php
- SP Águas — Dados Abertos SP — https://dadosabertos.sp.gov.br/organization/agencia-de-aguas-do-estado-de-sao-paulo-sp-aguas
- LC 1.413/2024 — https://www.al.sp.gov.br/repositorio/legislacao/lei.complementar/2024/lei.complementar-1413-23.09.2024.html
- Lei 9.433/1997 — https://www.planalto.gov.br/ccivil_03/leis/l9433.htm
- Lei 7.663/1991 — https://www.al.sp.gov.br/repositorio/legislacao/lei/1991/compilacao-lei-7663-30.12.1991.html
- LGPD — https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm
- LAI — https://www.planalto.gov.br/ccivil_03/_ato2011-2014/2011/lei/l12527.htm
