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
  email: 'adminsysteme@agriteranga.com',
  password: 'Admin@2025!', // À CHANGER EN PRODUCTION !
  phone: '+221770000000',
  adresse: 'Siège Administration',
  role: 'admin',
  isSuperAdmin: true, // Admin principal avec tous les privilèges
  isActive: true,
  isVerified: true, // Admin vérifié par défaut
  profilePicture: 'https://via.placeholder.com/150/008000/FFFFFF?text=Admin' // Photo par défaut
};

/**
 * Créer le compte administrateur
 */
const seedAdmin = async () => {
  try {
    // Connexion à MongoDB
    console.log('🔄 Connexion à MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connecté\n');

    // Vérifier si l'admin existe déjà
    const existingAdmin = await User.findOne({ email: ADMIN_DATA.email });

    if (existingAdmin) {
      console.log('⚠️  Un administrateur existe déjà avec cet email.');
      console.log(`📍 Email: ${existingAdmin.email}`);
      console.log(`👤 Nom: ${existingAdmin.firstName} ${existingAdmin.lastName}`);
      console.log(`🎯 Rôle: ${existingAdmin.role}`);
      console.log('\nℹ️  Aucune action effectuée.\n');
    } else {
      // Créer le compte admin
      console.log('🔨 Création du compte administrateur...');
      const admin = await User.create(ADMIN_DATA);

      console.log('\n✅ Admin principal créé avec succès !\n');
      console.log('🔑 IDENTIFIANTS DE CONNEXION :');
      console.log('================================');
      console.log(`📧 Email       : ${ADMIN_DATA.email}`);
      console.log(`🔒 Mot de passe   : ${ADMIN_DATA.password}`);
      console.log(`🎯 Rôle        : ${admin.role}`);
      console.log(`⭐ Super Admin   : ${admin.isSuperAdmin ? 'Oui' : 'Non'}`);
      console.log('================================');
      console.log('\n✅ Vous pouvez maintenant :');
      console.log('   • Vous connecter avec ces identifiants');
      console.log('   • Gérer tous les utilisateurs');
      console.log('   • Créer d\'autres administrateurs');
      console.log('\n⚠️  IMPORTANT : Changez le mot de passe après la première connexion !\n');
    }

    // Déconnexion
    await mongoose.connection.close();
    console.log('🔌 Déconnecté de MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors du seeding:', error.message);
    process.exit(1);
  }
};

// Exécuter le seeding
seedAdmin();
