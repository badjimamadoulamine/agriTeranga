import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
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
  Loader2,
  X,
  Plus
} from 'lucide-react'
import { useDashboard } from '../../hooks/useApi'
import { useToast } from '../../contexts/ToastContext'
import AdminSidebar from '../../components/admin/AdminSidebar'
import AdminHeader from '../../components/admin/AdminHeader'
import SuperAdminSidebar from '../../components/super_admin/SuperAdminSidebar'
import SuperAdminHeader from '../../components/super_admin/SuperAdminHeader'
import AdminProfileModal from '../../components/admin/AdminProfileModal'
import apiService from '../../services/apiService'

const AdminDashboard = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { stats, loading, error, refetch } = useDashboard()
  const { success, error: showError, loading: showLoading } = useToast()
  const [refreshing, setRefreshing] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  
  // États pour les modals et actions rapides
  const [showProductModal, setShowProductModal] = useState(false)
  const [showFormationModal, setShowFormationModal] = useState(false)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: null
  })
  const [formationForm, setFormationForm] = useState({
    title: '',
    description: '',
    category: '',
    duration: '',
    price: ''
  })
  const [creatingProduct, setCreatingProduct] = useState(false)
  const [creatingFormation, setCreatingFormation] = useState(false)
  
  // Détecter si on est dans un contexte Super Admin
  const isSuperAdminContext = location.pathname.startsWith('/super-admin/')
  
  // Déterminer quel stockage utiliser selon le contexte
  const user = React.useMemo(() => {
    try {
      let storageKey
      if (isSuperAdminContext) {
        // Essayer d'abord le stockage super admin, puis fallback sur admin
        storageKey = localStorage.getItem('superAdminUser') || localStorage.getItem('adminDashboardUser')
      } else {
        storageKey = localStorage.getItem('adminDashboardUser')
      }
      return storageKey ? JSON.parse(storageKey) : null
    } catch {
      return null
    }
  }, [isSuperAdminContext])

  const handleRefresh = async () => {
    setRefreshing(true)
    await refetch()
    setRefreshing(false)
  }

  const handleLogout = () => {
    // Supprimer tous les tokens pertinents
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('adminDashboardUser')
    localStorage.removeItem('superAdminUser')
    // Redirection selon le contexte
    window.location.href = isSuperAdminContext ? '/login' : '/admin/login'
  }

  const handleOpenProfile = () => {
    setShowProfileModal(true)
  }

  const handleProfileUpdated = () => {
    // Actualiser les informations utilisateur si nécessaire
    // Le modal gère la mise à jour via l'API et les callbacks
    console.log('Profil mis à jour')
  }

  // ==================== ACTIONS RAPIDES API ====================
  
  // Gestion utilisateurs - Navigation
  const handleManageUsers = () => {
    navigate(isSuperAdminContext ? '/super-admin/admin-users' : '/admin/users')
  }

  // Ajouter produit - Ouvrir modal
  const handleAddProduct = () => {
    setShowProductModal(true)
  }

  // Nouvelle formation - Ouvrir modal
  const handleNewFormation = () => {
    setShowFormationModal(true)
  }

  // Rapport ventes - Rafraîchir données + redirection
  const handleSalesReport = async () => {
    try {
      await refetch()
      navigate(isSuperAdminContext ? '/super-admin/sales' : '/admin/sales')
    } catch (err) {
      showError('Erreur lors du chargement des données de vente')
    }
  }

  // Créer un produit via API
  const createProduct = async () => {
    if (!productForm.name || !productForm.price) {
      showError('Veuillez remplir tous les champs obligatoires')
      return
    }

    setCreatingProduct(true)
    const loadingId = showLoading('Création du produit en cours...')

    try {
      const productData = {
        name: productForm.name,
        description: productForm.description,
        price: parseFloat(productForm.price),
        category: productForm.category,
        status: 'active'
      }

      await apiService.createProduct(productData)
      
      setShowProductModal(false)
      setProductForm({
        name: '',
        description: '',
        price: '',
        category: '',
        image: null
      })
      
      await refetch() // Rafraîchir les statistiques
      success('Produit créé avec succès !')
    } catch (err) {
      showError(err.message || 'Erreur lors de la création du produit')
    } finally {
      setCreatingProduct(false)
    }
  }

  // Créer une formation via API
  const createFormation = async () => {
    if (!formationForm.title || !formationForm.description) {
      showError('Veuillez remplir tous les champs obligatoires')
      return
    }

    setCreatingFormation(true)
    const loadingId = showLoading('Création de la formation en cours...')

    try {
      const formationData = {
        title: formationForm.title,
        description: formationForm.description,
        category: formationForm.category,
        duration: parseInt(formationForm.duration),
        price: parseFloat(formationForm.price) || 0,
        isPublished: false
      }

      await apiService.createFormation(formationData)
      
      setShowFormationModal(false)
      setFormationForm({
        title: '',
        description: '',
        category: '',
        duration: '',
        price: ''
      })
      
      await refetch() // Rafraîchir les statistiques
      success('Formation créée avec succès !')
    } catch (err) {
      showError(err.message || 'Erreur lors de la création de la formation')
    } finally {
      setCreatingFormation(false)
    }
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

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Vérification de l'authentification...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-[#F8FAF8]">
      {/* Utiliser les composants appropriés selon le contexte */}
      {isSuperAdminContext ? (
        <SuperAdminSidebar user={user} onClose={() => setSidebarOpen(false)} />
      ) : (
        <AdminSidebar user={user} />
      )}
      <div className="flex-1 flex flex-col overflow-hidden">
        {isSuperAdminContext ? (
          <SuperAdminHeader
            user={user}
            onOpenProfile={handleOpenProfile}
            onLogout={handleLogout}
            onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          />
        ) : (
          <AdminHeader
            user={user}
            onOpenProfile={handleOpenProfile}
            onLogout={handleLogout}
          />
        )}
        <main className="flex-1 overflow-y-auto p-6">
    <div className="space-y-6">
      {loading && (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-2" />
            <p className="text-gray-600">Chargement des données...</p>
          </div>
        </div>
      )}

      {!loading && error && (
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
      )}

      {!loading && !error && (
        <>
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
          <button 
            onClick={handleManageUsers}
            className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <UserCheck className="w-8 h-8 text-blue-600 mb-2" />
            <span className="text-sm font-medium">Gérer utilisateurs</span>
            <span className="text-xs text-gray-500 mt-1">
              {stats.users?.total || 0} utilisateurs
            </span>
          </button>
          <button 
            onClick={handleAddProduct}
            className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Package className="w-8 h-8 text-green-600 mb-2" />
            <span className="text-sm font-medium">Ajouter produit</span>
            <span className="text-xs text-gray-500 mt-1">
              {stats.products?.total || 0} produits
            </span>
          </button>
          <button 
            onClick={handleNewFormation}
            className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <GraduationCap className="w-8 h-8 text-purple-600 mb-2" />
            <span className="text-sm font-medium">Nouvelle formation</span>
            <span className="text-xs text-gray-500 mt-1">
              Actions rapides API
            </span>
          </button>
          <button 
            onClick={handleSalesReport}
            className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <DollarSign className="w-8 h-8 text-orange-600 mb-2" />
            <span className="text-sm font-medium">Rapport ventes</span>
            <span className="text-xs text-gray-500 mt-1">
              {((stats.revenue?.total || 0) / 1000000).toFixed(1)}M€ CA
            </span>
          </button>
        </div>
      </div>
        </main>
      </div>
      
      {/* Modal de création de produit */}
      {showProductModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">Créer un nouveau produit</h2>
              <button
                onClick={() => setShowProductModal(false)}
                className="text-gray-400 hover:text-gray-600"
                disabled={creatingProduct}
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom du produit *
                </label>
                <input
                  type="text"
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ex: Tomate bio"
                  disabled={creatingProduct}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                  placeholder="Description du produit..."
                  disabled={creatingProduct}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prix (€) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0.00"
                    disabled={creatingProduct}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Catégorie
                  </label>
                  <input
                    type="text"
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ex: Légumes"
                    disabled={creatingProduct}
                  />
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 p-6 border-t bg-gray-50">
              <button
                onClick={() => setShowProductModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                disabled={creatingProduct}
              >
                Annuler
              </button>
              <button
                onClick={createProduct}
                disabled={creatingProduct || !productForm.name || !productForm.price}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {creatingProduct ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Création...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Créer
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal de création de formation */}
      {showFormationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">Créer une nouvelle formation</h2>
              <button
                onClick={() => setShowFormationModal(false)}
                className="text-gray-400 hover:text-gray-600"
                disabled={creatingFormation}
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Titre de la formation *
                </label>
                <input
                  type="text"
                  value={formationForm.title}
                  onChange={(e) => setFormationForm({ ...formationForm, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Ex: Techniques de culture bio"
                  disabled={creatingFormation}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  value={formationForm.description}
                  onChange={(e) => setFormationForm({ ...formationForm, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  rows={3}
                  placeholder="Description de la formation..."
                  disabled={creatingFormation}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Catégorie
                  </label>
                  <input
                    type="text"
                    value={formationForm.category}
                    onChange={(e) => setFormationForm({ ...formationForm, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Ex: Agriculture"
                    disabled={creatingFormation}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Durée (heures)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formationForm.duration}
                    onChange={(e) => setFormationForm({ ...formationForm, duration: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="8"
                    disabled={creatingFormation}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prix (€)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formationForm.price}
                  onChange={(e) => setFormationForm({ ...formationForm, price: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="0.00"
                  disabled={creatingFormation}
                />
              </div>
            </div>
            
            <div className="flex gap-3 p-6 border-t bg-gray-50">
              <button
                onClick={() => setShowFormationModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                disabled={creatingFormation}
              >
                Annuler
              </button>
              <button
                onClick={createFormation}
                disabled={creatingFormation || !formationForm.title || !formationForm.description}
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {creatingFormation ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Création...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Créer
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de profil */}
      <AdminProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        user={user}
        onUpdated={handleProfileUpdated}
      />
    </div>
  )
}

export default AdminDashboard