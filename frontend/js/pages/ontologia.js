/* ============================================================
   Ontologia Page
   ============================================================ */
const OntologiaPage = (() => {

    async function render(container) {
        container.innerHTML = `
        <div class="page-enter" style="height: 100%; display: flex; flex-direction: column; gap: 16px;">
            <h1 class="page-title">Grafo da Ontologia</h1>
            <p class="page-sub">Visualização interativa das classes, instâncias e relacionamentos (Grafo de Conhecimento)</p>

            <div class="filters-bar card" style="display: flex; gap: 16px; padding: 12px 16px; align-items: center;">
                <span style="font-weight: 500; font-size: 0.9rem;">Mostrar:</span>
                <label style="display:flex; align-items:center; gap:6px; cursor:pointer; font-size:0.9rem;">
                    <input type="checkbox" id="filterClasses" checked /> Classes
                </label>
                <label style="display:flex; align-items:center; gap:6px; cursor:pointer; font-size:0.9rem;">
                    <input type="checkbox" id="filterInstances" checked /> Instâncias
                </label>
                <button class="btn btn-secondary btn-sm" id="resetZoomBtn" style="margin-left:auto">Centralizar Grafo</button>
            </div>

            <div class="card" style="height: 65vh; min-height: 500px; padding: 0; position: relative; overflow: hidden; border-radius: var(--radius); display: flex; flex-direction: column;">
                <div id="loadingGraph" style="position:absolute; inset:0; display:flex; align-items:center; justify-content:center; background:rgba(0,0,0,0.5); z-index:10; color:white;">Carregando Grafo...</div>
                <div id="ontologyNetwork" style="width: 100%; height: 100%; background: var(--bg-card)"></div>
            </div>
        </div>`;

        setTimeout(() => loadGraph(), 100);
    }

    async function loadGraph() {
        try {
            const data = await API.runQuery('11_grafo_ontologia.rq', 'json');

            let allNodes = new Map();
            let allEdges = [];

            // Determine Colors
            const getColor = (group) => {
                if (group === 'Paciente') return '#c084fc'; // purple
                if (group === 'Doenca') return '#f87171'; // red
                if (group === 'Sintoma') return '#fb923c'; // orange
                if (group === 'Tratamento' || group === 'Medicamento') return '#4ade80'; // green
                if (group === 'Exame') return '#60a5fa'; // blue
                if (group === 'FatorRisco') return '#facc15'; // yellow
                return '#94a3b8'; // gray
            }

            data.rows.forEach(row => {
                const sourceUri = row[0];
                const relationUri = row[1];
                const targetUri = row[2];

                const sourceId = Components.shortName(sourceUri);
                const targetId = Components.shortName(targetUri);
                const relation = Components.shortName(relationUri);

                if (!allNodes.has(sourceId)) {
                    let group = sourceId.replace(/([A-Z])/g, ' $1').trim();
                    allNodes.set(sourceId, { id: sourceId, label: sourceId, group: 'Class', baseGroup: 'Class', font: { color: '#ffffff' } });
                }
                if (!allNodes.has(targetId)) {
                    let group = targetId.replace(/([A-Z])/g, ' $1').trim();
                    allNodes.set(targetId, { id: targetId, label: targetId, group: 'Class', baseGroup: 'Class', font: { color: '#ffffff' } });
                }

                // Identify if it's an instance (has a 'type' relation to something else)
                if (relation === 'type') {
                    const sourceNode = allNodes.get(sourceId);
                    sourceNode.color = { background: getColor(targetId), border: getColor(targetId) };
                    sourceNode.group = targetId;
                    sourceNode.baseGroup = 'Instance';
                }

                allEdges.push({
                    from: sourceId,
                    to: targetId,
                    label: relation,
                    font: { align: 'middle', size: 10, color: '#94a3b8' },
                    arrows: 'to',
                    color: { color: '#475569', opacity: 0.8 }
                });
            });

            const nodesDataSet = new vis.DataSet(Array.from(allNodes.values()));
            const edgesDataSet = new vis.DataSet(allEdges);
            const container = document.getElementById('ontologyNetwork');

            const graphData = {
                nodes: nodesDataSet,
                edges: edgesDataSet
            };

            const options = {
                nodes: {
                    shape: 'dot',
                    size: 16,
                    font: { size: 14, color: '#f8fafc' },
                    borderWidth: 2
                },
                physics: {
                    forceAtlas2Based: { gravitationalConstant: -50, centralGravity: 0.01, springLength: 100, springConstant: 0.08 },
                    maxVelocity: 50,
                    solver: 'forceAtlas2Based',
                    timestep: 0.35,
                    stabilization: { iterations: 150 }
                },
                layout: { improvedLayout: false }
            };

            const network = new vis.Network(container, graphData, options);

            network.once("stabilizationIterationsDone", function () {
                document.getElementById('loadingGraph').style.display = 'none';
                network.setOptions({ physics: { enabled: false } });
            });

            // Filter logic
            const filterClasses = document.getElementById('filterClasses');
            const filterInstances = document.getElementById('filterInstances');

            function applyFilters() {
                const showClasses = filterClasses.checked;
                const showInstances = filterInstances.checked;

                const nodesToUpdate = [];
                allNodes.forEach(node => {
                    let isVisible = true;
                    if (node.baseGroup === 'Class' && !showClasses) isVisible = false;
                    if (node.baseGroup === 'Instance' && !showInstances) isVisible = false;

                    nodesToUpdate.push({ id: node.id, hidden: !isVisible });
                });
                nodesDataSet.update(nodesToUpdate);
            }

            filterClasses.addEventListener('change', applyFilters);
            filterInstances.addEventListener('change', applyFilters);

            document.getElementById('resetZoomBtn').addEventListener('click', () => {
                network.fit({ animation: { duration: 500, easingFunction: 'easeInOutQuad' } });
            });

        } catch (e) {
            document.getElementById('loadingGraph').innerHTML = '⚠️ Erro ao carregar as relações da ontologia. Verifique o console.';
            console.error(e);
        }
    }

    return { render };
})();
