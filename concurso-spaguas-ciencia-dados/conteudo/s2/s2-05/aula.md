---
id: s2-05
titulo: "Variância, desvio-padrão, coeficiente de variação e boxplot"
disciplina: s2
modulo: s2-m2
item_edital: "2.2"
tempo: 45
nivel: intermediario
---

# Variância, desvio-padrão, coeficiente de variação e boxplot

> **Ideia central:** média diz onde o conjunto está; dispersão diz o quanto ele se espalha. Sem a segunda, a primeira engana.

## 1. Essencial

- **Amplitude:** `max − min`. É barata, mas depende de dois valores e ignora todo o resto.
- **Variância populacional:** `σ² = Σ(xi − μ)² / N`. **Amostral:** `s² = Σ(xi − x̄)² / (n − 1)`. O divisor n−1 corrige o fato de a média amostral já ter sido estimada dos próprios dados (graus de liberdade).
- **Desvio-padrão:** `s = √s²`. Volta à unidade original, o que o torna interpretável; a variância fica na unidade ao quadrado.
- A soma dos desvios brutos é sempre zero; por isso se eleva ao quadrado antes de somar.
- **Coeficiente de variação:** `CV = s / x̄ × 100%`. É adimensional e permite comparar grupos com unidades ou escalas diferentes. Fica instável quando a média está perto de zero.
- **IQR:** `Q3 − Q1`, a faixa dos 50% centrais. É resistente a outliers, ao contrário da amplitude e do desvio-padrão.
- **Boxplot:** caixa de Q1 a Q3, linha na mediana, bigodes até `1,5 × IQR`; pontos além dos bigodes são outliers (sinal para investigar, não para excluir automaticamente).
- **Transformações:** somar uma constante desloca a média e não muda o desvio; multiplicar por k multiplica média e desvio por |k| e a variância por k².
- **Pandas vs NumPy:** `Series.var()` e `.std()` usam `ddof=1` (amostral); `numpy.var()` usa `ddof=0` por padrão (populacional).

Exemplo com `2, 4, 4, 4, 5, 5, 7, 9`: média 5; soma dos quadrados dos desvios = 32; `s² = 32/7 ≈ 4,57`; `s ≈ 2,14`; `σ² = 4`; `σ = 2`. Pelo método de Tukey (mediana das metades), Q1 = 4, Q3 = 6, IQR = 2; cercas em 1 e 9, sem outliers. Com interpolação linear (pandas/Excel), Q3 = 5,5, IQR = 1,5, cerca superior 7,75 — e 9 seria outlier. A banca deve dizer o método; na dúvida, use a definição dela.

## 2. Quadro comparativo

| Medida | Fórmula | Unidade | Resistente a outlier? |
|---|---|---|---|
| Amplitude | máx − mín | original | não |
| Variância | Σ(x−x̄)²/(n−1) | original² | não |
| Desvio-padrão | √variância | original | não |
| CV | s/x̄ × 100% | % (adimensional) | não |
| IQR | Q3 − Q1 | original | sim |

## 3. Pegadinha de prova

A FGV troca os denominadores: variância **amostral** divide por `n−1`, não por `n`. Também chama o desvio-padrão de "erro da média" — ele mede dispersão dos dados, não erro de estimativa. Em CV, maior valor não significa maiores observações, e sim maior dispersão **relativa**. E cuidado com a frase "o boxplot mostra 50% dos dados entre Q1 e Q3": correto; "os 50% mais próximos da média", falso.

## 4. Macete

**"Variância é o quadrado; o desvio volta à régua; o CV tira a unidade."**

## Fontes

- [OpenIntro — Statistics](https://www.openintro.org/book/os/)
- [NIST/SEMATECH — Measures of Scale](https://www.itl.nist.gov/div898/handbook/eda/section3/eda35b.htm)
- [pandas — `DataFrame.var`](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.var.html)
- [NumPy — `var`](https://numpy.org/doc/stable/reference/generated/numpy.var.html)
