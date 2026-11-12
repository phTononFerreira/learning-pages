# Gabarito — Aprendizado supervisionado: classificação e regressão

## Q1 — B

o alvo é uma quantidade numérica contínua (m³), o que caracteriza regressão. Classificação exigiria categorias, como "consumo alto/baixo". Agrupamento e redução de dimensionalidade são não supervisionados, pois não usam um `y` rotulado. A palavra-chave do enunciado é "volume", não "classe" ou "risco".

## Q2 — D

a diferença grande entre treino e teste indica que o modelo decorou o treino e não generalizou — overfitting. Underfitting e viés alto produziriam erro alto também no treino. Um modelo linear não é diagnóstico, e não há indício de problema nos dados de teste.

## Q3 — A

a padronização global usa informação do teste para transformar o treino, caracterizando data leakage e inflando a avaliação. O correto é ajustar o scaler só no treino e aplicá-lo ao teste. As demais opções citam problemas que não decorrem desse procedimento.

## Flashcards

- Classificação ou regressão para prever demanda em m³? — Regressão, porque o alvo é numérico.
- O que `fit` e `predict` fazem? — `fit` estima parâmetros com o treino; `predict` aplica o modelo a dados novos.
- Como detectar overfitting? — Erro baixo no treino e alto no teste, com grande diferença entre eles.
