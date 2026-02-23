/* ============================================================
   Reusable UI Components
   ============================================================ */
const Components = (() => {

    /* ---- Emoji Map for Symptoms & Entities ---- */
    const EMOJI = {
        // Sintomas (17)
        'Tosse': '🤧',
        'Febre': '🌡️',
        'FaltaDeAr': '😮‍💨',
        'ChiadoNoPeito': '🫁',
        'SudoreseNoturna': '🌙',
        'PerdaDePeso': '📉',
        'Hemoptise': '🩸',
        'ExpectoracaoCronica': '💧',
        'DorDeCabeca': '🤕',
        'DorNoCorpo': '😣',
        'Calafrios': '🥶',
        'DorFacial': '😖',
        'CongestaoNasal': '🤧',
        'DorToracica': '💔',
        'Taquicardia': '💓',
        'Rouquidao': '🗣️',
        'DorDeGarganta': '😫',
        // Doenças (10)
        'Pneumonia': '🦠',
        'Asma': '💨',
        'Bronquite': '😷',
        'COVID19': '🧬',
        'Tuberculose': '🔴',
        'DPOC': '🫁',
        'Gripe': '🤒',
        'Sinusite': '👃',
        'EmboliaPulmonar': '🫀',
        'Laringite': '🗣️',
        // Exames (9)
        'RaioXTorax': '🩻',
        'PCR': '🧪',
        'Espirometria': '🔬',
        'BaciloscopiaBK': '🔬',
        'TesteRapidoInfluenza': '🧪',
        'TomografiaDosSeios': '🩻',
        'AngiotomografiaPulmonar': '🩻',
        'LaringoscopiaIndireta': '🔍',
        'Hemograma': '🩸',
        // Tratamentos (7)
        'Antibiotico': '💊',
        'Broncodilatador': '💉',
        'Hidratacao': '💧',
        'Rifampicina': '💊',
        'Oseltamivir': '💊',
        'Anticoagulante': '💉',
        'AntiInflamatorio': '💊',
        'Medicamento': '💊',
        // Fatores de Risco (5)
        'Tabagismo': '🚬',
        'IdadeAvancada': '👴',
        'ComorbidadePulmonar': '⚠️',
        'Imunossupressao': '🛡️',
        'PoluicaoDoAr': '🏭',
        // Anatomia (4)
        'Pulmoes': '🫁',
        'Bronquios': '🫁',
        'SeiosParanasais': '👃',
        'Laringe': '🗣️',
        // Profissionais
        'MedicaAna': '👩‍⚕️',
        'MedicoBruno': '👨‍⚕️',
        'MedicaCarla': '👩‍⚕️',
        // Genéricos
        'Paciente': '🧑',
        'Doenca': '🦠',
        'Sintoma': '🩺',
        'Exame': '🔬',
        'Tratamento': '💊',
        'FatorRisco': '⚠️',
    };

    function emoji(name) {
        return EMOJI[name] || '';
    }

    function emojiLabel(name) {
        const e = emoji(name);
        const label = formatLocalName(name);
        return e ? `${e} ${label}` : label;
    }

    /* ---- Toast ---- */
    function toast(message, type = 'info') {
        const container = document.getElementById('toasts');
        const el = document.createElement('div');
        el.className = `toast toast-${type}`;
        el.textContent = message;
        container.appendChild(el);
        setTimeout(() => { el.style.opacity = '0'; setTimeout(() => el.remove(), 300); }, 4000);
    }

    /* ---- Metric Card ---- */
    function metricCard(label, value, icon, color = 'purple') {
        return `
      <div class="metric-card">
        <div class="metric-icon ${color}">${icon}</div>
        <div class="metric-label">${label}</div>
        <div class="metric-value">${value}</div>
      </div>`;
    }

    /* ---- Data Table ---- */
    function dataTable(columns, rows, options = {}) {
        if (!rows.length) {
            return `<div class="empty-state"><div class="empty-icon">📭</div><div class="empty-text">Sem resultados</div></div>`;
        }
        const ths = columns.map(c => `<th>${c.label}</th>`).join('');
        const tds = rows.map(row => {
            const cells = columns.map(c => `<td>${c.render ? c.render(row) : escapeHtml(String(row[c.key] ?? ''))}</td>`).join('');
            return `<tr>${cells}</tr>`;
        }).join('');
        return `<div class="table-wrapper"><table class="table"><thead><tr>${ths}</tr></thead><tbody>${tds}</tbody></table></div>`;
    }

    /* ---- Tags with Emoji ---- */
    function tagList(items, cls = 'tag-primary') {
        if (!items || !items.length) return '<span style="color:var(--text-3)">—</span>';
        return items.map(i => {
            const name = shortName(i);
            return `<span class="tag ${cls}">${emojiLabel(name)}</span>`;
        }).join(' ');
    }

    /* ---- Skeleton ---- */
    function skeleton(lines = 3) {
        return Array.from({ length: lines }, (_, i) =>
            `<div class="skeleton skeleton-line" style="width:${70 + Math.random() * 30}%"></div>`
        ).join('');
    }

    /* ---- Helpers ---- */
    function shortName(uri) {
        if (typeof uri !== 'string') return uri;
        const idx = uri.lastIndexOf(':');
        return idx >= 0 ? uri.substring(idx + 1) : uri;
    }

    function escapeHtml(s) {
        const d = document.createElement('div');
        d.textContent = s;
        return d.innerHTML;
    }

    function formatLocalName(name) {
        return name.replace(/([A-Z])/g, ' $1').replace(/^[\s]/, '').trim();
    }

    return { toast, metricCard, dataTable, tagList, skeleton, shortName, escapeHtml, formatLocalName, emoji, emojiLabel, EMOJI };
})();
