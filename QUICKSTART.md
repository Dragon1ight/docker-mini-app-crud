# 🚀 Guide de démarrage rapide

## Démarrage en 3 étapes

### 1. Se placer dans le répertoire du projet
```bash
cd mini-app
```

### 2. Démarrer tous les services
```bash
docker-compose up -d
```

### 3. Accéder à l'application
- **Frontend** : http://localhost:8080
- **API Backend** : http://localhost:3000/api/clients
- **Mongo Express** : http://localhost:8081 (admin/admin123)

## Vérification rapide

### Tester l'API
```bash
# Vérifier que l'API fonctionne
curl http://localhost:3000/api/health

# Créer un client de test
curl -X POST http://localhost:3000/api/clients \
  -H "Content-Type: application/json" \
  -d '{"nom":"Dupont","prenom":"Jean","email":"jean@example.com"}'
```

### Voir les logs
```bash
# Tous les services
docker-compose logs -f

# Un service spécifique
docker-compose logs -f backend
```

## Arrêt
```bash
docker-compose stop
```

## Redémarrage
```bash
docker-compose restart
```

## Nettoyage complet (⚠️ supprime les données)
```bash
docker-compose down -v
```

---

Pour plus de détails, consultez le [README.md](README.md)
