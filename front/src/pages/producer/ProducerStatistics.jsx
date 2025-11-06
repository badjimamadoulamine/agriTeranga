import ProducerLayout from '../../layouts/ProducerLayout';
import { DollarSign, ShoppingCart, Package, TrendingUp } from 'lucide-react';
import useProducerData from '../../hooks/useProducerData';

const ProducerStatistics = () => {
  const { stats, loading, error } = useProducerData();

  // KPI Cards Data basées sur les vraies statistiques
  const kpiCards = [
    {
      title: 'Revenus totaux',
      value: loading ? '...' : `${stats.totalRevenue?.toLocaleString() || 0} CFA`,
      icon: DollarSign,
      bgColor: 'bg-[#59C94F]',
      iconColor: 'text-white'
    },
    {
      title: 'Commandes totales',
      value: loading ? '...' : stats.totalOrders || 0,
      icon: ShoppingCart,
      bgColor: 'bg-[#7FB8E1]',
      iconColor: 'text-white'
    },
    {
      title: 'Produits publiés',
      value: loading ? '...' : stats.publishedProducts || 0,
      icon: Package,
      bgColor: 'bg-[#F5CE5F]',
      iconColor: 'text-white'
    },
    {
      title: 'Note moyenne',
      value: loading ? '...' : `${stats.averageRating || 0}/5`,
      icon: TrendingUp,
      bgColor: 'bg-[#E55F5F]',
      iconColor: 'text-white'
    }
  ];

  return (
    <ProducerLayout
      pageTitle="Statistiques"
      pageSubtitle="Aperçu des performances de votre ferme"
    >
      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-6 mb-6">
        {kpiCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-lg p-6 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-2">{card.title}</p>
                  <p className="text-2xl font-bold text-gray-800">{card.value}</p>
                </div>
                <div className={`${card.bgColor} ${card.iconColor} p-3 rounded-full`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Statistiques supplémentaires */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Résumé des commandes */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-6">
            État des commandes
          </h3>
          
          {loading ? (
            <div className="text-center py-8 text-gray-500">Chargement...</div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">{error}</div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b">
                <span className="text-gray-600">Commandes en attente</span>
                <span className="text-2xl font-bold text-orange-600">{stats.pendingOrders || 0}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b">
                <span className="text-gray-600">Commandes complétées</span>
                <span className="text-2xl font-bold text-green-600">{stats.completedOrders || 0}</span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-gray-600">Revenus du mois</span>
                <span className="text-2xl font-bold text-blue-600">
                  {stats.monthlyRevenue?.toLocaleString() || 0} CFA
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Produits */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-6">
            Vos produits
          </h3>
          
          {loading ? (
            <div className="text-center py-8 text-gray-500">Chargement...</div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">{error}</div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b">
                <span className="text-gray-600">Produits publiés</span>
                <span className="text-2xl font-bold text-green-600">{stats.publishedProducts || 0}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b">
                <span className="text-gray-600">Produits non publiés</span>
                <span className="text-2xl font-bold text-gray-600">{stats.unpublishedProducts || 0}</span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-gray-600">Total de produits</span>
                <span className="text-2xl font-bold text-blue-600">{stats.totalProducts || 0}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProducerLayout>
  );
};

export default ProducerStatistics;