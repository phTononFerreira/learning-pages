# Gabarito — SQL: JOINs, NULL e subqueries

## Q1 — D

CROSS JOIN combina cada linha de A com cada linha de B: 9 × 10 = 90. As alternativas A e B confundem com LEFT/RIGHT; C soma em vez de multiplicar. CROSS JOIN não usa condição de igualdade e raramente é a resposta quando o enunciado fala em “relacionar” tabelas por chave.

## Q2 — B

O LEFT JOIN preserva todos os clientes; `COUNT(o.id)` ignora o NULL gerado pela ausência de outorga e devolve 0. Usar `COUNT(*)` com LEFT JOIN, sem o filtro de C, devolveria 1 para quem não tem outorga. A e D usam INNER JOIN e excluem os clientes sem outorga; C filtra justamente quem não tem par e perde os demais; E preserva as outorgas, não os clientes. O `GROUP BY c.id, c.nome` evita fundir clientes homônimos.

## Q3 — E

`NOT IN` é equivalente a uma cadeia de `<>`; qualquer NULL na lista torna o resultado UNKNOWN para as linhas comparadas, e o WHERE não as aceita. Por isso a consulta não retorna ninguém, mesmo havendo clientes sem outorga. `NOT EXISTS` ou `NOT IN (... WHERE id_cliente IS NOT NULL)` corrigem o problema.

## Flashcards

- LEFT JOIN + condição da tabela direita no WHERE? — Vira um INNER com o mesmo filtro; exceção: predicados que aceitam NULL, como `IS NULL` (anti-join).
- COUNT(*) × COUNT(b.id) após LEFT JOIN? — COUNT(*) conta a linha preservada (1); COUNT(b.id) conta só pares (0).
- Por que NOT IN com NULL falha? — `x <> NULL` é UNKNOWN; se a subquery tem NULL, o resultado pode ser vazio.
