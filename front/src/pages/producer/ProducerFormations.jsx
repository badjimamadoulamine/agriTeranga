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

  const toast = useToast()

  // Récupérer les formations disponibles et en cours
  const { 
    formations, 
    loading, 
    error, 
    refetch 
  } = useFormations({
    isPublished: true, // Seulement les formations publiées
    search: searchTerm || undefined,
    category: categoryFilter === 'all' ? undefined : categoryFilter
  })

  // Simuler les formations suivies par le producteur (en réalité, cela viendrait de l'API)
  const [followedFormations, setFollowedFormations] = useState([])
  const [formationProgress, setFormationProgress] = useState({})

  // Fonction pour commencer une formation
  const handleStartFormation = (formationId) => {
    if (!followedFormations.includes(formationId)) {
      setFollowedFormations([...followedFormations, formationId])
      setFormationProgress(prev => ({
        ...prev,
        [formationId]: {
          status: 'in_progress',
          startedAt: new Date(),
          progress: 0
        }
      }))
      toast.success('Formation démarrée avec succès !')
    }
  }

  // Fonction pour mettre en pause/reprendre une formation
  const handleTogglePause = (formationId) => {
    const currentProgress = formationProgress[formationId]
    if (currentProgress) {
      setFormationProgress(prev => ({
        ...prev,
        [formationId]: {
          ...currentProgress,
          status: currentProgress.status === 'in_progress' ? 'paused' : 'in_progress'
        }
      }))
      toast.info(
        currentProgress.status === 'in_progress' 
          ? 'Formation mise en pause' 
          : 'Formation reprise'
      )
  }

  // Fonction pour marquer une formation comme terminée
  const handleCompleteFormation = (formationId) => {
    setFormationProgress(prev => ({
      ...prev,
      [formationId]: {
        ...prev[formationId],
        status: 'completed',
        completedAt: new Date(),
        progress: 100
      }
    }))
    toast.success('Formation terminée ! Félicitations !')
  }

  // Simuler la progression
  const simulateProgress = (formationId) => {
    const currentProgress = formationProgress[formationId]
    if (currentProgress && currentProgress.status === 'in_progress') {
      const newProgress = Math.min(currentProgress.progress + 10, 100)
      setFormationProgress(prev => ({
        ...prev,
        [formationId]: {
          ...prev[formationId],
          progress: newProgress
        }
      }))
    }
  }

  // Obtenir le statut d'une formation
  const getFormationStatus = (formationId) => {
    if (!followedFormations.includes(formationId)) return 'available'
    const progress = formationProgress[formationId]
    return progress?.status || 'available'
  }

  // Obtenir la progression d'une formation
  const getFormationProgress = (formationId) => {
    const progress = formationProgress[formationId]
    return progress?.progress || 0
  }

  // Formater la durée
  const formatDuration = (hours) => {
    if (hours < 1) {
      return `${Math.round(hours * 60)} minutes`
    }
    return `${hours} heures`
  }

  // Formater la date
  const formatDate = (dateString) => {
    if (!dateString) return 'Non programmée'
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // Catégories simulées
  const categories = [
    'Agriculture biologique',
    'Techniques de culture',
    'Gestion d\'exploitation',
    'Commercialisation',
    'Innovation technologique',
    'Développement durable'
  ]

  // Filtrer les formations selon les critères
  const filteredFormations = formations.filter(formation => {
    const matchesSearch = formation.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         formation.description?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = categoryFilter === 'all' || 
                           formation.category === categoryFilter

    return matchesSearch && matchesCategory
  })

  // Statistiques
  const totalFormations = formations.length
  const availableFormations = filteredFormations.filter(f => getFormationStatus(f._id) === 'available').length
  const inProgressFormations = filteredFormations.filter(f => getFormationStatus(f._id) === 'in_progress').length
  const completedFormations = filteredFormations.filter(f => getFormationStatus(f._id) === 'completed').length

  if (loading) {
    return (
      <ProducerLayout>
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Mes Formations</h1>
            <p className="text-lg text-gray-600">Découvrez et suivez des formations pour développer votre activité.</p>
          </div>
          
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Chargement des formations...</p>
            </div>
          </div>
        </div>
      </ProducerLayout>
    )
  }

  if (error) {
    return (
      <ProducerLayout>
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Mes Formations</h1>
          </div>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-red-800 mb-2">Erreur de chargement</h3>
            <p className="text-red-600">{error}</p>
            <button 
              onClick={refetch}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Réessayer
            </button>
          </div>
        </div>
      </ProducerLayout>
    )
  }

  return (
    <ProducerLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Mes Formations</h1>
          <p className="text-lg text-gray-600">
            Découvrez et suivez des formations pour développer votre activité agricole
          </p>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="bg-blue-500 rounded-lg p-3">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Formations Disponibles</p>
                <p className="text-2xl font-semibold text-gray-900">{availableFormations}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="bg-yellow-500 rounded-lg p-3">
                <Play className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">En Cours</p>
                <p className="text-2xl font-semibold text-gray-900">{inProgressFormations}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="bg-green-500 rounded-lg p-3">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Terminées</p>
                <p className="text-2xl font-semibold text-gray-900">{completedFormations}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="bg-purple-500 rounded-lg p-3">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Formations</p>
                <p className="text-2xl font-semibold text-gray-900">{totalFormations}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filtres */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex-1 max-w-lg">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Rechercher une formation..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="flex space-x-4">
              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="all">Toutes les catégories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filtres
              </button>
            </div>
          </div>
        </div>

        {/* Liste des formations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredFormations.length === 0 ? (
            <div className="lg:col-span-2 xl:col-span-3 text-center py-12">
              <GraduationCap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune formation trouvée</h3>
              <p className="text-gray-600">
                {searchTerm ? 'Essayez de modifier vos critères de recherche' : 'Aucune formation disponible pour le moment'}
              </p>
            </div>
          ) : (
            filteredFormations.map((formation) => {
              const status = getFormationStatus(formation._id)
              const progress = getFormationProgress(formation._id)
              
              return (
                <div key={formation._id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
                  {/* En-tête de la carte */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{formation.title}</h3>
                        <p className="text-sm text-gray-600 mb-3">{formation.description}</p>
                      </div>
                      <div className="flex-shrink-0 ml-4">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          {formation.category}
                        </span>
                      </div>
                    </div>

                    {/* Métadonnées */}
                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2" />
                        {formatDuration(formation.duration || 0)}
                      </div>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-2" />
                        {formation.maxParticipants || 'Illimité'} participants
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        {formatDate(formation.startDate)}
                      </div>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 mr-2" />
                        {formation.price ? `${formation.price}€` : 'Gratuit'}
                      </div>
                    </div>

                    {/* Formateur */}
                    {formation.instructor && (
                      <div className="flex items-center text-sm text-gray-600 mb-4">
                        <Award className="w-4 h-4 mr-2" />
                        <span>Formateur: <span className="font-medium">{formation.instructor}</span></span>
                      </div>
                    )}

                    {/* Barre de progression */}
                    {status !== 'available' && (
                      <div className="mb-4">
                        <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                          <span>Progression</span>
                          <span>{progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    {/* Statut */}
                    <div className="mb-4">
                      {status === 'available' && (
                        <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                          <BookOpen className="w-3 h-3 mr-1" />
                          Disponible
                        </span>
                      )}
                      {status === 'in_progress' && (
                        <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                          <Play className="w-3 h-3 mr-1" />
                          En cours
                        </span>
                      )}
                      {status === 'paused' && (
                        <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full">
                          <Pause className="w-3 h-3 mr-1" />
                          En pause
                        </span>
                      )}
                      {status === 'completed' && (
                        <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Terminée
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="space-y-2">
                      {status === 'available' && (
                        <button
                          onClick={() => handleStartFormation(formation._id)}
                          className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          <Play className="w-4 h-4 mr-2" />
                          Commencer la formation
                        </button>
                      )}

                      {(status === 'in_progress' || status === 'paused') && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleTogglePause(formation._id)}
                            className={`flex-1 flex items-center justify-center px-4 py-2 rounded-lg transition-colors ${
                              status === 'in_progress' 
                                ? 'bg-orange-600 text-white hover:bg-orange-700' 
                                : 'bg-green-600 text-white hover:bg-green-700'
                            }`}
                          >
                            {status === 'in_progress' ? (
                              <>
                                <Pause className="w-4 h-4 mr-2" />
                                Pause
                              </>
                            ) : (
                              <>
                                <Play className="w-4 h-4 mr-2" />
                                Reprendre
                              </>
                            )}
                          </button>
                          
                          <button
                            onClick={() => handleCompleteFormation(formation._id)}
                            disabled={progress >= 100}
                            className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Terminer
                          </button>
                        </div>
                      )}

                      {status === 'in_progress' && (
                        <button
                          onClick={() => simulateProgress(formation._id)}
                          className="w-full px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
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