// Places view functionality
class PlacesView {
    constructor() {
        this.places = this.loadPlaces();
    }

    static init() {
        window.placesView = new PlacesView();
        console.log('Vista de locais inicializada');
        
        // Display places when page loads
        window.placesView.displayPlaces();
    }

    showAddPlaceForm() {
        const formContainer = document.getElementById('add-place-form');
        const form = document.getElementById('place-form');
        const messageDiv = document.getElementById('form-message');
        
        if (formContainer && form) {
            // Clear previous form data and messages
            form.reset();
            messageDiv.className = 'hidden';
            messageDiv.textContent = '';
            
            // Show the form
            formContainer.classList.remove('hidden');
            
            // Focus on the name input
            document.getElementById('place-name').focus();
            
            // Add form submit handler if not already added
            if (!form.hasAttribute('data-handler-added')) {
                form.addEventListener('submit', (e) => {
                    e.preventDefault();
                    this.handleAddPlaceSubmit();
                });
                form.setAttribute('data-handler-added', 'true');
            }
        }
    }

    cancelAddPlace() {
        const formContainer = document.getElementById('add-place-form');
        const form = document.getElementById('place-form');
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

    handleAddPlaceSubmit() {
        const nameInput = document.getElementById('place-name');
        const messageDiv = document.getElementById('form-message');
        
        const name = nameInput.value;
        
        const result = this.addPlace(name);
        
        if (result.success) {
            // Show success message
            messageDiv.textContent = 'Local adicionado com sucesso!';
            messageDiv.className = 'success-message';
            
            // Clear form and hide it after a short delay
            setTimeout(() => {
                this.cancelAddPlace();
                this.displayPlaces();
            }, 1500);
        } else {
            // Show error message
            messageDiv.textContent = result.message;
            messageDiv.className = 'error-message';
        }
    }

    searchPlaces() {
        const searchTerm = document.getElementById('place-search').value.toLowerCase();
        this.displayPlaces(searchTerm);
    }

    // Place Data Management Methods
    loadPlaces() {
        const stored = localStorage.getItem('places');
        if (stored) {
            return JSON.parse(stored);
        }
        // Return some default places if none exist
        return [
            { id: 1, name: 'Consultório 1', createdAt: new Date().toISOString() },
            { id: 2, name: 'Consultório 2', createdAt: new Date().toISOString() },
            { id: 3, name: 'Sala de Espera', createdAt: new Date().toISOString() }
        ];
    }

    savePlaces() {
        localStorage.setItem('places', JSON.stringify(this.places));
    }

    addPlace(name) {
        if (!name || name.trim() === '') {
            return { success: false, message: 'Nome do local é obrigatório' };
        }

        // Check for duplicate names
        const existingPlace = this.places.find(p => p.name.toLowerCase() === name.toLowerCase());
        if (existingPlace) {
            return { success: false, message: 'Local com este nome já existe' };
        }

        const newPlace = {
            id: this.getNextPlaceId(),
            name: name.trim(),
            createdAt: new Date().toISOString()
        };

        this.places.push(newPlace);
        this.savePlaces();
        return { success: true, place: newPlace };
    }

    getNextPlaceId() {
        return this.places.length > 0 ? Math.max(...this.places.map(p => p.id)) + 1 : 1;
    }

    displayPlaces(searchTerm = '') {
        const filteredPlaces = searchTerm 
            ? this.places.filter(place => 
                place.name.toLowerCase().includes(searchTerm)
              )
            : this.places;

        const listContainer = document.getElementById('places-list');
        if (!listContainer) return;

        if (filteredPlaces.length === 0) {
            listContainer.innerHTML = searchTerm 
                ? `<p>Nenhum local encontrado para "${searchTerm}"</p>`
                : '<p>Nenhum local disponível. Adicione um para começar!</p>';
            return;
        }

        const placeCards = filteredPlaces.map(place => `
            <div class="card place-card" data-place-id="${place.id}">
                <div class="card-header">
                    <h3 class="card-title">${place.name}</h3>
                    <div class="card-actions">
                        <button onclick="window.placesView.editPlace(${place.id})" class="secondary">Editar</button>
                        <button onclick="window.placesView.deletePlace(${place.id})" class="secondary">Eliminar</button>
                    </div>
                </div>
                <p><small>Criado: ${new Date(place.createdAt).toLocaleDateString()}</small></p>
            </div>
        `).join('');

        listContainer.innerHTML = `<div class="card-grid">${placeCards}</div>`;
    }

    editPlace(id) {
        // For now, just alert - this could be implemented later
        alert(`Funcionalidade de editar local será implementada em tarefas futuras`);
    }

    deletePlace(id) {
        if (confirm('Tem a certeza que quer eliminar este local?')) {
            this.places = this.places.filter(p => p.id !== id);
            this.savePlaces();
            this.displayPlaces();
        }
    }
}

// Initialize when view is loaded
PlacesView.init();

// Export functions to global scope for onclick handlers
window.showAddPlaceForm = () => window.placesView.showAddPlaceForm();
window.cancelAddPlace = () => window.placesView.cancelAddPlace();
window.searchPlaces = () => window.placesView.searchPlaces();