# Exercícios — Pandas: leitura, inspeção e seleção

## Q1 (fácil)

Qual atributo de um DataFrame devolve uma tupla com o número de linhas e de colunas?

A) `df.size`
B) `df.shape`
C) `df.dtypes`
D) `len(df)`
E) `df.index`

## Q2 (média)

Um DataFrame tem 10 linhas e índice `RangeIndex` de 0 a 9. Quantas linhas retornam, respectivamente, `df.loc[2:4]` e `df.iloc[2:4]`?

A) 2 e 2
B) 2 e 3
C) 3 e 3
D) 3 e 2
E) 4 e 2

## Q3 (difícil)

Assinale a alternativa **incorreta** sobre `pd.read_csv`.

A) `dtype={"codigo": str}` preserva zeros à esquerda, como `007`.
B) `parse_dates=["data"]` interpreta a coluna como data.
C) `na_values=["", "NA"]` trata esses rótulos como nulos.
D) `usecols=["id", "valor"]` carrega apenas as colunas citadas.
E) `header=None` usa a primeira linha do arquivo como cabeçalho.

