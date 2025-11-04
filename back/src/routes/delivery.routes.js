const express = require('express');
const router = express.Router();
const deliveryController = require('../controllers/delivery.controller');
const { protect, restrictTo } = require('../middlewares/auth.middleware');

/**
 * @swagger
 * tags:
 *   name: Deliveries
 *   description: Gestion des livraisons
 */

/**
 * @swagger
 * /deliveries:
 *   get:
 *     summary: Obtenir toutes les livraisons (pour livreur)
 *     tags: [Deliveries]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Liste des livraisons
 */
router.get('/', protect, restrictTo('livreur', 'admin'), deliveryController.getAllDeliveries);

/**
 * @swagger
 * /deliveries/available:
 *   get:
 *     summary: Obtenir les livraisons disponibles
 *     tags: [Deliveries]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Livraisons disponibles
 */
router.get('/available', protect, restrictTo('livreur'), deliveryController.getAvailableDeliveries);

// Route for current deliverer's deliveries (must be before ':id')
router.get('/my', protect, restrictTo('livreur'), deliveryController.getMyDeliveries);

/**
 * @swagger
 * /deliveries/{id}:
 *   get:
 *     summary: Obtenir une livraison par ID
 *     tags: [Deliveries]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Détails de la livraison
 */
router.get('/:id([a-fA-F0-9]{24})', protect, deliveryController.getDelivery);

/**
 * @swagger
 * /deliveries/{id}/accept:
 *   patch:
 *     summary: Accepter une livraison
 *     tags: [Deliveries]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Livraison acceptée
 */
router.patch('/:id([a-fA-F0-9]{24})/accept', protect, restrictTo('livreur'), deliveryController.acceptDelivery);

/**
 * @swagger
 * /deliveries/{id}/status:
 *   patch:
 *     summary: Mettre à jour le statut de livraison
 *     tags: [Deliveries]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [assigned, picked-up, in-transit, delivered, failed]
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Statut mis à jour
 */
router.patch('/:id([a-fA-F0-9]{24})/status', protect, restrictTo('livreur'), deliveryController.updateDeliveryStatus);

/**
 * @swagger
 * /deliveries/{id}/complete:
 *   patch:
 *     summary: Marquer une livraison comme terminée
 *     tags: [Deliveries]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               proofPhoto:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Livraison terminée
 */
router.patch('/:id([a-fA-F0-9]{24})/complete', protect, restrictTo('livreur'), deliveryController.completeDelivery);

/**
 * @swagger
 * /deliveries/my/history:
 *   get:
 *     summary: Obtenir l'historique de mes livraisons
 *     tags: [Deliveries]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Historique des livraisons
 */
router.get('/my/history', protect, restrictTo('livreur'), deliveryController.getMyDeliveries);

module.exports = router;
