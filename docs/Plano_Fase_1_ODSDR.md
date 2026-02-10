# Plano da Fase 1 ODSDR (Consolidacao Semantica)

## Objetivo da fase
Consolidar o modelo semantico da ontologia, eliminando ambiguidades de nomenclatura e garantindo consistencia logica no reasoner.

## Escopo da fase
- Arquivo principal: `ontology/odsdr.ttl`
- Validacao de apoio: `scripts/load_and_query.py` e `queries/*.rq`
- Registro de evidencias: este documento

## Checklist executavel da Fase 1
- [x] F1.1 Fechar decisao de nomenclatura para propriedades duplicadas de tratamento
- [x] F1.2 Aplicar renomeacao e alinhamento semantico no `ontology/odsdr.ttl`
- [x] F1.3 Padronizar labels (`rdfs:label`) das classes nucleares em PT-BR
- [x] F1.4 Adicionar comentarios (`rdfs:comment`) para classes e propriedades nucleares
- [x] F1.5 Revisar e corrigir dominios/ranges de propriedades objetais
- [x] F1.6 Revisar e corrigir disjuncoes entre classes clinicas principais
- [x] F1.7 Executar reasoner (HermiT ou Pellet) e confirmar ausencia de incoerencias
- [x] F1.8 Validar queries SPARQL apos ajustes semanticos
- [x] F1.9 Registrar resultado final e aprovacao da fase

## Plano operacional
1. Preparar ambiente e baseline
Comando: `.venv/bin/python scripts/load_and_query.py`
Evidencia esperada: queries executam sem erro.

2. Padronizar ontologia no nivel TBox
Arquivo alvo: `ontology/odsdr.ttl`
Resultado esperado: nomenclatura coerente e metadados semanticos minimos (`label` e `comment`).

3. Validar consistencia logica
Ferramenta: Protégé + HermiT/Pellet
Resultado esperado: ontologia consistente.

4. Revalidar comportamento funcional
Comando: `.venv/bin/python scripts/load_and_query.py`
Resultado esperado: queries retornam resultados coerentes com os dados de exemplo.

5. Encerrar fase e registrar
Atualizar este arquivo com:
- data da validacao;
- decisoes tomadas;
- evidencias de consistencia.

## Criterio de aceite da Fase 1
- Ontologia sem incoerencias no reasoner.
- Sem propriedades redundantes ou ambiguas para tratamento.
- Classes e propriedades nucleares documentadas com `rdfs:label` e `rdfs:comment`.
- Queries existentes continuam funcionais apos a consolidacao.

## Registro de execucao
Data de inicio: 2026-02-10
Status atual: Concluida
Responsavel: Projeto ODSDR
Observacoes: executar este plano em conjunto com `docs/Plano_Implementacao_ODSDR.md`.

### Log de execucao - 2026-02-10
- Decisao F1.1:
  - Propriedades finais de tratamento definidas como `doencaRecebeTratamento` (dominio `Doenca`) e `pacienteRecebeTratamento` (dominio `Paciente`).
- Implementacao F1.2:
  - Ontologia atualizada em `ontology/odsdr.ttl`.
  - Ajuste de modelagem em `CasoProvavelPneumonia`: trocado `someValuesFrom` por `owl:hasValue` com individuos.
- Implementacao F1.3 e F1.4:
  - `rdfs:label` e `rdfs:comment` adicionados para classes e propriedades nucleares.
- Implementacao F1.5:
  - Dominios e ranges revisados para propriedades objetais.
- Implementacao F1.6:
  - Disjuncoes reforcadas com `owl:AllDisjointClasses` para classes clinicas principais.
- Implementacao F1.8:
  - Validacao funcional executada com `.venv/bin/python scripts/load_and_query.py`.
  - Resultado: 3 queries SPARQL executadas com sucesso e resultados esperados.
- Resolucao do bloqueio F1.7:
  - Java local instalado em `.local/java25`.
  - Reasoner Pellet executado com sucesso via `owlready2` usando Java local.
  - Evidencia: classificacao de `PacienteJoao` em `CasoProvavelPneumonia`.

### Encerramento da fase - 2026-02-10
- Resultado final: aprovado.
- Consistencia no reasoner: validada sem incoerencias detectadas na execucao.
- Criterio de aceite: atendido.
