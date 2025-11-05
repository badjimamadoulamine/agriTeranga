# Dashboard Livreur - AgriTeranga

## Vue d'ensemble

Le dashboard livreur est une interface dédiée aux livreurs pour gérer leurs livraisons, accepter ou décliner des commandes, et consulter leur historique de livraisons.

## Structure des fichiers

### Composants

- **`src/components/delivery/DeliverySidebar.jsx`** : Menu de navigation latéral avec les sections principales
- **`src/components/delivery/DeliveryHeader.jsx`** : En-tête avec notifications et profil utilisateur

### Layout

- **`src/layouts/DeliveryLayout.jsx`** : Layout principal réutilisable pour toutes les pages livreur

### Pages

- **`src/pages/delivery/DeliveryDashboard.jsx`** : Page d'accueil avec livraisons en attente (avec modifications spécifiques)
- **`src/pages/delivery/DeliveryDeliveries.jsx`** : Page Livraisons (structure de base)
- **`src/pages/delivery/DeliveryHistory.jsx`** : Historique des livraisons (conforme au mockup)

## Pages détaillées

### 1. Page Dashboard - Livraisons en attente (`/delivery/dashboard`)

✨ **Avec modifications spécifiques demandées**

**Fonctionnalités :**

#### Cartes de livraison
Chaque carte affiche :
- **Image du produit** : Photo du produit à livrer
- **Informations produit** :
  - Nom du produit
  - Quantité
  - Montant en FCFA (en vert)
- **Informations client** :
  - Nom du client
  - Date et heure de la commande
- **Adresses** :
  - 📍 Adresse de récupération
  - 📦 Adresse de livraison

#### Modifications spécifiques implémentées :

1. **Bouton "Plus de détails" remplacé par deux boutons** :
   - **Bouton "Décliner"** : Bordure rouge, texte rouge
   - **Bouton "Valider"** : Fond vert, texte blanc

2. **Gestion des états des boutons** :
   - Lorsqu'un bouton est cliqué, il devient grisé
   - L'autre bouton devient également désactivé et grisé
   - Un message de confirmation s'affiche ("Livraison acceptée" ou "Livraison déclinée")

3. **"Plus de détails" déplacé** :
   - Placé après les adresses de livraison
   - Transformé en lien avec flèche pointant vers le bas
   - La flèche se retourne lorsque les détails sont dépliés

4. **Section détails dépliable** :
   - Instructions de livraison
   - Contact client
   - Notes spéciales

**Code caractéristique :**
```jsx
const [orderActions, setOrderActions] = useState({});
const [expandedOrders, setExpandedOrders] = useState({});

const handleAccept = (orderId) => {
  setOrderActions({ ...orderActions, [orderId]: 'accepted' });
};

const handleDecline = (orderId) => {
  setOrderActions({ ...orderActions, [orderId]: 'declined' });
};
```

### 2. Page Historique des livraisons (`/delivery/history`)

✅ **Conforme au mockup fourni**

**Fonctionnalités :**

#### Barre de recherche et filtres
- **Champ de recherche** : Avec icône loupe et placeholder "Rechercher..."
- **Sélecteurs de dates** : Deux champs de date avec icône calendrier
  - Format : mm/dd/yyyy
  - Période début - Période fin
- **Bouton Filtrer** : Fond vert avec icône filtre

#### Liste de l'historique
Chaque entrée affiche :
- **Nom du client** : En gras, police plus grande
- **Localisation** : Quartier, ville
- **Type d'événement** :
  - "Heure de livraison" pour les livraisons réussies
  - "Heure d'annulation" pour les livraisons annulées
- **Date et heure** : Format DD/MM/YYYY - HH:MM
- **Badge de statut** :
  - 🟢 **"Livrée"** : Fond vert clair, texte vert foncé
  - 🔴 **"Annulée"** : Fond rouge clair, texte rouge foncé

**Exemples de données (du mockup) :**
- Mariama Ba - Maristes, Dakar - 10/05/2024 - 14:35 - Livrée
- Ibrahima Diallo - Yoff, Dakar - 10/05/2024 - 11:10 - Livrée
- Coumba Ndiaye - Sacré-Coeur 3, Dakar - 09/05/2024 - 16:20 - Annulée
- Ousmane Faye - Fann Hock, Dakar - 09/05/2024 - 10:05 - Livrée
- Sophie Gomis - Ngor, Dakar - 08/05/2024 - 17:45 - Livrée

**Code caractéristique :**
```jsx
const getStatusBadge = (status) => {
  const statusStyles = {
    'Livrée': 'bg-[#E8F5E9] text-[#2E7D32]',
    'Annulée': 'bg-[#FFEBEE] text-[#C62828]'
  };
  // ...
};
```

### 3. Page Livraisons (`/delivery/deliveries`)

🚧 **Page de base créée (structure placeholder)**

## Navigation

### Menu latéral (Sidebar)

Le menu de navigation comprend :

1. **Tableau de bord** (`/delivery/dashboard`) - Icône : Grille de carrés
2. **Livraisons** (`/delivery/deliveries`) - Icône : Camion
3. **Historique** (`/delivery/history`) - Icône : Horloge

**État actif :**
- Fond vert très clair (#E8F5E9)
- Texte en gris foncé
- Bords arrondis

## Design System

### Palette de couleurs

```css
/* Couleurs principales */
--primary-green: #59C94F;      /* Vert principal, boutons, accents */
--light-green-bg: #E8F5E9;     /* Fond vert clair pour les états actifs */
--success-green: #2E7D32;      /* Vert foncé pour statut "Livrée" */
--success-light: #E8F5E9;      /* Fond badge "Livrée" */

/* Couleurs de fond */
--bg-main: #FAFAFA;            /* Fond principal de l'application */
--bg-white: #FFFFFF;           /* Fond blanc pour les cartes */

/* Couleurs de texte */
--text-primary: #333333;       /* Texte principal foncé */
--text-secondary: #666666;     /* Texte secondaire */
--text-muted: #999999;         /* Texte atténué */

/* Couleurs d'erreur/annulation */
--error-red: #C62828;          /* Rouge foncé pour statut "Annulée" */
--error-light: #FFEBEE;        /* Fond badge "Annulée" */
--border-red: #EF5350;         /* Bordure rouge pour bouton "Décliner" */

/* Couleurs de désactivation */
--disabled-bg: #E0E0E0;        /* Fond gris pour éléments désactivés */
--disabled-text: #9E9E9E;      /* Texte gris pour éléments désactivés */
```

### Typographie

- **Police** : Sans-serif moderne (System UI, Inter, Roboto)
- **Titres de page** : 3xl (30px), font-bold
- **Noms de clients** : lg (18px), font-bold
- **Texte normal** : sm (14px), font-normal
- **Texte petit** : xs (12px)

### Espacement

- **Padding cartes** : 1.25rem (20px)
- **Gap entre cartes** : 1.5rem (24px)
- **Padding conteneur principal** : 1.5rem (24px)

### Composants UI

#### Boutons d'action
- **Valider** : Fond vert (#59C94F), texte blanc, bords arrondis
- **Décliner** : Bordure rouge, texte rouge, fond blanc, bords arrondis
- **Désactivé** : Fond gris, texte gris atténué, cursor-not-allowed

#### Cartes de livraison
- Fond blanc
- Bordure grise légère
- Bords arrondis (rounded-lg)
- Ombre au survol (hover:shadow-lg)

#### Badges de statut
- Bords arrondis complets (rounded-full)
- Padding : px-3 py-1
- Texte : text-xs, font-medium

#### Lien "Plus de détails"
- Couleur verte (#59C94F)
- Flèche ChevronDown qui tourne de 180° quand déplié
- Effet hover

## Routes

Toutes les routes sont définies dans `App.jsx` :

```jsx
{/* Delivery Routes */}
<Route path="/delivery/dashboard" element={<DeliveryDashboard />} />
<Route path="/delivery/deliveries" element={<DeliveryDeliveries />} />
<Route path="/delivery/history" element={<DeliveryHistory />} />
```

## Technologies utilisées

- **React** : Bibliothèque UI principale
- **React Router** : Gestion de la navigation
- **Tailwind CSS** : Framework CSS utility-first
- **Lucide React** : Bibliothèque d'icônes
- **React Hooks** : useState pour la gestion des états

## Gestion des états

### Dashboard - Livraisons en attente

```jsx
// État des actions (accepté/décliné)
const [orderActions, setOrderActions] = useState({});
// Format: { orderId: 'accepted' | 'declined' }

// État d'expansion des détails
const [expandedOrders, setExpandedOrders] = useState({});
// Format: { orderId: true | false }
```

### Page Historique

```jsx
// Filtres de recherche
const [searchTerm, setSearchTerm] = useState('');
const [startDate, setStartDate] = useState('');
const [endDate, setEndDate] = useState('');
```

## Interactions utilisateur

### Dashboard

1. **Accepter une livraison** :
   - L'utilisateur clique sur "Valider"
   - Le bouton devient grisé
   - Le bouton "Décliner" est désactivé et grisé
   - Un message vert "✓ Livraison acceptée" apparaît

2. **Décliner une livraison** :
   - L'utilisateur clique sur "Décliner"
   - Le bouton devient grisé
   - Le bouton "Valider" est désactivé et grisé
   - Un message rouge "✗ Livraison déclinée" apparaît

3. **Voir plus de détails** :
   - L'utilisateur clique sur "Plus de détails" avec la flèche
   - Une section avec des informations supplémentaires se déplie
   - La flèche se retourne (rotation 180°)
   - Cliquer à nouveau replie la section

### Historique

1. **Rechercher** : Saisir du texte dans le champ de recherche
2. **Filtrer par date** : Sélectionner une période
3. **Appliquer les filtres** : Cliquer sur le bouton "Filtrer"

## Points d'amélioration futurs

1. **Intégration API** : Connecter les pages aux endpoints backend
2. **Filtres fonctionnels** : Implémenter la logique de filtrage réelle
3. **Notifications en temps réel** : Alertes pour nouvelles livraisons
4. **Géolocalisation** : Intégrer une carte pour le suivi GPS
5. **Historique de livraison** : Ajouter la pagination
6. **Signature électronique** : Capture de signature à la livraison
7. **Photos de livraison** : Upload de preuves de livraison
8. **Responsive design** : Optimiser pour mobile

## Utilisation

### Accéder au dashboard livreur

```
http://localhost:5173/delivery/dashboard    ← Livraisons en attente
http://localhost:5173/delivery/history      ← Historique
http://localhost:5173/delivery/deliveries   ← Mes livraisons
```

### Navigation

Utilisez le menu latéral pour naviguer entre les différentes sections du dashboard livreur.

---

**Créé le** : 23 octobre 2025  
**Version** : 1.0  
**Auteur** : MiniMax Agent