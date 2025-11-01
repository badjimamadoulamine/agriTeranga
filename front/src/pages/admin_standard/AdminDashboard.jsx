import React, { useState } from 'react'
import { 
  Users, 
  Package, 
  ShoppingCart, 
  GraduationCap,
  TrendingUp,
  DollarSign,
  Activity,
  UserCheck,
  RefreshCw,
  AlertCircle,
  Loader2
} from 'lucide-react'
import { useDashboard } from '../../hooks/useApi'

const AdminDashboard = () => {
  const { stats, loading, error, refetch } = useDashboard()
  const [refreshing, setRefreshing] = useState(false)

  const handleRefresh = async () => {
    setRefreshing(true)
    await refetch()
    setRefreshing(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-2" />
          <p className="text-gray-600">Chargement des données...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center">
          <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
          <div>
            <h3 className="text-sm font-medium text-red-800">Erreur de chargement</h3>
            <p className="text-sm text-red-600 mt-1">{error}</p>
          </div>
        </div>
        <button 
          onClick={handleRefresh}
          className="mt-3 text-sm text-red-600 hover:text-red-800 font-medium"
        >
          Réessayer
        </button>
      </div>
    )
  }

  // Calcul des statistiques avec valeurs par défaut
  const totalUsers = stats.users?.total || 0
  const totalProducts = stats.products?.total || 0
  const totalOrders = stats.orders?.total || 0
  const totalRevenue = stats.revenue?.total || 0
  const newUsersThisWeek = stats.users?.newThisWeek || 0

  // Calcul du pourcentage de changement (simulation basée sur les données réelles)
  const userChange = totalUsers > 0 ? `+${Math.round((newUsersThisWeek / totalUsers) * 100)}%` : '0%'

  const dashboardStats = [
    {
      name: 'Utilisateurs',
      value: totalUsers.toLocaleString(),
      change: userChange,
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      name: 'Produits',
      value: totalProducts.toLocaleString(),
      change: '+8%',
      icon: Package,
      color: 'bg-green-500'
    },
    {
      name: 'Ventes',
      value: totalOrders.toLocaleString(),
      change: '+23%',
      icon: ShoppingCart,
      color: 'bg-purple-500'
    },
    {
      name: 'Revenus',
      value: `${(totalRevenue / 1000000).toFixed(1)}M`,
      change: '+12%',
      icon: DollarSign,
      color: 'bg-orange-500'
    }
  ]

  // Traitement des commandes récentes
  const recentOrders = stats.recentOrders || []
  
  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'À l\'instant'
    if (diffInHours < 24) return `Il y a ${diffInHours} heure${diffInHours > 1 ? 's' : ''}`
    
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `Il y a ${diffInDays} jour${diffInDays > 1 ? 's' : ''}`
    
    return date.toLocaleDateString('fr-FR')
  }

  const getOrderType = (order) => {
    // Déterminer le type basé sur les données de la commande
    return 'sale'
  }

  const formatUserName = (user) => {
    if (!user) return 'Utilisateur inconnu'
    return `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Utilisateur inconnu'
  }

  const formatProductName = (product) => {
    if (!product) return 'Produit supprimé'
    return product.name || 'Produit sans nom'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Dashboard Administration
          </h1>
          <p className="text-gray-600">
            Vue d'ensemble de la plateforme AgriTeranga
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          Actualiser
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardStats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.name} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className={`${stat.color} rounded-lg p-3`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <div className="flex items-center">
                    <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                    <span className="ml-2 text-sm text-green-600 font-medium">
                      {stat.change}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Graphique des ventes */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Évolution des ventes
          </h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center text-gray-500">
              <TrendingUp className="w-12 h-12 mx-auto mb-2" />
              <p>Graphique des ventes</p>
              <p className="text-sm">(À implémenter avec Chart.js)</p>
            </div>
          </div>
        </div>

        {/* Activité récente */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Activité récente
          </h3>
          <div className="space-y-4">
            {recentOrders.length > 0 ? (
              recentOrders.slice(0, 5).map((order, index) => (
                <div key={order._id || index} className="flex items-start space-x-3">
                  <div className="bg-gray-100 rounded-full p-2">
                    <ShoppingCart className="w-4 h-4 text-gray-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">
                      <span className="font-medium">{formatUserName(order.consumer)}</span>{' '}
                      a passé une commande
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatProductName(order.items?.[0]?.product)} • {formatTimeAgo(order.createdAt)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Activity className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p>Aucune activité récente</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Actions rapides
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <UserCheck className="w-8 h-8 text-blue-600 mb-2" />
            <span className="text-sm font-medium">Gérer utilisateurs</span>
          </button>
          <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Package className="w-8 h-8 text-green-600 mb-2" />
            <span className="text-sm font-medium">Ajouter produit</span>
          </button>
          <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <GraduationCap className="w-8 h-8 text-purple-600 mb-2" />
            <span className="text-sm font-medium">Nouvelle formation</span>
          </button>
          <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <DollarSign className="w-8 h-8 text-orange-600 mb-2" />
            <span className="text-sm font-medium">Rapport ventes</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard