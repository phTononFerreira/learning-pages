# Resumo — Nuvem: IaaS, PaaS, SaaS e modelos de implantação

> quanto mais alto o modelo de serviço, menos o cliente gerencia — mas a responsabilidade sobre dados, identidades e configuração nunca sai do cliente.

## 1. Essencial

O **NIST SP 800-145** define computação em nuvem por cinco características essenciais: **autosserviço sob demanda**, **amplo acesso por rede**, **pool de recursos**, **elasticidade rápida** e **serviço medido**.

**Modelos de serviço** (do menor para o maior nível de abstração):

- **IaaS** (Infrastructure as a Service): o provedor entrega máquina virtual, rede, armazenamento e virtualização. O cliente gerencia **sistema operacional, middleware, runtime, aplicação e dados**. Exemplos: EC2, Azure VM, Compute Engine; uso típico: *lift-and-shift* e legado.
- **PaaS** (Platform as a Service): o provedor gerencia infraestrutura, SO e runtime. O cliente cuida da **aplicação, dos dados e da configuração**. Exemplos: App Service, App Engine, Elastic Beanstalk; uso: publicar sem administrar servidor.
- **SaaS** (Software as a Service): o provedor entrega o software pronto. O cliente usa, configura parâmetros e gerencia **usuários, acessos e seus dados**. Exemplos: Microsoft 365, Google Workspace, Salesforce.

**Modelos de implantação:**

- **Pública** — infraestrutura do provedor, compartilhada entre clientes (multi-tenant), acessada pela internet.
- **Privada** — infraestrutura dedicada a uma organização, própria ou hospedada.
- **Híbrida** — combinação de públicas e privadas, com portabilidade e orquestração entre elas.
- **Comunitária** — compartilhada por organizações com interesses comuns (o NIST também a lista).

**Nuvem híbrida não é multicloud.** Multicloud é usar mais de um provedor de nuvem (público ou privado), sem exigir integração; híbrida exige integração e mobilidade entre ambientes.

**Responsabilidade compartilhada:** o provedor é responsável pela **segurança da nuvem** (instalações, hardware, rede física, virtualização); o cliente, pela **segurança na nuvem** (dados, identidades, acessos, configuração). No IaaS a fatia do cliente é maior; no SaaS, menor — mas dados, usuários e permissões continuam do cliente. “O provedor é certificado, logo estou em conformidade” é falso.

**No setor público:** SaaS para e-mail e atendimento; PaaS para sistemas próprios; IaaS para legado; privada/híbrida para dados sensíveis e LGPD. Avaliar **residência dos dados**, **lock-in**, **SLA** e **plano de saída**.

## 2. Quadro comparativo

| Modelo | Provedor gerencia | Cliente gerencia | Exemplo |
|---|---|---|---|
| On-premises | nada | tudo | datacenter próprio |
| IaaS | virtualização, rede, storage | SO, runtime, app, dados | EC2, Azure VM |
| PaaS | SO, runtime, middleware | app, dados, configuração | App Service, App Engine |
| SaaS | aplicação inteira | usuários, acesso, dados | Microsoft 365 |

## 3. Pegadinha de prova

A FGV troca os modelos: diz que no **PaaS** o cliente gerencia o sistema operacional (falso) ou que no **IaaS** o provedor gerencia a aplicação (também falso). No **SaaS**, a armadilha é afirmar que o cliente “não tem responsabilidade alguma”: dados, identidades e configuração continuam sob sua responsabilidade. Também confunde **híbrida** com **multicloud**.

## 4. Macete

**“IaaS: eu administro o SO. PaaS: eu só subo o código. SaaS: eu só uso. Em todos, o dado é meu.”**

**Revisar:** D+1, D+7, D+30.
