import { Link } from 'react-router-dom'

const PopularProducts = () => {
  const products = [
    {
      id: 9,
      name: 'Patate douce',
      price: '1.100 CFA / kg',
      seller: 'Alassane NDIAYE',
      image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400',
      discount: '5% off'
    },
    {
      id: 10,
      name: 'Gombo',
      price: '1.300 CFA / kg',
      seller: 'Aminata GUEYE',
      image: 'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?w=400',
      discount: '10% off'
    },
    {
      id: 11,
      name: 'Pastèque',
      price: '2.500 CFA / Unité',
      seller: 'Modou DIALLO',
      image: 'https://images.unsplash.com/photo-1561132180-4b2b4fc7865b?w=400',
      discount: '5% off'
    },
    {
      id: 12,
      name: 'Manioc',
      price: '500 CFA / kg',
      seller: 'Mame NGUEYE',
      image: 'https://images.unsplash.com/photo-1588611754815-c9c5cb20c1fd?w=400',
      discount: '8% off'
    },
    {
      id: 1,
      name: 'Mangue',
      price: '1.500 CFA / kg',
      seller: 'Moussa BA',
      image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=400',
      discount: '5% off'
    },
    {
      id: 2,
      name: 'Tomate Grappe Bio',
      price: '2.000 CFA / kg',
      seller: 'Aïda TRAORE',
      image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400',
      discount: '15% off'
    },
    {
      id: 6,
      name: 'Carotte',
      price: '700 CFA / kg',
      seller: 'Mariam CISSE',
      image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400',
      discount: '8% off'
    },
    {
      id: 5,
      name: 'Poivron',
      price: '1.200 CFA / kg',
      seller: 'Ibrahima BALDE',
      image: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400',
      discount: '10% off'
    }
  ]

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
          {products.map((product) => (
            <Link
              key={product.id}
              to={`/produit/${product.id}`}
              className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden border border-gray-100 group block"
            >
              <div className="relative">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-2 right-2 bg-yellow-400 text-white text-xs font-bold px-3 py-1 rounded-full">
                  {product.discount}
                </span>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-800 text-lg mb-2 group-hover:text-green-600 transition-colors">
                  {product.name}
                </h3>
                <p className="font-bold text-gray-800 mb-1">
                  {product.price}
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  Par : {product.seller}
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