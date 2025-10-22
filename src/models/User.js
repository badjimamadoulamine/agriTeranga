const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *         - email
 *         - password
 *         - phone
 *         - adresse
 *         - profilePicture
 *         - role
 *       properties:
 *         firstName:
 *           type: string
 *           description: Prénom de l'utilisateur
 *         lastName:
 *           type: string
 *           description: Nom de famille
 *         email:
 *           type: string
 *           format: email
 *           description: Email unique
 *         phone:
 *           type: string
 *           description: Numéro de téléphone (REQUIS pour tous)
 *         adresse:
 *           type: string
 *           description: Adresse complète (REQUIS pour tous)
 *         profilePicture:
 *           type: string
 *           description: URL de la photo de profil (REQUIS pour tous)
 *         role:
 *           type: string
 *           enum: [consommateur, producteur, livreur, admin]
 *           description: Rôle de l'utilisateur
 *         isSuperAdmin:
 *           type: boolean
 *           description: Indique si c'est l'administrateur par défaut (super admin)
 *         producteurInfo:
 *           type: object
 *           description: Informations spécifiques au producteur
 *           properties:
 *             cultureType:
 *               type: string
 *               description: Type de culture
 *             farmSize:
 *               type: string
 *               description: Taille de l'exploitation
 *             certificates:
 *               type: array
 *               items:
 *                 type: string
 *               description: URLs d'images de certificats (optionnel)
 *         livreurInfo:
 *           type: object
 *           description: Informations spécifiques au livreur
 *           properties:
 *             deliveryZone:
 *               type: string
 *               description: Zone de livraison
 *             vehicleType:
 *               type: string
 *               description: Type de véhicule
 *             capaciteCharge:
 *               type: string
 *               description: Capacité de charge (ex 500 kg, 1 tonne)
 *             permisConduire:
 *               type: string
 *               description: Numéro ou type de permis de conduire
 *             isAvailable:
 *               type: boolean
 *               description: Disponibilité du livreur
 */
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'Le prénom est requis'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'Le nom est requis'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'L\'email est requis'],
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Email invalide']
  },
  password: {
    type: String,
    required: [true, 'Le mot de passe est requis'],
    minlength: 8,
    select: false
  },
  phone: {
    type: String,
    required: [true, 'Le numéro de téléphone est requis']
  },
  adresse: {
    type: String,
    required: [true, 'L\'adresse est requise'],
    trim: true
  },
  role: {
    type: String,
    enum: ['consommateur', 'producteur', 'livreur', 'admin'],
    default: 'consommateur'
  },
  profilePicture: {
    type: String,
    required: [true, 'La photo de profil est requise']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  // Indique si c'est l'administrateur par défaut (super admin)
  isSuperAdmin: {
    type: Boolean,
    default: false
  },
  // Système d'archivage (soft delete)
  isDeleted: {
    type: Boolean,
    default: false
  },
  deletedAt: {
    type: Date,
    default: null
  },
  // Champs spécifiques au producteur
  producteurInfo: {
    cultureType: { type: String },
    farmSize: { type: String },
    certificates: [{ type: String }] // URLs d'images de certificats (optionnel)
  },
  // Champs spécifiques au livreur
  livreurInfo: {
    deliveryZone: { type: String },
    vehicleType: { type: String },
    capaciteCharge: { type: String }, // Ex: "500 kg", "1 tonne"
    permisConduire: { type: String }, // Numéro ou type de permis
    isAvailable: { type: Boolean, default: true }
  },
  // Préférences
  preferences: {
    language: {
      type: String,
      enum: ['fr', 'wo', 'en'],
      default: 'fr'
    },
    theme: {
      type: String,
      enum: ['light', 'dark'],
      default: 'light'
    },
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true }
    }
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  verificationToken: String,
  verificationExpire: Date,
  lastLogin: Date
}, {
  timestamps: true
});

// Hash password avant sauvegarde
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Méthode pour comparer les mots de passe
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Middleware pour exclure automatiquement les utilisateurs supprimés
// S'applique à toutes les requêtes find, findOne, etc.
userSchema.pre(/^find/, function(next) {
  // Si on veut explicitement inclure les supprimés, on peut passer { includeDeleted: true }
  if (!this.getOptions().includeDeleted) {
    this.where({ isDeleted: { $ne: true } });
  }
  next();
});

// Exclure le mot de passe dans les réponses JSON
userSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  delete obj.resetPasswordToken;
  delete obj.resetPasswordExpire;
  return obj;
};

// Vérifier si le modèle existe déjà pour éviter l'erreur avec nodemon
module.exports = mongoose.models.User || mongoose.model('User', userSchema);