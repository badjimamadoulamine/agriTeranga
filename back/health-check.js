/**
 * Script de vérification de santé du projet
 * Vérifie que tous les fichiers et dépendances sont présents
 */

const fs = require('fs');
const path = require('path');

console.log('\n🔍 Vérification de santé du projet Agriculture API...\n');

let errors = 0;
let warnings = 0;
let success = 0;

// Fonction de vérification de fichier
function checkFile(filePath, required = true) {
  const fullPath = path.join(__dirname, filePath);
  const exists = fs.existsSync(fullPath);
  
  if (exists) {
    const stats = fs.statSync(fullPath);
    if (stats.size === 0) {
      if (required) {
        console.log(`⚠️  ${filePath} - Fichier vide`);
        warnings++;
      }
    } else {
      console.log(`✅ ${filePath} (${stats.size} bytes)`);
      success++;
    }
    return true;
  } else {
    if (required) {
      console.log(`❌ ${filePath} - MANQUANT`);
      errors++;
    } else {
      console.log(`ℹ️  ${filePath} - Optionnel (absent)`);
    }
    return false;
  }
}

// Vérification des fichiers principaux
console.log('\n📄 Fichiers principaux:');
checkFile('.env', false);
checkFile('.env.example');
checkFile('.gitignore');
checkFile('package.json');
checkFile('server.js');
checkFile('README.md');

// Vérification de la configuration
console.log('\n⚙️  Configuration:');
checkFile('src/app.js');
checkFile('src/config/database.js');
checkFile('src/config/env.js');
checkFile('src/config/swagger.js');

// Vérification des modèles
console.log('\n📊 Modèles:');
const models = [
  'User.js',
  'Product.js',
  'Order.js',
  'Cart.js',
  'Delivery.js',
  'Formation.js',
  'Message.js',
  'Review.js',
  'Notification.js',
];
models.forEach((model) => checkFile(`src/models/${model}`));

// Vérification des contrôleurs
console.log('\n🎮 Contrôleurs:');
const controllers = [
  'admin.controller.js',
  'auth.controller.js',
  'cart.controller.js',
  'delivery.controller.js',
  'formation.controller.js',
  'message.controller.js',
  'order.controller.js',
  'product.controller.js',
  'user.controller.js',
];
controllers.forEach((controller) => checkFile(`src/controllers/${controller}`));

// Vérification des routes
console.log('\n🛤️  Routes:');
const routes = [
  'admin.routes.js',
  'auth.routes.js',
  'cart.routes.js',
  'delivery.routes.js',
  'formation.routes.js',
  'message.routes.js',
  'order.routes.js',
  'product.routes.js',
  'user.routes.js',
];
routes.forEach((route) => checkFile(`src/routes/${route}`));

// Vérification des middlewares
console.log('\n🛡️  Middlewares:');
const middlewares = [
  'auth.middleware.js',
  'error.middleware.js',
  'limit.middleware.js',
  'role.middleware.js',
  'upload.middleware.js',
  'validation.middleware.js',
];
middlewares.forEach((middleware) => checkFile(`src/middlewares/${middleware}`));

// Vérification des services
console.log('\n🛠️  Services:');
const services = [
  'email.service.js',
  'notification.service.js',
  'payment.service.js',
];
services.forEach((service) => checkFile(`src/services/${service}`));

// Vérification des utilitaires
console.log('\n🧰 Utilitaires:');
const utils = ['helpers.js', 'logger.js'];
utils.forEach((util) => checkFile(`src/utils/${util}`));

// Vérification de la documentation
console.log('\n📝 Documentation:');
checkFile('README.md');
checkFile('API-REFERENCE.md', false);
checkFile('GESTION-PROFIL.md', false);
checkFile('DEMARRAGE.md', false);
checkFile('STRUCTURE-PROJET.md', false);

// Vérification des dépendances
console.log('\n📦 Dépendances:');
try {
  const packageJson = require('./package.json');
  const requiredDeps = [
    'express',
    'mongoose',
    'bcryptjs',
    'jsonwebtoken',
    'dotenv',
    'cors',
    'helmet',
    'nodemailer',
    'joi',
    'multer',
  ];

  requiredDeps.forEach((dep) => {
    if (packageJson.dependencies[dep]) {
      console.log(`✅ ${dep} - ${packageJson.dependencies[dep]}`);
      success++;
    } else {
      console.log(`❌ ${dep} - MANQUANT`);
      errors++;
    }
  });
} catch (error) {
  console.log(`❌ Impossible de lire package.json`);
  errors++;
}

// Résumé final
console.log('\n' + '='.repeat(60));
console.log('📈 Résumé:');
console.log(`  ✅ Succès: ${success}`);
console.log(`  ⚠️  Avertissements: ${warnings}`);
console.log(`  ❌ Erreurs: ${errors}`);
console.log('='.repeat(60));

if (errors === 0 && warnings === 0) {
  console.log('\n🎉 Excellent ! Le projet est complètement opérationnel !\n');
  process.exit(0);
} else if (errors === 0) {
  console.log('\n✅ Le projet est fonctionnel avec quelques avertissements mineurs.\n');
  process.exit(0);
} else {
  console.log('\n⚠️  Attention : Des erreurs ont été détectées. Veuillez les corriger.\n');
  process.exit(1);
}
