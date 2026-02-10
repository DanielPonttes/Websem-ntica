# Plano da Fase 3 ODSDR (Qualidade de Dados com SHACL)

## Objetivo da fase
Definir e validar perfis minimos de qualidade de dados para `Paciente`, `Exame` e `Diagnostico` usando SHACL.

## Escopo da fase
- Shapes SHACL: `shacl/odsdr_shapes.ttl`
- Datasets de validacao: `data/validation/positivo_shacl.ttl` e `data/validation/negativo_shacl.ttl`
- Script de validacao: `scripts/validate_shacl.py`
- Relatorio de conformidade: `docs/Relatorio_Fase_3_SHACL.md`
- Registro de evidencias: este documento

## Checklist executavel da Fase 3
- [x] F3.1 Definir perfil minimo de dados obrigatorios por entidade (`Paciente`, `Exame`, `Diagnostico`)
- [x] F3.2 Implementar shapes SHACL para validacao desses perfis
- [x] F3.3 Criar conjunto de testes positivo e negativo
- [x] F3.4 Gerar relatorio de conformidade

## Plano operacional
1. Definir perfis minimos de qualidade
Mapear campos obrigatorios por entidade para validacao SHACL.

2. Implementar SHACL
Modelar NodeShapes e PropertyShapes em `shacl/odsdr_shapes.ttl`.

3. Criar datasets de teste
Adicionar um conjunto conforme e um conjunto com violacoes controladas.

4. Executar validacao e gerar relatorio
Rodar `.venv/bin/python scripts/validate_shacl.py` e registrar saida em `docs/Relatorio_Fase_3_SHACL.md`.

5. Encerrar fase
Registrar resultados e status final neste documento.

## Criterio de aceite da Fase 3
- Perfis minimos definidos para `Paciente`, `Exame` e `Diagnostico`.
- Shapes SHACL executaveis sem dependencia externa.
- Dataset positivo com conformidade total.
- Dataset negativo com violacoes detectadas e reportadas.

## Registro de execucao
Data de inicio: 2026-02-10
Status atual: Concluida
Responsavel: Projeto ODSDR
Observacoes: executar esta fase em conjunto com `docs/Plano_Implementacao_ODSDR.md`.

### Log de execucao - 2026-02-10
- Implementacao F3.1 e F3.2:
  - Perfis minimos definidos para:
    - `Paciente`: `idade`, `sexo`, `fumante`, `apresenta`, `realiza`, `recebeDiagnostico`
    - `Exame`: `examina`
    - `Diagnostico`: `dataDiagnostico`, `geradoApartirDe`, `diagnosticaDoenca`, `geraTratamento`
  - Shapes implementados em `shacl/odsdr_shapes.ttl`.
- Implementacao F3.3:
  - Dataset positivo criado em `data/validation/positivo_shacl.ttl`.
  - Dataset negativo criado em `data/validation/negativo_shacl.ttl`.
- Implementacao F3.4:
  - Validacao executada por `scripts/validate_shacl.py`.
  - Resultado:
    - `positivo_shacl.ttl`: conforms=`True`, violations=`0`
    - `negativo_shacl.ttl`: conforms=`False`, violations=`5`
  - Relatorio versionado em `docs/Relatorio_Fase_3_SHACL.md`.
- Decisao tecnica:
  - SHACL adotado para governanca de qualidade de dados.
  - Regras OWL continuam focadas em inferencia clinica; SHACL cobre validacao estrutural.

### Encerramento da fase - 2026-02-10
- Resultado final: aprovado.
- Criterio de aceite: atendido.
