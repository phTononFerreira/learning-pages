# Resumo — SGBD, arquitetura e modelo relacional

> o SGBD é o software que fica entre a aplicação e o arquivo; o modelo relacional representa os dados em tabelas com chaves e regras de integridade.

## 1. Essencial

- **SGBD × banco de dados.** O banco é o conjunto de dados e esquema; o SGBD é o software que define, manipula, protege e recupera esses dados.
- **Funções do SGBD.** Definição de esquema (DDL), manipulação (DML), controle de acesso, concorrência, recuperação após falha, catálogo de metadados e integridade.
- **Transação e ACID.** Atomicidade, consistência, isolamento e durabilidade. O SGBD garante que uma transação não fique pela metade.
- **Arquitetura ANSI/SPARC (3 níveis).** Externo = visões de cada usuário; conceitual = esquema lógico global; interno = arquivos, índices e organização física.
- **Independência lógica.** Mudar o esquema conceitual sem alterar views e aplicações. **Independência física:** mudar índices, arquivos ou particionamento sem alterar o esquema conceitual.
- **Modelo relacional.** Relação = tabela; tupla = linha; atributo = coluna; **grau** = nº de colunas; **cardinalidade** = nº de linhas; domínio = valores permitidos. Esquema é a estrutura; instância é o conteúdo do momento.
- **Chaves.** Superchave identifica a linha; chave candidata é mínima; a **PK** é a candidata escolhida (única e não nula); as demais são **alternativas**. A **FK** referencia uma PK ou uma coluna UNIQUE, inclusive da própria tabela.
- **Integridade.** De entidade (PK não nula), referencial (FK aponta para valor existente ou é NULL), de domínio (tipo e CHECK) e semântica (regras de negócio).
- **UNIQUE ≠ PK.** A PK é uma só por tabela e rejeita NULL; UNIQUE pode existir em várias colunas e, no PostgreSQL, aceita vários NULLs.

**Exemplo resolvido.** Uma outorga pertence a um usuário; o usuário pode ter várias outorgas.

```sql
CREATE TABLE usuario (
  id_usuario INTEGER PRIMARY KEY,
  cpf        VARCHAR(11) NOT NULL UNIQUE
);

CREATE TABLE outorga (
  id_outorga INTEGER PRIMARY KEY,
  id_usuario INTEGER NOT NULL REFERENCES usuario(id_usuario),
  data_inicio DATE NOT NULL
);
```

A FK `id_usuario` garante que não existe outorga órfã. `ON DELETE RESTRICT` (ou o padrão `NO ACTION`) impede apagar usuário com outorga; `ON DELETE CASCADE` apagaria as outorgas junto.

## 2. Quadro comparativo

| Nível | Quem enxerga | O que contém | Mudança típica |
|---|---|---|---|
| Externo | usuário e aplicação | views e autorizações | criar uma view para a diretoria |
| Conceitual | projetista do banco | tabelas, colunas, chaves, regras | criar uma nova entidade |
| Interno | SGBD e DBA | arquivos, índices, partições | trocar armazenamento ou índice |

## 3. Pegadinha de prova

A FGV troca as independências: “alterar o índice sem mudar as consultas” é **independência física**, não lógica. Também é comum afirmar que FK só referencia PK — falso: pode referenciar qualquer coluna UNIQUE. Outra troca recorrente é dizer que UNIQUE equivale a NOT NULL; no PostgreSQL, uma coluna UNIQUE aceita vários NULLs, enquanto a PK não aceita nenhum. Por fim, grau é número de **colunas**; cardinalidade é número de **linhas** — a banca inverte os dois.

## 4. Macete

**“Externo é o que você vê; conceitual é o que existe; interno é onde está gravado.”** Para chaves: **PK não repete nem falta; UNIQUE não repete, mas pode faltar.**

**Revisar:** D+1, D+7, D+30.
