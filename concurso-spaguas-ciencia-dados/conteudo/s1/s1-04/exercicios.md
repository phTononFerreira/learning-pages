# Exercícios — SQL: SELECT, WHERE e ORDER BY

## Q1 (fácil)

Assinale a alternativa **incorreta** sobre o tratamento de NULL em SQL.

A) `valor = NULL` avalia como UNKNOWN, e o `WHERE` não retorna linhas.
B) `valor IS NULL` é a forma correta de testar ausência de valor.
C) `NULL + 10` resulta em NULL.
D) `COALESCE(valor, 0)` substitui o NULL por 0.
E) `NULL = NULL` é TRUE, pois os dois lados são iguais.

## Q2 (média)

A coluna `data_autuacao` é `TIMESTAMP`. Qual filtro retorna todos os autos de 2025, inclusive os de 31/12 às 23h59?

A) `WHERE data_autuacao BETWEEN '2025-01-01' AND '2025-12-31'`
B) `WHERE data_autuacao <= '2025-12-31'`
C) `WHERE data_autuacao >= '2025-01-01' AND data_autuacao < '2026-01-01'`
D) `WHERE data_autuacao LIKE '2025%'`
E) `WHERE data_autuacao = '2025'`

## Q3 (difícil)

Uma consulta pagina resultados com `ORDER BY valor DESC LIMIT 3 OFFSET 3`. Muitos registros têm o mesmo `valor`. O que pode acontecer?

A) O banco rejeita OFFSET sem WHERE.
B) Registros empatados podem aparecer em duas páginas ou ser omitidos, pois a ordem entre empates é indefinida.
C) O LIMIT sempre inclui todos os empates da última página.
D) O OFFSET conta apenas valores distintos.
E) A saída é sempre a mesma, pois ORDER BY é determinístico.

