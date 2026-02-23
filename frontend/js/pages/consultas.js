/* ============================================================
   Consultas SPARQL Page
   ============================================================ */
const ConsultasPage = (() => {

  const QUERY_DESCRIPTIONS = {
    '01_pacientes_com_perfil_pneumonia.rq': 'Quais pacientes têm perfil clínico compatível com pneumonia?',
    '02_diagnosticos_e_tratamentos.rq': 'Qual o encadeamento paciente → diagnóstico → doença → tratamento?',
    '03_doencas_por_fator_risco.rq': 'Quais doenças estão relacionadas a fatores de risco?',
    '04_pacientes_por_doenca_diagnosticada.rq': 'Quais pacientes estão diagnosticados com cada doença?',
    '05_exames_por_doenca.rq': 'Quais exames detectam cada doença?',
    '06_profissionais_e_diagnosticos.rq': 'Quais profissionais definiram quais diagnósticos?',
    '07_pacientes_por_exame_realizado.rq': 'Quais pacientes realizaram cada exame?',
    '08_pacientes_por_fator_risco.rq': 'Quais pacientes possuem fatores de risco registrados?',
    '09_sintomas_por_doenca.rq': 'Quais sintomas são provocados por cada doença?',
    '10_tratamentos_por_doenca.rq': 'Quais tratamentos estão associados a cada doença?',
  };

  let activeQuery = null;

  async function render(container) {
    container.innerHTML = `
      <div class="page-enter">
        <h1 class="page-title">Consultas SPARQL</h1>
        <p class="page-sub">Execute perguntas de competência sobre a ontologia ODSDR</p>
        <div class="diag-layout">
          <div>
            <div class="section-title">📂 Queries disponíveis <span class="badge" id="queryCount">...</span></div>
            <div class="query-list" id="queryList">${Components.skeleton(8)}</div>
          </div>
          <div>
            <div class="section-title">📊 Resultado</div>
            <div class="tabs" id="queryTabs">
              <button class="tab-btn active" data-format="table">Tabela</button>
              <button class="tab-btn" data-format="json">JSON</button>
              <button class="tab-btn" data-format="sparql">SPARQL</button>
            </div>
            <div id="queryResult">
              <div class="empty-state"><div class="empty-icon">👈</div><div class="empty-text">Selecione uma query para executar</div></div>
            </div>
          </div>
        </div>
      </div>`;
    await loadQueries();
    bindTabs();
  }

  async function loadQueries() {
    try {
      const data = await API.queries();
      document.getElementById('queryCount').textContent = data.count;
      const list = document.getElementById('queryList');
      list.innerHTML = data.queries.map(q => `
        <div class="query-item" data-query="${q}">
          <div>
            <div class="query-name">${q.replace('.rq', '').replace(/_/g, ' ')}</div>
            <div style="font-size:.72rem;color:var(--text-3);margin-top:2px">${QUERY_DESCRIPTIONS[q] || ''}</div>
          </div>
          <span class="query-run-icon">▶</span>
        </div>
      `).join('');
      list.querySelectorAll('.query-item').forEach(item => {
        item.addEventListener('click', () => runQuery(item.dataset.query));
      });
    } catch (e) {
      document.getElementById('queryList').innerHTML =
        '<div class="empty-state"><div class="empty-icon">⚠️</div><div class="empty-text">Erro ao carregar queries</div></div>';
    }
  }

  async function runQuery(name, format) {
    activeQuery = name;
    // Highlight active
    document.querySelectorAll('.query-item').forEach(i => i.classList.toggle('active', i.dataset.query === name));

    const fmt = format || document.querySelector('.tab-btn.active')?.dataset.format || 'table';
    const resultEl = document.getElementById('queryResult');
    resultEl.innerHTML = `<div style="padding:20px">${Components.skeleton(5)}</div>`;

    try {
      const data = await API.runQuery(name, 'json');

      if (fmt === 'sparql') {
        resultEl.innerHTML = `
          <div class="card" style="margin-top:8px">
            <h4 style="margin-bottom:8px;font-size:0.9rem;color:var(--text-1)">Código SPARQL</h4>
            <pre style="background:var(--bg-card);padding:12px;border:1px solid var(--border);border-radius:var(--radius);overflow-x:auto;font-size:.78rem;color:var(--text-2);max-height:500px;overflow-y:auto">${Components.escapeHtml(data.query_text)}</pre>
          </div>`;
      } else if (fmt === 'json') {
        resultEl.innerHTML = `
          <div class="card" style="margin-top:8px">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
              <span class="tag tag-primary">${data.row_count} resultado(s)</span>
              <span style="font-size:.72rem;color:var(--text-3)">${name}</span>
            </div>
            <pre style="background:var(--bg-input);padding:16px;border-radius:var(--radius);overflow-x:auto;font-size:.78rem;color:var(--text-2);line-height:1.6;max-height:500px;overflow-y:auto">${Components.escapeHtml(JSON.stringify(data, null, 2))}</pre>
          </div>`;
      } else {
        const columns = data.columns.map(c => ({ label: c, key: c }));
        const rows = data.rows.map(row => {
          const obj = {};
          data.columns.forEach((c, i) => { obj[c] = Components.shortName(row[i]); });
          return obj;
        });
        resultEl.innerHTML = `
          <div style="margin-top:8px">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
              <span class="tag tag-primary">${data.row_count} resultado(s)</span>
              <span style="font-size:.72rem;color:var(--text-3)">${name}</span>
            </div>
            ${Components.dataTable(columns, rows)}
          </div>`;
      }
    } catch (e) {
      resultEl.innerHTML = `<div class="empty-state"><div class="empty-icon">❌</div><div class="empty-text">Erro: ${Components.escapeHtml(e.message)}</div></div>`;
    }
  }

  function bindTabs() {
    document.getElementById('queryTabs').addEventListener('click', (e) => {
      if (!e.target.classList.contains('tab-btn')) return;
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      if (activeQuery) runQuery(activeQuery, e.target.dataset.format);
    });
  }

  return { render };
})();
