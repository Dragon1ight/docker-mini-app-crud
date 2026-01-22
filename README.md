# 📋 Application CRUD - Gestion de Clients

## 📖 Description

Cette application est une mini-application CRUD (Create, Read, Update, Delete) full-stack pour la gestion de clients. Elle a été développée dans le cadre d'un TP Docker et démontre l'utilisation de Docker et Docker Compose pour conteneuriser une application moderne.

### Thème de l'application
**Gestion de clients** : Application permettant de gérer une base de données de clients avec leurs informations (nom, prénom, email, téléphone, adresse).

### Groupe
- **Classe** : Master 2 - Architecte Web
- **Étudiants** : Khalid ZAÏM
                  Youssef Kaddouhi
                  Omar EL ASRI
                  Ayoub CHAOUI

---

## 🏗️ Architecture

L'application suit une architecture microservices avec les composants suivants :

```
mini-app/
│
├── frontend/          # Application frontend (HTML, CSS, JavaScript)
│   ├── index.html
│   ├── style.css
│   └── app.js
│
├── backend/           # API REST Node.js/Express
│   ├── server.js
│   └── package.json
│
├── docker/
│   ├── frontend/
│   │   └── Dockerfile
│   └── backend/
│       └── Dockerfile
│
├── docker-compose.yml # Orchestration de tous les services
└── README.md
```

### Composants

1. **Frontend** : Interface utilisateur simple et moderne en HTML/CSS/JavaScript
   - Affichage de la liste des clients
   - Formulaire d'ajout/modification
   - Communication avec l'API via HTTP

2. **Backend** : API REST Node.js/Express
   - Endpoints CRUD complets (GET, POST, PUT, DELETE)
   - Connexion à MongoDB via Mongoose
   - Gestion des erreurs et validation

3. **Base de données** : MongoDB
   - Conteneur MongoDB pour stocker les données
   - Persistance via volume Docker
   - Collection `clients` avec schéma défini

4. **MongoDB Compass** : Interface de visualisation
   - Utilisation de Mongo Express (alternative web à Compass)
   - Visualisation et manipulation des données

---

## 🚀 Commandes

### Prérequis
- Docker installé
- Docker Compose installé

### Lancer le projet

```bash
# Se placer dans le répertoire du projet
cd mini-app

# Démarrer tous les services
docker-compose up -d

# Voir les logs
docker-compose logs -f

# Voir les logs d'un service spécifique
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongodb
```

### Arrêter le projet

```bash
# Arrêter tous les services (sans supprimer les volumes)
docker-compose stop

# Arrêter et supprimer les conteneurs (les données MongoDB sont conservées)
docker-compose down

# Arrêter et supprimer les conteneurs ET les volumes (⚠️ supprime les données)
docker-compose down -v
```

### Rebuild les images

```bash
# Rebuild toutes les images
docker-compose build

# Rebuild un service spécifique
docker-compose build backend
docker-compose build frontend

# Rebuild et redémarrer
docker-compose up -d --build
```

### Vérifier l'état des services

```bash
# Voir les conteneurs en cours d'exécution
docker-compose ps

# Voir les logs en temps réel
docker-compose logs -f
```

---

## 🌐 Ports utilisés

| Service | Port hôte | Port conteneur | URL d'accès |
|---------|-----------|----------------|-------------|
| **Frontend** | 8080 | 80 | http://localhost:8080 |
| **Backend API** | 3000 | 3000 | http://localhost:3000 |
| **MongoDB** | 27017 | 27017 | mongodb://localhost:27017 |
| **Mongo Express** | 8081 | 8081 | http://localhost:8081 |

### Accès aux services

- **Application Frontend** : Ouvrir http://localhost:8080 dans votre navigateur
- **API Backend** : http://localhost:3000/api/clients
- **Mongo Express** : http://localhost:8081
  - Username : `admin`
  - Password : `admin123`

---

## 📡 API REST

L'API expose les endpoints suivants :

### Base URL
```
http://localhost:3000/api
```

### Endpoints

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `GET` | `/api/clients` | Liste tous les clients |
| `GET` | `/api/clients/:id` | Récupère un client par son ID |
| `POST` | `/api/clients` | Crée un nouveau client |
| `PUT` | `/api/clients/:id` | Met à jour un client existant |
| `DELETE` | `/api/clients/:id` | Supprime un client |
| `GET` | `/api/health` | Vérifie que l'API fonctionne |

### Exemple de requête POST

```bash
curl -X POST http://localhost:3000/api/clients \
  -H "Content-Type: application/json" \
  -d '{
    "nom": "Dupont",
    "prenom": "Jean",
    "email": "jean.dupont@example.com",
    "telephone": "0123456789",
    "adresse": "123 Rue de la Paix, Paris"
  }'
```

### Exemple de réponse

```json
{
  "success": true,
  "message": "Client créé avec succès",
  "data": {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "nom": "Dupont",
    "prenom": "Jean",
    "email": "jean.dupont@example.com",
    "telephone": "0123456789",
    "adresse": "123 Rue de la Paix, Paris",
    "createdAt": "2026-01-22T12:00:00.000Z",
    "updatedAt": "2026-01-22T12:00:00.000Z"
  }
}
```

---

## 🗄️ Base de données MongoDB

### Structure de la collection `clients`

```javascript
{
  _id: ObjectId,
  nom: String (requis),
  prenom: String (requis),
  email: String (requis),
  telephone: String (optionnel),
  adresse: String (optionnel),
  createdAt: Date,
  updatedAt: Date
}
```

### Accès via Mongo Express

1. Ouvrir http://localhost:8081
2. Se connecter avec :
   - Username : `admin`
   - Password : `admin123`
3. Sélectionner la base de données `clientsdb`
4. Explorer la collection `clients`

### Persistance des données

Les données sont stockées dans un volume Docker nommé `mongodb_data`. Même après l'arrêt des conteneurs, les données sont conservées.

---

## 🔧 Fonctionnalités

### ✅ Opérations CRUD

- ✅ **Create (Créer)** : Ajouter un nouveau client via le formulaire
- ✅ **Read (Lire)** : Afficher la liste de tous les clients
- ✅ **Update (Modifier)** : Modifier un client existant (via le bouton "Modifier")
- ✅ **Delete (Supprimer)** : Supprimer un client (via le bouton "Supprimer")

### 🔄 Bind Mounts

Les bind mounts sont configurés pour permettre la modification du code sans rebuild :

- **Backend** : `./backend:/app`
- **Frontend** : `./frontend:/usr/share/nginx/html`

**Avantage** : Modifiez le code sur votre machine, et les changements sont immédiatement visibles dans les conteneurs (après rechargement pour le frontend, redémarrage pour le backend si nécessaire).

---

## 🧪 Tests et Validation

### Vérifications à effectuer

1. ✅ **Application accessible** : Ouvrir http://localhost:8080 et vérifier que l'interface s'affiche
2. ✅ **Ajout de client** : Créer un nouveau client via le formulaire
3. ✅ **Liste des clients** : Vérifier que le client apparaît dans la liste
4. ✅ **Modification** : Cliquer sur "Modifier", changer des informations et sauvegarder
5. ✅ **Suppression** : Supprimer un client et vérifier qu'il disparaît de la liste
6. ✅ **MongoDB Compass** : Ouvrir Mongo Express et vérifier que les données sont visibles
7. ✅ **Persistance** : Arrêter les conteneurs (`docker-compose stop`), puis les redémarrer (`docker-compose up -d`) et vérifier que les données sont toujours présentes
8. ✅ **Bind mounts** : Modifier un fichier (ex: `frontend/style.css`) et vérifier que le changement est visible sans rebuild

---

## 🐛 Dépannage

### Le frontend ne se connecte pas à l'API

- Vérifier que le backend est démarré : `docker-compose ps`
- Vérifier les logs du backend : `docker-compose logs backend`
- Vérifier que l'API répond : http://localhost:3000/api/health

### MongoDB ne démarre pas

- Vérifier les logs : `docker-compose logs mongodb`
- Vérifier que le port 27017 n'est pas déjà utilisé
- Supprimer le volume et redémarrer : `docker-compose down -v && docker-compose up -d`

### Les modifications du code ne sont pas visibles

- Pour le backend : Redémarrer le service `docker-compose restart backend`
- Pour le frontend : Recharger la page dans le navigateur (F5)
- Vérifier que les bind mounts sont bien configurés dans `docker-compose.yml`

### Erreur de connexion à MongoDB

- Vérifier que le service `mongodb` est démarré et healthy
- Vérifier la variable d'environnement `MONGODB_URI` dans `docker-compose.yml`
- Attendre quelques secondes après le démarrage pour que MongoDB soit prêt

---

## 📚 Technologies utilisées

- **Frontend** : HTML5, CSS3, JavaScript (Vanilla)
- **Backend** : Node.js, Express.js
- **Base de données** : MongoDB
- **ORM/ODM** : Mongoose
- **Conteneurisation** : Docker, Docker Compose
- **Serveur web** : Nginx (pour le frontend)
- **Interface MongoDB** : Mongo Express

---

## 📝 Notes importantes

- Les données MongoDB sont persistantes grâce aux volumes Docker
- Les bind mounts permettent de modifier le code sans rebuild
- Tous les services communiquent via le réseau Docker `crud-network`
- Le backend attend que MongoDB soit "healthy" avant de démarrer (healthcheck)


---

**Date de création** : Janvier 2026  
**Version** : 1.0.0
