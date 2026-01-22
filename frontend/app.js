/**
 * Application JavaScript pour la gestion de clients
 * 
 * Ce fichier gère :
 * - L'affichage de la liste des clients
 * - L'ajout de nouveaux clients
 * - La modification de clients existants
 * - La suppression de clients
 * - La communication avec l'API REST backend
 */

// Configuration de l'API
// Le frontend s'exécute dans le navigateur, donc on utilise localhost
// Le backend est accessible sur le port 3000 (exposé par Docker)
const API_URL = 'http://localhost:3000/api';

// Éléments DOM
const clientForm = document.getElementById('client-form');
const clientsList = document.getElementById('clients-list');
const loading = document.getElementById('loading');
const errorMessage = document.getElementById('error-message');
const formTitle = document.getElementById('form-title');
const submitBtn = document.getElementById('submit-btn');
const cancelBtn = document.getElementById('cancel-btn');
const clientIdInput = document.getElementById('client-id');

let editingClientId = null;

// ==================== FONCTIONS UTILITAIRES ====================

/**
 * Affiche un message d'erreur
 */
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    setTimeout(() => {
        errorMessage.style.display = 'none';
    }, 5000);
}

/**
 * Cache le message d'erreur
 */
function hideError() {
    errorMessage.style.display = 'none';
}

/**
 * Affiche l'état de chargement
 */
function showLoading() {
    loading.style.display = 'block';
    clientsList.innerHTML = '';
}

/**
 * Cache l'état de chargement
 */
function hideLoading() {
    loading.style.display = 'none';
}

// ==================== FONCTIONS API ====================

/**
 * Récupère tous les clients depuis l'API
 */
async function fetchClients() {
    try {
        showLoading();
        hideError();
        
        const response = await fetch(`${API_URL}/clients`);
        const data = await response.json();
        
        if (data.success) {
            displayClients(data.data);
        } else {
            showError('Erreur lors du chargement des clients');
        }
    } catch (error) {
        console.error('Erreur:', error);
        showError('Impossible de se connecter à l\'API. Vérifiez que le backend est démarré.');
    } finally {
        hideLoading();
    }
}

/**
 * Crée un nouveau client
 */
async function createClient(clientData) {
    try {
        const response = await fetch(`${API_URL}/clients`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(clientData)
        });
        
        const data = await response.json();
        
        if (data.success) {
            clientForm.reset();
            fetchClients(); // Recharger la liste
            return true;
        } else {
            showError(data.message || 'Erreur lors de la création du client');
            return false;
        }
    } catch (error) {
        console.error('Erreur:', error);
        showError('Erreur lors de la création du client');
        return false;
    }
}

/**
 * Met à jour un client existant
 */
async function updateClient(id, clientData) {
    try {
        const response = await fetch(`${API_URL}/clients/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(clientData)
        });
        
        const data = await response.json();
        
        if (data.success) {
            cancelEdit();
            fetchClients(); // Recharger la liste
            return true;
        } else {
            showError(data.message || 'Erreur lors de la mise à jour du client');
            return false;
        }
    } catch (error) {
        console.error('Erreur:', error);
        showError('Erreur lors de la mise à jour du client');
        return false;
    }
}

/**
 * Supprime un client
 */
async function deleteClient(id) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce client ?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/clients/${id}`, {
            method: 'DELETE'
        });
        
        const data = await response.json();
        
        if (data.success) {
            fetchClients(); // Recharger la liste
        } else {
            showError(data.message || 'Erreur lors de la suppression du client');
        }
    } catch (error) {
        console.error('Erreur:', error);
        showError('Erreur lors de la suppression du client');
    }
}

// ==================== FONCTIONS AFFICHAGE ====================

/**
 * Affiche la liste des clients
 */
function displayClients(clients) {
    if (clients.length === 0) {
        clientsList.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📭</div>
                <h3>Aucun client enregistré</h3>
                <p>Ajoutez votre premier client en utilisant le formulaire ci-dessus.</p>
            </div>
        `;
        return;
    }
    
    clientsList.innerHTML = clients.map(client => `
        <div class="client-card">
            <div class="client-header">
                <div class="client-name">${escapeHtml(client.prenom)} ${escapeHtml(client.nom)}</div>
                <div class="client-actions">
                    <button class="btn-edit" onclick="editClient('${client._id}')">✏️ Modifier</button>
                    <button class="btn-delete" onclick="deleteClient('${client._id}')">🗑️ Supprimer</button>
                </div>
            </div>
            <div class="client-info">
                <div class="info-item">
                    <span class="info-label">📧 Email:</span>
                    <span class="info-value">${escapeHtml(client.email)}</span>
                </div>
                ${client.telephone ? `
                <div class="info-item">
                    <span class="info-label">📞 Téléphone:</span>
                    <span class="info-value">${escapeHtml(client.telephone)}</span>
                </div>
                ` : ''}
                ${client.adresse ? `
                <div class="info-item">
                    <span class="info-label">📍 Adresse:</span>
                    <span class="info-value">${escapeHtml(client.adresse)}</span>
                </div>
                ` : ''}
            </div>
        </div>
    `).join('');
}

/**
 * Échappe les caractères HTML pour éviter les injections XSS
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Remplit le formulaire avec les données d'un client pour modification
 */
async function editClient(id) {
    try {
        const response = await fetch(`${API_URL}/clients/${id}`);
        const data = await response.json();
        
        if (data.success) {
            const client = data.data;
            editingClientId = id;
            
            // Remplir le formulaire
            document.getElementById('nom').value = client.nom || '';
            document.getElementById('prenom').value = client.prenom || '';
            document.getElementById('email').value = client.email || '';
            document.getElementById('telephone').value = client.telephone || '';
            document.getElementById('adresse').value = client.adresse || '';
            clientIdInput.value = id;
            
            // Changer le titre et le bouton
            formTitle.textContent = 'Modifier le client';
            submitBtn.textContent = 'Modifier';
            cancelBtn.style.display = 'inline-block';
            
            // Scroll vers le formulaire
            document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' });
        } else {
            showError('Erreur lors du chargement du client');
        }
    } catch (error) {
        console.error('Erreur:', error);
        showError('Erreur lors du chargement du client');
    }
}

/**
 * Annule l'édition et réinitialise le formulaire
 */
function cancelEdit() {
    editingClientId = null;
    clientForm.reset();
    clientIdInput.value = '';
    formTitle.textContent = 'Ajouter un nouveau client';
    submitBtn.textContent = 'Ajouter';
    cancelBtn.style.display = 'none';
}

// ==================== GESTIONNAIRES D'ÉVÉNEMENTS ====================

/**
 * Gestion de la soumission du formulaire
 */
clientForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideError();
    
    const formData = new FormData(clientForm);
    const clientData = {
        nom: formData.get('nom'),
        prenom: formData.get('prenom'),
        email: formData.get('email'),
        telephone: formData.get('telephone') || '',
        adresse: formData.get('adresse') || ''
    };
    
    // Validation
    if (!clientData.nom || !clientData.prenom || !clientData.email) {
        showError('Veuillez remplir tous les champs obligatoires (nom, prénom, email)');
        return;
    }
    
    if (editingClientId) {
        // Modification
        await updateClient(editingClientId, clientData);
    } else {
        // Création
        await createClient(clientData);
    }
});

/**
 * Gestion du bouton Annuler
 */
cancelBtn.addEventListener('click', cancelEdit);

// ==================== INITIALISATION ====================

// Charger les clients au démarrage
fetchClients();

// Recharger la liste toutes les 30 secondes (optionnel)
// setInterval(fetchClients, 30000);
