class ClinicApp {
    constructor() {
        this.currentView = null;
        this.loadedScripts = new Set();
        this.init();
    }

    init() {
        // Handle initial load and URL changes
        window.addEventListener('popstate', () => this.handleUrlChange());
        this.setupNavigation();
        this.handleUrlChange();
    }

    setupNavigation() {
        // Set up navigation click handlers
        document.querySelectorAll('[data-view]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const view = link.getAttribute('data-view');
                this.navigateTo(view);
            });
        });
    }

    navigateTo(view) {
        // Update URL without page reload
        history.pushState({ view }, '', `#${view}`);
        this.loadView(view);
    }

    handleUrlChange() {
        // Get view from URL hash, default to dashboard
        const hash = window.location.hash.slice(1); // Remove #
        const view = hash || 'dashboard';
        this.loadView(view);
    }

    async loadView(view) {
        try {
            // Update active navigation
            this.updateActiveNavigation(view);
            
            // Load content
            const content = await this.loadContent(view);
            
            // Update main content
            document.getElementById('main-content').innerHTML = content;
            
            // Load view-specific script
            await this.loadViewScript(view);
            
            // Update page title
            this.updatePageTitle(view);
            
            this.currentView = view;
        } catch (error) {
            console.error('Error loading view:', error);
            this.showError('Erro ao carregar a página. Tente novamente.');
        }
    }

    async loadContent(view) {
        const response = await fetch(`${view}/content.html`);
        if (!response.ok) {
            throw new Error(`Failed to load ${view} content`);
        }
        return await response.text();
    }

    async loadViewScript(view) {
        const scriptPath = `${view}/${view}.js`;
        
        // Check if script already loaded
        if (this.loadedScripts.has(scriptPath)) {
            return;
        }

        try {
            const response = await fetch(scriptPath);
            if (response.ok) {
                const scriptContent = await response.text();
                const script = document.createElement('script');
                script.textContent = scriptContent;
                document.head.appendChild(script);
                this.loadedScripts.add(scriptPath);
            }
        } catch (error) {
            console.warn(`Could not load script for ${view}:`, error);
        }
    }

    updateActiveNavigation(view) {
        // Remove active class from all nav items
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.classList.remove('active');
        });
        
        // Add active class to current view
        const currentLink = document.querySelector(`[data-view="${view}"]`);
        if (currentLink) {
            currentLink.classList.add('active');
        }
    }

    updatePageTitle(view) {
        const titles = {
            dashboard: 'Painel Principal - Sistema de Gestão de Clínica',
            patients: 'Pacientes - Sistema de Gestão de Clínica',
            appointments: 'Consultas - Sistema de Gestão de Clínica',
            doctors: 'Médicos - Sistema de Gestão de Clínica',
            specialties: 'Especialidades - Sistema de Gestão de Clínica',
            reports: 'Relatórios - Sistema de Gestão de Clínica'
        };
        
        document.title = titles[view] || 'Sistema de Gestão de Clínica';
    }

    showError(message) {
        document.getElementById('main-content').innerHTML = `
            <div class="error-message">
                <h2>Erro</h2>
                <p>${message}</p>
            </div>
        `;
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new ClinicApp();
});