# learning-pages

Publicação estática dos sites do repositório privado [`learning`](https://github.com/phTononFerreira/learning).

- **Hub:** https://phTononFerreira.github.io/learning-pages/
- **SYS/PRM:** https://phTononFerreira.github.io/learning-pages/system-prompts/
- **SP Águas 2026:** https://phTononFerreira.github.io/learning-pages/concurso-spaguas-ciencia-dados/

## O que tem aqui

| Caminho | Origem | Conteúdo |
|---|---|---|
| `index.html` | mantido neste repositório | Hub com o design system dos sites: dois cards, acesso rápido e tema claro/escuro |
| `system-prompts/` | `learning/system-prompts/` | Curso de system prompts: 13 páginas + hub + resumão |
| `concurso-spaguas-ciencia-dados/` | `learning/concurso-spaguas-ciencia-dados/` | Plataforma do concurso SP Águas 2026: 8 cargos, 45 aulas, 135 questões, 135 flashcards, 15 simulados e 2 cadernos |

Os sites são estáticos: HTML, CSS e JavaScript puro, sem backend e sem CDN. O progresso fica no `localStorage` do navegador.

## Publicação

O GitHub Pages deste repositório serve a branch `main`, na raiz (`/`). O `learning` continua privado; este repositório existe apenas para publicar os sites.

Para atualizar:

1. Regenere os sites no repositório `learning` (`node build.mjs` e `python scripts/build_site.py`).
2. Espelhe as pastas para cá, por exemplo:

   ```bash
   robocopy ..\learning\concurso-spaguas-ciencia-dados .\concurso-spaguas-ciencia-dados /MIR /XD __pycache__ .venv
   robocopy ..\learning\system-prompts .\system-prompts /MIR
   ```

3. Commit e push em `main`. O Pages publica sozinho em cerca de um minuto.

O `index.html` do hub é editado só aqui — ele não vem de um build do `learning`.

> Conteúdo sintético/didático. Nenhum dado real de cliente ou credencial vive neste repositório.
