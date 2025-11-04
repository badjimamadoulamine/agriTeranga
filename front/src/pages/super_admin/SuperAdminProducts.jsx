import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Settings, 
  Package, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2,
  Eye,
  DollarSign,
  Tag,
  TrendingUp,
  AlertTriangle,
  ShieldCheck,
  Database,
  Cog
} from 'lucide-react'
import SuperAdminSidebar from '../../components/super_admin/SuperAdminSidebar'
import SuperAdminHeader from '../../components/super_admin/SuperAdminHeader'
import AdminProfileModal from '../../components/admin/AdminProfileModal'

const SuperAdminProducts = () => {
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showProfileModal, setShowProfileModal] = useState(false)
  
  // Récupérer l'utilisateur super admin
  const user = React.useMemo(() => {
    try {
      const raw = localStorage.getItem('superAdminUser') || localStorage.getItem('user')
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('superAdminUser')
    navigate('/login')
  }

  const handleOpenProfile = () => {
    setShowProfileModal(true)
  }

  const handleProfileUpdated = () => {
    console.log('Profil mis à jour')
  }
  const [products] = useState([
    {
      id: 1,
      name: 'Kit de démarrage agricole',
      category: 'Kits',
      price: '89.99€',
      stock: 45,
      status: 'active',
      supplier: 'AgroSupplies',
      configuration: 'Global',
      visibility: 'Public',
      lastModified: '2024-10-20',
      adminRights: 'admin_standard'
    },
    {
      id: 2,
      name: 'Engrais bio 5kg',
      category: 'Fertilizers',
      price: '15.00€',
      stock: 120,
      status: 'active',
      supplier: 'BioFertil',
      configuration: 'Avancé',
      visibility: 'Public',
      lastModified: '2024-10-21',
      adminRights: 'super_admin'
    }
  ])

  const [showAdvancedConfig, setShowAdvancedConfig] = useState(false)

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Vérification de l'authentification...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-[#F8FAF8]">
      <SuperAdminSidebar 
        user={user} 
        onClose={() => setSidebarOpen(false)} 
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <SuperAdminHeader 
          user={user}
          onOpenProfile={handleOpenProfile}
          onLogout={handleLogout}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Page Title */}
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Configuration Produits Avancée</h1>
                <p className="text-gray-600">Configuration globale et avancée des produits - Accès Super Admin</p>
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => setShowAdvancedConfig(!showAdvancedConfig)}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
                >
                  <Settings className="w-5 h-5" />
                  <span>Configuration Avancée</span>
                </button>
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2">
                  <Plus className="w-5 h-5" />
                  <span>Nouveau produit</span>
                </button>
              </div>
            </div>

      {/* Super Admin Alert */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center">
          <ShieldCheck className="w-5 h-5 text-red-600 mr-3" />
          <div>
            <h3 className="text-sm font-medium text-red-800">
              Accès Super Admin - Configuration Avancée
            </h3>
            <p className="text-sm text-red-700 mt-1">
              Vous avez accès aux paramètres globaux et configurations spéciales des produits.
            </p>
          </div>
        </div>
      </div>

      {/* Advanced Configuration Panel */}
      {showAdvancedConfig && (
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <Cog className="w-5 h-5 mr-2 text-purple-600" />
            Configuration Avancée
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Paramètres Globaux</h4>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input type="checkbox" className="rounded border-gray-300" defaultChecked />
                  <span className="ml-2 text-sm text-gray-700">Validation admin pour nouveaux produits</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="rounded border-gray-300" />
                  <span className="ml-2 text-sm text-gray-700">Modification libre des prix</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="rounded border-gray-300" defaultChecked />
                  <span className="ml-2 text-sm text-gray-700">Notifications stock critique</span>
                </label>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Permissions Admin</h4>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input type="checkbox" className="rounded border-gray-300" />
                  <span className="ml-2 text-sm text-gray-700">Admin standard peut supprimer</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="rounded border-gray-300" defaultChecked />
                  <span className="ml-2 text-sm text-gray-700">Modification uniquement par Super Admin</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="rounded border-gray-300" />
                  <span className="ml-2 text-sm text-gray-700">Audit des modifications</span>
                </label>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Fournisseurs</h4>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input type="checkbox" className="rounded border-gray-300" defaultChecked />
                  <span className="ml-2 text-sm text-gray-700">Approbation automatique</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="rounded border-gray-300" />
                  <span className="ml-2 text-sm text-gray-700">Gestion multi-fournisseurs</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="rounded border-gray-300" defaultChecked />
                  <span className="ml-2 text-sm text-gray-700">Alertes renouvellement stock</span>
                </label>
              </div>
            </div>
          </div>
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
              <p className="text-2xl font-semibold text-gray-900">{products.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-purple-500 rounded-lg p-3">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Config Super Admin</p>
              <p className="text-2xl font-semibold text-gray-900">
                {products.filter(p => p.adminRights === 'super_admin').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-green-500 rounded-lg p-3">
              <Database className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Stock Global</p>
              <p className="text-2xl font-semibold text-gray-900">
                {products.reduce((sum, p) => sum + p.stock, 0)}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-orange-500 rounded-lg p-3">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Valeur Totale</p>
              <p className="text-2xl font-semibold text-gray-900">2,350€</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher un produit..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
            <option>Toutes les catégories</option>
            <option>Kits</option>
            <option>Fertilizers</option>
            <option>Seeds</option>
          </select>
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
            <option>Tous les droits admin</option>
            <option>Super Admin uniquement</option>
            <option>Admin Standard</option>
          </select>
          <div className="flex items-center text-gray-600">
            <Filter className="w-5 h-5 mr-2" />
            <span>{products.length} produit(s)</span>
          </div>
        </div>
      </div>

      {/* Products Table with Super Admin Features */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Produit
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Configuration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Droits Admin
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prix
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dernière Modification
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions Super Admin
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                        <Package className="w-5 h-5 text-gray-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        <div className="text-sm text-gray-500">{product.supplier}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                      {product.configuration}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      product.adminRights === 'super_admin' 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {product.adminRights === 'super_admin' ? 'SUPER ADMIN' : 'ADMIN STANDARD'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {product.price}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className={`text-sm ${product.stock < 20 ? 'text-red-600' : 'text-gray-900'}`}>
                        {product.stock}
                      </span>
                      {product.stock < 20 && (
                        <AlertTriangle className="w-4 h-4 text-red-500 ml-2" />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(product.lastModified).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-purple-600 hover:text-purple-900">
                        <Settings className="w-4 h-4" />
                      </button>
                      <button className="text-indigo-600 hover:text-indigo-900">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions Super Admin */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Actions Rapides Super Admin</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Settings className="w-6 h-6 text-purple-600 mr-2" />
            <span>Configuration Globale</span>
          </button>
          <button className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Database className="w-6 h-6 text-blue-600 mr-2" />
            <span>Import/Export</span>
          </button>
          <button className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <ShieldCheck className="w-6 h-6 text-green-600 mr-2" />
            <span>Audit Permissions</span>
          </button>
          <button className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <TrendingUp className="w-6 h-6 text-orange-600 mr-2" />
            <span>Rapport Avancé</span>
          </button>
        </div>
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

export default SuperAdminProducts