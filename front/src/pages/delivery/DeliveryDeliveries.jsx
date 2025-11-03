import React, { useState } from 'react';
import { Search, Clock, ChevronDown } from 'lucide-react';
import DeliveryLayout from '../../layouts/DeliveryLayout';

const DeliveryDeliveries = () => {
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('time');
  const [searchQuery, setSearchQuery] = useState('');

  // Données des livraisons
  const deliveries = [
    {
      id: 1,
      customerName: 'Fatou Diop',
      status: 'pending',
      statusLabel: 'En attente',
      address: 'Sicap Liberté 6, Dakar',
      estimatedTime: '14:30',
      deliveredTime: null,
    },
    {
      id: 2,
      customerName: 'Moussa Fall',
      status: 'in-progress',
      statusLabel: 'En cours',
      address: 'Point E, Dakar',
      estimatedTime: '15:00',
      deliveredTime: null,
    },
    {
      id: 3,
      customerName: 'Aminata Seck',
      status: 'completed',
      statusLabel: 'Terminée',
      address: 'Ouakam, Dakar',
      estimatedTime: null,
      deliveredTime: '13:45',
    },
    {
      id: 4,
      customerName: 'Ibrahima Ndiaye',
      status: 'pending',
      statusLabel: 'En attente',
      address: 'Médina, Dakar',
      estimatedTime: '16:15',
      deliveredTime: null,
    },
    {
      id: 5,
      customerName: 'Awa Sarr',
      status: 'in-progress',
      statusLabel: 'En cours',
      address: 'Plateau, Dakar',
      estimatedTime: '14:45',
      deliveredTime: null,
    },
    {
      id: 6,
      customerName: 'Omar Ba',
      status: 'completed',
      statusLabel: 'Terminée',
      address: 'Almadies, Dakar',
      estimatedTime: null,
      deliveredTime: '12:30',
    },
  ];

  // Fonction pour obtenir le style du badge de statut
  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-blue-100 text-blue-700';
      case 'in-progress':
        return 'bg-orange-100 text-orange-700';
      case 'completed':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
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
            onChange={(e) => setFilterStatus(e.target.value)}
            className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2.5 pr-10 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer"
          >
            <option value="all">Filtrer par: Tous les statuts</option>
            <option value="pending">En attente</option>
            <option value="in-progress">En cours</option>
            <option value="completed">Terminée</option>
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

      {/* Delivery Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {deliveries.map((delivery) => (
          <div
            key={delivery.id}
            className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6"
          >
            {/* Customer Name */}
            <h3 className="text-lg font-bold text-gray-800 mb-3">
              {delivery.customerName}
            </h3>

            {/* Status Badge */}
            <div className="mb-4">
              <span
                className={`${getStatusBadgeStyle(
                  delivery.status
                )} text-xs font-medium px-3 py-1.5 rounded-full inline-block`}
              >
                {delivery.statusLabel}
              </span>
            </div>

            {/* Address */}
            <p className="text-gray-600 text-sm mb-4">{delivery.address}</p>

            {/* Time Information */}
            <div className="flex items-center space-x-2 text-gray-600 text-sm mb-4">
              <Clock className="w-4 h-4" />
              {delivery.status === 'completed' ? (
                <span>Livrée à {delivery.deliveredTime}</span>
              ) : (
                <span>HAE: {delivery.estimatedTime}</span>
              )}
            </div>

            {/* View Details Link */}
            <button className="text-green-600 hover:text-green-700 font-medium text-sm hover:underline transition-colors">
              Voir détails
            </button>
          </div>
        ))}
      </div>
    </DeliveryLayout>
  );
};

export default DeliveryDeliveries;