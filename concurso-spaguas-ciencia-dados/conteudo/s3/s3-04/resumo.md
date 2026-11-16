# Resumo — Segurança e privacidade de bases públicas

> dado público não é dado aberto; publicar exige minimização, anonimização real e avaliação de risco de reidentificação.

## 1. Essencial

**Dado público** é o produzido ou custodiado pelo Estado; **dado aberto** é o público disponibilizado com formato aberto, legível por máquina e sem restrição de uso. Transparência não autoriza expor dado pessoal: a **LAI** protege informações pessoais e a **LGPD** disciplina o tratamento.

**Princípios (LGPD, art. 6º), entre eles:** finalidade, adequação, **necessidade (minimização)**, transparência, segurança, prevenção e responsabilização. No poder público, a base costuma ser execução de políticas públicas, obrigação legal ou interesse público; **consentimento é exceção**.

**Minimização:** coletar e publicar apenas o necessário para a finalidade. Técnicas:

- **Supressão** de identificadores diretos (nome, CPF, endereço).
- **Generalização** (faixa de idade, município em vez de endereço).
- **Agregação** (totais por bacia, sem nível individual).
- **Mascaramento/tokenização** — úteis, mas nem sempre irreversíveis.

**Anonimização** (art. 5º, XI) torna impossível associar o dado a um titular por meios razoáveis; o dado deixa de ser pessoal (art. 12), salvo reversão por meios próprios ou esforços razoáveis. **Pseudonimização** (art. 13, §4º) remove a associação direta, mas permite reidentificação com informação adicional separada; continua pessoal.

**Risco de reidentificação:** combinar **quase-identificadores** — CEP, data de nascimento, sexo, faixa de renda — pode individualizar alguém mesmo sem nome. Por isso, remover o CPF não basta.

**Compartilhamento:** o poder público pode compartilhar dados para finalidade específica e interesse público (arts. 26 e 27), com registro, base legal e controle de acesso. A ANPD pode determinar **relatório de impacto à proteção de dados (RIPD)** (art. 38), sem condicionar o pedido a alto risco; a regulamentação e as boas práticas recomendam RIPD preventivo para tratamentos de alto risco. Convênios devem definir quem trata, para quê, por quanto tempo e com quais salvaguardas.

**Segurança:** confidencialidade, integridade e disponibilidade, mais autenticidade e não repúdio; criptografia em repouso e trânsito, autenticação forte, menor privilégio e backup testado.

**Descarte:** encerrados finalidade e prazo legal, o dado deve ser eliminado ou anonimizado, com registro; guardar por precaução viola necessidade.

## 2. Quadro comparativo

| Conceito | Identificação direta | Reversível? | Natureza |
|---|---|---|---|
| Anonimização | removida | não, por meios razoáveis | deixa de ser dado pessoal |
| Pseudonimização | substituída por código | sim, com informação adicional | continua dado pessoal |
| Mascaramento | parcial | depende da técnica | normalmente pessoal |
| Agregação | eliminada no nível individual | baixa, se grupos grandes | pode ser dado pessoal |

## 3. Pegadinha de prova

A FGV trata **anonimização** e **pseudonimização** como sinônimos, e “dado público” como “dado aberto”. Anonimização é irreversível por meios razoáveis; pseudonimização é reversível com a informação separada. Também é falsa a ideia de que consentimento é a regra no setor público, de que criptografar anonimiza e de que remover nome e CPF elimina o risco. Anonimizar não é apagar a coluna; é avaliar o conjunto.

## 4. Macete

**“Público não é aberto; aberto não é pessoal; sem nome não é anônimo.”**

**Revisar:** D+1, D+7, D+30.
