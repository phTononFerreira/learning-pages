# Exercícios — SQL: GROUP BY, HAVING e agregações

## Q1 (fácil)

Uma tabela `outorgas` tem 6 linhas, e a coluna `vazao` tem 2 valores NULL. Qual o resultado de `SELECT COUNT(*), COUNT(vazao) FROM outorgas;`?

A) 6 e 6
B) 4 e 6
C) 6 e 4
D) 4 e 4
E) erro, pois COUNT não aceita NULL

## Q2 (média)

A coluna `valor` contém 10, 20 e NULL. Qual é o resultado de `AVG(valor)`?

A) 10
B) 15
C) 30
D) NULL
E) 20

## Q3 (difícil)

Qual consulta lista as bacias com mais de 2 outorgas ativas e vazão média superior a 100?

A) `SELECT bacia, COUNT(*) FROM outorgas WHERE status='Ativa' AND COUNT(*) > 2 GROUP BY bacia HAVING AVG(vazao) > 100`
B) `SELECT bacia, COUNT(*) FROM outorgas GROUP BY bacia HAVING status='Ativa' AND COUNT(*) > 2`
C) `SELECT bacia, COUNT(*) FROM outorgas WHERE AVG(vazao) > 100 GROUP BY bacia HAVING COUNT(*) > 2`
D) `SELECT bacia, COUNT(*) FROM outorgas WHERE status='Ativa' GROUP BY bacia HAVING SUM(vazao) > 100`
E) `SELECT bacia, COUNT(*) FROM outorgas WHERE status='Ativa' GROUP BY bacia HAVING COUNT(*) > 2 AND AVG(vazao) > 100`

