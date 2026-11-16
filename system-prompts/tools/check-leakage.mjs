/* Verifica vazamento exato entre casos de demonstração e o golden set.
   Falha (exit 1) se uma utterance aparece nos dois lugares. */
import fs from 'node:fs';

const read = (p) => fs.readFileSync(p, 'utf8');
const data = read('assets/data/intents.js');
const rows = JSON.parse(data.match(/window\.SP_DATA = (\{[\s\S]*?\});\r?\n/)[1]).rows;
const cases = JSON.parse(data.match(/window\.SP_CASES = (\[[\s\S]*?\]);\r?\n/)[1]);

const norm = (s) =>
  s
    .toLowerCase()
    .replace(/[“”"']/g, '')
    .replace(/\s+/g, ' ')
    .replace(/[.!?]+$/g, '')
    .trim();

const gold = new Map(rows.map((r) => [norm(r.text), r.id]));
const found = [];

for (const c of cases) {
  const hit = gold.get(norm(c.text));
  if (hit) found.push({ source: 'SP_CASES', id: hit, text: c.text });
}

const p02 = read('assets/pages/02.js');
for (const m of p02.matchAll(/text:\s*'([^']+)'/g)) {
  const hit = gold.get(norm(m[1]));
  if (hit) found.push({ source: '02-intencoes.js', id: hit, text: m[1] });
}

const p05 = read('content/05-fewshot.html');
for (const m of p05.matchAll(/>"([^"<>]{5,120})"<\/span>/g)) {
  const hit = gold.get(norm(m[1]));
  if (hit) found.push({ source: '05-fewshot.html', id: hit, text: m[1] });
}

const p11 = read('content/11-caso.html');
for (const m of p11.matchAll(/^User:\s*(.+)$/gm)) {
  const hit = gold.get(norm(m[1]));
  if (hit) found.push({ source: '11-caso.html prompt', id: hit, text: m[1] });
}
const intentsBlock = p11.slice(p11.indexOf('&lt;intents&gt;'), p11.indexOf('&lt;/intents&gt;'));
for (const m of intentsBlock.matchAll(/"([^"]{2,80})"/g)) {
  const hit = gold.get(norm(m[1]));
  if (hit) found.push({ source: '11-caso.html intents', id: hit, text: m[1] });
}

if (found.length) {
  console.error('✗ vazamento de casos de demonstração no golden set:');
  for (const f of found) console.error(`  ${f.source} → row ${f.id}: ${f.text}`);
  process.exit(1);
}
console.log('✓ leakage check: nenhuma utterance de demonstração está no golden set');
