const jwt = require('jsonwebtoken');
const User = require('../models/User');
const RevokedToken = require('../models/RevokedToken');

// Protéger les routes (vérifier JWT)
exports.protect = async (req, res, next) => {
  try {
    let token;

    // Vérifier si le token existe dans le header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'Vous devez être connecté pour accéder à cette ressource'
      });
    }

    // Vérifier le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Vérifier si le token a été révoqué (blacklist)
    const isRevoked = await RevokedToken.isRevoked(token);
    if (isRevoked) {
      return res.status(401).json({
        status: 'error',
        message: 'Votre session a expiré. Veuillez vous reconnecter.'
      });
    }

    // Vérifier si l'utilisateur existe toujours
    const user = await User.findById(decoded.id).select('+password');
    
    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'L\'utilisateur n\'existe plus'
      });
    }

    // Vérifier si l'utilisateur est actif
    if (!user.isActive) {
      return res.status(401).json({
        status: 'error',
        message: 'Votre compte a été désactivé'
      });
    }

    // Mettre l'utilisateur dans la requête
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      status: 'error',
      message: 'Token invalide ou expiré'
    });
  }
};

// Restreindre l'accès à certains rôles
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'error',
        message: 'Vous n\'avez pas la permission d\'effectuer cette action'
      });
    }
    next();
  };
};

// Vérifier si c'est le propriétaire de la ressource
exports.checkOwnership = (Model, paramName = 'id') => {
  return async (req, res, next) => {
    try {
      const resource = await Model.findById(req.params[paramName]);
      
      if (!resource) {
        return res.status(404).json({
          status: 'error',
          message: 'Ressource non trouvée'
        });
      }

      // Admin peut tout faire
      if (req.user.role === 'admin') {
        return next();
      }

      // Vérifier si l'utilisateur est le propriétaire
      const ownerField = resource.user || resource.producer || resource.consumer || resource.sender;
      
      if (ownerField.toString() !== req.user.id) {
        return res.status(403).json({
          status: 'error',
          message: 'Vous n\'êtes pas autorisé à modifier cette ressource'
        });
      }

      next();
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  };
};