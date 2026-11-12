# Gabarito — JSON e XML

## Q1 — C

JSON exige chave e string entre aspas duplas, não admite vírgula final nem comentários. A opção A deixa a chave sem aspas; B tem vírgula sobrando; D usa aspas simples; E inclui comentário, que não existe em JSON. A sintaxe é estrita.

## Q2 — B

Colchetes delimitam array, que é uma sequência ordenada; os elementos são strings entre aspas duplas. Objeto usaria chaves `{}` com pares nome-valor; número, booleano e null têm outra grafia. A ordem dos elementos é sempre preservada na leitura do array.

## Q3 — C

SOAP usa envelope XML, WSDL e, tipicamente, validação por XSD; os namespaces preservam a distinção entre vocabulários. JSON seria possível apenas com reescrita do serviço; CSV e YAML não expressam o contrato; HTML é marcação de apresentação, não formato de integração.

## Flashcards

- JSON aceita comentários e `undefined`? — Não. Nenhum dos dois existe no formato.
- Objeto ou array em JSON? — Objeto = pares nome-valor não ordenados; array = sequência ordenada.
- Quando preferir XML? — SOAP, namespaces, XSD e documentos com estrutura rígida.
