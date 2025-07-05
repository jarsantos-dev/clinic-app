// Patients view functionality
class PatientsView {
    constructor() {
        this.patients = this.loadPatients();
    }

    static init() {
        window.patientsView = new PatientsView();
        console.log('Vista de pacientes inicializada');
        
        // Display patients when page loads
        window.patientsView.displayPatients();
    }

    showAddPatientForm() {
        const formContainer = document.getElementById('add-patient-form');
        const form = document.getElementById('patient-form');
        const messageDiv = document.getElementById('form-message');
        
        if (formContainer && form) {
            // Clear previous form data and messages
            form.reset();
            messageDiv.className = 'hidden';
            messageDiv.textContent = '';
            
            // Show the form
            formContainer.classList.remove('hidden');
            
            // Focus on the name input
            document.getElementById('patient-name').focus();
            
            // Add form submit handler if not already added
            if (!form.hasAttribute('data-handler-added')) {
                form.addEventListener('submit', (e) => {
                    e.preventDefault();
                    this.handleAddPatientSubmit();
                });
                form.setAttribute('data-handler-added', 'true');
            }
        }
    }

    cancelAddPatient() {
        const formContainer = document.getElementById('add-patient-form');
        const form = document.getElementById('patient-form');
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

    handleAddPatientSubmit() {
        const nameInput = document.getElementById('patient-name');
        const messageDiv = document.getElementById('form-message');
        
        const name = nameInput.value;
        
        const result = this.addPatient(name);
        
        if (result.success) {
            // Show success message
            this.showMessage('Paciente adicionado com sucesso!', 'success');
            
            // Clear form and hide it after a short delay
            setTimeout(() => {
                this.cancelAddPatient();
                this.displayPatients();
            }, 1500);
        } else {
            // Show error message
            this.showMessage(result.message, 'error');
        }
    }



    // Patient Data Management Methods
    loadPatients() {
        const stored = localStorage.getItem('patients');
        if (stored) {
            return JSON.parse(stored);
        }
        // Return empty array if no patients exist
        return [];
    }

    savePatients() {
        localStorage.setItem('patients', JSON.stringify(this.patients));
    }

    addPatient(name) {
        if (!name || name.trim() === '') {
            return { success: false, message: 'Nome do paciente é obrigatório' };
        }

        // Check for duplicate names
        const existingPatient = this.patients.find(p => p.name.toLowerCase() === name.toLowerCase());
        if (existingPatient) {
            return { success: false, message: 'Paciente com este nome já existe' };
        }

        const newPatient = {
            id: this.getNextPatientId(),
            name: name.trim()
        };

        this.patients.push(newPatient);
        this.savePatients();
        return { success: true, patient: newPatient };
    }

    getNextPatientId() {
        return this.patients.length > 0 ? Math.max(...this.patients.map(p => p.id)) + 1 : 1;
    }

    displayPatients() {
        const container = document.getElementById('patients-list');
        if (!container) return;

        if (this.patients.length === 0) {
            container.innerHTML = '<p>Nenhum paciente registado. Adicione o primeiro paciente.</p>';
            return;
        }

        // Generate HTML for patients list
        const patientsHtml = this.patients.map(patient => `
            <div class="card patient-card" data-patient-id="${patient.id}">
                <div class="card-header">
                    <h3>${this.escapeHtml(patient.name)}</h3>
                    <div class="card-actions">
                        <button onclick="window.patientsView.editPatient(${patient.id})">Editar</button>
                        <button onclick="window.patientsView.deletePatient(${patient.id})" class="secondary">Eliminar</button>
                    </div>
                </div>
            </div>
        `).join('');

        container.innerHTML = patientsHtml;
    }

    editPatient(id) {
        const patient = this.patients.find(p => p.id === id);
        if (!patient) return;

        const newName = prompt('Nome do paciente:', patient.name);
        if (newName === null) return; // User cancelled

        const trimmedName = newName.trim();
        if (!trimmedName) {
            alert('Nome do paciente é obrigatório');
            return;
        }

        // Check for duplicate names (excluding current patient)
        const existingPatient = this.patients.find(p => 
            p.id !== id && p.name.toLowerCase() === trimmedName.toLowerCase()
        );
        if (existingPatient) {
            alert('Paciente com este nome já existe');
            return;
        }

        patient.name = trimmedName;
        this.savePatients();
        this.displayPatients();
    }

    deletePatient(id) {
        const patient = this.patients.find(p => p.id === id);
        if (!patient) return;

        if (confirm(`Tem a certeza que deseja eliminar o paciente "${patient.name}"?`)) {
            this.patients = this.patients.filter(p => p.id !== id);
            this.savePatients();
            this.displayPatients();
            this.showMessage('Paciente eliminado com sucesso!', 'success');
        }
    }

    showMessage(message, type) {
        const messageDiv = document.getElementById('form-message');
        if (messageDiv) {
            messageDiv.textContent = message;
            messageDiv.className = type === 'success' ? 'success-message' : 'error-message';
            messageDiv.classList.remove('hidden');

            // Hide message after 3 seconds for success messages
            if (type === 'success') {
                setTimeout(() => {
                    messageDiv.classList.add('hidden');
                    messageDiv.textContent = '';
                }, 3000);
            }
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize when view is loaded
PatientsView.init();

// Export functions to global scope for onclick handlers
window.showAddPatientForm = () => window.patientsView.showAddPatientForm();
window.cancelAddPatient = () => window.patientsView.cancelAddPatient();