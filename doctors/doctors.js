// Doctors view functionality
class DoctorsView {
    static init() {
        console.log('Vista de médicos inicializada');
    }

    static showAddDoctorForm() {
        alert('Formulário de adicionar médico será implementado em tarefas futuras');
    }

    static searchDoctors() {
        alert('Pesquisa de médicos será implementada em tarefas futuras');
    }
}

// Initialize when view is loaded
DoctorsView.init();

// Export functions to global scope for onclick handlers
window.showAddDoctorForm = DoctorsView.showAddDoctorForm;
window.searchDoctors = DoctorsView.searchDoctors;