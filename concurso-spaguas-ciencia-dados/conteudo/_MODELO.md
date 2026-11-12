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

> **Ideia central:** toda consulta começa pelo que você quer ver (SELECT), passa pelo que deve entrar (WHERE) e termina pela ordem de exibição (ORDER BY).

## 1. Essencial

- `SELECT colunas FROM tabela` escolhe **colunas**; `WHERE` escolhe **linhas**. Não confunda os dois.
- `WHERE` roda **antes** de `GROUP BY`; `HAVING` roda **depois** e pode filtrar agregações.
- `ORDER BY` só ordena. Ele **não filtra** e **não remove duplicatas**.
- `DISTINCT` remove linhas repetidas do resultado; não conta ocorrências.
- `NULL` não é zero nem string vazia: use `IS NULL` / `IS NOT NULL`, nunca `= NULL`.
- Em SQL, a ordem lógica é: `FROM` → `WHERE` → `GROUP BY` → `HAVING` → `SELECT` → `ORDER BY` → `LIMIT`.
- `LIKE` usa `%` (qualquer sequência) e `_` (um caractere). `BETWEEN` é inclusivo.

**Exemplo resolvido:** listar os 3 maiores valores de multa aplicados em 2025, apenas processos ativos.

```sql
SELECT id_processo, valor_multa
FROM processos
WHERE status = 'Ativo'
  AND data_autuacao >= DATE '2025-01-01'
  AND data_autuacao <  DATE '2026-01-01'
ORDER BY valor_multa DESC
LIMIT 3;
```

## 2. Quadro comparativo

| Comando | Serve para | Erro típico |
|---|---|---|
| `WHERE` | filtrar linhas antes do agrupamento | usar com `COUNT(*)` sem subquery |
| `HAVING` | filtrar grupos depois do `GROUP BY` | usar coluna sem agregação |
| `ORDER BY` | ordenar a saída | achar que elimina duplicatas |
| `DISTINCT` | remover repetições | achar que conta ocorrências |
| `LIMIT` | cortar o número de linhas | usar sem `ORDER BY` e achar que é “os maiores” |

## 3. Pegadinha de prova

A FGV adora trocar `WHERE` por `HAVING`: “listar comarcas com mais de um processo ativo” exige `GROUP BY comarca HAVING COUNT(*) > 1`, não `WHERE COUNT(*) > 1`. Também aparece `ORDER BY COUNT(*) DESC` como distrator: ele ordena, mas não filtra.

## 4. Macete

**“WHERE escolhe linhas; HAVING escolhe grupos; ORDER BY só arruma a mesa.”**

## 5. Questões

### Q1 — fácil

Em uma tabela `servidores`, qual cláusula seleciona apenas as linhas em que `salario` é maior que 10.000?

A) `ORDER BY salario > 10000`
B) `WHERE salario > 10000`
C) `GROUP BY salario > 10000`
D) `HAVING salario > 10000`
E) `DISTINCT salario > 10000`

**Gabarito:** B
**Comentário:** `WHERE` filtra linhas antes de qualquer agrupamento. `HAVING` só faz sentido com `GROUP BY`; `ORDER BY` ordena.

### Q2 — média

Uma tabela `processos (id, comarca, status)` tem vários processos por comarca. Qual consulta lista apenas comarcas com mais de um processo ativo?

A) `SELECT comarca FROM processos WHERE status='Ativo' GROUP BY comarca HAVING COUNT(*) > 1`
B) `SELECT DISTINCT comarca FROM processos WHERE status='Ativo' AND COUNT(*) > 1`
C) `SELECT comarca FROM processos WHERE status='Ativo' ORDER BY COUNT(*) DESC`
D) `SELECT comarca FROM processos GROUP BY comarca HAVING status='Ativo' AND COUNT(*) > 1`
E) `SELECT comarca FROM processos WHERE COUNT(*) > 1 AND status='Ativo'`

**Gabarito:** A
**Comentário:** filtra linhas ativas com `WHERE`, agrupa por comarca e filtra os grupos com `HAVING`. `COUNT(*)` não pode ir no `WHERE`; `DISTINCT` não conta ocorrências.

### Q3 — difícil

Tabela `autos (id, municipio, valor, status)`. Qual consulta retorna o total autuado por município, apenas para municípios cujo total ultrapasse R$ 100.000, em ordem decrescente?

A) `SELECT municipio, SUM(valor) FROM autos WHERE status='Ativo' GROUP BY municipio HAVING SUM(valor) > 100000 ORDER BY SUM(valor) DESC`
B) `SELECT municipio, SUM(valor) FROM autos WHERE status='Ativo' AND SUM(valor) > 100000 GROUP BY municipio ORDER BY valor DESC`
C) `SELECT municipio, SUM(valor) FROM autos GROUP BY municipio HAVING status='Ativo' AND valor > 100000 ORDER BY SUM(valor) DESC`
D) `SELECT municipio, COUNT(valor) FROM autos WHERE status='Ativo' GROUP BY municipio HAVING COUNT(valor) > 100000 ORDER BY municipio DESC`
E) `SELECT municipio, SUM(valor) FROM autos ORDER BY municipio HAVING SUM(valor) > 100000`

**Gabarito:** A
**Comentário:** `WHERE` filtra status antes do agrupamento; `SUM` agrega; `HAVING` filtra o total do grupo; `ORDER BY SUM(valor) DESC` ordena pelo total. As demais usam agregação no lugar errado ou trocam `SUM` por `COUNT`.

## 6. Flashcards

- P: `WHERE` ou `HAVING` para filtrar `COUNT(*)`? | R: `HAVING`, depois do `GROUP BY`.
- P: `ORDER BY` remove duplicatas? | R: Não. Ele apenas ordena; use `DISTINCT` para repetições.
- P: Como testar valor nulo? | R: `IS NULL` ou `IS NOT NULL`, nunca `= NULL`.

## 7. Fontes

- PostgreSQL — SELECT: https://www.postgresql.org/docs/current/sql-select.html
- PostgreSQL — Tutorial SQL: https://www.postgresql.org/docs/current/tutorial-sql.html
- W3Schools — SQL WHERE: https://www.w3schools.com/sql/sql_where.asp
