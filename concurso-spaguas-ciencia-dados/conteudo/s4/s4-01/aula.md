---
id: s4-01
titulo: "APIs REST e transferência de dados"
disciplina: s4
modulo: s4-m1
item_edital: "4.1"
tempo: 40
nivel: essencial
---

# APIs REST e transferência de dados

> **Ideia central:** em REST, a URI identifica o recurso, o método HTTP diz o que fazer e o status code informa o resultado.

## 1. Essencial

**REST** (Representational State Transfer) é um estilo arquitetural de Roy Fielding, com cliente-servidor, interface uniforme, **ausência de estado**, cache, sistema em camadas e código sob demanda opcional. Não é protocolo nem padrão.

**Stateless:** cada requisição carrega todo o contexto — credencial, filtros, versão; o servidor não guarda sessão entre chamadas.

**Recursos:** a URI nomeia o recurso, no plural e sem verbo: `/v1/outorgas`, `/v1/outorgas/123`. Filtros e paginação vão na query string: `/v1/outorgas?bacia=tiete&pagina=2`.

**Métodos:** **GET** lê (seguro e idempotente); **POST** cria ou executa operação (não idempotente); **PUT** substitui a representação completa (idempotente); **PATCH** altera parcialmente (pode não ser idempotente); **DELETE** remove (idempotente).

**Idempotência** é repetir a mesma requisição e obter o mesmo estado final — não a mesma resposta. POST não é idempotente; integrações usam chave de idempotência ou PUT com URI definida pelo cliente.

**Status:** **200** sucesso com corpo; **201** criado, com `Location`; **204** sucesso sem corpo; **400** requisição inválida; **401** não autenticado; **403** autenticado sem permissão; **404** não encontrado; **500** falha do servidor. A família 4xx é erro do cliente; 5xx, do servidor.

**SOAP versus REST:** SOAP é protocolo com envelope XML, WSDL e WS-Security; é rígido e pesado. REST é estilo arquitetural, usa a semântica do HTTP e costuma trocar JSON. SOAP sobrevive em integrações legadas; REST domina APIs web.

**Boas práticas:** HTTPS, token (OAuth 2.0/JWT), validação de entrada, limite de taxa e documentação OpenAPI.

## 2. Quadro comparativo

| Método | Uso | Seguro | Idempotente |
|---|---|---|---|
| GET | ler | sim | sim |
| POST | criar | não | não |
| PUT | substituir | não | sim |
| PATCH | alterar parte | não | depende |
| DELETE | remover | não | sim |

## 3. Pegadinha de prova

A FGV troca **401 por 403**: 401 é “não sei quem você é”; 403 é “sei quem você é, mas você não pode”. Também cobra **PUT como parcial** (o parcial é PATCH) e **POST como idempotente** (não é). Outra armadilha é dizer que REST “é um protocolo” ou que “stateless significa sem login”: significa que o servidor não mantém sessão entre requisições. E 200 não é o código de criação — o correto é 201.

## 4. Macete

**“GET lê, POST cria, PUT troca inteiro, PATCH remenda, DELETE apaga. 401 não sei quem é; 403 sei, mas não pode.”**

## Fontes

- [MDN — Métodos HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods)
- [MDN — Códigos de status HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)
- [Roy Fielding — Architectural Styles and the Design of Network-based Software Architectures](https://www.ics.uci.edu/~fielding/pubs/dissertation/rest_arch_style.htm)
- [RFC 9110 — HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110.html)
