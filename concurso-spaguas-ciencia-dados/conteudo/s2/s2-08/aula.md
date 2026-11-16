---
id: s2-08
titulo: "Não supervisionado, métricas e validação"
disciplina: s2
modulo: s2-m3
item_edital: "2.3"
tempo: 55
nivel: avancado
---

# Não supervisionado, métricas e validação

> **Ideia central:** sem rótulo, o modelo procura estrutura; com rótulo, você mede o erro com uma matriz de confusão — e escolhe a métrica pelo custo de cada erro.

## 1. Essencial

- **Não supervisionado:** não existe `y`. O objetivo é descobrir estrutura: agrupar (clustering), reduzir dimensões (PCA) ou encontrar associações.
- **k-means:** escolhe k centróides, atribui cada ponto ao mais próximo, recalcula a média de cada grupo e repete até convergir. É sensível à escala (padronize) e à inicialização (use k-means++ ou várias execuções).
- **Cotovelo:** plota a inércia — soma das distâncias ao quadrado dentro do cluster — contra k; escolhe-se o ponto em que o ganho marginal despenca. **Silhouette** (de −1 a 1, maior melhor) é alternativa.
- **Matriz de confusão binária:** VP (positivo previsto e real), FP (falso positivo, erro tipo I), FN (falso negativo, erro tipo II), VN.
- **Acurácia** = `(VP + VN) / total`.
- **Precisão** = `VP / (VP + FP)`: dos que o modelo marcou como positivos, quantos eram.
- **Recall / sensibilidade** = `VP / (VP + FN)`: dos positivos reais, quantos foram encontrados.
- **Especificidade** = `VN / (VN + FP)`: dos negativos reais, quantos foram descartados.
- **F1** = `2·P·R / (P + R)`: média harmônica; cai quando precisão ou recall é baixa.
- **Escolha pelo custo:** FN caro (denúncia grave, fraude, doença) → priorize recall; FP caro (bloquear cliente honesto, spam) → priorize precisão; classes equilibradas → acurácia ou F1.
- **Paradoxo da acurácia:** com 2% de positivos, prever "tudo negativo" dá 98% de acurácia e recall 0.
- **Validação cruzada:** k-fold divide em k partes e treina k vezes; `StratifiedKFold` mantém a proporção das classes; série temporal usa `TimeSeriesSplit`, respeitando a ordem.
- **Desbalanceamento:** pesos de classe, reamostragem e SMOTE; SMOTE apenas no treino, dentro do pipeline/validação cruzada, para não vazar informação do teste. Sempre com métrica adequada.
- **Drift:** *data drift* é mudança na distribuição de X; *concept drift* é mudança na relação X→y. Monitore e retreine.

Exemplo: VP = 30, FP = 10, FN = 20, VN = 40. Acurácia = 70/100 = 70%; precisão = 30/40 = 75%; recall = 30/50 = 60%; especificidade = 40/50 = 80%; F1 = `2·0,75·0,60/1,35 ≈ 66,7%`.

## 2. Quadro comparativo

| Métrica | Fórmula | Pergunta que responde |
|---|---|---|
| Acurácia | (VP+VN)/total | acertei no geral? |
| Precisão | VP/(VP+FP) | quando digo positivo, acerto? |
| Recall | VP/(VP+FN) | quantos positivos deixei passar? |
| Especificidade | VN/(VN+FP) | descartei bem os negativos? |
| F1 | 2PR/(P+R) | equilíbrio entre P e R |

## 3. Pegadinha de prova

A FGV troca os denominadores: precisão usa `VP+FP`; recall usa `VP+FN`; especificidade usa `VN+FP`. Também apresenta base desbalanceada e uma acurácia alta para induzir "modelo ótimo" — olhe o recall da classe minoritária. Por fim, cotovelo e silhouette escolhem **k** no clustering; não são métricas de classificação supervisionada.

## 4. Macete

**"Precisão: dos meus positivos, quantos são verdadeiros. Recall: dos verdadeiros, quantos eu peguei."**

## Fontes

- [scikit-learn — Clustering](https://scikit-learn.org/stable/modules/clustering.html)
- [scikit-learn — Metrics and scoring](https://scikit-learn.org/stable/modules/model_evaluation.html)
- [scikit-learn — Cross-validation](https://scikit-learn.org/stable/modules/cross_validation.html)
- [scikit-learn — Preprocessing and scaling](https://scikit-learn.org/stable/modules/preprocessing.html)
