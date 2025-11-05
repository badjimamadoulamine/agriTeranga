# 🚀 Guide de Démarrage - API Agriculture

## ⚡ Démarrage Rapide (3 Étapes)

### 1. Installer et Configurer

```bash
# Installer les dépendances
npm install

# Copier et configurer l'environnement
cp .env.example .env
# Éditer .env avec vos paramètres
```

### 2. Démarrer MongoDB

```bash
# Avec systemctl (Linux)
sudo systemctl start mongod

# Ou avec Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### 3. Lancer le Serveur

```bash
# Mode développement
npm run dev

# Mode production
npm start
```

✅ **L'API est maintenant accessible sur** : `http://localhost:5000`  
📚 **Documentation Swagger** : `http://localhost:5000/api-docs`

---

## 📝 Configuration Détaillée

### Prérequis

- **Node.js** >= 14.x
- **MongoDB** >= 4.x
- **npm** ou **yarn**

```bash
# Vérifier les versions
node --version
npm --version
mongod --version
```

### Installation Complète

```bash
# 1. Se placer dans le répertoire
cd agriculture-api

# 2. Installer les dépendances
npm install

# Si erreur, essayer:
npm install --legacy-peer-deps
```

### Configuration (.env)

```bash
# Copier le fichier d'exemple
cp .env.example .env
```

**Paramètres importants dans `.env` :**

```env
# Environnement
NODE_ENV=development
PORT=5000

# Base de données
MONGODB_URI=mongodb://localhost:27017/agriculture_db

# Sécurité (IMPORTANT: Changez en production!)
JWT_SECRET=votre_secret_jwt_tres_securise
JWT_EXPIRE=7d

# Email (optionnel)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=votre_email@gmail.com
SMTP_PASSWORD=votre_mot_de_passe_app

# Frontend
FRONTEND_URL=http://localhost:3000
```

### Démarrer MongoDB

#### Option A : MongoDB Local

```bash
# Linux
sudo systemctl start mongod
sudo systemctl status mongod

# macOS
brew services start mongodb-community

# Windows
net start MongoDB
```

#### Option B : Docker

```bash
# Démarrer MongoDB avec Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Vérifier
docker ps | grep mongodb
```

---

## 🧪 Tests Rapides

### Vérifier que l'API Fonctionne

```bash
# Test de santé
curl http://localhost:5000/api/v1/health

# Réponse attendue:
# {"status":"success","message":"API Agriculture fonctionne correctement"}
```

### Tester les Nouvelles Fonctionnalités

```bash
# Exécuter le script de test automatisé
node test-profile-management.js
```

Ce script teste automatiquement :
- ✅ Connexion
- ✅ Gestion du profil
- ✅ Changement de mot de passe
- ✅ Sécurité des champs sensibles

### Créer un Utilisateur Test

```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "test@example.com",
    "password": "password123",
    "role": "consommateur"
  }'
```

### Se Connecter

```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Copiez le `token` de la réponse pour les requêtes suivantes.**

### Tester une Route Protégée

```bash
# Obtenir mon profil
curl -X GET http://localhost:5000/api/v1/users/me \
  -H "Authorization: Bearer VOTRE_TOKEN"

# Modifier mon profil
curl -X PUT http://localhost:5000/api/v1/users/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer VOTRE_TOKEN" \
  -d '{
    "firstName": "Nouveau Prénom",
    "lastName": "Nouveau Nom"
  }'

# Changer mon mot de passe
curl -X PUT http://localhost:5000/api/v1/users/change-password \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer VOTRE_TOKEN" \
  -d '{
    "currentPassword": "password123",
    "newPassword": "nouveaumotdepasse123",
    "confirmPassword": "nouveaumotdepasse123"
  }'
```

---

## 🔧 Dépannage

### Erreur : "Cannot find module"

```bash
# Réinstaller les dépendances
rm -rf node_modules package-lock.json
npm install
```

### Erreur : "MongoNetworkError" ou "ECONNREFUSED"

```bash
# Vérifier que MongoDB est démarré
mongosh --eval "db.runCommand({ connectionStatus: 1 })"

# Ou avec l'ancienne version
mongo --eval "db.runCommand({ connectionStatus: 1 })"
```

### Erreur : "Port 5000 already in use"

```bash
# Option 1 : Changer le port dans .env
echo "PORT=5001" >> .env

# Option 2 : Tuer le processus
lsof -ti:5000 | xargs kill -9
```

### Erreur : "JWT_SECRET is not defined"

```bash
# Vérifier .env
cat .env | grep JWT_SECRET

# Si absent, ajouter:
echo "JWT_SECRET=$(openssl rand -base64 32)" >> .env
```

### Les tests échouent

```bash
# 1. Vérifier que le serveur est lancé
curl http://localhost:5000/api/v1/health

# 2. Vérifier qu'un utilisateur test existe
# Si non, créez-en un (voir section "Créer un Utilisateur Test")

# 3. Vérifier MongoDB
mongosh --eval "show dbs"
```

---

## 📚 Endpoints Principaux

### Santé & Documentation
```
GET  /api/v1/health          # Test de santé
GET  /api-docs               # Documentation Swagger
```

### Authentification
```
POST /api/v1/auth/register   # Inscription
POST /api/v1/auth/login      # Connexion
GET  /api/v1/auth/me         # Mon profil
```

### Gestion de Profil (Nouvelles Fonctionnalités)
```
GET  /api/v1/users/me                # Mon profil
PUT  /api/v1/users/profile           # Modifier mon profil (adapté au rôle)
PUT  /api/v1/users/change-password   # Changer mon mot de passe
```

### Produits
```
GET  /api/v1/products        # Liste des produits
POST /api/v1/products        # Créer un produit (producteur)
```

### Commandes
```
GET  /api/v1/orders          # Mes commandes
POST /api/v1/orders          # Créer une commande
GET  /api/v1/orders/history  # Historique des transactions
```

---

## 👥 Rôles Disponibles

| Rôle | Français | Anglais | Peut... |
|------|----------|---------|----------|
| Consommateur | `consommateur` | `consumer` | Acheter, commander, modifier son profil |
| Producteur | `producteur` | `producer` | Vendre, gérer produits, infos producteur |
| Livreur | `livreur` | `deliverer` | Livrer, infos livreur |
| Admin | `admin` | `admin` | Tout gérer |

**Note :** L'API accepte les deux formes (français et anglais).

---

## 🔒 Sécurité

### En Développement
- ✅ `.env` ignoré par Git
- ✅ Mots de passe hashés avec bcrypt
- ✅ Tokens JWT (expiration 7 jours)
- ✅ Champs sensibles protégés

### En Production

**IMPORTANT - Checklist Sécurité :**

```env
# .env pour la production
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db
JWT_SECRET=$(openssl rand -base64 64)  # Valeur aléatoire unique!
FRONTEND_URL=https://votre-domaine.com
```

- [ ] Changez `JWT_SECRET` pour une valeur aléatoire unique
- [ ] Utilisez HTTPS obligatoirement
- [ ] Configurez CORS correctement
- [ ] Activez tous les middlewares de sécurité
- [ ] Limitez les taux de requêtes
- [ ] Utilisez une base de données sécurisée (MongoDB Atlas)
- [ ] Activez les logs de sécurité
- [ ] Configurez un pare-feu

---

## 📚 Documentation Complète

| Fichier | Description |
|---------|-------------|
| **README.md** | Documentation générale du projet |
| **API-REFERENCE.md** | Référence complète de l'API |
| **GESTION-PROFIL.md** | Guide des fonctionnalités de profil et mot de passe |
| **test-profile-management.js** | Script de test automatisé |

---

## 🚀 Ressources Utiles

- [Documentation Express](https://expressjs.com/)
- [Documentation Mongoose](https://mongoosejs.com/)
- [Documentation JWT](https://jwt.io/)
- [Documentation Swagger](https://swagger.io/)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

---

## ❓ Besoin d'Aide ?

1. 🐛 Vérifiez les logs du serveur
2. 📊 Exécutez les tests : `node test-profile-management.js`
3. 📖 Consultez **GESTION-PROFIL.md** pour les nouvelles fonctionnalités
4. 📝 Consultez **API-REFERENCE.md** pour la référence API
5. 🚀 Swagger UI : http://localhost:5000/api-docs

---

**Bon développement ! 🎉**
