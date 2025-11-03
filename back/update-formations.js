/**
 * Script pour mettre à jour toutes les formations existantes
 * et les marquer comme publiées (isPublished: true)
 * 
 * Exécution : node update-formations.js
 */

const mongoose = require('mongoose');
require('dotenv').config();

const Formation = require('./src/models/Formation');

async function updateFormations() {
  try {
    // Connexion à MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connecté à MongoDB');

    // Mettre à jour toutes les formations avec isPublished: false
    const result = await Formation.updateMany(
      { isPublished: { $ne: true } }, // Formations non publiées ou sans le champ
      { $set: { isPublished: true } }
    );

    console.log(`✅ ${result.modifiedCount} formation(s) mise(s) à jour`);
    console.log(`📊 Total de formations vérifiées : ${result.matchedCount}`);

    // Afficher toutes les formations
    const formations = await Formation.find({});
    console.log('\n📚 Liste des formations :');
    formations.forEach((f, index) => {
      console.log(`${index + 1}. ${f.title} - Publié: ${f.isPublished}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  }
}

updateFormations();
