from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from service.semantic_api import CaseIn
from service.semantic_api import export_graph
from service.semantic_api import health
from service.semantic_api import ingest_case
from service.semantic_api import list_queries
from service.semantic_api import run_query_endpoint


def main() -> None:
    health_payload = health()
    assert health_payload["status"] == "ok", health_payload
    print("health:", health_payload)

    payload = list_queries()
    assert payload["count"] >= 10, payload
    print("queries_count:", payload["count"])

    unique_suffix = datetime.now(timezone.utc).strftime("%Y%m%d%H%M%S")
    case_payload = CaseIn(
        patient_id=f"Api{unique_suffix}",
        diagnostico_id=f"Api{unique_suffix}",
        idade=38,
        sexo="F",
        fumante=False,
        sintomas=["Tosse", "Febre"],
        exame="PCR",
        doenca="COVID19",
        tratamento="Hidratacao",
        profissional="MedicaAna",
    )
    ingest = ingest_case(case_payload)
    assert ingest["status"] == "created", ingest
    print("ingest:", ingest)

    query_json = run_query_endpoint("02_diagnosticos_e_tratamentos", format="json")
    assert query_json.status_code == 200, query_json.body
    query_payload = json.loads(query_json.body.decode("utf-8"))
    assert query_payload["row_count"] >= 4, query_payload
    print("query_json_row_count:", query_payload["row_count"])

    query_table = run_query_endpoint("10_tratamentos_por_doenca", format="table")
    assert query_table.status_code == 200, query_table.body
    assert "tratamento" in query_table.body.decode("utf-8").lower(), query_table.body
    print("query_table_ok")

    export_turtle = export_graph("turtle")
    assert export_turtle.status_code == 200, export_turtle.body
    assert "@prefix odsdr:" in export_turtle.body.decode("utf-8"), "odsdr prefix missing in turtle export"
    print("export_ok")

    print("API smoke test passed.")


if __name__ == "__main__":
    main()
