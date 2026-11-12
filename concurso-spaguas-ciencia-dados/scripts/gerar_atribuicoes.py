import json
from pathlib import Path

c = json.load(open('dados/curriculo.json', encoding='utf-8'))
groups = {'P1': ['g1'], 'P2': ['g2'], 'P3': ['g3'], 'P4': ['g4'], 'P5': ['s1'], 'P6': ['s2'], 'P7': ['s3', 's4']}
lines = ['# Atribuições de conteúdo (45 aulas)\n']
for g, ids in groups.items():
    lines.append(f'\n## {g}\n')
    for d in c['disciplinas']:
        if d['id'] not in ids:
            continue
        lines.append(f"### {d['nome']} (`{d['id']}`)\n")
        for m in d['modulos']:
            lines.append(f"**{m['nome']}**\n")
            for a in m['aulas']:
                lines.append(f"- `{a['id']}` — {a['titulo']} | item {a['item_edital']} | {a['minutos']} min | objetivos: {'; '.join(a['objetivos'])}\n")
Path('conteudo/_ATRIBUICOES.md').write_text(''.join(lines), encoding='utf-8')
print('ok')
