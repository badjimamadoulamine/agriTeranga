const express = require('express');
const router = express.Router();
const messageController = require('../controllers/message.controller');
const { protect } = require('../middlewares/auth.middleware');

/**
 * @swagger
 * tags:
 *   name: Messages
 *   description: Messagerie intégrée
 */

/**
 * @swagger
 * /messages:
 *   get:
 *     summary: Obtenir tous mes messages
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: conversationWith
 *         schema:
 *           type: string
 *         description: ID de l'utilisateur avec qui on converse
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Liste des messages
 */
router.get('/', protect, messageController.getMessages);

/**
 * @swagger
 * /messages/send:
 *   post:
 *     summary: Envoyer un message
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - receiver
 *               - content
 *             properties:
 *               receiver:
 *                 type: string
 *               subject:
 *                 type: string
 *               content:
 *                 type: string
 *               relatedOrder:
 *                 type: string
 *     responses:
 *       201:
 *         description: Message envoyé
 */
router.post('/send', protect, messageController.sendMessage);

/**
 * @swagger
 * /messages/{id}:
 *   get:
 *     summary: Obtenir un message par ID
 *     tags: [Messages]
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
 *         description: Détails du message
 */
router.get('/:id', protect, messageController.getMessage);

/**
 * @swagger
 * /messages/{id}/read:
 *   patch:
 *     summary: Marquer un message comme lu
 *     tags: [Messages]
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
 *         description: Message marqué comme lu
 */
router.patch('/:id/read', protect, messageController.markAsRead);

/**
 * @swagger
 * /messages/conversations:
 *   get:
 *     summary: Obtenir toutes mes conversations
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des conversations
 */
router.get('/conversations', protect, messageController.getConversations);

/**
 * @swagger
 * /messages/unread/count:
 *   get:
 *     summary: Obtenir le nombre de messages non lus
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Nombre de messages non lus
 */
router.get('/unread/count', protect, messageController.getUnreadCount);

module.exports = router;