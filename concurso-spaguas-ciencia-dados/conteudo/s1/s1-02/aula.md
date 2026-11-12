---
id: s1-02
titulo: "Modelagem ER e transformação para relacional"
disciplina: s1
modulo: s1-m1
item_edital: "1.1"
tempo: 50
nivel: intermediario
---

# Modelagem ER e transformação para relacional

> **Ideia central:** o diagrama ER é conceitual e independente do SGBD; a passagem para tabelas segue regras fixas de cardinalidade — e a prova cobra o símbolo e o lugar da FK.

## 1. Essencial

- **Modelo ER.** Descreve entidades, atributos e relacionamentos sem se prender ao SGBD. Entidade = objeto ou conceito; instância = ocorrência concreta; atributo = propriedade.
- **Notação de Chen.** Retângulo = entidade; **losango = relacionamento**; elipse = atributo; linha = participação. Elipse dupla = atributo multivalorado; elipse tracejada = derivado; retângulo duplo = entidade fraca; losango duplo = relacionamento identificador; atributo sublinhado = chave.
- **Cardinalidade máxima.** 1:1, 1:N ou N:N indica quantas ocorrências de um lado se associam a uma do outro. **Participação mínima** indica se toda ocorrência participa (total) ou não (parcial). Máximo e mínimo são dimensões diferentes: um 1:N pode ter mínimo 0 ou 1 dos dois lados.
- **Entidade forte × fraca.** A fraca não tem chave própria e só existe vinculada à forte. Ex.: `Dependente` depende de `Funcionario`; `Item` depende de `Pedido`. A chave da fraca = chave da forte + chave parcial.
- **Generalização/especialização.** Superclasse e subclasses, com herança de atributos e relacionamentos. Pode ser total ou parcial, disjunta ou sobreposta.
- **Regras de transformação.**
  - Entidade forte → tabela; atributo simples → coluna; composto → colunas atômicas.
  - Multivalorado → tabela própria, com FK da entidade.
  - **1:N → FK na tabela do lado N** (o “muitos”), nunca no lado 1.
  - **1:1 → FK em um dos lados, com UNIQUE**; prefira o lado com participação total.
  - **N:N → tabela associativa** com as duas FKs e PK composta pelo par.
  - Relacionamento com atributo → coluna na tabela associativa (ou na tabela do lado N, no 1:N).
  - Entidade fraca → tabela com PK composta (forte + parcial).

**Exemplo resolvido.** Funcionário tem vários dependentes; funcionário participa de vários projetos, com horas em cada um.

```sql
CREATE TABLE dependente (
  id_funcionario INTEGER REFERENCES funcionario(id_funcionario),
  nome_dependente VARCHAR(80),
  parentesco VARCHAR(30),
  PRIMARY KEY (id_funcionario, nome_dependente)
);

CREATE TABLE alocacao (
  id_funcionario INTEGER REFERENCES funcionario(id_funcionario),
  id_projeto     INTEGER REFERENCES projeto(id_projeto),
  horas          NUMERIC(6,2),
  PRIMARY KEY (id_funcionario, id_projeto)
);
```

`dependente` é entidade fraca: sua PK só é única junto com a chave do funcionário. `alocacao` resolve o N:N e recebe o atributo `horas`.

## 2. Quadro comparativo

| Cardinalidade | Onde vai a FK | Tabela criada | Erro típico |
|---|---|---|---|
| 1:1 | em um dos lados, com UNIQUE | nenhuma | esquecer o UNIQUE e permitir duplicidade |
| 1:N | no lado N | nenhuma | colocar a FK no lado 1 |
| N:N | na tabela associativa (uma FK para cada original) | associativa com duas FKs | tentar resolver com uma FK só |
| Multivalorado | na tabela do atributo | tabela com FK + valor | deixar lista dentro de uma coluna |

## 3. Pegadinha de prova

A FGV troca os símbolos: **losango é relacionamento**, elipse é atributo, retângulo é entidade. Na transformação, a armadilha é colocar a FK no lado 1 do 1:N — isso até “funciona” para um registro, mas não representa vários filhos e gera redundância. Em N:N, a banca oferece alternativas com uma FK em cada tabela original; a correta é sempre a tabela associativa. Também aparece “entidade fraca tem chave própria”: ela tem apenas chave parcial.

## 4. Macete

**“Losango relaciona, elipse atribui, retângulo existe.”** Para transformar: **“1:N, FK no N; N:N, nasce tabela.”**

## Fontes

- [Oracle — Data Modeler: entidades, relações e cardinalidade](https://docs.oracle.com/en/database/oracle/sql-developer-data-modeler/24.3/dmdug/data-modeler-concepts-usage.html)
- [PostgreSQL — Foreign Keys](https://www.postgresql.org/docs/current/ddl-constraints.html#DDL-CONSTRAINTS-FK)
- [Oracle — Logical Design e modelos normalizados](https://docs.oracle.com/en/database/oracle/oracle-database/23/dwhsg/data-warehouse-logical-design.html)
