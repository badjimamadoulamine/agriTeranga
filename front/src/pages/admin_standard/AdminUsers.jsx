import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  UserCheck,
  UserX,
  Mail,
  Phone,
  MapPin,
  Loader2,
  AlertCircle,
  RefreshCw,
  MoreHorizontal,
  Shield,
  ShieldOff,
  Lock,
  Unlock,
  Package,
  GraduationCap,
  DollarSign,
  UserPlus,
  Download,
  Upload,
  TrendingUp
} from 'lucide-react'
import { useUsers, useAuth } from '../../hooks/useApi'
import { useToast } from '../../contexts/ToastContext'
import AdminSidebar from '../../components/admin/AdminSidebar'
import AdminHeader from '../../components/admin/AdminHeader'
import SuperAdminSidebar from '../../components/super_admin/SuperAdminSidebar'
import SuperAdminHeader from '../../components/super_admin/SuperAdminHeader'
import AdminProfileModal from '../../components/admin/AdminProfileModal'
import apiService from '../../services/apiService'

const AdminUsers = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { success, error: showError, loading: showLoading } = useToast()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRole, setSelectedRole] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  
  // États pour les actions rapides
  const [bulkActionLoading, setBulkActionLoading] = useState(false)
  const [selectedUsers, setSelectedUsers] = useState([])
  
  // Détecter si on est dans un contexte Super Admin
  const isSuperAdminContext = location.pathname.startsWith('/super-admin/')
  
  // Déterminer quel stockage utiliser selon le contexte
  const user = React.useMemo(() => { // PREMIÈRE DÉCLARATION (À CONSERVER)
    try {
      let storageKey
      if (isSuperAdminContext) {
        storageKey = localStorage.getItem('superAdminUser') || localStorage.getItem('adminDashboardUser')
      } else {
        storageKey = localStorage.getItem('adminDashboardUser')
      }
      return storageKey ? JSON.parse(storageKey) : null
    } catch {
      return null
    }
  }, [isSuperAdminContext])
  const [itemsPerPage, setItemsPerPage] = useState(20)
  const [showRoleModal, setShowRoleModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [newRole, setNewRole] = useState('')
  const [operationLoading, setOperationLoading] = useState(null)
  const [showProfileModal, setShowProfileModal] = useState(false)

  // Utilisation du hook pour récupérer les utilisateurs
  const { 
    users, 
    total, 
    loading, 
    error, 
    refetch,
    toggleUserStatus,
    updateUserRole,
    deleteUser,
    blockUser,
    unblockUser
  } = useUsers({
    role: selectedRole === 'all' ? undefined : selectedRole,
    search: searchTerm || undefined,
    page: currentPage,
    limit: itemsPerPage
  })

  // Récupérer l'admin connecté pour appliquer les règles de permission
  const { admin: currentAdmin } = useAuth();
  const isStandardAdmin = currentAdmin && currentAdmin.role === 'admin' && !currentAdmin.isSuperAdmin;

  const canModifyAdmin = (user) => {
    // Si l'admin connecté est un admin standard, il ne peut pas modifier ou bloquer d'autres admins
    if (isStandardAdmin && user && user.role === 'admin') return false;
    return true;
  }

  const handleSearch = (value) => {
    setSearchTerm(value)
    setCurrentPage(1) // Reset à la première page lors de la recherche
  }

  const handleRoleFilter = (role) => {
    setSelectedRole(role)
    setCurrentPage(1) // Reset à la première page lors du filtrage
  }

  const handleStatusToggle = async (userId, currentStatus) => {
    try {
      setOperationLoading(userId)
      await toggleUserStatus(userId)
    } catch (error) {
      alert(`Erreur lors du changement de statut: ${error.message}`)
    } finally {
      setOperationLoading(null)
    }
  }

  const handleRoleUpdate = async () => {
    if (!selectedUser || !newRole) return

    try {
      setOperationLoading(selectedUser._id)
      await updateUserRole(selectedUser._id, newRole)
      setShowRoleModal(false)
      setSelectedUser(null)
      setNewRole('')
    } catch (error) {
      alert(`Erreur lors de la modification du rôle: ${error.message}`)
    } finally {
      setOperationLoading(null)
    }
  }

  const openRoleModal = (user) => {
    if (!canModifyAdmin(user)) {
      alert('Vous ne pouvez pas modifier le rôle d\'un autre administrateur — action réservée au super-admin.');
      return;
    }
    setSelectedUser(user)
    setNewRole(user.role)
    setShowRoleModal(true)
  }

  const handleDeleteUser = async (userId, userName) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur "${userName}" ? Cette action est irréversible.`)) {
      try {
        setOperationLoading(userId)
        await deleteUser(userId)
        alert(`Utilisateur "${userName}" supprimé avec succès.`)
      } catch (error) {
        alert(`Erreur lors de la suppression: ${error.message}`)
      } finally {
        setOperationLoading(null)
      }
    }
  }

  const handleBlockUser = async (userId, userName) => {
    if (window.confirm(`Êtes-vous sûr de vouloir bloquer l'utilisateur "${userName}" ?`)) {
      try {
        setOperationLoading(`block_${userId}`)
        await blockUser(userId, 'Bloqué par l\'administrateur')
        alert(`Utilisateur "${userName}" bloqué avec succès.`)
      } catch (error) {
        alert(`Erreur lors du blocage: ${error.message}`)
      } finally {
        setOperationLoading(null)
      }
    }
  }

  const handleUnblockUser = async (userId, userName) => {
    if (window.confirm(`Êtes-vous sûr de vouloir débloquer l'utilisateur "${userName}" ?`)) {
      try {
        setOperationLoading(`unblock_${userId}`)
        await unblockUser(userId)
        alert(`Utilisateur "${userName}" débloqué avec succès.`)
      } catch (error) {
        alert(`Erreur lors du déblocage: ${error.message}`)
      } finally {
        setOperationLoading(null)
      }
    }
  }

  // ==================== ACTIONS RAPIDES API ====================
  
  // Navigation vers autres pages admin
  const navigateToAdminPage = (page) => {
    const basePath = isSuperAdminContext ? '/super-admin' : '/admin'
    navigate(`${basePath}/${page}`)
  }
  
  // Actions bulk pour les utilisateurs sélectionnés
  const handleBulkStatusToggle = async () => {
    if (selectedUsers.length === 0) {
      showError('Veuillez sélectionner au moins un utilisateur')
      return
    }
    
    setBulkActionLoading(true)
    const loadingId = showLoading('Traitement en cours...')
    
    try {
      for (const userId of selectedUsers) {
        const user = users.find(u => u._id === userId)
        if (user) {
          const newStatus = !user.isActive
          await toggleUserStatus(userId)
        }
      }
      
      setSelectedUsers([])
      await refetch()
      success(`${selectedUsers.length} utilisateurs traités avec succès`)
    } catch (err) {
      showError('Erreur lors du traitement en masse')
    } finally {
      setBulkActionLoading(false)
    }
  }
  
  // Exporter la liste des utilisateurs
  const handleExportUsers = async () => {
    const loadingId = showLoading('Préparation du fichier...')
    
    try {
      const usersToExport = users.map(user => ({
        'Nom': `${user.firstName} ${user.lastName}`,
        'Email': user.email,
        'Téléphone': user.phone || 'N/A',
        'Rôle': getRoleLabel(user.role),
        'Statut': user.isActive ? 'Actif' : 'Inactif',
        'Date de création': new Date(user.createdAt).toLocaleDateString('fr-FR')
      }))
      
      const csv = [
        Object.keys(usersToExport[0]).join(','),
        ...usersToExport.map(user => Object.values(user).map(val => `"${val}"`).join(','))
      ].join('\n')
      
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `users_export_${new Date().toISOString().split('T')[0]}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      success('Export téléchargé avec succès')
    } catch (err) {
      showError('Erreur lors de l\'export')
    } finally {
      setBulkActionLoading(false)
    }
  }
  
  // Sélection/désélection de tous les utilisateurs
  const toggleSelectAll = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([])
    } else {
      setSelectedUsers(users.map(user => user._id))
    }
  }
  
  // Sélection/désélection individuelle
  const toggleUserSelection = (userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    )
  }

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'producer': return 'bg-green-100 text-green-800'
      case 'consumer': return 'bg-blue-100 text-blue-800'
      case 'deliverer': return 'bg-orange-100 text-orange-800'
      case 'admin': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getRoleLabel = (role) => {
    switch (role) {
      case 'producer': return 'Producteur'
      case 'consumer': return 'Consommateur'
      case 'deliverer': return 'Livreur'
      case 'admin': return 'Admin'
      default: return role
    }
  }

  const getStatusBadgeColor = (isActive, isBlocked = false) => {
    if (isBlocked) {
      return 'bg-red-100 text-red-800' // Bloqué = rouge
    }
    return isActive 
      ? 'bg-green-100 text-green-800' 
      : 'bg-gray-100 text-gray-800' // Inactif = gris
  }

  const getStatusLabel = (isActive, isBlocked = false) => {
    if (isBlocked) return 'Bloqué'
    return isActive ? 'Actif' : 'Inactif'
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Non spécifiée'
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getInitials = (user) => {
    const firstName = user.firstName || ''
    const lastName = user.lastName || ''
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }

  // <--- L'ancienne DÉCLARATION REDONDANTE DE `user` ÉTAIT ICI ET A ÉTÉ SUPPRIMÉE --->

  if (loading) {
    return (
      <div className="flex h-screen bg-[#F8FAF8]">
        <AdminSidebar user={user} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <AdminHeader user={user} onOpenProfile={() => (window.location.href = '/admin/settings')} onLogout={() => { localStorage.clear(); window.location.href = '/login' }} />
          <main className="flex-1 overflow-y-auto p-6">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-2" />
                <p className="text-gray-600">Chargement des utilisateurs...</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-screen bg-[#F8FAF8]">
        <AdminSidebar user={user} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <AdminHeader user={user} onOpenProfile={() => (window.location.href = '/admin/settings')} onLogout={() => { localStorage.clear(); window.location.href = '/login' }} />
          <main className="flex-1 overflow-y-auto p-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                <div>
                  <h3 className="text-sm font-medium text-red-800">Erreur de chargement</h3>
                  <p className="text-sm text-red-600 mt-1">{error}</p>
                </div>
              </div>
              <button 
                onClick={refetch}
                className="mt-3 flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                <RefreshCw className="w-4 h-4" />
                Réessayer
              </button>
            </div>
          </main>
        </div>
      </div>
    )
  }

  const totalPages = Math.ceil(total / itemsPerPage)
  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, total)

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('adminDashboardUser')
    localStorage.removeItem('superAdminUser')
    window.location.href = isSuperAdminContext ? '/login' : '/admin/login'
  }

  const handleOpenProfile = () => {
    setShowProfileModal(true)
  }

  const handleProfileUpdated = () => {
    console.log('Profil mis à jour')
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
            {/* Debug / info current admin */}
            <div className="flex items-center gap-4">
              <div className="inline-flex items-center px-3 py-1 bg-gray-100 rounded-full text-sm">
                <strong className="mr-2">{currentAdmin ? `${currentAdmin.firstName || ''} ${currentAdmin.lastName || ''}` : 'Non connecté'}</strong>
                <span className="text-xs text-gray-500">
                  {currentAdmin ? (currentAdmin.isSuperAdmin ? 'Super-admin' : (currentAdmin.role === 'admin' ? 'Admin standard' : currentAdmin.role)) : ''}
                </span>
              </div>
            </div>
            {/* Header */}
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Gestion des Utilisateurs</h1>
                <p className="text-gray-600">Gérez tous les utilisateurs de la plateforme</p>
              </div>
              <button 
                onClick={refetch}
                disabled={loading}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
              >
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                <span>Actualiser</span>
              </button>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <Users className="w-8 h-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Utilisateurs</p>
                    <p className="text-2xl font-bold text-gray-900">{total.toLocaleString()}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <UserCheck className="w-8 h-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Actifs</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {users.filter(u => u.isActive).length}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <UserX className="w-8 h-8 text-red-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Inactifs</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {users.filter(u => !u.isActive).length}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <MoreHorizontal className="w-8 h-8 text-purple-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Rôles différents</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {[...new Set(users.map(u => u.role))].length}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Rechercher un utilisateur..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                </div>

                {/* Role Filter */}
                <select
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={selectedRole}
                  onChange={(e) => handleRoleFilter(e.target.value)}
                >
                  <option value="all">Tous les rôles</option>
                  <option value="admin">Admin</option>
                  <option value="consommateur">Consommateur</option>
                  <option value="producteur">Producteur</option>
                  <option value="livreur">Livreur</option>
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

            {/* Users Table (desktop) + Mobile list */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              {/* Desktop table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
                        <input
                          type="checkbox"
                          checked={selectedUsers.length === users.length && users.length > 0}
                          onChange={toggleSelectAll}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          disabled={bulkActionLoading}
                        />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Utilisateur
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rôle
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Statut
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date d'inscription
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                          <Users className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                          <p>Aucun utilisateur trouvé</p>
                        </td>
                      </tr>
                    ) : (
                      users.map((user) => (
                        <tr key={user._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="checkbox"
                              checked={selectedUsers.includes(user._id)}
                              onChange={() => toggleUserSelection(user._id)}
                              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                              disabled={bulkActionLoading}
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                <span className="text-sm font-medium text-white">
                                  {getInitials(user)}
                                </span>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {user.firstName} {user.lastName}
                                </div>
                                <div className="text-sm text-gray-500">{user.adresse || 'Non spécifiée'}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadgeColor(user.role)}`}>
                              {getRoleLabel(user.role)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(user.isActive, user.isBlocked)}`}>
                              {getStatusLabel(user.isActive, user.isBlocked)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="space-y-1">
                              <div className="flex items-center">
                                <Mail className="w-4 h-4 mr-1" />
                                {user.email}
                              </div>
                              {user.phone && (
                                <div className="flex items-center">
                                  <Phone className="w-4 h-4 mr-1" />
                                  {user.phone}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(user.createdAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            {user.role !== 'admin' && canModifyAdmin(user) && (
                              <div className="flex items-center space-x-2">
                                <button 
                                  onClick={() => openRoleModal(user)}
                                  className="text-blue-600 hover:text-blue-900"
                                  title={'Modifier le rôle'}
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => handleStatusToggle(user._id, user.isActive)}
                                  disabled={operationLoading === user._id}
                                  className={`${user.isActive ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}`}
                                  title={(user.isActive ? 'Désactiver' : 'Activer')}
                                >
                                  {operationLoading === user._id ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                  ) : user.isActive ? (
                                    <UserX className="w-4 h-4" />
                                  ) : (
                                    <UserCheck className="w-4 h-4" />
                                  )}
                                </button>
                                <button 
                                  onClick={() => (user.isBlocked ? handleUnblockUser(user._id, user.firstName || user.email) : handleBlockUser(user._id, user.firstName || user.email))}
                                  disabled={operationLoading === `block_${user._id}` || operationLoading === `unblock_${user._id}`}
                                  className={`${user.isBlocked ? 'text-green-600 hover:text-green-900' : 'text-orange-600 hover:text-orange-900'}`}
                                  title={(user.isBlocked ? 'Débloquer l\'utilisateur' : 'Bloquer l\'utilisateur')}
                                >
                                  {operationLoading === `block_${user._id}` || operationLoading === `unblock_${user._id}` ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                  ) : user.isBlocked ? (
                                    <Unlock className="w-4 h-4" />
                                  ) : (
                                    <Lock className="w-4 h-4" />
                                  )}
                                </button>
                                <button 
                                  onClick={() => handleDeleteUser(user._id, user.firstName || user.email)}
                                  disabled={operationLoading === user._id}
                                  className="text-red-600 hover:text-red-900"
                                  title={'Supprimer l\'utilisateur'}
                                >
                                  {operationLoading === user._id ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                  ) : (
                                    <Trash2 className="w-4 h-4" />
                                  )}
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile list */}
              <div className="md:hidden p-4 space-y-3">
                {users.length === 0 ? (
                  <div className="text-center text-gray-500 py-6">
                    <Users className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p>Aucun utilisateur trouvé</p>
                  </div>
                ) : (
                  users.map((user) => (
                    <div key={user._id} className="border rounded-lg p-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center">
                            <div className="w-9 h-9 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-3">
                              <span className="text-sm font-medium text-white">{getInitials(user)}</span>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">{user.firstName} {user.lastName}</div>
                              <div className="text-xs text-gray-500">{user.adresse || 'Non spécifiée'}</div>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadgeColor(user.role)}`}>{getRoleLabel(user.role)}</div>
                          <div className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(user.isActive, user.isBlocked)} mt-1`}>
                            {getStatusLabel(user.isActive, user.isBlocked)}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">{formatDate(user.createdAt)}</div>
                        </div>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <div className="text-xs text-gray-600 space-y-1">
                          <div className="flex items-center"><Mail className="w-4 h-4 mr-1" />{user.email}</div>
                          {user.phone && (<div className="flex items-center"><Phone className="w-4 h-4 mr-1" />{user.phone}</div>)}
                        </div>
                        {user.role !== 'admin' && canModifyAdmin(user) && (
                          <div className="flex items-center space-x-2">
                            <button onClick={() => openRoleModal(user)} className="text-blue-600"> <Edit className="w-4 h-4" /> </button>
                            <button onClick={() => handleStatusToggle(user._id, user.isActive)} className={`${user.isActive ? 'text-red-600' : 'text-green-600'}`}>
                              {operationLoading === user._id ? (<Loader2 className="w-4 h-4 animate-spin" />) : (user.isActive ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />)}
                            </button>
                            <button 
                              onClick={() => (user.isBlocked ? handleUnblockUser(user._id, user.firstName || user.email) : handleBlockUser(user._id, user.firstName || user.email))}
                              disabled={operationLoading === `block_${user._id}` || operationLoading === `unblock_${user._id}`}
                              className={`${user.isBlocked ? 'text-green-600' : 'text-orange-600'}`}
                            >
                              {operationLoading === `block_${user._id}` || operationLoading === `unblock_${user._id}` ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : user.isBlocked ? (
                                <Unlock className="w-4 h-4" />
                              ) : (
                                <Lock className="w-4 h-4" />
                              )}
                            </button>
                            <button 
                              onClick={() => handleDeleteUser(user._id, user.firstName || user.email)}
                              disabled={operationLoading === user._id}
                              className="text-red-600"
                            >
                              {operationLoading === user._id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
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
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Suivant
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Affichage de <span className="font-medium">{startItem}</span> à <span className="font-medium">{endItem}</span> sur{' '}
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
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
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
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Suivant
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}

            {/* Modal de modification de rôle */}
            {showRoleModal && selectedUser && (
              <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                  <div className="mt-3">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Modifier le rôle de {selectedUser.firstName} {selectedUser.lastName}
                    </h3>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={newRole}
                      onChange={(e) => setNewRole(e.target.value)}
                    >
                      <option value="admin">Admin</option>
                      <option value="consumer">Consommateur</option>
                      <option value="producer">Producteur</option>
                      <option value="deliverer">Livreur</option>
                    </select>
                    <div className="flex items-center justify-end space-x-3 mt-6">
                      <button
                        onClick={() => {
                          setShowRoleModal(false)
                          setSelectedUser(null)
                          setNewRole('')
                        }}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
                      >
                        Annuler
                      </button>
                      <button
                        onClick={handleRoleUpdate}
                        disabled={operationLoading === selectedUser._id}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                      >
                        {operationLoading === selectedUser._id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          'Modifier'
                        )}
                      </button>
                    </div>
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

export default AdminUsers