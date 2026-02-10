# Plano da Fase 4 ODSDR (Consultas e Cobertura Funcional)

## Objetivo da fase
Expandir a cobertura funcional de consultas SPARQL e padronizar saida para consumo humano e programatico.

## Escopo da fase
- Consultas SPARQL: `queries/*.rq`
- Script de execucao: `scripts/load_and_query.py`
- Catalogo de perguntas de competencia: `docs/Catalogo_Consultas_Fase_4.md`
- Registro de evidencias: este documento

## Checklist executavel da Fase 4
- [x] F4.1 Definir catalogo de perguntas de competencia
- [x] F4.2 Implementar no minimo 10 queries SPARQL
- [x] F4.3 Documentar resultado esperado por query
- [x] F4.4 Padronizar saida de `scripts/load_and_query.py` para formato tabular ou JSON
- [x] F4.5 Registrar resultado da fase e aprovacao final

## Plano operacional
1. Definir perguntas de competencia
Mapear perguntas de negocio para consultas SPARQL.

2. Expandir acervo de queries
Adicionar consultas para cobrir diagnostico, risco, exame, sintoma, tratamento e profissional.

3. Padronizar saida
Atualizar script de execucao para suportar `--format table` e `--format json`.

4. Validar consultas
Executar todas as queries no dataset atual e checar resultados.

5. Encerrar fase
Documentar evidencias e aprovar fase.

## Criterio de aceite da Fase 4
- Minimo de 10 consultas SPARQL implementadas.
- Catalogo de perguntas de competencia documentado.
- Resultado esperado por query documentado.
- Script com saida tabular e JSON funcionando.

## Registro de execucao
Data de inicio: 2026-02-10
Status atual: Concluida
Responsavel: Projeto ODSDR
Observacoes: executar esta fase em conjunto com `docs/Plano_Implementacao_ODSDR.md`.

### Log de execucao - 2026-02-10
- Implementacao F4.1:
  - Catalogo documentado em `docs/Catalogo_Consultas_Fase_4.md`.
- Implementacao F4.2:
  - Queries expandidas para 10 arquivos:
    - `01_pacientes_com_perfil_pneumonia.rq`
    - `02_diagnosticos_e_tratamentos.rq`
    - `03_doencas_por_fator_risco.rq`
    - `04_pacientes_por_doenca_diagnosticada.rq`
    - `05_exames_por_doenca.rq`
    - `06_profissionais_e_diagnosticos.rq`
    - `07_pacientes_por_exame_realizado.rq`
    - `08_pacientes_por_fator_risco.rq`
    - `09_sintomas_por_doenca.rq`
    - `10_tratamentos_por_doenca.rq`
- Implementacao F4.3:
  - Resultado esperado por query documentado no catalogo.
- Implementacao F4.4:
  - `scripts/load_and_query.py` atualizado com:
    - `--format table` (padrao)
    - `--format json`
    - compactacao de IRIs para prefixo `odsdr:`
- Validacao final:
  - Execucao em `table` e `json` concluida com sucesso para as 10 queries.

### Encerramento da fase - 2026-02-10
- Resultado final: aprovado.
- Criterio de aceite: atendido.
