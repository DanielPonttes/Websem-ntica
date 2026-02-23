/* ============================================================
   Pacientes Page — List + Quick Register
   ============================================================ */
const PacientesPage = (() => {

    let patients = [];
    let filterDoenca = '';

    async function render(container) {
        container.innerHTML = `
      <div class="page-enter">
        <h1 class="page-title">Pacientes</h1>
        <p class="page-sub">Base de pacientes registrados na ontologia ODSDR</p>

        <!-- Filters -->
        <div style="display:flex;gap:12px;margin-bottom:20px;flex-wrap:wrap;align-items:center">
          <input type="text" class="form-input" id="patSearch" placeholder="Buscar por nome..." style="max-width:260px">
          <select class="form-input form-select" id="patDoencaFilter" style="max-width:200px">
            <option value="">Todas as doenças</option>
          </select>
          <label style="display:flex;align-items:center;gap:6px;font-size:.82rem;color:var(--text-2)">
            <input type="checkbox" id="patFumante"> Apenas fumantes
          </label>
          <span class="tag tag-neutral" id="patCount">...</span>
        </div>

        <div id="patTable">${Components.skeleton(8)}</div>
      </div>`;
        await loadPatients();
        bindFilters();
    }

    async function loadPatients() {
        try {
            const data = await API.patients();
            patients = data.patients;
            // Populate disease filter
            const doencas = new Set();
            patients.forEach(p => p.doencas.forEach(d => doencas.add(d)));
            const sel = document.getElementById('patDoencaFilter');
            doencas.forEach(d => {
                const opt = document.createElement('option');
                opt.value = d;
                opt.textContent = Components.shortName(d);
                sel.appendChild(opt);
            });
            renderTable();
        } catch (e) {
            document.getElementById('patTable').innerHTML =
                '<div class="empty-state"><div class="empty-icon">⚠️</div><div class="empty-text">Erro ao carregar pacientes</div></div>';
        }
    }

    function renderTable() {
        const search = (document.getElementById('patSearch')?.value || '').toLowerCase();
        const doencaF = document.getElementById('patDoencaFilter')?.value || '';
        const fumanteF = document.getElementById('patFumante')?.checked || false;

        let list = patients;
        if (search) list = list.filter(p => Components.shortName(p.id).toLowerCase().includes(search));
        if (doencaF) list = list.filter(p => p.doencas.includes(doencaF));
        if (fumanteF) list = list.filter(p => p.fumante === true);

        document.getElementById('patCount').textContent = `${list.length} paciente(s)`;

        document.getElementById('patTable').innerHTML = Components.dataTable(
            [
                { label: 'Paciente', key: 'id', render: r => `<strong style="color:var(--text-1)">${Components.shortName(r.id)}</strong>` },
                { label: 'Idade', key: 'idade' },
                { label: 'Sexo', key: 'sexo' },
                { label: 'Fumante', key: 'fumante', render: r => r.fumante ? '<span class="tag tag-warning">Sim</span>' : '<span class="tag tag-neutral">Não</span>' },
                { label: 'Sintomas', key: 'sintomas', render: r => Components.tagList(r.sintomas, 'tag-info') },
                { label: 'Doença', key: 'doencas', render: r => Components.tagList(r.doencas, 'tag-danger') },
                { label: 'Tratamento', key: 'tratamentos', render: r => Components.tagList(r.tratamentos, 'tag-success') },
                { label: 'Profissional', key: 'profissional', render: r => r.profissional ? `<span class="tag tag-neutral">${Components.shortName(r.profissional)}</span>` : '—' },
            ],
            list
        );
    }

    function bindFilters() {
        document.getElementById('patSearch').addEventListener('input', renderTable);
        document.getElementById('patDoencaFilter').addEventListener('change', renderTable);
        document.getElementById('patFumante').addEventListener('change', renderTable);
    }

    return { render };
})();
