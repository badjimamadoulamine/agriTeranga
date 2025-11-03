# Page Livraisons - Dashboard Livreur

## Vue d'ensemble

Cette page affiche et permet de gérer toutes les livraisons assignées au livreur sur la plateforme AgriTeranga.

## Composants principaux

### 1. En-tête de la page

#### Titre
- **"Livraisons"** : Titre principal en grand format

#### Barre de recherche
- **Placeholder** : "Rechercher une livraison..."
- **Icône** : Loupe (Search)
- **Fonction** : Recherche en temps réel dans les livraisons
- **Position** : Alignée à droite de l'en-tête

### 2. Contrôles de filtrage et tri

#### Filtre par statut
- **Label** : "Filtrer par: Tous les statuts"
- **Options** :
  - Tous les statuts
  - En attente
  - En cours
  - Terminée
- **Icône** : ChevronDown

#### Tri
- **Label** : "Trier par: Temps"
- **Options** :
  - Temps
  - Nom du client
  - Adresse
- **Icône** : ChevronDown

### 3. Grille de cartes de livraison

#### Layout
- **Disposition** : Grille responsive
  - 3 colonnes sur desktop
  - 2 colonnes sur tablette
  - 1 colonne sur mobile
- **Espacement** : gap-6 entre les cartes

#### Contenu de chaque carte

1. **Nom du client**
   - Police : Bold, grande taille
   - Couleur : Gris foncé
   - Exemple : "Fatou Diop", "Moussa Fall"

2. **Badge de statut**
   - Forme : Pill (arrondi)
   - Variantes :
     - **En attente** : Fond bleu clair, texte bleu foncé
     - **En cours** : Fond orange clair, texte orange foncé
     - **Terminée** : Fond vert clair, texte vert foncé

3. **Adresse de livraison**
   - Couleur : Gris moyen
   - Taille : Petite
   - Exemple : "Sicap Liberté 6, Dakar"

4. **Information temporelle**
   - Icône : Horloge (Clock)
   - Deux formats :
     - **Pour livraisons en attente/en cours** : "HAE: 14:30" (Heure d'Arrivée Estimée)
     - **Pour livraisons terminées** : "Livrée à 13:45"

5. **Lien "Voir détails"**
   - Couleur : Vert (brand color)
   - Style : Texte avec soulignement au hover
   - Action : Affiche les détails complets de la livraison

## Données affichées

### Exemples de livraisons

| Client | Statut | Adresse | Temps |
|--------|--------|---------|-------|
| Fatou Diop | En attente | Sicap Liberté 6, Dakar | HAE: 14:30 |
| Moussa Fall | En cours | Point E, Dakar | HAE: 15:00 |
| Aminata Seck | Terminée | Ouakam, Dakar | Livrée à 13:45 |
| Ibrahima Ndiaye | En attente | Médina, Dakar | HAE: 16:15 |
| Awa Sarr | En cours | Plateau, Dakar | HAE: 14:45 |
| Omar Ba | Terminée | Almadies, Dakar | Livrée à 12:30 |

## Fonctionnalités

### Fonctionnalités implémentées

1. **Affichage en grille responsive**
   - Adaptation automatique selon la taille de l'écran
   - 3 colonnes (desktop) → 2 colonnes (tablette) → 1 colonne (mobile)

2. **Recherche**
   - Champ de recherche avec icône
   - State management avec `useState`

3. **Filtrage par statut**
   - Dropdown avec options multiples
   - State management pour le filtre sélectionné

4. **Tri**
   - Options de tri par temps, nom, ou adresse
   - State management pour l'ordre de tri

5. **Badges colorés dynamiques**
   - Code couleur automatique selon le statut
   - Fonction `getStatusBadgeStyle()` pour générer les classes CSS

6. **Effets interactifs**
   - Hover sur les cartes (shadow-md)
   - Hover sur le lien "Voir détails" (underline)
   - Focus sur les contrôles de formulaire (ring vert)

### Fonctionnalités à implémenter

1. **Logique de recherche**
   - Filtrage en temps réel basé sur `searchQuery`
   - Recherche dans nom, adresse, etc.

2. **Logique de filtrage**
   - Application du filtre `filterStatus` aux données
   - Mise à jour dynamique de la grille

3. **Logique de tri**
   - Tri des livraisons selon `sortBy`
   - Ordre croissant/décroissant

4. **Modale de détails**
   - Au clic sur "Voir détails"
   - Affichage d'informations complètes
   - Produits commandés, montant, coordonnées du client, etc.

5. **Actions rapides**
   - Boutons d'action sur les cartes (appeler, naviguer, marquer comme livré)
   - Gestion des transitions de statut

## Code couleur des statuts

```javascript
const getStatusBadgeStyle = (status) => {
  switch (status) {
    case 'pending':     // En attente
      return 'bg-blue-100 text-blue-700';
    case 'in-progress': // En cours
      return 'bg-orange-100 text-orange-700';
    case 'completed':   // Terminée
      return 'bg-green-100 text-green-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};
```

## Structure du composant

```jsx
DeliveryDeliveries.jsx
├── State Management
│   ├── filterStatus (filtre par statut)
│   ├── sortBy (critère de tri)
│   └── searchQuery (recherche)
├── DeliveryLayout (wrapper)
├── Header Section
│   ├── Titre "Livraisons"
│   └── Barre de recherche
├── Controls Section
│   ├── Filter dropdown
│   └── Sort dropdown
└── Delivery Cards Grid
    └── Map sur deliveries[]
        ├── Customer name
        ├── Status badge
        ├── Address
        ├── Time info
        └── "Voir détails" link
```

## Technologies utilisées

- **React** : Framework principal
- **React Hooks** : `useState` pour la gestion d'état
- **Tailwind CSS** : Styling et responsive design
- **Lucide React** : Icônes (Search, Clock, ChevronDown)
- **React Router** : Navigation (Link depuis DeliveryLayout)

## Routes

- **URL** : `/delivery/deliveries`
- **Composant** : `DeliveryDeliveries`
- **Layout parent** : `DeliveryLayout`

## Responsive Design

### Breakpoints Tailwind

- **Mobile** (< 768px) : 1 colonne
  ```jsx
  grid-cols-1
  ```

- **Tablette** (768px - 1023px) : 2 colonnes
  ```jsx
  md:grid-cols-2
  ```

- **Desktop** (≥ 1024px) : 3 colonnes
  ```jsx
  lg:grid-cols-3
  ```

## Accessibilité

- **Labels sémantiques** : Utilisation de `<h1>`, `<button>`, `<select>`
- **Focus visible** : Ring vert sur les éléments interactifs
- **Contraste de couleurs** : Respect des ratios WCAG
- **Icônes accompagnées de texte** : Toujours une description textuelle

## Améliorations futures

1. **Pagination** : Pour les longues listes de livraisons
2. **Infinite scroll** : Chargement progressif
3. **Notifications temps réel** : WebSockets pour les mises à jour de statut
4. **Géolocalisation** : Carte interactive avec itinéraire
5. **Export** : Télécharger la liste au format PDF/CSV
6. **Statistiques** : Nombre de livraisons par statut en haut de page
7. **Actions groupées** : Sélection multiple de livraisons
8. **Mode sombre** : Thème alternatif

---

**Fichier** : `front-agriteranga/src/pages/delivery/DeliveryDeliveries.jsx`  
**Auteur** : MiniMax Agent  
**Date de création** : 2025  
**Version** : 1.0
