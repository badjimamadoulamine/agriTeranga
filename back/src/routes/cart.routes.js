const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.controller');
const { protect } = require('../middlewares/auth.middleware');

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: Gestion du panier
 */

/**
 * @swagger
 * /cart:
 *   get:
 *     summary: Obtenir mon panier
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Contenu du panier
 */
router.get('/', protect, cartController.getCart);

/**
 * @swagger
 * /cart/add:
 *   post:
 *     summary: Ajouter un produit au panier
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - product
 *               - quantity
 *             properties:
 *               product:
 *                 type: string
 *               quantity:
 *                 type: number
 *                 minimum: 1
 *     responses:
 *       200:
 *         description: Produit ajouté au panier
 */
router.post('/add', protect, cartController.addToCart);

/**
 * @swagger
 * /cart/update/{productId}:
 *   put:
 *     summary: Modifier la quantité d'un produit
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
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
 *               - quantity
 *             properties:
 *               quantity:
 *                 type: number
 *     responses:
 *       200:
 *         description: Quantité mise à jour
 */
router.put('/update/:productId', protect, cartController.updateCartItem);

/**
 * @swagger
 * /cart/remove/{productId}:
 *   delete:
 *     summary: Retirer un produit du panier
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Produit retiré
 */
router.delete('/remove/:productId', protect, cartController.removeFromCart);

/**
 * @swagger
 * /cart/clear:
 *   delete:
 *     summary: Vider le panier
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Panier vidé
 */
router.delete('/clear', protect, cartController.clearCart);

module.exports = router;

console.log('✅ Routes Produits, Commandes et Panier créées avec succès !');