---
id: s4-02
titulo: "JSON e XML"
disciplina: s4
modulo: s4-m1
item_edital: "4.1"
tempo: 35
nivel: essencial
---

# JSON e XML

> **Ideia central:** JSON é leve e nasceu do mundo JavaScript; XML é hierárquico, validável por esquema e sobrevive onde há legado, namespaces e documentos.

## 1. Essencial

**JSON** (JavaScript Object Notation) é um formato de texto para troca de dados, definido pela RFC 8259. Tem seis tipos de valor:

- **objeto** — `{"bacia": "Tietê"}`, coleção **não ordenada** de pares nome-valor;
- **array** — `["Tietê", "Piracicaba"]`, sequência **ordenada**;
- **string** — sempre entre **aspas duplas**;
- **número** — inteiro ou decimal, sem aspas;
- **booleano** — `true` ou `false`;
- **null** — ausência de valor.

Regras que a prova cobra: chaves são strings entre aspas duplas; **não existe comentário**; **não existe `undefined`**; não se usa vírgula sobrando no fim; não se usa aspas simples. Datas não são tipo nativo: vão como string, normalmente ISO 8601 (`"2026-11-11"`).

```json
{
  "id_outorga": 4821,
  "bacia": "Tietê",
  "ativa": true,
  "usos": ["irrigação", "industrial"],
  "medicao": null
}
```

**XML** (eXtensible Markup Language) é uma linguagem de marcação do W3C. Usa tags com abertura e fechamento, um único elemento raiz, aninhamento e **diferenciação entre maiúsculas e minúsculas**. Elementos podem ter **atributos**; o conteúdo pode ser texto, outros elementos ou CDATA. Comentários usam `<!-- ... -->`.

```xml
<outorga id="4821">
  <bacia>Tietê</bacia>
  <ativa>true</ativa>
  <usos>
    <uso>irrigação</uso>
    <uso>industrial</uso>
  </usos>
</outorga>
```

**Namespaces** evitam colisão de nomes quando vocabulários diferentes se encontram: `xmlns:sp="urn:spaguas:vocabulario"` e `sp:outorga`. **XSD** define a estrutura e os tipos; **XSLT** transforma XML em outro formato.

**Quando usar cada um:**

- **JSON** — APIs REST, aplicações web e móveis, integração simples, payload menor e leitura direta por JavaScript.
- **XML** — SOAP, documentos com conteúdo misto, necessidade de namespaces, validação por XSD, integrações legadas e transformação com XSLT.

**Comparação:** JSON é mais compacto e simples; XML é mais verboso, porém mais expressivo para documentos e contratos rígidos. JSON não substitui XML em todo lugar, e XML não é “formato obsoleto”: sistemas de governo e de grande porte ainda o usam.

## 2. Quadro comparativo

| Critério | JSON | XML |
|---|---|---|
| Estrutura | objeto e array | elementos aninhados |
| Verbosidade | baixa | alta |
| Comentários | não permite | permite |
| Esquema | JSON Schema (opcional) | XSD/DTD |
| Namespaces | não tem | sim |
| Uso típico | API REST | SOAP, documentos, legado |

| JSON | Tipo |
|---|---|
| `{"a": 1}` | objeto |
| `[1, 2, 3]` | array |
| `"texto"` | string |
| `true` | booleano |
| `null` | nulo |

## 3. Pegadinha de prova

A FGV mistura a sintaxe das duas linguagens. Em JSON, são inválidos: aspas simples, chave sem aspas, vírgula final, comentário e `undefined`. Também troca **objeto** (não ordenado, pares nome-valor) por **array** (ordenado) e afirma que JSON aceita comentários “como XML”. Em XML, a armadilha é esquecer o elemento raiz único, usar tags sem fechamento ou tratar atributo como elemento. Por fim, “JSON é um protocolo” é falso: é formato de dados.

## 4. Macete

**“JSON: chave entre aspas, string entre aspas, sem comentário e sem undefined. XML: uma raiz, tudo fecha, namespace desempata.”**

## Fontes

- [RFC 8259 — JSON Data Interchange Format](https://www.rfc-editor.org/rfc/rfc8259.html)
- [JSON.org — Especificação](https://www.json.org/json-en.html)
- [W3C — Extensible Markup Language (XML)](https://www.w3.org/TR/xml/)
- [W3C — Namespaces in XML](https://www.w3.org/TR/xml-names/)
