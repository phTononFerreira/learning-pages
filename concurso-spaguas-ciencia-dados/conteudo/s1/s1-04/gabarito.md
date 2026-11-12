# Gabarito — SQL: SELECT, WHERE e ORDER BY

## Q1 — A

`valor = NULL` avalia como UNKNOWN, e o WHERE só aceita TRUE; por isso o resultado é vazio. Para encontrar nulos, usa-se `valor IS NULL`. A alternativa B é a armadilha clássica: NULL não é igual a NULL. Não há erro de sintaxe, mas também não há linha retornada.

## Q2 — C

O intervalo semiaberto inclui 2025 inteiro e exclui 2026. O BETWEEN (A) para em 31/12 00:00:00 e perde o restante do dia. A alternativa B não tem limite inferior. LIKE não é adequado a timestamp, e a igualdade com `'2025'` não casa com data/hora.

## Q3 — B

O ORDER BY só define a ordem de `valor`; entre valores iguais, o SGBD pode escolher qualquer ordem, e ela pode mudar entre execuções. Numa paginação, isso faz um registro empatado pular de página ou sumir. A correção é adicionar um critério único, como `id_auto`, ao ORDER BY. OFFSET conta linhas, não valores distintos.

## Flashcards

- Ordem lógica de uma consulta SQL? — FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT.
- Como filtrar um intervalo de datas com timestamp? — `>=` no início e `<` no dia seguinte ao fim.
- Como testar NULL? — `IS NULL` / `IS NOT NULL`; `= NULL` nunca é TRUE.
