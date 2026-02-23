from __future__ import annotations

import re
from datetime import date
from pathlib import Path
from typing import Literal

from fastapi import APIRouter
from fastapi import FastAPI
from fastapi import HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.responses import JSONResponse
from fastapi.responses import PlainTextResponse
from fastapi.staticfiles import StaticFiles
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
FRONTEND_DIR = ROOT / "frontend"
ONTOLOGY_PATH = ROOT / "ontology" / "odsdr.ttl"
BASE_DATA_PATH = ROOT / "data" / "casos_iniciais.ttl"
INGEST_DATA_PATH = ROOT / "data" / "cases_ingestao.ttl"
QUERIES_DIR = ROOT / "queries"
BASE_IRI = "http://www.semanticweb.org/daniel-pontes/ontologies/2025/9/respiratory-diseases-ontology/"
ODSDR = Namespace(BASE_IRI)

api_router = APIRouter(prefix="/api")


app = FastAPI(
    title="ODSDR Semantic API",
    version="1.0.0",
    description="API para ingestao de casos clinicos e consultas semanticas ODSDR.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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


ENTITY_CLASS_MAP: dict[str, URIRef] = {
    "sintomas": ODSDR.Sintoma,
    "exames": ODSDR.Exame,
    "doencas": ODSDR.Doenca,
    "tratamentos": ODSDR.Tratamento,
    "profissionais": ODSDR.ProfissionalSaude,
    "fatores-risco": ODSDR.FatorRisco,
    "anatomia": ODSDR.Anatomia,
    "causas": ODSDR.Causa,
    "medicamentos": ODSDR.Medicamento,
}


@app.get("/entities/{class_name}")
def list_entities(class_name: str) -> dict[str, object]:
    class_uri = ENTITY_CLASS_MAP.get(class_name)
    if class_uri is None:
        raise HTTPException(
            status_code=404,
            detail=f"Classe desconhecida: {class_name}. Disponiveis: {sorted(ENTITY_CLASS_MAP.keys())}",
        )
    graph = load_graph(include_ingest=True)
    individuals = sorted(
        compact_term(s) for s in graph.subjects(RDF.type, class_uri) if isinstance(s, URIRef)
    )
    return {"class": class_name, "count": len(individuals), "items": individuals}


@app.get("/patients")
def list_patients() -> dict[str, object]:
    graph = load_graph(include_ingest=True)
    patients = []
    for patient_uri in sorted(graph.subjects(RDF.type, ODSDR.Paciente)):
        if not isinstance(patient_uri, URIRef):
            continue
        idade_val = graph.value(patient_uri, ODSDR.idade)
        sexo_val = graph.value(patient_uri, ODSDR.sexo)
        fumante_val = graph.value(patient_uri, ODSDR.fumante)
        sintomas = sorted(compact_term(o) for o in graph.objects(patient_uri, ODSDR.apresenta))
        exames = sorted(compact_term(o) for o in graph.objects(patient_uri, ODSDR.realiza))
        diagnosticos = sorted(compact_term(o) for o in graph.objects(patient_uri, ODSDR.recebeDiagnostico))
        tratamentos = sorted(compact_term(o) for o in graph.objects(patient_uri, ODSDR.pacienteRecebeTratamento))
        profissional = graph.value(patient_uri, ODSDR.atendidoPor)
        fatores = sorted(compact_term(o) for o in graph.objects(patient_uri, ODSDR.possuiFatorRisco))

        doencas = []
        for diag_uri in graph.objects(patient_uri, ODSDR.recebeDiagnostico):
            for doenca_uri in graph.objects(diag_uri, ODSDR.diagnosticaDoenca):
                doencas.append(compact_term(doenca_uri))
        doencas = sorted(set(doencas))

        patients.append({
            "id": compact_term(patient_uri),
            "idade": int(idade_val) if idade_val is not None else None,
            "sexo": str(sexo_val) if sexo_val is not None else None,
            "fumante": bool(fumante_val) if fumante_val is not None else None,
            "sintomas": sintomas,
            "exames": exames,
            "diagnosticos": diagnosticos,
            "doencas": doencas,
            "tratamentos": tratamentos,
            "profissional": compact_term(profissional) if profissional else None,
            "fatores_risco": fatores,
        })
    return {"count": len(patients), "patients": patients}


@app.get("/ontology/summary")
def ontology_summary() -> dict[str, object]:
    graph = load_graph(include_ingest=False)
    version = read_ontology_version(graph)
    classes = sorted(
        compact_term(s)
        for s in graph.subjects(RDF.type, OWL.Class)
        if isinstance(s, URIRef) and str(s).startswith(BASE_IRI)
    )
    object_props = sorted(
        compact_term(s)
        for s in graph.subjects(RDF.type, OWL.ObjectProperty)
        if isinstance(s, URIRef) and str(s).startswith(BASE_IRI)
    )
    data_props = sorted(
        compact_term(s)
        for s in graph.subjects(RDF.type, OWL.DatatypeProperty)
        if isinstance(s, URIRef) and str(s).startswith(BASE_IRI)
    )
    individuals = sorted(
        compact_term(s)
        for s in graph.subjects(RDF.type, OWL.NamedIndividual)
        if isinstance(s, URIRef) and str(s).startswith(BASE_IRI)
    )
    return {
        "version": version,
        "classes": {"count": len(classes), "items": classes},
        "object_properties": {"count": len(object_props), "items": object_props},
        "data_properties": {"count": len(data_props), "items": data_props},
        "individuals": {"count": len(individuals), "items": individuals},
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


# ------------------------------------------------------------------
# Inference endpoint — symptom-based diagnosis ranking
# ------------------------------------------------------------------

@app.get("/infer")
def infer_diagnosis(
    sintomas: str,
    fumante: bool = False,
    idade: int = 0,
):
    """Infer most probable diseases from a comma-separated list of symptoms.

    Uses SPARQL to query the ontology for disease-symptom relationships
    via the ``provoca`` property and computes a probability score.
    Adjusts scores based on risk factors (smoking, age).
    """
    symptom_list = [s.strip() for s in sintomas.split(",") if s.strip()]
    if not symptom_list:
        raise HTTPException(status_code=400, detail="Informe ao menos um sintoma.")

    graph = load_graph(include_ingest=False)

    # Helper to extract local name (e.g. "Tosse") from a URIRef
    def _local(uri):
        s = str(uri)
        if s.startswith(BASE_IRI):
            return s[len(BASE_IRI):]
        if "/" in s:
            return s.rsplit("/", 1)[-1]
        return s

    # 1. Build mapping: disease → set of symptoms it provokes
    query_provoca = """
    PREFIX odsdr: <http://www.semanticweb.org/daniel-pontes/ontologies/2025/9/respiratory-diseases-ontology/>
    SELECT ?doenca ?sintoma WHERE {
        ?doenca a odsdr:Doenca .
        ?doenca odsdr:provoca ?sintoma .
        ?sintoma a odsdr:Sintoma .
    }
    """
    disease_symptoms: dict[str, set[str]] = {}
    for row in graph.query(query_provoca):
        d = _local(row[0])
        s = _local(row[1])
        disease_symptoms.setdefault(d, set()).add(s)

    # 2. Build mapping: disease → exam, treatment, risk factors
    query_meta = """
    PREFIX odsdr: <http://www.semanticweb.org/daniel-pontes/ontologies/2025/9/respiratory-diseases-ontology/>
    SELECT ?doenca ?exame ?tratamento WHERE {
        ?doenca a odsdr:Doenca .
        ?doenca odsdr:detectadaPor ?exame .
        ?doenca odsdr:doencaRecebeTratamento ?tratamento .
    }
    """
    disease_exams: dict[str, list[str]] = {}
    disease_treatments: dict[str, list[str]] = {}
    for row in graph.query(query_meta):
        d = _local(row[0])
        e = _local(row[1])
        t = _local(row[2])
        disease_exams.setdefault(d, [])
        if e not in disease_exams[d]:
            disease_exams[d].append(e)
        disease_treatments.setdefault(d, [])
        if t not in disease_treatments[d]:
            disease_treatments[d].append(t)

    # Risk factors per disease
    query_risk = """
    PREFIX odsdr: <http://www.semanticweb.org/daniel-pontes/ontologies/2025/9/respiratory-diseases-ontology/>
    SELECT ?doenca ?fator WHERE {
        ?doenca a odsdr:Doenca .
        ?doenca odsdr:facilitadaPor ?fator .
    }
    """
    disease_risks: dict[str, set[str]] = {}
    for row in graph.query(query_risk):
        d = _local(row[0])
        f = _local(row[1])
        disease_risks.setdefault(d, set()).add(f)

    # 3. Compute scores
    input_set = set(symptom_list)
    results = []

    for disease, syms in disease_symptoms.items():
        matched = input_set & syms
        if not matched:
            continue

        # Base score: proportion of disease symptoms matched
        base_score = len(matched) / len(syms) if syms else 0

        # Bonus: how many of input symptoms this disease explains
        coverage = len(matched) / len(input_set) if input_set else 0

        # Combined score (weighted)
        score = 0.6 * base_score + 0.4 * coverage

        # Risk factor adjustments
        risks = disease_risks.get(disease, set())
        if fumante and "Tabagismo" in risks:
            score = min(score * 1.12, 1.0)
        if idade >= 60 and "IdadeAvancada" in risks:
            score = min(score * 1.08, 1.0)
        if "Imunossupressao" in risks and idade >= 65:
            score = min(score * 1.05, 1.0)

        prob = round(score * 100)
        if prob < 5:
            continue

        results.append({
            "doenca": disease,
            "probabilidade": prob,
            "sintomas_coincidentes": sorted(matched),
            "exame_sugerido": disease_exams.get(disease, []),
            "tratamento_sugerido": disease_treatments.get(disease, []),
            "fatores_risco": sorted(risks) if risks else [],
        })

    # Sort by probability descending
    results.sort(key=lambda x: x["probabilidade"], reverse=True)

    return {
        "sintomas_informados": sorted(input_set),
        "total_sintomas": len(input_set),
        "diagnosticos": results,
    }


# ------------------------------------------------------------------
# /api/* routes — mirror every endpoint under the /api prefix
# ------------------------------------------------------------------

api_router.add_api_route("/health", health, methods=["GET"])
api_router.add_api_route("/queries", list_queries, methods=["GET"])
api_router.add_api_route("/queries/{query_name}", run_query_endpoint, methods=["GET"])
api_router.add_api_route("/cases", ingest_case, methods=["POST"])
api_router.add_api_route("/entities/{class_name}", list_entities, methods=["GET"])
api_router.add_api_route("/patients", list_patients, methods=["GET"])
api_router.add_api_route("/ontology/summary", ontology_summary, methods=["GET"])
api_router.add_api_route("/export", export_graph, methods=["GET"])
api_router.add_api_route("/infer", infer_diagnosis, methods=["GET"])

app.include_router(api_router)


# ------------------------------------------------------------------
# Frontend static files
# ------------------------------------------------------------------

@app.get("/")
def serve_index():
    index = FRONTEND_DIR / "index.html"
    if index.exists():
        return FileResponse(index, media_type="text/html")
    return JSONResponse({"detail": "Frontend not found. Run from project root."}, status_code=404)


if FRONTEND_DIR.exists():
    app.mount("/", StaticFiles(directory=str(FRONTEND_DIR)), name="frontend")
