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
  ChevronLeft,
  Filter,
  Search,
  X,
  Video,
  FileText
} from 'lucide-react'
import { useFormations } from '../../hooks/useApi'
import ProducerLayout from '../../layouts/ProducerLayout'
import { useToast } from '../../contexts/ToastContext'

const ProducerFormations = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all') // 'available', 'in_progress', 'completed'
  const [showFilters, setShowFilters] = useState(false)

  // UI state for details and player modals
  const [showDetails, setShowDetails] = useState(false)
  const [showPlayer, setShowPlayer] = useState(false)
  const [selectedFormation, setSelectedFormation] = useState(null)
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0)

  // Per-lesson progress state persisted in localStorage
  const [lessonState, setLessonState] = useState(
    JSON.parse(localStorage.getItem('producerLessonState') || '{}')
  )

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
    localStorage.setItem('producerLessonState', JSON.stringify(lessonState))
  }, [followedFormations, formationProgress, lessonState])

  // Helpers
  const getLessons = (formation) => {
    if (!formation) return []
    const lessons = []
    // If a video is present, create a video lesson
    if (formation.content?.videoUrl) {
      lessons.push({
        title: `${formation.title} - Introduction vidéo`,
        type: 'video',
        duration: Math.max(1, Math.round((formation.duration || 60) / 3)),
        payload: { url: formation.content.videoUrl }
      })
    }
    // If articleText present, split into sections
    if (formation.content?.articleText) {
      const sections = formation.content.articleText.split(/\n\n+/).filter(Boolean)
      sections.forEach((text, idx) => {
        lessons.push({
          title: `${formation.title} - Chapitre ${idx + 1}`,
          type: 'article',
          duration: Math.max(1, Math.round((formation.duration || 60) / Math.max(1, sections.length))),
          payload: { text }
        })
      })
    }
    // Fallback to generic lessons if empty
    if (lessons.length === 0) {
      const count = 4
      for (let i = 0; i < count; i++) {
        lessons.push({
          title: `${formation.title} - Module ${i + 1}`,
          type: i === 0 ? 'video' : 'article',
          duration: Math.max(1, Math.round((formation.duration || 60) / count)),
          payload: i === 0 ? { url: '' } : { text: formation.description || '' }
        })
      }
    }
    return lessons
  }

  const syncProgressFromLessons = (formationId, lessons, completedMap) => {
    const total = lessons.length || 1
    const completed = Object.values(completedMap || {}).filter(Boolean).length
    const percent = Math.round((completed / total) * 100)
    setFormationProgress(prev => ({ ...prev, [formationId]: percent }))
  }

  const handleStartFormation = (formationId) => {
    if (!followedFormations.includes(formationId)) {
      setFollowedFormations(prev => [...prev, formationId])
    }
    // Initialize lesson state if needed
    setLessonState(prev => {
      const next = { ...prev }
      if (!next[formationId]) next[formationId] = { current: 0, completed: {} }
      return next
    })
    success('Formation commencée ! Bonne session.')
  }

  // Fonction pour simuler la progression (ajout de 10%)
  const markLessonCompleted = (formationId, lessonIndex) => {
    setLessonState(prev => {
      const current = prev[formationId] || { current: 0, completed: {} }
      const updated = {
        ...prev,
        [formationId]: {
          current: Math.max(current.current, lessonIndex),
          completed: { ...current.completed, [lessonIndex]: true }
        }
      }
      const formation = allFormations.find(f => f._id === formationId)
      syncProgressFromLessons(formationId, getLessons(formation), updated[formationId].completed)
      return updated
    })
  }

  const goToLesson = (formationId, lessons, nextIndex) => {
    const bounded = Math.max(0, Math.min(lessons.length - 1, nextIndex))
    setCurrentLessonIndex(bounded)
    setLessonState(prev => {
      const current = prev[formationId] || { current: 0, completed: {} }
      return { ...prev, [formationId]: { ...current, current: bounded } }
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

  const openDetails = (formation) => {
    setSelectedFormation(formation)
    // Ensure lesson state exists to compute counts
    setLessonState(prev => {
      if (!prev[formation._id]) return { ...prev, [formation._id]: { current: 0, completed: {} } }
      return prev
    })
    setShowDetails(true)
  }

  const closeDetails = () => {
    setShowDetails(false)
    setSelectedFormation(null)
  }

  const openPlayer = (formation) => {
    setSelectedFormation(formation)
    const lessons = getLessons(formation)
    const st = lessonState[formation._id] || { current: 0, completed: {} }
    setCurrentLessonIndex(Math.min(st.current || 0, Math.max(lessons.length - 1, 0)))
    setShowDetails(false)
    setShowPlayer(true)
  }

  const closePlayer = () => {
    setShowPlayer(false)
    setSelectedFormation(null)
  }

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
              const lessons = getLessons(formation)
              const thumb = formation.thumbnail || 'https://images.unsplash.com/photo-1523246191915-6b58956a5a02?q=80&w=1200&auto=format&fit=crop'
              
              return (
                <div 
                  key={formation._id} 
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden border border-gray-200"
                >
                  <div className="h-40 w-full bg-gray-100 overflow-hidden">
                    <img src={thumb} alt={formation.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold text-gray-800 leading-snug">
                        {formation.title}
                      </h3>
                      <span className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full ml-3 ${getStatusBadgeColor(status)}`}>
                        {getStatusLabel(status)}
                      </span>
                    </div>

                    <p className="text-gray-700 mb-3 line-clamp-2">
                      {formation.description || 'Pas de description disponible.'}
                    </p>

                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center">
                        <BookOpen className="w-4 h-4 mr-1 text-blue-600" />
                        <span>{lessons.length} leçons</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1 text-orange-600" />
                        <span>{formatDuration(Math.ceil((formation.duration || 60)/60))}</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1 text-green-600" />
                        <span>{formation.participants || 0} inscrits</span>
                      </div>
                    </div>

                    {(status === 'in_progress' || status === 'completed') && (
                      <div className="mb-3">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-[#59C94F] h-2.5 rounded-full transition-all duration-500" 
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between mt-1 text-xs text-gray-500">
                          <span>{progress}%</span>
                          <span>{lessons.length} leçons</span>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => openDetails(formation)}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                      >
                        En savoir plus
                      </button>
                      {status === 'available' ? (
                        <button
                          onClick={() => { handleStartFormation(formation._id); openPlayer(formation) }}
                          className="flex items-center justify-center space-x-2 px-4 py-2 bg-[#59C94F] text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          <Play className="w-5 h-5" />
                          <span>Débuter</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => openPlayer(formation)}
                          className="flex items-center justify-center space-x-2 px-4 py-2 border border-blue-500 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                        >
                          <Play className="w-5 h-5" />
                          <span>Continuer</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Details Modal */}
        {showDetails && selectedFormation && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={closeDetails} />
            <div className="relative bg-white w-11/12 max-w-3xl rounded-2xl shadow-xl overflow-hidden">
              <div className="h-48 w-full bg-gray-100 overflow-hidden">
                <img src={selectedFormation.thumbnail || 'https://images.unsplash.com/photo-1523246191915-6b58956a5a02?q=80&w=1200&auto=format&fit=crop'} alt={selectedFormation.title} className="w-full h-full object-cover" />
              </div>
              <button className="absolute top-3 right-3 bg-white/80 hover:bg-white rounded-full p-1" onClick={closeDetails}>
                <X className="w-5 h-5" />
              </button>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{selectedFormation.title}</h3>
                <p className="text-gray-700 mb-4">{selectedFormation.description}</p>
                <div className="grid grid-cols-3 gap-4 text-sm text-gray-600 mb-6">
                  <div className="flex items-center"><Clock className="w-4 h-4 mr-2 text-orange-600" />{formatDuration(Math.ceil((selectedFormation.duration||60)/60))}</div>
                  <div className="flex items-center"><Users className="w-4 h-4 mr-2 text-green-600" />{selectedFormation.participants || 0} inscrits</div>
                  <div className="flex items-center"><BookOpen className="w-4 h-4 mr-2 text-blue-600" />{getLessons(selectedFormation).length} leçons</div>
                </div>
                <div className="flex justify-end gap-3">
                  <button onClick={closeDetails} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">Fermer</button>
                  <button onClick={() => { handleStartFormation(selectedFormation._id); openPlayer(selectedFormation) }} className="px-4 py-2 bg-[#59C94F] text-white rounded-lg hover:bg-green-700">Débuter la formation</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Player Modal */}
        {showPlayer && selectedFormation && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50" onClick={closePlayer} />
            <div className="relative bg-white w-11/12 max-w-6xl h-[85vh] rounded-2xl shadow-xl overflow-hidden grid grid-cols-12">
              {/* Sidebar lessons */}
              <div className="col-span-4 md:col-span-3 lg:col-span-3 h-full border-r overflow-y-auto">
                <div className="p-4 flex items-center justify-between border-b">
                  <h4 className="font-semibold text-gray-800">Sommaire</h4>
                  <button className="text-gray-500 hover:text-gray-700" onClick={closePlayer}><X className="w-5 h-5" /></button>
                </div>
                {(() => {
                  const lessons = getLessons(selectedFormation)
                  const st = lessonState[selectedFormation._id] || { current: 0, completed: {} }
                  return (
                    <ul className="divide-y">
                      {lessons.map((ls, idx) => (
                        <li key={idx} className={`p-3 cursor-pointer hover:bg-gray-50 ${idx === currentLessonIndex ? 'bg-gray-50' : ''}`} onClick={() => goToLesson(selectedFormation._id, lessons, idx)}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {ls.type === 'video' ? <Video className="w-4 h-4 text-red-500" /> : <FileText className="w-4 h-4 text-blue-500" />}
                              <span className="text-sm text-gray-800 line-clamp-1">{ls.title}</span>
                            </div>
                            {st.completed[idx] && <CheckCircle className="w-4 h-4 text-green-600" />}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">{ls.duration} min</div>
                        </li>
                      ))}
                    </ul>
                  )
                })()}
              </div>

              {/* Player content */}
              <div className="col-span-8 md:col-span-9 lg:col-span-9 h-full overflow-y-auto">
                {(() => {
                  const lessons = getLessons(selectedFormation)
                  const current = lessons[currentLessonIndex] || lessons[0]
                  const st = lessonState[selectedFormation._id] || { current: 0, completed: {} }
                  const percent = formationProgress[selectedFormation._id] || 0
                  return (
                    <div className="flex flex-col h-full">
                      <div className="p-4 border-b">
                        <h3 className="text-xl font-bold text-gray-900">{selectedFormation.title}</h3>
                        <div className="mt-2">
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div className="bg-[#59C94F] h-2.5 rounded-full transition-all" style={{ width: `${percent}%` }}></div>
                          </div>
                          <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>{percent}%</span>
                            <span>{lessons.length} leçons</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 flex-1 overflow-auto">
                        {current.type === 'video' ? (
                          current.payload.url ? (
                            <video controls className="w-full max-h-[50vh] rounded-lg bg-black">
                              <source src={current.payload.url} type="video/mp4" />
                              Votre navigateur ne supporte pas la vidéo HTML5.
                            </video>
                          ) : (
                            <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">Aucune vidéo fournie</div>
                          )
                        ) : (
                          <article className="prose max-w-none">
                            <p className="whitespace-pre-wrap text-gray-800 leading-relaxed">{current.payload.text}</p>
                          </article>
                        )}
                      </div>

                      <div className="p-4 border-t flex items-center justify-between gap-2">
                        <button onClick={() => goToLesson(selectedFormation._id, lessons, currentLessonIndex - 1)} className="flex items-center gap-2 px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50">
                          <ChevronLeft className="w-4 h-4" /> Précédent
                        </button>
                        <div className="flex items-center gap-2">
                          {!st.completed[currentLessonIndex] && (
                            <button onClick={() => markLessonCompleted(selectedFormation._id, currentLessonIndex)} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Marquer comme terminé</button>
                          )}
                          <button onClick={() => goToLesson(selectedFormation._id, lessons, currentLessonIndex + 1)} className="flex items-center gap-2 px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50">
                            Suivant <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })()}
              </div>
            </div>
          </div>
        )}

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