# Ontologia para Diagnóstico Semântico de Doenças Respiratórias (ODSDR)

## 1. Visão Geral do Projeto
Este projeto propõe o desenvolvimento de uma ontologia biomédica voltada ao **diagnóstico de doenças respiratórias**, utilizando conceitos da **Web Semântica**, **ontologias OWL** e **raciocínio automatizado**.  
O objetivo central é criar uma base de conhecimento estruturada capaz de representar entidades médicas, seus relacionamentos e permitir inferências diagnósticas automáticas, servindo como suporte para sistemas de apoio à decisão clínica e integrações com IA generativa.

---

## 2. Motivação
Doenças respiratórias estão entre as principais causas de morbidade no mundo. Apesar da grande disponibilidade de dados clínicos, esses dados geralmente estão:
- Desestruturados
- Pouco interoperáveis
- Difíceis de reutilizar em sistemas inteligentes

A ontologia proposta atua como uma **camada semântica intermediária**, permitindo que sistemas computacionais compreendam, relacionem e infiram conhecimento clínico de forma estruturada.

---

## 3. Objetivos do Projeto

### 3.1 Objetivo Geral
Desenvolver uma ontologia semântica para representação e inferência de diagnósticos de doenças respiratórias.

### 3.2 Objetivos Específicos
- Identificar e formalizar entidades médicas essenciais (doenças, sintomas, exames, tratamentos).
- Modelar relações clínicas e causais entre essas entidades.
- Permitir inferências automáticas com motores de raciocínio OWL.
- Facilitar integração com sistemas de IA, RAG clínico e agentes inteligentes.
- Criar uma base extensível para futuras aplicações em saúde digital.

---

## 4. Escopo da Ontologia
A ontologia cobre doenças respiratórias comuns, incluindo:
- Asma
- Bronquite
- Pneumonia
- COVID-19

Também estão incluídos:
- Sintomas clínicos
- Exames diagnósticos
- Fatores de risco
- Tratamentos
- Estruturas anatômicas
- Pacientes e profissionais de saúde

---

## 5. Classes Principais

- **Doença**
- **Sintoma**
- **Diagnóstico**
- **Exame**
- **Tratamento**
- **FatorRisco**
- **Anatomia**
- **Paciente**
- **ProfissionalSaúde**

Cada classe possui instâncias e propriedades que permitem a modelagem fiel do conhecimento médico.

---

## 6. Relações Ontológicas
Exemplos de propriedades:
- Doença → provoca → Sintoma
- Doença → detectadaPor → Exame
- Paciente → apresenta → Sintoma
- ProfissionalSaúde → define → Diagnóstico
- Diagnóstico → gera → Tratamento
- FatorRisco → aumentaRiscoPara → Doença

Essas relações permitem inferências como:
> Pacientes com febre e tosse podem ter pneumonia.

---

## 7. Inferência e Raciocínio Semântico
A ontologia utiliza reasoners OWL como **HermiT** ou **Pellet**, permitindo:
- Sugestão de diagnósticos prováveis
- Validação diagnóstica com base em exames
- Recomendação automática de tratamentos

---

## 8. Arquitetura do Sistema

Fluxo geral:
1. Entrada de dados clínicos
2. Camada ontológica (OWL)
3. Motor de inferência
4. Interface de apoio (visualização/chatbot)
5. Base de conhecimento expandida

---

## 9. Tecnologias Utilizadas
- Protégé (modelagem ontológica)
- OWL / Turtle
- Python
- RDFLib
- SPARQL
- Owlready2
- LangChain (futuro)
- LLMs (futuro)

---

## 10. Exemplo de Uso
Um paciente apresenta tosse e febre.  
O sistema consulta a ontologia, associa os sintomas à pneumonia e bronquite.  
Após um Raio-X, o sistema infere pneumonia como diagnóstico provável e sugere antibiótico como tratamento.

---

## 11. Aplicações Futuras
- Sistemas de apoio à decisão clínica
- Chatbots médicos inteligentes
- RAG clínico
- Ensino médico
- Pesquisa em saúde digital

---

## 12. Considerações Finais
Este projeto demonstra como ontologias podem atuar como elo entre dados clínicos e inteligência artificial, promovendo interoperabilidade, explicabilidade e suporte à decisão médica.

---

## 13. Estado Atual da Implementação
Implementação inicial concluída com os seguintes artefatos:

- Ontologia OWL/Turtle: `ontology/odsdr.ttl`
- Base de casos iniciais (ABox): `data/casos_iniciais.ttl`
- Consultas SPARQL: `queries/01_pacientes_com_perfil_pneumonia.rq`, `queries/02_diagnosticos_e_tratamentos.rq`, `queries/03_doencas_por_fator_risco.rq`
- Script de execução: `scripts/load_and_query.py`
- Dependências Python: `requirements.txt`
- Ambiente virtual local: `.venv/`

O arquivo legado `Doencas-respiratorias.rdf` permanece disponível para interoperabilidade, mas o desenvolvimento ativo está centralizado em Turtle.

---

## 14. Como Executar Localmente
1. Criar ambiente virtual:
```bash
python3 -m venv .venv
```

2. Instalar dependências:
```bash
.venv/bin/python -m pip install -r requirements.txt
```

3. Executar carga e consultas:
```bash
.venv/bin/python scripts/load_and_query.py
```

---

## 15. Validação Inicial
Na validação inicial, as consultas retornaram resultados consistentes com os dados de exemplo:
- Identificação de paciente com perfil de pneumonia.
- Mapeamento de paciente -> diagnóstico -> doença -> tratamento.
- Relação entre doenças e fatores de risco cadastrados.
