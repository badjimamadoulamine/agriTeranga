# Page de Connexion (Login)

## Vue d'ensemble
La page de connexion permet aux utilisateurs d'accéder à leur compte AgriTeranga. Elle offre deux méthodes de connexion : traditionnelle (email/téléphone + mot de passe) et via Google.

## Caractéristiques

### Structure de la page
1. **Header** : Navigation principale avec possibilité d'ouvrir le modal d'inscription
2. **Formulaire de connexion** : Conteneur centré avec bordure verte
3. **Footer** : Pied de page standard

### Éléments du formulaire

#### 1. Branding
- **Logo AgriTeranga** : Logo avec dégradé vert
- **Nom de marque** : "AgriTeranga" en police noire et grasse

#### 2. Champs de saisie
- **Email ou téléphone** :
  - Label : "Email ou téléphone"
  - Bordure verte (2px, #2D5F3F)
  - Coins arrondis
  - Focus avec ring vert

- **Mot de passe** :
  - Label : "Mot de passe"
  - Type password (masqué)
  - Même style que le champ email

#### 3. Bouton principal
- **Connexion** :
  - Fond vert foncé (#2D5F3F)
  - Texte blanc
  - Pleine largeur
  - Effet hover (couleur plus foncée)

#### 4. Options secondaires
- **Lien "Mot de passe oublié ?"** :
  - Texte noir avec hover vert
  - Redirection vers `/forgot-password`

- **Séparateur** : "ou connectez-vous avec"

- **Bouton Google** :
  - Fond vert clair (#E8F5E3)
  - Bordure verte
  - Icône Google officielle
  - Effet hover

## Palette de couleurs
- **Vert principal** : #2D5F3F (bordures, bouton principal)
- **Vert clair** : #E8F5E3 (fond bouton Google)
- **Blanc** : #FFFFFF (fond formulaire, texte boutons)
- **Noir** : #000000 (texte, labels)

## Routes et navigation

### Accès à la page
- URL : `/login`
- Accessible via le bouton "Se connecter" dans le Header

### Navigation sortante
- `/forgot-password` : Lien "Mot de passe oublié ?"
- Modal d'inscription : Via le bouton "S'inscrire" du Header

## Responsive Design
- **Mobile** : Formulaire pleine largeur avec padding réduit
- **Tablet** : Conteneur max-width:md
- **Desktop** : Conteneur centré avec max-width:md

## Intégration avec l'application

### Props reçues
```jsx
const Login = ({ onOpenRegister }) => {
  // onOpenRegister : Fonction pour ouvrir le modal d'inscription
}
```

### État local
```jsx
const [formData, setFormData] = useState({
  emailOrPhone: '',
  password: ''
})
```

### Fonctions
- `handleChange(e)` : Mise à jour des champs du formulaire
- `handleSubmit(e)` : Gestion de la soumission du formulaire (à implémenter)
- `handleGoogleLogin()` : Gestion de la connexion Google (à implémenter)

## Prochaines étapes (Backend)
1. Implémenter l'authentification avec JWT
2. Configurer OAuth2 pour Google
3. Ajouter la validation des champs
4. Gérer les erreurs de connexion
5. Rediriger vers le dashboard après connexion réussie

## Fichier source
- `src/pages/Login.jsx`
