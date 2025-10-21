const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const RevokedToken = require('../models/RevokedToken');
const emailService = require('../services/email.service');

// Générer un token JWT
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

// Inscription
exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone, role, profilePicture, producteurInfo, consumerInfo, livreurInfo } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        status: 'error',
        message: 'Cet email est déjà utilisé'
      });
    }

    // VALIDATION STRICTE : vérifier que seules les infos du rôle choisi sont présentes
    if (role === 'producteur') {
      if (livreurInfo || consumerInfo) {
        return res.status(400).json({
          status: 'error',
          message: 'Vous avez choisi le rôle PRODUCTEUR. Veuillez envoyer uniquement producteurInfo, pas livreurInfo ni consumerInfo.'
        });
      }
    } else if (role === 'consommateur') {
      if (producteurInfo || livreurInfo) {
        return res.status(400).json({
          status: 'error',
          message: 'Vous avez choisi le rôle CONSOMMATEUR. Veuillez envoyer uniquement consumerInfo, pas producteurInfo ni livreurInfo.'
        });
      }
    } else if (role === 'livreur') {
      if (producteurInfo || consumerInfo) {
        return res.status(400).json({
          status: 'error',
          message: 'Vous avez choisi le rôle LIVREUR. Veuillez envoyer uniquement livreurInfo, pas producteurInfo ni consumerInfo.'
        });
      }
    }

    // Créer l'utilisateur
    const userData = {
      firstName,
      lastName,
      email,
      password,
      phone,
      role,
      profilePicture,
      isVerified: false // Compte non vérifié par défaut
    };

    if (role === 'producteur' && producteurInfo) {
      userData.producteurInfo = producteurInfo;
    }

    if (role === 'consommateur' && consumerInfo) {
      userData.consumerInfo = consumerInfo;
    }

    if (role === 'livreur' && livreurInfo) {
      userData.livreurInfo = livreurInfo;
    }

    const user = await User.create(userData);

    // Générer un token de vérification
    const verificationToken = crypto.randomBytes(32).toString('hex');
    user.verificationToken = crypto.createHash('sha256').update(verificationToken).digest('hex');
    user.verificationExpire = Date.now() + 24 * 60 * 60 * 1000; // 24 heures
    await user.save({ validateBeforeSave: false });

    // Envoyer l'email de vérification
    try {
      await emailService.sendVerificationEmail(user, verificationToken);
    } catch (emailError) {
      console.error('Erreur lors de l\'envoi de l\'email:', emailError);
      // On continue même si l'email n'est pas envoyé
    }

    res.status(201).json({
      status: 'success',
      message: 'Inscription réussie ! Un email de vérification a été envoyé à votre adresse.',
      data: {
        user,
        verificationToken // À retirer en production
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Connexion
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Vérifier si email et password existent
    if (!email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Veuillez fournir un email et un mot de passe'
      });
    }

    // Trouver l'utilisateur et inclure le password
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        status: 'error',
        message: 'Email ou mot de passe incorrect'
      });
    }

    // Vérifier si le compte est actif
    if (!user.isActive) {
      return res.status(401).json({
        status: 'error',
        message: 'Votre compte a été désactivé'
      });
    }

    // Vérifier si le compte est vérifié
    if (!user.isVerified) {
      return res.status(401).json({
        status: 'error',
        message: 'Veuillez vérifier votre compte via l\'email que nous vous avons envoyé.'
      });
    }

    // Mettre à jour lastLogin
    user.lastLogin = Date.now();
    await user.save({ validateBeforeSave: false });

    // Générer le token
    const token = signToken(user._id);

    res.status(200).json({
      status: 'success',
      token,
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

// Déconnexion
exports.logout = async (req, res) => {
  try {
    // Récupérer le token depuis le header
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(400).json({
        status: 'error',
        message: 'Aucun token fourni'
      });
    }

    // Décoder le token pour obtenir l'expiration
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const expiresAt = new Date(decoded.exp * 1000); // Convertir timestamp en date

    // Ajouter le token à la blacklist
    await RevokedToken.revokeToken(token, decoded.id, expiresAt, 'logout');

    res.status(200).json({
      status: 'success',
      message: 'Déconnexion réussie'
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Obtenir l'utilisateur connecté
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      status: 'success',
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

// Mot de passe oublié
exports.forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'Aucun utilisateur trouvé avec cet email'
      });
    }

    // Générer un token de réinitialisation
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

    await user.save({ validateBeforeSave: false });

    // TODO: Envoyer l'email avec le token
    const resetURL = `${req.protocol}://${req.get('host')}/api/auth/reset-password/${resetToken}`;

    res.status(200).json({
      status: 'success',
      message: 'Token de réinitialisation envoyé par email',
      resetToken, // À retirer en production
      resetURL // À retirer en production
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// Réinitialiser le mot de passe
exports.resetPassword = async (req, res) => {
  try {
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        status: 'error',
        message: 'Token invalide ou expiré'
      });
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    const token = signToken(user._id);

    res.status(200).json({
      status: 'success',
      token,
      message: 'Mot de passe réinitialisé avec succès'
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Modifier le mot de passe
exports.updatePassword = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('+password');

    // Vérifier le mot de passe actuel
    if (!(await user.comparePassword(req.body.currentPassword))) {
      return res.status(401).json({
        status: 'error',
        message: 'Mot de passe actuel incorrect'
      });
    }

    user.password = req.body.newPassword;
    await user.save();

    const token = signToken(user._id);

    res.status(200).json({
      status: 'success',
      token,
      message: 'Mot de passe modifié avec succès'
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Vérifier l'email
exports.verifyEmail = async (req, res) => {
  try {
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({
      verificationToken: hashedToken,
      verificationExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        status: 'error',
        message: 'Token de vérification invalide ou expiré'
      });
    }

    // Activer le compte
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationExpire = undefined;
    await user.save({ validateBeforeSave: false });

    // Générer le token JWT pour connexion automatique
    const token = signToken(user._id);

    res.status(200).json({
      status: 'success',
      message: 'Compte vérifié avec succès ! Vous pouvez maintenant vous connecter.',
      token,
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
