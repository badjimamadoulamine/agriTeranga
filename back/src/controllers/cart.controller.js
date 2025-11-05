const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Obtenir le panier
exports.getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id })
      .populate('items.product');

    if (!cart) {
      cart = await Cart.create({ user: req.user.id, items: [] });
    }

    await cart.calculateTotal();
    await cart.save();

    res.status(200).json({
      status: 'success',
      data: {
        cart
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Ajouter au panier
exports.addToCart = async (req, res) => {
  try {
    const { product, quantity } = req.body;

    const productDoc = await Product.findById(product);
    if (!productDoc) {
      return res.status(404).json({
        status: 'error',
        message: 'Produit non trouvé'
      });
    }

    let cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      cart = await Cart.create({
        user: req.user.id,
        items: [{ product, quantity }]
      });
    } else {
      const itemIndex = cart.items.findIndex(
        item => item.product.toString() === product
      );

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ product, quantity });
      }
    }

    await cart.calculateTotal();
    await cart.save();
    await cart.populate('items.product');

    res.status(200).json({
      status: 'success',
      data: {
        cart
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Mettre à jour un article
exports.updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return res.status(404).json({
        status: 'error',
        message: 'Panier non trouvé'
      });
    }

    const itemIndex = cart.items.findIndex(
      item => item.product.toString() === req.params.productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        status: 'error',
        message: 'Produit non trouvé dans le panier'
      });
    }

    if (quantity <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
    }

    await cart.calculateTotal();
    await cart.save();
    await cart.populate('items.product');

    res.status(200).json({
      status: 'success',
      data: {
        cart
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Retirer du panier
exports.removeFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return res.status(404).json({
        status: 'error',
        message: 'Panier non trouvé'
      });
    }

    cart.items = cart.items.filter(
      item => item.product.toString() !== req.params.productId
    );

    await cart.calculateTotal();
    await cart.save();
    await cart.populate('items.product');

    res.status(200).json({
      status: 'success',
      data: {
        cart
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Vider le panier
exports.clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOneAndUpdate(
      { user: req.user.id },
      { items: [], totalAmount: 0 },
      { new: true }
    );

    res.status(200).json({
      status: 'success',
      data: {
        cart
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};
