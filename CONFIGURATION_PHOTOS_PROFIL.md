# Configuration des Photos de Profil

## Problème résolu
Les photos de profil ne s'affichaient pas dans les parties producteur et consommateur à cause d'une configuration API incorrecte.

## Corrections apportées

### 1. Configuration Frontend
Le fichier `front/.env` a été mis à jour pour inclure :
```env
VITE_API_URL=http://localhost:5000/api/v1
```

### 2. Backend Configuration
Le backend est déjà correctement configuré pour servir les fichiers statiques :
- Les images sont servies depuis `/uploads` avec les headers CORS appropriés
- Les photos de profil sont stockées dans `/uploads/profiles/`

## Comment démarrer l'application

### Backend (port 5000)
```bash
cd back
npm install
npm start
```

### Frontend (port 5173)
```bash
cd front
npm install
npm run dev
```

## URLs importantes
- **Backend API**: http://localhost:5000/api/v1
- **Frontend**: http://localhost:5173
- **Photos de profil**: http://localhost:5000/uploads/profiles/[nom-fichier].jpg

## Test de fonctionnement

1. Se connecter en tant que producteur ou consommateur
2. Aller dans "Modifier mon profil"
3. Télécharger une photo de profil
4. Vérifier que la photo s'affiche dans le header/navigation

## Points de contrôle

### ✅ Frontend
- [ ] Variable `VITE_API_URL` définie dans `.env`
- [ ] Fonction `getProfilePictureUrl` utilise l'URL correcte
- [ ] Headers CORS configurés pour les images

### ✅ Backend
- [ ] Serveur Express configuré pour servir les fichiers statiques
- [ ] Dossier `/uploads` accessible publiquement
- [ ] Headers CORS configurés (`Cross-Origin-Resource-Policy: cross-origin`)

### ✅ Stockage des fichiers
- [ ] Photos de profil stockées dans `back/src/uploads/profiles/`
- [ ] Fichiers accessibles via URL: `http://localhost:5000/uploads/profiles/[filename]`

## Dépannage

### Si les photos ne s'affichent toujours pas :

1. **Vérifier l'URL de l'API** :
   ```bash
   curl http://localhost:5000/api/v1/health
   ```

2. **Vérifier l'accès aux fichiers uploadés** :
   ```bash
   curl http://localhost:5000/uploads/profiles/[nom-fichier]
   ```

3. **Vérifier la console du navigateur** pour les erreurs 404/500

4. **Redémarrer les serveurs** après modification de `.env`

### Configuration pour production

Pour un déploiement en production, modifiez le fichier `.env` du frontend :
```env
VITE_API_URL=https://votre-domaine.com/api/v1
```

## Structure des fichiers concernés

```
v1/
├── back/
│   ├── src/
│   │   ├── app.js                    # Configuration Express + static files
│   │   ├── uploads/
│   │   │   └── profiles/            # Photos de profil
│   │   └── controllers/
│   │       └── user.controller.js   # Gestion upload photos
├── front/
│   ├── .env                         # Configuration API
│   └── src/
│       ├── utils/
│       │   └── imageUtils.js        # Fonction getProfilePictureUrl
│       └── components/
│           ├── producer/
│           │   └── ProducerHeader.jsx
│           └── consumer/
│               └── ConsumerProfileModal.jsx
```