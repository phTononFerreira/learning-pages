# learning-pages

Publicação estática dos sites do repositório privado [`learning`](https://github.com/phTononFerreira/learning).

- **Landing:** https://phTononFerreira.github.io/learning-pages/
- **SYS/PRM:** https://phTononFerreira.github.io/learning-pages/system-prompts/
- **SP Águas 2026:** https://phTononFerreira.github.io/learning-pages/concurso-spaguas-ciencia-dados/

## O que tem aqui

| Pasta | Origem | Conteúdo |
|---|---|---|
| `system-prompts/` | `learning/system-prompts/` | Curso de system prompts, 13 páginas + hub + resumão |
| `concurso-spaguas-ciencia-dados/` | `learning/concurso-spaguas-ciencia-dados/` | Plataforma do concurso SP Águas 2026 |

Os sites são estáticos: HTML, CSS e JavaScript puro, sem backend e sem CDN. O progresso fica no `localStorage` do navegador.

## Publicação

O GitHub Pages deste repositório serve a branch `main`, na raiz (`/`). O `learning` continua privado; este repositório existe apenas para publicar os sites.

Para atualizar:

1. Regenere os sites no repositório `learning` (`node build.mjs` e `python scripts/build_site.py`).
2. Copie as pastas `system-prompts/` e `concurso-spaguas-ciencia-dados/` para cá.
3. Commit e push em `main`.

> Conteúdo sintético/didático. Nenhum dado real de cliente ou credencial vive neste repositório.
