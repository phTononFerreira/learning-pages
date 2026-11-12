# Gabarito — Variância, desvio-padrão, coeficiente de variação e boxplot

## Q1 — D

o desvio-padrão é a raiz quadrada da variância: √9 = 3. As alternativas 4,5 e 18 confundem com divisão ou dobro; 81 é o quadrado de 9; 9 é a própria variância. A unidade do desvio é a mesma dos dados, o que facilita a interpretação.

## Q2 — B

CV de A = 20/200 = 10%; de B = 5/25 = 20%. O desvio absoluto maior não implica maior dispersão relativa, e a média maior tende a reduzir o CV. O tamanho da amostra não entra na fórmula do coeficiente de variação.

## Q3 — A

a soma dos quadrados dos desvios é 32. O pandas usa `ddof=1` e divide por 7: 4,57. O NumPy usa `ddof=0` e divide por 8: 4,00. As opções espelham quem acha que as duas bibliotecas usam o mesmo divisor; a alternativa E confunde soma dos quadrados com variância.

## Flashcards

- Variância amostral divide por quanto? — Por `n − 1` (graus de liberdade); a populacional divide por `N`.
- Para que serve o coeficiente de variação? — Comparar dispersão relativa entre grupos com unidades ou escalas diferentes.
- O que fica dentro da caixa do boxplot? — Q1 a Q3, com a mediana marcada; o IQR concentra 50% centrais.
