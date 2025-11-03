const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Créer une commande
exports.createOrder = async (req, res) => {
  try {
    const { items, paymentMethod, deliveryInfo, notes } = req.body;

    // Calculer le montant total
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);
      
      if (!product) {
        return res.status(404).json({
          status: 'error',
          message: `Produit ${item.product} non trouvé`
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          status: 'error',
          message: `Stock insuffisant pour ${product.name}`
        });
      }

      const subtotal = product.price * item.quantity;
      totalAmount += subtotal;

      orderItems.push({
        product: product._id,
        producer: product.producer,
        quantity: item.quantity,
        price: product.price,
        subtotal
      });

      // Déduire du stock
      product.stock -= item.quantity;
      await product.save();
    }

    const order = await Order.create({
      consumer: req.user.id,
      items: orderItems,
      totalAmount,
      paymentMethod,
      deliveryInfo,
      notes,
      statusHistory: [{
        status: 'pending',
        updatedBy: req.user.id,
        timestamp: Date.now()
      }]
    });

    // Vider le panier
    await Cart.findOneAndUpdate(
      { user: req.user.id },
      { items: [], totalAmount: 0 }
    );

    await order.populate('items.product items.producer consumer');

    res.status(201).json({
      status: 'success',
      data: {
        order
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Obtenir mes commandes (consommateur)
exports.getMyOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const query = { consumer: req.user.id };

    if (status) query.status = status;

    const skip = (page - 1) * limit;

    const orders = await Order.find(query)
      .populate('items.product items.producer')
      .populate('deliveryInfo.deliverer', 'firstName lastName phone')
      .sort('-createdAt')
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Order.countDocuments(query);

    res.status(200).json({
      status: 'success',
      results: orders.length,
      total,
      data: {
        orders
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Obtenir une commande par ID
exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('consumer', 'firstName lastName email phone')
      .populate('items.product')
      .populate('items.producer', 'firstName lastName phone')
      .populate('deliveryInfo.deliverer', 'firstName lastName phone')
      .populate('statusHistory.updatedBy', 'firstName lastName');

    if (!order) {
      return res.status(404).json({
        status: 'error',
        message: 'Commande non trouvée'
      });
    }

    // Vérifier les permissions - tous les acteurs impliqués peuvent voir
    const isConsumer = order.consumer._id.toString() === req.user.id;
    const isProducer = order.items.some(item => item.producer._id.toString() === req.user.id);
    const isDeliverer = order.deliveryInfo?.deliverer?._id?.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!isConsumer && !isProducer && !isDeliverer && !isAdmin) {
      return res.status(403).json({
        status: 'error',
        message: 'Accès non autorisé'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        order
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Mettre à jour le statut
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        status: 'error',
        message: 'Commande non trouvée'
      });
    }

    order.status = status;
    order.statusHistory.push({
      status,
      updatedBy: req.user.id,
      timestamp: Date.now()
    });

    if (status === 'delivered') {
      order.deliveryInfo.actualDeliveryDate = new Date();
    }

    await order.save();

    await order.populate('consumer items.product items.producer deliveryInfo.deliverer statusHistory.updatedBy');

    res.status(200).json({
      status: 'success',
      data: {
        order
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Annuler une commande
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        status: 'error',
        message: 'Commande non trouvée'
      });
    }

    if (order.consumer.toString() !== req.user.id) {
      return res.status(403).json({
        status: 'error',
        message: 'Non autorisé'
      });
    }

    if (['shipped', 'delivered'].includes(order.status)) {
      return res.status(400).json({
        status: 'error',
        message: 'Cette commande ne peut plus être annulée'
      });
    }

    order.status = 'cancelled';
    order.statusHistory.push({
      status: 'cancelled',
      updatedBy: req.user.id,
      timestamp: Date.now()
    });

    // Remettre les produits en stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity }
      });
    }

    await order.save();

    res.status(200).json({
      status: 'success',
      data: {
        order
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Obtenir les commandes du producteur
exports.getProducerOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const query = { 'items.producer': req.user.id };

    if (status) query.status = status;

    const skip = (page - 1) * limit;

    const orders = await Order.find(query)
      .populate('consumer', 'firstName lastName phone')
      .populate('items.product')
      .populate('deliveryInfo.deliverer', 'firstName lastName phone')
      .sort('-createdAt')
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Order.countDocuments(query);

    res.status(200).json({
      status: 'success',
      results: orders.length,
      total,
      data: {
        orders
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Obtenir les commandes du livreur
exports.getDelivererOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const query = { 'deliveryInfo.deliverer': req.user.id };

    if (status) query.status = status;

    const skip = (page - 1) * limit;

    const orders = await Order.find(query)
      .populate('consumer', 'firstName lastName phone')
      .populate('items.product items.producer', 'firstName lastName phone')
      .sort('-createdAt')
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Order.countDocuments(query);

    res.status(200).json({
      status: 'success',
      results: orders.length,
      total,
      data: {
        orders
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Obtenir l'historique complet des transactions (pour tous les acteurs)
exports.getTransactionHistory = async (req, res) => {
  try {
    const { page = 1, limit = 20, startDate, endDate, status } = req.query;
    const skip = (page - 1) * limit;

    // Construction de la requête selon le rôle
    let query = {};
    
    if (req.user.role === 'consommateur' || req.user.role === 'consumer') {
      query.consumer = req.user.id;
    } else if (req.user.role === 'producteur' || req.user.role === 'producer') {
      query['items.producer'] = req.user.id;
    } else if (req.user.role === 'livreur' || req.user.role === 'deliverer') {
      query['deliveryInfo.deliverer'] = req.user.id;
    } else if (req.user.role === 'admin') {
      // Admin voit tout
    } else {
      return res.status(403).json({
        status: 'error',
        message: 'Accès non autorisé'
      });
    }

    // Filtres additionnels
    if (status) query.status = status;
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const orders = await Order.find(query)
      .populate('consumer', 'firstName lastName email phone')
      .populate('items.product', 'name price category')
      .populate('items.producer', 'firstName lastName phone')
      .populate('deliveryInfo.deliverer', 'firstName lastName phone')
      .populate('statusHistory.updatedBy', 'firstName lastName role')
      .sort('-createdAt')
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Order.countDocuments(query);

    // Calculer les statistiques
    const stats = {
      totalTransactions: total,
      totalAmount: 0,
      byStatus: {}
    };

    orders.forEach(order => {
      stats.totalAmount += order.totalAmount;
      stats.byStatus[order.status] = (stats.byStatus[order.status] || 0) + 1;
    });

    res.status(200).json({
      status: 'success',
      results: orders.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      stats,
      data: {
        orders
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};
