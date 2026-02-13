from __future__ import annotations

import re
from datetime import date
from pathlib import Path
from typing import Literal

from fastapi import FastAPI
from fastapi import HTTPException
from fastapi.responses import JSONResponse
from fastapi.responses import PlainTextResponse
from pydantic import BaseModel
from pydantic import Field
from pydantic import field_validator
from rdflib import Graph
from rdflib import Literal as RDFLiteral
from rdflib import Namespace
from rdflib import URIRef
from rdflib.namespace import OWL
from rdflib.namespace import RDF
from rdflib.namespace import RDFS
from rdflib.namespace import XSD


ROOT = Path(__file__).resolve().parents[1]
ONTOLOGY_PATH = ROOT / "ontology" / "odsdr.ttl"
BASE_DATA_PATH = ROOT / "data" / "casos_iniciais.ttl"
INGEST_DATA_PATH = ROOT / "data" / "cases_ingestao.ttl"
QUERIES_DIR = ROOT / "queries"
BASE_IRI = "http://www.semanticweb.org/daniel-pontes/ontologies/2025/9/respiratory-diseases-ontology/"
ODSDR = Namespace(BASE_IRI)


app = FastAPI(
    title="ODSDR Semantic API",
    version="1.0.0",
    description="API para ingestao de casos clinicos e consultas semanticas ODSDR.",
)


class CaseIn(BaseModel):
    patient_id: str
    diagnostico_id: str
    idade: int = Field(ge=0, le=130)
    sexo: str
    fumante: bool
    sintomas: list[str] = Field(min_length=1)
    exame: str
    doenca: str
    tratamento: str
    profissional: str | None = None
    data_diagnostico: date = Field(default_factory=date.today)

    @field_validator("patient_id", "diagnostico_id", "exame", "doenca", "tratamento")
    @classmethod
    def validate_non_empty(cls, value: str) -> str:
        if not value or not value.strip():
            raise ValueError("Campo obrigatorio vazio.")
        return value.strip()

    @field_validator("sexo")
    @classmethod
    def validate_sexo(cls, value: str) -> str:
        normalized = value.strip().upper()
        if normalized not in {"M", "F", "O"}:
            raise ValueError("Sexo deve ser M, F ou O.")
        return normalized

    @field_validator("sintomas")
    @classmethod
    def validate_sintomas(cls, value: list[str]) -> list[str]:
        cleaned = [item.strip() for item in value if item and item.strip()]
        if not cleaned:
            raise ValueError("Informe ao menos um sintoma.")
        return cleaned


def sanitize_local_name(raw_value: str) -> str:
    cleaned = re.sub(r"[^A-Za-z0-9_]", "", raw_value.strip())
    if not cleaned:
        raise HTTPException(status_code=400, detail=f"Identificador invalido: {raw_value!r}")
    return cleaned


def compact_term(value: object) -> str:
    if isinstance(value, URIRef):
        uri = str(value)
        if uri.startswith(BASE_IRI):
            return f"odsdr:{uri[len(BASE_IRI):]}"
        return uri
    return str(value)


def render_table(columns: list[str], rows: list[list[str]]) -> str:
    if not rows:
        return "Sem resultados.\n"
    widths = [len(column) for column in columns]
    for row in rows:
        for idx, cell in enumerate(row):
            widths[idx] = max(widths[idx], len(cell))
    header = " | ".join(col.ljust(widths[idx]) for idx, col in enumerate(columns))
    separator = "-+-".join("-" * widths[idx] for idx in range(len(columns)))
    body = "\n".join(
        " | ".join(cell.ljust(widths[idx]) for idx, cell in enumerate(row)) for row in rows
    )
    return f"{header}\n{separator}\n{body}\n"


def ensure_ingest_file() -> None:
    if INGEST_DATA_PATH.exists():
        return
    INGEST_DATA_PATH.parent.mkdir(parents=True, exist_ok=True)
    graph = Graph()
    graph.bind("odsdr", ODSDR)
    graph.serialize(INGEST_DATA_PATH, format="turtle")


def load_graph(include_ingest: bool = True) -> Graph:
    graph = Graph()
    graph.parse(ONTOLOGY_PATH, format="turtle")
    graph.parse(BASE_DATA_PATH, format="turtle")
    if include_ingest and INGEST_DATA_PATH.exists():
        graph.parse(INGEST_DATA_PATH, format="turtle")
    return graph


def read_ontology_version(graph: Graph) -> str:
    ontology_iri = URIRef(BASE_IRI)
    value = graph.value(ontology_iri, OWL.versionInfo)
    return str(value) if value else "unknown"


def validate_reference(graph: Graph, local_name: str, class_uri: URIRef) -> URIRef:
    uri = ODSDR[sanitize_local_name(local_name)]
    if (uri, RDF.type, class_uri) not in graph:
        raise HTTPException(
            status_code=400,
            detail=f"Recurso inexistente ou tipo invalido: {local_name} esperado {compact_term(class_uri)}",
        )
    return uri


def load_query(query_name: str) -> Path:
    normalized = query_name if query_name.endswith(".rq") else f"{query_name}.rq"
    path = QUERIES_DIR / normalized
    if not path.exists():
        raise HTTPException(status_code=404, detail=f"Query nao encontrada: {normalized}")
    return path


@app.get("/health")
def health() -> dict[str, str]:
    graph = load_graph(include_ingest=False)
    return {
        "status": "ok",
        "ontology_version": read_ontology_version(graph),
    }


@app.get("/queries")
def list_queries() -> dict[str, object]:
    query_names = sorted(path.name for path in QUERIES_DIR.glob("*.rq"))
    return {"count": len(query_names), "queries": query_names}


@app.get("/queries/{query_name}")
def run_query_endpoint(
    query_name: str,
    format: Literal["json", "table"] = "json",
):
    query_path = load_query(query_name)
    graph = load_graph(include_ingest=True)
    query_text = query_path.read_text(encoding="utf-8")
    results = graph.query(query_text)
    columns = [str(var) for var in results.vars]
    rows = [[compact_term(cell) for cell in row] for row in results]

    if format == "table":
        table = render_table(columns, rows)
        return PlainTextResponse(table, media_type="text/plain; charset=utf-8")

    return JSONResponse(
        {
            "query": query_path.name,
            "columns": columns,
            "rows": rows,
            "row_count": len(rows),
        }
    )


@app.post("/cases")
def ingest_case(case: CaseIn) -> dict[str, object]:
    ensure_ingest_file()
    merged_graph = load_graph(include_ingest=True)
    ingest_graph = Graph()
    if INGEST_DATA_PATH.exists():
        ingest_graph.parse(INGEST_DATA_PATH, format="turtle")

    sintomas_uris = [validate_reference(merged_graph, nome, ODSDR.Sintoma) for nome in case.sintomas]
    exame_uri = validate_reference(merged_graph, case.exame, ODSDR.Exame)
    doenca_uri = validate_reference(merged_graph, case.doenca, ODSDR.Doenca)
    tratamento_uri = validate_reference(merged_graph, case.tratamento, ODSDR.Tratamento)

    profissional_uri: URIRef | None = None
    if case.profissional:
        profissional_uri = validate_reference(merged_graph, case.profissional, ODSDR.ProfissionalSaude)

    patient_uri = ODSDR[f"Paciente{sanitize_local_name(case.patient_id)}"]
    diagnostico_uri = ODSDR[f"Diagnostico{sanitize_local_name(case.diagnostico_id)}"]

    ingest_graph.bind("odsdr", ODSDR)
    ingest_graph.bind("rdf", RDF)
    ingest_graph.bind("rdfs", RDFS)
    ingest_graph.bind("owl", OWL)
    ingest_graph.bind("xsd", XSD)

    ingest_graph.add((patient_uri, RDF.type, OWL.NamedIndividual))
    ingest_graph.add((patient_uri, RDF.type, ODSDR.Paciente))
    ingest_graph.add((patient_uri, ODSDR.idade, RDFLiteral(case.idade, datatype=XSD.integer)))
    ingest_graph.add((patient_uri, ODSDR.sexo, RDFLiteral(case.sexo)))
    ingest_graph.add((patient_uri, ODSDR.fumante, RDFLiteral(case.fumante, datatype=XSD.boolean)))
    ingest_graph.add((patient_uri, ODSDR.realiza, exame_uri))
    ingest_graph.add((patient_uri, ODSDR.recebeDiagnostico, diagnostico_uri))
    ingest_graph.add((patient_uri, ODSDR.pacienteRecebeTratamento, tratamento_uri))
    for sintoma_uri in sintomas_uris:
        ingest_graph.add((patient_uri, ODSDR.apresenta, sintoma_uri))

    if profissional_uri is not None:
        ingest_graph.add((patient_uri, ODSDR.atendidoPor, profissional_uri))
        ingest_graph.add((profissional_uri, ODSDR.defineDiagnostico, diagnostico_uri))

    ingest_graph.add((diagnostico_uri, RDF.type, OWL.NamedIndividual))
    ingest_graph.add((diagnostico_uri, RDF.type, ODSDR.Diagnostico))
    ingest_graph.add(
        (
            diagnostico_uri,
            ODSDR.dataDiagnostico,
            RDFLiteral(case.data_diagnostico.isoformat(), datatype=XSD.date),
        )
    )
    ingest_graph.add((diagnostico_uri, ODSDR.geradoApartirDe, exame_uri))
    ingest_graph.add((diagnostico_uri, ODSDR.diagnosticaDoenca, doenca_uri))
    ingest_graph.add((diagnostico_uri, ODSDR.geraTratamento, tratamento_uri))

    ingest_graph.add((doenca_uri, ODSDR.aflige, patient_uri))

    ingest_graph.serialize(INGEST_DATA_PATH, format="turtle")

    return {
        "status": "created",
        "patient": compact_term(patient_uri),
        "diagnostico": compact_term(diagnostico_uri),
        "ingest_file": str(INGEST_DATA_PATH.relative_to(ROOT)),
        "symptoms_count": len(sintomas_uris),
    }


@app.get("/export")
def export_graph(
    format: Literal["turtle", "json-ld", "nt"] = "turtle",
):
    graph = load_graph(include_ingest=True)

    if format == "json-ld":
        payload = graph.serialize(format="json-ld")
        return PlainTextResponse(payload, media_type="application/ld+json; charset=utf-8")
    if format == "nt":
        payload = graph.serialize(format="nt")
        return PlainTextResponse(payload, media_type="application/n-triples; charset=utf-8")

    payload = graph.serialize(format="turtle")
    return PlainTextResponse(payload, media_type="text/turtle; charset=utf-8")
