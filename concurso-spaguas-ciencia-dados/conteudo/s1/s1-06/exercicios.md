# Exercícios — SQL: JOINs, NULL e subqueries

## Q1 (fácil)

A tabela A tem 9 linhas e a tabela B tem 10. Qual é o resultado de `SELECT * FROM A CROSS JOIN B;`?

A) 9 linhas
B) 10 linhas
C) 19 linhas
D) 90 linhas
E) 0 linhas

## Q2 (média)

`cliente` tem clientes sem outorga. Qual consulta lista todos os clientes e a quantidade de outorgas de cada um, mostrando 0 para quem não tem?

A) `SELECT c.nome, COUNT(*) FROM cliente c JOIN outorga o ON o.id_cliente = c.id GROUP BY c.nome`
B) `SELECT c.nome, COUNT(o.id) FROM cliente c LEFT JOIN outorga o ON o.id_cliente = c.id GROUP BY c.nome`
C) `SELECT c.nome, COUNT(*) FROM cliente c LEFT JOIN outorga o ON o.id_cliente = c.id WHERE o.id IS NULL GROUP BY c.nome`
D) `SELECT c.nome, COUNT(o.id) FROM cliente c JOIN outorga o ON o.id_cliente = c.id GROUP BY c.nome`
E) `SELECT c.nome, COUNT(*) FROM cliente c RIGHT JOIN outorga o ON o.id_cliente = c.id GROUP BY c.nome`

## Q3 (difícil)

A coluna `outorga.id_cliente` aceita NULL e a subquery contém ao menos um registro com `id_cliente` NULL. A consulta `SELECT nome FROM cliente WHERE id_cliente NOT IN (SELECT id_cliente FROM outorga);` retorna:

A) todos os clientes sem outorga
B) um erro de sintaxe
C) apenas os clientes com outorga
D) uma linha NULL
E) zero linhas, pois o NULL da subquery torna a comparação UNKNOWN; `NOT EXISTS` resolve

