# Plano da Fase 5 ODSDR (Integracao com Aplicacao)

## Objetivo da fase
Implementar camada de servico para ingestao de casos, exposicao de consultas semanticas por API e documentacao de versionamento/fluxo ponta a ponta.

## Escopo da fase
- API semantica: `service/semantic_api.py`
- Dados de ingestao: `data/cases_ingestao.ttl`
- Teste de smoke da API: `scripts/test_api_service.py`
- Estrategia de versionamento: `docs/Estrategia_Versionamento_ODSDR.md`
- Fluxo operacional ponta a ponta: `docs/Fluxo_Ponta_a_Ponta_ODSDR.md`
- Registro de evidencias: este documento

## Checklist executavel da Fase 5
- [x] F5.1 Criar camada de servico para ingestao de casos clinicos
- [x] F5.2 Expor consultas semanticas para consumo externo (API ou interface)
- [x] F5.3 Definir estrategia de versionamento da ontologia (`1.0`, `1.1`, `2.0`)
- [x] F5.4 Documentar fluxo de carga, consulta e exportacao ponta a ponta
- [x] F5.5 Registrar resultado da fase e aprovacao final

## Plano operacional
1. Implementar servico de ingestao
Criar endpoint para receber caso clinico e persistir triples de ingestao.

2. Expor consultas semanticas
Criar endpoints para listagem, execucao de queries e exportacao de grafo.

3. Definir versionamento
Documentar politica de release para ontologia, API e consultas.

4. Documentar fluxo ponta a ponta
Registrar pipeline de operacao do ambiente do projeto.

5. Validar servico
Executar smoke test da camada de servico.

## Criterio de aceite da Fase 5
- API com ingestao de casos, execucao de consultas e exportacao funcional.
- Documento de versionamento publicado.
- Fluxo ponta a ponta documentado.
- Smoke test executado com sucesso.

## Registro de execucao
Data de inicio: 2026-02-10
Status atual: Concluida
Responsavel: Projeto ODSDR
Observacoes: executar esta fase em conjunto com `docs/Plano_Implementacao_ODSDR.md`.

### Log de execucao - 2026-02-10
- Implementacao F5.1 e F5.2:
  - API criada em `service/semantic_api.py` com endpoints:
    - `GET /health`
    - `GET /queries`
    - `GET /queries/{query_name}?format=json|table`
    - `POST /cases`
    - `GET /export?format=turtle|json-ld|nt`
  - Persistencia de ingestao em `data/cases_ingestao.ttl`.
- Implementacao F5.3:
  - Estrategia de versionamento documentada em `docs/Estrategia_Versionamento_ODSDR.md`.
- Implementacao F5.4:
  - Fluxo operacional documentado em `docs/Fluxo_Ponta_a_Ponta_ODSDR.md`.
- Validacao da fase:
  - Smoke test executado por `scripts/test_api_service.py`.
  - Resultado: aprovado (health, listagem de queries, ingestao, consulta e exportacao).

### Encerramento da fase - 2026-02-10
- Resultado final: aprovado.
- Criterio de aceite: atendido.

### Revalidacao documental - 2026-02-10
- Status: mantido como concluido.
- Evidencia de execucao:
  - `.venv/bin/python scripts/test_api_service.py`
  - Resultado: `API smoke test passed`.
- Observacao:
  - O total de linhas retornadas por query pode variar conforme novas ingestoes em `data/cases_ingestao.ttl`.
