# Dockerfile pour le backend Node.js/Express
# Ce Dockerfile crée une image pour l'API REST
# Le context est la racine du projet (mini-app/)

# Image de base Node.js (version LTS)
FROM node:18-alpine

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier le fichier package.json pour installer les dépendances
# On copie d'abord package.json pour bénéficier du cache Docker
COPY backend/package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste du code backend (sera monté via bind mount dans docker-compose)
# Cette copie est utile pour le build initial
COPY backend/ .

# Exposer le port 3000 (port de l'API)
EXPOSE 3000

# Commande pour démarrer le serveur
# Utilisation de nodemon en développement pour le rechargement automatique
CMD ["npm", "start"]
