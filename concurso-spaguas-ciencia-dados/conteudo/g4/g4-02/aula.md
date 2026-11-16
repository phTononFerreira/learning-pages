---
id: g4-02
titulo: "Segurança da informação: CIA, phishing e incidentes"
disciplina: g4
modulo: g4-m2
item_edital: "4.2"
tempo: 40
nivel: essencial
---

# Segurança da informação: CIA, phishing e incidentes

> **Ideia central:** segurança da informação protege confidencialidade, integridade e disponibilidade; o elo mais explorado continua sendo a pessoa, via engenharia social.

## 1. Essencial

- **Tríade CIA**: confidencialidade = só o autorizado acessa; integridade = o dado não é alterado; disponibilidade = dado e serviço estão acessíveis quando necessários.
- **Falhas separadas**: portal fora do ar é falha de disponibilidade; medição de vazão adulterada é falha de integridade; cadastro vazado é falha de confidencialidade. Ransomware atinge a disponibilidade e pode atingir a confidencialidade.
- **Engenharia social**: manipula pessoas para obter informação ou acesso. Explora autoridade, urgência, medo, curiosidade e confiança; não depende de falha técnica.
- **Phishing**: mensagem falsa que imita remetente confiável para roubar credenciais, dados ou instalar malware. Sinais: urgência, saudação genérica, domínio estranho, anexo inesperado, pedido de senha ou código MFA. Variantes: spear phishing (alvo certo), vishing (voz) e smishing (SMS).
- **Resposta a incidentes**: preparar, detectar, conter, erradicar, recuperar e aprender. Preserve logs e evidências; não apague tudo nem desligue sem plano. Se houver dado pessoal com risco relevante, avalie comunicar a ANPD e o titular (LGPD, art. 48).
- **Marco Civil (Lei 12.965/2014):** fixa direitos e deveres no uso da internet — neutralidade de rede, proteção da privacidade e dos dados pessoais e liberdade de expressão. Em regra, a guarda e a disponibilização de registros de acesso só podem ser exigidas por ordem judicial, com sigilo.
- **Boas práticas**: MFA em todas as contas; senhas longas e únicas com gerenciador; atualização de sistemas; menor privilégio e necessidade de conhecer; backup testado e guardado offline; criptografia de dados sensíveis; bloquear a tela; reportar mensagem suspeita.
- **Verificação fora do canal**: pedido de senha, código MFA, pagamento ou dado pessoal se confirma por telefone ou portal oficial, nunca pelo próprio e-mail ou link recebido.
- **Cultura**: segurança é processo, não produto. O servidor é um controle: reportar cedo reduz o dano; esconder o incidente agrava.

## 2. Quadro comparativo

| Pilar | Garante | Falha típica | Exemplo na SP Águas |
|---|---|---|---|
| Confidencialidade | acesso só por autorizado | vazamento de cadastro | dados de outorgados expostos |
| Integridade | dado correto e completo | alteração de medição | série de vazão adulterada |
| Disponibilidade | acesso quando necessário | indisponibilidade | portal de outorga fora do ar |

## 3. Pegadinha de prova

A banca troca os pilares: site lento é disponibilidade, dado alterado é integridade, dado exposto é confidencialidade. Também chama phishing de “ataque técnico ao servidor” — é engenharia social, e o alvo é a pessoa. Por fim, cuidado com “desligar imediatamente”: sem preservar evidências, a resposta fica incompleta.

## 4. Macete

**“CIA: quem vê (C), o que está escrito (I), se está no ar (D).”**

## Fontes

- [Lei 13.709/2018 — LGPD](https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm)
- [Lei 12.965/2014 — Marco Civil da Internet](https://www.planalto.gov.br/ccivil_03/_ato2011-2014/2014/lei/l12965.htm)
- [ANPD — site oficial](https://www.gov.br/anpd/pt-br)
- [SP Águas — LGPD](https://www.spaguas.sp.gov.br/site/lgpd/)
