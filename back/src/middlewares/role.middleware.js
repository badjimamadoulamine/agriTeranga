// ===== src/middlewares/role.middleware.js =====

/**
 * Middleware pour vérifier les rôles utilisateur
 * Fonctionne avec le middleware protect (auth.middleware.js)
 */

// Vérifier si l'utilisateur est un consommateur
exports.isConsumer = (req, res, next) => {
  if (req.user && req.user.role === 'consommateur') {
    return next();
  }
  
  return res.status(403).json({
    status: 'error',
    message: 'Accès réservé aux consommateurs'
  });
};

// Vérifier si l'utilisateur est un producteur
exports.isProducer = (req, res, next) => {
  if (req.user && req.user.role === 'producteur') {
    return next();
  }
  
  return res.status(403).json({
    status: 'error',
    message: 'Accès réservé aux producteurs'
  });
};

// Vérifier si l'utilisateur est un livreur
exports.isDeliverer = (req, res, next) => {
  if (req.user && req.user.role === 'livreur') {
    return next();
  }
  
  return res.status(403).json({
    status: 'error',
    message: 'Accès réservé aux livreurs'
  });
};

// Vérifier si l'utilisateur est un administrateur
exports.isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  
  return res.status(403).json({
    status: 'error',
    message: 'Accès réservé aux administrateurs'
  });
};

// Vérifier si l'utilisateur a l'un des rôles spécifiés
exports.hasRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'Vous devez être connecté'
      });
    }

    if (roles.includes(req.user.role)) {
      return next();
    }

    return res.status(403).json({
      status: 'error',
      message: `Accès réservé aux rôles: ${roles.join(', ')}`
    });
  };
};

// Vérifier si l'utilisateur peut gérer les produits
exports.canManageProducts = (req, res, next) => {
  const allowedRoles = ['producteur', 'admin'];
  
  if (req.user && allowedRoles.includes(req.user.role)) {
    return next();
  }
  
  return res.status(403).json({
    status: 'error',
    message: 'Seuls les producteurs et administrateurs peuvent gérer les produits'
  });
};

// Vérifier si l'utilisateur peut gérer les commandes
exports.canManageOrders = (req, res, next) => {
  const allowedRoles = ['producteur', 'livreur', 'admin'];
  
  if (req.user && allowedRoles.includes(req.user.role)) {
    return next();
  }
  
  return res.status(403).json({
    status: 'error',
    message: 'Vous n\'avez pas les permissions pour gérer les commandes'
  });
};

// Vérifier si l'utilisateur peut passer des commandes
exports.canPlaceOrders = (req, res, next) => {
  const allowedRoles = ['consommateur', 'admin'];
  
  if (req.user && allowedRoles.includes(req.user.role)) {
    return next();
  }
  
  return res.status(403).json({
    status: 'error',
    message: 'Seuls les consommateurs peuvent passer des commandes'
  });
};

// Vérifier si l'utilisateur peut accéder aux formations
exports.canAccessFormations = (req, res, next) => {
  // Tous les utilisateurs connectés peuvent accéder aux formations
  if (req.user) {
    return next();
  }
  
  return res.status(401).json({
    status: 'error',
    message: 'Vous devez être connecté pour accéder aux formations'
  });
};

// Vérifier si l'utilisateur peut créer des formations
exports.canCreateFormations = (req, res, next) => {
  const allowedRoles = ['producteur', 'admin'];
  
  if (req.user && allowedRoles.includes(req.user.role)) {
    return next();
  }
  
  return res.status(403).json({
    status: 'error',
    message: 'Seuls les producteurs et administrateurs peuvent créer des formations'
  });
};

// Vérifier si l'utilisateur a vérifié son email
exports.isEmailVerified = (req, res, next) => {
  if (req.user && req.user.isEmailVerified) {
    return next();
  }
  
  return res.status(403).json({
    status: 'error',
    message: 'Veuillez vérifier votre email pour accéder à cette ressource'
  });
};

// Vérifier si le compte utilisateur est actif
exports.isAccountActive = (req, res, next) => {
  if (req.user && req.user.isActive) {
    return next();
  }
  
  return res.status(403).json({
    status: 'error',
    message: 'Votre compte est désactivé. Contactez le support'
  });
};

// Middleware combiné : vérifier rôle ET email vérifié
exports.requireVerifiedRole = (...roles) => {
  return [
    (req, res, next) => {
      if (!req.user) {
        return res.status(401).json({
          status: 'error',
          message: 'Vous devez être connecté'
        });
      }
      next();
    },
    exports.isEmailVerified,
    exports.hasRole(...roles)
  ];
};

console.log(' Middleware des rôles créé avec succès !');