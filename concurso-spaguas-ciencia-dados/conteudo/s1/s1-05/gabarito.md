# Gabarito — SQL: GROUP BY, HAVING e agregações

## Q1 — C

`COUNT(*)` conta as 6 linhas, independentemente de NULL. `COUNT(vazao)` conta apenas os 4 valores preenchidos. A alternativa A ignora o efeito do NULL; a B inverte os papéis. Não há erro: funções de agregação aceitam colunas com NULL e simplesmente os descartam.

## Q2 — B

`AVG` ignora o NULL e divide a soma (30) pela quantidade de valores não nulos (2), resultando em 15. A alternativa A dividiria por 3, incluindo o NULL no denominador — comportamento de `SUM(valor)/COUNT(*)`, não de `AVG`. A C é a soma; D confunde “ignora NULL” com “retorna NULL”.

## Q3 — E

O filtro de status é de linha, então vai no WHERE; as duas condições de grupo vão no HAVING. A alternativa A coloca agregação no WHERE e não compila. B é inválida no SQL padrão (status não está no GROUP BY); em dialetos permissivos, filtra depois de agrupar e conta inativos. C usa AVG no WHERE. D troca média por soma, que não responde ao comando.

## Flashcards

- WHERE × HAVING? — WHERE filtra linhas antes do agrupamento; HAVING filtra grupos depois.
- COUNT(*) × COUNT(coluna)? — COUNT(*) conta todas as linhas; COUNT(coluna) ignora NULL.
- AVG ignora NULL? — Sim; divide a soma pela quantidade de valores não nulos.
