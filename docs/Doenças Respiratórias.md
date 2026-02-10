# Doenças Respiratórias

## Definir Ontologia

### Classes:

- Doença

- Paciente

- ProfissionalSaúde

- Diagnóstico

- Sintoma

- Tratamento
  
  - Medicamento

- Exame

- Causa

- Anatomia

- FatorRisco

### Relacionamentos

**Doença**

1. provoca(Doença, Sintomas)

2. possui(Doença, Causa)

3. aflinge(Doença, Paciente)

4. diagnosticada(Doença, ProfissionalSaúde) *

5. recebe(Doença, Tratamento)

6. detectada(Doença, Exame)

7. ataca(Doença, Anatomia)

8. facilitadaPor(Doença, FatorRisco)

---

**Paciente**

1. apresenta(Paciente, Sintoma)

2. atendido(Paciente, ProfissionalSaúde)

3. recebe(Paciente, Diagnóstico)

4. recebe(Paciente, Tratamento)

5. realiza(Paciente, Exame)

6. possui(Paciente, FatorRisco)

---

**Profissional Saúde**

1. define(ProfissionalSaúde, Diagnóstico)

2. analisa(ProfissionalSaúde, Sintoma)

3. preescreve(ProfissionalSaúde, Tratamento)

4. solicita(ProfissionalSaúde, Exame)

---

**Diagnóstico**

1. gera(Diagnóstico, Tratamento)

2. geradoApartir(Diagnóstico, Exame)
   
   ---            
   
   1. aliviadosPor(Sintoma, tratamento)
   
   ---
   
   **Tratamento ?**
   
   ---
   
   1. examina(Exame, anatomia)
   
   ---
   
   predispõem(Causa, FatorRisco)
   
   ---
   
   **Anatomia - ?**
   
   ---
   
   **FatorRisco - ?**
