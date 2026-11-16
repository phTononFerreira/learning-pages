# Gabarito — Python: lógica, estruturas e funções

## Q1 — A

`range(1, 6)` gera 1, 2, 3, 4 e 5; o `continue` salta os pares 2 e 4; somam-se 1 + 3 + 5 = 9. A opção 15 soma o intervalo inteiro, 6 soma só 1 + 2 + 3, 12 soma 1 + 2 + 4 + 5 e 5 conta as iterações. O `continue` não encerra o laço: ele apenas vai para a próxima iteração.

## Q2 — C

`d["RJ"]` tenta ler uma chave inexistente antes de somar, e isso levanta `KeyError`. `IndexError` é posição inválida em lista; `TypeError`, tipo incompatível; `ValueError`, tipo certo com valor inválido; `NameError`, nome não definido. Para inicializar com segurança, use `d["RJ"] = d.get("RJ", 0) + 2`.

## Q3 — E

`a[:]` copia só a lista externa; `b[0]` e `a[0]` são a mesma lista interna, então o `append(5)` aparece nos dois. Já `b.append([6])` altera apenas a lista externa de `b`, que passa a ter três itens. Por isso a alteração interna vaza para `a`, mas a externa não.

## Flashcards

- `==` ou `is` para comparar valor? — `==`. `is` compara identidade; use só com `None`.
- `d["x"]` e `d.get("x")` quando a chave falta? — o primeiro levanta `KeyError`; o segundo devolve `None` ou o padrão.
- `b = a[:]` copia o quê? — A lista externa (cópia rasa); listas internas continuam compartilhadas.
