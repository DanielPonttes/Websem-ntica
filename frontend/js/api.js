/* ============================================================
   API Client — ODSDR Semantic API
   ============================================================ */
const API = (() => {
    const BASE = 'http://localhost:8000/api';

    async function request(path, options = {}) {
        const url = `${BASE}${path}`;
        try {
            const res = await fetch(url, options);
            if (!res.ok) {
                const body = await res.text();
                throw new Error(`HTTP ${res.status}: ${body}`);
            }
            const ct = res.headers.get('content-type') || '';
            if (ct.includes('application/json')) return res.json();
            return res.text();
        } catch (err) {
            console.error(`[API] ${options.method || 'GET'} ${url}`, err);
            throw err;
        }
    }

    return {
        health: () => request('/health'),
        patients: () => request('/patients'),
        ontologySummary: () => request('/ontology/summary'),
        entities: (cls) => request(`/entities/${cls}`),
        queries: () => request('/queries'),
        runQuery: (name, fmt = 'json') => request(`/queries/${name}?format=${fmt}`),
        ingestCase: (data) => request('/cases', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        }),
        exportGraph: (fmt = 'turtle') => request(`/export?format=${fmt}`),
        infer: (sintomas, fumante = false, idade = 0) =>
            request(`/infer?sintomas=${encodeURIComponent(sintomas)}&fumante=${fumante}&idade=${idade}`),
    };
})();
