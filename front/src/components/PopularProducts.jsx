import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import apiService from '../services/apiService'
import { getProductImageUrl } from '../utils/imageUtils'

const PopularProducts = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true
    const load = async () => {
      try {
        setLoading(true)
        setError(null)
        // Charger des produits populaires/récents (ex: tri décroissant)
        const res = await apiService.getProducts({ page: 1, limit: 8, sort: '-createdAt' })
        const payload = res || {}
        const list = (payload.data && (payload.data.products || payload.data.docs))
          || payload.products
          || (Array.isArray(payload) ? payload : [])
        if (mounted) setProducts(Array.isArray(list) ? list : [])
      } catch (e) {
        if (mounted) {
          setError(e?.message || 'Erreur lors du chargement des produits')
          setProducts([])
        }
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
            Nos produits populaires
          </h2>
          <p className="text-green-600 text-lg">
            Découvrez les produits les plus demandés par nos acheteurs.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading && (
            <div className="col-span-4 text-center text-gray-500">Chargement...</div>
          )}
          {error && !loading && (
            <div className="col-span-4 text-center text-red-600">{error}</div>
          )}
          {!loading && !error && products.length === 0 && (
            <div className="col-span-4 text-center text-gray-500">Aucun produit disponible.</div>
          )}
          {!loading && !error && products.map((product) => (
            <Link
              key={product._id || product.id}
              to={`/produit/${product._id || product.id}`}
              className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden border border-gray-100 group block"
            >
              <div className="relative">
                {getProductImageUrl(product) ? (
                  <img 
                    src={getProductImageUrl(product)} 
                    alt={product.name} 
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                    <span className="text-6xl">🌾</span>
                  </div>
                )}
                {product.discount && (
                  <span className="absolute top-2 right-2 bg-yellow-400 text-white text-xs font-bold px-3 py-1 rounded-full">
                    {product.discount}
                  </span>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-800 text-lg mb-2 group-hover:text-green-600 transition-colors">
                  {product.name}
                </h3>
                <p className="font-bold text-gray-800 mb-1">
                  {typeof product.price === 'number' ? `${product.price} CFA` : (product.price || '-')}
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  Par : {product.seller 
                    || product.producerName 
                    || (product.producer && [product.producer.firstName, product.producer.lastName].filter(Boolean).join(' ')) 
                    || '—'}
                </p>
                <button className="w-full bg-gray-100 hover:bg-green-100 text-gray-700 hover:text-green-600 font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2">
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
  )
}

export default PopularProducts