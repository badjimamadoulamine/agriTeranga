import DeliveryLayout from '../../layouts/DeliveryLayout';
import { Search, Calendar, Filter } from 'lucide-react';
import { useState } from 'react';

const DeliveryHistory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Delivery history data (from mockup)
  const deliveryHistory = [
    {
      id: 1,
      name: 'Mariama Ba',
      location: 'Maristes, Dakar',
      eventType: 'Heure de livraison',
      datetime: '10/05/2024 - 14:35',
      status: 'Livrée'
    },
    {
      id: 2,
      name: 'Ibrahima Diallo',
      location: 'Yoff, Dakar',
      eventType: 'Heure de livraison',
      datetime: '10/05/2024 - 11:10',
      status: 'Livrée'
    },
    {
      id: 3,
      name: 'Coumba Ndiaye',
      location: 'Sacré-Coeur 3, Dakar',
      eventType: 'Heure d\'annulation',
      datetime: '09/05/2024 - 16:20',
      status: 'Annulée'
    },
    {
      id: 4,
      name: 'Ousmane Faye',
      location: 'Fann Hock, Dakar',
      eventType: 'Heure de livraison',
      datetime: '09/05/2024 - 10:05',
      status: 'Livrée'
    },
    {
      id: 5,
      name: 'Sophie Gomis',
      location: 'Ngor, Dakar',
      eventType: 'Heure de livraison',
      datetime: '08/05/2024 - 17:45',
      status: 'Livrée'
    }
  ];

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

  return (
    <DeliveryLayout>
      <div className="max-w-6xl">
        {/* Page Title */}
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Historique des livraisons
        </h1>

        {/* Filter Bar */}
        <div className="flex items-center gap-3 mb-6">
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

          {/* Filter Button */}
          <button className="flex items-center gap-2 px-5 py-2 bg-[#59C94F] text-white rounded-lg hover:bg-[#4CAF50] transition-colors">
            <Filter className="w-4 h-4" />
            <span>Filtrer</span>
          </button>
        </div>

        {/* Delivery History List */}
        <div className="space-y-4">
          {deliveryHistory.map((delivery) => (
            <div
              key={delivery.id}
              className="bg-white rounded-lg p-5 border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                {/* Left: Recipient Info */}
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-1">
                    {delivery.name}
                  </h3>
                  <p className="text-sm text-gray-500">{delivery.location}</p>
                </div>

                {/* Middle: Event Details */}
                <div className="text-center">
                  <p className="text-xs text-gray-500 mb-1">{delivery.eventType}</p>
                  <p className="text-sm font-bold text-gray-800">{delivery.datetime}</p>
                </div>

                {/* Right: Status Badge */}
                <div>
                  {getStatusBadge(delivery.status)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DeliveryLayout>
  );
};

export default DeliveryHistory;