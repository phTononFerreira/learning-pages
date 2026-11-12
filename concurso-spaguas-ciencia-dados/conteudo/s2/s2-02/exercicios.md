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

```python
df = pd.DataFrame({"a": [5, 15, 25, 35]}, index=["w", "x", "y", "z"])
print(df.loc["x":"y", "a"].sum(), df.iloc[0:2]["a"].sum())
```

A) `40 20`
B) `20 40`
C) `40 40`
D) `20 20`
E) `60 20`

