import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useCartOperations } from '../hooks/useCartOperations'

const Produits = ({ onOpenRegister, onOpenLogin }) => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [activeFilter, setActiveFilter] = useState('Tous')
  const { handleAddToCart } = useCartOperations()

  // Données des produits principaux
  const produits = [
    {
      id: 1,
      nom: 'Mangue',
      prix: '1.500',
      unite: 'kg',
      image: '🥭',
      categorie: 'fruits',
      vendeur: 'Moussa BA',
      reduction: false
    },
    {
      id: 2,
      nom: 'Tomate Grappe Bio',
      prix: '2.000',
      unite: 'kg',
      image: '🍅',
      categorie: 'légumes',
      bio: true,
      vendeur: 'Aïda TRAORE',
      reduction: true
    },
    {
      id: 3,
      nom: 'Pomme de terre',
      prix: '800',
      unite: 'kg',
      image: '🥔',
      categorie: 'légumes',
      vendeur: 'Ousmane DIALLO',
      reduction: false
    },
    {
      id: 4,
      nom: 'Oignon',
      prix: '600',
      unite: 'kg',
      image: '🧅',
      categorie: 'légumes',
      vendeur: 'Fatou SOW',
      reduction: true
    },
    {
      id: 5,
      nom: 'Poivron',
      prix: '1.200',
      unite: 'kg',
      image: '🫑',
      categorie: 'légumes',
      vendeur: 'Ibrahima BALDE',
      reduction: false
    },
    {
      id: 6,
      nom: 'Carotte',
      prix: '700',
      unite: 'kg',
      image: '🥕',
      categorie: 'légumes',
      vendeur: 'Mariam CISSE',
      reduction: true
    },
    {
      id: 7,
      nom: 'Banane',
      prix: '1.000',
      unite: 'kg',
      image: '🍌',
      categorie: 'fruits',
      vendeur: 'Abdou WANE',
      reduction: false
    },
    {
      id: 8,
      nom: 'Aubergine',
      prix: '900',
      unite: 'kg',
      image: '🍆',
      categorie: 'légumes',
      vendeur: 'Khadija MBAYE',
      reduction: false
    }
  ]

  // Données des produits populaires
  const produitsPopulaires = [
    {
      id: 9,
      nom: 'Patate douce',
      prix: '1.100',
      unite: 'kg',
      image: '🍠',
      categorie: 'légumes',
      vendeur: 'Alassane NDIAYE',
      reduction: false
    },
    {
      id: 10,
      nom: 'Gombo',
      prix: '1.300',
      unite: 'kg',
      image: '🌿',
      categorie: 'légumes',
      vendeur: 'Aminata GUEYE',
      reduction: true
    },
    {
      id: 11,
      nom: 'Pastèque',
      prix: '2.500',
      unite: 'Unité',
      image: '🍉',
      categorie: 'fruits',
      vendeur: 'Modou DIALLO',
      reduction: false
    },
    {
      id: 12,
      nom: 'Manioc',
      prix: '500',
      unite: 'kg',
      image: '🌱',
      categorie: 'légumes',
      vendeur: 'Mame NGUEYE',
      reduction: false
    }
  ]

  // Filtrage des produits
  const produitsFiltres = produits.filter(produit => {
    const correspondRecherche = produit.nom.toLowerCase().includes(searchTerm.toLowerCase())
    const correspondCategorie = activeFilter === 'Tous' || 
                              (activeFilter === 'Fruits' && produit.categorie === 'fruits') ||
                              (activeFilter === 'Légumes' && produit.categorie === 'légumes') ||
                              (activeFilter === 'Produits Bio' && produit.bio)
    return correspondRecherche && correspondCategorie
  })



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
            {produitsFiltres.map((produit) => (
              <Link
                key={produit.id}
                to={`/produit/${produit.id}`}
                className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow group"
              >
                {/* Image du produit */}
                <div className="relative h-48 bg-gray-100 flex items-center justify-center group-hover:bg-gray-50 transition-colors">
                  <span className="text-6xl">{produit.image}</span>
                  {/* Badge de réduction */}
                  {produit.reduction && (
                    <div className="absolute top-2 right-2 bg-yellow-400 text-white px-2 py-1 rounded text-sm font-semibold">
                      10% off
                    </div>
                  )}
                </div>
                
                {/* Informations du produit */}
                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-800 mb-1 group-hover:text-green-600 transition-colors">{produit.nom}</h3>
                  <p className="text-gray-800 mb-1 font-semibold">{produit.prix} CFA / {produit.unite}</p>
                  <p className="text-gray-500 text-sm mb-4">Par : {produit.vendeur}</p>
                  
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      navigate(`/produit/${produit.id}`);
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

          {produitsFiltres.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Aucun produit trouvé pour ces critères.</p>
            </div>
          )}
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
                key={produit.id}
                to={`/produit/${produit.id}`}
                className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow group"
              >
                {/* Image du produit */}
                <div className="relative h-48 bg-gray-100 flex items-center justify-center group-hover:bg-gray-50 transition-colors">
                  <span className="text-6xl">{produit.image}</span>
                  {/* Badge de réduction */}
                  {produit.reduction && (
                    <div className="absolute top-2 right-2 bg-yellow-400 text-white px-2 py-1 rounded text-sm font-semibold">
                      10% off
                    </div>
                  )}
                </div>
                
                {/* Informations du produit */}
                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-800 mb-1 group-hover:text-green-600 transition-colors">{produit.nom}</h3>
                  <p className="text-gray-800 mb-1 font-semibold">{produit.prix} CFA / {produit.unite}</p>
                  <p className="text-gray-500 text-sm mb-4">Par : {produit.vendeur}</p>
                  
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      navigate(`/produit/${produit.id}`);
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