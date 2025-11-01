/**
 * Script de seeding pour créer un compte administrateur par défaut
 * Exécuter avec : npm run seed:admin
 */

const mongoose = require('mongoose');
const User = require('../src/models/User');
require('dotenv').config();

// Identifiants admin par défaut
const ADMIN_DATA = {
  firstName: 'Admin',
  lastName: 'Système',
  email: 'admin@agriteranga.com',
  password: 'SimplonDev@2025!', // À CHANGER EN PRODUCTION !
  phone: '+221770000000',
  role: 'admin',
  isActive: true,
  isVerified: true, // Admin vérifié par défaut
  profilePicture: null
};

/**
 * Créer le compte administrateur
 */
const seedAdmin = async () => {
  try {
    // Connexion à MongoDB
    console.log('Connexion à MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connecté\n');

    // Vérifier si l'admin existe déjà
    const existingAdmin = await User.findOne({ email: ADMIN_DATA.email });

    if (existingAdmin) {
      console.log(' Un administrateur existe déjà avec cet email.');
      console.log(` Email: ${existingAdmin.email}`);
      console.log(` Nom: ${existingAdmin.firstName} ${existingAdmin.lastName}`);
      console.log(` Rôle: ${existingAdmin.role}`);
      console.log('\n Aucune action effectuée.\n');
    } else {
      // Créer le compte admin
      console.log(' Création du compte administrateur...');
      const admin = await User.create(ADMIN_DATA);

      console.log('\n Compte administrateur créé avec succès !\n');
      console.log(' IDENTIFIANTS DE CONNEXION :');
      console.log('================================');
      console.log(` Email     : ${ADMIN_DATA.email}`);
      console.log(` Mot de passe : ${ADMIN_DATA.password}`);
      console.log(`Rôle      : ${admin.role}`);
      console.log('================================');
      console.log('\n  IMPORTANT : Changez le mot de passe après la première connexion !\n');
    }

    // Déconnexion
    await mongoose.connection.close();
    console.log(' Déconnecté de MongoDB');
    process.exit(0);
  } catch (error) {
    console.error(' Erreur lors du seeding:', error.message);
    process.exit(1);
  }
};

// Exécuter le seeding
seedAdmin();