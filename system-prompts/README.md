# SYS/PRM — System prompts: do palpite ao contrato

Curso curto e interativo (13 páginas, ~95 min) sobre engenharia de system prompts para nós de classificação e orquestração no Amazon Bedrock, usando o caso de um classificador de 7 intenções com Nova Lite 1.0.

**Abra `index.html` no navegador.** Não precisa de servidor, build ou internet: CSS, JS, dados e ícones são locais.

**Online:** [phTononFerreira.github.io/learning-pages/system-prompts](https://phTononFerreira.github.io/learning-pages/system-prompts/) — a mesma versão, sem instalação.

## Trilhas

- **Essencial (45 min):** 01, 02, 03, 06, 08, 11.
- **Completa (95 min):** todas as 13 páginas, incluindo few-shot, temperatura, loop, DSPy/GEPA, injection e custo.

## Estrutura

```
index.html                 hub gerado
resumao.html               resumão animado (12 slides, 7 min)
01-diagnostico.html ...    páginas geradas
content/                   fragmentos editáveis de cada página
assets/site.css            design system (monocromático + accent, 1px, 0 radius)
assets/app.js              navegação, quiz, progresso, tema, utilidades
assets/data/intents.js     dataset didático de 150 casos + 12 casos de teste cego
assets/pages/*.js          lógica das interações
assets/icons.svg           sprite de ícones
build.mjs                  gera os HTML a partir de content/ + site.config.mjs
tools/gen-data.mjs         regenera o dataset (determinístico)
tools/check-leakage.mjs    falha se um caso de demonstração entrar no golden set
```

## Rebuild

Requer Node 18+.

```bash
node build.mjs          # gera os 14 HTML e roda o leakage check
node tools/gen-data.mjs # regenera assets/data/intents.js (opcional)
```

O build é determinístico e não tem dependências.

## Honestidade

- O dataset é **sintético e didático**. As predições v1–v4 são autorais; nenhuma chamada ao Bedrock foi feita.
- O Nova Lite 1.0 não tem structured outputs nativos. O caso usa label plano + validação no código.
- `temperature=0` é greedy, não determinístico.
- Preços e limites são referência de nov/2026. Confirme na AWS antes de orçar.
- O Nova 2 Lite é o sucessor de custo/latência, mas o model card não lista Flows nem structured outputs nativos; a migração exige chamar InvokeModel/Converse fora do Flow.

## Design

Papel `#FFFFFF`, tinta `#111111`, cinzas neutros e accent `#E4572E`; bordas de 1px, zero border-radius, ícones SVG de 1.5px. Tema escuro em preto puro (`#0A0A0A`), progresso em `localStorage`, navegação por teclado e `prefers-reduced-motion`.
