# Gabarito — SGBD, arquitetura e modelo relacional

## Q1 — B

Grau é a quantidade de atributos (colunas): 8. Cardinalidade é a quantidade de tuplas (linhas): 120. A alternativa E multiplica os dois, confundindo cardinalidade com tamanho físico. A A inverte os conceitos, erro clássico cobrado pela FGV. Memorize: coluna é grau, linha é cardinalidade.

## Q2 — D

A FK representa um relacionamento opcional quando aceita NULL; se o vínculo for obrigatório, recebe NOT NULL. A PK é única por tabela e nunca aceita NULL (A e B erradas). A FK pode referenciar uma coluna UNIQUE, inclusive da própria tabela (C errada). UNIQUE permite NULL e não é sinônimo de PK.

## Q3 — C

Trocar o armazenamento é nível interno e caracteriza independência física: o esquema conceitual e as consultas permanecem válidos, o que derruba III. A view é a face externa do banco, específica de um usuário. I e II estão corretas; a III descreve justamente o que a independência física evita.

## Flashcards

- Grau × cardinalidade de uma tabela? — Grau = nº de colunas; cardinalidade = nº de linhas.
- Independência física × lógica? — Física muda o nível interno sem o conceitual; lógica muda o conceitual sem as views.
- A que uma FK pode referenciar? — PK ou coluna UNIQUE, inclusive da mesma tabela; pode ser NULL se opcional.
