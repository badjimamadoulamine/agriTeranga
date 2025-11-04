import DeliveryLayout from '../../layouts/DeliveryLayout';
import { Search, Calendar, Filter, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import useDeliveryData from '../../hooks/useDeliveryData';

const DeliveryHistory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState('');

  const {
    deliveryHistory,
    loading,
    error,
    historyPagination,
    filterHistoryByDateRange,
    changeHistoryPage
  } = useDeliveryData();

  const getStatusBadge = (status) => {
    const statusStyles = {
      'Livrée': 'bg-[#E8F5E9] text-[#2E7D32]',
      'Annulée': 'bg-[#FFEBEE] text-[#C62828]'
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyles[status]}`}>
        {status}
      </span>
    );
  };

  const normalizeText = (v) => (v || '').toString().toLowerCase();
  const formatCustomerName = (customer) => {
    if (typeof customer === 'string') return customer;
    if (customer && customer.name) return customer.name;
    if (customer && customer.firstName && customer.lastName) return `${customer.firstName} ${customer.lastName}`;
    if (customer && customer.firstName) return customer.firstName;
    return '';
  };
  const formatAddress = (address) => {
    if (typeof address === 'string') return address;
    if (address && address.address) return address.address;
    if (address && address.fullAddress) return address.fullAddress;
    return '';
  };

  const filtered = (deliveryHistory || []).filter((d) => {
    const q = normalizeText(searchTerm);
    if (!q) return true;
    const name = normalizeText(formatCustomerName(d.customer));
    const addr = normalizeText(formatAddress(d.deliveryAddress));
    const prod = normalizeText(d.productName);
    return name.includes(q) || addr.includes(q) || prod.includes(q);
  });

  const onFilter = () => {
    filterHistoryByDateRange(startDate || '', endDate || '', status || '');
  };

  return (
    <DeliveryLayout>
      <div className="max-w-6xl">
        {/* Page Title */}
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Historique des livraisons
        </h1>

        {/* Filter Bar */}
        <div className="flex items-center gap-3 mb-6 flex-wrap">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#59C94F] focus:border-transparent"
            />
          </div>

          {/* Date Range */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <input
                type="text"
                placeholder="mm/dd/yyyy"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-40 pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#59C94F] focus:border-transparent"
              />
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
            <span className="text-gray-500">-</span>
            <div className="relative">
              <input
                type="text"
                placeholder="mm/dd/yyyy"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-40 pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#59C94F] focus:border-transparent"
              />
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>

          <div className="relative">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-10 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#59C94F]"
            >
              <option value="">Tous les statuts</option>
              <option value="delivered">Livrée</option>
              <option value="completed">Terminée</option>
              <option value="cancelled">Annulée</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>

          {/* Filter Button */}
          <button onClick={onFilter} className="flex items-center gap-2 px-5 py-2 bg-[#59C94F] text-white rounded-lg hover:bg-[#4CAF50] transition-colors">
            <Filter className="w-4 h-4" />
            <span>Filtrer</span>
          </button>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#59C94F]"></div>
          </div>
        )}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 mb-6">
            {error}
          </div>
        )}

        {/* Delivery History List */}
        <div className="space-y-4">
          {!loading && filtered.map((delivery) => {
            const name = formatCustomerName(delivery.customer) || 'Client';
            const address = formatAddress(delivery.deliveryAddress) || '';
            const isCancelled = delivery.status === 'cancelled';
            const isDelivered = delivery.status === 'delivered' || delivery.status === 'completed';
            const eventType = isCancelled ? "Heure d'annulation" : 'Heure de livraison';
            const when = delivery.completedDate || delivery.deliveredAt || delivery.cancelledAt || delivery.updatedAt || delivery.createdAt;
            const datetime = when ? new Date(when).toLocaleString('fr-FR', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' }) : '';
            const statusLabel = isCancelled ? 'Annulée' : 'Livrée';

            return (
              <div
                key={delivery.id}
                className="bg-white rounded-lg p-5 border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-1">
                      {name}
                    </h3>
                    <p className="text-sm text-gray-500">{address}</p>
                  </div>

                  <div className="text-center">
                    <p className="text-xs text-gray-500 mb-1">{eventType}</p>
                    <p className="text-sm font-bold text-gray-800">{datetime}</p>
                  </div>

                  <div>
                    {getStatusBadge(statusLabel)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {historyPagination.totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <button
              onClick={() => changeHistoryPage(historyPagination.page - 1)}
              disabled={historyPagination.page === 1}
              className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50"
            >
              Précédent
            </button>
            <span className="px-3 py-1 text-sm">
              Page {historyPagination.page} sur {historyPagination.totalPages}
            </span>
            <button
              onClick={() => changeHistoryPage(historyPagination.page + 1)}
              disabled={historyPagination.page === historyPagination.totalPages}
              className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50"
            >
              Suivant
            </button>
          </div>
        )}
      </div>
    </DeliveryLayout>
  );
};

export default DeliveryHistory;