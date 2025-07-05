// Main Application Logic and Navigation
class ClinicApp {
    constructor() {
        this.currentPage = 'dashboard';
        this.init();
    }

    init() {
        this.setupNavigation();
        this.loadInitialData();
        this.setupEventListeners();
    }

    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-menu a');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = link.getAttribute('data-page');
                this.navigateTo(page);
            });
        });
    }

    async navigateTo(page) {
        try {
            // Remove active class from all nav links
            document.querySelectorAll('.nav-menu a').forEach(link => {
                link.classList.remove('active');
            });

            // Add active class to clicked link
            document.querySelector(`[data-page="${page}"]`).classList.add('active');

            // Load content (the page will set its own title)
            await this.loadPageContent(page);
            
            // Update current page
            this.currentPage = page;
            
            // Save current page to localStorage
            localStorage.setItem('currentPage', page);
        } catch (error) {
            console.error('Error navigating to page:', error);
            this.showError('Erro ao carregar a página. Por favor, tente novamente.');
        }
    }

    async loadPageContent(page) {
        const contentArea = document.getElementById('content-area');
        
        try {
            // Load HTML content
            const response = await fetch(`${page}/${page}.html`);
            if (!response.ok) {
                throw new Error(`Failed to load ${page}.html: ${response.status}`);
            }
            const html = await response.text();
            contentArea.innerHTML = html;

            // Load page-specific JavaScript
            await this.loadPageScript(page);
            
        } catch (error) {
            console.error('Error loading page content:', error);
            this.showError('Erro ao carregar a página. Por favor, tente novamente.', page);
        }
    }

    async loadPageScript(page) {
        const scriptId = `script-${page}`;
        
        try {
            // Remove existing script if present
            const existingScript = document.getElementById(scriptId);
            if (existingScript) {
                existingScript.remove();
            }

            // Create and load new script
            const script = document.createElement('script');
            script.id = scriptId;
            script.src = `${page}/${page}.js`;
            
            return new Promise((resolve, reject) => {
                script.onload = () => {
                    resolve();
                };
                script.onerror = () => {
                    // Script loading failed, but don't break the page
                    console.warn(`Failed to load ${page}.js`);
                    resolve();
                };
                document.head.appendChild(script);
            });
        } catch (error) {
            console.error(`Error loading script for ${page}:`, error);
        }
    }

    async showError(message, page = 'dashboard') {
        const contentArea = document.getElementById('content-area');
        try {
            const response = await fetch('shared/error.html');
            if (response.ok) {
                let errorHtml = await response.text();
                errorHtml = errorHtml.replace('{page}', page);
                contentArea.innerHTML = errorHtml;
            } else {
                // Fallback error message
                contentArea.innerHTML = `
                    <div class="error-message">
                        <h2>Erro</h2>
                        <p>${message}</p>
                    </div>
                `;
            }
        } catch (error) {
            // Fallback error message
            contentArea.innerHTML = `
                <div class="error-message">
                    <h2>Erro</h2>
                    <p>${message}</p>
                </div>
            `;
        }
    }

    setupEventListeners() {
        // Add any global event listeners here
        window.addEventListener('beforeunload', () => {
            // Save any unsaved data before page unload
            localStorage.setItem('lastVisit', new Date().toISOString());
        });
    }

    loadInitialData() {
        // Load saved page from localStorage
        const savedPage = localStorage.getItem('currentPage') || 'dashboard';
        this.navigateTo(savedPage);
    }

}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new ClinicApp();
});

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ClinicApp;
}