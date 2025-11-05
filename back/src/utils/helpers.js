/**
 * Fonctions utilitaires réutilisables
 */

/**
 * Génère un code aléatoire
 * @param {number} length - Longueur du code
 * @returns {string} Code aléatoire
 */
exports.generateCode = (length = 6) => {
  return Math.random()
    .toString(36)
    .substring(2, 2 + length)
    .toUpperCase();
};

/**
 * Génère un code numérique aléatoire
 * @param {number} length - Longueur du code
 * @returns {string} Code numérique
 */
exports.generateNumericCode = (length = 6) => {
  let code = '';
  for (let i = 0; i < length; i++) {
    code += Math.floor(Math.random() * 10);
  }
  return code;
};

/**
 * Formate un numéro de téléphone
 * @param {string} phone - Numéro de téléphone
 * @returns {string} Numéro formaté
 */
exports.formatPhone = (phone) => {
  if (!phone) return '';
  // Supprime tous les espaces et caractères spéciaux
  const cleaned = phone.replace(/\D/g, '');
  return cleaned;
};

/**
 * Valide un email
 * @param {string} email - Email à valider
 * @returns {boolean} True si valide
 */
exports.isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Valide un numéro de téléphone
 * @param {string} phone - Téléphone à valider
 * @returns {boolean} True si valide
 */
exports.isValidPhone = (phone) => {
  const phoneRegex = /^\+?[1-9]\d{7,14}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

/**
 * Calcule la distance entre deux coordonnées GPS (formule de Haversine)
 * @param {number} lat1 - Latitude point 1
 * @param {number} lon1 - Longitude point 1
 * @param {number} lat2 - Latitude point 2
 * @param {number} lon2 - Longitude point 2
 * @returns {number} Distance en kilomètres
 */
exports.calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Rayon de la Terre en km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const toRad = (value) => {
  return (value * Math.PI) / 180;
};

/**
 * Formate un prix avec la devise
 * @param {number} amount - Montant
 * @param {string} currency - Devise (par défaut: FCFA)
 * @returns {string} Prix formaté
 */
exports.formatPrice = (amount, currency = 'FCFA') => {
  return `${amount.toLocaleString('fr-FR')} ${currency}`;
};

/**
 * Tronque un texte
 * @param {string} text - Texte à tronquer
 * @param {number} length - Longueur maximale
 * @returns {string} Texte tronqué
 */
exports.truncateText = (text, length = 100) => {
  if (!text || text.length <= length) return text;
  return text.substring(0, length) + '...';
};

/**
 * Sanitize une chaîne de caractères
 * @param {string} str - Chaîne à sanitizer
 * @returns {string} Chaîne sanitizée
 */
exports.sanitizeString = (str) => {
  if (!str) return '';
  return str.trim().replace(/[<>]/g, '');
};

/**
 * Pagination helper
 * @param {number} page - Numéro de page
 * @param {number} limit - Limite par page
 * @returns {Object} Skip et limit pour MongoDB
 */
exports.getPagination = (page = 1, limit = 10) => {
  const pageNum = parseInt(page) || 1;
  const limitNum = parseInt(limit) || 10;
  const skip = (pageNum - 1) * limitNum;
  return { skip, limit: limitNum, page: pageNum };
};

/**
 * Génère une réponse de pagination
 * @param {Array} data - Données
 * @param {number} page - Page actuelle
 * @param {number} limit - Limite par page
 * @param {number} total - Total d'items
 * @returns {Object} Réponse paginée
 */
exports.paginatedResponse = (data, page, limit, total) => {
  return {
    data,
    pagination: {
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      itemsPerPage: parseInt(limit),
      hasNext: page * limit < total,
      hasPrev: page > 1,
    },
  };
};

/**
 * Génère un slug à partir d'un texte
 * @param {string} text - Texte source
 * @returns {string} Slug généré
 */
exports.slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
};

/**
 * Vérifie si une date est passée
 * @param {Date|string} date - Date à vérifier
 * @returns {boolean} True si la date est passée
 */
exports.isPastDate = (date) => {
  return new Date(date) < new Date();
};

/**
 * Ajoute des jours à une date
 * @param {Date} date - Date de départ
 * @param {number} days - Nombre de jours à ajouter
 * @returns {Date} Nouvelle date
 */
exports.addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

/**
 * Retourne un objet sans les champs indésirables
 * @param {Object} obj - Objet source
 * @param {Array} fields - Champs à exclure
 * @returns {Object} Objet filtré
 */
exports.excludeFields = (obj, fields = []) => {
  const newObj = { ...obj };
  fields.forEach((field) => delete newObj[field]);
  return newObj;
};
