# Fontes Clinicas — ODSDR

Referencias da Organizacao Mundial da Saude (OMS/WHO) e fontes complementares que fundamentam
as decisoes de modelagem ontologica do projeto ODSDR.

---

## Pneumonia

| Aspecto | Valor na ontologia | Fonte |
|---|---|---|
| Sintomas | Tosse, Febre, Falta de Ar | WHO Fact Sheet — Pneumonia |
| Exame | Raio-X de Torax | WHO — Integrated Management of Childhood Illness (IMCI) |
| Causa | Infeccao Bacteriana | WHO Fact Sheet — Pneumonia |
| Fatores de risco | Tabagismo, Idade Avancada | WHO — Global Burden of Disease |
| Tratamento | Antibiotico | WHO Essential Medicines List |

**Referencia principal**:
- WHO. *Pneumonia*. Fact Sheet. <https://www.who.int/news-room/fact-sheets/detail/pneumonia>
- WHO. *Revised WHO classification and treatment of childhood pneumonia at health facilities*. 2014. <https://www.who.int/publications/i/item/9789241507813>

---

## Asma

| Aspecto | Valor na ontologia | Fonte |
|---|---|---|
| Sintomas | Falta de Ar, Chiado no Peito | WHO Fact Sheet — Asthma |
| Exame | Espirometria | GINA/WHO — Global Strategy for Asthma Management |
| Tratamento | Broncodilatador | WHO Essential Medicines List |

**Referencia principal**:
- WHO. *Asthma*. Fact Sheet. <https://www.who.int/news-room/fact-sheets/detail/asthma>
- Global Initiative for Asthma (GINA). *Global Strategy for Asthma Management and Prevention*. <https://ginasthma.org/gina-reports/>
- WHO. *WHO Essential Medicines List — Bronchodilators*. <https://www.who.int/groups/expert-committee-on-selection-and-use-of-essential-medicines/essential-medicines-lists>

---

## Bronquite

| Aspecto | Valor na ontologia | Fonte |
|---|---|---|
| Sintomas | Tosse, Chiado no Peito | WHO — Acute respiratory infections |
| Exame | Espirometria | WHO/GOLD — Chronic Respiratory Diseases |
| Causa | Infeccao Viral | WHO — Acute respiratory infections in children |
| Fatores de risco | Tabagismo | WHO — Tobacco and respiratory disease |
| Tratamento | Broncodilatador | WHO Essential Medicines List |

**Referencia principal**:
- WHO. *Chronic respiratory diseases — Bronchitis*. <https://www.who.int/health-topics/chronic-respiratory-diseases>
- Global Initiative for Chronic Obstructive Lung Disease (GOLD). *GOLD Reports*. <https://goldcopd.org/gold-reports/>
- WHO. *Tobacco*. Fact Sheet. <https://www.who.int/news-room/fact-sheets/detail/tobacco>

---

## COVID-19

| Aspecto | Valor na ontologia | Fonte |
|---|---|---|
| Sintomas | Tosse, Febre, Falta de Ar | WHO — COVID-19 Clinical Management |
| Exame | PCR (RT-PCR) | WHO — Laboratory testing for COVID-19 |
| Causa | Infeccao Viral (SARS-CoV-2) | WHO — Coronavirus disease (COVID-19) |
| Fatores de risco | Comorbidade Pulmonar | WHO — COVID-19 Clinical Management |
| Tratamento | Hidratacao (suporte) | WHO — Clinical Management of COVID-19 |

**Referencia principal**:
- WHO. *Coronavirus disease (COVID-19)*. <https://www.who.int/health-topics/coronavirus>
- WHO. *Clinical management of COVID-19: Living guideline*. <https://www.who.int/publications/i/item/WHO-2019-nCoV-clinical-2024.3>
- WHO. *Laboratory testing for 2019 novel coronavirus (2019-nCoV) in suspected human cases*. <https://www.who.int/publications/i/item/10665-331501>

---

## Fatores de Risco

| Fator | Doencas associadas | Fonte |
|---|---|---|
| Tabagismo | Pneumonia, Bronquite | WHO Fact Sheet — Tobacco |
| Idade Avancada | Pneumonia | WHO — Ageing and Health |
| Comorbidade Pulmonar | COVID-19 | WHO — COVID-19 Clinical Management |

**Referencias**:
- WHO. *Tobacco*. <https://www.who.int/news-room/fact-sheets/detail/tobacco>
- WHO. *Ageing and Health*. <https://www.who.int/news-room/fact-sheets/detail/ageing-and-health>

---

## Exames Diagnosticos

| Exame | Uso na ontologia | Fonte |
|---|---|---|
| Raio-X de Torax | Detectar Pneumonia | WHO — Standardization of chest radiography |
| Espirometria | Detectar Asma, Bronquite | GINA/WHO, GOLD |
| PCR (RT-PCR) | Detectar COVID-19 | WHO — Laboratory testing for COVID-19 |

**Referencias**:
- WHO. *Standardization of interpretation of chest radiographs for the diagnosis of pneumonia in children*. <https://www.who.int/publications/i/item/WHO-V-B-01.35>
- WHO. *Laboratory testing strategy recommendations for COVID-19*. <https://www.who.int/publications/i/item/10665-331501>

---

## Tratamentos

| Tratamento | Doencas | Fonte |
|---|---|---|
| Antibiotico | Pneumonia | WHO Model List of Essential Medicines |
| Broncodilatador | Asma, Bronquite | WHO Model List of Essential Medicines |
| Hidratacao (suporte) | COVID-19 | WHO Clinical Management of COVID-19 |

**Referencia principal**:
- WHO. *WHO Model List of Essential Medicines — 23rd List (2023)*. <https://www.who.int/publications/i/item/WHO-MHP-HPS-EML-2023.02>

---

## Anatomia

| Estrutura | Relacao | Fonte |
|---|---|---|
| Pulmoes | Pneumonia ataca, COVID-19 ataca | WHO — Pneumonia Fact Sheet |
| Bronquios | Asma ataca, Bronquite ataca | WHO — Chronic Respiratory Diseases |

---

## Nota sobre os dados ficticios

Os pacientes modelados na ontologia (`casos_iniciais.ttl`) sao **casos ficticios**
criados para fins de demonstracao e teste. Os perfis clinicos (combinacoes de sintomas,
exames, fatores de risco e tratamentos) sao baseados nas diretrizes clinicas da OMS
listadas acima para garantir **plausibilidade clinica**, ainda que nao representem
dados reais.
