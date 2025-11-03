import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useCartOperations } from '../hooks/useCartOperations';
import apiService from '../services/apiService';

const ProductDetail = ({ onOpenRegister, onOpenLogin }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { handleAddToCart } = useCartOperations();

  // Données du produit depuis l'API
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const resp = await apiService.getProductDetails(id);
        const payload = resp || {};
        const p = (payload.data && (payload.data.product || payload.data)) || payload.product || payload;
        if (mounted) setProduct(p || null);
      } catch (e) {
        if (mounted) {
          setError(e?.message || 'Erreur de chargement du produit');
          setProduct(null);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [id]);

  // Produits similaires (extraits des données existantes)
  const produitsSimilaires = [
    { id: 2, nom: 'Tomate Grappe Bio', prix: '2.000', unite: 'kg', image: '🍅' },
    { id: 7, nom: 'Banane', prix: '1.000', unite: 'kg', image: '🍌' },
    { id: 6, nom: 'Carotte', prix: '700', unite: 'kg', image: '🥕' },
    { id: 5, nom: 'Poivron', prix: '1.200', unite: 'kg', image: '🫑' }
  ];

  // Helpers d'affichage
  const imgSrc = (() => {
    if (!product) return '';
    const base = import.meta.env.VITE_API_URL;
    let origin = '';
    try { origin = new URL(base).origin; } catch { origin = ''; }
    if (product.imageUrl) return product.imageUrl;
    if (product.image) return product.image;
    if (Array.isArray(product.images) && product.images[0]) {
      const raw = String(product.images[0] ?? '');
      const file = raw.split(/[\\\/]/).pop();
      if (file) return `${origin}/uploads/${file}`;
    }
    return '';
  })();

  const producerName = product && (product.seller
    || product.producerName
    || (product.producer && [product.producer.firstName, product.producer.lastName].filter(Boolean).join(' '))
  );

  const handleAddToCartClick = () => {
    if (!product) return;
    const cartProduct = {
      id: product._id || product.id,
      nom: product.name,
      prix: product.price,
      unite: product.unit,
      image: Array.isArray(product.images) && product.images[0] ? product.images[0] : product.imageUrl || product.image
    };
    handleAddToCart(cartProduct);
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
            <defs>
              <linearGradient id="half-fill" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="50%" stopColor="currentColor" />
                <stop offset="50%" stopColor="transparent" />
              </linearGradient>
            </defs>
            <path fill="url(#half-fill)" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        );
      } else {
        stars.push(
          <svg key={i} className="w-5 h-5 text-gray-300 fill-current" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        );
      }
    }
    return stars;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* ✅ Header global */}
      <Header onRegisterClick={onOpenRegister} onLoginClick={onOpenLogin} />
      
      {/* Section principale du produit */}
      <section className="bg-white py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            
            {/* Image du produit - Colonne gauche */}
            <div className="order-1">
              <div className="relative">
                <div className="bg-gray-50 rounded-lg overflow-hidden shadow-lg">
                  {loading ? (
                    <div className="w-full h-96 flex items-center justify-center text-gray-500">Chargement...</div>
                  ) : error ? (
                    <div className="w-full h-96 flex items-center justify-center text-red-600">{error}</div>
                  ) : imgSrc ? (
                    <img
                      src={imgSrc}
                      alt={product?.name || ''}
                      className="w-full h-96 object-cover"
                    />
                  ) : (
                    <div className="w-full h-96 flex items-center justify-center bg-gray-100">
                      <span className="text-4xl text-gray-400">—</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Détails du produit - Colonne droite */}
            <div className="order-2 lg:pl-8">
              <div className="space-y-6">
                {/* Nom du produit */}
                <h1 className="text-4xl font-bold text-gray-800">{product?.name || (loading ? '...' : '—')}</h1>
                
                {/* Prix */}
                <p className="text-2xl font-semibold text-gray-800">
                  {product ? (
                    <>
                      {typeof product.price === 'number' ? `${product.price} CFA` : (product.price || '-')}
                      {product.unit ? ` / ${product.unit}` : ''}
                    </>
                  ) : '—'}
                </p>
                
                {/* Description */}
                <p className="text-gray-600 leading-relaxed">
                  {product?.description || (loading ? '...' : '—')}
                </p>
                
                {/* Vendeur */}
                <div className="flex items-center space-x-2">
                  <span className="text-gray-600">Vendu par:</span>
                  <span className="font-semibold text-gray-800">{producerName || (loading ? '...' : '—')}</span>
                </div>
                
                {/* Évaluation */}
                <div className="flex items-center space-x-2">
                  <div className="flex items-center">
                    {renderStars(product?.rating?.average || 0)}
                  </div>
                  <span className="text-gray-600">({product?.rating?.average || 0}/5)</span>
                </div>
                
                {/* Bouton Ajouter au panier */}
                <button
                  onClick={handleAddToCartClick}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-3 text-lg"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m1.6 8L5 21H3m4 0v1a1 1 0 011 1v1m0 0a1 1 0 001-1v-1m0 0a1 1 0 00-1 1v1m8-2a1 1 0 011 1v1m0 0a1 1 0 001 1v-1m0 0a1 1 0 00-1-1v-1" />
                  </svg>
                  <span>Ajouter au panier</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section informations sur le producteur */}
      <section className="bg-white py-12 border-t border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-3 mb-8">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <h2 className="text-2xl font-bold text-gray-800">Informations sur le producteur</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Nom */}
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Nom</h3>
                <p className="text-gray-600">{producerName || '—'}</p>
              </div>
            </div>
            
            {/* Type de culture */}
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Type de culture</h3>
                <p className="text-gray-600">{product?.producer?.producerInfo?.typeCulture || '—'}</p>
              </div>
            </div>
            
            {/* Certification */}
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Certification</h3>
                <p className="text-gray-600">{product?.producer?.producerInfo?.certification || '—'}</p>
              </div>
            </div>
            
            {/* Localisation */}
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Localisation</h3>
                <p className="text-gray-600">{product?.producer?.producerInfo?.localisation || '—'}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section produits similaires */}
      <section className="bg-white py-12 border-t border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-8">Produits similaires</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {produitsSimilaires.map((produitSimilaire) => (
              <Link
                key={produitSimilaire.id}
                to={`/produit/${produitSimilaire.id}`}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Image du produit */}
                <div className="relative h-48 bg-gray-100 flex items-center justify-center">
                  <span className="text-6xl">{produitSimilaire.image}</span>
                </div>
                
                {/* Informations du produit */}
                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-800 mb-1">{produitSimilaire.nom}</h3>
                  <p className="text-gray-800 font-semibold">{produitSimilaire.prix} CFA / {produitSimilaire.unite}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ✅ Footer global */}
      <Footer />
    </div>
  );
};

export default ProductDetail;