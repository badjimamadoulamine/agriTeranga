# Configuration de l'IA pour le Chatbot AgriTeranga

## 🧠 Solutions d'intégration IA

### Option 1 : OpenAI GPT-4 (Recommandée)
**Avantages :**
- Qualité exceptionnelle des réponses
- Compréhension du contexte agricole
- Réponses en français fluides
- Spécialisation possible avec prompts

**Coût :** ~0.01-0.03€ par conversation
**Configuration :** 
```env
OPENAI_API_KEY=sk-your-api-key-here
```

### Option 2 : Hugging Face (Gratuite)
**Avantages :**
- Gratuite avec 1000 requêtes/jour
- Modèles open source
- Pas de carte de crédit requise

**Limitations :**
- Qualité variable
- Limitations de requêtes
- Réponses parfois moins précises

**Configuration :**
```env
HUGGINGFACE_API_KEY=hf_your-api-key-here
```

### Option 3 : Claude (Anthropic)
**Avantages :**
- Excellent pour les conseils techniques
- Bonne compréhension du contexte africain
- Réponses détaillées

**Coût :** ~0.02€ par conversation
**Configuration :**
```env
CLAUDE_API_KEY=sk-ant-your-api-key-here
```

## 🎯 Prompts spécialisés pour l'agriculture

### Prompt système
```
Tu es un expert agricole spécialisé dans l'agriculture en Afrique de l'Ouest, particulièrement au Sénégal. 

EXPERTISE :
- Agriculture tropicale et subtropicale
- Climat sénégalais et saison des pluies
- Cultures adaptées à Dakar et environs
- Agriculture urbaine et culture en pot
- Techniques biologiques et durables
- Gestion de l'eau et irrigation
- Protection naturelle des cultures

INSTRUCTIONS :
1. Donne des conseils pratiques et spécifiques au Sénégal
2. Considère le climat tropical et les saisons
3. Suggère des alternatives bon marché
4. Propose des solutions locales
5. Utilise un langage simple et accessible
6. Ajoute des conseils sur le calendrier agricole

STYLE :
- Ton professionnel mais accessible
- Réponses structurées avec points clés
- Conseils actionables immédiatement
```

### Exemples de questions complexes
- "Quels légumes sont faciles à cultiver à domicile ?"
- "Quelle est la meilleure période pour planter des tomates ?"
- "Comment protéger mes plantes des insectes naturellement ?"
- "Quelles cultures sont adaptées au climat de ma région ?"
- "Quels engrais ou méthodes naturelles recommandez-vous ?"
- "Avec un budget de 50 000 FCFA, comment me lancer dans l'agriculture ?"

## 🔄 Logique de détection

### Questions simples (Réponses prédéfinies)
- Informations sur les produits
- Prix et commandes
- Contact et services
- Disponibilité

### Questions complexes (IA)
- Conseils techniques agricoles
- Planification culturale
- Problèmes de pests/ravageurs
- Optimisation budget
- Techniques spécialisées
- Calendrier agricole

## 🛡️ Gestion des erreurs

1. **API indisponible** : Fallback vers réponses prédéfinies
2. **Quota atteint** : Message d'information et contact direct
3. **Réponse non pertinente** : Demande de reformulation
4. **Temps de réponse long** : Indicateur de chargement

## 📊 Métriques de performance

- Temps de réponse moyen
- Taux de satisfaction utilisateur
- Types de questions les plus posées
- Utilisation du budget API