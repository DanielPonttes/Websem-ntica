# ODSDR - Ontologia para Diagnostico Semantico de Doencas Respiratorias

Projeto de modelagem ontologica em OWL 2 DL (serializacao Turtle) para suporte a diagnostico semantico de doencas respiratorias.

## Estrutura do projeto
```text
docs/
  Doenças Respiratórias.md
  ODSDR_Descricao_Projeto.md
  Roadmap_Implementacao_ODSDR.md
  Plano_Implementacao_ODSDR.md
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
```

## Pre-requisitos
- Python 3.10+

## Configuracao local
```bash
python3 -m venv .venv
.venv/bin/python -m pip install -r requirements.txt
```

## Execucao
```bash
.venv/bin/python scripts/load_and_query.py
```

## Fontes de verdade
- `docs/Doenças Respiratórias.md` (principal)
- `docs/ODSDR_Descricao_Projeto.md`

## Documentacao de implementacao
- Roadmap inicial: `docs/Roadmap_Implementacao_ODSDR.md`
- Plano de implementacao atualizado: `docs/Plano_Implementacao_ODSDR.md`
