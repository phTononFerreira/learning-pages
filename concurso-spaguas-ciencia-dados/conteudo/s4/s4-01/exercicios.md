# Exercícios — APIs REST e transferência de dados

## Q1 (fácil)

Qual método HTTP é mais adequado para criar um novo recurso em uma API REST?

A) GET
B) POST
C) PUT
D) DELETE
E) HEAD

## Q2 (média)

Um cliente autenticado tenta acessar um recurso para o qual não possui permissão. Qual status code é mais adequado?

A) 400
B) 401
C) 403
D) 404
E) 500

## Q3 (difícil)

Uma integração envia POST para criar uma outorga e, após timeout, repete a requisição; duas outorgas são criadas. Qual abordagem evita a duplicidade?

A) Usar GET, pois é seguro e não altera o estado
B) Usar PUT no recurso com identificador definido pelo cliente ou chave de idempotência
C) Usar DELETE antes de cada POST
D) Migrar para SOAP, que impede repetição
E) Retornar 500 na primeira chamada

