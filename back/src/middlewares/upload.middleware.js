const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const fs = require('fs');

// Fonction pour créer les répertoires s'ils n'existent pas
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// Configuration du stockage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = path.join(__dirname, '..', 'uploads');
    
    if (file.fieldname === 'profilePicture') {
      uploadPath = path.join(uploadPath, 'profiles');
    } else if (file.fieldname === 'images') {
      uploadPath = path.join(uploadPath, 'products');
    } else if (file.fieldname === 'thumbnail') {
      uploadPath = path.join(uploadPath, 'formations');
    } else if (file.fieldname === 'proofPhoto') {
      uploadPath = path.join(uploadPath, 'deliveries');
    } else {
      uploadPath = path.join(uploadPath, 'others');
    }
    
    // Créer le répertoire s'il n'existe pas
    ensureDirectoryExists(uploadPath);
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = crypto.randomBytes(16).toString('hex');
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  }
});

// Filtrer les types de fichiers
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|pdf|mp4|webm/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Type de fichier non autorisé. Formats acceptés: JPEG, PNG, GIF, PDF, MP4, WEBM'));
  }
};

// Configuration de multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB max
  },
  fileFilter: fileFilter
});

module.exports = upload;