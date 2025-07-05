// Main Application Logic and Navigation
class ClinicApp {
    constructor() {
        this.currentPage = 'dashboard';
        this.loadedScripts = new Set();
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

            // Update page title
            const pageTitle = document.getElementById('page-title');
            pageTitle.textContent = this.getPageTitle(page);

            // Update content area
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

    getPageTitle(page) {
        const titles = {
            'dashboard': 'Painel Principal',
            'patients': 'Pacientes',
            'appointments': 'Consultas',
            'doctors': 'Médicos',
            'specialties': 'Especialidades',
            'reports': 'Relatórios'
        };
        return titles[page] || 'Painel Principal';
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

            // Load page-specific JavaScript if not already loaded
            await this.loadPageScript(page);
            
        } catch (error) {
            console.error('Error loading page content:', error);
            contentArea.innerHTML = `
                <div class="error-message">
                    <h2>Erro ao Carregar Página</h2>
                    <p>Não foi possível carregar o conteúdo da página. Por favor, tente novamente.</p>
                    <button onclick="app.navigateTo('${page}')">Tentar Novamente</button>
                </div>
            `;
        }
    }

    async loadPageScript(page) {
        const scriptId = `script-${page}`;
        
        // Check if script is already loaded
        if (this.loadedScripts.has(page)) {
            return;
        }

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
                    this.loadedScripts.add(page);
                    resolve();
                };
                script.onerror = () => {
                    reject(new Error(`Failed to load ${page}.js`));
                };
                document.head.appendChild(script);
            });
        } catch (error) {
            console.error(`Error loading script for ${page}:`, error);
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

    showError(message) {
        const contentArea = document.getElementById('content-area');
        contentArea.innerHTML = `
            <div class="error-message">
                <h2>Erro</h2>
                <p>${message}</p>
            </div>
        `;
    }

    // Legacy method support for backward compatibility
    showAddPatientForm() {
        if (window.showAddPatientForm) {
            window.showAddPatientForm();
        } else {
            alert('Formulário de adicionar paciente será implementado em tarefas futuras');
        }
    }

    showAddAppointmentForm() {
        if (window.showAddAppointmentForm) {
            window.showAddAppointmentForm();
        } else {
            alert('Formulário de agendar consulta será implementado em tarefas futuras');
        }
    }

    showAddDoctorForm() {
        if (window.showAddDoctorForm) {
            window.showAddDoctorForm();
        } else {
            alert('Formulário de adicionar médico será implementado em tarefas futuras');
        }
    }

    showAddSpecialtyForm() {
        if (window.showAddSpecialtyForm) {
            window.showAddSpecialtyForm();
        } else {
            alert('Formulário de adicionar especialidade será implementado em tarefas futuras');
        }
    }

    cancelAddSpecialty() {
        if (window.cancelAddSpecialty) {
            window.cancelAddSpecialty();
        }
    }

    searchPatients() {
        if (window.searchPatients) {
            window.searchPatients();
        } else {
            alert('Pesquisa de pacientes será implementada em tarefas futuras');
        }
    }

    searchAppointments() {
        if (window.searchAppointments) {
            window.searchAppointments();
        } else {
            alert('Pesquisa de consultas será implementada em tarefas futuras');
        }
    }

    searchDoctors() {
        if (window.searchDoctors) {
            window.searchDoctors();
        } else {
            alert('Pesquisa de médicos será implementada em tarefas futuras');
        }
    }

    searchSpecialties() {
        if (window.searchSpecialties) {
            window.searchSpecialties();
        } else {
            alert('Pesquisa de especialidades será implementada em tarefas futuras');
        }
    }

    generateReport() {
        if (window.generateReport) {
            window.generateReport();
        } else {
            alert('Geração de relatórios será implementada em tarefas futuras');
        }
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