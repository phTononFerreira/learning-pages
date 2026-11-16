# Resumo — SQL: GROUP BY, HAVING e agregações

> o GROUP BY transforma linhas em grupos; o WHERE escolhe linhas antes do agrupamento e o HAVING escolhe grupos depois — trocar os dois é a pegadinha número um.

## 1. Essencial

- **GROUP BY.** Agrupa linhas com os mesmos valores e devolve uma linha por grupo. `GROUP BY bacia` produz um resultado por bacia; `GROUP BY bacia, status` produz um por combinação.
- **Regra de projeção.** Toda coluna não agregada deve estar no `GROUP BY` ou ser funcionalmente dependente dele; expressões sobre colunas agrupadas são permitidas. No PostgreSQL, agrupar pela PK libera as demais colunas da tabela. `SELECT bacia, municipio, COUNT(*) ... GROUP BY bacia` é inválido no padrão e no MySQL com `ONLY_FULL_GROUP_BY`; SQLite e MySQL sem esse modo aceitam e devolvem um município arbitrário.
- **WHERE × HAVING.** `WHERE` filtra linhas **antes** do agrupamento; `HAVING` filtra grupos **depois**. Agregação no WHERE é erro: `WHERE COUNT(*) > 2` não compila.
- **HAVING sem GROUP BY.** A tabela inteira vira um único grupo; é válido para perguntas como “a base tem mais de 100 linhas?”.
- **COUNT(*)× COUNT(coluna).** `COUNT(*)` conta linhas, inclusive as que têm NULL. `COUNT(coluna)` ignora NULL. `COUNT(DISTINCT coluna)` conta valores distintos não nulos.
- **Agregações ignoram NULL.** `SUM`, `AVG`, `MIN` e `MAX` descartam NULL antes de calcular. `AVG(x)` divide pela quantidade de valores não nulos, não pelo total de linhas.
- **Conjunto vazio.** Sem `GROUP BY`, `COUNT` retorna 0 e `SUM`, `AVG`, `MIN` e `MAX` retornam NULL; com `GROUP BY`, o conjunto vazio produz zero linhas.
- **NULL é um grupo.** Todas as linhas com NULL na coluna agrupada formam um grupo próprio, exibido como NULL.
- **GROUP BY × DISTINCT.** `DISTINCT` remove repetições da projeção; `GROUP BY` permite agregar por grupo. “Sem repetições” nem sempre pede DISTINCT.
- **ORDER BY agregado.** Pode usar a função (`ORDER BY COUNT(*) DESC`) ou o alias do SELECT.

**Exemplo resolvido.** Total e média por bacia, apenas outorgas ativas e apenas bacias com mais de 10 outorgas e média acima de 100.

```sql
SELECT bacia,
       COUNT(*)      AS outorgas,
       AVG(vazao)    AS media
FROM outorgas
WHERE status = 'Ativa'
GROUP BY bacia
HAVING COUNT(*) > 10
   AND AVG(vazao) > 100
ORDER BY media DESC;
```

O `WHERE` reduz as linhas antes de agrupar; o `HAVING` elimina grupos inteiros. Se a condição de status fosse para o HAVING, o grupo incluiria outorgas inativas no COUNT.

## 2. Quadro comparativo

| Cláusula | Opera sobre | Roda quando | Aceita agregação | Erro típico |
|---|---|---|---|---|
| `WHERE` | linhas | antes do GROUP BY | não | `WHERE COUNT(*) > 1` |
| `GROUP BY` | linhas → grupos | depois do WHERE | não | coluna fora do grupo no SELECT |
| `HAVING` | grupos | depois do GROUP BY | sim | filtrar coluna sem agregação |
| `ORDER BY` | resultado | no fim | sim | achar que filtra |

## 3. Pegadinha de prova

A FGV troca `WHERE` por `HAVING` em filtros de linha e vice-versa. “Bacias com mais de dois processos ativos” exige `WHERE status='Ativo'` **e** `HAVING COUNT(*) > 2`; usar `HAVING status='Ativo'` faz o grupo contar também os inativos. Outra armadilha é `COUNT(*)` no lugar de `COUNT(coluna)` depois de um LEFT JOIN: o primeiro conta a linha “vazia” como 1. E `AVG` com NULL engana: 10, 20 e NULL têm média 15, não 10.

## 4. Macete

**“WHERE escolhe linha; HAVING escolhe grupo.”** Para NULL: **“COUNT(*) conta buraco; COUNT(coluna) pula buraco.”**

**Revisar:** D+1, D+7, D+30.
