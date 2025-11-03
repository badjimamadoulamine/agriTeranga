# AgriTeranga - Système d'Authentification Consommateurs

## 🎯 Fonctionnalités Implémentées

✅ **Inscription des Consommateurs**
- Formulaire en 3 étapes avec validation
- Informations de base (profil, contact)
- Sélection du rôle (consommateur/producteur/livreur) 
- Informations spécifiques consommateur
- Email de vérification automatique

✅ **Connexion Sécurisée**
- Authentification par email ou téléphone
- Gestion d'état avec JWT
- Messages d'erreur clairs
- Interface responsive

✅ **Interface Utilisateur Dynamique**
- Header adaptatif (connexion/inscription → panier/profil)
- Menu déroulant profil avec options
- Menu mobile optimisé
- Gestion de session persistante

✅ **Backend Robuste**
- API REST complète avec validation
- Système d'emails avec templates HTML
- Sécurité renforcée (JWT, bcrypt, rate limiting)
- Logs et monitoring intégrés

## 🚀 Démarrage Rapide

### 1. Installation Backend
```bash
cd back
npm install
npm start
```

### 2. Installation Frontend  
```bash
cd front
npm install
npm run dev
```

### 3. Configuration Environment

**Backend (.env)**:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=votre-connexion-mongodb
JWT_SECRET=votre-secret-jwt
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=votre-email@gmail.com
SMTP_PASSWORD=votre-mot-de-passe-app
FRONTEND_URL=http://localhost:3000
```

**Frontend (.env)**:
```env
VITE_API_URL=http://localhost:5000/api
```

## 🧪 Tests

### Test Complet du Système
```bash
cd back
node test-auth-system.js
```

Ce script teste :
- ✅ Connexion API
- ✅ Inscription consommateur  
- ✅ Vérification email
- ✅ Connexion/déconnexion
- ✅ Routes protégées
- ✅ Validations sécurité

## 📧 Flux Email

1. **Inscription** → Email de vérification envoyé
2. **Clic lien** → Vérification automatique 
3. **Redirection** → Page de connexion avec token
4. **Connexion** → Utilisateur connecté

## 🔒 Sécurité

- **Mots de passe** : Hash bcrypt + salt
- **Tokens** : JWT avec expiration 24h
- **Validation** : Contrôles côté serveur
- **Rate Limiting** : Protection anti-spam
- **XSS Protection** : Échappement des données

## 📱 Interface Mobile

Le système est entièrement responsive avec :
- Menus adaptatifs
- Navigation tactile optimisée
- Modals responsive
- Header dynamique

## 🛠️ Architecture

```
Frontend (React/Vite)
├── AuthContext (État global)
├── Services (API calls)
├── Components (Modals, Header)
└── Pages (Routes)

Backend (Node.js/Express)  
├── Controllers (Logique métier)
├── Models (MongoDB schemas)
├── Middlewares (Auth, Validation)
├── Routes (API endpoints)
└── Services (Email, Notifications)
```

## 📚 Documentation

- **Guide complet** : `docs/INSCRIPTION_CONSOMMATEUR.md`
- **Tests automatisés** : `back/test-auth-system.js`
- **API Documentation** : Swagger intégré

## 🎉 Utilisation

### Pour les Consommateurs
1. **S'inscrire** → Bouton "S'inscrire" → Consommateur
2. **Vérifier email** → Lien reçu par email  
3. **Se connecter** → Email + mot de passe
4. **Commander** → Accès au panier et profil

### Pour les Développeurs
1. **Consulter la doc** → `docs/INSCRIPTION_CONSOMMATEUR.md`
2. **Lancer les tests** → `node test-auth-system.js`
3. **API Testing** → Postman ou Thunder Client
4. **Monitoring** → Logs backend + console frontend

## 🔄 Prochaines Étapes

- [ ] Intégration système de panier
- [ ] Gestion des commandes
- [ ] Notifications push
- [ ] Authentification sociale (Google, Facebook)
- [ ] Mode hors-ligne
- [ ] Tests automatisés E2E

---

**Status** : ✅ **Production Ready**  
**Version** : 1.0.0  
**Last Update** : Octobre 2025