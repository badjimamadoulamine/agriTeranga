require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/config/database');
const jwt = require('jsonwebtoken');
const { Server } = require('socket.io');

// Connexion à la base de données
connectDB();

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(` Serveur démarré sur le port ${PORT}`);
  console.log(` Documentation: http://localhost:${PORT}/api-docs`);
  console.log(` Health check: http://localhost:${PORT}/health`);
});

// Socket.IO
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

app.set('io', io);

io.use((socket, next) => {
  try {
    const auth = socket.handshake.auth || {};
    const headers = socket.handshake.headers || {};
    let token = auth.token;
    if (!token && headers.authorization && headers.authorization.startsWith('Bearer ')) {
      token = headers.authorization.split(' ')[1];
    }
    if (!token) return next(new Error('No token'));
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = { id: decoded.id };
    return next();
  } catch (e) {
    return next(new Error('Unauthorized'));
  }
});

io.on('connection', (socket) => {
  try {
    const userId = socket.user?.id;
    if (userId) {
      socket.join(`user:${userId}`);
    }
    socket.emit('notifications:hello', { message: 'connected' });

    socket.on('disconnect', () => {
      // cleanup if needed
    });
  } catch {}
});

// Gestion des erreurs non capturées
process.on('unhandledRejection', (err) => {
  console.log(' UNHANDLED REJECTION! Arrêt du serveur...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

process.on('SIGTERM', () => {
  console.log(' SIGTERM reçu. Arrêt gracieux du serveur');
  server.close(() => {
    console.log(' Processus terminé');
  });
});