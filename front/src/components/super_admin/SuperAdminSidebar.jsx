import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  ShoppingCart, 
  GraduationCap,
  ClipboardList,
  Settings,
  LogOut,
  ShieldCheck,
  BarChart3,
  LogIn,
  Briefcase
} from 'lucide-react'

const SuperAdminSidebar = ({ user, onClose }) => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  // Menu complet pour Super Admin incluant toutes les pages admin standard
  const superAdminMenu = [
    // Pages Super Admin exclusives
    {
      name: 'Dashboard Super Admin',
      path: '/super-admin/dashboard',
      icon: ShieldCheck,
      description: 'Tableau de bord principal',
      badge: 'EXCLUSIF',
      category: 'super'
    },
    {
      name: 'Gestion des Commandes',
      path: '/super-admin/orders',
      icon: ClipboardList,
      description: 'Supervision des commandes',
      badge: 'EXCLUSIF',
      category: 'super'
    },
    {
      name: 'Configuration Produits',
      path: '/super-admin/products',
      icon: Settings,
      description: 'Paramètres globaux produits',
      badge: 'EXCLUSIF',
      category: 'super'
    },
    
    // Accès aux pages Admin Standard via Super Admin
    {
      name: 'Dashboard Admin',
      path: '/super-admin/admin-dashboard',
      icon: BarChart3,
      description: 'Tableau de bord administrateur',
      category: 'admin'
    },
    {
      name: 'Gestion des Utilisateurs',
      path: '/super-admin/admin-users',
      icon: Users,
      description: 'Gérer tous les utilisateurs',
      category: 'admin'
    },
    {
      name: 'Gestion des Produits',
      path: '/super-admin/admin-products',
      icon: Package,
      description: 'Gérer tous les produits',
      category: 'admin'
    },
    {
      name: 'Gestion des Ventes',
      path: '/super-admin/admin-sales',
      icon: ShoppingCart,
      description: 'Supervision des ventes',
      category: 'admin'
    },
    {
      name: 'Gestion des Formations',
      path: '/super-admin/admin-formations',
      icon: GraduationCap,
      description: 'Gérer toutes les formations',
      category: 'admin'
    },
    {
      name: 'Connexion Admin',
      path: '/super-admin/admin-login',
      icon: LogIn,
      description: 'Page de connexion admin',
      category: 'admin'
    }
  ]

  // Séparer les menus par catégorie
  const superPages = superAdminMenu.filter(item => item.category === 'super')
  const adminPages = superAdminMenu.filter(item => item.category === 'admin')

  const handleLogout = () => {
    // Supprimer tous les tokens
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('adminDashboardUser')
    localStorage.removeItem('superAdminUser')
    navigate('/login')
  }

  return (
    <div className={`bg-white shadow-lg transition-all duration-300 ${
      isCollapsed ? 'w-20' : 'w-64'
    } h-screen flex flex-col`}>
      
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">SA</span>
              </div>
              <div>
                <h1 className="font-bold text-gray-800">AgriTeranga</h1>
                <p className="text-xs text-gray-500">Super Admin</p>
              </div>
            </div>
          )}
          <div className="flex items-center space-x-1">
            {/* Bouton collapse pour desktop */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:block p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title={isCollapsed ? 'Déplier' : 'Réduire'}
            >
              <svg className={`w-5 h-5 text-gray-600 transition-transform ${
                isCollapsed ? 'rotate-180' : ''
              }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
            </button>
            
            {/* Bouton fermer pour mobile */}
            {onClose && (
              <button
                onClick={onClose}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Fermer"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* User Info */}
      {!isCollapsed && (
        <div className="p-4 border-b border-gray-200 bg-red-50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-red-600 font-semibold">
                {user?.name?.charAt(0) || 'S'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 truncate">
                {user?.name || 'Super Admin'}
              </p>
              <div className="flex items-center space-x-2">
                <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-medium">
                  SUPER ADMIN
                </span>
                <ShieldCheck className="w-4 h-4 text-red-500" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto p-4">
        <div className="space-y-6">
          
          {/* Pages Super Admin exclusives */}
          {!isCollapsed && (
            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Super Admin
              </h3>
            </div>
          )}
          <div className="space-y-1">
            {superPages.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`group flex items-center px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-red-50 text-red-700 border-r-2 border-red-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  title={isCollapsed ? item.name : ''}
                >
                  <Icon className={`w-5 h-5 ${
                    isActive ? 'text-red-700' : 'text-gray-500'
                  } ${!isCollapsed ? 'mr-3' : ''}`} />
                  {!isCollapsed && (
                    <>
                      <span className="flex-1 font-medium">{item.name}</span>
                      {item.badge && (
                        <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-medium">
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                  {isCollapsed && (
                    <div className="absolute left-20 bg-gray-800 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 whitespace-nowrap">
                      <div className="font-medium">{item.name}</div>
                      <div className="text-xs text-gray-300">{item.description}</div>
                    </div>
                  )}
                </Link>
              )
            })}
          </div>

          {/* Accès aux Pages Admin Standard */}
          {!isCollapsed && (
            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Accès Pages Admin
              </h3>
            </div>
          )}
          <div className="space-y-1">
            {adminPages.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`group flex items-center px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  title={isCollapsed ? item.name : ''}
                >
                  <Icon className={`w-5 h-5 ${
                    isActive ? 'text-blue-700' : 'text-gray-500'
                  } ${!isCollapsed ? 'mr-3' : ''}`} />
                  {!isCollapsed && (
                    <>
                      <span className="flex-1 font-medium">{item.name}</span>
                      <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full font-medium">
                        ADMIN
                      </span>
                    </>
                  )}
                  {isCollapsed && (
                    <div className="absolute left-20 bg-gray-800 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 whitespace-nowrap">
                      <div className="font-medium">{item.name}</div>
                      <div className="text-xs text-gray-300">{item.description}</div>
                    </div>
                  )}
                </Link>
              )
            })}
          </div>
        </div>
      </nav>

      {/* Footer Actions */}
      <div className="p-4 border-t border-gray-200">
        <div className="space-y-2">
          <button
            onClick={handleLogout}
            className={`w-full flex items-center text-red-600 hover:bg-red-50 rounded-lg transition-colors ${
              isCollapsed ? 'px-3 py-2' : 'px-3 py-2'
            }`}
            title={isCollapsed ? 'Déconnexion' : ''}
          >
            <LogOut className={`w-5 h-5 ${!isCollapsed ? 'mr-3' : ''}`} />
            {!isCollapsed && <span>Déconnexion</span>}
            {isCollapsed && (
              <div className="absolute left-20 bg-gray-800 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 whitespace-nowrap">
                Déconnexion
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default SuperAdminSidebar