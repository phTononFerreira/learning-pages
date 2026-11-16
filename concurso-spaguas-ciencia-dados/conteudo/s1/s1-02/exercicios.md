# Exercícios — Modelagem ER e transformação para relacional

## Q1 (fácil)

Na notação de Chen, o elemento gráfico que representa um relacionamento é:

A) retângulo
B) elipse
C) linha
D) retângulo duplo
E) losango

## Q2 (média)

Um pedido possui vários itens, e cada item pertence a um único pedido. Na transformação para o modelo relacional, a chave estrangeira que referencia `Pedido` deve ficar:

A) na tabela `Pedido`, apontando para `Item`
B) na tabela `Item`, apontando para `Pedido`
C) nas duas tabelas, formando uma chave composta
D) em uma tabela associativa criada para o relacionamento
E) em nenhuma tabela, pois a relação é representada por uma view

## Q3 (difícil)

Produto e Fornecedor têm relacionamento N:N com o atributo `preco_compra`. Qual esquema representa corretamente esse relacionamento?

A) `fornecedor(id_fornecedor, id_produto FK, preco_compra)`
B) `produto(id_produto, id_fornecedor FK, preco_compra)`
C) `produto_fornecedor(id_produto FK, id_fornecedor FK, preco_compra, PK(id_produto, id_fornecedor))`
D) `produto_fornecedor(id_produto, id_fornecedor, preco_compra)`, sem chaves
E) `produto(id_produto, preco_compra)` e `fornecedor(id_fornecedor)`

