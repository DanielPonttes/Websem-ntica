from __future__ import annotations

from argparse import ArgumentParser
from datetime import datetime, timezone
from pathlib import Path

from pyshacl import validate
from rdflib import Graph, Namespace
from rdflib.namespace import OWL, RDF


SH = Namespace("http://www.w3.org/ns/shacl#")


def load_graph(paths: list[Path]) -> Graph:
    graph = Graph()
    for path in paths:
        graph.parse(path, format="turtle")

    # Keep validation fully local and avoid network resolution.
    for triple in list(graph.triples((None, OWL.imports, None))):
        graph.remove(triple)
    return graph


def run_validation(
    ontology_path: Path,
    shapes_path: Path,
    data_path: Path,
) -> tuple[bool, Graph, str]:
    data_graph = load_graph([ontology_path, data_path])
    shacl_graph = load_graph([shapes_path])
    ont_graph = load_graph([ontology_path])

    conforms, results_graph, results_text = validate(
        data_graph=data_graph,
        shacl_graph=shacl_graph,
        ont_graph=ont_graph,
        inference="rdfs",
        abort_on_first=False,
        allow_infos=True,
        allow_warnings=True,
        do_owl_imports=False,
        advanced=True,
    )
    return conforms, results_graph, str(results_text)


def count_validation_results(results_graph: Graph) -> int:
    return len(list(results_graph.subjects(RDF.type, SH.ValidationResult)))


def build_markdown_report(entries: list[dict[str, str]], report_path: Path) -> str:
    generated_at = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")
    lines = [
        "# Relatorio SHACL - Fase 3",
        "",
        f"Gerado em: {generated_at}",
        "",
        "## Resumo",
    ]

    for entry in entries:
        lines.append(
            f"- `{entry['dataset']}`: conforms={entry['conforms']} | violations={entry['violations']}"
        )

    lines.extend(["", "## Detalhes"])
    for entry in entries:
        lines.extend(
            [
                "",
                f"### Dataset: `{entry['dataset']}`",
                f"- Conforms: `{entry['conforms']}`",
                f"- Quantidade de violacoes: `{entry['violations']}`",
                "",
                "```text",
                entry["results_text"].strip(),
                "```",
            ]
        )

    report = "\n".join(lines) + "\n"
    report_path.write_text(report, encoding="utf-8")
    return report


def parse_args() -> ArgumentParser:
    parser = ArgumentParser(description="Run SHACL validations for ODSDR.")
    parser.add_argument(
        "--ontology",
        type=Path,
        default=Path("ontology/odsdr.ttl"),
        help="Path to ontology Turtle file.",
    )
    parser.add_argument(
        "--shapes",
        type=Path,
        default=Path("shacl/odsdr_shapes.ttl"),
        help="Path to SHACL shapes Turtle file.",
    )
    parser.add_argument(
        "--data",
        type=Path,
        nargs="+",
        default=[
            Path("data/validation/positivo_shacl.ttl"),
            Path("data/validation/negativo_shacl.ttl"),
        ],
        help="One or more data files to validate.",
    )
    parser.add_argument(
        "--report-out",
        type=Path,
        default=Path("docs/Relatorio_Fase_3_SHACL.md"),
        help="Output markdown report path.",
    )
    return parser


def main() -> None:
    parser = parse_args()
    args = parser.parse_args()

    entries: list[dict[str, str]] = []
    for data_path in args.data:
        conforms, results_graph, results_text = run_validation(
            ontology_path=args.ontology,
            shapes_path=args.shapes,
            data_path=data_path,
        )
        violations = str(count_validation_results(results_graph))
        entries.append(
            {
                "dataset": str(data_path),
                "conforms": str(conforms),
                "violations": violations,
                "results_text": results_text,
            }
        )
        print(
            f"{data_path}: conforms={conforms} | violations={violations}",
        )

    report = build_markdown_report(entries, args.report_out)
    print(f"\nReport written to: {args.report_out}")
    print(f"Report size: {len(report)} chars")


if __name__ == "__main__":
    main()
