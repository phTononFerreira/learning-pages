# Gabarito — APIs REST e transferência de dados

## Q1 — B

POST cria um recurso subordinado à coleção e não é idempotente. GET e HEAD apenas leem; PUT substitui uma representação completa em URI conhecida; DELETE remove. A criação normalmente retorna 201, com a URI do novo recurso no cabeçalho `Location`.

## Q2 — C

403 indica que a identidade foi reconhecida, mas falta autorização. 401 seria credencial ausente ou inválida; 400, requisição malformada; 404, recurso inexistente; 500, falha do servidor. A permissão vem depois da identidade e a distinção entre 401 e 403 é cobrada com frequência.

## Q3 — B

POST não é idempotente; repetir cria outro recurso. PUT com URI definida pelo cliente ou chave de idempotência torna a repetição inofensiva. GET não cria; DELETE não resolve a criação; SOAP não garante idempotência; 500 apenas mascara a falha. Idempotência evita efeitos duplicados.

## Flashcards

- 401 ou 403? — 401 = não autenticado; 403 = autenticado sem permissão.
- PUT é atualização parcial? — Não. PUT substitui; PATCH altera parcialmente.
- O que é stateless? — Cada requisição carrega todo o contexto; o servidor não guarda sessão.
