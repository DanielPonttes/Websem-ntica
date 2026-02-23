# Relatorio SHACL - Fase 3

Gerado em: 2026-02-23 18:37:58 UTC

## Resumo
- `data/validation/positivo_shacl.ttl`: conforms=True | violations=0
- `data/validation/negativo_shacl.ttl`: conforms=False | violations=17

## Detalhes

### Dataset: `data/validation/positivo_shacl.ttl`
- Conforms: `True`
- Quantidade de violacoes: `0`

```text
Validation Report
Conforms: True
```

### Dataset: `data/validation/negativo_shacl.ttl`
- Conforms: `False`
- Quantidade de violacoes: `17`

```text
Validation Report
Conforms: False
Results (17):
Constraint Violation in DatatypeConstraintComponent (http://www.w3.org/ns/shacl#DatatypeConstraintComponent):
	Severity: sh:Violation
	Source Shape: [ sh:datatype xsd:boolean ; sh:minCount Literal("1", datatype=xsd:integer) ; sh:path odsdr:fumante ]
	Focus Node: odsdr:PacienteInvalidoShacl
	Value Node: Literal("nao")
	Result Path: odsdr:fumante
	Message: Value is not Literal with datatype xsd:boolean
Constraint Violation in DatatypeConstraintComponent (http://www.w3.org/ns/shacl#DatatypeConstraintComponent):
	Severity: sh:Violation
	Source Shape: [ sh:datatype xsd:date ; sh:minCount Literal("1", datatype=xsd:integer) ; sh:path odsdr:dataDiagnostico ]
	Focus Node: odsdr:DiagnosticoInvalidoShacl
	Value Node: Literal("10-02-2026", datatype=xsd:string)
	Result Path: odsdr:dataDiagnostico
	Message: Value is not Literal with datatype xsd:date
Constraint Violation in DatatypeConstraintComponent (http://www.w3.org/ns/shacl#DatatypeConstraintComponent):
	Severity: sh:Violation
	Source Shape: [ sh:datatype xsd:integer ; sh:minCount Literal("1", datatype=xsd:integer) ; sh:path odsdr:idade ]
	Focus Node: odsdr:PacienteTiposErrados
	Value Node: Literal("trinta", datatype=xsd:string)
	Result Path: odsdr:idade
	Message: Value is not Literal with datatype xsd:integer
Constraint Violation in MinCountConstraintComponent (http://www.w3.org/ns/shacl#MinCountConstraintComponent):
	Severity: sh:Violation
	Source Shape: [ sh:class odsdr:Anatomia ; sh:minCount Literal("1", datatype=xsd:integer) ; sh:path odsdr:examina ]
	Focus Node: odsdr:ExameInvalidoShacl
	Result Path: odsdr:examina
	Message: Less than 1 values on odsdr:ExameInvalidoShacl->odsdr:examina
Constraint Violation in MinCountConstraintComponent (http://www.w3.org/ns/shacl#MinCountConstraintComponent):
	Severity: sh:Violation
	Source Shape: [ sh:class odsdr:Diagnostico ; sh:minCount Literal("1", datatype=xsd:integer) ; sh:path odsdr:recebeDiagnostico ]
	Focus Node: odsdr:PacienteSemSintomas
	Result Path: odsdr:recebeDiagnostico
	Message: Less than 1 values on odsdr:PacienteSemSintomas->odsdr:recebeDiagnostico
Constraint Violation in MinCountConstraintComponent (http://www.w3.org/ns/shacl#MinCountConstraintComponent):
	Severity: sh:Violation
	Source Shape: [ sh:class odsdr:Doenca ; sh:minCount Literal("1", datatype=xsd:integer) ; sh:path odsdr:diagnosticaDoenca ]
	Focus Node: odsdr:DiagnosticoIncompleto
	Result Path: odsdr:diagnosticaDoenca
	Message: Less than 1 values on odsdr:DiagnosticoIncompleto->odsdr:diagnosticaDoenca
Constraint Violation in MinCountConstraintComponent (http://www.w3.org/ns/shacl#MinCountConstraintComponent):
	Severity: sh:Violation
	Source Shape: [ sh:class odsdr:Doenca ; sh:minCount Literal("1", datatype=xsd:integer) ; sh:path odsdr:diagnosticaDoenca ]
	Focus Node: odsdr:DiagnosticoInvalidoShacl
	Result Path: odsdr:diagnosticaDoenca
	Message: Less than 1 values on odsdr:DiagnosticoInvalidoShacl->odsdr:diagnosticaDoenca
Constraint Violation in MinCountConstraintComponent (http://www.w3.org/ns/shacl#MinCountConstraintComponent):
	Severity: sh:Violation
	Source Shape: [ sh:class odsdr:Doenca ; sh:minCount Literal("1", datatype=xsd:integer) ; sh:path odsdr:diagnosticaDoenca ]
	Focus Node: odsdr:DiagnosticoVazio
	Result Path: odsdr:diagnosticaDoenca
	Message: Less than 1 values on odsdr:DiagnosticoVazio->odsdr:diagnosticaDoenca
Constraint Violation in MinCountConstraintComponent (http://www.w3.org/ns/shacl#MinCountConstraintComponent):
	Severity: sh:Violation
	Source Shape: [ sh:class odsdr:Exame ; sh:minCount Literal("1", datatype=xsd:integer) ; sh:path odsdr:geradoApartirDe ]
	Focus Node: odsdr:DiagnosticoVazio
	Result Path: odsdr:geradoApartirDe
	Message: Less than 1 values on odsdr:DiagnosticoVazio->odsdr:geradoApartirDe
Constraint Violation in MinCountConstraintComponent (http://www.w3.org/ns/shacl#MinCountConstraintComponent):
	Severity: sh:Violation
	Source Shape: [ sh:class odsdr:Exame ; sh:minCount Literal("1", datatype=xsd:integer) ; sh:path odsdr:realiza ]
	Focus Node: odsdr:PacienteSemSintomas
	Result Path: odsdr:realiza
	Message: Less than 1 values on odsdr:PacienteSemSintomas->odsdr:realiza
Constraint Violation in MinCountConstraintComponent (http://www.w3.org/ns/shacl#MinCountConstraintComponent):
	Severity: sh:Violation
	Source Shape: [ sh:class odsdr:Sintoma ; sh:minCount Literal("1", datatype=xsd:integer) ; sh:path odsdr:apresenta ]
	Focus Node: odsdr:PacienteSemSintomas
	Result Path: odsdr:apresenta
	Message: Less than 1 values on odsdr:PacienteSemSintomas->odsdr:apresenta
Constraint Violation in MinCountConstraintComponent (http://www.w3.org/ns/shacl#MinCountConstraintComponent):
	Severity: sh:Violation
	Source Shape: [ sh:class odsdr:Tratamento ; sh:minCount Literal("1", datatype=xsd:integer) ; sh:path odsdr:geraTratamento ]
	Focus Node: odsdr:DiagnosticoIncompleto
	Result Path: odsdr:geraTratamento
	Message: Less than 1 values on odsdr:DiagnosticoIncompleto->odsdr:geraTratamento
Constraint Violation in MinCountConstraintComponent (http://www.w3.org/ns/shacl#MinCountConstraintComponent):
	Severity: sh:Violation
	Source Shape: [ sh:class odsdr:Tratamento ; sh:minCount Literal("1", datatype=xsd:integer) ; sh:path odsdr:geraTratamento ]
	Focus Node: odsdr:DiagnosticoVazio
	Result Path: odsdr:geraTratamento
	Message: Less than 1 values on odsdr:DiagnosticoVazio->odsdr:geraTratamento
Constraint Violation in MinCountConstraintComponent (http://www.w3.org/ns/shacl#MinCountConstraintComponent):
	Severity: sh:Violation
	Source Shape: [ sh:datatype xsd:boolean ; sh:minCount Literal("1", datatype=xsd:integer) ; sh:path odsdr:fumante ]
	Focus Node: odsdr:PacienteTiposErrados
	Result Path: odsdr:fumante
	Message: Less than 1 values on odsdr:PacienteTiposErrados->odsdr:fumante
Constraint Violation in MinCountConstraintComponent (http://www.w3.org/ns/shacl#MinCountConstraintComponent):
	Severity: sh:Violation
	Source Shape: [ sh:datatype xsd:date ; sh:minCount Literal("1", datatype=xsd:integer) ; sh:path odsdr:dataDiagnostico ]
	Focus Node: odsdr:DiagnosticoVazio
	Result Path: odsdr:dataDiagnostico
	Message: Less than 1 values on odsdr:DiagnosticoVazio->odsdr:dataDiagnostico
Constraint Violation in MinCountConstraintComponent (http://www.w3.org/ns/shacl#MinCountConstraintComponent):
	Severity: sh:Violation
	Source Shape: [ sh:datatype xsd:integer ; sh:minCount Literal("1", datatype=xsd:integer) ; sh:path odsdr:idade ]
	Focus Node: odsdr:PacienteInvalidoShacl
	Result Path: odsdr:idade
	Message: Less than 1 values on odsdr:PacienteInvalidoShacl->odsdr:idade
Constraint Violation in MinCountConstraintComponent (http://www.w3.org/ns/shacl#MinCountConstraintComponent):
	Severity: sh:Violation
	Source Shape: [ sh:datatype xsd:string ; sh:minCount Literal("1", datatype=xsd:integer) ; sh:path odsdr:sexo ]
	Focus Node: odsdr:PacienteTiposErrados
	Result Path: odsdr:sexo
	Message: Less than 1 values on odsdr:PacienteTiposErrados->odsdr:sexo
```
