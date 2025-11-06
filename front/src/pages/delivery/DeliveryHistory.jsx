import React, { useState, useEffect } from 'react';
import DeliveryLayout from '../../layouts/DeliveryLayout';
import { Search, Calendar, Filter, Loader, AlertCircle, Package } from 'lucide-react';
import apiService from '../../services/apiService';
import { toast } from 'react-toastify';

const DeliveryHistory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [deliveryHistory, setDeliveryHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  // Charger l'historique des livraisons
  useEffect(() => {
    fetchDeliveryHistory();
  }, [currentPage]);

  const fetchDeliveryHistory = async () => {
    try {
      setLoading(true);
      setError(null);

      const filters = {
        status: 'delivered'
      };

      if (startDate) filters.dateFrom = startDate;
      if (endDate) filters.dateTo = endDate;

      const response = await apiService.getDeliveryHistory(currentPage, limit, filters);

      if (response.status === 'success') {
        const history = response.data?.history || [];
        setDeliveryHistory(history);
        setTotalPages(response.data?.totalPages || 1);
        setTotal(response.data?.total || 0);
      }
    } catch (err) {
      console.error('Erreur lors du chargement de l\'historique:', err);
      setError(err.message || 'Erreur lors du chargement de l\'historique');
      toast.error('Impossible de charger l\'historique des livraisons');
    } finally {
      setLoading(false);
    }
  };

  // Filtrer les livraisons
  const handleFilter = () => {
    setCurrentPage(1);
    fetchDeliveryHistory();
  };

  // Formater la date
  const formatDate = (dateString) => {
    if (!dateString) return 'Date non disponible';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Date invalide';
    }
  };

  // Formater l'adresse
  const formatAddress = (address) => {
    if (typeof address === 'string') return address;
    if (address && address.address) return address.address;
    if (address && address.street && address.city) {
      return `${address.street}, ${address.city}`;
    }
    return 'Adresse non disponible';
  };

  // Formater le nom du client
  const formatCustomerName = (order) => {
    if (!order) return 'Client inconnu';
    
    const consumer = order.consumer;
    if (!consumer) return 'Client inconnu';
    
    if (typeof consumer === 'string') return consumer;
    if (consumer.firstName && consumer.lastName) {
      return `${consumer.firstName} ${consumer.lastName}`;
    }
    if (consumer.firstName) return consumer.firstName;
    if (consumer.name) return consumer.name;
    
    return 'Client';
  };

  // Badge de statut
  const getStatusBadge = (status) => {
    const statusConfig = {
      'delivered': {
        bg: 'bg-green-100',
        text: 'text-green-800',
        label: 'Livrée'
      },
      'cancelled': {
        bg: 'bg-red-100',
        text: 'text-red-800',
        label: 'Annulée'
      },
      'failed': {
        bg: 'bg-orange-100',
        text: 'text-orange-800',
        label: 'Échec'
      }
    };

    const config = statusConfig[status] || {
      bg: 'bg-gray-100',
      text: 'text-gray-800',
      label: status || 'Inconnu'
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  // Filtrer localement par recherche
  const filteredHistory = deliveryHistory.filter(delivery => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    const customerName = formatCustomerName(delivery.order).toLowerCase();
    const address = formatAddress(delivery.deliveryLocation).toLowerCase();
    
    return customerName.includes(searchLower) || address.includes(searchLower);
  });

  // Pagination
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <DeliveryLayout>
      <div className="max-w-6xl mx-auto">
        {/* Page Title */}
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Historique des livraisons
        </h1>

        {/* Filter Bar */}
        <div className="bg-white rounded-lg p-4 mb-6 shadow-sm">
          <div className="flex flex-col md:flex-row items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 w-full md:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher par nom ou adresse..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#59C94F] focus:border-transparent"
              />
            </div>

            {/* Date Range */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-40 pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#59C94F] focus:border-transparent"
                />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
              <span className="text-gray-500">-</span>
              <div className="relative">
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-40 pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#59C94F] focus:border-transparent"
                />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Filter Button */}
            <button 
              onClick={handleFilter}
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2 bg-[#59C94F] text-white rounded-lg hover:bg-[#4CAF50] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Filter className="w-4 h-4" />
              <span>Filtrer</span>
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader className="w-8 h-8 text-[#59C94F] animate-spin mb-4" />
            <p className="text-gray-600">Chargement de l'historique...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-red-600" />
              <h3 className="text-lg font-semibold text-red-800">Erreur</h3>
            </div>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchDeliveryHistory}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Réessayer
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredHistory.length === 0 && (
          <div className="bg-white rounded-lg p-12 text-center">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Aucune livraison dans l'historique
            </h3>
            <p className="text-gray-600">
              Vous n'avez pas encore de livraisons terminées.
            </p>
          </div>
        )}

        {/* Delivery History List */}
        {!loading && !error && filteredHistory.length > 0 && (
          <>
            <div className="space-y-4 mb-6">
              {filteredHistory.map((delivery) => (
                <div
                  key={delivery._id || delivery.id}
                  className="bg-white rounded-lg p-5 border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Left: Recipient Info */}
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-800 mb-1">
                        {formatCustomerName(delivery.order)}
                      </h3>
                      <p className="text-sm text-gray-500 mb-2">
                        {formatAddress(delivery.deliveryLocation)}
                      </p>
                      {delivery.order?.items && delivery.order.items.length > 0 && (
                        <p className="text-xs text-gray-400">
                          {delivery.order.items.length} produit(s)
                        </p>
                      )}
                    </div>

                    {/* Middle: Event Details */}
                    <div className="text-left md:text-center">
                      <p className="text-xs text-gray-500 mb-1">
                        {delivery.status === 'delivered' ? 'Heure de livraison' : 
                         delivery.status === 'cancelled' ? 'Heure d\'annulation' : 
                         'Date de livraison'}
                      </p>
                      <p className="text-sm font-bold text-gray-800">
                        {formatDate(delivery.actualDeliveryTime || delivery.createdAt)}
                      </p>
                    </div>

                    {/* Right: Status Badge */}
                    <div className="flex items-center gap-3">
                      {delivery.order?.totalPrice && (
                        <p className="text-sm font-medium text-gray-700">
                          {delivery.order.totalPrice.toLocaleString()} FCFA
                        </p>
                      )}
                      {getStatusBadge(delivery.status)}
                    </div>
                  </div>

                  {/* Notes si présentes */}
                  {delivery.notes && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <p className="text-xs text-gray-500 mb-1">Notes:</p>
                      <p className="text-sm text-gray-700">{delivery.notes}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="bg-white rounded-lg p-4 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Affichage de {((currentPage - 1) * limit) + 1} à {Math.min(currentPage * limit, total)} sur {total} livraisons
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Précédent
                  </button>
                  <span className="px-4 py-2 text-sm text-gray-700">
                    Page {currentPage} sur {totalPages}
                  </span>
                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Suivant
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </DeliveryLayout>
  );
};

export default DeliveryHistory;