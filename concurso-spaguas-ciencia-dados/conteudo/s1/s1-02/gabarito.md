# Gabarito — Modelagem ER e transformação para relacional

## Q1 — E

O losango é o relacionamento; o retângulo é a entidade; a elipse é o atributo; a linha liga participantes. O retângulo duplo indica entidade fraca, não relacionamento. A elipse dupla, por sua vez, marca atributo multivalorado. A FGV já cobrou esse mapeamento de forma direta, sem cenário.

## Q2 — B

Em 1:N, a FK fica no lado N — cada item guarda o pedido a que pertence. Colocar a FK no pedido exigiria repetir o pedido para cada item. A tabela associativa só é necessária em N:N. A alternativa C criaria redundância e não representaria “vários itens”.

## Q3 — C

N:N exige tabela associativa com uma FK para cada lado; a PK composta pelo par impede repetir a mesma combinação. O atributo do relacionamento (`preco_compra`) vai nessa tabela. A e B tentam resolver com uma FK só, o que limita cada produto a um fornecedor. D não impede duplicatas; E perde o relacionamento.

## Flashcards

- Losango, elipse e retângulo em Chen? — Relacionamento, atributo e entidade, respectivamente.
- Onde fica a FK em um relacionamento 1:N? — Na tabela do lado N, apontando para a chave do lado 1.
- Qual é a chave de uma entidade fraca? — Chave da entidade forte + chave parcial da fraca.
