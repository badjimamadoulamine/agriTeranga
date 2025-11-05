# Chatbot IA "Avis d'Experts" - AgriTeranga 🚀

## 🎯 Fonctionnalités Implémentées

### 🤖 Page de Chatbot avec IA
- **Fichier créé** : `src/pages/Experts.jsx`
- **Service IA** : `src/services/aiService.js`
- **Script de test** : `src/services/aiTest.js`
- **URL** : `/experts`
- **Accessible via** : Footer → "Avis d'experts"

### 🧠 Intelligence Artificielle Intégrée
- **Détection automatique** des questions complexes vs simples
- **API Gratuite** : Hugging Face (1000 requêtes/jour)
- **API Premium** : OpenAI (qualité maximale, optionnel)
- **Fallback intelligent** : Réponses prédéfinies si IA indisponible
- **Base de connaissances agricole** spécialisée Sénégal

### 💡 Interface Utilisateur Améliorée
- **Indicateurs visuels** pour distinguer IA vs réponses prédéfinies
- **Badge "IA"** sur les réponses générées par l'intelligence artificielle
- **Messages de statut** : "IA en réflexion...", "IA utilisée !"
- **Conseils rotatifs** avec tips agricoles
- **Design responsive** adapté mobile/desktop
- **Questions suggérées** spécialisées agriculture

## 🎯 Types de Questions et Réponses

### 📝 Questions Simples (Réponses Prédéfinies)
- Informations produits, prix, contact
- Commandes, livraison, services
- Formations disponibles
- Coordonnées entreprise

### 🤖 Questions Complexes (IA Avancée)
- **Conseils personnalisés** : "Quels légumes facile à cultiver à domicile ?"
- **Planification culturale** : "Quelle période pour planter des tomates ?"
- **Protection naturelle** : "Comment protéger mes plantes des insects ?"
- **Optimisation budget** : "Avec 50 000 FCFA, comment me lancer ?"
- **Techniques spécialisées** : compost, irrigation, rotation cultures

## 🚀 Base de Connaissances Agricole

### Agriculture Urbaine
- Cultures adaptées aux petits espaces
- Techniques de culture en pot
- Optimisation balcon/terrasse

### Climat Sénégalais
- Calendrier agricole tropical
- Gestion saison des pluies (juin-octobre)
- Variétés résistantes à la chaleur

### Économie Agriculture
- Solutions avec budget limité
- Matériaux locaux bon marché
- Techniques à faible coût

### Agriculture Biologique
- Engrais naturels maison
- Biopesticides locaux
- Techniques durables

### Gestion Ravageurs
- Protection naturelle des cultures
- Companion planting
- Solutions écologique

## 🎯 Base de connaissances du chatbot

Le chatbot répond automatiquement aux questions sur :

### Produits
- Informations sur les légumes et fruits
- Disponibilité saisonnière
- Qualité et méthodes de culture

### Formations
- Types de cours disponibles
- Certification
- Contenu pédagogique

### Services
- Conseil agricole
- Assistance technique
- Suivi des cultures

### Commercialisation
- Processus de commande
- Prix et devis
- Livraison

### Contact
- Coordonnées (téléphone, email)
- Adresse
- Horaires

### Agriculture durable
- Méthodes biologiques
- Techniques écologiques
- Gestion de l'eau et des ravageurs

## 🚀 Comment utiliser

### 🔧 Configuration Optionnelle (pour IA avancée)
1. **API Gratuite** : Créer compte sur [Hugging Face](https://huggingface.co/)
2. **API Premium** : Créer compte sur [OpenAI](https://platform.openai.com/)
3. **Ajouter clés** dans fichier `.env` (voir `AI_CONFIGURATION_GUIDE.md`)

### 💬 Utilisation du Chatbot

1. **Accéder au chatbot** :
   - Cliquer sur "Avis d'experts" dans le footer
   - Ou naviguer vers `/experts`

2. **Poser une question** :
   - Taper dans la zone de saisie
   - Cliquer sur "Envoyer"
   - Ou utiliser une question suggérée

3. **Types de questions avec IA** :
   - "Quels légumes sont faciles à cultiver à domicile ?"
   - "Avec un budget de 50 000 FCFA, comment me lancer ?"
   - "Comment protéger mes plantes des insects naturellement ?"
   - "Quelle est la meilleure période pour planter des tomates ?"
   - "Quels engrais naturels recommandez-vous ?"

4. **Questions simples (réponses prédéfinies)** :
   - "Quels produits proposez-vous ?"
   - "Comment passer commande ?"
   - "Avez-vous des formations ?"
   - "Quels sont vos prix ?"
   - "Comment vous contacter ?"

### 🧪 Tester le système
```bash
# Lancer l'application
npm start

# Test du service IA (optionnel)
node src/services/aiTest.js
```

## 🔧 Améliorations Possibles

### ✅ Déjà implémenté
- **Intelligence artificielle intégrée** (OpenAI, Hugging Face)
- **Détection automatique** des questions complexes
- **Interface utilisateur avancée** avec indicateurs visuels

### 🚀 Court terme
- **Cache intelligent** pour optimiser les réponses IA
- **Analytics** d'utilisation et de performance
- **Interface d'administration** pour monitoring
- **Améliorer la base de connaissances** avec plus de réponses spécialisées

### 📈 Moyen terme
- **Système de rated answers** pour améliorer les réponses
- **Historique des conversations** pour utilisateurs connectés
- **Transfert vers expert humain** pour questions très complexes
- **Multi-langues** (Wolof, Serère, etc.)

### 🌟 Long terme
- **Chatbot vocal** avec reconnaissance et synthèse vocale
- **IA personnalisée** entraînée sur données AgriTeranga
- **Intégration IoT** avec capteurs de culture
- **Recommandations temps réel** basées sur météo et sol

## 📁 Fichiers Modifiés/Créés

### 🆕 Créés (Nouveaux)
- `src/pages/Experts.jsx` - Page principale du chatbot avec IA
- `src/services/aiService.js` - Service d'intelligence artificielle
- `src/services/aiTest.js` - Script de test du service IA
- `docs/AI_CONFIGURATION_GUIDE.md` - Guide de configuration IA
- `docs/AI_INTEGRATION_PLAN.md` - Plan d'intégration IA
- `.env.example` - Exemple de configuration API

### ✏️ Modifiés
- `src/App.jsx` - Ajout de la route `/experts`
- `docs/CHATBOT_DOCUMENTATION.md` - Mise à jour documentation

### ✅ Déjà existants
- `src/components/Footer.jsx` - Lien vers le chatbot (déjà présent)

## 🌐 Lancement du projet

```bash
# Installer les dépendances
cd /workspace/front-agriteranga
npm install

# Lancer le serveur de développement
npm run dev
```

Le chatbot sera accessible à l'adresse : `http://localhost:5173/experts`

## 📞 Support

Pour toute question technique ou amélioration :
- **Email** : agriteranga@gmail.com
- **Téléphone** : 77 343 24 85

---

*Chatbot "Avis d'Experts" développé pour AgriTeranga - Ensemble, construisons un avenir plus vert et durable.*