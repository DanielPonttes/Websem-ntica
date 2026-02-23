/* ============================================================
   Diagnóstico Page — Symptoms → Inference → Results
   ============================================================ */
const DiagnosticoPage = (() => {

  let allSintomas = [];
  let selectedSintomas = JSON.parse(sessionStorage.getItem('odsdr-selectedSintomas') || '[]');

  function saveState() {
    sessionStorage.setItem('odsdr-selectedSintomas', JSON.stringify(selectedSintomas));
    const fields = ['dPatientId', 'dIdade', 'dSexo'];
    fields.forEach(id => {
      const el = document.getElementById(id);
      if (el) sessionStorage.setItem('odsdr-' + id, el.value);
    });
    const fum = document.getElementById('dFumante');
    if (fum) sessionStorage.setItem('odsdr-dFumante', fum.checked);
  }

  function restoreState() {
    ['dPatientId', 'dIdade', 'dSexo'].forEach(id => {
      const el = document.getElementById(id);
      const val = sessionStorage.getItem('odsdr-' + id);
      if (el && val) el.value = val;
    });
    const fum = document.getElementById('dFumante');
    const fumLbl = document.getElementById('dFumanteLabel');
    if (fum) {
      fum.checked = sessionStorage.getItem('odsdr-dFumante') === 'true';
      if (fumLbl) fumLbl.textContent = fum.checked ? 'Sim' : 'Não';
    }
  }

  async function render(container) {
    container.innerHTML = `
      <div class="page-enter">
        <h1 class="page-title">Diagnóstico Semântico</h1>
        <p class="page-sub">Selecione os sintomas do paciente — o sistema infere doença, exame e tratamento pela ontologia</p>

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

        <!-- Action Buttons -->
        <div style="display:flex;gap:12px;margin-bottom:28px;flex-wrap:wrap">
          <button class="btn btn-primary" id="btnInfer">🔍 Inferir Diagnóstico</button>
          <button class="btn btn-success" id="btnIngest" style="display:none">💾 Registrar Caso</button>
          <button class="btn btn-secondary" id="btnClear">🗑 Limpar</button>
        </div>

        <!-- Inference Results -->
        <div id="inferResults" style="display:none">
          <div class="section-title">📊 Diagnósticos Inferidos <span class="badge" id="inferCount">0</span></div>
          <div class="infer-grid" id="inferCards"></div>
        </div>

        <!-- AI Generated Text -->
        <div class="ai-box" id="aiBox" style="margin-top:24px">
          <div class="ai-box-header">
            <span class="ai-badge">✨ IA</span>
            <span class="ai-title">Análise Semântica</span>
          </div>
          <div class="ai-content" id="aiContent">
            Selecione sintomas e clique em "Inferir Diagnóstico" para receber sugestões baseadas na ontologia.
          </div>
        </div>
      </div>`;

    await loadEntities();
    bindEvents();
    restoreState();
    if (selectedSintomas.length) {
      renderPool(document.getElementById('sintomaSearch').value);
      renderSelected();
    }
  }

  async function loadEntities() {
    try {
      const sRes = await API.entities('sintomas');
      allSintomas = sRes.items.map(Components.shortName);
      renderPool();
    } catch (e) {
      document.getElementById('poolItems').innerHTML =
        '<span style="color:var(--danger);font-size:.82rem">Erro ao carregar sintomas da API</span>';
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
      saveState();
      renderPool(document.getElementById('sintomaSearch').value);
      renderSelected();
    }
  }

  function deselectSintoma(name) {
    selectedSintomas = selectedSintomas.filter(s => s !== name);
    saveState();
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

  /* ---- Events ---- */
  function bindEvents() {
    const fumChk = document.getElementById('dFumante');
    const fumLbl = document.getElementById('dFumanteLabel');
    fumChk.addEventListener('change', () => { fumLbl.textContent = fumChk.checked ? 'Sim' : 'Não'; saveState(); });

    ['dPatientId', 'dIdade'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('input', () => setTimeout(saveState, 100));
    });
    document.getElementById('dSexo').addEventListener('change', () => saveState());

    // Symptom search
    document.getElementById('sintomaSearch').addEventListener('input', (e) => renderPool(e.target.value));

    // Drop zone
    const target = document.getElementById('sintomasTarget');
    target.addEventListener('dragover', (e) => { e.preventDefault(); target.classList.add('drag-over'); });
    target.addEventListener('dragleave', () => target.classList.remove('drag-over'));
    target.addEventListener('drop', (e) => {
      e.preventDefault();
      target.classList.remove('drag-over');
      selectSintoma(e.dataTransfer.getData('text/plain'));
    });

    const pool = document.getElementById('sintomasPool');
    pool.addEventListener('dragover', (e) => e.preventDefault());
    pool.addEventListener('drop', (e) => {
      e.preventDefault();
      if (e.dataTransfer.getData('source') === 'selected')
        deselectSintoma(e.dataTransfer.getData('text/plain'));
    });

    // Buttons
    document.getElementById('btnInfer').addEventListener('click', doInfer);
    document.getElementById('btnIngest').addEventListener('click', doIngest);
    document.getElementById('btnClear').addEventListener('click', doClear);
  }

  /* ---- Inference ---- */
  let lastInferResult = null;

  async function doInfer() {
    if (!selectedSintomas.length) {
      Components.toast('Selecione ao menos um sintoma', 'error');
      return;
    }

    const fumante = document.getElementById('dFumante').checked;
    const idade = parseInt(document.getElementById('dIdade').value, 10) || 0;

    // Loading
    const aiContent = document.getElementById('aiContent');
    aiContent.className = 'ai-content loading';
    aiContent.innerHTML = 'Consultando ontologia <span class="ai-pulse"></span>';

    const resultsDiv = document.getElementById('inferResults');
    const cardsDiv = document.getElementById('inferCards');
    cardsDiv.innerHTML = Components.skeleton(3);
    resultsDiv.style.display = 'block';

    try {
      const data = await API.infer(selectedSintomas.join(','), fumante, idade);
      lastInferResult = data;

      if (!data.diagnosticos.length) {
        cardsDiv.innerHTML = '<div class="empty-state"><div class="empty-icon">🔍</div><div class="empty-text">Nenhuma doença correspondente encontrada. Tente selecionar mais sintomas.</div></div>';
        aiContent.className = 'ai-content';
        aiContent.textContent = 'Nenhum diagnóstico encontrado para os sintomas selecionados.';
        return;
      }

      // Render inference result cards
      cardsDiv.innerHTML = data.diagnosticos.map((d, i) => {
        const isTop = i === 0;
        const barColor = d.probabilidade >= 70 ? 'var(--success)' :
          d.probabilidade >= 40 ? 'var(--warning)' : 'var(--info)';
        return `
          <div class="infer-card ${isTop ? 'infer-card-top' : ''}" style="animation-delay:${i * .06}s" data-idx="${i}">
            <div class="infer-header">
              <div class="infer-disease">
                <span class="infer-emoji">${Components.emoji(d.doenca)}</span>
                <span class="infer-name">${Components.formatLocalName(d.doenca)}</span>
                ${isTop ? '<span class="infer-badge-top">Mais Provável</span>' : ''}
              </div>
              <div class="infer-prob">${d.probabilidade}%</div>
            </div>
            <div class="infer-bar-track">
              <div class="infer-bar-fill" style="width:${d.probabilidade}%;background:${barColor}"></div>
            </div>
            <div class="infer-details">
              <div class="infer-detail-row">
                <span class="infer-detail-label">🩺 Sintomas coincidentes</span>
                <span class="infer-detail-value">${d.sintomas_coincidentes.map(s => `<span class="tag tag-info">${Components.emojiLabel(s)}</span>`).join(' ')}</span>
              </div>
              <div class="infer-detail-row">
                <span class="infer-detail-label">🔬 Exame sugerido</span>
                <span class="infer-detail-value">${d.exame_sugerido.map(e => `<span class="tag tag-primary">${Components.emojiLabel(e)}</span>`).join(' ') || '—'}</span>
              </div>
              <div class="infer-detail-row">
                <span class="infer-detail-label">💊 Tratamento</span>
                <span class="infer-detail-value">${d.tratamento_sugerido.map(t => `<span class="tag tag-success">${Components.emojiLabel(t)}</span>`).join(' ') || '—'}</span>
              </div>
              ${d.fatores_risco.length ? `
              <div class="infer-detail-row">
                <span class="infer-detail-label">⚠️ Fatores de risco</span>
                <span class="infer-detail-value">${d.fatores_risco.map(f => `<span class="tag tag-warning">${Components.emojiLabel(f)}</span>`).join(' ')}</span>
              </div>` : ''}
            </div>
            ${isTop ? `<button class="btn btn-sm btn-primary infer-select-btn" data-idx="${i}">✅ Selecionar este diagnóstico</button>` : ''}
          </div>`;
      }).join('');

      // Show register button for top result
      document.getElementById('btnIngest').style.display = 'inline-flex';

      // Animate bars
      requestAnimationFrame(() => {
        cardsDiv.querySelectorAll('.infer-bar-fill').forEach(bar => {
          const w = bar.style.width;
          bar.style.width = '0%';
          requestAnimationFrame(() => { bar.style.width = w; });
        });
      });

      // Selection buttons
      cardsDiv.querySelectorAll('.infer-select-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const idx = parseInt(btn.dataset.idx);
          selectDiagnosis(data.diagnosticos[idx]);
        });
      });

      // Update count
      document.getElementById('inferCount').textContent = `${data.diagnosticos.length} resultado${data.diagnosticos.length > 1 ? 's' : ''}`;

      // Generate AI analysis from top result
      generateAIText(data);
      Components.toast(`${data.diagnosticos.length} diagnóstico(s) inferido(s)`, 'success');

    } catch (e) {
      cardsDiv.innerHTML = `<div class="empty-state"><div class="empty-icon">⚠️</div><div class="empty-text">Erro ao inferir: ${e.message}</div></div>`;
      aiContent.className = 'ai-content';
      aiContent.textContent = 'Erro ao conectar com a API de inferência.';
    }
  }

  function selectDiagnosis(d) {
    Components.toast(`Diagnóstico selecionado: ${Components.formatLocalName(d.doenca)}`, 'info');
    // Highlight the selected card
    document.querySelectorAll('.infer-card').forEach(c => c.classList.remove('infer-card-selected'));
    document.querySelector(`.infer-card[data-idx="${lastInferResult.diagnosticos.indexOf(d)}"]`)?.classList.add('infer-card-selected');
  }

  /* ---- AI Analysis ---- */
  function generateAIText(data) {
    const aiContent = document.getElementById('aiContent');
    const patientId = document.getElementById('dPatientId').value.trim() || 'Paciente';
    const idade = document.getElementById('dIdade').value || '?';
    const sexo = document.getElementById('dSexo').value;
    const fumante = document.getElementById('dFumante').checked;
    const sexoText = sexo === 'M' ? 'masculino' : sexo === 'F' ? 'feminino' : 'não informado';
    const fumanteText = fumante ? 'Sim (fator de risco: Tabagismo)' : 'Não';
    const sintomasText = selectedSintomas.map(Components.formatLocalName).join(', ');

    const top = data.diagnosticos[0];
    const others = data.diagnosticos.slice(1, 4);

    let differentialText = '';
    if (others.length) {
      differentialText = '\n\n🔄 DIAGNÓSTICO DIFERENCIAL:\n' +
        others.map(d => `  • ${Components.formatLocalName(d.doenca)}: ${d.probabilidade}% — ${d.sintomas_coincidentes.length} sintoma(s) coincidente(s)`).join('\n');
    }

    let riskText = '';
    if (top.fatores_risco.length) {
      riskText = '\n\n⚠️ FATORES DE RISCO IDENTIFICADOS:\n' +
        top.fatores_risco.map(f => `  • ${Components.formatLocalName(f)}`).join('\n');
    }

    const analysis = `📋 RELATÓRIO DE INFERÊNCIA SEMÂNTICA — ODSDR v2.0.0

👤 DADOS DO PACIENTE:
  • ID: ${patientId}
  • Idade: ${idade} anos | Sexo: ${sexoText}
  • Fumante: ${fumanteText}

🩺 SINTOMAS APRESENTADOS (${selectedSintomas.length}):
  • ${sintomasText}

🎯 DIAGNÓSTICO MAIS PROVÁVEL:
  • ${Components.formatLocalName(top.doenca)} — ${top.probabilidade}% de compatibilidade
  • Sintomas coincidentes: ${top.sintomas_coincidentes.map(Components.formatLocalName).join(', ')}

🔬 EXAME SUGERIDO:
  • ${top.exame_sugerido.map(Components.formatLocalName).join(', ') || 'Nenhum definido'}

💊 TRATAMENTO SUGERIDO:
  • ${top.tratamento_sugerido.map(Components.formatLocalName).join(', ') || 'Nenhum definido'}
${differentialText}${riskText}

📊 CONCLUSÃO:
Com base nos ${selectedSintomas.length} sintoma(s) e na ontologia ODSDR v2.0.0 (10 doenças, 17 sintomas), a condição ${Components.formatLocalName(top.doenca)} apresenta a maior compatibilidade (${top.probabilidade}%). ${others.length ? `Foram identificados ${others.length} diagnóstico(s) diferencial(is).` : ''} O raciocínio semântico utilizou a propriedade "provoca" e fatores de risco para correlacionar entidades clínicas.

⏱ Análise gerada em ${new Date().toLocaleString('pt-BR')}`;

    // Typewriter effect
    aiContent.className = 'ai-content';
    aiContent.textContent = '';
    let idx = 0;
    function typeChar() {
      if (idx < analysis.length) {
        aiContent.textContent += analysis[idx];
        idx++;
        setTimeout(typeChar, idx < 20 ? 15 : 3);
      }
    }
    typeChar();
  }

  /* ---- Ingest (register case from inference) ---- */
  async function doIngest() {
    if (!lastInferResult || !lastInferResult.diagnosticos.length) {
      Components.toast('Execute a inferência primeiro', 'error');
      return;
    }

    const patientId = document.getElementById('dPatientId').value.trim();
    const idade = parseInt(document.getElementById('dIdade').value, 10);
    const sexo = document.getElementById('dSexo').value;
    const fumante = document.getElementById('dFumante').checked;

    if (!patientId) return Components.toast('Informe o ID do paciente', 'error');
    if (isNaN(idade) || idade < 0 || idade > 130) return Components.toast('Idade inválida (0–130)', 'error');
    if (!sexo) return Components.toast('Selecione o sexo', 'error');

    const top = lastInferResult.diagnosticos[0];

    const payload = {
      patient_id: patientId,
      diagnostico_id: patientId,
      idade, sexo, fumante,
      sintomas: selectedSintomas,
      exame: top.exame_sugerido[0] || 'Hemograma',
      doenca: top.doenca,
      tratamento: top.tratamento_sugerido[0] || 'Hidratacao',
      profissional: null,
      data_diagnostico: new Date().toISOString().split('T')[0],
    };

    try {
      const res = await API.ingestCase(payload);
      Components.toast(`Caso registrado: ${Components.shortName(res.patient)}`, 'success');
    } catch (e) {
      Components.toast(`Erro: ${e.message}`, 'error');
    }
  }

  /* ---- Clear ---- */
  function doClear() {
    document.getElementById('dPatientId').value = '';
    document.getElementById('dIdade').value = '';
    document.getElementById('dSexo').value = '';
    document.getElementById('dFumante').checked = false;
    document.getElementById('dFumanteLabel').textContent = 'Não';
    selectedSintomas = [];
    lastInferResult = null;
    saveState();
    renderPool('');
    renderSelected();
    document.getElementById('inferResults').style.display = 'none';
    document.getElementById('btnIngest').style.display = 'none';
    document.getElementById('aiContent').className = 'ai-content';
    document.getElementById('aiContent').textContent =
      'Selecione sintomas e clique em "Inferir Diagnóstico" para receber sugestões baseadas na ontologia.';
    Components.toast('Formulário limpo', 'info');
  }

  return { render };
})();
