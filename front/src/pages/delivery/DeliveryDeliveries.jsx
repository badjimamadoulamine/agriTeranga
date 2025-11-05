import React, { useState } from 'react';
import { 
  Truck, 
  Package, 
  MapPin, 
  Clock, 
  Check, 
  X, 
  Search, 
  Filter, 
  RefreshCw,
  Calendar,
  TrendingUp
} from 'lucide-react';
import DeliveryLayout from '../../layouts/DeliveryLayout';
import useDeliveryData from '../../hooks/useDeliveryData';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { toast } from 'react-toastify';

const DeliveryDeliveries = () => {
  const {
    stats,
    myDeliveries,
    loading,
    error,
    myDeliveriesPagination,
    acceptDelivery,
    updateDeliveryStatus,
    completeDelivery,
    filterMyDeliveriesByStatus,
    changeMyDeliveriesPage,
    refreshData
  } = useDeliveryData();

  const [activeTab, setActiveTab] = useState('active'); // active, history
  const [statusFilter, setStatusFilter] = useState('');
  const [deliveryNotes, setDeliveryNotes] = useState({});
  const [showNotesModal, setShowNotesModal] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Couleurs pour les graphiques
  const COLORS = ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444'];

  // Données pour les graphiques
  const performanceData = [
    { month: 'Jan', completed: 45, earnings: 125000 },
    { month: 'Fév', completed: 38, earnings: 98000 },
    { month: 'Mar', completed: 52, earnings: 143000 },
    { month: 'Avr', completed: 41, earnings: 118000 },
    { month: 'Mai', completed: 47, earnings: 135000 },
    { month: 'Juin', completed: 43, earnings: 128000 },
  ];

  const deliveryStatusData = [
    { name: 'Livrées', value: stats.completedDeliveries || 0 },
    { name: 'En cours', value: stats.pendingDeliveries || 0 },
  ];

  // Filtrer les livraisons par recherche
  const filteredDeliveries = myDeliveries.filter(delivery => {
    const matchesSearch = delivery.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         delivery.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  // Statut annulé helper (doit être défini avant d'être utilisé)
  const isCancelled = (d) => {
    const s = (d?.status || d?.orderStatus || '').toString().toLowerCase();
    return s === 'cancelled' || s.includes('annul');
  };

  // Séparer les livraisons actives et l'historique
  const activeDeliveries = filteredDeliveries.filter(d => d.status !== 'delivered' && !isCancelled(d));
  const completedDeliveries = filteredDeliveries.filter(d => d.status === 'delivered' || isCancelled(d));

  // Gérer l'acceptation d'une livraison
  const handleAcceptDelivery = async (deliveryId) => {
    try {
      await acceptDelivery(deliveryId);
    } catch (err) {
      console.error('Erreur lors de l\'acceptation:', err);
    }
  };

  

  // Gérer le changement de statut
  const handleStatusChange = async (deliveryId, newStatus) => {
    try {
      if (newStatus === 'delivered') {
        setShowNotesModal(deliveryId);
      } else {
        await updateDeliveryStatus(deliveryId, newStatus);
      }
    } catch (err) {
      console.error('Erreur lors du changement de statut:', err);
    }
  };

  // Confirmer la livraison avec notes
  const confirmDelivery = async (deliveryId) => {
    try {
      const notes = deliveryNotes[deliveryId] || '';
      await completeDelivery(deliveryId, notes);
      setDeliveryNotes(prev => ({ ...prev, [deliveryId]: '' }));
      setShowNotesModal(null);
      // Basculer vers l'historique pour afficher la livraison comme "Livrée"
      setActiveTab('history');
    } catch (err) {
      console.error('Erreur lors de la confirmation:', err);
    }
  };

  // Formater l'adresse
  const formatAddress = (address) => {
    if (typeof address === 'string') return address;
    if (address && address.address) return address.address;
    if (address && address.fullAddress) return address.fullAddress;
    return 'Adresse non disponible';
  };

  // Formater le nom du client
  const formatCustomerName = (customer) => {
    if (typeof customer === 'string') return customer;
    if (customer && customer.name) return customer.name;
    if (customer && customer.firstName && customer.lastName) {
      return `${customer.firstName} ${customer.lastName}`;
    }
    if (customer && customer.firstName) return customer.firstName;
    return 'Client';
  };

  // Filtrer par statut
  const handleStatusFilterChange = (status) => {
    setStatusFilter(status);
    filterMyDeliveriesByStatus(status);
  };

  // Rafraîchir les données
  const handleRefresh = () => {
    refreshData();
    toast.success('Données actualisées');
  };

  if (loading) {
    return (
      <DeliveryLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#59C94F]"></div>
        </div>
      </DeliveryLayout>
    );
  }

  if (error) {
    return (
      <DeliveryLayout>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
          <button 
            onClick={handleRefresh}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Réessayer
          </button>
        </div>
      </DeliveryLayout>
    );
  }

  return (
    <DeliveryLayout>
      <div className="w-full px-4 mx-auto">
        {/* En-tête */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Mes Livraisons</h1>
            <p className="text-lg text-gray-600">Gérez toutes vos livraisons</p>
          </div>
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 px-4 py-2 bg-[#59C94F] text-white rounded-lg hover:bg-[#4CAF50] transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Actualiser
          </button>
        </div>

        

        {/* Contenu principal en pleine largeur */}
        <div>
            {/* Filtres et recherche */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Rechercher un produit ou un client..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#59C94F]"
                    />
                  </div>
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => handleStatusFilterChange(e.target.value)}
                  className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#59C94F]"
                >
                  <option value="">Tous les statuts</option>
                  <option value="assigned">En préparation</option>
                  <option value="in-transit">En route</option>
                  <option value="delivered">Livrée</option>
                  <option value="cancelled">Annulée</option>
                </select>
              </div>
            </div>

            {/* Navigation par onglets */}
            <div className="bg-white rounded-xl shadow-sm mb-6">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  <button
                    onClick={() => setActiveTab('active')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'active'
                        ? 'border-[#59C94F] text-[#59C94F]'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Livraisons actives ({activeDeliveries.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('history')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'history'
                        ? 'border-[#59C94F] text-[#59C94F]'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Historique ({completedDeliveries.length})
                  </button>
                </nav>
              </div>
            </div>

            {/* Contenu des onglets */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              {/* Livraisons actives */}
              {activeTab === 'active' && (
                <div>
                  <h2 className="text-xl font-bold text-gray-800 mb-6">Livraisons actives</h2>
                  
                  {activeDeliveries.length > 0 ? (
                    <div className="space-y-4">
                      {activeDeliveries.map((delivery) => (
                        <div
                          key={delivery.id}
                          className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <h3 className="font-semibold text-gray-800">{delivery.productName || 'Produit'}</h3>
                              <p className="text-sm text-gray-600">
                                Client: {formatCustomerName(delivery.customer)}
                              </p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              isCancelled(delivery) ? 'bg-red-100 text-red-800' :
                              delivery.status === 'assigned' ? 'bg-yellow-100 text-yellow-800' :
                              delivery.status === 'in-transit' ? 'bg-purple-100 text-purple-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {isCancelled(delivery) ? 'Annulé' :
                                (delivery.status === 'assigned' ? 'En préparation' :
                                 delivery.status === 'in-transit' ? 'En route' : 'Livrée')}
                            </span>
                          </div>

                          <div className="space-y-2 text-sm mb-4">
                            <p><span className="font-medium">Quantité:</span> {delivery.quantity || 'Non spécifié'}</p>
                            <p><span className="font-medium">Montant:</span> {delivery.amount ? `${delivery.amount} FCFA` : 'Non disponible'}</p>
                            <p><span className="font-medium">Adresse livraison:</span> {formatAddress(delivery.deliveryAddress)}</p>
                            <p><span className="font-medium">Date:</span> {new Date(delivery.orderDate).toLocaleDateString('fr-FR')}</p>
                          </div>

                          {/* Actions selon le statut */}
                          {isCancelled(delivery) ? (
                            <div className="flex items-center gap-2 text-sm text-red-700">
                              <X className="w-4 h-4" />
                              <span>Commande annulée — actions désactivées</span>
                            </div>
                          ) : (
                            <div className="flex gap-2 flex-wrap">
                              {delivery.status === 'assigned' && (
                                <button
                                  onClick={() => handleStatusChange(delivery.id, 'in-transit')}
                                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                                >
                                  En route
                                </button>
                              )}
                              {delivery.status === 'in-transit' && (
                                <button
                                  onClick={() => handleStatusChange(delivery.id, 'delivered')}
                                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                >
                                  Marquer comme livré
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      <Truck className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>Aucune livraison active</p>
                    </div>
                  )}
                </div>
              )}

              {/* Historique */}
              {activeTab === 'history' && (
                <div>
                  <h2 className="text-xl font-bold text-gray-800 mb-6">Historique des livraisons</h2>
                  
                  {completedDeliveries.length > 0 ? (
                    <div className="space-y-4">
                      {completedDeliveries.map((delivery) => (
                        <div
                          key={delivery.id}
                          className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-semibold text-gray-800">{delivery.productName || 'Produit'}</h3>
                              <p className="text-sm text-gray-600">
                                {formatCustomerName(delivery.customer)} • {new Date(delivery.orderDate).toLocaleDateString('fr-FR')}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className={`font-medium ${isCancelled(delivery) ? 'text-red-600' : 'text-green-600'}`}>{delivery.amount ? `${delivery.amount} FCFA` : ''}</p>
                              <span className={`px-2 py-1 rounded-full text-xs ${isCancelled(delivery) ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                {isCancelled(delivery) ? 'Annulée' : 'Terminée'}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>Aucune livraison dans l'historique</p>
                    </div>
                  )}
                </div>
              )}

              {/* Pagination */}
              {myDeliveriesPagination.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-6">
                  <button
                    onClick={() => changeMyDeliveriesPage(myDeliveriesPagination.page - 1)}
                    disabled={myDeliveriesPagination.page === 1}
                    className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50"
                  >
                    Précédent
                  </button>
                  <span className="px-3 py-1 text-sm">
                    Page {myDeliveriesPagination.page} sur {myDeliveriesPagination.totalPages}
                  </span>
                  <button
                    onClick={() => changeMyDeliveriesPage(myDeliveriesPagination.page + 1)}
                    disabled={myDeliveriesPagination.page === myDeliveriesPagination.totalPages}
                    className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50"
                  >
                    Suivant
                  </button>
                </div>
              )}
            </div>
          </div>

        {/* Modal pour les notes de livraison */}
        {showNotesModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Confirmer la livraison</h3>
              <p className="text-gray-600 mb-4">
                Ajouter des notes sur la livraison (optionnel)
              </p>
              <textarea
                value={deliveryNotes[showNotesModal] || ''}
                onChange={(e) => setDeliveryNotes(prev => ({ 
                  ...prev, 
                  [showNotesModal]: e.target.value 
                }))}
                placeholder="Ex: Client absent, livraison reportée..."
                rows="4"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#59C94F] resize-y"
              />
              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => setShowNotesModal(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={() => confirmDelivery(showNotesModal)}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Confirmer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DeliveryLayout>
  );
};

export default DeliveryDeliveries;