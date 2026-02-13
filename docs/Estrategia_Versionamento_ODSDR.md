# Estrategia de Versionamento ODSDR

## Objetivo
Definir uma politica previsivel de versionamento para ontologia, API e artefatos de dados do projeto ODSDR.

## Modelo adotado
- Padrao: Semantic Versioning (`MAJOR.MINOR.PATCH`)
- Exemplos: `1.0.0`, `1.1.0`, `2.0.0`

## Regras para versao da ontologia
1. `MAJOR`:
- Mudancas que quebram compatibilidade semantica.
- Exemplos:
  - remocao/renomeacao de classes ou propriedades ja publicadas;
  - mudancas de dominio/range que invalidam dados existentes.

2. `MINOR`:
- Adicoes retrocompativeis de conhecimento.
- Exemplos:
  - novas classes/propriedades;
  - novas regras inferiveis;
  - novos individuos de referencia.

3. `PATCH`:
- Ajustes sem impacto de contrato.
- Exemplos:
  - correcoes de labels/comments;
  - correcoes de typos;
  - ajustes documentais.

## Linha evolutiva atual (historico)
- `1.0.0`: baseline inicial (classes/propriedades/instancias base)
- `1.1.0`: consolidacao semantica da Fase 1
- `1.2.0`: expansao de inferencia clinica da Fase 2
- `1.3.0` (proxima versao sugerida): consolidacao de artefatos de Fase 3 e Fase 4 no release de ontologia/projeto
- `2.0.0` (reservado): alteracoes que quebrem contratos de dados/consultas

## Versionamento da API semantica
- API com versao propria em endpoint base (sugestao): `/api/v1/...`
- Mudancas de payload:
  - retrocompativeis -> `MINOR`
  - quebrando contrato -> `MAJOR`
  - correcao interna sem impacto externo -> `PATCH`

## Versionamento de dados
- `data/casos_iniciais.ttl`: baseline de referencia.
- `data/cases_ingestao.ttl`: dados operacionais de ingestao.
- Recomendacao:
  - snapshots datados para auditoria (`data/snapshots/YYYYMMDD/*.ttl`);
  - manter log de mudancas de ingestao por lote.

## Versionamento de consultas
- Queries versionadas por arquivo (`queries/NN_nome.rq`).
- Mudanca de semanticas da query:
  - manter novo arquivo ou novo numero para evitar quebra silenciosa.

## Convencao de IRI e nomes
- Namespace base: `http://www.semanticweb.org/daniel-pontes/ontologies/2025/9/respiratory-diseases-ontology/`
- Prefixo usado no projeto: `odsdr:`
- Padrao de classes:
  - `PascalCase` sem acentos (ex.: `Paciente`, `ProfissionalSaude`, `FatorRisco`)
- Padrao de propriedades:
  - `camelCase` sem acentos (ex.: `recebeDiagnostico`, `doencaRecebeTratamento`)
- Padrao de individuos de dominio:
  - `PascalCase` sem acentos (ex.: `Pneumonia`, `RaioXTorax`, `Tabagismo`)
- Padrao de individuos de caso:
  - prefixo semantico + identificador (ex.: `PacienteJoao`, `DiagnosticoMaria`, `PacienteApi001`)

## Checklist para publicar nova versao
1. Validar reasoner (Pellet/HermiT).
2. Validar SHACL.
3. Validar pacote de queries.
4. Atualizar `owl:versionInfo` em `ontology/odsdr.ttl`.
5. Registrar changelog no plano da fase correspondente.
