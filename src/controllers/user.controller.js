const mongoose = require('mongoose');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Delivery = require('../models/Delivery');

// Obtenir le profil d'un utilisateur
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'Utilisateur non trouvé'
      });
    }

    // Si c'est un producteur, récupérer ses produits
    let products = [];
    if (user.role === 'producer') {
      products = await Product.find({ producer: user._id, isAvailable: true })
        .select('name price images category rating')
        .limit(10);
    }

    res.status(200).json({
      status: 'success',
      data: {
        user,
        products
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Mettre à jour son profil (adapté selon le rôle)
exports.updateProfile = async (req, res) => {
  try {
    // Champs de base autorisés pour tous les utilisateurs
    const baseFields = ['firstName', 'lastName', 'phone', 'profilePicture'];
    
    // Champs spécifiques selon le rôle
    const roleSpecificFields = {
      producteur: ['producteurInfo'],
      producer: ['producteurInfo'],
      livreur: ['livreurInfo'],
      deliverer: ['livreurInfo'],
      consommateur: [],
      consumer: [],
      admin: ['producteurInfo', 'livreurInfo']
    };

    // Déterminer les champs autorisés selon le rôle de l'utilisateur
    const allowedFields = [
      ...baseFields,
      ...(roleSpecificFields[req.user.role] || []),
      'preferences'
    ];

    const updates = {};
    
    // Filtrer les champs autorisés
    Object.keys(req.body).forEach(key => {
      if (allowedFields.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    // Empêcher la modification de champs sensibles
    delete updates.password;
    delete updates.email;
    delete updates.role;
    delete updates.isActive;
    delete updates.isVerified;

    // Gérer l'upload de la photo de profil
    if (req.file) {
      updates.profilePicture = `/uploads/profiles/${req.file.filename}`;
    }

    // Validation spécifique selon le rôle
    if (req.user.role === 'producteur' || req.user.role === 'producer') {
      if (updates.producteurInfo) {
        // Valider les champs du producteur
        const validProducerFields = ['cultureType', 'region', 'farmSize', 'description', 'certificates'];
        const filteredProducerInfo = {};
        Object.keys(updates.producteurInfo).forEach(key => {
          if (validProducerFields.includes(key)) {
            filteredProducerInfo[key] = updates.producteurInfo[key];
          }
        });
        updates.producteurInfo = filteredProducerInfo;
      }
    }

    if (req.user.role === 'livreur' || req.user.role === 'deliverer') {
      if (updates.livreurInfo) {
        // Valider les champs du livreur
        const validDelivererFields = ['deliveryZone', 'vehicleType', 'isAvailable'];
        const filteredDelivererInfo = {};
        Object.keys(updates.livreurInfo).forEach(key => {
          if (validDelivererFields.includes(key)) {
            filteredDelivererInfo[key] = updates.livreurInfo[key];
          }
        });
        updates.livreurInfo = filteredDelivererInfo;
      }
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updates,
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'Utilisateur non trouvé'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Profil mis à jour avec succès',
      data: {
        user
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Changer le mot de passe
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    // Validation des champs requis
    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        status: 'error',
        message: 'Veuillez fournir l\'ancien mot de passe, le nouveau mot de passe et la confirmation'
      });
    }

    // Vérifier que les nouveaux mots de passe correspondent
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        status: 'error',
        message: 'Les nouveaux mots de passe ne correspondent pas'
      });
    }

    // Vérifier la longueur du nouveau mot de passe
    if (newPassword.length < 8) {
      return res.status(400).json({
        status: 'error',
        message: 'Le nouveau mot de passe doit contenir au moins 8 caractères'
      });
    }

    // Récupérer l'utilisateur avec le mot de passe (normalement exclu)
    const user = await User.findById(req.user.id).select('+password');

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'Utilisateur non trouvé'
      });
    }

    // Vérifier l'ancien mot de passe
    const isPasswordCorrect = await user.comparePassword(currentPassword);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        status: 'error',
        message: 'L\'ancien mot de passe est incorrect'
      });
    }

    // Vérifier que le nouveau mot de passe est différent de l'ancien
    const isSamePassword = await user.comparePassword(newPassword);
    if (isSamePassword) {
      return res.status(400).json({
        status: 'error',
        message: 'Le nouveau mot de passe doit être différent de l\'ancien'
      });
    }

    // Mettre à jour le mot de passe
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      status: 'success',
      message: 'Mot de passe modifié avec succès'
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Supprimer son compte
exports.deleteAccount = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'Utilisateur non trouvé'
      });
    }

    // Vérifier si le compte est déjà supprimé
    if (user.isDeleted) {
      return res.status(400).json({
        status: 'error',
        message: 'Ce compte est déjà supprimé'
      });
    }

    // Archiver le compte (soft delete)
    user.isDeleted = true;
    user.deletedAt = new Date();
    user.isActive = false; // Désactiver aussi
    await user.save();

    res.status(200).json({
      status: 'success',
      message: 'Compte supprimé et archivé avec succès. Vos données ont été conservées conformément à nos politiques.'
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Obtenir mes statistiques (pour producteur)
exports.getMyStats = async (req, res) => {
  try {
    if (req.user.role !== 'producer') {
      return res.status(403).json({
        status: 'error',
        message: 'Cette fonctionnalité est réservée aux producteurs'
      });
    }

    // Nombre total de produits
    const totalProducts = await Product.countDocuments({ producer: req.user.id });
    const availableProducts = await Product.countDocuments({
      producer: req.user.id,
      isAvailable: true
    });

    // Commandes reçues
    const orders = await Order.find({ 'items.producer': req.user.id });
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => o.status === 'pending').length;

    // Revenu total
    let totalRevenue = 0;
    orders.forEach(order => {
      order.items.forEach(item => {
        if (item.producer.toString() === req.user.id && order.paymentStatus === 'paid') {
          totalRevenue += item.subtotal;
        }
      });
    });

    // Produit le plus vendu
    const productSales = await Order.aggregate([
      { $unwind: '$items' },
      {
        $match: {
          'items.producer': new mongoose.Types.ObjectId(req.user.id),
          paymentStatus: 'paid'
        }
      },
      {
        $group: {
          _id: '$items.product',
          totalQuantity: { $sum: '$items.quantity' },
          totalRevenue: { $sum: '$items.subtotal' }
        }
      },
      { $sort: { totalRevenue: -1 } },
      { $limit: 1 },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' }
    ]);

    // Évaluation moyenne
    const products = await Product.find({ producer: req.user.id });
    const avgRating = products.reduce((acc, p) => acc + (p.rating?.average || 0), 0) / (products.length || 1);

    res.status(200).json({
      status: 'success',
      data: {
        products: {
          total: totalProducts,
          available: availableProducts
        },
        orders: {
          total: totalOrders,
          pending: pendingOrders
        },
        revenue: {
          total: totalRevenue
        },
        rating: {
          average: avgRating.toFixed(2)
        },
        topProduct: productSales[0] || null
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Obtenir mes statistiques (pour livreur)
exports.getDelivererStats = async (req, res) => {
  try {
    if (req.user.role !== 'deliverer') {
      return res.status(403).json({
        status: 'error',
        message: 'Cette fonctionnalité est réservée aux livreurs'
      });
    }

    const deliveries = await Delivery.find({ deliverer: req.user.id });

    const stats = {
      total: deliveries.length,
      completed: deliveries.filter(d => d.status === 'delivered').length,
      inProgress: deliveries.filter(d => ['assigned', 'picked-up', 'in-transit'].includes(d.status)).length,
      failed: deliveries.filter(d => d.status === 'failed').length,
      totalDistance: deliveries.reduce((acc, d) => acc + (d.distanceKm || 0), 0),
      totalEarnings: deliveries.reduce((acc, d) => acc + (d.deliveryFee || 0), 0)
    };

    // Livraisons ce mois-ci
    const thisMonth = new Date();
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0, 0);

    const thisMonthDeliveries = deliveries.filter(d => d.createdAt >= thisMonth).length;

    res.status(200).json({
      status: 'success',
      data: {
        ...stats,
        thisMonth: thisMonthDeliveries,
        successRate: stats.total > 0 ? ((stats.completed / stats.total) * 100).toFixed(2) : 0
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Obtenir la liste des producteurs
exports.getProducers = async (req, res) => {
  try {
    const { region, cultureType, page = 1, limit = 12 } = req.query;

    const query = { role: 'producer', isActive: true };

    if (region) query['producerInfo.region'] = region;
    if (cultureType) query['producerInfo.cultureType'] = cultureType;

    const skip = (page - 1) * limit;

    const producers = await User.find(query)
      .select('firstName lastName profilePicture producerInfo')
      .skip(skip)
      .limit(Number(limit));

    // Ajouter le nombre de produits pour chaque producteur
    const producersWithProducts = await Promise.all(
      producers.map(async (producer) => {
        const productCount = await Product.countDocuments({
          producer: producer._id,
          isAvailable: true
        });
        return {
          ...producer.toObject(),
          productCount
        };
      })
    );

    const total = await User.countDocuments(query);

    res.status(200).json({
      status: 'success',
      results: producersWithProducts.length,
      total,
      data: {
        producers: producersWithProducts
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Changer la langue/thème
exports.updatePreferences = async (req, res) => {
  try {
    const { language, theme, notifications } = req.body;

    const updates = {};
    if (language) updates['preferences.language'] = language;
    if (theme) updates['preferences.theme'] = theme;
    if (notifications) updates['preferences.notifications'] = notifications;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updates,
      { new: true }
    );

    res.status(200).json({
      status: 'success',
      data: {
        preferences: user.preferences
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

console.log(' Contrôleurs Admin et User créés avec succès !');