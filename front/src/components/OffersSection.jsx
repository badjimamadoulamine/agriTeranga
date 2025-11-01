const OffersSection = () => {
  const offers = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
      title: 'Salade fraîche'
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400',
      title: 'Plat végétarien'
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=400',
      title: 'Cuisine healthy'
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1576506295286-5cda18df43e7?w=400',
      title: 'Épices et saveurs'
    }
  ]

  return (
    <section className="py-12 md:py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 md:mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Produits en offre
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Découvrez nos offres spéciales de la semaine
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {offers.map(offer => (
            <div key={offer.id} className="relative group overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all">
              <div className="aspect-square overflow-hidden">
                <img 
                  src={offer.image} 
                  alt={offer.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-4">
                <h3 className="text-white font-bold text-lg md:text-xl">
                  {offer.title}
                </h3>
              </div>
              <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                -20%
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default OffersSection
