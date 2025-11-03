exports.errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      stack: err.stack,
      error: err
    });
  } else {
    // Production - ne pas exposer les détails
    if (err.isOperational) {
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message
      });
    } else {
      console.error('ERROR ', err);
      res.status(500).json({
        status: 'error',
        message: 'Une erreur est survenue'
      });
    }
  }
};

// Erreur personnalisée
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

exports.AppError = AppError;

// Gestion des erreurs Mongoose
exports.handleCastErrorDB = err => {
  const message = `Valeur invalide: ${err.value}`;
  return new AppError(message, 400);
};

exports.handleDuplicateFieldsDB = err => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Valeur dupliquée: ${value}. Veuillez utiliser une autre valeur`;
  return new AppError(message, 400);
};

exports.handleValidationErrorDB = err => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `Données invalides. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

exports.handleJWTError = () =>
  new AppError('Token invalide. Veuillez vous reconnecter', 401);

exports.handleJWTExpiredError = () =>
  new AppError('Votre session a expiré. Veuillez vous reconnecter', 401);
