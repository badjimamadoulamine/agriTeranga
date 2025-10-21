// ===== src/routes/auth.routes.js =====
const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { protect } = require('../middlewares/auth.middleware');

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: Gestion de l'authentification des utilisateurs
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Inscription d'un nouvel utilisateur
 *     tags: [Authentication]
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
 *               - profilePicture
 *               - role
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: Mamadou
 *               lastName:
 *                 type: string
 *                 example: Diop
 *               email:
 *                 type: string
 *                 format: email
 *                 example: mamadou@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 example: Password123!
 *               phone:
 *                 type: string
 *                 example: "+221771234567"
 *                 description: Numéro de téléphone (REQUIS pour tous)
 *               profilePicture:
 *                 type: string
 *                 example: "https://example.com/photo.jpg"
 *                 description: URL de la photo de profil (REQUIS pour tous)
 *               role:
 *                 type: string
 *                 enum: [consommateur, producteur, livreur]
 *                 example: producteur
 *               producteurInfo:
 *                 type: object
 *                 description: Informations spécifiques au producteur (optionnel)
 *                 properties:
 *                   cultureType:
 *                     type: string
 *                     example: maraîchage
 *                   region:
 *                     type: string
 *                     example: Thiès
 *                   farmSize:
 *                     type: string
 *                     example: 5 hectares
 *                   description:
 *                     type: string
 *                     example: Production de légumes bio
 *                   certificates:
 *                     type: array
 *                     items:
 *                       type: string
 *                     example: ["https://example.com/cert1.pdf"]
 *               livreurInfo:
 *                 type: object
 *                 description: Informations spécifiques au livreur (optionnel)
 *                 properties:
 *                   deliveryZone:
 *                     type: string
 *                     example: Dakar
 *                   vehicleType:
 *                     type: string
 *                     example: moto
 *                   capaciteCharge:
 *                     type: string
 *                     example: 500 kg
 *                   permisConduire:
 *                     type: string
 *                     example: B123456789
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 token:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Données invalides
 *       409:
 *         description: Email déjà utilisé
 */
router.post('/register', authController.register);

/**
 * @swagger
 * /auth/verify-email/{token}:
 *   get:
 *     summary: Vérifier l'email de l'utilisateur
 *     tags: [Authentication]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Token de vérification reçu par email
 *     responses:
 *       200:
 *         description: Compte vérifié avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Compte vérifié avec succès !
 *                 token:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Token invalide ou expiré
 */
router.get('/verify-email/:token', authController.verifyEmail);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Connexion d'un utilisateur
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: mamadou@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Password123!
 *     responses:
 *       200:
 *         description: Connexion réussie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 token:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Email ou mot de passe incorrect
 */
router.post('/login', authController.login);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Déconnexion de l'utilisateur
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Déconnexion réussie
 */
router.post('/logout', protect, authController.logout);

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Obtenir les informations de l'utilisateur connecté
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Informations de l'utilisateur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Non authentifié
 */
router.get('/me', protect, authController.getMe);

/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Demander la réinitialisation du mot de passe
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Email de réinitialisation envoyé
 *       404:
 *         description: Utilisateur non trouvé
 */
router.post('/forgot-password', authController.forgotPassword);

/**
 * @swagger
 * /auth/reset-password/{token}:
 *   put:
 *     summary: Réinitialiser le mot de passe
 *     tags: [Authentication]
 *     parameters:
 *       - in: path
 *         name: token
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
 *               - password
 *             properties:
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *     responses:
 *       200:
 *         description: Mot de passe réinitialisé
 *       400:
 *         description: Token invalide ou expiré
 */
router.put('/reset-password/:token', authController.resetPassword);

/**
 * @swagger
 * /auth/update-password:
 *   put:
 *     summary: Modifier son mot de passe
 *     tags: [Authentication]
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
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 format: password
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *     responses:
 *       200:
 *         description: Mot de passe modifié
 *       401:
 *         description: Mot de passe actuel incorrect
 */
router.put('/update-password', protect, authController.updatePassword);

module.exports = router;