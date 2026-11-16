# Gabarito — ETL, qualidade e limpeza de dados

## Q1 — A

O ETL extrai da origem, transforma e só então carrega no destino. A alternativa B descreve ELT, em que o dado bruto é carregado primeiro e transformado no destino. As demais invertem a lógica e não correspondem à sigla. A banca usa essa troca para testar se o candidato sabe onde a transformação ocorre.

## Q2 — C

Consistência exige que o mesmo dado concorde entre sistemas. Unicidade seria o mesmo CPF duplicado como registro; aqui o problema é o valor divergente. Completude trataria de campo vazio, validade de formato/faixa e atualidade de recência. A correção típica é definir a fonte autoritativa e reconciliar as bases.

## Q3 — D

`dropna(subset=["valor"])` remove as linhas com valor nulo e deixa (1,10), (2,20) e (2,30). `drop_duplicates(subset=["id"], keep="last")` mantém uma linha por id e, entre as duplicatas de id 2, preserva a última: valor 30. Restam duas linhas. `keep="first"` daria 20; sem `subset`, a deduplicação olharia o par completo.

## Flashcards

- ETL × ELT? — ETL transforma antes de carregar; ELT carrega o bruto e transforma no destino.
- `dropna()` remove duplicatas? — Não; ele remove nulos. Duplicatas saem com `drop_duplicates()`.
- Data lake usa schema-on-write? — Não; o padrão é schema-on-read, e formatos de tabela podem impor schema. O DW é schema-on-write.
