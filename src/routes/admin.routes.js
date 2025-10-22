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

// ==================== GESTION DES ADMINISTRATEURS ====================

/**
 * @swagger
 * /admin/admins:
 *   post:
 *     summary: Créer un nouveau compte administrateur (Super Admin uniquement)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - password
 *               - phone
 *               - adresse
 *               - profilePicture
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               phone:
 *                 type: string
 *               adresse:
 *                 type: string
 *               profilePicture:
 *                 type: string
 *     responses:
 *       201:
 *         description: Administrateur créé avec succès
 *       403:
 *         description: Seul le super admin peut créer des administrateurs
 */
router.post('/admins', protect, restrictTo('admin'), adminController.createAdmin);

/**
 * @swagger
 * /admin/admins:
 *   get:
 *     summary: Obtenir tous les administrateurs
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: Liste des administrateurs
 */
router.get('/admins', protect, restrictTo('admin'), adminController.getAllAdmins);

/**
 * @swagger
 * /admin/admins/{id}/toggle-status:
 *   patch:
 *     summary: Bloquer/Débloquer un administrateur (Super Admin uniquement)
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
 *         description: Statut de l'administrateur modifié
 *       403:
 *         description: Seul le super admin peut bloquer/débloquer des administrateurs
 */
router.patch('/admins/:id/toggle-status', protect, restrictTo('admin'), adminController.toggleAdminStatus);

/**
 * @swagger
 * /admin/admins/{id}:
 *   patch:
 *     summary: Modifier un administrateur (Super Admin uniquement)
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
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               adresse:
 *                 type: string
 *               profilePicture:
 *                 type: string
 *     responses:
 *       200:
 *         description: Administrateur modifié avec succès
 *       403:
 *         description: Seul le super admin peut modifier des administrateurs
 */
router.patch('/admins/:id', protect, restrictTo('admin'), adminController.updateAdmin);

/**
 * @swagger
 * /admin/admins/{id}:
 *   delete:
 *     summary: Supprimer/Archiver un administrateur (Super Admin uniquement)
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
 *         description: Administrateur supprimé et archivé
 *       403:
 *         description: Seul le super admin peut supprimer des administrateurs
 */
router.delete('/admins/:id', protect, restrictTo('admin'), adminController.deleteAdmin);

/**
 * @swagger
 * /admin/admins/{id}/password:
 *   patch:
 *     summary: Modifier le mot de passe d'un administrateur (Super Admin uniquement)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'administrateur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - newPassword
 *               - confirmPassword
 *             properties:
 *               newPassword:
 *                 type: string
 *                 description: Nouveau mot de passe (minimum 8 caractères)
 *               confirmPassword:
 *                 type: string
 *                 description: Confirmation du nouveau mot de passe
 *     responses:
 *       200:
 *         description: Mot de passe modifié avec succès
 *       400:
 *         description: Les mots de passe ne correspondent pas ou sont invalides
 *       403:
 *         description: Seul le super admin peut modifier les mots de passe des administrateurs
 *       404:
 *         description: Administrateur non trouvé
 */
router.patch('/admins/:id/password', protect, restrictTo('admin'), adminController.updateAdminPassword);

module.exports = router;

console.log(' Routes Livraison, Messages, Formations et Admin créées avec succès !');