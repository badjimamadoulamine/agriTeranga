const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Plateforme Agriculture',
      version: '1.0.0',
      description: 'Documentation complète de l\'API pour la plateforme de vente directe de produits agricoles',
      contact: {
        name: 'Support API',
        email: 'support@agriculture-platform.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:5000/api/v1',
        description: 'Serveur de développement'
      },
      {
        url: 'https://api.agriculture-platform.com/api/v1',
        description: 'Serveur de production'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            email: { type: 'string' },
            phone: { type: 'string' },
            role: { type: 'string', enum: ['consommateur', 'producteur', 'livreur', 'admin'] },
            profilePicture: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        Product: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            description: { type: 'string' },
            price: { type: 'number' },
            category: { type: 'string' },
            stock: { type: 'number' },
            images: { type: 'array', items: { type: 'string' } },
            producteur: { type: 'string' }
          }
        },
        Order: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            consommateur: { type: 'string' },
            items: { type: 'array' },
            totalAmount: { type: 'number' },
            status: { type: 'string', enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'] },
            paymentMethod: { type: 'string' },
            deliveryAddress: { type: 'object' }
          }
        }
      }
    },
    security: [{
      bearerAuth: []
    }]
  },
  apis: ['./src/routes/*.js', './src/models/*.js']
};

module.exports = swaggerJsdoc(options);

console.log('Structure API complète créée avec succès !');
console.log('Prochaines étapes :');
console.log('1. npm install');
console.log('2. Créer le fichier .env avec vos configurations');
console.log('3. npm run dev pour lancer le serveur');