const rateLimit = require('express-rate-limit');

// Limite générale
exports.generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: {
    status: 'error',
    message: 'Trop de requêtes depuis cette IP, veuillez réessayer plus tard'
  }
});

// Limite pour l'authentification
exports.authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  skipSuccessfulRequests: true,
  message: {
    status: 'error',
    message: 'Trop de tentatives de connexion. Veuillez réessayer dans 15 minutes'
  }
});

// Limite pour la création de contenu
exports.createLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 heure
  max: 20,
  message: {
    status: 'error',
    message: 'Limite de création atteinte. Veuillez réessayer plus tard'
  }
});

console.log(' Tous les middlewares ont été créés avec succès !');