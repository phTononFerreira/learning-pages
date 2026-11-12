---
id: s1-03
titulo: "Normalização: 1FN, 2FN, 3FN e BCNF"
disciplina: s1
modulo: s1-m1
item_edital: "1.1"
tempo: 50
nivel: intermediario
---

# Normalização: 1FN, 2FN, 3FN e BCNF

> **Ideia central:** normalizar é decompor tabelas para eliminar redundância e anomalias; cada forma normal remove um tipo específico de dependência funcional.

## 1. Essencial

- **Objetivo.** Evitar anomalias de inserção, atualização e exclusão, mantendo cada fato em um só lugar. A decomposição deve ser **sem perda** (lossless join) e, quando possível, preservar as dependências.
- **Dependência funcional (DF).** `X → Y` significa que cada valor de X determina um único valor de Y. X é o **determinante**; Y é o dependente.
- **Chave candidata.** Conjunto mínimo de atributos que determina todos os demais. **Atributo primo** é aquele que faz parte de alguma chave candidata.
- **1FN — atomicidade.** Cada interseção linha/coluna tem um único valor. Sem listas, vetores ou grupos repetitivos; a tabela precisa de PK.
- **2FN — chave inteira.** Está em 1FN e nenhum atributo não-primo depende de **parte** da chave composta (dependência parcial). Com PK de um único atributo não existe dependência parcial.
- **3FN — só a chave.** Está em 2FN e nenhum não-primo depende de outro não-primo (dependência transitiva). Regra formal: em toda DF não trivial `X → A`, X é superchave **ou** A é primo.
- **BCNF — todo determinante é chave.** Em toda DF não trivial `X → Y`, X é superchave. É mais estrita que a 3FN: a 3FN ainda tolera `X → A` quando A é primo e X não é superchave.
- **Desnormalizar.** Repetir dados de propósito para relatórios e BI, reduzindo joins. O custo é redundância e risco de inconsistência; star schema é denormalizado por projeto.

**Exemplo resolvido — 2FN.** `matricula(id_aluno, id_curso, nome_aluno, nome_curso, nota)`, PK `(id_aluno, id_curso)`.

```text
id_aluno → nome_aluno        (parcial: depende só de parte da PK)
id_curso → nome_curso        (parcial)
(id_aluno, id_curso) → nota  (total)
```

Decomposição: `aluno(id_aluno, nome_aluno)`, `curso(id_curso, nome_curso)` e `matricula(id_aluno, id_curso, nota)`. O join pelas chaves reconstrói a tabela original sem perda.

**Exemplo resolvido — 3FN.** `funcionario(id_funcionario, id_departamento, nome_departamento)` tem `id_departamento → nome_departamento`. O nome do departamento não depende da chave, mas de outro atributo não-primo. Separe `departamento(id_departamento, nome_departamento)` e mantenha a FK em `funcionario`.

## 2. Quadro comparativo

| Forma | Exige | Violação típica | Exemplo |
|---|---|---|---|
| 1FN | valores atômicos e PK | lista de telefones em uma coluna | `telefones = '11-9999;11-3333'` |
| 2FN | 1FN + sem dependência parcial | não-primo depende de parte da chave | `id_aluno → nome_aluno` |
| 3FN | 2FN + sem dependência transitiva | não-primo depende de não-primo | `id_depto → nome_depto` |
| BCNF | todo determinante é superchave | determinante não-candidato | `C → B` com chave `AB` |

## 3. Pegadinha de prova

A FGV troca 2FN por 3FN: dependência **parcial** é 2FN; **transitiva** é 3FN. Outra armadilha é dizer que “toda tabela em 3FN está em BCNF” — falso. Em `R(A,B,C)` com `AB → C` e `C → B`, as chaves candidatas são `AB` e `AC`; todos os atributos são primos, então a relação está em 3FN, mas `C → B` viola a BCNF porque C não é superchave. Por fim, “2FN exige chave composta” é falso: a 2FN só é relevante quando a chave é composta.

## 4. Macete

**“1FN: átomo. 2FN: chave inteira. 3FN: só a chave. BCNF: todo determinante é chave.”**

## Fontes

- [Microsoft — Database normalization basics](https://learn.microsoft.com/en-us/office/troubleshoot/access/database-normalization-description)
- [Oracle — Normalização e 3NF](https://docs.oracle.com/en/database/oracle/oracle-database/23/dwhsg/data-warehouse-logical-design.html)
- [PostgreSQL — Constraints e chaves](https://www.postgresql.org/docs/current/ddl-constraints.html)
