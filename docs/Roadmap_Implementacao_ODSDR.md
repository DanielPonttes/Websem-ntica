# Roadmap de Implementacao Ontologica ODSDR

## Fonte de verdade utilizada
- `docs/Doenças Respiratórias.md` (principal)
- `docs/ODSDR_Descricao_Projeto.md`

## Decisao tecnica
- Modelo: OWL 2 DL
- Serializacao principal: Turtle (`.ttl`)
- Justificativa: melhor legibilidade, versionamento simples e compatibilidade total com Protégé, reasoners OWL e SPARQL.

## Objetivo da implementacao
Construir uma ontologia para diagnostico semantico de doencas respiratorias com foco em:
- representacao de entidades clinicas;
- inferencia de diagnosticos provaveis;
- base extensivel para integracao com IA e RAG clinico.

## Etapas de implementacao
1. Congelar vocabulário do dominio
- Consolidar classes: `Doenca`, `Paciente`, `ProfissionalSaude`, `Diagnostico`, `Sintoma`, `Tratamento`, `Medicamento`, `Exame`, `Causa`, `Anatomia`, `FatorRisco`.
- Normalizar nomes de propriedades para evitar ambiguidade (`possui`, `recebe`).

2. Definir base da ontologia
- Usar IRI base unica para ontologia ODSDR.
- Manter arquivo OWL/Turtle principal em `ontology/odsdr.ttl`.
- Manter `Doencas-respiratorias.rdf` apenas como artefato legado/exportavel.

3. Modelar TBox (esquema)
- Declarar classes, hierarquias e disjuncoes principais.
- Definir propriedades objetais com dominio/range.
- Definir propriedades de dados minimas para pacientes, diagnosticos e exames.

4. Modelar relacoes clinicas
- Doenca: `provoca`, `possuiCausa`, `aflige`, `diagnosticadaPor`, `doencaRecebeTratamento`, `detectadaPor`, `ataca`, `facilitadaPor`.
- Paciente: `apresenta`, `atendidoPor`, `recebeDiagnostico`, `pacienteRecebeTratamento`, `realiza`, `possuiFatorRisco`.
- ProfissionalSaude: `defineDiagnostico`, `analisaSintoma`, `prescreveTratamento`, `solicitaExame`.
- Diagnostico: `geraTratamento`, `geradoApartirDe`.
- Complementares: `aliviadoPor`, `examina`, `predispoe`, `aumentaRiscoPara`.

5. Popular ABox inicial
- Cobrir escopo inicial: `Asma`, `Bronquite`, `Pneumonia`, `COVID19`.
- Criar individuos de sintomas, exames, tratamentos, fatores de risco e anatomia.
- Criar casos ficticios de pacientes/profissionais para testes.

6. Implementar inferencia
- Criar classes inferiveis para casos provaveis (ex.: `CasoProvavelPneumonia`).
- Executar reasoner (HermiT/Pellet) para classificar individuos automaticamente.

7. Validar com consultas
- Criar consultas SPARQL de perguntas de competencia.
- Validar consistencia e cobertura de relacoes.

8. Integrar com pipeline tecnico
- Scripts Python com RDFLib/Owlready2 para carga e consulta.
- Estrutura separada entre ontologia, dados, queries e scripts.

## Estrutura de pastas definida
```text
docs/
  ODSDR_Descricao_Projeto.md
  Plano_Implementacao_ODSDR.md
  Plano_Fase_1_ODSDR.md
  Plano_Fase_2_ODSDR.md
  Roadmap_Implementacao_ODSDR.md
ontology/
  odsdr.ttl
data/
  casos_iniciais.ttl
queries/
  01_pacientes_com_perfil_pneumonia.rq
  02_diagnosticos_e_tratamentos.rq
  03_doencas_por_fator_risco.rq
scripts/
  load_and_query.py
requirements.txt
.venv/
.local/
```

## Status atual da implementacao
- Concluido: roadmap e definicao de arquitetura de pastas.
- Concluido: ontologia base em Turtle (`ontology/odsdr.ttl`) com:
  - classes principais;
  - propriedades objetais e de dados;
  - individuos iniciais (doencas, sintomas, exames, tratamentos, fatores de risco, anatomia e causas);
  - classe inferivel inicial (`CasoProvavelPneumonia`).
- Concluido: consolidacao semantica da Fase 1 (nomenclatura, labels/comments, dominios/ranges e disjuncoes).
- Concluido: inferencia clinica da Fase 2 com quatro classes de caso provavel validadas no reasoner.
- Concluido: dados de exemplo em `data/casos_iniciais.ttl`.
- Concluido: consultas SPARQL em `queries/*.rq`.
- Concluido: script de carga/consulta em `scripts/load_and_query.py`.
- Concluido: ambiente Python com virtualenv local (`.venv`) e dependencias `rdflib` e `owlready2` em `requirements.txt`.
- Concluido: Java local em `.local/java25` para execucao do reasoner sem dependencia de Java global.

## Execucao local
1. Criar ambiente virtual:
```bash
python3 -m venv .venv
```

2. Instalar dependencias:
```bash
.venv/bin/python -m pip install -r requirements.txt
```

3. Executar consultas:
```bash
.venv/bin/python scripts/load_and_query.py
```

4. Alternativa ativando o ambiente:
```bash
source .venv/bin/activate
python scripts/load_and_query.py
```

## Resultado de validacao inicial
- A carga da ontologia e dos dados executou com sucesso.
- As 3 consultas SPARQL retornaram resultados esperados:
  - perfil de pneumonia;
  - diagnosticos e tratamentos por paciente;
  - doencas relacionadas a fatores de risco.
- A validacao de reasoner (Pellet via Owlready2) executou com sucesso:
  - sem incoerencias detectadas na execucao;
  - inferencia de `PacienteJoao` como `CasoProvavelPneumonia`.

## Criterios de aceite
1. Ontologia consistente no reasoner OWL.
2. Relacoes do documento principal representadas na modelagem.
3. Consultas SPARQL respondendo cenarios clinicos essenciais.
4. Casos de teste com inferencias basicas de diagnostico provavel.
5. Estrutura pronta para extensao e integracao futura.
