# Resumo — Pandas: filtros, groupby, merge e agregações

> filtrar linhas, agrupar por categoria e cruzar tabelas é o núcleo da análise com Pandas — e a FGV cobra a sintaxe e o número de linhas resultante.

## 1. Essencial

- **Filtro booleano:** `df[df["vazao"] > 100]`. Para combinar condições use `&`, `|` e `~`, sempre com parênteses: `df[(df["status"] == "Ativo") & (df["valor"] > 100)]`. `and`, `or` e `not` não funcionam em Series.
- `.isin(["SP", "RJ"])` testa pertencimento; `.between(a, b)` é inclusivo nas duas pontas; `.str.contains("esgoto", na=False)` busca texto.
- `.query("vazao > 100 and setor == 'A'")` é a versão legível do filtro. Variável externa entra com `@`: `.query("vazao > @limite")`.
- `groupby("setor")["vazao"].agg(["mean", "sum", "count"])` aplica várias agregações. A agregação nomeada `agg(media=("vazao", "mean"))` batiza a coluna; `as_index=False` devolve o grupo como coluna.
- `merge` combina tabelas por chave. `how="inner"` mantém só as chaves presentes nos dois lados; `"left"` preserva a esquerda; `"right"`, a direita; `"outer"`, todas. Chaves duplicadas **multiplicam** linhas; `suffixes=("_x", "_y")` desempata colunas homônimas.
- `value_counts()` conta ocorrências e ordena do mais frequente para o menos; `normalize=True` devolve proporções. `count()` dentro de `groupby` **ignora nulos**.
- `sort_values(by="valor", ascending=False)` ordena; `nlargest(3, "valor")` pega os três maiores.
- `fillna(0)` ou `fillna({"vazao": 0})` preenche; `ffill()` propaga o último valor; `dropna(subset=["vazao"])` remove só as linhas sem essa coluna. Sem `inplace=True` ou atribuição, o DataFrame original não muda.
- `pd.to_datetime(df["data"], format="%d/%m/%Y", errors="coerce")` converte; `errors="coerce"` transforma inválidos em `NaT`. Depois, `.dt.year`, `.dt.month` e `.dt.dayofweek` (segunda = 0).

```python
resumo = (df[df["status"] == "Ativo"]
          .groupby("setor")["valor"]
          .agg(total="sum", media="mean")
          .sort_values("total", ascending=False))
```

## 2. Quadro comparativo

| Comando | Efeito | Erro típico |
|---|---|---|
| `&` | E lógico entre máscaras | usar `and` ou esquecer parênteses |
| `inner` | só chaves dos dois lados | achar que preserva a esquerda |
| `left` | preserva a tabela da esquerda | inverter a ordem das tabelas |
| `value_counts` | conta e ordena | confundir com `count`, que ignora nulo |
| `fillna` | preenche ausentes | esquecer de atribuir o resultado |

## 3. Pegadinha de prova

A FGV adora `merge` com chave repetida: três pedidos e dois clientes homônimos podem gerar mais linhas que o esperado, porque cada pedido casa com cada cliente de mesma chave. Também cobra `&` sem parênteses — `df[df.a > 1 & df.b < 2]` é interpretado errado — e `df.query` com `&` sem isolar cada condição. Por fim, `dropna()` remove nulos, **não** duplicatas; para isso existe `drop_duplicates()`.

## 4. Macete

**"Parêntese em cada condição, `&` isolado no `query`, `how` decide quem sobrevive."**

**Revisar:** D+1, D+7, D+30.
