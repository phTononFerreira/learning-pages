# Relatório final — auditoria do projeto SP Águas 2026

**Projeto:** `concurso-spaguas-ciencia-dados` · **Data:** 11/11/2026
**Escopo:** edital, dados, conteúdo, HTML/JS, links, UX e consistência numérica.

## Veredito geral

**APROVADO COM RESSALVAS.** Os 26 subitens do programa têm aula; os números do edital conferem; as contagens 45/135/135/15/66 batem; não há link local quebrado; e o site funciona sem backend. Corrigi três defeitos objetivos — link 404, code fences em enunciados e botões de flashcard inertes — e uma inconsistência de módulo (20 → 24). Restam ressalvas não bloqueantes: gabaritos enviesados, imprecisão jurídica em `g3-04`, fonte ISO 38500:2015 retirada e 7 títulos divergentes entre currículo e aulas.

> **Pós-auditoria (mesma data).** As ressalvas 2–6 foram corrigidas depois deste relatório: comentário de `g3-04` separado entre interesse (art. 18, I) e parentesco em pericia/testemunha/representante (art. 18, II); ISO 38500 atualizada para a edição 2024; 7 títulos alinhados entre currículo e aulas; simulados gerais e específicos estratificados por disciplina; texto dos “12 primeiros” precisado; documentação da raiz atualizada para 24 módulos. A única ressalva mantida é a distribuição dos gabaritos (A15/B38/C40/D25/E17), que não afeta a validade do conteúdo e pode ser rebalanceada em uma próxima revisão.

## Conformidade por requisito

| Requisito | Status | Evidência |
|---|---|---|
| Cobertura dos 26 subitens (Gerais I–IV; Específicos I–IV) | **OK** | 26/26; 45 aulas, 0 lacunas |
| Números do edital | **OK** | 3 vagas, R$ 10.366, 40h, 70 (20+50), 8/20 e 20/50, discursiva 2×20 (mín. 10/20), 12 correções, títulos 4,5/3,5/2,0, nota 100, prova 31/01/2027, inscrições 17/11–17/12/2026 |
| 45 aulas, 135 questões, 135 cards, 15 simulados | **OK** | 45 `.md` + 45 `.html`; 3 questões e 3 cards por aula; 15 provas |
| 66 páginas + aliases | **OK** | 66 canônicas + 3 redirects (`dashboard/`, `flashcards/`, `plano-estudos/`) = 69 arquivos |
| Links internos | **OK** | 1.459 verificados, 0 quebrados; 383 âncoras, 0 ausentes |
| Placeholders, markdown cru, duplicatas | **OK após correção** | Sem `TODO`/`Lorem`/`{{`; sem `**`, `## ` ou `](` no HTML; nenhum enunciado duplicado |
| HTML/JS | **OK após correção** | 14/14 JS passam em `node --check`; 0 IDs duplicados nas 69 páginas |
| UX e offline | **OK** | Dark/light, busca client-side, progresso em `localStorage`, sem backend, `border-radius: 0`, accent `#1d4ed8`, SVGs com `stroke-width="2"` |
| Consistência de dados | **OK após correção** | `g4-04` apontava para módulo inexistente; corrigido; 24 módulos únicos |

## Matriz de cobertura do edital

| Bloco | Subitem → aula(s) | Aulas | Lacunas |
|---|---|---|---|
| Gerais I — Pensamento analítico | 1.1 → g1-01, g1-02; 1.2 → g1-02; 1.3 → g1-03, g1-04; 1.4 → g1-05 | 5 | 0 |
| Gerais II — Gestão e águas | 2.1 → g2-01, g2-04; 2.2 → g2-03, g2-04; 2.3 → g2-02; 2.4 → g2-05, g2-06 | 6 | 0 |
| Gerais III — Estado, Direito e Ética | 3.1 → g3-01, g3-02, g3-03; 3.2 → g3-04; 3.3 → g3-05, g3-06 | 6 | 0 |
| Gerais IV — Transformação digital | 4.1 → g4-01; 4.2 → g4-02; 4.3 → g4-03, g4-04 | 4 | 0 |
| Específicos I — Dados e SQL | 1.1 → s1-01, s1-02, s1-03; 1.2 → s1-04, s1-05, s1-06; 1.3 → s1-07 | 7 | 0 |
| Específicos II — Ciência de dados | 2.1 → s2-01, s2-02, s2-03; 2.2 → s2-04, s2-05, s2-06; 2.3 → s2-07, s2-08 | 8 | 0 |
| Específicos III — BI e governança | 3.1 → s3-01; 3.2 → s3-02, s3-03, s3-04 | 4 | 0 |
| Específicos IV — Infraestrutura | 4.1 → s4-01, s4-02; 4.2 → s4-03; 4.3 → s4-04; 4.4 → s4-05 | 5 | 0 |

**Total:** 26 subitens, 45 aulas, 0 lacunas. Distribuição: 5/6/6/4 nas gerais e 7/8/4/5 nas específicas.

## Números e contagens

| Item do edital | Valor conferido |
|---|---|
| Vagas, salário, jornada | 3 (3 AC + 0 PcD); R$ 10.366,00; 40h, CLT |
| Objetiva e mínimos | 70 questões (20+50), 5 alternativas; 8/20 e 20/50 |
| Discursiva | 2 questões, 40 linhas, 20 pontos cada, mínimo 10/20; 12 corrigidas (4×3) |
| Títulos e nota final | 4,50 / 3,50 / 2,00; máximo 10; objetiva 50 + discursiva 40 + títulos 10 = 100 |
| Datas | prova 31/01/2027; inscrições 17/11–17/12/2026 |

- **45 aulas**, **24 módulos**, **8 disciplinas**, 1.935 min = **32h15**. O site arredonda para “32h” e o JSON registra `32.2`; é arredondamento, não erro.
- **135 questões**: 45/45/45 por nível; todas com 5 alternativas, gabarito e comentário; 3 por aula.
- **135 flashcards**: 3 por aula; nenhum vazio; sem perguntas duplicadas.
- **15 simulados**: diagnóstico (20), 8 disciplinares, 3 gerais (20), 2 específicos (36), final (70 = 20+50). Todos os IDs existem; sem repetição interna.
- **66 canônicas + 3 redirects**. O README fala em 66; é a contagem canônica, consistente com o build.

## Links e assets

| Verificação | Resultado |
|---|---|
| `checar_links_site.py` | 1.459 locais; **0 quebrados** |
| Âncoras `#id` | 383; **0 ausentes** |
| `checar_links.py` | 101 URLs; **100 OK**; 1 ISO 403 (anti-bot) |
| Externos em todo o HTML | 169 únicos; 161 OK; 8 bloqueios anti-bot |
| CVM 2024 | **404 real**, corrigido para URL oficial **200 PDF** |
| Postgres (4 URLs) | `URLError` transitório na 1ª checagem; rechecagem **200** |
| `node --check` | **14/14** OK |
| IDs duplicados | **0** em 69 páginas |

Não há 404 remanescente. Os 403/203 restantes são anti-bot/cookie: SAGE 403, PubMed 203 ×3, ISO 403, W3C 403 ×3. W3C e ISO abrem por fetch dedicado; PubMed exige cookies; SAGE bloqueia automação.

## Achados de conteúdo

### Corrigidos

1. **Code fences em 6 enunciados de 4 aulas** — apareciam como ``` ```python ``` / `<code>python` no HTML:
   - `conteudo/s1/s1-07.md:98` (Q3)
   - `conteudo/s2/s2-01.md:62` (Q2) e `:78` (Q3)
   - `conteudo/s2/s2-02.md:83` (Q3)
   - `conteudo/s2/s2-03.md:69` (Q2) e `:86` (Q3)
   - Correção em `scripts/build_lib.py:40` (`question_md`) e `scripts/build_site.py:487`; HTML regenerado.
2. **Botões “Errei/Acertei” dos flashcards** — `assets/lesson.js:54` buscava os botões dentro de `.flashcard`, mas o gerador os coloca no irmão `.fc-controls` (`scripts/build_site.py:500`). Os 135 cards das 45 aulas tinham botões sem listener. Corrigido para usar `card.nextElementSibling`.
3. **Link CVM 404** — `pesquisa/estrategia_aprovacao.md:119` e `pesquisa.html:598` usavam `.../acesso-a-informacao/cvm/...`; o correto é `.../acesso-a-informacao-cvm/...`. Substituído; página regenerada.
4. **Módulo inexistente** — `conteudo/g4/g4-04.md:5` declarava `g4-m4`, mas o currículo só tem `g4-m1..m3`; a aula é de LGPD, logo `g4-m3`. Corrigido; `README.md:10` passou de 20 para 24 módulos.
5. **Typo** — `README.md:11`: “Idea central” → “Ideia central”.

### Ressalvas não corrigidas

- **Gabaritos enviesados:** A=15, B=38, C=40, D=25, E=17 (uniforme esperado: 27). χ²=19,93, df=4, p≈0,0005. `s3` não tem A/E; `s4` não tem D. Não é erro formal, mas permite padrão de chute.
- **`g3-04`:** `conteudo/g3/g3-04.md:68` diz “servidor com interesse próprio ou de cônjuge, companheiro ou parente até o terceiro grau”. O art. 18, I, trata de interesse direto/indireto; o parentesco até 3º grau está no inciso II (perito/testemunha/representante). Gabarito da Q2 correto; comentário impreciso. Já anotado em `pesquisa/qa_juridico.md:35`.
- **ISO 38500:** `conteudo/s4/s4-05.md:103` cita a edição 2015, marcada *Withdrawn*; a vigente é 2024 (`iso.org/standard/81684.html`). Os seis princípios continuam corretos.
- **7 títulos divergentes** entre `curriculo.json` e aulas: `g2-02`, `g2-03`, `g2-04`, `g2-05`, `g4-02`, `s2-04`, `s2-05`. Sem erro factual; só nomenclatura.
- **“12 primeiros”:** `edital.html:60` simplifica; o edital fala em até 4× vagas (12), incluindo empatados, com PcD à parte.
- **Simulados:** `geral-2` concentra 11/20 em g3; `especifico-1` tem 3/36 em s3. Não viola o edital, mas reduz representatividade.
- **Documentação da raiz:** `README.md` e `AGENTS.md` da raiz ainda dizem 20 módulos; o projeto tem 24. Não alterei a raiz para evitar conflito com edição concorrente.

### Amostragem factual (8 aulas × 3 afirmações)

| Aula | Verificações | Resultado |
|---|---|---|
| `g2-01` | 6/5/7; água pública/limitada/econômica; prioridade em escassez | OK (Planalto) |
| `g2-04` | SIGRH; criação de Agência de Bacia; FEHIDRO 10%/50% | OK (Lei 7.663/1991) |
| `g3-01` | LIMPE; eficiência pela EC 19/1998; exceção de publicidade | OK (CF/1988) |
| `g3-05` | LAI 20+10; sigilo 25/15/5; dados pessoais 100 anos | OK (Lei 12.527/2011) |
| `s1-06` | LEFT JOIN + WHERE vira INNER; COUNT; NOT IN com NULL | OK (PostgreSQL) |
| `s2-03` | `.between` inclusivo; merge duplica chave; média 36,7 | OK (pandas) |
| `s3-03` | metadados técnicos/negócio/operacionais; catálogo; linhagem | OK (DAMA/Purview) |
| `s4-03` | 5 características NIST; responsabilidades IaaS/PaaS/SaaS; híbrida ≠ multicloud | OK (NIST 800-145) |

Nenhuma alucinação factual na amostra. A imprecisão de `g3-04` é a única ressalva jurídica relevante e não afeta o gabarito.

## Correções aplicadas

| # | Arquivo(s) | Correção | Verificação |
|---|---|---|---|
| 1 | `pesquisa/estrategia_aprovacao.md:119`, `pesquisa.html` | URL CVM 404 → 200 PDF | `urllib` 200 |
| 2 | `assets/lesson.js:54-56` | listener busca `.fc-controls` irmão | 135/135 cards |
| 3 | `scripts/build_lib.py:40`, `scripts/build_site.py:487` | code fence → `<pre><code>` | 6 enunciados; build idempotente |
| 4 | `conteudo/g4/g4-04.md:5`, `README.md:10` | `g4-m4` → `g4-m3`; 20 → 24 módulos | 24 módulos; 45 aulas |
| 5 | `README.md:11` | “Idea” → “Ideia” | revisão textual |

Todas as páginas foram regeneradas por `scripts/build_site.py`; nenhum HTML gerado foi editado à mão. O build inicial não produziu diff; após as correções, só os arquivos esperados mudaram.

## Riscos e recomendações

1. **Rebalancear gabaritos A–E** sem mudar conteúdo: C+B = 58% e `s3` não tem A/E. É o risco mais fácil de explorar.
2. **Corrigir o comentário de `g3-04`** separando interesse (art. 18, I) de parentesco em atuação como perito/testemunha/representante (art. 18, II).
3. **Atualizar a fonte ISO 38500** para 2024; o texto dos seis princípios não muda.
4. **Unificar os 7 títulos** entre currículo e aulas.
5. **Precisar a regra dos 12** em `edital.html`: “até 12, incluindo empatados; PcD à parte”.
6. **Atualizar a documentação da raiz** (20 → 24 módulos).
7. **Reequilibrar simulados** por disciplina, se representatividade proporcional for desejada.
8. **Não “corrigir” os 403/203** de ISO, W3C, PubMed e SAGE: são bloqueios anti-bot, não 404.

## Comandos executados e resultados

| Comando | Resultado |
|---|---|
| `python scripts/build_site.py` | 45 aulas, 135 questões, 135 cards, 15 simulados; 66 páginas; idempotente antes das edições |
| `python scripts/validar_conteudo.py` | 45 arquivos, 0 erros |
| `python scripts/auditar.py` | 135 questões; A15/B38/C40/D25/E17; 0 duplicatas; 101 URLs |
| `python scripts/checar_links_site.py` | 1.459 locais; 0 quebrados |
| `python scripts/checar_links.py` | 101 verificadas; 100 OK; 1 ISO 403 |
| `node --check assets/*.js dados/*.js` | 14/14 OK |
| `python -m py_compile scripts/build_lib.py scripts/build_site.py` | OK |
| Checagem externa do HTML | 169 URLs; 161 OK; 8 anti-bot; 1 404 CVM corrigido |
| Scripts ad hoc | 45/45 aulas, 135/135 questões, 135/135 cards, 15/15 simulados, 26/26 itens, 69 páginas sem IDs duplicados, 383 âncoras válidas |

## Achados mais importantes

1. **Cobertura e números:** 26/26 subitens cobertos e todos os números críticos conferem; não há lacuna estrutural.
2. **Defeitos funcionais corrigidos:** 6 enunciados com code fence quebrado, 135 flashcards de aula com botões inertes e 1 link CVM 404. Eram os únicos erros objetivos com impacto real de uso.
3. **Risco residual principal:** gabarito enviesado (C+B = 58%; p≈0,0005), imprecisão jurídica em `g3-04` e fonte ISO 2015 retirada. Nada bloqueia o estudo, mas os três merecem correção antes de novo QA.
