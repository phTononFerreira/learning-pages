# SP Águas 2026 — 8 cargos e ênfases

Plataforma estática de preparação para o concurso da **Agência de Águas do Estado de São Paulo — SP Águas**, Edital nº 01/2026, banca **FGV**, com os **2 empregos e as 8 ênfases** do certame (190 vagas). O material completo é da ênfase **Analista de Suporte — Tecnologia da Informação e Ciência de Dados**; as outras 7 ênfases têm **trilha curada + núcleo comum**, e **Gestão de Recursos Hídricos** e **Gestão Ambiental e Recursos Hídricos** já contam com **cadernos específicos**.

**Online:** [phTononFerreira.github.io/learning-pages/concurso-spaguas-ciencia-dados](https://phTononFerreira.github.io/learning-pages/concurso-spaguas-ciencia-dados/) — a mesma plataforma, sem instalação.

> **Escopo real do edital.** Não há disciplina de Língua Portuguesa na prova objetiva. As **20 questões gerais são iguais para os 8 cargos**; as **50 específicas mudam** conforme o emprego/ênfase. O material completo cobre as 4 disciplinas gerais + 4 específicas de TI, exatamente como no Anexo I. Português aparece apenas como critério da prova discursiva e recebeu uma página própria.
>
> **Seletor de cargo.** A barra de configuração no topo troca o cargo alvo, aplica a cor de destaque da ênfase e abre a trilha correspondente. A preferência fica no `localStorage`.

## O que está pronto

- **Cargos**: os 8 empregos/ênfases do edital, com seletor global, cor de destaque por cargo, trilha específica e plano de 11 semanas. O material completo é de TI; as demais ênfases usam trilha curada + núcleo comum. **GRH** tem caderno de 18 lições e 24 questões; **GA** tem caderno de 18 lições e 12 questões.
- **Pesquisa**: edital estruturado, Anexo I por cargo, análise da banca FGV, pesquisa de provas anteriores por área, engenharia reversa de aprovação, análise da discursiva, base de legislação, repositório com 129 fontes e metodologia de aprendizagem.
- **Currículo**: 45 aulas compactas (32h de núcleo), organizadas em 8 disciplinas, 24 módulos e 45 arquivos de aula.
- **Material**: cada aula tem Ideia central, Essencial, quadro comparativo, pegadinha de prova, macete, 3 questões comentadas, 3 flashcards e fontes.
- **Banco de questões**: 135 questões (fácil/média/difícil), 5 alternativas, gabarito e comentário. O núcleo comum tem 63 questões reaproveitáveis pelos 8 cargos.
- **Flashcards**: 135 cards com repetição espaçada (caixas 1–5). O núcleo comum tem 63 cards reaproveitáveis.
- **Simulados**: 15 provas — diagnóstico, 8 por disciplina, 3 gerais, 2 específicos e 1 final de 70 questões.
- **Portal**: 77 páginas HTML, dark/light mode, busca client-side, progresso em localStorage, correção automática, revisões D+1/D+7/D+30 e dashboard.

## Cargos e trilhas

| Emprego | Ênfase | Vagas | Correção | Material |
|---|---|---:|---:|---|
| Analista | Tecnologia da Informação e Ciência de Dados | 3 | 12 | completo (45 aulas) |
| Analista | Administração Pública | 8 | 32 | trilha + núcleo comum |
| Analista | Direito | 5 | 20 | trilha + núcleo comum |
| Analista | Econômico-Financeira | 4 | 16 | trilha + núcleo comum |
| Especialista | Gestão de Recursos Hídricos | 77 | 308 | trilha + caderno de 18 lições |
| Especialista | Gestão Ambiental e Recursos Hídricos | 59 | 236 | trilha + caderno de 18 lições |
| Especialista | Direito e Regulação Econômica de Recursos Hídricos | 16 | 64 | trilha + núcleo comum |
| Especialista | Monitoramento Hidrológico e Ciência de Dados | 18 | 72 | trilha + núcleo comum |

As trilhas dos cargos sem material completo são **curadas a partir do Anexo I e de provas FGV análogas**; não há banco de questões específico nem aula própria para todas as disciplinas. A página de cada cargo deixa isso explícito. A exceção são **Gestão de Recursos Hídricos** e **Gestão Ambiental e Recursos Hídricos**, que têm cadernos específicos — aprofundamento, não trilha completa de 45 aulas.

## Cadernos específicos

| Ênfase | Módulos | Lições | Questões | Flashcards | Caderno |
|---|---:|---:|---:|---:|---|
| Gestão de Recursos Hídricos | 6 | 18 | 24 | 24 | [abrir](cadernos/gestao-recursos-hidricos.html) |
| Gestão Ambiental e Recursos Hídricos | 5 | 18 | 12 | 18 | [abrir](cadernos/gestao-ambiental-recursos-hidricos.html) |

Os cadernos têm quiz com correção, flashcards com repetição espaçada e simulado próprio. Eles **não substituem** o núcleo comum nem os simulados completos.

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
├── cargos/                     # índice + 8 trilhas por cargo
├── cadernos/                   # cadernos específicos de GRH e GA
├── disciplinas/                # índice + 8 páginas
├── aulas/                      # 45 páginas de aula
├── simulados/                  # índice + motor de prova
├── assets/                     # CSS e JS sem dependências
├── dados/                      # JSON + JS com aulas, questões, cards, simulados, busca e cargos
├── conteudo/                   # aulas em Markdown + derivados (aula/resumo/exercícios/gabarito)
├── pesquisa/                   # pesquisa, fontes, QA e Anexo I por cargo
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
| Cargos/ênfases | 2 empregos, 8 ênfases, 190 vagas |
| Vagas da ênfase TI | 3 (3 AC + 0 PcD) |
| Salário | R$ 10.366,00 (Analista) · R$ 12.070,00 (Especialista) |
| Jornada | 40h, CLT |
| Requisito | superior completo em qualquer área |
| Objetiva | 70 questões (20 gerais + 50 específicas), 5 alternativas |
| Mínimos | 8/20 gerais + 20/50 específicas |
| Discursiva | 2 questões, 40 linhas, 20 pontos cada, mínimo 10/20 |
| Correção da discursiva | 4 × vagas da ênfase (12 na ênfase TI) |
| Títulos | até 10 pontos (doutorado 4,5; mestrado 3,5; especialização 2,0) |
| Nota final | objetiva 0–50 + discursiva 0–40 + títulos 0–10 |
| Prova | 31/01/2027, São Paulo/SP |
| Inscrições | 17/11 a 17/12/2026 |

## Comandos

```bash
python scripts/validar_conteudo.py     # valida as 45 aulas
python scripts/auditar.py              # questões, distribuição e duplicatas
python scripts/validar_cadernos.py     # cadernos específicos em dados/caderno_*.json
python scripts/checar_links_site.py    # links internos do site
python scripts/build_site.py           # regenera dados e as 77 páginas
```

## Fontes e limites

- Fonte primária: [Edital nº 01/2026 — PDF oficial da FGV](https://conhecimento.fgv.br/sites/default/files/concursos/edital_sp_aguas_versao-final-revisao-comissao-versao-aprovada_aasncskaj_0.pdf), publicado em 10/11/2026; texto local em `fontes/edital_sp_aguas_2026.txt`.
- Coleta e verificação: **11/11/2026**; pesquisa dos cargos: **14/11/2026**.
- Este é o **primeiro concurso da SP Águas**. Não existe nota de corte oficial. As faixas de nota em `estrategia.html` são estimativas comparativas com CVM 2024, TCE-PE 2025, TCE-PI 2025 e TJRJ 2025, marcadas como tal.
- Pesquisa dos 8 cargos: `pesquisa/cargos_edital_anexo.md` (Anexo I), `pesquisa/fgv_cargos_administrativos.md` e `pesquisa/fgv_cargos_ambientais.md` (provas FGV análogas).
- O material é independente e não substitui a leitura do edital nem dos atos oficiais da FGV/SP Águas.
- Conteúdo jurídico e técnico passou por QA em `pesquisa/qa_juridico.md`, `pesquisa/qa_tecnico_dados.md` e `pesquisa/qa_tecnico_infra.md`; o relatório final está em `relatorio_final.md`.

## Metodologia

O formato segue evidência de aprendizagem: **recuperação ativa** (3 questões por aula), **prática distribuída** (D+1/D+7/D+30), **intercalação** (simulados mistos), **exemplos resolvidos** e **microlearning** (1 conceito por aula). A síntese e as referências estão em `pesquisa/metodologia_material.md`.
