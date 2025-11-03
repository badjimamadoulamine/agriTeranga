const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const productRoutes = require('./routes/product.routes');
const orderRoutes = require('./routes/order.routes');
const cartRoutes = require('./routes/cart.routes');
const deliveryRoutes = require('./routes/delivery.routes');
const messageRoutes = require('./routes/message.routes');
const formationRoutes = require('./routes/formation.routes');
const adminRoutes = require('./routes/admin.routes');

const app = express();

// Middlewares de sécurité
app.use(helmet({
  // Autoriser le chargement de ressources (images) depuis d'autres origines
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  // Permettre les popups (Google) et postMessage
  crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' }
}));

// CORS: autoriser le front local (localhost/127.0.0.1, tout port) et FRONTEND_URL
const FRONTEND_URL = process.env.FRONTEND_URL;
const localRegex = /^http:\/\/(localhost|127\.0\.0\.1)(:\\d+)?$/i;
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // allow non-browser requests
    if ((FRONTEND_URL && origin === FRONTEND_URL) || localRegex.test(origin)) {
      return callback(null, true);
    }
    return callback(null, false);
  },
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limite de 100 requêtes par IP
});
app.use('/api/', limiter);

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Data sanitization contre NoSQL injection
app.use(mongoSanitize());

// Compression
app.use(compression());

// Static files: serve uploaded images with permissive cross-origin headers
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads'), {
  setHeaders: (res) => {
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
}));

// Also serve when uploads are saved under src/uploads (dev environment)
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  setHeaders: (res) => {
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
}));

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/cart', cartRoutes);
app.use('/api/v1/deliveries', deliveryRoutes);
app.use('/api/v1/messages', messageRoutes);
app.use('/api/v1/formations', formationRoutes);
app.use('/api/v1/admin', adminRoutes);

// Route de test
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'API Agriculture fonctionne correctement'
  });
});

// Gestion des routes non trouvées
app.all('*', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: `Route ${req.originalUrl} non trouvée`
  });
});

// Gestion globale des erreurs
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

module.exports = app;