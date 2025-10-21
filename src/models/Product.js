const mongoose = require('mongoose');

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - name
 *         - price
 *         - category
 *         - producer
 *       properties:
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         price:
 *           type: number
 *         category:
 *           type: string
 *         stock:
 *           type: number
 *         unit:
 *           type: string
 *           enum: [kg, litre, unité, tonne]
 */

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Le nom du produit est requis'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'La description est requise']
  },
  price: {
    type: Number,
    required: [true, 'Le prix est requis'],
    min: 0
  },
  category: {
    type: String,
    required: [true, 'La catégorie est requise'],
    enum: ['fruits', 'légumes', 'céréales', 'tubercules', 'élevage', 'produits-transformés', 'autre']
  },
  stock: {
    type: Number,
    required: [true, 'Le stock est requis'],
    min: 0,
    default: 0
  },
  unit: {
    type: String,
    enum: ['kg', 'litre', 'unité', 'tonne', 'sac'],
    default: 'kg'
  },
  images: [{
    type: String
  }],
  producer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isOrganic: {
    type: Boolean,
    default: false
  },
  harvestDate: {
    type: Date
  },
  rating: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  tags: [String]
}, {
  timestamps: true
});

// Index pour la recherche
productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1, isAvailable: 1 });

module.exports = mongoose.model('Product', productSchema);