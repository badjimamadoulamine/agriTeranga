const express = require('express');
const router = express.Router();
const formationController = require('../controllers/formation.controller');
const { protect, restrictTo } = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');

/**
 * @swagger
 * tags:
 *   name: Formations
 *   description: Formations agricoles
 */

/**
 * @swagger
 * /formations:
 *   get:
 *     summary: Obtenir toutes les formations
 *     tags: [Formations]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *       - in: query
 *         name: level
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Liste des formations
 */
router.get('/', formationController.getAllFormations);

/**
 * @swagger
 * /formations/{id}:
 *   get:
 *     summary: Obtenir une formation par ID
 *     tags: [Formations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Détails de la formation
 */
router.get('/:id', formationController.getFormation);

/**
 * @swagger
 * /formations:
 *   post:
 *     summary: Créer une nouvelle formation (Admin uniquement)
 *     tags: [Formations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - category
 *               - type
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *               type:
 *                 type: string
 *               level:
 *                 type: string
 *               duration:
 *                 type: number
 *               thumbnail:
 *                 type: string
 *                 format: binary
 *               videoUrl:
 *                 type: string
 *               articleText:
 *                 type: string
 *     responses:
 *       201:
 *         description: Formation créée
 */
router.post('/', protect, restrictTo('admin'), upload.single('thumbnail'), formationController.createFormation);

/**
 * @swagger
 * /formations/{id}:
 *   put:
 *     summary: Modifier une formation
 *     tags: [Formations]
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
 *     responses:
 *       200:
 *         description: Formation modifiée
 */
router.put('/:id', protect, restrictTo('admin'), formationController.updateFormation);

/**
 * @swagger
 * /formations/{id}:
 *   delete:
 *     summary: Supprimer une formation
 *     tags: [Formations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Formation supprimée
 */
router.delete('/:id', protect, restrictTo('admin'), formationController.deleteFormation);

/**
 * @swagger
 * /formations/{id}/enroll:
 *   post:
 *     summary: S'inscrire à une formation
 *     tags: [Formations]
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
 *         description: Inscription réussie
 */
router.post('/:id/enroll', protect, formationController.enrollFormation);

/**
 * @swagger
 * /formations/{id}/progress:
 *   patch:
 *     summary: Mettre à jour la progression
 *     tags: [Formations]
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
 *               - progress
 *             properties:
 *               progress:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 100
 *     responses:
 *       200:
 *         description: Progression mise à jour
 */
router.patch('/:id/progress', protect, formationController.updateProgress);

/**
 * @swagger
 * /formations/my/enrolled:
 *   get:
 *     summary: Obtenir mes formations
 *     tags: [Formations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Mes formations
 */
router.get('/my/enrolled', protect, formationController.getMyFormations);

module.exports = router;