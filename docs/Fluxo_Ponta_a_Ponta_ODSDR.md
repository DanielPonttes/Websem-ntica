# Fluxo Ponta a Ponta ODSDR

## Objetivo
Documentar o fluxo operacional completo de carga, ingestao, consulta e exportacao semantica.

## Etapas do fluxo

1. Preparar ambiente
```bash
python3 -m venv .venv
.venv/bin/python -m pip install -r requirements.txt
```

2. Executar validacoes de base
```bash
.venv/bin/python scripts/load_and_query.py --format table
.venv/bin/python scripts/validate_shacl.py
```

3. Subir API semantica
```bash
.venv/bin/uvicorn service.semantic_api:app --host 127.0.0.1 --port 8000
```

4. Ingerir novo caso clinico
Endpoint: `POST /cases`
Exemplo de payload:
```json
{
  "patient_id": "Api001",
  "diagnostico_id": "Api001",
  "idade": 40,
  "sexo": "F",
  "fumante": false,
  "sintomas": ["Tosse", "Febre"],
  "exame": "PCR",
  "doenca": "COVID19",
  "tratamento": "Hidratacao",
  "profissional": "MedicaAna"
}
```

5. Consumir consultas semanticas
- Listar queries: `GET /queries`
- Executar query em JSON: `GET /queries/{query_name}?format=json`
- Executar query em tabela: `GET /queries/{query_name}?format=table`

6. Exportar base consolidada
- `GET /export?format=turtle`
- `GET /export?format=json-ld`
- `GET /export?format=nt`

7. Validar estado operacional
- Healthcheck: `GET /health`
- Smoke test local:
```bash
.venv/bin/python scripts/test_api_service.py
```

## Artefatos impactados no fluxo
- Ontologia: `ontology/odsdr.ttl`
- Base inicial: `data/casos_iniciais.ttl`
- Ingestao operacional: `data/cases_ingestao.ttl`
- Consultas: `queries/*.rq`
- API: `service/semantic_api.py`
- Validacao SHACL: `shacl/odsdr_shapes.ttl`

## Observacoes
- Em ambientes restritos sem bind de porta, a logica da API pode ser validada via `scripts/test_api_service.py`.
- Para producao, recomenda-se executar a API atras de proxy reverso e com controle de autenticacao.
