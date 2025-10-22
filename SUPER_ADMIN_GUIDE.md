# Guide du Système Super Admin

## Vue d'ensemble

Le système dispose de deux niveaux d'administrateurs :
- **Super Admin** : Administrateur principal avec tous les privilèges
- **Admin** : Administrateur standard avec des permissions limitées

## 🔐 Permissions

### Super Admin peut :
- ✅ Créer de nouveaux admins
- ✅ Modifier les informations des admins
- ✅ Activer/Désactiver des admins
- ✅ Supprimer des admins
- ✅ Changer le mot de passe des admins
- ✅ Voir la liste de tous les admins

### Admin standard peut :
- ✅ Voir la liste des utilisateurs
- ✅ Gérer les contenus (articles, produits, etc.)
- ❌ Ne peut PAS gérer d'autres admins

## 🚀 Création du Super Admin

### Première installation

1. **Assurez-vous que MongoDB est démarré**

2. **Exécutez le script de création :**
   ```bash
   cd agriculture-api
   node create-super-admin.js
   ```

3. **Identifiants par défaut :**
   - Email : `superadmin@agriculture.com`
   - Mot de passe : `SuperAdmin123!`

4. **⚠️ IMPORTANT :** Changez le mot de passe après la première connexion !

## 📡 API Endpoints (Super Admin uniquement)

### 1. Créer un Admin

**Endpoint :** `POST /api/admin/admins`

**Headers :**
```json
{
  "Authorization": "Bearer <super_admin_token>"
}
```

**Body :**
```json
{
  "firstName": "Jean",
  "lastName": "Dupont",
  "email": "jean.dupont@agriculture.com",
  "password": "Password123!",
  "phone": "+221771234567",
  "adresse": "Dakar, Sénégal"
}
```

**Réponse :**
```json
{
  "success": true,
  "message": "Administrateur créé avec succès",
  "data": {
    "_id": "...",
    "firstName": "Jean",
    "lastName": "Dupont",
    "email": "jean.dupont@agriculture.com",
    "role": "admin",
    "isSuperAdmin": false,
    "isActive": true
  }
}
```

---

### 2. Liste de tous les Admins

**Endpoint :** `GET /api/admin/admins`

**Headers :**
```json
{
  "Authorization": "Bearer <super_admin_token>"
}
```

**Réponse :**
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "firstName": "Super",
      "lastName": "Admin",
      "email": "superadmin@agriculture.com",
      "role": "admin",
      "isSuperAdmin": true,
      "isActive": true
    },
    {
      "_id": "...",
      "firstName": "Jean",
      "lastName": "Dupont",
      "email": "jean.dupont@agriculture.com",
      "role": "admin",
      "isSuperAdmin": false,
      "isActive": true
    }
  ]
}
```

---

### 3. Modifier les infos d'un Admin

**Endpoint :** `PUT /api/admin/admins/:id`

**Headers :**
```json
{
  "Authorization": "Bearer <super_admin_token>"
}
```

**Body :**
```json
{
  "firstName": "Jean-Pierre",
  "phone": "+221779999999"
}
```

---

### 4. Activer/Désactiver un Admin

**Endpoint :** `PATCH /api/admin/admins/:id/toggle-status`

**Headers :**
```json
{
  "Authorization": "Bearer <super_admin_token>"
}
```

**Réponse :**
```json
{
  "success": true,
  "message": "Statut de l'administrateur modifié avec succès",
  "data": {
    "isActive": false
  }
}
```

---

### 5. Changer le mot de passe d'un Admin

**Endpoint :** `PATCH /api/admin/admins/:id/password`

**Headers :**
```json
{
  "Authorization": "Bearer <super_admin_token>"
}
```

**Body :**
```json
{
  "newPassword": "NewPassword123!",
  "confirmPassword": "NewPassword123!"
}
```

**Réponse :**
```json
{
  "success": true,
  "message": "Mot de passe modifié avec succès"
}
```

---

### 6. Supprimer un Admin

**Endpoint :** `DELETE /api/admin/admins/:id`

**Headers :**
```json
{
  "Authorization": "Bearer <super_admin_token>"
}
```

**Réponse :**
```json
{
  "success": true,
  "message": "Administrateur supprimé avec succès"
}
```

---

## ⚠️ Erreurs possibles

### 1. Non autorisé (403)
```json
{
  "success": false,
  "message": "Accès refusé. Seul le super admin peut effectuer cette action"
}
```
**Cause :** L'utilisateur connecté n'est pas un super admin.

---

### 2. Mot de passe ne correspond pas (400)
```json
{
  "success": false,
  "message": "Les mots de passe ne correspondent pas"
}
```
**Cause :** `newPassword` ≠ `confirmPassword`

---

### 3. Mot de passe trop court (400)
```json
{
  "success": false,
  "message": "Le mot de passe doit contenir au moins 6 caractères"
}
```

---

### 4. Tentative de modification de son propre mot de passe (400)
```json
{
  "success": false,
  "message": "Vous ne pouvez pas modifier votre propre mot de passe avec cette route. Utilisez la route de changement de mot de passe personnel."
}
```
**Solution :** Utilisez `PATCH /api/auth/change-password` à la place.

---

### 5. Protection du Super Admin (403)
```json
{
  "success": false,
  "message": "Impossible de supprimer/désactiver le super admin"
}
```
**Cause :** Tentative de suppression ou désactivation du super admin.

---

## 🔒 Sécurité

### Bonnes pratiques :

1. **Changez le mot de passe par défaut** immédiatement après création
2. **Limitez le nombre de super admins** (idéalement 1 seul)
3. **Ne partagez jamais** les identifiants du super admin
4. **Utilisez des mots de passe forts** (min. 8 caractères, majuscules, minuscules, chiffres, symboles)
5. **Désactivez** les admins inactifs au lieu de les supprimer
6. **Auditez régulièrement** la liste des admins

### Protection automatique :

- ✅ Le super admin ne peut pas être supprimé
- ✅ Le super admin ne peut pas être désactivé
- ✅ Un admin ne peut pas créer de super admin
- ✅ Un admin standard ne peut pas gérer d'autres admins
- ✅ Les mots de passe sont hashés avec bcrypt

---

## 📝 Workflow recommandé

1. **Installation initiale :**
   ```bash
   node create-super-admin.js
   ```

2. **Connexion du super admin :**
   ```bash
   POST /api/auth/login
   {
     "email": "superadmin@agriculture.com",
     "password": "SuperAdmin123!"
   }
   ```

3. **Changer le mot de passe :**
   ```bash
   PATCH /api/auth/change-password
   {
     "currentPassword": "SuperAdmin123!",
     "newPassword": "VotreNouveauMotDePasseSecurise!"
   }
   ```

4. **Créer des admins standards :**
   ```bash
   POST /api/admin/admins
   {
     "firstName": "...",
     "lastName": "...",
     "email": "...",
     "password": "...",
     "phone": "...",
     "adresse": "..."
   }
   ```

---

## 🆘 Support

En cas de problème :

1. **Super admin perdu :** Si vous perdez l'accès au super admin, vous devrez :
   - Vous connecter à MongoDB directement
   - Supprimer le compte super admin
   - Ré-exécuter `create-super-admin.js`

2. **Vérifier les admins existants :**
   ```javascript
   // Dans MongoDB
   db.users.find({ role: 'admin' })
   ```

3. **Réinitialiser un super admin :**
   ```javascript
   // Dans MongoDB
   db.users.updateOne(
     { email: 'superadmin@agriculture.com' },
     { $set: { isSuperAdmin: true } }
   )
   ```