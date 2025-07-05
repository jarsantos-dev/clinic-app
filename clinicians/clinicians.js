// Clinicians view functionality
class CliniciansView {
    constructor() {
        this.clinicians = this.loadClinicians();
    }

    static init() {
        window.cliniciansView = new CliniciansView();
        console.log('Vista de clínicos inicializada');
        
        // Display clinicians when page loads
        window.cliniciansView.displayClinicians();
    }

    // Standard interface method for view refresh
    refresh() {
        this.displayClinicians();
    }

    showAddClinicianForm() {
        const formContainer = document.getElementById('add-clinician-form');
        const form = document.getElementById('clinician-form');
        const messageDiv = document.getElementById('form-message');
        
        if (formContainer && form) {
            // Clear previous form data and messages
            form.reset();
            messageDiv.className = 'hidden';
            messageDiv.textContent = '';
            
            // Show the form
            formContainer.classList.remove('hidden');
            
            // Focus on the name input
            document.getElementById('clinician-name').focus();
            
            // Add form submit handler if not already added
            if (!form.hasAttribute('data-handler-added')) {
                form.addEventListener('submit', (e) => {
                    e.preventDefault();
                    this.handleAddClinicianSubmit();
                });
                form.setAttribute('data-handler-added', 'true');
            }
        }
    }

    cancelAddClinician() {
        const formContainer = document.getElementById('add-clinician-form');
        const form = document.getElementById('clinician-form');
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

    handleAddClinicianSubmit() {
        const form = document.getElementById('clinician-form');
        const messageDiv = document.getElementById('form-message');
        const nameInput = document.getElementById('clinician-name');
        
        if (!form || !messageDiv || !nameInput) return;

        const name = nameInput.value.trim();
        
        if (!name) {
            this.showMessage('Nome do clínico é obrigatório', 'error');
            return;
        }

        const result = this.addClinician(name);
        
        if (result.success) {
            this.showMessage('Clínico adicionado com sucesso', 'success');
            form.reset();
            this.displayClinicians();
            // Hide form after successful addition
            setTimeout(() => {
                this.cancelAddClinician();
            }, 1500);
        } else {
            this.showMessage(result.message, 'error');
        }
    }

    searchClinicians() {
        const searchInput = document.getElementById('clinician-search');
        const searchTerm = searchInput ? searchInput.value.trim() : '';
        this.displayClinicians(searchTerm);
    }

    // Clinician Data Management Methods
    loadClinicians() {
        const stored = localStorage.getItem('clinicians');
        if (stored) {
            return JSON.parse(stored);
        }
        // Return empty array if no clinicians exist
        return [];
    }

    saveClinicians() {
        localStorage.setItem('clinicians', JSON.stringify(this.clinicians));
    }

    addClinician(name) {
        if (!name || name.trim() === '') {
            return { success: false, message: 'Nome do clínico é obrigatório' };
        }

        // Check for duplicate names
        const existingClinician = this.clinicians.find(c => c.name.toLowerCase() === name.toLowerCase());
        if (existingClinician) {
            return { success: false, message: 'Clínico com este nome já existe' };
        }

        const newClinician = {
            id: this.getNextClinicianId(),
            name: name.trim(),
            createdAt: new Date().toISOString()
        };

        this.clinicians.push(newClinician);
        this.saveClinicians();
        return { success: true, clinician: newClinician };
    }

    getNextClinicianId() {
        return this.clinicians.length > 0 ? Math.max(...this.clinicians.map(c => c.id)) + 1 : 1;
    }

    displayClinicians(searchTerm = '') {
        const container = document.getElementById('clinicians-list');
        if (!container) return;

        let filteredClinicians = this.clinicians;
        
        if (searchTerm) {
            filteredClinicians = this.clinicians.filter(clinician =>
                clinician.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (filteredClinicians.length === 0) {
            container.innerHTML = searchTerm ? 
                '<p>Nenhum clínico encontrado para a pesquisa.</p>' : 
                '<p>Nenhum clínico registado. Adicione o primeiro clínico.</p>';
            return;
        }

        const cliniciansHtml = filteredClinicians.map(clinician => `
            <div class="card clinician-card">
                <div class="card-header">
                    <h3 class="card-title">${this.escapeHtml(clinician.name)}</h3>
                    <div class="card-actions">
                        <button onclick="window.cliniciansView.editClinician(${clinician.id})">Editar</button>
                        <button onclick="window.cliniciansView.deleteClinician(${clinician.id})" class="secondary">Eliminar</button>
                    </div>
                </div>
            </div>
        `).join('');

        container.innerHTML = cliniciansHtml;
    }

    editClinician(id) {
        const clinician = this.clinicians.find(c => c.id === id);
        if (!clinician) return;

        const newName = prompt('Nome do clínico:', clinician.name);
        if (newName === null) return; // User cancelled

        const trimmedName = newName.trim();
        if (!trimmedName) {
            alert('Nome do clínico é obrigatório');
            return;
        }

        // Check for duplicate names (excluding current clinician)
        const existingClinician = this.clinicians.find(c => 
            c.id !== id && c.name.toLowerCase() === trimmedName.toLowerCase()
        );
        if (existingClinician) {
            alert('Clínico com este nome já existe');
            return;
        }

        clinician.name = trimmedName;
        this.saveClinicians();
        this.displayClinicians();
    }

    deleteClinician(id) {
        const clinician = this.clinicians.find(c => c.id === id);
        if (!clinician) return;

        if (confirm(`Tem a certeza que deseja eliminar o clínico "${clinician.name}"?`)) {
            this.clinicians = this.clinicians.filter(c => c.id !== id);
            this.saveClinicians();
            this.displayClinicians();
        }
    }

    showMessage(message, type) {
        const messageDiv = document.getElementById('form-message');
        if (messageDiv) {
            messageDiv.textContent = message;
            messageDiv.className = type === 'error' ? 'error-message' : 'success-message';
        }
    }

    escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, function(m) { return map[m]; });
    }
}

// Initialize when view is loaded
CliniciansView.init();

// Export functions to global scope for onclick handlers
window.showAddClinicianForm = () => window.cliniciansView.showAddClinicianForm();
window.cancelAddClinician = () => window.cliniciansView.cancelAddClinician();
window.searchClinicians = () => window.cliniciansView.searchClinicians();