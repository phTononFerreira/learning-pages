---
id: s3-01
titulo: "BI, dashboards e escolha de visual"
disciplina: s3
modulo: s3-m1
item_edital: "3.1"
tempo: 45
nivel: essencial
---

# BI, dashboards e escolha de visual

> **Ideia central:** BI converte dado em decisão; o visual certo responde à pergunta com o menor esforço de leitura.

## 1. Essencial

- **Business Intelligence (BI)** é o conjunto de processos, práticas e tecnologias que transformam dados em informação para decisão; não é sinônimo de ferramenta.
- **Data warehouse (DW):** repositório central, orientado por assunto, integrado, não volátil e variável no tempo.
- **Data lake:** dado bruto no formato nativo, com esquema aplicado na leitura (*schema-on-read*); aceita estruturado, semiestruturado e não estruturado.
- **Data mart:** recorte departamental do DW.
- **Modelagem dimensional:** tabela **fato** guarda métricas e chaves; **dimensões** dão contexto (tempo, bacia, usuário). No **star schema**, dimensões desnormalizadas ficam ao redor do fato; no **snowflake**, dimensões são normalizadas em subdimensões. Star é mais simples e rápido para BI; snowflake reduz redundância.
- **Dashboard operacional** acompanha o agora, com detalhe e alerta; o **estratégico** agrega KPI e tendência para a alta gestão.
- **KPI** é a métrica ligada a um objetivo, com meta, tendência e responsável; métrica sem meta é número.

**Escolha do visual:**

- **Barras** — comparar categorias; horizontal para ranking e rótulos longos; eixo no zero.
- **Linhas** — evolução no tempo e tendência.
- **Setores (pizza)** — composição de um todo, com poucas fatias; nunca para ranking fino.
- **Dispersão** — relação entre duas variáveis numéricas; sugere correlação, não causa.
- **Heatmap** — padrão em matriz (hora × dia, bacia × mês), com cor representando intensidade.
- **Boxplot** — distribuição, mediana, quartis e outliers; bom para comparar grupos.

**Exemplo resolvido:** a SP Águas quer saber se o volume outorgado cresceu em 24 meses. A pergunta é temporal: **linhas**, uma por tipo de uso. Se fosse “qual regional outorga mais?”, **barras ordenadas**.

**Power BI:** o **Power Query** extrai e transforma (linguagem M); o **DAX** cria medidas; o **.pbix** empacota relatório e modelo; a **matriz** hierarquiza linhas e colunas, com *drill-down*, enquanto a tabela é plana.

**Storytelling:** uma mensagem por página, título afirmativo e sequência contexto → evidência → recomendação.

## 2. Quadro comparativo

| Conceito | Papel | Erro típico |
|---|---|---|
| BI | processo de análise e decisão | tratar como sinônimo de DW |
| DW | dado integrado e histórico | dizer que guarda dado bruto |
| Data lake | dado bruto, esquema na leitura | exigir modelagem prévia |
| Data mart | recorte departamental | confundir com o DW inteiro |
| Painel operacional | monitorar o presente | usar dado anual agregado |

## 3. Pegadinha de prova

A FGV troca definições: chama o data lake de “DW com dados brutos” ou diz que o DW guarda dado não estruturado sem tratamento. Também cobra visual inadequado: pizza com 12 categorias, linha para categorias sem ordem temporal e dispersão para uma variável. Em Power BI, a armadilha é opor **Power Query** (ETL) a **DAX** (cálculo).

## 4. Macete

**“Tempo → linha; categoria → barra; parte do todo → pizza; relação → dispersão; distribuição → boxplot.”**

## Fontes

- [Microsoft Learn — Tipos de visuais no Power BI](https://learn.microsoft.com/en-us/power-bi/visuals/power-bi-visualization-types-for-reports-and-q-and-a)
- [Microsoft Learn — Visual de matriz](https://learn.microsoft.com/en-us/power-bi/visuals/power-bi-visualization-matrix-visual)
- [DAMA International — DAMA-DMBOK](https://www.dama.org/cpages/body-of-knowledge)
