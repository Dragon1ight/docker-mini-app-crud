# Dockerfile pour le frontend
# Ce Dockerfile crée une image pour servir les fichiers HTML/CSS/JS
# Le context est la racine du projet (mini-app/)

# Utiliser nginx pour servir les fichiers statiques
FROM nginx:alpine

# Copier les fichiers du frontend vers le répertoire nginx
# Note: Dans docker-compose, on utilisera un bind mount pour le développement
COPY frontend/ /usr/share/nginx/html

# Exposer le port 80 (port par défaut de nginx)
EXPOSE 80

# Nginx démarre automatiquement, pas besoin de CMD explicite
# Mais on peut le spécifier pour être explicite
CMD ["nginx", "-g", "daemon off;"]
