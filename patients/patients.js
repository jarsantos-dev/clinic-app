// Patients view functionality
class PatientsView {
    constructor() {
        this.patients = this.loadPatients();
        this.appointments = this.loadAppointments();
    }

    static init() {
        window.patientsView = new PatientsView();
        console.log('Vista de pacientes inicializada');
        
        // Display patients when page loads
        window.patientsView.displayPatients();
    }

    // Standard interface method for view refresh
    refresh() {
        this.displayPatients();
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
                        <button onclick="window.patientsView.viewPatientDetail(${patient.id})">Ver Detalhes</button>
                        <button onclick="window.patientsView.createAppointment(${patient.id})">Criar Consulta</button>
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

    viewPatientDetail(patientId) {
        window.location.hash = `patient-detail/${patientId}`;
    }

    // Appointment Management Methods
    createAppointment(patientId) {
        const patient = this.patients.find(p => p.id === patientId);
        if (!patient) return;

        const formContainer = document.getElementById('create-appointment-form');
        const form = document.getElementById('appointment-form');
        const messageDiv = document.getElementById('appointment-form-message');
        
        if (formContainer && form) {
            // Clear previous form data and messages
            form.reset();
            messageDiv.className = 'hidden';
            messageDiv.textContent = '';
            
            // Pre-fill patient name (readonly)
            document.getElementById('appointment-patient').value = patient.name;
            
            // Store patient ID for form submission
            form.setAttribute('data-patient-id', patientId);
            
            // Show the form first
            formContainer.classList.remove('hidden');
            
            // Load and populate dropdowns after form is visible
            this.loadSpecialties();
            // this.populateAppointmentSpecialtyDropdown(); // Temporarily disabled to test hardcoded options
            
            // Focus on specialty dropdown
            document.getElementById('appointment-specialty').focus();
            
            // Add form submit handler if not already added
            if (!form.hasAttribute('data-appointment-handler-added')) {
                form.addEventListener('submit', (e) => {
                    e.preventDefault();
                    this.handleCreateAppointmentSubmit();
                });
                form.setAttribute('data-appointment-handler-added', 'true');
            }

            // Add specialty change handler to update clinicians
            const specialtySelect = document.getElementById('appointment-specialty');
            if (!specialtySelect.hasAttribute('data-change-handler-added')) {
                specialtySelect.addEventListener('change', () => {
                    this.populateAppointmentClinicianDropdown();
                });
                specialtySelect.setAttribute('data-change-handler-added', 'true');
            }
        }
    }

    cancelCreateAppointment() {
        const formContainer = document.getElementById('create-appointment-form');
        const form = document.getElementById('appointment-form');
        const messageDiv = document.getElementById('appointment-form-message');
        
        if (formContainer) {
            formContainer.classList.add('hidden');
            if (form) form.reset();
            if (messageDiv) {
                messageDiv.className = 'hidden';
                messageDiv.textContent = '';
            }
        }
    }

    handleCreateAppointmentSubmit() {
        const form = document.getElementById('appointment-form');
        const messageDiv = document.getElementById('appointment-form-message');
        
        const patientId = parseInt(form.getAttribute('data-patient-id'));
        const specialtyId = parseInt(document.getElementById('appointment-specialty').value);
        const clinicianId = parseInt(document.getElementById('appointment-clinician').value);
        const datetime = document.getElementById('appointment-datetime').value;
        const duration = parseInt(document.getElementById('appointment-duration').value);
        
        const result = this.addAppointment(patientId, specialtyId, clinicianId, datetime, duration);
        
        if (result.success) {
            this.showAppointmentMessage('Consulta criada com sucesso!', 'success');
            
            setTimeout(() => {
                this.cancelCreateAppointment();
            }, 1500);
        } else {
            this.showAppointmentMessage(result.message, 'error');
        }
    }

    loadSpecialties() {
        const stored = localStorage.getItem('specialties');
        if (stored) {
            this.specialties = JSON.parse(stored);
        } else {
            this.specialties = [];
        }
    }

    loadClinicians() {
        const stored = localStorage.getItem('clinicians');
        if (stored) {
            this.clinicians = JSON.parse(stored);
        } else {
            this.clinicians = [];
        }
    }

    populateAppointmentSpecialtyDropdown() {
        const specialtySelect = document.getElementById('appointment-specialty');
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

    populateAppointmentClinicianDropdown() {
        const clinicianSelect = document.getElementById('appointment-clinician');
        const specialtySelect = document.getElementById('appointment-specialty');
        
        if (!clinicianSelect || !specialtySelect) return;
        
        const selectedSpecialtyId = parseInt(specialtySelect.value);
        
        // Clear existing options
        clinicianSelect.innerHTML = '<option value="">Selecione um clínico...</option>';
        
        if (!selectedSpecialtyId) return;
        
        // Load clinicians if not already loaded
        this.loadClinicians();
        
        // Filter clinicians by selected specialty
        const filteredClinicians = this.clinicians.filter(c => c.specialtyId === selectedSpecialtyId);
        
        // Add clinician options
        filteredClinicians.forEach(clinician => {
            const option = document.createElement('option');
            option.value = clinician.id;
            option.textContent = clinician.name;
            clinicianSelect.appendChild(option);
        });
        
        if (filteredClinicians.length === 0) {
            const option = document.createElement('option');
            option.value = '';
            option.textContent = 'Nenhum clínico disponível para esta especialidade';
            option.disabled = true;
            clinicianSelect.appendChild(option);
        }
    }

    loadAppointments() {
        const stored = localStorage.getItem('appointments');
        if (stored) {
            return JSON.parse(stored);
        }
        return [];
    }

    saveAppointments() {
        localStorage.setItem('appointments', JSON.stringify(this.appointments || []));
    }

    addAppointment(patientId, specialtyId, clinicianId, datetime, duration) {
        if (!patientId) {
            return { success: false, message: 'Paciente é obrigatório' };
        }

        if (!specialtyId) {
            return { success: false, message: 'Especialidade é obrigatória' };
        }

        if (!clinicianId) {
            return { success: false, message: 'Clínico é obrigatório' };
        }

        if (!datetime) {
            return { success: false, message: 'Data e hora são obrigatórias' };
        }

        if (!duration || duration < 15) {
            return { success: false, message: 'Duração deve ser pelo menos 15 minutos' };
        }

        // Load appointments if not already loaded
        if (!this.appointments) {
            this.appointments = this.loadAppointments();
        }

        const newAppointment = {
            id: this.getNextAppointmentId(),
            patientId: patientId,
            specialtyId: specialtyId,
            clinicianId: clinicianId,
            datetime: datetime,
            duration: duration,
            createdAt: new Date().toISOString()
        };

        this.appointments.push(newAppointment);
        this.saveAppointments();
        return { success: true, appointment: newAppointment };
    }

    getNextAppointmentId() {
        if (!this.appointments) {
            this.appointments = this.loadAppointments();
        }
        return this.appointments.length > 0 ? Math.max(...this.appointments.map(a => a.id)) + 1 : 1;
    }

    showAppointmentMessage(message, type) {
        const messageDiv = document.getElementById('appointment-form-message');
        if (messageDiv) {
            messageDiv.textContent = message;
            messageDiv.className = type === 'success' ? 'success-message' : 'error-message';
            
            // Auto-hide success messages after 3 seconds
            if (type === 'success') {
                setTimeout(() => {
                    messageDiv.className = 'hidden';
                    messageDiv.textContent = '';
                }, 3000);
            }
        }
    }
}

// Initialize when view is loaded
PatientsView.init();

// Export functions to global scope for onclick handlers
window.showAddPatientForm = () => window.patientsView.showAddPatientForm();
window.cancelAddPatient = () => window.patientsView.cancelAddPatient();
window.cancelCreateAppointment = () => window.patientsView.cancelCreateAppointment();
