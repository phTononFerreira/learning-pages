# SP Águas 2026 — Analista de Suporte (TI e Ciência de Dados)

Plataforma estática de preparação para o concurso da **Agência de Águas do Estado de São Paulo — SP Águas**, Edital nº 01/2026, banca **FGV**, emprego **Analista de Suporte à Regulação de Recursos Hídricos I — ênfase Tecnologia da Informação e Ciência de Dados**.

> **Escopo real do edital.** Não há disciplina de Língua Portuguesa na prova objetiva nem Administração Pública na prova específica desta ênfase. O conteúdo é composto por **4 disciplinas gerais + 4 específicas**, exatamente como no Anexo I. Português aparece apenas como critério da prova discursiva e recebeu uma página própria.

## O que está pronto

- **Pesquisa**: edital estruturado, análise da banca FGV, engenharia reversa de aprovação, análise da discursiva, base de legislação, repositório com 129 fontes e metodologia de aprendizagem.
- **Currículo**: 45 aulas compactas (32h de núcleo), organizadas em 8 disciplinas, 24 módulos e 45 arquivos de aula.
- **Material**: cada aula tem Ideia central, Essencial, quadro comparativo, pegadinha de prova, macete, 3 questões comentadas, 3 flashcards e fontes.
- **Banco de questões**: 135 questões (fácil/média/difícil), 5 alternativas, gabarito e comentário.
- **Flashcards**: 135 cards com repetição espaçada (caixas 1–5).
- **Simulados**: 15 provas — diagnóstico, 8 por disciplina, 3 gerais, 2 específicos e 1 final de 70 questões.
- **Portal**: 66 páginas HTML, dark/light mode, busca client-side, progresso em localStorage, correção automática, revisões D+1/D+7/D+30 e dashboard.

## Como abrir

Não precisa de backend. **Abra `index.html` no navegador** (funciona por `file://`) ou sirva a pasta:

```bash
python -m http.server 8000
# http://localhost:8000
```

O progresso fica no `localStorage` do navegador. Limpar dados do site apaga o progresso.

## Estrutura

```
concurso-spaguas-ciencia-dados/
├── index.html                  # painel
├── edital.html                 # regras, cronograma e programa
├── estrategia.html             # banca, metas, cenários, discursiva
├── discursiva.html             # template, 12 temas e português
├── flashcards.html
├── plano-estudos.html
├── dashboard.html
├── revisoes.html
├── fontes.html
├── pesquisa.html               # documentos de pesquisa renderizados
├── disciplinas/                # índice + 8 páginas
├── aulas/                      # 45 páginas de aula
├── simulados/                  # índice + motor de prova
├── assets/                     # CSS e JS sem dependências
├── dados/                      # JSON + JS com aulas, questões, cards, simulados, busca
├── conteudo/                   # aulas em Markdown + derivados (aula/resumo/exercícios/gabarito)
├── pesquisa/                   # pesquisa, fontes, QA
├── fontes/                     # PDF e texto do edital
└── scripts/                    # build, validação e auditoria
```

Cada aula em `conteudo/<disciplina>/<id>.md` é a fonte. O build gera:

```
conteudo/<disciplina>/<id>/aula.md
conteudo/<disciplina>/<id>/resumo.md
conteudo/<disciplina>/<id>/exercicios.md
conteudo/<disciplina>/<id>/gabarito.md
```

## Números do edital

| Item | Dado |
|---|---|
| Vagas da ênfase | 3 (3 AC + 0 PcD) |
| Salário | R$ 10.366,00 |
| Jornada | 40h, CLT |
| Requisito | superior completo em qualquer área |
| Objetiva | 70 questões (20 gerais + 50 específicas), 5 alternativas |
| Mínimos | 8/20 gerais + 20/50 específicas |
| Discursiva | 2 questões, 40 linhas, 20 pontos cada, mínimo 10/20 |
| Correção da discursiva | 12 candidatos (4 × 3 vagas) |
| Títulos | até 10 pontos (doutorado 4,5; mestrado 3,5; especialização 2,0) |
| Nota final | objetiva 0–50 + discursiva 0–40 + títulos 0–10 |
| Prova | 31/01/2027, São Paulo/SP |
| Inscrições | 17/11 a 17/12/2026 |

## Comandos

```bash
python scripts/validar_conteudo.py     # valida as 45 aulas
python scripts/auditar.py              # questões, distribuição e duplicatas
python scripts/checar_links_site.py    # links internos do site
python scripts/build_site.py           # regenera dados e as 66 páginas
```

## Fontes e limites

- Fonte primária: [Edital nº 01/2026 — PDF oficial da FGV](https://conhecimento.fgv.br/sites/default/files/concursos/edital_sp_aguas_versao-final-revisao-comissao-versao-aprovada_aasncskaj_0.pdf), publicado em 10/11/2026; texto local em `fontes/edital_sp_aguas_2026.txt`.
- Coleta e verificação: **11/11/2026**.
- Este é o **primeiro concurso da SP Águas**. Não existe nota de corte oficial. As faixas de nota em `estrategia.html` são estimativas comparativas com CVM 2024, TCE-PE 2025, TCE-PI 2025 e TJRJ 2025, marcadas como tal.
- O material é independente e não substitui a leitura do edital nem dos atos oficiais da FGV/SP Águas.
- Conteúdo jurídico e técnico passou por QA em `pesquisa/qa_juridico.md`, `pesquisa/qa_tecnico_dados.md` e `pesquisa/qa_tecnico_infra.md`; o relatório final está em `relatorio_final.md`.

## Metodologia

O formato segue evidência de aprendizagem: **recuperação ativa** (3 questões por aula), **prática distribuída** (D+1/D+7/D+30), **intercalação** (simulados mistos), **exemplos resolvidos** e **microlearning** (1 conceito por aula). A síntese e as referências estão em `pesquisa/metodologia_material.md`.
