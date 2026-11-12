# Gabarito — Normalização: 1FN, 2FN, 3FN e BCNF

## Q1 — A

A 1FN exige valor atômico em cada célula. Uma lista com dois telefones na mesma coluna é grupo repetitivo disfarçado. A correção é criar uma tabela de telefones com FK para a entidade. As demais formas normais tratam de dependências entre atributos, não de atomicidade.

## Q2 — D

`nome_cliente` depende apenas de parte da chave composta (`id_cliente`), o que caracteriza dependência parcial e viola a 2FN. A correção é separar `cliente(id_cliente, nome_cliente)` e deixar a FK em `venda`. Não é dependência transitiva (3FN), pois o determinante é parte da chave. A tabela está em 1FN.

## Q3 — C

Todos os atributos são primos (A, B e C participam de alguma chave candidata). Em `C → B`, C não é superchave, mas B é primo, então a 3FN é satisfeita. A BCNF exige que todo determinante seja superchave, e C não é — logo, não há BCNF. Não existe dependência parcial porque todos os atributos são primos: não há atributo não-primo para depender de parte da chave.

## Flashcards

- Dependência parcial viola qual FN? — 2FN: atributo não-primo depende de parte da chave composta.
- Dependência transitiva viola qual FN? — 3FN: não-primo depende de outro não-primo.
- Condição da BCNF? — Em toda DF não trivial X → Y, X é superchave (todo determinante é chave candidata).
