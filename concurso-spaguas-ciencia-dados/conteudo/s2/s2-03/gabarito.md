# Gabarito — Pandas: filtros, groupby, merge e agregações

## Q1 — B

cada condição vai entre parênteses e o operador é `&`. `and` não funciona em Series; `&&` não existe em Python; no `query` as colunas vão sem aspas e o operador é `and`; e `.loc` com comparação solta não seleciona linhas.

## Q2 — A

a média de A é (10 + 30)/2 = 20; a de B é (20 + 40 + 50)/3 = 36,67, arredondada para 36,7. As opções com 40 e 110 mostram a soma; 33,3 dividiria 110 por 4; 25 e 55 ignoram a quantidade de cada grupo.

## Q3 — C

o merge é interno e casa cada pedido com cada cliente de mesma chave. Os dois pedidos de A casam com os dois registros de A (4 linhas); o pedido de B casa com um registro (1 linha). Total: 5. Quem espera 3 esquece a duplicação; 9 vem do produto cartesiano completo (3×3); 6 de uma contagem parcial (2×3).

## Flashcards

- Como combinar duas condições em Pandas? — `df[(cond1) & (cond2)]`, com parênteses; `and` não funciona em Series.
- `merge` com `how="left"` preserva qual lado? — A tabela da esquerda; chaves sem par à direita viram nulos.
- `fillna(0)` altera o DataFrame original? — Não, devolve uma cópia; use `inplace=True` ou atribua o resultado.
