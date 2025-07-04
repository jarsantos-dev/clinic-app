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
            'dashboard': 'Dashboard',
            'patients': 'Patients',
            'appointments': 'Appointments',
            'doctors': 'Doctors',
            'specialties': 'Specialties',
            'reports': 'Reports'
        };
        return titles[page] || 'Dashboard';
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
                <h2>Welcome to Clinic Management System</h2>
                <p>Your clinic management dashboard</p>
            </div>
            <div class="card-grid">
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">Today's Appointments</h3>
                    </div>
                    <p>View and manage today's appointments</p>
                </div>
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">Patient Records</h3>
                    </div>
                    <p>Access patient information and history</p>
                </div>
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">Quick Actions</h3>
                    </div>
                    <p>Perform common clinic tasks</p>
                </div>
            </div>
        `;
    }

    getPatientsContent() {
        return `
            <div class="list-header">
                <h2>Patient Management</h2>
                <button onclick="app.showAddPatientForm()">Add New Patient</button>
            </div>
            <div class="search-container">
                <input type="text" placeholder="Search patients..." id="patient-search">
                <button onclick="app.searchPatients()">Search</button>
            </div>
            <div id="patients-list">
                <p>Patient list will be displayed here...</p>
            </div>
        `;
    }

    getAppointmentsContent() {
        return `
            <div class="list-header">
                <h2>Appointment Management</h2>
                <button onclick="app.showAddAppointmentForm()">Schedule Appointment</button>
            </div>
            <div class="search-container">
                <input type="text" placeholder="Search appointments..." id="appointment-search">
                <button onclick="app.searchAppointments()">Search</button>
            </div>
            <div id="appointments-list">
                <p>Appointment list will be displayed here...</p>
            </div>
        `;
    }

    getDoctorsContent() {
        return `
            <div class="list-header">
                <h2>Doctor Management</h2>
                <button onclick="app.showAddDoctorForm()">Add New Doctor</button>
            </div>
            <div class="search-container">
                <input type="text" placeholder="Search doctors..." id="doctor-search">
                <button onclick="app.searchDoctors()">Search</button>
            </div>
            <div id="doctors-list">
                <p>Doctor list will be displayed here...</p>
            </div>
        `;
    }

    getSpecialtiesContent() {
        // Trigger display of specialties after content is loaded
        setTimeout(() => this.displaySpecialties(), 0);
        
        return `
            <div class="list-header">
                <h2>Specialty Management</h2>
                <button onclick="app.showAddSpecialtyForm()">Add New Specialty</button>
            </div>
            <div class="search-container">
                <input type="text" placeholder="Search specialties..." id="specialty-search" oninput="app.searchSpecialties()">
                <button onclick="app.searchSpecialties()">Search</button>
            </div>
            <div id="add-specialty-form" class="hidden form-container">
                <h3>Add New Specialty</h3>
                <form id="specialty-form">
                    <div>
                        <label for="specialty-name">Specialty Name *</label>
                        <input type="text" id="specialty-name" name="name" required>
                    </div>
                    <div>
                        <label for="specialty-description">Description</label>
                        <textarea id="specialty-description" name="description" rows="3"></textarea>
                    </div>
                    <div class="form-actions">
                        <button type="button" onclick="app.cancelAddSpecialty()" class="secondary">Cancel</button>
                        <button type="submit">Add Specialty</button>
                    </div>
                </form>
                <div id="form-message" class="hidden"></div>
            </div>
            <div id="specialties-list">
                <p>Loading specialties...</p>
            </div>
        `;
    }

    getReportsContent() {
        return `
            <div class="list-header">
                <h2>Reports & Analytics</h2>
                <button onclick="app.generateReport()">Generate Report</button>
            </div>
            <div class="card-grid">
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">Monthly Statistics</h3>
                    </div>
                    <p>View monthly clinic statistics</p>
                </div>
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">Patient Reports</h3>
                    </div>
                    <p>Generate patient-related reports</p>
                </div>
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">Financial Reports</h3>
                    </div>
                    <p>View financial summaries</p>
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
        alert('Add Patient form will be implemented in future tasks');
    }

    showAddAppointmentForm() {
        alert('Add Appointment form will be implemented in future tasks');
    }

    showAddDoctorForm() {
        alert('Add Doctor form will be implemented in future tasks');
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
            messageDiv.textContent = 'Specialty added successfully!';
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
        alert('Report generation will be implemented in future tasks');
    }

    searchPatients() {
        alert('Patient search will be implemented in future tasks');
    }

    searchAppointments() {
        alert('Appointment search will be implemented in future tasks');
    }

    searchDoctors() {
        alert('Doctor search will be implemented in future tasks');
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
            { id: 1, name: 'Cardiology', description: 'Heart and cardiovascular system', createdAt: new Date().toISOString() },
            { id: 2, name: 'Dermatology', description: 'Skin, hair, and nails', createdAt: new Date().toISOString() },
            { id: 3, name: 'Pediatrics', description: 'Medical care for children', createdAt: new Date().toISOString() }
        ];
    }

    saveSpecialties() {
        localStorage.setItem('specialties', JSON.stringify(this.specialties));
    }

    addSpecialty(name, description = '') {
        if (!name || name.trim() === '') {
            return { success: false, message: 'Specialty name is required' };
        }

        // Check for duplicate names
        const existingSpecialty = this.specialties.find(s => s.name.toLowerCase() === name.toLowerCase());
        if (existingSpecialty) {
            return { success: false, message: 'Specialty with this name already exists' };
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
                ? `<p>No specialties found matching "${searchTerm}"</p>`
                : '<p>No specialties available. Add one to get started!</p>';
            return;
        }

        const specialtyCards = filteredSpecialties.map(specialty => `
            <div class="card specialty-card" data-specialty-id="${specialty.id}">
                <div class="card-header">
                    <h3 class="card-title">${specialty.name}</h3>
                    <div class="card-actions">
                        <button onclick="app.editSpecialty(${specialty.id})" class="secondary">Edit</button>
                        <button onclick="app.deleteSpecialty(${specialty.id})" class="secondary">Delete</button>
                    </div>
                </div>
                <p><strong>ID:</strong> ${specialty.id}</p>
                ${specialty.description ? `<p><strong>Description:</strong> ${specialty.description}</p>` : ''}
                <p><small>Created: ${new Date(specialty.createdAt).toLocaleDateString()}</small></p>
            </div>
        `).join('');

        listContainer.innerHTML = `<div class="card-grid">${specialtyCards}</div>`;
    }

    editSpecialty(id) {
        // For now, just alert - this could be implemented later
        alert(`Edit specialty functionality will be implemented in future tasks`);
    }

    deleteSpecialty(id) {
        if (confirm('Are you sure you want to delete this specialty?')) {
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