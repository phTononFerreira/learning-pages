# Exercícios — Pandas: filtros, groupby, merge e agregações

## Q1 (fácil)

Qual expressão filtra corretamente as linhas com `status` igual a `"Ativo"` **e** `valor` maior que 100?

A) `df[df["status"] == "Ativo" and df["valor"] > 100]`
B) `df[(df["status"] == "Ativo") & (df["valor"] > 100)]`
C) `df[(df["status"] == "Ativo") && (df["valor"] > 100)]`
D) `df.query("status" == "Ativo" & "valor" > 100)`
E) `df.loc["status" == "Ativo"]`

## Q2 (média)

```python
df = pd.DataFrame({"setor": ["A", "A", "B", "B", "B"],
                   "vazao": [10, 30, 20, 40, 50]})
print(df.groupby("setor")["vazao"].mean().round(1).to_dict())
```

A) `{'A': 20.0, 'B': 36.7}`
B) `{'A': 40, 'B': 110}`
C) `{'A': 20.0, 'B': 33.3}`
D) `{'A': 25.0, 'B': 36.7}`
E) `{'A': 20.0, 'B': 55.0}`

## Q3 (difícil)

```python
pedidos = pd.DataFrame({"cliente": ["A", "A", "B"], "valor": [10, 20, 30]})
clientes = pd.DataFrame({"cliente": ["A", "A", "B"], "regiao": ["SP", "SP", "RJ"]})
print(len(pedidos.merge(clientes, on="cliente")))
```

A) 3
B) 4
C) 5
D) 6
E) 9

