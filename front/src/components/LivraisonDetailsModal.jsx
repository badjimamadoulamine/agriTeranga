import React from 'react';
import { X, Package, Truck, Clock, MapPin, User, Phone, Mail } from 'lucide-react';

const LivraisonDetailsModal = ({ isOpen, onClose, commandeDetails }) => {
  if (!isOpen) return null;

  // Données d'exemple pour la commande
  const details = {
    numeroCommande: '#AT-12345',
    dateCommande: '28 Octobre 2025',
    dateLivraison: '25 Décembre 2025',
    statut: 'En route',
    client: {
      nom: 'Jean Dupont',
      email: 'jean.dupont@email.com',
      telephone: '+221 77 123 45 67',
      adresse: '123 Rue de Dakar, Dakar, Sénégal'
    },
    livreur: {
      nom: 'Moussa Diallo',
      telephone: '+221 77 987 65 43',
      photo: '/src/assets/livreur.jpg'
    },
    articles: [
      {
        id: 1,
        nom: 'Avocat Premium',
        quantite: 3,
        prix: 2500,
        image: '/src/assets/product.jpg'
      },
      {
        id: 2,
        nom: 'Tomate Bio',
        quantite: 2,
        prix: 1200,
        image: '/src/assets/product.jpg'
      },
      {
        id: 3,
        nom: 'Carotte Fraîche',
        quantite: 5,
        prix: 800,
        image: '/src/assets/product.jpg'
      }
    ],
    recapitulatif: {
      sousTotal: 11600,
      fraisLivraison: 1500,
      total: 13100
    },
    suivi: [
      {
        statut: 'Commande confirmée',
        date: '28 Oct 2025, 09:00',
        description: 'Votre commande a été confirmée par le vendeur',
        completed: true
      },
      {
        statut: 'En préparation',
        date: '28 Oct 2025, 10:30',
        description: 'Votre commande est en cours de préparation',
        completed: true
      },
      {
        statut: 'En route',
        date: '28 Oct 2025, 14:15',
        description: 'Votre commande est en cours de livraison',
        completed: true
      },
      {
        statut: 'Livré',
        date: 'Estimé: 25 Déc 2025',
        description: 'Votre commande sera livrée à destination',
        completed: false
      }
    ]
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            Détails de la commande {details.numeroCommande}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} className="text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Colonne gauche - Informations */}
            <div className="space-y-6">
              {/* Statut et dates */}
              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-green-800">Statut de la commande</h3>
                  <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {details.statut}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Date de commande:</span>
                    <p className="font-medium">{details.dateCommande}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Livraison estimée:</span>
                    <p className="font-medium">{details.dateLivraison}</p>
                  </div>
                </div>
              </div>

              {/* Informations client */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <User className="mr-2" size={20} />
                  Informations client
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <User className="mr-2 text-gray-500" size={16} />
                    <span className="font-medium">{details.client.nom}</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="mr-2 text-gray-500" size={16} />
                    <span>{details.client.email}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="mr-2 text-gray-500" size={16} />
                    <span>{details.client.telephone}</span>
                  </div>
                  <div className="flex items-start">
                    <MapPin className="mr-2 mt-1 text-gray-500" size={16} />
                    <span>{details.client.adresse}</span>
                  </div>
                </div>
              </div>

              {/* Informations livreur */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center">
                  <Truck className="mr-2" size={20} />
                  Livreur assigné
                </h3>
                <div className="flex items-center space-x-3">
                  <img
                    src={details.livreur.photo}
                    alt={details.livreur.nom}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium text-blue-900">{details.livreur.nom}</p>
                    <div className="flex items-center text-sm text-blue-700">
                      <Phone className="mr-1" size={14} />
                      {details.livreur.telephone}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Colonne droite - Articles et suivi */}
            <div className="space-y-6">
              {/* Articles commandés */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Package className="mr-2" size={20} />
                  Articles commandés
                </h3>
                <div className="space-y-3">
                  {details.articles.map((article) => (
                    <div key={article.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <img
                        src={article.image}
                        alt={article.nom}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{article.nom}</h4>
                        <p className="text-sm text-gray-600">Quantité: {article.quantite}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          {article.prix * article.quantite} FCFA
                        </p>
                        <p className="text-sm text-gray-600">{article.prix} FCFA/u</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Récapitulatif */}
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Sous-total:</span>
                      <span>{details.recapitulatif.sousTotal} FCFA</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Frais de livraison:</span>
                      <span>{details.recapitulatif.fraisLivraison} FCFA</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between font-semibold text-lg">
                      <span>Total:</span>
                      <span>{details.recapitulatif.total} FCFA</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Suivi de commande */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Clock className="mr-2" size={20} />
              Suivi de la commande
            </h3>
            <div className="space-y-4">
              {details.suivi.map((etape, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    etape.completed ? 'bg-green-600' : 'bg-gray-300'
                  }`}>
                    {etape.completed ? (
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <div className="w-3 h-3 border-2 border-white rounded-full"></div>
                    )}
                  </div>
                  <div className="flex-1 pb-4">
                    <h4 className={`font-medium ${
                      etape.completed ? 'text-green-800' : 'text-gray-600'
                    }`}>
                      {etape.statut}
                    </h4>
                    <p className="text-sm text-gray-600">{etape.date}</p>
                    <p className="text-sm text-gray-500 mt-1">{etape.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Fermer
            </button>
            <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              Contacter le livreur
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LivraisonDetailsModal;