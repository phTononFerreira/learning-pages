# Exercícios — ETL, qualidade e limpeza de dados

## Q1 (fácil)

Qual é a ordem das etapas de um processo ETL?

A) Extract, Transform, Load
B) Extract, Load, Transform
C) Load, Transform, Extract
D) Transform, Extract, Load
E) Load, Extract, Transform

## Q2 (média)

O mesmo CPF aparece com duas datas de nascimento diferentes em dois sistemas da SP Águas. Qual dimensão de qualidade é violada?

A) completude
B) validade
C) consistência
D) unicidade
E) atualidade

## Q3 (difícil)

Considere o código abaixo. Quantas linhas restam e qual valor fica para `id = 2`?

```python
df = pd.DataFrame({"id": [1, 2, 2, 2, 3], "valor": [10, None, 20, 30, None]})
df = df.dropna(subset=["valor"]).drop_duplicates(subset=["id"], keep="last")
```

A) 3 linhas; valor 20
B) 2 linhas; valor 20
C) 3 linhas; valor 30
D) 2 linhas; valor 30
E) 1 linha; valor 30

