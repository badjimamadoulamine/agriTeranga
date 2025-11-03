/**
 * Service IA avec Google Gemini (CORRIGÉ - Version 2024)
 * Utilise le nouveau modèle gemini-1.5-flash
 */

class AIServiceImproved {
  constructor() {
    // Google Gemini API (GRATUIT - 15 requêtes/minute)
    this.geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY || null;


    // ✅ NOUVEAU MODÈLE : gemini-1.5-flash (remplace gemini-pro)
    this.geminiApiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";
    
    // Hugging Face (backup)
    this.huggingfaceApiKey = import.meta.env.VITE_HUGGINGFACE_API_KEY || null;
    
    // OpenAI (si disponible)
    this.openaiApiKey = import.meta.env.VITE_OPENAI_API_KEY || null;
    
    this.debugMode = import.meta.env.VITE_DEBUG === 'true';
    
    if (this.debugMode) {
      console.log('🤖 AIService Initialisé:', {
        geminiKey: this.geminiApiKey ? '✅ Configurée' : '❌ Manquante',
        model: 'gemini-1.5-flash',
        hfKey: this.huggingfaceApiKey ? '✅ Configurée' : '❌ Manquante',
        openaiKey: this.openaiApiKey ? '✅ Configurée' : '❌ Manquante',
        priority: 'Gemini 1.5 → OpenAI → Fallback',
        debug: this.debugMode
      });
    }
  }

  async performDiagnostics() {
    console.log('🔍 === DIAGNOSTIC IA ===');
    console.log('📋 Configuration:');
    console.log('- Google Gemini Key:', this.geminiApiKey ? '✅ Configurée' : '❌ Manquante');
    console.log('- Modèle Gemini:', 'gemini-1.5-flash');
    console.log('- Hugging Face Key:', this.huggingfaceApiKey ? '✅ Configurée' : '❌ Manquante');
    console.log('- OpenAI Key:', this.openaiApiKey ? '✅ Configurée' : '❌ Manquante');
    console.log('- Debug Mode:', this.debugMode ? '✅ Activé' : '❌ Désactivé');
    
    if (this.geminiApiKey) {
      console.log('\n🧪 Test Google Gemini API...');
      try {
        const testResult = await this.testGeminiAPI();
        console.log('- Test Gemini:', testResult ? '✅ Réussie' : '❌ Échouée');
      } catch (error) {
        console.log('- Test Gemini: ❌ Erreur:', error.message);
      }
    }
    
    console.log('=== FIN DIAGNOSTIC ===\n');
  }

  async testGeminiAPI() {
    if (!this.geminiApiKey) return false;
    
    try {
      const response = await fetch(`${this.geminiApiUrl}?key=${this.geminiApiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: 'Bonjour' }]
          }]
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        return data.candidates && data.candidates.length > 0;
      }
      return false;
    } catch (error) {
      console.log('❌ Erreur test Gemini:', error.message);
      return false;
    }
  }

  isComplexQuestion(userMessage) {
    const lowerMessage = userMessage.toLowerCase().trim();
    
    const complexKeywords = [
      'conseil', 'conseils', 'comment', 'pourquoi', 'quand', 'où',
      'meilleure période', 'meilleur', 'protection naturelle', 'adaptées',
      'engrais naturel', 'budget', 'lancer', 'démarrer', 'commencer',
      'cultiver', 'planter', 'semer', 'récolter', 'insectes', 'ravageurs',
      'techniques', 'irrigation', 'sécheresse', 'rotation', 'compost',
      'bio', 'écologique', 'durable', 'naturel', 'biologique',
      'quels légumes', 'quelle période', 'comment protéger', 'quelles cultures',
      'quels engrais', 'comment me lancer', 'avec ce budget', 'avec quel budget',
      'que planter', 'quoi planter', 'quand planter',
      'ph', 'nutriments', 'sols', 'drainage', 'semis', 'récolte',
      'pesticides', 'biopesticides', 'permaculture',
      'sénégal', 'dakar', 'afrique', 'tropical', 'humide', 'sec',
      'saison', 'pluie', 'sécheresse', 'climat', 'température'
    ];

    const hasQuestionMark = lowerMessage.includes('?');
    const isLongQuestion = lowerMessage.length > 50;
    const hasComplexKeywords = complexKeywords.some(keyword => lowerMessage.includes(keyword));
    
    const isComplex = hasComplexKeywords || hasQuestionMark || isLongQuestion;
    
    if (this.debugMode) {
      console.log('🔍 Détection question complexe:', {
        message: userMessage.substring(0, 50) + '...',
        hasKeywords: hasComplexKeywords,
        hasQuestionMark,
        isLong: isLongQuestion,
        result: isComplex
      });
    }
    
    return isComplex;
  }

  async generateResponse(userMessage) {
    const lowerMessage = userMessage.toLowerCase().trim();
    
    if (this.debugMode && !this.hasPerformedDiagnostics) {
      await this.performDiagnostics();
      this.hasPerformedDiagnostics = true;
    }
    
    if (this.debugMode) {
      console.log('💬 Génération réponse pour:', userMessage.substring(0, 50) + '...');
    }
    
    // Vérifier d'abord les réponses prédéfinies
    if (!this.isComplexQuestion(userMessage)) {
      const predefinedResponse = this.getPredefinedResponse(lowerMessage);
      if (this.debugMode) {
        console.log('📝 Réponse prédéfinie utilisée');
      }
      return predefinedResponse;
    }

    // Essayer l'IA pour les questions complexes
    try {
      if (this.debugMode) {
        console.log('🤖 Tentative d\'appel IA...');
      }
      
      const aiResponse = await this.callAI(userMessage);
      if (aiResponse && aiResponse.trim()) {
        if (this.debugMode) {
          console.log('✅ Réponse IA reçue:', aiResponse.substring(0, 100) + '...');
        }
        return aiResponse;
      }
    } catch (error) {
      console.warn('⚠️ Erreur API IA, utilisation du fallback:', error);
      if (this.debugMode) {
        console.log('📋 Détails erreur:', error);
      }
    }

    // Fallback vers réponses agricoles détaillées
    if (this.debugMode) {
      console.log('🔄 Utilisation du fallback agricole');
    }
    return this.getAgriculturalResponse(userMessage);
  }

  async callAI(userMessage) {
    // Priorité 1: Google Gemini 1.5 Flash (GRATUIT et rapide)
    if (this.geminiApiKey) {
      if (this.debugMode) console.log('🔄 Tentative Google Gemini 1.5...');
      try {
        return await this.callGemini(userMessage);
      } catch (error) {
        console.warn('⚠️ Gemini échoué:', error.message);
      }
    }
    
    // Priorité 2: OpenAI (si disponible)
    if (this.openaiApiKey) {
      if (this.debugMode) console.log('🔄 Tentative OpenAI...');
      return await this.callOpenAI(userMessage);
    }

    throw new Error('Aucune clé API configurée');
  }

  /**
   * ✅ Appel API Google Gemini 1.5 Flash (CORRIGÉ)
   */
  async callGemini(userMessage) {
    const systemPrompt = `Tu es un expert agricole spécialisé dans l'agriculture en Afrique de l'Ouest, particulièrement au Sénégal.

🌍 EXPERTISE :
- Agriculture tropicale et climat sénégalais (saison des pluies juin-octobre)
- Cultures adaptées à Dakar et régions côtières
- Agriculture urbaine et culture en pots/balcons
- Techniques biologiques et durables
- Gestion de l'eau et irrigation économique
- Protection naturelle contre les ravageurs
- Solutions adaptées aux petits budgets (50 000 - 200 000 FCFA)

📋 INSTRUCTIONS :
1. Réponds en français simple et pratique
2. Donne des conseils SPÉCIFIQUES au Sénégal et au climat tropical
3. Considère les saisons locales (pluies vs sèche)
4. Suggère des solutions ÉCONOMIQUES avec matériaux locaux
5. Structure ta réponse avec des émojis et des points clés
6. Sois concis mais complet (200-400 mots max)
7. Donne des chiffres précis (prix, quantités, durées)

Question de l'agriculteur sénégalais :`;

    try {
      const response = await fetch(`${this.geminiApiUrl}?key=${this.geminiApiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `${systemPrompt}\n\n${userMessage}`
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 800,
            topP: 0.9,
            topK: 40
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            }
          ]
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Gemini API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      
      // Extraire la réponse de Gemini 1.5
      if (data.candidates && data.candidates.length > 0) {
        const candidate = data.candidates[0];
        if (candidate.content && candidate.content.parts && candidate.content.parts.length > 0) {
          const generatedText = candidate.content.parts[0].text;
          
          if (generatedText && generatedText.trim().length > 20) {
            return generatedText.trim();
          }
        }
      }
      
      throw new Error('Réponse vide ou invalide de Gemini');
      
    } catch (error) {
      if (this.debugMode) {
        console.error('❌ Erreur détaillée Gemini:', error);
      }
      throw error;
    }
  }

  async callOpenAI(userMessage) {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `Tu es un expert agricole spécialisé dans l'agriculture au Sénégal. Réponds en français de manière concise et pratique avec des conseils adaptés au climat tropical.`
          },
          {
            role: 'user',
            content: userMessage
          }
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || '';
  }

  getPredefinedResponse(message) {
    const responses = {
      "produits": "Nous proposons une large gamme de produits agricoles de qualité : légumes frais, fruits saisonniers, céréales, et produits transformés. Tous nos produits sont cultivés avec des méthodes durables et respectueuses de l'environnement.",
      "légumes": "Nos légumes sont cultivés sans pesticides et sont disponibles selon les saisons. Nous avons des tomates, oignons, carottes, salades, aubergines, et bien d'autres.",
      "fruits": "Nos fruits sont cueillis à maturité et incluent des mangues, bananes, oranges, et autres fruits tropicaux selon la saison.",
      "formation": "Nous proposons plusieurs formations : techniques agricoles durables, culture biologique, gestion d'exploitation, commercialisation, et nouvelles technologies agricoles.",
      "cours": "Nos cours sont animés par des experts locaux et couvrent : l'agriculture biologique, la gestion de l'eau, la santé des sols, et l'utilisation d'équipements modernes.",
      "certificat": "À la fin de nos formations, vous recevrez un certificat reconnu qui vous aidera dans votre carrière agricole.",
      "service": "Nos services incluent : conseil agricole, assistance technique, suivi des cultures, aide à la commercialisation, et formation continue.",
      "conseil": "Nos experts vous accompagnent dans : le choix des cultures adaptées à votre région, les techniques d'irrigation, la gestion des ravageurs de manière écologique.",
      "prix": "Nos prix sont compétitifs et varient selon les produits et les quantités. Contactez-nous pour obtenir un devis personnalisé.",
      "commande": "Vous pouvez passer commande directement sur notre site ou nous contacter par téléphone au 77 343 24 85.",
      "livraison": "Nous livrons dans tout Dakar et ses environs. Les frais de livraison dépendent de la distance et du volume de commande.",
      "délai": "Les délais de livraison sont généralement de 24-48h pour les produits frais, et 3-5 jours pour les autres produits.",
      "contact": "Vous pouvez nous contacter au 77 343 24 85, par email à agriteranga@gmail.com, ou nous rendre visite à Dakar, Sénégal.",
      "adresse": "Nous sommes basés à Dakar, Sénégal. Notre adresse exacte sera communiquée lors de votre prise de contact.",
      "entreprise": "AgriTeranga est une entreprise spécialisée dans l'agriculture durable et la commercialisation de produits agricoles de qualité au Sénégal.",
      "mission": "Notre mission est de promouvoir une agriculture respectueuse de l'environnement tout en soutenant les producteurs locaux.",
      "équipe": "Notre équipe est composée d'experts agricoles, d'ingénieurs et de techniciens passionnés par l'agriculture durable.",
    };

    for (const [keyword, response] of Object.entries(responses)) {
      if (message.includes(keyword)) {
        return response;
      }
    }

    return "Je vous invite à poser votre question de manière plus spécifique, ou à nous contacter directement pour une assistance personnalisée.";
  }

  getAgriculturalResponse(userMessage) {
    const message = userMessage.toLowerCase();
    
    const agriculturalResponses = {
      "compost": "🌱 **Comment faire un compost maison au Sénégal** :\n\n**Matériaux nécessaires** :\n• Un bac/bidons percés ou zone délimitée (1m x 1m)\n• Coût : 0-5 000 FCFA\n\n**Ingrédients** :\n✅ Matières vertes (azote) :\n• Épluchures de légumes/fruits\n• Restes de cuisine\n• Herbes fraîches coupées\n• Fumier d'animaux\n\n✅ Matières brunes (carbone) :\n• Feuilles sèches\n• Paille de mil/maïs\n• Sciure de bois\n• Cartons déchirés\n\n**Méthode** :\n1️⃣ Alterner couches vertes (10cm) et brunes (10cm)\n2️⃣ Arroser légèrement chaque couche\n3️⃣ Retourner toutes les 2 semaines\n4️⃣ Garder humide (comme éponge essorée)\n\n**Durée** : 2-3 mois au climat chaud sénégalais\n\n**Signes de prêt** :\n• Couleur terre foncée\n• Odeur de forêt\n• Texture friable\n\n**Utilisation** : Mélanger 30% compost + 70% terre",

      "légumes faciles": "🌿 **Légumes ULTRA-FACILES pour débutants à Dakar** :\n\n**Top 5 recommandés** :\n\n1️⃣ **TOMATES CERISES** 🍅\n• Durée : 60-80 jours\n• Budget : 200 FCFA/plant\n• Arrosage : Quotidien\n• Astuce : Tuteurs en bambou local\n\n2️⃣ **SALADE/LAITUE** 🥬\n• Durée : 30-45 jours (ULTRA-RAPIDE)\n• Budget : 500 FCFA semences\n• Arrosage : Matin + soir\n• Astuce : Ombre légère midi\n\n3️⃣ **PIMENTS** 🌶️\n• Durée : 90 jours\n• Budget : 150 FCFA/plant\n• Arrosage : 3x/semaine\n• Astuce : Très résistant chaleur\n\n4️⃣ **OIGNONS VERTS** 🧅\n• Durée : 60 jours\n• Budget : 1 000 FCFA semences\n• Arrosage : Quotidien léger\n• Astuce : Culture en pot facile\n\n5️⃣ **BASILIC & PERSIL** 🌿\n• Durée : 40 jours\n• Budget : 500 FCFA semences\n• Arrosage : Quotidien\n• Astuce : Récolte continue\n\n**Budget total démarrage** : 5 000 - 10 000 FCFA",

      "tomate": "🍅 **Guide complet TOMATES au Sénégal** :\n\n**PÉRIODE DE PLANTATION** :\n• Saison pluies : Mai-Juin (IDÉAL)\n• Saison sèche : Possible avec irrigation\n• Récolte : 60-90 jours après\n\n**PRÉPARATION SOL** :\n• Mélange : 60% terre + 30% compost + 10% sable\n• Profondeur trou : 30-40cm\n• Espacement : 50cm entre plants\n\n**VARIÉTÉS ADAPTÉES DAKAR** :\n• Roma (tomates allongées, résistantes)\n• Cherry/Cerises (très productives)\n• Marmande (grosses, savoureuses)\n\n**SOINS QUOTIDIENS** :\n💧 Arrosage : Matin (7h) ou soir (18h)\n• 2-3 litres/plant/jour\n• Éviter mouiller feuilles\n\n🎋 Tuteurage : Bambou/bois 1,5m\n• Attacher avec ficelle douce\n• Tous les 20cm hauteur\n\n✂️ Taille :\n• Enlever gourmands (pousses latérales)\n• Garder 2 tiges principales\n\n🌱 Engrais :\n• Compost au pied chaque 2 semaines\n• Ou NPK 15-15-15 (1 poignée/mois)\n\n**PROTECTION NATURELLE** :\n• Basilic entre les plants\n• Décoction ail contre pucerons\n• Paillage paille mil",

      "période planter": "📅 **CALENDRIER AGRICOLE SÉNÉGAL 2024-2025** :\n\n**SAISON DES PLUIES** (Juin-Octobre) ⛈️ :\n✅ JUIN :\n• Maïs, mil, sorgho\n• Tomates, aubergines\n• Gombo, oseille\n\n✅ JUILLET-AOÛT :\n• Niébé (haricot local)\n• Légumes feuilles\n• Pastèques, melons\n\n✅ SEPTEMBRE :\n• Manioc\n• Patates douces\n• Arachides\n\n**SAISON SÈCHE** (Novembre-Mai) ☀️ :\n✅ NOVEMBRE-DÉCEMBRE :\n• Oignons, ail\n• Carottes, navets\n• Salades avec irrigation\n\n✅ JANVIER-FÉVRIER :\n• Choux, choux-fleurs\n• Pommes de terre\n• Haricots verts\n\n✅ MARS-AVRIL :\n• Tomates (avec eau)\n• Piments\n• Basilic, menthe\n\n**CULTURES TOUTE L'ANNÉE** (avec irrigation) 💧 :\n• Salades : 30 jours\n• Épinards locaux\n• Herbes aromatiques\n• Culture en pots\n\n**CONSEIL PRO** : Commencez MAINTENANT avec cultures rapides (salades) pendant que vous préparez saison principale !",

      "protéger plantes": "🛡️ **PROTECTION NATURELLE - Solutions locales Sénégal** :\n\n**CONTRE PUCERONS** (Fréquents saison pluies) :\n🧼 **Savon noir** :\n• 1 cuillère à soupe savon liquide\n• 1 litre d'eau\n• Pulvériser matin ET soir\n• Coût : 500 FCFA/mois\n\n🌶️ **Piment fort** :\n• Mixer 5 piments + 1L eau\n• Filtrer et pulvériser\n• Très efficace !\n\n**CONTRE CHENILLES & VERS** :\n🌿 **Neem (disponible Dakar)** :\n• 100g feuilles neem fraîches\n• Bouillir 30min dans 1L eau\n• Laisser refroidir, filtrer\n• Pulvériser 2x/semaine\n• Prix : 200 FCFA feuilles marché\n\n🧄 **Ail + piment** :\n• 5 gousses ail + 3 piments\n• Mixer avec eau\n• Repousse tous insectes\n\n**CONTRE MALADIES FONGIQUES** (moisissures) :\n🥛 **Lait dilué** :\n• 100ml lait + 900ml eau\n• Pulvériser feuilles\n• Anti-mildiou naturel\n\n💊 **Bicarbonate de soude** :\n• 1 cuillère café bicarbonate\n• 1L eau + 1 cuillère huile\n• Contre oïdium (poudre blanche)\n\n**PRÉVENTION (Le + Important !)** :\n✅ Espacement correct plants (circulation air)\n✅ Arrosage pied (pas feuilles)\n✅ Rotation cultures\n✅ Paillage (feuilles sèches)\n✅ Compagnonnage : basilic + tomates\n\n**BUDGET TOTAL** : 2 000 - 3 000 FCFA/mois pour 20 plants",

      "engrais naturel": "🌱 **ENGRAIS NATURELS ÉCONOMIQUES - Dakar** :\n\n**1. COMPOST MAISON** (LE MEILLEUR) :\n• Gratuit avec déchets cuisine\n• Prêt en 2 mois\n• Utilisation : 1 poignée/plant/2 semaines\n\n**2. CENDRES DE BOIS** 🔥 :\n• Source : Charbon, bois de cuisine\n• Riche en potassium (K)\n• Dose : 1 tasse/m² tous les 2 mois\n• ⚠️ Pas sur sols déjà alcalins\n• **GRATUIT** - récupération cuisines\n\n**3. COQUILLES D'ŒUFS** 🥚 :\n• Broyer finement\n• Calcium pour tomates, piments\n• Mélanger au sol plantation\n• **GRATUIT**\n\n**4. FUMIER ANIMAL** 🐄 :\n• Mouton, chèvre, poule : EXCELLENT\n• Composter 1 mois avant usage\n• Prix : 500-1 000 FCFA/sac 50kg\n• Où : Fermes périphérie Dakar\n\n**5. URINE HUMAINE DILUÉE** 💧 :\n• Dilution : 1 tasse urine + 10 tasses eau\n• Riche en azote (N)\n• Arroser au pied (PAS feuilles)\n• **GRATUIT** et très efficace\n\n**6. EAU DE CUISSON** :\n• Eau légumes/riz refroidie\n• Riche en minéraux\n• **GRATUIT**\n\n**7. MARC DE CAFÉ** ☕ :\n• Saupoudrer autour plants\n• Azote + repousse fourmis\n• Collecte : Cafés/restaurants\n• **GRATUIT**\n\n**8. THÉ DE COMPOST** 🍵 :\n• 1 poignée compost dans seau eau\n• Laisser 24-48h\n• Filtrer et arroser\n• Super booster croissance\n\n**PROGRAMME FERTILISATION TYPE** :\n📅 Semaine 1-2 : Compost au trou\n📅 Semaine 3-4 : Thé compost\n📅 Semaine 5-6 : Urine diluée\n📅 Semaine 7-8 : Cendres + coquilles\n\n**BUDGET MENSUEL** : 0-2 000 FCFA (quasi gratuit !)",

      "budget": "💰 **DÉMARRER AGRICULTURE avec 50 000 FCFA** :\n\n**OPTION 1 : Culture Balcon/Terrasse** 🏠\n\n📦 **Conteneurs** (8 000 F) :\n• 10 bidons/seaux percés : 4 000 F\n• 5 grands pots plastique : 4 000 F\n\n🌱 **Plants & Semences** (12 000 F) :\n• 15 plants tomates cerises : 3 000 F\n• Semences salades : 1 000 F\n• Semences piments : 1 000 F\n• Oignons verts : 1 000 F\n• Herbes (basilic, persil) : 1 000 F\n• Plants aubergines : 2 000 F\n• Semences gombo : 1 000 F\n• Moringa : 2 000 F\n\n🌍 **Terreau** (10 000 F) :\n• 4 sacs terre enrichie : 8 000 F\n• 1 sac compost : 2 000 F\n\n🔧 **Outils** (10 000 F) :\n• Arrosoir 10L : 3 000 F\n• Petite binette : 2 000 F\n• Sécateur : 2 000 F\n• Gants : 1 000 F\n• Ficelle/tuteurs : 2 000 F\n\n💧 **Irrigation** (5 000 F) :\n• Tuyau 10m : 3 000 F\n• Bouteilles goutte-à-goutte : Récup\n• Bassine stockage : 2 000 F\n\n🛡️ **Protection** (2 000 F) :\n• Savon noir : 500 F\n• Bicarbonate : 300 F\n• Neem séché : 500 F\n• Piments : 200 F\n• Réserve : 500 F\n\n📊 **Total : 47 000 F** (Réserve 3 000 F)\n\n**RENTABILITÉ ESTIMÉE** :\n• Première récolte : 2-3 mois\n• Production mois : 30-50 kg légumes\n• Valeur marché : 15 000-25 000 F/mois\n• Retour investissement : 3-4 mois\n\n**OPTION 2 : Petit Jardin Sol (10m²)** 🌾\n\n🌱 **Semences/Plants** (15 000 F) :\n• Tomates : 5 000 F\n• Légumes feuilles : 3 000 F\n• Piments/Aubergines : 4 000 F\n• Maïs/Niébé : 3 000 F\n\n🌍 **Amendements** (12 000 F) :\n• Compost 100kg : 5 000 F\n• Fumier 50kg : 3 000 F\n• Cendres : Gratuit\n• NPK 1 sac : 4 000 F\n\n🔧 **Outils** (15 000 F) :\n• Arrosoir 20L : 4 000 F\n• Binette solide : 4 000 F\n• Râteau : 3 000 F\n• Sécateur : 2 000 F\n• Divers : 2 000 F\n\n💧 **Irrigation** (5 000 F) :\n• Tuyau 20m : 4 000 F\n• Raccords : 1 000 F\n\n🌿 **Tuteurs/Support** (2 000 F) :\n• Bambous : 1 500 F\n• Ficelle : 500 F\n\n🛡️ **Protection** (1 000 F) :\n• Produits naturels\n\n**Total : 50 000 F exactement**\n\n**RENTABILITÉ** :\n• Production : 80-120 kg/mois\n• Valeur : 30 000-50 000 F/mois\n• Retour investissement : 2 mois\n\n**MES CONSEILS PRO** 💡 :\n1️⃣ Commencez PETIT (5-10 plants)\n2️⃣ Réinvestissez bénéfices\n3️⃣ Priorité : tomates + salades (vente facile)\n4️⃣ Gardez 10% budget urgences\n5️⃣ Notez dépenses/revenus",

      "irrigation": "💧 **IRRIGATION ÉCONOMIQUE - Climat Dakar** :\n\n**QUAND ARROSER ?** ⏰\n✅ **Matin** : 6h-8h (IDÉAL)\n• Terre fraîche absorbe mieux\n• Évaporation minimale\n• Plants ont eau toute journée\n\n✅ **Soir** : 18h-20h (Alternative)\n• Après chaleur\n• Bonne absorption\n⚠️ Risque moisissures si trop tard\n\n❌ **JAMAIS** : 11h-16h\n• 70% évaporation immédiate\n• Brûlure feuilles effet loupe\n• Stress thermique plants\n\n**QUANTITÉS PAR PLANT** 💦 :\n\n🌱 **Jeunes plants** (0-30 jours) :\n• 0,5-1L / jour\n• 2 fois par jour saison sèche\n\n🌿 **Plants établis** (30+ jours) :\n• Tomates : 2-3L / jour\n• Salades : 1-1,5L / jour\n• Piments : 1,5-2L / jour\n• Arbres fruitiers : 10-20L / jour\n\n**TECHNIQUES ÉCONOMIE D'EAU** 🎯 :\n\n1️⃣ **PAILLAGE** (Économie 50%) :\n• Feuilles sèches 10cm épaisseur\n• Paille mil/sorgho\n• Copeaux bois\n• Cartons\n• **Coût : GRATUIT**\n• Où : Récup marchés, champs\n\n2️⃣ **GOUTTE-À-GOUTTE DIY** 💧 :\n**Méthode bouteille** :\n• Bouteille plastique 1,5L\n• Percer 3-4 trous fond (clou chauffé)\n• Enterrer 1/3 près plant\n• Remplir matin + soir\n• **Économie : 70% eau**\n• **Coût : GRATUIT (récup)**\n\n**Méthode tuyau percé** :\n• Vieux tuyau jardin\n• Percer tous les 30cm (aiguille chauffée)\n• Fermer bout avec bouchon\n• Connecter robinet/bidon\n• **Coût : 3 000-5 000 F**\n\n3️⃣ **RÉCUPÉRATION EAU PLUIE** 🌧️ :\n• Bidons sous gouttières\n• 1 toit 50m² = 50 000L / saison\n• Bidons 200L : 2 000 F/unité\n• Investissement : 10 000 F\n• Gratuit toute saison pluies !\n\n4️⃣ **OMBRIÈRE NATURELLE** ☀️ :\n• Branches palmier\n• Nattes paille mil\n• Réduit évaporation 30%\n• Protection chaleur midi\n• **Coût : 1 000-3 000 F**\n\n5️⃣ **BASSINES ENTERRÉES** :\n• Enterrer pot/bassine près plants\n• Remplir eau\n• Diffusion lente racines\n• Économie 40%\n\n6️⃣ **OLLAS TRADITIONNELS** (Poteries poreuses) :\n• Pot terre cuite non verni\n• Enterrer col dépassant\n• Remplir eau\n• Diffusion automatique\n• **Prix Dakar : 2 000-5 000 F**\n\n**CALENDRIER ARROSAGE** 📅 :\n\n**Saison pluies** (Juin-Oct) :\n• Réduire ou arrêter si pluie\n• Surveiller drainage\n• Arroser si 3 jours sans pluie\n\n**Saison sèche** (Nov-Mai) :\n• Quotidien matin OU soir\n• Doubler jeunes plants\n• Augmenter 20% en Harmattan\n\n**TEST BESOIN EAU** 👆 :\n• Enfoncer doigt 5cm terre\n• Sec = arroser\n• Humide = attendre\n• Feuilles tombantes = URGENT\n\n**ERREURS À ÉVITER** ❌ :\n• Arroser feuilles/fleurs\n• Trop d'eau (racines pourrissent)\n• Eau froide sur plants chauds\n• Arrosage irrégulier (stress)\n\n**BUDGET SYSTÈME COMPLET** 💰 :\n• Paillage : 0 F (récup)\n• Goutte-à-goutte DIY : 0 F\n• 4 bidons 200L : 8 000 F\n• Tuyaux : 5 000 F\n• Ombrière : 2 000 F\n• **TOTAL : 15 000 F**\n• Économie eau : 60-70%\n• Amortissement : 6 mois",

      "culture domicile": "🏠 **AGRICULTURE URBAINE - Balcon/Terrasse Dakar** :\n\n**ÉVALUATION ESPACE** 📏 :\n\n✅ **Balcon 4m²** (Petit) :\n• 10-15 pots moyens\n• Production : 15-25 kg/mois\n• Cultures : Salades, herbes, tomates cerises\n\n✅ **Balcon 8m²** (Moyen) :\n• 20-30 pots\n• Production : 35-50 kg/mois\n• Cultures : Légumes variés + 1 arbre nain\n\n✅ **Terrasse 15m²+** (Grand) :\n• 40-60 pots ou bacs\n• Production : 80-120 kg/mois\n• Cultures : Presque tout !\n\n**CRITÈRES EMPLACEMENT** ☀️ :\n\n🌞 **Ensoleillement** (CRITIQUE) :\n• Minimum : 6h soleil direct/jour\n• Idéal : 8h\n• Orientation : Est ou Sud-Est\n• Test : Observer 7h-18h\n\n💨 **Vent** :\n• Dakar très venteux !\n• Protection : Parois, plexiglas\n• Lester pots (pierres fond)\n• Tuteurage solide obligatoire\n\n💧 **Accès eau** :\n• À moins 10m robinet\n• Ou bidon réserve 100-200L\n• Drainage vers évacuation\n\n🏗️ **Solidité structure** :\n• Vérifier capacité charge balcon\n• 1 pot 20L = 25-30 kg rempli\n• Répartir poids uniformément\n\n**CONTENEURS ADAPTÉS** 🪴 :\n\n**Type 1 : Pots classiques** :\n• 20L : Salades, herbes (1 500 F)\n• 40L : Tomates, aubergines (3 000 F)\n• 60L : Piments, arbres nains (5 000 F)\n• ⚠️ TROUS DRAINAGE obligatoires\n\n**Type 2 : Bidons recyclés** :\n• Huile 20L : GRATUIT, découper haut\n• Peinture blanche : 500 F (réfléchit chaleur)\n• Percer 5-6 trous fond\n\n**Type 3 : Sacs culture** :\n• Sacs géotextile 40-60L : 1 000 F\n• Drainage parfait\n• Légers\n• Durée : 3-5 ans\n\n**Type 4 : Bacs bois** :\n• Fabriquer palette récup\n• 1m x 0,5m x 0,4m\n• Bâche plastique intérieur\n• **Coût : 5 000-10 000 F**\n\n**TERREAU PARFAIT** 🌍 :\n\n**Recette universelle** :\n• 50% terre végétale\n• 30% compost mûr\n• 15% sable rivière (drainage)\n• 5% perlite ou vermiculite (optionnel)\n\n**Coût** :\n• Terre 1 sac 20kg : 1 500 F\n• Compost 1 sac : 2 000 F\n• Sable : 500 F/sac\n• **Total pot 40L : 3 000 F terreau**\n\n**Alternative économique** :\n• 60% terre récupérée (jardins, chantiers)\n• 40% compost maison\n• **Coût : 500 F/pot**\n\n**CULTURES RECOMMANDÉES BALCON** 🌱 :\n\n**Niveau 1 : TRÈS FACILE** ⭐ :\n✅ Salades (30 jours, pot 15L)\n✅ Herbes : basilic, persil, menthe (pot 10L)\n✅ Oignons verts (pot 15L)\n✅ Radis (25 jours, pot 15L)\n\n**Niveau 2 : FACILE** ⭐⭐ :\n✅ Tomates cerises (pot 40L mini)\n✅ Piments (pot 30L)\n✅ Épinards locaux (pot 20L)\n✅ Haricots nains (pot 25L)\n\n**Niveau 3 : MOYEN** ⭐⭐⭐ :\n✅ Aubergines (pot 50L)\n✅ Courgettes (pot 60L, espace)\n✅ Fraisiers (pot 20L, ombre légère)\n✅ Moringa (pot 80L, arbre miracle)\n\n**ARROSAGE BALCON** 💦 :\n\n**Particularité** :\n• Pots sèchent 2-3x plus vite\n• Vent accélère évaporation\n• Béton/carrelage réfléchit chaleur\n\n**Fréquence saison sèche** :\n• Petits pots (15-20L) : 2x/jour\n• Moyens pots (30-40L) : 1x/jour\n• Grands pots (60L+) : 1x/jour ou 2 jours\n\n**Système automatique DIY** :\n• Bidon 100L sur support haut\n• Tuyau goutte-à-goutte\n• Minuteur robinet : 15 000 F\n• Autonomie 3-5 jours\n\n**ENTRETIEN MENSUEL** 📅 :\n\n✅ **Semaine 1** :\n• Apport compost surface\n• Vérification tuteurs\n• Binage léger\n\n✅ **Semaine 2** :\n• Pulvérisation préventive (neem)\n• Taille feuilles mortes\n• Contrôle parasites\n\n✅ **Semaine 3** :\n• Engrais liquide (thé compost)\n• Nettoyage feuilles poussière\n• Rotation pots (ensoleillement)\n\n✅ **Semaine 4** :\n• Bilan récoltes\n• Planification replantations\n• Renouvellement paillage\n\n**ROTATION CULTURES** 🔄 :\n\n**Cycle 1** (Jan-Mar) :\n→ Tomates, salades, herbes\n\n**Cycle 2** (Avr-Juin) :\n→ Aubergines, piments, haricots\n\n**Cycle 3** (Juil-Sept) :\n→ Légumes feuilles, gombo\n\n**Cycle 4** (Oct-Déc) :\n→ Oignons, carottes, choux\n\n**BUDGET DÉMARRAGE BALCON 8m²** 💰 :\n\n• 20 pots (20-40L) : 30 000 F\n• Terreau (800L total) : 25 000 F\n• Plants/semences : 15 000 F\n• Système irrigation : 10 000 F\n• Outils mini : 5 000 F\n• Engrais/protection : 3 000 F\n• Tuteurs : 2 000 F\n\n**TOTAL : 90 000 F**\n\n**RENTABILITÉ** 📊 :\n• Production : 35-50 kg/mois\n• Valeur marché : 20 000-30 000 F\n• Économie courses : 25 000 F/mois\n• Retour investissement : 3-4 mois\n• Bonus : Légumes BIO + Air purifié + Fraîcheur balcon\n\n**RÉUSSITES GARANTIES** 🏆 :\n1️⃣ Tomates cerises en pot 40L\n2️⃣ Basilic perpétuel (récolte continue)\n3️⃣ Piments (1 plant = 50+ piments)\n4️⃣ Salades succession (récolte 15 jours)\n5️⃣ Moringa (super-aliment local)"
    };

    for (const [keyword, response] of Object.entries(agriculturalResponses)) {
      if (message.includes(keyword)) {
        return response;
      }
    }

    const fallbackResponses = [
      `🌾 **Question agricole intéressante !**\n\nPour une réponse détaillée et personnalisée à votre situation (type de sol, espace disponible, budget, objectifs), nos experts locaux sont à votre écoute.\n\n📞 **Appelez-nous** : 77 343 24 85\n📧 **Email** : agriteranga@gmail.com\n🏢 **Visite** : Bureau Dakar (sur RDV)\n\n💡 Nous analysons votre contexte et proposons un plan d'action sur mesure !\n\n**Services gratuits** :\n✅ Première consultation téléphonique\n✅ Diagnostic rapide votre projet\n✅ Orientation vers formation adaptée`,
      
      `🌱 **Excellente question pour l'agriculture au Sénégal !**\n\nChaque situation est unique (climat de votre zone, type de sol, ressources disponibles). Notre équipe d'agronomes sénégalais vous guidera efficacement.\n\n**Contactez AgriTeranga** :\n📱 **WhatsApp** : 77 343 24 85\n📧 **Email** : agriteranga@gmail.com\n🌐 **Site web** : www.agriteranga.sn\n\n**On vous aide avec** :\n✅ Choix cultures adaptées\n✅ Techniques locales éprouvées\n✅ Budget réaliste\n✅ Suivi personnalisé\n\n💬 Réponse sous 24h garantie !`,
      
      `💡 **Question pertinente pour votre projet agricole !**\n\nPour des conseils basés sur l'expérience terrain sénégalaise et adaptés à VOTRE situation précise, nos conseillers sont disponibles.\n\n🌟 **AgriTeranga - Votre partenaire agricole**\n\n📞 **Tél** : 77 343 24 85 (7j/7, 8h-20h)\n📧 **Email** : agriteranga@gmail.com\n📍 **Adresse** : Dakar, Sénégal\n\n**Pourquoi nous contacter ?**\n✅ Expertise locale + internationale\n✅ Solutions testées terrain\n✅ Accompagnement de A à Z\n✅ Formations pratiques\n✅ Réseau producteurs\n\n🚀 Lancez-vous avec les bons conseils !`
    ];

    return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
  }

  testAISystem() {
    return this.performDiagnostics();
  }
}

export default new AIServiceImproved();