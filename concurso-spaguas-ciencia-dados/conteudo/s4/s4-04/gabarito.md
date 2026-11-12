# Gabarito — Autenticação, controle de acesso, backup e recuperação

## Q1 — A

RPO é o ponto de recuperação aceitável: quanto dado a organização admite perder, o que orienta a frequência do backup. RTO é o tempo de indisponibilidade; número de cópias é decisão de estratégia; usuários simultâneos não definem recuperação. RPO e RTO orientam decisões distintas de continuidade.

## Q2 — E

O incremental contém apenas o que mudou desde o último backup de qualquer tipo; por isso, a restauração exige o full e a cadeia completa de incrementais na ordem. O diferencial é que permitiria usar só o full e o último diferencial.

## Q3 — C

3-2-1 exige três cópias, duas mídias e uma fora do site; cópias no mesmo storage e com a mesma credencial caem juntas em ransomware ou falha. Sem teste de restauração, não há evidência de que o backup funcione. Criptografia não corrige concentração nem ausência de teste.

## Flashcards

- RPO ou RTO? — RPO = perda de dados; RTO = tempo de parada.
- Incremental ou diferencial? — Incremental = desde o último backup; diferencial = desde o último completo.
- O que a regra 3-2-1 exige? — Três cópias, duas mídias, uma fora do site.
