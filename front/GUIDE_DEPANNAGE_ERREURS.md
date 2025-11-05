# Guide de Dépannage - Système de Gestion des Erreurs

## ✅ Corrections Appliquées

### 1. Correction du TypeError dans ToastContext.jsx
**Problème identifié :** Conflit de noms de fonction dans `showAuthError`
```javascript
// ❌ AVANT (causait l'erreur)
return error(message, {...})

// ✅ APRÈS (corrigé)
const errorFunction = error
return errorFunction(message, {...})
```

### 2. Gestion des Erreurs 404 API

## 🔧 Solutions pour l'Erreur 404 `/api/auth/register`

### Causes Possibles

1. **Backend non démarré**
   ```bash
   # Vérifiez que le serveur backend tourne sur le port 5000
   netstat -tlnp | grep :5000
   # ou
   lsof -i :5000
   ```

2. **Configuration d'API incorrecte**
   ```bash
   # Vérifiez le fichier .env du frontend
   echo $VITE_API_URL
   # Doit pointer vers http://localhost:5000/api
   ```

3. **Route backend manquante**
   - Le endpoint `/api/auth/register` n'existe pas sur le serveur
   - Vérifiez la configuration des routes côté backend

### Solutions Immédiates

#### Option 1 : Démarrer le Backend
```bash
# Dans le dossier backend
npm start
# ou
npm run dev
# ou selon votre configuration
```

#### Option 2 : Vérifier l'URL de l'API
```javascript
// Dans src/services/api.js, vérifiez :
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
console.log('API URL:', API_URL)
```

#### Option 3 : Configuration CORS (si nécessaire)
```javascript
// Dans votre serveur backend (Express.js)
const cors = require('cors')

app.use(cors({
  origin: 'http://localhost:3000', // ou votre port frontend
  credentials: true
}))
```

## 🧪 Test du Système d'Erreurs

### 1. Test des Validations Frontend
```javascript
// Ouvrez la console développeur et testez :
import { useErrorHandler } from './hooks/useErrorHandler'

const { validateField } = useErrorHandler()

// Test email invalide
console.log(validateField('email', 'email-invalide'))
// → "Adresse email invalide"

// Test mot de passe faible
console.log(validateField('password', '123'))
// → "Le mot de passe doit contenir au moins 8 caractères"

// Test téléphone invalide
console.log(validateField('phone', '123'))
// → "Numéro de téléphone invalide"
```

### 2. Test Manuel des Composants

#### Test du RegisterModal :
1. Ouvrez le modal d'inscription
2. Testez les validations :
   - Email : `test@invalid` → Doit afficher une erreur
   - Mot de passe : `123` → Doit exiger 8+ caractères avec majuscule, minuscule, chiffre
   - Téléphone : `123` → Doit être invalide

#### Test du LoginModal :
1. Ouvrez le modal de connexion
2. Essayez de vous connecter avec des identifiants incorrects
3. Le message d'erreur doit s'afficher en français

### 3. Test avec un Backend Mock

Si vous n'avez pas de backend, créez un mock temporaire :

```javascript
// src/services/mockAuthService.js
export const mockAuthService = {
  register: async (userData) => {
    // Simuler différentes réponses selon les données
    if (userData.email === 'existing@test.com') {
      throw new Error('User already exists')
    }
    
    if (userData.password.length < 8) {
      throw new Error('Password too weak')
    }
    
    // Succès
    return {
      success: true,
      message: 'Compte créé avec succès',
      user: { id: 1, email: userData.email }
    }
  }
}
```

## 📋 Checklist de Validation

### ✅ Système d'Erreurs Frontend
- [ ] Import des hooks fonctionne (`useErrorHandler`, `useToast`)
- [ ] Validations temps réel activées
- [ ] Messages d'erreur en français
- [ ] Toasts s'affichent correctement
- [ ] Pas d'erreurs JavaScript dans la console

### ✅ Configuration API
- [ ] Backend serveur démarré sur port 5000
- [ ] Variable `VITE_API_URL` configurée
- [ ] CORS configuré si nécessaire
- [ ] Routes backend existantes

### ✅ Expérience Utilisateur
- [ ] Messages d'erreur clairs et utiles
- [ ] Validation en temps réel (sans bloquer)
- [ ] Indicateurs visuels (bordures rouges)
- [ ] Aide contextuelle sous les champs

## 🚨 Messages d'Erreur Personnalisés

### Validation Email
```
❌ "email-invalide" → "Adresse email invalide"
✅ "test@exemple.com" → Pas d'erreur
```

### Validation Mot de Passe
```
❌ "123" → "Le mot de passe doit contenir au moins 8 caractères"
❌ "password" → "Le mot de passe doit contenir au moins une majuscule"
❌ "PASSWORD" → "Le mot de passe doit contenir au moins une minuscule"
❌ "Password" → "Le mot de passe doit contenir au moins un chiffre"
✅ "Password123" → Pas d'erreur
```

### Validation Téléphone
```
❌ "123" → "Numéro de téléphone invalide"
✅ "+221701234567" → Pas d'erreur
```

### Erreurs API (français)
```
400 → "Cette adresse email est déjà utilisée ou invalide"
401 → "Email ou mot de passe incorrect"
403 → "Veuillez vérifier votre email avant de vous connecter"
404 → "Aucun compte trouvé avec ces identifiants"
500 → "Erreur serveur temporaire. Réessayez dans quelques minutes"
```

## 🛠️ Débogage Avancé

### Console Developer
```javascript
// Activez les logs détaillés
localStorage.setItem('debug_errors', 'true')

// Vérifiez l'état des erreurs
console.log('Current errors:', window.getCurrentErrors?.())
```

### Monitoring des Toasts
```javascript
// Accédez au context toast pour debugging
import { ToastProvider, useToast } from './contexts/ToastContext'

// Dans un composant de test
const TestComponent = () => {
  const toast = useToast()
  
  useEffect(() => {
    console.log('Available toast methods:', Object.keys(toast))
    
    // Test manuel
    toast.success('Test de toast succès')
    toast.error('Test de toast erreur')
  }, [])
}
```

## 📞 Support

Si les problèmes persistent :

1. **Vérifiez la console** pour les erreurs JavaScript
2. **Testez l'API** directement avec curl/postman
3. **Redémarrez les serveurs** frontend et backend
4. **Vérifiez les variables d'environnement**

## 🔄 Prochaines Étapes

1. **Configurez un backend fonctionnel** avec les routes `/api/auth/register` et `/api/auth/login`
2. **Testez l'ensemble du parcours** inscription → vérification email → connexion
3. **Ajoutez des tests automatisés** pour la validation
4. **Personnalisez les messages** selon vos besoins métier

---

*Guide créé le 27/10/2025 - Système de gestion des erreurs AgriTeranga v1.0*