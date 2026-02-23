/* ============================================================
   Dashboard Page
   ============================================================ */
const DashboardPage = (() => {

  const DISEASE_IMAGES = {
    'Pneumonia': { img: 'assets/diseases/pneumonia.png', color: '#6366f1', desc: 'Infecção pulmonar — ICD-11 CA40' },
    'Asma': { img: 'assets/diseases/asma.png', color: '#22c55e', desc: 'Inflamação das vias aéreas — GINA 2024' },
    'COVID19': { img: 'assets/diseases/covid19.png', color: '#ef4444', desc: 'SARS-CoV-2 — ICD-11 RA01.0' },
    'Bronquite': { img: 'assets/diseases/bronquite.png', color: '#f59e0b', desc: 'Inflamação dos brônquios — ICD-11 CA20' },
    'Tuberculose': { img: 'assets/diseases/tuberculose.png', color: '#dc2626', desc: 'Mycobacterium tuberculosis — ICD-11 1B10' },
    'DPOC': { img: 'assets/diseases/dpoc.png', color: '#8b5cf6', desc: 'Doença pulmonar obstrutiva — GOLD 2024' },
    'Gripe': { img: 'assets/diseases/gripe.png', color: '#06b6d4', desc: 'Influenza A/B — ICD-11 1E30' },
    'Sinusite': { img: 'assets/diseases/sinusite.png', color: '#14b8a6', desc: 'Seios paranasais — ICD-11 CA0A' },
    'EmboliaPulmonar': { img: 'assets/diseases/emboliapulmonar.png', color: '#e11d48', desc: 'Tromboembolismo pulmonar — ICD-11 BB00' },
    'Laringite': { img: 'assets/diseases/laringite.png', color: '#a855f7', desc: 'Inflamação da laringe — ICD-11 CA04' },
  };

  async function render(container) {
    container.innerHTML = `
      <div class="page-enter">
        <h1 class="page-title">Dashboard</h1>
        <p class="page-sub">Visão geral do sistema de diagnóstico semântico</p>
        <div class="metrics-grid" id="dashMetrics">${Components.skeleton(4)}</div>

        <!-- Disease Cards with Images -->
        <div class="section-title">🦠 Doenças Respiratórias <span class="badge" id="diseaseCount">...</span></div>
        <div class="disease-grid" id="diseaseCards">${Components.skeleton(3)}</div>

        <div style="height:28px"></div>

        <div class="diag-layout">
          <div class="card">
            <div class="card-header">
              <span class="card-title">👥 Pacientes Recentes</span>
              <a href="#/pacientes" class="btn btn-ghost btn-sm">Ver todos →</a>
            </div>
            <div id="dashPatients">${Components.skeleton(5)}</div>
          </div>
          <div class="card">
            <div class="card-header">
              <span class="card-title">🧬 Ontologia</span>
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
      const sintomas = new Set();
      patients.patients.forEach(p => {
        p.doencas.forEach(d => doencas.add(d));
        p.sintomas.forEach(s => sintomas.add(s));
      });

      // Count per disease
      const diseaseCounts = {};
      patients.patients.forEach(p => p.doencas.forEach(d => {
        const name = Components.shortName(d);
        diseaseCounts[name] = (diseaseCounts[name] || 0) + 1;
      }));

      document.getElementById('dashMetrics').innerHTML = [
        Components.metricCard('Pacientes', patients.count, '👥', 'purple'),
        Components.metricCard('Doenças', doencas.size, '🦠', 'red'),
        Components.metricCard('Sintomas', sintomas.size, '🤒', 'orange'),
        Components.metricCard('Classes', summary.classes.count, '🧬', 'blue'),
        Components.metricCard('Propriedades', summary.object_properties.count, '🔗', 'amber'),
      ].join('');

      // Version
      document.getElementById('dashVersion').textContent = `v${summary.version}`;
      document.getElementById('diseaseCount').textContent = `${Object.keys(DISEASE_IMAGES).length} doenças`;

      // Disease cards with images
      document.getElementById('diseaseCards').innerHTML = Object.entries(DISEASE_IMAGES).map(([name, info], i) => {
        const count = diseaseCounts[name] || 0;
        const pct = patients.count ? Math.round((count / patients.count) * 100) : 0;
        const hasImg = info.img != null;
        return `
          <div class="disease-card" style="--card-color:${info.color};animation-delay:${i * .06}s">
            ${hasImg ? `<div class="disease-img"><img src="${info.img}" alt="${name}" loading="lazy"></div>` :
            `<div class="disease-img disease-img-placeholder"><span style="font-size:2.5rem">${Components.emoji(name)}</span></div>`}
            <div class="disease-body">
              <div class="disease-name">${Components.emoji(name)} ${Components.formatLocalName(name)}</div>
              <div class="disease-desc">${info.desc}</div>
              <div class="disease-stats">
                <div class="disease-bar-track">
                  <div class="disease-bar-fill" style="width:${pct}%;background:${info.color}"></div>
                </div>
                <span class="disease-count">${count} paciente${count !== 1 ? 's' : ''} (${pct}%)</span>
              </div>
            </div>
          </div>`;
      }).join('');

      // Animate bars
      requestAnimationFrame(() => {
        document.querySelectorAll('.disease-bar-fill').forEach(bar => {
          const w = bar.style.width;
          bar.style.width = '0%';
          requestAnimationFrame(() => { bar.style.width = w; });
        });
      });

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
        <div style="display:flex;flex-wrap:wrap;gap:10px;margin-bottom:16px">
          ${ontoBadge('Classes', summary.classes.count, 'purple')}
          ${ontoBadge('Obj Props', summary.object_properties.count, 'blue')}
          ${ontoBadge('Data Props', summary.data_properties.count, 'amber')}
          ${ontoBadge('Indivíduos', summary.individuals.count, 'green')}
        </div>
        <div>
          <p class="form-label" style="margin-bottom:8px">Classes da Ontologia</p>
          <div style="display:flex;flex-wrap:wrap;gap:6px">
            ${summary.classes.items.map(c => `<span class="tag tag-neutral">${Components.emojiLabel(Components.shortName(c))}</span>`).join('')}
          </div>
        </div>`;
    } catch (e) {
      document.getElementById('dashMetrics').innerHTML =
        '<div class="empty-state"><div class="empty-icon">⚠️</div><div class="empty-text">Erro ao carregar dados. Verifique se a API está rodando.</div></div>';
    }
  }

  function ontoBadge(label, count, color) {
    return `<div class="metric-card" style="padding:14px 18px;gap:4px"><div class="metric-label">${label}</div><div class="metric-value" style="font-size:1.4rem">${count}</div></div>`;
  }

  return { render };
})();
