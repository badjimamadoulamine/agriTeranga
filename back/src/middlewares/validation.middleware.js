const Joi = require('joi');

// Middleware de validation générique
exports.validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path[0],
        message: detail.message
      }));

      return res.status(400).json({
        status: 'error',
        message: 'Erreur de validation',
        errors
      });
    }

    next();
  };
};

// Schémas de validation
exports.schemas = {
  // Validation pour l'inscription
  register: Joi.object({
    firstName: Joi.string().required().min(2).max(50),
    lastName: Joi.string().required().min(2).max(50),
    email: Joi.string().email().required(),
    password: Joi.string().required().min(8)
      .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])')),
    phone: Joi.string().pattern(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/).required(),
    role: Joi.string().valid('consommateur', 'producteur', 'livreur').required(),
    profilePicture: Joi.string().uri().required(),
    producteurInfo: Joi.object({
      cultureType: Joi.string(),
      region: Joi.string(),
      farmSize: Joi.string(),
      description: Joi.string(),
      certificates: Joi.array().items(Joi.string())
    }).when('role', {
      is: 'producteur',
      then: Joi.required()
    }),
    livreurInfo: Joi.object({
      deliveryZone: Joi.string().required(),
      vehicleType: Joi.string().required()
    }).when('role', {
      is: 'livreur',
      then: Joi.required()
    })
  }),

  // Validation pour la connexion
  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }),

  // Validation pour créer un produit
  createProduct: Joi.object({
    name: Joi.string().required().min(3).max(100),
    description: Joi.string().required().min(10),
    price: Joi.number().required().min(0),
    category: Joi.string().required()
      .valid('fruits', 'légumes', 'céréales', 'tubercules', 'élevage', 'produits-transformés', 'autre'),
    stock: Joi.number().required().min(0),
    unit: Joi.string().valid('kg', 'litre', 'unité', 'tonne', 'sac'),
    isOrganic: Joi.boolean(),
    harvestDate: Joi.date(),
    tags: Joi.array().items(Joi.string())
  }),

  // Validation pour créer une commande
  createOrder: Joi.object({
    items: Joi.array().items(
      Joi.object({
        product: Joi.string().required(),
        quantity: Joi.number().required().min(1)
      })
    ).required().min(1),
    paymentMethod: Joi.string()
      .valid('card', 'mobile-money', 'cash-on-delivery')
      .required(),
    deliveryInfo: Joi.object({
      method: Joi.string()
        .valid('home-delivery', 'pickup-point', 'farm-pickup')
        .required(),
      address: Joi.object({
        street: Joi.string(),
        city: Joi.string(),
        region: Joi.string(),
        postalCode: Joi.string()
      }).when('method', {
        is: 'home-delivery',
        then: Joi.required()
      })
    }).required(),
    notes: Joi.string().max(500)
  }),

  // Validation pour envoyer un message
  sendMessage: Joi.object({
    receiver: Joi.string().required(),
    subject: Joi.string().max(200),
    content: Joi.string().required().min(1).max(2000),
    relatedOrder: Joi.string()
  })
};