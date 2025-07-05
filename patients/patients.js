// Patients view functionality
class PatientsView {
    static init() {
        console.log('Vista de pacientes inicializada');
    }

    static showAddPatientForm() {
        alert('Formulário de adicionar paciente será implementado em tarefas futuras');
    }

    static searchPatients() {
        alert('Pesquisa de pacientes será implementada em tarefas futuras');
    }
}

// Initialize when view is loaded
PatientsView.init();

// Export functions to global scope for onclick handlers
window.showAddPatientForm = PatientsView.showAddPatientForm;
window.searchPatients = PatientsView.searchPatients;