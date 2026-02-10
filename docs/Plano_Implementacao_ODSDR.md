# Plano de Implementacao ODSDR (Checklist Executavel)

## Base de requisitos
- Fonte principal: `docs/Doenças Respiratórias.md`
- Complemento de contexto: `docs/ODSDR_Descricao_Projeto.md`

## Objetivo
Evoluir a ontologia ODSDR para uma base semantica validada, inferivel e integrada ao fluxo de consultas SPARQL.

## Status do projeto
- [x] Estrutura inicial criada (`ontology/`, `data/`, `queries/`, `scripts/`)
- [x] Ontologia base criada em `ontology/odsdr.ttl`
- [x] Casos iniciais criados em `data/casos_iniciais.ttl`
- [x] Queries iniciais criadas em `queries/*.rq`
- [x] Script de execucao criado em `scripts/load_and_query.py`
- [x] Ambiente Python preparado (`.venv` + `requirements.txt`)

## Checklist executavel por fase

### Fase 1 - Consolidacao semantica
- [x] F1.1 Decidir nomenclatura final para propriedades de tratamento (`doencaRecebeTratamento` e `pacienteRecebeTratamento`)
- [x] F1.2 Aplicar padrao final de nomenclatura em `ontology/odsdr.ttl`
- [x] F1.3 Adicionar `rdfs:label` em PT-BR para classes nucleares
- [x] F1.4 Adicionar `rdfs:comment` para propriedades nucleares
- [x] F1.5 Revisar `rdfs:domain` e `rdfs:range` de todas as propriedades objetais
- [x] F1.6 Revisar disjuncoes entre classes clinicas principais
- [x] F1.7 Validar consistencia no reasoner (HermiT ou Pellet)
- [x] F1.8 Registrar resultado da validacao em `docs/Plano_Fase_1_ODSDR.md`

Criterio de conclusao da fase:
- [x] Ontologia consistente no reasoner sem incoerencias

### Fase 2 - Inferencia clinica
- [x] F2.1 Definir padroes de inferencia para Asma, Bronquite, Pneumonia e COVID19
- [x] F2.2 Criar classes inferiveis para os quatro cenarios
- [x] F2.3 Validar classificacao de individuos com dados de `data/casos_iniciais.ttl`
- [x] F2.4 Avaliar e documentar necessidade de SWRL
- [x] F2.5 Registrar resultado da fase em `docs/Plano_Fase_2_ODSDR.md`

Criterio de conclusao da fase:
- [x] Minimo de 4 classes de caso provavel classificadas por inferencia

### Fase 3 - Qualidade de dados
- [ ] F3.1 Definir perfil minimo de dados obrigatorios por entidade (`Paciente`, `Exame`, `Diagnostico`)
- [ ] F3.2 Implementar shapes SHACL para validacao desses perfis
- [ ] F3.3 Criar conjunto de testes positivo e negativo
- [ ] F3.4 Gerar relatorio de conformidade

Criterio de conclusao da fase:
- [ ] Suite SHACL executavel com relatorio versionado em `docs/`

### Fase 4 - Consultas e cobertura funcional
- [ ] F4.1 Definir catalogo de perguntas de competencia
- [ ] F4.2 Implementar no minimo 10 queries SPARQL
- [ ] F4.3 Documentar resultado esperado por query
- [ ] F4.4 Padronizar saida de `scripts/load_and_query.py` para formato tabular ou JSON

Criterio de conclusao da fase:
- [ ] Minimo de 10 queries validadas com resultado esperado documentado

### Fase 5 - Integracao com aplicacao
- [ ] F5.1 Criar camada de servico para ingestao de casos clinicos
- [ ] F5.2 Expor consultas semanticas para consumo externo (API ou interface)
- [ ] F5.3 Definir estrategia de versionamento da ontologia (`1.0`, `1.1`, `2.0`)
- [ ] F5.4 Documentar fluxo de carga, consulta e exportacao ponta a ponta

Criterio de conclusao da fase:
- [ ] Pipeline reproduzivel de carga, consulta e exportacao

## Backlog tecnico prioritario
- [ ] B1 Adicionar testes automatizados para queries SPARQL
- [ ] B2 Criar workflow de CI para validacao de TTL e execucao de queries
- [ ] B3 Documentar convencao de IRI e padrao de individuos
- [ ] B4 Planejar interoperabilidade com SNOMED CT e ICD

## Comandos operacionais
```bash
python3 -m venv .venv
.venv/bin/python -m pip install -r requirements.txt
.venv/bin/python scripts/load_and_query.py
```
