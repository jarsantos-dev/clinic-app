// Patient Detail view functionality
class PatientDetailView {
    constructor() {
        this.patient = null;
        this.appointments = [];
        this.specialties = [];
        this.clinicians = [];
        
        // Get patient ID from URL hash
        const urlParts = window.location.hash.split('/');
        this.patientId = urlParts.length > 1 ? parseInt(urlParts[1]) : null;
        
        this.loadData();
    }

    static init() {
        window.patientDetailView = new PatientDetailView();
        console.log('Vista de detalhe do paciente inicializada');
        
        // Display patient details and appointments when page loads
        window.patientDetailView.displayPatientInfo();
        window.patientDetailView.displayAppointments();
    }

    // Standard interface method for view refresh
    refresh() {
        this.displayPatientInfo();
        this.displayAppointments();
    }

    loadData() {
        this.loadPatient();
        this.loadAppointments();
        this.loadSpecialties();
        this.loadClinicians();
    }

    loadPatient() {
        const stored = localStorage.getItem('patients');
        if (stored && this.patientId) {
            const patients = JSON.parse(stored);
            this.patient = patients.find(p => p.id === this.patientId);
        }
    }

    loadAppointments() {
        const stored = localStorage.getItem('appointments');
        if (stored) {
            const allAppointments = JSON.parse(stored);
            this.appointments = allAppointments.filter(a => a.patientId === this.patientId);
        } else {
            this.appointments = [];
        }
    }

    loadSpecialties() {
        const stored = localStorage.getItem('specialties');
        if (stored) {
            this.specialties = JSON.parse(stored);
        } else {
            this.specialties = [
                { id: 1, name: 'Cardiologia' },
                { id: 2, name: 'Dermatologia' },
                { id: 3, name: 'Pediatria' }
            ];
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

    displayPatientInfo() {
        const nameElement = document.getElementById('patient-name');
        if (nameElement && this.patient) {
            nameElement.textContent = this.patient.name;
        } else if (nameElement) {
            nameElement.textContent = 'Paciente não encontrado';
        }
    }

    displayAppointments() {
        const container = document.getElementById('appointments-list');
        if (!container) return;

        if (!this.patient) {
            container.innerHTML = '<p>Paciente não encontrado.</p>';
            return;
        }

        if (this.appointments.length === 0) {
            container.innerHTML = '<p>Nenhuma consulta registada para este paciente.</p>';
            return;
        }

        // Sort appointments by datetime (newest first)
        const sortedAppointments = [...this.appointments].sort((a, b) => 
            new Date(b.datetime) - new Date(a.datetime)
        );

        // Generate HTML for appointments list
        const appointmentsHtml = sortedAppointments.map(appointment => {
            const specialty = this.getSpecialtyName(appointment.specialtyId);
            const clinician = this.getClinicianName(appointment.clinicianId);
            const appointmentDate = new Date(appointment.datetime);
            const formattedDate = appointmentDate.toLocaleDateString('pt-PT');
            const formattedTime = appointmentDate.toLocaleTimeString('pt-PT', { 
                hour: '2-digit', 
                minute: '2-digit' 
            });

            return `
                <div class="card appointment-card" data-appointment-id="${appointment.id}">
                    <div class="card-header">
                        <h3>${specialty}</h3>
                        <div class="appointment-info">
                            <p><strong>Clínico:</strong> ${clinician}</p>
                            <p><strong>Data:</strong> ${formattedDate} às ${formattedTime}</p>
                            <p><strong>Duração:</strong> ${appointment.duration} minutos</p>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        container.innerHTML = appointmentsHtml;
    }

    getSpecialtyName(specialtyId) {
        const specialty = this.specialties.find(s => s.id === specialtyId);
        return specialty ? specialty.name : 'Especialidade desconhecida';
    }

    getClinicianName(clinicianId) {
        const clinician = this.clinicians.find(c => c.id === clinicianId);
        return clinician ? clinician.name : 'Clínico desconhecido';
    }

    showCreateAppointmentForm() {
        if (!this.patient) {
            alert('Paciente não encontrado');
            return;
        }

        const formContainer = document.getElementById('create-appointment-form');
        const form = document.getElementById('appointment-form');
        const messageDiv = document.getElementById('appointment-form-message');
        
        if (formContainer && form) {
            // Clear previous form data and messages
            form.reset();
            messageDiv.className = 'hidden';
            messageDiv.textContent = '';
            
            // Pre-fill patient name (readonly)
            document.getElementById('appointment-patient').value = this.patient.name;
            
            // Store patient ID for form submission
            form.setAttribute('data-patient-id', this.patientId);
            
            // Show the form first
            formContainer.classList.remove('hidden');
            
            // Populate dropdowns
            this.populateSpecialtyDropdown();
            
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
                    this.populateClinicianDropdown();
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

    populateSpecialtyDropdown() {
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

    populateClinicianDropdown() {
        const specialtySelect = document.getElementById('appointment-specialty');
        const clinicianSelect = document.getElementById('appointment-clinician');
        
        if (!specialtySelect || !clinicianSelect) return;
        
        const selectedSpecialtyId = parseInt(specialtySelect.value);
        
        // Clear existing options
        clinicianSelect.innerHTML = '<option value="">Selecione um clínico...</option>';
        
        if (!selectedSpecialtyId) return;
        
        // Filter clinicians by specialty
        const filteredClinicians = this.clinicians.filter(c => c.specialtyId === selectedSpecialtyId);
        
        // Add clinician options
        filteredClinicians.forEach(clinician => {
            const option = document.createElement('option');
            option.value = clinician.id;
            option.textContent = clinician.name;
            clinicianSelect.appendChild(option);
        });
    }

    handleCreateAppointmentSubmit() {
        const form = document.getElementById('appointment-form');
        
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
                this.loadAppointments();
                this.displayAppointments();
            }, 1500);
        } else {
            this.showAppointmentMessage(result.message, 'error');
        }
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

        // Load all appointments
        const allAppointments = this.loadAllAppointments();

        const newAppointment = {
            id: this.getNextAppointmentId(allAppointments),
            patientId: patientId,
            specialtyId: specialtyId,
            clinicianId: clinicianId,
            datetime: datetime,
            duration: duration,
            createdAt: new Date().toISOString()
        };

        allAppointments.push(newAppointment);
        this.saveAllAppointments(allAppointments);
        return { success: true, appointment: newAppointment };
    }

    loadAllAppointments() {
        const stored = localStorage.getItem('appointments');
        return stored ? JSON.parse(stored) : [];
    }

    saveAllAppointments(appointments) {
        localStorage.setItem('appointments', JSON.stringify(appointments));
    }

    getNextAppointmentId(appointments) {
        return appointments.length > 0 ? Math.max(...appointments.map(a => a.id)) + 1 : 1;
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

    goBackToPatients() {
        window.location.hash = 'patients';
    }
}

// Initialize when view is loaded
PatientDetailView.init();

// Export functions to global scope for onclick handlers
window.showCreateAppointmentForm = () => window.patientDetailView.showCreateAppointmentForm();
window.cancelCreateAppointment = () => window.patientDetailView.cancelCreateAppointment();
window.goBackToPatients = () => window.patientDetailView.goBackToPatients();