const Product = require('../models/Product');

// Obtenir tous les produits
exports.getAllProducts = async (req, res) => {
  try {
    const { category, search, minPrice, maxPrice, isOrganic, page = 1, limit = 12, sort = '-createdAt' } = req.query;

    const query = { isAvailable: true };

    if (category) query.category = category;
    if (isOrganic) query.isOrganic = isOrganic === 'true';
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }
    if (search) {
      query.$text = { $search: search };
    }

    const skip = (page - 1) * limit;

    const products = await Product.find(query)
      .populate('producer', 'firstName lastName profilePicture producerInfo')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Product.countDocuments(query);

    res.status(200).json({
      status: 'success',
      results: products.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
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

// Obtenir un produit par ID
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('producer', 'firstName lastName email phone profilePicture producerInfo');

    if (!product) {
      return res.status(404).json({
        status: 'error',
        message: 'Produit non trouvé'
      });
    }

    res.status(200).json({
      status: 'success',
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

// Créer un produit
exports.createProduct = async (req, res) => {
  try {
    const productData = {
      ...req.body,
      producer: req.user.id
    };

    // Gérer les images uploadées
    if (req.files && req.files.length > 0) {
      productData.images = req.files.map(file => file.path);
    }

    const product = await Product.create(productData);

    res.status(201).json({
      status: 'success',
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

// Modifier un produit
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        status: 'error',
        message: 'Produit non trouvé'
      });
    }

    // Vérifier que l'utilisateur est le propriétaire
    if (product.producer.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Vous n\'êtes pas autorisé à modifier ce produit'
      });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      status: 'success',
      data: {
        product: updatedProduct
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Supprimer un produit
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        status: 'error',
        message: 'Produit non trouvé'
      });
    }

    // Vérifier que l'utilisateur est le propriétaire ou admin
    if (product.producer.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Vous n\'êtes pas autorisé à supprimer ce produit'
      });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Ajouter un avis
exports.addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const Review = require('../models/Review');

    const review = await Review.create({
      product: req.params.id,
      user: req.user.id,
      rating,
      comment
    });

    // Mettre à jour la note moyenne du produit
    const reviews = await Review.find({ product: req.params.id });
    const avgRating = reviews.reduce((acc, rev) => acc + rev.rating, 0) / reviews.length;

    await Product.findByIdAndUpdate(req.params.id, {
      'rating.average': avgRating,
      'rating.count': reviews.length
    });

    res.status(201).json({
      status: 'success',
      data: {
        review
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};