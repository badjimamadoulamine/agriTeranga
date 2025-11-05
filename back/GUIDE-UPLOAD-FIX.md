# Guide de résolution des problèmes d'upload d'images

## Problème identifié
L'erreur `ENOENT: no such file or directory` indique que les répertoires d'upload n'existaient pas sur votre serveur.

## Solutions appliquées

### 1. Correction du middleware d'upload
- Le middleware `upload.middleware.js` a été modifié pour créer automatiquement les répertoires
- Utilisation de chemins relatifs pour éviter les problèmes de chemins absolus

### 2. Amélioration du contrôleur de produits
- Meilleure gestion des erreurs
- Stockage des noms de fichiers relatifs au lieu des chemins absolus
- Validation des champs requis

### 3. Script de création des répertoires
Un script `fix-upload-directories.js` a été créé pour initialiser la structure des répertoires.

## Étapes pour appliquer les corrections

### Étape 1: Créer les répertoires d'upload
```bash
cd /workspace/v3/back
node fix-upload-directories.js
```

### Étape 2: Redémarrer le serveur
```bash
npm start
# ou
node server.js
```

### Étape 3: Tester l'upload
1. Assurez-vous que le fichier `mangue.jpg` existe sur votre machine locale
2. Utilisez l'interface d'upload de votre application frontend
3. Le produit devrait maintenant être créé avec succès

## Structure des répertoires créée
```
uploads/
├── products/     # Images des produits
├── profiles/     # Photos de profil
├── formations/   # Thumbnails des formations
├── deliveries/   # Photos de preuve de livraison
└── others/       # Autres fichiers
```

## Vérification
Après avoir appliqué les corrections, testez la création d'un produit avec une image. Le produit devrait être créé avec succès et l'image sauvegardée dans le bon répertoire.