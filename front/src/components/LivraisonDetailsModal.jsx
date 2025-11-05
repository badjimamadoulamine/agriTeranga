import React from 'react';
import { X, Package, Truck, Clock, MapPin, User, Phone, Mail } from 'lucide-react';
import { getProfilePictureUrl } from '../utils/imageUtils';
import livreurDefault from '../assets/bagage.png';


const LivraisonDetailsModal = ({ isOpen, onClose, onCancel, commandeDetails }) => {
  if (!isOpen) return null;

  // Utiliser les données passées via props, avec fallbacks neutres
  const articles = Array.isArray(commandeDetails?.articles) ? commandeDetails.articles : [];
  const recapitulatif = {
    sousTotal: Number(commandeDetails?.recapitulatif?.sousTotal || 0),
    fraisLivraison: Number(commandeDetails?.recapitulatif?.fraisLivraison || 0),
    total: Number(commandeDetails?.recapitulatif?.total || ((commandeDetails?.recapitulatif?.sousTotal || 0) + (commandeDetails?.recapitulatif?.fraisLivraison || 0)))
  };
  const meta = {
    numeroCommande: commandeDetails?.numeroCommande || '#AT-XXXXXX',
    dateCommande: commandeDetails?.dateCommande || '—',
    dateLivraison: commandeDetails?.dateLivraison || '—',
    statut: commandeDetails?.statut || 'En attente',
  };
  const client = {
    nom: commandeDetails?.client?.nom || 'Client',
    email: commandeDetails?.client?.email || '',
    telephone: commandeDetails?.client?.telephone || '',
    adresse: commandeDetails?.client?.adresse || 'Adresse non renseignée',
  };
  const livreur = {
    nom: commandeDetails?.livreur?.nom || 'Non assigné',
    telephone: commandeDetails?.livreur?.telephone || '',
    photo: commandeDetails?.livreur?.photo || '/src/assets/livreur.jpg',
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            Détails de la commande {meta.numeroCommande}
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
                    {meta.statut}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Date de commande:</span>
                    <p className="font-medium">{meta.dateCommande}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Livraison estimée:</span>
                    <p className="font-medium">{meta.dateLivraison}</p>
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
                    <span className="font-medium">{client.nom}</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="mr-2 text-gray-500" size={16} />
                    <span>{client.email}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="mr-2 text-gray-500" size={16} />
                    <span>{client.telephone}</span>
                  </div>
                  <div className="flex items-start">
                    <MapPin className="mr-2 mt-1 text-gray-500" size={16} />
                    <span>{client.adresse}</span>
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
                    src={getProfilePictureUrl(livreur.photo) || livreurDefault}
                    alt={livreur.nom || 'Livreur'}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium text-blue-900">{livreur.nom || 'Non assigné'}</p>
                    {livreur.telephone ? (
                      <a href={`tel:${livreur.telephone}`} className="flex items-center text-sm text-blue-700 hover:underline">
                        <Phone className="mr-1" size={14} />
                        {livreur.telephone}
                      </a>
                    ) : (
                      <span className="text-sm text-gray-600">Numéro non disponible</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Colonne droite - Articles */}
            <div className="space-y-6">
              {/* Articles commandés */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Package className="mr-2" size={20} />
                  Articles commandés
                </h3>
                <div className="space-y-3">
                  {articles.map((article, idx) => {
                    const nom = article.nom || article.name || article.title || `Article ${idx+1}`;
                    const quantite = article.quantite ?? article.quantity ?? 1;
                    const prix = Number(article.prix ?? article.price ?? 0);
                    const image = article.image || article.imageUrl || '';
                    return (
                    <div key={article.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      {image ? (
                        <img src={image} alt={nom} className="w-12 h-12 rounded-lg object-cover" />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center text-gray-500">🥬</div>
                      )}
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{nom}</h4>
                        <p className="text-sm text-gray-600">Quantité: {quantite}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          {(prix * quantite).toLocaleString('fr-FR')} FCFA
                        </p>
                        <p className="text-sm text-gray-600">{prix.toLocaleString('fr-FR')} FCFA/u</p>
                      </div>
                    </div>
                    );
                  })}
                </div>

                {/* Récapitulatif */}
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Sous-total:</span>
                      <span>{Number(recapitulatif.sousTotal || 0).toLocaleString('fr-FR')} FCFA</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Frais de livraison:</span>
                      <span>{Number(recapitulatif.fraisLivraison || 0).toLocaleString('fr-FR')} FCFA</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between font-semibold text-lg">
                      <span>Total:</span>
                      <span>{Number(recapitulatif.total || 0).toLocaleString('fr-FR')} FCFA</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 flex justify-end space-x-4">
            {onCancel && (
              <button
                onClick={onCancel}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                J'annule ma commande
              </button>
            )}
            {livreur?.telephone ? (
              <a
                href={`tel:${livreur.telephone}`}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors inline-flex items-center"
              >
                Contacter le livreur
              </a>
            ) : (
              <button
                className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg cursor-not-allowed"
                title="Aucun numéro de livreur disponible"
                disabled
              >
                Contacter le livreur
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LivraisonDetailsModal;