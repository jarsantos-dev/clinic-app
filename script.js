// Master Layout JavaScript
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

    navigateTo(page) {
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
        this.loadPageContent(page);
        
        // Update current page
        this.currentPage = page;
        
        // Save current page to localStorage
        localStorage.setItem('currentPage', page);
    }

    getPageTitle(page) {
        const titles = {
            'dashboard': 'Painel de Controlo',
            'patients': 'Doentes',
            'appointments': 'Consultas',
            'doctors': 'Médicos',
            'specialties': 'Especialidades',
            'reports': 'Relatórios'
        };
        return titles[page] || 'Painel de Controlo';
    }

    loadPageContent(page) {
        const contentArea = document.getElementById('content-area');
        contentArea.innerHTML = this.getPageContent(page);
    }

    getPageContent(page) {
        switch(page) {
            case 'dashboard':
                return this.getDashboardContent();
            case 'patients':
                return this.getPatientsContent();
            case 'appointments':
                return this.getAppointmentsContent();
            case 'doctors':
                return this.getDoctorsContent();
            case 'specialties':
                return this.getSpecialtiesContent();
            case 'reports':
                return this.getReportsContent();
            default:
                return this.getDashboardContent();
        }
    }

    getDashboardContent() {
        return `
            <div class="welcome-message">
                <h2>Bem-vindo ao Sistema de Gestão de Clínica</h2>
                <p>O seu painel de gestão de clínica</p>
            </div>
            <div class="card-grid">
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">Consultas de Hoje</h3>
                    </div>
                    <p>Ver e gerir as consultas de hoje</p>
                </div>
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">Registos de Doentes</h3>
                    </div>
                    <p>Aceder a informações e histórico de doentes</p>
                </div>
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">Ações Rápidas</h3>
                    </div>
                    <p>Executar tarefas comuns da clínica</p>
                </div>
            </div>
        `;
    }

    getPatientsContent() {
        return `
            <div class="list-header">
                <h2>Gestão de Doentes</h2>
                <button onclick="app.showAddPatientForm()">Adicionar Novo Doente</button>
            </div>
            <div class="search-container">
                <input type="text" placeholder="Pesquisar doentes..." id="patient-search">
                <button onclick="app.searchPatients()">Pesquisar</button>
            </div>
            <div id="patients-list">
                <p>A lista de doentes será exibida aqui...</p>
            </div>
        `;
    }

    getAppointmentsContent() {
        return `
            <div class="list-header">
                <h2>Gestão de Consultas</h2>
                <button onclick="app.showAddAppointmentForm()">Agendar Consulta</button>
            </div>
            <div class="search-container">
                <input type="text" placeholder="Pesquisar consultas..." id="appointment-search">
                <button onclick="app.searchAppointments()">Pesquisar</button>
            </div>
            <div id="appointments-list">
                <p>A lista de consultas será exibida aqui...</p>
            </div>
        `;
    }

    getDoctorsContent() {
        return `
            <div class="list-header">
                <h2>Gestão de Médicos</h2>
                <button onclick="app.showAddDoctorForm()">Adicionar Novo Médico</button>
            </div>
            <div class="search-container">
                <input type="text" placeholder="Pesquisar médicos..." id="doctor-search">
                <button onclick="app.searchDoctors()">Pesquisar</button>
            </div>
            <div id="doctors-list">
                <p>A lista de médicos será exibida aqui...</p>
            </div>
        `;
    }

    getSpecialtiesContent() {
        return `
            <div class="list-header">
                <h2>Gestão de Especialidades</h2>
                <button onclick="app.showAddSpecialtyForm()">Adicionar Nova Especialidade</button>
            </div>
            <div class="search-container">
                <input type="text" placeholder="Pesquisar especialidades..." id="specialty-search">
                <button onclick="app.searchSpecialties()">Pesquisar</button>
            </div>
            <div id="specialties-list">
                <p>A lista de especialidades será exibida aqui...</p>
            </div>
        `;
    }

    getReportsContent() {
        return `
            <div class="list-header">
                <h2>Relatórios e Análises</h2>
                <button onclick="app.generateReport()">Gerar Relatório</button>
            </div>
            <div class="card-grid">
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">Estatísticas Mensais</h3>
                    </div>
                    <p>Ver estatísticas mensais da clínica</p>
                </div>
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">Relatórios de Doentes</h3>
                    </div>
                    <p>Gerar relatórios relacionados com doentes</p>
                </div>
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">Relatórios Financeiros</h3>
                    </div>
                    <p>Ver resumos financeiros</p>
                </div>
            </div>
        `;
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

    // Placeholder methods for future implementation
    showAddPatientForm() {
        alert('O formulário Adicionar Doente será implementado em tarefas futuras');
    }

    showAddAppointmentForm() {
        alert('O formulário Adicionar Consulta será implementado em tarefas futuras');
    }

    showAddDoctorForm() {
        alert('O formulário Adicionar Médico será implementado em tarefas futuras');
    }

    showAddSpecialtyForm() {
        alert('O formulário Adicionar Especialidade será implementado em tarefas futuras');
    }

    generateReport() {
        alert('A geração de relatórios será implementada em tarefas futuras');
    }

    searchPatients() {
        alert('A pesquisa de doentes será implementada em tarefas futuras');
    }

    searchAppointments() {
        alert('A pesquisa de consultas será implementada em tarefas futuras');
    }

    searchDoctors() {
        alert('A pesquisa de médicos será implementada em tarefas futuras');
    }

    searchSpecialties() {
        alert('A pesquisa de especialidades será implementada em tarefas futuras');
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