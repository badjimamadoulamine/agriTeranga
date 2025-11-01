# Dashboard Producteur - AgriTeranga

## Vue d'ensemble

Le dashboard producteur est une interface complète permettant aux producteurs agricoles de gérer leurs activités, suivre leurs performances et gérer leurs ventes sur la plateforme AgriTeranga.

## Structure des fichiers

### Composants

- **`src/components/producer/ProducerSidebar.jsx`** : Menu de navigation latéral avec les sections principales
- **`src/components/producer/ProducerHeader.jsx`** : En-tête avec titre de page, notifications et profil utilisateur

### Layout

- **`src/layouts/ProducerLayout.jsx`** : Layout principal réutilisable pour toutes les pages producteur

### Pages

- **`src/pages/producer/ProducerDashboard.jsx`** : Page d'accueil du dashboard (Tableau de bord)
- **`src/pages/producer/ProducerProducts.jsx`** : Gestion du catalogue de produits
- **`src/pages/producer/ProducerStatistics.jsx`** : Statistiques et analyses de performance
- **`src/pages/producer/ProducerSales.jsx`** : Gestion des ventes et transactions

## Pages détaillées

### 1. Page Statistiques (`/producer/statistics`)

**Fonctionnalités :**

#### Cartes KPI (4 indicateurs)
- **Ventes totales** : Montant total des ventes en FCFA
- **Commandes** : Nombre total de commandes
- **Produits actifs** : Nombre de produits actuellement disponibles
- **Vues totales** : Nombre total de vues des produits

#### Graphique de ventes
- Graphique combiné (barres + ligne) affichant l'évolution des ventes sur 6 mois
- Barres bleues : Volume des ventes
- Ligne rouge : Tendance des performances
- Grille horizontale pour faciliter la lecture

#### Produits les plus vendus
- Liste des 5 produits les plus performants
- Affichage du nom, quantité vendue (en kg)
- Barre de progression visuelle pour comparer les performances

**Code caractéristique :**
```jsx
const kpiCards = [
  {
    title: 'Ventes totales',
    value: '1,250,000 FCFA',
    icon: DollarSign,
    bgColor: 'bg-[#59C94F]'
  },
  // ...
];
```

### 2. Page Gestion des ventes (`/producer/sales`)

**Fonctionnalités :**

#### Barre d'outils
- **Filtres** : Bouton pour filtrer les transactions
- **Période** : Sélecteur de période avec icône calendrier
- **Exporter** : Bouton pour exporter les données

#### Tableau des transactions
Colonnes :
- Case à cocher pour sélection multiple
- **ID Transaction** : Identifiant unique (#12548, etc.)
- **Date** : Date de la transaction
- **Produit** : Nom du produit vendu
- **Client** : Nom du client
- **Montant** : Prix en FCFA
- **Statut** : Badge coloré indiquant l'état
  - **Payé** : Badge vert (#A8E6A8)
  - **En attente** : Badge jaune (#FFEB9C)
  - **Annulé** : Badge rouge (#FDDEDE)
- Actions : Menu contextuel (trois points)

#### Pagination
- Affichage du nombre de résultats ("Affiche 1-5 sur 25 résultats")
- Navigation par numéros de page
- Boutons précédent/suivant
- Page active en vert foncé (#387D38)

**Code caractéristique :**
```jsx
const getStatusBadge = (status) => {
  const statusStyles = {
    'Payé': 'bg-[#A8E6A8] text-white',
    'En attente': 'bg-[#FFEB9C] text-gray-700',
    'Annulé': 'bg-[#FDDEDE] text-white'
  };
  // ...
};
```

### 3. Page Tableau de bord (`/producer/dashboard`)

Page d'accueil du producteur avec vue d'ensemble (actuellement avec contenu placeholder).

### 4. Page Mes produits (`/producer/products`)

Page de gestion du catalogue de produits (actuellement avec contenu placeholder).

## Navigation

### Menu latéral (Sidebar)

Le menu de navigation comprend :

1. **Tableau de bord** (`/producer/dashboard`) - Icône : Grille de carrés
2. **Mes produits** (`/producer/products`) - Icône : Paquet
3. **Statistiques** (`/producer/statistics`) - Icône : Graphique en barres
4. **Ventes** (`/producer/sales`) - Icône : Balance

**État actif :**
- Fond vert clair (#EBF8E7)
- Texte et icône en vert (#59C94F)
- Effet de survol sur les éléments inactifs

## Design System

### Palette de couleurs

```css
/* Couleurs principales */
--primary-green: #59C94F;      /* Vert principal, logo, éléments actifs */
--light-green-bg: #EBF8E7;     /* Fond vert clair pour les états actifs */
--dark-green: #387D38;         /* Vert foncé pour la pagination active */

/* Couleurs de fond */
--bg-main: #F8FAF8;            /* Fond principal de l'application */
--bg-white: #FFFFFF;           /* Fond blanc pour les cartes et conteneurs */

/* Couleurs de texte */
--text-primary: #333333;       /* Texte principal foncé */
--text-secondary: #666666;     /* Texte secondaire */
--text-muted: #999999;         /* Texte atténué */

/* Couleurs KPI */
--kpi-blue: #7FB8E1;           /* Bleu pour les commandes */
--kpi-yellow: #F5CE5F;         /* Jaune pour les produits actifs */
--kpi-red: #E55F5F;            /* Rouge pour les vues */

/* Couleurs de statut */
--status-paid: #A8E6A8;        /* Vert pour "Payé" */
--status-pending: #FFEB9C;     /* Jaune pour "En attente" */
--status-cancelled: #FDDEDE;   /* Rouge pour "Annulé" */

/* Couleurs graphique */
--chart-bar: #2A426F;          /* Bleu foncé pour les barres */
--chart-line: #D24D57;         /* Rouge pour la ligne de tendance */
```

### Typographie

- **Police** : Sans-serif moderne (System UI, Inter, Roboto)
- **Titres de page** : 2xl (24px), font-bold
- **Titres de section** : lg (18px), font-bold
- **Texte normal** : sm (14px), font-normal
- **Texte petit** : xs (12px)

### Espacement

- **Padding cartes** : 1.5rem (24px)
- **Gap entre éléments** : 1.5rem (24px)
- **Padding conteneur principal** : 1.5rem (24px)

### Composants UI

#### Boutons
- Bords arrondis (rounded-lg)
- Bordure grise (#E5E7EB)
- Effet hover avec changement de fond
- Padding : px-4 py-2

#### Cartes
- Fond blanc
- Ombre légère (shadow-sm)
- Bords arrondis (rounded-lg)

#### Badges de statut
- Bords arrondis complets (rounded-full)
- Padding : px-3 py-1
- Texte : text-xs, font-medium

## Routes

Toutes les routes sont définies dans `App.jsx` :

```jsx
{/* Producer Routes */}
<Route path="/producer/dashboard" element={<ProducerDashboard />} />
<Route path="/producer/products" element={<ProducerProducts />} />
<Route path="/producer/statistics" element={<ProducerStatistics />} />
<Route path="/producer/sales" element={<ProducerSales />} />
```

## Technologies utilisées

- **React** : Bibliothèque UI principale
- **React Router** : Gestion de la navigation
- **Tailwind CSS** : Framework CSS utility-first
- **Lucide React** : Bibliothèque d'icônes

## Points d'amélioration futurs

1. **Intégration API** : Connecter les pages aux endpoints backend
2. **Filtres fonctionnels** : Implémenter la logique de filtrage des ventes
3. **Graphique interactif** : Ajouter des tooltips et interactions sur le graphique
4. **Export de données** : Implémenter l'export en CSV/PDF
5. **Gestion des produits** : Compléter la page "Mes produits" avec CRUD
6. **Notifications** : Implémenter le système de notifications
7. **Responsive design** : Optimiser pour les tablettes et mobiles

## Utilisation

### Accéder au dashboard producteur

```
http://localhost:5173/producer/statistics
http://localhost:5173/producer/sales
http://localhost:5173/producer/dashboard
http://localhost:5173/producer/products
```

### Navigation

Utilisez le menu latéral pour naviguer entre les différentes sections du dashboard producteur.

---

**Créé le** : 23 octobre 2025  
**Version** : 1.0  
**Auteur** : MiniMax Agent