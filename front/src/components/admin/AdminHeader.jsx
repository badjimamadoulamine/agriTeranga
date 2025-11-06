import React, { useEffect, useState, useCallback } from 'react'
import { Bell, Search, User, Settings, LogOut, Package, ShoppingCart, Truck, X, UserPlus, AlertCircle } from 'lucide-react'
import AdminProfileModal from './AdminProfileModal'
import { getProfilePictureUrl } from '../../utils/imageUtils'
import apiService from '../../services/apiService'

const AdminHeader = ({ user, onOpenProfile, onLogout, onToggleSidebar }) => {
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(false)
  
  const currentTime = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  const isSuperAdmin = user?.role === 'super_admin' || user?.isSuperAdmin === true

  // Charger les notifications
  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true)
      const response = await apiService.request('/admin/notifications')
      
      if (response.status === 'success' && response.data) {
        const notifs = response.data.notifications || []
        setNotifications(notifs)
        setUnreadCount(notifs.filter(n => !n.isRead).length)
      }
    } catch (error) {
      console.error('Erreur chargement notifications:', error)
      // En cas d'erreur API, générer des notifications de démonstration
      generateDemoNotifications()
    } finally {
      setLoading(false)
    }
  }, [])

  // Générer des notifications de démonstration si l'API n'est pas disponible
  const generateDemoNotifications = () => {
    const demoNotifs = [
      {
        _id: 'demo1',
        type: 'new_user',
        title: 'Nouvel utilisateur inscrit',
        message: 'Mamadou Diallo (Producteur) vient de s\'inscrire',
        isRead: false,
        createdAt: new Date(Date.now() - 300000).toISOString(), // 5 min ago
        user: {
          name: 'Mamadou Diallo',
          role: 'producteur',
          email: 'mamadou@example.com'
        }
      },
      {
        _id: 'demo2',
        type: 'new_order',
        title: 'Nouvelle commande',
        message: 'Commande #12345 de 25,000 FCFA reçue',
        isRead: false,
        createdAt: new Date(Date.now() - 600000).toISOString(), // 10 min ago
        order: {
          orderId: '#12345',
          amount: 25000
        }
      },
      {
        _id: 'demo3',
        type: 'delivery_completed',
        title: 'Livraison terminée',
        message: 'Livraison #789 complétée avec succès',
        isRead: true,
        createdAt: new Date(Date.now() - 3600000).toISOString(), // 1h ago
      },
      {
        _id: 'demo4',
        type: 'new_user',
        title: 'Nouvel utilisateur inscrit',
        message: 'Fatou Sow (Consommateur) vient de s\'inscrire',
        isRead: false,
        createdAt: new Date(Date.now() - 7200000).toISOString(), // 2h ago
        user: {
          name: 'Fatou Sow',
          role: 'consommateur',
          email: 'fatou@example.com'
        }
      }
    ]
    setNotifications(demoNotifs)
    setUnreadCount(demoNotifs.filter(n => !n.isRead).length)
  }

  // Marquer une notification comme lue
  const markAsRead = async (notificationId) => {
    try {
      await apiService.request(`/admin/notifications/${notificationId}/read`, {
        method: 'PATCH'
      })
      
      setNotifications(prev => 
        prev.map(n => n._id === notificationId ? { ...n, isRead: true } : n)
      )
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (error) {
      // Fallback local si API non disponible
      setNotifications(prev => 
        prev.map(n => n._id === notificationId ? { ...n, isRead: true } : n)
      )
      setUnreadCount(prev => Math.max(0, prev - 1))
    }
  }

  // Marquer toutes comme lues
  const markAllAsRead = async () => {
    try {
      await apiService.request('/admin/notifications/read-all', {
        method: 'PATCH'
      })
      
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
      setUnreadCount(0)
    } catch (error) {
      // Fallback local
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
      setUnreadCount(0)
    }
  }

  // Supprimer une notification
  const deleteNotification = async (notificationId) => {
    try {
      await apiService.request(`/admin/notifications/${notificationId}`, {
        method: 'DELETE'
      })
      
      const notif = notifications.find(n => n._id === notificationId)
      setNotifications(prev => prev.filter(n => n._id !== notificationId))
      if (notif && !notif.isRead) {
        setUnreadCount(prev => Math.max(0, prev - 1))
      }
    } catch (error) {
      // Fallback local
      const notif = notifications.find(n => n._id === notificationId)
      setNotifications(prev => prev.filter(n => n._id !== notificationId))
      if (notif && !notif.isRead) {
        setUnreadCount(prev => Math.max(0, prev - 1))
      }
    }
  }

  // Icône selon le type de notification
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'new_order':
        return <ShoppingCart className="w-5 h-5 text-blue-500" />
      case 'product_approved':
      case 'new_product':
        return <Package className="w-5 h-5 text-green-500" />
      case 'delivery_completed':
      case 'delivery_assigned':
        return <Truck className="w-5 h-5 text-purple-500" />
      case 'new_user':
      case 'user_registered':
        return <UserPlus className="w-5 h-5 text-indigo-500" />
      case 'alert':
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-orange-500" />
      default:
        return <Bell className="w-5 h-5 text-gray-500" />
    }
  }

  // Badge de couleur selon le type
  const getNotificationBadgeColor = (type) => {
    switch (type) {
      case 'new_order':
        return 'bg-blue-100 text-blue-700'
      case 'product_approved':
      case 'new_product':
        return 'bg-green-100 text-green-700'
      case 'delivery_completed':
      case 'delivery_assigned':
        return 'bg-purple-100 text-purple-700'
      case 'new_user':
      case 'user_registered':
        return 'bg-indigo-100 text-indigo-700'
      case 'alert':
      case 'warning':
        return 'bg-orange-100 text-orange-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  // Libellé du type de notification
  const getNotificationTypeLabel = (type) => {
    switch (type) {
      case 'new_order':
        return 'Nouvelle commande'
      case 'product_approved':
        return 'Produit approuvé'
      case 'new_product':
        return 'Nouveau produit'
      case 'delivery_completed':
        return 'Livraison terminée'
      case 'delivery_assigned':
        return 'Livraison assignée'
      case 'new_user':
      case 'user_registered':
        return 'Nouvel utilisateur'
      case 'alert':
        return 'Alerte'
      case 'warning':
        return 'Attention'
      default:
        return 'Notification'
    }
  }

  // Formater le temps relatif
  const getRelativeTime = (date) => {
    const now = new Date()
    const notifDate = new Date(date)
    const diffMs = now - notifDate
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'À l\'instant'
    if (diffMins < 60) return `Il y a ${diffMins} min`
    if (diffHours < 24) return `Il y a ${diffHours}h`
    if (diffDays < 7) return `Il y a ${diffDays}j`
    return notifDate.toLocaleDateString('fr-FR')
  }

  // Action sur clic notification (navigation)
  const handleNotificationClick = (notification) => {
    // Marquer comme lue
    if (!notification.isRead) {
      markAsRead(notification._id)
    }

    // Navigation selon le type
    switch (notification.type) {
      case 'new_order':
        if (notification.order?.orderId) {
          window.location.href = `/admin/orders/${notification.order.orderId}`
        } else {
          window.location.href = '/admin/orders'
        }
        break
      case 'new_product':
      case 'product_approved':
        if (notification.product?._id) {
          window.location.href = `/admin/products/${notification.product._id}`
        } else {
          window.location.href = '/admin/products'
        }
        break
      case 'delivery_completed':
      case 'delivery_assigned':
        if (notification.delivery?._id) {
          window.location.href = `/admin/deliveries/${notification.delivery._id}`
        } else {
          window.location.href = '/admin/deliveries'
        }
        break
      case 'new_user':
      case 'user_registered':
        if (notification.user?._id) {
          window.location.href = `/admin/users/${notification.user._id}`
        } else {
          window.location.href = '/admin/users'
        }
        break
      default:
        break
    }
  }

  useEffect(() => {
    try {
      const raw = localStorage.getItem('adminDashboardUser') || localStorage.getItem('user')
      const latest = raw ? JSON.parse(raw) : user
      const base = latest?.profilePicture ? getProfilePictureUrl(latest.profilePicture) : ''
      const url = base ? `${base}${base.includes('?') ? '&' : '?'}v=${Date.now()}` : ''
      setAvatarUrl(url)
      const name = (latest?.firstName || latest?.first_name || latest?.prenom || '')
        + ' ' + (latest?.lastName || latest?.last_name || latest?.nom || '')
      const cleaned = name.trim()
      setDisplayName(cleaned || latest?.name || 'Administrateur')
    } catch {
      const base = user?.profilePicture ? getProfilePictureUrl(user.profilePicture) : ''
      const url = base ? `${base}${base.includes('?') ? '&' : '?'}v=${Date.now()}` : ''
      setAvatarUrl(url)
      const name = (user?.firstName || '') + ' ' + (user?.lastName || '')
      const cleaned = name.trim()
      setDisplayName(cleaned || user?.name || 'Administrateur')
    }
  }, [user])

  // Charger les notifications au montage et toutes les 30 secondes
  useEffect(() => {
    fetchNotifications()
    const interval = setInterval(fetchNotifications, 30000)
    return () => clearInterval(interval)
  }, [fetchNotifications])

  // Fermer les menus au clic extérieur
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.notification-panel') && !e.target.closest('.notification-button')) {
        setShowNotifications(false)
      }
      if (!e.target.closest('.user-menu-panel') && !e.target.closest('.user-menu-button')) {
        setShowUserMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
      <div className="flex items-center justify-between">
        {/* Left section */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Menu"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          )}
          
          <div>
            <p className="text-xs sm:text-sm text-gray-500 capitalize hidden sm:block">
              {currentTime}
            </p>
          </div>
        </div>

        {/* Center section - Search */}
        <div className="hidden md:flex flex-1 max-w-sm lg:max-w-md mx-4 lg:mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
            />
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Search mobile */}
          <button className="md:hidden p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <Search className="w-5 h-5" />
          </button>

          {/* Notifications */}
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="notification-button relative p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <Bell className="w-5 h-5 sm:w-6 sm:h-6" />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 flex items-center justify-center h-5 w-5 text-xs font-bold text-white bg-red-500 rounded-full animate-pulse">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Panel */}
            {showNotifications && (
              <div className="notification-panel absolute right-0 top-12 w-80 sm:w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-[32rem] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-green-50 to-blue-50">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Notifications {unreadCount > 0 && (
                      <span className="ml-2 px-2 py-1 text-xs bg-red-500 text-white rounded-full">
                        {unreadCount}
                      </span>
                    )}
                  </h3>
                  {notifications.length > 0 && unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-xs text-green-600 hover:text-green-700 font-medium transition-colors"
                    >
                      Tout marquer comme lu
                    </button>
                  )}
                </div>

                {/* Notifications List */}
                <div className="overflow-y-auto flex-1">
                  {loading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
                    </div>
                  ) : notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 px-4">
                      <Bell className="w-12 h-12 text-gray-300 mb-3" />
                      <p className="text-gray-500 text-sm">Aucune notification</p>
                      <p className="text-gray-400 text-xs mt-1">Vous êtes à jour !</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-100">
                      {notifications.map((notification) => (
                        <div
                          key={notification._id}
                          onClick={() => handleNotificationClick(notification)}
                          className={`p-4 hover:bg-gray-50 transition-all cursor-pointer ${
                            !notification.isRead ? 'bg-green-50 border-l-4 border-green-500' : ''
                          }`}
                        >
                          <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0 mt-1">
                              {getNotificationIcon(notification.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <span className={`text-xs px-2 py-1 rounded-full font-medium ${getNotificationBadgeColor(notification.type)}`}>
                                  {getNotificationTypeLabel(notification.type)}
                                </span>
                                {!notification.isRead && (
                                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                )}
                              </div>
                              <p className={`text-sm ${
                                !notification.isRead ? 'font-semibold text-gray-900' : 'text-gray-700'
                              }`}>
                                {notification.title}
                              </p>
                              <p className="text-xs text-gray-600 mt-1">
                                {notification.message}
                              </p>
                              
                              {/* Détails supplémentaires selon le type */}
                              {notification.user && (
                                <div className="mt-2 text-xs text-gray-500 bg-gray-50 rounded p-2">
                                  <span className="font-medium">👤 {notification.user.name}</span>
                                  {notification.user.role && (
                                    <span className="ml-2 px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded">
                                      {notification.user.role}
                                    </span>
                                  )}
                                  {notification.user.email && (
                                    <div className="text-gray-400 mt-1">📧 {notification.user.email}</div>
                                  )}
                                </div>
                              )}
                              
                              <p className="text-xs text-gray-400 mt-2 flex items-center">
                                <span className="mr-1">🕒</span>
                                {getRelativeTime(notification.createdAt)}
                              </p>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                deleteNotification(notification._id)
                              }}
                              className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                              title="Supprimer"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer */}
                {notifications.length > 0 && (
                  <div className="p-3 border-t border-gray-200 text-center bg-gray-50">
                    <button 
                      onClick={() => {
                        setShowNotifications(false)
                        window.location.href = '/admin/notifications'
                      }}
                      className="text-sm text-green-600 hover:text-green-700 font-medium transition-colors"
                    >
                      Voir toutes les notifications →
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-700">
                {displayName || 'Administrateur'}
              </p>
              <div className="flex items-center space-x-2">
                {isSuperAdmin && (
                  <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-medium">
                    SUPER ADMIN
                  </span>
                )}
                {!isSuperAdmin && (
                  <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                    ADMIN STANDARD
                  </span>
                )}
              </div>
            </div>
            
            <div className="relative">
              <button 
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="user-menu-button w-10 h-10 bg-green-100 rounded-full flex items-center justify-center hover:bg-green-200 transition-colors"
              >
                {avatarUrl ? (
                  <img 
                    src={avatarUrl} 
                    alt="Profile"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <User className="w-6 h-6 text-green-600" />
                )}
              </button>
              
              {/* User Dropdown Menu */}
              {showUserMenu && (
                <div className="user-menu-panel absolute right-0 top-12 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                  <div className="py-1">
                    <button
                      onClick={() => {
                        setShowProfileModal(true)
                        setShowUserMenu(false)
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <Settings className="w-4 h-4 mr-3" />
                      Mon profil
                    </button>
                    <hr className="my-1" />
                    <button
                      onClick={() => {
                        onLogout()
                        setShowUserMenu(false)
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      Déconnexion
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de profil */}
      <AdminProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        user={user}
        onUpdated={() => {
          try {
            const raw = localStorage.getItem('adminDashboardUser') || localStorage.getItem('user')
            const latest = raw ? JSON.parse(raw) : user
            const base = latest?.profilePicture ? getProfilePictureUrl(latest.profilePicture) : ''
            const url = base ? `${base}${base.includes('?') ? '&' : '?'}v=${Date.now()}` : ''
            setAvatarUrl(url)
            const name = (latest?.firstName || latest?.first_name || latest?.prenom || '')
              + ' ' + (latest?.lastName || latest?.last_name || latest?.nom || '')
            const cleaned = name.trim()
            setDisplayName(cleaned || latest?.name || 'Administrateur')
          } catch {}
        }}
      />
    </header>
  )
}

export default AdminHeader