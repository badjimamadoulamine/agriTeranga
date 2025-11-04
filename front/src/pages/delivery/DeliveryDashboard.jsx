import React, { useState, useEffect } from 'react';
import { 
  ChevronDown, 
  Check, 
  X, 
  MapPin, 
  Clock, 
  User, 
  Phone, 
  Package,
  TrendingUp,
  Truck,
  Calendar,
  Search,
  Filter,
  Settings
} from 'lucide-react';
import DeliveryLayout from '../../layouts/DeliveryLayout';
import useDeliveryData from '../../hooks/useDeliveryData';
import ProfileModal from '../../components/ProfileModal';
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

const DeliveryDashboard = () => {
  const {
    stats,
    availableDeliveries,
    myDeliveries,
    deliveryHistory,
    loading,
    error,
    availablePagination,
    myDeliveriesPagination,
    historyPagination,
    acceptDelivery,
    updateDeliveryStatus,
    completeDelivery,
    filterMyDeliveriesByStatus,
    changeAvailablePage,
    changeMyDeliveriesPage,
    // Gestion du profil
    profile,
    profileLoading,
    profileError,
    updateProfile,
    changePassword,
    getProfile,
    refreshProfile
  } = useDeliveryData();

  const [activeTab, setActiveTab] = useState('available'); // available, myDeliveries, history
  const [expandedOrders, setExpandedOrders] = useState({});
  const [statusFilter, setStatusFilter] = useState('');
  const [deliveryNotes, setDeliveryNotes] = useState({});
  const [showNotesModal, setShowNotesModal] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Charger le profil au montage
  useEffect(() => {
    getProfile();
  }, [getProfile]);

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

  // Gérer l'acceptation d'une livraison
  const handleAcceptDelivery = async (deliveryId) => {
    try {
      await acceptDelivery(deliveryId);
    } catch (err) {
      console.error('Erreur lors de l\'acceptation:', err);
    }
  };

  // Gérer le refus d'une livraison
  const handleDeclineDelivery = (deliveryId) => {
    // Simuler le refus (pour l'instant, on peut juste fermer la livraison)
    toast.info('Livraison déclinée');
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
    } catch (err) {
      console.error('Erreur lors de la confirmation:', err);
    }
  };

  // Basculer les détails d'une livraison
  const toggleDetails = (deliveryId) => {
    setExpandedOrders(prev => ({
      ...prev,
      [deliveryId]: !prev[deliveryId]
    }));
  };

  // Formater l'adresse pour l'affichage
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

  // Formater le numéro de téléphone
  const formatPhone = (customer) => {
    if (typeof customer === 'string') return '';
    if (customer && customer.phone) return customer.phone;
    return '+221 77 123 45 67';
  };

  // Filtrer les livraisons par statut
  const handleStatusFilterChange = (status) => {
    setStatusFilter(status);
    filterMyDeliveriesByStatus(status);
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
        </div>
      </DeliveryLayout>
    );
  }

  return (
    <DeliveryLayout>
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Tableau de bord Livreur</h1>
            <p className="text-lg text-gray-600">Gérez vos livraisons et suivez vos performances</p>
          </div>
          
          {/* Avatar et profil */}
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">
                {profile?.firstName} {profile?.lastName}
              </p>
              <p className="text-xs text-gray-500">Livreur</p>
            </div>
            <button
              onClick={() => setShowProfileModal(true)}
              className="relative group"
            >
              <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center overflow-hidden cursor-pointer hover:bg-green-700 transition-colors ring-2 ring-white shadow-lg group-hover:ring-green-400">
                {profile?.profilePicture ? (
                  <img 
                    src={profile.profilePicture} 
                    alt="Avatar" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-6 h-6 text-white" />
                )}
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md group-hover:bg-gray-50">
                <Settings className="w-3 h-3 text-gray-600 group-hover:text-gray-800" />
              </div>
            </button>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total livraisons</p>
                <p className="text-2xl font-bold text-gray-800">{stats.totalDeliveries || 0}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Truck className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Livraisons terminées</p>
                <p className="text-2xl font-bold text-gray-800">{stats.completedDeliveries || 0}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Check className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">En attente</p>
                <p className="text-2xl font-bold text-gray-800">{stats.pendingDeliveries || 0}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Gains totaux</p>
                <p className="text-2xl font-bold text-gray-800">{stats.totalEarnings?.toLocaleString() || 0} FCFA</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Navigation par onglets */}
        <div className="bg-white rounded-xl shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('available')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'available'
                    ? 'border-[#59C94F] text-[#59C94F]'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Livraisons disponibles ({availableDeliveries.length})
              </button>
              <button
                onClick={() => setActiveTab('myDeliveries')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'myDeliveries'
                    ? 'border-[#59C94F] text-[#59C94F]'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Mes livraisons ({myDeliveries.length})
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'history'
                    ? 'border-[#59C94F] text-[#59C94F]'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Historique ({deliveryHistory.length})
              </button>
            </nav>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Contenu principal */}
          <div className="lg:col-span-2">
            {/* Livraisons disponibles */}
            {activeTab === 'available' && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Livraisons disponibles</h2>
                
                {availableDeliveries.length > 0 ? (
                  <div className="space-y-4">
                    {availableDeliveries.map((delivery) => {
                      const isExpanded = expandedOrders[delivery.id];
                      
                      return (
                        <div
                          key={delivery.id}
                          className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                        >
                          <div className="p-5">
                            {/* Header avec image et info produit */}
                            <div className="flex gap-4 mb-4">
                              {delivery.productImage && (
                                <img
                                  src={delivery.productImage}
                                  alt={delivery.productName || 'Produit'}
                                  className="w-24 h-24 object-cover rounded-lg"
                                />
                              )}
                              <div className="flex-1">
                                <h3 className="text-lg font-bold text-gray-800 mb-1">
                                  {delivery.productName || 'Produit'}
                                </h3>
                                <p className="text-sm text-gray-600 mb-2">
                                  Quantité: <span className="font-medium">{delivery.quantity || 'Non spécifié'}</span>
                                </p>
                                <p className="text-lg font-bold text-[#59C94F]">
                                  {delivery.amount ? `${delivery.amount} FCFA` : 'Montant non disponible'}
                                </p>
                              </div>
                            </div>

                            {/* Info client */}
                            <div className="mb-4 pb-4 border-b border-gray-200">
                              <p className="text-sm text-gray-600 mb-1">
                                Client: <span className="font-medium text-gray-800">
                                  {formatCustomerName(delivery.customer)}
                                </span>
                              </p>
                              <p className="text-xs text-gray-500">
                                {delivery.orderDate ? new Date(delivery.orderDate).toLocaleDateString('fr-FR') : 'Date non disponible'}
                              </p>
                            </div>

                            {/* Adresses */}
                            <div className="mb-4 space-y-2">
                              <div>
                                <p className="text-xs text-gray-500 mb-1">📍 Adresse de récupération</p>
                                <p className="text-sm text-gray-800">
                                  {formatAddress(delivery.pickupAddress)}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 mb-1">📦 Adresse de livraison</p>
                                <p className="text-sm text-gray-800">
                                  {formatAddress(delivery.deliveryAddress)}
                                </p>
                              </div>
                            </div>

                            {/* Détails supplémentaires */}
                            <button
                              onClick={() => toggleDetails(delivery.id)}
                              className="flex items-center gap-2 text-sm text-[#59C94F] hover:text-[#4CAF50] transition-colors mb-4"
                            >
                              <ChevronDown
                                className={`w-4 h-4 transition-transform ${
                                  isExpanded ? 'rotate-180' : ''
                                }`}
                              />
                              <span>Plus de détails</span>
                            </button>

                            {isExpanded && (
                              <div className="mb-4 p-3 bg-gray-50 rounded-lg text-sm space-y-2">
                                <p className="text-gray-600">
                                  <span className="font-medium">Instructions:</span> {delivery.instructions || 'Aucune instruction particulière'}
                                </p>
                                <p className="text-gray-600">
                                  <span className="font-medium">Contact client:</span> {formatPhone(delivery.customer)}
                                </p>
                                <p className="text-gray-600">
                                  <span className="font-medium">Notes:</span> {delivery.notes || 'Aucune note'}
                                </p>
                              </div>
                            )}

                            {/* Boutons d'action */}
                            <div className="flex gap-3">
                              <button
                                onClick={() => handleDeclineDelivery(delivery.id)}
                                className="flex-1 px-4 py-2.5 rounded-lg font-medium transition-all bg-white border-2 border-red-500 text-red-500 hover:bg-red-50"
                              >
                                Décliner
                              </button>
                              <button
                                onClick={() => handleAcceptDelivery(delivery.id)}
                                className="flex-1 px-4 py-2.5 rounded-lg font-medium transition-all bg-[#59C94F] text-white hover:bg-[#4CAF50]"
                              >
                                Accepter
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>Aucune livraison disponible pour le moment</p>
                  </div>
                )}

                {/* Pagination */}
                {availablePagination.totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-6">
                    <button
                      onClick={() => changeAvailablePage(availablePagination.page - 1)}
                      disabled={availablePagination.page === 1}
                      className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50"
                    >
                      Précédent
                    </button>
                    <span className="px-3 py-1 text-sm">
                      Page {availablePagination.page} sur {availablePagination.totalPages}
                    </span>
                    <button
                      onClick={() => changeAvailablePage(availablePagination.page + 1)}
                      disabled={availablePagination.page === availablePagination.totalPages}
                      className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50"
                    >
                      Suivant
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Mes livraisons */}
            {activeTab === 'myDeliveries' && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-800">Mes livraisons</h2>
                  <select
                    value={statusFilter}
                    onChange={(e) => handleStatusFilterChange(e.target.value)}
                    className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#59C94F]"
                  >
                    <option value="">Tous les statuts</option>
                    <option value="pending">En attente</option>
                    <option value="accepted">Acceptée</option>
                    <option value="in_transit">En transit</option>
                    <option value="delivered">Livrée</option>
                  </select>
                </div>

                {myDeliveries.length > 0 ? (
                  <div className="space-y-4">
                    {myDeliveries.map((delivery) => (
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
                            delivery.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            delivery.status === 'accepted' ? 'bg-blue-100 text-blue-800' :
                            delivery.status === 'in_transit' ? 'bg-purple-100 text-purple-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {delivery.status === 'pending' ? 'En attente' :
                             delivery.status === 'accepted' ? 'Acceptée' :
                             delivery.status === 'in_transit' ? 'En transit' : 'Livrée'}
                          </span>
                        </div>

                        <div className="space-y-2 text-sm">
                          <p><span className="font-medium">Quantité:</span> {delivery.quantity || 'Non spécifié'}</p>
                          <p><span className="font-medium">Montant:</span> {delivery.amount ? `${delivery.amount} FCFA` : 'Non disponible'}</p>
                          <p><span className="font-medium">Adresse livraison:</span> {formatAddress(delivery.deliveryAddress)}</p>
                        </div>

                        {/* Actions selon le statut */}
                        <div className="flex gap-2 mt-4">
                          {delivery.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleStatusChange(delivery.id, 'accepted')}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                              >
                                Commencer
                              </button>
                            </>
                          )}
                          {delivery.status === 'accepted' && (
                            <button
                              onClick={() => handleStatusChange(delivery.id, 'in_transit')}
                              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                            >
                              En route
                            </button>
                          )}
                          {delivery.status === 'in_transit' && (
                            <button
                              onClick={() => handleStatusChange(delivery.id, 'delivered')}
                              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                            >
                              Marquer comme livré
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <Truck className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>Aucune livraison assignée</p>
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
            )}

            {/* Historique */}
            {activeTab === 'history' && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Historique des livraisons</h2>
                
                {deliveryHistory.length > 0 ? (
                  <div className="space-y-4">
                    {deliveryHistory.map((delivery) => (
                      <div
                        key={delivery.id}
                        className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-800">{delivery.productName || 'Produit'}</h3>
                            <p className="text-sm text-gray-600">
                              {formatCustomerName(delivery.customer)} • {delivery.completedDate ? new Date(delivery.completedDate).toLocaleDateString('fr-FR') : 'Date non disponible'}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-green-600">{delivery.amount ? `${delivery.amount} FCFA` : ''}</p>
                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                              Terminée
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
          </div>

          {/* Graphiques */}
          <div className="space-y-6">
            {/* Performance mensuelle */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Performance mensuelle</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip
                    formatter={(value, name) => [
                      name === 'earnings' ? `${value.toLocaleString()} FCFA` : value,
                      name === 'earnings' ? 'Gains' : 'Livraisons'
                    ]}
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="completed" fill="#10B981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Répartition des statuts */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Répartition des livraisons</h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={deliveryStatusData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {deliveryStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
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

        {/* Avatar cliquable */}
        <div className="flex justify-end mb-6">
          <div 
            onClick={() => setShowProfileModal(true)}
            className="relative cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-semibold text-lg shadow-lg group-hover:shadow-xl transition-all">
              {profile?.firstName?.[0] || 'L'}
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-md">
              <Settings className="w-3 h-3 text-green-600" />
            </div>
          </div>
        </div>

        {/* Modal de profil */}
        <ProfileModal
          isOpen={showProfileModal}
          onClose={() => setShowProfileModal(false)}
          profile={profile}
          onUpdateProfile={updateProfile}
          onChangePassword={changePassword}
          onRefreshProfile={refreshProfile}
        />
      </div>
    </DeliveryLayout>
  );
};

export default DeliveryDashboard;