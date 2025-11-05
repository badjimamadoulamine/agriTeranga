import DeliveryLayout from '../../layouts/DeliveryLayout';
import { Search, Calendar, Filter, ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';
import useDeliveryData from '../../hooks/useDeliveryData';
import apiService from '../../services/apiService';

const DeliveryHistory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState('');

  const {
    deliveryHistory,
    myDeliveries,
    loading,
    error,
    historyPagination,
    filterHistoryByDateRange,
    changeHistoryPage
  } = useDeliveryData();

  // État local pour garantir l'affichage même si le hook ne renvoie rien
  const [rows, setRows] = useState([]);
  const [loadingLocal, setLoadingLocal] = useState(false);

  useEffect(() => {
    let mounted = true;
    const load = async (page = 1) => {
      try {
        setLoadingLocal(true);
        const resp = await apiService.getDeliveryHistory(page, 10, {});
        const payload = resp || {};
        const data = payload.data || payload;
        const history = data.history || data.histories || data.deliveries || data.items || [];
        const normalized = history.map((d, i) => {
          const ord = d.order || {};
          const consumer = ord.consumer || d.consumer || {};
          const rawStatus = (d.status || ord.status || 'delivered').toString().toLowerCase();
          const normStatus = rawStatus === 'failed' ? 'cancelled' : rawStatus;
          return {
            id: d.id || d._id || ord._id || i,
            orderNumber: ord.orderNumber || ord.number || d.orderNumber || '',
            customer: {
              name: consumer.firstName ? `${consumer.firstName} ${consumer.lastName || ''}` : (consumer.name || 'Client')
            },
            deliveryAddress: ord.deliveryInfo?.address || d.deliveryAddress || {},
            status: normStatus,
            completedDate: d.updatedAt || d.completedAt || d.deliveredAt || d.createdAt
          };
        });
        if (mounted) setRows(normalized);
      } catch {
        if (mounted) setRows([]);
      } finally {
        if (mounted) setLoadingLocal(false);
      }
    };
    load(1);
    return () => { mounted = false; };
  }, []);

  // Charger l'historique au montage
  useEffect(() => {
    filterHistoryByDateRange('', '', '');
  }, [filterHistoryByDateRange]);

  const getStatusBadge = (status) => {
    const statusStyles = {
      'Livrée': 'bg-[#E8F5E9] text-[#2E7D32]',
      'Annulée': 'bg-[#FFEBEE] text-[#C62828]',
      'En préparation': 'bg-yellow-100 text-yellow-800',
      'En route': 'bg-purple-100 text-purple-800'
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

  const getStatusLabel = (raw) => {
    const s = (raw || '').toString().toLowerCase();
    if (s === 'assigned') return 'En préparation';
    if (s === 'in-transit') return 'En route';
    if (s === 'delivered' || s === 'completed') return 'Livrée';
    if (s === 'cancelled' || s === 'failed') return 'Annulée';
    return 'Livrée';
  };

  // Fusionner l'historique (terminées/annulées) et les livraisons en cours (mes livraisons)
  const baseHistory = (rows && rows.length > 0) ? rows : (deliveryHistory || []);
  const mappedMy = (myDeliveries || []).map((d, i) => {
    const s = (d.status || '').toString().toLowerCase();
    const status = s === 'failed' ? 'cancelled' : d.status;
    return {
      id: d.id || i,
      orderNumber: d.orderNumber || d.number || '',
      customer: d.customer,
      deliveryAddress: d.deliveryAddress,
      status,
      completedDate: d.updatedAt || d.orderDate || new Date().toISOString()
    };
  });
  const merged = [...baseHistory, ...mappedMy].filter((item, index, arr) =>
    arr.findIndex((x) => (x.id || x.orderNumber) === (item.id || item.orderNumber)) === index
  );
  const base = merged;
  const filtered = base.filter((d) => {
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
      <div className="container mx-auto px-4">
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

        {(loading || loadingLocal) && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#59C94F]"></div>
          </div>
        )}
        {error && !(loading || loadingLocal) && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 mb-6">
            {error}
          </div>
        )}

        {/* Delivery History List */}
        {!(loading || loadingLocal) && filtered.length === 0 && (
          <div className="bg-white rounded-lg p-10 shadow-sm w-full text-center text-gray-600">
            Aucun historique à afficher.
          </div>
        )}
        <div className="space-y-4">
          {!(loading || loadingLocal) && filtered.map((delivery) => {
            const name = formatCustomerName(delivery.customer) || 'Client';
            const address = formatAddress(delivery.deliveryAddress) || '';
            const orderNumber = delivery.orderNumber || delivery.number || '';
            const raw = (delivery.status || '').toString().toLowerCase();
            const isCancelled = raw === 'cancelled';
            const label = getStatusLabel(raw);
            const when = delivery.completedDate || delivery.deliveredAt || delivery.cancelledAt || delivery.updatedAt || delivery.createdAt;
            const datetime = when ? new Date(when).toLocaleString('fr-FR', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' }) : '';
            const statusLabel = label;

            return (
              <div
                key={delivery.id}
                className="bg-white rounded-lg p-6 shadow-sm w-full"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-bold text-[#333333] mb-1">{orderNumber ? `Commande ${orderNumber}` : name}</h3>
                    <p className="text-sm text-[#888888]">{isCancelled ? 'Annulée le' : (label === 'Livrée' ? 'Livrée le' : 'Mise à jour le')} {datetime || '—'}</p>
                    <p className="text-sm text-gray-500 mt-1">{address}</p>
                  </div>
                  <div className="w-16 h-16 rounded-lg overflow-hidden">
                    <img
                      src="/src/assets/livreur.jpg"
                      alt="Livraison"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div>
                  {getStatusBadge(statusLabel)}
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