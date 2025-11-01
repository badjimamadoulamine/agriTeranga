# API Agriculture - Référence Rapide

## 🔑 Authentification

Tous les endpoints nécessitant une authentification doivent inclure:
```
Authorization: Bearer <votre_token_jwt>
```

## 📡 Endpoints

### Auth (`/api/v1/auth`)

| Méthode | Endpoint | Auth | Description |
|---------|----------|------|-------------|
| POST | `/register` | Non | Inscription |
| POST | `/login` | Non | Connexion |
| POST | `/logout` | Oui | Déconnexion |
| GET | `/me` | Oui | Profil actuel |
| POST | `/forgot-password` | Non | Mot de passe oublié |
| POST | `/reset-password/:token` | Non | Réinitialiser MDP |
| PATCH | `/update-password` | Oui | Changer MDP |

### Utilisateurs (`/api/v1/users`)

| Méthode | Endpoint | Auth | Rôles | Description |
|---------|----------|------|-------|-------------|
| GET | `/me` | Oui | Tous | Mon profil |
| GET | `/profile/:id` | Oui | Tous | Profil utilisateur |
| **PUT** | **`/profile`** | **Oui** | **Tous** | **Mettre à jour profil (adapté au rôle)** |
| **PUT** | **`/change-password`** | **Oui** | **Tous** | **Changer le mot de passe** |
| PUT | `/preferences` | Oui | Tous | Préférences (langue, thème, notifs) |
| DELETE | `/account` | Oui | Tous | Désactiver compte |
| GET | `/stats` | Oui | Producteur | Mes statistiques |
| GET | `/deliverer/stats` | Oui | Livreur | Mes stats livreur |
| GET | `/producers` | Oui | Tous | Liste producteurs |

**Champs modifiables par rôle** :
- **Tous** : `firstName`, `lastName`, `phone`, `profilePicture`, `preferences`
- **Producteur** : + `producteurInfo` (cultureType, region, farmSize, description, certificates)
- **Livreur** : + `livreurInfo` (deliveryZone, vehicleType, isAvailable)
- **Admin** : Tous les champs

**Champs protégés** (non modifiables via `/profile`) :
- `password` (utiliser `/change-password`)
- `email`, `role`, `isActive`, `isVerified`

### Produits (`/api/v1/products`)

| Méthode | Endpoint | Auth | Rôles | Description |
|---------|----------|------|-------|-------------|
| GET | `/` | Non | - | Liste produits |
| GET | `/:id` | Non | - | Détails produit |
| POST | `/` | Oui | Producteur | Créer produit |
| PUT | `/:id` | Oui | Producteur | Modifier produit |
| DELETE | `/:id` | Oui | Producteur/Admin | Supprimer produit |
| POST | `/:id/reviews` | Oui | Consommateur | Ajouter avis |

**Filtres GET /**:
- `category`: fruits, légumes, céréales, tubercules, élevage, produits-transformés
- `search`: Recherche texte
- `minPrice`, `maxPrice`: Fourchette de prix
- `isOrganic`: true/false
- `page`, `limit`: Pagination
- `sort`: Tri (-createdAt, price, -price)

### Panier (`/api/v1/cart`)

| Méthode | Endpoint | Auth | Description |
|---------|----------|------|-------------|
| GET | `/` | Oui | Mon panier |
| POST | `/` | Oui | Ajouter au panier |
| PUT | `/:productId` | Oui | Modifier quantité |
| DELETE | `/:productId` | Oui | Retirer du panier |
| DELETE | `/` | Oui | Vider le panier |

### Commandes (`/api/v1/orders`)

| Méthode | Endpoint | Auth | Rôles | Description |
|---------|----------|------|-------|-------------|
| POST | `/` | Oui | Consommateur | Créer commande |
| GET | `/` | Oui | Consommateur | Mes commandes |
| GET | `/:id` | Oui | Tous* | Détails commande |
| PATCH | `/:id/status` | Oui | Producteur/Livreur/Admin | Modifier statut |
| PATCH | `/:id/cancel` | Oui | Consommateur | Annuler commande |
| GET | `/producer/list` | Oui | Producteur | Commandes producteur |
| GET | `/deliverer/list` | Oui | Livreur | Commandes livreur |
| **GET** | **`/history`** | **Oui** | **Tous** | **Historique transactions** |

*Tous = Consommateur concerné, Producteur concerné, Livreur assigné, Admin

**Filtres GET /history**:
- `status`: pending, confirmed, processing, shipped, delivered, cancelled
- `startDate`: YYYY-MM-DD
- `endDate`: YYYY-MM-DD
- `page`, `limit`: Pagination

**Statuts de commande**:
1. `pending` - En attente
2. `confirmed` - Confirmée
3. `processing` - En préparation
4. `shipped` - Expédiée
5. `delivered` - Livrée
6. `cancelled` - Annulée

### Livraisons (`/api/v1/deliveries`)

| Méthode | Endpoint | Auth | Rôles | Description |
|---------|----------|------|-------|-------------|
| GET | `/` | Oui | Livreur/Admin | Liste livraisons |
| GET | `/available` | Oui | Livreur | Livraisons disponibles |
| GET | `/:id` | Oui | Livreur/Admin | Détails livraison |
| POST | `/:id/accept` | Oui | Livreur | Accepter livraison |
| PATCH | `/:id/status` | Oui | Livreur | Modifier statut |
| PATCH | `/:id/complete` | Oui | Livreur | Terminer livraison |
| GET | `/my/history` | Oui | Livreur | Mon historique |

### Messages (`/api/v1/messages`)

| Méthode | Endpoint | Auth | Description |
|---------|----------|------|-------------|
| GET | `/` | Oui | Mes conversations |
| POST | `/` | Oui | Envoyer message |
| GET | `/:userId` | Oui | Conversation avec user |
| PATCH | `/:id/read` | Oui | Marquer comme lu |

### Formations (`/api/v1/formations`)

| Méthode | Endpoint | Auth | Rôles | Description |
|---------|----------|------|-------|-------------|
| GET | `/` | Non | - | Liste formations |
| GET | `/:id` | Non | - | Détails formation |
| POST | `/` | Oui | Admin | Créer formation |
| POST | `/:id/register` | Oui | Tous | S'inscrire |

### Admin (`/api/v1/admin`)

| Méthode | Endpoint | Auth | Description |
|---------|----------|------|-------------|
| GET | `/dashboard` | Oui | Tableau de bord |
| GET | `/users` | Oui | Liste utilisateurs |
| PATCH | `/users/:id/toggle` | Oui | Activer/Désactiver |
| PATCH | `/users/:id/role` | Oui | Modifier rôle |
| GET | `/orders` | Oui | Toutes les commandes |
| GET | `/products/pending` | Oui | Produits en attente |
| PATCH | `/products/:id/approve` | Oui | Approuver produit |
| GET | `/stats/sales` | Oui | Stats ventes |
| GET | `/stats/users` | Oui | Stats utilisateurs |

## 📊 Codes de Réponse

| Code | Signification | Description |
|------|---------------|-------------|
| 200 | OK | Requête réussie |
| 201 | Created | Ressource créée |
| 204 | No Content | Suppression réussie |
| 400 | Bad Request | Données invalides |
| 401 | Unauthorized | Non authentifié |
| 403 | Forbidden | Pas de permission |
| 404 | Not Found | Ressource introuvable |
| 409 | Conflict | Conflit (ex: email existe) |
| 500 | Server Error | Erreur serveur |

## 📝 Format de Requête

### Headers
```http
Content-Type: application/json
Authorization: Bearer <token>
```

### Body Exemples

#### Inscription
```json
{
  "firstName": "Jean",
  "lastName": "Dupont",
  "email": "jean@example.com",
  "password": "password123",
  "phone": "+221701234567",
  "role": "consommateur"
}
```

#### Créer un Produit
```json
{
  "name": "Tomates Bio",
  "description": "Tomates fraîches",
  "price": 1500,
  "category": "légumes",
  "stock": 100,
  "unit": "kg",
  "isOrganic": true
}
```

#### Créer une Commande
```json
{
  "items": [
    {
      "product": "<product_id>",
      "quantity": 5
    }
  ],
  "paymentMethod": "mobile-money",
  "deliveryInfo": {
    "method": "home-delivery",
    "address": {
      "street": "123 Rue de Dakar",
      "city": "Dakar",
      "region": "Dakar",
      "postalCode": "12000"
    }
  },
  "notes": "Livrer entre 10h et 12h"
}
```

## 📝 Format de Réponse

### Succès
```json
{
  "status": "success",
  "data": {
    "user": { ... }
  }
}
```

### Avec Pagination
```json
{
  "status": "success",
  "results": 10,
  "total": 45,
  "page": 1,
  "pages": 5,
  "data": {
    "products": [ ... ]
  }
}
```

### Erreur
```json
{
  "status": "error",
  "message": "Description de l'erreur"
}
```

## 🎯 Exemples cURL

### Inscription
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

### Connexion
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Liste Produits
```bash
curl http://localhost:5000/api/v1/products?category=légumes&page=1&limit=10
```

### Historique Transactions
```bash
curl http://localhost:5000/api/v1/orders/history?startDate=2025-01-01 \
  -H "Authorization: Bearer <token>"
```

### Changer le Mot de Passe
```bash
curl -X PUT http://localhost:5000/api/v1/users/change-password \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "currentPassword": "ancien_mdp",
    "newPassword": "nouveau_mdp123",
    "confirmPassword": "nouveau_mdp123"
  }'
```

### Mettre à Jour son Profil
```bash
# Consommateur
curl -X PUT http://localhost:5000/api/v1/users/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "firstName": "Amadou",
    "lastName": "Diallo",
    "phone": "+221771234567"
  }'

# Producteur avec informations spécifiques
curl -X PUT http://localhost:5000/api/v1/users/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "firstName": "Moussa",
    "producteurInfo": {
      "cultureType": "Maïs, Tomates",
      "region": "Thiès",
      "farmSize": "5 hectares"
    }
  }'
```

## 🔐 Rôles et Permissions

| Rôle | Français | Anglais | Peut... |
|------|----------|---------|----------|
| Consommateur | consommateur | consumer | Acheter, commander |
| Producteur | producteur | producer | Vendre, gérer produits |
| Livreur | livreur | deliverer | Livrer commandes |
| Admin | admin | admin | Tout gérer |

---

**Documentation complète**: http://localhost:5000/api-docs
