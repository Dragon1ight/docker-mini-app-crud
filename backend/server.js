/**
 * Serveur Express pour l'API REST de gestion de clients
 * 
 * Ce serveur expose une API REST complète avec les opérations CRUD :
 * - GET /api/clients : Liste tous les clients
 * - POST /api/clients : Crée un nouveau client
 * - PUT /api/clients/:id : Met à jour un client existant
 * - DELETE /api/clients/:id : Supprime un client
 */

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Permet les requêtes depuis le frontend
app.use(express.json()); // Parse les requêtes JSON

// Connexion à MongoDB
// La variable d'environnement MONGODB_URI est définie dans docker-compose.yml
mongoose.connect(process.env.MONGODB_URI || 'mongodb://mongodb:27017/clientsdb')
.then(() => {
  console.log('✅ Connexion à MongoDB réussie');
})
.catch((error) => {
  console.error('❌ Erreur de connexion à MongoDB:', error);
});

// Schéma Mongoose pour le modèle Client
const clientSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true,
    trim: true
  },
  prenom: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  telephone: {
    type: String,
    trim: true
  },
  adresse: {
    type: String,
    trim: true
  }
}, {
  timestamps: true // Ajoute automatiquement createdAt et updatedAt
});

// Modèle Client
const Client = mongoose.model('Client', clientSchema);

// ==================== ROUTES API ====================

/**
 * GET /api/clients
 * Récupère tous les clients
 */
app.get('/api/clients', async (req, res) => {
  try {
    const clients = await Client.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      data: clients,
      count: clients.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des clients',
      error: error.message
    });
  }
});

/**
 * GET /api/clients/:id
 * Récupère un client par son ID
 */
app.get('/api/clients/:id', async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client non trouvé'
      });
    }
    res.json({
      success: true,
      data: client
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du client',
      error: error.message
    });
  }
});

/**
 * POST /api/clients
 * Crée un nouveau client
 */
app.post('/api/clients', async (req, res) => {
  try {
    // Validation des champs requis
    const { nom, prenom, email } = req.body;
    if (!nom || !prenom || !email) {
      return res.status(400).json({
        success: false,
        message: 'Les champs nom, prenom et email sont requis'
      });
    }

    const client = new Client(req.body);
    const savedClient = await client.save();
    
    res.status(201).json({
      success: true,
      message: 'Client créé avec succès',
      data: savedClient
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création du client',
      error: error.message
    });
  }
});

/**
 * PUT /api/clients/:id
 * Met à jour un client existant
 */
app.put('/api/clients/:id', async (req, res) => {
  try {
    const client = await Client.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true } // new: true retourne le document mis à jour
    );

    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client non trouvé'
      });
    }

    res.json({
      success: true,
      message: 'Client mis à jour avec succès',
      data: client
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du client',
      error: error.message
    });
  }
});

/**
 * DELETE /api/clients/:id
 * Supprime un client
 */
app.delete('/api/clients/:id', async (req, res) => {
  try {
    const client = await Client.findByIdAndDelete(req.params.id);

    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client non trouvé'
      });
    }

    res.json({
      success: true,
      message: 'Client supprimé avec succès',
      data: client
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression du client',
      error: error.message
    });
  }
});

// Route de test pour vérifier que l'API fonctionne
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'API fonctionnelle',
    timestamp: new Date().toISOString()
  });
});

// Démarrage du serveur
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Serveur API démarré sur le port ${PORT}`);
  console.log(`📍 URL: http://localhost:${PORT}`);
});
