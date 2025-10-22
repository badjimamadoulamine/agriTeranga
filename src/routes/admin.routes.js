const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { protect, restrictTo } = require('../middlewares/auth.middleware');

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Gestion administrative
 */

/**
 * @swagger
 * /admin/dashboard:
 *   get:
 *     summary: Obtenir les statistiques du tableau de bord
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistiques globales
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalUsers:
 *                   type: number
 *                 totalProducts:
 *                   type: number
 *                 totalOrders:
 *                   type: number
 *                 totalRevenue:
 *                   type: number
 *                 recentOrders:
 *                   type: array
 */
router.get('/dashboard', protect, restrictTo('admin'), adminController.getDashboard);

/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: Obtenir tous les utilisateurs
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Liste des utilisateurs
 */
router.get('/users', protect, restrictTo('admin'), adminController.getAllUsers);

/**
 * @swagger
 * /admin/users/{id}/toggle-status:
 *   patch:
 *     summary: Activer/Désactiver un utilisateur
 *     tags: [Admin]
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
 *         description: Statut modifié
 */
router.patch('/users/:id/toggle-status', protect, restrictTo('admin'), adminController.toggleUserStatus);

/**
 * @swagger
 * /admin/users/{id}/role:
 *   patch:
 *     summary: Modifier le rôle d'un utilisateur
 *     tags: [Admin]
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
 *               - role
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [consumer, producer, deliverer, admin]
 *     responses:
 *       200:
 *         description: Rôle modifié
 */
router.patch('/users/:id/role', protect, restrictTo('admin'), adminController.updateUserRole);

/**
 * @swagger
 * /admin/orders:
 *   get:
 *     summary: Obtenir toutes les commandes
 *     tags: [Admin]
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
 *     responses:
 *       200:
 *         description: Liste de toutes les commandes
 */
router.get('/orders', protect, restrictTo('admin'), adminController.getAllOrders);

/**
 * @swagger
 * /admin/products/pending:
 *   get:
 *     summary: Obtenir les produits en attente de validation
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Produits en attente
 */
router.get('/products/pending', protect, restrictTo('admin'), adminController.getPendingProducts);

/**
 * @swagger
 * /admin/products/{id}/approve:
 *   patch:
 *     summary: Approuver un produit
 *     tags: [Admin]
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
 *         description: Produit approuvé
 */
router.patch('/products/:id/approve', protect, restrictTo('admin'), adminController.approveProduct);

/**
 * @swagger
 * /admin/stats/sales:
 *   get:
 *     summary: Obtenir les statistiques de ventes
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [day, week, month, year]
 *     responses:
 *       200:
 *         description: Statistiques de ventes
 */
router.get('/stats/sales', protect, restrictTo('admin'), adminController.getSalesStats);

/**
 * @swagger
 * /admin/stats/users:
 *   get:
 *     summary: Obtenir les statistiques utilisateurs
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistiques utilisateurs
 */
router.get('/stats/users', protect, restrictTo('admin'), adminController.getUserStats);

/**
 * @swagger
 * /admin/formations/{id}/toggle-publish:
 *   patch:
 *     summary: Publier/Dépublier une formation
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la formation
 *     responses:
 *       200:
 *         description: Statut de publication modifié
 *       404:
 *         description: Formation non trouvée
 */
router.patch('/formations/:id/toggle-publish', protect, restrictTo('admin'), adminController.toggleFormationPublish);

module.exports = router;

console.log(' Routes Livraison, Messages, Formations et Admin créées avec succès !');