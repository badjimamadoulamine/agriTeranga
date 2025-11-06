import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { 
  GraduationCap, 
  Plus, 
  Search, 
  Filter,
  Users, 
  Calendar,
  Clock,
  BookOpen,
  Star,
  Edit,
  Eye,
  Loader2,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  XCircle,
  Play,
  Pause
} from 'lucide-react'
import { useFormations } from '../../hooks/useApi'
import AdminSidebar from '../../components/admin/AdminSidebar'
import AdminHeader from '../../components/admin/AdminHeader'
import SuperAdminSidebar from '../../components/super_admin/SuperAdminSidebar'
import SuperAdminHeader from '../../components/super_admin/SuperAdminHeader'
import AdminProfileModal from '../../components/admin/AdminProfileModal'

const AdminFormations = () => {
  const location = useLocation()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(20)
  const [operationLoading, setOperationLoading] = useState(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedFormation, setSelectedFormation] = useState(null)
  const [showFilters, setShowFilters] = useState(false)
  const [showProfileModal, setShowProfileModal] = useState(false)

  const handleProfileUpdated = () => {
    console.log('Profil mis à jour')
  }
  const [newFormation, setNewFormation] = useState({
    title: '',
    description: '',
    category: '',
    duration: '',
    price: '',
    maxParticipants: '',
    instructor: '',
    startDate: '',
    isPublished: true,
    video: null
  })

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
        storageKey = localStorage.getItem('adminDashboardUser') || localStorage.getItem('user')
      }
      return storageKey ? JSON.parse(storageKey) : null
    } catch {
      return null
    }
  }, [isSuperAdminContext])

  // Hook pour récupérer les formations
  const { 
    formations, 
    categories,
    total, 
    loading, 
    error, 
    refetch,
    togglePublish,
    createFormation,
    updateFormation,
    deleteFormation,
    categoriesLoading,
    categoriesError
  } = useFormations({
    status: statusFilter === 'all' ? undefined : statusFilter,
    category: categoryFilter === 'all' ? undefined : categoryFilter,
    search: searchTerm || undefined,
    page: currentPage,
    limit: itemsPerPage
  })


  const handleSearch = (value) => {
    setSearchTerm(value)
    setCurrentPage(1)
  }

  const handleStatusFilter = (status) => {
    setStatusFilter(status)
    setCurrentPage(1)
  }

  const handleTogglePublish = async (formationId, currentStatus) => {
    try {
      setOperationLoading(formationId)
      await togglePublish(formationId)
    } catch (error) {
      alert(`Erreur lors du changement de statut: ${error.message}`)
    } finally {
      setOperationLoading(null)
    }
  }

  const handleCreateFormation = async () => {
    try {
      setOperationLoading('create')

      const form = new FormData()
      form.append('title', newFormation.title || '')
      form.append('description', newFormation.description || '')
      form.append('category', newFormation.category || '')
      if (newFormation.duration !== '') form.append('duration', String(parseInt(newFormation.duration)))
      if (newFormation.price !== '') form.append('price', String(parseFloat(newFormation.price)))
      if (newFormation.maxParticipants !== '') form.append('maxParticipants', String(parseInt(newFormation.maxParticipants)))
      form.append('instructor', newFormation.instructor || '')
      form.append('startDate', newFormation.startDate || '')
      form.append('isPublished', String(Boolean(newFormation.isPublished)))
      if (newFormation.video instanceof File) form.append('video', newFormation.video)

      await createFormation(form)

      setShowCreateModal(false)
      setNewFormation({
        title: '',
        description: '',
        category: '',
        duration: '',
        price: '',
        maxParticipants: '',
        instructor: '',
        startDate: '',
        isPublished: true,
        video: null
      })
    } catch (error) {
      alert(`Erreur lors de la création: ${error.message}`)
    } finally {
      setOperationLoading(null)
    }
  }

  const handleEditFormation = async () => {
    if (!selectedFormation) return

    try {
      setOperationLoading('edit')
      await updateFormation(selectedFormation._id, {
        ...selectedFormation,
        maxParticipants: parseInt(selectedFormation.maxParticipants),
        price: parseFloat(selectedFormation.price),
        duration: parseInt(selectedFormation.duration)
      })
      setShowEditModal(false)
      setSelectedFormation(null)
    } catch (error) {
      alert(`Erreur lors de la modification: ${error.message}`)
    } finally {
      setOperationLoading(null)
    }
  }

  const handleDeleteFormation = async (formationId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette formation ?')) {
      try {
        setOperationLoading(formationId)
        await deleteFormation(formationId)
      } catch (error) {
        alert(`Erreur lors de la suppression: ${error.message}`)
      } finally {
        setOperationLoading(null)
      }
    }
  }

  const formatPrice = (price) => {
    const formatted = new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price || 0)
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

  // Formater l'objet formateur (ou string) en nom lisible
  const formatInstructor = (instructor) => {
    if (!instructor) return ''
    if (typeof instructor === 'string') return instructor
    // supporter différents schémas: { firstName, lastName, profilePicture } ou { name }
    if (instructor.firstName) {
      return `${instructor.firstName} ${instructor.lastName || ''}`.trim()
    }
    if (instructor.name) return instructor.name
    return ''
  }

  const getStatusBadge = (formation) => {
    if (formation.isPublished) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle className="w-3 h-3 mr-1" />
          Publiée
        </span>
      )
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          <XCircle className="w-3 h-3 mr-1" />
          Non publiée
        </span>
      )
    }
  }

  // Calcul des statistiques
  const totalParticipants = Array.isArray(formations) ? formations.reduce((sum, f) => sum + (f.participants?.length || 0), 0) : 0
  const averageRating = Array.isArray(formations) && formations.length > 0
    ? (formations.reduce((sum, f) => sum + (f.rating || 0), 0) / formations.length).toFixed(1)
    : '0.0'
  const uniqueInstructors = Array.isArray(formations)
    ? [...new Set(formations.map(f => formatInstructor(f.instructor)).filter(Boolean))]
    : []

  // categories are now provided by the useFormations hook (fetched from backend)

  if (loading) {
    const SidebarComponent = isSuperAdminContext ? SuperAdminSidebar : AdminSidebar
    const HeaderComponent = isSuperAdminContext ? SuperAdminHeader : AdminHeader
    
    return (
      <div className="flex h-screen bg-[#F8FAF8]">
        <SidebarComponent user={user} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <HeaderComponent
            user={user}
            onOpenProfile={() => (window.location.href = isSuperAdminContext ? '/super-admin/settings' : '/admin/settings')}
            onLogout={() => { 
              localStorage.clear(); 
              window.location.href = isSuperAdminContext ? '/login' : '/admin/login' 
            }}
          />
          <main className="flex-1 overflow-y-auto p-6">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-2" />
                <p className="text-gray-600">Chargement des formations...</p>
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
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Formations</h1>
          <p className="text-gray-600">Créez et gérez vos formations agricoles</p>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={refetch}
            disabled={loading}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            <span>Actualiser</span>
          </button>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Nouvelle formation</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-blue-500 rounded-lg p-3">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Formations</p>
              <p className="text-2xl font-semibold text-gray-900">{formations.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-green-500 rounded-lg p-3">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Participants</p>
              <p className="text-2xl font-semibold text-gray-900">{totalParticipants}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-purple-500 rounded-lg p-3">
              <Star className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Note Moyenne</p>
              <p className="text-2xl font-semibold text-gray-900">{averageRating}/5</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-orange-500 rounded-lg p-3">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Formateurs</p>
              <p className="text-2xl font-semibold text-gray-900">{uniqueInstructors.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
            <div>
              <h3 className="text-sm font-medium text-red-800">Erreur de chargement</h3>
              <p className="text-sm text-red-600 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4 md:hidden">
          <h3 className="text-sm font-medium text-gray-700">Filtres</h3>
          <button onClick={() => setShowFilters(true)} className="px-3 py-1 bg-gray-100 rounded-lg text-sm flex items-center space-x-2">
            <Filter className="w-4 h-4" />
            <span>Ouvrir</span>
          </button>
        </div>
        <div className="hidden md:grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher une formation..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          <select 
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={statusFilter}
            onChange={(e) => handleStatusFilter(e.target.value)}
          >
            <option value="all">Toutes les formations</option>
            <option value="published">Publiées</option>
            <option value="draft">Brouillons</option>
          </select>
          <div className="relative">
            <select 
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value)
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
                Array.isArray(categories) && categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))
              )}
            </select>
            {categoriesError && (
              <button
                onClick={refetch}
                className="absolute right-8 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                title="Réessayer"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            )}
          </div>
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
          </select>
        </div>
        {/* Mobile filter drawer */}
        {showFilters && (
          <div className="fixed inset-0 z-50 flex">
            <div className="absolute inset-0 bg-black opacity-40" onClick={() => setShowFilters(false)} />
            <div className="relative bg-white w-11/12 max-w-sm h-full p-6 overflow-auto">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-medium">Filtres</h4>
                <button onClick={() => setShowFilters(false)} className="text-gray-600">Fermer</button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Recherche</label>
                  <input type="text" value={searchTerm} onChange={(e) => handleSearch(e.target.value)} className="w-full px-3 py-2 border rounded" />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Statut</label>
                  <select value={statusFilter} onChange={(e) => handleStatusFilter(e.target.value)} className="w-full px-3 py-2 border rounded">
                    <option value="all">Toutes</option>
                    <option value="published">Publiées</option>
                    <option value="draft">Brouillons</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Catégorie</label>
                  <div className="relative">
                    <select 
                      value={categoryFilter} 
                      onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1); }} 
                      className="w-full px-3 py-2 border rounded pr-8" 
                      disabled={categoriesLoading}
                    >
                      <option value="all">Toutes les catégories</option>
                      {categoriesLoading ? (
                        <option value="" disabled>Chargement...</option>
                      ) : categoriesError ? (
                        <option value="" disabled>Erreur de chargement</option>
                      ) : (
                        Array.isArray(categories) && categories.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))
                      )}
                    </select>
                    {categoriesError && (
                      <button
                        onClick={refetch}
                        className="absolute right-6 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        title="Réessayer"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Résultats par page</label>
                  <select value={itemsPerPage} onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }} className="w-full px-3 py-2 border rounded">
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </select>
                </div>
                <div className="flex justify-end">
                  <button onClick={() => { setShowFilters(false); refetch(); }} className="px-4 py-2 bg-blue-600 text-white rounded">Appliquer</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Formations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {formations.length === 0 ? (
          <div className="col-span-2 flex items-center justify-center py-12 text-gray-500">
            <div className="text-center">
              <GraduationCap className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg">Aucune formation trouvée</p>
              <p className="text-sm">Commencez par créer votre première formation</p>
            </div>
          </div>
        ) : (
          formations.map((formation) => (
            <div key={formation._id} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900">{formation.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{formation.description}</p>
                  </div>
                  {getStatusBadge(formation)}
                </div>
                
                <div className="space-y-3">
                  {formatInstructor(formation.instructor) && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="w-4 h-4 mr-2" />
                      <span>Formateur: {formatInstructor(formation.instructor)}</span>
                    </div>
                  )}
                  {formation.duration && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="w-4 h-4 mr-2" />
                      <span>Durée: {formation.duration}h</span>
                    </div>
                  )}
                  {formation.startDate && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>Début: {formatDate(formation.startDate)}</span>
                    </div>
                  )}
                  {formation.rating && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Star className="w-4 h-4 mr-2 text-yellow-500" />
                      <span>Note: {formation.rating}/5</span>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-lg font-semibold text-gray-900">
                        {formatPrice(formation.price)}
                      </span>
                      <span className="text-sm text-gray-600 ml-2">
                        ({formation.participants?.length || 0} participants)
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => handleTogglePublish(formation._id, formation.isPublished)}
                        disabled={operationLoading === formation._id}
                        className={`p-2 rounded-lg ${
                          formation.isPublished 
                            ? 'text-orange-600 hover:bg-orange-50' 
                            : 'text-green-600 hover:bg-green-50'
                        }`}
                        title={formation.isPublished ? 'Dépublier' : 'Publier'}
                      >
                        {operationLoading === formation._id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : formation.isPublished ? (
                          <Pause className="w-4 h-4" />
                        ) : (
                          <Play className="w-4 h-4" />
                        )}
                      </button>
                      <button 
                        onClick={() => {
                          setSelectedFormation(formation)
                          setShowEditModal(true)
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        title="Modifier"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteFormation(formation._id)}
                        disabled={operationLoading === formation._id}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50"
                        title="Supprimer"
                      >
                        {operationLoading === formation._id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <XCircle className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal de création */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Créer une nouvelle formation</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={newFormation.title}
                    onChange={(e) => setNewFormation({...newFormation, title: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={newFormation.category}
                    onChange={(e) => setNewFormation({...newFormation, category: e.target.value})}
                    disabled={categoriesLoading}
                  >
                    <option value="">Sélectionner une catégorie</option>
                    {categoriesLoading ? (
                      <option value="" disabled>Chargement...</option>
                    ) : categoriesError ? (
                      <option value="" disabled>Erreur de chargement</option>
                    ) : (
                      Array.isArray(categories) && categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))
                    )}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    rows="3"
                    value={newFormation.description}
                    onChange={(e) => setNewFormation({...newFormation, description: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Formateur</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={newFormation.instructor}
                    onChange={(e) => setNewFormation({...newFormation, instructor: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Durée (heures)</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={newFormation.duration}
                    onChange={(e) => setNewFormation({...newFormation, duration: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prix (FCFA)</label>
                  <input
                    type="number"
                    step="1"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={newFormation.price}
                    onChange={(e) => setNewFormation({...newFormation, price: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max participants</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={newFormation.maxParticipants}
                    onChange={(e) => setNewFormation({...newFormation, maxParticipants: e.target.value})}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date de début</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={newFormation.startDate}
                    onChange={(e) => setNewFormation({...newFormation, startDate: e.target.value})}
                  />
                </div>

                {/* Uploads */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vidéo (MP4)</label>
                  <input
                    type="file"
                    accept="video/mp4,video/*"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => setNewFormation({ ...newFormation, video: e.target.files?.[0] || null })}
                  />
                </div>

                <div className="md:col-span-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isPublished"
                      checked={newFormation.isPublished}
                      onChange={(e) => setNewFormation({...newFormation, isPublished: e.target.checked})}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isPublished" className="ml-2 block text-sm text-gray-700">
                      Publiée (visible par les producteurs)
                    </label>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Les formations publiées apparaîtront dans le tableau de bord des producteurs
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowCreateModal(false)
                    setNewFormation({
                      title: '',
                      description: '',
                      category: '',
                      duration: '',
                      price: '',
                      maxParticipants: '',
                      instructor: '',
                      startDate: '',
                      isPublished: true,
                      thumbnail: null,
                      document: null,
                      video: null
                    })
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  Annuler
                </button>
                <button
                  onClick={handleCreateFormation}
                  disabled={operationLoading === 'create'}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {operationLoading === 'create' ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    'Créer'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal d'édition */}
      {showEditModal && selectedFormation && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Modifier la formation</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={selectedFormation.title}
                    onChange={(e) => setSelectedFormation({...selectedFormation, title: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={selectedFormation.category || ''}
                    onChange={(e) => setSelectedFormation({...selectedFormation, category: e.target.value})}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    rows="3"
                    value={selectedFormation.description || ''}
                    onChange={(e) => setSelectedFormation({...selectedFormation, description: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Formateur</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={selectedFormation && (typeof selectedFormation.instructor === 'string' ? selectedFormation.instructor : formatInstructor(selectedFormation.instructor)) || ''}
                    onChange={(e) => setSelectedFormation({...selectedFormation, instructor: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Durée (heures)</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={selectedFormation.duration || ''}
                    onChange={(e) => setSelectedFormation({...selectedFormation, duration: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prix (€)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={selectedFormation.price || ''}
                    onChange={(e) => setSelectedFormation({...selectedFormation, price: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max participants</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={selectedFormation.maxParticipants || ''}
                    onChange={(e) => setSelectedFormation({...selectedFormation, maxParticipants: e.target.value})}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date de début</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={selectedFormation.startDate ? selectedFormation.startDate.split('T')[0] : ''}
                    onChange={(e) => setSelectedFormation({...selectedFormation, startDate: e.target.value})}
                  />
                </div>
              </div>
              <div className="flex items-center justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowEditModal(false)
                    setSelectedFormation(null)
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  Annuler
                </button>
                <button
                  onClick={handleEditFormation}
                  disabled={operationLoading === 'edit'}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {operationLoading === 'edit' ? (
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

export default AdminFormations