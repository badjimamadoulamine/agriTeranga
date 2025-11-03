# Guide du Système de Gestion d'Erreurs - AgriTeranga

## Vue d'ensemble

Le système de gestion d'erreurs d'AgriTeranga fournit une approche centralisée et intuitive pour gérer les erreurs côté frontend, améliorer l'expérience utilisateur et guider les consommateurs lors de l'inscription et de la connexion.

## Composants Principaux

### 1. Hook `useErrorHandler`

**Localisation:** `src/hooks/useErrorHandler.js`

**Fonctionnalités:**
- Gestion centralisée des erreurs
- Validation en temps réel des champs
- Messages d'erreur contextuels en français
- Système de retry automatique
- Validation de formulaire

**Utilisation:**

```javascript
import useErrorHandler from '../hooks/useErrorHandler'

const MyComponent = () => {
  const { 
    errors,           // Objet des erreurs par champ
    isSubmitting,     // État de soumission
    clearErrors,      // Effacer toutes les erreurs
    setFieldError,    // Définir une erreur pour un champ
    validateField,    // Valider un champ spécifique
    validateForm,     // Valider tout le formulaire
    handleApiError,   // Gérer les erreurs API
    setLoading        // Gérer l'état de chargement
  } = useErrorHandler()

  // Validation en temps réel
  const handleChange = (e) => {
    const { name, value } = e.target
    const error = validateField(name, value, { required: true, minLength: 3 })
    if (error) {
      setFieldError(name, error)
    }
  }
}
```

### 2. Composants d'Affichage d'Erreurs

**Localisation:** `src/components/ErrorMessage.jsx`

**Composants disponibles:**

#### `ErrorMessage`
Affiche un message d'erreur unique avec icône et contexte.

```jsx
<ErrorMessage 
  error="Email invalide"
  field="email"
  type="error"
  showIcon={true}
  context="email"
/>
```

#### `ErrorList`
Affiche une liste d'erreurs multiples.

```jsx
<ErrorList 
  errors={errors}
  type="error"
  onDismiss={(field) => clearFieldError(field)}
/>
```

#### `FieldWithError`
Composant pour un champ de formulaire avec gestion d'erreur intégrée.

```jsx
<FieldWithError
  label="Email"
  name="email"
  error={errors.email}
  required
  helpText="Votre adresse email"
>
  <input
    type="email"
    name="email"
    value={formData.email}
    onChange={handleChange}
  />
</FieldWithError>
```

### 3. Système de Notifications Toast

**Localisation:** `src/contexts/ToastContext.jsx`

**Provider:**
```jsx
import { ToastProvider } from './contexts/ToastContext'

function App() {
  return (
    <ToastProvider position="top-right" maxToasts={5}>
      <YourComponents />
    </ToastProvider>
  )
}
```

**Hook d'utilisation:**
```jsx
import { useAuthToast } from '../contexts/ToastContext'

const MyComponent = () => {
  const toast = useAuthToast()
  
  // Notifications d'authentification
  toast.showSuccess('Connexion réussie !')
  toast.showError('Identifiants incorrects')
  toast.showInfo('Nouveau message reçu')
  toast.showWarning('Attention : action irréversible')
  
  // Notification avec actions
  const loadingId = toast.showLoading('Traitement en cours...')
  // ... après traitement
  toast.removeToast(loadingId)
}
```

## Types d'Erreurs Gérées

### 1. Erreurs de Validation Client

**Messages en français:**
- Champs requis non remplis
- Format d'email invalide
- Numéro de téléphone invalide
- Mot de passe trop faible (min 8 caractères, majuscule, minuscule, chiffre)
- Longueur insuffisante

**Exemple:**
```javascript
const validationRules = {
  email: { required: true },
  password: { required: true, minLength: 8 },
  phone: { required: true }
}

const { isValid, errors } = validateForm(formData, validationRules)
```

### 2. Erreurs API HTTP

**Gestion automatique par code de statut:**

| Code | Message | Action Utilisateur |
|------|---------|-------------------|
| 400 | Données invalides | Corriger les champs marqués en rouge |
| 401 | Identifiants incorrects | Vérifier email/mot de passe |
| 403 | Compte non vérifié | Vérifier email et cliquer sur lien |
| 404 | Utilisateur non trouvé | Vérifier les identifiants |
| 409 | Compte existant | Utiliser un autre email |
| 422 | Erreurs de validation | Corriger selon messages spécifiques |
| 500 | Erreur serveur | Réessayer dans quelques minutes |
| 503 | Service indisponible | Réessayer plus tard |

**Utilisation:**
```javascript
try {
  const result = await api.post('/auth/login', credentials)
  toast.showSuccess('Connexion réussie')
} catch (error) {
  const { errorMessage } = handleApiError(error, 'login')
  toast.showError(errorMessage)
}
```

### 3. Erreurs Réseau

**Gestion automatique:**
- Détection des erreurs de connexion
- Messages d'aide pour résolution
- Possibilité de retry automatique

```javascript
// Retry automatique
const handleErrorWithRetry = useCallback(async (error, retryFunction, maxRetries = 3) => {
  return await handleErrorWithRetry(error, () => api.post('/endpoint'), 3)
}, [handleApiError, setLoading])
```

## Intégration dans les Composants

### 1. Inscription (RegisterModal)

**Améliorations apportées:**
- Validation en temps réel des champs
- Messages d'erreur contextuels
- Indicateurs visuels d'erreur
- Toast de progression avec actions
- Validation par étape

**Exemple d'utilisation:**
```jsx
const RegisterModal = () => {
  const { validateForm, setFieldError, handleApiError } = useErrorHandler()
  const toast = useAuthToast()

  const handleSubmit = async (formData) => {
    // Validation
    const { isValid } = validateForm(formData, validationSchema)
    if (!isValid) {
      toast.showError('Veuillez corriger les erreurs')
      return
    }

    // Soumission avec gestion d'erreurs
    try {
      const loadingId = toast.showLoading('Création du compte...')
      const result = await authService.register(formData)
      toast.removeToast(loadingId)
      
      toast.showSuccess('Compte créé ! Vérifiez votre email', {
        actions: [
          { label: 'Aller à la connexion', onClick: openLoginModal }
        ]
      })
    } catch (error) {
      const { errorMessage } = handleApiError(error, 'register')
      toast.showError(errorMessage)
    }
  }
}
```

### 2. Connexion (LoginModal)

**Améliorations apportées:**
- Validation en temps réel des identifiants
- Messages d'erreur spécifiques
- Gestion des comptes non vérifiés
- Toast de progression
- Instructions claires pour la résolution

**Exemple d'utilisation:**
```jsx
const LoginModal = () => {
  const { validateField, handleApiError } = useErrorHandler()
  const toast = useAuthToast()

  const handleSubmit = async (credentials) => {
    try {
      const result = await authService.login(credentials)
      toast.showSuccess('Connexion réussie ! Bienvenue')
    } catch (error) {
      const { errorMessage, fieldErrors } = handleApiError(error, 'login')
      
      // Afficher erreurs spécifiques aux champs
      if (fieldErrors) {
        Object.keys(fieldErrors).forEach(field => {
          setFieldError(field, fieldErrors[field])
        })
      }
      
      toast.showError(errorMessage)
    }
  }
}
```

## Messages d'Aide Contextuels

### Champs d'Inscription

| Champ | Message d'Aide | Résolution |
|-------|----------------|------------|
| Email | "Utilisez une adresse email valide que vous consultez régulièrement" | Vérifier le format et l'accessibilité |
| Mot de passe | "Minimum 8 caractères avec majuscule, minuscule et chiffre" | Suivre les critères affichés |
| Téléphone | "Pour les notifications de livraison importantes" | Format international accepté |
| Adresse | "Adresse complète pour la livraison de vos commandes" | Inclure code postal et ville |

### Champs de Connexion

| Champ | Message d'Aide | Résolution |
|-------|----------------|------------|
| Email/Téléphone | "Utilisez l'email ou numéro utilisé lors de l'inscription" | Vérifier les identifiants exacts |
| Mot de passe | "Mot de passe de votre compte AgriTeranga" | Utiliser "Mot de passe oublié" si nécessaire |

## Notifications et Feedback

### Types de Toast

1. **Succès** (Vert)
   - Inscription réussie
   - Connexion réussie
   - Actions complétées

2. **Erreur** (Rouge)
   - Erreurs de validation
   - Erreurs d'authentification
   - Erreurs réseau/serveur

3. **Avertissement** (Jaune)
   - Actions à confirmer
   - Informations importantes

4. **Information** (Bleu)
   - Messages informatifs
   - Nouveautés

5. **Chargement** (Gris)
   - Opérations en cours
   - Aucune action utilisateur

### Actions dans les Toast

```javascript
toast.showSuccess('Compte créé avec succès !', {
  title: 'Inscription réussie',
  duration: 8000,
  actions: [
    {
      label: 'Aller à la connexion',
      onClick: () => {
        closeRegisterModal()
        openLoginModal()
      }
    },
    {
      label: 'Vérifier l\'email',
      onClick: () => window.open('https://mail.google.com')
    }
  ]
})
```

## Bonnes Pratiques

### 1. Validation

- **Toujours valider côté client** avant envoi
- **Messages en français** et contextuels
- **Validation en temps réel** pour feedback immédiat
- **Indication visuelle** des champs invalides

### 2. Gestion d'Erreurs

- **Utiliser le hook centralisé** pour la cohérence
- **Messages spécifiques** plutôt que génériques
- **Actions claires** pour la résolution
- **Retry automatique** pour erreurs temporaires

### 3. Expérience Utilisateur

- **Feedback immédiat** pour toutes les actions
- **États de chargement** clairement indiqués
- **Messages encourageants** même en cas d'erreur
- **Guides visuels** pour la résolution

### 4. Accessibilité

- **Contraste élevé** pour les messages d'erreur
- **Icônes descriptives** en complément du texte
- **Messages screen-reader friendly**
- **Navigation au clavier** fonctionnelle

## Tests et Démonstration

### Composant de Démonstration

Un composant `ErrorDemo` est disponible pour tester toutes les fonctionnalités:

```jsx
import ErrorDemo from './components/ErrorDemo'

// Dans votre page de test
<ErrorDemo />
```

### Scénarios de Test

1. **Validation en temps réel**
   - Saisir des données invalides dans chaque champ
   - Observer les messages d'erreur immédiats

2. **Erreurs API simulées**
   - Tester chaque type d'erreur HTTP
   - Vérifier les messages contextuels

3. **Notifications Toast**
   - Tester tous les types de notifications
   - Vérifier les actions et l'auto-fermeture

## Configuration

### Personnalisation des Messages

Les messages peuvent être personnalisés dans `useErrorHandler.js`:

```javascript
const errorMessages = {
  validation: {
    required: 'Ce champ est obligatoire',
    email: 'Adresse email invalide',
    password: 'Mot de passe non conforme',
    // ...
  },
  api: {
    401: 'Identifiants de connexion incorrects',
    403: 'Compte non vérifié',
    // ...
  }
}
```

### Styles et Thèmes

Les styles peuvent être personnalisés via Tailwind CSS dans les composants. Les classes disponibles:

- `bg-red-50 border-red-200 text-red-800` - Erreurs
- `bg-yellow-50 border-yellow-200 text-yellow-800` - Avertissements
- `bg-blue-50 border-blue-200 text-blue-800` - Informations
- `bg-green-50 border-green-200 text-green-800` - Succès

## Maintenance et Extension

### Ajouter Nouveaux Types d'Erreurs

1. **Définir le message** dans `useErrorHandler.js`
2. **Ajouter la gestion** dans `handleApiError`
3. **Mettre à jour** les composants si nécessaire
4. **Tester** avec le composant de démonstration

### Internationalisation

Pour ajouter d'autres langues:

1. **Créer un fichier de traduction** (ex: `messages.fr.js`)
2. **Modifier le hook** pour accepter une locale
3. **Utiliser les clés de traduction** dans les composants

## Conclusion

Ce système de gestion d'erreurs centralisé améliore considérablement l'expérience utilisateur en:

- **Réduisant la frustration** avec des messages clairs
- **Guidant l'utilisateur** vers la résolution
- **Fournissant un feedback immédiat** sur les actions
- **Maintenant la cohérence** dans toute l'application
- **Facilitant la maintenance** du code

L'implémentation est extensible et suit les meilleures pratiques d'accessibilité et d'expérience utilisateur.