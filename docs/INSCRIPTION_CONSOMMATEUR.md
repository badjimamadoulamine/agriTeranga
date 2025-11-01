# Système d'Inscription et de Connexion des Consommateurs - AgriTeranga

## Vue d'ensemble

Ce document explique le système d'inscription et de connexion implémenté pour les consommateurs sur la plateforme AgriTeranga.

## Fonctionnalités Implémentées

### 1. Inscription des Consommateurs

#### Processus d'inscription
1. **Étape 1 - Informations de base** :
   - Photo de profil (optionnelle)
   - Prénom, nom
   - Email unique
   - Mot de passe sécurisé (minimum 8 caractères)
   - Numéro de téléphone
   - Adresse

2. **Étape 2 - Sélection du rôle** :
   - **Consommateur** (sélection par défaut)
   - Producteur
   - Livreur

3. **Étape 3 - Informations spécifiques consommateur** :
   - Préférences alimentaires (bio, local, saisonnier, etc.)
   - Biographie (optionnelle)
   - Newsletter (optionnel)

#### Validation des données
- Email unique et format valide
- Mot de passe minimum 8 caractères
- Numéro de téléphone requis
- Champs obligatoires vérifiés

### 2. Vérification par Email

#### Processus de vérification
1. Après inscription, un email de vérification est envoyé automatiquement
2. L'email contient un lien de vérification valide 24h
3. Cliquer sur le lien redirige vers la page de connexion
4. La vérification automatique active le compte et connecte l'utilisateur

#### Email de vérification
- **Template** : HTML professionnel avec logo AgriTeranga
- **Contenu** : 
  - Message de bienvenue personnalisé
  - Bouton de vérification
  - Lien de secours en cas de problème
  - Instructions claires

### 3. Connexion des Consommateurs

#### Méthodes de connexion
- **Email** : `utilisateur@exemple.com`
- **Téléphone** : Format international (+221...)

#### Interface de connexion
- Modal responsive avec design cohérent
- Gestion des erreurs avec messages clairs
- États de chargement pendant l'authentification
- Option "Se souvenir de moi"

#### Flux de connexion
1. Saisie des identifiants
2. Vérification du compte (actif, non supprimé)
3. **Vérification obligatoire du compte par email**
4. Génération du token JWT
5. Stockage sécurisé des données utilisateur
6. Redirection vers la page d'accueil

### 4. Interface Utilisateur Dynamique

#### Header adaptatif
**Utilisateur non connecté** :
- Boutons "Se connecter" et "S'inscrire"

**Utilisateur connecté (consommateur)** :
- **Icône panier** avec compteur d'articles
- **Menu profil** avec :
  - Photo de profil et nom
  - Mon Profil
  - Mes Commandes
  - Paramètres
  - Déconnexion

#### Menu mobile
- Interface adaptative pour tous les écrans
- Navigation optimisée pour mobile
- Accès rapide aux fonctionnalités principales

### 5. Gestion de Session

#### Stockage sécurisé
- **Token JWT** : Stocké dans localStorage
- **Données utilisateur** : Objet utilisateur complet
- **Durée** : 24h (configurable)

#### État global
- **Contexte React** : Gestion centralisée de l'authentification
- **Persistance** : Session maintenue entre les rechargements
- **Déconnexion** : Nettoyage automatique des données

## Architecture Technique

### Backend (Node.js/Express)

#### Modèles de données
```javascript
// Schéma utilisateur avec informations consommateur
const userSchema = {
  firstName: String,
  lastName: String,
  email: String (unique),
  phone: String,
  role: 'consommateur' | 'producteur' | 'livreur',
  consumerInfo: {
    preferences: String,
    deliveryAddress: String,
    bio: String,
    isSubscribed: Boolean
  },
  isVerified: Boolean,
  verificationToken: String,
  verificationExpire: Date
}
```

#### API Endpoints
- `POST /api/auth/register` - Inscription
- `GET /api/auth/verify-email/:token` - Vérification email
- `POST /api/auth/login` - Connexion
- `GET /api/auth/me` - Profil utilisateur
- `POST /api/auth/logout` - Déconnexion

#### Sécurité
- **JWT** : Tokens sécurisés avec expiration
- **Hashage** : Bcrypt pour les mots de passe
- **Validation** : Contrôles côté serveur
- **Rate Limiting** : Protection contre le spam

### Frontend (React/Vite)

#### Services
```javascript
// Service d'authentification
authService.register(userData)     // Inscription
authService.login(credentials)     // Connexion  
authService.verifyEmail(token)     // Vérification
authService.getCurrentUser()       // Utilisateur actuel
authService.logout()              // Déconnexion
```

#### Contexte d'authentification
```javascript
// Context global
<AuthProvider>
  <AppContent />
</AuthProvider>

// Hook personnalisé
const { user, login, logout } = useAuth()
```

#### Composants principaux
- **RegisterModal** : Formulaire d'inscription 3 étapes
- **LoginModal** : Interface de connexion
- **Header** : Navigation adaptative
- **AuthContext** : Gestion d'état global

## Configuration

### Variables d'environnement Backend
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=votre-secret-jwt
JWT_EXPIRE=24h
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=votre-email@gmail.com
SMTP_PASSWORD=votre-mot-de-passe-app
FROM_NAME=Plateforme agriTeranga
FROM_EMAIL=votre-email@gmail.com
FRONTEND_URL=http://localhost:3000
LOGO_URL=https://votre-logo-url.com
```

### Variables d'environnement Frontend
```env
VITE_API_URL=http://localhost:5000/api
VITE_GEMINI_API_KEY=votre-cle-gemini
```

## Flux Utilisateur

### Inscription Consommateur
1. **Clic "S'inscrire"** → Ouvre le modal d'inscription
2. **Étape 1** → Remplit les informations de base
3. **Étape 2** → Sélectionne "Consommateur"
4. **Étape 3** → Configure ses préférences (optionnel)
5. **Soumission** → Envoi des données au backend
6. **Email** → Réception du email de vérification
7. **Vérification** → Clic sur le lien dans l'email
8. **Redirection** → Vers la page de connexion avec token
9. **Connexion auto** → Utilisateur connecté automatiquement

### Connexion
1. **Clic "Se connecter"** → Ouvre le modal de connexion
2. **Saisie identifiants** → Email ou téléphone + mot de passe
3. **Validation** → Vérification du compte
4. **Connexion** → Token généré et stocké
5. **Interface** → Header mis à jour avec panier/profil

### Gestion de session
1. **Persistance** → Session maintenue
2. **Renouvellement** → Automatic sur activité
3. **Expiration** → Déconnexion auto après 24h
4. **Déconnexion** → Nettoyage complet des données

## Sécurité Implémentée

### Protection des données
- **Mots de passe** : Hash bcrypt + salt
- **Tokens** : JWT avec expiration courte
- **Email** : Validation stricte des formats
- **Téléphone** : Validation E.164

### Prévention des attaques
- **XSS** : Échappement des données
- **CSRF** : Tokens dans headers
- **Injection** : Validation stricte
- **Brute force** : Rate limiting

### Conformité RGPD
- **Consentement** : Newsletter optionnelle
- **Données minimales** : Seules les données nécessaires
- **Droit à l'oubli** : Soft delete implémenté
- **Transparence** : Messages d'erreur explicites

## Maintenance et Monitoring

### Logs
- **Inscriptions** : Succès/échecs
- **Connexions** : Tentatives et résultats
- **Emails** : Envois et erreurs
- **Sécurité** : Tentatives suspectes

### Métriques
- **Taux d'inscription** : Consommateurs par jour
- **Taux de vérification** : Emails ouverts/clics
- **Taux de connexion** : Utilisateurs actifs
- **Erreurs** : Problèmes techniques

### Alertes
- **Échec d'email** : Service SMTP down
- **Trop d'échecs** : Attaque potentielle
- **Erreurs API** : Problèmes serveur
- **Performance** : Temps de réponse élevés

## Prochaines Améliorations

### Court terme
- [ ] Vérification téléphone (SMS)
- [ ] Connexion sociale (Google, Facebook)
- [ ] Authentification à deux facteurs
- [ ] Amélioration design mobile

### Moyen terme
- [ ] Notifications push
- [ ] Géolocalisation pour livraison
- [ ] Historique des commandes
- [ ] Système de favoris

### Long terme
- [ ] Intelligence artificielle pour recommandations
- [ ] Chat en temps réel support client
- [ ] Programme de fidélité
- [ ] Marketplace multi-vendeurs

---

## Support et Contact

Pour toute question ou problème :
- **Email** : support@agriteranga.com
- **Documentation** : Cette documentation + API docs
- **Support technique** : Via la plateforme de support

---

*Dernière mise à jour : Octobre 2025*
*Version : 1.0*