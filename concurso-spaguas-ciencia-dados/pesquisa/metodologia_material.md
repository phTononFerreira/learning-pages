# Metodologia do material — o que a evidência sustenta

> Objetivo: material compacto para um engenheiro de software com ~2h/dia até 31/01/2027, que precisa **lembrar e acertar questões**, não virar enciclopédia.
> Coleta: 11/11/2026. Critério: revisões sistemáticas, meta-análises e instituições de ensino.

## 1. Princípios, por retorno sobre o tempo

| Princípio | Evidência | Como entra no material |
|---|---|---|
| **Prática de recuperação** (responder de memória) | Roediger & Karpicke (2006): após 7 dias, 61% de recordação com teste vs. 40% com releitura. Dunlosky et al. (2013): utilidade **alta** | 3 questões por aula + 1 "folha em branco" no fim. Questão antes do texto também funciona (pré-teste) |
| **Prática distribuída** | Cepeda et al. (2006): 317 experimentos; intervalo ótimo ≈ 10–20% do intervalo de retenção. Cepeda et al. (2008): ~20–40% para 1 semana; 5–10% para 1 ano. Dunlosky: alta | Agenda D+1 / D+7 / D+30 impressa no fim de cada aula |
| **Intercalação** (misturar tipos de problema) | Rohrer & Taylor (2007), Rohrer et al. (2015): superior à prática em blocos em testes adiados. Dunlosky: moderada | Sessão de questões mistura subtópicos da mesma disciplina; simulado mistura tudo |
| **Exemplos resolvidos** | Sweller et al. (2019): novatos aprendem mais estudando exemplos do que resolvendo antes de ter esquema | 1 exemplo resolvido por conceito difícil (SQL, cálculo de métrica), depois problema |
| **Autoexplicação** | Bisra et al. (2018): meta-análise, g ≈ 0,55 | Campo "explique com suas palavras por que isso acontece" a cada 2 aulas |
| **Interrogação elaborativa** | Dunlosky: moderada; responder "por quê?" e "como se aplica aqui?" | Pergunta de aplicação à regulação/SP Águas em toda aula |
| **Dupla codificação** | Mayer: princípios de coerência, sinalização, segmentação e contiguidade | Tabela/quadro comparativo vale mais que texto; imagem só se explicar algo |
| **Microlearning** | Revisões recentes: efeito positivo, mas heterogêneo e com acompanhamento curto | Aulas de 30–45 min, 1 conceito por aula |

## 2. O que evitar

- **Releitura e grifo** como método principal: utilidade baixa (Dunlosky et al., 2013) — você reconhece, não recupera.
- **Resumo como método principal**: baixa utilidade (Dunlosky et al., 2013). O one-pager só rende se for **produzido de memória depois do teste**; consultar a folha durante o estudo cria dependência (evidência mista em *crib sheets*).
- **"Estilo de aprendizagem"** (visual/auditivo/cinestésico): Pashler et al. (2008) não encontraram evidência de que ensinar no estilo preferido melhora o resultado. Use o formato que o conteúdo pede.
- **Excesso de texto, imagem decorativa, videoaula longa em 2x**: aumentam carga extrínseca e reduzem atenção.
- **Só exemplos resolvidos**: após certo domínio, o efeito se inverte (reversão por expertise). Alterne exemplo → problema.
- **Maratona na véspera**: melhora a nota imediata e piora a retenção em 30 dias.
- **Flashcard de tudo**: card só nasce de erro ou de fato cobrado no edital.

## 3. Estrutura recomendada de aula compacta (45 min)

| Bloco | Tempo | Saída |
|---|---|---|
| 1. Pré-teste | 3 min | 3 perguntas antes de qualquer explicação |
| 2. Ideia central | 2 min | 1 frase: o que o candidato deve saber fazer |
| 3. Essencial | 10 min | 5–8 bullets + 1 exemplo resolvido |
| 4. Quadro comparativo | 5 min | Tabela de 3–7 linhas (quando o conteúdo for comparável) |
| 5. Prática | 12 min | 3 questões (fácil/média/difícil), gabarito comentado |
| 6. Recuperação ativa | 5 min | Folha em branco: reescrever a ideia central e 3 bullets |
| 7. Flashcards | 3 min | 3 cards, feitos a partir dos erros |
| 8. Agenda | 5 min | Datas D+1, D+7, D+30 + 2 fontes |

**Regra de ouro:** 50–60% do tempo em recuperação (questões, recall, explicação), 40–50% em entrada (ler, ver exemplo).

## 4. Tamanhos-alvo

| Item | Alvo |
|---|---|
| Aula completa | 600–900 palavras (leitura de 4–6 min) |
| "Essencial" | 250–350 palavras; 5–8 bullets; ≤ 60 palavras por bullet |
| Tabela | ≤ 7 linhas × 4 colunas |
| Questão | enunciado ≤ 60 palavras; alternativas ≤ 20 palavras |
| Gabarito comentado | 40–80 palavras: por que a certa é certa e a errada é errada |
| Flashcard | frente ≤ 15 palavras; verso ≤ 40 palavras |
| One-pager de disciplina | 1 página A4, 150–250 palavras + 1 quadro |
| Simulado | 20 questões em 30 min (ritmo da prova: 70 em 4h ≈ 17,5/h) |

**Cobertura:** 70–90 aulas de 45 min cobrem o edital (~55–65h). Das ~160h até 31/01/2027, ~95h ficam para questões e simulados.

## 5. Cadência de revisão

| Momento | Tempo | O que fazer |
|---|---|---|
| **D+0** | 5 min | Fechar a aula com recall em folha branca |
| **D+1** | 10 min | 3 flashcards + 2 questões da aula anterior, sem consultar |
| **D+7** | 15 min | 5 questões intercaladas + reescrever o quadro comparativo |
| **D+30** | 20 min | Bloco de 10 questões misturadas + correção no caderno de erros |
| **D+60 / D−7** | 30 min | Simulado só dos subtópicos que erraram |

Base: intervalos crescentes (Cepeda et al., 2006; 2008). Se o desempenho em D+7 for < 60%, antecipe a revisão para D+3.

**Expansão:** 2 acertos seguidos dobram o intervalo; erro volta um passo.

## 6. Como integrar questões, flashcards e simulados

1. **Questões são o eixo.** Cada aula termina com 3; cada semana tem 20–30 intercaladas; cada erro vira item do caderno (erro → causa → regra).
2. **Flashcards vêm depois.** Só fatos que você errou ou que o edital cobra literalmente (prazos, competências, siglas). 1 card = 1 fato. Sem card ambíguo.
3. **Simulados a partir da semana 6.** Um por semana, 20 questões/30 min; dois completos em D−14 e D−7, às 8h.
4. **Intercale na hora de testar, não na hora de explicar.** A aula é organizada; o teste é embaralhado.
5. **Feedback imediato e curto.** Marcar certo/errado sem explicar não corrige o erro; parágrafo de 2 linhas basta.

## 7. Fontes

- Roediger & Karpicke (2006), *Test-Enhanced Learning* — https://pubmed.ncbi.nlm.nih.gov/16507066/
- Dunlosky et al. (2013), *Improving Students' Learning* — https://journals.sagepub.com/doi/10.1177/1529100612453266
- Cepeda et al. (2006), *Distributed Practice in Verbal Recall Tasks* — https://pubmed.ncbi.nlm.nih.gov/16719566/
- Cepeda et al. (2008), *Spacing Effects in Learning* — https://pubmed.ncbi.nlm.nih.gov/19076480/
- Rohrer & Taylor (2007), *The shuffling of mathematics problems improves learning* — https://doi.org/10.1007/s11251-007-9015-8
- Rohrer, Dedrick & Stershic (2015), *Interleaved Practice Improves Mathematics Learning* — https://eric.ed.gov/?id=ED557355
- Sweller, van Merriënboer & Paas (2019), *Cognitive Architecture and Instructional Design: 20 Years Later* — https://link.springer.com/article/10.1007/s10648-019-09465-5
- CESE NSW, *Cognitive Load Theory* — https://education.nsw.gov.au/content/dam/main-education/about-us/educational-data/cese/2017-cognitive-load-theory.pdf
- Rosenshine (2012), *Principles of Instruction* — https://www.aft.org/sites/default/files/Rosenshine.pdf
- Bisra et al. (2018), *Inducing Self-Explanation: a Meta-Analysis* — https://doi.org/10.1007/s10648-018-9434-x
- Mayer, *Multimedia Learning* — https://www.jsu.edu/online/faculty/MULTIMEDIA%20LEARNING%20by%20Richard%20E.%20Mayer.pdf
- Pashler et al. (2008), *Learning Styles: Concepts and Evidence* — https://bjorklab.psych.ucla.edu/wp-content/uploads/sites/13/2016/07/Pashler_McDaniel_Rohrer_Bjork_2009_PSPI.pdf
- Monib et al. (2025), *Microlearning beyond boundaries* — https://pmc.ncbi.nlm.nih.gov/articles/PMC11774797/
- Whitehouse et al. (2025), *Crib sheets, bem-estar e desempenho* (evidência mista) — https://research-portal.uu.nl/en/publications/implications-of-crib-sheets-for-student-well-being-and-exam-perfo/
- Deans for Impact, *The Science of Learning* — https://catalyst.cg.catholic.edu.au/wp-content/uploads/2024/09/Science-of-Learning_Deans-for-Impact.pdf
- The Learning Scientists, pôsteres das 6 estratégias — https://www.learningscientists.org/posters
