---
id: s2-04
titulo: "Média, mediana e moda: quando cada uma engana"
disciplina: s2
modulo: s2-m2
item_edital: "2.2"
tempo: 40
nivel: essencial
---

# Média, mediana e moda: quando cada uma engana

> **Ideia central:** média, mediana e moda respondem à mesma pergunta — qual é o centro? — mas reagem de forma diferente a extremos e à forma da distribuição.

## 1. Essencial

- **Média aritmética:** `x̄ = Σxi / n`. Usa todos os valores e tem a unidade dos dados; por isso, um único valor extremo pode deslocá-la.
- **Mediana:** ordena os dados e pega o centro. Com n ímpar, é a posição `(n+1)/2`; com n par, é a média dos dois valores centrais. Depende de posição, não de magnitude.
- **Moda:** valor mais frequente. Pode não existir (todos com a mesma frequência) ou haver várias (bimodal, multimodal). É a única medida de centro válida para variável **nominal**.
- **Simétrica:** média ≈ mediana ≈ moda. **Assimétrica à direita:** média > mediana > moda. **À esquerda:** média < mediana < moda. Essa ordem vale para distribuições unimodais suaves; não é teorema universal.
- **Média ponderada:** `x̄w = Σ(xi·wi) / Σwi`. É o que se usa quando cada observação tem peso diferente (população, área, vazão).
- **Média de médias:** só coincide com a média geral se os grupos tiverem o mesmo n. Com n diferente, pese cada média pelo tamanho do grupo.
- **Média aparada:** corta uma porcentagem dos extremos antes de calcular; meio-termo entre média e mediana.
- **Outlier não é erro.** Investigue antes de excluir: a exclusão muda o denominador e pode fabricar a conclusão.

Exemplo: salários (em mil) `2, 3, 3, 4, 5, 5, 5, 40`. Soma 67, n 8, média 8,375; mediana `(4+5)/2 = 4,5`; moda 5. O 40 puxa a média para cima, mas não move a mediana.

Ponderada: médias 10, 20 e 30 com pesos 2, 3 e 5 → `(20 + 60 + 150)/10 = 23`.

## 2. Quadro comparativo

| Medida | Usa todos os valores? | Resistente a outlier? | Melhor para |
|---|---|---|---|
| Média | sim | não | distribuição simétrica |
| Mediana | não (posição) | sim | renda, vazão com picos |
| Moda | não (frequência) | sim | variável categórica |

## 3. Pegadinha de prova

A FGV explora a **média de médias**: turma A com 10 alunos e média 5, turma B com 30 alunos e média 9. A média geral é `(50 + 270)/40 = 8`, não `(5+9)/2 = 7`. Outra armadilha é acrescentar valores que somam o mesmo total: a média fica igual, mas a mediana pode mudar — e nada se pode afirmar sobre ela sem recalcular.

## 4. Macete

**"Média soma e sofre; mediana conta e resiste; moda repete e manda no categórico."**

## Fontes

- [OpenIntro — Statistics](https://www.openintro.org/book/os/)
- [NIST/SEMATECH — Measures of Location](https://www.itl.nist.gov/div898/handbook/eda/section3/eda35a.htm)
- [Python — `statistics`](https://docs.python.org/3/library/statistics.html)
