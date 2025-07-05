// Reports view functionality
class ReportsView {
    static init() {
        console.log('Reports view initialized');
    }

    static generateReport() {
        alert('Geração de relatórios será implementada em tarefas futuras');
    }
}

// Initialize when view is loaded
ReportsView.init();

// Export functions to global scope for onclick handlers
window.generateReport = ReportsView.generateReport;