# QA técnico — infraestrutura, BI e raciocínio

**Escopo:** 14 aulas — `s3-01` a `s3-04`, `s4-01` a `s4-05`, `g1-01` a `g1-05`.
**Data da revisão:** 11/11/2026.
**Base:** `pesquisa/incidencia_fgv_ti.md`, `pesquisa/analise_banca.md`, `pesquisa/CONTEXTO_EDITAL.md`; MDN/RFC 9110 e RFC 8259, W3C XML/Namespaces, NIST SP 800-145/800-53/800-63B, Microsoft/AWS/Google (responsabilidade compartilhada e Power BI), ISACA/Axelos/ISO 38500, Planalto (LGPD/LAI) e checagem de links.

## Resumo

- **5 correções factuais em 4 aulas:** `s3-04` (2), `g1-02` (1), `g1-03` (1), `g1-04` (1).
- **10 aulas sem alteração.** Nenhum gabarito comprovadamente errado; **1 gabarito ambíguo** (`g1-01` Q3) e **5 pontos para verificar**.
- **BI, governança de dados, APIs, JSON/XML, nuvem, segurança/backup e COBIT/ITIL** conferem com as fontes. As correções são de lógica, codificação visual e precisão terminológica — não de estilo.
- `python scripts/validar_conteudo.py`: **45 arquivos, 0 erros**.

## Correções aplicadas

| Aula | Antes | Depois | Fonte |
|---|---|---|---|
| `g1-02` | "Se qualquer dado a confirma, não é hipótese." | "Se nenhum dado pode refutá-la, não é hipótese." | Popper/SEP: falsificabilidade exige possibilidade de refutação; confirmação por alguns dados não desqualifica a hipótese. |
| `g1-03` | "porque a área comunica o tamanho" | "porque o comprimento comunica o tamanho" | Barras codificam magnitude pelo comprimento; por isso o zero é obrigatório (FT Visual Vocabulary, Data-to-Viz, FlowingData). |
| `g1-04` | "única medida de centro útil para variável categórica" | "... para variável categórica nominal" | Nominal: só a moda; ordinal: mediana e moda também são úteis (Laerd/PMC). |
| `s3-04` | "**Princípios (LGPD, art. 6º):** finalidade, ..." | "**Princípios (LGPD, art. 6º), entre eles:** finalidade, ..." | LGPD art. 6º tem 10 princípios; a lista de 7 não é exaustiva (Planalto). |
| `s3-04` | "salvo reversão por meios próprios" | "salvo reversão por meios próprios ou esforços razoáveis" | LGPD art. 12 prevê as duas hipóteses de reversão (Planalto). |

**Fontes das correções:** Lei 13.709/2018, arts. 6º e 12 — https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm · Stanford Encyclopedia of Philosophy, "Science and Pseudo-Science" — https://plato.stanford.edu/entries/pseudo-science/ · Laerd Statistics, "Measures of Central Tendency" — https://statistics.laerd.com/statistical-guides/measures-central-tendency-mean-mode-median-faqs.php · FlowingData, "Bar Chart Baselines Start at Zero" — https://flowingdata.com/2015/08/31/bar-chart-baselines-start-at-zero/ · Data-to-Viz — https://www.data-to-viz.com/.

## Verificar (não alterado)

| Aula | Ponto | Leitura |
|---|---|---|
| `g1-01` Q3 | III "formulário sem campo obrigatório" foi classificado como **material** (gabarito A); a alternativa D usa **método**. | A classificação 6M é convencional: há materiais que tratam formulário como "material/informação" e outros como "método". **Revisar o gabarito ou anular a distinção A/D.** |
| `s3-04` | "risco alto exige avaliação de impacto (RIPD)" | LGPD art. 38: a ANPD **pode determinar** o RIPD; não é exigência automática para todo tratamento de risco alto. Redação é simplificação. |
| `s4-03` | "Multicloud é usar dois provedores públicos" | Multicloud pode incluir nuvem privada; a distinção com híbrida (integração/mobilidade) está correta, mas a definição é restritiva. |
| `s3-02` | Lista de dimensões atribuída ao DAMA-DMBOK | A lista de 8 é adaptada; o DAMA 2017 lista accuracy, completeness, consistency, currency, integrity, reasonability, timeliness, uniqueness e validity. "Conformidade" aparece na ISO 25012; a atribuição é didática, não literal. |
| `g1-03` | "Linha ... exige intervalo constante" | É recomendação forte, não requisito formal; intervalos irregulares existem, mas podem enganar. Verificar se a banca trata como regra. |

## Links problemáticos

- `https://www.iso.org/standard/62816.html` (`s4-05`) → **HTTP 403** na checagem automatizada; é bloqueio anti-bot do ISO, não 404. A página existe e deve abrir em navegador.
- Nenhum outro link das 14 aulas retornou erro; todos os demais responderam **200** em 11/11/2026.
- O 404 de `al.sp.gov.br/.../lei-complementar-1413...` em `dados/links_status.txt` pertence a outro grupo, não a `s3`/`s4`/`g1`.

## Veredito por aula

| Aula | Tema | Veredito | Mudanças |
|---|---|---|---|
| `s3-01` | BI, dashboards, visual | OK | 0 |
| `s3-02` | Ciclo de vida e qualidade | OK; verificar atribuição DAMA | 0 |
| `s3-03` | Metadados, catálogo, linhagem | OK | 0 |
| `s3-04` | Segurança e privacidade | 2 correções de completude legal | 2 |
| `s4-01` | REST, métodos, status | OK | 0 |
| `s4-02` | JSON e XML | OK | 0 |
| `s4-03` | Nuvem: modelos e responsabilidade | OK; verificar multicloud | 0 |
| `s4-04` | Autenticação, backup, RPO/RTO | OK | 0 |
| `s4-05` | COBIT, ITIL, ISO 38500, PDTIC | OK | 0 |
| `g1-01` | Diagnóstico e causa-raiz | OK; Q3 ambígua | 0 |
| `g1-02` | Hipóteses e decisão | 1 correção de falsificabilidade | 1 |
| `g1-03` | Leitura de gráficos | 1 correção de codificação visual | 1 |
| `g1-04` | Estatística descritiva | 1 correção de precisão (nominal) | 1 |
| `g1-05` | Dedução, indução, falácias, vieses | OK | 0 |

**Total:** 4 aulas alteradas, 5 correções, 10 aulas intactas.

## Observações de cobertura

- **Star/snowflake:** não aparecem nestas 14 aulas; há apenas "star schema" de passagem em `s1-03`. Não é erro factual, mas é lacuna se o plano do módulo 3.1 exigir modelagem dimensional.
- **PDTIC:** `s4-05` diz "médio prazo"; o instrumento tem horizonte variável (anual/plurianual). Simplificação aceitável, sem alteração.
- **Dedução/indução:** `g1-05` usa a definição escolar (geral → particular); a definição formal é consequência necessária, independentemente da generalidade das premissas. Não é erro para prova; apenas registro.
- **Gabaritos:** todos os 42 gabaritos foram conferidos; nenhum erro comprovado. O único que merece revisão é `g1-01` Q3.
