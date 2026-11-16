# Exercícios — Autenticação, controle de acesso, backup e recuperação

## Q1 (fácil)

O RPO define:

A) a perda máxima de dados aceitável, medida em tempo
B) o tempo máximo de indisponibilidade do serviço
C) o volume máximo de usuários simultâneos
D) o número mínimo de cópias de backup
E) o tempo necessário para restaurar o sistema

## Q2 (média)

Há backup completo no domingo e incrementais de segunda a sábado. Para restaurar o sistema ao estado da sexta-feira, o que é necessário?

A) Apenas o incremental de sexta
B) O completo de domingo e o incremental de sexta
C) Apenas o diferencial de sexta
D) Dois backups completos
E) O completo de domingo e todos os incrementais até sexta

## Q3 (difícil)

Uma organização mantém cópias diárias no mesmo storage, com a mesma credencial de administrador, e nunca testou a restauração. Qual é o diagnóstico?

A) A estratégia atende à regra 3-2-1
B) O RTO está garantido pela frequência diária
C) A estratégia falha em 3-2-1, concentra risco de perda total e não comprova a recuperação
D) Basta criptografar os backups para resolver o problema
E) O único problema é o RPO, que deveria ser zero

