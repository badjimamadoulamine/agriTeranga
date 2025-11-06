import ProducerLayout from '../../layouts/ProducerLayout';
import { Filter, Calendar, Download, MoreVertical, X } from 'lucide-react';
import useProducerData from '../../hooks/useProducerData';
import { useState } from 'react';
import { toast } from 'react-toastify';

const ProducerSales = () => {
  const { 
    orders, 
    loading, 
    error,
    ordersPagination,
    changeOrdersPage 
  } = useProducerData();

  // États pour les filtres
  const [showPeriodFilter, setShowPeriodFilter] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [filteredOrders, setFilteredOrders] = useState([]);

  // Fonction pour formater la date
  const formatDate = (dateString) => {
    if (!dateString) return '—';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  };

  // Fonction pour mapper le statut de paiement
  const getPaymentStatusLabel = (paymentStatus, orderStatus) => {
    if (orderStatus === 'cancelled') return 'Annulé';
    if (paymentStatus === 'paid') return 'Payé';
    if (paymentStatus === 'pending') return 'En attente';
    return 'Non payé';
  };

  // Fonction pour filtrer par période
  const handlePeriodFilter = () => {
    if (!startDate || !endDate) {
      toast.error('Veuillez sélectionner les deux dates');
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start > end) {
      toast.error('La date de début doit être antérieure à la date de fin');
      return;
    }

    const filtered = orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      return orderDate >= start && orderDate <= end;
    });

    setFilteredOrders(filtered);
    setShowPeriodFilter(false);
    toast.success(`${filtered.length} vente(s) trouvée(s) pour cette période`);
  };

  // Fonction pour réinitialiser les filtres
  const handleResetFilter = () => {
    setStartDate('');
    setEndDate('');
    setFilteredOrders([]);
    setShowPeriodFilter(false);
    toast.info('Filtres réinitialisés');
  };

  // Fonction pour exporter en CSV
  const handleExport = () => {
    const ordersToExport = filteredOrders.length > 0 ? filteredOrders : orders;

    if (ordersToExport.length === 0) {
      toast.warning('Aucune vente à exporter');
      return;
    }

    // Créer le contenu CSV
    let csvContent = 'ID Commande,Date,Produits,Client,Montant (CFA),Statut\n';
    
    ordersToExport.forEach(order => {
      const producerItems = order.items?.filter(item => item.producer) || [];
      const totalAmount = producerItems.reduce((sum, item) => sum + (item.subtotal || 0), 0);
      const productNames = producerItems.map(item => item.productName || item.product?.name).filter(Boolean).join(' | ');
      const clientName = order.user ? `${order.user.firstName || ''} ${order.user.lastName || ''}`.trim() : 'Client inconnu';
      const status = getPaymentStatusLabel(order.paymentStatus, order.status);
      const date = formatDate(order.createdAt);
      const orderId = order._id?.slice(-6) || 'N/A';

      csvContent += `#${orderId},"${date}","${productNames}","${clientName}",${totalAmount},"${status}"\n`;
    });

    // Créer le fichier et le télécharger
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `ventes_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success(`${ordersToExport.length} vente(s) exportée(s)`);
  };

  // Obtenir les commandes à afficher (filtrées ou toutes)
  const displayedOrders = filteredOrders.length > 0 ? filteredOrders : orders;

  const getStatusBadge = (status) => {
    const statusStyles = {
      'Payé': 'bg-[#A8E6A8] text-white',
      'En attente': 'bg-[#FFEB9C] text-gray-700',
      'Annulé': 'bg-[#FDDEDE] text-white'
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyles[status]}`}>
        {status}
      </span>
    );
  };

  return (
    <ProducerLayout pageTitle="Gestion des ventes">
      <div className="bg-white rounded-lg shadow-sm">
        {/* Filter Bar */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Period Button */}
            <div className="relative">
              <button 
                onClick={() => setShowPeriodFilter(!showPeriodFilter)}
                className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${
                  filteredOrders.length > 0 
                    ? 'border-green-500 bg-green-50 text-green-700' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span>Période</span>
                {filteredOrders.length > 0 && (
                  <span className="ml-1 bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    {filteredOrders.length}
                  </span>
                )}
              </button>

              {/* Period Filter Dropdown */}
              {showPeriodFilter && (
                <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-10 w-80">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-gray-800">Filtrer par période</h3>
                    <button 
                      onClick={() => setShowPeriodFilter(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date de début
                      </label>
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date de fin
                      </label>
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={handlePeriodFilter}
                        className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Appliquer
                      </button>
                      {filteredOrders.length > 0 && (
                        <button
                          onClick={handleResetFilter}
                          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          Réinitialiser
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Export Button */}
          <button 
            onClick={handleExport}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4" />
            <span>Exporter CSV</span>
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center py-12 text-gray-500">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
              <p className="mt-4">Chargement des ventes...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12 text-red-500">
              <p>{error}</p>
            </div>
          ) : displayedOrders.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p>{filteredOrders.length === 0 && startDate && endDate ? 'Aucune vente trouvée pour cette période' : 'Aucune vente enregistrée'}</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-gray-300"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-bold text-gray-700">
                    ID Commande
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-bold text-gray-700">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-bold text-gray-700">
                    Produits
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-bold text-gray-700">
                    Client
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-bold text-gray-700">
                    Montant
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-bold text-gray-700">
                    Statut
                  </th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {displayedOrders.map((order) => {
                  // Calculer le montant total des produits du producteur dans cette commande
                  const producerItems = order.items?.filter(item => item.producer) || [];
                  const totalAmount = producerItems.reduce((sum, item) => sum + (item.subtotal || 0), 0);
                  const productNames = producerItems.map(item => item.productName || item.product?.name).filter(Boolean).join(', ') || 'N/A';
                  const clientName = order.user ? `${order.user.firstName || ''} ${order.user.lastName || ''}`.trim() : 'Client inconnu';
                  const status = getPaymentStatusLabel(order.paymentStatus, order.status);

                  return (
                    <tr key={order._id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <input
                          type="checkbox"
                          className="w-4 h-4 rounded border-gray-300"
                        />
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-800">
                        #{order._id?.slice(-6) || 'N/A'}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-800">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-800">
                        {productNames}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-800">
                        {clientName}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-800">
                        {totalAmount.toLocaleString()} CFA
                      </td>
                      <td className="px-4 py-4">
                        {getStatusBadge(status)}
                      </td>
                      <td className="px-4 py-4">
                        <button className="text-gray-500 hover:text-gray-700">
                          <MoreVertical className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination - Affichée seulement si pas de filtres actifs */}
        {!loading && !error && orders.length > 0 && filteredOrders.length === 0 && (
          <div className="p-4 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Page {ordersPagination.page} sur {ordersPagination.totalPages} ({ordersPagination.total} résultats)
            </div>

            <div className="flex items-center gap-2">
              {/* Previous Button */}
              <button
                onClick={() => changeOrdersPage(ordersPagination.page - 1)}
                disabled={ordersPagination.page === 1}
                className="px-3 py-1 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ←
              </button>

              {/* Page Numbers */}
              {Array.from({ length: Math.min(5, ordersPagination.totalPages) }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => changeOrdersPage(page)}
                  className={`px-3 py-1 rounded ${
                    page === ordersPagination.page
                      ? 'bg-[#387D38] text-white'
                      : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}

              {/* Next Button */}
              <button
                onClick={() => changeOrdersPage(ordersPagination.page + 1)}
                disabled={ordersPagination.page === ordersPagination.totalPages}
                className="px-3 py-1 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                →
              </button>
            </div>
          </div>
        )}

        {/* Indicateur de résultats filtrés */}
        {!loading && !error && filteredOrders.length > 0 && (
          <div className="p-4 bg-green-50 border-t border-green-100">
            <div className="flex items-center justify-between">
              <p className="text-sm text-green-800">
                <span className="font-semibold">{filteredOrders.length}</span> vente(s) trouvée(s) pour la période sélectionnée
              </p>
              <button
                onClick={handleResetFilter}
                className="text-sm text-green-700 hover:text-green-800 font-medium underline"
              >
                Afficher toutes les ventes
              </button>
            </div>
          </div>
        )}
      </div>
    </ProducerLayout>
  );
};

export default ProducerSales;