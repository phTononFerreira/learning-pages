# Gabarito — Pandas: leitura, inspeção e seleção

## Q1 — B

`shape` devolve `(linhas, colunas)`. `size` é o produto linhas × colunas; `dtypes` lista tipos; `len(df)` devolve apenas o número de linhas; `index` devolve o rótulo das linhas. Num DataFrame 4×3, `shape` é `(4, 3)` e `size` é 12. Para pegar só as linhas, use `df.shape[0]`.

## Q2 — D

`.loc` usa rótulos e inclui o 4, trazendo as linhas 2, 3 e 4. `.iloc` usa posições e exclui o limite, trazendo as posições 2 e 3. Por isso, 3 e 2. A coincidência entre rótulo e posição desaparece quando o índice não é numérico sequencial, mas `.loc` continua inclusivo e `.iloc`, exclusivo.

## Q3 — A

`loc["x":"y"]` inclui as duas pontas e soma 15 + 25 = 40. `iloc[0:2]` pega as posições 0 e 1 e soma 5 + 15 = 20. As opções trocadas refletem quem esquece que `loc` é inclusivo e `iloc` é exclusivo.

## Flashcards

- `df["x"]` e `df[["x"]]` devolvem? — Series (1D) e DataFrame (2D), respectivamente.
- `.loc` ou `.iloc` inclui o limite final? — `.loc` (rótulo); `.iloc` exclui (posição).
- `df.info()` mostra o quê? — Colunas, tipos, contagem de não nulos e uso de memória.
