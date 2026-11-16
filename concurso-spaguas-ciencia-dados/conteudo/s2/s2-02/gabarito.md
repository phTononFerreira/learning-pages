# Gabarito — Pandas: leitura, inspeção e seleção

## Q1 — B

`shape` devolve `(linhas, colunas)`. `size` é o produto linhas × colunas; `dtypes` lista tipos; `len(df)` devolve apenas o número de linhas; `index` devolve o rótulo das linhas. Num DataFrame 4×3, `shape` é `(4, 3)` e `size` é 12. Para pegar só as linhas, use `df.shape[0]`.

## Q2 — D

`.loc` usa rótulos e inclui o 4, trazendo as linhas 2, 3 e 4. `.iloc` usa posições e exclui o limite, trazendo as posições 2 e 3. Por isso, 3 e 2. A coincidência entre rótulo e posição desaparece quando o índice não é numérico sequencial, mas `.loc` continua inclusivo e `.iloc`, exclusivo.

## Q3 — E

`header=None` significa que o arquivo **não** tem cabeçalho: o pandas cria nomes 0, 1, 2… e trata a primeira linha como dado. Para usar a primeira linha como cabeçalho, basta omitir o argumento (padrão `header=0`). As demais opções descrevem argumentos válidos: `dtype` fixa o tipo, `parse_dates` converte datas, `na_values` define nulos e `usecols` seleciona colunas.

## Flashcards

- `df["x"]` e `df[["x"]]` devolvem? — Series (1D) e DataFrame (2D), respectivamente.
- `.loc` ou `.iloc` inclui o limite final? — `.loc` (rótulo); `.iloc` exclui (posição).
- `df.info()` mostra o quê? — Colunas, tipos, contagem de não nulos e uso de memória.
