/* ============================================================
   Dashboard Page
   ============================================================ */
const DashboardPage = (() => {

    async function render(container) {
        container.innerHTML = `
      <div class="page-enter">
        <h1 class="page-title">Dashboard</h1>
        <p class="page-sub">Visão geral do sistema de diagnóstico semântico</p>
        <div class="metrics-grid" id="dashMetrics">${Components.skeleton(4)}</div>
        <div class="diag-layout">
          <div class="card">
            <div class="card-header">
              <span class="card-title">Pacientes Recentes</span>
              <a href="#/pacientes" class="btn btn-ghost btn-sm">Ver todos →</a>
            </div>
            <div id="dashPatients">${Components.skeleton(5)}</div>
          </div>
          <div class="card">
            <div class="card-header">
              <span class="card-title">Ontologia</span>
              <span class="tag tag-primary" id="dashVersion">...</span>
            </div>
            <div id="dashOnto">${Components.skeleton(5)}</div>
          </div>
        </div>
      </div>`;
        loadData();
    }

    async function loadData() {
        try {
            const [patients, summary] = await Promise.all([
                API.patients(),
                API.ontologySummary(),
            ]);

            // Metrics
            const doencas = new Set();
            patients.patients.forEach(p => p.doencas.forEach(d => doencas.add(d)));
            document.getElementById('dashMetrics').innerHTML = [
                Components.metricCard('Pacientes', patients.count, '👥', 'purple'),
                Components.metricCard('Doenças', doencas.size, '🦠', 'red'),
                Components.metricCard('Classes', summary.classes.count, '🧬', 'blue'),
                Components.metricCard('Propriedades', summary.object_properties.count, '🔗', 'amber'),
            ].join('');

            // Version
            document.getElementById('dashVersion').textContent = `v${summary.version}`;

            // Patients table (last 6)
            const last = patients.patients.slice(-6).reverse();
            document.getElementById('dashPatients').innerHTML = Components.dataTable(
                [
                    { label: 'Paciente', key: 'id', render: r => `<strong>${Components.shortName(r.id)}</strong>` },
                    { label: 'Idade', key: 'idade' },
                    { label: 'Doença', key: 'doencas', render: r => Components.tagList(r.doencas, 'tag-danger') },
                    { label: 'Sintomas', key: 'sintomas', render: r => Components.tagList(r.sintomas, 'tag-info') },
                ],
                last
            );

            // Ontology summary
            document.getElementById('dashOnto').innerHTML = `
        <div style="display:flex;flex-wrap:wrap;gap:10px">
          ${ontoBadge('Classes', summary.classes.count, summary.classes.items)}
          ${ontoBadge('Obj Props', summary.object_properties.count, summary.object_properties.items)}
          ${ontoBadge('Data Props', summary.data_properties.count, summary.data_properties.items)}
          ${ontoBadge('Indivíduos', summary.individuals.count, summary.individuals.items)}
        </div>
        <div style="margin-top:16px">
          <p class="form-label" style="margin-bottom:8px">Classes da Ontologia</p>
          <div style="display:flex;flex-wrap:wrap;gap:6px">
            ${summary.classes.items.map(c => `<span class="tag tag-neutral">${Components.shortName(c)}</span>`).join('')}
          </div>
        </div>`;
        } catch (e) {
            document.getElementById('dashMetrics').innerHTML =
                '<div class="empty-state"><div class="empty-icon">⚠️</div><div class="empty-text">Erro ao carregar dados. Verifique se a API está rodando.</div></div>';
        }
    }

    function ontoBadge(label, count, items) {
        return `<div class="metric-card" style="padding:14px 18px;gap:4px"><div class="metric-label">${label}</div><div class="metric-value" style="font-size:1.4rem">${count}</div></div>`;
    }

    return { render };
})();
