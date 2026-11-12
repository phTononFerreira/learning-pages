---
id: s2-06
titulo: "Correlação linear e análise de tendências"
disciplina: s2
modulo: s2-m2
item_edital: "2.2"
tempo: 40
nivel: intermediario
---

# Correlação linear e análise de tendências

> **Ideia central:** o coeficiente de Pearson mede a força e o sinal de uma relação **linear**; ele não prova causa, não detecta curva e não substitui olhar o gráfico.

## 1. Essencial

- **Correlação de Pearson:** `r = cov(x,y) / (sx · sy)`, sempre entre −1 e +1. Mede associação **linear** entre duas variáveis quantitativas.
- **Sinal:** positivo, as duas crescem juntas; negativo, uma cresce enquanto a outra cai. **Força:** |r| < 0,3 fraca; 0,3 a 0,7 moderada; > 0,7 forte (regra de bolso, varia por área).
- `r` não tem unidade e não muda se você soma uma constante ou multiplica por constante positiva; multiplicar por negativo troca o sinal.
- **`r = 0`:** não há relação linear. Pode haver relação forte não linear — uma parábola, por exemplo. Sempre olhe o diagrama de dispersão.
- **`r²`:** proporção da variância de y explicada pela reta de regressão. `r = 0,8` → `r² = 0,64`, isto é, 64% da variação de y é explicada por x; os outros 36% vêm de outros fatores e ruído.
- **Outliers** puxam `r` com força. Um ponto distante pode criar ou destruir uma correlação aparente.
- **Correlação ≠ causalidade.** Três explicações concorrentes: confundidor (o calor aumenta sorvete e afogamento), causalidade reversa e coincidência.
- **Série temporal:** tendência (direção de longo prazo), sazonalidade (padrão que se repete em período fixo), ciclo (oscilação irregular) e ruído.
- **Média móvel** suaviza a série; para avaliar um modelo temporal, respeite a ordem — treine no passado e teste no futuro.
- **Spearman:** correlação de postos; capta relação monótona e é mais robusta a outliers que Pearson.

## 2. Quadro comparativo

| Valor de r | Leitura |
|---|---|
| +0,9 | forte, positiva |
| +0,4 | moderada, positiva |
| 0 | nenhuma relação **linear** |
| −0,7 | forte, negativa |
| −0,2 | fraca, negativa |

## 3. Pegadinha de prova

A FGV troca "correlação" por "causalidade" e "r" por "r²". `r = 0,7` não significa 70% de explicação: `r² = 0,49`, ou 49%. Também é falsa a frase "r = 0 prova independência": prova ausência de relação linear, não de qualquer relação. Em série temporal, tendência e sazonalidade são componentes distintos — crescimento anual é tendência; pico todo janeiro é sazonalidade.

## 4. Macete

**"r mede reta, não causa; r² mede quanto a reta explica."**

## Fontes

- [OpenIntro — Statistics](https://www.openintro.org/book/os/)
- [NIST/SEMATECH — Exploratory Data Analysis](https://www.itl.nist.gov/div898/handbook/eda/section3/eda3.htm)
- [pandas — `corr`](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.corr.html)
