import React, { useState, useEffect } from 'react'
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
  
} from 'lucide-react'

const AdminSidebar = ({ user, onClose }) => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isSuperAdmin, setIsSuperAdmin] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    // Vérifier si l'utilisateur est super admin
    const superAdminStatus = user?.role === 'super_admin' || user?.isSuperAdmin === true
    setIsSuperAdmin(superAdminStatus)
  }, [user])

  // Menu pour Admin Standard (5 items)
  const adminStandardMenu = [
    {
      name: 'Dashboard',
      path: '/admin/dashboard',
      icon: LayoutDashboard,
      description: 'Vue d\'ensemble'
    },
    {
      name: 'Utilisateurs',
      path: '/admin/users',
      icon: Users,
      description: 'Gestion des utilisateurs'
    },
    {
      name: 'Produits',
      path: '/admin/products',
      icon: Package,
      description: 'Gestion des produits'
    },
    {
      name: 'Ventes',
      path: '/admin/sales',
      icon: ShoppingCart,
      description: 'Gestion des ventes'
    },
    {
      name: 'Formations',
      path: '/admin/formations',
      icon: GraduationCap,
      description: 'Gestion des formations'
    }
  ]

  // Menu pour Super Admin (8 items)
  const superAdminMenu = [
    // Inclut tous les menus admin standard
    ...adminStandardMenu,
    // Plus les pages exclusives Super Admin
    {
      name: 'Commandes',
      path: '/super-admin/orders',
      icon: ClipboardList,
      description: 'Gestion des commandes',
      badge: 'EXCLUSIF'
    },
    {
      name: 'Produits Admin',
      path: '/super-admin/products',
      icon: Settings,
      description: 'Configuration produits',
      badge: 'EXCLUSIF'
    }
  ]

  const currentMenu = isSuperAdmin ? superAdminMenu : adminStandardMenu

  const handleLogout = () => {
    // Supprimer le token et rediriger
    localStorage.removeItem('token')
    localStorage.removeItem('user')
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
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">AT</span>
              </div>
              <div>
                <h1 className="font-bold text-gray-800">AgriTeranga</h1>
                <p className="text-xs text-gray-500">Administration</p>
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
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600 font-semibold">
                {user?.name?.charAt(0) || 'A'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 truncate">
                {user?.name || 'Admin'}
              </p>
              <div className="flex items-center space-x-2">
                {isSuperAdmin && (
                  <>
                    <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-medium">
                      SUPER ADMIN
                    </span>
                    <ShieldCheck className="w-4 h-4 text-red-500" />
                  </>
                )}
                {!isSuperAdmin && (
                  <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                    ADMIN STANDARD
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto p-4">
        <div className="space-y-2">
          {currentMenu.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`group flex items-center px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-green-50 text-green-700 border-r-2 border-green-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
                title={isCollapsed ? item.name : ''}
              >
                <Icon className={`w-5 h-5 ${
                  isActive ? 'text-green-700' : 'text-gray-500'
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

export default AdminSidebar