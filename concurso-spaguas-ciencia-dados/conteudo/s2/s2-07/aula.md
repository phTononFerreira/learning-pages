---
id: s2-07
titulo: "Aprendizado supervisionado: classificação e regressão"
disciplina: s2
modulo: s2-m3
item_edital: "2.3"
tempo: 50
nivel: intermediario
---

# Aprendizado supervisionado: classificação e regressão

> **Ideia central:** se a resposta é uma categoria, é classificação; se é um número, é regressão. O resto é escolher algoritmo, treinar e medir no que o modelo **não** viu.

## 1. Essencial

- **Supervisionado** significa dados rotulados: para cada observação existe um `y` conhecido. O objetivo é aprender a relação `X → y` e generalizar para casos novos.
- **Classificação:** `y` é discreto (procedente/improcedente, risco alto/médio/baixo). **Regressão:** `y` é numérico (vazão em m³/s, valor da multa, demanda diária).
- **Divisão treino/teste:** `train_test_split(X, y, test_size=0.3, random_state=42)`. Nunca avalie no treino. Com classes desbalanceadas, use `stratify=y`; em série temporal, treine no passado e teste no futuro.
- `X` deve ser 2D `(n_amostras, n_features)`; `y`, 1D. Uma única feature exige `reshape(-1, 1)`.
- **`fit`** estima os parâmetros; **`predict`** aplica o modelo; **`predict_proba`** devolve probabilidades; **`score`** devolve acurácia em classificadores e R² em regressores.
- **Regressão linear:** `y = b0 + b1x1 + ...`; minimiza a soma dos quadrados dos resíduos; extrapola mal fora da faixa observada.
- **Regressão logística:** o nome engana — é **classificação**. Aplica a função logística e devolve probabilidade; o limiar usual é 0,5.
- **Árvore de decisão:** regras if/else, interpretável, propensa a overfitting quando cresce demais. **Random Forest** combina muitas árvores e reduz a variância.
- **kNN** vota pelos k vizinhos mais próximos; **SVM** busca a margem máxima entre classes (SVC; a variante SVR faz regressão, com kernels para fronteiras curvas). Os dois são sensíveis à escala e pedem padronização.
- **Overfitting:** erro baixo no treino e alto no teste — o modelo decorou ruído. **Underfitting:** erro alto nos dois — modelo simples demais. Regularização, mais dados, poda e validação cruzada combatem o overfitting.
- **Vazamento de dados (leakage):** padronizar ou selecionar variáveis usando a base inteira antes do split contamina o teste com informação que deveria ser desconhecida.

```python
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression

X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.25,
                                          stratify=y, random_state=42)
modelo = LogisticRegression(max_iter=1000)
modelo.fit(X_tr, y_tr)
print(modelo.predict(X_te)[:3])
```

## 2. Quadro comparativo

| Algoritmo | Tipo | Cuidado principal |
|---|---|---|
| Regressão linear | regressão | sensível a outlier e extrapolação |
| Regressão logística | classificação | limiar e desbalanceamento |
| Árvore | ambos | profundidade excessiva |
| Random Forest | ambos | menos interpretável |
| kNN | ambos | escala das variáveis |
| SVM | classificação (SVC) e regressão (SVR) | escala e custo computacional |

## 3. Pegadinha de prova

A FGV cobra três trocas: "regressão logística é regressão" (é classificação), "`fit` prevê" (ele treina; `predict` prevê) e "avaliar no treino basta" (infla o resultado). Também confunde `score`: em classificador, é acurácia; em regressor, R². Por fim, `X` com uma coluna só precisa de `reshape(-1, 1)`, senão o scikit-learn reclama de formato.

## 4. Macete

**"Classificação escolhe rótulo; regressão estima número. `fit` estuda, `predict` responde."**

## Fontes

- [scikit-learn — Supervised learning](https://scikit-learn.org/stable/supervised_learning.html)
- [scikit-learn — `train_test_split`](https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.train_test_split.html)
- [scikit-learn — Common pitfalls (data leakage)](https://scikit-learn.org/stable/common_pitfalls.html)
