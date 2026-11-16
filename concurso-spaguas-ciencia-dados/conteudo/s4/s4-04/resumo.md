# Resumo — Autenticação, controle de acesso, backup e recuperação

> autenticação prova quem é; autorização define o que pode; backup só vale se a restauração for testada.

## 1. Essencial

**Autenticação** verifica a identidade — algo que você **sabe** (senha), **tem** (token, celular) ou **é** (biometria). **Autorização** decide o que a identidade pode fazer. **MFA** combina dois fatores de categorias diferentes; duas senhas não são MFA.

**Controle de acesso:** **menor privilégio** (só o necessário para a função), **necessidade de conhecer**, **segregação de funções** (quem solicita não aprova) e revisão periódica de permissões. **RBAC** liga permissões a papéis; **ABAC** decide por atributos (órgão, região, horário).

**Credenciais:** não compartilhar, não gravar em código, usar cofre, rotacionar e revogar no desligamento. Senhas usam **hash + salt**, não criptografia reversível.

**OAuth 2.0 x OIDC:** OAuth 2.0 delega **autorização** (access token e escopos) e não autentica o usuário; **OIDC** acrescenta a identidade, com **ID token** JWT e endpoint UserInfo. Access token não é prova de identidade.

**PKI:** a infraestrutura de chaves públicas usa ACs, certificados e cadeia de confiança para vincular chave e identidade; a ICP-Brasil é a PKI oficial brasileira. TLS e assinatura digital dependem dessa cadeia.

**Criptografia:** TLS em trânsito; disco, banco ou objeto em repouso. Protege confidencialidade, não disponibilidade, e não substitui backup.

**Backup:**

- **Completo (full)** — copia tudo. Mais lento e maior; restauração mais simples.
- **Incremental** — copia o que mudou desde o **último backup de qualquer tipo**. Rápido e pequeno; restauração exige o full e **todos** os incrementais na ordem.
- **Diferencial** — copia o que mudou desde o **último completo**. Cresce a cada dia; restauração exige o full e **o último diferencial**.

**Exemplo resolvido:** full no domingo e incrementais de segunda a sexta restauram a sexta; com diferenciais, bastariam o full e o diferencial de sexta.

**RPO** (Recovery Point Objective) é a perda máxima de dados aceitável, medida em tempo — define a frequência do backup. **RTO** (Recovery Time Objective) é o tempo máximo aceitável de indisponibilidade — define a velocidade da restauração.

**Regra 3-2-1:** três cópias, em duas mídias ou tipos diferentes, com uma fora do site. A variação **3-2-1-1-0** acrescenta cópia imutável/offline e zero erros de verificação; testar a restauração é o que prova que o backup existe.

**HA x DR:** alta disponibilidade mantém o serviço no ar com redundância, balanceamento e *failover* (ativo-ativo ou ativo-passivo), com foco em **RTO** curto; recuperação de desastre (DR) restaura a operação em outro site após evento grave, com foco no **RPO/RTO** do negócio. HA não substitui backup nem DR.

## 2. Quadro comparativo

| Backup | Copia desde | Restauração |
|---|---|---|
| Completo | tudo | o próprio full |
| Incremental | último backup de qualquer tipo | full + todos os incrementais |
| Diferencial | último completo | full + último diferencial |

## 3. Pegadinha de prova

A FGV troca **RPO por RTO**: RPO é perda de dados; RTO é tempo de parada. Também confunde **incremental** (desde o último backup) com **diferencial** (desde o último completo) e afirma que “backup completo diário dispensa teste”. Outra armadilha é dizer que **MFA** são duas senhas, que **criptografia** garante disponibilidade e que **hash** é criptografia reversível.

## 4. Macete

**“RPO = quanto dado posso perder; RTO = quanto tempo posso ficar fora. Incremental soma todos; diferencial pega o último.”**

**Revisar:** D+1, D+7, D+30.
