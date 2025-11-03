const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const RevokedToken = require('../models/RevokedToken');
const emailService = require('../services/email.service');

// Générer un token JWT
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

// Google Identity Services credential login
exports.googleLogin = async (req, res) => {
  try {
    const { credential } = req.body || {};
    if (!credential) {
      return res.status(400).json({ status: 'error', message: 'Credential manquant' });
    }

    const clientId = process.env.GOOGLE_CLIENT_ID;
    if (!clientId) {
      return res.status(500).json({ status: 'error', message: 'GOOGLE_CLIENT_ID non configuré' });
    }

    const client = new OAuth2Client(clientId);
    const ticket = await client.verifyIdToken({ idToken: credential, audience: clientId });
    const payload = ticket.getPayload();

    const email = String(payload.email || '').toLowerCase();
    const firstName = payload.given_name || '';
    const lastName = payload.family_name || '';
    const picture = payload.picture || '';

    if (!email) {
      return res.status(400).json({ status: 'error', message: 'Email Google introuvable' });
    }

    let user = await User.findOne({ email });
    if (!user) {
      // Créer un nouveau user minimal côté app (consommateur par défaut)
      user = await User.create({
        firstName,
        lastName,
        email,
        password: crypto.randomBytes(16).toString('hex'), // placeholder, non utilisé
        role: 'consommateur',
        profilePicture: picture,
        isVerified: true
      });
      try { await emailService.sendWelcomeEmail(user); } catch (_) {}
    }

    if (!user.isActive || user.isDeleted) {
      return res.status(401).json({ status: 'error', message: "Compte inactif ou supprimé" });
    }

    user.lastLogin = Date.now();
    await user.save({ validateBeforeSave: false });

    const token = signToken(user._id);
    return res.status(200).json({ status: 'success', token, data: { user } });
  } catch (error) {
    return res.status(400).json({ status: 'error', message: error.message });
  }
};

// Inscription
exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone, role, profilePicture, producteurInfo, consumerInfo, livreurInfo } = req.body;

    // Normaliser l'email pour éviter les collisions de casse
    const emailNorm = String(email || '').toLowerCase();

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email: emailNorm });
    if (existingUser) {
      return res.status(409).json({
        status: 'error',
        message: 'Cet email est déjà utilisé. Connectez-vous ou réinitialisez votre mot de passe.'
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
      email: emailNorm,
      password,
      phone,
      role,
      profilePicture,
      isVerified: false // Compte non vérifié par défaut
    };

    if (role === 'producteur' && producteurInfo) {
      userData.producteurInfo = producteurInfo;
    }

    if (role === 'consommateur') {
      userData.consumerInfo = {
        preferences: req.body.consumerInfo?.preferences || '',
        deliveryAddress: req.body.consumerInfo?.deliveryAddress || req.body.address || '',
        bio: req.body.consumerInfo?.bio || '',
        isSubscribed: req.body.consumerInfo?.isSubscribed || false
      };
    }

    if (role === 'livreur' && livreurInfo) {
      userData.livreurInfo = livreurInfo;
    }

    const user = await User.create(userData);

    // Marquer le compte comme vérifié immédiatement
    user.isVerified = true;
    await user.save({ validateBeforeSave: false });

    // Envoyer l'email de bienvenue (non bloquant)
    try {
      await emailService.sendWelcomeEmail(user);
    } catch (emailError) {
      console.error("Erreur lors de l'envoi de l'email:", emailError);
    }

    res.status(201).json({
      status: 'success',
      message: 'Inscription réussie ! Bienvenue sur notre plateforme.',
      data: { user }
    });
  } catch (error) {
    // Gérer le doublon unique MongoDB pour l'email
    if (error && (error.code === 11000 || error.code === '11000')) {
      return res.status(409).json({
        status: 'error',
        message: 'Cet email est déjà utilisé. Connectez-vous ou réinitialisez votre mot de passe.'
      });
    }

    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Connexion
exports.login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Veuillez fournir un email/téléphone et un mot de passe'
      });
    }

    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);
    const isPhone = /^\+?[1-9]\d{1,14}$/.test(identifier);

    let searchQuery;
    if (isEmail) {
      searchQuery = { email: String(identifier).toLowerCase() };
    } else if (isPhone) {
      searchQuery = { phone: identifier };
    } else {
      return res.status(400).json({
        status: 'error',
        message: "Format d'identifiant invalide. Veuillez utiliser un email ou un numéro de téléphone valide."
      });
    }

    const user = await User.findOne(searchQuery).select('+password');

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        status: 'error',
        message: 'Identifiant ou mot de passe incorrect'
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        status: 'error',
        message: 'Votre compte a été désactivé'
      });
    }

    if (user.isDeleted) {
      return res.status(401).json({
        status: 'error',
        message: "Ce compte a été supprimé. Contactez le support si vous pensez qu'il s'agit d'une erreur."
      });
    }

    user.lastLogin = Date.now();
    await user.save({ validateBeforeSave: false });

    const token = signToken(user._id);

    res.status(200).json({
      status: 'success',
      token,
      data: { user }
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

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const expiresAt = new Date(decoded.exp * 1000);

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
      data: { user }
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
    const user = await User.findOne({ email: String(req.body.email || '').toLowerCase() });

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'Aucun utilisateur trouvé avec cet email'
      });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

    await user.save({ validateBeforeSave: false });

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

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationExpire = undefined;
    await user.save({ validateBeforeSave: false });

    const token = signToken(user._id);

    const frontendUrl = process.env.FRONTEND_URL || '';
    const redirectUrl = frontendUrl ? `${frontendUrl}/login?verified=true&token=${token}` : null;
    
    res.status(200).json({
      status: 'success',
      message: 'Compte vérifié avec succès ! Vous pouvez maintenant vous connecter.',
      token,
      data: { user },
      redirectUrl
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};
