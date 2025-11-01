const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { protect, restrictTo } = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Gestion des utilisateurs
 */

// Routes protégées (nécessitent une authentification)
router.use(protect);

// Profil de l'utilisateur connecté
router.get('/me', (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      user: req.user
    }
  });
});

/**
 * @swagger
 * /api/users/profile:
 *   put:
 *     summary: Mettre à jour son profil
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               phone:
 *                 type: string
 *               profilePicture:
 *                 type: string
 *                 format: binary
 *               producteurInfo:
 *                 type: object
 *               livreurInfo:
 *                 type: object
 *     responses:
 *       200:
 *         description: Profil mis à jour avec succès
 */
router.put('/profile', upload.single('profilePicture'), userController.updateProfile);

/**
 * @swagger
 * /api/users/change-password:
 *   put:
 *     summary: Changer son mot de passe
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *               - confirmPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 format: password
 *                 description: Ancien mot de passe
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 description: Nouveau mot de passe (minimum 8 caractères)
 *               confirmPassword:
 *                 type: string
 *                 format: password
 *                 description: Confirmation du nouveau mot de passe
 *     responses:
 *       200:
 *         description: Mot de passe modifié avec succès
 *       400:
 *         description: Erreur de validation
 *       401:
 *         description: Ancien mot de passe incorrect
 */
router.put('/change-password', userController.changePassword);

/**
 * @swagger
 * /api/users/preferences:
 *   put:
 *     summary: Mettre à jour ses préférences
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 */
router.put('/preferences', userController.updatePreferences);

/**
 * @swagger
 * /api/users/profile/:id:
 *   get:
 *     summary: Obtenir le profil d'un utilisateur
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 */
router.get('/profile/:id', userController.getUserProfile);

/**
 * @swagger
 * /api/users/stats:
 *   get:
 *     summary: Obtenir ses statistiques (producteur)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 */
router.get('/stats', restrictTo('producteur', 'producer'), userController.getMyStats);

// Debug: controller exports and handler availability
try {
  const keys = Object.keys(userController || {});
  console.log('[users.routes] controller keys:', keys);
  console.log('[users.routes] types:', {
    getProducerDashboard: typeof userController.getProducerDashboard,
    getProducerOrders: typeof userController.getProducerOrders
  });
} catch (e) {
  console.warn('[users.routes] debug failed:', e?.message);
}

// Producer dashboard summary (guarded)
if (typeof userController.getProducerDashboard === 'function') {
  router.get('/producer/dashboard', restrictTo('producteur', 'producer'), userController.getProducerDashboard);
}

// Producer orders (paginated) (guarded)
if (typeof userController.getProducerOrders === 'function') {
  router.get('/producer/orders', restrictTo('producteur', 'producer'), userController.getProducerOrders);
}

/**
 * @swagger
 * /api/users/deliverer/stats:
 *   get:
 *     summary: Obtenir ses statistiques (livreur)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 */
router.get('/deliverer/stats', restrictTo('livreur', 'deliverer'), userController.getDelivererStats);

/**
 * @swagger
 * /api/users/producers:
 *   get:
 *     summary: Obtenir la liste des producteurs
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 */
router.get('/producers', userController.getProducers);

/**
 * @swagger
 * /api/users/account:
 *   delete:
 *     summary: Supprimer son compte
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 */
router.delete('/account', userController.deleteAccount);

module.exports = router;
