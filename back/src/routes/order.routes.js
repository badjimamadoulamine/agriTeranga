const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const { protect, restrictTo } = require('../middlewares/auth.middleware');
const { validate, schemas } = require('../middlewares/validation.middleware');

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Gestion des commandes
 */

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Créer une nouvelle commande
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - items
 *               - paymentMethod
 *               - deliveryInfo
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     product:
 *                       type: string
 *                     quantity:
 *                       type: number
 *               paymentMethod:
 *                 type: string
 *                 enum: [card, mobile-money, cash-on-delivery]
 *               deliveryInfo:
 *                 type: object
 *                 properties:
 *                   method:
 *                     type: string
 *                     enum: [home-delivery, pickup-point, farm-pickup]
 *                   address:
 *                     type: object
 *                     properties:
 *                       street:
 *                         type: string
 *                       city:
 *                         type: string
 *                       region:
 *                         type: string
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Commande créée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Order'
 */
router.post('/', protect, validate(schemas.createOrder), orderController.createOrder);

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Obtenir toutes mes commandes
 *     tags: [Orders]
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
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Liste des commandes
 */
router.get('/', protect, orderController.getMyOrders);

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Obtenir une commande par ID
 *     tags: [Orders]
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
 *         description: Détails de la commande
 *       404:
 *         description: Commande non trouvée
 */
router.get('/:id([0-9a-fA-F]{24})', protect, orderController.getOrder);

/**
 * @swagger
 * /orders/{id}/status:
 *   patch:
 *     summary: Mettre à jour le statut d'une commande
 *     tags: [Orders]
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
 *                 enum: [pending, confirmed, processing, shipped, delivered, cancelled]
 *     responses:
 *       200:
 *         description: Statut mis à jour
 */
router.patch('/:id([0-9a-fA-F]{24})/status', protect, restrictTo('producteur', 'producer', 'livreur', 'deliverer', 'admin'), orderController.updateOrderStatus);

/**
 * @swagger
 * /orders/{id}/cancel:
 *   patch:
 *     summary: Annuler une commande
 *     tags: [Orders]
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
 *         description: Commande annulée
 */
router.patch('/:id([0-9a-fA-F]{24})/cancel', protect, orderController.cancelOrder);

/**
 * @swagger
 * /orders/producer/list:
 *   get:
 *     summary: Obtenir les commandes pour un producteur
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des commandes du producteur
 */
router.get('/producer/list', protect, restrictTo('producteur', 'producer'), orderController.getProducerOrders);

/**
 * @swagger
 * /orders/deliverer/list:
 *   get:
 *     summary: Obtenir les commandes pour un livreur
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des commandes du livreur
 */
router.get('/deliverer/list', protect, restrictTo('livreur', 'deliverer'), orderController.getDelivererOrders);

/**
 * @swagger
 * /orders/history:
 *   get:
 *     summary: Obtenir l'historique complet des transactions
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Gestion des commandes
 */

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Créer une nouvelle commande
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - items
 *               - paymentMethod
 *               - deliveryInfo
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     product:
 *                       type: string
 *                     quantity:
 *                       type: number
 *               paymentMethod:
 *                 type: string
 *                 enum: [card, mobile-money, cash-on-delivery]
 *               deliveryInfo:
 *                 type: object
 *                 properties:
 *                   method:
 *                     type: string
 *                     enum: [home-delivery, pickup-point, farm-pickup]
 *                   address:
 *                     type: object
 *                     properties:
 *                       street:
 *                         type: string
 *                       city:
 *                         type: string
 *                       region:
 *                         type: string
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Commande créée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Order'
 */
router.post('/', protect, validate(schemas.createOrder), orderController.createOrder);

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Obtenir toutes mes commandes
 *     tags: [Orders]
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
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Liste des commandes
 */
router.get('/', protect, orderController.getMyOrders);

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Obtenir une commande par ID
 *     tags: [Orders]
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
 *         description: Détails de la commande
 *       404:
 *         description: Commande non trouvée
 */
router.get('/:id([0-9a-fA-F]{24})', protect, orderController.getOrder);

/**
 * @swagger
 * /orders/{id}/status:
 *   patch:
 *     summary: Mettre à jour le statut d'une commande
 *     tags: [Orders]
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
 *                 enum: [pending, confirmed, processing, shipped, delivered, cancelled]
 *     responses:
 *       200:
 *         description: Statut mis à jour
 */
router.patch('/:id([0-9a-fA-F]{24})/status', protect, restrictTo('producteur', 'producer', 'livreur', 'deliverer', 'admin'), orderController.updateOrderStatus);

/**
 * @swagger
 * /orders/{id}/cancel:
 *   patch:
 *     summary: Annuler une commande
 *     tags: [Orders]
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
 *         description: Commande annulée
 */
router.patch('/:id([0-9a-fA-F]{24})/cancel', protect, orderController.cancelOrder);

/**
 * @swagger
 * /orders/producer/list:
 *   get:
 *     summary: Obtenir les commandes pour un producteur
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des commandes du producteur
 */
router.get('/producer/list', protect, restrictTo('producteur', 'producer'), orderController.getProducerOrders);

/**
 * @swagger
 * /orders/deliverer/list:
 *   get:
 *     summary: Obtenir les commandes pour un livreur
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des commandes du livreur
 */
router.get('/deliverer/list', protect, restrictTo('livreur', 'deliverer'), orderController.getDelivererOrders);

/**
 * @swagger
 * /orders/history:
 *   get:
 *     summary: Obtenir l'historique complet des transactions
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Historique des transactions avec statistiques
 */
router.get('/history', protect, orderController.getTransactionHistory);

module.exports = router;