---
id: s1-07
titulo: "ETL, qualidade e limpeza de dados"
disciplina: s1
modulo: s1-m3
item_edital: "1.3"
tempo: 45
nivel: intermediario
---

# ETL, qualidade e limpeza de dados

> **Ideia central:** ETL move e trata o dado até o destino; qualidade é medida por dimensões objetivas, e limpeza é a técnica aplicada a cada defeito encontrado.

## 1. Essencial

- **Extract.** Lê a origem: extração full (tudo), incremental (só o que mudou) ou CDC (captura de mudanças pelo log). A extração deve ser reprocessável e registrar a data de corte.
- **Transform.** Limpa, padroniza, deduplica, converte tipos, valida regras, enriquece e agrega. É a etapa que concentra a qualidade.
- **Load.** Grava no destino: full refresh, append ou upsert (merge). Carga idempotente pode rodar duas vezes sem duplicar; staging isola a origem do destino.
- **ETL × ELT.** No ETL, transforma antes de carregar. No ELT, carrega o bruto e transforma dentro do destino (comum em data lake e warehouse na nuvem). A ordem invertida é pegadinha de prova.
- **Data warehouse.** Orientado por assunto, integrado, não volátil e variável no tempo; schema-on-write; modelagem dimensional (fato e dimensão).
- **Data lake.** Guarda dados brutos, estruturados ou não, em formato aberto; schema-on-read; bom para exploração e ML, mas exige catálogo e governança para não virar “pântano”.
- **Data mart.** Recorte departamental do DW (dependente) ou ilha própria (independente). Não é sinônimo de DW corporativo.
- **Dimensões de qualidade.**
  - **Completude:** o dado necessário está presente?
  - **Consistência:** o mesmo dado bate entre sistemas e formatos?
  - **Precisão (acurácia):** o valor reflete a realidade?
  - **Unicidade:** existe uma só linha por entidade?
  - **Validade:** respeita formato, domínio e faixa (data 31/02, CPF com letra)?
  - **Atualidade:** está disponível na hora e com a recência necessárias?
- **Limpeza no Pandas.** `dropna()` remove linhas com nulo (`how='any'` é o padrão), `fillna()` imputa, `drop_duplicates(subset=..., keep=...)` deduplica, `str.strip()`/`str.upper()` padroniza, `to_datetime(errors='coerce')` converte e invalida o que não parseia.
- **Outliers.** Detecte por IQR (fora de Q1 − 1,5×IQR e Q3 + 1,5×IQR) ou z-score (|z| > 3). Outlier não é sinônimo de erro: investigue antes de remover; alternativas são winsorizar ou manter e usar modelo robusto.
- **`dropna` ≠ `drop_duplicates`.** O primeiro trata ausência; o segundo, repetição. `inplace=True` altera o DataFrame e retorna `None`.

**Exemplo resolvido.** Padronizar, converter e deduplicar um CSV de outorgas.

```python
import pandas as pd

df = pd.read_csv("outorgas.csv")
df["municipio"] = df["municipio"].str.strip().str.upper()
df["data_inicio"] = pd.to_datetime(df["data_inicio"], errors="coerce")
df = df.drop_duplicates(subset=["numero_outorga"], keep="last")
df = df.dropna(subset=["id_usuario", "data_inicio"])
```

`errors="coerce"` transforma data inválida em `NaT`, que o `dropna` seguinte remove. A deduplicação usa a chave de negócio, não a linha inteira.

## 2. Quadro comparativo

| Critério | Data lake | Data warehouse | Data mart |
|---|---|---|---|
| Conteúdo | bruto, qualquer formato | integrado e modelado | recorte departamental |
| Schema | on-read | on-write | on-write |
| Uso típico | exploração e ML | BI corporativo | BI de uma área |
| Risco | virar pântano sem catálogo | custo e rigidez do modelo | visão parcial |

## 3. Pegadinha de prova

A FGV troca ETL por ELT: “carregar o bruto e transformar depois” é ELT, não ETL. Também afirma que `dropna()` remove duplicatas — falso: ele remove nulos; duplicata é `drop_duplicates()`. Outra troca é dizer que data lake usa schema-on-write, quando o lake é schema-on-read. Por fim, outlier pode ser um registro real (uma outorga de grande volume), então removê-lo sem investigar não é regra de qualidade.

## 4. Macete

**“ETL: Extrai, Trata, Guarda.”** Qualidade: **“completo, consistente, correto, único, válido e na hora.”**

## Fontes

- [Microsoft — Extract, transform, load (ETL)](https://learn.microsoft.com/en-us/azure/architecture/data-guide/relational-data/etl)
- [Oracle — Data warehouse: normalização e modelagem](https://docs.oracle.com/en/database/oracle/oracle-database/23/dwhsg/data-warehouse-logical-design.html)
- [Pandas — `dropna`](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.dropna.html)
- [Pandas — `drop_duplicates`](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.drop_duplicates.html)
