const Delivery = require('../models/Delivery');
const Order = require('../models/Order');

// Obtenir toutes les livraisons (pour livreur)
exports.getAllDeliveries = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    const query = {};
    if (req.user.role === 'deliverer') {
      query.deliverer = req.user.id;
    }
    if (status) query.status = status;

    const skip = (page - 1) * limit;

    const deliveries = await Delivery.find(query)
      .populate('order')
      .populate('deliverer', 'firstName lastName phone')
      .sort('-createdAt')
      .skip(skip)
      .limit(Number(limit));

    const total = await Delivery.countDocuments(query);

    res.status(200).json({
      status: 'success',
      results: deliveries.length,
      total,
      data: {
        deliveries
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Obtenir les livraisons disponibles
exports.getAvailableDeliveries = async (req, res) => {
  try {
    // Commandes prêtes à être livrées sans livreur assigné
    const orders = await Order.find({
      status: 'processing',
      'deliveryInfo.method': 'home-delivery',
      'deliveryInfo.deliverer': { $exists: false }
    })
      .populate('consumer', 'firstName lastName phone')
      .populate('items.product', 'name');

    res.status(200).json({
      status: 'success',
      results: orders.length,
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

// Obtenir une livraison
exports.getDelivery = async (req, res) => {
  try {
    const delivery = await Delivery.findById(req.params.id)
      .populate('order')
      .populate('deliverer', 'firstName lastName phone');

    if (!delivery) {
      return res.status(404).json({
        status: 'error',
        message: 'Livraison non trouvée'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        delivery
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Accepter une livraison
exports.acceptDelivery = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        status: 'error',
        message: 'Commande non trouvée'
      });
    }

    if (order.deliveryInfo.deliverer) {
      return res.status(400).json({
        status: 'error',
        message: 'Cette commande a déjà un livreur assigné'
      });
    }

    // Créer la livraison
    const delivery = await Delivery.create({
      order: order._id,
      deliverer: req.user.id,
      status: 'assigned',
      pickupLocation: {
        address: 'Adresse du producteur', // À récupérer depuis le producteur
        coordinates: order.deliveryInfo.address.coordinates
      },
      deliveryLocation: {
        address: `${order.deliveryInfo.address.street}, ${order.deliveryInfo.address.city}`,
        coordinates: order.deliveryInfo.address.coordinates
      },
      estimatedTime: new Date(Date.now() + 2 * 60 * 60 * 1000) // 2 heures
    });

    // Mettre à jour la commande
    order.deliveryInfo.deliverer = req.user.id;
    order.status = 'shipped';
    order.statusHistory.push({
      status: 'shipped',
      updatedBy: req.user.id
    });
    await order.save();

    res.status(200).json({
      status: 'success',
      data: {
        delivery
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Mettre à jour le statut de livraison
exports.updateDeliveryStatus = async (req, res) => {
  try {
    const { status, notes } = req.body;

    const delivery = await Delivery.findById(req.params.id);

    if (!delivery) {
      return res.status(404).json({
        status: 'error',
        message: 'Livraison non trouvée'
      });
    }

    if (delivery.deliverer.toString() !== req.user.id) {
      return res.status(403).json({
        status: 'error',
        message: 'Vous n\'êtes pas autorisé à modifier cette livraison'
      });
    }

    delivery.status = status;
    if (notes) delivery.notes = notes;
    await delivery.save();

    // Mettre à jour la commande si nécessaire
    if (status === 'delivered') {
      await Order.findByIdAndUpdate(delivery.order, {
        status: 'delivered',
        'deliveryInfo.actualDeliveryDate': new Date(),
        $push: {
          statusHistory: {
            status: 'delivered',
            updatedBy: req.user.id
          }
        }
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        delivery
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Marquer comme terminée
exports.completeDelivery = async (req, res) => {
  try {
    const delivery = await Delivery.findById(req.params.id);

    if (!delivery) {
      return res.status(404).json({
        status: 'error',
        message: 'Livraison non trouvée'
      });
    }

    if (delivery.deliverer.toString() !== req.user.id) {
      return res.status(403).json({
        status: 'error',
        message: 'Vous n\'êtes pas autorisé à modifier cette livraison'
      });
    }

    delivery.status = 'delivered';
    delivery.actualDeliveryTime = new Date();

    // Gérer la photo de preuve si elle existe
    if (req.file) {
      delivery.proofOfDelivery.photo = `/uploads/deliveries/${req.file.filename}`;
    }

    await delivery.save();

    // Mettre à jour la commande
    await Order.findByIdAndUpdate(delivery.order, {
      status: 'delivered',
      'deliveryInfo.actualDeliveryDate': new Date(),
      $push: {
        statusHistory: {
          status: 'delivered',
          updatedBy: req.user.id
        }
      }
    });

    res.status(200).json({
      status: 'success',
      data: {
        delivery
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Obtenir l'historique de mes livraisons
exports.getMyDeliveries = async (req, res) => {
  try {
    const deliveries = await Delivery.find({ deliverer: req.user.id })
      .populate('order')
      .sort('-createdAt');

    const stats = {
      total: deliveries.length,
      completed: deliveries.filter(d => d.status === 'delivered').length,
      inProgress: deliveries.filter(d => ['assigned', 'picked-up', 'in-transit'].includes(d.status)).length,
      failed: deliveries.filter(d => d.status === 'failed').length
    };

    res.status(200).json({
      status: 'success',
      stats,
      data: {
        deliveries
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};
