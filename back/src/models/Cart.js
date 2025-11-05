const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  totalAmount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Calculer le montant total automatiquement
cartSchema.methods.calculateTotal = async function() {
  await this.populate('items.product');
  this.totalAmount = this.items.reduce((total, item) => {
    return total + (item.product.price * item.quantity);
  }, 0);
  return this.totalAmount;
};

module.exports = mongoose.model('Cart', cartSchema);