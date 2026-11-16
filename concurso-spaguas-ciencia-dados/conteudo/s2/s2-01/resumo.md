# Resumo — Python: lógica, estruturas e funções

> a FGV não pede um sistema; pede que você rastreie 5–10 linhas e diga o que sai no `print`, qual exceção estoura ou por que o dicionário falhou.

## 1. Essencial

- **Lista:** mutável, índice começa em 0; `a[-1]` é o último; `a[1:4]` vai do índice 1 ao 3; `a[::2]` salta de 2 em 2. Fatiar cria uma lista nova.
- `a.append(x)` põe **um** item; `a.extend([x, y])` põe vários; `a + b` cria outra lista. `b = a` **não copia**: os dois nomes apontam para o mesmo objeto.
- `a[:]`, `list(a)` e `a.copy()` são cópias **rasas**: a lista externa é nova, mas os objetos internos continuam compartilhados.
- **Tupla:** imutável; aceita unpacking `x, y = (1, 2)`; `(1)` é inteiro e `(1,)` é tupla. Pode ser chave de dicionário; lista não pode.
- **Dicionário:** `d["chave"]` levanta `KeyError` se a chave não existe; `d.get("chave", 0)` devolve o padrão sem erro; `"chave" in d` testa **chave**, não valor.
- **Função:** `def f(x, y=0)`. O default é avaliado **uma vez**, na definição — nunca use lista ou dict como valor padrão. Sem `return`, a função devolve `None`.
- **Escopo:** a função lê o global, mas atribuir cria variável local; `global` só é necessário para reatribuir. Ler antes de atribuir na mesma função gera `UnboundLocalError`.
- `==` compara **valor**; `is` compara **identidade**. Use `is None`, nunca `== None`.
- `/` devolve float; `//` é divisão inteira (piso): `-7 // 2 == -4`; `%` segue o sinal do divisor.
- **Arquivo:** `with open("dados.csv", encoding="utf-8") as f:` fecha sozinho. Encoding errado gera `UnicodeDecodeError`; arquivo ausente, `FileNotFoundError`. No SP Águas, CSV de outorgas exportado do Excel pode vir em `latin-1`: teste o encoding antes de concluir que o arquivo está corrompido.
- **Condicionais:** `if/elif/else` testa os ramos em ordem e executa só o primeiro verdadeiro; `else` cobre o restante. A indentação define o bloco — não é estilo, é sintaxe.
- **Repetição:** `for` percorre qualquer iterável; `range(1, 5)` gera 1 a 4 (o fim é exclusivo) e `enumerate(lista)` devolve `(índice, valor)`. `while` repete enquanto a condição for verdadeira; atualize a variável ou o laço não termina.
- **Controle de laço:** `break` encerra o laço; `continue` salta para a próxima iteração. **Compreensão de lista:** `[x * 2 for x in lista if x > 0]` combina expressão, laço e filtro em uma linha.

```python
d = {"A": 10}
print(d.get("B", 0) + d["A"])   # 10
d["B"] += 1                      # KeyError
```

A última linha falha porque `d["B"]` é lido antes de existir: `+=` não cria a chave.

## 2. Quadro comparativo

| Expressão | Resultado | Motivo |
|---|---|---|
| `b = a` | mesmo objeto | não copia |
| `b = a[:]` | lista externa nova | cópia rasa |
| `d["x"]` ausente | `KeyError` | chave obrigatória |
| `d.get("x")` ausente | `None` | valor padrão |
| `7 / 2` | `3.5` | divisão real |
| `7 // 2` | `3` | piso |

## 3. Pegadinha de prova

A FGV troca `==` por `is` e explora o default mutável: `def add(x, lista=[])` acumula entre chamadas, porque a lista nasce uma única vez. Também aparece `b = a` seguido de `b.append(...)`: quem imprime `a` vê a alteração. Em dict, `d["nova"] += 1` parece inicialização, mas levanta `KeyError`; o correto é `d["nova"] = d.get("nova", 0) + 1`.

## 4. Macete

**"`=` amarra, `[:]` separa; `[]` exige, `.get` perdoa."**
Para divisão: **`/` vira float, `//` desce ao piso** — desce, não arredonda para zero.

**Revisar:** D+1, D+7, D+30.
