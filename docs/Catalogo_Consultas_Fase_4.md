# Catalogo de Consultas e Perguntas de Competencia (Fase 4)

## Objetivo
Documentar as perguntas de competencia do dominio e o mapeamento para as consultas SPARQL implementadas.

## Consultas implementadas (10)

1. Arquivo: `queries/01_pacientes_com_perfil_pneumonia.rq`
- Pergunta de competencia: Quais pacientes tem perfil clinico compativel com pneumonia (tosse + febre + raio X)?
- Resultado esperado (dataset atual): 1 linha (`PacienteJoao`).

2. Arquivo: `queries/02_diagnosticos_e_tratamentos.rq`
- Pergunta de competencia: Qual o encadeamento paciente -> diagnostico -> doenca -> tratamento?
- Resultado esperado (dataset atual): 4 linhas (Carlos, Joao, Luiza, Maria).

3. Arquivo: `queries/03_doencas_por_fator_risco.rq`
- Pergunta de competencia: Quais doencas estao relacionadas a fatores de risco no conhecimento base?
- Resultado esperado (dataset atual): 3 linhas.

4. Arquivo: `queries/04_pacientes_por_doenca_diagnosticada.rq`
- Pergunta de competencia: Quais pacientes estao diagnosticados com cada doenca?
- Resultado esperado (dataset atual): 4 linhas (uma por doenca com caso registrado).

5. Arquivo: `queries/05_exames_por_doenca.rq`
- Pergunta de competencia: Quais exames detectam cada doenca?
- Resultado esperado (dataset atual): 3 linhas (Asma, COVID19, Pneumonia).

6. Arquivo: `queries/06_profissionais_e_diagnosticos.rq`
- Pergunta de competencia: Quais profissionais definiram quais diagnosticos e doencas?
- Resultado esperado (dataset atual): 4 linhas.

7. Arquivo: `queries/07_pacientes_por_exame_realizado.rq`
- Pergunta de competencia: Quais pacientes realizaram cada exame?
- Resultado esperado (dataset atual): 4 linhas.

8. Arquivo: `queries/08_pacientes_por_fator_risco.rq`
- Pergunta de competencia: Quais pacientes possuem fatores de risco registrados?
- Resultado esperado (dataset atual): 2 linhas (PacienteJoao com dois fatores).

9. Arquivo: `queries/09_sintomas_por_doenca.rq`
- Pergunta de competencia: Quais sintomas sao provocados por cada doenca?
- Resultado esperado (dataset atual): 10 linhas.

10. Arquivo: `queries/10_tratamentos_por_doenca.rq`
- Pergunta de competencia: Quais tratamentos estao associados a cada doenca?
- Resultado esperado (dataset atual): 3 linhas (Asma, COVID19, Pneumonia).

## Padrao de execucao das consultas
- Formato tabular (padrao):
```bash
.venv/bin/python scripts/load_and_query.py --format table
```

- Formato JSON:
```bash
.venv/bin/python scripts/load_and_query.py --format json
```

## Observacoes
- Os resultados esperados refletem o dataset atual (`data/casos_iniciais.ttl`) e podem mudar com novas instancias.
- O padrao de saida foi normalizado para facilitar consumo manual (tabela) e por sistemas (JSON).
