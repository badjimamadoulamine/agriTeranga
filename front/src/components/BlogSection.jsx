const BlogSection = () => {
  const articles = [
    {
      id: 1,
      title: 'Les bienfaits des légumes frais pour la santé des femmes',
      category: 'NUTRITION',
      author: 'ADMIN',
      date: '15 Sep 2023',
      excerpt: 'Découvrez comment les légumes frais peuvent améliorer votre santé au quotidien...',
      image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400'
    },
    {
      id: 2,
      title: 'Comment choisir des produits de saison au Sénégal',
      category: 'CONSEILS',
      author: 'ADMIN',
      date: '12 Sep 2023',
      excerpt: 'Un guide complet pour acheter les meilleurs produits selon les saisons...',
      image: 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=400'
    },
    {
      id: 3,
      title: 'Recettes traditionnelles avec des ingrédients locaux',
      category: 'CUISINE',
      author: 'ADMIN',
      date: '10 Sep 2023',
      excerpt: 'Redécouvrez les saveurs authentiques de notre terroir à travers ces recettes...',
      image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400'
    },
    {
      id: 4,
      title: 'L\'agriculture urbaine, l\'avenir de nos villes',
      category: 'TENDANCES',
      author: 'ADMIN',
      date: '08 Sep 2023',
      excerpt: 'Comment l\'agriculture urbaine transforme nos espaces et notre alimentation...',
      image: 'https://images.unsplash.com/photo-1552862750-746b8f6f7f25?w=400'
    }
  ]

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-2">
        <h2 className="text-4xl md:text-5xl text-center font-script mb-12" style={{ color: '#2B6B44' }}>
          Derniers articles
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {articles.map((article) => (
            <div key={article.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow">
              <img 
                src={article.image} 
                alt={article.title} 
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <p className="text-xs text-gray-400 mb-3">
                  {article.category} . {article.author} . {article.date}
                </p>
                <h3 className="font-bold text-gray-800 text-lg mb-3 line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {article.excerpt}
                </p>
                <a href="#" className="text-sm text-gray-500 hover:text-green-600 transition-colors">
                  Continuer la lecture →
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default BlogSection