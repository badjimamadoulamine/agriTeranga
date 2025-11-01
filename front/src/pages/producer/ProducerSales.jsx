import ProducerLayout from '../../layouts/ProducerLayout';
import { Filter, Calendar, Download, MoreVertical } from 'lucide-react';
import { useState } from 'react';

const ProducerSales = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 5;
  const resultsPerPage = 5;
  const totalResults = 25;

  // Sales transactions data
  const transactions = [
    {
      id: '#12548',
      date: '15/07/2024',
      product: 'Tomates fraîches',
      client: 'Awa Diop',
      amount: '12 500 CFA',
      status: 'Payé'
    },
    {
      id: '#12547',
      date: '14/07/2024',
      product: 'Concombres',
      client: 'Moussa Fall',
      amount: '8 000 CFA',
      status: 'Payé'
    },
    {
      id: '#12546',
      date: '14/07/2024',
      product: 'Aubergines',
      client: 'Fatou Ndiaye',
      amount: '5 500 CFA',
      status: 'En attente'
    },
    {
      id: '#12545',
      date: '13/07/2024',
      product: 'Piments',
      client: 'Jean-Pierre Sarr',
      amount: '3 000 CFA',
      status: 'Annulé'
    },
    {
      id: '#12544',
      date: '12/07/2024',
      product: 'Carottes Bio',
      client: 'Oumar Diallo',
      amount: '7 200 CFA',
      status: 'Payé'
    }
  ];

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

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <ProducerLayout pageTitle="Gestion des ventes">
      <div className="bg-white rounded-lg shadow-sm">
        {/* Filter Bar */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Filters Button */}
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
              <Filter className="w-4 h-4" />
              <span>Filtres</span>
            </button>

            {/* Period Button */}
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
              <Calendar className="w-4 h-4" />
              <span>Période</span>
            </button>
          </div>

          {/* Export Button */}
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4" />
            <span>Exporter</span>
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
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
                  ID Transaction
                </th>
                <th className="px-4 py-3 text-left text-sm font-bold text-gray-700">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-sm font-bold text-gray-700">
                  Produit
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
              {transactions.map((transaction, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-gray-300"
                    />
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-800">
                    {transaction.id}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-800">
                    {transaction.date}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-800">
                    {transaction.product}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-800">
                    {transaction.client}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-800">
                    {transaction.amount}
                  </td>
                  <td className="px-4 py-4">
                    {getStatusBadge(transaction.status)}
                  </td>
                  <td className="px-4 py-4">
                    <button className="text-gray-500 hover:text-gray-700">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Affiche {(currentPage - 1) * resultsPerPage + 1}-{Math.min(currentPage * resultsPerPage, totalResults)} sur {totalResults} résultats
          </div>

          <div className="flex items-center gap-2">
            {/* Previous Button */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ←
            </button>

            {/* Page Numbers */}
            {[1, 2, 3, '...', totalPages].map((page, index) => (
              <button
                key={index}
                onClick={() => typeof page === 'number' && handlePageChange(page)}
                disabled={page === '...'}
                className={`px-3 py-1 rounded ${
                  page === currentPage
                    ? 'bg-[#387D38] text-white'
                    : page === '...'
                    ? 'text-gray-400 cursor-default'
                    : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}

            {/* Next Button */}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              →
            </button>
          </div>
        </div>
      </div>
    </ProducerLayout>
  );
};

export default ProducerSales;