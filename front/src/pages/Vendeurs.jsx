import { Link } from 'react-router-dom'
import Header from '../components/Header';
import Footer from '../components/Footer';

const Vendeurs = ({ onOpenRegister, onOpenLogin }) => {
  // Données simulées pour les vendeurs
  const vendeurs = [
    {
      id: 1,
      nom: "Mamadou Diallo",
      specialite: "Produits maraîchers",
      localisation: "Dakar, Plateau",
      experience: "15 ans",
      photo: "/src/assets/vend1.jpg",
      description: "Spécialiste en légumes frais et biologiques",
      telephone: "77 123 45 67",
      email: "mamadou.diallo@agriteranga.com"
    },
    {
      id: 2,
      nom: "Aissatou Kane",
      specialite: "Fruits tropicaux",
      localisation: "Thiès, Sénégal",
      experience: "12 ans",
      photo: "/src/assets/vend2.png",
      description: "Productrice de mangues, bananes et fruits de saison",
      telephone: "77 234 56 78",
      email: "aissatou.kane@agriteranga.com"
    },
    {
      id: 3,
      nom: "Ibrahima Fall",
      specialite: "Céréales et grains",
      localisation: "Kaolack, Sénégal",
      experience: "20 ans",
      photo: "/src/assets/vend3.jpg",
      description: "Expert en riz, mil, sorgho et maïs de qualité",
      telephone: "77 345 67 89",
      email: "ibrahima.fall@agriteranga.com"
    },
    {
      id: 4,
      nom: "Fatou Sow",
      specialite: "Fruits secs et noix",
      localisation: "Saint-Louis, Sénégal",
      experience: "8 ans",
      photo: "/src/assets/vend4.jpg",
      description: "Riches en énergie et parfaits pour une alimentation saine",
      telephone: "77 456 78 90",
      email: "fatou.sow@agriteranga.com"
    },
    {
      id: 5,
      nom: "Ousmane Ndiaye",
      specialite: "Herbes médicinales",
      localisation: "Diourbel, Sénégal",
      experience: "18 ans",
      photo: "/src/assets/vend5.png",
      description: "Pratiques et savoureux, pour une cuisine saine et pleine de goût",
      telephone: "77 567 89 01",
      email: "ousmane.ndiaye@agriteranga.com"
    },
    {
      id: 6,
      nom: " Aminata Traoré",
      specialite: "Épices et aromates",
      localisation: "Ziguinchor, Sénégal",
      experience: "10 ans",
      photo: "/src/assets/vend6.jpg",
      description: "Spécialiste en épices locales et aromates biologiques",
      telephone: "77 678 90 12",
      email: "aminata.traore@agriteranga.com"
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
        <Header onRegisterClick={onOpenRegister} onLoginClick={onOpenLogin} />
      {/* Hero Section */}
        <section 
          className="relative py-28 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('/src/assets/vendeur.png')`
        }}
        >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Nos Vendeurs
          </h1>
          <p className="text-lg md:text-xl max-w-4xl mx-auto leading-relaxed text-white">
            Découvrez notre communauté de producteurs passionnés qui apportent 
            les meilleurs produits agricoles du Sénégal jusqu'à votre table.
          </p>
        </div>
        {/* Optional overlay */}
        <div className="absolute inset-0 bg-black opacity-30"></div>
        </section>  
    
      {/* Stats Section */}
      <div className="bg-white py-12 -mt-8 relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-green-50 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-green-800">150+</div>
              <div className="text-green-600">Vendeurs certifiés</div>
            </div>
            <div className="bg-green-50 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-green-800">500+</div>
              <div className="text-green-600">Produits disponibles</div>
            </div>
            <div className="bg-green-50 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-green-800">14</div>
              <div className="text-green-600">Régions couvertes</div>
            </div>
            <div className="bg-green-50 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-green-800">98%</div>
              <div className="text-green-600">Satisfaction client</div>
            </div>
          </div>
        </div>
      </div>

      {/* Vendeurs Grid */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Notre Équipe de Vendeurs
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Chaque vendeur est soigneusement sélectionné pour garantir la qualité 
            et l'authenticité de ses produits.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {vendeurs.map((vendeur) => (
            <div key={vendeur.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              {/* Photo du vendeur */}
              <div className="h-64 bg-gray-200 relative overflow-hidden">
                <img 
                  src={vendeur.photo} 
                  alt={vendeur.nom}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {vendeur.experience}
                </div>
              </div>

              {/* Contenu de la carte */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {vendeur.nom}
                </h3>
                
                <div className="flex items-center mb-3">
                  <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                  </svg>
                  <span className="text-green-600 font-semibold">{vendeur.specialite}</span>
                </div>

                <div className="flex items-center mb-3">
                  <svg className="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-gray-600">{vendeur.localisation}</span>
                </div>

                <p className="text-gray-600 mb-4 leading-relaxed">
                  {vendeur.description}
                </p>

                {/* Informations de contact */}
                <div className="border-t pt-4 space-y-2">
                  <div className="flex items-center text-sm text-gray-500">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {vendeur.telephone}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {vendeur.email}
                  </div>
                </div>

                {/* Bouton de contact */}
                <button className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200">
                  Contacter le vendeur
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-green-600 rounded-lg text-white py-16 m-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Vous êtes producteur et souhaitez nous rejoindre ?
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Rejoignez notre communauté de vendeurs et accédez à une clientèle fidèle 
            tout en développant votre activité agricole.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={onOpenRegister}
              className="bg-white text-green-800 hover:bg-green-50 font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
            >
              Devenir vendeur
            </button>
            <Link 
              to="/contact"
              className="border border-white text-white hover:bg-white hover:text-green-800 font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
            >
              En savoir plus
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Vendeurs