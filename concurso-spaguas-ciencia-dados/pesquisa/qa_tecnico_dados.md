# QA técnico — SQL, Python, Pandas, Estatística e ML (s1 e s2)

**Escopo:** 15 aulas (`conteudo/s1/` 7 + `conteudo/s2/` 8), 45 questões. **Data:** 11/11/2026.
**Método:** leitura integral; conferência de fórmulas, sintaxe e saídas; execução de snippets em Python 3.10.11, pandas 1.5.3, NumPy 1.26.0 e SQLite 3.40.1; documentação oficial (PostgreSQL, pandas, scikit-learn, Python); `pesquisa/incidencia_fgv_ti.md` e `pesquisa/CONTEXTO_EDITAL.md`.

## Resumo

- **15 aulas revisadas; 3 alteradas** (`s1-02`, `s1-03`, `s2-02`), com **3 correções técnicas**.
- **45 gabaritos conferidos; nenhum gabarito errado.** Todos os cálculos das questões batem.
- **5 pontos “verificar”** (dialeto SQL, premissa de questão, método estatístico e abrangência de algoritmo); nenhum foi alterado por ser ambíguo.
- **42 URLs únicas** (50 ocorrências): todas responderam HTTP 200; 4 redirecionam para página equivalente. Nenhum link quebrado.
- `python scripts/validar_conteudo.py` → **45 arquivos, 0 erros**.

## Correções aplicadas

| Arquivo | Antes | Depois | Fonte / justificativa |
|---|---|---|---|
| `conteudo/s1/s1-02.md` | Linha N:N da tabela “Onde vai a FK”: “nas duas tabelas originais” | “na tabela associativa (uma FK para cada original)” | Mapeamento N:N: as duas FKs ficam na tabela associativa, cada uma referenciando uma tabela original (Elmasri/Navathe, mapeamento ER-relacional; PostgreSQL — Foreign Keys). O exemplo `alocacao` da própria aula já mostrava isso; a célula contradizia a coluna “Tabela criada”. |
| `conteudo/s1/s1-03.md` | Q3, comentário: “Não existe dependência parcial, pois as chaves têm dois atributos.” | “Não existe dependência parcial porque todos os atributos são primos: não há atributo não-primo para depender de parte da chave.” | Definição de 2FN: a dependência parcial exige um atributo **não-primo** que dependa de parte da chave. Em `R(A,B,C)`, as chaves são `AB` e `AC`, e A, B e C são todos primos. Chave composta, por si só, não elimina dependência parcial (a Q2 da mesma aula é exemplo disso). |
| `conteudo/s2/s2-02.md` | Q2, comentário: “A diferença desaparece quando o índice não é numérico sequencial.” | “A coincidência entre rótulo e posição desaparece quando o índice não é numérico sequencial, mas `.loc` continua inclusivo e `.iloc`, exclusivo.” | pandas — Indexing and selecting data: `.loc` é por rótulo e inclusivo; `.iloc` é por posição e exclusivo. A semântica não muda com índice não numérico; muda apenas a coincidência entre rótulo e posição. |

## Verificar (não alterado)

| Aula | Ponto | Risco | Ação sugerida |
|---|---|---|---|
| `s1-05` Q3, alt. B | Comentário diz que `HAVING status='Ativa'` “filtra depois de agrupar, contando inativos”. | Em PostgreSQL/padrão SQL, `status` não está no `GROUP BY`; a consulta **erra**, não filtra. O comentário só vale em MySQL sem `ONLY_FULL_GROUP_BY`/SQLite permissivo. | Explicitar o dialeto ou dizer que a alternativa é inválida no padrão. |
| `s1-06` Q3 | Enunciado diz apenas que `outorga.id_cliente` **aceita** NULL. | Se a subquery não devolver nenhum NULL, `NOT IN` retorna os clientes sem outorga (alternativa A). A resposta E pressupõe um NULL existente. | Acrescentar “há ao menos um registro com `id_cliente` NULL” ou “a subquery devolve um NULL”. |
| `s2-03` §3 | “`df.query` com `&` em vez de `and`” é tratado como erro. | `&` é válido no `query` quando as condições estão entre parênteses (`(a > 1) & (b < 2)`); o problema real é a precedência sem parênteses. | Trocar por “`&` sem parênteses”. |
| `s2-05` exemplo | “Q1 = 4, Q3 = 6, IQR = 2; cercas em 1 e 9, sem outliers.” | Isso usa o método de Tukey (mediana das metades). Com interpolação linear (pandas/Excel), Q3 = 5,5, IQR = 1,5, cerca superior = 7,75, e 9 seria outlier. | Declarar “pelo método de Tukey” ou alinhar ao quantil do pandas. |
| `s2-07` quadro | SVM classificado apenas como “classificação”. | A família SVM também faz regressão (`SVR` no scikit-learn). No contexto da aula, `SVC` é classificação, mas o quadro fica incompleto. | Usar “classificação (SVC) / regressão (SVR)” ou “ambos”. |

## Links problemáticos

Nenhum. As 42 URLs únicas das 15 aulas responderam **200** em 11/11/2026, sem 404, 403 ou timeout. Quatro redirecionam para URL equivalente: Oracle 23 → 26 (dois links de `docs.oracle.com`), Microsoft normalization → `previous-versions` e Python `library/functions.html#open` → `builtins/functions.html`.

## Veredito por aula

| Aula | Veredito |
|---|---|
| `s1-01` SGBD, arquitetura e modelo relacional | **OK** — definições, chaves e integridade corretas; 3 gabaritos certos. |
| `s1-02` Modelagem ER e transformação | **Corrigida** — tabela N:N; restante correto. |
| `s1-03` Normalização | **Corrigida** — justificativa da 2FN na Q3; definições e gabaritos corretos. |
| `s1-04` SELECT, WHERE e ORDER BY | **OK** — ordem lógica, NULL, BETWEEN e NULLS corretos. |
| `s1-05` GROUP BY, HAVING e agregações | **OK com ressalva** — comentário da Q3 dependente de dialeto. |
| `s1-06` JOINs, NULL e subqueries | **OK com ressalva** — contagens 6/9/10/13/90 corretas; premissa da Q3 incompleta. |
| `s1-07` ETL, qualidade e limpeza | **OK** — ETL/ELT, DW/lake/mart e `dropna` corretos. |
| `s2-01` Python: lógica e estruturas | **OK** — índices, cópia rasa, `==`/`is`, `KeyError` e `//` corretos. |
| `s2-02` Pandas: leitura e seleção | **Corrigida** — comentário `.loc`/`.iloc`; exemplos e gabaritos corretos. |
| `s2-03` Pandas: filtros, groupby, merge | **OK com ressalva** — `merge` 5 linhas e médias 20,0/36,7 corretos; ressalva no `&` do `query`. |
| `s2-04` Média, mediana e moda | **OK** — média 8,375, mediana 4,5, moda 5; ponderada 23; média de médias 15. |
| `s2-05` Variância, desvio, CV e boxplot | **OK com ressalva** — `s²=32/7`, `σ²=4`, CV 10%/20% e `ddof` corretos; método de quartis a declarar. |
| `s2-06` Correlação e tendências | **OK** — Pearson, `r²=0,49`, causalidade e sazonalidade corretos. |
| `s2-07` Supervisionado: classificação e regressão | **OK com ressalva** — definições, `fit`/`predict`, overfitting e leakage corretos; SVM incompleto. |
| `s2-08` Não supervisionado, métricas e validação | **OK** — precisão 0,75, recall 0,60, F1 0,667, acurácia 0,70; k-fold e drift corretos. |

## Verificações executadas

- **SQL:** com A=9, B=10 e 6 pares, SQLite retornou INNER=6, LEFT=9, RIGHT=10, FULL=13 e CROSS=90. `NOT IN` com NULL na subquery retornou 0 linhas; `NOT EXISTS` retornou o cliente sem outorga.
- **Python/Pandas:** todos os prints das questões foram reproduzidos (`[20, 40] 50`; `KeyError`; `[[1, 2, 5], [3, 4]] 3`; `.loc` 3 linhas × `.iloc` 2; `merge` 5 linhas; `dropna` + `drop_duplicates` = 2 linhas, valor 30).
- **Estatística:** média/mediana/moda, variância amostral e populacional, desvio, CV, quartis e correlação foram recalculados; as fórmulas das aulas conferem.
- **ML:** matriz de confusão (VP=30, FP=10, FN=20, VN=40), precisão, recall, especificidade, F1, acurácia, validação cruzada, overfitting e drift conferidos com a documentação do scikit-learn.
