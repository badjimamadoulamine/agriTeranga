const fs = require('fs');
const path = require('path');

// Créer les répertoires d'upload manquants
function createUploadDirectories() {
  const baseDir = path.join(__dirname, 'uploads');
  const subdirectories = [
    'products',
    'profiles', 
    'formations',
    'deliveries',
    'others'
  ];

  try {
    // Créer le répertoire principal
    if (!fs.existsSync(baseDir)) {
      fs.mkdirSync(baseDir, { recursive: true });
      console.log('✅ Répertoire uploads créé');
    }

    // Créer les sous-répertoires
    subdirectories.forEach(subdir => {
      const dirPath = path.join(baseDir, subdir);
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
        console.log(`✅ Répertoire uploads/${subdir} créé`);
      }
    });

    console.log('🎉 Tous les répertoires d\'upload sont prêts!');
  } catch (error) {
    console.error('❌ Erreur lors de la création des répertoires:', error);
  }
}

// Exécuter la fonction
createUploadDirectories();