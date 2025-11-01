# 🚀 GUIDE DE DÉMARRAGE RAPIDE - Chatbot IA

## ⚡ **DÉMARRAGE IMMÉDIAT**

### ** Étape 1 : Installation (Si pas fait)**
```bash
cd /workspace/front-agriteranga
npm install
```

### **Étape 2 : Lancement**
```bash
# Option A : npm start (recommandé)
npm start

# Option B : npm run dev
npm run dev

# Option C : npx vite (si problèmes avec npm)
npx vite
```

### **Étape 3 : Accès**
- Ouvrir : `http://localhost:5173/experts`
- Ou cliquer "Avis d'experts" dans le footer

## 🔧 **SI PROBLÈME DE VERSION NODE.JS**

### **Solution 1 : Version compatible**
```bash
# Installer nvm (si pas déjà fait)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc

# Installer Node.js 20
nvm install 20
nvm use 20

# Relancer le projet
npm install
npm start
```

### **Solution 2 : Docker (Alternative)**
```bash
# Utiliser Docker si disponible
docker run --rm -it -p 5173:5173 node:20-alpine
# Puis naviguer dans le conteneur et lancer le projet
```

### **Solution 3 : Service Cloud**
- **Vercel** : Déployer directement depuis GitHub
- **Netlify** : Glisser-déposer le dossier
- **CodeSandbox** : Importer le projet

## 🎯 **TESTS RAPIDES**

### **Test 1 : Page accessible**
```
http://localhost:5173/experts
```

### **Test 2 : Questions simples**
```
Quels produits vendez-vous ?
```

### **Test 3 : Questions complexes (IA)**
```
Avec 50 000 FCFA, comment me lancer dans l'agriculture ?
```

## 📋 **CONFIGURATION IA (Optionnel)**

### **Pour API Gratuite (Hugging Face)**
1. Aller sur : https://huggingface.co/settings/tokens
2. Créer un token d'accès (lecture)
3. Créer fichier `.env` à la racine :
   ```
   VITE_HUGGINGFACE_API_KEY=hf_votre_token_ici
   ```
4. Redémarrer le serveur

### **Pour API Premium (OpenAI)**
1. Aller sur : https://platform.openai.com/api-keys
2. Créer une clé API
3. Ajouter dans `.env` :
   ```
   VITE_OPENAI_API_KEY=sk_votre_cle_ici
   ```
4. Redémarrer le serveur

## 🆘 **DÉPANNAGE RAPIDE**

### **Erreur "Module not found"**
```bash
rm -rf node_modules package-lock.json
npm install
```

### **Erreur de permissions**
```bash
chmod +x node_modules/.bin/*
```

### **Port 5173 occupé**
```bash
# Tuer le processus
lsof -ti:5173 | xargs kill -9

# Ou changer de port
npx vite --port 3000
```

### **Erreur "Cannot resolve dependency"**
```bash
npm install --legacy-peer-deps
```

## ✅ **VÉRIFICATION FONCTIONNEMENT**

1. **Page se charge** ✅
2. **Chat visible** ✅
3. **Messages s'envoient** ✅
4. **Réponses reçues** ✅
5. **Footer accessible** ✅

## 📞 **AIDE IMMÉDIATE**

Si rien ne fonctionne :
1. **Vérifier Node.js** : `node --version` (doit être 18+)
2. **Vérifier npm** : `npm --version`
3. **Vérifier console** : Erreurs affichées en rouge
4. **Contacter** : agriteranga@gmail.com

---

**🚀 En 3 minutes, votre chatbot IA sera opérationnel !**