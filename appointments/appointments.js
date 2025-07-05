// Appointments view functionality
class AppointmentsView {
    static init() {
        console.log('Appointments view initialized');
    }

    static showAddAppointmentForm() {
        alert('Formulário de agendar consulta será implementado em tarefas futuras');
    }

    static searchAppointments() {
        alert('Pesquisa de consultas será implementada em tarefas futuras');
    }
}

// Initialize when view is loaded
AppointmentsView.init();

// Export functions to global scope for onclick handlers
window.showAddAppointmentForm = AppointmentsView.showAddAppointmentForm;
window.searchAppointments = AppointmentsView.searchAppointments;