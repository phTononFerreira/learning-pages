---
id: s1-04
titulo: "SQL: SELECT, WHERE e ORDER BY"
disciplina: s1
modulo: s1-m2
item_edital: "1.2"
tempo: 45
nivel: essencial
---

# SQL: SELECT, WHERE e ORDER BY

> **Ideia central:** a consulta nasce no FROM, é filtrada pelo WHERE, projetada pelo SELECT e só então ordenada e limitada; confundir essa ordem é a origem da maioria dos erros.

## 1. Essencial

- **Ordem lógica.** `FROM` → `WHERE` → `GROUP BY` → `HAVING` → `SELECT` → `ORDER BY` → `LIMIT/OFFSET`. A ordem de escrita é outra; o banco resolve pela lógica.
- **SELECT escolhe colunas; WHERE escolhe linhas.** `SELECT *` traz todas as colunas, não todas as linhas.
- **Alias.** O alias criado no `SELECT` pode ser usado no `ORDER BY`, mas não no `WHERE` (o WHERE roda antes da projeção). No PostgreSQL, `GROUP BY` também aceita o alias.
- **DISTINCT vale para a linha inteira.** `SELECT DISTINCT bacia, municipio` remove pares repetidos, não repetições de bacia. `DISTINCT` não conta ocorrências.
- **NULL não é valor.** `valor = NULL` retorna `UNKNOWN`, nunca `TRUE`; use `IS NULL` / `IS NOT NULL`. A lógica é de três valores: TRUE, FALSE e UNKNOWN, e o `WHERE` só deixa passar TRUE.
- **NULL contamina contas.** `NULL + 10` é NULL; `'a' || NULL` é NULL no PostgreSQL. Use `COALESCE` para substituir.
- **LIKE.** `%` casa zero ou mais caracteres; `_` casa exatamente um; `ESCAPE` permite buscar `%` literal. No PostgreSQL, `LIKE` diferencia maiúsculas; `ILIKE` não. No MySQL, depende da collation; no SQLite, o LIKE é case-insensitive para ASCII por padrão.
- **BETWEEN é inclusivo.** `BETWEEN 10 AND 20` inclui 10 e 20. Com timestamp, `BETWEEN '2025-01-01' AND '2025-12-31'` exclui tudo depois de 31/12 00:00:00.
- **ORDER BY.** `ASC` é o padrão. NULLs: no PostgreSQL, vão por último no ASC e primeiro no DESC; no MySQL e no SQLite, tendem a vir primeiro no ASC. Use `NULLS FIRST/LAST` quando precisar de determinismo.
- **LIMIT sem ORDER BY é armadilha.** Sem ordenação, “as 3 primeiras linhas” são arbitrárias. Empates também são arbitrários sem um critério único de desempate.

**Exemplo resolvido.** Listar as 3 maiores multas de 2025, com desempate estável.

```sql
SELECT id_auto, municipio, valor
FROM autos
WHERE data_autuacao >= DATE '2025-01-01'
  AND data_autuacao <  DATE '2026-01-01'
  AND valor > 1000
ORDER BY valor DESC, id_auto ASC
LIMIT 3;
```

O intervalo semiaberto pega o ano inteiro, inclusive 31/12 às 23h59. O `id_auto` no ORDER BY garante que empates não mudem a saída entre execuções.

## 2. Quadro comparativo

| Cláusula | Função | Ordem lógica | Erro típico |
|---|---|---|---|
| `WHERE` | filtrar linhas | antes do SELECT | usar alias do SELECT ou `= NULL` |
| `SELECT` | escolher colunas e expressões | depois do WHERE | achar que `*` filtra linhas |
| `ORDER BY` | ordenar a saída | depois do SELECT | achar que remove duplicatas |
| `DISTINCT` | remover linhas repetidas | junto da projeção | achar que conta ocorrências |
| `LIMIT` | cortar linhas | por último | usar sem ORDER BY |

## 3. Pegadinha de prova

A FGV explora o `BETWEEN` com data/hora: a query “quase certa” usa `BETWEEN '2025-01-01' AND '2025-12-31'` e perde os registros de 31/12 após a meia-noite. A resposta correta usa `>=` no início e `<` no dia seguinte. Outra armadilha é `WHERE valor = NULL`, que não retorna os nulos: retorna conjunto vazio.

## 4. Macete

**“FROM acha, WHERE corta, SELECT mostra, ORDER BY arruma, LIMIT poda.”** Para datas: **“entra maior-igual, sai menor.”**

## Fontes

- [PostgreSQL — SELECT](https://www.postgresql.org/docs/current/sql-select.html)
- [PostgreSQL — Funções de comparação e NULL](https://www.postgresql.org/docs/current/functions-comparison.html)
- [PostgreSQL — LIKE e padrões](https://www.postgresql.org/docs/current/functions-matching.html)
- [PostgreSQL — ORDER BY e NULLS](https://www.postgresql.org/docs/current/queries-order.html)
