import React, { useState } from 'react'
import { 
  GraduationCap, 
  Play, 
  Pause, 
  BookOpen, 
  Clock, 
  Users,
  Calendar,
  CheckCircle,
  AlertCircle,
  Star,
  TrendingUp,
  Award,
  ChevronRight,
  Filter,
  Search
} from 'lucide-react'
import { useFormations } from '../../hooks/useApi'
import ProducerLayout from '../../layouts/ProducerLayout'
import { useToast } from '../../contexts/ToastContext'

const ProducerFormations = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all') // 'available', 'in_progress', 'completed'
  const [showFilters, setShowFilters] = useState(false)

  const { success, error: showError, loading: showLoading } = useToast()

  // Récupérer les formations disponibles et en cours
  const { 
    formations: allFormations, 
    loading, 
    error, 
    refetch 
  } = useFormations({
    isPublished: true, // Seulement les formations publiées
    search: searchTerm || undefined,
    category: categoryFilter === 'all' ? undefined : categoryFilter
  })

  // Simuler les formations suivies par le producteur (en réalité, cela viendrait de l'API)
  const [followedFormations, setFollowedFormations] = useState(
    JSON.parse(localStorage.getItem('producerFollowedFormations') || '[]')
  )
  const [formationProgress, setFormationProgress] = useState(
    JSON.parse(localStorage.getItem('producerFormationProgress') || '{}')
  )

  // Mettre à jour le localStorage après chaque modification
  React.useEffect(() => {
    localStorage.setItem('producerFollowedFormations', JSON.stringify(followedFormations))
    localStorage.setItem('producerFormationProgress', JSON.stringify(formationProgress))
  }, [followedFormations, formationProgress])

  // Fonction pour commencer une formation
  const handleStartFormation = (formationId) => {
    if (!followedFormations.includes(formationId)) {
      setFollowedFormations(prev => [...prev, formationId])
      setFormationProgress(prev => ({
        ...prev,
        [formationId]: 10 // Commence à 10%
      }))
      success('Formation commencée ! Bonne session.')
    }
  }

  // Fonction pour simuler la progression (ajout de 10%)
  const handleSimulateProgress = (formationId) => {
    setFormationProgress(prev => {
      const currentProgress = prev[formationId] || 0
      let newProgress = currentProgress + 10
      
      if (newProgress >= 100) {
        newProgress = 100
        // Marquer comme terminée
        success('Félicitations ! Formation terminée !')
      } else {
        success(`Progression mise à jour : ${newProgress}%`)
      }
      
      return {
        ...prev,
        [formationId]: newProgress
      }
    })
  }
  
  // Fonction pour obtenir le statut réel d'une formation pour l'affichage
  const getFormationStatus = (formationId) => {
    const progress = formationProgress[formationId] || 0
    if (progress === 100) return 'completed'
    if (progress > 0) return 'in_progress'
    if (followedFormations.includes(formationId)) return 'available' // Peut-être si elle est marquée comme 'suivie' mais à 0%
    return 'available'
  }

  // Filtrer les formations basées sur le statut
  const filteredFormations = React.useMemo(() => {
    if (!allFormations) return []
    
    return allFormations.filter(formation => {
      const status = getFormationStatus(formation._id)
      
      if (statusFilter === 'all') return true
      
      if (statusFilter === 'available' && status === 'available') return true
      if (statusFilter === 'in_progress' && status === 'in_progress') return true
      if (statusFilter === 'completed' && status === 'completed') return true
      
      return false
    })
  }, [allFormations, statusFilter, formationProgress])

  // Handle Search and Filter
  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
    // Le hook useFormations gère la relance de la requête API avec le nouveau terme de recherche
  }

  const handleCategoryFilter = (e) => {
    setCategoryFilter(e.target.value)
    // Le hook useFormations gère la relance de la requête API avec le nouveau filtre
  }

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'in_progress': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status) => {
    switch (status) {
      case 'completed': return 'Terminée'
      case 'in_progress': return 'En cours'
      default: return 'Disponible'
    }
  }

  const formatModules = (count) => {
    return count > 1 ? `${count} modules` : `${count} module`
  }

  const formatDuration = (hours) => {
    return hours > 1 ? `${hours} heures` : `${hours} heure`
  }
  
  if (loading) {
    return (
      <ProducerLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#59C94F]"></div>
        </div>
      </ProducerLayout>
    )
  }

  if (error) {
    return (
      <ProducerLayout>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
          <button 
            onClick={refetch}
            className="mt-2 text-sm text-red-700 underline hover:text-red-900"
          >
            Réessayer
          </button>
        </div>
      </ProducerLayout>
    )
  }

  const allCategories = [...new Set(allFormations.map(f => f.category))].filter(c => c) || []

  return (
    <ProducerLayout>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center">
              <GraduationCap className="w-8 h-8 text-[#59C94F] mr-3" />
              Espace Formations
            </h1>
            <p className="text-lg text-gray-600">Développez vos compétences avec nos modules de formation.</p>
          </div>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Filter className="w-5 h-5" />
            <span>Filtres {showFilters ? 'masqués' : 'affichés'}</span>
          </button>
        </div>

        {/* Filters & Search */}
        <div className={`bg-white rounded-xl shadow-sm p-6 mb-8 transition-all duration-300 ${showFilters ? 'block' : 'hidden'}`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher par titre..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#59C94F] focus:border-transparent"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>

            {/* Category Filter */}
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#59C94F] focus:border-transparent"
              value={categoryFilter}
              onChange={handleCategoryFilter}
            >
              <option value="all">Toutes les catégories</option>
              {allCategories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#59C94F] focus:border-transparent"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Tous les statuts</option>
              <option value="available">Disponible</option>
              <option value="in_progress">En cours</option>
              <option value="completed">Terminée</option>
            </select>
          </div>
        </div>

        {/* Liste des formations */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFormations.length === 0 ? (
            <div className="md:col-span-3 text-center py-12 bg-white rounded-xl shadow-sm">
              <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500">Aucune formation trouvée pour cette sélection.</p>
            </div>
          ) : (
            filteredFormations.map((formation) => {
              const status = getFormationStatus(formation._id)
              const progress = formationProgress[formation._id] || 0
              
              return (
                <div 
                  key={formation._id} 
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden border border-gray-200"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-bold text-gray-800 leading-snug">
                        {formation.title}
                      </h3>
                      <span className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full ml-3 ${getStatusBadgeColor(status)}`}>
                        {getStatusLabel(status)}
                      </span>
                    </div>

                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4 border-b pb-4">
                      <div className="flex items-center">
                        <BookOpen className="w-4 h-4 mr-1 text-blue-600" />
                        <span>{formatModules(formation.modules?.length || 0)}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1 text-orange-600" />
                        <span>{formatDuration(formation.duration || 0)}</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1 text-green-600" />
                        <span>{formation.participants || 0} inscrits</span>
                      </div>
                    </div>

                    <p className="text-gray-700 mb-4 line-clamp-3">
                      {formation.description || 'Pas de description disponible.'}
                    </p>
                    
                    {/* Progression */}
                    {(status === 'in_progress' || status === 'completed') && (
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium text-gray-700">Progression</span>
                          <span className="text-sm font-bold text-[#59C94F]">{progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-[#59C94F] h-2.5 rounded-full transition-all duration-500" 
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      {status === 'available' && (
                        <button
                          onClick={() => handleStartFormation(formation._id)}
                          className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-[#59C94F] text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          <Play className="w-5 h-5" />
                          <span>Commencer la formation</span>
                        </button>
                      )}

                      {status === 'in_progress' && (
                        <button
                          onClick={() => handleSimulateProgress(formation._id)}
                          className="w-full flex items-center justify-center space-x-2 px-4 py-2 border border-blue-500 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                        >
                          <TrendingUp className="w-5 h-5" />
                          Simuler progression (+10%)
                        </button>
                      )}

                      {status === 'completed' && (
                        <div className="text-center text-green-600 font-medium">
                          <Award className="w-6 h-6 mx-auto mb-1" />
                          Formation terminée !
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Message informatif */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="w-5 h-5 text-blue-600" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                Note importante
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>
                  Cette page vous permet de suivre les formations disponibles. Pour modifier ou supprimer des formations, 
                  contactez l'administrateur de la plateforme. Les actions de modification et suppression sont réservées aux administrateurs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProducerLayout>
  )
}

export default ProducerFormations