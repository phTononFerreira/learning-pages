# Exercícios — Ciclo de vida e qualidade de dados

## Q1 (fácil)

Em uma base de outorgas, 12% dos registros estão sem a data de início. Qual dimensão de qualidade está comprometida?

A) Unicidade
B) Completude
C) Consistência
D) Tempestividade
E) Acurácia

## Q2 (média)

O cadastro A registra a mesma outorga com área de 12 ha; o cadastro B, com 15 ha. Ambos foram atualizados ontem. Qual dimensão é violada?

A) Completude
B) Tempestividade
C) Validade
D) Consistência
E) Unicidade

## Q3 (difícil)

Um relatório chega com CPF duplicado, município grafado de duas formas e vazão em branco. O analista propõe corrigir tudo diretamente no dashboard. Qual conduta é mais adequada?

A) Corrigir no dashboard, pois é mais rápido e não altera a base
B) Criar regra no ETL e manter o erro na origem, para preservar o histórico
C) Atuar na origem com validação no cadastro, regras e monitoramento, corrigindo o legado de forma controlada
D) Excluir todos os registros incompletos para garantir a qualidade
E) Contratar uma ferramenta de BI, que resolve a qualidade automaticamente

