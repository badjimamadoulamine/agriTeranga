const mongoose = require('mongoose');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Delivery = require('../models/Delivery');
const Formation = require('../models/Formation');

// Tableau de bord - Statistiques globales
exports.getDashboard = async (req, res) => {
  try {
    // Compter les utilisateurs
    const totalUsers = await User.countDocuments();
    const usersByRole = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } }
    ]);

    // Compter les produits
    const totalProducts = await Product.countDocuments();
    const availableProducts = await Product.countDocuments({ isAvailable: true });

    // Statistiques des commandes
    const totalOrders = await Order.countDocuments();
    const ordersByStatus = await Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Revenu total
    const revenueData = await Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    const totalRevenue = revenueData[0]?.total || 0;

    // Commandes récentes
    const recentOrders = await Order.find()
      .sort('-createdAt')
      .limit(10)
      .populate('consumer', 'firstName lastName')
      .populate('items.product', 'name');

    // Nouveaux utilisateurs cette semaine
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const newUsersThisWeek = await User.countDocuments({
      createdAt: { $gte: oneWeekAgo }
    });

    res.status(200).json({
      status: 'success',
      data: {
        users: {
          total: totalUsers,
          byRole: usersByRole,
          newThisWeek: newUsersThisWeek
        },
        products: {
          total: totalProducts,
          available: availableProducts
        },
        orders: {
          total: totalOrders,
          byStatus: ordersByStatus
        },
        revenue: {
          total: totalRevenue
        },
        recentOrders
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Obtenir tous les utilisateurs
exports.getAllUsers = async (req, res) => {
  try {
    const { role, isActive, page = 1, limit = 20, search } = req.query;

    const query = {};
    if (role) query.role = role;
    if (isActive !== undefined) query.isActive = isActive === 'true';
    if (search) {
      query.$or = [
        { firstName: new RegExp(search, 'i') },
        { lastName: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') }
      ];
    }

    const skip = (page - 1) * limit;

    const users = await User.find(query)
      .sort('-createdAt')
      .skip(skip)
      .limit(Number(limit));

    const total = await User.countDocuments(query);

    res.status(200).json({
      status: 'success',
      results: users.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      data: {
        users
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Activer/Désactiver un utilisateur
exports.toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'Utilisateur non trouvé'
      });
    }

    // Empêcher de désactiver un admin
    if (user.role === 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Impossible de désactiver un administrateur'
      });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.status(200).json({
      status: 'success',
      message: `Utilisateur ${user.isActive ? 'activé' : 'désactivé'}`,
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

// Modifier le rôle d'un utilisateur
exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'Utilisateur non trouvé'
      });
    }

    // Ne pas permettre de changer le rôle d'un admin
    if (user.role === 'admin' && req.user.id !== user.id) {
      return res.status(403).json({
        status: 'error',
        message: 'Impossible de modifier le rôle d\'un administrateur'
      });
    }

    user.role = role;
    await user.save();

    res.status(200).json({
      status: 'success',
      message: 'Rôle modifié avec succès',
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

// Obtenir toutes les commandes
exports.getAllOrders = async (req, res) => {
  try {
    const { status, startDate, endDate, page = 1, limit = 20 } = req.query;

    const query = {};
    if (status) query.status = status;
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const skip = (page - 1) * limit;

    const orders = await Order.find(query)
      .populate('consumer', 'firstName lastName email')
      .populate('items.product', 'name')
      .populate('items.producer', 'firstName lastName')
      .sort('-createdAt')
      .skip(skip)
      .limit(Number(limit));

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

// Obtenir les produits en attente
exports.getPendingProducts = async (req, res) => {
  try {
    // Note: Il faudrait ajouter un champ "approved" dans le modèle Product
    // Pour l'instant, on retourne tous les produits récents
    const products = await Product.find()
      .populate('producer', 'firstName lastName email')
      .sort('-createdAt')
      .limit(20);

    res.status(200).json({
      status: 'success',
      results: products.length,
      data: {
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

// Approuver un produit
exports.approveProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        status: 'error',
        message: 'Produit non trouvé'
      });
    }

    product.isAvailable = true;
    await product.save();

    res.status(200).json({
      status: 'success',
      message: 'Produit approuvé',
      data: {
        product
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Statistiques de ventes
exports.getSalesStats = async (req, res) => {
  try {
    const { period = 'month' } = req.query;

    let dateFilter;
    const now = new Date();

    switch (period) {
      case 'day':
        dateFilter = new Date(now.setHours(0, 0, 0, 0));
        break;
      case 'week':
        dateFilter = new Date(now.setDate(now.getDate() - 7));
        break;
      case 'month':
        dateFilter = new Date(now.setMonth(now.getMonth() - 1));
        break;
      case 'year':
        dateFilter = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      default:
        dateFilter = new Date(now.setMonth(now.getMonth() - 1));
    }

    // Ventes par période
    const salesData = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: dateFilter },
          paymentStatus: 'paid'
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: period === 'day' ? '%Y-%m-%d %H:00' : '%Y-%m-%d',
              date: '$createdAt'
            }
          },
          totalSales: { $sum: '$totalAmount' },
          orderCount: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    // Total des ventes
    const totalSales = salesData.reduce((acc, curr) => acc + curr.totalSales, 0);
    const totalOrders = salesData.reduce((acc, curr) => acc + curr.orderCount, 0);

    // Produits les plus vendus
    const topProducts = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: dateFilter },
          paymentStatus: 'paid'
        }
      },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.product',
          totalQuantity: { $sum: '$items.quantity' },
          totalRevenue: { $sum: '$items.subtotal' }
        }
      },
      { $sort: { totalRevenue: -1 } },
      { $limit: 10 },
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

    res.status(200).json({
      status: 'success',
      data: {
        period,
        totalSales,
        totalOrders,
        averageOrderValue: totalOrders > 0 ? totalSales / totalOrders : 0,
        salesByDate: salesData,
        topProducts
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Statistiques utilisateurs
exports.getUserStats = async (req, res) => {
  try {
    // Utilisateurs par rôle
    const usersByRole = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      }
    ]);

    // Utilisateurs actifs vs inactifs
    const activeUsers = await User.countDocuments({ isActive: true });
    const inactiveUsers = await User.countDocuments({ isActive: false });

    // Nouveaux utilisateurs par mois (6 derniers mois)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const newUsersByMonth = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m',
              date: '$createdAt'
            }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    // Producteurs les plus actifs
    const topProducers = await Product.aggregate([
      {
        $group: {
          _id: '$producer',
          productCount: { $sum: 1 },
          totalStock: { $sum: '$stock' }
        }
      },
      { $sort: { productCount: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'producer'
        }
      },
      { $unwind: '$producer' }
    ]);

    // Livreurs les plus actifs
    const topDeliverers = await Delivery.aggregate([
      {
        $group: {
          _id: '$deliverer',
          deliveryCount: { $sum: 1 },
          completedCount: {
            $sum: { $cond: [{ $eq: ['$status', 'delivered'] }, 1, 0] }
          }
        }
      },
      { $sort: { deliveryCount: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'deliverer'
        }
      },
      { $unwind: '$deliverer' }
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        usersByRole,
        activeUsers,
        inactiveUsers,
        newUsersByMonth,
        topProducers,
        topDeliverers
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Publier/Dépublier une formation
exports.toggleFormationPublish = async (req, res) => {
  try {
    const formation = await Formation.findById(req.params.id);

    if (!formation) {
      return res.status(404).json({
        status: 'error',
        message: 'Formation non trouvée'
      });
    }

    // Inverser le statut de publication
    formation.isPublished = !formation.isPublished;
    await formation.save();

    res.status(200).json({
      status: 'success',
      message: `Formation ${formation.isPublished ? 'publiée' : 'dépubliée'} avec succès`,
      data: {
        formation
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

