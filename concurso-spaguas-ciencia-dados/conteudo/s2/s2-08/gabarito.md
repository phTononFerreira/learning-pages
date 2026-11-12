# Gabarito — Não supervisionado, métricas e validação

## Q1 — C

precisão = VP/(VP+FP) = 30/40 = 0,75. O valor 0,60 é o recall (30/50); 0,80 é a especificidade (40/50); 0,667 é o F1; 0,30 é o próprio VP dividido pelo total. A conta exige identificar quem está no denominador de cada métrica.

## Q2 — A

a inércia sempre cai quando k aumenta; o cotovelo procura o ponto em que aumentar k deixa de trazer ganho relevante. Não há rótulos verdadeiros no não supervisionado, e acurácia é métrica supervisionada. Padronização é pré-processamento, não critério de escolha de k.

## Q3 — E

o modelo acerta os 980 negativos e erra os 20 positivos: acurácia 980/1.000 = 98%, mas recall = 0/(0+20) = 0. É o paradoxo da acurácia em base desbalanceada. As alternativas invertem as métricas ou supõem que o modelo encontrou algum positivo.

## Flashcards

- Fórmula da precisão e do recall? — Precisão = VP/(VP+FP); recall = VP/(VP+FN).
- Por que acurácia engana em base desbalanceada? — Prever sempre a classe majoritária já dá acurácia alta, com recall zero na minoria.
- O que o cotovelo indica no k-means? — O k em que aumentar o número de clusters deixa de reduzir a inércia de forma relevante.
