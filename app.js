class ClinicApp {
    constructor() {
        this.currentView = null;
        this.loadedScripts = new Set();
        this.viewConfig = {
            specialties: { title: 'Especialidades - Sistema de Gestão de Clínica' },
            clinicians: { title: 'Clínicos - Sistema de Gestão de Clínica' },
            places: { title: 'Locais - Sistema de Gestão de Clínica' }
        };
        this.init();
    }

    init() {
        // Handle hash changes and browser navigation
        window.addEventListener('hashchange', () => this.handleUrlChange());
        window.addEventListener('popstate', () => this.handleUrlChange());
        this.setupNavigation();
        this.handleUrlChange();
    }

    setupNavigation() {
        // Enhance navigation links with SPA behavior while preserving natural href functionality
        document.querySelectorAll('[data-view]').forEach(link => {
            link.addEventListener('click', (e) => {
                // Only handle if it's a normal left-click without modifier keys
                if (e.button === 0 && !e.ctrlKey && !e.metaKey && !e.shiftKey) {
                    // Let the browser handle the hash navigation naturally
                    // The hashchange event will trigger our SPA loading
                }
            });
        });
    }

    navigateTo(view) {
        // Update URL hash - this will trigger hashchange event
        window.location.hash = view;
    }

    handleUrlChange() {
        // Get view from URL hash, default to specialties
        const hash = window.location.hash.slice(1); // Remove #
        const view = hash || 'specialties';
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
            console.error('Erro ao carregar vista:', error);
            this.showError('Erro ao carregar a página. Tente novamente.');
        }
    }

    async loadContent(view) {
        const response = await fetch(`${view}/content.html`);
        if (!response.ok) {
            throw new Error(`Falha ao carregar conteúdo de ${view}`);
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
        const viewConfig = this.viewConfig[view];
        document.title = viewConfig?.title || 'Sistema de Gestão de Clínica';
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