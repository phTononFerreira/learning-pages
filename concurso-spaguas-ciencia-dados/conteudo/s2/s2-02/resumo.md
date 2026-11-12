# Resumo — Pandas: leitura, inspeção e seleção

> antes de analisar, você lê e inspeciona; depois seleciona com `[]` para colunas e `.loc`/`.iloc` para linhas e colunas.

## 1. Essencial

- `pd.read_csv("dados.csv", sep=";", encoding="utf-8", decimal=",")` lê CSV brasileiro. Use `parse_dates=["data"]`, `dtype={"codigo": str}` (preserva zeros à esquerda), `na_values=["", "NA"]` e `usecols` para economizar memória.
- `head()` mostra as 5 primeiras linhas; `tail()`, as últimas; `sample(n)` sorteia.
- `df.shape` devolve a tupla **(linhas, colunas)**; `df.shape[0]` é o número de linhas; `len(df)` também. `df.size` é o total de células.
- `df.info()` mostra colunas, tipos, contagem de não nulos e memória. `df.dtypes` lista os tipos; `df.describe()` resume só as numéricas, a menos que se use `include="all"`; `df.isna().sum()` conta nulos por coluna.
- `df["coluna"]` devolve uma **Series** (1D); `df[["coluna"]]` devolve um **DataFrame** (2D). É a diferença mais cobrada.
- `.loc` seleciona por **rótulo** e inclui o limite final; `.iloc` seleciona por **posição** e exclui o limite final. `df.loc[0:2]` traz três linhas; `df.iloc[0:2]`, duas.
- `.loc` aceita máscara: `df.loc[df["uf"] == "SP", ["municipio", "valor"]]`.
- O índice padrão é `RangeIndex` (0 a n−1). `set_index("data")` troca o índice; `reset_index()` volta ao padrão.
- `df[df["a"] > 1]["b"] = 0` é *chained indexing*: pode gerar `SettingWithCopyWarning` e não alterar o original. Prefira `df.loc[df["a"] > 1, "b"] = 0`.

```python
df = pd.DataFrame({"setor": ["A", "B", "A"], "vazao": [10, 20, 30]})
print(df.shape)            # (3, 2)
print(type(df["setor"]))   # <class 'pandas.core.series.Series'>
print(df["vazao"].mean())  # 20.0
```

## 2. Quadro comparativo

| Operação | Devolve | Limite final |
|---|---|---|
| `df["x"]` | Series | — |
| `df[["x"]]` | DataFrame | — |
| `df.loc[0:2]` | linhas por rótulo | **inclusivo** |
| `df.iloc[0:2]` | linhas por posição | **exclusivo** |
| `df.shape` | (linhas, colunas) | — |
| `df.info()` | tipos e nulos | — |

## 3. Pegadinha de prova

A FGV explora `.loc` versus `.iloc`: com índice 0–9, `df.loc[2:4]` traz **3** linhas e `df.iloc[2:4]`, **2**. Também troca `shape[0]` por `shape[1]` e afirma que `df["x"]` é DataFrame. Cuidado ainda com `read_csv`: a primeira linha vira cabeçalho, salvo `header=None`; e `describe()` ignora colunas de texto por padrão.

## 4. Macete

**"Colchete simples é Series; colchete duplo é DataFrame. `loc` inclui, `iloc` exclui."**

**Revisar:** D+1, D+7, D+30.
