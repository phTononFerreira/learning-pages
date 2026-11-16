# Resumo — Metadados, catálogo e linhagem

> sem metadados o dado existe, mas não é encontrável, compreensível nem confiável; catálogo e linhagem tornam o ativo utilizável.

## 1. Essencial

**Metadado é dado sobre dado.** Ele descreve origem, significado, formato, qualidade, uso e movimento — não é o conteúdo em si.

- **Metadados técnicos:** estrutura física e lógica — nome da tabela e da coluna, tipo, tamanho, formato, chave, índice, particionamento, localização, codificação.
- **Metadados de negócio:** significado e regra — definição do termo, domínio, unidade, regra de cálculo, owner, classificação, restrição de uso.
- **Metadados operacionais:** execução e uso — data da última carga, frequência, volume processado, logs, tempo de resposta, linhagem de execução, resultados de qualidade.

**Catálogo de dados** é o inventário pesquisável dos ativos: reúne metadados, definições, owners e classificação. Serve para descobrir o que existe, evitar retrabalho e apoiar governança; não armazena o dado nem substitui o banco.

**Dicionário de dados** descreve cada campo: nome, tipo, domínio, regra e significado. É um metadado, publicado no catálogo.

**Glossário de negócio** fixa o vocabulário: “outorga”, “vazão” e “bacia” passam a ter definição única, evitando sentidos diferentes por área.

**Linhagem (lineage)** é o mapa origem → transformação → destino. Responde a três perguntas práticas:

1. **Impacto:** se eu mudar a coluna `cod_bacia`, quais relatórios e cargas quebram?
2. **Causa-raiz:** de onde veio o valor errado que apareceu no painel?
3. **Auditoria:** que dados e regras produziram este número?

A linhagem pode ser **técnica** (extraída de SQL e ETL) ou **de negócio** (mapa entre termos e indicadores). Não é log de acesso nem histórico de versões.

**Dados mestres (master data)** são entidades compartilhadas e estáveis que precisam de fonte autorizada e registro único — o *golden record*: usuário, fornecedor, bacia. **Dados de referência** são listas padronizadas: UF, código de uso. Dados transacionais registram eventos e mudam sempre.

No **DAMA-DMBOK**, metadados, qualidade, dados mestres, data warehousing e governança são áreas distintas que se conectam: a governança define dono e política; o catálogo dá visibilidade; a linhagem, rastreabilidade.

**Papéis de governança:** o **conselho** (ou comitê) define política e prioridades; o **data owner** responde pelo domínio; o **data steward** cuida da definição e da qualidade; o **custodian** (TI) opera armazenamento, acesso e backup. O catálogo registra owner e steward de cada ativo, dando nome a essa responsabilidade.

## 2. Quadro comparativo

| Recurso | Pergunta que responde | Não é |
|---|---|---|
| Metadado técnico | como o dado está armazenado? | definição de negócio |
| Metadado de negócio | o que o dado significa? | tipo da coluna |
| Catálogo | o que existe e quem responde? | banco de dados |
| Dicionário | o que cada campo significa? | glossário corporativo |
| Linhagem | de onde veio e para onde vai? | log de acesso |
| Dados mestres | qual é a versão única da entidade? | dado transacional |

## 3. Pegadinha de prova

A FGV troca “catálogo” por “banco de dados” e “linhagem” por “auditoria de acesso”. Também confunde **dicionário** (campo a campo, técnico) com **glossário** (termo de negócio) e **dados mestres** (entidade compartilhada) com **dados de referência** (lista de domínio). Por fim, metadado não é sinônimo de dado de qualidade: qualidade é uma dimensão registrada sobre o dado.

## 4. Macete

**“Catálogo é a vitrine, dicionário é a bula, linhagem é o mapa e o mestre é a fonte única.”**

**Revisar:** D+1, D+7, D+30.
