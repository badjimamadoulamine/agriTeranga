const mongoose = require('mongoose');

/**
 * Modèle pour stocker les tokens JWT révoqués (blacklist)
 * Utilisé pour invalider les tokens après déconnexion
 */
const revokedTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  revokedAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expires: 0 } // TTL index - MongoDB supprimera automatiquement le document après expiration
  },
  reason: {
    type: String,
    enum: ['logout', 'password_change', 'account_deletion', 'security'],
    default: 'logout'
  }
}, {
  timestamps: true
});

// Index composé pour recherche rapide
revokedTokenSchema.index({ token: 1, expiresAt: 1 });

// Méthode statique pour vérifier si un token est révoqué
revokedTokenSchema.statics.isRevoked = async function(token) {
  const revokedToken = await this.findOne({ token });
  return !!revokedToken;
};

// Méthode statique pour révoquer un token
revokedTokenSchema.statics.revokeToken = async function(token, userId, expiresAt, reason = 'logout') {
  try {
    await this.create({
      token,
      userId,
      expiresAt,
      reason
    });
    return true;
  } catch (error) {
    // Si le token existe déjà dans la blacklist, c'est OK
    if (error.code === 11000) {
      return true;
    }
    throw error;
  }
};

module.exports = mongoose.models.RevokedToken || mongoose.model('RevokedToken', revokedTokenSchema);
