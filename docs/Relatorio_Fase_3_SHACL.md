# Relatorio SHACL - Fase 3

Gerado em: 2026-02-10 05:24:40 UTC

## Resumo
- `data/validation/positivo_shacl.ttl`: conforms=True | violations=0
- `data/validation/negativo_shacl.ttl`: conforms=False | violations=5

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
- Quantidade de violacoes: `5`

```text
Validation Report
Conforms: False
Results (5):
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
Constraint Violation in MinCountConstraintComponent (http://www.w3.org/ns/shacl#MinCountConstraintComponent):
	Severity: sh:Violation
	Source Shape: [ sh:class odsdr:Anatomia ; sh:minCount Literal("1", datatype=xsd:integer) ; sh:path odsdr:examina ]
	Focus Node: odsdr:ExameInvalidoShacl
	Result Path: odsdr:examina
	Message: Less than 1 values on odsdr:ExameInvalidoShacl->odsdr:examina
Constraint Violation in MinCountConstraintComponent (http://www.w3.org/ns/shacl#MinCountConstraintComponent):
	Severity: sh:Violation
	Source Shape: [ sh:class odsdr:Doenca ; sh:minCount Literal("1", datatype=xsd:integer) ; sh:path odsdr:diagnosticaDoenca ]
	Focus Node: odsdr:DiagnosticoInvalidoShacl
	Result Path: odsdr:diagnosticaDoenca
	Message: Less than 1 values on odsdr:DiagnosticoInvalidoShacl->odsdr:diagnosticaDoenca
Constraint Violation in MinCountConstraintComponent (http://www.w3.org/ns/shacl#MinCountConstraintComponent):
	Severity: sh:Violation
	Source Shape: [ sh:datatype xsd:integer ; sh:minCount Literal("1", datatype=xsd:integer) ; sh:path odsdr:idade ]
	Focus Node: odsdr:PacienteInvalidoShacl
	Result Path: odsdr:idade
	Message: Less than 1 values on odsdr:PacienteInvalidoShacl->odsdr:idade
```
