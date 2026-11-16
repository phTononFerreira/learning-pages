# Resumo — SQL: JOINs, NULL e subqueries

> cada JOIN preserva um conjunto diferente de linhas; a prova cobra a contagem e o efeito do NULL, não a sintaxe.

## 1. Essencial

- **INNER JOIN.** Só pares que casam nos dois lados. Linha sem correspondência desaparece.
- **LEFT JOIN.** Preserva todas as linhas da esquerda; quando não há par, as colunas da direita vêm NULL. **RIGHT** é o espelho. **FULL** preserva os dois lados; **CROSS** faz o produto cartesiano.
- **Contagem de linhas.** Com A = 9 e B = 10, CROSS = 90. Sem fan-out (cada linha casa com no máximo uma do outro lado), se 6 linhas casam: INNER = 6, LEFT = 9, RIGHT = 10 e FULL = 13. Fórmula: `FULL = INNER + órfãos de A + órfãos de B`.
- **Fan-out.** Um join 1:N duplica o lado 1. Se um cliente tem 5 outorgas, `JOIN` gera 5 linhas para ele. Para contar clientes, use `COUNT(DISTINCT c.id)` ou `EXISTS`.
- **NULL não casa com NULL.** `ON a.id = b.id` é UNKNOWN quando um lado é NULL; a linha não entra no INNER.
- **LEFT JOIN + WHERE na tabela direita vira INNER com o mesmo filtro.** `WHERE b.status = 'Ativa'` elimina as linhas em que b é NULL. Exceção: predicados que aceitam NULL, como `b.id IS NULL` (anti-join), mantêm as linhas sem par. Para manter os clientes sem outorga, a condição deve ir no `ON`.
- **COUNT depois do LEFT.** `COUNT(*)` conta a linha preservada mesmo sem par (retorna 1); `COUNT(b.id)` conta só as correspondências e retorna 0 para quem não tem par.
- **Subqueries.** Escalar retorna um valor; `IN` compara com uma lista; `EXISTS` testa existência; correlacionada referencia a query externa.
- **EXISTS × IN.** `EXISTS` evita duplicação; `IN` é legível para listas pequenas; desempenho depende do plano.
- **NOT IN com NULL.** Se a subquery retornar um NULL, `x <> NULL` é UNKNOWN e o `NOT IN` não retorna **nenhuma** linha. `NOT EXISTS` é seguro.

**Exemplo resolvido.** Clientes sem outorga, sem duplicação e sem o problema do NULL.

```sql
SELECT c.id_cliente, c.nome
FROM cliente c
WHERE NOT EXISTS (
  SELECT 1
  FROM outorga o
  WHERE o.id_cliente = c.id_cliente
);
```

Se `outorga.id_cliente` fosse nullable, `NOT IN` poderia retornar vazio por causa do NULL; `NOT EXISTS` não.

## 2. Quadro comparativo

| JOIN | Preserva | Linhas (A=9, B=10, 6 matches, sem fan-out) | Quando usar |
|---|---|---|---|
| INNER | só pares | 6 | interseção |
| LEFT | toda a esquerda | 9 | “todos de A, com ou sem B” |
| RIGHT | toda a direita | 10 | “todos de B, com ou sem A” |
| FULL | os dois lados | 13 | diagnóstico de órfãos |
| CROSS | todas as combinações | 90 | combinações |

## 3. Pegadinha de prova

A FGV adora o LEFT JOIN que “vira INNER”: condição da tabela direita no WHERE remove os NULLs e iguala o resultado ao INNER com o mesmo filtro (exceção: predicados que aceitam NULL, como `b.id IS NULL`). Também cobra `COUNT(*)` após LEFT JOIN, que devolve 1 para quem não tem par. Outra armadilha é `NOT IN` com subquery que contém NULL: o resultado é vazio, não é “todos os clientes sem outorga”. Por fim, “sem repetições” com join 1:N costuma pedir `EXISTS`, não `DISTINCT`.

## 4. Macete

**“LEFT preserva a esquerda; FULL soma os órfãos dos dois lados.”** Para NULL: **“NOT IN com NULL não devolve nada; NOT EXISTS devolve a verdade.”**

**Revisar:** D+1, D+7, D+30.
