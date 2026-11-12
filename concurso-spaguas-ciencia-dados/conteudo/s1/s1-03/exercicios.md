# Exercícios — Normalização: 1FN, 2FN, 3FN e BCNF

## Q1 (fácil)

Uma tabela guarda, na coluna `telefones`, o valor `'11-99999-0000; 11-3333-0000'`. Qual forma normal é violada?

A) 1FN, pois o atributo não é atômico.
B) 2FN, pois há dependência parcial.
C) 3FN, pois há dependência transitiva.
D) BCNF, pois o determinante não é chave.
E) Nenhuma, pois listas são permitidas em SQL.

## Q2 (média)

A tabela `venda(id_cliente, id_produto, nome_cliente, quantidade)` tem PK `(id_cliente, id_produto)` e a dependência `id_cliente → nome_cliente`. Essa tabela viola qual forma normal?

A) 1FN
B) 3FN
C) BCNF
D) 2FN
E) Nenhuma, pois a PK é composta.

## Q3 (difícil)

Considere `R(A, B, C)` com as dependências `AB → C` e `C → B`. As chaves candidatas são `AB` e `AC`. Essa relação está em:

A) 1FN apenas.
B) 2FN, mas não em 3FN.
C) 3FN, mas não em BCNF.
D) BCNF.
E) Nenhuma forma normal, pois há dependência parcial.

