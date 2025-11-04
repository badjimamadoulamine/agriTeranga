import React, { useState } from 'react';
import { Search, Clock, ChevronDown } from 'lucide-react';
import DeliveryLayout from '../../layouts/DeliveryLayout';
import useDeliveryData from '../../hooks/useDeliveryData';

const DeliveryDeliveries = () => {
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('time');
  const [searchQuery, setSearchQuery] = useState('');
  const [showDetails, setShowDetails] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState(null);

  const {
    myDeliveries,
    loading,
    error,
    myDeliveriesPagination,
    changeMyDeliveriesPage,
    filterMyDeliveriesByStatus,
  } = useDeliveryData();

  // Fonction pour obtenir le style du badge de statut
  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-blue-100 text-blue-800';
      case 'in_transit':
      case 'in-transit':
        return 'bg-purple-100 text-purple-800';
      case 'assigned':
        return 'bg-blue-100 text-blue-800';
      case 'picked-up':
        return 'bg-indigo-100 text-indigo-800';
      case 'delivered':
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'failed':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  // Appliquer le filtre de statut (côté API via hook) et la recherche locale
  const handleChangeStatus = (value) => {
    setFilterStatus(value);
    const statusForApi = value === 'all' ? '' : value;
    filterMyDeliveriesByStatus(statusForApi);
  };

  const normalizeText = (v) => (v || '').toString().toLowerCase();
  const buildAddressFromOrder = (order) => {
    const addr = order?.deliveryInfo?.address;
    if (!addr) return '';
    const parts = [addr.street, addr.city, addr.region].filter(Boolean);
    return parts.join(', ');
  };
  const formatAddress = (delivery) => {
    // Prefer delivery.deliveryLocation.address then order.deliveryInfo.address
    if (delivery?.deliveryLocation?.address) return delivery.deliveryLocation.address;
    if (delivery?.deliveryAddress) return delivery.deliveryAddress;
    return buildAddressFromOrder(delivery?.order);
  };
  const formatCustomerName = (delivery) => {
    const customer = delivery?.customer || delivery?.order?.consumer;
    if (typeof customer === 'string') return customer;
    if (customer && customer.name) return customer.name;
    if (customer && customer.firstName && customer.lastName) return `${customer.firstName} ${customer.lastName}`;
    if (customer && customer.firstName) return customer.firstName;
    return '';
  };

  const filtered = (myDeliveries || []).filter((d) => {
    const q = normalizeText(searchQuery);
    if (!q) return true;
    const name = normalizeText(formatCustomerName(d));
    const addr = normalizeText(formatAddress(d));
    const prod = normalizeText(d.productName || d.order?.items?.[0]?.product?.name);
    return name.includes(q) || addr.includes(q) || prod.includes(q);
  }).sort((a, b) => {
    if (sortBy === 'name') {
      return formatCustomerName(a).localeCompare(formatCustomerName(b));
    }
    if (sortBy === 'address') {
      return formatAddress(a).localeCompare(formatAddress(b));
    }
    // default by time if available
    const at = new Date(a.updatedAt || a.createdAt || a.order?.updatedAt || a.order?.createdAt || 0).getTime();
    const bt = new Date(b.updatedAt || b.createdAt || b.order?.updatedAt || b.order?.createdAt || 0).getTime();
    return bt - at;
  });

  const openDetails = (delivery) => {
    setSelectedDelivery(delivery);
    setShowDetails(true);
  };
  const closeDetails = () => {
    setShowDetails(false);
    setSelectedDelivery(null);
  };

  return (
    <DeliveryLayout>
      {/* Top Section: Title and Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Livraisons</h1>
        
        {/* Search Bar */}
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Rechercher une livraison..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Filter and Sort Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        {/* Filter by Status */}
        <div className="relative">
          <select
            value={filterStatus}
            onChange={(e) => handleChangeStatus(e.target.value)}
            className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2.5 pr-10 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer"
          >
            <option value="all">Filtrer par: Tous les statuts</option>
            <option value="pending">En attente</option>
            <option value="accepted">Acceptée</option>
            <option value="in_transit">En transit</option>
            <option value="delivered">Livrée</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
        </div>

        {/* Sort by */}
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2.5 pr-10 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer"
          >
            <option value="time">Trier par: Temps</option>
            <option value="name">Nom du client</option>
            <option value="address">Adresse</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
        </div>
      </div>

      {/* Loading / Error */}
      {loading && (
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#59C94F]"></div>
        </div>
      )}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 mb-6">
          {error}
        </div>
      )}

      {/* Delivery Cards Grid */}
      {!loading && (
        <>
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((delivery) => {
                const customerName = formatCustomerName(delivery) || 'Client';
                const address = formatAddress(delivery) || 'Adresse non disponible';
                const status = delivery.status;
                const statusLabel =
                  status === 'pending' ? 'En attente' :
                  status === 'accepted' ? 'Acceptée' :
                  status === 'in_transit' || status === 'in-transit' ? 'En transit' :
                  status === 'assigned' ? 'Assignée' :
                  status === 'picked-up' ? 'Récupérée' :
                  status === 'delivered' || status === 'completed' ? 'Livrée' :
                  status === 'failed' ? 'Échouée' : '—';
                const deliveredTime = delivery.actualDeliveryTime || delivery.completedDate || delivery.deliveredAt || null;
                const estimatedTime = delivery.estimatedTime || delivery.expectedTime || null;

                return (
                  <div
                    key={delivery._id || delivery.id}
                    className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6"
                  >
                    {/* Customer Name */}
                    <h3 className="text-lg font-bold text-gray-800 mb-3">
                      {customerName}
                    </h3>

                    {/* Status Badge */}
                    <div className="mb-4">
                      <span
                        className={`${getStatusBadgeStyle(status)} text-xs font-medium px-3 py-1.5 rounded-full inline-block`}
                      >
                        {statusLabel}
                      </span>
                    </div>

                    {/* Address */}
                    <p className="text-gray-600 text-sm mb-4">{address}</p>

                    {/* Time Information */}
                    <div className="flex items-center space-x-2 text-gray-600 text-sm mb-4">
                      <Clock className="w-4 h-4" />
                      {status === 'delivered' || status === 'completed' ? (
                        <span>Livrée à {deliveredTime ? new Date(deliveredTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : '—'}</span>
                      ) : (
                        <span>HAE: {estimatedTime || '—'}</span>
                      )}
                    </div>

                    {/* View Details Link */}
                    <button onClick={() => openDetails(delivery)} className="text-green-600 hover:text-green-700 font-medium text-sm hover:underline transition-colors">
                      Voir détails
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 text-gray-500">Aucune livraison trouvée</div>
          )}

          {/* Pagination */}
          {myDeliveriesPagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
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
        </>
      )}
      {/* Modal Détails */}
      {showDetails && selectedDelivery && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Détails de la livraison</h3>
            <div className="space-y-2 text-sm text-gray-700">
              <p><span className="font-medium">Client:</span> {formatCustomerName(selectedDelivery) || '—'}</p>
              <p><span className="font-medium">Adresse:</span> {formatAddress(selectedDelivery) || '—'}</p>
              <p><span className="font-medium">Statut:</span> {selectedDelivery.status || '—'}</p>
              <p><span className="font-medium">Commande:</span> {selectedDelivery.order?._id || '—'}</p>
              {Array.isArray(selectedDelivery.order?.items) && selectedDelivery.order.items.length > 0 && (
                <div>
                  <p className="font-medium mb-1">Articles:</p>
                  <ul className="list-disc ml-5 space-y-1">
                    {selectedDelivery.order.items.map((it, idx) => (
                      <li key={idx}>{it?.product?.name || 'Produit'} × {it?.quantity || 1}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={closeDetails} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Fermer</button>
            </div>
          </div>
        </div>
      )}
    </DeliveryLayout>
  );
};

export default DeliveryDeliveries;