/**
 * Service de notifications
 * Gère les notifications in-app pour les utilisateurs
 */

const Notification = require('../models/Notification');
const logger = require('../utils/logger');

/**
 * Crée une notification
 * @param {Object} data - Données de la notification
 * @param {string} data.userId - ID de l'utilisateur
 * @param {string} data.title - Titre
 * @param {string} data.message - Message
 * @param {string} data.type - Type (info, success, warning, error)
 * @param {Object} data.data - Données supplémentaires
 * @returns {Promise<Object>} Notification créée
 */
exports.createNotification = async ({ userId, title, message, type = 'info', data = {} }) => {
  try {
    const notification = await Notification.create({
      user: userId,
      title,
      message,
      type,
      data,
    });

    logger.info(`Notification créée pour l'utilisateur ${userId}`);
    return notification;
  } catch (error) {
    logger.error('Erreur lors de la création de la notification:', error);
    throw error;
  }
};

/**
 * Récupère les notifications d'un utilisateur
 * @param {string} userId - ID de l'utilisateur
 * @param {Object} options - Options de filtrage
 * @returns {Promise<Array>} Liste des notifications
 */
exports.getUserNotifications = async (userId, options = {}) => {
  try {
    const { limit = 20, unreadOnly = false } = options;

    const query = { user: userId };
    if (unreadOnly) {
      query.read = false;
    }

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(limit);

    return notifications;
  } catch (error) {
    logger.error('Erreur lors de la récupération des notifications:', error);
    throw error;
  }
};

/**
 * Marque une notification comme lue
 * @param {string} notificationId - ID de la notification
 * @returns {Promise<Object>} Notification mise à jour
 */
exports.markAsRead = async (notificationId) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      notificationId,
      { read: true, readAt: Date.now() },
      { new: true }
    );

    return notification;
  } catch (error) {
    logger.error('Erreur lors du marquage de la notification:', error);
    throw error;
  }
};

/**
 * Marque toutes les notifications d'un utilisateur comme lues
 * @param {string} userId - ID de l'utilisateur
 * @returns {Promise<Object>} Résultat de la mise à jour
 */
exports.markAllAsRead = async (userId) => {
  try {
    const result = await Notification.updateMany(
      { user: userId, read: false },
      { read: true, readAt: Date.now() }
    );

    logger.info(`${result.modifiedCount} notifications marquées comme lues pour l'utilisateur ${userId}`);
    return result;
  } catch (error) {
    logger.error('Erreur lors du marquage des notifications:', error);
    throw error;
  }
};

/**
 * Supprime une notification
 * @param {string} notificationId - ID de la notification
 * @returns {Promise<Object>} Notification supprimée
 */
exports.deleteNotification = async (notificationId) => {
  try {
    const notification = await Notification.findByIdAndDelete(notificationId);
    return notification;
  } catch (error) {
    logger.error('Erreur lors de la suppression de la notification:', error);
    throw error;
  }
};

/**
 * Compte les notifications non lues d'un utilisateur
 * @param {string} userId - ID de l'utilisateur
 * @returns {Promise<number>} Nombre de notifications non lues
 */
exports.getUnreadCount = async (userId) => {
  try {
    const count = await Notification.countDocuments({
      user: userId,
      read: false,
    });

    return count;
  } catch (error) {
    logger.error('Erreur lors du comptage des notifications:', error);
    throw error;
  }
};

// ========== Notifications prédéfinies ==========

/**
 * Notification de nouvelle commande (pour producteur)
 */
exports.notifyNewOrder = async (producerId, order) => {
  return this.createNotification({
    userId: producerId,
    title: 'Nouvelle commande !',
    message: `Vous avez reçu une nouvelle commande #${order.orderNumber}`,
    type: 'success',
    data: { orderId: order._id, orderNumber: order.orderNumber },
  });
};

/**
 * Notification de changement de statut de commande (pour client)
 */
exports.notifyOrderStatusChange = async (userId, order, newStatus) => {
  const statusMessages = {
    confirmed: 'Votre commande a été confirmée',
    preparing: 'Votre commande est en préparation',
    ready: 'Votre commande est prête',
    in_delivery: 'Votre commande est en cours de livraison',
    delivered: 'Votre commande a été livrée',
    cancelled: 'Votre commande a été annulée',
  };

  return this.createNotification({
    userId,
    title: 'Mise à jour de commande',
    message: statusMessages[newStatus] || `Statut de commande mis à jour: ${newStatus}`,
    type: newStatus === 'cancelled' ? 'warning' : 'info',
    data: { orderId: order._id, orderNumber: order.orderNumber, status: newStatus },
  });
};

/**
 * Notification de nouvelle livraison assignée (pour livreur)
 */
exports.notifyNewDelivery = async (deliveryId, delivery) => {
  return this.createNotification({
    userId: deliveryId,
    title: 'Nouvelle livraison assignée',
    message: `Une nouvelle livraison vous a été assignée`,
    type: 'info',
    data: { deliveryId: delivery._id },
  });
};

/**
 * Notification de paiement reçu (pour producteur)
 */
exports.notifyPaymentReceived = async (producerId, payment) => {
  return this.createNotification({
    userId: producerId,
    title: 'Paiement reçu',
    message: `Vous avez reçu un paiement de ${payment.amount} FCFA`,
    type: 'success',
    data: { paymentId: payment._id, amount: payment.amount },
  });
};
