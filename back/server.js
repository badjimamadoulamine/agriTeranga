require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/config/database');

// Connexion à la base de données
connectDB();

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(` Serveur démarré sur le port ${PORT}`);
  console.log(` Documentation: http://localhost:${PORT}/api-docs`);
  console.log(` Health check: http://localhost:${PORT}/health`);
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