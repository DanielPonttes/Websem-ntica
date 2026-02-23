/* ============================================================
   Diagnóstico Page — Drag & drop symptoms + Autocomplete + AI
   ============================================================ */
const DiagnosticoPage = (() => {

  let allSintomas = [];
  let allDoencas = [];
  let allExames = [];
  let allTratamentos = [];
  let allProfissionais = [];
  let selectedSintomas = [];

  async function render(container) {
    container.innerHTML = `
      <div class="page-enter">
        <h1 class="page-title">Diagnóstico Semântico</h1>
        <p class="page-sub">Arraste sintomas, cadastre o paciente e obtenha sugestão diagnóstica por IA</p>

        <!-- Patient Quick Registration -->
        <div class="quick-form" style="margin-bottom:24px">
          <h3 class="section-title">📋 Ficha do Paciente</h3>
          <div class="quick-form-grid">
            <div class="form-group">
              <label class="form-label">ID do Paciente</label>
              <input type="text" class="form-input" id="dPatientId" placeholder="Ex: NovoPaciente01">
            </div>
            <div class="form-group">
              <label class="form-label">Idade</label>
              <input type="number" class="form-input" id="dIdade" placeholder="0–130" min="0" max="130">
            </div>
            <div class="form-group">
              <label class="form-label">Sexo</label>
              <select class="form-input form-select" id="dSexo">
                <option value="">Selecionar</option>
                <option value="M">Masculino</option>
                <option value="F">Feminino</option>
                <option value="O">Outro</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Fumante</label>
              <div class="toggle-group">
                <label class="toggle"><input type="checkbox" id="dFumante"><span class="toggle-slider"></span></label>
                <span class="toggle-label" id="dFumanteLabel">Não</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Symptoms Drag & Drop -->
        <div class="section-title">🩺 Sintomas <span class="badge" id="sintomasCount">0 selecionados</span></div>
        <div class="dnd-zone" style="margin-bottom:24px">
          <div class="dnd-pool" id="sintomasPool">
            <div class="dnd-title">
              Disponíveis
              <input type="text" class="form-input" id="sintomaSearch" placeholder="Filtrar..." style="width:140px;padding:5px 10px;font-size:.78rem">
            </div>
            <div class="dnd-items" id="poolItems">${Components.skeleton(2)}</div>
          </div>
          <div class="dnd-target" id="sintomasTarget">
            <div class="dnd-title">Selecionados</div>
            <div class="dnd-items" id="targetItems">
              <span style="color:var(--text-3);font-size:.82rem">Arraste sintomas para cá ou clique neles</span>
            </div>
          </div>
        </div>

        <!-- Condition Autocomplete -->
        <div class="diag-layout" style="margin-bottom:24px">
          <div class="form-group">
            <label class="form-label">🔍 Condição / Doença</label>
            <div class="autocomplete-wrapper">
              <input type="text" class="form-input" id="dDoenca" placeholder="Digite para buscar..." autocomplete="off">
              <div class="autocomplete-list" id="doencaList"></div>
            </div>
            <p class="form-hint">Autocomplete com doenças da ontologia</p>
          </div>
          <div class="form-group">
            <label class="form-label">Exame</label>
            <div class="autocomplete-wrapper">
              <input type="text" class="form-input" id="dExame" placeholder="Digite para buscar..." autocomplete="off">
              <div class="autocomplete-list" id="exameList"></div>
            </div>
          </div>
        </div>

        <div class="diag-layout" style="margin-bottom:24px">
          <div class="form-group">
            <label class="form-label">Tratamento</label>
            <div class="autocomplete-wrapper">
              <input type="text" class="form-input" id="dTratamento" placeholder="Digite para buscar..." autocomplete="off">
              <div class="autocomplete-list" id="tratamentoList"></div>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Profissional</label>
            <div class="autocomplete-wrapper">
              <input type="text" class="form-input" id="dProfissional" placeholder="Opcional" autocomplete="off">
              <div class="autocomplete-list" id="profissionalList"></div>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div style="display:flex;gap:12px;margin-bottom:28px;flex-wrap:wrap">
          <button class="btn btn-primary" id="btnIngest">💾 Registrar Caso</button>
          <button class="btn btn-success" id="btnAI">✨ Gerar Análise IA</button>
          <button class="btn btn-secondary" id="btnClear">🗑 Limpar</button>
        </div>

        <!-- AI Generated Text -->
        <div class="ai-box" id="aiBox">
          <div class="ai-box-header">
            <span class="ai-badge">✨ IA</span>
            <span class="ai-title">Análise Semântica</span>
          </div>
          <div class="ai-content" id="aiContent">
            Preencha os sintomas e clique em "Gerar Análise IA" para receber um texto diagnóstico gerado a partir da ontologia.
          </div>
        </div>
      </div>`;

    await loadEntities();
    bindEvents();
  }

  async function loadEntities() {
    try {
      const [sRes, dRes, eRes, tRes, pRes] = await Promise.all([
        API.entities('sintomas'),
        API.entities('doencas'),
        API.entities('exames'),
        API.entities('tratamentos'),
        API.entities('profissionais'),
      ]);
      allSintomas = sRes.items.map(Components.shortName);
      allDoencas = dRes.items.map(Components.shortName);
      allExames = eRes.items.map(Components.shortName);
      allTratamentos = tRes.items.map(Components.shortName);
      allProfissionais = pRes.items.map(Components.shortName);
      renderPool();
    } catch (e) {
      document.getElementById('poolItems').innerHTML =
        '<span style="color:var(--danger);font-size:.82rem">Erro ao carregar entidades da API</span>';
    }
  }

  /* ---- Render Pool ---- */
  function renderPool(filter = '') {
    const pool = document.getElementById('poolItems');
    const filtered = allSintomas.filter(s =>
      !selectedSintomas.includes(s) &&
      s.toLowerCase().includes(filter.toLowerCase())
    );
    if (!filtered.length) {
      pool.innerHTML = '<span style="color:var(--text-3);font-size:.82rem">Nenhum sintoma disponível</span>';
      return;
    }
    pool.innerHTML = filtered.map(s => `
      <div class="dnd-chip pool-chip" draggable="true" data-sintoma="${s}">
        <span class="chip-emoji">${Components.emoji(s)}</span>
        ${Components.formatLocalName(s)}
      </div>
    `).join('');

    // Bind drag events
    pool.querySelectorAll('.dnd-chip').forEach(chip => {
      chip.addEventListener('dragstart', onDragStart);
      chip.addEventListener('click', () => selectSintoma(chip.dataset.sintoma));
    });
  }

  function renderSelected() {
    const target = document.getElementById('targetItems');
    if (!selectedSintomas.length) {
      target.innerHTML = '<span style="color:var(--text-3);font-size:.82rem">Arraste sintomas para cá ou clique neles</span>';
    } else {
      target.innerHTML = selectedSintomas.map(s => `
        <div class="dnd-chip selected-chip" data-sintoma="${s}" draggable="true">
          <span class="chip-emoji">${Components.emoji(s)}</span>
          ${Components.formatLocalName(s)}
          <span class="chip-x">✕</span>
        </div>
      `).join('');
      target.querySelectorAll('.dnd-chip').forEach(chip => {
        chip.addEventListener('click', () => deselectSintoma(chip.dataset.sintoma));
        chip.addEventListener('dragstart', onDragStartSelected);
      });
    }
    document.getElementById('sintomasCount').textContent = `${selectedSintomas.length} selecionados`;
  }

  function selectSintoma(name) {
    if (!selectedSintomas.includes(name)) {
      selectedSintomas.push(name);
      renderPool(document.getElementById('sintomaSearch').value);
      renderSelected();
    }
  }

  function deselectSintoma(name) {
    selectedSintomas = selectedSintomas.filter(s => s !== name);
    renderPool(document.getElementById('sintomaSearch').value);
    renderSelected();
  }

  /* ---- Drag & Drop ---- */
  function onDragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.dataset.sintoma);
    e.dataTransfer.setData('source', 'pool');
    e.target.classList.add('dragging');
    setTimeout(() => e.target.classList.remove('dragging'), 200);
  }

  function onDragStartSelected(e) {
    e.dataTransfer.setData('text/plain', e.target.dataset.sintoma);
    e.dataTransfer.setData('source', 'selected');
    e.target.classList.add('dragging');
    setTimeout(() => e.target.classList.remove('dragging'), 200);
  }

  /* ---- Autocomplete ---- */
  function setupAutocomplete(inputId, listId, items, onSelect) {
    const input = document.getElementById(inputId);
    const list = document.getElementById(listId);
    let highlightIdx = -1;

    input.addEventListener('input', () => {
      const val = input.value.toLowerCase().trim();
      if (!val) { list.classList.remove('open'); return; }
      const matches = items.filter(i => i.toLowerCase().includes(val));
      if (!matches.length) { list.classList.remove('open'); return; }
      highlightIdx = -1;
      list.innerHTML = matches.map((m, i) =>
        `<div class="autocomplete-item" data-value="${m}"><span class="autocomplete-emoji">${Components.emoji(m)}</span>${Components.formatLocalName(m)}</div>`
      ).join('');
      list.classList.add('open');
      list.querySelectorAll('.autocomplete-item').forEach(item => {
        item.addEventListener('click', () => {
          input.value = Components.formatLocalName(item.dataset.value);
          input.dataset.rawValue = item.dataset.value;
          list.classList.remove('open');
          if (onSelect) onSelect(item.dataset.value);
        });
      });
    });

    input.addEventListener('keydown', (e) => {
      const items = list.querySelectorAll('.autocomplete-item');
      if (!items.length) return;
      if (e.key === 'ArrowDown') { e.preventDefault(); highlightIdx = Math.min(highlightIdx + 1, items.length - 1); updateHighlight(items); }
      if (e.key === 'ArrowUp') { e.preventDefault(); highlightIdx = Math.max(highlightIdx - 1, 0); updateHighlight(items); }
      if (e.key === 'Enter' && highlightIdx >= 0) { e.preventDefault(); items[highlightIdx].click(); }
      if (e.key === 'Escape') list.classList.remove('open');
    });

    function updateHighlight(items) {
      items.forEach((it, i) => it.classList.toggle('highlighted', i === highlightIdx));
    }

    document.addEventListener('click', (e) => {
      if (!input.contains(e.target) && !list.contains(e.target)) list.classList.remove('open');
    });
  }

  /* ---- Events ---- */
  function bindEvents() {
    // Fumante toggle
    const fumChk = document.getElementById('dFumante');
    const fumLbl = document.getElementById('dFumanteLabel');
    fumChk.addEventListener('change', () => { fumLbl.textContent = fumChk.checked ? 'Sim' : 'Não'; });

    // Symptom search filter
    document.getElementById('sintomaSearch').addEventListener('input', (e) => renderPool(e.target.value));

    // Drop zone
    const target = document.getElementById('sintomasTarget');
    target.addEventListener('dragover', (e) => { e.preventDefault(); target.classList.add('drag-over'); });
    target.addEventListener('dragleave', () => target.classList.remove('drag-over'));
    target.addEventListener('drop', (e) => {
      e.preventDefault();
      target.classList.remove('drag-over');
      const name = e.dataTransfer.getData('text/plain');
      selectSintoma(name);
    });

    // Pool as drop target (to remove from selected)
    const pool = document.getElementById('sintomasPool');
    pool.addEventListener('dragover', (e) => e.preventDefault());
    pool.addEventListener('drop', (e) => {
      e.preventDefault();
      const name = e.dataTransfer.getData('text/plain');
      const src = e.dataTransfer.getData('source');
      if (src === 'selected') deselectSintoma(name);
    });

    // Autocompletes
    setupAutocomplete('dDoenca', 'doencaList', allDoencas);
    setupAutocomplete('dExame', 'exameList', allExames);
    setupAutocomplete('dTratamento', 'tratamentoList', allTratamentos);
    setupAutocomplete('dProfissional', 'profissionalList', allProfissionais);

    // Buttons
    document.getElementById('btnIngest').addEventListener('click', doIngest);
    document.getElementById('btnAI').addEventListener('click', doAI);
    document.getElementById('btnClear').addEventListener('click', doClear);
  }

  /* ---- Ingest Case ---- */
  async function doIngest() {
    const patientId = document.getElementById('dPatientId').value.trim();
    const idade = parseInt(document.getElementById('dIdade').value, 10);
    const sexo = document.getElementById('dSexo').value;
    const fumante = document.getElementById('dFumante').checked;
    const doenca = document.getElementById('dDoenca').dataset.rawValue || document.getElementById('dDoenca').value.trim();
    const exame = document.getElementById('dExame').dataset.rawValue || document.getElementById('dExame').value.trim();
    const tratamento = document.getElementById('dTratamento').dataset.rawValue || document.getElementById('dTratamento').value.trim();
    const profissional = document.getElementById('dProfissional').dataset.rawValue || document.getElementById('dProfissional').value.trim() || null;

    // Validation
    if (!patientId) return Components.toast('Informe o ID do paciente', 'error');
    if (isNaN(idade) || idade < 0 || idade > 130) return Components.toast('Idade inválida (0–130)', 'error');
    if (!sexo) return Components.toast('Selecione o sexo', 'error');
    if (!selectedSintomas.length) return Components.toast('Selecione ao menos um sintoma', 'error');
    if (!doenca) return Components.toast('Informe a doença', 'error');
    if (!exame) return Components.toast('Informe o exame', 'error');
    if (!tratamento) return Components.toast('Informe o tratamento', 'error');

    const payload = {
      patient_id: patientId,
      diagnostico_id: patientId,
      idade, sexo, fumante,
      sintomas: selectedSintomas,
      exame, doenca, tratamento,
      profissional,
      data_diagnostico: new Date().toISOString().split('T')[0],
    };

    try {
      const res = await API.ingestCase(payload);
      Components.toast(`Caso registrado: ${Components.shortName(res.patient)}`, 'success');
    } catch (e) {
      Components.toast(`Erro: ${e.message}`, 'error');
    }
  }

  /* ---- AI Analysis (simulated from ontology) ---- */
  async function doAI() {
    const aiContent = document.getElementById('aiContent');
    const patientId = document.getElementById('dPatientId').value.trim() || 'Paciente';
    const idade = document.getElementById('dIdade').value || '?';
    const sexo = document.getElementById('dSexo').value || '?';
    const fumante = document.getElementById('dFumante').checked;
    const doenca = document.getElementById('dDoenca').dataset.rawValue || document.getElementById('dDoenca').value.trim();
    const exame = document.getElementById('dExame').dataset.rawValue || document.getElementById('dExame').value.trim();
    const tratamento = document.getElementById('dTratamento').dataset.rawValue || document.getElementById('dTratamento').value.trim();

    if (!selectedSintomas.length) {
      Components.toast('Selecione ao menos um sintoma para a análise', 'error');
      return;
    }

    // Loading state
    aiContent.className = 'ai-content loading';
    aiContent.innerHTML = 'Gerando análise semântica <span class="ai-pulse"></span>';

    // Simulate typing delay
    await new Promise(r => setTimeout(r, 1200));

    // Build analysis from ontology data
    const sintomasText = selectedSintomas.map(Components.formatLocalName).join(', ');
    const sexoText = sexo === 'M' ? 'masculino' : sexo === 'F' ? 'feminino' : 'não informado';
    const fumanteText = fumante ? 'Sim (fator de risco: Tabagismo)' : 'Não';

    // Try to find related diseases based on symptoms via queries
    let relatedInfo = '';
    try {
      const queryRes = await API.runQuery('09_sintomas_por_doenca', 'json');
      if (queryRes && queryRes.rows) {
        const matched = {};
        queryRes.rows.forEach(row => {
          const doencaName = Components.shortName(row[0]);
          const sintomaName = Components.shortName(row[1]);
          if (selectedSintomas.some(s => s.toLowerCase() === sintomaName.toLowerCase())) {
            if (!matched[doencaName]) matched[doencaName] = [];
            matched[doencaName].push(sintomaName);
          }
        });
        if (Object.keys(matched).length) {
          relatedInfo = '\n\n🔗 CORRELAÇÕES ONTOLÓGICAS:\n';
          for (const [d, syms] of Object.entries(matched)) {
            const pct = Math.round((syms.length / selectedSintomas.length) * 100);
            relatedInfo += `  • ${Components.formatLocalName(d)}: ${syms.length}/${selectedSintomas.length} sintomas compatíveis (${pct}%)\n`;
          }
        }
      }
    } catch (_) { }

    // Try to get treatment info
    let treatmentInfo = '';
    try {
      const tRes = await API.runQuery('10_tratamentos_por_doenca', 'json');
      if (tRes && tRes.rows && doenca) {
        const matchedT = tRes.rows.filter(r => Components.shortName(r[0]).toLowerCase() === doenca.toLowerCase());
        if (matchedT.length) {
          treatmentInfo = `\n\n💊 TRATAMENTO SUGERIDO PELA ONTOLOGIA:\n  • ${matchedT.map(r => Components.formatLocalName(Components.shortName(r[1]))).join(', ')}`;
        }
      }
    } catch (_) { }

    // Risk factors
    let riskInfo = '';
    if (fumante) {
      riskInfo = '\n\n⚠️ FATORES DE RISCO IDENTIFICADOS:\n  • Tabagismo detectado — aumenta risco para Pneumonia e Bronquite conforme ontologia ODSDR';
    }

    const analysis = `📋 RELATÓRIO DE ANÁLISE SEMÂNTICA — ODSDR v1.2.0

👤 DADOS DO PACIENTE:
  • ID: ${patientId}
  • Idade: ${idade} anos | Sexo: ${sexoText}
  • Fumante: ${fumanteText}

🩺 SINTOMAS APRESENTADOS:
  • ${sintomasText}

${doenca ? `🦠 CONDIÇÃO INFORMADA:\n  • ${Components.formatLocalName(doenca)}` : ''}
${exame ? `\n🔬 EXAME REALIZADO:\n  • ${Components.formatLocalName(exame)}` : ''}
${tratamento ? `\n💉 TRATAMENTO INDICADO:\n  • ${Components.formatLocalName(tratamento)}` : ''}
${relatedInfo}${treatmentInfo}${riskInfo}

📊 CONCLUSÃO:
Com base nos ${selectedSintomas.length} sintoma(s) apresentado(s) e nos dados da ontologia ODSDR, ${doenca ? `a condição ${Components.formatLocalName(doenca)} é compatível com o perfil clínico descrito.` : 'recomenda-se análise clínica detalhada para determinação diagnóstica.'} O raciocínio semântico utilizou classes de inferência OWL para correlacionar entidades clínicas do domínio respiratório.

⏱ Análise gerada em ${new Date().toLocaleString('pt-BR')}`;

    // Type-writer effect
    aiContent.className = 'ai-content';
    aiContent.textContent = '';
    let idx = 0;
    function typeChar() {
      if (idx < analysis.length) {
        aiContent.textContent += analysis[idx];
        idx++;
        setTimeout(typeChar, idx < 20 ? 15 : 5);
      }
    }
    typeChar();
  }

  /* ---- Clear ---- */
  function doClear() {
    document.getElementById('dPatientId').value = '';
    document.getElementById('dIdade').value = '';
    document.getElementById('dSexo').value = '';
    document.getElementById('dFumante').checked = false;
    document.getElementById('dFumanteLabel').textContent = 'Não';
    document.getElementById('dDoenca').value = '';
    document.getElementById('dDoenca').dataset.rawValue = '';
    document.getElementById('dExame').value = '';
    document.getElementById('dExame').dataset.rawValue = '';
    document.getElementById('dTratamento').value = '';
    document.getElementById('dTratamento').dataset.rawValue = '';
    document.getElementById('dProfissional').value = '';
    document.getElementById('dProfissional').dataset.rawValue = '';
    selectedSintomas = [];
    renderPool('');
    renderSelected();
    document.getElementById('aiContent').className = 'ai-content';
    document.getElementById('aiContent').textContent =
      'Preencha os sintomas e clique em "Gerar Análise IA" para receber um texto diagnóstico gerado a partir da ontologia.';
    Components.toast('Formulário limpo', 'info');
  }

  return { render };
})();
