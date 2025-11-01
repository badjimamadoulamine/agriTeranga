# Pages Ventes et Formations - Dashboard Admin

## Vue d'ensemble

Ce document décrit les nouvelles pages **Ventes** et **Formations** ajoutées au dashboard administrateur d'AgriTeranga.

## Page Ventes (`/admin/sales`)

### Description
La page Ventes offre une vue d'ensemble complète des activités de vente sur la plateforme AgriTeranga.

### Composants principaux

#### 1. Cartes KPI (Key Performance Indicators)
Trois cartes affichent les métriques clés :

- **Revenu Total** : 175 000 FCFA
  - Icône : TrendingUp (vert)
  - Affiche le revenu total généré

- **Produits Vendus** : 500 unités
  - Icône : Package (bleu)
  - Nombre total de produits vendus

- **Produits Invendus** : 50 unités
  - Icône : PackageX (orange)
  - Nombre de produits en stock non vendus

#### 2. Tableau des Dernières Ventes

**Colonnes du tableau :**
- **Produit** : Nom du produit avec icône visuelle
- **Producteur** : Nom du producteur
- **Quantité** : Quantité vendue (kg ou unités)
- **Montant** : Prix de vente en FCFA
- **Commission** : Commission prélevée en FCFA
- **Date** : Date de la transaction

**Données exemple :**
1. Millet - Prod. Keita - 100 kg - 50 000 FCFA - 5 000 FCFA - 12/05/2024
2. Arachide - Ferme Ndiaye - 50 kg - 60 000 FCFA - 6 000 FCFA - 11/05/2024
3. Mangue Kent - BioTeranga - 200 unités - 50 000 FCFA - 5 000 FCFA - 10/05/2024
4. Oignon Violet - Jardin Fall - 150 kg - 60 000 FCFA - 6 000 FCFA - 09/05/2024

### Fonctionnalités
- Affichage en temps réel des KPI
- Tableau responsive avec effet hover
- Icônes visuelles pour chaque produit
- Design cohérent avec le reste de l'application

---

## Page Formations (`/admin/formations`)

### Description
La page Formations permet de gérer l'ensemble des modules de formation proposés aux agriculteurs sur la plateforme.

### Composants principaux

#### 1. Barre de recherche
- Permet de filtrer les formations par mots-clés
- Icône de loupe pour identifier facilement la fonctionnalité

#### 2. Bouton "Ajouter un module"
- Bouton vert avec icône "+"
- Permet d'initier la création d'un nouveau module de formation

#### 3. Grille de cartes de formations

Chaque carte de formation affiche :
- **Badge de catégorie** : Code couleur selon le type de formation
- **Titre** : Nom de la formation
- **Description** : Résumé des objectifs pédagogiques
- **Durée** : Nombre de semaines (icône horloge)
- **Participants** : Nombre d'inscrits (icône utilisateurs)
- **Actions** : Boutons Éditer et Supprimer

### Formations disponibles

1. **Introduction à la permaculture**
   - Catégorie : Agriculture durable (vert)
   - Durée : 4 semaines
   - Participants : 25 inscrits

2. **Techniques d'irrigation efficaces**
   - Catégorie : Gestion de l'eau (bleu)
   - Durée : 6 semaines
   - Participants : 18 inscrits

3. **Vendre ses produits en ligne**
   - Catégorie : Commercialisation (violet)
   - Durée : 3 semaines
   - Participants : 32 inscrits

4. **Compostage et fertilisation**
   - Catégorie : Santé des sols (ambre)
   - Durée : 5 semaines
   - Participants : 21 inscrits

5. **Intégrer les arbres aux cultures**
   - Catégorie : Agroforesterie (vert émeraude)
   - Durée : 8 semaines
   - Participants : 15 inscrits

6. **Processus de certification**
   - Catégorie : Certification Bio (vert lime)
   - Durée : 4 semaines
   - Participants : 28 inscrits

### Fonctionnalités
- Layout en grille responsive (3 colonnes sur desktop, adaptatif sur mobile)
- Recherche en temps réel
- Boutons d'édition et suppression sur chaque carte
- Effet hover pour améliorer l'UX
- Code couleur par catégorie pour une identification rapide

---

## Structure des fichiers

```
front-agriteranga/
├── src/
│   ├── pages/
│   │   └── admin/
│   │       ├── AdminSales.jsx         # Page Ventes
│   │       └── AdminFormations.jsx    # Page Formations
│   ├── components/
│   │   └── admin/
│   │       └── AdminSidebar.jsx       # Mise à jour avec les nouveaux liens
│   └── App.jsx                         # Routes ajoutées
└── docs/
    └── ADMIN_SALES_FORMATIONS.md      # Cette documentation
```

## Routes ajoutées

- `/admin/sales` → Page Ventes
- `/admin/formations` → Page Formations

## Navigation

Les deux nouvelles pages sont accessibles depuis la barre latérale du dashboard admin :
- **Ventes** : Icône dollar avec le label "Ventes"
- **Formations** : Icône académique avec le label "Formations"

## Technologies utilisées

- **React** : Framework principal
- **Tailwind CSS** : Styling et mise en page responsive
- **Lucide React** : Bibliothèque d'icônes
- **React Router** : Navigation entre les pages

## Prochaines étapes possibles

### Page Ventes
- Ajouter des filtres par date, producteur ou produit
- Implémenter la pagination pour les grandes listes
- Ajouter des graphiques d'évolution des ventes
- Exporter les données en CSV/Excel

### Page Formations
- Implémenter la fonctionnalité de recherche
- Créer un formulaire d'ajout de module
- Ajouter la gestion des inscriptions
- Implémenter la modification et suppression de formations
- Ajouter des statistiques de progression des participants

---

**Auteur** : MiniMax Agent  
**Date de création** : 2025  
**Version** : 1.0
