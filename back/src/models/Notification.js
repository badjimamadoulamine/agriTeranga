/**
 * Modèle Notification
 * Gère les notifications in-app des utilisateurs
 */

const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'L\'utilisateur est requis'],
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Le titre est requis'],
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'Le message est requis'],
    },
    type: {
      type: String,
      enum: ['info', 'success', 'warning', 'error'],
      default: 'info',
    },
    read: {
      type: Boolean,
      default: false,
      index: true,
    },
    readAt: {
      type: Date,
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    // Pour lier à une entité spécifique (commande, produit, etc.)
    relatedModel: {
      type: String,
      enum: ['Order', 'Product', 'Delivery', 'Payment', 'Message', null],
    },
    relatedId: {
      type: mongoose.Schema.Types.ObjectId,
    },
  },
  {
    timestamps: true,
  }
);

// Index composé pour les requêtes fréquentes
notificationSchema.index({ user: 1, read: 1, createdAt: -1 });

// Middleware pour mettre à jour readAt lors du marquage comme lu
notificationSchema.pre('save', function (next) {
  if (this.isModified('read') && this.read && !this.readAt) {
    this.readAt = Date.now();
  }
  next();
});

// Méthode statique pour supprimer les anciennes notifications
notificationSchema.statics.deleteOldNotifications = async function (days = 30) {
  const date = new Date();
  date.setDate(date.getDate() - days);

  const result = await this.deleteMany({
    createdAt: { $lt: date },
    read: true,
  });

  return result;
};

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
