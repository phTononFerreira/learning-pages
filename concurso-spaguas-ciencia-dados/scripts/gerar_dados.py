import json
from pathlib import Path

BASE = Path(__file__).resolve().parents[1]
DADOS = BASE / "dados"

DISCIPLINAS = [
    {
        "id": "g1",
        "slug": "pensamento-analitico",
        "nome": "Pensamento Analítico, Quantitativo e Ciência de Dados",
        "area": "Conhecimentos Gerais",
        "peso_questoes": 5,
        "icone": "chart",
        "descricao": "Diagnóstico de problemas, decisão por evidências, leitura de dados e raciocínio crítico.",
        "modulos": [
            {
                "id": "g1-m1",
                "nome": "Problema, hipótese e decisão",
                "aulas": [
                    ("g1-01", "Diagnóstico de problemas e análise de causa-raiz", "1.1", ["Explicar diagnóstico organizacional", "Aplicar os 5 porquês e Ishikawa", "Evitar confundir sintoma com causa"], 35, 5, 1.0, 5, 3),
                    ("g1-02", "Hipóteses, cenários e decisão baseada em evidências", "1.1, 1.2", ["Formular hipóteses testáveis", "Montar cenários", "Estruturar relatório técnico decisório"], 40, 5, 1.0, 4, 3),
                ],
            },
            {
                "id": "g1-m2",
                "nome": "Data literacy",
                "aulas": [
                    ("g1-03", "Leitura de gráficos, tabelas e matrizes", "1.3", ["Escolher e ler gráficos", "Detectar gráfico enganoso", "Extrair conclusão de tabela"], 40, 5, 1.0, 5, 3),
                    ("g1-04", "Estatística descritiva para decisão", "1.3", ["Calcular média, mediana e moda", "Interpretar percentuais e variações", "Comparar grupos com cautela"], 40, 4, 1.0, 4, 3),
                ],
            },
            {
                "id": "g1-m3",
                "nome": "Raciocínio lógico-crítico",
                "aulas": [
                    ("g1-05", "Dedução, indução, falácias e vieses", "1.4", ["Distinguir dedução e indução", "Avaliar validade de argumento", "Reconhecer falácias e vieses"], 45, 5, 1.0, 5, 4),
                ],
            },
        ],
    },
    {
        "id": "g2",
        "slug": "regulacao-recursos-hidricos",
        "nome": "Gestão, Regulação de Recursos Hídricos e Legislação",
        "area": "Conhecimentos Gerais",
        "peso_questoes": 5,
        "icone": "water",
        "descricao": "PNRH, sistema nacional e paulista, instrumentos de gestão, SP Águas e fiscalização.",
        "modulos": [
            {
                "id": "g2-m1",
                "nome": "Política Nacional de Recursos Hídricos",
                "aulas": [
                    ("g2-01", "Lei 9.433/1997: fundamentos, objetivos e diretrizes", "2.1", ["Memorizar fundamentos e objetivos", "Relacionar diretrizes ao caso concreto", "Diferenciar gestão de recursos hídricos"], 35, 5, 1.0, 5, 3),
                    ("g2-02", "Instrumentos da PNRH: planos, enquadramento, outorga, cobrança e informações", "2.3", ["Listar os instrumentos", "Diferenciar outorga, enquadramento e cobrança", "Aplicar cada instrumento"], 45, 5, 1.0, 5, 4),
                    ("g2-03", "SINGREH e comitês de bacia: quem decide o quê", "2.2", ["Compor o SINGREH", "Distinguir competências", "Explicar gestão participativa"], 40, 5, 1.0, 4, 4),
                ],
            },
            {
                "id": "g2-m2",
                "nome": "Sistema paulista e SP Águas",
                "aulas": [
                    ("g2-04", "Lei 7.663/1991: o sistema paulista de recursos hídricos", "2.1, 2.2", ["Compor o sistema paulista", "Diferenciar CRH, CBH e agências", "Relacionar ao SINGREH"], 45, 5, 1.0, 4, 4),
                    ("g2-05", "SP Águas: autarquia de regime especial, competências e governança", "2.4", ["Explicar a natureza autárquica", "Listar competências da SP Águas", "Diferenciar regulação de fiscalização"], 40, 5, 1.0, 3, 4),
                ],
            },
            {
                "id": "g2-m3",
                "nome": "Regulação e fiscalização",
                "aulas": [
                    ("g2-06", "Regulação, fiscalização e indicadores de desempenho", "2.4", ["Definir regulação e fiscalização", "Construir indicador", "Monitorar metas e metas regulatórias"], 40, 4, 1.0, 4, 3),
                ],
            },
        ],
    },
    {
        "id": "g3",
        "slug": "estado-direito-etica",
        "nome": "Fundamentos do Estado, Direito Administrativo e Ética",
        "area": "Conhecimentos Gerais",
        "peso_questoes": 5,
        "icone": "scale",
        "descricao": "Princípios administrativos, organização do Estado, ética, integridade, LAI e accountability.",
        "modulos": [
            {
                "id": "g3-m1",
                "nome": "Estado e Administração",
                "aulas": [
                    ("g3-01", "Princípios do art. 37 da CF: LIMPE", "3.1", ["Memorizar LIMPE", "Aplicar princípio a caso", "Distinguir eficiência de eficácia"], 35, 5, 1.0, 4, 3),
                    ("g3-02", "Centralização, descentralização e desconcentração", "3.1", ["Diferenciar os três conceitos", "Reconhecer exemplos", "Evitar troca de definições"], 35, 5, 1.0, 4, 4),
                    ("g3-03", "Administração direta e indireta: autarquias e agências", "3.1", ["Diferenciar direta e indireta", "Explicar autarquia", "Explicar agência reguladora"], 40, 5, 1.0, 4, 4),
                ],
            },
            {
                "id": "g3-m2",
                "nome": "Ética e integridade",
                "aulas": [
                    ("g3-04", "Ética, conflito de interesses e integridade", "3.2", ["Aplicar ética no serviço público", "Identificar conflito de interesses", "Relacionar compliance e controle interno"], 45, 4, 1.0, 4, 3),
                ],
            },
            {
                "id": "g3-m3",
                "nome": "Transparência e accountability",
                "aulas": [
                    ("g3-05", "LAI: transparência ativa e passiva", "3.3", ["Diferenciar ativa e passiva", "Memorizar prazos", "Aplicar exceções"], 40, 5, 1.0, 4, 4),
                    ("g3-06", "Accountability e controle social", "3.3", ["Definir accountability", "Relacionar controle interno/externo/social", "Aplicar a agências reguladoras"], 30, 4, 1.0, 3, 3),
                ],
            },
        ],
    },
    {
        "id": "g4",
        "slug": "transformacao-digital",
        "nome": "Transformação e Mentalidade Digital",
        "area": "Conhecimentos Gerais",
        "peso_questoes": 5,
        "icone": "cloud",
        "descricao": "Governo digital, segurança da informação, LGPD e uso ético de dados no setor público.",
        "modulos": [
            {
                "id": "g4-m1",
                "nome": "Governo digital",
                "aulas": [
                    ("g4-01", "Governo digital, desmaterialização e plataformas", "4.1", ["Explicar governo digital", "Relacionar desmaterialização", "Reconhecer canais de atendimento"], 35, 4, 1.0, 4, 2),
                ],
            },
            {
                "id": "g4-m2",
                "nome": "Segurança da informação",
                "aulas": [
                    ("g4-02", "Segurança da informação: CIA, phishing e incidentes", "4.2", ["Memorizar CIA", "Reconhecer phishing", "Aplicar boas práticas"], 40, 5, 1.0, 4, 3),
                ],
            },
            {
                "id": "g4-m3",
                "nome": "LGPD",
                "aulas": [
                    ("g4-03", "LGPD: princípios, bases legais e setor público", "4.3", ["Memorizar princípios", "Distinguir bases legais", "Aplicar ao poder público"], 50, 5, 1.0, 5, 4),
                    ("g4-04", "LGPD na prática: segurança, compartilhamento e direitos", "4.3", ["Aplicar segurança e minimização", "Tratar compartilhamento", "Reconhecer direitos do titular"], 40, 4, 1.0, 4, 4),
                ],
            },
        ],
    },
    {
        "id": "s1",
        "slug": "engenharia-dados-sql",
        "nome": "Engenharia de Dados, Bancos de Dados e SQL",
        "area": "Conhecimentos Específicos",
        "peso_questoes": 14,
        "icone": "database",
        "descricao": "SGBD, modelagem ER, normalização, SQL e ETL — o bloco de maior incidência.",
        "modulos": [
            {
                "id": "s1-m1",
                "nome": "Fundamentos e modelagem",
                "aulas": [
                    ("s1-01", "SGBD, arquitetura e modelo relacional", "1.1", ["Explicar SGBD", "Diferenciar níveis de arquitetura", "Reconhecer chaves e integridade"], 40, 5, 2.0, 5, 3),
                    ("s1-02", "Modelagem ER e transformação para relacional", "1.1", ["Ler notação de Chen", "Definir cardinalidade", "Transformar ER em tabelas"], 50, 5, 2.0, 5, 4),
                    ("s1-03", "Normalização: 1FN, 2FN, 3FN e BCNF", "1.1", ["Identificar dependências", "Classificar forma normal", "Justificar decomposição"], 50, 5, 2.0, 4, 5),
                ],
            },
            {
                "id": "s1-m2",
                "nome": "SQL",
                "aulas": [
                    ("s1-04", "SQL: SELECT, WHERE e ORDER BY", "1.2", ["Montar consulta de seleção", "Filtrar linhas", "Ordenar e limitar"], 45, 5, 2.0, 5, 2),
                    ("s1-05", "SQL: GROUP BY, HAVING e agregações", "1.2", ["Agrupar", "Filtrar grupos", "Diferenciar WHERE e HAVING"], 50, 5, 2.0, 5, 3),
                    ("s1-06", "SQL: JOINs, NULL e subqueries", "1.2", ["Escolher o JOIN correto", "Prever linhas", "Tratar NULL e subqueries"], 60, 5, 2.0, 5, 5),
                ],
            },
            {
                "id": "s1-m3",
                "nome": "Integração de dados",
                "aulas": [
                    ("s1-07", "ETL, qualidade e limpeza de dados", "1.3", ["Explicar ETL", "Aplicar dimensões de qualidade", "Escolher técnica de limpeza"], 45, 5, 2.0, 4, 3),
                ],
            },
        ],
    },
    {
        "id": "s2",
        "slug": "ciencia-de-dados",
        "nome": "Ciência de Dados, Modelagem e Automação",
        "area": "Conhecimentos Específicos",
        "peso_questoes": 14,
        "icone": "code",
        "descricao": "Python, Pandas, estatística descritiva, correlação e machine learning.",
        "modulos": [
            {
                "id": "s2-m1",
                "nome": "Python e Pandas",
                "aulas": [
                    ("s2-01", "Python: lógica, estruturas e funções", "2.1", ["Rastrear código", "Usar listas e dicionários", "Entender funções e escopo"], 45, 5, 2.0, 5, 3),
                    ("s2-02", "Pandas: leitura, inspeção e seleção", "2.1", ["Ler CSV", "Inspecionar DataFrame", "Selecionar colunas e linhas"], 45, 5, 2.0, 5, 3),
                    ("s2-03", "Pandas: filtros, groupby, merge e agregações", "2.1", ["Filtrar com loc/query", "Agrupar e agregar", "Combinar tabelas"], 55, 5, 2.0, 5, 4),
                ],
            },
            {
                "id": "s2-m2",
                "nome": "Estatística descritiva",
                "aulas": [
                    ("s2-04", "Média, mediana e moda: quando cada uma engana", "2.2", ["Calcular as três medidas", "Escolher a medida adequada", "Detectar efeito de outliers"], 40, 5, 2.0, 5, 3),
                    ("s2-05", "Variância, desvio-padrão, coeficiente de variação e boxplot", "2.2", ["Calcular variância e desvio", "Interpretar dispersão", "Comparar coeficiente de variação"], 45, 5, 2.0, 4, 4),
                    ("s2-06", "Correlação linear e análise de tendências", "2.2", ["Interpretar r", "Distinguir correlação de causalidade", "Ler tendência"], 40, 4, 2.0, 4, 4),
                ],
            },
            {
                "id": "s2-m3",
                "nome": "Machine Learning",
                "aulas": [
                    ("s2-07", "Aprendizado supervisionado: classificação e regressão", "2.3", ["Diferenciar classificação e regressão", "Reconhecer algoritmos", "Interpretar saída"], 50, 5, 2.0, 5, 4),
                    ("s2-08", "Não supervisionado, métricas e validação", "2.3", ["Explicar clustering", "Calcular precisão e recall", "Ler matriz de confusão e overfitting"], 55, 5, 2.0, 5, 5),
                ],
            },
        ],
    },
    {
        "id": "s3",
        "slug": "bi-governanca",
        "nome": "Business Intelligence e Governança de Dados",
        "area": "Conhecimentos Específicos",
        "peso_questoes": 9,
        "icone": "dashboard",
        "descricao": "BI, dashboards, ciclo de vida, qualidade, metadados e privacidade de bases públicas.",
        "modulos": [
            {
                "id": "s3-m1",
                "nome": "Business Intelligence",
                "aulas": [
                    ("s3-01", "BI, dashboards e escolha de visual", "3.1", ["Diferenciar BI de DW", "Escolher gráfico", "Montar dashboard decisório"], 45, 5, 2.0, 5, 3),
                ],
            },
            {
                "id": "s3-m2",
                "nome": "Governança de dados",
                "aulas": [
                    ("s3-02", "Ciclo de vida e qualidade de dados", "3.2", ["Descrever o ciclo de vida", "Aplicar dimensões de qualidade", "Priorizar correções"], 45, 5, 2.0, 4, 3),
                    ("s3-03", "Metadados, catálogo e linhagem", "3.2", ["Diferenciar metadados", "Explicar catálogo", "Usar linhagem"], 40, 4, 2.0, 3, 3),
                    ("s3-04", "Segurança e privacidade de bases públicas", "3.2", ["Aplicar minimização", "Definir anonimização", "Compartilhar com segurança"], 40, 4, 2.0, 3, 4),
                ],
            },
        ],
    },
    {
        "id": "s4",
        "slug": "infraestrutura-seguranca",
        "nome": "Infraestrutura de TI, Integração e Segurança",
        "area": "Conhecimentos Específicos",
        "peso_questoes": 13,
        "icone": "server",
        "descricao": "APIs REST, JSON/XML, nuvem, autenticação, backup e governança de TI.",
        "modulos": [
            {
                "id": "s4-m1",
                "nome": "Integração de sistemas",
                "aulas": [
                    ("s4-01", "APIs REST e transferência de dados", "4.1", ["Explicar REST", "Diferenciar métodos HTTP", "Reconhecer status codes"], 40, 5, 2.0, 5, 3),
                    ("s4-02", "JSON e XML", "4.1", ["Ler JSON", "Diferenciar objeto e array", "Comparar JSON e XML"], 35, 5, 2.0, 5, 2),
                ],
            },
            {
                "id": "s4-m2",
                "nome": "Computação em nuvem",
                "aulas": [
                    ("s4-03", "Nuvem: IaaS, PaaS, SaaS e modelos de implantação", "4.2", ["Diferenciar modelos de serviço", "Escolher modelo por cenário", "Diferenciar pública, privada e híbrida"], 45, 5, 2.0, 5, 3),
                ],
            },
            {
                "id": "s4-m3",
                "nome": "Segurança da informação",
                "aulas": [
                    ("s4-04", "Autenticação, controle de acesso, backup e recuperação", "4.3", ["Diferenciar autenticação e autorização", "Aplicar menor privilégio", "Escolher estratégia de backup"], 50, 5, 2.0, 5, 4),
                ],
            },
            {
                "id": "s4-m4",
                "nome": "Governança de TI",
                "aulas": [
                    ("s4-05", "Governança e gerenciamento de serviços de TI", "4.4", ["Diferenciar governança e gestão", "Reconhecer COBIT e ITIL", "Aplicar ao setor público"], 45, 4, 2.0, 4, 3),
                ],
            },
        ],
    },
]


def build():
    curriculo = {
        "versao": "1.0",
        "data": "2026-11-11",
        "concurso": "SP Águas 2026 — Analista de Suporte (TI e Ciência de Dados)",
        "banca": "FGV",
        "prova": "2027-01-31",
        "total_aulas": 0,
        "total_horas_estimadas": 0,
        "disciplinas": [],
    }
    prioridades = []
    for disc in DISCIPLINAS:
        d = {k: v for k, v in disc.items() if k != "modulos"}
        d["modulos"] = []
        for mod in disc["modulos"]:
            m = {"id": mod["id"], "nome": mod["nome"], "aulas": []}
            for (aid, titulo, item, objetivos, minutos, inc, peso, freq, dif) in mod["aulas"]:
                score = round((inc * peso * freq) / dif, 2)
                aula = {
                    "id": aid,
                    "titulo": titulo,
                    "item_edital": item,
                    "objetivos": objetivos,
                    "minutos": minutos,
                }
                m["aulas"].append(aula)
                curriculo["total_aulas"] += 1
                curriculo["total_horas_estimadas"] += minutos
                prioridades.append({
                    "aula_id": aid,
                    "disciplina_id": disc["id"],
                    "disciplina": disc["nome"],
                    "titulo": titulo,
                    "item_edital": item,
                    "incidencia": inc,
                    "peso": peso,
                    "frequencia": freq,
                    "dificuldade": dif,
                    "score_bruto": score,
                    "minutos": minutos,
                })
            d["modulos"].append(m)
        curriculo["disciplinas"].append(d)

    max_score = max(p["score_bruto"] for p in prioridades)
    nucleo_p1 = {
        "s1-01", "s1-02", "s1-04", "s1-05", "s1-06",
        "s2-01", "s2-02", "s2-03", "s2-04", "s2-05", "s2-07", "s2-08",
        "s3-01", "s4-01", "s4-03", "s4-04",
        "g1-03", "g1-05", "g2-01", "g2-02", "g2-04", "g2-05",
        "g3-01", "g3-05", "g4-03",
    }
    nucleo_p3 = {"s1-03", "s3-03", "s4-05", "g3-06"}
    risco_alto = {"g2", "g3", "g4"}
    for p in prioridades:
        p["score"] = round(100 * p["score_bruto"] / max_score, 1)
        p["risco_eliminacao"] = "alto" if p["disciplina_id"] in risco_alto else "medio"
        p["nucleo"] = p["aula_id"] in nucleo_p1
        if p["aula_id"] in nucleo_p1:
            p["faixa"] = "P1"
            p["acao"] = "Núcleo: dominar até acertar questões de prova; revisar toda semana."
        elif p["aula_id"] in nucleo_p3:
            p["faixa"] = "P3"
            p["acao"] = "Complementar: estudar uma vez e revisar na véspera."
        else:
            p["faixa"] = "P2"
            p["acao"] = "Dominar conceito e diferenças; revisar a cada 15 dias."
    prioridades.sort(key=lambda x: ({"P1": 0, "P2": 1, "P3": 2}[x["faixa"]], -x["score"], x["aula_id"]))

    curriculo["total_horas_estimadas"] = round(curriculo["total_horas_estimadas"] / 60, 1)
    (DADOS / "curriculo.json").write_text(json.dumps(curriculo, ensure_ascii=False, indent=2), encoding="utf-8")
    (DADOS / "prioridades.json").write_text(json.dumps({
        "versao": "1.0",
        "data": "2026-11-11",
        "formula": "score = (incidencia x peso x frequencia) / dificuldade; normalizado para 100",
        "criterios": {
            "incidencia": "1-5, presença estimada no edital e em provas FGV",
            "peso": "2.0 específicas; 1.0 gerais",
            "frequencia": "1-5, recorrência histórica em provas FGV de TI/dados",
            "dificuldade": "1-5, custo de aprendizado (maior = mais difícil)",
        },
        "total": len(prioridades),
        "aulas": prioridades,
    }, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"OK: {curriculo['total_aulas']} aulas, {curriculo['total_horas_estimadas']}h")
    print("P1:", sum(1 for p in prioridades if p["faixa"] == "P1"), "P2:", sum(1 for p in prioridades if p["faixa"] == "P2"), "P3:", sum(1 for p in prioridades if p["faixa"] == "P3"))


if __name__ == "__main__":
    build()
