# Dashboard Administrateur - Guide Rapide

## 🚀 Accès Rapide

### URLs du Dashboard Admin
```
Tableau de bord : http://localhost:5173/admin/dashboard
Utilisateurs    : http://localhost:5173/admin/users
Produits        : http://localhost:5173/admin/products
```

## 🎯 Pages Disponibles

### 1. Tableau de Bord
**Route** : `/admin/dashboard`

**Contenu** :
- 4 cartes de statistiques en temps réel
- Section activités récentes
- Vue d'ensemble de la plateforme

### 2. Gestion des Utilisateurs
**Route** : `/admin/users`

**Fonctionnalités** :
- Liste complète des utilisateurs
- Recherche par nom/email
- Filtrage par rôle et statut
- Actions : Modifier / Supprimer
- Pagination

**Statuts** :
- 🟢 **Actif** : Utilisateur actif
- 🔴 **Bloqué** : Compte bloqué

### 3. Liste des Produits
**Route** : `/admin/products`

**Fonctionnalités** :
- Catalogue complet des produits
- Informations : Producteur, Prix, Stock
- Indicateur de statut de stock
- Action : Voir détails

**Statuts** :
- 🟢 **En stock** : Stock disponible
- 🟡 **Stock faible** : Stock < 100 unités
- 🔴 **Rupture** : Stock épuisé

## 🎨 Design System

### Couleurs
```css
Primaire    : #67BD3A (Vert AgriTeranga)
Succès     : #4CAF50
Attention   : #FFC107
Erreur      : #F44336
Info        : #2196F3
```

### Composants
- **AdminSidebar** : Navigation latérale fixe
- **AdminHeader** : Barre supérieure avec recherche
- **AdminLayout** : Layout wrapper pour toutes les pages

## 🛠️ Utilisation

### Navigation
Le menu latéral permet de naviguer entre :
1. 📊 Tableau de bord
2. 👥 Utilisateurs
3. 📦 Produits
4. 💵 Ventes (bientôt)
5. 🎓 Formations (bientôt)

### Recherche
La barre de recherche (disponible sur certaines pages) permet de filtrer les résultats en temps réel.

### Actions
- **✏️ Éditer** : Modifier les informations
- **🗑️ Supprimer** : Supprimer un élément
- **👁️ Voir** : Voir les détails

## 📝 Intégration Backend

Pour connecter le dashboard à votre backend :

```javascript
// Exemple : Récupérer les utilisateurs
const fetchUsers = async () => {
  try {
    const response = await fetch('/api/admin/users', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    const data = await response.json()
    setUsers(data)
  } catch (error) {
    console.error('Erreur:', error)
  }
}
```

## 🔒 Sécurité

**⚠️ Important** : Implémenter la protection des routes avant le déploiement

```jsx
// Exemple de route protégée
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth()
  
  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" />
  }
  
  return children
}
```

## 🚀 Prochaines Fonctionnalités

- [ ] Page Ventes avec graphiques
- [ ] Page Formations
- [ ] Notifications en temps réel
- [ ] Export de données (CSV/Excel)
- [ ] Statistiques avancées
- [ ] Gestion des rôles et permissions
- [ ] Logs d'activité
- [ ] Mode sombre

## 📞 Support

Pour toute question :
- Email : dev@agriteranga.sn
- Documentation complète : `docs/ADMIN_DASHBOARD.md`
