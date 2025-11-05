const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

// Configuration
const API_BASE_URL = 'http://localhost:5000/api/v1';
const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4ZmY4MWVlZDA1NzVmZjRhOWIxODIyZCIsImlhdCI6MTc2MTU3NTY1MCwiZXhwIjoxNzYyMTgwNDUwfQ.ZugCyQhbNAoPcxLeaTRiQOc7FKxCjDlEXYZ4g8_fekU';

async function testProductCreation() {
  try {
    console.log('🧪 Test de création de produit avec upload d\'image...');

    // Créer un objet FormData
    const formData = new FormData();
    
    // Ajouter les champs texte
    formData.append('name', 'Mangue Test');
    formData.append('description', 'Une mangue juteuse et sucrée pour tester l\'upload');
    formData.append('price', '1.5');
    formData.append('category', 'fruits');
    formData.append('stock', '100');
    formData.append('unit', 'kg');
    formData.append('isOrganic', 'true');

    // Essayer d'ajouter un fichier image (crée une image de test si elle n'existe pas)
    const testImagePath = path.join(__dirname, 'test-mangue.jpg');
    
    // Créer une image de test simple si elle n'existe pas
    if (!fs.existsSync(testImagePath)) {
      console.log('📸 Création d\'une image de test...');
      // Ici vous pourriez créer une vraie image ou utiliser une image existante
      // Pour ce test, on va juste créer un fichier vide
      fs.writeFileSync(testImagePath, 'fake image data');
    }
    
    formData.append('images', fs.createReadStream(testImagePath));

    // Effectuer la requête
    const response = await axios.post(`${API_BASE_URL}/products`, formData, {
      headers: {
        ...formData.getHeaders(),
        'Authorization': `Bearer ${TOKEN}`
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity
    });

    console.log('✅ Produit créé avec succès!');
    console.log('📦 Réponse:', JSON.stringify(response.data, null, 2));
    
    return response.data;

  } catch (error) {
    console.error('❌ Erreur lors du test:', error.message);
    
    if (error.response) {
      console.error('📊 Code de statut:', error.response.status);
      console.error('📄 Réponse:', JSON.stringify(error.response.data, null, 2));
    }
    
    throw error;
  }
}

// Fonction pour tester l'obtention de la liste des produits
async function testGetProducts() {
  try {
    console.log('🧪 Test de récupération des produits...');

    const response = await axios.get(`${API_BASE_URL}/products`, {
      headers: {
        'Authorization': `Bearer ${TOKEN}`
      }
    });

    console.log('✅ Produits récupérés avec succès!');
    console.log('📊 Nombre de produits:', response.data.results);
    
    return response.data;

  } catch (error) {
    console.error('❌ Erreur lors de la récupération:', error.message);
    throw error;
  }
}

// Exécution des tests
async function runTests() {
  console.log('🚀 Démarrage des tests d\'API produits...\n');
  
  try {
    await testProductCreation();
    console.log('\n' + '='.repeat(50) + '\n');
    await testGetProducts();
    
    console.log('\n🎉 Tous les tests sont passés avec succès!');
  } catch (error) {
    console.log('\n💥 Un ou plusieurs tests ont échoué');
    process.exit(1);
  }
}

// Lancer les tests si le fichier est exécuté directement
if (require.main === module) {
  runTests();
}

module.exports = { testProductCreation, testGetProducts };