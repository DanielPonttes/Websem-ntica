# Plano da Fase 2 ODSDR (Inferencia Clinica)

## Objetivo da fase
Expandir a capacidade de inferencia clinica da ontologia para os cenarios de Asma, Bronquite, Pneumonia e COVID19.

## Escopo da fase
- Arquivo principal: `ontology/odsdr.ttl`
- Dados de apoio: `data/casos_iniciais.ttl`
- Validacao funcional: `queries/*.rq` e `scripts/load_and_query.py`
- Validacao semantica: reasoner Pellet via `owlready2` com Java local em `.local/java25`
- Registro de evidencias: este documento

## Checklist executavel da Fase 2
- [x] F2.1 Definir padroes de inferencia para Asma, Bronquite, Pneumonia e COVID19
- [x] F2.2 Criar classes inferiveis para os quatro cenarios em `ontology/odsdr.ttl`
- [x] F2.3 Validar classificacao de individuos com dados de `data/casos_iniciais.ttl`
- [x] F2.4 Avaliar e documentar necessidade de SWRL
- [x] F2.5 Registrar resultado da fase e aprovacao final

## Plano operacional
1. Consolidar padroes de inferencia
Definir, por doenca, o conjunto minimo de sintomas/exames/fatores de risco para classificacao.

2. Implementar TBox inferivel
Adicionar/ajustar classes inferiveis no `ontology/odsdr.ttl` para os quatro cenarios.

3. Preparar dados de validacao
Garantir que `data/casos_iniciais.ttl` tenha individuos suficientes para testar todos os cenarios.

4. Executar inferencia
Rodar reasoner Pellet (via `owlready2`) com Java local `.local/java25` e coletar evidencias de classificacao.

5. Revalidar consultas funcionais
Executar `.venv/bin/python scripts/load_and_query.py` para garantir ausencia de regressao funcional.

6. Encerrar fase
Registrar resultados, decisoes e status final neste documento.

## Criterio de aceite da Fase 2
- Pelo menos 4 classes de caso provavel modeladas (uma por doenca alvo).
- Classificacoes inferidas validadas no reasoner para os casos de teste.
- Decisao sobre uso (ou nao) de SWRL registrada.
- Queries existentes continuam funcionais apos os ajustes.

## Registro de execucao
Data de inicio: 2026-02-10
Status atual: Concluida
Responsavel: Projeto ODSDR
Observacoes: executar esta fase em conjunto com `docs/Plano_Implementacao_ODSDR.md`.

### Log de execucao - 2026-02-10
- Implementacao F2.1 e F2.2:
  - Padroes definidos e modelados com `owl:hasValue` para os quatro cenarios:
    - `CasoProvavelPneumonia`: `Tosse` + `Febre` + `RaioXTorax`
    - `CasoProvavelAsma`: `FaltaDeAr` + `ChiadoNoPeito` + `Espirometria`
    - `CasoProvavelBronquite`: `Tosse` + `ChiadoNoPeito` + `Espirometria`
    - `CasoProvavelCOVID19`: `Tosse` + `Febre` + `PCR`
  - Classes adicionadas/ajustadas em `ontology/odsdr.ttl`.
- Implementacao de dados para cobertura:
  - Caso de bronquite adicionado em `data/casos_iniciais.ttl`:
    - `PacienteLuiza`
    - `DiagnosticoLuiza`
- Validacao F2.3:
  - Reasoner Pellet executado com sucesso via `owlready2` + Java local em `.local/java25`.
  - Classificacoes inferidas:
    - `CasoProvavelPneumonia`: `PacienteJoao`
    - `CasoProvavelAsma`: `PacienteMaria`
    - `CasoProvavelBronquite`: `PacienteLuiza`
    - `CasoProvavelCOVID19`: `PacienteCarlos`
- Validacao funcional sem regressao:
  - `scripts/load_and_query.py` executado com sucesso apos as alteracoes.
- Decisao F2.4 (SWRL):
  - SWRL nao necessario nesta fase.
  - Justificativa: OWL 2 DL com restricoes `owl:hasValue` cobriu os padroes de inferencia previstos para os cenarios atuais.

### Encerramento da fase - 2026-02-10
- Resultado final: aprovado.
- Criterio de aceite: atendido.
