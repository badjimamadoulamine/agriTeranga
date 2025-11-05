/**
 * Script de test pour le service IA
 * Permet de tester les fonctionnalités sans interface web
 * NOTE: Ce script doit être exécuté avec Node.js en ES module
 */

import aiService from './aiService.js'

// Test des fonctionnalités de base
async function testAIService() {
  console.log('🧪 Test du Service IA AgriTeranga\n')
  
  // Test 1 : Détection de questions complexes
  console.log('1️⃣ Test de détection des questions complexes:')
  const testQuestions = [
    "Quels produits vendez-vous ?",
    "Comment faire un compost maison ?",
    "Quels sont vos prix ?",
    "Avec 100 000 FCFA, comment me lancer dans l'agriculture ?",
    "Contact",
    "Comment protéger mes tomates des pucerons naturellement ?"
  ]
  
  for (const question of testQuestions) {
    const isComplex = aiService.isComplexQuestion(question)
    console.log(`   "${question}" → ${isComplex ? '🤖 IA' : '📝 Prédéfinie'}`)
  }
  
  console.log('\n2️⃣ Test des réponses:')
  
  // Test 2 : Réponses prédéfinies simples
  console.log('\n--- Questions Simples (Réponses prédéfinies) ---')
  const simpleQuestions = [
    "Quels produits proposez-vous ?",
    "Comment vous contacter ?",
    "Avez-vous des formations ?"
  ]
  
  for (const question of simpleQuestions) {
    try {
      const response = await aiService.generateResponse(question)
      console.log(`\n❓ ${question}`)
      console.log(`✅ ${response.substring(0, 100)}...`)
    } catch (error) {
      console.log(`❌ Erreur: ${error.message}`)
    }
  }
  
  // Test 3 : Questions complexes agricoles
  console.log('\n--- Questions Complexes (IA ou base de connaissances) ---')
  const complexQuestions = [
    "Quels légumes sont faciles à cultiver à domicile ?",
    "Comment protéger mes plantes des insectes naturellement ?",
    "Avec un budget de 50 000 FCFA, comment me lancer dans l'agriculture ?"
  ]
  
  for (const question of complexQuestions) {
    try {
      const response = await aiService.generateResponse(question)
      console.log(`\n🤖 ${question}`)
      console.log(`💡 ${response.substring(0, 150)}...`)
    } catch (error) {
      console.log(`❌ Erreur: ${error.message}`)
    }
  }
  
  console.log('\n✅ Test terminé !')
  
  // Instructions pour configuration
  console.log('\n📋 Configuration nécessaire:')
  console.log('1. Pour API gratuite: Créer un compte sur https://huggingface.co/')
  console.log('2. Générer un token d\'accès')
  console.log('3. Ajouter VITE_HUGGINGFACE_API_KEY dans .env')
  console.log('4. Pour API premium: Créer un compte sur https://platform.openai.com/')
  console.log('5. Générer une clé API')
  console.log('6. Ajouter VITE_OPENAI_API_KEY dans .env')
}

// Fonction de démonstration interactive
async function demoInteractive() {
  console.log('\n🎮 Démonstration Interactive')
  console.log('(Note: Cette fonction nécessite Node.js avec readline)\n')
  
  try {
    const readline = await import('readline');
    const rl = readline.default.createInterface({
      input: process.stdin,
      output: process.stdout
    })
    
    while (true) {
      const question = await new Promise(resolve => {
        rl.question('❓ Posez votre question agricole (ou "quit" pour quitter): ', resolve)
      })
      
      if (question.toLowerCase() === 'quit') {
        console.log('👋 Au revoir !')
        break
      }
      
      try {
        console.log('🤔 Analyse en cours...')
        const response = await aiService.generateResponse(question)
        const isComplex = aiService.isComplexQuestion(question)
        
        console.log(`\n📋 Type: ${isComplex ? '🤖 Réponse IA/Expert' : '📝 Réponse prédéfinie'}`)
        console.log(`💬 Réponse:\n${response}\n`)
        
      } catch (error) {
        console.log(`❌ Erreur: ${error.message}\n`)
      }
    }
    
    rl.close()
  } catch (error) {
    console.log('❌ La démo interactive nécessite Node.js')
    console.log('💡 Utilisez plutôt l\'interface React à http://localhost:5173/experts')
  }
}

// Export pour utilisation dans d'autres fichiers
export { testAIService, demoInteractive }

// Instructions d'utilisation
console.log('📋 Utilisation du script de test:')
console.log('1. Test automatique: node src/services/aiTest.js')
console.log('2. Test avec import: import { testAIService } from \'./src/services/aiTest.js\'')
console.log('3. Lancement React: npm start\n')