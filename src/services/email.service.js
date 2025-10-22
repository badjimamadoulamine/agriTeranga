/**
 * Service d'envoi d'emails
 * Gère l'envoi d'emails via SMTP
 */

const nodemailer = require('nodemailer');
const env = require('../config/env');
const logger = require('../utils/logger');

/**
 * Crée le transporteur SMTP
 */
const createTransporter = () => {
  return nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: false, // true pour le port 465, false pour les autres ports
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASSWORD,
    },
  });
};

/**
 * Envoie un email
 * @param {Object} options - Options d'envoi
 * @param {string} options.to - Destinataire
 * @param {string} options.subject - Sujet
 * @param {string} options.text - Texte brut
 * @param {string} options.html - HTML
 * @returns {Promise}
 */
exports.sendEmail = async ({ to, subject, text, html }) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `${env.FROM_NAME} <${env.FROM_EMAIL}>`,
      to,
      subject,
      text,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    logger.success(`Email envoyé à ${to}: ${info.messageId}`);
    return info;
  } catch (error) {
    logger.error('Erreur lors de l\'envoi de l\'email:', error);
    throw error;
  }
};

/**
 * Envoie un email de bienvenue
 * @param {Object} user - Utilisateur
 * @returns {Promise}
 */
exports.sendWelcomeEmail = async (user) => {
  const subject = 'Bienvenue sur la plateforme agriTeranga';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <!-- Logo de la plateforme -->
      <div style="text-align: center; margin-bottom: 20px;">
        <img src="${env.LOGO_URL}" 
             alt="Logo agriTeranga" 
             style="max-width: 150px; height: auto;" />
      </div>
      <h2 style="color: #2ecc71; text-align: center;">Bienvenue ${user.firstName} !</h2>
      <p>Nous sommes ravis de vous compter parmi nous.</p>
      <p>Votre compte a été créé avec succès en tant que <strong>${user.role}</strong>.</p>
      <p>Vous pouvez dès maintenant vous connecter et profiter de nos services.</p>
      <br>
      <p>Cordialement,<br>L'équipe agriTeranga</p>
    </div>
  `;

  return exports.sendEmail({
    to: user.email,
    subject,
    html,
    text: `Bienvenue ${user.firstName} ! Votre compte a été créé avec succès.`,
  });
};

/**
 * Envoie un email de vérification de compte
 * @param {Object} user - Utilisateur
 * @param {string} verificationToken - Token de vérification
 * @returns {Promise}
 */
exports.sendVerificationEmail = async (user, verificationToken) => {
  const verificationUrl = `${env.FRONTEND_URL}/verify-email/${verificationToken}`;
  const subject = 'Vérifiez votre compte';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
      <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <!-- Logo de la plateforme -->
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="${env.LOGO_URL}" 
               alt="Logo agriTeranga" 
               style="max-width: 150px; height: auto;" />
        </div>
        <h2 style="color: #2ecc71; text-align: center;">Bienvenue ${user.firstName} !</h2>
        <p style="font-size: 16px; color: #333;">Merci de vous être inscrit sur notre plateforme agriTeranga.</p>
        <p style="font-size: 16px; color: #333;">Pour activer votre compte et commencer à utiliser nos services, veuillez cliquer sur le bouton ci-dessous :</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" 
             style="display: inline-block; 
                    padding: 15px 40px; 
                    background-color: #2ecc71; 
                    color: white; 
                    text-decoration: none; 
                    border-radius: 5px;
                    font-weight: bold;
                    font-size: 16px;">
            Vérifier mon compte
          </a>
        </div>
        
        <p style="font-size: 14px; color: #666; margin-top: 30px;">
          Ou copiez ce lien dans votre navigateur :
        </p>
        <p style="font-size: 12px; color: #3498db; word-break: break-all;">
          ${verificationUrl}
        </p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
          <p style="font-size: 13px; color: #999; margin: 5px 0;">
            <strong>⏱ Durée de validité :</strong> Ce lien est valide pendant 24 heures.
          </p>
          <p style="font-size: 13px; color: #999; margin: 5px 0;">
            <strong>ℹ Note :</strong> Si vous n'avez pas créé de compte, ignorez cet email.
          </p>
        </div>
        
        <p style="margin-top: 30px; font-size: 14px; color: #555;">
          Cordialement,<br>
          <strong>L'équipe agriTeranga</strong>
        </p>
      </div>
    </div>
  `;

  return exports.sendEmail({
    to: user.email,
    subject,
    html,
    text: `Bienvenue ${user.firstName} ! Veuillez vérifier votre compte en cliquant sur ce lien : ${verificationUrl}. Ce lien est valide pendant 24 heures.`,
  });
};

/**
 * Envoie un email de réinitialisation de mot de passe
 * @param {Object} user - Utilisateur
 * @param {string} resetToken - Token de réinitialisation
 * @returns {Promise}
 */
exports.sendPasswordResetEmail = async (user, resetToken) => {
  const resetUrl = `${env.FRONTEND_URL}/reset-password/${resetToken}`;
  const subject = 'Réinitialisation de votre mot de passe';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <!-- Logo de la plateforme -->
      <div style="text-align: center; margin-bottom: 20px;">
        <img src="${env.LOGO_URL}" 
             alt="Logo agriTeranga" 
             style="max-width: 150px; height: auto;" />
      </div>
      <h2 style="color: #3498db; text-align: center;">Réinitialisation de mot de passe</h2>
      <p>Bonjour ${user.firstName},</p>
      <p>Vous avez demandé la réinitialisation de votre mot de passe.</p>
      <p>Cliquez sur le lien ci-dessous pour réinitialiser votre mot de passe :</p>
      <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #3498db; color: white; text-decoration: none; border-radius: 5px;">Réinitialiser mon mot de passe</a>
      <p style="margin-top: 20px;">Ce lien est valide pendant 1 heure.</p>
      <p>Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.</p>
      <br>
      <p>Cordialement,<br>L'équipe agriTeranga</p>
    </div>
  `;

  return exports.sendEmail({
    to: user.email,
    subject,
    html,
    text: `Réinitialisation de mot de passe. Lien: ${resetUrl}`,
  });
};

/**
 * Envoie un email de confirmation de commande
 * @param {Object} order - Commande
 * @param {Object} user - Utilisateur
 * @returns {Promise}
 */
exports.sendOrderConfirmationEmail = async (order, user) => {
  const subject = `Confirmation de commande #${order.orderNumber}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <!-- Logo de la plateforme -->
      <div style="text-align: center; margin-bottom: 20px;">
        <img src="${env.LOGO_URL}" 
             alt="Logo agriTeranga" 
             style="max-width: 150px; height: auto;" />
      </div>
      <h2 style="color: #2ecc71; text-align: center;">Commande confirmée !</h2>
      <p>Bonjour ${user.firstName},</p>
      <p>Votre commande <strong>#${order.orderNumber}</strong> a été confirmée.</p>
      <p><strong>Montant total :</strong> ${order.totalPrice} FCFA</p>
      <p><strong>Statut :</strong> ${order.status}</p>
      <p>Vous recevrez une notification lorsque votre commande sera prête.</p>
      <br>
      <p>Cordialement,<br>L'équipe agriTeranga</p>
    </div>
  `;

  return exports.sendEmail({
    to: user.email,
    subject,
    html,
    text: `Commande #${order.orderNumber} confirmée. Montant: ${order.totalPrice} FCFA`,
  });
};
