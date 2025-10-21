# 👤 Guide de Gestion du Profil et Mot de Passe

Ce guide explique comment utiliser les nouvelles fonctionnalités de gestion de profil et de changement de mot de passe.

---

## 🔑 1. Changer son Mot de Passe

### Endpoint
```
PUT /api/v1/users/change-password
```

### Authentification Requise
✅ Oui - Token JWT nécessaire dans le header : `Authorization: Bearer <votre_token>`

### Corps de la Requête

```json
{
  "currentPassword": "ancien_mot_de_passe",
  "newPassword": "nouveau_mot_de_passe",
  "confirmPassword": "nouveau_mot_de_passe"
}
```

### Validations

- ✅ **Ancien mot de passe** : Doit être correct
- ✅ **Nouveau mot de passe** : Minimum 8 caractères
- ✅ **Confirmation** : Doit correspondre au nouveau mot de passe
- ✅ **Différence** : Le nouveau mot de passe doit être différent de l'ancien

### Exemple avec cURL

```bash
curl -X PUT http://localhost:5000/api/v1/users/change-password \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "currentPassword": "motdepasse123",
    "newPassword": "nouveaumotdepasse456",
    "confirmPassword": "nouveaumotdepasse456"
  }'
```

### Réponses Possibles

#### Succès (200)
```json
{
  "status": "success",
  "message": "Mot de passe modifié avec succès"
}
```

#### Erreur - Ancien mot de passe incorrect (401)
```json
{
  "status": "error",
  "message": "L'ancien mot de passe est incorrect"
}
```

#### Erreur - Les mots de passe ne correspondent pas (400)
```json
{
  "status": "error",
  "message": "Les nouveaux mots de passe ne correspondent pas"
}
```

#### Erreur - Mot de passe trop court (400)
```json
{
  "status": "error",
  "message": "Le nouveau mot de passe doit contenir au moins 8 caractères"
}
```

---

## ✏️ 2. Modifier son Profil

### Endpoint
```
PUT /api/v1/users/profile
```

### Authentification Requise
✅ Oui - Token JWT nécessaire

### Champs Modifiables par Rôle

#### 🛍️ **Consommateur** (`consommateur`)

**Champs autorisés :**
- `firstName` : Prénom
- `lastName` : Nom
- `phone` : Téléphone
- `profilePicture` : Photo de profil
- `preferences` : Préférences (langue, thème, notifications)

**Exemple de requête :**

```json
{
  "firstName": "Amadou",
  "lastName": "Diallo",
  "phone": "+221771234567",
  "preferences": {
    "language": "fr",
    "theme": "dark",
    "notifications": {
      "email": true,
      "push": true
    }
  }
}
```

#### 🌾 **Producteur** (`producteur` ou `producer`)

**Champs autorisés :**
- Tous les champs du consommateur +
- `producteurInfo` : Informations spécifiques au producteur
  - `cultureType` : Type de culture
  - `region` : Région
  - `farmSize` : Taille de l'exploitation
  - `description` : Description
  - `certificates` : Certificats (tableau)

**Exemple de requête :**

```json
{
  "firstName": "Moussa",
  "lastName": "Sow",
  "phone": "+221771234567",
  "producteurInfo": {
    "cultureType": "Maïs, Tomates",
    "region": "Thiès",
    "farmSize": "5 hectares",
    "description": "Production biologique de légumes frais",
    "certificates": ["Bio certifié", "Agriculture durable"]
  },
  "preferences": {
    "language": "fr"
  }
}
```

#### 🚚 **Livreur** (`livreur` ou `deliverer`)

**Champs autorisés :**
- Tous les champs du consommateur +
- `livreurInfo` : Informations spécifiques au livreur
  - `deliveryZone` : Zone de livraison
  - `vehicleType` : Type de véhicule
  - `isAvailable` : Disponibilité (boolean)

**Exemple de requête :**

```json
{
  "firstName": "Ibrahima",
  "lastName": "Fall",
  "phone": "+221771234567",
  "livreurInfo": {
    "deliveryZone": "Dakar et banlieue",
    "vehicleType": "Moto",
    "isAvailable": true
  }
}
```

#### 🔑 **Administrateur** (`admin`)

**Champs autorisés :**
- Tous les champs (base + producteurInfo + livreurInfo)

### Exemple avec cURL

```bash
curl -X PUT http://localhost:5000/api/v1/users/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "firstName": "Nouvel Prénom",
    "lastName": "Nouveau Nom",
    "phone": "+221771234567"
  }'
```

### Upload de Photo de Profil

Pour uploader une photo de profil, utilisez `multipart/form-data` :

```bash
curl -X PUT http://localhost:5000/api/v1/users/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "firstName=Amadou" \
  -F "lastName=Diallo" \
  -F "profilePicture=@/chemin/vers/votre/photo.jpg"
```

### Réponse de Succès (200)

```json
{
  "status": "success",
  "message": "Profil mis à jour avec succès",
  "data": {
    "user": {
      "_id": "60d5ec49f1b2c72b8c8e4f1a",
      "firstName": "Amadou",
      "lastName": "Diallo",
      "email": "amadou@example.com",
      "phone": "+221771234567",
      "role": "consommateur",
      "profilePicture": "/uploads/profiles/1234567890.jpg",
      "preferences": {
        "language": "fr",
        "theme": "dark",
        "notifications": {
          "email": true,
          "push": true
        }
      },
      "createdAt": "2025-10-20T10:00:00.000Z",
      "updatedAt": "2025-10-21T14:30:00.000Z"
    }
  }
}
```

---

## 🛡️ 3. Sécurité et Restrictions

### Champs Protégés (Non Modifiables)

Ces champs **ne peuvent PAS** être modifiés via la mise à jour du profil :

- ❌ `password` (utiliser `/change-password` à la place)
- ❌ `email` (protection contre le changement d'identité)
- ❌ `role` (seul un admin peut modifier les rôles)
- ❌ `isActive` (gestion administrative)
- ❌ `isVerified` (gestion administrative)

### Validation Automatique

- Les champs spécifiques à un rôle sont automatiquement filtrés
- Un consommateur ne peut pas modifier `producteurInfo` ou `livreurInfo`
- Un producteur peut seulement modifier `producteurInfo`, pas `livreurInfo`
- Un livreur peut seulement modifier `livreurInfo`, pas `producteurInfo`
- L'admin peut tout modifier

---

## 📝 4. Autres Routes Utilisateur

### Obtenir son Profil

```bash
GET /api/v1/users/me
```

Retourne les informations de l'utilisateur connecté.

### Obtenir le Profil d'un Autre Utilisateur

```bash
GET /api/v1/users/profile/:id
```

Ex: `GET /api/v1/users/profile/60d5ec49f1b2c72b8c8e4f1a`

### Mettre à Jour les Préférences

```bash
PUT /api/v1/users/preferences
```

```json
{
  "language": "fr",
  "theme": "dark",
  "notifications": {
    "email": true,
    "push": false
  }
}
```

### Supprimer son Compte

```bash
DELETE /api/v1/users/account
```

**Note :** Le compte est désactivé (`isActive: false`), pas supprimé définitivement.

---

## 👨‍💻 5. Exemples d'Intégration Frontend

### Avec JavaScript (Fetch API)

#### Changer le Mot de Passe

```javascript
async function changePassword(currentPassword, newPassword, confirmPassword) {
  try {
    const token = localStorage.getItem('token');
    
    const response = await fetch('http://localhost:5000/api/v1/users/change-password', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        currentPassword,
        newPassword,
        confirmPassword
      })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      alert('Mot de passe modifié avec succès !');
      return data;
    } else {
      alert(`Erreur : ${data.message}`);
      throw new Error(data.message);
    }
  } catch (error) {
    console.error('Erreur:', error);
    throw error;
  }
}

// Utilisation
changePassword('ancienMotDePasse', 'nouveauMotDePasse123', 'nouveauMotDePasse123');
```

#### Mettre à Jour le Profil

```javascript
async function updateProfile(profileData) {
  try {
    const token = localStorage.getItem('token');
    
    const response = await fetch('http://localhost:5000/api/v1/users/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(profileData)
    });
    
    const data = await response.json();
    
    if (response.ok) {
      alert('Profil mis à jour avec succès !');
      return data.data.user;
    } else {
      alert(`Erreur : ${data.message}`);
      throw new Error(data.message);
    }
  } catch (error) {
    console.error('Erreur:', error);
    throw error;
  }
}

// Utilisation - Consommateur
updateProfile({
  firstName: 'Amadou',
  lastName: 'Diallo',
  phone: '+221771234567'
});

// Utilisation - Producteur
updateProfile({
  firstName: 'Moussa',
  lastName: 'Sow',
  producteurInfo: {
    cultureType: 'Maïs, Tomates',
    region: 'Thiès',
    farmSize: '5 hectares'
  }
});
```

#### Upload de Photo de Profil

```javascript
async function uploadProfilePicture(file, otherData = {}) {
  try {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    
    // Ajouter la photo
    formData.append('profilePicture', file);
    
    // Ajouter d'autres données
    Object.keys(otherData).forEach(key => {
      if (typeof otherData[key] === 'object') {
        formData.append(key, JSON.stringify(otherData[key]));
      } else {
        formData.append(key, otherData[key]);
      }
    });
    
    const response = await fetch('http://localhost:5000/api/v1/users/profile', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
        // Ne pas mettre Content-Type, il sera automatiquement défini pour multipart/form-data
      },
      body: formData
    });
    
    const data = await response.json();
    
    if (response.ok) {
      alert('Photo de profil mise à jour !');
      return data.data.user;
    } else {
      alert(`Erreur : ${data.message}`);
      throw new Error(data.message);
    }
  } catch (error) {
    console.error('Erreur:', error);
    throw error;
  }
}

// Utilisation avec un input file
const fileInput = document.getElementById('profilePicture');
fileInput.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (file) {
    await uploadProfilePicture(file, {
      firstName: 'Amadou',
      lastName: 'Diallo'
    });
  }
});
```

### Avec React (Hooks)

```jsx
import { useState } from 'react';

function ChangePasswordForm() {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch('http://localhost:5000/api/v1/users/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        alert('Mot de passe modifié avec succès !');
        setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Changer le Mot de Passe</h2>
      
      {error && <div className="error">{error}</div>}
      
      <div>
        <label>Ancien mot de passe</label>
        <input
          type="password"
          value={formData.currentPassword}
          onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
          required
        />
      </div>
      
      <div>
        <label>Nouveau mot de passe</label>
        <input
          type="password"
          value={formData.newPassword}
          onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
          required
          minLength={8}
        />
      </div>
      
      <div>
        <label>Confirmer le mot de passe</label>
        <input
          type="password"
          value={formData.confirmPassword}
          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
          required
        />
      </div>
      
      <button type="submit" disabled={loading}>
        {loading ? 'Modification...' : 'Modifier le mot de passe'}
      </button>
    </form>
  );
}

export default ChangePasswordForm;
```

---

## ✅ Récapitulatif

| Fonctionnalité | Endpoint | Méthode | Authentification | Rôles Autorisés |
|-----------------|----------|---------|------------------|-------------------|
| Changer le mot de passe | `/api/v1/users/change-password` | PUT | ✅ Oui | Tous |
| Modifier le profil | `/api/v1/users/profile` | PUT | ✅ Oui | Tous (champs adaptés au rôle) |
| Obtenir son profil | `/api/v1/users/me` | GET | ✅ Oui | Tous |
| Modifier les préférences | `/api/v1/users/preferences` | PUT | ✅ Oui | Tous |
| Supprimer le compte | `/api/v1/users/account` | DELETE | ✅ Oui | Tous |

---

## 📞 Support

En cas de problème, vérifiez :
1. Que le token JWT est valide et présent dans le header
2. Que les données envoyées respectent le format JSON
3. Que les validations (longueur, format) sont respectées
4. Les logs du serveur pour plus de détails sur les erreurs
