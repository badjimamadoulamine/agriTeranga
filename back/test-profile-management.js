/**
 * Script de test pour les fonctionnalités de gestion de profil et mot de passe
 * 
 * Pour exécuter ce test:
 * 1. Démarrez le serveur: npm start
 * 2. Exécutez ce script: node test-profile-management.js
 * 
 * Assurez-vous d'avoir un utilisateur de test dans la base de données
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api/v1';

// Couleurs pour la console
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

// Configuration du test
const TEST_USER = {
  email: 'test@example.com',
  password: 'password123'
};

let token = '';
let userId = '';

// Fonctions utilitaires
const log = {
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
  section: (msg) => console.log(`\n${colors.blue}${'='.repeat(60)}\n${msg}\n${'='.repeat(60)}${colors.reset}\n`)
};

// Tests
async function testLogin() {
  log.section('TEST 1: CONNEXION');
  
  try {
    const response = await axios.post(`${BASE_URL}/auth/login`, TEST_USER);
    
    if (response.data.token) {
      token = response.data.token;
      userId = response.data.data.user._id;
      log.success(`Connexion réussie`);
      log.info(`Token: ${token.substring(0, 20)}...`);
      log.info(`User ID: ${userId}`);
      return true;
    }
  } catch (error) {
    log.error(`Échec de la connexion: ${error.response?.data?.message || error.message}`);
    log.warning('Assurez-vous qu\'un utilisateur test existe avec ces identifiants:');
    log.warning(`Email: ${TEST_USER.email}`);
    log.warning(`Password: ${TEST_USER.password}`);
    return false;
  }
}

async function testGetProfile() {
  log.section('TEST 2: RÉCUPÉRATION DU PROFIL');
  
  try {
    const response = await axios.get(`${BASE_URL}/users/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    const user = response.data.data.user;
    log.success('Profil récupéré avec succès');
    log.info(`Nom: ${user.firstName} ${user.lastName}`);
    log.info(`Email: ${user.email}`);
    log.info(`Rôle: ${user.role}`);
    return true;
  } catch (error) {
    log.error(`Échec: ${error.response?.data?.message || error.message}`);
    return false;
  }
}

async function testUpdateProfile() {
  log.section('TEST 3: MISE À JOUR DU PROFIL');
  
  const updateData = {
    firstName: 'Test Updated',
    lastName: 'User Updated',
    phone: '+221771234567'
  };
  
  try {
    const response = await axios.put(
      `${BASE_URL}/users/profile`,
      updateData,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    const user = response.data.data.user;
    log.success('Profil mis à jour avec succès');
    log.info(`Nouveau nom: ${user.firstName} ${user.lastName}`);
    log.info(`Téléphone: ${user.phone}`);
    return true;
  } catch (error) {
    log.error(`Échec: ${error.response?.data?.message || error.message}`);
    return false;
  }
}

async function testUpdateProfileByRole() {
  log.section('TEST 4: MISE À JOUR DU PROFIL SELON LE RÔLE');
  
  try {
    // Récupérer le rôle actuel
    const profileResponse = await axios.get(`${BASE_URL}/users/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    const role = profileResponse.data.data.user.role;
    log.info(`Rôle détecté: ${role}`);
    
    let updateData = {
      firstName: 'Test Role',
      lastName: 'Specific'
    };
    
    // Ajouter des données spécifiques au rôle
    if (role === 'producteur' || role === 'producer') {
      updateData.producteurInfo = {
        cultureType: 'Maïs, Tomates',
        region: 'Thiès',
        farmSize: '5 hectares',
        description: 'Production biologique'
      };
      log.info('Ajout des informations producteur...');
    } else if (role === 'livreur' || role === 'deliverer') {
      updateData.livreurInfo = {
        deliveryZone: 'Dakar',
        vehicleType: 'Moto',
        isAvailable: true
      };
      log.info('Ajout des informations livreur...');
    }
    
    const response = await axios.put(
      `${BASE_URL}/users/profile`,
      updateData,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    log.success('Profil spécifique au rôle mis à jour');
    
    if (role === 'producteur' || role === 'producer') {
      const info = response.data.data.user.producteurInfo;
      log.info(`Culture: ${info?.cultureType || 'N/A'}`);
      log.info(`Région: ${info?.region || 'N/A'}`);
    } else if (role === 'livreur' || role === 'deliverer') {
      const info = response.data.data.user.livreurInfo;
      log.info(`Zone: ${info?.deliveryZone || 'N/A'}`);
      log.info(`Véhicule: ${info?.vehicleType || 'N/A'}`);
    }
    
    return true;
  } catch (error) {
    log.error(`Échec: ${error.response?.data?.message || error.message}`);
    return false;
  }
}

async function testChangePasswordInvalidCurrent() {
  log.section('TEST 5: CHANGEMENT MOT DE PASSE - ANCIEN INCORRECT');
  
  const passwordData = {
    currentPassword: 'mauvais_mot_de_passe',
    newPassword: 'nouveaumotdepasse123',
    confirmPassword: 'nouveaumotdepasse123'
  };
  
  try {
    await axios.put(
      `${BASE_URL}/users/change-password`,
      passwordData,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    log.error('Le test devrait échouer, mais il a réussi');
    return false;
  } catch (error) {
    if (error.response?.status === 401) {
      log.success('Erreur attendue: Ancien mot de passe incorrect');
      log.info(`Message: ${error.response.data.message}`);
      return true;
    } else {
      log.error(`Erreur inattendue: ${error.response?.data?.message || error.message}`);
      return false;
    }
  }
}

async function testChangePasswordMismatch() {
  log.section('TEST 6: CHANGEMENT MOT DE PASSE - CONFIRMATION INCORRECTE');
  
  const passwordData = {
    currentPassword: TEST_USER.password,
    newPassword: 'nouveaumotdepasse123',
    confirmPassword: 'differente123'
  };
  
  try {
    await axios.put(
      `${BASE_URL}/users/change-password`,
      passwordData,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    log.error('Le test devrait échouer, mais il a réussi');
    return false;
  } catch (error) {
    if (error.response?.status === 400) {
      log.success('Erreur attendue: Les mots de passe ne correspondent pas');
      log.info(`Message: ${error.response.data.message}`);
      return true;
    } else {
      log.error(`Erreur inattendue: ${error.response?.data?.message || error.message}`);
      return false;
    }
  }
}

async function testChangePasswordTooShort() {
  log.section('TEST 7: CHANGEMENT MOT DE PASSE - TROP COURT');
  
  const passwordData = {
    currentPassword: TEST_USER.password,
    newPassword: 'court',
    confirmPassword: 'court'
  };
  
  try {
    await axios.put(
      `${BASE_URL}/users/change-password`,
      passwordData,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    log.error('Le test devrait échouer, mais il a réussi');
    return false;
  } catch (error) {
    if (error.response?.status === 400) {
      log.success('Erreur attendue: Mot de passe trop court');
      log.info(`Message: ${error.response.data.message}`);
      return true;
    } else {
      log.error(`Erreur inattendue: ${error.response?.data?.message || error.message}`);
      return false;
    }
  }
}

async function testUpdatePreferences() {
  log.section('TEST 8: MISE À JOUR DES PRÉFÉRENCES');
  
  const preferences = {
    language: 'fr',
    theme: 'dark',
    notifications: {
      email: true,
      push: false
    }
  };
  
  try {
    const response = await axios.put(
      `${BASE_URL}/users/preferences`,
      preferences,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    log.success('Préférences mises à jour');
    log.info(`Langue: ${response.data.data.preferences.language}`);
    log.info(`Thème: ${response.data.data.preferences.theme}`);
    log.info(`Notifications email: ${response.data.data.preferences.notifications.email}`);
    return true;
  } catch (error) {
    log.error(`Échec: ${error.response?.data?.message || error.message}`);
    return false;
  }
}

async function testProtectedFields() {
  log.section('TEST 9: PROTECTION DES CHAMPS SENSIBLES');
  
  const maliciousData = {
    firstName: 'Test',
    email: 'hacker@example.com', // Ne devrait pas être modifié
    role: 'admin', // Ne devrait pas être modifié
    isActive: false // Ne devrait pas être modifié
  };
  
  try {
    const beforeResponse = await axios.get(`${BASE_URL}/users/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const originalEmail = beforeResponse.data.data.user.email;
    const originalRole = beforeResponse.data.data.user.role;
    
    await axios.put(
      `${BASE_URL}/users/profile`,
      maliciousData,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    const afterResponse = await axios.get(`${BASE_URL}/users/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    const user = afterResponse.data.data.user;
    
    if (user.email === originalEmail && user.role === originalRole) {
      log.success('Champs sensibles protégés avec succès');
      log.info(`Email non modifié: ${user.email}`);
      log.info(`Rôle non modifié: ${user.role}`);
      return true;
    } else {
      log.error('ALERTE SÉCURITÉ: Les champs sensibles ont été modifiés!');
      return false;
    }
  } catch (error) {
    log.error(`Échec: ${error.response?.data?.message || error.message}`);
    return false;
  }
}

// Exécution des tests
async function runAllTests() {
  console.log(`\n${colors.blue}${'='.repeat(60)}`);
  console.log('TESTS DE GESTION DU PROFIL ET MOT DE PASSE');
  console.log(`${'='.repeat(60)}${colors.reset}\n`);
  
  const results = [];
  
  // Test 1: Connexion
  const loginSuccess = await testLogin();
  if (!loginSuccess) {
    log.error('\n❌ Les tests ne peuvent pas continuer sans une connexion réussie');
    log.warning('\nPour créer un utilisateur test, exécutez:');
    console.log(`
curl -X POST http://localhost:5000/api/v1/auth/register \\
  -H "Content-Type: application/json" \\
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "${TEST_USER.email}",
    "password": "${TEST_USER.password}",
    "role": "consommateur"
  }'`);
    return;
  }
  results.push({ name: 'Connexion', success: loginSuccess });
  
  // Attendre un peu entre les tests
  const wait = () => new Promise(resolve => setTimeout(resolve, 500));
  
  // Tests suivants
  await wait();
  results.push({ name: 'Récupération profil', success: await testGetProfile() });
  
  await wait();
  results.push({ name: 'Mise à jour profil', success: await testUpdateProfile() });
  
  await wait();
  results.push({ name: 'Mise à jour profil par rôle', success: await testUpdateProfileByRole() });
  
  await wait();
  results.push({ name: 'MDP - Ancien incorrect', success: await testChangePasswordInvalidCurrent() });
  
  await wait();
  results.push({ name: 'MDP - Confirmation incorrecte', success: await testChangePasswordMismatch() });
  
  await wait();
  results.push({ name: 'MDP - Trop court', success: await testChangePasswordTooShort() });
  
  await wait();
  results.push({ name: 'Préférences', success: await testUpdatePreferences() });
  
  await wait();
  results.push({ name: 'Protection champs sensibles', success: await testProtectedFields() });
  
  // Résumé
  log.section('RÉCAPITULATIF DES TESTS');
  
  const passed = results.filter(r => r.success).length;
  const total = results.length;
  
  results.forEach(result => {
    if (result.success) {
      log.success(`${result.name}`);
    } else {
      log.error(`${result.name}`);
    }
  });
  
  console.log(`\n${colors.blue}${'='.repeat(60)}${colors.reset}`);
  
  if (passed === total) {
    log.success(`\nTous les tests sont passés! (${passed}/${total})`);
  } else {
    log.warning(`\n${passed}/${total} tests passés`);
  }
  
  console.log(`${colors.blue}${'='.repeat(60)}${colors.reset}\n`);
}

// Lancer les tests
runAllTests().catch(error => {
  log.error(`Erreur fatale: ${error.message}`);
  console.error(error);
  process.exit(1);
});
