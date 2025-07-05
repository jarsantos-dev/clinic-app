// Clinicians view functionality
class CliniciansView {
    constructor() {
        this.clinicians = this.loadClinicians();
        this.specialties = this.loadSpecialties();
    }

    static init() {
        window.cliniciansView = new CliniciansView();
        console.log('Vista de clínicos inicializada');
        
        // Display clinicians when page loads
        window.cliniciansView.displayClinicians();
    }

    // Standard interface method for view refresh
    refresh() {
        // Reload specialties in case they were updated in other views
        this.specialties = this.loadSpecialties();
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
            
            // Reload specialties and populate dropdown
            this.specialties = this.loadSpecialties();
            this.populateSpecialtyDropdown();
            
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
        const specialtySelect = document.getElementById('clinician-specialty');
        
        if (!form || !messageDiv || !nameInput || !specialtySelect) return;

        const name = nameInput.value.trim();
        const specialtyId = parseInt(specialtySelect.value);
        
        if (!name) {
            this.showMessage('Nome do clínico é obrigatório', 'error');
            return;
        }

        if (!specialtyId) {
            this.showMessage('Especialidade é obrigatória', 'error');
            return;
        }

        const result = this.addClinician(name, specialtyId);
        
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



    // Clinician Data Management Methods
    loadClinicians() {
        const stored = localStorage.getItem('clinicians');
        if (stored) {
            return JSON.parse(stored);
        }
        // Return empty array if no clinicians exist
        return [];
    }

    loadSpecialties() {
        const stored = localStorage.getItem('specialties');
        if (stored) {
            return JSON.parse(stored);
        }
        // Return empty array if no specialties exist
        return [];
    }

    populateSpecialtyDropdown() {
        const specialtySelect = document.getElementById('clinician-specialty');
        if (!specialtySelect) return;
        
        // Clear existing options except the first placeholder
        specialtySelect.innerHTML = '<option value="">Selecione uma especialidade...</option>';
        
        // Add specialty options
        this.specialties.forEach(specialty => {
            const option = document.createElement('option');
            option.value = specialty.id;
            option.textContent = specialty.name;
            specialtySelect.appendChild(option);
        });
    }

    saveClinicians() {
        localStorage.setItem('clinicians', JSON.stringify(this.clinicians));
    }

    addClinician(name, specialtyId) {
        if (!name || name.trim() === '') {
            return { success: false, message: 'Nome do clínico é obrigatório' };
        }

        if (!specialtyId) {
            return { success: false, message: 'Especialidade é obrigatória' };
        }

        // Check for duplicate names
        const existingClinician = this.clinicians.find(c => c.name.toLowerCase() === name.toLowerCase());
        if (existingClinician) {
            return { success: false, message: 'Clínico com este nome já existe' };
        }

        const newClinician = {
            id: this.getNextClinicianId(),
            name: name.trim(),
            specialtyId: specialtyId,
            createdAt: new Date().toISOString()
        };

        this.clinicians.push(newClinician);
        this.saveClinicians();
        return { success: true, clinician: newClinician };
    }

    getNextClinicianId() {
        return this.clinicians.length > 0 ? Math.max(...this.clinicians.map(c => c.id)) + 1 : 1;
    }

    getSpecialtyName(specialtyId) {
        const specialty = this.specialties.find(s => s.id === specialtyId);
        return specialty ? specialty.name : 'Especialidade não encontrada';
    }

    displayClinicians() {
        const container = document.getElementById('clinicians-list');
        if (!container) return;

        if (this.clinicians.length === 0) {
            container.innerHTML = '<p>Nenhum clínico registado. Adicione o primeiro clínico.</p>';
            return;
        }

        const cliniciansHtml = this.clinicians.map(clinician => `
            <div class="card clinician-card">
                <div class="card-header">
                    <h3 class="card-title">${this.escapeHtml(clinician.name)}</h3>
                    <div class="card-actions">
                        <button onclick="window.cliniciansView.editClinician(${clinician.id})">Editar</button>
                        <button onclick="window.cliniciansView.deleteClinician(${clinician.id})" class="secondary">Eliminar</button>
                    </div>
                </div>
                <p><strong>Especialidade:</strong> ${this.escapeHtml(this.getSpecialtyName(clinician.specialtyId))}</p>
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

        // Create specialty options string for prompt
        const specialtyOptions = this.specialties.map(s => `${s.id} - ${s.name}`).join('\n');
        const currentSpecialtyName = this.getSpecialtyName(clinician.specialtyId);
        const specialtyPrompt = `Selecione a especialidade (digite o número):\n${specialtyOptions}\n\nEspecialidade atual: ${currentSpecialtyName}`;
        
        const specialtyInput = prompt(specialtyPrompt, clinician.specialtyId.toString());
        if (specialtyInput === null) return; // User cancelled

        const newSpecialtyId = parseInt(specialtyInput);
        if (!newSpecialtyId || !this.specialties.find(s => s.id === newSpecialtyId)) {
            alert('Especialidade inválida');
            return;
        }

        clinician.name = trimmedName;
        clinician.specialtyId = newSpecialtyId;
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