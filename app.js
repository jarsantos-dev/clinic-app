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

            // Load content (the page will set its own title and load its own scripts)
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

            // Execute inline scripts manually since innerHTML doesn't execute them
            this.executeInlineScripts(contentArea);

            // Look for data-view-script attribute to load external scripts
            this.loadViewScripts(contentArea);
            
        } catch (error) {
            console.error('Error loading page content:', error);
            this.showError('Erro ao carregar a página. Por favor, tente novamente.', page);
        }
    }

    executeInlineScripts(container) {
        const scripts = container.querySelectorAll('script:not([src])');
        scripts.forEach(script => {
            try {
                eval(script.textContent);
            } catch (error) {
                console.error('Error executing inline script:', error);
            }
        });
    }

    loadViewScripts(container) {
        const scriptElements = container.querySelectorAll('[data-view-script]');
        scriptElements.forEach(element => {
            const scriptSrc = element.getAttribute('data-view-script');
            if (scriptSrc) {
                this.loadScript(scriptSrc).then(() => {
                    // Initialize the view after script loads
                    this.initializeViewAfterScript(scriptSrc);
                });
            }
        });
    }

    loadScript(src) {
        return new Promise((resolve, reject) => {
            // Check if script is already loaded
            const existingScript = document.querySelector(`script[src="${src}"]`);
            if (existingScript) {
                console.log(`Script already loaded: ${src}`);
                resolve();
                return;
            }

            const script = document.createElement('script');
            script.src = src;
            script.onload = () => {
                console.log(`Loaded script: ${src}`);
                resolve();
            };
            script.onerror = () => {
                console.warn(`Failed to load script: ${src}`);
                reject(new Error(`Failed to load ${src}`));
            };
            document.head.appendChild(script);
        });
    }

    initializeViewAfterScript(scriptSrc) {
        // Initialize specific views based on the script that was loaded
        if (scriptSrc.includes('specialties')) {
            setTimeout(() => {
                if (window.specialtiesView && window.specialtiesView.displaySpecialties) {
                    window.specialtiesView.displaySpecialties();
                }
            }, 100);
        }
        // Add other views as needed
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