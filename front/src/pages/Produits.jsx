import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useCartOperations } from '../hooks/useCartOperations'
import apiService from '../services/apiService'

const Produits = ({ onOpenRegister, onOpenLogin }) => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [activeFilter, setActiveFilter] = useState('Tous')
  const { handleAddToCart } = useCartOperations()
  const [produits, setProduits] = useState([])
  const [produitsPopulaires, setProduitsPopulaires] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const buildOrigin = () => {
    const base = import.meta.env.VITE_API_URL
    try { return new URL(base).origin } catch { return '' }
  }

  const fetchProducts = async () => {
    try {
      setLoading(true)
      setError(null)
      const filters = {}
      if (searchTerm) filters.search = searchTerm
      if (activeFilter === 'Fruits') filters.category = 'fruits'
      if (activeFilter === 'Légumes') filters.category = 'légumes'
      if (activeFilter === 'Produits Bio') filters.isOrganic = true
      const res = await apiService.getProducts({ page: 1, limit: 16, ...filters })
      const payload = res || {}
      const list = (payload.data && (payload.data.products || payload.data.docs)) || payload.products || (Array.isArray(payload) ? payload : [])
      setProduits(Array.isArray(list) ? list : [])
    } catch (e) {
      setError(e?.message || 'Erreur de chargement des produits')
      setProduits([])
    } finally {
      setLoading(false)
    }
  }

  const fetchPopular = async () => {
    try {
      const res = await apiService.getProducts({ page: 1, limit: 8, sort: '-rating.average' })
      const payload = res || {}
      const list = (payload.data && (payload.data.products || payload.data.docs)) || payload.products || (Array.isArray(payload) ? payload : [])
      setProduitsPopulaires(Array.isArray(list) ? list : [])
    } catch {
      setProduitsPopulaires([])
    }
  }

  useEffect(() => {
    fetchProducts()
    fetchPopular()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    fetchProducts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, activeFilter])

  const produitsFiltres = produits



  return (
    <div className="min-h-screen bg-gray-50">
      {/* ✅ Header global */}
        <Header onRegisterClick={onOpenRegister} onLoginClick={onOpenLogin} />
     {/* Hero Section */}
     <section
      className="relative h-96 flex items-center bg-cover bg-center bg-no-repeat"
      style={{
      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.15)), url('/src/assets/product.jpg')`
      }}
     >
     <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
      <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white">
        Découvrez nos produits frais
      </h1>
      <p className="text-2xl max-w-3xl mx-auto text-white">
        Des produits locaux, frais et de saison, directement du producteur à votre assiette.
      </p>
    </div>
    {/* Overlay semi-transparent */}
    <div className="absolute inset-0 bg-black opacity-30"></div>
    </section>

      {/* Barre de recherche et filtres */}
      <section className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Barre de recherche */}
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Rechercher un produit..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Filtres */}
            <div className="flex gap-2">
              {['Tous', 'Fruits', 'Légumes', 'Produits Bio'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeFilter === filter
                      ? 'bg-green-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Grille principale des produits */}
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading && (
              <div className="col-span-4 text-center text-gray-500">Chargement...</div>
            )}
            {error && !loading && (
              <div className="col-span-4 text-center text-red-600">{error}</div>
            )}
            {!loading && !error && produitsFiltres.length === 0 && (
              <div className="col-span-4 text-center text-gray-500">Aucun produit trouvé pour ces critères.</div>
            )}
            {!loading && !error && produitsFiltres.map((produit) => (
              <Link
                key={produit._id || produit.id}
                to={`/produit/${produit._id || produit.id}`}
                className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow group"
              >
                {/* Image du produit */}
                <div className="relative h-48 bg-gray-100 flex items-center justify-center group-hover:bg-gray-50 transition-colors overflow-hidden">
                  {(() => {
                    const origin = buildOrigin()
                    let src = produit.imageUrl || produit.image || ''
                    if (!src && Array.isArray(produit.images) && produit.images[0]) {
                      const raw = String(produit.images[0] ?? '')
                      const file = raw.split(/[\\\/]/).pop()
                      if (file) src = `${origin}/uploads/${file}`
                    }
                    if (src) return <img src={src} alt={produit.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    return <span className="text-6xl">🥬</span>
                  })()}
                  {produit.discount && (
                    <div className="absolute top-2 right-2 bg-yellow-400 text-white px-2 py-1 rounded text-sm font-semibold">
                      {produit.discount}
                    </div>
                  )}
                </div>
                
                {/* Informations du produit */}
                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-800 mb-1 group-hover:text-green-600 transition-colors">{produit.name}</h3>
                  <p className="text-gray-800 mb-1 font-semibold">{typeof produit.price === 'number' ? `${produit.price} CFA` : (produit.price || '-')} {produit.unit ? `/ ${produit.unit}` : ''}</p>
                  <p className="text-gray-500 text-sm mb-4">Par : {produit.seller || produit.producerName || (produit.producer && [produit.producer.firstName, produit.producer.lastName].filter(Boolean).join(' ')) || '—'}</p>
                
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                      navigate(`/produit/${produit._id || produit.id}`);
                  }}
                  className="w-full bg-gray-100 hover:bg-green-100 text-green-600 font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Voir le détail
                </button>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Section "Les plus populaires" */}
      <section className="py-12 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-green-600">Les plus populaires</h2>
                <div className="flex gap-2">
                  <button className="w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button className="w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {produitsPopulaires.map((produit) => (
                  <Link
                    key={produit._id || produit.id}
                    to={`/produit/${produit._id || produit.id}`}
                    className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow group"
                  >
                    {/* Image du produit */}
                    <div className="relative h-48 bg-gray-100 flex items-center justify-center group-hover:bg-gray-50 transition-colors overflow-hidden">
                      {(() => {
                        const origin = buildOrigin()
                        let src = produit.imageUrl || produit.image || ''
                        if (!src && Array.isArray(produit.images) && produit.images[0]) {
                          const raw = String(produit.images[0] ?? '')
                          const file = raw.split(/[\\\/]/).pop()
                          if (file) src = `${origin}/uploads/${file}`
                        }
                        if (src) return <img src={src} alt={produit.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        return <span className="text-6xl">🥬</span>
                      })()}
                      {/* Badge de réduction */}
                      {produit.discount && (
                        <div className="absolute top-2 right-2 bg-yellow-400 text-white px-2 py-1 rounded text-sm font-semibold">
                          {produit.discount}
                        </div>
                      )}
                    </div>
                    
                    {/* Informations du produit */}
                    <div className="p-4">
                      <h3 className="text-lg font-bold text-gray-800 mb-1 group-hover:text-green-600 transition-colors">{produit.name}</h3>
                      <p className="text-gray-800 mb-1 font-semibold">{typeof produit.price === 'number' ? `${produit.price} CFA` : (produit.price || '-')} {produit.unit ? `/ ${produit.unit}` : ''}</p>
                      <p className="text-gray-500 text-sm mb-4">Par : {produit.seller || produit.producerName || (produit.producer && [produit.producer.firstName, produit.producer.lastName].filter(Boolean).join(' ')) || '—'}</p>
                    
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                          navigate(`/produit/${produit._id || produit.id}`);
                      }}
                      className="w-full bg-gray-100 hover:bg-green-100 text-green-600 font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      Voir le détail
                    </button>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>

      {/* ✅ Footer global */}
      <Footer />
    </div>
  )
}

export default Produits