// Master Layout JavaScript
class ClinicApp {
    constructor() {
        this.currentPage = 'dashboard';
        this.specialties = this.loadSpecialties();
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
        // Trigger display of specialties after content is loaded
        setTimeout(() => this.displaySpecialties(), 0);
        
        return `
            <div class="list-header">
                <h2>Gestão de Especialidades</h2>
                <button onclick="app.showAddSpecialtyForm()">Adicionar Nova Especialidade</button>
            </div>
            <div class="search-container">
                <input type="text" placeholder="Pesquisar especialidades..." id="specialty-search" oninput="app.searchSpecialties()">
                <button onclick="app.searchSpecialties()">Pesquisar</button>
            </div>
            <div id="add-specialty-form" class="hidden form-container">
                <h3>Adicionar Nova Especialidade</h3>
                <form id="specialty-form">
                    <div>
                        <label for="specialty-name">Nome da Especialidade *</label>
                        <input type="text" id="specialty-name" name="name" required>
                    </div>
                    <div>
                        <label for="specialty-description">Descrição</label>
                        <textarea id="specialty-description" name="description" rows="3"></textarea>
                    </div>
                    <div class="form-actions">
                        <button type="button" onclick="app.cancelAddSpecialty()" class="secondary">Cancelar</button>
                        <button type="submit">Adicionar Especialidade</button>
                    </div>
                </form>
                <div id="form-message" class="hidden"></div>
            </div>
            <div id="specialties-list">
                <p>A carregar especialidades...</p>
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
        const formContainer = document.getElementById('add-specialty-form');
        const form = document.getElementById('specialty-form');
        const messageDiv = document.getElementById('form-message');
        
        if (formContainer && form) {
            // Clear previous form data and messages
            form.reset();
            messageDiv.className = 'hidden';
            messageDiv.textContent = '';
            
            // Show the form
            formContainer.classList.remove('hidden');
            
            // Focus on the name input
            document.getElementById('specialty-name').focus();
            
            // Add form submit handler if not already added
            if (!form.hasAttribute('data-handler-added')) {
                form.addEventListener('submit', (e) => {
                    e.preventDefault();
                    this.handleAddSpecialtySubmit();
                });
                form.setAttribute('data-handler-added', 'true');
            }
        }
    }

    cancelAddSpecialty() {
        const formContainer = document.getElementById('add-specialty-form');
        const form = document.getElementById('specialty-form');
        const messageDiv = document.getElementById('form-message');
        
        if (formContainer) {
            formContainer.classList.add('hidden');
            if (form) form.reset();
            if (messageDiv) {
                messageDiv.className = 'hidden';
                messageDiv.textContent = '';
            }
        }
    }

    handleAddSpecialtySubmit() {
        const nameInput = document.getElementById('specialty-name');
        const descriptionInput = document.getElementById('specialty-description');
        const messageDiv = document.getElementById('form-message');
        
        const name = nameInput.value;
        const description = descriptionInput.value;
        
        const result = this.addSpecialty(name, description);
        
        if (result.success) {
            // Show success message
            messageDiv.textContent = 'Especialidade adicionada com sucesso!';
            messageDiv.className = 'success-message';
            
            // Clear form and hide it after a short delay
            setTimeout(() => {
                this.cancelAddSpecialty();
                this.displaySpecialties();
            }, 1500);
        } else {
            // Show error message
            messageDiv.textContent = result.message;
            messageDiv.className = 'error-message';
        }
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
        const searchTerm = document.getElementById('specialty-search').value.toLowerCase();
        this.displaySpecialties(searchTerm);
    }

    // Specialty Data Management Methods
    loadSpecialties() {
        const stored = localStorage.getItem('specialties');
        if (stored) {
            return JSON.parse(stored);
        }
        // Return some default specialties if none exist
        return [
            { id: 1, name: 'Cardiologia', description: 'Coração e sistema cardiovascular', createdAt: new Date().toISOString() },
            { id: 2, name: 'Dermatologia', description: 'Pele, cabelo e unhas', createdAt: new Date().toISOString() },
            { id: 3, name: 'Pediatria', description: 'Cuidados médicos para crianças', createdAt: new Date().toISOString() }
        ];
    }

    saveSpecialties() {
        localStorage.setItem('specialties', JSON.stringify(this.specialties));
    }

    addSpecialty(name, description = '') {
        if (!name || name.trim() === '') {
            return { success: false, message: 'Nome da especialidade é obrigatório' };
        }

        // Check for duplicate names
        const existingSpecialty = this.specialties.find(s => s.name.toLowerCase() === name.toLowerCase());
        if (existingSpecialty) {
            return { success: false, message: 'Já existe uma especialidade com este nome' };
        }

        const newSpecialty = {
            id: this.getNextSpecialtyId(),
            name: name.trim(),
            description: description.trim(),
            createdAt: new Date().toISOString()
        };

        this.specialties.push(newSpecialty);
        this.saveSpecialties();
        return { success: true, specialty: newSpecialty };
    }

    getNextSpecialtyId() {
        return this.specialties.length > 0 ? Math.max(...this.specialties.map(s => s.id)) + 1 : 1;
    }

    displaySpecialties(searchTerm = '') {
        const filteredSpecialties = searchTerm 
            ? this.specialties.filter(specialty => 
                specialty.name.toLowerCase().includes(searchTerm) ||
                specialty.description.toLowerCase().includes(searchTerm)
              )
            : this.specialties;

        const listContainer = document.getElementById('specialties-list');
        if (!listContainer) return;

        if (filteredSpecialties.length === 0) {
            listContainer.innerHTML = searchTerm 
                ? `<p>Nenhuma especialidade encontrada para "${searchTerm}"</p>`
                : '<p>Nenhuma especialidade disponível. Adicione uma para começar!</p>';
            return;
        }

        const specialtyCards = filteredSpecialties.map(specialty => `
            <div class="card specialty-card" data-specialty-id="${specialty.id}">
                <div class="card-header">
                    <h3 class="card-title">${specialty.name}</h3>
                    <div class="card-actions">
                        <button onclick="app.editSpecialty(${specialty.id})" class="secondary">Editar</button>
                        <button onclick="app.deleteSpecialty(${specialty.id})" class="secondary">Eliminar</button>
                    </div>
                </div>
                <p><strong>ID:</strong> ${specialty.id}</p>
                ${specialty.description ? `<p><strong>Descrição:</strong> ${specialty.description}</p>` : ''}
                <p><small>Criado: ${new Date(specialty.createdAt).toLocaleDateString()}</small></p>
            </div>
        `).join('');

        listContainer.innerHTML = `<div class="card-grid">${specialtyCards}</div>`;
    }

    editSpecialty(id) {
        // For now, just alert - this could be implemented later
        alert(`A funcionalidade de editar especialidade será implementada em tarefas futuras`);
    }

    deleteSpecialty(id) {
        if (confirm('Tem a certeza de que pretende eliminar esta especialidade?')) {
            this.specialties = this.specialties.filter(s => s.id !== id);
            this.saveSpecialties();
            this.displaySpecialties();
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