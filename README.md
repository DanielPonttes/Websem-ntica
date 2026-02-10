# ODSDR - Ontologia para Diagnostico Semantico de Doencas Respiratorias

Projeto de modelagem ontologica em OWL 2 DL (serializacao Turtle) para suporte a diagnostico semantico de doencas respiratorias.

## Estrutura do projeto
```text
docs/
  Doenças Respiratórias.md
  ODSDR_Descricao_Projeto.md
  Roadmap_Implementacao_ODSDR.md
  Plano_Implementacao_ODSDR.md
  Plano_Fase_1_ODSDR.md
  Plano_Fase_2_ODSDR.md
  Plano_Fase_3_ODSDR.md
  Plano_Fase_4_ODSDR.md
  Catalogo_Consultas_Fase_4.md
  Relatorio_Fase_3_SHACL.md
ontology/
  odsdr.ttl
data/
  casos_iniciais.ttl
  validation/
    positivo_shacl.ttl
    negativo_shacl.ttl
shacl/
  odsdr_shapes.ttl
queries/
  01_pacientes_com_perfil_pneumonia.rq
  02_diagnosticos_e_tratamentos.rq
  03_doencas_por_fator_risco.rq
scripts/
  load_and_query.py
  validate_shacl.py
requirements.txt
```

## Pre-requisitos
- Python 3.10+
- Java global nao obrigatorio (foi utilizado Java local em `.local/java25` para validacao de reasoner)

## Configuracao local
```bash
python3 -m venv .venv
.venv/bin/python -m pip install -r requirements.txt
```

## Execucao
```bash
.venv/bin/python scripts/load_and_query.py
```

Formatos de saida:
```bash
.venv/bin/python scripts/load_and_query.py --format table
.venv/bin/python scripts/load_and_query.py --format json
```

## Validacao SHACL (Fase 3)
```bash
.venv/bin/python scripts/validate_shacl.py
```

Artefatos gerados/validados:
- Shapes: `shacl/odsdr_shapes.ttl`
- Datasets: `data/validation/positivo_shacl.ttl` e `data/validation/negativo_shacl.ttl`
- Relatorio: `docs/Relatorio_Fase_3_SHACL.md`

## Validacao de reasoner (Fase 1 e Fase 2)
- Reasoner utilizado: Pellet (via Owlready2)
- Runtime Java utilizado: OpenJDK local em `.local/java25`
- Resultados validados:
  - `PacienteJoao` -> `CasoProvavelPneumonia`
  - `PacienteMaria` -> `CasoProvavelAsma`
  - `PacienteLuiza` -> `CasoProvavelBronquite`
  - `PacienteCarlos` -> `CasoProvavelCOVID19`

Observacao:
- `.local/` e `.venv/` estao no `.gitignore` para nao versionar runtimes locais.

## Fontes de verdade
- `docs/Doenças Respiratórias.md` (principal)
- `docs/ODSDR_Descricao_Projeto.md`

## Documentacao de implementacao
- Roadmap inicial: `docs/Roadmap_Implementacao_ODSDR.md`
- Plano de implementacao atualizado: `docs/Plano_Implementacao_ODSDR.md`
- Plano detalhado da Fase 1: `docs/Plano_Fase_1_ODSDR.md`
- Plano detalhado da Fase 2: `docs/Plano_Fase_2_ODSDR.md`
- Plano detalhado da Fase 3: `docs/Plano_Fase_3_ODSDR.md`
- Plano detalhado da Fase 4: `docs/Plano_Fase_4_ODSDR.md`
- Catalogo de consultas (Fase 4): `docs/Catalogo_Consultas_Fase_4.md`
