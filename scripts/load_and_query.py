from pathlib import Path

from rdflib import Graph


def run_query(graph: Graph, query_path: Path) -> None:
    print(f"\n=== {query_path.name} ===")
    query = query_path.read_text(encoding="utf-8")
    rows = list(graph.query(query))
    if not rows:
        print("Sem resultados.")
        return

    for row in rows:
        print(" | ".join(str(value) for value in row))


def main() -> None:
    root_dir = Path(__file__).resolve().parents[1]
    ontology_path = root_dir / "ontology" / "odsdr.ttl"
    data_path = root_dir / "data" / "casos_iniciais.ttl"
    queries_dir = root_dir / "queries"

    graph = Graph()
    graph.parse(ontology_path, format="turtle")
    graph.parse(data_path, format="turtle")

    for query_path in sorted(queries_dir.glob("*.rq")):
        run_query(graph, query_path)


if __name__ == "__main__":
    main()
