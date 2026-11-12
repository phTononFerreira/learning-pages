---
id: s3-02
titulo: "Ciclo de vida e qualidade de dados"
disciplina: s3
modulo: s3-m2
item_edital: "3.2"
tempo: 45
nivel: essencial
---

# Ciclo de vida e qualidade de dados

> **Ideia central:** dado é ativo com ciclo de vida; qualidade se mede por dimensão e se corrige preferencialmente na origem.

## 1. Essencial

O **ciclo de vida do dado** vai da necessidade ao descarte: **planejamento** (por que coletar, quem usa, base legal), **coleta**, **armazenamento**, **processamento**, **uso e compartilhamento**, **arquivamento** e **descarte**. Governança e segurança atravessam todas as fases.

**Dimensões de qualidade** (DAMA-DMBOK):

- **Completude** — não faltam valores obrigatórios.
- **Unicidade** — não há duplicatas do mesmo registro.
- **Acurácia (exatidão)** — o valor reflete a realidade.
- **Consistência** — o mesmo fato não aparece divergente entre sistemas ou regras.
- **Validade** — o valor respeita formato, tipo e domínio permitidos.
- **Tempestividade** — o dado está disponível quando a decisão exige.
- **Integridade referencial** — chaves estrangeiras apontam para registros existentes.
- **Conformidade** — o tratamento segue lei, norma e política interna.

**Exemplo resolvido:** uma outorga tem data de início em branco (completude), aparece duas vezes (unicidade) e tem área de 12 ha no cadastro e 15 ha na cobrança (consistência).

**Papéis:** o **data owner** é o gestor do domínio, com responsabilidade final; o **data steward** executa a curadoria — regras, dúvidas e qualidade; o **custodian** é a TI, que opera armazenamento, backup e acesso. Owner decide; steward cuida; custodian mantém.

**Origem versus depois:** validar no cadastro (prevenção) evita que o erro se propague; corrigir no ETL ou no dashboard (remediação) trata o sintoma e se repete a cada carga. A regra **1-10-100** resume o custo: prevenir custa 1, corrigir custa 10, conviver com a falha custa 100.

**Custo da má qualidade:** retrabalho, relatório divergente, decisão errada, multa e perda de confiança.

**Programa de qualidade:** perfilamento, regras objetivas, painel de monitoramento, causa-raiz e correção na origem; qualidade é processo contínuo.

## 2. Quadro comparativo

| Dimensão | Pergunta que responde | Sintoma típico |
|---|---|---|
| Completude | falta valor? | campo obrigatório nulo |
| Unicidade | o mesmo registro aparece duas vezes? | CPF/processo duplicado |
| Acurácia | o valor é verdadeiro? | área declarada difere da medida |
| Consistência | os sistemas concordam? | dois cadastros divergentes |
| Validade | o formato é permitido? | data “31/02” ou UF inexistente |
| Tempestividade | chegou a tempo? | base de ontem para alerta de hoje |

## 3. Pegadinha de prova

A FGV troca dimensões vizinhas. **Acurácia** é aderência à realidade; **consistência** é concordância entre fontes ou regras; **validade** é formato/domínio. Também confunde papéis: steward não é o dono do dado nem o setor de TI, e “qualidade é responsabilidade exclusiva da TI” é falsa — a origem é do negócio. Outra armadilha é achar que corrigir no dashboard resolve: o dado errado continua na base e volta na próxima carga.

## 4. Macete

**“Faltou? completude. Repetiu? unicidade. É mentira? acurácia. Discordou? consistência. Formato errado? validade. Atrasou? tempestividade.”**

## Fontes

- [DAMA International — DAMA-DMBOK](https://www.dama.org/cpages/body-of-knowledge)
- [Microsoft Learn — Microsoft Purview (catálogo e governança)](https://learn.microsoft.com/en-us/purview/purview)
- [W3C — PROV-O (proveniência)](https://www.w3.org/TR/prov-o/)
