import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { 
  Package, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2,
  Eye,
  
  Tag,
  TrendingUp,
  AlertTriangle,
  Loader2,
  RefreshCw,
  User,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react'
import { useProducts, usePendingProducts, useCategories } from '../../hooks/useApi'
import AdminSidebar from '../../components/admin/AdminSidebar'
import AdminHeader from '../../components/admin/AdminHeader'
import SuperAdminSidebar from '../../components/super_admin/SuperAdminSidebar'
import SuperAdminHeader from '../../components/super_admin/SuperAdminHeader'
import AdminProfileModal from '../../components/admin/AdminProfileModal'

const AdminProducts = () => {
  const location = useLocation()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(20)
  const [operationLoading, setOperationLoading] = useState(null)
  const [activeTab, setActiveTab] = useState('all') // 'all' ou 'pending'
  
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

  // Hooks pour récupérer les données
  const { 
    products, 
    total, 
    loading: productsLoading, 
    error: productsError, 
    refetch: refetchProducts,
    updateProduct,
    deleteProduct
  } = useProducts({
    category: selectedCategory === 'all' ? undefined : selectedCategory,
    search: searchTerm || undefined,
    page: currentPage,
    limit: itemsPerPage
  })

  const {
    pendingProducts,
    loading: pendingLoading,
    error: pendingError,
    refetch: refetchPending,
    approveProduct
  } = usePendingProducts()

  // Hook pour récupérer les catégories de produits
  const { 
    categories, 
    loading: categoriesLoading, 
    error: categoriesError, 
    refetch: refetchCategories 
  } = useCategories('products')

  const handleSearch = (value) => {
    setSearchTerm(value)
    setCurrentPage(1)
  }

  const handleApprove = async (productId) => {
    try {
      setOperationLoading(productId)
      await approveProduct(productId)
    } catch (error) {
      alert(`Erreur lors de l'approbation: ${error.message}`)
    } finally {
      setOperationLoading(null)
    }
  }

  const handleDelete = async (productId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      try {
        setOperationLoading(productId)
        await deleteProduct(productId)
      } catch (error) {
        alert(`Erreur lors de la suppression: ${error.message}`)
      } finally {
        setOperationLoading(null)
      }
    }
  }

  const getProductStatus = (product) => {
    if (product.isApproved === false) return 'pending'
    return product.isAvailable ? 'active' : 'inactive'
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Actif
          </span>
        )
      case 'inactive':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            <XCircle className="w-3 h-3 mr-1" />
            Inactif
          </span>
        )
      case 'pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" />
            En attente
          </span>
        )
      default:
        return null
    }
  }

  const formatPrice = (price) => {
    // Afficher en FCFA (formatage local + suffixe FCFA)
    const formatted = new Intl.NumberFormat('fr-FR').format(price || 0)
    return `${formatted} FCFA`
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Non spécifiée'
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const displayProducts = activeTab === 'pending' ? pendingProducts : products
  const loading = activeTab === 'pending' ? pendingLoading : productsLoading
  const error = activeTab === 'pending' ? pendingError : productsError

  // Statistiques
  const totalProducts = products.length
  const totalStock = products.reduce((sum, p) => sum + (p.stock || 0), 0)
  const stockValue = products.reduce((sum, p) => sum + ((p.price || 0) * (p.stock || 0)), 0)
  const activeProducts = products.filter(p => getProductStatus(p) === 'active').length
  const pendingCount = pendingProducts.length

  // Recent products preview (most recent)
  const [showRecent, setShowRecent] = React.useState(false)
  const [recentProducts, setRecentProducts] = React.useState([])
  const [recentLoading, setRecentLoading] = React.useState(false)
  const [recentError, setRecentError] = React.useState(null)

  // Product details modal
  const [selectedProduct, setSelectedProduct] = React.useState(null)
  const [showDetails, setShowDetails] = React.useState(false)
  const [showProfileModal, setShowProfileModal] = useState(false)

  const handleProfileUpdated = () => {
    console.log('Profil mis à jour')
  }

  const loadRecentProducts = async () => {
    setRecentLoading(true)
    setRecentError(null)
    try {
      // demander les produits triés par date décroissante
      const res = await apiService.getProducts({ page: 1, limit: 10, sort: '-createdAt' })
      const list = (res && res.data && res.data.products) || res.products || res.data || []
      setRecentProducts(list)
    } catch (err) {
      setRecentError(err?.message || 'Erreur lors du chargement des produits récents')
      setRecentProducts([])
    } finally {
      setRecentLoading(false)
    }
  }

  const handleToggleRecent = () => {
    if (!showRecent) loadRecentProducts()
    setShowRecent((s) => !s)
  }

  const user = React.useMemo(() => {
    try {
      const raw = localStorage.getItem('adminDashboardUser') || localStorage.getItem('user')
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  }, [])

  if (loading) {
    const SidebarComponent = isSuperAdminContext ? SuperAdminSidebar : AdminSidebar
    const HeaderComponent = isSuperAdminContext ? SuperAdminHeader : AdminHeader
    
    return (
      <div className="flex h-screen bg-[#F8FAF8]">
        <SidebarComponent user={user} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <HeaderComponent 
            user={user} 
            onOpenProfile={() => setShowProfileModal(true)} 
            onLogout={() => { 
              localStorage.clear(); 
              window.location.href = isSuperAdminContext ? '/login' : '/admin/login' 
            }} 
          />
          <main className="flex-1 overflow-y-auto p-6">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-2" />
                <p className="text-gray-600">Chargement des produits...</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-[#F8FAF8]">
      {isSuperAdminContext ? (
        <SuperAdminSidebar user={user} />
      ) : (
        <AdminSidebar user={user} />
      )}
      <div className="flex-1 flex flex-col overflow-hidden">
        {isSuperAdminContext ? (
          <SuperAdminHeader 
            user={user} 
            onOpenProfile={() => setShowProfileModal(true)} 
            onLogout={() => { 
              localStorage.clear(); 
              window.location.href = '/login' 
            }} 
          />
        ) : (
          <AdminHeader 
            user={user} 
            onOpenProfile={() => setShowProfileModal(true)} 
            onLogout={() => { 
              localStorage.clear(); 
              window.location.href = '/admin/login' 
            }} 
          />
        )}
        <main className="flex-1 overflow-y-auto p-6">
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Produits</h1>
          <p className="text-gray-600">Gérez le catalogue de produits agricoles</p>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={activeTab === 'pending' ? refetchPending : refetchProducts}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
          >
            <RefreshCw className="w-5 h-5" />
            <span>Actualiser</span>
          </button>
          <button
            onClick={handleToggleRecent}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Nouveau produit</span>
          </button>
        </div>
      </div>

      {/* Recent products preview panel */}
      {showRecent && (
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-medium mb-2">Produits récents</h3>
          {recentLoading ? (
            <div className="text-center py-8">
              <Loader2 className="w-6 h-6 animate-spin mx-auto text-blue-600" />
            </div>
          ) : recentError ? (
            <div className="text-red-600">{recentError}</div>
          ) : recentProducts.length === 0 ? (
            <div className="text-gray-600">Aucun produit récent trouvé.</div>
          ) : (
            <ul className="space-y-2">
              {recentProducts.map((p) => (
                <li key={p._id} className="flex justify-between items-center border-b pb-2">
                  <div>
                    <div className="font-medium text-sm">{p.name}</div>
                    <div className="text-xs text-gray-500">{p.category || 'Non catégorisé'}</div>
                  </div>
                  <div className="text-right text-sm text-gray-700">
                    <div>{formatPrice(p.price)}</div>
                    <div className="text-xs text-gray-500">{new Date(p.createdAt).toLocaleString('fr-FR')}</div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-blue-500 rounded-lg p-3">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Produits</p>
              <p className="text-2xl font-semibold text-gray-900">{totalProducts}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-green-500 rounded-lg p-3">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Produits Actifs</p>
              <p className="text-2xl font-semibold text-gray-900">{activeProducts}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-yellow-500 rounded-lg p-3">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">En Attente</p>
              <p className="text-2xl font-semibold text-gray-900">{pendingCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-purple-500 rounded-lg p-3">
              <span className="text-white font-semibold">FCFA</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Valeur Stock</p>
              <p className="text-2xl font-semibold text-gray-900">
                {formatPrice(stockValue)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('all')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'all'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Tous les Produits
          </button>
          <button
            onClick={() => setActiveTab('pending')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'pending'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Produits en Attente
            {pendingCount > 0 && (
              <span className="ml-2 bg-red-100 text-red-600 py-0.5 px-2 rounded-full text-xs">
                {pendingCount}
              </span>
            )}
          </button>
        </nav>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
            <div>
              <h3 className="text-sm font-medium text-red-800">Erreur de chargement</h3>
              <p className="text-sm text-red-600 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Filters (only for all products tab) */}
      {activeTab === 'all' && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher un produit..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value)
                  setCurrentPage(1)
                }}
                disabled={categoriesLoading}
              >
                <option value="all">Toutes les catégories</option>
                {categoriesLoading ? (
                  <option value="" disabled>Chargement...</option>
                ) : categoriesError ? (
                  <option value="" disabled>Erreur de chargement</option>
                ) : (
                  categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))
                )}
              </select>
              {categoriesError && (
                <button
                  onClick={refetchCategories}
                  className="absolute right-8 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  title="Réessayer"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Status Filter */}
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value)
                setCurrentPage(1)
              }}
            >
              <option value="all">Tous les statuts</option>
              <option value="active">Actif</option>
              <option value="inactive">Inactif</option>
              <option value="pending">En attente</option>
            </select>

            {/* Items per page */}
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value))
                setCurrentPage(1)
              }}
            >
              <option value={10}>10 par page</option>
              <option value={20}>20 par page</option>
              <option value={50}>50 par page</option>
              <option value={100}>100 par page</option>
            </select>
          </div>
        </div>
      )}

      {/* Products Table (desktop) + Mobile list */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Produit
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Catégorie
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prix
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Producteur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {displayProducts.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
                    <Package className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p>Aucun produit trouvé</p>
                  </td>
                </tr>
              ) : (
                displayProducts.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
                          <Package className="w-5 h-5 text-white" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {product.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {product.description?.substring(0, 50)}...
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                        {product.category || 'Non catégorisé'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatPrice(product.price)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.stock || 0} unités
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(getProductStatus(product))}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <User className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">
                          {product.producer?.firstName} {product.producer?.lastName}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(product.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            setSelectedProduct(product)
                            setShowDetails(true)
                          }}
                          className="text-blue-600 hover:text-blue-900"
                          title="Voir détails"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {activeTab === 'pending' ? (
                          <button 
                            onClick={() => handleApprove(product._id)}
                            disabled={operationLoading === product._id}
                            className="text-green-600 hover:text-green-900 disabled:opacity-50"
                            title="Approuver"
                          >
                            {operationLoading === product._id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <CheckCircle className="w-4 h-4" />
                            )}
                          </button>
                        ) : (
                          <button 
                            onClick={() => handleDelete(product._id)}
                            disabled={operationLoading === product._id}
                            className="text-red-600 hover:text-red-900 disabled:opacity-50"
                            title="Supprimer"
                          >
                            {operationLoading === product._id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile list */}
        <div className="md:hidden p-4 space-y-3">
          {displayProducts.length === 0 ? (
            <div className="text-center text-gray-500 py-6">
              <Package className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>Aucun produit trouvé</p>
            </div>
          ) : (
            displayProducts.map((product) => (
              <div key={product._id} className="border rounded-lg p-3">
                <div className="flex justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{product.name}</div>
                    <div className="text-xs text-gray-500">{product.category || 'Non catégorisé'}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold">{formatPrice(product.price)}</div>
                    <div className="text-xs text-gray-500">{product.stock || 0} unités</div>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div>{getStatusBadge(getProductStatus(product))}</div>
                  <div className="flex items-center space-x-2">
                    <button onClick={() => { setSelectedProduct(product); setShowDetails(true); }} className="text-blue-600">
                      <Eye className="w-4 h-4" />
                    </button>
                    {activeTab === 'pending' ? (
                      <button onClick={() => handleApprove(product._id)} className="text-green-600">
                        <CheckCircle className="w-4 h-4" />
                      </button>
                    ) : (
                      <button onClick={() => handleDelete(product._id)} className="text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

        {/* Product details modal */}
        {showDetails && selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black opacity-40" onClick={() => { setShowDetails(false); setSelectedProduct(null); }} />
            <div className="bg-white rounded-lg shadow-lg z-50 max-w-2xl w-full mx-4 p-6">
              <div className="flex justify-between items-start">
                <h2 className="text-xl font-semibold">Détails du produit</h2>
                <button onClick={() => { setShowDetails(false); setSelectedProduct(null); }} className="text-gray-500 hover:text-gray-700">
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Nom</p>
                  <p className="font-medium">{selectedProduct.name}</p>

                  <p className="text-sm text-gray-500 mt-3">Catégorie</p>
                  <p className="font-medium">{selectedProduct.category || 'Non catégorisé'}</p>

                  <p className="text-sm text-gray-500 mt-3">Prix</p>
                  <p className="font-medium">{formatPrice(selectedProduct.price)}</p>

                  <p className="text-sm text-gray-500 mt-3">Stock</p>
                  <p className="font-medium">{selectedProduct.stock || 0} unités</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Statut</p>
                  <div className="mt-1">{getStatusBadge(getProductStatus(selectedProduct))}</div>

                  <p className="text-sm text-gray-500 mt-3">Producteur</p>
                  <p className="font-medium">{selectedProduct.producer?.firstName} {selectedProduct.producer?.lastName}</p>

                  <p className="text-sm text-gray-500 mt-3">Créé le</p>
                  <p className="font-medium">{formatDate(selectedProduct.createdAt)}</p>
                </div>
              </div>

              <div className="mt-4">
                <p className="text-sm text-gray-500">Description</p>
                <p className="mt-1 text-gray-700">{selectedProduct.description || 'Aucune description'}</p>
              </div>

              {selectedProduct.images && selectedProduct.images.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm text-gray-500">Images</p>
                  <div className="mt-2 flex space-x-2 overflow-x-auto">
                    {selectedProduct.images.map((img, idx) => (
                      <img key={idx} src={img} alt={`${selectedProduct.name}-${idx}`} className="w-24 h-24 object-cover rounded" />
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-6 text-right">
                <button onClick={() => { setShowDetails(false); setSelectedProduct(null); }} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Fermer</button>
              </div>
            </div>
          </div>
        )}

        {/* Pagination (only for all products tab) */}
      {activeTab === 'all' && total > itemsPerPage && (
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 rounded-lg shadow">
          <div className="flex-1 flex justify-between sm:hidden">
            <button 
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Précédent
            </button>
            <button 
              onClick={() => setCurrentPage(Math.min(Math.ceil(total / itemsPerPage), currentPage + 1))}
              disabled={currentPage === Math.ceil(total / itemsPerPage)}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Suivant
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Affichage de <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> à{' '}
                <span className="font-medium">{Math.min(currentPage * itemsPerPage, total)}</span> sur{' '}
                <span className="font-medium">{total}</span> résultats
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button 
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Précédent
                </button>
                {Array.from({ length: Math.min(5, Math.ceil(total / itemsPerPage)) }, (_, i) => {
                  const page = i + 1
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        page === currentPage
                          ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  )
                })}
                <button 
                  onClick={() => setCurrentPage(Math.min(Math.ceil(total / itemsPerPage), currentPage + 1))}
                  disabled={currentPage === Math.ceil(total / itemsPerPage)}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Suivant
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
        </main>
      </div>

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

export default AdminProducts