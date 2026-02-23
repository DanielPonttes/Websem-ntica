/* ============================================================
   SPA Router & Initialization
   ============================================================ */
(() => {
    const routes = {
        '/': DashboardPage,
        '/diagnostico': DiagnosticoPage,
        '/pacientes': PacientesPage,
        '/consultas': ConsultasPage,
    };

    function getHash() {
        return window.location.hash.replace('#', '') || '/';
    }

    async function navigate() {
        const path = getHash();
        const page = routes[path] || routes['/'];
        const container = document.getElementById('app');

        // Update active nav link
        document.querySelectorAll('.nav-link').forEach(link => {
            const href = link.getAttribute('href').replace('#', '');
            link.classList.toggle('active', href === path);
        });

        await page.render(container);
    }

    window.addEventListener('hashchange', navigate);

    /* ---- Theme Toggle ---- */
    function initTheme() {
        const saved = localStorage.getItem('odsdr-theme') || 'dark';
        applyTheme(saved);
    }

    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        const icon = document.getElementById('themeIcon');
        const label = document.getElementById('themeLabel');
        if (icon && label) {
            if (theme === 'light') {
                icon.textContent = '☀️';
                label.textContent = 'Modo Escuro';
            } else {
                icon.textContent = '🌙';
                label.textContent = 'Modo Claro';
            }
        }
        localStorage.setItem('odsdr-theme', theme);
    }

    function toggleTheme() {
        const current = document.documentElement.getAttribute('data-theme') || 'dark';
        applyTheme(current === 'dark' ? 'light' : 'dark');
    }

    /* ---- Health check ---- */
    async function checkHealth() {
        const dot = document.querySelector('.status-dot');
        const text = document.querySelector('.status-text');
        try {
            const data = await API.health();
            dot.className = 'status-dot online';
            text.textContent = `API OK • v${data.ontology_version}`;
        } catch (e) {
            dot.className = 'status-dot offline';
            text.textContent = 'API offline';
        }
    }

    /* ---- Init ---- */
    document.addEventListener('DOMContentLoaded', () => {
        initTheme();
        navigate();
        checkHealth();
        setInterval(checkHealth, 30000);

        // Theme toggle
        document.getElementById('themeToggle').addEventListener('click', toggleTheme);
    });
})();
