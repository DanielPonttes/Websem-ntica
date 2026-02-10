from __future__ import annotations

import json
from argparse import ArgumentParser
from pathlib import Path

from rdflib import Graph
from rdflib import Literal
from rdflib import URIRef


BASE_IRI = "http://www.semanticweb.org/daniel-pontes/ontologies/2025/9/respiratory-diseases-ontology/"


def compact_term(value: object) -> str:
    if isinstance(value, URIRef):
        uri = str(value)
        if uri.startswith(BASE_IRI):
            return f"odsdr:{uri[len(BASE_IRI):]}"
        return uri
    if isinstance(value, Literal):
        return str(value)
    return str(value)


def run_query(graph: Graph, query_path: Path) -> dict[str, object]:
    query = query_path.read_text(encoding="utf-8")
    results = graph.query(query)
    columns = [str(var) for var in results.vars]
    rows = [[compact_term(cell) for cell in row] for row in results]
    return {"query": query_path.name, "columns": columns, "rows": rows}


def print_table(result: dict[str, object]) -> None:
    query_name = str(result["query"])
    columns = [str(col) for col in result["columns"]]
    rows = [[str(cell) for cell in row] for row in result["rows"]]

    print(f"\n=== {query_name} ===")
    if not rows:
        print("Sem resultados.")
        return

    widths = [len(col) for col in columns]
    for row in rows:
        for idx, cell in enumerate(row):
            widths[idx] = max(widths[idx], len(cell))

    header = " | ".join(col.ljust(widths[idx]) for idx, col in enumerate(columns))
    separator = "-+-".join("-" * widths[idx] for idx in range(len(columns)))
    print(header)
    print(separator)
    for row in rows:
        print(" | ".join(cell.ljust(widths[idx]) for idx, cell in enumerate(row)))


def parse_args() -> ArgumentParser:
    parser = ArgumentParser(description="Run ODSDR SPARQL queries.")
    parser.add_argument(
        "--ontology",
        type=Path,
        default=Path("ontology/odsdr.ttl"),
        help="Path to ontology Turtle file.",
    )
    parser.add_argument(
        "--data",
        type=Path,
        default=Path("data/casos_iniciais.ttl"),
        help="Path to data Turtle file.",
    )
    parser.add_argument(
        "--queries-dir",
        type=Path,
        default=Path("queries"),
        help="Directory containing .rq query files.",
    )
    parser.add_argument(
        "--query-glob",
        default="*.rq",
        help="Glob filter for query files (default: *.rq).",
    )
    parser.add_argument(
        "--format",
        choices=["table", "json"],
        default="table",
        help="Output format (default: table).",
    )
    return parser


def main() -> None:
    parser = parse_args()
    args = parser.parse_args()

    root_dir = Path(__file__).resolve().parents[1]
    graph = Graph()
    graph.parse(root_dir / args.ontology, format="turtle")
    graph.parse(root_dir / args.data, format="turtle")

    results = []
    for query_path in sorted((root_dir / args.queries_dir).glob(args.query_glob)):
        results.append(run_query(graph, query_path))

    if args.format == "json":
        print(json.dumps(results, indent=2, ensure_ascii=False))
        return

    for result in results:
        print_table(result)


if __name__ == "__main__":
    main()
