# Plano de Implementacao ODSDR

## Base de requisitos
- Fonte principal: `docs/Doenças Respiratórias.md`
- Complemento de contexto: `docs/ODSDR_Descricao_Projeto.md`

## Objetivo
Evoluir a ontologia ODSDR para um baseline valido para inferencia, consultas SPARQL e integracao com pipeline de dados clinicos.

## Entregas ja concluidas
1. Estrutura de projeto criada (`ontology/`, `data/`, `queries/`, `scripts/`).
2. Ontologia base em `ontology/odsdr.ttl` com classes, propriedades e individuos iniciais.
3. Casos de exemplo em `data/casos_iniciais.ttl`.
4. Consultas de validacao em `queries/*.rq`.
5. Script de execucao em `scripts/load_and_query.py`.
6. Ambiente Python local com `requirements.txt`.

## Plano de implementacao por fases

### Fase 1 - Consolidacao semantica (curto prazo)
1. Revisar nomenclatura final de propriedades (`recebeTratamento` vs `pacienteRecebeTratamento`).
2. Adicionar `rdfs:label` e `rdfs:comment` para classes/propriedades nucleares.
3. Validar disjuncoes e dominio/range no reasoner (HermiT ou Pellet).

Criterio de saida:
- Ontologia consistente no reasoner sem incoerencias.

### Fase 2 - Inferencia clinica (curto/medio prazo)
1. Expandir classes inferiveis (alem de `CasoProvavelPneumonia`).
2. Definir padroes para Asma, Bronquite e COVID19.
3. Avaliar necessidade de SWRL para regras que OWL puro nao cobre.

Criterio de saida:
- Pelo menos 4 classes de caso provavel classificadas por inferencia.

### Fase 3 - Qualidade de dados (medio prazo)
1. Introduzir validacoes SHACL para entradas de pacientes, exames e diagnosticos.
2. Definir perfil minimo de dados obrigatorios por entidade.
3. Criar conjunto de dados de teste positivo/negativo.

Criterio de saida:
- Suite de validacao com relatorio de conformidade.

### Fase 4 - Consultas e cobertura funcional (medio prazo)
1. Ampliar perguntas de competencia para cenarios clinicos-chave.
2. Criar catalogo de queries SPARQL por objetivo (triagem, risco, tratamento).
3. Padronizar saida do script para formato tabular ou JSON.

Criterio de saida:
- Minimo de 10 queries com resultados esperados documentados.

### Fase 5 - Integracao com aplicacao (medio/longo prazo)
1. Criar camada de servico para ingestao de casos (Python + RDFLib/Owlready2).
2. Preparar interface de consulta para RAG clinico.
3. Definir estrategia de versionamento da ontologia (1.0, 1.1, 2.0).

Criterio de saida:
- Pipeline reproduzivel de carga, consulta e exportacao.

## Backlog tecnico prioritario
1. Adicionar testes automatizados para queries SPARQL.
2. Criar workflow de CI para validar sintaxe TTL e execucao das queries.
3. Documentar convencao de IRIs e padrao de nomes de individuos.
4. Criar mapeamento futuro para interoperabilidade com SNOMED CT/ICD.

## Comandos operacionais
```bash
python3 -m venv .venv
.venv/bin/python -m pip install -r requirements.txt
.venv/bin/python scripts/load_and_query.py
```
