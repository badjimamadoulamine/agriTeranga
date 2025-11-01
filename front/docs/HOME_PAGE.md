# 🌿 Agriteranga - Page d'Accueil

> Page d'accueil complète et responsive pour la plateforme Agriteranga

## 🎨 Design

La page d'accueil a été créée selon la maquette fournie avec les sections suivantes :

### 📝 Sections de la page

1. **Header** - Navigation principale
   - Logo Agriteranga
   - Menu de navigation (Accueil, Produits, Formations, Blog, etc.)
   - Recherche, Panier, Connexion
   - Menu hamburger responsive sur mobile

2. **Hero Section** - Bandeau principal
   - Image de fond immersive
   - Titre accrocheur "Cultiver pour un avenir sain"
   - Bouton d'appel à l'action

3. **About Section** - Qui sommes-nous ?
   - Texte de présentation
   - Grille d'images
   - Bouton "En savoir plus"

4. **Popular Products** - Produits populaires
   - Grille de 8 produits (4 colonnes sur desktop)
   - Cards avec image, nom, prix, catégorie
   - Bouton d'ajout au panier
   - Badge "Frais" sur chaque produit

5. **Newsletter Section** - Inscription newsletter
   - Formulaire avec 6 champs (Prénom, Nom, Email, Téléphone, Adresse, Ville)
   - Fond vert foncé (primary-800)
   - Bouton jaune d'inscription

6. **Features** - Nos points forts
   - 3 caractéristiques : Livraison gratuite, Paiement sécurisé, Support 24/7
   - Icônes et descriptions

7. **Promo Section** - Offres spéciales
   - Image de légumes à gauche
   - Formulaire d'inscription newsletter à droite
   - Mise en avant de la réduction de 10%

8. **Blog Section** - Articles de blog
   - 3 articles avec images
   - Catégories et dates
   - Bouton "Lire la suite"

9. **Offers Section** - Produits en offre
   - Grille de 4 images avec badges "-20%"
   - Images overlay avec titres

10. **Footer** - Pied de page
    - 4 colonnes : À propos, Liens rapides, Services, Contact
    - Réseaux sociaux
    - Copyright

## 🎨 Palette de couleurs

```css
Primaire (Vert) :
- primary-700: Navigation
- primary-800: Newsletter background
- primary-900: Footer
- primary-600: Boutons et accents

Secondaire (Jaune) :
- yellow-400: Boutons CTA
- yellow-300: Hover states

Neutres :
- gray-50: Fond de sections
- gray-900: Textes principaux
- gray-600: Textes secondaires
```

## 📱 Responsive Design

Toutes les sections sont 100% responsives avec breakpoints :

- **Mobile** (< 640px) : 1 colonne
- **Tablet** (640px - 1024px) : 2 colonnes
- **Desktop** (> 1024px) : 3-4 colonnes

### Exemples de grilles adaptatives :

```jsx
// Produits : 1 col mobile, 2 cols tablet, 4 cols desktop
grid-cols-1 sm:grid-cols-2 lg:grid-cols-4

// Blog : 1 col mobile, 2 cols tablet, 3 cols desktop
grid-cols-1 md:grid-cols-2 lg:grid-cols-3
```

## 🛠️ Composants créés

```
src/components/
├── Header.jsx              # Navigation principale
├── Footer.jsx              # Pied de page
├── Hero.jsx                # Section hero
├── AboutSection.jsx        # Section à propos
├── PopularProducts.jsx     # Grille de produits
├── NewsletterSection.jsx   # Formulaire newsletter
├── Features.jsx            # Points forts
├── PromoSection.jsx        # Section promo
├── BlogSection.jsx         # Articles de blog
└── OffersSection.jsx       # Produits en offre
```

## ✨ Fonctionnalités

### Smooth Scroll
```css
html {
  scroll-behavior: smooth;
}
```

### Animations
- Hover effects sur les cards
- Transitions fluides sur les boutons
- Scale effect sur les images
- Transform sur les liens

### Interactions
- Menu hamburger fonctionnel sur mobile
- Compteur panier dans le header
- Formulaires avec validation
- Boutons avec états hover/active

## 🚀 Lancer le projet

```bash
# Installation
cd front-agriteranga
npm install

# Développement
npm run dev

# Build production
npm run build
```

## 📸 Captures d'écran

La page suit fidèlement la maquette fournie avec :
- Layout moderne et aéré
- Typographie hiérarchisée
- Espacement cohérent
- Images de haute qualité (Unsplash)
- Design éco-responsable (thème vert)

## 📝 Prochaines étapes

- [ ] Intégrer avec l'API backend
- [ ] Ajouter la page Produits
- [ ] Créer la page Formations
- [ ] Implémenter le Blog
- [ ] Ajouter le panier fonctionnel
- [ ] Créer le dashboard utilisateur

---

**Développé par MiniMax Agent** 🤖
