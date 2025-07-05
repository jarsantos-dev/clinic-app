// Specialties view functionality
class SpecialtiesView {
    constructor() {
        this.specialties = this.loadSpecialties();
    }

    static init() {
        window.specialtiesView = new SpecialtiesView();
        console.log('Vista de especialidades inicializada');
        
        // Wait for DOM to be ready before displaying specialties
        const initDisplay = () => {
            const listContainer = document.getElementById('specialties-list');
            if (listContainer) {
                window.specialtiesView.displaySpecialties();
            } else {
                // If element not found, try again after a short delay
                setTimeout(initDisplay, 10);
            }
        };
        initDisplay();
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
        const messageDiv = document.getElementById('form-message');
        
        const name = nameInput.value;
        
        const result = this.addSpecialty(name);
        
        if (result.success) {
            // Show success message
            messageDiv.textContent = 'Especialidade adicionada com sucesso!';
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
            { id: 1, name: 'Cardiologia' },
            { id: 2, name: 'Dermatologia' },
            { id: 3, name: 'Pediatria' }
        ];
    }

    saveSpecialties() {
        localStorage.setItem('specialties', JSON.stringify(this.specialties));
    }

    addSpecialty(name) {
        if (!name || name.trim() === '') {
            return { success: false, message: 'Nome da especialidade é obrigatório' };
        }

        // Check for duplicate names
        const existingSpecialty = this.specialties.find(s => s.name.toLowerCase() === name.toLowerCase());
        if (existingSpecialty) {
            return { success: false, message: 'Especialidade com este nome já existe' };
        }

        const newSpecialty = {
            id: this.getNextSpecialtyId(),
            name: name.trim()
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
                specialty.name.toLowerCase().includes(searchTerm)
              )
            : this.specialties;

        const listContainer = document.getElementById('specialties-list');
        if (!listContainer) return;

        if (filteredSpecialties.length === 0) {
            listContainer.innerHTML = searchTerm 
                ? `<p>Nenhuma especialidade encontrada para "${searchTerm}"</p>`
                : '<p>Nenhuma especialidade disponível. Adicione uma para começar!</p>';
            return;
        }

        const specialtyCards = filteredSpecialties.map(specialty => `
            <div class="card specialty-card" data-specialty-id="${specialty.id}">
                <div class="card-header">
                    <h3 class="card-title">${specialty.name}</h3>
                    <div class="card-actions">
                        <button onclick="window.specialtiesView.editSpecialty(${specialty.id})" class="secondary">Editar</button>
                        <button onclick="window.specialtiesView.deleteSpecialty(${specialty.id})" class="secondary">Eliminar</button>
                    </div>
                </div>
            </div>
        `).join('');

        listContainer.innerHTML = `<div class="card-grid">${specialtyCards}</div>`;
    }

    editSpecialty(id) {
        // For now, just alert - this could be implemented later
        alert(`Funcionalidade de editar especialidade será implementada em tarefas futuras`);
    }

    deleteSpecialty(id) {
        if (confirm('Tem a certeza que quer eliminar esta especialidade?')) {
            this.specialties = this.specialties.filter(s => s.id !== id);
            this.saveSpecialties();
            this.displaySpecialties();
        }
    }
}

// Make class available globally
window.SpecialtiesView = SpecialtiesView;

// Initialize when view is loaded
SpecialtiesView.init();

// Export functions to global scope for onclick handlers
window.showAddSpecialtyForm = () => window.specialtiesView.showAddSpecialtyForm();
window.cancelAddSpecialty = () => window.specialtiesView.cancelAddSpecialty();
window.searchSpecialties = () => window.specialtiesView.searchSpecialties();