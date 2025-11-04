import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Users, 
  Package, 
  ShoppingCart, 
  GraduationCap,
  DollarSign,
  Activity,
  ShieldCheck,
  Settings,
  ClipboardList,
  BarChart3,
  AlertTriangle,
  RefreshCw,
  UserCheck,
  LogIn,
  Briefcase,
  ShoppingBag
} from 'lucide-react'
import apiService from '../../services/apiService'
import { toast } from 'react-toastify'
import SuperAdminSidebar from '../../components/super_admin/SuperAdminSidebar'
import SuperAdminHeader from '../../components/super_admin/SuperAdminHeader'
import AdminProfileModal from '../../components/admin/AdminProfileModal'

const SuperAdminDashboard = () => {
  const navigate = useNavigate()
  const [stats, setStats] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [adminActivity, setAdminActivity] = useState([])
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

  // Charger les statistiques
  const loadStats = async () => {
    try {
      setLoading(true)
      const response = await apiService.getDashboardStats()
      
      if (response.status === 'success' && response.data) {
        const data = response.data
        setStats([
          {
            name: 'Utilisateurs',
            value: data.users?.total?.toLocaleString() || '1,234',
            change: '+12%',
            icon: Users,
            color: 'bg-blue-500',
            trend: 'up'
          },
          {
            name: 'Produits',
            value: data.products?.total?.toLocaleString() || '567',
            change: '+8%',
            icon: Package,
            color: 'bg-green-500',
            trend: 'up'
          },
          {
            name: 'Ventes',
            value: data.orders?.total?.toLocaleString() || '890',
            change: '+23%',
            icon: ShoppingCart,
            color: 'bg-purple-500',
            trend: 'up'
          },
          {
            name: 'Formations',
            value: '45',
            change: '+5%',
            icon: GraduationCap,
            color: 'bg-orange-500',
            trend: 'up'
          },
          {
            name: 'Commandes',
            value: data.orders?.total?.toLocaleString() || '234',
            change: '+18%',
            icon: ClipboardList,
            color: 'bg-red-500',
            trend: 'up',
            badge: 'EXCLUSIF'
          },
          {
            name: 'Revenus',
            value: '45,678€',
            change: '+15%',
            icon: DollarSign,
            color: 'bg-emerald-500',
            trend: 'up'
          }
        ])
      }
    } catch (error) {
      console.error('Erreur:', error)
      toast.error('Erreur lors du chargement')
    } finally {
      setLoading(false)
    }
  }

  // Charger les activités
  const loadAdminActivity = () => {
    setAdminActivity([
      {
        id: 1,
        admin: 'Jean Dupont (Super Admin)',
        action: 'Création admin standard',
        target: 'Marie Martin',
        time: 'Il y a 1 heure',
        type: 'admin'
      },
      {
        id: 2,
        admin: 'Pierre Durand (Admin Standard)',
        action: 'Modification produit',
        target: 'Kit agricole',
        time: 'Il y a 2 heures',
        type: 'product'
      }
    ])
  }

  useEffect(() => {
    loadStats()
    loadAdminActivity()
  }, [])

  const handleRefresh = async () => {
    setRefreshing(true)
    await loadStats()
    await loadAdminActivity()
    setRefreshing(false)
    toast.success('Actualisé')
  }

  const adminPages = [
    {
      title: 'Dashboard Admin',
      description: 'Tableau de bord administrateur standard',
      icon: BarChart3,
      action: 'Accéder',
      path: '/super-admin/admin-dashboard',
      color: 'bg-blue-50 border-blue-200'
    },
    {
      title: 'Gestion des Utilisateurs',
      description: 'Gérer tous les utilisateurs (CRUD)',
      icon: Users,
      action: 'Gérer',
      path: '/super-admin/admin-users',
      color: 'bg-green-50 border-green-200'
    },
    {
      title: 'Gestion des Produits',
      description: 'Gérer tous les produits',
      icon: Package,
      action: 'Gérer',
      path: '/super-admin/admin-products',
      color: 'bg-purple-50 border-purple-200'
    },
    {
      title: 'Gestion des Ventes',
      description: 'Supervision des ventes et commandes',
      icon: ShoppingCart,
      action: 'Superviser',
      path: '/super-admin/admin-sales',
      color: 'bg-orange-50 border-orange-200'
    },
    {
      title: 'Gestion des Formations',
      description: 'Gérer toutes les formations',
      icon: GraduationCap,
      action: 'Gérer',
      path: '/super-admin/admin-formations',
      color: 'bg-indigo-50 border-indigo-200'
    },
    {
      title: 'Connexion Admin',
      description: 'Accéder à la page de connexion admin',
      icon: LogIn,
      action: 'Accéder',
      path: '/super-admin/admin-login',
      color: 'bg-gray-50 border-gray-200'
    }
  ]

  const superAdminFeatures = [
    {
      title: 'Gestion des Commandes',
      description: 'Supervision complète',
      icon: ClipboardList,
      action: 'Accéder',
      path: '/super-admin/orders',
      color: 'bg-red-50 border-red-200'
    },
    {
      title: 'Configuration Produits',
      description: 'Paramètres globaux',
      icon: Settings,
      action: 'Configurer',
      path: '/super-admin/products',
      color: 'bg-blue-50 border-blue-200'
    },
    {
      title: 'Analytics Avancées',
      description: 'Rapports détaillés',
      icon: BarChart3,
      action: 'Voir',
      path: '#',
      color: 'bg-purple-50 border-purple-200'
    },
    {
      title: 'Supervision',
      description: 'Monitoring système',
      icon: ShieldCheck,
      action: 'Accéder',
      path: '#',
      color: 'bg-green-50 border-green-200'
    }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    )
  }

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
    // Actualiser les informations utilisateur si nécessaire
    console.log('Profil mis à jour')
  }

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
            {/* Refresh Button */}
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Super Administration</h1>
                <p className="text-gray-600">Contrôle total de la plateforme</p>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
                >
                  <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                  Actualiser
                </button>
              </div>
            </div>

      {/* Alert */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center">
          <AlertTriangle className="w-5 h-5 text-yellow-600 mr-3" />
          <div>
            <h3 className="text-sm font-medium text-yellow-800">Accès Super Admin</h3>
            <p className="text-sm text-yellow-700 mt-1">Accès à toutes les fonctionnalités.</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.name} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <div className="flex items-center space-x-2">
                    <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                    {stat.badge && (
                      <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-medium">
                        {stat.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-green-600 font-medium mt-1">{stat.change}</p>
                </div>
                <div className={`${stat.color} rounded-lg p-3`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Admin Pages Access */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Accès Pages Admin Standard</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {adminPages.map((page) => {
            const Icon = page.icon
            return (
              <div 
                key={page.title} 
                onClick={() => navigate(page.path)}
                className={`border rounded-lg p-4 ${page.color} hover:shadow-md transition-shadow cursor-pointer`}
              >
                <div className="flex items-start space-x-3">
                  <div className="bg-white rounded-lg p-2 shadow-sm">
                    <Icon className="w-5 h-5 text-gray-700" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{page.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{page.description}</p>
                    <div className="text-sm text-blue-600 hover:text-blue-800 font-medium mt-2">
                      {page.action} →
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Features */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Fonctionnalités Super Admin</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {superAdminFeatures.map((feature) => {
            const Icon = feature.icon
            return (
              <div 
                key={feature.title} 
                onClick={() => navigate(feature.path)}
                className={`border rounded-lg p-4 ${feature.color} hover:shadow-md transition-shadow cursor-pointer`}
              >
                <div className="flex items-start space-x-3">
                  <div className="bg-white rounded-lg p-2 shadow-sm">
                    <Icon className="w-5 h-5 text-gray-700" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{feature.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{feature.description}</p>
                    <div className="text-sm text-blue-600 hover:text-blue-800 font-medium mt-2">
                      {feature.action} →
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Analytics</h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center text-gray-500">
              <BarChart3 className="w-12 h-12 mx-auto mb-2" />
              <p>Graphiques détaillés</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Activité Admin</h3>
          <div className="space-y-4">
            {adminActivity.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="bg-white rounded-full p-2 shadow-sm">
                  <Activity className="w-4 h-4 text-gray-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">
                    <span className="font-medium">{activity.admin}</span> - {activity.action}
                  </p>
                  <p className="text-xs text-gray-500">Cible: {activity.target}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
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

export default SuperAdminDashboard