# QA jurídico — G2, G3 e G4

**Escopo:** 16 aulas (`g2-01` a `g2-06`, `g3-01` a `g3-06`, `g4-01` a `g4-04`), 48 questões. **Data:** 11/11/2026.
**Base:** `pesquisa/base_legislacao.md`, `pesquisa/CONTEXTO_EDITAL.md`; texto oficial (Planalto, ALESP, SP Águas); checagem de links em 11/11/2026.

> **Atualização 16/11/2026:** a URL de repositório da ALESP usada nas correções de link passou a responder 404; o link estável da LC 1.413/2024 é `https://www.al.sp.gov.br/norma/210012` (verificado em 16/11/2026). As tabelas abaixo registram o estado da auditoria de 11/11/2026.

## 1. Resumo

- **16 aulas revisadas; 8 alteradas; 9 edições** — 3 correções de conteúdo e 6 correções de link.
- **48 gabaritos conferidos; nenhum errado.** Os comentários das questões estão alinhados com a lei, ressalvadas as imprecisões anotadas em “Verificar”.
- **Correções de conteúdo:** `g2-04` (condição legal do FEHIDRO), `g3-05` (art. 21 da LAI estava superamplo) e `g4-03` (art. 4º da LGPD estava superamplo).
- **Links:** 6 ocorrências da LC 1.413/2024 apontavam para URL 404; corrigidas para a URL oficial da ALESP (200).
- **5 pontos “verificar”** (3 de conteúdo e 2 de citação; nenhum alterado por dúvida): `g3-04`, `g3-06`, `g4-03`, `g2-05` e `g2-04`.
- `python scripts/validar_conteudo.py`: **45 arquivos, 0 erros**.

## 2. Correções aplicadas

| Arquivo | Antes | Depois | Fonte |
|---|---|---|---|
| `conteudo/g2/g2-04.md` | “até **50%** do arrecadado em uma bacia pode ir a outra, com aprovação do CBH.” | “até **50%** do arrecadado em uma bacia pode ir a outra, desde que beneficie a bacia de origem e haja aprovação do CBH.” | Lei 7.663/1991, art. 37, II, “b” (ALESP). |
| `conteudo/g3/g3-05.md` | “informação sobre violação de direitos humanos não pode ser restringida (art. 21).” | “informação sobre violação de direitos humanos praticada por agentes públicos ou a mando de autoridades públicas não pode ser restringida (art. 21, parágrafo único).” | Lei 12.527/2011, art. 21, parágrafo único (Planalto). |
| `conteudo/g4/g4-03.md` | “O art. 4º afasta uso particular, jornalismo, arte, academia, segurança pública e investigação penal.” | “O art. 4º afasta uso particular, jornalismo, arte, academia (com aplicação dos arts. 7º e 11), segurança pública e investigação penal.” | Lei 13.709/2018, art. 4º, II, “b” (Planalto). |
| `conteudo/g2/g2-04.md` | `.../lei-complementar-1413-23.09.2024.html` (404) | `.../lei.complementar-1413-23.09.2024.html` (200) | ALESP — LC 1.413/2024. |
| `conteudo/g2/g2-05.md` | `.../lei-complementar-1413-23.09.2024.html` (404) | `.../lei.complementar-1413-23.09.2024.html` (200) | ALESP — LC 1.413/2024. |
| `conteudo/g2/g2-06.md` | `.../lei-complementar-1413-23.09.2024.html` (404) | `.../lei.complementar-1413-23.09.2024.html` (200) | ALESP — LC 1.413/2024. |
| `conteudo/g3/g3-02.md` | `.../lei-complementar-1413-23.09.2024.html` (404) | `.../lei.complementar-1413-23.09.2024.html` (200) | ALESP — LC 1.413/2024. |
| `conteudo/g3/g3-03.md` | `.../lei-complementar-1413-23.09.2024.html` (404) | `.../lei.complementar-1413-23.09.2024.html` (200) | ALESP — LC 1.413/2024. |
| `conteudo/g3/g3-06.md` | `.../lei-complementar-1413-23.09.2024.html` (404) | `.../lei.complementar-1413-23.09.2024.html` (200) | ALESP — LC 1.413/2024. |

**Detalhe dos links:** a URL correta usa `lei.complementar-1413` (ponto), não `lei-complementar-1413` (hífen).

## 3. Verificar (não alterado)

| Aula | Ponto | Motivo / leitura |
|---|---|---|
| `g3-04` | “Impedimento: ... cônjuge ou parente até 3º grau ... (Lei 9.784/1999, art. 18).” | O art. 18, I, fala em interesse direto ou indireto; o parentesco até 3º grau aparece no art. 18, II, quanto a perito/testemunha/representante. O gabarito da Q2 está correto, mas o comentário confunde as hipóteses. |
| `g3-06` | “presta contas também aos comitês de bacia e ao CRH.” | A LC 1.413, art. 56, fixa envio à SEMIL, à ALESP e ao TCE-SP; a Lei 7.663 trata CBH/CRH como colegiados. Não localizei dever legal de “prestação de contas” aos comitês; a SP Águas presta apoio técnico (LC 1.413, art. 68, VII). |
| `g4-03` | “exige novo consentimento se a finalidade mudar.” | A LGPD, art. 9º, § 2º, exige informação prévia e permite revogação; “novo consentimento” é consequência prática para finalidade incompatível, mas não é a literalidade legal. |
| `g2-05` | “A vinculação é à SEMIL” (citando arts. 1º, 3º e 66). | A afirmação está correta e é confirmada pelo site e pelo Relatório de Atividades 2025 da SP Águas; a LC 1.413, art. 2º, § 2º, remete a decreto. A citação dos arts. 1º/3º/66 não sustenta sozinha o vínculo. |
| `g2-04` | “O que é (arts. 1º a 4º): institui ... o SIGRH.” | O SIGRH é estruturado nos arts. 21 a 30; os arts. 1º a 4º tratam de objetivos, princípios e diretrizes. Imprecisão de citação, sem erro de conteúdo. |

## 4. Links problemáticos

- **6 links da LC 1.413/2024** (`g2-04`, `g2-05`, `g2-06`, `g3-02`, `g3-03`, `g3-06`): a URL com `lei-complementar-1413` retornava **404**; a URL oficial é `lei.complementar-1413` e retorna **200**. Corrigidos.
- **Demais 19 URLs únicas** das 16 aulas: **200** (Planalto, ALESP, SP Águas, ANPD, TCE-SP, `fala.sp.gov.br`), incluindo o PDF do Programa de Integridade da SP Águas.
- **Pendência fora das aulas:** a mesma URL 404 permanece em `pesquisa/base_legislacao.md` (seção 4), `dados/urls_conteudo.txt` e `dados/links_status.txt`. Recomenda-se atualizar esses arquivos de referência; não os editei por estarem fora do escopo das 16 aulas.
- Nenhum link foi considerado “não sustentador” da afirmação, exceto o ponto de `g3-06` acima.

## 5. Veredito por disciplina

| Disciplina | Veredito | Aulas alteradas | Comentário |
|---|---|---|---|
| G2 — gestão e legislação hídrica | **OK com ressalvas** | `g2-04`, `g2-05`, `g2-06` | Uma condição legal do FEHIDRO estava omitida em `g2-04`; três links corrigidos. Competências, prazos, quóruns e instrumentos conferem. |
| G3 — Estado, Direito Administrativo e Ética | **OK com ressalvas** | `g3-02`, `g3-03`, `g3-05`, `g3-06` | Art. 21 da LAI estava superamplo em `g3-05`; três links corrigidos. Distinções descentralização/desconcentração e impedimento/suspeição estão corretas; dois pontos a verificar. |
| G4 — governo digital, segurança e LGPD | **OK com ressalvas** | `g4-03` | Art. 4º da LGPD estava superamplo quanto aos fins acadêmicos; um ponto a verificar sobre consentimento. |

**Total: 8 aulas alteradas, 9 edições (3 de conteúdo + 6 de links).**
